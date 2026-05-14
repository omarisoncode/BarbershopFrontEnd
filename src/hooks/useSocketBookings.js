import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

export default function useSocketBookings({ enabled = true, onEvent }) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return undefined;
    }

    // Reuse the exact same backend origin as the Axios client to avoid port drift.
    const stream = new EventSource(`${API_BASE_URL}/bookings/stream`, {
      withCredentials: true,
    });

    stream.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type !== 'stream.ping' && payload?.type !== 'stream.connected') {
          onEventRef.current?.(payload);
        }
      } catch {
        // Ignore malformed payloads so the stream can continue uninterrupted.
      }
    };

    stream.onerror = () => {
      // Native EventSource retries automatically, so no extra client logic is needed here.
    };

    return () => {
      stream.close();
    };
  }, [enabled]);
}
