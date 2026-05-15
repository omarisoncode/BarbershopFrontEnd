import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LogOut,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AdminBarbersPanel,
  AdminBookingsPanel,
  AdminCustomersPanel,
  AdminRescheduleModal,
  AdminServicesPanel,
  ActivityCard,
  ConfirmModal,
  MetricCard,
  MiniBarChart,
  SectionShell,
  SparklineChart,
  createBarberState,
  createServiceState,
  formatDateTime,
  formatNumber,
  glassPanel,
  mutedPanel,
  parseNumericValue,
  sanitizeNumericInput,
  slugify,
} from '../components/admin/AdminDashboardSections';
import {
  AdminDashboardContent,
  AdminDashboardHeader,
  AdminDashboardPlaceholder,
  AdminShellActions,
  AdminDashboardSidebar,
} from '../components/admin/AdminDashboardLayout';
import AdminSettingsWorkspace from '../components/admin/AdminSettingsWorkspace';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { ToastContext } from '../context/ToastContext';
import useSocketBookings from '../hooks/useSocketBookings';
import api from '../utils/api';
import {
  KUWAIT_DIAL_CODE,
  isValidKuwaitPhone,
  normalizeKuwaitPhoneInput,
} from '../utils/kuwaitPhone';
import {
  optimizeProfileImage,
  validateProfileImageFile,
} from '../utils/profileImage';
import { isPastBusinessDate } from '../utils/businessDate';
import { getBookingDateInputValue } from '../utils/bookingDateTime';
import { getDashboardSharedCopy } from '../utils/dashboardCopy';
import { repairArabicObject } from '../utils/repairArabicText';

const MotionDiv = motion.div;

const EMPTY_TODAY_SNAPSHOT = {
  total: 0,
  active: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
};

const copy = {
  en: {
    title: 'Studio Command',
    subtitle:
      'A live operating room for bookings, team performance, and the premium client journey.',
    liveNow: 'Live updates',
    overview: 'Overview',
    bookings: 'Bookings',
    catalog: 'Services',
    team: 'Barbers',
    newService: 'Create service',
    newBarber: 'Create barber',
    englishName: 'English name',
    arabicName: 'Arabic name',
    category: 'Category',
    badge: 'Badge',
    badgeAr: 'Arabic badge',
    features: 'Features, comma-separated',
    featuresAr: 'Arabic features, comma-separated',
    slug: 'Slug',
    price: 'Price',
    duration: 'Duration',
    description: 'English description',
    descriptionAr: 'Arabic description',
    image: 'Image URL',
    experience: 'Years of experience',
    bio: 'English bio',
    bioAr: 'Arabic bio',
    active: 'Active',
    addService: 'Save service',
    addBarber: 'Save barber',
    assignServices: 'Assigned services',
    schedule: 'Weekly schedule',
    daysOff: 'Days off',
    daysOffHint: 'Comma-separated YYYY-MM-DD dates',
    loading: 'Loading command center...',
    loadingHint:
      'We are pulling bookings, services, barber schedules, and analytics into one live view.',
    loadFailed: 'Failed to load admin data.',
    loadFailedDetail:
      'The command center could not sync right now. Your existing data is safe, and you can retry in a moment.',
    retry: 'Retry',
    refreshing: 'Refreshing...',
    serviceCreated: 'Service created successfully.',
    barberCreated: 'Barber created successfully.',
    serviceUpdated: 'Service updated successfully.',
    barberUpdated: 'Barber updated successfully.',
    serviceDeleted: 'Service removed.',
    barberDeleted: 'Barber removed.',
    bookingDeleted: 'Booking permanently deleted.',
    bookingUpdated: 'Booking updated.',
    bookingRescheduled: 'Booking rescheduled.',
    serviceError: 'Failed to save service.',
    barberError: 'Failed to save barber.',
    rescheduleError: 'Failed to reschedule booking.',
    totalBookings: 'Total bookings',
    activeBookings: 'Active bookings',
    todayBookings: 'Today',
    noShows: 'No-shows',
    completedBookings: 'Completed',
    topService: 'Most booked service',
    topBarber: 'Most selected barber',
    lastSevenDays: 'Last 7 days',
    serviceMix: 'Service mix',
    barberLoad: 'Barber load',
    recentActivity: 'Recent activity',
    recentActivitySub: 'Fresh events from the booking flow and status changes.',
    noActivity: 'No booking activity yet.',
    bookingDesk: 'Booking desk',
    bookingDeskSub:
      'Contact clients, monitor service flow, and resolve no-shows without leaving the page.',
    markCompleted: 'Mark completed',
    markNoShow: 'Mark no-show',
    cancelBooking: 'Cancel',
    rescheduleBooking: 'Reschedule',
    rescheduleTitle: 'Reschedule booking',
    rescheduleSubtitle:
      'Move this appointment to a new date and available time while keeping the same barber and service.',
    rescheduleDate: 'New date',
    availableTimes: 'Available times',
    currentSlot: 'Current slot',
    slotsLoading: 'Loading slots...',
    noSlotsAvailable: 'No available times for this date.',
    rescheduleSave: 'Save new slot',
    deleteBooking: 'Delete',
    deleteService: 'Delete service',
    deleteBarber: 'Delete barber',
    allStatuses: 'All',
    statusActive: 'Active',
    statusCancelled: 'Cancelled',
    statusCompleted: 'Completed',
    statusNoShow: 'No-show',
    emptyBookings: 'No bookings match this view.',
    pulseCreated: 'New booking received',
    pulseUpdated: 'Booking updated live',
    confirmTitle: 'Please confirm',
    confirmButton: 'Confirm',
    keepButton: 'Keep it',
    confirmDeleteBooking:
      'This booking will be removed permanently from the system and the customer will be notified.',
    confirmDeleteService:
      'This service will be removed from the catalog if no barber still depends on it.',
    confirmDeleteBarber:
      'This barber profile will be removed from both admin and the homepage team section.',
    premiumNote:
      'Your barbers, services, analytics, and live activity are intentionally separated so operations stay calm under pressure.',
    saveChanges: 'Save changes',
    editLabel: 'Edit',
    editServiceTitle: 'Edit service',
    editBarberTitle: 'Edit barber',
    open: 'Open',
    closed: 'Closed',
    start: 'Start',
    end: 'End',
    breakStart: 'Break start',
    breakEnd: 'Break end',
    noServices: 'Create at least one service before adding barbers.',
    serviceFallback: 'No description added yet.',
    barberFallback: 'No bio added yet.',
    rosterTitle: 'Meet the barbers section is now real',
    rosterSubtitle:
      'The homepage team section pulls from the barber records you create here.',
    noServicesCreated: 'No services yet. Create your first premium service to open the catalog.',
    noBarbersCreated:
      'No barber profiles yet. Add your team here and they will also power the homepage roster.',
    noDataYet: 'No data yet',
  },
  ar: {
    title: 'مركز تشغيل الاستوديو',
    subtitle:
      'لوحة تشغيل مباشرة للحجوزات وأداء الفريق وتجربة العميل الفاخرة.',
    liveNow: 'تحديثات مباشرة',
    overview: 'نظرة عامة',
    bookings: 'الحجوزات',
    catalog: 'الخدمات',
    team: 'الحلاقون',
    newService: 'إضافة خدمة',
    newBarber: 'إضافة حلاق',
    englishName: 'الاسم بالإنجليزية',
    arabicName: 'الاسم بالعربية',
    slug: 'المعرف',
    price: 'السعر',
    duration: 'المدة',
    description: 'الوصف بالإنجليزية',
    descriptionAr: 'الوصف بالعربية',
    image: 'رابط الصورة',
    experience: 'سنوات الخبرة',
    bio: 'نبذة بالإنجليزية',
    bioAr: 'نبذة بالعربية',
    active: 'نشط',
    addService: 'حفظ الخدمة',
    addBarber: 'حفظ الحلاق',
    assignServices: 'الخدمات المعينة',
    schedule: 'الجدول الأسبوعي',
    daysOff: 'أيام الإجازة',
    daysOffHint: 'تواريخ مفصولة بفواصل بصيغة YYYY-MM-DD',
    loading: 'جارٍ تحميل مركز التشغيل...',
    loadingHint:
      'نقوم الآن بجمع الحجوزات والخدمات وجداول الحلاقين والتحليلات في عرض مباشر واحد.',
    loadFailed: 'تعذر تحميل بيانات الإدارة.',
    loadFailedDetail:
      'تعذر مزامنة لوحة التحكم حالياً. بياناتك الحالية آمنة ويمكنك إعادة المحاولة بعد قليل.',
    retry: 'إعادة المحاولة',
    serviceCreated: 'تمت إضافة الخدمة بنجاح.',
    barberCreated: 'تمت إضافة الحلاق بنجاح.',
    serviceUpdated: 'تم تحديث الخدمة بنجاح.',
    barberUpdated: 'تم تحديث الحلاق بنجاح.',
    serviceDeleted: 'تم حذف الخدمة.',
    barberDeleted: 'تم حذف الحلاق.',
    bookingDeleted: 'تم حذف الحجز نهائياً.',
    bookingUpdated: 'تم تحديث الحجز.',
    serviceError: 'تعذر حفظ الخدمة.',
    barberError: 'تعذر حفظ الحلاق.',
    totalBookings: 'إجمالي الحجوزات',
    activeBookings: 'الحجوزات النشطة',
    todayBookings: 'اليوم',
    noShows: 'عدم الحضور',
    completedBookings: 'المكتملة',
    topService: 'الخدمة الأكثر حجزاً',
    topBarber: 'الحلاق الأكثر اختياراً',
    lastSevenDays: 'آخر 7 أيام',
    serviceMix: 'توزيع الخدمات',
    barberLoad: 'ضغط الحلاقين',
    recentActivity: 'النشاط الأخير',
    recentActivitySub: 'أحدث الأحداث من الحجوزات وتغييرات الحالة.',
    noActivity: 'لا يوجد نشاط حجوزات حتى الآن.',
    bookingDesk: 'مكتب الحجوزات',
    bookingDeskSub:
      'تواصل مع العملاء وراقب سير الخدمات وتعامل مع عدم الحضور بدون مغادرة الصفحة.',
    markCompleted: 'تأكيد الاكتمال',
    markNoShow: 'تسجيل عدم الحضور',
    cancelBooking: 'إلغاء',
    deleteBooking: 'حذف',
    deleteService: 'حذف الخدمة',
    deleteBarber: 'حذف الحلاق',
    allStatuses: 'الكل',
    statusActive: 'نشط',
    statusCancelled: 'ملغى',
    statusCompleted: 'مكتمل',
    statusNoShow: 'لم يحضر',
    emptyBookings: 'لا توجد حجوزات في هذا العرض.',
    pulseCreated: 'تم استلام حجز جديد',
    pulseUpdated: 'تم تحديث الحجز مباشرة',
    confirmTitle: 'يرجى التأكيد',
    confirmButton: 'تأكيد',
    keepButton: 'احتفاظ',
    confirmDeleteBooking: 'سيتم حذف هذا الحجز نهائياً من النظام.',
    confirmDeleteService:
      'سيتم حذف هذه الخدمة من الكتالوج إذا لم يعد أي حلاق يعتمد عليها.',
    confirmDeleteBarber:
      'سيتم حذف ملف هذا الحلاق من الإدارة ومن قسم الفريق في الصفحة الرئيسية.',
    premiumNote:
      'تم فصل الحلاقين والخدمات والتحليلات والنشاط المباشر حتى تبقى الإدارة هادئة وواضحة.',
    saveChanges: 'حفظ التغييرات',
    editLabel: 'تعديل',
    editServiceTitle: 'تعديل الخدمة',
    editBarberTitle: 'تعديل الحلاق',
    open: 'مفتوح',
    closed: 'مغلق',
    start: 'البداية',
    end: 'النهاية',
    breakStart: 'بداية الاستراحة',
    breakEnd: 'نهاية الاستراحة',
    noServices: 'أضف خدمة واحدة على الأقل قبل إضافة الحلاقين.',
    serviceFallback: 'لا يوجد وصف مضاف بعد.',
    barberFallback: 'لا توجد نبذة مضافة بعد.',
    rosterTitle: 'قسم تعرّف على الحلاقين أصبح حقيقياً',
    rosterSubtitle:
      'قسم الفريق في الصفحة الرئيسية يسحب الآن من سجلات الحلاقين التي تنشئها هنا.',
    noServicesCreated: 'لا توجد خدمات بعد. أضف أول خدمة مميزة لبدء الكتالوج.',
    noBarbersCreated:
      'لا توجد ملفات حلاقين بعد. أضف الفريق هنا ليظهر أيضاً في واجهة الموقع.',
    noDataYet: 'لا توجد بيانات بعد',
  },
};

