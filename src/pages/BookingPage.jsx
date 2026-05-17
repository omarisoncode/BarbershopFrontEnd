import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

import api from '../utils/api';
import { ToastContext } from '../context/ToastContext';
import Calendar from '../components/Calendar';
import {
  BookingBarbersSkeleton,
  BookingServicesSkeleton,
} from '../components/home/HomeLoadingStates';
import {
  prefetchPublicBookingData,
  usePublicBarbersByService,
  usePublicServices,
} from '../hooks/usePublicCatalog';
import {
  getLocalizedCategoryLabel,
  getServiceBadgeOrCategoryLabel,
  normalizeCategoryValue,
} from '../utils/serviceCategories';
import { getBookingDateTimeValue } from '../utils/bookingDateTime';
import { isPastBusinessDate } from '../utils/businessDate';

const copy = {
  en: {
    appointmentBooking: 'Appointment Booking',
    exitBooking: 'Exit booking',
    remaining: 'Remaining',
    loadingServices: 'Loading services...',
    stepService: 'Service',
    stepBarber: 'Barber',
    autoBarber: 'First available',
    autoBarberHint: 'We will assign any barber who can take this slot.',
    autoBarberSummary: 'Assigned automatically',
    stepDate: 'Date',
    stepTime: 'Time',
    stepConfirm: 'Confirm',
    noServices:
      'There are no published services available right now. Please check back shortly or contact the studio.',
    serviceDescriptionFallback: 'Premium grooming tailored to your style.',
    chooseBarber: 'Choose a barber who offers this service.',
    noBarbersFound: 'No barbers are currently assigned to this service.',
    barberFallbackBio: 'Experienced barber ready for your next appointment.',
    yearsExperience: 'years experience',
    specialties: 'Specialties',
    noSlotsAvailable: 'No time slots available',
    sameDayClosed:
      'This barber has no remaining slots for the selected day. Please choose another date.',
    findingTimes: 'Finding available times...',
    selected: 'Selected',
    yourSelection: 'Your Selection',
    serviceLabel: 'Service',
    barberLabel: 'Barber',
    dateLabel: 'Date',
    timeLabel: 'Time',
    totalAmount: 'Total Amount',
    back: 'Back',
    nextStep: 'Next Step',
    confirmBooking: 'Confirm Booking',
    confirmingBooking: 'Confirming Booking',
    pleaseWait: 'Please wait while we secure your appointment...',
    bookingConfirmed: 'Booking confirmed!',
    bookingSuccessTitle: 'Appointment confirmed',
    bookingSuccessNote:
      'Your booking is locked in. Email and WhatsApp updates will continue in the background.',
    bookingSuccessCta: 'Opening your dashboard...',
    slotTaken: 'This time is no longer available. Please choose another slot.',
    maxBookings: 'You already have 3 active bookings.',
    pastTime: 'This time is no longer available.',
    bookingFailed: 'We could not complete the booking. Please try again.',
    loadBarbersFailed: 'Failed to load barbers.',
    loadServicesFailed: 'Failed to load services.',
    noDateSelected: 'Choose a date to see available times.',
    refreshList: 'Refresh',
    allCategories: 'All services',
    stepSchedule: 'Schedule',
    scheduleHint: 'Choose a day, then pick the time that fits best.',
  },
  ar: {
    appointmentBooking: 'حجز موعد',
    exitBooking: 'الخروج من الحجز',
    remaining: 'المتبقي',
    loadingServices: 'جار تحميل الخدمات...',
    stepService: 'الخدمة',
    stepBarber: 'الحلاق',
    autoBarber: 'أول حلاق متاح',
    autoBarberHint: 'سنختار أي حلاق متاح لهذا الموعد.',
    autoBarberSummary: 'يتم التعيين تلقائياً',
    stepDate: 'التاريخ',
    stepTime: 'الوقت',
    stepConfirm: 'التأكيد',
    noServices:
      'لا توجد خدمات منشورة متاحة حالياً. يرجى المحاولة لاحقاً أو التواصل مع الاستوديو.',
    serviceDescriptionFallback: 'عناية فاخرة مصممة بما يناسب أسلوبك.',
    chooseBarber: 'اختر الحلاق الذي يقدم هذه الخدمة.',
    noBarbersFound: 'لا يوجد حلاقون مخصصون لهذه الخدمة حالياً.',
    barberFallbackBio: 'حلاق محترف جاهز لموعدك القادم.',
    yearsExperience: 'سنوات خبرة',
    specialties: 'التخصصات',
    noSlotsAvailable: 'لا توجد مواعيد متاحة',
    sameDayClosed: 'لا توجد أوقات متبقية لهذا اليوم. يرجى اختيار تاريخ آخر.',
    findingTimes: 'جار البحث عن الأوقات المتاحة...',
    selected: 'تم الاختيار',
    yourSelection: 'اختيارك',
    serviceLabel: 'الخدمة',
    barberLabel: 'الحلاق',
    dateLabel: 'التاريخ',
    timeLabel: 'الوقت',
    totalAmount: 'المبلغ الإجمالي',
    back: 'رجوع',
    nextStep: 'الخطوة التالية',
    confirmBooking: 'تأكيد الحجز',
    confirmingBooking: 'جار تأكيد الحجز',
    pleaseWait: 'يرجى الانتظار بينما نثبت موعدك...',
    bookingConfirmed: 'تم تأكيد الحجز!',
    bookingSuccessTitle: 'تم تأكيد الموعد',
    bookingSuccessNote:
      'تم تثبيت حجزك بنجاح. ستستمر تحديثات البريد الإلكتروني وواتساب في الخلفية.',
    bookingSuccessCta: 'جارٍ فتح لوحة التحكم...',
    slotTaken: 'هذا الوقت لم يعد متاحاً. يرجى اختيار وقت آخر.',
    maxBookings: 'لديك بالفعل 3 حجوزات نشطة.',
    pastTime: 'هذا الوقت لم يعد متاحاً.',
    bookingFailed: 'تعذر إكمال الحجز. يرجى المحاولة مرة أخرى.',
    loadBarbersFailed: 'تعذر تحميل الحلاقين.',
    loadServicesFailed: 'تعذر تحميل الخدمات.',
    noDateSelected: 'اختر تاريخاً لعرض الأوقات المتاحة.',
    refreshList: 'تحديث',
    allCategories: 'كل الخدمات',
    stepSchedule: 'الجدولة',
    scheduleHint: 'اختر اليوم ثم الوقت المناسب لك.',
  },
};

