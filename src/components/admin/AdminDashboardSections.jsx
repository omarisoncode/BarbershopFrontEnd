/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Scissors,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react';

import Calendar from '../Calendar';
import { TrashIcon } from '../Icons';
import {
  dashboardGlassPanel,
  dashboardInsetPanelClass,
} from '../dashboard/dashboardTheme';
import { getBusinessDateKey } from '../../utils/businessDate';
import { getLocalizedCategoryLabel } from '../../utils/serviceCategories';
import { localizeDigits } from '../../utils/localizeDigits';

const MotionDiv = motion.div;

export const dayLabels = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

export const tabIcons = {
  overview: TrendingUp,
  bookings: CalendarClock,
  catalog: Scissors,
  team: Users,
  customers: UserRound,
};

export const glassPanel = dashboardGlassPanel;

export const mutedPanel = dashboardInsetPanelClass;
export const AUTO_BARBER_SELECTION_ID = 'auto-barber';
export const mobileWorkspaceScrollClass =
  'max-h-[calc(100vh-15.5rem)] overflow-y-auto pr-1 lg:max-h-none';

export const inputClass =
  'admin-form-input w-full rounded-[1rem] border border-brand-gold/12 bg-white/72 px-3.5 py-3 text-base text-slate-900 caret-slate-900 shadow-[0_16px_38px_rgba(15,23,42,0.04)] backdrop-blur-xl transition placeholder:text-slate-400 focus:border-brand-gold/42 focus:bg-white focus:outline-none dark:border-brand-gold/14 dark:bg-slate-950/70 dark:text-white dark:caret-white dark:placeholder:text-white/38 dark:focus:border-brand-gold/34 sm:text-sm [color-scheme:light] dark:[color-scheme:dark]';

const timeFieldClass =
  `${inputClass} px-3 py-2.5 text-sm`;

const hourOptions = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
const minuteOptions = Array.from({ length: 12 }, (_, step) => String(step * 5).padStart(2, '0'));

const splitTimeValue = (value) => {
  if (!value) return { hour: '', minute: '' };

  const [hour = '', minute = ''] = String(value).split(':');
  return {
    hour: /^\d{2}$/.test(hour) ? hour : '',
    minute: /^\d{2}$/.test(minute) ? minute : '',
  };
};

const joinTimeValue = (hour, minute, allowEmpty = false) => {
  if (allowEmpty && !hour && !minute) return '';
  if (!hour || !minute) return '';
  return `${hour}:${minute}`;
};

const formatScheduleRange = (entry) => {
  if (!entry?.enabled || !entry.startTime || !entry.endTime) return null;
  const breakRange =
    entry.breakStart && entry.breakEnd ? ` • ${entry.breakStart}-${entry.breakEnd}` : '';
  return `${entry.startTime}-${entry.endTime}${breakRange}`;
};

