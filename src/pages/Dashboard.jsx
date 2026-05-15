/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  CalendarRange,
  CalendarX,
  Camera,
  Clock3,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Scissors,
  Settings,
  Sparkles,
  SunMedium,
  UserCheck,
  UserRound,
  X,
} from 'lucide-react';

import KuwaitFlagBadge from '../components/KuwaitFlagBadge';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContext } from '../context/ToastContext';
import { WarningIcon } from '../components/Icons';
import useUserDashboardBookings from '../hooks/useUserDashboardBookings';
import { translations } from '../utils/i18n';
import {
  KUWAIT_DIAL_CODE,
  isValidKuwaitPhone,
  normalizeKuwaitPhoneInput,
} from '../utils/kuwaitPhone';
import {
  optimizeProfileImage,
  validateProfileImageFile,
} from '../utils/profileImage';
import {
  formatBookingDateLabel,
  getBookingDateTimeValue,
  getBookingDisplayDate,
} from '../utils/bookingDateTime';
import { getDashboardSharedCopy } from '../utils/dashboardCopy';
import { repairArabicObject } from '../utils/repairArabicText';

const isBookingUpcoming = (booking, now = Date.now()) =>
  getBookingDateTimeValue(booking) >= now;

const formatBookingTime = (time, lang) => {
  if (!time) return '—';
  const [hour, minute] = String(time).split(':');
  const safeHour = Number(hour);
  const safeMinute = Number(minute);

  if (Number.isNaN(safeHour) || Number.isNaN(safeMinute)) {
    return time;
  }

  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-KW' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, safeHour, safeMinute));
};

const getLocalizedBookingService = (booking, lang) =>
  lang === 'ar'
    ? booking?.serviceAr || booking?.service || 'Booking'
    : booking?.service || booking?.serviceAr || 'Booking';

const copy = {
  en: {
    overview: 'Dashboard',
    overviewSubtitle:
      'Manage your appointments, update your profile, and keep your next visit in view.',
    backToSite: 'Back to site',
    editProfile: 'Update profile',
    saveProfile: 'Save changes',
    choosePhoto: 'Choose from device',
    takePhoto: 'Take photo',
    removePhoto: 'Remove photo',
    photoRules:
      'Choose a JPG, PNG, or WEBP up to 5 MB. Use your camera or device library. No image links required.',
    nameLabel: 'Name',
    phoneLabel: 'Mobile number',
    phoneHelp: 'Used for WhatsApp appointment updates. Email notifications will still continue.',
    phoneInvalid: 'Enter a valid 8-digit Kuwaiti phone number.',
    phoneSavedLabel: 'WhatsApp updates',
    emailLabel: 'Email',
    emailReadOnly: 'Email stays tied to your account login.',
    phoneMissing: 'Add your mobile number to receive WhatsApp booking updates.',
    phoneReady: 'Enabled for',
    preparingPhoto: 'Preparing photo...',
    profileSaved: 'Profile updated successfully.',
    profileUpdated: 'Profile updated successfully.',
    profileUpdateFailed: 'Failed to update your profile.',
    imageValidationFailed: 'Please select a valid image under 5 MB.',
    removeProfilePending: 'Photo removed. Save changes to apply it.',
    removeProfileDone: 'Profile photo removed.',
    upcomingAppointments: 'Appointments',
    liveUpdated: 'Your dashboard was updated live.',
    profileCardTitle: 'Profile',
    profileCardBody:
      'Keep your details up to date for smoother bookings and notifications.',
    bookAppointment: 'Book an appointment',
    bookAgain: 'Book again',
    pastAppointments: 'Past visits',
    welcomeBack: 'Welcome back,',
    nextAppointment: 'Next appointment',
    yourActivity: 'Your activity',
    quickActions: 'Quick actions',
    navOverview: 'Dashboard',
    navNextVisit: 'Next appointment',
    navActiveBookings: 'Active bookings',
    navHistory: 'Past visits',
    navProfile: 'Profile settings',
    navBook: 'Book now',
    navLogout: 'Log out',
    languageSwitch: 'Language',
    appearanceSwitch: 'Theme',
    jumpToActive: 'View active bookings',
    jumpToHistory: 'View past visits',
    noNextVisit: 'No next appointment yet',
    noNextVisitBody: 'Once you book a service, your next visit will stay front and center here.',
    cancelBookingShort: 'Cancel',
    accountSummary: 'Account summary',
    manageProfile: 'Profile settings',
    appearance: 'Appearance',
    language: 'Language',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    logout: 'Logout',
    loggingOut: 'Logging out...',
    logoutTitle: 'Log out now?',
    logoutMessage: 'You will be signed out of your account and returned to the login screen.',
    stayHere: 'Stay here',
    confirmLogout: 'Log out',
    active: 'Active bookings',
    cancelled: 'Cancelled bookings',
    next: 'Next visit',
    statusActive: 'Active',
    statusPast: 'Past',
    statusCancelled: 'Cancelled',
    statusCompleted: 'Completed',
    statusNoShow: 'No-show',
    cancelAppointment: 'Cancel Appointment',
    cancelConfirm:
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
    goBack: 'Go Back',
    confirmCancel: 'Confirm Cancel',
    dashboardEmpty: 'No Appointments Yet',
    dashboardEmptyDesc:
      "Looks like you haven't booked any appointments yet. Start with your first one now.",
    phonePlaceholder: '4XXXXXXX',
    loadBookingsFailed: 'Failed to load bookings.',
    cancelSuccess: 'Booking cancelled successfully.',
    cancelFailed: 'Failed to cancel booking.',
  },
  ar: {
    overview: 'لوحة التحكم',
    overviewSubtitle:
      'أدر مواعيدك وحدّث ملفك الشخصي وابقَ على اطلاع بموعدك القادم.',
    backToSite: 'العودة إلى الموقع',
    editProfile: 'تحديث الملف الشخصي',
    saveProfile: 'حفظ التغييرات',
    choosePhoto: 'اختر من الجهاز',
    takePhoto: 'التقاط صورة',
    removePhoto: 'إزالة الصورة',
    photoRules:
      'اختر صورة بصيغة JPG أو PNG أو WEBP حتى 5 ميجابايت. يمكنك استخدام الكاميرا أو مكتبة الجهاز.',
    nameLabel: 'الاسم',
    phoneLabel: 'رقم الجوال',
    phoneHelp: 'يُستخدم لإشعارات المواعيد عبر WhatsApp. وستستمر إشعارات البريد الإلكتروني أيضاً.',
    phoneInvalid: 'أدخل رقم جوال كويتي صحيح مكوّن من 8 أرقام.',
    phoneSavedLabel: 'تحديثات WhatsApp',
    emailLabel: 'البريد الإلكتروني',
    emailReadOnly: 'يبقى البريد الإلكتروني مرتبطاً بتسجيل الدخول للحساب.',
    phoneMissing: 'أضف رقم جوالك لتستقبل تحديثات الحجز عبر WhatsApp.',
    phoneReady: 'مفعل لـ',
    preparingPhoto: 'جار تجهيز الصورة...',
    profileSaved: 'تم حفظ الملف الشخصي بنجاح.',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح.',
    profileUpdateFailed: 'تعذر تحديث الملف الشخصي.',
    imageValidationFailed: 'يرجى اختيار صورة صحيحة لا تتجاوز 5 ميجابايت.',
    removeProfilePending: 'تمت إزالة الصورة. احفظ التغييرات لتطبيق ذلك.',
    removeProfileDone: 'تمت إزالة صورة الملف الشخصي.',
    upcomingAppointments: 'المواعيد',
    liveUpdated: 'تم تحديث لوحتك مباشرة.',
    profileCardTitle: 'الملف الشخصي',
    profileCardBody:
      'حافظ على تحديث بياناتك لتجربة حجز وإشعارات أكثر سلاسة.',
    bookAppointment: 'احجز موعداً',
    bookAgain: 'إعادة الحجز',
    pastAppointments: 'الزيارات السابقة',
    welcomeBack: 'مرحباً بعودتك،',
    nextAppointment: 'الموعد القادم',
    yourActivity: 'نشاطك',
    quickActions: 'إجراءات سريعة',
    navOverview: 'لوحة التحكم',
    navNextVisit: 'الموعد القادم',
    navActiveBookings: 'الحجوزات النشطة',
    navHistory: 'الزيارات السابقة',
    navProfile: 'إعدادات الملف الشخصي',
    navBook: 'احجز الآن',
    navLogout: 'تسجيل الخروج',
    languageSwitch: 'اللغة',
    appearanceSwitch: 'المظهر',
    jumpToActive: 'عرض الحجوزات النشطة',
    jumpToHistory: 'عرض الزيارات السابقة',
    noNextVisit: 'لا يوجد موعد قادم بعد',
    noNextVisitBody: 'بمجرد حجز خدمة، سيبقى موعدك القادم واضحاً هنا دائماً.',
    cancelBookingShort: 'إلغاء',
    accountSummary: 'ملخص الحساب',
    manageProfile: 'إعدادات الملف الشخصي',
    appearance: 'المظهر',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    logout: 'تسجيل الخروج',
    loggingOut: 'جار تسجيل الخروج...',
    logoutTitle: 'تسجيل الخروج الآن؟',
    logoutMessage: 'سيتم تسجيل خروجك من الحساب وإعادتك إلى شاشة تسجيل الدخول.',
    stayHere: 'البقاء هنا',
    confirmLogout: 'تسجيل الخروج',
    active: 'الحجوزات النشطة',
    cancelled: 'الحجوزات الملغاة',
    next: 'الزيارة القادمة',
    statusActive: 'نشط',
    statusPast: 'سابق',
    statusCancelled: 'ملغي',
    statusCompleted: 'مكتمل',
    statusNoShow: 'لم يحضر',
    cancelAppointment: 'إلغاء الموعد',
    cancelConfirm: 'هل أنت متأكد من إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.',
    goBack: 'رجوع',
    confirmCancel: 'تأكيد الإلغاء',
    dashboardEmpty: 'لا توجد مواعيد بعد',
    dashboardEmptyDesc: 'يبدو أنك لم تحجز أي مواعيد بعد. ابدأ بحجز موعدك الأول الآن.',
    phonePlaceholder: '4XXXXXXX',
    loadBookingsFailed: 'تعذر تحميل الحجوزات.',
    cancelSuccess: 'تم إلغاء الحجز بنجاح.',
    cancelFailed: 'تعذر إلغاء الحجز.',
  },
};
const glassPanel =
  'border border-brand-gold/22 bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,226,0.98))] shadow-[0_18px_48px_rgba(124,89,39,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl dark:border-brand-gold/18 dark:bg-[linear-gradient(180deg,rgba(15,12,10,0.98),rgba(8,7,6,0.98))] dark:shadow-[0_24px_80px_rgba(0,0,0,0.34)] dark:backdrop-blur-none';
const actionButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60';
const subtleButtonClass =
  'border border-brand-gold/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,236,221,0.94))] text-slate-800 shadow-[0_8px_24px_rgba(124,89,39,0.06)] hover:-translate-y-[1px] hover:border-brand-gold/52 hover:text-[#8b6238] hover:shadow-[0_14px_28px_rgba(124,89,39,0.1)] dark:border-brand-gold/20 dark:bg-[linear-gradient(180deg,rgba(24,21,18,0.98),rgba(15,13,11,0.98))] dark:text-[#f4ead6] dark:shadow-none dark:hover:border-brand-gold/40 dark:hover:text-brand-gold-soft dark:hover:shadow-none';
const primaryButtonClass =
  'bg-[linear-gradient(135deg,#f1ddb2_0%,#c9a45c_52%,#9d7242_100%)] text-brand-ink shadow-[0_16px_38px_rgba(201,164,92,0.28)] hover:-translate-y-[1px] hover:shadow-[0_22px_46px_rgba(201,164,92,0.34)]';
const dangerButtonClass =
  'border border-rose-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,241,242,0.96))] text-rose-700 shadow-[0_10px_24px_rgba(244,63,94,0.08)] hover:-translate-y-[1px] hover:border-rose-300 hover:bg-[linear-gradient(180deg,rgba(255,247,248,0.98),rgba(255,228,232,0.98))] hover:text-rose-800 hover:shadow-[0_16px_30px_rgba(244,63,94,0.12)] dark:border-rose-500/20 dark:bg-[linear-gradient(180deg,rgba(47,18,25,0.72),rgba(33,14,20,0.8))] dark:text-rose-200 dark:shadow-none dark:hover:border-rose-400/28 dark:hover:text-rose-100';
const accentSecondaryButtonClass =
  'border border-brand-gold/28 bg-[linear-gradient(180deg,rgba(255,252,245,0.98),rgba(245,233,210,0.96))] text-[#8b6238] shadow-[0_12px_26px_rgba(201,164,92,0.12)] hover:-translate-y-[1px] hover:border-brand-gold/56 hover:text-[#6f4d2a] hover:shadow-[0_18px_34px_rgba(201,164,92,0.18)] dark:border-brand-gold/24 dark:bg-[linear-gradient(180deg,rgba(42,32,20,0.8),rgba(28,21,14,0.88))] dark:text-[#f3dfb6] dark:shadow-none dark:hover:border-brand-gold/40 dark:hover:text-[#fff0cb]';
const insetPanelClass =
  'border border-brand-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(249,242,231,0.6))] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-brand-gold/14 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.015))] dark:shadow-none';
