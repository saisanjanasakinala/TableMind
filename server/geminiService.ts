import { GoogleGenAI, Type } from '@google/genai';
import { Restaurant, RestaurantTable, Reservation, SmartAllocationResult, WaitTimePrediction } from '../src/types';

// Initialize Gemini client strictly using @google/genai SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Time utility: parse HH:MM to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Check if two time ranges overlap (default 90 min duration)
export function isTimeOverlapping(time1: string, duration1: number, time2: string, duration2: number): boolean {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + duration1;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + duration2;

  return Math.max(start1, start2) < Math.min(end1, end2);
}

// Check table availability on given date & time
export function isTableAvailable(
  table: RestaurantTable,
  date: string,
  time: string,
  reservations: Reservation[],
  durationMinutes = 90
): boolean {
  if (!table.isActive) return false;

  const conflicting = reservations.filter(
    (res) =>
      res.tableId === table.id &&
      res.date === date &&
      res.status !== 'cancelled' &&
      isTimeOverlapping(res.time, res.durationMinutes || 90, time, durationMinutes)
  );

  return conflicting.length === 0;
}

// Smart table allocation algorithm
export function smartAllocateTable(
  tables: RestaurantTable[],
  reservations: Reservation[],
  date: string,
  time: string,
  guestCount: number,
  seatingPreference?: string
): SmartAllocationResult | null {
  // Find all active tables with enough capacity
  const eligibleTables = tables.filter(
    (t) => t.isActive && t.capacity >= guestCount && (t.minCapacity ? guestCount >= t.minCapacity : true)
  );

  // Check availability
  const availableTables = eligibleTables.filter((t) =>
    isTableAvailable(t, date, time, reservations)
  );

  if (availableTables.length === 0) {
    return null;
  }

  // Score tables to avoid wasting large tables and reward seating preference
  const scored = availableTables.map((table) => {
    let score = 100;

    // Waste penalty: capacity overage
    const excessCapacity = table.capacity - guestCount;
    // Strong penalty for wasting 4+ seats
    score -= excessCapacity * 18;

    // Seating preference bonus
    if (seatingPreference && table.seatingType.toLowerCase() === seatingPreference.toLowerCase()) {
      score += 25;
    }

    // Window or booth bonus for romantic/small party (<=2 or <=4)
    if (guestCount <= 2 && (table.seatingType === 'window' || table.seatingType === 'booth')) {
      score += 10;
    }

    const efficiencyRate = Math.min(100, Math.round((guestCount / table.capacity) * 100));

    return {
      table,
      score,
      excessCapacity,
      efficiencyRate,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 4).map((s) => s.table);

  let matchType: 'exact' | 'good' | 'upgrade' = 'good';
  if (best.table.capacity === guestCount) matchType = 'exact';
  else if (best.excessCapacity >= 2) matchType = 'upgrade';

  const reason =
    best.table.capacity === guestCount
      ? `Optimal fit: Perfect ${best.table.capacity}-guest ${best.table.seatingType} table (${best.table.tableNumber}) with zero wasted capacity.`
      : `High-efficiency recommendation: Table ${best.table.tableNumber} comfortably seats ${guestCount} (max ${best.table.capacity}) while reserving larger dining areas for large parties.`;

  return {
    recommendedTable: best.table,
    score: best.score,
    reason,
    capacityMatch: matchType,
    efficiencyRate: best.efficiencyRate,
    alternativeTables: alternatives,
  };
}

// Calculate predicted wait time when tables are currently busy
export function calculateWaitTime(
  tables: RestaurantTable[],
  reservations: Reservation[],
  date: string,
  time: string,
  guestCount: number
): WaitTimePrediction {
  const reqMinutes = timeToMinutes(time);

  // Eligible tables for party
  const eligible = tables.filter((t) => t.isActive && t.capacity >= guestCount);

  // Active reservations overlapping around requested time
  const currentReservations = reservations
    .filter(
      (r) =>
        r.date === date &&
        r.status !== 'cancelled' &&
        eligible.some((t) => t.id === r.tableId) &&
        isTimeOverlapping(r.time, r.durationMinutes || 90, time, 90)
    )
    .sort((a, b) => {
      const endA = timeToMinutes(a.time) + (a.durationMinutes || 90);
      const endB = timeToMinutes(b.time) + (b.durationMinutes || 90);
      return endA - endB;
    });

  if (currentReservations.length === 0) {
    return {
      estimatedWaitMinutes: 0,
      reasoning: 'Tables are currently open and immediately available for your party size.',
      tablesFreeingSoon: [],
      alternativeTimes: [time],
    };
  }

  // Earliest table expected to be vacated
  const earliest = currentReservations[0];
  const earliestEnd = timeToMinutes(earliest.time) + (earliest.durationMinutes || 90);
  const waitMinutes = Math.max(15, earliestEnd - reqMinutes);

  const freeingSoon = currentReservations.slice(0, 3).map((r) => {
    const endMin = timeToMinutes(r.time) + (r.durationMinutes || 90);
    const h = Math.floor(endMin / 60);
    const m = endMin % 60;
    const timeFormatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return {
      tableNumber: r.tableNumber,
      freedAt: timeFormatted,
      capacity: r.guestCount,
    };
  });

  // Calculate alternative time slots (30 min increments before or after)
  const alternativeTimes: string[] = [];
  const testOffsets = [-60, -30, 30, 60, 90];
  for (const offset of testOffsets) {
    const candidateMin = reqMinutes + offset;
    if (candidateMin >= 17 * 60 && candidateMin <= 22 * 60) {
      const candH = Math.floor(candidateMin / 60);
      const candM = candidateMin % 60;
      const candTime = `${String(candH).padStart(2, '0')}:${String(candM).padStart(2, '0')}`;
      
      const hasAvailable = eligible.some((t) => isTableAvailable(t, date, candTime, reservations));
      if (hasAvailable && !alternativeTimes.includes(candTime)) {
        alternativeTimes.push(candTime);
      }
    }
  }

  return {
    estimatedWaitMinutes: Math.min(90, waitMinutes),
    reasoning: `All ${guestCount}-person capacity tables are occupied at ${time}. The earliest table (${earliest.tableNumber}) is expected to clear at ${freeingSoon[0]?.freedAt || 'shortly'}.`,
    tablesFreeingSoon: freeingSoon,
    alternativeTimes: alternativeTimes.slice(0, 4),
  };
}

// AI Reservation Chatbot Handler
export async function processAIAssistantMessage(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  restaurants: Restaurant[],
  tables: RestaurantTable[],
  reservations: Reservation[]
) {
  // If no API key is available, use heuristic extraction
  if (!ai) {
    return fallbackAIAssistant(userMessage, restaurants, tables, reservations);
  }

  try {
    const restaurantsSummary = restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      city: r.city,
      neighborhood: r.neighborhood,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      openingHours: r.openingHours,
    }));

    const systemInstruction = `You are "TableMind AI Assistant", an elite location-aware restaurant reservation concierge.
Your mission is to help guests find and book the perfect restaurant table in conversational natural language.

CURRENT RESTAURANTS IN DATABASE (with geographical locations):
${JSON.stringify(restaurantsSummary, null, 2)}

CORE RULES:
1. Extract booking intent: restaurant, location (e.g. Hyderabad, Surampalem, Kakinada, San Francisco, etc.), date (YYYY-MM-DD), time (HH:MM), guest count (number), seating preference (indoor, patio, booth, window, bar, private).
2. If the user specifies a location (e.g., "near Surampalem" or "near Hyderabad"), ONLY select and recommend restaurants strictly belonging to that requested location. Never recommend Surampalem restaurants for Hyderabad queries, and never recommend Hyderabad restaurants for Surampalem queries.
3. If "tomorrow" or "today" is mentioned, calculate relative to current date (local timezone).
4. If party size or time is omitted, politely assume standard defaults (e.g. 2 guests, 19:00) while confirming.
5. In "replyText", mention the location and why the recommended restaurant/table is ideal.
6. Output valid JSON adhering strictly to the responseSchema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...history.map((h) => ({
          role: h.role,
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: 'Friendly, hospitable response to the customer highlighting location and availability',
            },
            extractedBooking: {
              type: Type.OBJECT,
              properties: {
                restaurantId: { type: Type.STRING },
                restaurantName: { type: Type.STRING },
                location: { type: Type.STRING, description: 'Location, city, area or landmark extracted from query (e.g. Surampalem, Hyderabad)' },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                guestCount: { type: Type.INTEGER },
                seatingPreference: { type: Type.STRING },
              },
            },
            intent: {
              type: Type.STRING,
              enum: ['booking_request', 'modify_request', 'query_info', 'greeting', 'other'],
            },
          },
          required: ['replyText', 'intent'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const booking = parsed.extractedBooking;

    const targetDate = booking?.date || new Date().toISOString().split('T')[0];
    const targetTime = booking?.time || '19:00';
    const guests = Number(booking?.guestCount) || 2;
    const seating = booking?.seatingPreference as any;
    const reqLocation = (booking?.location || '').toLowerCase();

    // Find candidate restaurants matching restaurantId OR location
    let candidateRestaurants: Restaurant[] = [];
    if (booking?.restaurantId) {
      const match = restaurants.find((r) => r.id === booking.restaurantId);
      if (match) candidateRestaurants.push(match);
    }

    if (reqLocation) {
      let locMatches: Restaurant[] = [];
      if (
        reqLocation.includes('hyderabad') ||
        reqLocation.includes('hitec') ||
        reqLocation.includes('banjara') ||
        reqLocation.includes('jubilee') ||
        reqLocation.includes('gandipet')
      ) {
        locMatches = restaurants.filter((r) => r.city.toLowerCase() === 'hyderabad');
      } else if (
        reqLocation.includes('surampalem') ||
        reqLocation.includes('aditya') ||
        reqLocation.includes('adb')
      ) {
        locMatches = restaurants.filter(
          (r) => r.city.toLowerCase() === 'surampalem' || r.city.toLowerCase() === 'kakinada'
        );
      } else if (reqLocation.includes('kakinada')) {
        locMatches = restaurants.filter(
          (r) => r.city.toLowerCase() === 'kakinada' || r.city.toLowerCase() === 'surampalem'
        );
      } else if (reqLocation.includes('san francisco') || reqLocation.includes('sf')) {
        locMatches = restaurants.filter((r) => r.city.toLowerCase() === 'san francisco');
      } else {
        locMatches = restaurants.filter(
          (r) =>
            r.city.toLowerCase().includes(reqLocation) ||
            r.area.toLowerCase().includes(reqLocation) ||
            r.address.toLowerCase().includes(reqLocation) ||
            r.neighborhood.toLowerCase().includes(reqLocation) ||
            r.name.toLowerCase().includes(reqLocation)
        );
      }

      for (const lm of locMatches) {
        if (!candidateRestaurants.some((cr) => cr.id === lm.id)) {
          candidateRestaurants.push(lm);
        }
      }
    }

    if (candidateRestaurants.length === 0) {
      if (!reqLocation) {
        candidateRestaurants = restaurants.slice(0, 3);
      }
    }

    // Build nearby restaurant recommendations with available tables
    const nearbyRestaurants: any[] = [];
    let bestAllocation: any = null;
    let bestRestaurant: Restaurant | null = null;

    for (const rest of candidateRestaurants) {
      const restTables = tables.filter((t) => t.restaurantId === rest.id && t.isActive);
      const eligible = restTables.filter((t) => t.capacity >= guests);
      const freeTables = eligible.filter((t) => isTableAvailable(t, targetDate, targetTime, reservations));

      const allocation = smartAllocateTable(restTables, reservations, targetDate, targetTime, guests, seating);
      if (!bestAllocation && allocation) {
        bestAllocation = allocation;
        bestRestaurant = rest;
      }

      nearbyRestaurants.push({
        restaurantId: rest.id,
        restaurantName: rest.name,
        cuisine: rest.cuisine,
        rating: rest.rating,
        priceRange: rest.priceRange,
        openingHours: `${rest.openingHours.open} - ${rest.openingHours.close}`,
        availableTableCount: freeTables.length,
        heroImage: rest.heroImage,
        address: `${rest.address}, ${rest.city}`,
        city: rest.city,
        sampleTable: allocation
          ? {
              tableNumber: allocation.recommendedTable.tableNumber,
              capacity: allocation.recommendedTable.capacity,
              seatingType: allocation.recommendedTable.seatingType,
            }
          : undefined,
      });
    }

    let actionableReservation = undefined;
    let alternativeSuggestions = undefined;
    let estimatedWaitMinutes = undefined;

    if (bestAllocation && bestRestaurant) {
      actionableReservation = {
        restaurantId: bestRestaurant.id,
        restaurantName: bestRestaurant.name,
        tableId: bestAllocation.recommendedTable.id,
        tableNumber: bestAllocation.recommendedTable.tableNumber,
        date: targetDate,
        time: targetTime,
        guestCount: guests,
        seatingType: bestAllocation.recommendedTable.seatingType,
        isAvailable: true,
        reasoning: bestAllocation.reason,
      };
    } else {
      // Primary restaurant busy, compute wait time
      const primaryRest = candidateRestaurants[0] || restaurants[0];
      const restTables = tables.filter((t) => t.restaurantId === primaryRest.id);
      const wait = calculateWaitTime(restTables, reservations, targetDate, targetTime, guests);
      estimatedWaitMinutes = wait.estimatedWaitMinutes;

      if (wait.alternativeTimes.length > 0) {
        const altTime = wait.alternativeTimes[0];
        const altAlloc = smartAllocateTable(restTables, reservations, targetDate, altTime, guests, seating);
        if (altAlloc) {
          alternativeSuggestions = [
            {
              time: altTime,
              tableNumber: altAlloc.recommendedTable.tableNumber,
              capacity: altAlloc.recommendedTable.capacity,
              seatingType: altAlloc.recommendedTable.seatingType,
            },
          ];
        }
      }
    }

    return {
      replyText:
        parsed.replyText ||
        (bestRestaurant
          ? `I found great tables for ${guests} guests near ${reqLocation || bestRestaurant.city} on ${targetDate} at ${targetTime}.`
          : 'I have checked our real-time table inventory for your requested criteria.'),
      actionableReservation,
      nearbyRestaurants: nearbyRestaurants.length > 0 ? nearbyRestaurants : undefined,
      alternativeSuggestions,
      estimatedWaitMinutes,
      extractedLocation: booking?.location,
    };
  } catch (err) {
    console.error('Gemini assistant error, falling back to local reasoning:', err);
    return fallbackAIAssistant(userMessage, restaurants, tables, reservations);
  }
}

// Fallback intelligent parser when offline or API call is skipped
function fallbackAIAssistant(
  userMessage: string,
  restaurants: Restaurant[],
  tables: RestaurantTable[],
  reservations: Reservation[]
) {
  const text = userMessage.toLowerCase();

  // 1. Extract location
  let location = '';
  if (
    text.includes('hyderabad') ||
    text.includes('hitec') ||
    text.includes('banjara') ||
    text.includes('jubilee') ||
    text.includes('gandipet') ||
    text.includes('madhapur')
  ) {
    location = 'Hyderabad';
  } else if (text.includes('surampalem') || text.includes('aditya') || text.includes('adb')) {
    location = 'Surampalem';
  } else if (text.includes('kakinada')) {
    location = 'Kakinada';
  } else if (text.includes('rajahmundry')) {
    location = 'Rajahmundry';
  } else if (text.includes('san francisco') || text.includes('downtown') || text.includes('sf')) {
    location = 'San Francisco';
  } else {
    // Regex matching "near [Location]" or "in [Location]"
    const locMatch = text.match(/(?:near|in|around|at)\s+([a-zA-Z\s]+?)(?:\s+for|\s+tomorrow|\s+tonight|\s+at\s+\d|\.|$)/i);
    if (locMatch && locMatch[1]) {
      location = locMatch[1].trim();
    }
  }

  // 2. Filter candidate restaurants strictly by location or query
  let matchedRestaurants: Restaurant[] = [];
  if (location) {
    const locLower = location.toLowerCase();
    if (locLower.includes('hyderabad')) {
      matchedRestaurants = restaurants.filter((r) => r.city.toLowerCase() === 'hyderabad');
    } else if (locLower.includes('surampalem')) {
      matchedRestaurants = restaurants.filter(
        (r) => r.city.toLowerCase() === 'surampalem' || r.city.toLowerCase() === 'kakinada'
      );
    } else if (locLower.includes('kakinada')) {
      matchedRestaurants = restaurants.filter(
        (r) => r.city.toLowerCase() === 'kakinada' || r.city.toLowerCase() === 'surampalem'
      );
    } else if (locLower.includes('san francisco') || locLower.includes('sf')) {
      matchedRestaurants = restaurants.filter((r) => r.city.toLowerCase() === 'san francisco');
    } else {
      matchedRestaurants = restaurants.filter(
        (r) =>
          r.city.toLowerCase().includes(locLower) ||
          r.area.toLowerCase().includes(locLower) ||
          r.neighborhood.toLowerCase().includes(locLower) ||
          r.address.toLowerCase().includes(locLower) ||
          r.name.toLowerCase().includes(locLower)
      );
    }
  } else {
    matchedRestaurants = restaurants.filter(
      (r) => text.includes(r.name.toLowerCase()) || text.includes(r.cuisine.toLowerCase().split(' ')[0])
    );
  }

  if (matchedRestaurants.length === 0 && !location) {
    matchedRestaurants = restaurants.slice(0, 3);
  }

  if (matchedRestaurants.length === 0) {
    return {
      replyText: `I couldn't find any partner restaurants near "${location || 'the requested location'}". We currently have partner restaurants in Hyderabad, Surampalem, Kakinada, and San Francisco. Would you like to view tables in one of those areas?`,
      nearbyRestaurants: [],
      extractedLocation: location,
    };
  }

  let targetRest = matchedRestaurants[0];

  // 3. Extract guests
  let guests = 2;
  const guestMatch = text.match(/(\d+)\s*(people|guests|persons|person|party of\s*(\d+)|top)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1] || guestMatch[3], 10);
  } else if (text.includes('for four') || text.includes('4 people')) guests = 4;
  else if (text.includes('for two') || text.includes('2 people')) guests = 2;
  else if (text.includes('for six') || text.includes('6 people')) guests = 6;
  else if (text.includes('for eight') || text.includes('8 people')) guests = 8;

  // 4. Extract time
  let time = '19:00';
  const timeWithAmpm = text.match(/(?:at\s+|around\s+)?(\d{1,2})(?::(\d{2}))?\s*(pm|am)/i);
  const time24h = text.match(/(?:at\s+|around\s+)?(\d{1,2}):(\d{2})/i);
  const timeAt = text.match(/(?:at|around)\s+(\d{1,2})(?!\s*(?:people|guests|person))/i);

  if (timeWithAmpm) {
    let hour = parseInt(timeWithAmpm[1], 10);
    const minute = timeWithAmpm[2] || '00';
    const ampm = timeWithAmpm[3].toLowerCase();
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    time = `${String(hour).padStart(2, '0')}:${minute}`;
  } else if (time24h) {
    let hour = parseInt(time24h[1], 10);
    const minute = time24h[2];
    time = `${String(hour).padStart(2, '0')}:${minute}`;
  } else if (timeAt) {
    let hour = parseInt(timeAt[1], 10);
    if (hour <= 11) hour += 12;
    time = `${String(hour).padStart(2, '0')}:00`;
  }

  // 5. Extract date
  const now = new Date();
  let date = now.toISOString().split('T')[0];
  if (text.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    date = d.toISOString().split('T')[0];
  }

  // 6. Seating preference
  let seating: any = undefined;
  if (text.includes('booth')) seating = 'booth';
  else if (text.includes('window')) seating = 'window';
  else if (text.includes('patio') || text.includes('outdoor')) seating = 'patio';
  else if (text.includes('bar')) seating = 'bar';
  else if (text.includes('private')) seating = 'private';

  // 7. Check allocation across matching restaurants
  const nearbyRecommendations: any[] = [];
  let bestAlloc: any = null;
  let chosenRest: Restaurant = targetRest;

  for (const r of matchedRestaurants) {
    const restTables = tables.filter((t) => t.restaurantId === r.id && t.isActive);
    const eligible = restTables.filter((t) => t.capacity >= guests);
    const freeTables = eligible.filter((t) => isTableAvailable(t, date, time, reservations));
    const alloc = smartAllocateTable(restTables, reservations, date, time, guests, seating);

    if (!bestAlloc && alloc) {
      bestAlloc = alloc;
      chosenRest = r;
    }

    nearbyRecommendations.push({
      restaurantId: r.id,
      restaurantName: r.name,
      cuisine: r.cuisine,
      rating: r.rating,
      priceRange: r.priceRange,
      openingHours: `${r.openingHours.open} - ${r.openingHours.close}`,
      availableTableCount: freeTables.length,
      heroImage: r.heroImage,
      address: `${r.address}, ${r.city}`,
      city: r.city,
      sampleTable: alloc
        ? {
            tableNumber: alloc.recommendedTable.tableNumber,
            capacity: alloc.recommendedTable.capacity,
            seatingType: alloc.recommendedTable.seatingType,
          }
        : undefined,
    });
  }

  if (bestAlloc) {
    const locPrefix = location ? ` near ${location}` : '';
    return {
      replyText: `Great news! I located ${matchedRestaurants.length} verified restaurant${matchedRestaurants.length > 1 ? 's' : ''}${locPrefix}. For your party of ${guests} on ${date} at ${time}, I recommend Table ${bestAlloc.recommendedTable.tableNumber} (${bestAlloc.recommendedTable.seatingType.toUpperCase()}, seats ${bestAlloc.recommendedTable.capacity}) at ${chosenRest.name}. ${bestAlloc.reason}`,
      actionableReservation: {
        restaurantId: chosenRest.id,
        restaurantName: chosenRest.name,
        tableId: bestAlloc.recommendedTable.id,
        tableNumber: bestAlloc.recommendedTable.tableNumber,
        date,
        time,
        guestCount: guests,
        seatingType: bestAlloc.recommendedTable.seatingType,
        isAvailable: true,
        reasoning: bestAlloc.reason,
      },
      nearbyRestaurants: nearbyRecommendations,
      extractedLocation: location,
    };
  } else {
    const restTables = tables.filter((t) => t.restaurantId === targetRest.id);
    const wait = calculateWaitTime(restTables, reservations, date, time, guests);
    return {
      replyText: `I checked real-time availability${location ? ` near ${location}` : ''} for ${guests} guests at ${time} on ${date}. Peak dining tables are currently held; estimated wait is ~${wait.estimatedWaitMinutes} mins. Openings are available at alternative times: ${wait.alternativeTimes.join(', ')}.`,
      estimatedWaitMinutes: wait.estimatedWaitMinutes,
      nearbyRestaurants: nearbyRecommendations,
      alternativeSuggestions: wait.alternativeTimes.map((t) => ({
        time: t,
        tableNumber: 'Next Open',
        capacity: guests,
        seatingType: seating || 'indoor',
      })),
      extractedLocation: location,
    };
  }
}

