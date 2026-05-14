import React, { Suspense, lazy, useContext, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { HelmetProvider } from 'react-helmet-async';

import Home from './pages/Home';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const APP_LANG_KEY = 'app-lang';

const AppShellLoader = () => (
  <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-light px-6 text-slate-900 transition-colors dark:bg-brand-dark dark:text-white'>
    <div
      className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(201,164,92,0.08),transparent_32%)]'
      aria-hidden='true'
    />
    <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_42%)]' />

    <div className='relative w-full max-w-sm'>
      <div className='overflow-hidden rounded-[2rem] border border-black/8 bg-white/68 p-8 text-center shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(13,11,9,0.92),rgba(13,11,9,0.84))]'>
        <div className='mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/12 shadow-[0_18px_44px_rgba(201,164,92,0.18)]'>
          <div className='h-10 w-10 animate-spin rounded-full border-[3px] border-brand-gold/30 border-t-brand-gold' />
        </div>

        <p className='mt-6 text-[11px] font-black uppercase tracking-[0.32em] text-brand-gold'>
          The Cut
        </p>
        <h2 className='mt-3 text-2xl font-black text-slate-900 dark:text-white'>
          Preparing your experience
        </h2>
        <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-white/65'>
          Loading the next view with your theme, session, and live studio data.
        </p>

        <div className='mt-6 h-1.5 overflow-hidden rounded-full bg-black/6 dark:bg-white/8'>
          <div className='h-full w-2/3 animate-pulse rounded-full bg-[linear-gradient(90deg,#c9a45c_0%,#f1ddb2_100%)]' />
        </div>
      </div>
    </div>
  </div>
);

const getInitialLang = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return localStorage.getItem(APP_LANG_KEY) || 'en';
};

const ProtectedRoute = ({ children, adminOnly, userOnly }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <AppShellLoader />;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to='/dashboard' replace />;
  }

  if (userOnly && user.role === 'admin') {
    return <Navigate to='/admin' state={location.state} replace />;
  }

  return children;
};

function AppLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [lang, setLang] = useState(getInitialLang);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const hideFooterPaths = ['/login', '/register', '/booking', '/dashboard', '/admin'];
  const shouldHideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path),
  );
  const shouldHideNavbar =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/booking');

  useEffect(() => {
    localStorage.setItem(APP_LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  const sharedRouteProps = useMemo(
    () => ({
      lang,
      isRTL: dir === 'rtl',
    }),
    [dir, lang],
  );

  return (
    <HelmetProvider>
      <div
        dir={dir}
        className='min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-500'
      >
        {!shouldHideNavbar && <Navbar lang={lang} setLang={setLang} />}

        <main className='grow'>
          <ErrorBoundary>
            <Suspense
              fallback={<AppShellLoader />}
            >
              <Routes>
                <Route path='/' element={<Home {...sharedRouteProps} />} />
                <Route
                  path='/login'
                  element={
                    user ? (
                      user.role === 'admin' ? (
                        <Navigate to='/admin' replace />
                      ) : (
                        <Navigate to='/dashboard' replace />
                      )
                    ) : (
                      <AuthPage {...sharedRouteProps} />
                    )
                  }
                />
                <Route
                  path='/register'
                  element={
                    user ? (
                      user.role === 'admin' ? (
                        <Navigate to='/admin' replace />
                      ) : (
                        <Navigate to='/dashboard' replace />
                      )
                    ) : (
                      <AuthPage {...sharedRouteProps} />
                    )
                  }
                />
                <Route
                  path='/booking'
                  element={
                    <ProtectedRoute userOnly={true}>
                      <BookingPage {...sharedRouteProps} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/dashboard'
                  element={
                    <ProtectedRoute>
                      <Dashboard {...sharedRouteProps} setLang={setLang} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/admin'
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard {...sharedRouteProps} setLang={setLang} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {!shouldHideFooter && <Footer {...sharedRouteProps} />}
      </div>
    </HelmetProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