Object.assign(copy.ar, {
  category: 'الفئة',
  badge: 'الشارة',
  badgeAr: 'الشارة بالعربية',
  features: 'المميزات مفصولة بفواصل',
  featuresAr: 'المميزات بالعربية مفصولة بفواصل',
  bookingRescheduled: 'تمت إعادة جدولة الحجز.',
  rescheduleError: 'تعذر إعادة جدولة الحجز.',
  rescheduleBooking: 'إعادة الجدولة',
  rescheduleTitle: 'إعادة جدولة الحجز',
  rescheduleSubtitle:
    'انقل هذا الموعد إلى تاريخ ووقت متاحين مع الاحتفاظ بنفس الحلاق والخدمة.',
  rescheduleDate: 'التاريخ الجديد',
  availableTimes: 'الأوقات المتاحة',
  currentSlot: 'الموعد الحالي',
  slotsLoading: 'جارٍ تحميل الأوقات...',
  noSlotsAvailable: 'لا توجد أوقات متاحة لهذا التاريخ.',
  rescheduleSave: 'حفظ الموعد الجديد',
  confirmDeleteBooking:
    'سيتم حذف هذا الحجز نهائياً من النظام وسيتم إشعار العميل بذلك.',
});

Object.assign(copy.en, {
  bookingCompleted: 'Booking marked as completed.',
  bookingNoShow: 'Booking marked as no-show.',
  bookingCancelled: 'Booking cancelled.',
  liveHealthy: 'Live sync healthy',
  livePaused: 'Live sync paused',
  livePausedDetail: 'The command center is still usable. We will reconnect on the next refresh.',
  loadFailed: 'Command center is still waking up.',
  loadFailedDetail:
    'We could not finish pulling the latest admin data yet. The workspace shell is ready, and you can refresh the panel in a moment.',
  retry: 'Refresh panel',
  heroNextAppointment: 'Next appointment',
  heroNoUpcoming: 'No upcoming bookings yet.',
  heroNoUpcomingDetail: 'The next confirmed client slot will appear here as soon as it lands.',
  heroTodayFocus: 'Today focus',
  heroQuickActions: 'Quick actions',
  heroGoBookings: 'Open bookings',
  heroGoServices: 'Manage services',
  heroGoBarbers: 'Manage barbers',
  heroOperationalHealth: 'Operational health',
  heroHealthCalm: 'Floor is calm',
  heroHealthAttention: 'Needs attention',
  heroHealthCalmDetail: 'No no-shows or cancellations are pushing the queue off balance right now.',
  heroHealthAttentionDetail:
    'There are client changes today that may need a follow-up or a quick queue adjustment.',
  heroNoShowToday: 'No-shows',
  heroCancelledToday: 'Cancelled',
  heroFollowUp: 'Follow-up',
  confirmMarkCompleted:
    'This appointment will be marked as completed and moved out of the live booking queue.',
  confirmMarkNoShow:
    'This appointment will be marked as a no-show. Use this only when the client did not arrive.',
  confirmCancelBooking:
    'This appointment will be cancelled and the client will be notified about the change.',
});

Object.assign(copy.ar, {
  bookingCompleted: 'تم تعليم الحجز كمكتمل.',
  bookingNoShow: 'تم تسجيل الحجز كعدم حضور.',
  bookingCancelled: 'تم إلغاء الحجز.',
  liveHealthy: 'المزامنة المباشرة مستقرة',
  livePaused: 'توقفت المزامنة المباشرة مؤقتاً',
  livePausedDetail: 'يمكنك متابعة العمل، وسنحاول استعادة المزامنة مع التحديث التالي.',
  loadFailed: 'مركز التشغيل ما زال يستعد.',
  loadFailedDetail:
    'لم نتمكن من جلب أحدث بيانات الإدارة بعد. الواجهة جاهزة ويمكنك تحديث اللوحة بعد لحظة.',
  retry: 'تحديث اللوحة',
  heroNextAppointment: 'الموعد التالي',
  heroNoUpcoming: 'لا توجد حجوزات قادمة حتى الآن.',
  heroNoUpcomingDetail: 'سيظهر هنا أول موعد مؤكد فور وصوله إلى اللوحة.',
  heroTodayFocus: 'تركيز اليوم',
  heroQuickActions: 'إجراءات سريعة',
  heroGoBookings: 'فتح الحجوزات',
  heroGoServices: 'إدارة الخدمات',
  heroGoBarbers: 'إدارة الحلاقين',
  confirmMarkCompleted: 'سيتم تعليم هذا الموعد كمكتمل وإخراجه من قائمة الحجوزات المباشرة.',
  confirmMarkNoShow: 'سيتم تسجيل هذا الموعد كعدم حضور. استخدم هذا الخيار فقط إذا لم يصل العميل.',
  confirmCancelBooking: 'سيتم إلغاء هذا الموعد وسيتم إشعار العميل بالتغيير.',
});

Object.assign(copy.ar, {
  heroOperationalHealth: 'صحة التشغيل',
  heroHealthCalm: 'الصالة مستقرة',
  heroHealthAttention: 'تحتاج المتابعة',
  heroHealthCalmDetail: 'لا توجد حالات عدم حضور أو إلغاءات تؤثر على سير الحجوزات اليوم.',
  heroHealthAttentionDetail:
    'هناك تغييرات في حجوزات اليوم قد تحتاج إلى متابعة سريعة أو إعادة توزيع الطاقم.',
  heroNoShowToday: 'عدم الحضور',
  heroCancelledToday: 'الملغاة',
  heroFollowUp: 'متابعة',
});

Object.assign(copy.en, {
  adminActionFailed: 'We could not finish that admin action.',
  linkedBarbers: 'Linked barbers',
  removeServiceDependencies: 'Remove this service from assigned barbers before deleting it.',
  categoryAr: 'Arabic category',
  bookForCustomerTitle: 'Book for a customer',
  bookForCustomerSub:
    'Use the same live availability rules as the public booking flow, but assign the appointment to the right customer record from the desk.',
  customerSearchLabel: 'Find customer',
  customerSearchHint: 'Search by name, email, phone, or customer ID.',
  customerSearchPlaceholder: 'Search customers',
  customerSearchLoading: 'Searching customers...',
  customerSearchEmpty: 'No matching customers found yet.',
  selectedCustomer: 'Selected customer',
  clearSelection: 'Clear',
  serviceField: 'Service',
  barberField: 'Barber',
  dateField: 'Date',
  timeField: 'Time',
  chooseCustomerFirst: 'Choose a customer first.',
  chooseService: 'Choose a service',
  chooseBarber: 'Choose a barber',
  chooseDate: 'Choose a date',
  chooseTime: 'Choose a time',
  noCustomerSelected: 'Pick a customer to start building the booking.',
  bookingSummary: 'Booking summary',
  bookingSummaryHint:
    'The selected customer will receive the normal booking confirmation after you place this appointment.',
  bookForCustomer: 'Create booking',
  bookingCreatedForCustomer: 'Booking created for the selected customer.',
  customerMaxBookings: 'This customer already has 3 active bookings.',
  customerIdLabel: 'Customer ID',
  customerPhoneLabel: 'Phone',
  customerEmailLabel: 'Email',
  deskSlotsHint: 'Available times follow barber schedule, breaks, and live bookings.',
  creatingBooking: 'Creating booking...',
  adminDeskBooking: 'Booked by admin',
  customerSelfBooked: 'Booked by customer',
  customerWorkspaceTitle: 'Customer history',
  customerWorkspaceEmpty: 'Choose a customer to open their booking history, follow-up signals, and repeat-booking shortcuts.',
  customerHistoryLoading: 'Loading customer history...',
  customerHistoryError: 'We could not load this customer history right now.',
  customerHistoryTitle: 'Booking timeline',
  customerHistorySubtitle: 'Completed, cancelled, no-show, and active appointments stay together here for fast follow-up.',
  customerHistoryEmpty: 'No bookings have been recorded for this customer yet.',
  customerHistoryFilterAll: 'All history',
  customerInsightEmpty: 'No pattern yet',
  favoriteServiceLabel: 'Most booked service',
  favoriteBarberLabel: 'Most selected barber',
  latestBookingLabel: 'Latest booking',
  latestStatusLabel: 'Latest status',
  totalSpentLabel: 'Completed spend',
  openBookingDesk: 'Open booking desk',
  bookFavoriteService: 'Book favorite service',
  bookAgain: 'Book again',
  notAvailableShort: 'N/A',
});