void motion;

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

const getServiceName = (service, lang) =>
  lang === 'ar' ? service.nameAr || service.name : service.name;

const getServiceDescription = (service, lang) =>
  lang === 'ar'
    ? service.descriptionAr || service.description || ''
    : service.description || service.descriptionAr || '';

const getBarberName = (barber, lang) =>
  lang === 'ar' ? barber.nameAr || barber.name : barber.name;

const hasValue = (value) => typeof value === 'string' && value.trim().length > 0;
const hasArabicScript = (value) => /[\u0600-\u06FF]/.test(String(value || ''));

const getBarberBio = (barber, lang, t) =>
  lang === 'ar'
    ? (
        hasValue(barber.bioAr) && hasArabicScript(barber.bioAr)
          ? barber.bioAr
          : hasValue(barber.bio) && hasArabicScript(barber.bio)
            ? barber.bio
            : t.barberFallbackBio
      )
    : barber.bio || barber.bioAr || t.barberFallbackBio;

const getServiceCategoryLabel = (service, lang, t) =>
  getLocalizedCategoryLabel(service, lang, t.allCategories);

const formatDuration = (durationMinutes, lang) =>
  lang === 'ar' ? `${durationMinutes} دقيقة` : `${durationMinutes} min`;

const formatPrice = (price, lang) => {
  const numericValue = Number(price) || 0;
  const amount = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US', {
    minimumFractionDigits: Number.isInteger(numericValue) ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return lang === 'ar' ? `${amount} د.ك` : `KD ${amount}`;
};

const formatLocalizedDate = (date, lang) =>
  new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatDisplayDate = (date, lang) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatDisplayTime = (time) => {
  const [hour, minute] = String(time || '00:00').split(':');
  const safeHour = Number(hour);
  const safeMinute = Number(minute);
  if (Number.isNaN(safeHour) || Number.isNaN(safeMinute)) {
    return time || '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, safeHour, safeMinute));
};

const AUTO_BARBER_ID = 'auto-barber';

const matchesPreselectedService = (service, preselectedTitle) => {
  const normalizedTitle = String(preselectedTitle || '').trim().toLowerCase();
  const candidates = [
    service.name,
    service.nameAr,
    service.slug,
    service.name.replace('Signature ', ''),
    service.name.replace('Luxury ', ''),
    service.name.replace(' Sculpt', ''),
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase());

  return candidates.some(
    (candidate) =>
      candidate === normalizedTitle ||
      candidate.includes(normalizedTitle) ||
      normalizedTitle.includes(candidate),
  );
};

const MobileServiceOption = ({
  service,
  lang,
  t,
  isSelected,
  onSelect,
}) => (
  <button
    type='button'
    onClick={onSelect}
    className={`flex w-full items-center gap-3 rounded-[1.15rem] border px-3 py-3 text-left transition-all duration-200 ${
      isSelected
        ? 'border-brand-gold bg-brand-gold/8 shadow-[0_10px_24px_rgba(212,175,55,0.12)]'
        : 'border-brand-gold/10 bg-white/72 dark:bg-white/5'
    }`}
  >
    <div className='h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-950/95'>
      {service.image ? (
        <img
          src={service.image}
          alt={getServiceName(service, lang)}
          className='h-full w-full object-cover'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,122,0.14),_rgba(15,23,42,0.88)_40%,_rgba(2,6,23,1)_100%)]'>
          <Scissors className='h-5 w-5 text-brand-gold' />
        </div>
      )}
    </div>

    <div className='min-w-0 flex-1'>
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-black text-slate-900 dark:text-white'>
            {getServiceName(service, lang)}
          </p>
          <p className='mt-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold'>
            {formatDuration(service.durationMinutes, lang)}
          </p>
        </div>
        <span className='shrink-0 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-slate-900'>
          {formatPrice(service.price, lang)}
        </span>
      </div>

      <div className='mt-2 flex flex-wrap items-center gap-2'>
        <span className='rounded-full border border-brand-gold/10 bg-white/62 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:border-brand-gold/12 dark:bg-white/5 dark:text-slate-300'>
          {getServiceBadgeOrCategoryLabel(service, lang, t.allCategories)}
        </span>
        {isSelected ? (
          <span className='inline-flex items-center gap-1 rounded-full bg-brand-gold px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black'>
            <CheckCircle2 size={12} />
            {t.selected}
          </span>
        ) : null}
      </div>
    </div>
  </button>
);

