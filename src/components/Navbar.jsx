import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { translations } from '../utils/i18n';
import { repairArabicObject } from '../utils/repairArabicText';
import { ScissorsIcon } from './Icons';
import { GlassPanel, PrimaryButton, SecondaryButton } from './home/HomePrimitives';
import { HOME_SECTION_IDS } from './home/homeContent';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const getLogoParts = (logo) => {
  const words = String(logo || 'THE CUT').split(' ');
  return [words[0], words.slice(1).join(' ') || words[0]];
};

const copy = {
  en: {
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
    switchLanguage: 'Switch language',
    appearance: 'Appearance',
    profile: 'Profile',
    updateProfile: 'Update profile',
    signOutTitle: 'Sign out',
    signOutMessage: 'Are you sure you want to end your session right now?',
    confirm: 'Confirm',
    stay: 'Stay here',
    account: 'Account',
    menuTitle: 'Explore the studio',
    menuSubtitle: 'Browse the luxury experience, then lock in your appointment.',
  },
  ar: {
    closeMenu: 'إغلاق القائمة',
    openMenu: 'فتح القائمة',
    switchLanguage: 'تبديل اللغة',
    appearance: 'المظهر',
    profile: 'الملف الشخصي',
    updateProfile: 'تحديث الملف الشخصي',
    signOutTitle: 'تسجيل الخروج',
    signOutMessage: 'هل أنت متأكد من إنهاء جلستك الآن؟',
    confirm: 'تأكيد',
    stay: 'البقاء هنا',
    account: 'الحساب',
    menuTitle: 'اكتشف الاستوديو',
    menuSubtitle: 'تصفح التجربة الفاخرة ثم ثبّت موعدك بسهولة.',
  },
};

const LogoutConfirmModal = ({ lang, open, onClose, onConfirm, loading }) => {
  if (!open) return null;

  const modalCopy = repairArabicObject(copy[lang] || copy.en);

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md'
        onClick={onClose}
      >
        <MotionDiv
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.18 }}
          onClick={(event) => event.stopPropagation()}
          className='lux-panel w-full max-w-sm p-6'
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
              <ShieldCheck size={24} />
            </div>

            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='rounded-full border border-black/8 bg-white/65 p-2 text-slate-500 transition hover:text-slate-900 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white'
            >
              <X size={16} />
            </button>
          </div>

          <h3 className='mt-5 text-2xl font-semibold text-slate-900 dark:text-white'>
            {modalCopy.signOutTitle}
          </h3>
          <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/70'>
            {modalCopy.signOutMessage}
          </p>

          <div className='mt-6 flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='lux-button-secondary flex-1 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-50'
            >
              {modalCopy.stay}
            </button>

            <button
              type='button'
              onClick={onConfirm}
              disabled={loading}
              className='lux-button-primary flex-1 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60'
            >
              {loading ? `${modalCopy.confirm}...` : modalCopy.confirm}
            </button>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};

const Avatar = ({ user }) => {
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name || 'User'}
        className='h-10 w-10 rounded-full border border-brand-gold/45 object-cover shadow-[0_10px_24px_rgba(201,164,92,0.18)]'
      />
    );
  }

  return (
    <div className='flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/45 bg-brand-gold/12 text-sm font-semibold text-brand-gold shadow-[0_10px_24px_rgba(201,164,92,0.18)]'>
      {initials}
    </div>
  );
};

const sectionNavItems = (t) => [
  { id: HOME_SECTION_IDS.hero, label: t.navHome },
  { id: HOME_SECTION_IDS.services, label: t.navServices },
  { id: HOME_SECTION_IDS.barbers, label: t.navBarbers },
  { id: HOME_SECTION_IDS.gallery, label: t.navGallery },
  { id: HOME_SECTION_IDS.faq, label: t.navFAQ },
];