Object.assign(copy.ar, {
  adminActionFailed: 'تعذر إكمال إجراء الإدارة.',
  linkedBarbers: 'الحلاقون المرتبطون',
  removeServiceDependencies: 'أزل هذه الخدمة من الحلاقين المرتبطين أولاً قبل حذفها.',
  categoryAr: 'الفئة بالعربية',
  bookForCustomerTitle: 'احجز للعميل',
  bookForCustomerSub:
    'استخدم نفس قواعد التوفر المباشر الخاصة بواجهة الحجز العامة، لكن اربط الموعد بسجل العميل الصحيح من لوحة الإدارة.',
  customerSearchLabel: 'ابحث عن عميل',
  customerSearchHint: 'ابحث بالاسم أو البريد أو الهاتف أو رقم العميل.',
  customerSearchPlaceholder: 'ابحث عن العملاء',
  customerSearchLoading: 'جارٍ البحث عن العملاء...',
  customerSearchEmpty: 'لا يوجد عملاء مطابقون حالياً.',
  selectedCustomer: 'العميل المحدد',
  clearSelection: 'مسح',
  serviceField: 'الخدمة',
  barberField: 'الحلاق',
  dateField: 'التاريخ',
  timeField: 'الوقت',
  chooseCustomerFirst: 'اختر العميل أولاً.',
  chooseService: 'اختر الخدمة',
  chooseBarber: 'اختر الحلاق',
  chooseDate: 'اختر التاريخ',
  chooseTime: 'اختر الوقت',
  noCustomerSelected: 'اختر عميلاً لبدء تجهيز الحجز.',
  bookingSummary: 'ملخص الحجز',
  bookingSummaryHint:
    'سيصل للعميل المحدد إشعار الحجز المعتاد مباشرة بعد إنشاء هذا الموعد.',
  bookForCustomer: 'إنشاء الحجز',
  bookingCreatedForCustomer: 'تم إنشاء الحجز للعميل المحدد.',
  customerMaxBookings: 'هذا العميل لديه بالفعل 3 حجوزات نشطة.',
  customerIdLabel: 'رقم العميل',
  customerPhoneLabel: 'الهاتف',
  customerEmailLabel: 'البريد الإلكتروني',
  deskSlotsHint: 'الأوقات المتاحة تراعي جدول الحلاق والاستراحات والحجوزات المباشرة.',
  creatingBooking: 'جارٍ إنشاء الحجز...',
  adminDeskBooking: 'تم الحجز من الإدارة',
  customerSelfBooked: 'تم الحجز من العميل',
  customerWorkspaceTitle: 'سجل العميل',
  customerWorkspaceEmpty: 'اختر عميلاً لعرض سجل حجوزاته ومؤشرات المتابعة وخيارات إعادة الحجز بسرعة.',
  customerHistoryLoading: 'جارٍ تحميل سجل العميل...',
  customerHistoryError: 'تعذر تحميل سجل هذا العميل حالياً.',
  customerHistoryTitle: 'الخط الزمني للحجوزات',
  customerHistorySubtitle: 'تظهر الحجوزات المكتملة والملغاة وعدم الحضور والنشطة معاً لتسهيل المتابعة السريعة.',
  customerHistoryEmpty: 'لا توجد حجوزات مسجلة لهذا العميل حتى الآن.',
  customerHistoryFilterAll: 'كل السجل',
  customerInsightEmpty: 'لا يوجد نمط واضح بعد',
  favoriteServiceLabel: 'الخدمة الأكثر حجزاً',
  favoriteBarberLabel: 'الحلاق الأكثر اختياراً',
  latestBookingLabel: 'أحدث حجز',
  latestStatusLabel: 'آخر حالة',
  totalSpentLabel: 'إجمالي الإنفاق المكتمل',
  openBookingDesk: 'فتح مكتب الحجز',
  bookFavoriteService: 'احجز الخدمة المفضلة',
  bookAgain: 'إعادة الحجز',
  notAvailableShort: 'غير متوفر',
});

Object.assign(copy.en, {
  backToSite: 'Back to site',
  logout: 'Logout',
  themeSettings: 'Theme',
  languageSettings: 'Language',
  themeLight: 'Light',
  themeDark: 'Dark',
  languageEnglish: 'English',
  languageArabic: 'Arabic',
  settingsWorkspaceTitle: 'Workspace preferences',
  settingsWorkspaceBody:
    'Control the admin experience here without affecting booking or operations logic.',
  profileSettings: 'Profile settings',
  profileSettingsBody:
    'Update your name and mobile number directly from the admin shell.',
  profileNameLabel: 'Display name',
  profilePhoneLabel: 'Mobile number',
  profilePhoneHelp: 'Used for booking notifications and account contact.',
  profilePhoneInvalid: 'Enter a valid 8-digit Kuwaiti phone number.',
  editProfile: 'Edit profile',
  profileUpdated: 'Profile updated successfully.',
  profileUpdateFailed: 'Failed to update profile.',
  todayOverview: "Today's overview",
  sectionOverviewDescription:
    'Track the live floor, performance signals, and what needs attention today.',
  sectionBookingsDescription:
    'Manage live appointments, create desk bookings, and resolve client changes.',
  sectionCatalogDescription:
    'Maintain the service catalog without touching the underlying booking rules.',
  sectionTeamDescription:
    'Update barber profiles, assignments, and schedule availability from one place.',
  sectionCustomers: 'Customers',
  sectionCustomersCaption: 'Customer records',
  sectionCustomersDescription:
    'Search customer records, review booking history, and launch repeat bookings from one workspace.',
  sectionSettings: 'Settings',
  sectionSettingsCaption: 'Workspace',
  sectionSettingsDescription:
    'Manage workspace preferences, profile settings, language, and appearance from one place.',
  placeholderEyebrow: 'Temporary placeholder',
  customersPlaceholderTitle: 'Customers workspace is reserved',
  customersPlaceholderBody:
    'This slot is intentionally kept light for now so we can land the new dashboard structure before introducing customer-scale tooling.',
  settingsPlaceholderTitle: 'Settings workspace is reserved',
  settingsPlaceholderBody:
    'Settings stays as a placeholder in this phase. Future preferences can plug into this panel without disturbing the sidebar shell.',
  shellRefresh: 'Refresh panel',
});

Object.assign(copy.ar, {
  backToSite: 'العودة إلى الموقع',
  logout: 'تسجيل الخروج',
  themeSettings: 'المظهر',
  languageSettings: 'اللغة',
  themeLight: 'فاتح',
  themeDark: 'داكن',
  languageEnglish: 'الإنجليزية',
  languageArabic: 'العربية',
  settingsWorkspaceTitle: 'تفضيلات مساحة العمل',
  settingsWorkspaceBody:
    'تحكم في تجربة لوحة الإدارة هنا دون التأثير على منطق الحجز أو التشغيل.',
  profileSettings: 'إعدادات الملف الشخصي',
  profileSettingsBody:
    'حدّث اسمك ورقم هاتفك المحمول مباشرة من داخل لوحة الإدارة.',
  profileNameLabel: 'اسم العرض',
  profilePhoneLabel: 'رقم الجوال',
  profilePhoneHelp: 'يُستخدم لإشعارات الحجوزات والتواصل مع الحساب.',
  profilePhoneInvalid: 'أدخل رقم هاتف كويتي صحيحاً مكوّناً من 8 أرقام.',
  profileUpdated: 'تم تحديث الملف الشخصي بنجاح.',
  profileUpdateFailed: 'تعذر تحديث الملف الشخصي.',
  todayOverview: 'نظرة اليوم',
  sectionOverviewDescription:
    'راقب سير العمل المباشر ومؤشرات الأداء وما يحتاج إلى متابعة اليوم.',
  sectionBookingsDescription:
    'أدر الحجوزات المباشرة وأنشئ حجوزات المكتب وتعامل مع تغييرات العملاء.',
  sectionCatalogDescription:
    'حدّث كتالوج الخدمات دون تغيير منطق الحجز الحالي.',
  sectionTeamDescription:
    'أدر ملفات الحلاقين والخدمات المعيّنة والجداول من مكان واحد.',
  sectionCustomers: 'العملاء',
  sectionCustomersCaption: 'دليل العملاء',
  sectionCustomersDescription:
    'ابحث في سجلات العملاء وتابع نشاطهم وأحدث حجوزاتهم من مكان واحد.',
  sectionSettings: 'الإعدادات',
  sectionSettingsCaption: 'التفضيلات',
  sectionSettingsDescription:
    'أدر تفضيلات مساحة العمل والملف الشخصي واللغة والمظهر من هذه المساحة.',
  placeholderEyebrow: 'عنصر مؤقت',
  customersPlaceholderTitle: 'مساحة العملاء محجوزة',
  customersPlaceholderBody:
    'تم إبقاء هذا القسم خفيفاً في هذه المرحلة حتى يستقر الهيكل الجديد قبل إضافة أدوات العملاء على نطاق أكبر.',
  settingsPlaceholderTitle: 'مساحة الإعدادات محجوزة',
  settingsPlaceholderBody:
    'قسم الإعدادات ما زال مؤقتاً الآن، ويمكن توصيل أي تفضيلات مستقبلية به لاحقاً دون التأثير على هيكل اللوحة.',
  shellRefresh: 'تحديث اللوحة',
});

const getServiceValidationMessage = (form, lang) => {
  if (!form.name.trim() || !form.nameAr.trim()) {
    return lang === 'ar'
      ? 'أدخل اسم الخدمة بالإنجليزية والعربية قبل الحفظ.'
      : 'Enter both English and Arabic service names before saving.';
  }

  if (!slugify(form.slug)) {
    return lang === 'ar'
      ? 'أدخل معرف خدمة صالح قبل الحفظ.'
      : 'Enter a valid service slug before saving.';
  }

  if (parseNumericValue(form.price, 0) <= 0) {
    return lang === 'ar'
      ? 'أدخل سعراً صحيحاً أكبر من صفر.'
      : 'Enter a valid service price greater than zero.';
  }

  if (parseNumericValue(form.durationMinutes, 0) <= 0) {
    return lang === 'ar'
      ? 'أدخل مدة خدمة صحيحة أكبر من صفر.'
      : 'Enter a valid service duration greater than zero.';
  }

  if (
    form.active &&
    (!form.image.trim() || !form.descriptionAr.trim())
  ) {
    return lang === 'ar'
      ? 'أكمل الصورة والوصف العربي قبل تفعيل الخدمة على الواجهة العامة.'
      : 'Add an image and Arabic description before marking this service active for the public site.';
  }

  return '';
};

