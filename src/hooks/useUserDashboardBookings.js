import { useCallback, useEffect, useState } from 'react';

import api from '../utils/api';
import useSocketBookings from './useSocketBookings';
import { shouldProcessUserEvent } from '../utils/liveEvents';

export default function useUserDashboardBookings({
  user,
  lang,
  dashboardCopy,
  addToast,
}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const liveUpdatedLabel =
    lang === 'ar' ? 'تم تحديث لوحتك مباشرة.' : dashboardCopy.liveUpdated;

  const fetchBookings = useCallback(async () => {
    const response = await api.get('/bookings/my');
    setBookings(Array.isArray(response.data) ? response.data : []);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        await fetchBookings();
      } catch (error) {
        if (isMounted) {
          addToast(error.response?.data?.message || dashboardCopy.loadBookingsFailed, 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [addToast, dashboardCopy.loadBookingsFailed, fetchBookings]);

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
    deleteTarget,
    setDeleteTarget,
    modalLoading,
    performCancel,
  };
}