const MobileBarberOption = ({
  barber,
  lang,
  t,
  isSelected,
  onSelect,
}) => (
  <button
    type='button'
    onClick={onSelect}
    className={`flex w-full items-start gap-3 rounded-[1.15rem] border px-3 py-3 text-left transition-all duration-200 ${
      isSelected
        ? 'border-brand-gold bg-brand-gold/8 shadow-[0_10px_24px_rgba(212,175,55,0.12)]'
        : 'border-brand-gold/10 bg-white/72 dark:bg-white/5'
    }`}
  >
    {barber._id === AUTO_BARBER_ID ? (
      <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top,_rgba(255,215,122,0.16),_rgba(15,23,42,0.88)_42%,_rgba(2,6,23,1)_100%)]'>
        <UserRound className='h-6 w-6 text-brand-gold' />
      </div>
    ) : (
      <img
        src={
          barber.image ||
          'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=870'
        }
        alt={getBarberName(barber, lang)}
        className='h-14 w-14 shrink-0 rounded-xl object-cover'
      />
    )}

    <div className='min-w-0 flex-1'>
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-black text-slate-900 dark:text-white'>
            {getBarberName(barber, lang)}
          </p>
          <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300'>
            {getBarberBio(barber, lang, t)}
          </p>
        </div>
        {isSelected ? (
          <CheckCircle2 className='shrink-0 text-brand-gold' size={18} />
        ) : null}
      </div>

      <div className='mt-2 flex flex-wrap items-center gap-2'>
        {barber._id === AUTO_BARBER_ID ? null : (
          <span className='rounded-full bg-brand-gold/10 px-2.5 py-1 text-[11px] font-bold text-brand-gold'>
            {barber.experienceYears} {t.yearsExperience}
          </span>
        )}
      </div>
    </div>
  </button>
);

const getAutoBarberOption = (t) => ({
  _id: AUTO_BARBER_ID,
  name: t.autoBarber,
  nameAr: t.autoBarber,
  bio: t.autoBarberHint,
  bioAr: t.autoBarberHint,
  experienceYears: 0,
  serviceIds: [],
});