const getBarberValidationMessage = (form, lang) => {
  if (!form.name.trim()) {
    return lang === 'ar'
      ? 'أدخل اسم الحلاق قبل الحفظ.'
      : 'Enter a barber name before saving.';
  }

  if (form.serviceIds.length === 0) {
    return lang === 'ar'
      ? 'اختر خدمة واحدة على الأقل لهذا الحلاق.'
      : 'Assign at least one service to this barber.';
  }

  const invalidSchedule = form.workingHours.some(
    (entry) => entry.enabled && (!entry.startTime || !entry.endTime),
  );
  if (invalidSchedule) {
    return lang === 'ar'
      ? 'أكمل وقت البداية والنهاية لكل يوم عمل مفعّل.'
      : 'Complete the start and end time for each enabled work day.';
  }

  if (form.isActive && (!form.image.trim() || !form.nameAr.trim() || !form.bioAr.trim())) {
    return lang === 'ar'
      ? 'أكمل الصورة والاسم العربي والنبذة العربية قبل تفعيل الحلاق على الواجهة العامة.'
      : 'Add an image, Arabic name, and Arabic bio before marking this barber active for the public site.';
  }

  return '';
};

const sectionMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: 'easeOut' },
};

const createDeskBookingState = () => ({
  serviceId: '',
  barberId: '',
  date: '',
  time: '',
});