const workspaceFrame =
  'overflow-hidden rounded-[2rem] border border-brand-gold/24 bg-[linear-gradient(180deg,#fffaf3_0%,#f6ead7_100%)] shadow-[0_28px_80px_rgba(124,89,39,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-brand-gold/18 dark:bg-[linear-gradient(180deg,#080706_0%,#040403_100%)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.46)]';
const sidebarButtonClass =
  'flex min-h-[3rem] w-full items-center gap-2.5 rounded-[0.95rem] px-3.5 text-left text-[13px] font-semibold transition';

const Avatar = ({ user, imageOverride = '', large = false }) => {
  const sizeClass = large ? 'h-20 w-20' : 'h-12 w-12';
  const source = imageOverride || user?.profileImage || '';

  if (source) {
    return (
      <img
        src={source}
        alt={user?.name || 'User'}
        className={`${sizeClass} rounded-[1rem] object-cover border border-slate-200 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-800`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-[1rem] border border-brand-gold/12 bg-white/64 font-bold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/5 dark:text-slate-200`}
    >
      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
};

const SkeletonCard = () => (
  <div className={`rounded-[1.1rem] p-4 ${glassPanel}`} aria-busy='true'>
    <div className='flex items-center gap-4 animate-pulse'>
      <div className='h-14 w-14 rounded-[1rem] bg-brand-gold/[0.12] dark:bg-white/8' />
      <div className='flex-1 space-y-3'>
        <div className='h-4 w-32 rounded bg-brand-gold/[0.14] dark:bg-white/8' />
        <div className='h-3 w-56 rounded bg-brand-gold/[0.08] dark:bg-white/5' />
      </div>
    </div>
  </div>
);

const DashboardSection = ({
  eyebrow,
  title,
  action,
  children,
  titleClassName = '',
  contentClassName = '',
}) => (
  <section className={`rounded-[1.2rem] p-4 sm:p-5 ${glassPanel}`}>
    <div className='flex flex-col gap-3 border-b border-brand-gold/14 pb-3 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        {eyebrow ? (
          <p className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-gold'>
            {eyebrow}
          </p>
        ) : null}
        <h2 className={`mt-1 font-display text-[1.9rem] font-semibold tracking-tight text-slate-900 dark:text-[#f6eddc] ${titleClassName}`}>{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
    <div className={`mt-3 ${contentClassName}`}>{children}</div>
  </section>
);

const DetailItem = ({ label, value }) => (
  <div className='text-sm'>
    <p className='text-[10px] font-black uppercase tracking-[0.22em] text-[#b4884b] dark:text-[#c9a45c]'>
      {label}
    </p>
    <p className='mt-2 break-words text-[1.02rem] font-medium text-slate-800 dark:text-[#f4ead6]'>{value}</p>
  </div>
);

const SidebarNavButton = ({ icon: Icon, label, active, onClick, badge = null }) => (
  <button
    type='button'
    onClick={onClick}
    className={`${sidebarButtonClass} ${
      active
        ? 'border border-brand-gold/26 bg-[linear-gradient(90deg,rgba(201,164,92,0.22),rgba(255,255,255,0.42))] shadow-[0_10px_24px_rgba(124,89,39,0.08)] text-slate-900 dark:bg-[linear-gradient(90deg,rgba(201,164,92,0.18),rgba(201,164,92,0.06))] dark:text-[#f8f0df] dark:shadow-none'
        : 'border border-transparent text-slate-700 hover:border-brand-gold/18 hover:bg-brand-gold/[0.07] hover:text-slate-900 dark:text-white/76 dark:hover:bg-white/[0.03] dark:hover:text-white'
    }`}
  >
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-[0.85rem] ${
        active ? 'bg-brand-gold/16 text-brand-gold' : 'bg-brand-gold/[0.08] text-slate-600 dark:bg-white/[0.03] dark:text-white/60'
      }`}
    >
      <Icon size={16} />
    </span>
    <span className='flex-1 truncate'>{label}</span>
    {badge ? (
      <span className='inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-brand-gold/26 px-1.5 text-[10px] font-black text-brand-gold'>
        {badge}
      </span>
    ) : null}
  </button>
);

const UserIdentityBlock = ({ user, subtitle, compact = false }) => (
  <div className='flex min-w-0 items-center gap-3'>
    {user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={user?.name || 'User'}
        className={`${compact ? 'h-11 w-11 rounded-[0.9rem]' : 'h-13 w-13 rounded-[1rem]'} shrink-0 object-cover ring-1 ring-brand-gold/18`}
      />
    ) : (
      <div className={`${compact ? 'h-11 w-11 rounded-[0.9rem]' : 'h-13 w-13 rounded-[1rem]'} flex shrink-0 items-center justify-center border border-brand-gold/26 bg-brand-gold/10 text-brand-gold`}>
        <UserRound size={compact ? 18 : 22} />
      </div>
    )}
    <div className='min-w-0'>
      <p className={`truncate ${compact ? 'text-[1.02rem]' : 'text-[1.15rem]'} font-black text-slate-900 dark:text-[#f6eddc]`}>
        {user?.name || 'User'}
      </p>
      <p className='mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-brand-gold'>
        {subtitle}
      </p>
    </div>
  </div>
);

const MobileDrawerNav = ({
  activeSection,
  dashboardCopy,
  isOpen,
  isRTL,
  navItems,
  onClose,
  onLogout,
  onNavigateHome,
  onOpenSettings,
  onSelectSection,
  onStartBooking,
  user,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm xl:hidden'
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 36 : -36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 36 : -36 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`h-full w-[min(19rem,86vw)] p-3 sm:p-4 ${isRTL ? 'ml-auto' : ''}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`flex h-full flex-col rounded-[1.4rem] p-3.5 ${glassPanel}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div
                className={`flex items-center justify-between gap-3 border-b border-brand-gold/16 pb-4 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`${isRTL ? 'flex-row-reverse' : ''}`}>
                  <UserIdentityBlock
                    user={user}
                    subtitle={dashboardCopy.overview}
                    compact={true}
                  />
                </div>

                <button
                  type='button'
                  onClick={onClose}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/16 bg-white/80 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                  aria-label='Close dashboard navigation'
                >
                  <X size={18} />
                </button>
              </div>

              <div className='mt-3.5 flex-1 overflow-y-auto pr-1'>
                <nav className='space-y-1.5'>
                  {navItems.map((item) => (
                    <SidebarNavButton
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      active={activeSection === item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        onClose();
                      }}
                    />
                  ))}
                </nav>

                <div className='mt-3.5 space-y-2.5'>
                  <button
                    type='button'
                    onClick={() => {
                      onOpenSettings();
                      onClose();
                    }}
                    className={`${actionButtonClass} ${subtleButtonClass} min-h-[3rem] w-full rounded-[1rem]`}
                  >
                    <Settings size={16} />
                    {dashboardCopy.manageProfile}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      onNavigateHome();
                      onClose();
                    }}
                    className={`${actionButtonClass} ${subtleButtonClass} min-h-[3rem] w-full rounded-[1rem]`}
                  >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                    {dashboardCopy.backToSite}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className={`${actionButtonClass} ${subtleButtonClass} mt-4 min-h-[3rem] w-full rounded-[1rem]`}
                  >
                    <LogOut size={16} />
                    {dashboardCopy.navLogout}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const QuickActionCard = ({ icon: Icon, label, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex min-h-[4.6rem] items-center gap-3 rounded-[1rem] p-3.5 text-left ${insetPanelClass} text-slate-800 transition duration-200 hover:-translate-y-[1px] hover:border-brand-gold/28 hover:text-[#8b6238] hover:shadow-[0_16px_30px_rgba(124,89,39,0.08)] sm:min-h-[5.8rem] sm:flex-col sm:justify-center sm:gap-2 sm:text-center dark:text-[#f4ead6] dark:hover:text-brand-gold-soft dark:hover:shadow-none`}
  >
    <span className='flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-brand-gold/16 bg-brand-gold/[0.08] text-brand-gold dark:bg-white/[0.02]'>
      <Icon size={18} />
    </span>
    <span className='text-sm font-medium leading-5 sm:text-[12px]'>{label}</span>
  </button>
);

const NextVisitCard = ({ booking, lang, dashboardCopy, onCancel }) => {
  if (!booking) {
    return (
      <div className={`rounded-[1.2rem] border border-dashed p-6 ${insetPanelClass}`}>
        <p className='text-lg font-semibold text-slate-900 dark:text-[#f6eddc]'>
          {dashboardCopy.noNextVisit}
        </p>
        <p className='mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/64'>
          {dashboardCopy.noNextVisitBody}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-[1.05rem] border border-brand-gold/14 p-3.5 sm:p-4 ${insetPanelClass}`}>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='min-w-0 flex-1'>
          <p className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-gold'>
            {dashboardCopy.nextAppointment}
          </p>
          <h3 className='mt-2 text-[1.35rem] font-black tracking-tight text-slate-900 dark:text-[#f6eddc] sm:text-[1.55rem]'>
            {getLocalizedBookingService(booking, lang)}
          </h3>
          <div className='mt-3 grid gap-2 text-slate-700 dark:text-white/78 sm:grid-cols-3'>
            <div className='flex items-center gap-3 text-sm'>
              <CalendarDays size={17} className='text-brand-gold' />
              <span>{formatBookingDateLabel(booking, lang)} • {formatBookingTime(booking.time, lang)}</span>
            </div>
            <div className='flex items-center gap-3 text-sm'>
              <UserRound size={17} className='text-brand-gold' />
              <span>{booking.barber?.name || '—'}</span>
            </div>
            <div className='flex items-center gap-3 text-sm'>
              <Clock3 size={17} className='text-brand-gold' />
              <span>{booking.time || '—'}</span>
            </div>
          </div>

        </div>

        <div className='flex flex-col items-center gap-3 lg:w-[9.5rem]'>
          <div className='relative flex h-[6.8rem] w-[6.8rem] items-center justify-center rounded-[1.35rem] border border-brand-gold/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,239,226,0.84))] shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:bg-[linear-gradient(180deg,rgba(24,21,18,0.98),rgba(14,12,10,0.98))] dark:shadow-[0_12px_28px_rgba(0,0,0,0.22)] sm:h-[7.4rem] sm:w-[7.4rem]'>
            <div className='absolute inset-2 rounded-[1.2rem] border border-brand-gold/10' />
            {booking.barber?.image || booking.barber?.profileImage ? (
              <img
                src={booking.barber.image || booking.barber.profileImage}
                alt={booking.barber?.name || getLocalizedBookingService(booking, lang)}
                className='relative z-10 h-[5.05rem] w-[5.05rem] rounded-[0.95rem] object-cover shadow-[0_10px_22px_rgba(0,0,0,0.22)] sm:h-[5.55rem] sm:w-[5.55rem]'
              />
            ) : (
              <div className='relative z-10 flex h-[5.05rem] w-[5.05rem] items-center justify-center rounded-[0.95rem] border border-brand-gold/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,244,233,0.68))] text-brand-gold dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] sm:h-[5.55rem] sm:w-[5.55rem]'>
                <Scissors size={26} />
              </div>
            )}
          </div>
          <button
            type='button'
            onClick={() => onCancel(booking)}
            className={`${actionButtonClass} ${dangerButtonClass} min-h-[2.75rem] w-full rounded-[1rem] px-4`}
          >
            {dashboardCopy.cancelBookingShort}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, lang, dashboardCopy, onCancel, onRebook }) => {
  const date = getBookingDisplayDate(booking);
  const isActionableActive = booking.status === 'active' && isBookingUpcoming(booking);
  const statusLabel =
    booking.status === 'completed'
      ? dashboardCopy.statusCompleted
      : booking.status === 'no_show'
        ? dashboardCopy.statusNoShow
        : booking.status === 'active' && !isActionableActive
          ? dashboardCopy.statusPast
          : isActionableActive
          ? dashboardCopy.statusActive
          : dashboardCopy.statusCancelled;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-[0.95rem] border p-2.5 transition-all duration-200 sm:p-3 ${
        isActionableActive
          ? 'border-brand-gold/18 bg-[linear-gradient(180deg,rgba(255,254,251,0.97),rgba(248,240,227,0.97))] shadow-[0_16px_32px_rgba(124,89,39,0.06)] dark:bg-[linear-gradient(180deg,rgba(21,18,16,0.98),rgba(12,10,9,0.98))] dark:shadow-none'
          : 'border-brand-gold/14 bg-[linear-gradient(180deg,rgba(252,248,241,0.95),rgba(242,235,223,0.95))] opacity-90 dark:bg-[linear-gradient(180deg,rgba(18,16,14,0.92),rgba(10,9,8,0.92))] dark:opacity-85'
      }`}
    >
      <div className='flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-start gap-2.5'>
          <div className='flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-[0.8rem] border border-brand-gold/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,243,232,0.68))] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] dark:shadow-none sm:h-15 sm:w-15'>
            <span className='text-[10px] font-black uppercase tracking-[0.16em] text-brand-gold'>
              {date
                ? date.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
                    month: 'short',
                  })
                : ''}
            </span>
            <span className='mt-0.5 text-[1.7rem] font-semibold leading-none text-slate-900 dark:text-[#f6eddc]'>
              {date ? date.getDate() : ''}
            </span>
          </div>

            <div className='min-w-0 space-y-1.5'>
              <h3
                className={`truncate text-[1rem] font-black leading-tight sm:text-[1.05rem] ${
                  isActionableActive
                    ? 'text-slate-900 dark:text-[#f6eddc]'
                    : 'line-through text-slate-400 dark:text-white/38'
              }`}
            >
              {getLocalizedBookingService(booking, lang)}
            </h3>
              <div className='flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]'>
                <span className='rounded-full border border-brand-gold/16 bg-brand-gold/[0.08] px-2.5 py-1 font-medium text-slate-700 dark:bg-white/[0.03] dark:text-white/76'>
                  {booking.barber?.name || '—'}
                </span>
                <span className='rounded-full border border-brand-gold/16 bg-brand-gold/[0.08] px-2.5 py-1 font-medium text-slate-700 dark:bg-white/[0.03] dark:text-white/76'>
                  {booking.time || '—'}
                </span>
                <span className='rounded-full border border-brand-gold/12 bg-white/70 px-2.5 py-1 font-medium text-slate-500 dark:bg-white/[0.02] dark:text-white/52'>
                  {formatBookingDateLabel(booking, lang)}
                </span>
              </div>
            </div>
          </div>

        <div className='flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-1.5'>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
              isActionableActive
                ? 'bg-brand-gold text-brand-ink'
                : 'border border-brand-gold/12 bg-brand-gold/[0.08] text-slate-600 dark:bg-white/[0.03] dark:text-white/60'
            }`}
          >
            {statusLabel}
          </span>

          {isActionableActive ? (
            <button
              type='button'
              onClick={() => onCancel(booking)}
              className={`${actionButtonClass} ${dangerButtonClass} min-h-[2.35rem] rounded-[0.9rem] px-3 py-2 text-[12px]`}
            >
              {dashboardCopy.cancelBookingShort}
            </button>
          ) : (
            <button
              type='button'
              onClick={() => onRebook(booking)}
              className={`${actionButtonClass} ${accentSecondaryButtonClass} min-h-[2.35rem] rounded-[0.9rem] px-3 py-2 text-[12px]`}
            >
              {dashboardCopy.bookAgain}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ActionModal = ({ open, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex overflow-y-auto overscroll-contain bg-black/55 p-4 backdrop-blur-md sm:items-center sm:justify-center'
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const CancelModal = ({ target, onClose, onConfirm, loading, dashboardCopy }) => {
  if (!target) return null;

  return (
    <ActionModal open={Boolean(target)}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        role='dialog'
        aria-modal='true'
        className={`relative my-auto w-full max-w-sm rounded-[1rem] p-6 ${glassPanel}`}
      >
        <div className='mb-4 flex justify-center'>
          <div className='rounded-full bg-red-500/10 p-3 text-red-500'>
            <WarningIcon />
          </div>
        </div>

        <h3 className='text-center text-lg font-black text-slate-900 dark:text-white'>
          {dashboardCopy.cancelAppointment}
        </h3>
        <p className='mt-2 text-center text-sm leading-6 text-slate-500 dark:text-slate-300'>
          {dashboardCopy.cancelConfirm}
        </p>

        <div className='mt-6 flex gap-3'>
          <button
            onClick={onClose}
            disabled={loading}
            className={`${actionButtonClass} ${subtleButtonClass} flex-1`}
          >
            {dashboardCopy.goBack}
          </button>
          <button
            onClick={() => onConfirm(target._id)}
            disabled={loading}
            className={`${actionButtonClass} ${primaryButtonClass} flex-1 rounded-xl`}
          >
            {loading ? `${dashboardCopy.confirmCancel}...` : dashboardCopy.confirmCancel}
          </button>
        </div>
      </motion.div>
    </ActionModal>
  );
};

const LogoutConfirmModal = ({ open, onClose, onConfirm, loading, dashboardCopy }) => {
  if (!open) return null;

  return (
    <ActionModal open={open}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        role='dialog'
        aria-modal='true'
        className={`relative my-auto w-full max-w-sm rounded-[1rem] p-6 ${glassPanel}`}
      >
        <div className='mb-4 flex justify-center'>
          <div className='rounded-full bg-brand-gold/12 p-3 text-brand-gold'>
            <LogOut size={20} />
          </div>
        </div>

        <h3 className='text-center text-lg font-black text-slate-900 dark:text-white'>
          {dashboardCopy.logoutTitle}
        </h3>
        <p className='mt-2 text-center text-sm leading-6 text-slate-600 dark:text-slate-300'>
          {dashboardCopy.logoutMessage}
        </p>

        <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className={`${actionButtonClass} ${subtleButtonClass} flex-1`}
          >
            {dashboardCopy.stayHere}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className={`${actionButtonClass} ${primaryButtonClass} flex-1 rounded-xl`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                {dashboardCopy.loggingOut}
              </>
            ) : (
              dashboardCopy.confirmLogout
            )}
          </button>
        </div>
      </motion.div>
    </ActionModal>
  );
};

const ProfileModal = ({
  open,
  onClose,
  onSave,
  image,
  name,
  email,
  onNameChange,
  phone,
  onPhoneChange,
  onPickPhoto,
  onCapturePhoto,
  onRemovePhoto,
  loading,
  imageProcessing,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  dashboardCopy,
  user,
  hasChanges,
  phoneValid,
}) => {
  if (!open) return null;

  const hasProfileImage = Boolean(image || user?.profileImage);

  return (
    <ActionModal open={open}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        role='dialog'
        aria-modal='true'
        className={`my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col rounded-[1rem] p-6 ${glassPanel}`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className='overflow-y-auto pr-1'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='rounded-lg border border-brand-gold/12 bg-white/62 p-3 text-brand-gold backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/5 dark:text-brand-gold-soft'>
              <Camera size={20} />
            </div>
            <div>
              <h3 className='text-xl font-black text-slate-900 dark:text-white'>
                {dashboardCopy.manageProfile}
              </h3>
              <p className='mt-1 text-sm text-slate-500 dark:text-slate-300'>
                {dashboardCopy.profileCardBody}
              </p>
            </div>
          </div>

          <div className={`mb-4 rounded-[1rem] p-4 ${insetPanelClass}`}>
            <p className='text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
              {dashboardCopy.editProfile}
            </p>
            <div className='mt-3 flex flex-col items-center text-center'>
              <Avatar user={user} imageOverride={image} large={true} />
              <p className='mt-4 text-xs leading-6 text-slate-500 dark:text-slate-300'>
                {dashboardCopy.photoRules}
              </p>
            </div>
            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              <button
                type='button'
                onClick={onPickPhoto}
                disabled={loading || imageProcessing}
                className={`${actionButtonClass} ${subtleButtonClass}`}
              >
                {imageProcessing ? <Loader2 size={16} className='animate-spin' /> : null}
                {dashboardCopy.choosePhoto}
              </button>
              <button
                type='button'
                onClick={onCapturePhoto}
                disabled={loading || imageProcessing}
                className={`${actionButtonClass} ${subtleButtonClass}`}
              >
                {imageProcessing ? <Loader2 size={16} className='animate-spin' /> : null}
                {dashboardCopy.takePhoto}
              </button>
            </div>
            {imageProcessing ? (
              <p className='mt-3 text-xs font-semibold text-slate-500 dark:text-slate-300'>
                {dashboardCopy.preparingPhoto}
              </p>
            ) : null}
            <button
              type='button'
              onClick={onRemovePhoto}
              disabled={loading || !hasProfileImage}
              className={`${actionButtonClass} ${subtleButtonClass} mt-3 w-full`}
            >
              {dashboardCopy.removePhoto}
            </button>
          </div>

          <div className='mb-4 grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                {dashboardCopy.nameLabel}
              </label>
              <input
                type='text'
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                autoComplete='name'
                disabled={loading}
                className='min-h-[3rem] w-full rounded-xl border border-brand-gold/14 bg-white/72 px-3.5 text-sm font-semibold text-slate-900 outline-none backdrop-blur-xl transition focus:border-brand-gold/40 dark:border-brand-gold/14 dark:bg-white/5 dark:text-white dark:focus:border-brand-gold/34'
              />
            </div>
            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                {dashboardCopy.emailLabel}
              </label>
              <input
                type='email'
                value={email}
                readOnly
                disabled
                className='min-h-[3rem] w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              />
              <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-slate-300'>
                {dashboardCopy.emailReadOnly}
              </p>
            </div>
          </div>

          <div className={`mb-4 rounded-[1rem] p-4 ${insetPanelClass}`}>
            <p className='text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
              {dashboardCopy.phoneSavedLabel}
            </p>
            <div className='mt-3'>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                {dashboardCopy.phoneLabel}
              </label>
              <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-2'>
                <div className={`inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold ${insetPanelClass}`}>
                  <KuwaitFlagBadge className='h-4 w-6 rounded-[2px] object-cover shadow-sm' />
                  <span>{KUWAIT_DIAL_CODE}</span>
                </div>
                <input
                  type='tel'
                  value={phone}
                  onChange={(event) => onPhoneChange(normalizeKuwaitPhoneInput(event.target.value))}
                  placeholder={dashboardCopy.phonePlaceholder || '4XXXXXXX'}
                  inputMode='numeric'
                  autoComplete='tel-national'
                  disabled={loading}
                  className={`min-h-[3rem] rounded-xl border bg-white/72 px-3.5 text-sm font-semibold text-slate-900 outline-none backdrop-blur-xl transition dark:bg-white/5 dark:text-white ${
                    phoneValid
                      ? 'border-brand-gold/14 focus:border-brand-gold/40 dark:border-brand-gold/14 dark:focus:border-brand-gold/34'
                      : 'border-red-300 focus:border-red-400 dark:border-red-500/70 dark:focus:border-red-400'
                  }`}
                />
              </div>
              <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-slate-300'>
                {dashboardCopy.phoneHelp}
              </p>
              {!phoneValid ? (
                <p className='mt-1 text-xs font-semibold text-red-500 dark:text-red-300'>
                  {dashboardCopy.phoneInvalid}
                </p>
              ) : null}
            </div>
          </div>

          <div className={`mb-4 rounded-[1rem] p-4 ${insetPanelClass}`}>
            <p className='text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
              {dashboardCopy.appearance}
            </p>
            <div className='mt-3 grid gap-3 sm:grid-cols-2'>
              <button
                type='button'
                onClick={() => setLang?.(lang === 'en' ? 'ar' : 'en')}
                className={`${actionButtonClass} ${subtleButtonClass}`}
              >
                <Globe size={15} />
                {dashboardCopy.languageSwitch}
              </button>
              <button
                type='button'
                onClick={() => setDarkMode(!darkMode)}
                aria-pressed={darkMode}
                className={`${actionButtonClass} ${subtleButtonClass}`}
              >
                {darkMode ? <SunMedium size={15} /> : <Moon size={15} />}
                {darkMode ? dashboardCopy.lightMode : dashboardCopy.darkMode}
              </button>
            </div>
          </div>

          <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
            <button
              onClick={onClose}
              disabled={loading}
              className={`${actionButtonClass} ${subtleButtonClass} flex-1`}
            >
              {dashboardCopy.goBack || 'Back'}
            </button>
            <button
              onClick={onSave}
              disabled={loading || !hasChanges || !phoneValid}
              className={`${actionButtonClass} ${primaryButtonClass} flex-1`}
            >
              {loading ? <Loader2 size={16} className='animate-spin' /> : null}
              {loading ? `${dashboardCopy.saveProfile}...` : dashboardCopy.saveProfile}
            </button>
          </div>
        </div>
      </motion.div>
    </ActionModal>
  );
};

const dashboardSectionIds = {
  overview: 'dashboard-overview',
  nextVisit: 'dashboard-next-visit',
  active: 'dashboard-active',
  history: 'dashboard-history',
};

const Dashboard = ({ lang, isRTL, setLang }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const t = useMemo(() => repairArabicObject(translations[lang] || translations.en), [lang]);
  const sharedDashboardCopy = useMemo(() => getDashboardSharedCopy(lang), [lang]);
  const dashboardCopy = useMemo(
    () => ({ ...sharedDashboardCopy, ...copy.en, ...(copy[lang] || {}) }),
    [lang, sharedDashboardCopy],
  );
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(dashboardSectionIds.overview);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const normalizedUserName = user?.name || '';
  const normalizedUserProfileImage = user?.profileImage || '';
  const normalizedUserPhone = user?.phone || '';
  const isProfilePhoneValid =
    profilePhone === '' || isValidKuwaitPhone(profilePhone);
  const displayPhone = normalizedUserPhone ? `${KUWAIT_DIAL_CODE} ${normalizedUserPhone}` : '';
  const hasProfileChanges =
    profileName.trim() !== normalizedUserName ||
    profileImage !== normalizedUserProfileImage ||
    profilePhone !== normalizedUserPhone;
  const {
    bookings,
    loading,
    deleteTarget,
    setDeleteTarget,
    modalLoading,
    performCancel,
  } = useUserDashboardBookings({
    user,
    lang,
    dashboardCopy,
    addToast,
  });

  useEffect(() => {
    setProfileName(user?.name || '');
    setProfileImage(user?.profileImage || '');
    setProfilePhone(user?.phone || '');
  }, [user?.name, user?.phone, user?.profileImage]);

  useEffect(() => {
    if (location.state?.openProfileEditor) {
      setProfileModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const groupedBookings = useMemo(() => {
    const now = Date.now();
    const activeBookings = bookings.filter(
      (booking) => booking.status === 'active' && isBookingUpcoming(booking, now),
    );
    const pastBookings = bookings.filter(
      (booking) => booking.status !== 'active' || !isBookingUpcoming(booking, now),
    );

    return {
      activeBookings,
      pastBookings,
    };
  }, [bookings]);

  const nextActiveBooking = useMemo(() => {
    const now = Date.now();

    return [...groupedBookings.activeBookings]
      .filter((booking) => getBookingDateTimeValue(booking) >= now)
      .sort((a, b) => getBookingDateTimeValue(a) - getBookingDateTimeValue(b))[0] || null;
  }, [groupedBookings.activeBookings]);

  const stats = useMemo(() => ({
    totalActive: groupedBookings.activeBookings.length,
    totalCancelled: groupedBookings.pastBookings.filter((booking) => booking.status === 'cancelled').length,
    nextBooking: nextActiveBooking ? formatBookingDateLabel(nextActiveBooking, lang) : '—',
  }), [groupedBookings.activeBookings.length, groupedBookings.pastBookings, lang, nextActiveBooking]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0.2, 0.35, 0.55] },
    );

    Object.values(dashboardSectionIds).forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading, groupedBookings.activeBookings.length, groupedBookings.pastBookings.length]);

  const handleProfileSave = async () => {
    if (!hasProfileChanges) {
      setProfileModalOpen(false);
      return;
    }

    try {
      setProfileLoading(true);
      const removedPhoto = normalizedUserProfileImage && !profileImage;
      await updateProfile({
        name: profileName.trim(),
        profileImage,
        phone: normalizeKuwaitPhoneInput(profilePhone),
        countryCode: KUWAIT_DIAL_CODE,
      });
      addToast(
        removedPhoto ? dashboardCopy.removeProfileDone : dashboardCopy.profileSaved,
        'success',
      );
      setProfileModalOpen(false);
    } catch (error) {
      addToast(error.response?.data?.message || dashboardCopy.profileUpdateFailed, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (!profileImage && !normalizedUserProfileImage) {
      return;
    }

    setProfileImage('');
    addToast(dashboardCopy.removeProfilePending, 'info');
  };

  const handleImageFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!validateProfileImageFile(file)) {
      addToast(dashboardCopy.imageValidationFailed, 'error');
      return;
    }

    try {
      setImageProcessing(true);
      const optimizedImage = await optimizeProfileImage(file);
      setProfileImage(optimizedImage);
    } catch {
      addToast(dashboardCopy.imageValidationFailed, 'error');
    } finally {
      setImageProcessing(false);
    }
  };

  const handleRebook = (booking) => {
    navigate('/booking', {
      state: {
        preselectedService: {
          _id: booking.serviceId || '',
          title: getLocalizedBookingService(booking, lang),
        },
        preselectedBarberId: booking.barber?._id || '',
      },
    });
  };

  const handleStartBooking = () => {
    navigate('/booking');
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
    }
  };

  const scrollToSection = (sectionId) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
    setMobileSidebarOpen(false);
  };

  const navItems = [
    { id: dashboardSectionIds.overview, label: dashboardCopy.navOverview, icon: LayoutDashboard },
    { id: dashboardSectionIds.nextVisit, label: dashboardCopy.navNextVisit, icon: CalendarRange },
    { id: dashboardSectionIds.active, label: dashboardCopy.navActiveBookings, icon: CalendarDays, badge: groupedBookings.activeBookings.length || null },
    { id: dashboardSectionIds.history, label: dashboardCopy.navHistory, icon: Clock3 },
  ];

  return (
    <div
      className='min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(124,89,39,0.06),transparent_28%),linear-gradient(180deg,#fcf7ef_0%,#f1e4cf_100%)] p-3 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.14),transparent_24%),linear-gradient(180deg,#050403_0%,#020202_100%)] dark:text-[#f6eddc] sm:p-4 md:p-5 lg:p-6'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`mx-auto max-w-[1440px] ${workspaceFrame}`}>
        <div className='flex flex-col xl:flex-row'>
          <aside className='hidden border-b border-brand-gold/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(247,236,216,0.3))] px-4 py-5 dark:border-brand-gold/16 dark:bg-transparent xl:block xl:min-h-[calc(100vh-3rem)] xl:w-[16.75rem] xl:shrink-0 xl:border-b-0 xl:border-r'>
            <div className='flex flex-col gap-5 xl:h-full'>
              <div className='rounded-[1.4rem] border border-brand-gold/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(247,239,226,0.68))] p-5 shadow-[0_16px_34px_rgba(124,89,39,0.07)] dark:border-brand-gold/16 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] dark:shadow-none'>
                <UserIdentityBlock
                  user={user}
                  subtitle={dashboardCopy.overview}
                />
              </div>

              <div className='hidden xl:flex xl:flex-1 xl:flex-col'>
                <nav className='space-y-1.5'>
                  {navItems.map((item) => (
                    <SidebarNavButton
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      active={activeSection === item.id}
                      onClick={() => scrollToSection(item.id)}
                    />
                  ))}
                </nav>

                <div className={`space-y-3 rounded-[1rem] p-3 ${insetPanelClass}`}>
                  <button
                    type='button'
                    onClick={() => setProfileModalOpen(true)}
                    className={`${actionButtonClass} ${subtleButtonClass} min-h-[3rem] w-full rounded-[1rem] px-4`}
                  >
                    <Settings size={16} />
                    {dashboardCopy.manageProfile}
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate('/')}
                    className={`${actionButtonClass} ${subtleButtonClass} min-h-[3rem] w-full rounded-[1rem] px-4`}
                  >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                    {dashboardCopy.backToSite}
                  </button>
                  <button
                    type='button'
                    onClick={() => setLogoutModalOpen(true)}
                    className={`${actionButtonClass} ${subtleButtonClass} mt-4 min-h-[3rem] w-full rounded-[1rem] px-4`}
                  >
                    <LogOut size={16} />
                    {dashboardCopy.navLogout}
                  </button>
                </div>
              </div>

            </div>
          </aside>

          <div className='min-w-0 flex-1 p-4 sm:p-5 xl:p-6'>
            <div className={`mb-4 flex items-center justify-between gap-3 rounded-[1.2rem] px-4 py-3 xl:hidden ${glassPanel}`}>
              <UserIdentityBlock
                user={user}
                subtitle={navItems.find((item) => item.id === activeSection)?.label || dashboardCopy.navOverview}
                compact={true}
              />
              <button
                type='button'
                onClick={() => setMobileSidebarOpen(true)}
                className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/16 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
                aria-label='Open dashboard navigation'
              >
                <Menu size={18} />
              </button>
            </div>

            <div className='space-y-4'>
                <section
                  id={dashboardSectionIds.overview}
                  className={`rounded-[1.35rem] p-5 sm:p-6 ${glassPanel}`}
                >
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                      <div className='min-w-0'>
                        <p className='text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-gold'>
                          {dashboardCopy.welcomeBack}
                        </p>
                        <h1 className='mt-2 text-[1.55rem] font-black leading-tight text-slate-900 dark:text-[#f6eddc] sm:text-[1.8rem]'>
                          {user?.name || ''}
                        </h1>
                        <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base'>
                          {dashboardCopy.overviewSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row'>
                      <button
                        type='button'
                        onClick={handleStartBooking}
                        className={`${actionButtonClass} ${primaryButtonClass} min-h-[3rem] rounded-[1rem] px-5`}
                      >
                        <CalendarDays size={16} />
                        {dashboardCopy.bookAppointment}
                      </button>
                    </div>
                  </div>
                </section>

                <div id={dashboardSectionIds.nextVisit}>
                  <DashboardSection
                    eyebrow={dashboardCopy.nextAppointment}
                    title={nextActiveBooking ? nextActiveBooking.service || dashboardCopy.next : dashboardCopy.noNextVisit}
                    titleClassName='text-[2rem] sm:text-[2.25rem]'
                  >
                    <NextVisitCard
                      booking={nextActiveBooking}
                      lang={lang}
                      dashboardCopy={dashboardCopy}
                      onCancel={setDeleteTarget}
                    />
                  </DashboardSection>
                </div>

                <div id={dashboardSectionIds.active}>
                  <DashboardSection
                    eyebrow={dashboardCopy.active}
                    title={dashboardCopy.active}
                    titleClassName='font-sans text-[1.05rem] font-black uppercase tracking-[0.22em] text-[#9b7441] dark:text-[#f3e4c0]'
                  >
                    {loading ? (
                      <div className='space-y-3'>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                      </div>
                    ) : groupedBookings.activeBookings.length === 0 ? (
                      <div className={`rounded-[1.2rem] border border-dashed p-6 ${insetPanelClass}`}>
                        <p className='text-lg font-semibold text-slate-900 dark:text-[#f6eddc]'>
                          {dashboardCopy.dashboardEmpty}
                        </p>
                        <p className='mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/64'>
                          {dashboardCopy.dashboardEmptyDesc}
                        </p>
                        <button
                          type='button'
                          onClick={handleStartBooking}
                          className={`${actionButtonClass} ${primaryButtonClass} mt-5 min-h-[2.9rem] rounded-[0.95rem] px-4`}
                        >
                          <CalendarDays size={16} />
                          {dashboardCopy.bookAppointment}
                        </button>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {groupedBookings.activeBookings.map((booking) => (
                          <BookingCard
                            key={booking._id}
                            booking={booking}
                            lang={lang}
                            dashboardCopy={dashboardCopy}
                            onCancel={setDeleteTarget}
                            onRebook={handleRebook}
                          />
                        ))}
                      </div>
                    )}
                  </DashboardSection>
                </div>

                <div id={dashboardSectionIds.history}>
                  <DashboardSection
                    eyebrow={dashboardCopy.pastAppointments}
                    title={dashboardCopy.pastAppointments}
                    titleClassName='font-sans text-[1.05rem] font-black uppercase tracking-[0.22em] text-[#9b7441] dark:text-[#f3e4c0]'
                  >
                    {loading ? (
                      <div className='space-y-3'>
                        <SkeletonCard />
                        <SkeletonCard />
                      </div>
                    ) : groupedBookings.pastBookings.length === 0 ? (
                      <div className={`rounded-[1.2rem] border border-dashed p-6 ${insetPanelClass}`}>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-12 w-12 items-center justify-center rounded-[1rem] border border-brand-gold/14 bg-brand-gold/[0.08] dark:bg-white/[0.03]'>
                            <CalendarX className='h-5 w-5 text-slate-400 dark:text-white/36' />
                          </div>
                          <div>
                            <p className='text-lg font-semibold text-slate-900 dark:text-[#f6eddc]'>
                              {dashboardCopy.pastAppointments}
                            </p>
                            <p className='mt-1 text-sm text-slate-600 dark:text-white/60'>
                              {lang === 'ar' ? 'ستظهر زياراتك السابقة هنا بعد أول موعد مكتمل.' : 'Your visit history will appear here after your first completed appointment.'}
                            </p>
                            <button
                              type='button'
                              onClick={handleStartBooking}
                              className={`${actionButtonClass} ${subtleButtonClass} mt-4 min-h-[2.75rem] rounded-[0.95rem] px-4 text-[12px]`}
                            >
                              <CalendarDays size={15} />
                              {dashboardCopy.bookAppointment}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence mode='popLayout'>
                        <div className='space-y-4'>
                          {groupedBookings.pastBookings.map((booking) => (
                            <BookingCard
                              key={booking._id}
                              booking={booking}
                              lang={lang}
                              dashboardCopy={dashboardCopy}
                              onCancel={setDeleteTarget}
                              onRebook={handleRebook}
                            />
                          ))}
                        </div>
                      </AnimatePresence>
                    )}
                  </DashboardSection>
                </div>
            </div>
          </div>
        </div>
      </div>

      <MobileDrawerNav
        activeSection={activeSection}
        dashboardCopy={dashboardCopy}
        isOpen={mobileSidebarOpen}
        isRTL={isRTL}
        navItems={navItems}
        onClose={() => setMobileSidebarOpen(false)}
        onLogout={() => setLogoutModalOpen(true)}
        onNavigateHome={() => navigate('/')}
        onOpenSettings={() => setProfileModalOpen(true)}
        onSelectSection={scrollToSection}
        onStartBooking={handleStartBooking}
        user={user}
      />

      <CancelModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={performCancel}
        loading={modalLoading}
        dashboardCopy={dashboardCopy}
      />

      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={() => !logoutLoading && setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
        dashboardCopy={dashboardCopy}
      />

      <ProfileModal
        open={profileModalOpen}
        onClose={() => !profileLoading && setProfileModalOpen(false)}
        onSave={handleProfileSave}
        image={profileImage}
        name={profileName}
        email={user?.email || ''}
        onNameChange={setProfileName}
        phone={profilePhone}
        onPhoneChange={setProfilePhone}
        onPickPhoto={() => galleryInputRef.current?.click()}
        onCapturePhoto={() => cameraInputRef.current?.click()}
        onRemovePhoto={handleRemovePhoto}
        loading={profileLoading}
        imageProcessing={imageProcessing}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        dashboardCopy={dashboardCopy}
        user={user}
        hasChanges={hasProfileChanges}
        phoneValid={isProfilePhoneValid}
      />

      <input
        ref={galleryInputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        className='hidden'
        onChange={handleImageFile}
      />
      <input
        ref={cameraInputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp,image/*'
        capture='user'
        className='hidden'
        onChange={handleImageFile}
      />
    </div>
  );
};

export default Dashboard;


