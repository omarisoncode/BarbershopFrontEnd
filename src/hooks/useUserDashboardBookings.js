import { useCallback, useEffect, useRef, useState } from 'react';

import api from '../utils/api';
import useSocketBookings from './useSocketBookings';
import { shouldProcessUserEvent } from '../utils/liveEvents';

export default function useUserDashboardBookings({
  user,
  lang,
  dashboardCopy,
  addToast,
}) {
  const cacheKey = user?._id ? `user-dashboard-bookings:${user._id}` : '';
  const remoteLoadedRef = useRef(false);
  const [bookings, setBookings] = useState(() => {
    if (typeof window === 'undefined' || !cacheKey) {
      return [];
    }

    try {
      const cached = window.localStorage.getItem(cacheKey);
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [initialSyncComplete, setInitialSyncComplete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const liveUpdatedLabel =
    lang === 'ar' ? 'تم تحديث لوحتك مباشرة.' : dashboardCopy.liveUpdated;

  const fetchBookings = useCallback(async () => {
    const response = await api.get('/bookings/my');
    if (Array.isArray(response.data)) {
      remoteLoadedRef.current = true;
      setBookings((current) =>
        response.data.length === 0 && current.length > 0
          ? current
          : response.data,
      );
    }
  }, []);

  useEffect(() => {
    remoteLoadedRef.current = false;
    setLoading(true);
    setInitialSyncComplete(false);

    if (typeof window === 'undefined' || !cacheKey) {
      setBookings([]);
      return;
    }

    try {
      const cached = window.localStorage.getItem(cacheKey);
      const parsed = cached ? JSON.parse(cached) : [];
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBookings([]);
      // Ignore cache hydration failures and rely on the live request path.
    }
  }, [cacheKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !cacheKey) {
      return;
    }

    if (bookings.length === 0 && !remoteLoadedRef.current) {
      return;
    }

    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(bookings));
    } catch {
      // Ignore storage write issues and keep the in-memory dashboard state.
    }
  }, [bookings, cacheKey]);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      if (!user?._id) {
        if (isMounted) {
          setLoading(false);
          setInitialSyncComplete(true);
        }
        return;
      }

      try {
        await fetchBookings();
      } catch (error) {
        if (isMounted) {
          addToast(error.response?.data?.message || dashboardCopy.loadBookingsFailed, 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialSyncComplete(true);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [addToast, dashboardCopy.loadBookingsFailed, fetchBookings, user?._id]);

  useSocketBookings({
    enabled: Boolean(user),
    onEvent: async (payload) => {
      if (!shouldProcessUserEvent(payload, user)) {
        return;
      }

      try {
        await fetchBookings();
        if (payload?.type && payload.type !== 'booking.created') {
          addToast(liveUpdatedLabel, 'info');
        }
      } catch {
        // Preserve the current dashboard state if a background refresh fails.
      }
    },
  });

  const performCancel = useCallback(
    async (id) => {
      setModalLoading(true);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === id ? { ...booking, status: 'cancelled' } : booking,
        ),
      );

      try {
        await api.put(`/bookings/${id}/cancel`);
        addToast(dashboardCopy.cancelSuccess, 'success');
      } catch (error) {
        setBookings((current) =>
          current.map((booking) =>
            booking._id === id ? { ...booking, status: 'active' } : booking,
          ),
        );
        addToast(error.response?.data?.message || dashboardCopy.cancelFailed, 'error');
      } finally {
        setDeleteTarget(null);
        setModalLoading(false);
      }
    },
    [addToast, dashboardCopy.cancelFailed, dashboardCopy.cancelSuccess],
  );

  return {
    bookings,
    loading,
    initialSyncComplete,
    deleteTarget,
    setDeleteTarget,
    modalLoading,
    performCancel,
  };
}
