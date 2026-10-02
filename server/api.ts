import { Router, Request, Response } from 'express';
import {
  processAIAssistantMessage,
  smartAllocateTable,
  calculateWaitTime,
  isTimeOverlapping,
} from './geminiService';
import { Reservation, RestaurantTable } from '../src/types';
import { INITIAL_RESTAURANTS, INITIAL_TABLES } from '../src/data/mockData';

export const apiRouter = Router();

// Server-side in-memory store for synchronized bookings & race-condition prevention
const serverReservations: Map<string, Reservation> = new Map();
const tableLocks: Set<string> = new Set(); // Concurrency lock keys: `${tableId}_${date}_${time}`

// Preload initial reservations if empty
export function initServerReservations(initialData: Reservation[]) {
  for (const res of initialData) {
    serverReservations.set(res.id, res);
  }
}

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    activeReservations: serverReservations.size,
  });
});

// AI Reservation Chatbot Assistant
apiRouter.post('/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history, restaurants, tables, reservations } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const effectiveRestaurants =
      Array.isArray(restaurants) && restaurants.length > 0 ? restaurants : INITIAL_RESTAURANTS;
    const effectiveTables =
      Array.isArray(tables) && tables.length > 0 ? tables : INITIAL_TABLES;

    // Merge client reservations with any server-side verified reservations
    const mergedReservations = [...(reservations || [])];
    serverReservations.forEach((val) => {
      if (!mergedReservations.some((r) => r.id === val.id)) {
        mergedReservations.push(val);
      }
    });

    const result = await processAIAssistantMessage(
      message,
      history || [],
      effectiveRestaurants,
      effectiveTables,
      mergedReservations
    );

    res.json(result);
  } catch (error) {
    console.error('API assistant error:', error);
    res.status(500).json({ error: 'Failed to process AI assistant request' });
  }
});

// Smart Table Allocation API
apiRouter.post('/gemini/smart-allocate', (req: Request, res: Response) => {
  try {
    const { tables, reservations, date, time, guestCount, seatingPreference } = req.body;
    if (!date || !time || !guestCount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const effectiveTables =
      Array.isArray(tables) && tables.length > 0 ? tables : INITIAL_TABLES;

    // Merge reservations
    const allReservations = [...(reservations || [])];
    serverReservations.forEach((val) => {
      if (!allReservations.some((r) => r.id === val.id)) {
        allReservations.push(val);
      }
    });

    const allocation = smartAllocateTable(
      effectiveTables as RestaurantTable[],
      allReservations,
      date,
      time,
      Number(guestCount),
      seatingPreference
    );

    if (!allocation) {
      return res.status(404).json({
        available: false,
        message: 'No suitable tables available for this time and party size.',
      });
    }

    res.json({
      available: true,
      allocation,
    });
  } catch (error) {
    console.error('Smart allocate error:', error);
    res.status(500).json({ error: 'Failed to compute smart allocation' });
  }
});

// Waiting Time Prediction API
apiRouter.post('/gemini/wait-time', (req: Request, res: Response) => {
  try {
    const { tables, reservations, date, time, guestCount } = req.body;
    if (!date || !time || !guestCount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const effectiveTables =
      Array.isArray(tables) && tables.length > 0 ? tables : INITIAL_TABLES;

    const allReservations = [...(reservations || [])];
    serverReservations.forEach((val) => {
      if (!allReservations.some((r) => r.id === val.id)) {
        allReservations.push(val);
      }
    });

    const prediction = calculateWaitTime(
      effectiveTables as RestaurantTable[],
      allReservations,
      date,
      time,
      Number(guestCount)
    );

    res.json(prediction);
  } catch (error) {
    console.error('Wait time error:', error);
    res.status(500).json({ error: 'Failed to calculate waiting time' });
  }
});

// Atomic Server-Side Reservation Booking with Double-Booking Prevention
apiRouter.post('/reservations/book', async (req: Request, res: Response) => {
  const { reservation, existingReservations, tableCapacity } = req.body;

  if (!reservation || !reservation.tableId || !reservation.date || !reservation.time) {
    return res.status(400).json({ error: 'Invalid reservation payload' });
  }

  // Generate atomic lock key for table slot
  const lockKey = `${reservation.tableId}_${reservation.date}_${reservation.time}`;

  if (tableLocks.has(lockKey)) {
    return res.status(409).json({
      success: false,
      error: 'Simultaneous booking collision: Another guest is currently securing this exact table. Please choose another table or time.',
    });
  }

  // Acquire lock
  tableLocks.add(lockKey);

  try {
    // Collect all active reservations from client state + server memory
    const activeList: Reservation[] = [];
    if (Array.isArray(existingReservations)) {
      activeList.push(...existingReservations);
    }
    serverReservations.forEach((val) => {
      if (!activeList.some((r) => r.id === val.id)) {
        activeList.push(val);
      }
    });

    const targetDuration = reservation.durationMinutes || 90;

    // Strict overlapping collision check
    const collision = activeList.find(
      (existing) =>
        existing.tableId === reservation.tableId &&
        existing.date === reservation.date &&
        existing.status !== 'cancelled' &&
        existing.id !== reservation.id &&
        isTimeOverlapping(existing.time, existing.durationMinutes || 90, reservation.time, targetDuration)
    );

    if (collision) {
      return res.status(409).json({
        success: false,
        error: `Double Booking Blocked: Table ${reservation.tableNumber || ''} is already reserved from ${collision.time} for party "${collision.customerName}". Overlapping reservations are strictly prevented.`,
        conflictingReservation: {
          time: collision.time,
          duration: collision.durationMinutes,
        },
      });
    }

    // Capacity validation
    if (tableCapacity && reservation.guestCount > tableCapacity) {
      return res.status(400).json({
        success: false,
        error: `Party size of ${reservation.guestCount} exceeds table maximum capacity of ${tableCapacity}.`,
      });
    }

    // Generate unique confirmation code if missing
    const reservationCode = reservation.reservationCode || `TM-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = reservation.id || `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const confirmedReservation: Reservation = {
      ...reservation,
      id,
      reservationCode,
      status: reservation.status || 'confirmed',
      createdAt: reservation.createdAt || new Date().toISOString(),
    };

    // Commit to server memory
    serverReservations.set(id, confirmedReservation);

    return res.status(201).json({
      success: true,
      reservation: confirmedReservation,
      message: 'Reservation verified and secured with zero double-booking conflict.',
    });
  } finally {
    // Release atomic lock
    tableLocks.delete(lockKey);
  }
});

// Cancel reservation endpoint
apiRouter.post('/reservations/cancel', (req: Request, res: Response) => {
  const { reservationId } = req.body;
  if (!reservationId) {
    return res.status(400).json({ error: 'Reservation ID is required' });
  }

  const existing = serverReservations.get(reservationId);
  if (existing) {
    existing.status = 'cancelled';
    serverReservations.set(reservationId, existing);
  }

  res.json({
    success: true,
    message: 'Reservation cancelled and table released back into availability pool.',
  });
});
