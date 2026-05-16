import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import {
  dashboardGlassPanel,
  dashboardInsetPanelClass,
  dashboardSubtleButtonClass,
} from '../dashboard/dashboardTheme';

const MotionDiv = motion.div;

const navIcons = {
  overview: LayoutDashboard,
  bookings: CalendarClock,
  team: Users,
  catalog: Scissors,
  customers: UserRound,
  settings: Settings,
};

const shellSurface = dashboardGlassPanel;
const shellInset = dashboardInsetPanelClass;
const shellSubtle = dashboardSubtleButtonClass;

const SidebarNavItem = ({ item, active, isRTL, onClick }) => {
  const Icon = navIcons[item.id] || LayoutDashboard;

  return (
    <button
      type='button'
      onClick={() => onClick(item.id)}
      className={`group relative flex min-h-[3.1rem] w-full items-center gap-3 overflow-hidden rounded-[0.75rem] px-3.5 py-2.5 text-left transition-colors ${
        active
          ? 'border border-brand-gold/24 bg-brand-gold/10 text-slate-900 shadow-[0_10px_28px_rgba(201,164,92,0.16)] dark:border-brand-gold/26 dark:bg-brand-gold/12 dark:text-white'
          : 'border border-transparent text-slate-600 hover:bg-white/62 hover:text-[#8b6238] dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-brand-gold-soft'
      } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border ${
          active
            ? 'border-brand-gold/24 bg-brand-gold/12 text-brand-gold dark:border-brand-gold/24 dark:bg-brand-gold/14 dark:text-brand-gold-soft'
            : 'border-transparent bg-transparent text-slate-400 dark:text-slate-500'
        }`}
      >
        <Icon size={17} />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-[0.92rem] font-black tracking-[0.02em]'>{item.label}</span>
      </span>
    </button>
  );
};

