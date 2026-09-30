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
      neighborhood: r.neighborhood,
      openingHours: r.openingHours,
    }));

    const systemInstruction = `You are "TableMind AI Assistant", an elite restaurant reservation concierge.
Your mission is to help guests find and book the perfect restaurant table in conversational natural language.

CURRENT RESTAURANTS IN DATABASE:
${JSON.stringify(restaurantsSummary, null, 2)}

CORE RULES:
1. Extract booking intent: restaurant, date (YYYY-MM-DD), time (HH:MM), guest count (number), seating preference (indoor, patio, booth, window, bar, private).
2. If today or tomorrow is mentioned, calculate relative to current date (local timezone).
3. If information is missing (like party size or time), politely ask for clarification.
4. Output your answer in JSON matching the exact schema provided.
5. In "extractedBooking", include the parsed parameters. If the restaurant is identified, set restaurantId and restaurantName.
6. Provide a warm, refined, hospitable message in "replyText".
`;

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
              description: 'Friendly, hospitable response to the customer',
            },
            extractedBooking: {
              type: Type.OBJECT,
              properties: {
                restaurantId: { type: Type.STRING },
                restaurantName: { type: Type.STRING },
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

    // Check availability if we have enough booking details
    let actionableReservation = undefined;
    let alternativeSuggestions = undefined;
    let estimatedWaitMinutes = undefined;

    if (booking?.restaurantId && booking?.guestCount) {
      const rest = restaurants.find((r) => r.id === booking.restaurantId) || restaurants[0];
      const restTables = tables.filter((t) => t.restaurantId === rest.id);
      
      const targetDate = booking.date || new Date().toISOString().split('T')[0];
      const targetTime = booking.time || '19:00';
      const guests = Number(booking.guestCount) || 2;
      const seating = booking.seatingPreference as any;

      // Smart allocation check
      const allocation = smartAllocateTable(restTables, reservations, targetDate, targetTime, guests, seating);

      if (allocation) {
        actionableReservation = {
          restaurantId: rest.id,
          restaurantName: rest.name,
          tableId: allocation.recommendedTable.id,
          tableNumber: allocation.recommendedTable.tableNumber,
          date: targetDate,
          time: targetTime,
          guestCount: guests,
          seatingType: allocation.recommendedTable.seatingType,
          isAvailable: true,
          reasoning: allocation.reason,
        };
      } else {
        // Table not available! Check wait time and alternatives
        const wait = calculateWaitTime(restTables, reservations, targetDate, targetTime, guests);
        estimatedWaitMinutes = wait.estimatedWaitMinutes;
        
        // Find alternative tables at next available slot
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
    }

    return {
      replyText: parsed.replyText || 'I would be delighted to assist with your reservation. Could you share your preferred date, time, and party size?',
      actionableReservation,
      alternativeSuggestions,
      estimatedWaitMinutes,
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

  // Find restaurant
  let targetRest = restaurants[0];
  for (const r of restaurants) {
    if (text.includes(r.name.toLowerCase()) || text.includes(r.cuisine.toLowerCase().split(' ')[0])) {
      targetRest = r;
      break;
    }
  }

  // Extract guests
  let guests = 2;
  const guestMatch = text.match(/(\d+)\s*(people|guests|persons|person|party of\s*(\d+)|top)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1] || guestMatch[3], 10);
  } else if (text.includes('for four') || text.includes('4 people')) guests = 4;
  else if (text.includes('for two') || text.includes('2 people')) guests = 2;
  else if (text.includes('for six') || text.includes('6 people')) guests = 6;
  else if (text.includes('for eight') || text.includes('8 people')) guests = 8;

  // Extract time specifically (e.g. 7 PM, 7:30 PM, 19:00, or 'at 7')
  let time = '19:00';
  const timeWithAmpm = text.match(/(?:at\s+|around\s+)?(\d{1,2})(?::(\d{2}))?\s*(pm|am)/i);
  const time24h = text.match(/(?:at\s+|around\s+)?(\d{1,2}):(\d{2})/i);
  const timeAt = text.match(/(?:at|around)\s+(\d{1,2})/i);

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
    if (hour <= 11) hour += 12; // default to evening hours for dinner
    time = `${String(hour).padStart(2, '0')}:00`;
  }

  // Extract date
  const now = new Date();
  let date = now.toISOString().split('T')[0];
  if (text.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    date = d.toISOString().split('T')[0];
  }

  // Seating preference
  let seating: any = undefined;
  if (text.includes('booth')) seating = 'booth';
  else if (text.includes('window')) seating = 'window';
  else if (text.includes('patio') || text.includes('outdoor')) seating = 'patio';
  else if (text.includes('bar')) seating = 'bar';
  else if (text.includes('private')) seating = 'private';

  // Check allocation
  const restTables = tables.filter((t) => t.restaurantId === targetRest.id);
  const allocation = smartAllocateTable(restTables, reservations, date, time, guests, seating);

  if (allocation) {
    return {
      replyText: `Great news! I have reserved a preview for Table ${allocation.recommendedTable.tableNumber} (${allocation.recommendedTable.seatingType.toUpperCase()}, capacity ${allocation.recommendedTable.capacity}) at ${targetRest.name} for ${guests} guests on ${date} at ${time}. ${allocation.reason}`,
      actionableReservation: {
        restaurantId: targetRest.id,
        restaurantName: targetRest.name,
        tableId: allocation.recommendedTable.id,
        tableNumber: allocation.recommendedTable.tableNumber,
        date,
        time,
        guestCount: guests,
        seatingType: allocation.recommendedTable.seatingType,
        isAvailable: true,
        reasoning: allocation.reason,
      },
    };
  } else {
    const wait = calculateWaitTime(restTables, reservations, date, time, guests);
    return {
      replyText: `I checked real-time availability at ${targetRest.name} for ${guests} guests at ${time} on ${date}, and all matching tables are currently booked. Estimated wait time is approximately ${wait.estimatedWaitMinutes} minutes. We have openings at alternative times like ${wait.alternativeTimes.join(', ')}.`,
      estimatedWaitMinutes: wait.estimatedWaitMinutes,
      alternativeSuggestions: wait.alternativeTimes.map((t) => ({
        time: t,
        tableNumber: 'Next Open',
        capacity: guests,
        seatingType: seating || 'indoor',
      })),
    };
  }
}