const secondarySectionNavItems = (t) => [
  { id: HOME_SECTION_IDS.about, label: t.navAbout },
  { id: HOME_SECTION_IDS.location, label: t.navLocation },
  { id: HOME_SECTION_IDS.contact, label: t.navContact },
];

const toggleLanguageValue = (lang) => (lang === 'en' ? 'ar' : 'en');

const scrollToHomepageSection = (sectionId) => {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(sectionId);
  if (!element) return;

  const offset = 104;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.history.replaceState(null, '', sectionId === HOME_SECTION_IDS.hero ? '/' : `/#${sectionId}`);
  window.scrollTo({ top, behavior: 'smooth' });
};

const NavLinkButton = ({ active, onClick, children }) => (
  <button
    type='button'
    onClick={onClick}
    className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${
      active
        ? 'text-brand-gold'
        : 'text-slate-500 hover:text-brand-gold dark:text-white/70 dark:hover:text-brand-gold'
    }`}
  >
    {children}
    <MotionSpan
      className='absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-brand-gold'
      initial={false}
      animate={{ scaleX: active ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ originX: 0 }}
    />
  </button>
);

const UtilityPill = ({ to, label, active, icon, onClick }) => {
  const IconComponent = icon;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
        active
          ? 'border-brand-gold/35 bg-brand-gold/12 text-brand-gold'
          : 'border-black/8 bg-white/60 text-slate-700 hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/5 dark:text-white/75'
      }`}
    >
      <IconComponent size={14} />
      {label}
    </Link>
  );
};

const ControlButton = ({ onClick, ariaLabel, children }) => (
  <button
    type='button'
    onClick={onClick}
    aria-label={ariaLabel}
    className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/60 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/5 dark:text-white/75'
  >
    {children}
  </button>
);