export const AdminDashboardSidebar = ({
  activeSection,
  branding,
  isOpen,
  isRTL,
  items,
  onClose,
  onSelect,
  profile,
  utilityActions,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const sidebarContent = (
    <div
      className={`flex h-full flex-col rounded-[0.95rem] p-3 sm:p-3.5 ${shellSurface}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b border-brand-gold/12 pb-4 dark:border-brand-gold/12 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className={`flex min-w-0 items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.8rem] border border-brand-gold/16 bg-brand-gold/[0.08] text-brand-gold dark:bg-white/[0.02] dark:text-brand-gold-soft'>
            <Scissors size={18} />
          </div>
          <div className='min-w-0'>
            <p className='truncate text-[1.08rem] font-black text-slate-900 dark:text-white'>
              {branding.name}
            </p>
            <p className='mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold dark:text-brand-gold-soft'>
              {branding.subtitle}
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={onClose}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${shellSubtle}`}
          aria-label='Close admin navigation'
        >
          <X size={18} />
        </button>
      </div>

      <div className='mt-3.5 flex-1 overflow-y-auto pr-1'>
        <nav className='space-y-1.5'>
          {items.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              active={activeSection === item.id}
              isRTL={isRTL}
              onClick={onSelect}
            />
          ))}
        </nav>
        <div className='mt-3.5 space-y-3'>
          <div className={`rounded-[0.8rem] border p-3 ${shellInset}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || 'Admin profile'}
                  className='h-10 w-10 rounded-[0.8rem] border border-brand-gold/16 object-cover'
                />
              ) : (
                <div className='flex h-10 w-10 items-center justify-center rounded-[0.8rem] border border-brand-gold/14 bg-brand-gold/[0.08] text-brand-gold dark:bg-white/[0.02] dark:text-brand-gold-soft'>
                  <UserRound size={18} />
                </div>
              )}
              <div className='min-w-0'>
                <p className='text-sm font-black text-slate-900 dark:text-white'>
                  {profile?.name || branding.footerTitle}
                </p>
                <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300'>
                  {profile?.caption || branding.footerCopy}
                </p>
              </div>
            </div>
          </div>
          <AdminSidebarUtilityActions actions={utilityActions} isRTL={isRTL} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className='hidden self-stretch lg:block lg:w-[15.75rem] lg:shrink-0 xl:w-[16.25rem]'>
        <div className='sticky top-6 h-full min-h-[calc(100vh-3rem)]'>{sidebarContent}</div>
      </aside>

      <AnimatePresence>
        {isOpen ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm lg:hidden'
            onClick={onClose}
          >
            <MotionDiv
              initial={{ opacity: 0, x: isRTL ? 36 : -36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 36 : -36 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`h-full w-[min(19rem,86vw)] p-3 sm:p-4 ${isRTL ? 'ml-auto' : ''}`}
              onClick={(event) => event.stopPropagation()}
            >
              {sidebarContent}
            </MotionDiv>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export const AdminDashboardHeader = ({
  action,
  dateLabel,
  description,
  isRTL,
  onOpenSidebar,
  showMenuButton = true,
  statusTone = 'healthy',
  statusText,
  title,
}) => {
  const statusToneClass =
    statusTone === 'warning'
      ? 'border-amber-300/28 bg-amber-50/80 text-amber-700 shadow-[0_12px_26px_rgba(245,158,11,0.08)] dark:border-amber-300/20 dark:bg-amber-400/8 dark:text-amber-200'
      : 'border-brand-gold/18 bg-brand-gold/10 text-slate-700 shadow-[0_12px_26px_rgba(201,164,92,0.1)] dark:border-brand-gold/18 dark:bg-brand-gold/10 dark:text-brand-gold-soft';

  return (
    <header className={`rounded-[0.95rem] p-3.5 sm:p-4 ${shellSurface}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className='flex flex-col gap-2 sm:gap-2.5'>
        <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex min-w-0 items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {showMenuButton ? (
              <button
                type='button'
                onClick={onOpenSidebar}
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.8rem] lg:hidden ${shellSubtle}`}
                aria-label='Open admin navigation'
              >
                <Menu size={18} />
              </button>
            ) : null}
            <div className='min-w-0'>
              <p className='text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold dark:text-brand-gold-soft'>
                {isRTL ? 'مساحة الإدارة' : 'Admin workspace'}
              </p>
              <h1 className='mt-1 text-[1.35rem] font-black leading-tight text-slate-900 dark:text-white sm:text-[1.8rem]'>
                {title}
              </h1>
              {description ? (
                <p className='mt-1 hidden max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-300 sm:block'>
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {action ? <div className='hidden lg:block'>{action}</div> : null}
        </div>

        {statusText ? (
          <div className='sm:hidden'>
            <span
              className={`inline-flex min-h-9 items-center gap-2 rounded-[0.8rem] border px-3 text-xs font-black ${statusToneClass}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  statusTone === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              {statusText}
            </span>
          </div>
        ) : null}
        {action ? <div className='sm:hidden'>{action}</div> : null}

        <div className={`hidden flex-col gap-2.5 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {dateLabel ? (
              <span className={`inline-flex min-h-10 items-center rounded-[0.8rem] px-3.5 text-sm font-bold text-slate-600 dark:text-slate-200 ${shellInset}`}>
                {dateLabel}
              </span>
            ) : null}
            {statusText ? (
              <span
                className={`inline-flex min-h-10 items-center gap-2 rounded-[0.8rem] border px-3.5 text-sm font-black ${statusToneClass}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    statusTone === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                {statusText}
              </span>
            ) : null}
          </div>

          {action ? <div className='sm:self-end lg:hidden'>{action}</div> : null}
        </div>
      </div>
    </header>
  );
};

export const AdminDashboardContent = ({ children }) => (
  <main className='min-w-0 space-y-3 pb-[5.5rem] sm:space-y-3.5 lg:pb-0'>{children}</main>
);

export const AdminMobileTabBar = ({
  activeSection,
  items,
  moreLabel,
  onOpenSidebar,
  onSelect,
}) => {
  const primaryItems = ['overview', 'bookings', 'catalog', 'customers']
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);

  if (primaryItems.length === 0) return null;

  const isMoreActive = !primaryItems.some((item) => item.id === activeSection);

  return (
    <div className='fixed inset-x-0 bottom-0 z-[65] border-t border-black/8 bg-[#f5efe4]/96 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#090807]/96 lg:hidden'>
      <div className='mx-auto max-w-[30rem]'>
        <div
          className='grid gap-2'
          style={{ gridTemplateColumns: `repeat(${primaryItems.length + 1}, minmax(0, 1fr))` }}
        >
          {primaryItems.map((item) => {
            const Icon = navIcons[item.id] || LayoutDashboard;
            const active = item.id === activeSection;

            return (
              <button
                key={item.id}
                type='button'
                onClick={() => onSelect(item.id)}
                className={`flex min-h-[3.65rem] flex-col items-center justify-center gap-1 rounded-[1rem] border px-2 py-2 text-center transition ${
                  active
                    ? 'border-brand-gold/24 bg-brand-gold/12 text-slate-900 dark:border-brand-gold/24 dark:bg-brand-gold/12 dark:text-white'
                    : 'border-transparent bg-transparent text-slate-500 dark:text-slate-300'
                }`}
              >
                <Icon size={17} />
                <span className='text-[10px] font-black leading-none'>{item.label}</span>
              </button>
            );
          })}

          <button
            type='button'
            onClick={onOpenSidebar}
            className={`flex min-h-[3.65rem] flex-col items-center justify-center gap-1 rounded-[1rem] border px-2 py-2 text-center transition ${
              isMoreActive
                ? 'border-brand-gold/24 bg-brand-gold/12 text-slate-900 dark:border-brand-gold/24 dark:bg-brand-gold/12 dark:text-white'
                : 'border-transparent bg-transparent text-slate-500 dark:text-slate-300'
            }`}
          >
            <Menu size={17} />
            <span className='text-[10px] font-black leading-none'>{moreLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminShellActions = ({ actions, isRTL = false }) => {
  if (!actions?.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            type='button'
            onClick={action.onClick}
            disabled={action.disabled}
            aria-busy={action.busy ? 'true' : 'false'}
            className={`inline-flex min-h-10 items-center gap-2 rounded-[0.8rem] border px-3.5 py-2 text-sm font-bold transition ${
              action.tone === 'danger'
                ? 'border-red-200 bg-white/78 text-red-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/18 dark:text-red-300 dark:hover:bg-red-950/30'
                : `${shellSubtle} text-slate-700 dark:text-slate-200`
              } ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {action.busy ? (
              <span className='inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : Icon ? (
              <Icon size={16} />
            ) : null}
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const AdminSidebarUtilityActions = ({ actions, isRTL = false }) => {
  if (!actions?.length) return null;

  return (
    <div className='mt-4 space-y-2'>
      {actions.map((action) => {
        const Icon = action.icon || (action.id === 'logout' ? LogOut : ArrowLeft);

        return (
          <button
            key={action.id}
            type='button'
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex min-h-[3rem] w-full items-center gap-3 rounded-[0.75rem] border px-3.5 py-2.5 text-left text-sm font-bold transition ${
              action.tone === 'danger'
                ? 'border-red-200 bg-white/78 text-red-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/18 dark:text-red-300 dark:hover:bg-red-950/30'
                : `${shellSubtle} text-slate-700 dark:text-slate-200`
            } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            {action.busy ? (
              <span className='inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            ) : (
              <Icon size={16} />
            )}
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const AdminDashboardPlaceholder = ({ eyebrow, title, description }) => (
  <div className={`rounded-[1rem] p-6 sm:p-8 ${shellSurface}`}>
    <div className='mx-auto max-w-2xl text-center'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gold/14 bg-brand-gold/[0.08] text-brand-gold dark:bg-white/[0.02] dark:text-brand-gold-soft'>
        <Settings size={22} />
      </div>
      <p className='mt-5 text-[11px] font-black uppercase tracking-[0.24em] text-brand-gold dark:text-brand-gold-soft'>
        {eyebrow}
      </p>
      <h2 className='mt-3 text-2xl font-black text-slate-900 dark:text-white'>{title}</h2>
      <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>{description}</p>
    </div>
  </div>
);