const ScheduleTimeSelect = ({ value, onChange, allowEmpty = false, labels }) => {
  const { hour, minute } = splitTimeValue(value);

  const updateHour = (nextHour) => {
    onChange(joinTimeValue(nextHour, minute || (allowEmpty && !nextHour ? '' : '00'), allowEmpty));
  };

  const updateMinute = (nextMinute) => {
    onChange(joinTimeValue(hour || (allowEmpty && !nextMinute ? '' : '00'), nextMinute, allowEmpty));
  };

  return (
    <div className='mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2'>
      <select
        value={hour}
        onChange={(event) => updateHour(event.target.value)}
        className={timeFieldClass}
      >
        {allowEmpty ? <option value=''>{labels.empty}</option> : null}
        {hourOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        value={minute}
        onChange={(event) => updateMinute(event.target.value)}
        className={timeFieldClass}
      >
        {allowEmpty ? <option value=''>{labels.empty}</option> : null}
        {minuteOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const useBodyScrollLock = (locked) => {
  useEffect(() => {
    if (!locked) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
};

const buildDefaultSchedule = () =>
  Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    enabled: dayOfWeek !== 0,
    startTime: '10:00',
    endTime: '22:00',
    breakStart: '',
    breakEnd: '',
  }));

export const createServiceState = () => ({
  slug: '',
  name: '',
  nameAr: '',
  category: '',
  categoryAr: '',
  badge: '',
  badgeAr: '',
  featuresText: '',
  featuresArText: '',
  description: '',
  descriptionAr: '',
  price: '',
  durationMinutes: '',
  image: '',
  active: true,
});

export const createBarberState = () => ({
  name: '',
  nameAr: '',
  bio: '',
  bioAr: '',
  image: '',
  experienceYears: '',
  serviceIds: [],
  isActive: true,
  daysOffText: '',
  workingHours: buildDefaultSchedule(),
});

export const normalizeArabicDigits = (value) =>
  String(value || '')
    .replace(/[\u0660-\u0669]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[\u06F0-\u06F9]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));

export const sanitizeNumericInput = (value) =>
  normalizeArabicDigits(value).replace(/[^\d.]/g, '');

export const parseNumericValue = (value, fallback = 0) => {
  const parsed = Number(sanitizeNumericInput(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const formatNumber = (value, lang) =>
  new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US').format(Number(value || 0));

export const formatPrice = (value, lang) => {
  const numericValue = Number(value || 0);
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US', {
    minimumFractionDigits: Number.isInteger(numericValue) ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(numericValue);
  return lang === 'ar' ? `${formatted} د.ك` : `KD ${formatted}`;
};

export const formatDuration = (value, lang) =>
  lang === 'ar' ? `${formatNumber(value, lang)} دقيقة` : `${formatNumber(value, lang)} min`;

export const formatDateTime = (date, time, lang, businessDate = '') => {
  const safeDate = businessDate
    ? new Date(`${businessDate}T12:00:00`)
    : new Date(date);
  if (Number.isNaN(safeDate.getTime())) return time || '';
  return `${safeDate.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} • ${time}`;
};

export const getLocalizedName = (item, lang) =>
  lang === 'ar' ? item.nameAr || item.name : item.name;

const hasValue = (value) => String(value || '').trim().length > 0;

const isServiceHomepageReady = (service) =>
  hasValue(service?.name) &&
  hasValue(service?.nameAr) &&
  hasValue(service?.image) &&
  parseNumericValue(service?.price, 0) > 0 &&
  parseNumericValue(service?.durationMinutes, 0) > 0;

const getServiceQualityFlags = (service, lang = 'en') => {
  const flags = [];

  if (!hasValue(service?.image)) {
    flags.push({
      id: 'missing-image',
      tone: 'warning',
      label: lang === 'ar' ? 'الصورة مفقودة' : 'Missing image',
    });
  }

  if (!hasValue(service?.nameAr) || !hasValue(service?.descriptionAr)) {
    flags.push({
      id: 'missing-ar',
      tone: 'muted',
      label: lang === 'ar' ? 'النسخة العربية غير مكتملة' : 'Missing Arabic copy',
    });
  }

  if (service?.active === false) {
    flags.push({
      id: 'inactive',
      tone: 'muted',
      label: lang === 'ar' ? 'مخفي من الصفحة الرئيسية' : 'Hidden from homepage',
    });
  } else if (isServiceHomepageReady(service)) {
    flags.push({
      id: 'ready',
      tone: 'success',
      label: lang === 'ar' ? 'جاهز للصفحة الرئيسية' : 'Ready for homepage',
    });
  } else {
    flags.push({
      id: 'incomplete',
      tone: 'warning',
      label: lang === 'ar' ? 'يحتاج إلى محتوى عام' : 'Needs public content',
    });
  }

  return flags;
};

const isBarberHomepageReady = (barber) =>
  hasValue(barber?.name) &&
  hasValue(barber?.image) &&
  Array.isArray(barber?.serviceIds) &&
  barber.serviceIds.length > 0;

const getBarberQualityFlags = (barber, lang = 'en') => {
  const flags = [];

  if (!hasValue(barber?.image)) {
    flags.push({
      id: 'missing-image',
      tone: 'warning',
      label: lang === 'ar' ? 'الصورة مفقودة' : 'Missing image',
    });
  }

  if (!hasValue(barber?.nameAr) || !hasValue(barber?.bioAr)) {
    flags.push({
      id: 'missing-ar',
      tone: 'muted',
      label: lang === 'ar' ? 'النسخة العربية غير مكتملة' : 'Missing Arabic copy',
    });
  }

  if (!Array.isArray(barber?.serviceIds) || barber.serviceIds.length === 0) {
    flags.push({
      id: 'missing-services',
      tone: 'warning',
      label: lang === 'ar' ? 'الخدمات غير معيّنة' : 'Missing service assignment',
    });
  }

  if (barber?.isActive === false) {
    flags.push({
      id: 'inactive',
      tone: 'muted',
      label: lang === 'ar' ? 'مخفي من الصفحة الرئيسية' : 'Hidden from homepage',
    });
  } else if (isBarberHomepageReady(barber)) {
    flags.push({
      id: 'ready',
      tone: 'success',
      label: lang === 'ar' ? 'جاهز للصفحة الرئيسية' : 'Ready for homepage',
    });
  } else {
    flags.push({
      id: 'incomplete',
      tone: 'warning',
      label: lang === 'ar' ? 'يحتاج إلى محتوى عام' : 'Needs public content',
    });
  }

  return flags;
};

const qualityBadgeClass = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  muted:
    'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
};

export const getLocalizedDescription = (item, lang, fallback) =>
  lang === 'ar'
    ? item.descriptionAr || item.description || fallback
    : item.description || item.descriptionAr || fallback;

export const getLocalizedBio = (item, lang, fallback) =>
  lang === 'ar' ? item.bioAr || item.bio || fallback : item.bio || item.bioAr || fallback;

const getLocalizedServiceLabel = (item, lang, fallback = '') => {
  if (!item) return fallback;
  return lang === 'ar'
    ? item.serviceAr || item.nameAr || item.service || item.name || fallback
    : item.service || item.name || item.serviceAr || item.nameAr || fallback;
};

const formatPhoneDisplay = (phone, countryCode = '+965', lang = 'en') => {
  if (!phone) {
    return lang === 'ar' ? 'غير متوفر' : 'N/A';
  }

  return localizeDigits(`${countryCode} ${phone}`, lang);
};

const formatCustomerIdDisplay = (customerId, lang = 'en', fallback = 'N/A') =>
  customerId ? localizeDigits(customerId, lang) : fallback;

export const MetricCard = ({ icon, label, value, accent }) => {
  const RenderIcon = icon;

  return (
    <div className={`rounded-[0.85rem] p-4 ${glassPanel}`}>
      <div className='flex items-start gap-3.5'>
        <div className={`rounded-[0.75rem] bg-linear-to-br p-2.5 text-slate-900 ${accent} dark:text-white`}>
          <RenderIcon size={17} />
        </div>
        <div className='min-w-0'>
          <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
            {label}
          </p>
          <p className='mt-2 text-[1.95rem] font-black leading-none text-slate-900 dark:text-white'>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export const SectionShell = ({ title, subtitle, children, right, compact = false }) => (
  <section className={`rounded-[0.9rem] ${compact ? 'p-4 sm:p-4' : 'p-4.5 sm:p-4.5'} ${glassPanel}`}>
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${
        compact ? 'mb-3 pb-3' : 'mb-3.5 pb-3.5'
      }`}
      style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.16)' }}
    >
      <div>
        <h2 className='text-[1rem] font-black text-slate-900 dark:text-white sm:text-[1.06rem]'>
          {title}
        </h2>
        {subtitle ? (
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-300'>
            {subtitle}
          </p>
        ) : null}
      </div>
      {right}
    </div>
    {children}
  </section>
);

export const AdminSubviewTabs = ({ activeView, tabs, onChange, columns = 2 }) => (
  <div
    className={`sticky top-2 z-20 grid w-full gap-2 rounded-[1.1rem] bg-[#f5efe4]/92 p-2 shadow-[0_16px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-[#0b0908]/92 sm:static sm:w-auto sm:bg-transparent sm:p-0 sm:shadow-none ${
      columns === 3 ? 'sm:grid-cols-3' : columns === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'
    }`}
  >
    {tabs.map((tab) => {
      const Icon = tab.icon;

      return (
        <button
          key={tab.id}
          type='button'
          onClick={() => onChange(tab.id)}
          className={`flex min-h-[3.2rem] items-center gap-2.5 rounded-[1rem] border px-4 py-3 text-left text-sm font-black transition ${
            activeView === tab.id
              ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              activeView === tab.id
                ? 'bg-white/16 text-white dark:bg-slate-900 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Icon size={15} />
          </span>
          <span className='min-w-0 truncate'>{tab.label}</span>
        </button>
      );
    })}
  </div>
);

export const AdminSubviewIntro = ({ title, description }) => (
  <div className='mb-2.5 border-b border-slate-200/80 pb-2 dark:border-slate-800'>
    <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
      {title}
    </p>
    <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300'>{description}</p>
  </div>
);

export const AdminPagination = ({
  page = 1,
  totalPages = 1,
  onChange,
  className = '',
  previousLabel = 'Previous',
  nextLabel = 'Next',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <button
        type='button'
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page <= 1}
        className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
      >
        {previousLabel}
      </button>
      <p className='text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
        {`${page} / ${totalPages}`}
      </p>
      <button
        type='button'
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page >= totalPages}
        className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
      >
        {nextLabel}
      </button>
    </div>
  );
};

export const MiniBarChart = ({ title, items, lang }) => {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className={`rounded-[1.35rem] p-4 sm:p-5 ${mutedPanel}`}>
      <h3 className='text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300'>
        {title}
      </h3>
      <div className='mt-5 space-y-4'>
        {items.map((item) => (
          <div key={item.label}>
            <div className='mb-2 flex items-center justify-between gap-3 text-sm'>
              <span className='truncate font-bold text-slate-800 dark:text-white'>
                {item.label}
              </span>
              <span className='text-slate-500 dark:text-slate-300'>
                {formatNumber(item.count, lang)}
              </span>
            </div>
            <div className='h-2 rounded-full bg-slate-200 dark:bg-slate-800'>
              <div
                className='h-full rounded-full bg-linear-to-r from-slate-700 to-slate-400 dark:from-slate-300 dark:to-slate-500'
                style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SparklineChart = ({ title, items, lang }) => {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className={`rounded-[1.35rem] p-4 sm:p-5 ${mutedPanel}`}>
      <h3 className='text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300'>
        {title}
      </h3>
      <div className='mt-6 pb-2'>
        <div className='grid grid-cols-7 gap-2 sm:gap-3'>
          {items.map((item) => (
            <div key={item.label} className='flex flex-col items-center gap-3'>
              <div className='flex h-28 items-end sm:h-32'>
                <div
                  className='w-4 rounded-t-xl bg-linear-to-t from-slate-800 via-slate-500 to-slate-300 shadow-[0_10px_24px_rgba(15,23,42,0.14)] dark:from-slate-200 dark:via-slate-400 dark:to-slate-600 sm:w-8'
                  style={{ height: `${Math.max((item.count / max) * 100, item.count ? 18 : 6)}%` }}
                />
              </div>
              <span className='text-xs font-bold text-slate-500 dark:text-slate-300'>
                {item.label}
              </span>
              <span className='text-xs text-slate-400 dark:text-slate-500'>
                {formatNumber(item.count, lang)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ActivityCard = ({ item, lang }) => (
  <div className={`rounded-[1.25rem] p-4 ${mutedPanel}`}>
    <div className='flex items-start gap-3'>
      <div className='rounded-xl bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
        {item.type === 'booking.created' ? <BellRing size={18} /> : <CalendarClock size={18} />}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-bold text-slate-900 dark:text-white'>{item.message}</p>
        <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300'>
          {item.booking?.service || ''}
          {item.booking?.barberName ? ` • ${item.booking.barberName}` : ''}
        </p>
        <p className='mt-2 text-xs text-slate-400 dark:text-slate-500'>
          {item.booking?.date
            ? formatDateTime(
                item.booking.date,
                item.booking.time,
                lang,
                item.booking.businessDate || '',
              )
            : new Date(item.timestamp).toLocaleString(lang === 'ar' ? 'ar-KW' : 'en-US')}
        </p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status, t }) => {
  const tone =
    status === 'completed'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : status === 'no_show'
        ? 'border-red-500/20 bg-red-500/10 text-red-600'
        : status === 'cancelled'
          ? 'border-slate-300/80 bg-slate-200/65 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-200';

  const labelMap = {
    active: t.statusActive,
    cancelled: t.statusCancelled,
    completed: t.statusCompleted,
    no_show: t.statusNoShow,
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone}`}
    >
      {labelMap[status] || status}
    </span>
  );
};

export const ConfirmModal = ({ state, onClose, onConfirm, busy, t }) => {
  useBodyScrollLock(Boolean(state));

  if (!state) return null;

  const tone =
    state.intent === 'logout'
      ? {
          icon: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
          button:
            'border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
          iconNode: <LogOut size={22} />,
        }
      : state.intent === 'success'
      ? {
          icon: 'bg-emerald-500/10 text-emerald-500',
          button: 'bg-emerald-500 text-white hover:bg-emerald-400',
          iconNode: <ShieldAlert size={22} />,
        }
      : state.intent === 'warning'
        ? {
          icon: 'bg-amber-500/12 text-amber-500',
          button: 'bg-amber-400 text-black hover:bg-amber-300',
          iconNode: <ShieldAlert size={22} />,
        }
        : {
            icon: 'bg-red-500/10 text-red-500',
            button: 'bg-red-500 text-white hover:bg-red-400',
            iconNode: <ShieldAlert size={22} />,
          };

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md'
        onClick={() => !busy && onClose()}
      >
        <MotionDiv
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 12 }}
          onClick={(event) => event.stopPropagation()}
          role='dialog'
          aria-modal='true'
          className={`my-auto w-full max-w-md rounded-[2rem] p-6 ${glassPanel}`}
        >
          <div className='mb-5 flex items-start justify-between gap-4'>
            <div className={`rounded-2xl p-3 ${tone.icon}`}>
              {tone.iconNode}
            </div>
            <button
              type='button'
              onClick={onClose}
              disabled={busy}
              className='rounded-full border border-white/40 bg-white/70 p-2 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            >
              <X size={16} />
            </button>
          </div>

          <h3 className='text-xl font-black text-slate-900 dark:text-white'>{state.title}</h3>
          <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>
            {state.message}
          </p>

          <div className='mt-6 flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={busy}
              className='flex-1 rounded-2xl border border-white/55 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
            >
              {state.cancelLabel || t.keepButton}
            </button>
            <button
              type='button'
              onClick={onConfirm}
              disabled={busy}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-60 ${tone.button}`}
            >
              {busy ? `${state.confirmLabel || t.confirmButton}...` : state.confirmLabel || t.confirmButton}
            </button>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};


export const BookingCard = ({
  booking,
  lang,
  t,
  onStatusChange,
  onDelete,
  onReschedule,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasPhone = Boolean(booking.user?.phone);
  const hasEmail = Boolean(booking.user?.email);
  const detailsToggleLabel = detailsOpen
    ? lang === 'ar'
      ? 'إخفاء التفاصيل'
      : 'Hide details'
    : lang === 'ar'
      ? 'عرض التفاصيل'
      : 'View details';

  return (
  <div className={`rounded-[1.45rem] p-4 sm:p-5 ${glassPanel}`}>
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]'>
      <div className='min-w-0'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-3'>
              <p className='truncate text-base font-black text-slate-900 dark:text-white sm:text-lg'>
                {booking.user?.name || booking.customerName}
              </p>
              <StatusBadge status={booking.status} t={t} />
              {booking.source === 'admin' ? (
                <span className='rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-200'>
                  {t.adminDeskBooking || 'Booked by admin'}
                </span>
              ) : null}
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
                {getLocalizedServiceLabel(booking, lang, booking.service)}
              </span>
              <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                {booking.barber?.name || booking.barberName}
              </span>
            </div>
            <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-300'>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${mutedPanel}`}>
                <UserRound size={13} />
                {formatCustomerIdDisplay(booking.user?.customerId, lang, lang === 'ar' ? 'غير متوفر' : 'N/A')}
              </span>
              <button
                type='button'
                onClick={() => setDetailsOpen((current) => !current)}
                className='inline-flex items-center gap-2 rounded-full border border-brand-gold/16 bg-white/72 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition hover:border-brand-gold/26 hover:text-brand-gold dark:border-brand-gold/16 dark:bg-white/5 dark:text-slate-200 dark:hover:text-brand-gold-soft'
              >
                {detailsToggleLabel}
                {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          <div
            className={`inline-flex min-h-[2.8rem] items-center gap-3 rounded-[1.05rem] px-4 py-2.5 text-sm font-semibold text-slate-700 ${mutedPanel}`}
          >
            <CalendarClock size={16} className='text-slate-500 dark:text-slate-300' />
            <span>{formatDateTime(booking.date, booking.time, lang, booking.businessDate || '')}</span>
          </div>
        </div>

        {detailsOpen ? (
          <>
            <div className='mt-4 grid gap-2 lg:grid-cols-2'>
              {hasPhone ? (
                <a
                  href={`tel:${booking.user?.countryCode || '+965'}${booking.user?.phone || ''}`}
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-200 ${mutedPanel}`}
                >
                  <Phone size={15} />
                  <span className='truncate'>
                    {formatPhoneDisplay(booking.user.phone, booking.user?.countryCode || '+965', lang)}
                  </span>
                </a>
              ) : (
                <span
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 dark:text-slate-500 ${mutedPanel}`}
                >
                  <Phone size={15} />
                  <span className='truncate'>{lang === 'ar' ? 'غير متوفر' : 'N/A'}</span>
                </span>
              )}
              {hasEmail ? (
                <a
                  href={`mailto:${booking.user.email}`}
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-200 ${mutedPanel}`}
                >
                  <Mail size={15} />
                  <span className='truncate'>{booking.user.email}</span>
                </a>
              ) : (
                <span
                  className={`inline-flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 dark:text-slate-500 ${mutedPanel}`}
                >
                  <Mail size={15} />
                  <span className='truncate'>N/A</span>
                </span>
              )}
            </div>

            <NotificationStatusGrid summary={booking.notificationSummary} lang={lang} />
          </>
        ) : null}
      </div>

      <div className={`rounded-[1.2rem] p-3 ${mutedPanel}`}>
        <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-1'>
          {booking.status === 'active' ? (
            <>
              <button
                type='button'
                onClick={() => onReschedule(booking)}
                className='inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white dark:bg-white dark:text-slate-900'
              >
                {t.rescheduleBooking}
              </button>
              <button
                type='button'
                onClick={() => onStatusChange(booking, 'completed')}
                className='inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
              >
                {t.markCompleted}
              </button>
              <button
                type='button'
                onClick={() => onStatusChange(booking, 'no_show')}
                className='inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300'
              >
                {t.markNoShow}
              </button>
              <button
                type='button'
                onClick={() => onStatusChange(booking, 'cancelled')}
                className='inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
              >
                {t.cancelBooking}
              </button>
            </>
          ) : null}
          <button
            type='button'
            onClick={() => onDelete(booking)}
            className='inline-flex min-h-[2.9rem] w-full items-center justify-center rounded-xl border border-red-200/80 bg-transparent px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/20'
          >
            {t.deleteBooking}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

const notificationTypeLabels = {
  booking_confirmed: {
    en: 'Confirmation',
    ar: 'التأكيد',
  },
  reminder_24h: {
    en: '24h reminder',
    ar: 'تذكير 24 ساعة',
  },
  reminder_2h: {
    en: '2h reminder',
    ar: 'تذكير ساعتين',
  },
};

const notificationChannelLabels = {
  email: {
    en: 'Email',
    ar: 'البريد',
  },
  whatsapp: {
    en: 'WhatsApp',
    ar: 'واتساب',
  },
};

const notificationStatusCopy = {
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  sent: { en: 'Sent', ar: 'تم الإرسال' },
  failed: { en: 'Failed', ar: 'فشل' },
  skipped: { en: 'Skipped', ar: 'تم التخطي' },
  cancelled: { en: 'Cancelled', ar: 'أُلغي' },
};

const notificationStatusClass = {
  pending:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300',
  sent:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300',
  failed:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300',
  skipped:
    'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
  cancelled:
    'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
};

const formatNotificationMoment = (value, lang) => {
  if (!value) return '';

  const safeDate = new Date(value);
  if (Number.isNaN(safeDate.getTime())) return '';

  return safeDate.toLocaleString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const NotificationStatusGrid = ({ summary, lang }) => {
  const [expandedType, setExpandedType] = useState(null);
  const sections = ['booking_confirmed', 'reminder_24h', 'reminder_2h']
    .map((type) => ({
      type,
      label: notificationTypeLabels[type]?.[lang] || notificationTypeLabels[type]?.en,
      channels: ['email', 'whatsapp']
        .map((channel) => {
          const state = summary?.[type]?.[channel];
          if (!state) return null;

          return {
            channel,
            label:
              notificationChannelLabels[channel]?.[lang] ||
              notificationChannelLabels[channel]?.en,
            status: state.status || 'pending',
            attempts: state.attempts || 0,
            sentAt: state.sentAt || null,
            scheduledFor: state.scheduledFor || null,
            lastError: state.lastError || '',
          };
        })
        .filter(Boolean),
    }))
    .filter((section) => section.channels.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 rounded-[1.2rem] p-3 ${mutedPanel}`}>
      <div className='mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
        <BellRing size={14} />
        <span>{lang === 'ar' ? 'حالة الإشعارات' : 'Notification status'}</span>
      </div>
      <div className='grid gap-3 lg:grid-cols-3'>
        {sections.map((section) => (
          <button
            key={section.type}
            type='button'
            onClick={() =>
              setExpandedType((current) =>
                current === section.type ? null : section.type,
              )
            }
            className='rounded-[1rem] border border-slate-200/80 bg-white/75 p-3 text-left transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
          >
            <p className='text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400'>
              {section.label}
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {section.channels.map((entry) => (
                <span
                  key={`${section.type}-${entry.channel}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${
                    notificationStatusClass[entry.status] ||
                    notificationStatusClass.pending
                  }`}
                >
                  <span>{entry.label}</span>
                  <span>
                    {notificationStatusCopy[entry.status]?.[lang] ||
                      notificationStatusCopy[entry.status]?.en ||
                      entry.status}
                  </span>
                </span>
              ))}
            </div>
            <p className='mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400'>
              {expandedType === section.type
                ? lang === 'ar'
                  ? 'إخفاء التفاصيل'
                  : 'Hide details'
                : lang === 'ar'
                  ? 'عرض التفاصيل'
                  : 'View details'}
            </p>
            {expandedType === section.type ? (
              <div className='mt-3 grid gap-2'>
                {section.channels.map((entry) => (
                  <div
                    key={`${section.type}-${entry.channel}-details`}
                    className='rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5 dark:border-slate-800 dark:bg-slate-900/80'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-xs font-bold text-slate-700 dark:text-slate-200'>
                        {entry.label}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                          notificationStatusClass[entry.status] ||
                          notificationStatusClass.pending
                        }`}
                      >
                        {notificationStatusCopy[entry.status]?.[lang] ||
                          notificationStatusCopy[entry.status]?.en ||
                          entry.status}
                      </span>
                    </div>
                    <div className='mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400'>
                      {entry.sentAt || entry.scheduledFor ? (
                        <p>
                          {lang === 'ar' ? 'الوقت: ' : 'Time: '}
                          {formatNotificationMoment(entry.sentAt || entry.scheduledFor, lang)}
                        </p>
                      ) : null}
                      <p>
                        {lang === 'ar' ? 'المحاولات: ' : 'Attempts: '}
                        {entry.attempts}
                      </p>
                      {entry.lastError ? (
                        <p className='text-red-600 dark:text-red-300'>{entry.lastError}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

const FieldShell = ({ label, hint = '', className = '', children }) => (
  <label className={`block min-w-0 ${className}`}>
    <span className='mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
      {label}
    </span>
    {children}
    {hint ? (
      <span className='mt-2 block text-xs leading-5 text-slate-500 dark:text-slate-400'>
        {hint}
      </span>
    ) : null}
  </label>
);

const FormSectionCard = ({ title, description = '', children }) => (
  <div className={`rounded-[1.15rem] border p-4 ${mutedPanel}`}>
    <div className='mb-4'>
      <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
        {title}
      </p>
      {description ? (
        <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>{description}</p>
      ) : null}
    </div>
    {children}
  </div>
);

const ModalShell = ({ open, onClose, title, children }) => {
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-[95] flex overflow-y-auto overscroll-contain bg-slate-950/45 p-4 backdrop-blur-md sm:items-center sm:justify-center'
        onClick={onClose}
      >
        <MotionDiv
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 12 }}
          onClick={(event) => event.stopPropagation()}
          role='dialog'
          aria-modal='true'
          className={`my-auto w-full max-w-3xl overflow-hidden rounded-[2rem] p-5 sm:max-h-[calc(100vh-3rem)] sm:p-6 ${glassPanel}`}
        >
          <div className='mb-5 flex items-start justify-between gap-4'>
            <div>
              <h3 className='text-xl font-black text-slate-900 dark:text-white'>{title}</h3>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='rounded-full border border-white/40 bg-white/70 p-2 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            >
              <X size={16} />
            </button>
          </div>
          <div className='max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 sm:max-h-[calc(100vh-12rem)]'>
            {children}
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};

export const AdminRescheduleModal = ({
  open,
  booking,
  t,
  lang,
  form,
  slots,
  loadingSlots,
  submitting,
  onClose,
  onDateChange,
  onTimeChange,
  onSubmit,
}) => {
  if (!booking) return null;

  const currentSlotLabel = formatDateTime(
    booking.date,
    booking.time,
    lang,
    booking.businessDate || '',
  );

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${t.rescheduleTitle}: ${booking.user?.name || booking.customerName}`}
    >
      <form onSubmit={onSubmit} className='grid gap-5 xl:grid-cols-[0.85fr_1.15fr] xl:items-start'>
        <div className='rounded-[1.8rem] border border-white/55 bg-white/72 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/5'>
          <p className='text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300'>
            {t.currentSlot}
          </p>
          <h4 className='mt-3 text-lg font-black text-slate-900 dark:text-white'>
            {getLocalizedServiceLabel(booking, lang, booking.service)}
          </h4>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
            {booking.barber?.name || booking.barberName}
          </p>
          <p className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
            {currentSlotLabel}
          </p>
          <p className='mt-4 text-sm leading-7 text-slate-500 dark:text-slate-300'>
            {t.rescheduleSubtitle}
          </p>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-black text-slate-900 dark:text-white'>
              {t.rescheduleDate}
            </label>
            <div className='overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-950/45'>
              <Calendar
                onSelectDate={onDateChange}
                lang={lang}
                bookedDates={[]}
                selectedDateString={form.date}
                initialDateString={form.date || getBusinessDateKey(new Date())}
              />
            </div>
          </div>

          <div>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <p className='text-sm font-black text-slate-900 dark:text-white'>
                {t.availableTimes}
              </p>
              {loadingSlots ? (
                <span className='text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                  {t.slotsLoading}
                </span>
              ) : null}
            </div>

            {loadingSlots ? (
              <div
                className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {t.slotsLoading}
              </div>
            ) : slots.length === 0 ? (
              <div
                className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {t.noSlotsAvailable}
              </div>
            ) : (
              <div className='max-h-72 overflow-y-auto pr-1'>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type='button'
                    onClick={() => onTimeChange(slot)}
                    className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                      form.time === slot
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border border-white/55 bg-white/80 text-slate-700 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-end pt-2'>
            <button
              type='submit'
              disabled={submitting || !form.date || !form.time}
              className='inline-flex min-h-[3.15rem] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
            >
              {submitting ? <Loader2 size={16} className='animate-spin' /> : null}
              {t.rescheduleSave}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

const ServiceForm = ({ t, lang, form, onInput, onSubmit, submitting, submitLabel }) => {
  const canSubmit =
    form.name.trim() &&
    form.nameAr.trim() &&
    form.slug.trim() &&
    parseNumericValue(form.price, 0) > 0 &&
    parseNumericValue(form.durationMinutes, 0) > 0 &&
    (!form.active || (form.image.trim() && form.descriptionAr.trim()));

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <FormSectionCard title={lang === 'ar' ? 'الأساسيات' : 'Core details'}>
        <div className='grid gap-4 lg:grid-cols-2'>
          <FieldShell label={t.englishName}>
            <input value={form.name} onChange={(event) => onInput('name', event.target.value)} placeholder={t.englishName} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.arabicName}>
            <input value={form.nameAr} onChange={(event) => onInput('nameAr', event.target.value)} placeholder={t.arabicName} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.slug}>
            <input value={form.slug} onChange={(event) => onInput('slug', event.target.value)} placeholder={t.slug} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.category}>
            <input value={form.category} onChange={(event) => onInput('category', event.target.value)} placeholder={t.category} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.categoryAr}>
            <input value={form.categoryAr} onChange={(event) => onInput('categoryAr', event.target.value)} placeholder={t.categoryAr} className={inputClass} />
          </FieldShell>
        </div>
      </FormSectionCard>

      <FormSectionCard title={lang === 'ar' ? 'العرض العام' : 'Public presentation'}>
        <div className='grid gap-4 lg:grid-cols-2'>
          <FieldShell label={t.image}>
            <input value={form.image} onChange={(event) => onInput('image', event.target.value)} placeholder={t.image} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.badge}>
            <input value={form.badge} onChange={(event) => onInput('badge', event.target.value)} placeholder={t.badge} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.badgeAr}>
            <input value={form.badgeAr} onChange={(event) => onInput('badgeAr', event.target.value)} placeholder={t.badgeAr} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.price}>
            <input type='text' inputMode='decimal' value={form.price} onChange={(event) => onInput('price', event.target.value)} placeholder={t.price} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.duration}>
            <input type='text' inputMode='numeric' value={form.durationMinutes} onChange={(event) => onInput('durationMinutes', event.target.value)} placeholder={t.duration} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.features} className='md:col-span-2'>
            <textarea value={form.featuresText} onChange={(event) => onInput('featuresText', event.target.value)} placeholder={t.features} className={`${inputClass} min-h-20`} />
          </FieldShell>
          <FieldShell label={t.featuresAr} className='md:col-span-2'>
            <textarea value={form.featuresArText} onChange={(event) => onInput('featuresArText', event.target.value)} placeholder={t.featuresAr} className={`${inputClass} min-h-20`} />
          </FieldShell>
        </div>
      </FormSectionCard>

      <FormSectionCard title={lang === 'ar' ? 'النصوص' : 'Descriptions'}>
        <div className='grid gap-4'>
          <FieldShell label={t.description}>
            <textarea value={form.description} onChange={(event) => onInput('description', event.target.value)} placeholder={t.description} className={`${inputClass} min-h-24`} />
          </FieldShell>
          <FieldShell label={t.descriptionAr}>
            <textarea value={form.descriptionAr} onChange={(event) => onInput('descriptionAr', event.target.value)} placeholder={t.descriptionAr} className={`${inputClass} min-h-24`} />
          </FieldShell>
        </div>
      </FormSectionCard>
      <div className='pt-2'>
        <label className='inline-flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200'>
          <input type='checkbox' checked={form.active} onChange={(event) => onInput('active', event.target.checked)} className='h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:text-slate-100 dark:focus:ring-slate-600' />
          {t.active}
        </label>
      </div>
      <div className='pt-2'>
        <button type='submit' disabled={submitting || !canSubmit} className='admin-submit-button inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'>
          {submitting ? <Loader2 size={16} className='animate-spin' /> : null}
          <span className='admin-submit-label'>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

const BarberForm = ({
  t,
  lang,
  form,
  services,
  onInput,
  onToggleService,
  onUpdateSchedule,
  onSubmit,
  submitting,
  submitLabel,
}) => {
  const timeSelectLabels = {
    empty: lang === 'ar' ? 'لا يوجد' : '--',
  };
  const canSubmit =
    form.name.trim() &&
    form.serviceIds.length > 0 &&
    form.workingHours.every((entry) => !entry.enabled || (entry.startTime && entry.endTime)) &&
    (!form.isActive || (form.image.trim() && form.nameAr.trim() && form.bioAr.trim()));

  return (
    <form onSubmit={onSubmit} className='space-y-5'>
      <FormSectionCard title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}>
        <div className='grid gap-4 lg:grid-cols-2'>
          <FieldShell label={t.englishName}>
            <input value={form.name} onChange={(event) => onInput('name', event.target.value)} placeholder={t.englishName} className={inputClass} required />
          </FieldShell>
          <FieldShell label={t.arabicName}>
            <input value={form.nameAr} onChange={(event) => onInput('nameAr', event.target.value)} placeholder={t.arabicName} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.image}>
            <input value={form.image} onChange={(event) => onInput('image', event.target.value)} placeholder={t.image} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.experience}>
            <input type='text' inputMode='numeric' value={form.experienceYears} onChange={(event) => onInput('experienceYears', event.target.value)} placeholder={t.experience} className={inputClass} />
          </FieldShell>
          <FieldShell label={t.bio} className='md:col-span-2'>
            <textarea value={form.bio} onChange={(event) => onInput('bio', event.target.value)} placeholder={t.bio} className={`${inputClass} min-h-24`} />
          </FieldShell>
          <FieldShell label={t.bioAr} className='md:col-span-2'>
            <textarea value={form.bioAr} onChange={(event) => onInput('bioAr', event.target.value)} placeholder={t.bioAr} className={`${inputClass} min-h-24`} />
          </FieldShell>
        </div>
      </FormSectionCard>

      <FormSectionCard title={t.assignServices}>
        <div className='grid max-h-64 gap-3 overflow-y-auto pr-1 lg:grid-cols-2'>
          {services.map((service) => (
            <label
              key={service._id}
              className={`flex items-start gap-3 rounded-[1.15rem] p-4 ${mutedPanel}`}
            >
              <input type='checkbox' checked={form.serviceIds.includes(service._id)} onChange={() => onToggleService(service._id)} className='mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:text-slate-100 dark:focus:ring-slate-600' />
              <div className='min-w-0'>
                <p className='font-bold text-slate-900 dark:text-white'>{getLocalizedName(service, lang)}</p>
                <p className='text-xs text-slate-500 dark:text-slate-300'>
                  {formatDuration(service.durationMinutes, lang)} • {formatPrice(service.price, lang)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </FormSectionCard>

      <FormSectionCard title={t.schedule}>
        <div className='max-h-[28rem] space-y-3 overflow-y-auto pr-1'>
          {form.workingHours.map((entry) => (
            <div key={entry.dayOfWeek} className={`rounded-[1.15rem] p-4 ${mutedPanel}`}>
              <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <p className='font-bold text-slate-900 dark:text-white'>
                  {dayLabels[lang]?.[entry.dayOfWeek] || dayLabels.en[entry.dayOfWeek]}
                </p>
                <label className='inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300'>
                  <input type='checkbox' checked={entry.enabled} onChange={(event) => onUpdateSchedule(entry.dayOfWeek, 'enabled', event.target.checked)} className='h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 dark:text-slate-100 dark:focus:ring-slate-600' />
                  {entry.enabled ? t.open : t.closed}
                </label>
              </div>
              <div className='grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4'>
                <label className='min-w-0 flex flex-col text-xs font-bold text-slate-500 dark:text-slate-300'>
                  {t.start}
                  <ScheduleTimeSelect
                    value={entry.startTime}
                    onChange={(nextValue) => onUpdateSchedule(entry.dayOfWeek, 'startTime', nextValue)}
                    labels={timeSelectLabels}
                  />
                </label>
                <label className='min-w-0 flex flex-col text-xs font-bold text-slate-500 dark:text-slate-300'>
                  {t.end}
                  <ScheduleTimeSelect
                    value={entry.endTime}
                    onChange={(nextValue) => onUpdateSchedule(entry.dayOfWeek, 'endTime', nextValue)}
                    labels={timeSelectLabels}
                  />
                </label>
                <label className='min-w-0 flex flex-col text-xs font-bold text-slate-500 dark:text-slate-300'>
                  {t.breakStart}
                  <ScheduleTimeSelect
                    value={entry.breakStart}
                    onChange={(nextValue) => onUpdateSchedule(entry.dayOfWeek, 'breakStart', nextValue)}
                    allowEmpty={true}
                    labels={timeSelectLabels}
                  />
                </label>
                <label className='min-w-0 flex flex-col text-xs font-bold text-slate-500 dark:text-slate-300'>
                  {t.breakEnd}
                  <ScheduleTimeSelect
                    value={entry.breakEnd}
                    onChange={(nextValue) => onUpdateSchedule(entry.dayOfWeek, 'breakEnd', nextValue)}
                    allowEmpty={true}
                    labels={timeSelectLabels}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </FormSectionCard>

      <div className='grid gap-4 md:grid-cols-[1fr_auto] md:items-end'>
        <FieldShell label={t.daysOff} hint={t.daysOffHint}>
          <input value={form.daysOffText} onChange={(event) => onInput('daysOffText', event.target.value)} placeholder={t.daysOffHint} className={inputClass} />
        </FieldShell>
        <button type='submit' disabled={submitting || !canSubmit} className='admin-submit-button inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'>
          {submitting ? <Loader2 size={16} className='animate-spin' /> : null}
          <span className='admin-submit-label'>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export const AdminOverviewPanel = ({ t, lang, analytics, recentActivity, barbers }) => (
  <div className='grid gap-3.5 2xl:grid-cols-[1.12fr_0.88fr]'>
    <div className='space-y-3.5'>
      <SectionShell title={t.lastSevenDays}>
        <div className='grid gap-4 xl:grid-cols-2'>
          <SparklineChart title={t.lastSevenDays} items={analytics?.dailyVolume || []} lang={lang} />
          <MiniBarChart title={t.serviceMix} items={analytics?.topServices || []} lang={lang} />
        </div>
      </SectionShell>

      <SectionShell title={t.barberLoad}>
        <MiniBarChart title={t.barberLoad} items={analytics?.topBarbers || []} lang={lang} />
      </SectionShell>
    </div>

    <div className='space-y-3.5'>
      <SectionShell title={t.recentActivity} subtitle={t.recentActivitySub} compact={true}>
        <div className='space-y-4'>
          {recentActivity.length === 0 ? (
            <div
              className={`rounded-[1.25rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
            >
              {t.noActivity}
            </div>
          ) : (
            recentActivity.map((item, index) => (
              <ActivityCard key={`${item.timestamp}-${index}`} item={item} lang={lang} />
            ))
          )}
        </div>
      </SectionShell>

      <SectionShell title={t.rosterTitle} subtitle={t.rosterSubtitle} compact={true}>
        <div className='grid gap-3 sm:grid-cols-2'>
          {barbers.slice(0, 4).map((barber) => (
            <div key={barber._id} className={`rounded-[1.25rem] p-4 ${mutedPanel}`}>
              <div className='flex items-center gap-4'>
                <img
                  src={
                    barber.image ||
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={getLocalizedName(barber, lang)}
                  className='h-16 w-16 rounded-2xl object-cover'
                />
                <div className='min-w-0'>
                  <p className='truncate font-black text-slate-900 dark:text-white'>
                    {getLocalizedName(barber, lang)}
                  </p>
                  <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
                    {formatNumber(barber.experienceYears, lang)} {t.experience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  </div>
);

export const AdminBookingsPanel = ({
  t,
  lang,
  bookings,
  bookingSummary,
  bookingPagination,
  services,
  barbers,
  statusFilter,
  setStatusFilter,
  customerSearch,
  setCustomerSearch,
  customerResults,
  customerSearchLoading,
  selectedCustomer,
  setSelectedCustomer,
  onClearSelectedCustomer,
  deskBookingForm,
  onDeskBookingInput,
  deskBookingSlots,
  deskBookingLoading,
  deskBookingSubmitting,
  onDeskBookingSubmit,
  onStatusChange,
  onDelete,
  onReschedule,
  onBookingPageChange,
  bookingView,
  onBookingViewChange,
}) => {
  const [internalBookingView, setInternalBookingView] = useState('manage');
  const bookingBuilderRef = useRef(null);
  const activeBookingView = bookingView || internalBookingView;

  const statusOptions = [
    { id: 'all', label: t.allStatuses, count: bookingSummary?.all || 0 },
    {
      id: 'active',
      label: t.statusActive,
      count: bookingSummary?.active || 0,
    },
    {
      id: 'completed',
      label: t.statusCompleted,
      count: bookingSummary?.completed || 0,
    },
    {
      id: 'no_show',
      label: t.statusNoShow,
      count: bookingSummary?.no_show || 0,
    },
    {
      id: 'cancelled',
      label: t.statusCancelled,
      count: bookingSummary?.cancelled || 0,
    },
  ];

  const selectedStatus = statusOptions.find((option) => option.id === statusFilter) || statusOptions[0];
  const selectedService =
    services.find((service) => String(service._id) === String(deskBookingForm.serviceId)) || null;
  const selectedBarber =
    barbers.find((barber) => String(barber._id) === String(deskBookingForm.barberId)) || null;
  const isAutoAssignedBarber = deskBookingForm.barberId === AUTO_BARBER_SELECTION_ID;
  const canSubmitDeskBooking =
    Boolean(selectedCustomer?._id) &&
    Boolean(deskBookingForm.serviceId) &&
    Boolean(deskBookingForm.barberId) &&
    Boolean(deskBookingForm.date) &&
    Boolean(deskBookingForm.time);
  const isDeskBookingComplete = canSubmitDeskBooking;
  const bookingFlowSteps = [
    {
      id: 'customer',
      label: lang === 'ar' ? 'اختيار العميل' : 'Select customer',
      done: Boolean(selectedCustomer?._id),
    },
    {
      id: 'details',
      label: lang === 'ar' ? 'تفاصيل الموعد' : 'Appointment details',
      done:
        Boolean(deskBookingForm.serviceId) &&
        Boolean(deskBookingForm.barberId) &&
        Boolean(deskBookingForm.date) &&
        Boolean(deskBookingForm.time),
    },
    {
      id: 'review',
      label: lang === 'ar' ? 'المراجعة والإنشاء' : 'Review and create',
      done: isDeskBookingComplete,
    },
  ];

  const bookingViewTabs = [
    {
      id: 'manage',
      label: t.bookings,
      description: t.bookingDeskSub,
      icon: CalendarClock,
    },
    {
      id: 'create',
      label: t.bookForCustomerTitle,
      description: t.bookForCustomerSub,
      icon: UserRound,
    },
  ];
  const visibleBookingsCount = bookingPagination?.total || bookings.length;

  const handleBookingViewChange = (nextView) => {
    if (onBookingViewChange) {
      onBookingViewChange(nextView);
      return;
    }

    setInternalBookingView(nextView);
  };

  useEffect(() => {
    if (activeBookingView !== 'create' || !selectedCustomer?._id) {
      return;
    }

    const timer = window.setTimeout(() => {
      bookingBuilderRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [activeBookingView, selectedCustomer?._id]);

  return (
    <SectionShell
      title={t.bookingDesk}
      subtitle={
        activeBookingView === 'create'
          ? t.bookForCustomerSub
          : lang === 'ar'
            ? 'راقب الحجوزات الحالية وغيّر حالتها ثم افتح إنشاء حجز جديد عند الحاجة.'
            : 'Review current bookings, adjust status, and open a focused create flow when you need a new booking.'
      }
      compact={true}
      right={
        <AdminSubviewTabs
          activeView={activeBookingView}
          tabs={bookingViewTabs}
          onChange={handleBookingViewChange}
        />
      }
    >
      <div className={activeBookingView === 'create' ? 'mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]' : 'space-y-4'}>
        {activeBookingView === 'create' ? (
        <div className='space-y-4'>
          <div className={`rounded-[1.2rem] p-3.5 sm:p-4 ${mutedPanel}`}>
            <div className='grid gap-2 sm:grid-cols-3'>
              {bookingFlowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-[1rem] border px-3.5 py-3 ${
                    step.done
                      ? 'border-brand-gold/24 bg-brand-gold/12 text-slate-900 dark:border-brand-gold/20 dark:bg-brand-gold/10 dark:text-white'
                      : 'border-slate-200/70 bg-white/72 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300'
                  }`}
                >
                  <p className='text-[10px] font-black uppercase tracking-[0.16em]'>
                    {lang === 'ar' ? `الخطوة ${formatNumber(index + 1, lang)}` : `Step ${index + 1}`}
                  </p>
                  <p className='mt-1.5 text-sm font-black'>{step.label}</p>
                </div>
              ))}
            </div>
          </div>

        <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
          <form
            id='admin-booking-desk-form'
            onSubmit={onDeskBookingSubmit}
            className={`space-y-5 ${mobileWorkspaceScrollClass}`}
          >
            <div className='flex items-center justify-between gap-3'>
              <button
                type='button'
                onClick={() => handleBookingViewChange('manage')}
                className='inline-flex min-h-[2.9rem] items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white'
              >
                <ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                {t.backToBookings || 'Back to bookings'}
              </button>
              {isDeskBookingComplete ? (
                <span className='rounded-full border border-brand-gold/20 bg-brand-gold/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-brand-gold'>
                  {t.bookingSummary}
                </span>
              ) : null}
            </div>

            <div className={`rounded-[1.15rem] p-4 ${mutedPanel}`}>
              <div className='mb-4 border-b border-slate-200/70 pb-3 dark:border-white/10'>
                <p className='text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold'>
                  {lang === 'ar' ? 'الخطوة 1' : 'Step 1'}
                </p>
                <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
                  {lang === 'ar' ? 'ابحث عن العميل ثم ثبّت اختياره.' : 'Find the customer, then lock in the selection.'}
                </p>
              </div>

            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                {t.customerSearchLabel}
              </label>
              <input
                type='text'
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                placeholder={t.customerSearchPlaceholder}
                className={inputClass}
              />
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-300'>
                {t.customerSearchHint}
              </p>
              <div className='mt-3 max-h-72 overflow-y-auto pr-1'>
                <div className='grid gap-3 lg:grid-cols-2'>
                  {customerResults.map((customer) => {
                  const isSelected = String(selectedCustomer?._id) === String(customer._id);

                  return (
                    <button
                      key={customer._id}
                      type='button'
                      onClick={() => setSelectedCustomer(customer)}
                      className={`rounded-[1.35rem] border p-4 text-left transition ${
                        isSelected
                          ? 'border-slate-900 bg-slate-100 shadow-sm dark:border-white dark:bg-slate-800'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                      }`}
                    >
                      <p className='font-black text-slate-900 dark:text-white'>{customer.name}</p>
                      <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>{customer.email}</p>
                      <p className='mt-2 text-xs font-bold text-slate-400 dark:text-slate-500'>
                        {formatCustomerIdDisplay(customer.customerId, lang, lang === 'ar' ? 'غير متوفر' : 'N/A')}
                      </p>
                    </button>
                  );
                  })}
                </div>
              </div>
              {customerSearchLoading ? (
                <p className='mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                  {t.customerSearchLoading}
                </p>
              ) : customerResults.length === 0 ? (
                <p className='mt-3 text-sm text-slate-500 dark:text-slate-300'>
                  {t.customerSearchEmpty}
                </p>
              ) : null}
            </div>
            </div>

            {selectedCustomer ? (
              <div className='rounded-[1.15rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                      {t.selectedCustomer}
                    </p>
                    <p className='mt-2 text-lg font-black text-slate-900 dark:text-white'>
                      {selectedCustomer.name}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={onClearSelectedCustomer}
                    className='rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  >
                    {t.clearSelection}
                  </button>
                </div>
                <div className='mt-4 grid gap-3 lg:grid-cols-3'>
                  <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                    <div className='flex items-center gap-2 text-slate-500 dark:text-slate-300'>
                      <Mail size={14} />
                      <span className='text-[11px] font-black uppercase tracking-[0.16em]'>
                        {t.customerEmailLabel}
                      </span>
                    </div>
                    <p className='mt-2 break-words text-sm font-bold text-slate-900 dark:text-white'>
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                    <div className='flex items-center gap-2 text-slate-500 dark:text-slate-300'>
                      <Phone size={14} />
                      <span className='text-[11px] font-black uppercase tracking-[0.16em]'>
                        {t.customerPhoneLabel}
                      </span>
                    </div>
                    <p className='mt-2 break-words text-sm font-bold text-slate-900 dark:text-white'>
                      {selectedCustomer.phone
                        ? formatPhoneDisplay(selectedCustomer.phone, selectedCustomer.countryCode || '+965', lang)
                        : lang === 'ar'
                          ? 'غير متوفر'
                          : 'N/A'}
                    </p>
                  </div>
                  <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                    <div className='flex items-center gap-2 text-slate-500 dark:text-slate-300'>
                      <UserRound size={14} />
                      <span className='text-[11px] font-black uppercase tracking-[0.16em]'>
                        {t.customerIdLabel}
                      </span>
                    </div>
                    <p className='mt-2 break-words text-sm font-bold text-slate-900 dark:text-white'>
                      {formatCustomerIdDisplay(selectedCustomer.customerId, lang, lang === 'ar' ? 'غير متوفر' : 'N/A')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {t.noCustomerSelected}
              </div>
            )}

            <div ref={bookingBuilderRef} className={`rounded-[1.15rem] p-4 ${mutedPanel}`}>
              <div className='mb-4 border-b border-slate-200/70 pb-3 dark:border-white/10'>
                <p className='text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold'>
                  {lang === 'ar' ? 'الخطوة 2' : 'Step 2'}
                </p>
                <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
                  {lang === 'ar'
                    ? 'اختر الخدمة والحلاق ثم حدّد التاريخ والوقت.'
                    : 'Choose the service, barber, date, and time.'}
                </p>
              </div>

            <div className='grid gap-4 xl:grid-cols-2'>
              <div>
                <label className='mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                  {t.serviceField}
                </label>
                <select
                  value={deskBookingForm.serviceId}
                  onChange={(event) => onDeskBookingInput('serviceId', event.target.value)}
                  className={inputClass}
                  disabled={!selectedCustomer}
                >
                  <option value=''>{t.chooseService}</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {getLocalizedName(service, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                  {t.barberField}
                </label>
                <select
                  value={deskBookingForm.barberId}
                  onChange={(event) => onDeskBookingInput('barberId', event.target.value)}
                  className={inputClass}
                  disabled={!selectedCustomer || !deskBookingForm.serviceId}
                >
                  <option value=''>{t.chooseBarber}</option>
                  {barbers.length > 0 ? (
                    <option value={AUTO_BARBER_SELECTION_ID}>
                      {t.autoBarberSelection || (lang === 'ar' ? 'أول حلاق متاح' : 'First available')}
                    </option>
                  ) : null}
                  {barbers.map((barber) => (
                    <option key={barber._id} value={barber._id}>
                      {getLocalizedName(barber, lang)}
                    </option>
                  ))}
                </select>
              </div>
              {selectedService || selectedBarber || isAutoAssignedBarber ? (
                <div className='grid gap-3 md:col-span-2 md:grid-cols-2'>
                  <div className={`rounded-[1.15rem] border p-3 ${selectedService ? 'border-brand-gold/20 bg-white/82 dark:border-brand-gold/18 dark:bg-white/6' : `border-dashed ${mutedPanel}`}`}>
                    <p className='text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.selectedServiceLabel || t.serviceField}
                    </p>
                    {selectedService ? (
                      <div className='mt-2 flex items-start gap-3'>
                        <div className='h-14 w-14 shrink-0 overflow-hidden rounded-[0.9rem] bg-slate-950/95'>
                          {selectedService.image ? (
                            <img
                              src={selectedService.image}
                              alt={getLocalizedName(selectedService, lang)}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,215,122,0.14),_rgba(15,23,42,0.88)_40%,_rgba(2,6,23,1)_100%)]'>
                              <Scissors size={18} className='text-brand-gold' />
                            </div>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-black text-slate-900 dark:text-white'>
                            {getLocalizedName(selectedService, lang)}
                          </p>
                          <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
                            {formatPrice(selectedService.price, lang)} • {formatDuration(selectedService.durationMinutes, lang)}
                          </p>
                          <p className='mt-2 inline-flex rounded-full border border-brand-gold/12 bg-brand-gold/8 px-2.5 py-1 text-[10px] font-bold text-brand-gold'>
                            {getLocalizedCategoryLabel(selectedService, lang, t.allServices || (lang === 'ar' ? 'كل الخدمات' : 'All services'))}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>{t.chooseService}</p>
                    )}
                  </div>
                  <div className={`rounded-[1.15rem] border p-3 ${selectedBarber ? 'border-brand-gold/20 bg-white/82 dark:border-brand-gold/18 dark:bg-white/6' : `border-dashed ${mutedPanel}`}`}>
                    <p className='text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
                      {t.selectedBarberLabel || t.barberField}
                    </p>
                    {selectedBarber ? (
                      <div className='mt-2 flex items-start gap-3'>
                        {selectedBarber.image ? (
                          <img
                            src={selectedBarber.image}
                            alt={getLocalizedName(selectedBarber, lang)}
                            className='h-14 w-14 shrink-0 rounded-[0.9rem] object-cover'
                          />
                        ) : (
                          <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.9rem] border border-brand-gold/16 bg-brand-gold/10 text-brand-gold'>
                            <UserRound size={18} />
                          </div>
                        )}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-black text-slate-900 dark:text-white'>
                            {getLocalizedName(selectedBarber, lang)}
                          </p>
                          <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
                            {selectedBarber.experienceYears
                              ? `${formatNumber(selectedBarber.experienceYears, lang)} ${t.experience}`
                              : t.chooseBarber}
                          </p>
                          {(selectedBarber.serviceIds || []).length ? (
                            <p className='mt-2 text-[11px] text-slate-500 dark:text-slate-400'>
                              {getLocalizedName(selectedBarber.serviceIds[0], lang)}
                              {(selectedBarber.serviceIds || []).length > 1
                                ? ` +${formatNumber((selectedBarber.serviceIds || []).length - 1, lang)}`
                                : ''}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : isAutoAssignedBarber ? (
                      <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
                        {t.autoBarberSelection || (lang === 'ar' ? 'أول حلاق متاح' : 'First available')}
                      </p>
                    ) : (
                      <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>{t.chooseBarber}</p>
                    )}
                  </div>
                </div>
              ) : null}
              <div className='min-w-0 md:col-span-2'>
                <label className='mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                  {t.dateField}
                </label>
                {!selectedCustomer || !deskBookingForm.serviceId || !deskBookingForm.barberId ? (
                  <div
                    className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                  >
                    {!selectedCustomer
                      ? t.chooseCustomerFirst
                      : !deskBookingForm.serviceId
                        ? t.chooseService
                        : t.chooseBarber}
                  </div>
                ) : (
                  <div className='overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-950/45'>
                    <Calendar
                      onSelectDate={(date) => onDeskBookingInput('date', date)}
                      lang={lang}
                      bookedDates={[]}
                    />
                  </div>
                )}
              </div>
            </div>
            </div>

            <div className={`rounded-[1.15rem] p-4 ${mutedPanel}`}>
              <div className='mb-4 border-b border-slate-200/70 pb-3 dark:border-white/10'>
                <p className='text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold'>
                  {lang === 'ar' ? 'الخطوة 3' : 'Step 3'}
                </p>
                <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
                  {lang === 'ar'
                    ? 'راجع فتحات الوقت ثم أنشئ الحجز.'
                    : 'Review the available times, then create the booking.'}
                </p>
              </div>

            <div>
              <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
                <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                  {t.timeField}
                </p>
                <span className='text-xs text-slate-500 dark:text-slate-300'>{t.deskSlotsHint}</span>
              </div>

              {!selectedCustomer ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.chooseCustomerFirst}
                </div>
              ) : !deskBookingForm.serviceId ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.chooseService}
                </div>
              ) : !deskBookingForm.barberId ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.chooseBarber}
                </div>
              ) : !deskBookingForm.date ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.chooseDate}
                </div>
              ) : deskBookingLoading ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.slotsLoading}
                </div>
              ) : deskBookingSlots.length === 0 ? (
                <div
                  className={`rounded-[1.2rem] border border-dashed p-4 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.noSlotsAvailable}
                </div>
              ) : (
                <div className='grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3'>
                  {deskBookingSlots.map((slot) => (
                    <button
                      key={slot}
                      type='button'
                      onClick={() => onDeskBookingInput('time', slot)}
                      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                        deskBookingForm.time === slot
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={!canSubmitDeskBooking || deskBookingSubmitting}
                className='hidden min-h-[3.15rem] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 lg:inline-flex'
              >
                {deskBookingSubmitting ? <Loader2 size={16} className='animate-spin' /> : null}
                {deskBookingSubmitting ? t.creatingBooking || 'Creating booking...' : t.bookForCustomer}
              </button>
            </div>
          </form>
        </div>
        </div>
        ) : null}

        <div className={`space-y-4 ${activeBookingView === 'create' && !isDeskBookingComplete ? 'hidden lg:block' : ''}`}>
          {activeBookingView === 'manage' ? (
          <div className={`rounded-[1.15rem] p-3.5 sm:p-4 ${mutedPanel}`}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <p className='text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
                    {selectedStatus.label}
                  </p>
                  <div className='mt-2 flex flex-wrap items-end gap-x-3 gap-y-1'>
                    <p className='text-2xl font-black text-slate-900 dark:text-white'>
                      {formatNumber(visibleBookingsCount, lang)}
                    </p>
                    <p className='pb-0.5 text-sm text-slate-500 dark:text-slate-300'>
                      {t.bookings}
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full border border-slate-200/70 bg-white/72 px-3 py-1.5 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300'>
                  {`${t.allStatuses}: ${formatNumber(bookingSummary?.all || 0, lang)}`}
                </span>
                <button
                  type='button'
                  onClick={() => handleBookingViewChange('create')}
                  className='inline-flex min-h-[2.7rem] items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                >
                  {t.bookForCustomerTitle}
                </button>
                </div>
              </div>

              <div className='pb-0.5'>
                <div className='flex flex-wrap gap-2'>
                  {statusOptions.map((status) => (
                    <button
                      key={status.id}
                      type='button'
                      onClick={() => setStatusFilter(status.id)}
                      className={`rounded-full border px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.14em] transition ${
                        statusFilter === status.id
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <span className='whitespace-nowrap'>{status.label}</span>
                      <span
                        className={`ml-2 inline-block text-[11px] tracking-normal ${
                          statusFilter === status.id ? 'text-white/75 dark:text-slate-700' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {formatNumber(status.count, lang)}
                      </span>
                    </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
          ) : null}

          {activeBookingView === 'create' ? (
          <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel} xl:sticky xl:top-5`}>
            <p className='text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold'>
              {lang === 'ar' ? 'المراجعة النهائية' : 'Final review'}
            </p>
            <p className='mt-2 text-lg font-black text-slate-900 dark:text-white'>
              {t.bookingSummary}
            </p>
            <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>
              {t.bookingSummaryHint}
            </p>

            <div className='mt-4 space-y-3'>
              <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                  {t.selectedCustomer}
                </p>
                <p className='mt-2 break-words text-sm font-black text-slate-900 dark:text-white'>
                  {selectedCustomer?.name || t.noCustomerSelected}
                </p>
              </div>
              <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                  {t.selectedServiceLabel || t.serviceField}
                </p>
                <p className='mt-2 break-words text-sm font-black text-slate-900 dark:text-white'>
                  {selectedService ? getLocalizedName(selectedService, lang) : t.chooseService}
                </p>
              </div>
              <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                  {t.selectedBarberLabel || t.barberField}
                </p>
                <p className='mt-2 break-words text-sm font-black text-slate-900 dark:text-white'>
                  {isAutoAssignedBarber
                    ? t.autoBarberSelection || (lang === 'ar' ? 'أول حلاق متاح' : 'First available')
                    : selectedBarber
                      ? getLocalizedName(selectedBarber, lang)
                      : t.chooseBarber}
                </p>
              </div>
                <div className='grid gap-3 lg:grid-cols-2'>
                <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                    {t.dateField}
                  </p>
                  <p className='mt-2 break-words text-sm font-black text-slate-900 dark:text-white'>
                    {deskBookingForm.date || t.chooseDate}
                  </p>
                </div>
                <div className={`min-w-0 rounded-[1rem] p-3 ${mutedPanel}`}>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                    {t.timeField}
                  </p>
                  <p className='mt-2 break-words text-sm font-black text-slate-900 dark:text-white'>
                    {deskBookingForm.time || t.chooseTime}
                  </p>
                </div>
              </div>
              {selectedService ? (
                <div className='rounded-[1.2rem] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900'>
                  <p className='text-xs font-bold text-slate-700 dark:text-slate-200'>
                    {formatPrice(selectedService.price, lang)} • {formatDuration(selectedService.durationMinutes, lang)}
                  </p>
                </div>
              ) : null}
              <button
                type='submit'
                form='admin-booking-desk-form'
                disabled={!canSubmitDeskBooking || deskBookingSubmitting}
                className='inline-flex min-h-[3.15rem] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 lg:hidden'
              >
                {deskBookingSubmitting ? <Loader2 size={16} className='animate-spin' /> : null}
                {deskBookingSubmitting ? t.creatingBooking || 'Creating booking...' : t.bookForCustomer}
              </button>
            </div>
          </div>
          ) : null}
        </div>
      </div>

      {activeBookingView === 'manage' ? (
        <div className={`space-y-4 ${mobileWorkspaceScrollClass}`}>
          {bookings.length === 0 ? (
            <div
              className={`rounded-[1.35rem] border border-dashed p-8 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
            >
              {t.emptyBookings}
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                lang={lang}
                t={t}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onReschedule={onReschedule}
              />
            ))
          )}
          <AdminPagination
            page={bookingPagination?.page || 1}
            totalPages={bookingPagination?.totalPages || 1}
            onChange={onBookingPageChange}
            className='pt-1'
          />
        </div>
      ) : null}
    </SectionShell>
  );
};

const customerStatusStyles = {
  active: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
    card: 'border-emerald-200/70 dark:border-emerald-500/20',
  },
  completed: {
    chip: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200',
    card: 'border-sky-200/70 dark:border-sky-500/20',
  },
  cancelled: {
    chip: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
    card: 'border-rose-200/70 dark:border-rose-500/20',
  },
  no_show: {
    chip: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    card: 'border-amber-200/70 dark:border-amber-500/20',
  },
};

const getCustomerStatusPresentation = (status, t) => {
  const normalizedStatus = status || 'active';
  const styles = customerStatusStyles[normalizedStatus] || customerStatusStyles.active;
  const label =
    normalizedStatus === 'no_show'
      ? t.statusNoShow
      : normalizedStatus === 'completed'
        ? t.statusCompleted
        : normalizedStatus === 'cancelled'
          ? t.statusCancelled
          : t.statusActive;

  return {
    label,
    ...styles,
  };
};

const CustomerMetricCard = ({ label, value, tone = '', compact = false }) => (
  <div
    className={`rounded-[0.9rem] border p-3 sm:min-w-[9.5rem] sm:flex-1 ${mutedPanel} ${tone} ${
      compact ? 'min-h-[4.8rem]' : 'min-h-[5.2rem]'
    }`}
  >
    <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
      {label}
    </p>
    <p className='mt-1.5 text-base font-black text-slate-900 dark:text-white sm:text-lg'>{value}</p>
  </div>
);

const CustomerHistoryRow = ({ booking, customer, lang, t, onRebookCustomerService }) => {
  const statusMeta = getCustomerStatusPresentation(booking.status, t);

  return (
    <div className={`rounded-[0.95rem] border p-3.5 ${mutedPanel} ${statusMeta.card}`}>
      <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-[15px] font-black text-slate-900 dark:text-white'>{getLocalizedServiceLabel(booking, lang, booking.service)}</p>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusMeta.chip}`}
            >
              {statusMeta.label}
            </span>
            <span className='rounded-full border border-brand-gold/20 bg-brand-gold/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-gold'>
              {booking.source === 'admin' ? t.adminDeskBooking : t.customerSelfBooked}
            </span>
          </div>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
            {formatDateTime(
              booking.date,
              booking.time || '',
              lang,
              booking.businessDate || '',
            )}
          </p>
          <div className='mt-2.5 flex flex-wrap gap-2.5 text-xs text-slate-500 dark:text-slate-300'>
            {booking.barber ? (
              <span className='font-bold text-slate-700 dark:text-slate-200'>
                {getLocalizedName(booking.barber, lang)}
              </span>
            ) : null}
            <span>{formatPrice(booking.price, lang)}</span>
            <span>{formatDuration(booking.durationMinutes, lang)}</span>
          </div>
        </div>

        {booking.serviceId ? (
          <button
            type='button'
            onClick={() =>
              onRebookCustomerService(customer, booking.serviceId, booking.barber?._id || '')
            }
            className='rounded-full border border-brand-gold/30 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-brand-gold transition hover:bg-brand-gold/10'
          >
            {t.bookAgain}
          </button>
        ) : null}
      </div>
    </div>
  );
};

const CustomerWorkspacePanel = ({
  t,
  lang,
  selectedCustomerRecord,
  customerDetails,
  customerDetailsLoading,
  customerDetailsError,
  onRetryCustomerDetails,
  onCustomerHistoryPageChange,
  onOpenCustomerBookingDesk,
  onRebookCustomerService,
  backAction = null,
}) => {
  const [historyFilter, setHistoryFilter] = useState('all');

  if (!selectedCustomerRecord) {
    return (
      <div className={`rounded-[1.1rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}>
        {t.customerWorkspaceEmpty}
      </div>
    );
  }

  if (customerDetailsLoading) {
    return (
      <div className='space-y-3'>
        <p className='text-sm text-slate-500 dark:text-slate-300'>{t.customerHistoryLoading}</p>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`min-h-[6rem] animate-pulse rounded-[1rem] ${mutedPanel}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (customerDetailsError) {
    return (
      <div className={`rounded-[1.1rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}>
        <p>{t.customerHistoryError}</p>
        <button
          type='button'
          onClick={onRetryCustomerDetails}
          className='mt-4 rounded-full border border-brand-gold/35 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-gold transition hover:bg-brand-gold/10'
        >
          {t.retry}
        </button>
      </div>
    );
  }

  if (!customerDetails) {
    return (
      <div className={`rounded-[1.1rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}>
        {t.customerWorkspaceEmpty}
      </div>
    );
  }

  const latestStatusMeta = getCustomerStatusPresentation(
    customerDetails.summary?.latestBookingStatus,
    t,
  );
  const historyFilterOptions = [
    { id: 'all', label: t.customerHistoryFilterAll || t.allStatuses },
    { id: 'active', label: t.statusActive },
    { id: 'completed', label: t.statusCompleted },
    { id: 'cancelled', label: t.statusCancelled },
    { id: 'no_show', label: t.statusNoShow },
  ];
  const filteredHistory =
    historyFilter === 'all'
      ? customerDetails.history || []
      : (customerDetails.history || []).filter((booking) => booking.status === historyFilter);

  return (
    <div className='space-y-4'>
      {backAction ? (
        <button
          type='button'
          onClick={backAction}
          className='inline-flex min-h-[2.8rem] items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white xl:hidden'
        >
          <ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
          {lang === 'ar' ? 'العودة إلى القائمة' : 'Back to list'}
        </button>
      ) : null}

      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
            {t.customerWorkspaceTitle}
          </p>
          <h3 className='mt-2 truncate text-2xl font-black text-slate-900 dark:text-white'>
            {customerDetails.customer?.name || selectedCustomerRecord.name}
          </h3>
          <p className='mt-2 break-words text-sm text-slate-500 dark:text-slate-300'>
            {customerDetails.customer?.email}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => onOpenCustomerBookingDesk(customerDetails.customer)}
            className='rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
          >
            {t.openBookingDesk}
          </button>
          {customerDetails.insights?.favoriteService?.serviceId ? (
            <button
              type='button'
              onClick={() =>
                onRebookCustomerService(
                  customerDetails.customer,
                  customerDetails.insights.favoriteService.serviceId,
                  customerDetails.insights.favoriteBarber?._id || '',
                )}
              className='rounded-full border border-brand-gold/35 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-gold transition hover:bg-brand-gold/10'
            >
              {t.bookFavoriteService}
            </button>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col gap-2.5 sm:flex-row sm:flex-wrap'>
        <CustomerMetricCard
          label={t.bookings}
          value={formatNumber(customerDetails.summary?.totalBookings || 0, lang)}
        />
        <CustomerMetricCard
          label={t.statusActive}
          value={formatNumber(customerDetails.summary?.activeBookings || 0, lang)}
          tone='ring-1 ring-emerald-500/15'
        />
        <CustomerMetricCard
          label={t.statusCompleted}
          value={formatNumber(customerDetails.summary?.completedBookings || 0, lang)}
          tone='ring-1 ring-sky-500/15'
        />
        <CustomerMetricCard
          label={t.statusCancelled}
          value={formatNumber(customerDetails.summary?.cancelledBookings || 0, lang)}
          tone='ring-1 ring-rose-500/15'
        />
        <CustomerMetricCard
          label={t.statusNoShow}
          value={formatNumber(customerDetails.summary?.noShowBookings || 0, lang)}
          tone='ring-1 ring-amber-500/15'
        />
      </div>

      <div className='flex flex-col gap-2.5 xl:flex-row xl:flex-wrap'>
        <div className={`rounded-[0.95rem] border p-3.5 xl:min-w-[15rem] xl:flex-1 ${mutedPanel}`}>
          <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
            {t.favoriteServiceLabel}
          </p>
          <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
            {customerDetails.insights?.favoriteService
              ? getLocalizedServiceLabel(customerDetails.insights.favoriteService, lang, t.customerInsightEmpty)
              : t.customerInsightEmpty}
          </p>
          {customerDetails.insights?.favoriteService?.bookings ? (
            <p className='mt-2 text-xs text-slate-500 dark:text-slate-300'>
              {`${formatNumber(customerDetails.insights.favoriteService.bookings, lang)} ${t.bookings}`}
            </p>
          ) : null}
        </div>
        <div className={`rounded-[0.95rem] border p-3.5 xl:min-w-[15rem] xl:flex-1 ${mutedPanel}`}>
          <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
            {t.favoriteBarberLabel}
          </p>
          <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
            {customerDetails.insights?.favoriteBarber
              ? getLocalizedName(customerDetails.insights.favoriteBarber, lang)
              : t.customerInsightEmpty}
          </p>
          {customerDetails.insights?.favoriteBarber?.bookings ? (
            <p className='mt-2 text-xs text-slate-500 dark:text-slate-300'>
              {`${formatNumber(customerDetails.insights.favoriteBarber.bookings, lang)} ${t.bookings}`}
            </p>
          ) : null}
        </div>
        <div className={`rounded-[0.95rem] border p-3.5 xl:min-w-[15rem] xl:flex-1 ${mutedPanel}`}>
          <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
            {t.latestBookingLabel}
          </p>
          <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
            {customerDetails.summary?.latestBookingDate
              ? formatDateTime(
                  customerDetails.summary.latestBookingDate,
                  customerDetails.summary.latestBookingTime || '',
                  lang,
                )
              : t.customerInsightEmpty}
          </p>
          {customerDetails.summary?.latestBookingService ? (
            <p className='mt-2 text-xs text-slate-500 dark:text-slate-300'>
              {getLocalizedServiceLabel(customerDetails.summary, lang, customerDetails.summary.latestBookingService)}
            </p>
          ) : null}
        </div>
        <div className={`rounded-[0.95rem] border p-3.5 xl:min-w-[15rem] xl:flex-1 ${mutedPanel}`}>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
              {t.latestStatusLabel}
            </p>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${latestStatusMeta.chip}`}
            >
              {latestStatusMeta.label}
            </span>
          </div>
          <p className='mt-3 text-xs text-slate-500 dark:text-slate-300'>
            {formatCustomerIdDisplay(customerDetails.customer?.customerId, lang, lang === 'ar' ? t.notAvailableShort : 'N/A')}
          </p>
          <p className='mt-2 text-sm font-black text-slate-900 dark:text-white'>
            {customerDetails.customer?.phone
              ? formatPhoneDisplay(customerDetails.customer.phone, customerDetails.customer.countryCode || '+965', lang)
              : lang === 'ar'
                ? t.notAvailableShort || 'غير متوفر'
                : 'N/A'}
          </p>
        </div>
      </div>

      <div>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
              {t.customerHistoryTitle}
            </p>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
              {t.customerHistorySubtitle}
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:items-end'>
            {customerDetails.summary?.totalSpent ? (
              <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${mutedPanel}`}>
                {`${t.totalSpentLabel}: ${formatPrice(customerDetails.summary.totalSpent, lang)}`}
              </div>
            ) : null}
            <div className='flex flex-wrap gap-2'>
              {historyFilterOptions.map((option) => (
                <button
                  key={option.id}
                  type='button'
                  onClick={() => setHistoryFilter(option.id)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                    historyFilter === option.id
                      ? 'border-brand-gold/45 bg-brand-gold/12 text-brand-gold'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-brand-gold/25 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-4 space-y-3'>
          {filteredHistory.length ? (
            filteredHistory.map((booking) => (
              <CustomerHistoryRow
                key={booking._id}
                booking={booking}
                customer={customerDetails.customer}
                lang={lang}
                t={t}
                onRebookCustomerService={onRebookCustomerService}
              />
            ))
          ) : (
            <div className={`rounded-[1rem] border border-dashed p-5 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}>
              {t.customerHistoryEmpty}
            </div>
          )}
        </div>

        <AdminPagination
          page={customerDetails.pagination?.page || 1}
          totalPages={customerDetails.pagination?.totalPages || 1}
          onChange={onCustomerHistoryPageChange}
          className='pt-4'
        />
      </div>
    </div>
  );
};

const CustomerDirectoryList = ({
  customers,
  lang,
  t,
  selectedCustomerRecord,
  onSelectCustomer,
}) => (
  <div className='grid gap-3'>
    {customers.map((customer) => {
      const isSelected = String(selectedCustomerRecord?._id || '') === String(customer._id);

      return (
        <button
          key={customer._id}
          type='button'
          onClick={() => onSelectCustomer(customer)}
          className={`rounded-[1rem] border p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition ${
            isSelected
              ? 'border-brand-gold/45 bg-brand-gold/8 ring-1 ring-brand-gold/14'
              : 'border-slate-200/80 bg-white/65 hover:border-brand-gold/24 dark:border-white/10 dark:bg-white/[0.03]'
          } ${mutedPanel}`}
        >
          <div className='flex items-start justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10'>
            <div className='min-w-0'>
              <p className='truncate text-base font-black text-slate-900 dark:text-white'>
                {customer.name}
              </p>
              <p className='mt-1 break-words text-sm text-slate-500 dark:text-slate-300'>
                {customer.email}
              </p>
            </div>
            <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              {formatCustomerIdDisplay(customer.customerId, lang, lang === 'ar' ? t.notAvailableShort || 'غير متوفر' : 'N/A')}
            </span>
          </div>

          <div className='mt-3 flex flex-wrap gap-2 text-[11px]'>
            <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-black uppercase tracking-[0.12em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              {`${t.bookings}: ${formatNumber(customer.totalBookings || 0, lang)}`}
            </span>
            <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-black uppercase tracking-[0.12em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
              {`${t.activeBookings}: ${formatNumber(customer.activeBookings || 0, lang)}`}
            </span>
          </div>

          <div className='mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-300 sm:grid-cols-[minmax(0,1fr)_auto]'>
            <span className='truncate'>
              {customer.latestBookingDate
                ? formatDateTime(customer.latestBookingDate, customer.latestBookingTime || '', lang)
                : '—'}
            </span>
            <span className='truncate'>
              {customer.phone
                ? formatPhoneDisplay(customer.phone, customer.countryCode || '+965', lang)
                : lang === 'ar'
                  ? t.notAvailableShort || 'غير متوفر'
                  : 'N/A'}
            </span>
            {customer.latestBookingService ? (
              <span className='truncate font-bold text-slate-700 dark:text-slate-200 sm:col-span-2'>
                {getLocalizedServiceLabel(customer, lang, customer.latestBookingService)}
              </span>
            ) : null}
          </div>
        </button>
      );
    })}
  </div>
);

export const AdminCustomersPanel = ({
  t,
  lang,
  customers,
  customerDirectorySearch,
  setCustomerDirectorySearch,
  customerDirectoryLoading,
  customerDirectoryPagination,
  customerDirectorySummary,
  selectedCustomerRecord,
  customerDetails,
  customerDetailsLoading,
  customerDetailsError,
  onCustomerDirectoryPageChange,
  onSelectCustomer,
  onRetryCustomerDetails,
  onCustomerHistoryPageChange,
  onOpenCustomerBookingDesk,
  onRebookCustomerService,
}) => {
  const [mobileCustomerView, setMobileCustomerView] = useState('list');

  const directoryPanel = (
    <div className='space-y-4'>
      {customerDirectoryLoading ? (
        <div className={`rounded-[0.95rem] border p-4 ${mutedPanel}`}>
          <p className='text-sm text-slate-500 dark:text-slate-300'>{t.customerSearchLoading}</p>
        </div>
      ) : customers.length === 0 ? (
        <div className={`rounded-[1.1rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}>
          {t.customerSearchEmpty}
        </div>
      ) : (
        <CustomerDirectoryList
          customers={customers}
          lang={lang}
          t={t}
          selectedCustomerRecord={selectedCustomerRecord}
          onSelectCustomer={(customer) => {
            onSelectCustomer(customer);
            setMobileCustomerView('detail');
          }}
        />
      )}

      <AdminPagination
        page={customerDirectoryPagination?.page || 1}
        totalPages={customerDirectoryPagination?.totalPages || 1}
        onChange={onCustomerDirectoryPageChange}
      />
    </div>
  );

  const detailPanel = (
    <div className={`rounded-[0.95rem] border p-4 sm:p-5 ${mutedPanel}`}>
      <CustomerWorkspacePanel
        t={t}
        lang={lang}
        selectedCustomerRecord={selectedCustomerRecord}
        customerDetails={customerDetails}
        customerDetailsLoading={customerDetailsLoading}
        customerDetailsError={customerDetailsError}
        onRetryCustomerDetails={onRetryCustomerDetails}
        onCustomerHistoryPageChange={onCustomerHistoryPageChange}
        onOpenCustomerBookingDesk={onOpenCustomerBookingDesk}
        onRebookCustomerService={onRebookCustomerService}
        backAction={() => setMobileCustomerView('list')}
      />
    </div>
  );

  return (
    <SectionShell
      title={t.sectionCustomers}
      compact={true}
    >
      <div className='space-y-4'>
        <div className={`rounded-[0.95rem] border p-4 ${mutedPanel}`}>
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'>
            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300'>
                {t.customerSearchLabel}
              </label>
              <input
                type='text'
                value={customerDirectorySearch}
                onChange={(event) => setCustomerDirectorySearch(event.target.value)}
                placeholder={t.customerSearchPlaceholder}
                className={inputClass}
              />
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-300'>
                {t.customerSearchHint}
              </p>
            </div>
            <div className='rounded-[0.9rem] border border-slate-200/80 px-4 py-3 dark:border-slate-800'>
              <p className='text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                {lang === 'ar' ? 'إجمالي السجلات' : 'Total records'}
              </p>
              <p className='mt-2 text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumber(customerDirectorySummary?.totalCustomers || 0, lang)}
              </p>
            </div>
          </div>
        </div>

        <div className='xl:hidden'>
          <AdminSubviewTabs
            activeView={mobileCustomerView}
            tabs={[
              {
                id: 'list',
                label: lang === 'ar' ? 'السجل' : 'Customer list',
                icon: Users,
              },
              {
                id: 'detail',
                label: selectedCustomerRecord?.name || (lang === 'ar' ? 'التفاصيل' : 'Customer detail'),
                icon: UserRound,
              },
            ]}
            onChange={setMobileCustomerView}
          />
        </div>

        <div className='hidden gap-4 xl:grid xl:grid-cols-[0.92fr_1.08fr]'>
          {directoryPanel}
          {detailPanel}
        </div>

        <div className='xl:hidden'>
          {mobileCustomerView === 'detail' ? detailPanel : directoryPanel}
        </div>
      </div>
    </SectionShell>
  );
};
export const AdminServicesPanel = ({
  t,
  lang,
  services,
  barbers = [],
  createForm,
  onCreateInput,
  onCreateSubmit,
  onUpdateService,
  onDeleteService,
  submitting,
}) => {
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState(createServiceState());
  const [serviceView, setServiceView] = useState('create');

  const openEditor = (service) => {
    setEditingService(service);
      setEditForm({
        slug: service.slug || '',
        name: service.name || '',
        nameAr: service.nameAr || '',
        category: service.category || 'signature',
        categoryAr: service.categoryAr || '',
        badge: service.badge || '',
        badgeAr: service.badgeAr || '',
        featuresText: Array.isArray(service.features) ? service.features.join(', ') : '',
        featuresArText: Array.isArray(service.featuresAr)
          ? service.featuresAr.join(', ')
          : '',
        description: service.description || '',
        descriptionAr: service.descriptionAr || '',
        price: String(service.price ?? ''),
      durationMinutes: String(service.durationMinutes ?? ''),
      image: service.image || '',
      active: service.active !== false,
    });
  };

  const handleEditInput = (field, value) => {
    const normalizedValue =
      field === 'price' || field === 'durationMinutes' ? sanitizeNumericInput(value) : value;

    setEditForm((current) => ({
      ...current,
      [field]: normalizedValue,
      slug: field === 'name' ? slugify(value) : current.slug,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (
      editForm.active &&
      (!editForm.name.trim() ||
        !editForm.nameAr.trim() ||
        !editForm.image.trim() ||
        !editForm.descriptionAr.trim() ||
        parseNumericValue(editForm.price, 0) <= 0 ||
        parseNumericValue(editForm.durationMinutes, 0) <= 0)
    ) {
      return;
    }
    await onUpdateService(editingService._id, {
      ...editForm,
      features: editForm.featuresText
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      featuresAr: editForm.featuresArText
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      price: parseNumericValue(editForm.price, 0),
      durationMinutes: parseNumericValue(editForm.durationMinutes, 15),
    });
    setEditingService(null);
  };

  const getAssignedBarberCount = (serviceId) =>
    barbers.filter((barber) =>
      (barber.serviceIds || []).some((service) => {
        const currentId = typeof service === 'string' ? service : service?._id;
        return String(currentId) === String(serviceId);
      }),
    ).length;

  const serviceViewTabs = [
    {
      id: 'create',
      label: t.newService,
      description: t.sectionCatalogDescription,
      icon: Sparkles,
    },
    {
      id: 'catalog',
      label: t.catalog,
      description: t.sectionCatalogDescription,
      icon: Scissors,
    },
  ];
  return (
    <>
      <SectionShell
        title={t.catalog}
        compact={true}
        right={
          <AdminSubviewTabs
            activeView={serviceView}
            tabs={serviceViewTabs}
            onChange={setServiceView}
          />
        }
      >
        {serviceView === 'create' ? (
          <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
            <div className={mobileWorkspaceScrollClass}>
              <ServiceForm
                t={t}
                lang={lang}
                form={createForm}
                onInput={onCreateInput}
                onSubmit={onCreateSubmit}
                submitting={submitting}
                submitLabel={t.addService}
              />
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
              <div className='mb-4 flex items-end justify-between gap-3'>
                <div>
                  <p className='mt-2 text-2xl font-black text-slate-900 dark:text-white'>
                    {formatNumber(services.length, lang)}
                  </p>
                </div>
              </div>

              <div className={`space-y-4 ${mobileWorkspaceScrollClass}`}>
                {services.length === 0 ? (
                  <div
                    className={`rounded-[1.25rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                  >
                    {t.noServicesCreated || t.noServices}
                  </div>
                ) : null}
                {services.map((service) => {
                  const assignedBarberCount = getAssignedBarberCount(service._id);
                  const deleteBlocked = assignedBarberCount > 0;

                  return (
                    <div key={service._id} className={`rounded-[1.25rem] p-5 ${mutedPanel}`}>
                      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                        <div className='min-w-0'>
                          <p className='font-black text-slate-900 dark:text-white'>
                            {getLocalizedName(service, lang)}
                          </p>
                          <p className='mt-2 text-sm leading-7 text-slate-500 dark:text-slate-300'>
                            {getLocalizedDescription(service, lang, t.serviceFallback)}
                          </p>
                          <div className='mt-4 flex flex-wrap gap-2 text-xs font-bold'>
                            {service.badge ? (
                              <span className='rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
                                {lang === 'ar' ? service.badgeAr || service.badge : service.badge}
                              </span>
                            ) : null}
                            <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-200'>
                              {getLocalizedCategoryLabel(service, lang)}
                            </span>
                            <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                              {formatPrice(service.price, lang)}
                            </span>
                            <span className='rounded-full bg-white/85 px-3 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-200'>
                              {formatDuration(service.durationMinutes, lang)}
                            </span>
                            {deleteBlocked ? (
                              <span className='rounded-full border border-amber-300/50 bg-amber-100/70 px-3 py-1 text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/12 dark:text-amber-200'>
                                {assignedBarberCount}{' '}
                                {t.linkedBarbers ||
                                  (lang === 'ar'
                                    ? '\u0627\u0644\u062d\u0644\u0627\u0642\u0648\u0646 \u0627\u0644\u0645\u0631\u062a\u0628\u0637\u0648\u0646'
                                    : 'Linked barbers')}
                              </span>
                            ) : null}
                            {getServiceQualityFlags(service, lang).map((flag) => (
                              <span
                                key={`${service._id}-${flag.id}`}
                                className={`rounded-full border px-3 py-1 ${qualityBadgeClass[flag.tone]}`}
                              >
                                {flag.label}
                              </span>
                            ))}
                          </div>
                          {((lang === 'ar' ? service.featuresAr : service.features) || []).length > 0 ? (
                            <div className='mt-4 flex flex-wrap gap-2'>
                              {(lang === 'ar' ? service.featuresAr : service.features).map((feature) => (
                                <span
                                  key={feature}
                                  className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className='flex shrink-0 gap-2 self-start'>
                          <button
                            type='button'
                            onClick={() => openEditor(service)}
                            className='rounded-full border border-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition hover:text-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:text-white'
                          >
                            {t.editLabel || 'Edit'}
                          </button>
                          <button
                            type='button'
                            onClick={() => onDeleteService(service)}
                            disabled={deleteBlocked}
                            title={
                              deleteBlocked
                                ? t.removeServiceDependencies ||
                                  'Remove this service from assigned barbers before deleting it.'
                                : t.deleteService
                            }
                            className='rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-red-900/40 dark:hover:bg-red-950/30 dark:hover:text-red-300 dark:disabled:border-white/10 dark:disabled:text-slate-500 dark:disabled:hover:bg-transparent'
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SectionShell>

      <ModalShell
        open={Boolean(editingService)}
        onClose={() => setEditingService(null)}
        title={
          editingService
            ? `${t.editServiceTitle || 'Edit service'}: ${getLocalizedName(editingService, lang)}`
            : ''
        }
      >
      <ServiceForm
        t={t}
        lang={lang}
        form={editForm}
          onInput={handleEditInput}
          onSubmit={handleEditSubmit}
          submitting={submitting}
          submitLabel={t.saveChanges || 'Save changes'}
        />
      </ModalShell>
    </>
  );
};

export const AdminBarbersPanel = ({
  t,
  lang,
  services,
  barbers,
  createForm,
  onCreateInput,
  onCreateToggleService,
  onCreateUpdateSchedule,
  onCreateSubmit,
  onUpdateBarber,
  onDeleteBarber,
  submitting,
}) => {
  const [editingBarber, setEditingBarber] = useState(null);
  const [editForm, setEditForm] = useState(createBarberState());
  const [barberView, setBarberView] = useState('manage');

  const openEditor = (barber) => {
    setEditingBarber(barber);
    setEditForm({
      name: barber.name || '',
      nameAr: barber.nameAr || '',
      bio: barber.bio || '',
      bioAr: barber.bioAr || '',
      image: barber.image || '',
      experienceYears: String(barber.experienceYears ?? ''),
      serviceIds: (barber.serviceIds || []).map((service) => service._id),
      isActive: barber.isActive !== false,
      daysOffText: Array.isArray(barber.daysOff) ? barber.daysOff.join(', ') : '',
      workingHours:
        Array.isArray(barber.workingHours) && barber.workingHours.length > 0
          ? barber.workingHours.map((entry) => ({ ...entry }))
          : buildDefaultSchedule(),
    });
  };

  const handleEditInput = (field, value) => {
    const normalizedValue = field === 'experienceYears' ? sanitizeNumericInput(value) : value;
    setEditForm((current) => ({ ...current, [field]: normalizedValue }));
  };

  const toggleEditService = (serviceId) => {
    setEditForm((current) => {
      const exists = current.serviceIds.includes(serviceId);
      return {
        ...current,
        serviceIds: exists
          ? current.serviceIds.filter((id) => id !== serviceId)
          : [...current.serviceIds, serviceId],
      };
    });
  };

  const updateEditSchedule = (dayOfWeek, field, value) => {
    setEditForm((current) => ({
      ...current,
      workingHours: current.workingHours.map((entry) =>
        entry.dayOfWeek === dayOfWeek ? { ...entry, [field]: value } : entry,
      ),
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (
      editForm.isActive &&
      (!editForm.name.trim() ||
        !editForm.nameAr.trim() ||
        !editForm.image.trim() ||
        !editForm.bioAr.trim() ||
        editForm.serviceIds.length === 0 ||
        editForm.workingHours.some((entry) => entry.enabled && (!entry.startTime || !entry.endTime)))
    ) {
      return;
    }
    await onUpdateBarber(editingBarber._id, {
      ...editForm,
      experienceYears: parseNumericValue(editForm.experienceYears, 0),
      daysOff: editForm.daysOffText
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    });
    setEditingBarber(null);
  };

  const barberViewTabs = [
    { id: 'create', label: t.newBarber, description: t.barbersSubtitle, icon: Sparkles },
    { id: 'manage', label: t.team, description: t.barbersSubtitle, icon: Users },
    { id: 'schedule', label: t.schedule, description: t.schedule, icon: CalendarClock },
  ];
  return (
    <>
      <SectionShell
        title={t.team}
        subtitle={t.barbersSubtitle}
        compact={true}
        right={
          <AdminSubviewTabs
            activeView={barberView}
            tabs={barberViewTabs}
            onChange={setBarberView}
            columns={3}
          />
        }
      >
        {barberView === 'create' ? (
          <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
            <p className='mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300'>
              {lang === 'ar'
                ? '\u064a\u062c\u0628 \u0623\u0646 \u064a\u062a\u0636\u0645\u0646 \u0627\u0644\u062d\u0644\u0627\u0642 \u0627\u0644\u0646\u0634\u0637 \u0635\u0648\u0631\u0629 \u0648\u0646\u0633\u062e\u0629 \u0639\u0631\u0628\u064a\u0629 \u0644\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a \u0648\u062e\u062f\u0645\u0629 \u0648\u0627\u062d\u062f\u0629 \u0645\u0639\u064a\u0651\u0646\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0642\u0628\u0644 \u0623\u0646 \u064a\u0635\u0628\u062d \u062c\u0627\u0647\u0632\u0627\u064b \u0644\u0642\u0633\u0645 \u0627\u0644\u0641\u0631\u064a\u0642 \u0641\u064a \u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629.'
                : 'Active barbers should include an image, Arabic profile copy, and at least one assigned service before they are ready for the homepage roster.'}
            </p>
            <div className='mt-4'>
              {services.length === 0 ? (
                <div
                  className={`rounded-[1.25rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.noServices}
                </div>
              ) : (
                <div className={mobileWorkspaceScrollClass}>
                  <BarberForm
                    t={t}
                    lang={lang}
                    form={createForm}
                    services={services}
                    onInput={onCreateInput}
                    onToggleService={onCreateToggleService}
                    onUpdateSchedule={onCreateUpdateSchedule}
                    onSubmit={onCreateSubmit}
                    submitting={submitting}
                    submitLabel={t.addBarber}
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}

        {barberView === 'manage' ? (
          <div className={`rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
            <div className='mb-4 flex items-end justify-between gap-3'>
              <div>
                <p className='mt-2 text-2xl font-black text-slate-900 dark:text-white'>
                  {formatNumber(barbers.length, lang)}
                </p>
              </div>
            </div>
            <div className={`space-y-4 ${mobileWorkspaceScrollClass}`}>
              {barbers.length === 0 ? (
                <div
                  className={`rounded-[1.25rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.noBarbersCreated || t.noServices}
                </div>
              ) : null}
              {barbers.map((barber) => (
                <div key={barber._id} className={`rounded-[1.25rem] p-5 ${mutedPanel}`}>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                    <img
                      src={
                        barber.image ||
                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={getLocalizedName(barber, lang)}
                      className='h-20 w-20 rounded-[1.4rem] object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                        <div className='min-w-0'>
                          <p className='truncate font-black text-slate-900 dark:text-white'>
                            {getLocalizedName(barber, lang)}
                          </p>
                          <p className='mt-2 text-sm leading-7 text-slate-500 dark:text-slate-300'>
                            {getLocalizedBio(barber, lang, t.barberFallback)}
                          </p>
                        </div>
                        <div className='flex shrink-0 gap-2 self-start'>
                          <button
                            type='button'
                            onClick={() => openEditor(barber)}
                            className='rounded-full border border-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition hover:text-slate-900 dark:border-white/10 dark:text-slate-200 dark:hover:text-white'
                          >
                            {t.editLabel || 'Edit'}
                          </button>
                          <button
                            type='button'
                            onClick={() => onDeleteBarber(barber)}
                            className='rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-red-900/40 dark:hover:bg-red-950/30 dark:hover:text-red-300'
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>

                      <div className='mt-4 flex flex-wrap gap-2'>
                        <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                          {formatNumber(barber.experienceYears, lang)} {t.experience}
                        </span>
                        {getBarberQualityFlags(barber, lang).map((flag) => (
                          <span
                            key={`${barber._id}-${flag.id}`}
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${qualityBadgeClass[flag.tone]}`}
                          >
                            {flag.label}
                          </span>
                        ))}
                        {(barber.serviceIds || []).map((service) => (
                          <span
                            key={service._id}
                            className='rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200'
                          >
                            {getLocalizedName(service, lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {barberView === 'schedule' ? (
          <div className={`space-y-4 ${mobileWorkspaceScrollClass}`}>
            {barbers.length === 0 ? (
              <div
                className={`rounded-[1.25rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {t.noBarbersCreated || t.noServices}
              </div>
            ) : (
              barbers.map((barber) => {
                const enabledDays = (barber.workingHours || []).filter((entry) => entry.enabled);

                return (
                  <details key={barber._id} className={`group rounded-[1.35rem] p-4 sm:p-5 ${glassPanel}`}>
                    <summary className='flex cursor-pointer list-none flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                      <div className='min-w-0'>
                        <p className='text-lg font-black text-slate-900 dark:text-white'>
                          {getLocalizedName(barber, lang)}
                        </p>
                        <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
                          {`${formatNumber(enabledDays.length, lang)} ${t.schedule}`}
                        </p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <button
                          type='button'
                          onClick={(event) => {
                            event.preventDefault();
                            openEditor(barber);
                          }}
                          className='inline-flex min-h-[2.9rem] items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white'
                        >
                          {t.editLabel || 'Edit'}
                        </button>
                        <span className='text-slate-400 transition group-open:rotate-180'>
                          <ChevronDown size={18} />
                        </span>
                      </div>
                    </summary>

                    <div className='mt-4 grid gap-3 lg:grid-cols-2'>
                      {(barber.workingHours || []).map((entry) => {
                        const scheduleLine = formatScheduleRange(entry);

                        return (
                          <div key={`${barber._id}-${entry.dayOfWeek}`} className={`rounded-[1rem] p-3 ${mutedPanel}`}>
                            <div className='flex items-center justify-between gap-3'>
                              <p className='font-bold text-slate-900 dark:text-white'>
                                {dayLabels[lang]?.[entry.dayOfWeek] || dayLabels.en[entry.dayOfWeek]}
                              </p>
                              <span className='text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500'>
                                {entry.enabled ? t.open : t.closed}
                              </span>
                            </div>
                            <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
                              {scheduleLine || '—'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })
            )}
          </div>
        ) : null}
      </SectionShell>

      <ModalShell
        open={Boolean(editingBarber)}
        onClose={() => setEditingBarber(null)}
        title={
          editingBarber
            ? `${t.editBarberTitle || 'Edit barber'}: ${getLocalizedName(editingBarber, lang)}`
            : ''
        }
      >
        <BarberForm
          t={t}
          lang={lang}
          form={editForm}
          services={services}
          onInput={handleEditInput}
          onToggleService={toggleEditService}
          onUpdateSchedule={updateEditSchedule}
          onSubmit={handleEditSubmit}
          submitting={submitting}
          submitLabel={t.saveChanges || 'Save changes'}
        />
      </ModalShell>
    </>
  );
};