const SectionMenuLink = ({ active, label, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-[1.2rem] px-4 py-3 text-left text-[15px] font-semibold transition ${
      active
        ? 'bg-brand-gold/12 text-brand-gold'
        : 'text-slate-900 hover:bg-black/[0.03] dark:text-white dark:hover:bg-white/5'
    }`}
  >
    <span>{label}</span>
    <ChevronDown size={16} className='-rotate-90 text-current' />
  </button>
);

const UserMenuLink = ({ icon, label, to, onClick }) => {
  const IconComponent = icon;

  return (
    <Link
      to={to}
      onClick={onClick}
      className='flex items-center gap-3 rounded-[1.15rem] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] hover:text-brand-gold dark:text-white/80 dark:hover:bg-white/5'
    >
      <IconComponent size={16} />
      {label}
    </Link>
  );
};

export default function Navbar({ lang, setLang }) {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(HOME_SECTION_IDS.hero);

  const isRTL = lang === 'ar';
  const t = useMemo(() => repairArabicObject(translations[lang] || translations.en), [lang]);
  const c = useMemo(() => repairArabicObject(copy[lang] || copy.en), [lang]);
  const [logoPrimary, logoAccent] = getLogoParts(t.logo);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const navItems = useMemo(() => sectionNavItems(t), [t]);
  const secondaryNavItems = useMemo(() => secondarySectionNavItems(t), [t]);
  const utilityLinks = useMemo(() => {
    const links = [];

    if (isAdmin) {
      links.push({ to: '/admin', label: t.navAdmin, icon: Settings });
    } else if (isLoggedIn) {
      links.push({ to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard });
    }

    return links;
  }, [isAdmin, isLoggedIn, t]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const overlayOpen = isMenuOpen || isProfileOpen || showLogoutConfirm;
    if (!overlayOpen) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return undefined;
    }

    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen, isProfileOpen, showLogoutConfirm]);

  useEffect(() => {
    if (location.pathname !== '/') {
      return undefined;
    }

    const observedSections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!observedSections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-34% 0px -46% 0px',
        threshold: [0.1, 0.28, 0.5, 0.8],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname, navItems]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const goToBooking = () => {
    closeMenus();

    if (isAdmin) {
      navigate('/admin', { state: { section: 'bookings' } });
      return;
    }

    navigate('/booking');
  };

  const goToProfileEditor = () => {
    closeMenus();
    navigate('/dashboard', { state: { openProfileEditor: true } });
  };

  const requestLogout = () => {
    closeMenus();
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      navigate('/login');
    } finally {
      setLogoutLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleSectionNavigation = (sectionId) => {
    closeMenus();

    if (location.pathname === '/') {
      scrollToHomepageSection(sectionId);
      return;
    }

    navigate(sectionId === HOME_SECTION_IDS.hero ? '/' : `/#${sectionId}`);
  };

  const isSectionActive = (sectionId) =>
    location.pathname === '/' && activeSection === sectionId;

  const toggleLanguage = () => setLang(toggleLanguageValue(lang));
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <>
      <nav className='lux-nav-surface sticky top-0 z-50 h-[5.5rem] transition-colors duration-500'>
        <div className='lux-section-shell flex h-full items-center justify-between gap-4'>
          <Link to='/' onClick={closeMenus} className='flex shrink-0 items-center gap-3'>
            <div className='text-brand-gold'>
              <ScissorsIcon />
            </div>
            <span className='font-display text-[1.8rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
              {logoPrimary} <span className='text-brand-gold'>{logoAccent}</span>
            </span>
          </Link>

          <div className='hidden items-center gap-5 lg:flex'>
            {navItems.map((item) => (
              <NavLinkButton
                key={item.id}
                active={isSectionActive(item.id)}
                onClick={() => handleSectionNavigation(item.id)}
              >
                {item.label}
              </NavLinkButton>
            ))}
          </div>

          <div className='hidden items-center gap-2.5 lg:flex'>
            {utilityLinks.map((link) => (
              <UtilityPill
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                active={location.pathname.startsWith(link.to)}
                onClick={closeMenus}
              />
            ))}

            <PrimaryButton type='button' onClick={goToBooking} className='px-4 py-2 text-[11px] uppercase tracking-[0.18em]'>
              {t.navBook}
            </PrimaryButton>

            <ControlButton onClick={toggleLanguage} ariaLabel={c.switchLanguage}>
              <Globe size={16} />
            </ControlButton>

            <ControlButton
              onClick={toggleTheme}
              ariaLabel={darkMode ? t.lightModeLabel || 'Light mode' : t.darkModeLabel || 'Dark mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </ControlButton>

            {isLoggedIn ? (
              <div className='relative' ref={profileRef}>
                <button
                  type='button'
                  onClick={() => setIsProfileOpen((value) => !value)}
                  className='rounded-full transition hover:scale-[1.01]'
                >
                  <Avatar user={user} />
                </button>

                <AnimatePresence>
                  {isProfileOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className={`lux-panel absolute mt-3 w-68 overflow-hidden p-2 ${
                        isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                      }`}
                    >
                      <div className='flex items-center gap-3 rounded-[1.35rem] border border-black/8 bg-white/58 px-4 py-3 dark:border-white/10 dark:bg-white/5'>
                        <Avatar user={user} />
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>
                            {user.name}
                          </p>
                          <p className='truncate text-xs capitalize text-slate-500 dark:text-white/60'>
                            {user.role}
                          </p>
                        </div>
                      </div>

                      <div className='mt-2 space-y-1'>
                        <button
                          type='button'
                          onClick={goToProfileEditor}
                          className='flex w-full items-center gap-3 rounded-[1.15rem] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] hover:text-brand-gold dark:text-white/80 dark:hover:bg-white/5'
                        >
                          <UserRound size={16} />
                          {c.updateProfile}
                        </button>

                        {utilityLinks.map((link) => (
                          <UserMenuLink
                            key={link.to}
                            to={link.to}
                            icon={link.icon}
                            label={link.label}
                            onClick={closeMenus}
                          />
                        ))}
                      </div>

                      <div className='mt-2 border-t border-black/8 pt-2 dark:border-white/10'>
                        <button
                          type='button'
                          onClick={requestLogout}
                          className='flex w-full items-center gap-3 rounded-[1.15rem] px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/8'
                        >
                          <LogOut size={16} />
                          {t.navLogout}
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to='/login'
                className='inline-flex items-center rounded-full border border-black/8 bg-white/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/5 dark:text-white/80'
              >
                {t.navLogin}
              </Link>
            )}
          </div>

          <div className='flex items-center gap-2 lg:hidden'>
            <PrimaryButton type='button' onClick={goToBooking} className='px-4 py-2.5 text-[11px] uppercase tracking-[0.18em]'>
              {t.navBook}
            </PrimaryButton>

            <button
              type='button'
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label={isMenuOpen ? c.closeMenu : c.openMenu}
              className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/60 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/5 dark:text-white/80'
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className='absolute inset-x-0 top-full border-b border-black/8 bg-brand-light/96 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#090807]/96 lg:hidden'
            >
              <div className='lux-section-shell max-h-[calc(100vh-5.5rem)] overflow-y-auto pb-6 pt-5'>
                <GlassPanel className='p-5'>
                  <p className='lux-kicker'>{c.menuTitle}</p>
                  <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/70'>
                    {c.menuSubtitle}
                  </p>

                  <div className='mt-6 grid gap-2'>
                    {navItems.map((item) => (
                      <SectionMenuLink
                        key={item.id}
                        active={isSectionActive(item.id)}
                        label={item.label}
                        onClick={() => handleSectionNavigation(item.id)}
                      />
                    ))}
                    {secondaryNavItems.map((item) => (
                      <SectionMenuLink
                        key={item.id}
                        active={isSectionActive(item.id)}
                        label={item.label}
                        onClick={() => handleSectionNavigation(item.id)}
                      />
                    ))}
                  </div>

                  <div className='mt-6 border-t border-black/8 pt-6 dark:border-white/10'>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold'>
                      {c.appearance}
                    </p>

                    <div className='mt-4 flex items-center gap-3'>
                      <SecondaryButton type='button' onClick={toggleLanguage} className='flex-1'>
                        <Globe size={16} />
                        {lang === 'en' ? 'EN / AR' : 'AR / EN'}
                      </SecondaryButton>
                      <SecondaryButton type='button' onClick={toggleTheme} className='flex-1'>
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        {darkMode ? t.lightModeLabel || 'Light mode' : t.darkModeLabel || 'Dark mode'}
                      </SecondaryButton>
                    </div>
                  </div>

                  <div className='mt-6 border-t border-black/8 pt-6 dark:border-white/10'>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold'>
                      {c.account}
                    </p>

                    <div className='mt-4 grid gap-2'>
                      {isLoggedIn ? (
                        <>
                          <button
                            type='button'
                            onClick={goToProfileEditor}
                            className='flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] hover:text-brand-gold dark:text-white/80 dark:hover:bg-white/5'
                          >
                            <UserRound size={16} />
                            {c.updateProfile}
                          </button>

                          {utilityLinks.map((link) => (
                            <UserMenuLink
                              key={link.to}
                              to={link.to}
                              icon={link.icon}
                              label={link.label}
                              onClick={closeMenus}
                            />
                          ))}

                          <button
                            type='button'
                            onClick={requestLogout}
                            className='flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-500/8'
                          >
                            <LogOut size={16} />
                            {t.navLogout}
                          </button>
                        </>
                      ) : (
                        <Link
                          to='/login'
                          onClick={closeMenus}
                          className='lux-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold'
                        >
                          {t.navLogin}
                        </Link>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>

      <LogoutConfirmModal
        lang={lang}
        open={showLogoutConfirm}
        onClose={() => !logoutLoading && setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
      />
    </>
  );
}