export default function BookingPage({ lang, isRTL }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useContext(ToastContext);
  const t = copy[lang] || copy.en;
  const scrollContainerRef = useRef(null);

  const [direction, setDirection] = useState(1);
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceCategory, setServiceCategory] = useState('all');
  const [userBookingsCount, setUserBookingsCount] = useState(0);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccessState, setBookingSuccessState] = useState(null);
  const {
    data: services,
    error: servicesError,
    isLoading: loadingServices,
    isRefreshing: servicesRefreshing,
  } = usePublicServices();
  const {
    data: barbers,
    error: barbersError,
    isLoading: loadingBarbers,
    isRefreshing: barbersRefreshing,
  } = usePublicBarbersByService(selectedService?._id);
  const refreshingLabel = lang === 'ar' ? 'جار التحديث' : 'Refreshing';
  const autoBarberOption = useMemo(() => getAutoBarberOption(t), [t]);
  const isAutoBarberSelection = selectedBarber?._id === AUTO_BARBER_ID;
  const visibleBarberOptions = useMemo(
    () => (barbers.length > 0 ? [autoBarberOption, ...barbers] : []),
    [autoBarberOption, barbers],
  );

  const steps = useMemo(
    () => [
      { id: 0, label: t.stepService },
      { id: 1, label: t.stepBarber },
      { id: 2, label: t.stepSchedule || t.stepDate },
      { id: 3, label: t.stepConfirm },
    ],
    [t],
  );
  const stepStates = useMemo(
    () => [
      {
        id: 0,
        label: t.stepService,
        subtitle: selectedService ? getServiceName(selectedService, lang) : '',
        Icon: Scissors,
      },
      {
        id: 1,
        label: t.stepBarber,
        subtitle: selectedBarber
          ? isAutoBarberSelection
            ? t.autoBarberSummary
            : getBarberName(selectedBarber, lang)
          : '',
        Icon: UserRound,
      },
      {
        id: 2,
        label: t.stepSchedule || t.stepDate,
        subtitle:
          selectedDate && selectedTime
            ? `${formatLocalizedDate(selectedDate, lang)} • ${formatDisplayTime(selectedTime)}`
            : selectedDate
              ? formatLocalizedDate(selectedDate, lang)
              : '',
        Icon: CalendarClock,
      },
      {
        id: 3,
        label: t.stepConfirm,
        subtitle: selectedTime ? t.confirmBooking : '',
        Icon: ShieldCheck,
      },
    ],
    [
      isAutoBarberSelection,
      lang,
      selectedBarber,
      selectedDate,
      selectedService,
      selectedTime,
      t,
    ],
  );
  const stepCompletion = useMemo(
    () => [
      Boolean(selectedService),
      Boolean(selectedService) && Boolean(selectedBarber),
      Boolean(selectedService) && Boolean(selectedBarber) && Boolean(selectedDate) && Boolean(selectedTime),
      Boolean(selectedService) && Boolean(selectedBarber) && Boolean(selectedDate) && Boolean(selectedTime),
    ],
    [selectedBarber, selectedDate, selectedService, selectedTime],
  );

  const serviceCategories = useMemo(() => {
    const values = Array.from(
      new Set(
        services
          .map((service) => normalizeCategoryValue(service.category))
          .filter(Boolean),
      ),
    );

    return ['all', ...values];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        serviceCategory === 'all' ||
        normalizeCategoryValue(service.category) === serviceCategory;

      return matchesCategory;
    });
  }, [serviceCategory, services]);

  const selectionSummary = useMemo(
    () =>
      [
        selectedService
          ? {
              label: t.serviceLabel,
              value: getServiceName(selectedService, lang),
            }
          : null,
        selectedBarber
          ? {
              label: t.barberLabel,
              value: isAutoBarberSelection
                ? t.autoBarberSummary
                : getBarberName(selectedBarber, lang),
            }
          : null,
        selectedDate
          ? {
              label: t.dateLabel,
              value: formatLocalizedDate(selectedDate, lang),
            }
          : null,
        selectedTime
          ? {
              label: t.timeLabel,
              value: formatDisplayTime(selectedTime),
            }
          : null,
      ].filter(Boolean),
    [isAutoBarberSelection, lang, selectedBarber, selectedDate, selectedService, selectedTime, t],
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const bookingsResponse = await api.get('/bookings/my');
        const now = Date.now();
        const activeBookings = Array.isArray(bookingsResponse.data)
          ? bookingsResponse.data.filter(
              (booking) =>
                booking.status === 'active' &&
                getBookingDateTimeValue(booking) >= now,
            )
          : [];

        setUserBookingsCount(activeBookings.length);
      } catch {
        addToast(t.loadServicesFailed, 'error');
      }
    };

    fetchInitialData();
  }, [addToast, t]);

  useEffect(() => {
    void prefetchPublicBookingData();
  }, []);

  useEffect(() => {
    const preselectedId = location.state?.preselectedService?._id;
    const preselectedTitle = location.state?.preselectedService?.title;
    if ((!preselectedId && !preselectedTitle) || services.length === 0) {
      return;
    }

    const match =
      services.find((service) => String(service._id) === String(preselectedId)) ||
      services.find((service) => matchesPreselectedService(service, preselectedTitle));

    if (match) {
      setSelectedService(match);
      setStep(1);
    }
  }, [location.state, services]);

  useEffect(() => {
    const preselectedBarberId = location.state?.preselectedBarberId;
    if (!selectedService?._id || !preselectedBarberId || barbers.length === 0) {
      return;
    }

    const match = barbers.find((barber) => String(barber._id) === String(preselectedBarberId));
    if (!match) {
      return;
    }

    setSelectedBarber((current) =>
      String(current?._id || '') === String(match._id) ? current : match,
    );
    setStep((current) => Math.max(current, 2));
  }, [barbers, location.state, selectedService?._id]);

  useEffect(() => {
    if (!selectedService?._id) {
      setSelectedBarber(null);
      return;
    }
  }, [selectedService]);

  useEffect(() => {
    if (servicesError) {
      addToast(t.loadServicesFailed, 'error');
    }
  }, [addToast, servicesError, t]);

  useEffect(() => {
    if (barbersError && selectedService?._id) {
      addToast(t.loadBarbersFailed, 'error');
    }
  }, [addToast, barbersError, selectedService, t]);

  useEffect(() => {
    if (!bookingSuccessState) return undefined;

    const timer = window.setTimeout(() => {
      navigate('/dashboard');
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [bookingSuccessState, navigate]);

  useEffect(() => {
    if (!selectedService?._id || !selectedBarber?._id || !selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const query = new URLSearchParams({
          date: selectedDate,
          serviceId: selectedService._id,
        });

        if (!isAutoBarberSelection) {
          query.set('barberId', selectedBarber._id);
        }

        const response = await api.get(`/bookings/availability?${query.toString()}`);
        setSlots(Array.isArray(response.data) ? response.data : []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [isAutoBarberSelection, selectedBarber, selectedDate, selectedService]);

  const resetAfterServiceChange = (service) => {
    setSelectedService(service);
    setSelectedBarber(null);
    setSelectedDate('');
    setSelectedTime('');
    setSlots([]);
    setDirection(1);
    setStep(1);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setSelectedDate('');
    setSelectedTime('');
    setSlots([]);
    setDirection(1);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    // Keep a page-level guard so mobile taps cannot select past dates even if
    // the calendar UI ever renders a stale interactive cell.
    if (isPastBusinessDate(date)) {
      addToast(t.pastTime, 'error');
      return;
    }

    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setDirection(1);
    setStep(3);
  };

  const handleExitBooking = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/dashboard');
  };

  const canNavigateToStep = (targetStep) => {
    if (targetStep <= step) {
      return true;
    }

    if (targetStep <= 0) {
      return true;
    }

    return stepCompletion[targetStep - 1];
  };

  const goToStep = (targetStep) => {
    if (!canNavigateToStep(targetStep)) {
      return;
    }

    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
  };

  const goBack = () => {
    // Preserve previous choices so users can compare options without losing progress.
    goToStep(Math.max(step - 1, 0));
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [step]);

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      const response = await api.post('/bookings', {
        barberId: isAutoBarberSelection ? undefined : selectedBarber._id,
        autoAssignBarber: isAutoBarberSelection,
        date: selectedDate,
        time: selectedTime,
        serviceId: selectedService._id,
      });
      const confirmedBarberName =
        response.data?.barber?.name ||
        response.data?.barberName ||
        (isAutoBarberSelection ? t.autoBarberSummary : getBarberName(selectedBarber, lang));
      setBookingSuccessState({
        serviceName: getServiceName(selectedService, lang),
        barberName: confirmedBarberName,
        dateLabel: formatDisplayDate(selectedDate, lang),
        timeLabel: formatDisplayTime(selectedTime),
      });
      addToast(t.bookingConfirmed, 'success');
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === 'Slot already booked') {
        addToast(t.slotTaken, 'error');
        setStep(2);
      } else if (message === 'You already have 3 active bookings') {
        addToast(t.maxBookings, 'error');
        navigate('/dashboard');
      } else if (message === 'Cannot book past time') {
        addToast(t.pastTime, 'error');
        setStep(2);
      } else {
        addToast(message || t.bookingFailed, 'error');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className='lux-page-shell min-h-screen supports-[height:100svh]:min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh]'>
      <AnimatePresence>
        {bookingLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              role='status'
              aria-live='polite'
              className='lux-panel mx-4 w-full max-w-xs border-white/30 p-10 text-center dark:border-white/10'
            >
              <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/10 ring-1 ring-brand-gold/15'>
                <Loader2 className='animate-spin text-brand-gold' size={34} />
              </div>
              <h3 className='text-xl font-black text-slate-900 dark:text-white'>
                {t.confirmingBooking}
              </h3>
              <p className='mt-2 text-sm text-slate-500 dark:text-white/70'>
                {t.pleaseWait}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bookingSuccessState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[101] flex items-center justify-center bg-slate-950/72 backdrop-blur-md'
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className='lux-panel mx-4 w-full max-w-md border-white/28 p-6 dark:border-white/10'
            >
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'>
                <CheckCircle2 size={30} />
              </div>
              <h3 className='mt-5 text-center text-2xl font-black text-slate-900 dark:text-white'>
                {t.bookingSuccessTitle}
              </h3>
              <p className='mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-slate-500 dark:text-slate-300'>
                {t.bookingSuccessNote}
              </p>

              <div className='app-surface-muted mt-5 p-4'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.serviceLabel}
                    </p>
                    <p className='mt-1 text-sm font-bold text-slate-900 dark:text-white'>
                      {bookingSuccessState.serviceName}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.barberLabel}
                    </p>
                    <p className='mt-1 text-sm font-bold text-slate-900 dark:text-white'>
                      {bookingSuccessState.barberName}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.dateLabel}
                    </p>
                    <p className='mt-1 text-sm font-bold text-slate-900 dark:text-white'>
                      {bookingSuccessState.dateLabel}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.timeLabel}
                    </p>
                    <p className='mt-1 text-sm font-bold text-slate-900 dark:text-white'>
                      {bookingSuccessState.timeLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className='lux-subtle-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/74'>
                <Loader2 size={14} className='animate-spin text-brand-gold' />
                {t.bookingSuccessCta}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex min-h-screen flex-col supports-[height:100svh]:min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh]' dir={isRTL ? 'rtl' : 'ltr'}>
        <div className='flex min-h-0 flex-1 flex-col lg:flex-row lg:items-start lg:gap-4 lg:px-4 lg:py-4'>
          <aside className='hidden lg:sticky lg:top-4 lg:flex lg:h-[33rem] lg:w-[18rem] lg:shrink-0 lg:flex-col xl:h-[35rem] xl:w-[18.5rem]'>
            <div
              className='lux-nav-surface box-border flex h-full flex-col overflow-hidden rounded-none px-4 py-4 shadow-[0_20px_44px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_44px_rgba(0,0,0,0.22)]'
            >
              <div className='mb-6 flex items-center justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-gold'>
                    <Sparkles size={11} className='shrink-0' />
                    <span>{t.appointmentBooking}</span>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={handleExitBooking}
                  className='inline-flex min-h-8 w-fit items-center gap-2 rounded-full border border-brand-gold/14 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-brand-gold/30 hover:text-slate-900 dark:border-brand-gold/14 dark:bg-white/6 dark:text-slate-200 dark:hover:text-white'
                >
                  {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                  <span>{lang === 'ar' ? 'خروج' : 'Exit'}</span>
                </button>
              </div>

              <nav className='space-y-3' aria-label={t.appointmentBooking}>
                {stepStates.map((stepItem, index) => {
                  const isPast = step > index;
                  const isActive = step === index;
                  const isEnabled = canNavigateToStep(index);
                  const Icon = stepItem.Icon;

                  return (
                    <button
                      key={stepItem.id}
                      type='button'
                      onClick={() => goToStep(index)}
                      disabled={!isEnabled}
                      aria-current={isActive ? 'step' : undefined}
                      className={`relative flex w-full items-center gap-3 border px-3 py-2.5 text-left transition ${
                        isActive
                          ? 'rounded-[0.35rem] border-brand-gold/20 bg-brand-gold/8 shadow-[0_16px_34px_rgba(212,175,55,0.12)]'
                        : isPast
                            ? 'rounded-[0.35rem] border-brand-gold/16 bg-white/72 dark:bg-white/5'
                            : 'rounded-[0.35rem] border-brand-gold/10 bg-white/56 dark:bg-white/5'
                      } ${!isEnabled ? 'cursor-not-allowed opacity-55' : 'hover:border-brand-gold/28 hover:bg-white/80 dark:hover:bg-white/7'}`}
                    >
                      {isActive ? (
                        <span className='absolute bottom-1.5 left-1 top-1.5 w-[3px] rounded-full bg-brand-gold' aria-hidden='true' />
                      ) : null}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                          isActive || isPast
                            ? 'border-brand-gold bg-brand-gold text-black'
                            : 'border-brand-gold/12 bg-white/80 text-slate-500 dark:bg-white/5 dark:text-slate-300'
                        }`}
                      >
                        {isPast ? <CheckCircle2 size={15} strokeWidth={3} /> : <Icon size={15} />}
                      </div>

                      <div
                        className={`min-w-0 flex-1 self-center ${
                          stepItem.subtitle ? 'space-y-0.5' : ''
                        }`}
                      >
                        <p
                          className={`text-[13px] font-black text-slate-900 dark:text-white xl:text-sm ${
                            stepItem.subtitle ? 'leading-tight' : 'leading-none'
                          }`}
                        >
                          {stepItem.label}
                        </p>
                        {stepItem.subtitle ? (
                          <p className='text-[11px] leading-[1.25] text-slate-500 dark:text-slate-300'>
                            {stepItem.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className='flex min-h-0 flex-1 flex-col'>
            <header className='lux-nav-surface shrink-0 px-4 pb-3 pt-3 lg:hidden'>
              <div className='mx-auto max-w-4xl'>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <button
                    type='button'
                    onClick={handleExitBooking}
                    className='inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-gold/12 bg-white/70 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600 backdrop-blur-xl transition hover:border-brand-gold/30 hover:text-slate-900 dark:border-brand-gold/12 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white'
                  >
                    {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                    <span>{t.exitBooking}</span>
                  </button>

                  <div className='inline-flex items-center gap-2 rounded-full border border-brand-gold/12 bg-white/70 px-3 py-2 text-xs font-bold text-slate-500 backdrop-blur-xl dark:border-brand-gold/12 dark:bg-white/5 dark:text-slate-300'>
                    <span className='uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.remaining}
                    </span>
                    <span className='text-sm font-black text-brand-gold'>
                      {Math.max(3 - userBookingsCount, 0)}
                    </span>
                  </div>
                </div>

                <div className='mb-3 flex items-end justify-between gap-3'>
                  <div className='min-w-0'>
                    <div className='mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-gold'>
                      <Sparkles size={11} className='shrink-0' />
                      <span>{t.appointmentBooking}</span>
                    </div>
                    <h1 className='text-lg font-black text-gray-900 dark:text-white'>
                      {steps[step].label}
                    </h1>
                  </div>
                </div>

                <div className='mb-3 h-1.5 rounded-full bg-brand-gold/10 dark:bg-white/10'>
                  <motion.div
                    animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    className='h-full rounded-full bg-brand-gold'
                  />
                </div>

                {selectionSummary.length > 0 ? (
                  <div className='flex flex-wrap items-center gap-2'>
                    {selectionSummary.slice(-2).map((item) => (
                      <div
                        key={item.label}
                        className='inline-flex min-h-9 items-center gap-2 rounded-full border border-brand-gold/10 bg-white/72 px-3 py-2 text-xs backdrop-blur-xl dark:border-brand-gold/12 dark:bg-white/5'
                      >
                        <span className='font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                          {item.label}
                        </span>
                        <span className='font-bold text-slate-900 dark:text-white'>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </header>

            <main
              ref={scrollContainerRef}
              className='min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:py-5'
            >
              <div className='mx-auto max-w-4xl'>
            <AnimatePresence mode='wait' custom={direction}>
              {step === 0 && (
                <motion.div
                  key='services'
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.22 }}
                >
                  {loadingServices ? (
                    <BookingServicesSkeleton />
                  ) : services.length === 0 ? (
                    <div className='app-surface flex min-h-[280px] flex-col items-center justify-center border-dashed px-5 text-center sm:min-h-[360px]'>
                      <Scissors className='mb-4 text-brand-gold' size={32} />
                      <p className='text-base font-bold text-gray-900 dark:text-white'>
                        {t.noServices}
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2.5'>
                      <div className='flex flex-wrap items-center gap-2'>
                        {servicesRefreshing ? (
                          <span className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/74'>
                            <Loader2 className='animate-spin text-brand-gold' size={12} />
                            {refreshingLabel}
                          </span>
                        ) : null}
                        {serviceCategories.map((category) => {
                          const isActive = serviceCategory === category;
                          const label =
                            category === 'all'
                              ? t.allCategories
                              : getServiceCategoryLabel({ category }, lang, t);

                          return (
                            <button
                              key={category}
                              type='button'
                              onClick={() => setServiceCategory(category)}
                              className={`min-h-8 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                                isActive
                                  ? 'border border-brand-gold/14 bg-brand-gold/14 text-slate-800 dark:border-brand-gold/16 dark:bg-brand-gold/12 dark:text-white'
                                  : 'border border-brand-gold/8 bg-white/38 text-slate-500 hover:border-brand-gold/16 hover:text-slate-700 dark:border-brand-gold/10 dark:bg-white/4 dark:text-white/72 dark:hover:text-white'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {filteredServices.length === 0 ? (
                        <div className='app-surface flex min-h-[200px] flex-col items-center justify-center border-dashed px-5 text-center sm:min-h-[220px]'>
                          <Scissors className='mb-4 text-brand-gold' size={32} />
                          <p className='text-base font-bold text-gray-900 dark:text-white'>
                            {t.noServices}
                          </p>
                        </div>
                      ) : null}

                      <div className='space-y-2.5 sm:hidden'>
                        {filteredServices.map((service) => (
                          <MobileServiceOption
                            key={service._id}
                            service={service}
                            lang={lang}
                            t={t}
                            isSelected={selectedService?._id === service._id}
                            onSelect={() => resetAfterServiceChange(service)}
                          />
                        ))}
                      </div>

                      <div className='hidden gap-2.5 sm:grid sm:grid-cols-2'>
                        {filteredServices.map((service) => (
                          <button
                            key={service._id}
                            type='button'
                            onClick={() => resetAfterServiceChange(service)}
                            className={`group overflow-hidden rounded-[1.25rem] border-2 bg-white/72 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-200 dark:bg-white/5 ${
                              selectedService?._id === service._id
                                ? 'border-brand-gold shadow-lg shadow-brand-gold/10'
                                : 'border-brand-gold/10 hover:-translate-y-0.5 hover:border-brand-gold/30'
                            }`}
                          >
                            <div className='p-2 pb-0'>
                              <div className='relative h-28 overflow-hidden rounded-[1rem] sm:h-36'>
                                {service.image ? (
                                  <img
                                    src={service.image}
                                    alt={getServiceName(service, lang)}
                                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                  />
                                ) : (
                                  <div className='flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,122,0.14),_rgba(15,23,42,0.88)_40%,_rgba(2,6,23,1)_100%)]'>
                                    <div className='flex flex-col items-center gap-2 text-white/75'>
                                      <div className='rounded-full border border-white/12 bg-white/6 p-2.5 backdrop-blur-sm'>
                                        <Scissors className='h-6 w-6 text-brand-gold' />
                                      </div>
                                      <span className='text-[10px] font-black uppercase tracking-[0.24em] text-white/55'>
                                        {getServiceCategoryLabel(service, lang, t)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent' />
                                <div className='absolute inset-x-3 bottom-3 flex items-end justify-between gap-3'>
                                  <div>
                                    <p className='mb-1 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm'>
                                      {getServiceBadgeOrCategoryLabel(service, lang, t.allCategories)}
                                    </p>
                                    <p className='text-[10px] font-black uppercase tracking-[0.22em] text-brand-gold'>
                                      {formatDuration(service.durationMinutes, lang)}
                                    </p>
                                    <h3 className='mt-0.5 text-base font-black text-white sm:text-lg'>
                                      {getServiceName(service, lang)}
                                    </h3>
                                  </div>
                                  <span className='rounded-full bg-white/90 px-2.5 py-1 text-xs font-black text-gray-900 sm:text-sm'>
                                    {formatPrice(service.price, lang)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='p-3 sm:p-3.5'>
                              {getServiceDescription(service, lang, t) ? (
                                <p className='line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-300 sm:text-sm'>
                                  {getServiceDescription(service, lang, t)}
                                </p>
                              ) : null}
                              {((lang === 'ar' ? service.featuresAr : service.features) || []).length > 0 ? (
                                <div className='mt-3 flex flex-wrap gap-2'>
                                  {(lang === 'ar' ? service.featuresAr : service.features)
                                    .slice(0, 2)
                                    .map((feature) => (
                                      <span
                                        key={feature}
                                        className='rounded-full border border-brand-gold/10 bg-white/62 px-2.5 py-1 text-[10px] font-semibold text-slate-600 backdrop-blur-xl dark:border-brand-gold/12 dark:bg-white/5 dark:text-gray-300'
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                </div>
                              ) : null}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key='barbers'
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.22 }}
                  className='space-y-3'
                >
                  {barbersRefreshing && barbers.length > 0 ? (
                    <div>
                      <span className='lux-subtle-button inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-white/74'>
                        <Loader2 className='animate-spin text-brand-gold' size={12} />
                        {refreshingLabel}
                      </span>
                    </div>
                  ) : null}

                  {loadingBarbers ? (
                    <BookingBarbersSkeleton />
                  ) : barbers.length === 0 ? (
                    <div className='app-surface flex min-h-[240px] flex-col items-center justify-center border-dashed px-5 text-center sm:min-h-[320px]'>
                      <UserRound className='mb-4 text-brand-gold' size={32} />
                      <p className='text-base font-bold text-gray-900 dark:text-white'>
                        {t.noBarbersFound}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className='space-y-2.5 sm:hidden'>
                        {visibleBarberOptions.map((barber) => (
                          <MobileBarberOption
                            key={barber._id}
                            barber={barber}
                            lang={lang}
                            t={t}
                            isSelected={selectedBarber?._id === barber._id}
                            onSelect={() => handleBarberSelect(barber)}
                          />
                        ))}
                      </div>

                      <div className='hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3'>
                        {visibleBarberOptions.map((barber) => (
                          <button
                            key={barber._id}
                            type='button'
                            onClick={() => handleBarberSelect(barber)}
                            className={`overflow-hidden rounded-[1.55rem] border-2 bg-white/72 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-200 dark:bg-white/5 ${
                              selectedBarber?._id === barber._id
                                ? 'border-brand-gold shadow-lg shadow-brand-gold/10'
                                : 'border-brand-gold/10 hover:-translate-y-0.5 hover:border-brand-gold/30'
                            }`}
                          >
                            {barber._id === AUTO_BARBER_ID ? (
                              <div className='flex min-h-[16rem] flex-col items-center justify-center p-6 text-center'>
                                <div className='mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-white/8'>
                                  <UserRound className='h-8 w-8 text-slate-500 dark:text-slate-300' />
                                </div>
                                <div className='flex w-full items-start justify-between gap-2 text-left'>
                                  <h3 className='w-full text-center text-lg font-black text-gray-900 dark:text-white'>
                                    {getBarberName(barber, lang)}
                                  </h3>
                                  {selectedBarber?._id === barber._id && (
                                    <CheckCircle2 className='shrink-0 text-brand-gold' size={20} />
                                  )}
                                </div>
                                <p className='mt-2 text-center text-sm leading-6 text-slate-500 dark:text-slate-300'>
                                  {t.autoBarberHint}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className='p-3 pb-0'>
                                  <div className='relative h-80 overflow-hidden rounded-[1.2rem] xl:h-[23rem]'>
                                  <img
                                    src={
                                      barber.image ||
                                      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=870'
                                    }
                                    alt={getBarberName(barber, lang)}
                                    className='h-full w-full object-cover'
                                  />
                                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent' />
                                  <div className='absolute inset-x-4 bottom-4 flex items-end justify-between gap-3'>
                                    <div>
                                      <h3 className='text-xl font-black text-white'>
                                        {getBarberName(barber, lang)}
                                      </h3>
                                    </div>
                                    {selectedBarber?._id === barber._id ? (
                                      <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-black shadow-lg shadow-brand-gold/25'>
                                        <CheckCircle2 size={18} />
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                </div>
                                <div className='p-4'>
                                  <p className='mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400'>
                                    {t.specialties}
                                  </p>
                                  <div className='flex flex-wrap gap-2'>
                                    {(barber.serviceIds || []).map((service) => (
                                      <span
                                        key={service._id}
                                        className='rounded-full border border-brand-gold/10 bg-white/62 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur-xl dark:border-brand-gold/12 dark:bg-white/5 dark:text-gray-300'
                                      >
                                        {getServiceName(service, lang)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key='schedule'
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.22 }}
                  className='space-y-3'
                >
                    <div className='grid gap-3 xl:grid-cols-[1.05fr_0.95fr]'>
                    <div className='app-surface p-3 sm:p-4'>
                      <Calendar
                        onSelectDate={handleDateSelect}
                        lang={lang}
                        bookedDates={[]}
                      />
                    </div>

                    <div className='app-surface p-3 sm:p-4'>
                      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
                        <div>
                          <p className='app-kicker'>{t.timeLabel}</p>
                          <p className='mt-2 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-300 sm:text-sm sm:leading-6'>
                            {t.scheduleHint}
                          </p>
                        </div>
                        {selectedDate ? (
                          <div className='flex flex-wrap gap-2'>
                            <span className='rounded-full bg-brand-gold/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-brand-gold'>
                              {formatLocalizedDate(selectedDate, lang)}
                            </span>
                            {selectedTime ? (
                              <span className='rounded-full border border-brand-gold/18 bg-white/75 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-700 dark:bg-white/5 dark:text-slate-200'>
                                {formatDisplayTime(selectedTime)}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      {!selectedDate ? (
                        <div className='app-surface-muted flex min-h-[180px] flex-col items-center justify-center border-dashed px-5 text-center sm:min-h-[240px]'>
                          <CalendarClock className='mb-4 text-brand-gold' size={32} />
                          <p className='text-sm font-bold text-gray-500 dark:text-gray-400'>
                            {t.noDateSelected}
                          </p>
                        </div>
                      ) : loadingSlots ? (
                        <div className='app-surface-muted flex min-h-[180px] flex-col items-center justify-center px-5 text-center sm:min-h-[240px]'>
                          <Loader2 className='mx-auto mb-4 animate-spin text-brand-gold' size={28} />
                          <p className='text-sm font-bold text-gray-500 dark:text-gray-400'>
                            {t.findingTimes}
                          </p>
                        </div>
                      ) : slots.length === 0 ? (
                        <div className='app-surface-muted flex min-h-[180px] flex-col items-center justify-center px-5 text-center sm:min-h-[240px]'>
                          <CalendarClock className='mx-auto mb-4 text-gray-300 dark:text-gray-600' size={36} />
                          <p className='text-lg font-black text-gray-900 dark:text-white'>
                            {t.noSlotsAvailable}
                          </p>
                          <p className='mx-auto mt-3 max-w-sm text-sm text-gray-500 dark:text-gray-400'>
                            {t.sameDayClosed}
                          </p>
                        </div>
                      ) : (
                        <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3'>
                          {slots.map((slot) => (
                            <button
                              key={slot}
                              type='button'
                              onClick={() => handleTimeSelect(slot)}
                              className={`min-h-11 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                                selectedTime === slot
                                  ? 'border-brand-gold bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                  : 'border-brand-gold/10 bg-white/72 text-gray-700 backdrop-blur-xl hover:border-brand-gold/30 dark:border-brand-gold/12 dark:bg-white/5 dark:text-gray-200'
                              }`}
                            >
                              {formatDisplayTime(slot)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key='confirm'
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.22 }}
                  className='mx-auto max-w-3xl'
                >
                  <div className='app-surface p-4 sm:p-5 lg:p-4.5'>
                    <div className='space-y-4 lg:space-y-3.5'>
                      <div className='overflow-hidden rounded-[1.4rem] border border-brand-gold/10 bg-white/72 backdrop-blur-xl dark:border-brand-gold/12 dark:bg-white/5'>
                        <div className='relative h-[14rem] overflow-hidden lg:h-[17.75rem]'>
                          {selectedService?.image ? (
                            <img
                              src={selectedService.image}
                              alt={getServiceName(selectedService, lang)}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,122,0.14),_rgba(15,23,42,0.88)_40%,_rgba(2,6,23,1)_100%)]'>
                              <Scissors className='h-8 w-8 text-brand-gold' />
                            </div>
                          )}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent' />
                          <div className='absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3 lg:inset-x-5 lg:bottom-4'>
                            <div className='min-w-0'>
                              <p className='text-[10px] font-black uppercase tracking-[0.22em] text-brand-gold'>
                                {t.yourSelection}
                              </p>
                              <h2 className='mt-2 text-xl font-black text-white lg:text-2xl'>
                                {getServiceName(selectedService, lang)}
                              </h2>
                            </div>
                            <div className='shrink-0 rounded-full bg-white/90 px-3.5 py-2 text-sm font-black text-gray-900'>
                              {formatPrice(selectedService?.price, lang)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='grid gap-2.5 sm:grid-cols-2'>
                      {[
                        {
                          icon: <ShieldCheck size={15} className='text-brand-gold' />,
                          label: t.barberLabel,
                          value: isAutoBarberSelection
                            ? t.autoBarberSummary
                            : getBarberName(selectedBarber, lang),
                        },
                        {
                          icon: <CalendarClock size={15} className='text-brand-gold' />,
                          label: t.dateLabel,
                          value: formatLocalizedDate(selectedDate, lang),
                        },
                        {
                          icon: <Clock3 size={15} className='text-brand-gold' />,
                          label: t.timeLabel,
                          value: formatDisplayTime(selectedTime),
                        },
                        {
                          icon: <Scissors size={15} className='text-brand-gold' />,
                          label: t.totalAmount,
                          value: formatPrice(selectedService?.price, lang),
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className='app-surface-muted flex min-h-[4.75rem] flex-col items-start justify-between gap-2 p-3 text-left'
                        >
                          <div className='flex min-w-0 items-center gap-2.5 text-gray-500 dark:text-gray-400'>
                            {item.icon}
                            <span className='text-[10px] font-bold uppercase tracking-[0.16em]'>
                              {item.label}
                            </span>
                          </div>
                          <span className='w-full text-[15px] font-black text-gray-900 dark:text-white'>
                            {item.value}
                          </span>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
              </div>
            </main>

            {step > 0 ? (
              <footer className='shrink-0 px-3 py-2 supports-[padding:max(0px)]:pb-[max(0.65rem,env(safe-area-inset-bottom))] sm:px-4 lg:mx-auto lg:w-full lg:max-w-4xl'>
                <div className='mx-auto flex max-w-4xl items-center justify-between gap-3'>
                  <button
                    type='button'
                    onClick={goBack}
                    className='inline-flex min-h-9 items-center gap-2 rounded-full border border-brand-gold/12 bg-white/70 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-600 backdrop-blur-xl transition hover:border-brand-gold/30 hover:text-slate-900 dark:border-brand-gold/12 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white'
                  >
                    {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    <span>{t.back}</span>
                  </button>

                  {step === steps.length - 1 ? (
                    <button
                      type='button'
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className='lux-button-primary inline-flex min-h-10 items-center justify-center gap-2 rounded-[1.1rem] px-4 py-2.5 text-sm font-black disabled:opacity-70'
                    >
                      {bookingLoading ? (
                        <Loader2 size={16} className='animate-spin' />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {t.confirmBooking}
                    </button>
                  ) : <span className='hidden sm:block' />}
                </div>
              </footer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