export default function AdminDashboard({ lang, isRTL, setLang }) {
  const location = useLocation();
  const navigate = useNavigate();
  const sharedDashboardCopy = useMemo(() => getDashboardSharedCopy(lang), [lang]);
  const t = useMemo(
    () => ({ ...sharedDashboardCopy, ...copy.en, ...repairArabicObject(copy[lang] || {}) }),
    [lang, sharedDashboardCopy],
  );
  const { addToast } = useContext(ToastContext);
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [activeSection, setActiveSection] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [bookingPagination, setBookingPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [bookingSummary, setBookingSummary] = useState({ all: 0, active: 0, completed: 0, cancelled: 0, no_show: 0 });
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [syncIssue, setSyncIssue] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [serviceForm, setServiceForm] = useState(createServiceState());
  const [barberForm, setBarberForm] = useState(createBarberState());
  const [liveEvents, setLiveEvents] = useState([]);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerDirectorySearch, setCustomerDirectorySearch] = useState('');
  const [customerDirectory, setCustomerDirectory] = useState([]);
  const [customerDirectoryPagination, setCustomerDirectoryPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [customerDirectorySummary, setCustomerDirectorySummary] = useState({ totalCustomers: 0 });
  const [customerDirectoryLoading, setCustomerDirectoryLoading] = useState(false);
  const [selectedCustomerRecord, setSelectedCustomerRecord] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
  const [customerDetailsError, setCustomerDetailsError] = useState(false);
  const [customerHistoryPagination, setCustomerHistoryPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bookingPanelView, setBookingPanelView] = useState('manage');
  const [deskBookingForm, setDeskBookingForm] = useState(createDeskBookingState());
  const [deskBookingSlots, setDeskBookingSlots] = useState([]);
  const [deskBookingLoading, setDeskBookingLoading] = useState(false);
  const [deskBookingSubmitting, setDeskBookingSubmitting] = useState(false);
  const [adminProfileName, setAdminProfileName] = useState(user?.name || '');
  const [adminProfilePhone, setAdminProfilePhone] = useState(user?.phone || '');
  const [adminProfileImage, setAdminProfileImage] = useState(user?.profileImage || '');
  const [adminProfileImageProcessing, setAdminProfileImageProcessing] = useState(false);
  const [adminProfileSaving, setAdminProfileSaving] = useState(false);
  const suppressedLiveToastsRef = useRef(new Set());
  const deskBookingSubmitLockRef = useRef(false);
  const initialRecoveryAttemptedRef = useRef(false);
  const adminProfileFileInputRef = useRef(null);
  const isAdminUser = user?.role === 'admin';
  const normalizedAdminUserPhone = user?.phone || '';
  const normalizedAdminUserName = user?.name || '';
  const normalizedAdminUserProfileImage = user?.profileImage || '';
  const isAdminProfilePhoneValid =
    adminProfilePhone === '' || isValidKuwaitPhone(adminProfilePhone);
  const hasAdminProfileChanges =
    adminProfileName.trim() !== normalizedAdminUserName ||
    adminProfilePhone !== normalizedAdminUserPhone ||
    adminProfileImage !== normalizedAdminUserProfileImage;

  useEffect(() => {
    setAdminProfileName(user?.name || '');
    setAdminProfilePhone(user?.phone || '');
    setAdminProfileImage(user?.profileImage || '');
  }, [user?.name, user?.phone, user?.profileImage]);

  const fetchCoreData = useCallback(async () => {
    const [servicesResponse, barbersResponse] = await Promise.all([
      api.get('/services/admin'),
      api.get('/barbers/admin/all'),
    ]);

    setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : []);
    setBarbers(Array.isArray(barbersResponse.data) ? barbersResponse.data : []);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    const analyticsResponse = await api.get('/bookings/analytics/overview');
    setAnalytics(analyticsResponse.data || null);
  }, []);

  const fetchBookingsPage = useCallback(async ({ page = 1, status = statusFilter } = {}) => {
    const response = await api.get('/bookings', {
      params: {
        page,
        limit: bookingPagination.limit || 25,
        status,
      },
    });

    setBookings((current) =>
      Array.isArray(response.data?.items) ? response.data.items : current,
    );
    setBookingPagination((current) =>
      response.data?.pagination || current,
    );
    setBookingSummary((current) =>
      response.data?.summary || current,
    );
  }, [bookingPagination.limit, statusFilter]);

  const fetchCustomerDirectory = useCallback(async ({ page = 1, search = '' } = {}) => {
    const response = await api.get('/bookings/customers', {
      params: {
        page,
        limit: customerDirectoryPagination.limit || 12,
        search,
      },
    });

    setCustomerDirectory((current) =>
      Array.isArray(response.data?.items) ? response.data.items : current,
    );
    setCustomerDirectoryPagination((current) =>
      response.data?.pagination || current,
    );
    setCustomerDirectorySummary((current) =>
      response.data?.summary || current,
    );
  }, [customerDirectoryPagination.limit]);

  const fetchCustomerDetails = useCallback(async ({ customerId, page = 1 } = {}) => {
    if (!customerId) {
      setCustomerDetails(null);
      setCustomerHistoryPagination({ page: 1, limit: 8, total: 0, totalPages: 1 });
      return;
    }

    const response = await api.get(`/bookings/customers/${customerId}/history`, {
      params: {
        page,
        limit: customerHistoryPagination.limit || 8,
      },
    });

    const nextPagination = response.data?.pagination || {
      page: 1,
      limit: customerHistoryPagination.limit || 8,
      total: 0,
      totalPages: 1,
    };

    setCustomerDetails({
      customer: response.data?.customer || null,
      summary: response.data?.summary || null,
      insights: response.data?.insights || null,
      history: Array.isArray(response.data?.history) ? response.data.history : [],
      pagination: nextPagination,
    });
    setCustomerHistoryPagination(nextPagination);
  }, [customerHistoryPagination.limit]);

  const loadDashboard = useCallback(async ({ background = false } = {}) => {
    if (background) setRefreshing(true);

    try {
      await Promise.all([
        fetchCoreData(),
        fetchAnalytics(),
        fetchBookingsPage({ page: 1, status: statusFilter }),
      ]);
      setLoadError(false);
      setSyncIssue(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchAnalytics, fetchBookingsPage, fetchCoreData, statusFilter]);

  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchCoreData(),
      fetchAnalytics(),
      fetchBookingsPage({ page: bookingPagination.page, status: statusFilter }),
      activeSection === 'customers'
        ? Promise.all([
            fetchCustomerDirectory({
              page: customerDirectoryPagination.page,
              search: customerDirectorySearch,
            }),
            selectedCustomerRecord?._id
              ? fetchCustomerDetails({
                  customerId: selectedCustomerRecord._id,
                  page: customerHistoryPagination.page,
                })
              : Promise.resolve(),
          ])
        : Promise.resolve(),
    ]);
    setLoadError(false);
    setSyncIssue(false);
  }, [
    activeSection,
    bookingPagination.page,
    customerDirectoryPagination.page,
    customerHistoryPagination.page,
    customerDirectorySearch,
    fetchAnalytics,
    fetchBookingsPage,
    fetchCoreData,
    fetchCustomerDirectory,
    fetchCustomerDetails,
    selectedCustomerRecord?._id,
    statusFilter,
  ]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!loadError || initialRecoveryAttemptedRef.current) return undefined;

    initialRecoveryAttemptedRef.current = true;
    const retryTimer = window.setTimeout(() => {
      loadDashboard();
    }, 1800);

    return () => window.clearTimeout(retryTimer);
  }, [loadError, loadDashboard]);

  useSocketBookings({
    enabled: true,
    onEvent: async (payload) => {
      const eventKey = `${payload.type}:${payload.booking?._id || ''}`;
      const shouldSuppressToast = suppressedLiveToastsRef.current.has(eventKey);

      if (shouldSuppressToast) {
        suppressedLiveToastsRef.current.delete(eventKey);
      }

      setLiveEvents((current) => [payload, ...current].slice(0, 8));

      if (!shouldSuppressToast) {
        addToast(
          payload.type === 'booking.created' ? t.pulseCreated : payload.message || t.pulseUpdated,
          payload.type === 'booking.created' ? 'success' : 'info',
        );
      }

      try {
        await Promise.all([
          fetchAnalytics(),
          fetchBookingsPage({ page: bookingPagination.page, status: statusFilter }),
          activeSection === 'customers'
            ? Promise.all([
                fetchCustomerDirectory({
                  page: customerDirectoryPagination.page,
                  search: customerDirectorySearch,
                }),
                selectedCustomerRecord?._id
                  ? fetchCustomerDetails({
                      customerId: selectedCustomerRecord._id,
                      page: customerHistoryPagination.page,
                    })
                  : Promise.resolve(),
              ])
            : Promise.resolve(),
        ]);
      } catch {
        setSyncIssue(true);
      }
    },
  });

  useEffect(() => {
    fetchBookingsPage({ page: bookingPagination.page, status: statusFilter }).catch(() => {
      setSyncIssue(true);
    });
  }, [bookingPagination.page, fetchBookingsPage, statusFilter]);

  useEffect(() => {
    if (activeSection !== 'customers') {
      return undefined;
    }

    let isActive = true;
    const timer = window.setTimeout(async () => {
      try {
        setCustomerDirectoryLoading(true);
        await fetchCustomerDirectory({
          page: customerDirectoryPagination.page,
          search: customerDirectorySearch,
        });
      } catch {
        if (isActive) {
          setSyncIssue(true);
        }
      } finally {
        if (isActive) {
          setCustomerDirectoryLoading(false);
        }
      }
    }, customerDirectorySearch.trim() ? 220 : 0);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [activeSection, customerDirectoryPagination.page, customerDirectorySearch, fetchCustomerDirectory]);

  useEffect(() => {
    if (activeSection !== 'customers' || !selectedCustomerRecord?._id) {
      return undefined;
    }

    let isActive = true;

    const loadCustomerDetails = async () => {
      try {
        setCustomerDetailsLoading(true);
        setCustomerDetailsError(false);
        await fetchCustomerDetails({
          customerId: selectedCustomerRecord._id,
          page: customerHistoryPagination.page,
        });
      } catch {
        if (isActive) {
          setCustomerDetailsError(true);
        }
      } finally {
        if (isActive) {
          setCustomerDetailsLoading(false);
        }
      }
    };

    loadCustomerDetails();

    return () => {
      isActive = false;
    };
  }, [
    activeSection,
    customerHistoryPagination.page,
    fetchCustomerDetails,
    selectedCustomerRecord?._id,
  ]);

  const selectedDeskService = useMemo(
    () => services.find((service) => String(service._id) === String(deskBookingForm.serviceId)) || null,
    [deskBookingForm.serviceId, services],
  );

  const availableDeskBarbers = useMemo(() => {
    if (!selectedDeskService?._id) {
      return [];
    }

    return barbers.filter((barber) =>
      (barber.serviceIds || []).some((service) => {
        const serviceId = typeof service === 'string' ? service : service?._id;
        return String(serviceId) === String(selectedDeskService._id);
      }),
    );
  }, [barbers, selectedDeskService]);

  const recentActivity = useMemo(() => {
    if (liveEvents.length > 0) {
      return liveEvents;
    }

    return Array.isArray(analytics?.recentActivity) ? analytics.recentActivity : [];
  }, [analytics?.recentActivity, liveEvents]);

  const nextUpcomingBooking = analytics?.nextUpcomingBooking || null;
  const todaySnapshot = useMemo(
    () => analytics?.todaySnapshot || EMPTY_TODAY_SNAPSHOT,
    [analytics?.todaySnapshot],
  );

  const operationalHealth = useMemo(() => {
    const followUp = todaySnapshot.cancelled + todaySnapshot.noShow;
    const needsAttention = followUp > 0;

    return {
      tone: needsAttention ? 'amber' : 'emerald',
      title: needsAttention ? t.heroHealthAttention : t.heroHealthCalm,
      detail: needsAttention ? t.heroHealthAttentionDetail : t.heroHealthCalmDetail,
      followUp,
      cancelled: todaySnapshot.cancelled,
      noShow: todaySnapshot.noShow,
    };
  }, [t, todaySnapshot]);

  const sections = useMemo(
    () => [
      {
        id: 'overview',
        label: t.overview,
        caption: t.sectionOverviewDescription,
        shortCaption: t.liveNow,
      },
      {
        id: 'bookings',
        label: t.bookings,
        caption: t.sectionBookingsDescription,
        shortCaption: t.bookingDesk,
      },
      {
        id: 'team',
        label: t.team,
        caption: t.sectionTeamDescription,
        shortCaption: t.newBarber,
        adminOnly: true,
      },
      {
        id: 'catalog',
        label: t.catalog,
        caption: t.sectionCatalogDescription,
        shortCaption: t.newService,
        adminOnly: true,
      },
      {
        id: 'customers',
        label: t.sectionCustomers,
        caption: t.sectionCustomersDescription,
        shortCaption: t.sectionCustomersCaption,
        adminOnly: true,
      },
      {
        id: 'settings',
        label: t.sectionSettings,
        caption: t.sectionSettingsDescription,
        shortCaption: t.sectionSettingsCaption,
        adminOnly: true,
      },
    ],
    [
      t.bookingDesk,
      t.bookings,
      t.catalog,
      t.liveNow,
      t.newBarber,
      t.newService,
      t.overview,
      t.sectionBookingsDescription,
      t.sectionCatalogDescription,
      t.sectionOverviewDescription,
      t.sectionSettings,
      t.sectionSettingsCaption,
      t.sectionSettingsDescription,
      t.sectionTeamDescription,
      t.sectionCustomers,
      t.sectionCustomersCaption,
      t.sectionCustomersDescription,
      t.team,
    ],
  );

  const visibleSections = useMemo(
    () => sections.filter((section) => (section.adminOnly ? isAdminUser : true)),
    [isAdminUser, sections],
  );

  const normalizeSectionId = useCallback((value) => {
    if (value === 'services') return 'catalog';
    if (value === 'barbers') return 'team';
    if (value === 'users') return 'customers';
    return value;
  }, []);

  useEffect(() => {
    const requestedSection = normalizeSectionId(location.state?.section);
    const preselectedServiceId = location.state?.preselectedServiceId;

    if (requestedSection && visibleSections.some((section) => section.id === requestedSection)) {
      setActiveSection(requestedSection);
    }

    if (preselectedServiceId) {
      // Carry service intent from the marketing UI into the desk without sending admins through self-booking.
      setBookingPanelView('create');
      setDeskBookingForm((current) =>
        current.serviceId === preselectedServiceId
          ? current
          : {
              serviceId: preselectedServiceId,
              barberId: '',
              date: '',
              time: '',
            },
      );
    }
  }, [location.state, normalizeSectionId, visibleSections]);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setMobileSidebarOpen(false);
  }, []);

  const handleBookingStatusFilterChange = useCallback((nextStatus) => {
    setStatusFilter(nextStatus);
    setBookingPagination((current) => ({ ...current, page: 1 }));
  }, []);

  const handleBookingPageChange = useCallback((nextPage) => {
    setBookingPagination((current) => ({ ...current, page: nextPage }));
  }, []);

  const handleCustomerDirectoryPageChange = useCallback((nextPage) => {
    setCustomerDirectoryPagination((current) => ({ ...current, page: nextPage }));
  }, []);

  const handleCustomerRecordSelect = useCallback((customer) => {
    setSelectedCustomerRecord(customer);
    setCustomerHistoryPagination((current) => ({ ...current, page: 1 }));
    setCustomerDetails(null);
    setCustomerDetailsError(false);
  }, []);

  const handleCustomerHistoryPageChange = useCallback((nextPage) => {
    setCustomerHistoryPagination((current) => ({ ...current, page: nextPage }));
  }, []);

  const handleRetryCustomerDetails = useCallback(() => {
    if (!selectedCustomerRecord?._id) {
      return;
    }

    setCustomerDetailsError(false);
    setCustomerDetailsLoading(true);
    fetchCustomerDetails({ customerId: selectedCustomerRecord._id, page: customerHistoryPagination.page })
      .catch(() => {
        setCustomerDetailsError(true);
      })
      .finally(() => {
        setCustomerDetailsLoading(false);
      });
  }, [customerHistoryPagination.page, fetchCustomerDetails, selectedCustomerRecord?._id]);

  useEffect(() => {
    if (visibleSections.some((section) => section.id === activeSection)) {
      return;
    }

    setActiveSection(visibleSections[0]?.id || 'overview');
  }, [activeSection, visibleSections]);

  useEffect(() => {
    if (activeSection !== 'bookings') {
      return undefined;
    }

    let isActive = true;
    const timer = window.setTimeout(async () => {
      try {
        setCustomerSearchLoading(true);
        const response = await api.get('/bookings/customers', {
          params: {
            search: customerSearch,
            limit: 8,
          },
        });

        if (isActive) {
          setCustomerResults(Array.isArray(response.data?.items) ? response.data.items : []);
        }
      } catch {
        if (isActive) {
          setSyncIssue(true);
        }
      } finally {
        if (isActive) {
          setCustomerSearchLoading(false);
        }
      }
    }, customerSearch.trim() ? 220 : 0);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [activeSection, customerSearch]);

  useEffect(() => {
    if (!deskBookingForm.barberId) {
      return;
    }

    const barberStillAvailable = availableDeskBarbers.some(
      (barber) => String(barber._id) === String(deskBookingForm.barberId),
    );

    if (!barberStillAvailable) {
      setDeskBookingForm((current) => ({
        ...current,
        barberId: '',
        date: '',
        time: '',
      }));
      setDeskBookingSlots([]);
    }
  }, [availableDeskBarbers, deskBookingForm.barberId]);

  useEffect(() => {
    if (!deskBookingForm.serviceId || !deskBookingForm.barberId || !deskBookingForm.date) {
      setDeskBookingSlots([]);
      setDeskBookingLoading(false);
      return undefined;
    }

    let isActive = true;

    const loadDeskAvailability = async () => {
      try {
        setDeskBookingLoading(true);
        const response = await api.get('/bookings/availability', {
          params: {
            barberId: deskBookingForm.barberId,
            serviceId: deskBookingForm.serviceId,
            date: deskBookingForm.date,
          },
        });

        if (!isActive) {
          return;
        }

        const slots = Array.isArray(response.data) ? response.data : [];
        setDeskBookingSlots(slots);
        setDeskBookingForm((current) => ({
          ...current,
          time: slots.includes(current.time) ? current.time : '',
        }));
      } catch {
        if (isActive) {
          setDeskBookingSlots([]);
        }
      } finally {
        if (isActive) {
          setDeskBookingLoading(false);
        }
      }
    };

    loadDeskAvailability();

    return () => {
      isActive = false;
    };
  }, [deskBookingForm.barberId, deskBookingForm.date, deskBookingForm.serviceId]);

  const handleServiceInput = useCallback((field, value) => {
    const normalizedValue =
      field === 'price' || field === 'durationMinutes' ? sanitizeNumericInput(value) : value;

    setServiceForm((current) => ({
      ...current,
      [field]: normalizedValue,
      slug: field === 'name' ? slugify(value) : current.slug,
    }));
  }, []);

  const handleBarberInput = useCallback((field, value) => {
    const normalizedValue = field === 'experienceYears' ? sanitizeNumericInput(value) : value;
    setBarberForm((current) => ({ ...current, [field]: normalizedValue }));
  }, []);

  const handleDeskBookingInput = useCallback((field, value) => {
    if (field === 'date' && isPastBusinessDate(value)) {
      addToast(
        lang === 'ar'
          ? 'لا يمكن اختيار تاريخ سابق.'
          : 'You cannot choose a past date.',
        'error',
      );
      return;
    }

    setDeskBookingForm((current) => {
      if (field === 'serviceId') {
        return {
          serviceId: value,
          barberId: '',
          date: '',
          time: '',
        };
      }

      if (field === 'barberId') {
        return {
          ...current,
          barberId: value,
          date: '',
          time: '',
        };
      }

      if (field === 'date') {
        return {
          ...current,
          date: value,
          time: '',
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }, [addToast, lang]);

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setDeskBookingForm(createDeskBookingState());
    setDeskBookingSlots([]);
  }, []);

  const openCustomerBookingDesk = useCallback((customer) => {
    if (!customer?._id) {
      return;
    }

    setSelectedCustomer(customer);
    setBookingPanelView('create');
    setActiveSection('bookings');
  }, []);

  const handleRebookCustomerService = useCallback((customer, serviceId, barberId = '') => {
    if (!customer?._id || !serviceId) {
      return;
    }

    setSelectedCustomer(customer);
    setBookingPanelView('create');
    setDeskBookingForm({
      serviceId,
      barberId,
      date: '',
      time: '',
    });
    setDeskBookingSlots([]);
    setActiveSection('bookings');
  }, []);

  const handleDeskBookingSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (deskBookingSubmitLockRef.current) {
        return;
      }

      if (
        !selectedCustomer?._id ||
        !deskBookingForm.serviceId ||
        !deskBookingForm.barberId ||
        !deskBookingForm.date ||
        !deskBookingForm.time
      ) {
        return;
      }

      try {
        deskBookingSubmitLockRef.current = true;
        setDeskBookingSubmitting(true);
        const response = await api.post('/bookings/admin-create', {
          userId: selectedCustomer._id,
          barberId: deskBookingForm.barberId,
          date: deskBookingForm.date,
          time: deskBookingForm.time,
          serviceId: deskBookingForm.serviceId,
        });

        if (response.data?._id) {
          suppressedLiveToastsRef.current.add(`booking.created:${response.data._id}`);
        }

        await fetchAll();
        handleBookingStatusFilterChange('active');
        setDeskBookingForm(createDeskBookingState());
        setDeskBookingSlots([]);
        addToast(t.bookingCreatedForCustomer, 'success');
      } catch (error) {
        const message = error.response?.data?.message;
        addToast(
          message === 'Selected customer already has 3 active bookings'
            ? t.customerMaxBookings
            : message || t.adminActionFailed,
          'error',
        );
      } finally {
        deskBookingSubmitLockRef.current = false;
        setDeskBookingSubmitting(false);
      }
    },
    [
      addToast,
      deskBookingForm.barberId,
      deskBookingForm.date,
      deskBookingForm.serviceId,
      deskBookingForm.time,
      fetchAll,
      handleBookingStatusFilterChange,
      selectedCustomer,
      t.adminActionFailed,
      t.bookingCreatedForCustomer,
      t.customerMaxBookings,
    ],
  );

  const toggleBarberService = useCallback((serviceId) => {
    setBarberForm((current) => {
      const exists = current.serviceIds.includes(serviceId);
      return {
        ...current,
        serviceIds: exists
          ? current.serviceIds.filter((id) => id !== serviceId)
          : [...current.serviceIds, serviceId],
      };
    });
  }, []);

  const updateScheduleField = useCallback((dayOfWeek, field, value) => {
    setBarberForm((current) => ({
      ...current,
      workingHours: current.workingHours.map((entry) =>
        entry.dayOfWeek === dayOfWeek ? { ...entry, [field]: value } : entry,
      ),
    }));
  }, []);

  const loadRescheduleAvailability = useCallback(
    async (booking, date, preferredTime = '') => {
      if (!booking?.barber?._id || !booking?.serviceId || !date) {
        setRescheduleSlots([]);
        return;
      }

      try {
        setRescheduleLoading(true);
        const response = await api.get('/bookings/availability', {
          params: {
            barberId: booking.barber._id,
            serviceId: booking.serviceId,
            date,
          },
        });

        const sameDayAsCurrent = getBookingDateInputValue(booking) === date;
        const slots = Array.isArray(response.data) ? response.data : [];
        const mergedSlots =
          sameDayAsCurrent && !slots.includes(booking.time)
            ? [booking.time, ...slots]
            : slots;

        setRescheduleSlots(mergedSlots);
        setRescheduleForm((current) => ({
          ...current,
          date,
          time:
            current.time && mergedSlots.includes(current.time)
              ? current.time
              : preferredTime && mergedSlots.includes(preferredTime)
                ? preferredTime
                : mergedSlots[0] || '',
        }));
      } catch (error) {
        setRescheduleSlots([]);
        addToast(error.response?.data?.message || t.rescheduleError, 'error');
      } finally {
        setRescheduleLoading(false);
      }
    },
    [addToast, t.rescheduleError],
  );

  const openRescheduleModal = async (booking) => {
    const initialDate = getBookingDateInputValue(booking);
    setRescheduleBooking(booking);
    setRescheduleForm({ date: initialDate, time: booking.time });
    await loadRescheduleAvailability(booking, initialDate, booking.time);
  };

  const closeRescheduleModal = (force = false) => {
    if (submitting && !force) return;
    setRescheduleBooking(null);
    setRescheduleForm({ date: '', time: '' });
    setRescheduleSlots([]);
    setRescheduleLoading(false);
  };

  const handleCreateService = async (event) => {
    event.preventDefault();

    const validationMessage = getServiceValidationMessage(serviceForm, lang);
    if (validationMessage) {
      addToast(validationMessage, 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/services', {
        ...serviceForm,
        features: serviceForm.featuresText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        featuresAr: serviceForm.featuresArText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        price: parseNumericValue(serviceForm.price, 0),
        durationMinutes: parseNumericValue(serviceForm.durationMinutes, 15),
      });
      setServiceForm(createServiceState());
      await fetchAll();
      addToast(t.serviceCreated, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || t.serviceError, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateService = async (serviceId, payload) => {
    try {
      setSubmitting(true);
      await api.put(`/services/${serviceId}`, payload);
      await fetchAll();
      addToast(t.serviceUpdated, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || t.serviceError, 'error');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBarber = async (event) => {
    event.preventDefault();

    const validationMessage = getBarberValidationMessage(barberForm, lang);
    if (validationMessage) {
      addToast(validationMessage, 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/barbers', {
        ...barberForm,
        experienceYears: parseNumericValue(barberForm.experienceYears, 0),
        daysOff: barberForm.daysOffText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      });
      setBarberForm(createBarberState());
      await fetchAll();
      addToast(t.barberCreated, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || t.barberError, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBarber = async (barberId, payload) => {
    try {
      setSubmitting(true);
      await api.put(`/barbers/${barberId}`, payload);
      await fetchAll();
      addToast(t.barberUpdated, 'success');
    } catch (error) {
      addToast(error.response?.data?.message || t.barberError, 'error');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (booking, status) => {
    const actionConfig =
      status === 'completed'
        ? {
            message: t.confirmMarkCompleted,
            confirmLabel: t.markCompleted,
            successToast: t.bookingCompleted,
            intent: 'success',
          }
        : status === 'no_show'
          ? {
              message: t.confirmMarkNoShow,
              confirmLabel: t.markNoShow,
              successToast: t.bookingNoShow,
              intent: 'danger',
            }
          : status === 'cancelled'
            ? {
                message: t.confirmCancelBooking,
                confirmLabel: t.cancelBooking,
                successToast: t.bookingCancelled,
                intent: 'warning',
              }
            : null;

    if (!actionConfig) return;

    setConfirmState({
      title: t.confirmTitle,
      message: actionConfig.message,
      confirmLabel: actionConfig.confirmLabel,
      intent: actionConfig.intent,
      action: async () => {
        suppressedLiveToastsRef.current.add(`booking.${status}:${booking._id}`);
        await api.put(`/bookings/${booking._id}/admin-status`, { status });
        await fetchAll();
        addToast(actionConfig.successToast || t.bookingUpdated, 'success');
      },
    });
  };

  const handleRescheduleSubmit = async (event) => {
    event.preventDefault();
    if (!rescheduleBooking || !rescheduleForm.date || !rescheduleForm.time) {
      return;
    }

    try {
      setSubmitting(true);
      suppressedLiveToastsRef.current.add(`booking.rescheduled:${rescheduleBooking._id}`);
      await api.put(`/bookings/${rescheduleBooking._id}/admin-reschedule`, rescheduleForm);
      await fetchAll();
      addToast(t.bookingRescheduled, 'success');
      closeRescheduleModal(true);
    } catch (error) {
      addToast(error.response?.data?.message || t.rescheduleError, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = (booking) =>
    setConfirmState({
      title: t.confirmTitle,
      message: t.confirmDeleteBooking,
      confirmLabel: t.deleteBooking,
      intent: 'danger',
      action: async () => {
        suppressedLiveToastsRef.current.add(`booking.deleted:${booking._id}`);
        await api.delete(`/bookings/${booking._id}`);
        await fetchAll();
        addToast(t.bookingDeleted, 'success');
      },
    });

  const handleDeleteService = (service) =>
    setConfirmState({
      title: t.confirmTitle,
      message: t.confirmDeleteService,
      confirmLabel: t.deleteService,
      intent: 'danger',
      action: async () => {
        await api.delete(`/services/${service._id}`);
        await fetchAll();
        addToast(t.serviceDeleted, 'success');
      },
    });

  const handleDeleteBarber = (barber) =>
    setConfirmState({
      title: t.confirmTitle,
      message: t.confirmDeleteBarber,
      confirmLabel: t.deleteBarber,
      intent: 'danger',
      action: async () => {
        await api.delete(`/barbers/${barber._id}`);
        await fetchAll();
        addToast(t.barberDeleted, 'success');
      },
    });

  const runConfirmedAction = async () => {
    if (!confirmState?.action) return;

    try {
      setSubmitting(true);
      await confirmState.action();
      setConfirmState(null);
    } catch (error) {
      // Surface backend validation failures in the admin UI instead of letting Axios bubble uncaught.
      addToast(error.response?.data?.message || t.adminActionFailed, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSite = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setConfirmState({
      title: t.logout,
      message: t.signOutMessage || copy.en.signOutMessage,
      confirmLabel: t.logout,
      cancelLabel: t.keepButton,
      intent: 'logout',
      action: async () => {
        await logout();
        navigate('/login');
      },
    });
  }, [logout, navigate, t.keepButton, t.logout, t.signOutMessage]);

  const handleAdminProfileSave = useCallback(async () => {
    if (!hasAdminProfileChanges || !isAdminProfilePhoneValid) {
      return;
    }

    try {
      setAdminProfileSaving(true);
      await updateProfile({
        name: adminProfileName.trim(),
        phone: normalizeKuwaitPhoneInput(adminProfilePhone),
        profileImage: adminProfileImage,
        countryCode: KUWAIT_DIAL_CODE,
      });
      addToast(t.profileUpdated || 'Profile updated successfully.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || t.profileUpdateFailed || 'Failed to update profile.', 'error');
    } finally {
      setAdminProfileSaving(false);
    }
  }, [
    addToast,
    adminProfileName,
    adminProfilePhone,
    adminProfileImage,
    hasAdminProfileChanges,
    isAdminProfilePhoneValid,
    t.profileUpdated,
    t.profileUpdateFailed,
    updateProfile,
  ]);

  const handleAdminProfilePhotoSelect = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateProfileImageFile(file)) {
        addToast(
          lang === 'ar'
            ? 'يرجى اختيار صورة صحيحة لا تتجاوز 5 ميجابايت.'
            : 'Please select a valid image under 5 MB.',
          'error',
        );
        event.target.value = '';
        return;
      }

      try {
        setAdminProfileImageProcessing(true);
        const optimizedImage = await optimizeProfileImage(file);
        setAdminProfileImage(optimizedImage);
      } catch {
        addToast(
          lang === 'ar'
            ? 'تعذر تجهيز الصورة. حاول مرة أخرى.'
            : 'We could not prepare that image. Please try again.',
          'error',
        );
      } finally {
        setAdminProfileImageProcessing(false);
        event.target.value = '';
      }
    },
    [addToast, lang],
  );

  const triggerAdminPhotoPicker = useCallback(() => {
    adminProfileFileInputRef.current?.click();
  }, []);

  const removeAdminProfilePhoto = useCallback(() => {
    setAdminProfileImage('');
    addToast(
      lang === 'ar'
        ? 'تمت إزالة الصورة. احفظ التغييرات لتطبيق ذلك.'
        : 'Photo removed. Save changes to apply it.',
      'info',
    );
  }, [addToast, lang]);

  const activeSectionMeta =
    visibleSections.find((section) => section.id === activeSection) || visibleSections[0];

  const headerDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [lang],
  );

  const headerAction = (
    <AdminShellActions
      isRTL={isRTL}
      actions={[
        {
          id: 'back',
          label: t.backToSite,
          icon: ArrowLeft,
          onClick: handleBackToSite,
        },
        {
          id: 'refresh',
          label: refreshing ? t.refreshing || (lang === 'ar' ? 'جار التحديث...' : 'Refreshing...') : t.shellRefresh || t.retry,
          icon: null,
          busy: refreshing,
          disabled: refreshing,
          onClick: () => loadDashboard({ background: true }),
        },
      ]}
    />
  );

  const sidebarUtilityActions = [
    {
      id: 'back',
      label: t.backToSite,
      icon: ArrowLeft,
      onClick: handleBackToSite,
    },
    {
      id: 'logout',
      label: t.logout,
      icon: LogOut,
      tone: 'danger',
      busy: submitting && confirmState?.intent === 'logout',
      onClick: handleLogout,
    },
  ];

  const renderOverviewSection = () => {
    const topActivity = recentActivity.slice(0, 3);
    const topServices = analytics?.topServices || [];
    const topBarbers = analytics?.topBarbers || [];
    const allClear = !syncIssue && operationalHealth.followUp === 0;

    return (
      <div className='space-y-3.5 sm:space-y-4'>
        {loadError ? (
          <div className='rounded-[1.2rem] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/75'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex items-start gap-3'>
                <div className='rounded-xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className='text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400'>
                    {t.loadFailed}
                  </p>
                  <p className='mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300'>
                    {t.loadFailedDetail}
                  </p>
                </div>
              </div>
              {headerAction}
            </div>
          </div>
        ) : null}

        <div>
          <p className='text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
            {t.todayOverview}
          </p>
        </div>

        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          <MetricCard
            icon={Sparkles}
            label={t.todayBookings}
            value={formatNumber(analytics?.totals?.today || 0, lang)}
            accent='from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600'
          />
          <MetricCard
            icon={Clock3}
            label={t.activeBookings}
            value={formatNumber(analytics?.totals?.active || 0, lang)}
            accent='from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600'
          />
          <MetricCard
            icon={CheckCircle2}
            label={t.completedBookings}
            value={formatNumber(analytics?.totals?.completed || 0, lang)}
            accent='from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600'
          />
          <MetricCard
            icon={ShieldAlert}
            label={t.noShows}
            value={formatNumber(analytics?.totals?.noShow || 0, lang)}
            accent='from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600'
          />
        </div>

        <div className='grid gap-3 lg:grid-cols-3'>
          <button
            type='button'
            onClick={() => {
              handleBookingStatusFilterChange('active');
              handleSectionChange('bookings');
            }}
            className='inline-flex min-h-[3.2rem] items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#f1ddb2_0%,#c9a45c_52%,#9d7242_100%)] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-brand-ink shadow-[0_18px_42px_rgba(201,164,92,0.24)] transition hover:-translate-y-[1px] hover:shadow-[0_22px_50px_rgba(201,164,92,0.3)]'
          >
            {t.heroGoBookings}
          </button>
          <button
            type='button'
            onClick={() => handleSectionChange('catalog')}
            className='inline-flex min-h-[3.2rem] items-center justify-center rounded-[1.1rem] border border-brand-gold/16 bg-white/72 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition hover:border-brand-gold/28 hover:text-brand-gold dark:border-brand-gold/16 dark:bg-white/5 dark:text-white/84 dark:hover:text-brand-gold-soft'
          >
            {t.heroGoServices}
          </button>
          <button
            type='button'
            onClick={() => handleSectionChange('team')}
            className='inline-flex min-h-[3.2rem] items-center justify-center rounded-[1.1rem] border border-brand-gold/16 bg-white/72 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition hover:border-brand-gold/28 hover:text-brand-gold dark:border-brand-gold/16 dark:bg-white/5 dark:text-white/84 dark:hover:text-brand-gold-soft'
          >
            {t.heroGoBarbers}
          </button>
        </div>

        <div className='grid gap-3.5 2xl:grid-cols-[1.2fr_1fr_0.8fr]'>
          <SectionShell title={t.heroNextAppointment} compact={true}>
            {nextUpcomingBooking ? (
              <div className={`rounded-[1.15rem] p-4 ${mutedPanel}`}>
                <p className='text-lg font-black text-slate-900 dark:text-white'>
                  {nextUpcomingBooking.user?.name || nextUpcomingBooking.customerName}
                </p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  <span className='rounded-full border border-brand-gold/14 bg-white/60 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-700 backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/6 dark:text-slate-200'>
                    {nextUpcomingBooking.service}
                  </span>
                  <span className='rounded-full border border-brand-gold/14 bg-white/72 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/6 dark:text-slate-300'>
                    {nextUpcomingBooking.barber?.name || nextUpcomingBooking.barberName}
                  </span>
                </div>
                <p className='mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300'>
                  {formatDateTime(
                    nextUpcomingBooking.date,
                    nextUpcomingBooking.time,
                    lang,
                    nextUpcomingBooking.businessDate || '',
                  )}
                </p>
              </div>
            ) : (
              <div
                className={`rounded-[1.15rem] border border-dashed p-6 text-center text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                <p className='font-black text-slate-900 dark:text-white'>{t.heroNoUpcoming}</p>
                <p className='mt-2 leading-6'>{t.heroNoUpcomingDetail}</p>
              </div>
            )}
          </SectionShell>

          <SectionShell title={t.recentActivity} subtitle={t.recentActivitySub} compact={true}>
            <div className='space-y-3'>
              {topActivity.length === 0 ? (
                <div
                  className={`rounded-[1.15rem] border border-dashed p-6 text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
                >
                  {t.noActivity}
                </div>
              ) : (
                topActivity.map((item, index) => (
                  <ActivityCard key={`${item.timestamp}-${index}`} item={item} lang={lang} />
                ))
              )}
            </div>
          </SectionShell>

          <SectionShell title={t.heroOperationalHealth} compact={true}>
            <div
              className={`rounded-[1.15rem] p-5 text-center ${
                allClear
                  ? 'border border-brand-gold/14 bg-white/62 backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/6'
                  : 'border border-brand-gold/14 bg-white/62 backdrop-blur-xl dark:border-brand-gold/14 dark:bg-white/6'
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  allClear
                    ? 'border border-brand-gold/16 bg-brand-gold/14 text-brand-gold'
                    : 'border border-brand-gold/16 bg-brand-gold/14 text-brand-gold'
                }`}
              >
                {allClear ? <CheckCircle2 size={28} /> : <ShieldAlert size={28} />}
              </div>
              <p className='mt-4 text-xl font-black text-slate-900 dark:text-white'>
                {allClear ? t.heroHealthCalm : t.heroHealthAttention}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>
                {operationalHealth.detail}
              </p>
              <div className='mt-5 grid grid-cols-3 gap-3 text-left'>
                <div>
                  <p className='text-xl font-black text-slate-900 dark:text-white'>
                    {formatNumber(operationalHealth.noShow, lang)}
                  </p>
                  <p className='mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                    {t.heroNoShowToday}
                  </p>
                </div>
                <div>
                  <p className='text-xl font-black text-slate-900 dark:text-white'>
                    {formatNumber(operationalHealth.cancelled, lang)}
                  </p>
                  <p className='mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                    {t.heroCancelledToday}
                  </p>
                </div>
                <div>
                  <p className='text-xl font-black text-slate-900 dark:text-white'>
                    {formatNumber(operationalHealth.followUp, lang)}
                  </p>
                  <p className='mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300'>
                    {t.heroFollowUp}
                  </p>
                </div>
              </div>
            </div>
          </SectionShell>
        </div>

        <div className='grid gap-3.5 2xl:grid-cols-[1.2fr_0.9fr_0.9fr]'>
          <SectionShell title={t.lastSevenDays} compact={true}>
            <SparklineChart items={analytics?.dailyVolume || []} lang={lang} />
          </SectionShell>

          <SectionShell title={t.topService} compact={true}>
            {topServices.length > 0 ? (
              <MiniBarChart items={topServices.slice(0, 4)} lang={lang} />
            ) : (
              <div
                className={`rounded-[1.15rem] border border-dashed p-6 text-center text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {analytics?.leaders?.mostBookedService?.label || t.noDataYet}
              </div>
            )}
          </SectionShell>

          <SectionShell title={t.topBarber} compact={true}>
            {topBarbers.length > 0 ? (
              <MiniBarChart items={topBarbers.slice(0, 4)} lang={lang} />
            ) : (
              <div
                className={`rounded-[1.15rem] border border-dashed p-6 text-center text-sm text-slate-500 dark:text-slate-300 ${mutedPanel}`}
              >
                {analytics?.leaders?.mostSelectedBarber?.label || t.noDataYet}
              </div>
            )}
          </SectionShell>
        </div>
      </div>
    );
  };

  const renderActiveSection = () => {
    if (activeSection === 'overview') {
      return renderOverviewSection();
    }

    if (activeSection === 'bookings') {
      return (
        <AdminBookingsPanel
          t={t}
          lang={lang}
          bookings={bookings}
          bookingSummary={bookingSummary}
          bookingPagination={bookingPagination}
          services={services}
          barbers={availableDeskBarbers}
          statusFilter={statusFilter}
          setStatusFilter={handleBookingStatusFilterChange}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
          customerResults={customerResults}
          customerSearchLoading={customerSearchLoading}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          onClearSelectedCustomer={clearSelectedCustomer}
          deskBookingForm={deskBookingForm}
          onDeskBookingInput={handleDeskBookingInput}
          deskBookingSlots={deskBookingSlots}
          deskBookingLoading={deskBookingLoading}
          deskBookingSubmitting={deskBookingSubmitting}
          onDeskBookingSubmit={handleDeskBookingSubmit}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteBooking}
          onReschedule={openRescheduleModal}
          onBookingPageChange={handleBookingPageChange}
          bookingView={bookingPanelView}
          onBookingViewChange={setBookingPanelView}
        />
      );
    }

    if (activeSection === 'catalog') {
      return (
        <AdminServicesPanel
          t={t}
          lang={lang}
          services={services}
          barbers={barbers}
          createForm={serviceForm}
          onCreateInput={handleServiceInput}
          onCreateSubmit={handleCreateService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          submitting={submitting}
        />
      );
    }

    if (activeSection === 'customers') {
      return (
        <AdminCustomersPanel
          t={t}
          lang={lang}
          customers={customerDirectory}
          customerDirectorySearch={customerDirectorySearch}
          setCustomerDirectorySearch={(value) => {
            setCustomerDirectorySearch(value);
            setCustomerDirectoryPagination((current) => ({ ...current, page: 1 }));
          }}
          customerDirectoryLoading={customerDirectoryLoading}
          customerDirectoryPagination={customerDirectoryPagination}
          customerDirectorySummary={customerDirectorySummary}
          onCustomerDirectoryPageChange={handleCustomerDirectoryPageChange}
          selectedCustomerRecord={selectedCustomerRecord}
          customerDetails={customerDetails}
          customerDetailsLoading={customerDetailsLoading}
          customerDetailsError={customerDetailsError}
          onSelectCustomer={handleCustomerRecordSelect}
          onRetryCustomerDetails={handleRetryCustomerDetails}
          onCustomerHistoryPageChange={handleCustomerHistoryPageChange}
          onOpenCustomerBookingDesk={openCustomerBookingDesk}
          onRebookCustomerService={handleRebookCustomerService}
        />
      );
    }

    if (activeSection === 'settings') {
      return (
        <AdminSettingsWorkspace
          adminProfileFileInputRef={adminProfileFileInputRef}
          adminProfileImage={adminProfileImage}
          adminProfileImageProcessing={adminProfileImageProcessing}
          adminProfileName={adminProfileName}
          adminProfilePhone={adminProfilePhone}
          adminProfileSaving={adminProfileSaving}
          darkMode={darkMode}
          handleAdminProfilePhotoSelect={handleAdminProfilePhotoSelect}
          handleAdminProfileSave={handleAdminProfileSave}
          hasAdminProfileChanges={hasAdminProfileChanges}
          isAdminProfilePhoneValid={isAdminProfilePhoneValid}
          lang={lang}
          onAdminProfileNameChange={setAdminProfileName}
          onAdminProfilePhoneChange={(value) =>
            setAdminProfilePhone(normalizeKuwaitPhoneInput(value))
          }
          removeAdminProfilePhoto={removeAdminProfilePhoto}
          setLang={setLang}
          setDarkMode={setDarkMode}
          t={t}
          triggerAdminPhotoPicker={triggerAdminPhotoPicker}
          user={user}
        />
      );
    }

    return (
      <AdminBarbersPanel
        t={t}
        lang={lang}
        services={services}
        barbers={barbers}
        createForm={barberForm}
        onCreateInput={handleBarberInput}
        onCreateToggleService={toggleBarberService}
        onCreateUpdateSchedule={updateScheduleField}
        onCreateSubmit={handleCreateBarber}
        onUpdateBarber={handleUpdateBarber}
        onDeleteBarber={handleDeleteBarber}
        submitting={submitting}
      />
    );
  };

  // The shell keeps a single admin render path while reusing the existing panel logic.
  const dashboardShell = (
    <div
      className='lux-page-shell min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-8 lg:p-10'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
        <div className='mx-auto flex max-w-[96rem] gap-4 lg:gap-6'>
          <AdminDashboardSidebar
            activeSection={activeSection}
            branding={{
              name: 'THE CUT',
              subtitle: t.title,
              footerTitle: t.liveHealthy,
              footerCopy: t.premiumNote,
            }}
            isOpen={mobileSidebarOpen}
            isRTL={isRTL}
            items={visibleSections}
            onClose={() => setMobileSidebarOpen(false)}
            onSelect={handleSectionChange}
            profile={{
              name: user?.name || 'Admin',
              image: user?.profileImage || '',
              caption: user?.email || t.title,
            }}
            utilityActions={sidebarUtilityActions}
          />

          <div className='min-w-0 flex-1 space-y-3.5 sm:space-y-4'>
            <AdminDashboardHeader
              action={headerAction}
              dateLabel={headerDateLabel}
              description={activeSectionMeta?.caption}
              isRTL={isRTL}
              onOpenSidebar={() => setMobileSidebarOpen(true)}
              statusText={syncIssue ? t.livePaused : t.liveHealthy}
              statusTone={syncIssue ? 'warning' : 'healthy'}
              title={activeSectionMeta?.label || t.overview}
            />

            <AdminDashboardContent>
              <AnimatePresence mode='wait' initial={false}>
                <MotionDiv key={activeSection} {...sectionMotion}>
                  {renderActiveSection()}
                </MotionDiv>
              </AnimatePresence>
            </AdminDashboardContent>
          </div>
        </div>

        <AdminRescheduleModal
          open={Boolean(rescheduleBooking)}
          booking={rescheduleBooking}
          t={t}
          lang={lang}
          form={rescheduleForm}
          slots={rescheduleSlots}
          loadingSlots={rescheduleLoading}
          submitting={submitting}
          onClose={closeRescheduleModal}
          onDateChange={(value) => {
            setRescheduleForm((current) => ({ ...current, date: value, time: '' }));
            if (rescheduleBooking) {
              loadRescheduleAvailability(rescheduleBooking, value);
            }
          }}
          onTimeChange={(value) =>
            setRescheduleForm((current) => ({ ...current, time: value }))
          }
          onSubmit={handleRescheduleSubmit}
        />

        <ConfirmModal
          state={confirmState}
          onClose={() => !submitting && setConfirmState(null)}
          onConfirm={runConfirmedAction}
          busy={submitting}
          t={t}
        />
    </div>
  );

  const loadingSkeletonShell = (
    <div
      className='lux-page-shell min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-8 lg:p-10'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='mx-auto flex max-w-[96rem] gap-4 lg:gap-6'>
        <aside className='hidden lg:block lg:w-[15.75rem] lg:shrink-0 xl:w-[16.25rem]'>
          <div className={`h-[calc(100vh-3rem)] rounded-[0.95rem] p-3 sm:p-3.5 ${glassPanel}`}>
            <div className='animate-pulse space-y-3.5'>
              <div className='h-12 rounded-[0.8rem] bg-slate-200/80 dark:bg-slate-800/80' />
              <div className='space-y-2 pt-2'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`sidebar-skeleton-${index}`}
                    className='h-[3.1rem] rounded-[0.75rem] bg-slate-100 dark:bg-slate-900'
                  />
                ))}
              </div>
              <div className='h-24 rounded-[0.8rem] bg-slate-100 dark:bg-slate-900' />
            </div>
          </div>
        </aside>

        <div className='min-w-0 flex-1 space-y-3 sm:space-y-3.5'>
          <div className={`rounded-[0.95rem] p-4 ${glassPanel}`}>
            <div className='animate-pulse space-y-3'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div className='space-y-2'>
                  <div className='h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800' />
                  <div className='h-8 w-52 max-w-full rounded-full bg-slate-200 dark:bg-slate-800' />
                  <div className='h-4 w-72 max-w-full rounded-full bg-slate-100 dark:bg-slate-900' />
                </div>
                <div className='h-10 w-32 rounded-[0.8rem] bg-slate-100 dark:bg-slate-900' />
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className='h-10 w-52 rounded-[0.8rem] bg-slate-100 dark:bg-slate-900' />
                <div className='h-10 w-40 rounded-[0.8rem] bg-slate-100 dark:bg-slate-900' />
              </div>
            </div>
          </div>

          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`metric-skeleton-${index}`}
                className={`rounded-[1.1rem] p-4 sm:p-5 ${glassPanel}`}
              >
                <div className='animate-pulse space-y-3'>
                  <div className='h-10 w-10 rounded-[0.75rem] bg-slate-100 dark:bg-slate-900' />
                  <div className='h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800' />
                  <div className='h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-800' />
                </div>
              </div>
            ))}
          </div>

          <div className='grid gap-3 lg:grid-cols-3'>
            <div className={`rounded-[1rem] p-5 ${glassPanel}`}>
              <div className='animate-pulse space-y-4'>
                <div className='h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800' />
                <div className='h-32 rounded-[1rem] bg-slate-100 dark:bg-slate-900' />
              </div>
            </div>
            <div className={`rounded-[1rem] p-5 ${glassPanel}`}>
              <div className='animate-pulse space-y-3'>
                <div className='h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-800' />
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`activity-skeleton-${index}`}
                    className='h-16 rounded-[0.95rem] bg-slate-100 dark:bg-slate-900'
                  />
                ))}
              </div>
            </div>
            <div className={`rounded-[1rem] p-5 ${glassPanel}`}>
              <div className='animate-pulse space-y-4'>
                <div className='h-4 w-36 rounded-full bg-slate-200 dark:bg-slate-800' />
                <div className='h-40 rounded-[1rem] bg-slate-100 dark:bg-slate-900' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return loadingSkeletonShell;
  }

  return dashboardShell;
}

