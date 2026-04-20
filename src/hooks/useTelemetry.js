
import { useState, useEffect, useRef, useCallback } from 'react';
import { logSandboxTelemetry } from '../services/api';

/**
 * useTelemetry Hook
 * Tracks user actions in the AI Sandbox and batches them for the backend.
 */
export const useTelemetry = (sessionId) => {
  const queueRef = useRef([]);
  const timerRef = useRef(null);

  const flush = useCallback(async () => {
    if (queueRef.current.length === 0 || !sessionId) return;

    const eventsToFlush = [...queueRef.current];
    queueRef.current = []; // Clear queue immediately

    try {
      await logSandboxTelemetry(sessionId, eventsToFlush);
    } catch (err) {
      console.error("Failed to flush telemetry", err);
      // Optional: Re-add to queue or handle persistence
    }
  }, [sessionId]);

  const logEvent = useCallback((actionType, metadata = {}) => {
    const event = {
      actionType,
      metadata,
      timestamp: new Date().toISOString()
    };
    queueRef.current.push(event);

    // Auto-flush if queue gets too large
    if (queueRef.current.length >= 20) {
      flush();
    }
  }, [flush]);

  // Periodic flush every 15 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      flush();
    }, 15000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      flush(); // Final flush on unmount
    };
  }, [flush]);

  return { logEvent, flush };
};
