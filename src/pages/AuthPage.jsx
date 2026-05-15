/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  User,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { ScissorsIcon } from '../components/Icons';
import KuwaitFlagBadge from '../components/KuwaitFlagBadge';
import api from '../utils/api';
import { translations } from '../utils/i18n';
import {
  KUWAIT_DIAL_CODE,
  isValidKuwaitPhone,
  normalizeKuwaitPhoneInput,
} from '../utils/kuwaitPhone';

const getAuthErrors = (lang) => ({
  email: lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Valid email required',
  passwordRequired: lang === 'ar' ? 'كلمة المرور مطلوبة' : 'Password required',
  passwordStrong:
    lang === 'ar'
      ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم'
      : 'Password must be at least 8 characters with uppercase, lowercase, and number',
  confirmPassword:
    lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords must match',
  name:
    lang === 'ar'
      ? 'الاسم يجب أن يكون حرفين على الأقل'
      : 'Name must be at least 2 characters',
  phone:
    lang === 'ar'
      ? 'أدخل رقم هاتف كويتي صحيح مكوّن من 8 أرقام'
      : 'Enter a valid 8-digit Kuwaiti phone number',
  resetSent:
    lang === 'ar'
      ? 'إذا كان البريد الإلكتروني موجوداً فسيتم إرسال رابط إعادة التعيين.'
      : 'If that email exists, a reset link has been sent.',
  resetSuccess:
    lang === 'ar'
      ? 'تم إعادة تعيين كلمة المرور بنجاح. يرجى تسجيل الدخول.'
      : 'Password reset successful. Please log in.',
  serverUnavailable:
    lang === 'ar'
      ? 'تعذر إكمال الطلب حالياً. يرجى المحاولة مرة أخرى بعد قليل.'
      : 'We could not complete your request right now. Please try again in a moment.',
  generic:
    lang === 'ar'
      ? 'تعذر إكمال الطلب. حاول مرة أخرى.'
      : 'We could not complete your request right now. Please try again.',
});

const translateApiMessage = (message, lang) => {
  if (lang !== 'ar' || !message) {
    return message;
  }

  const map = {
    'Valid email required': 'يرجى إدخال بريد إلكتروني صحيح',
    'Password required': 'كلمة المرور مطلوبة',
    'Invalid credentials': 'بيانات الدخول غير صحيحة',
    'Invalid or expired reset token': 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية',
    'Reset token required': 'رمز إعادة التعيين مطلوب',
    'Password reset successful. Please log in.': 'تم إعادة تعيين كلمة المرور بنجاح. يرجى تسجيل الدخول.',
    'Failed to reset password. Please try again.': 'فشل إعادة تعيين كلمة المرور. حاول مرة أخرى.',
    'Failed to send reset email. Please try again later.': 'فشل إرسال رسالة إعادة التعيين. حاول لاحقاً.',
    'If that account exists, a reset link has been sent.': 'إذا كان الحساب موجوداً فسيتم إرسال رابط إعادة التعيين.',
    'An error occurred during login. Please try again.': 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.',
    'Something went wrong while creating your account. Please try again.': 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.',
    'This email is already registered. Please log in or use a different one.':
      'هذا البريد الإلكتروني مسجل بالفعل. سجّل الدخول أو استخدم بريداً آخر.',
    'Enter a valid 8-digit Kuwaiti phone number': 'أدخل رقم هاتف كويتي صحيح مكوّن من 8 أرقام',
    'Name must be at least 2 characters': 'الاسم يجب أن يكون حرفين على الأقل',
    'Country code must be +965': 'رمز الدولة يجب أن يكون +965',
  };

  if (message.startsWith('Invalid credentials.')) {
    const attemptsMatch = message.match(/(\d+)\s+attempt/);
    if (attemptsMatch) {
      return `بيانات الدخول غير صحيحة. تبقّى ${attemptsMatch[1]} محاولة.`;
    }
  }

  if (message.startsWith('Account locked. Try again in')) {
    const minutesMatch = message.match(/(\d+)\s+minute/);
    if (minutesMatch) {
      return `تم قفل الحساب. حاول مرة أخرى بعد ${minutesMatch[1]} دقيقة.`;
    }
  }

  if (message.startsWith('Too many failed attempts. Account locked for')) {
    const minutesMatch = message.match(/(\d+)\s+minute/);
    if (minutesMatch) {
      return `محاولات كثيرة غير ناجحة. تم قفل الحساب لمدة ${minutesMatch[1]} دقيقة.`;
    }
  }

  if (message.startsWith('This ') && message.includes(' is already registered.')) {
    return 'هذا الحقل مسجل بالفعل. سجّل الدخول أو استخدم قيمة أخرى.';
  }

  return map[message] || message;
};

const getAuthFieldClass = (error) =>
  `relative flex items-center rounded-[1.5rem] border backdrop-blur-xl transition-all duration-200 ${
    error
      ? 'border-red-300/70 bg-red-50/70 shadow-[0_12px_28px_rgba(239,68,68,0.06)] dark:border-red-500/40 dark:bg-red-950/10 dark:shadow-[0_14px_32px_rgba(0,0,0,0.18)]'
      : 'border-brand-gold/12 bg-white/72 shadow-[0_14px_30px_rgba(15,23,42,0.04)] focus-within:border-brand-gold/30 focus-within:bg-white/82 focus-within:shadow-[0_16px_34px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/5 dark:focus-within:border-brand-gold/22 dark:focus-within:shadow-[0_18px_38px_rgba(0,0,0,0.24)]'
  }`;

const AuthPage = ({ lang, isRTL }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, register } = useContext(AuthContext);

  const t = translations[lang];
  const uiErrors = getAuthErrors(lang);
  const token = searchParams.get('token');
  const action = searchParams.get('action');
  const from = location.state?.from?.pathname;
  const isRegisterPath = location.pathname === '/register';
  const isResetRequest = action === 'reset' && !token;
  const isResetForm = Boolean(token);
  const isRegister = action === 'register' || isRegisterPath;

  const [isLogin, setIsLogin] = useState(
    !isRegister && !isResetRequest && !isResetForm,
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [infoMessage, setInfoMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+965',
  });

  useEffect(() => {
    const currentToken = searchParams.get('token');
    const currentAction = searchParams.get('action');
    const nextResetRequest = currentAction === 'reset' && !currentToken;
    const nextResetForm = Boolean(currentToken);
    const registerMode =
      currentAction === 'register' || location.pathname === '/register';

    setIsLogin(!registerMode && !nextResetRequest && !nextResetForm);
  }, [location.pathname, searchParams]);

  const validate = () => {
    const nextErrors = {};

    nextErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? ''
      : uiErrors.email;

    if (isResetRequest) {
      setErrors(nextErrors);
      return Object.values(nextErrors).every((value) => value === '');
    }

    if ((!isLogin || isResetForm) && !isResetRequest) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      nextErrors.password = passwordRegex.test(formData.password)
        ? ''
        : uiErrors.passwordStrong;
    } else {
      nextErrors.password = formData.password ? '' : uiErrors.passwordRequired;
    }

    if ((!isLogin || isResetForm) && !isResetRequest) {
      nextErrors.confirmPassword =
        formData.password === formData.confirmPassword
          ? ''
          : uiErrors.confirmPassword;
    }

    if (!isLogin && !isResetForm) {
      nextErrors.name =
        formData.name.trim().length >= 2 ? '' : uiErrors.name;

      nextErrors.phone = isValidKuwaitPhone(formData.phone)
        ? ''
        : uiErrors.phone;
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => value === '');
  };

  const clearTransientMessages = () => {
    setErrors({});
    setInfoMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (isResetRequest) {
        await api.post('/auth/password-reset-request', {
          email: formData.email,
        });
        setInfoMessage(uiErrors.resetSent);
        setErrors({});
        setFormData((current) => ({
          ...current,
          password: '',
          confirmPassword: '',
        }));
        return;
      }

      if (isResetForm) {
        await api.post('/auth/password-reset', {
          token,
          password: formData.password,
        });
        navigate('/login', {
          replace: true,
          state: { message: uiErrors.resetSuccess },
        });
        return;
      }

      if (isLogin) {
        const loggedUser = await login({
          email: formData.email,
          password: formData.password,
        });

        if (loggedUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from && from !== '/login' ? from : '/dashboard', {
            replace: true,
          });
        }
      } else {
        const registerData = { ...formData };
        delete registerData.confirmPassword;

        const loggedUser = await register(registerData);

        if (loggedUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from && from !== '/login' ? from : '/dashboard', {
            replace: true,
          });
        }
      }
    } catch (error) {
      const apiMessage =
        error.response?.data?.message || error.message || uiErrors.generic;
      setErrors({
        api: error.response
          ? translateApiMessage(apiMessage, lang)
          : uiErrors.serverUnavailable,
        attemptsLeft: error.response?.data?.attemptsLeft,
        lockedUntil: error.response?.data?.lockedUntil,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    clearTransientMessages();
    navigate(isLogin ? '/register' : '/login', { replace: true });
  };

  const goToReset = () => {
    clearTransientMessages();
    navigate('/login?action=reset', { replace: true });
  };

  const panelTitle = isResetRequest
    ? t.resetPassword
    : isResetForm
      ? t.newPassword
      : isLogin
        ? t.loginTitle
        : t.registerTitle;

  const panelSubtitle = isResetRequest
    ? t.resetPasswordDesc
    : isResetForm
      ? t.newPassword
      : isLogin
        ? t.loginSubtitle
        : t.registerSubtitle;

  const submitLabel = loading
    ? isResetRequest
      ? t.sending
      : isResetForm
        ? t.resetting
        : isLogin
          ? t.signingIn
          : t.creatingAccount
    : isResetRequest
      ? t.sendResetLink
      : isResetForm
        ? t.resetBtn
        : isLogin
          ? t.btnSignIn
          : t.btnRegister;

  const [logoPrimary, logoAccent] = String(t.logo || 'THE CUT').split(' ');

  return (
    <div
      className='lux-page-shell min-h-screen flex flex-col overflow-x-hidden md:flex-row'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='relative hidden overflow-hidden md:flex md:w-1/2 lg:w-[45%]'>
        <img
          src='https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=870&auto=format&fit=crop'
          alt='Barbershop'
          className='absolute inset-0 h-full w-full object-cover opacity-38'
        />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.18),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.2),rgba(5,5,5,0.88))]' />

        <div className='relative z-10 flex flex-col justify-end p-12 text-white'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='text-brand-gold'>
              <ScissorsIcon />
            </div>
            <span className='text-2xl font-display font-bold'>
              {logoPrimary} <span className='text-brand-gold'>{logoAccent}</span>
            </span>
          </div>
          <h2 className='text-4xl font-display font-bold leading-tight mb-4'>
            {t.experiencePremium}
          </h2>
          <p className='max-w-sm text-sm leading-8 text-white/72'>
            {t.bookSeamlessly}
          </p>
        </div>
      </div>

      <div className='flex flex-1 items-start justify-center overflow-x-hidden overflow-y-auto px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-6 md:items-center md:px-8 md:pb-8 md:pt-8 lg:p-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mx-auto w-full max-w-md self-start md:self-auto ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <div className='md:hidden flex items-center justify-center gap-3 mb-6'>
            <div className='text-brand-gold'>
              <ScissorsIcon />
            </div>
            <span className='text-2xl font-display font-bold text-slate-900 dark:text-white'>
              {logoPrimary} <span className='text-brand-gold'>{logoAccent}</span>
            </span>
          </div>

          <div className='lux-panel space-y-7 border-white/45 p-5 sm:p-8 md:space-y-8 md:p-10 dark:border-white/10'>
            <div className='text-center space-y-2'>
              <h2 className='text-3xl font-display font-bold text-slate-900 dark:text-white'>
                {panelTitle}
              </h2>
              <p className='text-sm leading-7 text-slate-500 dark:text-white/68'>
                {panelSubtitle}
              </p>
            </div>

            <AnimatePresence mode='wait'>
              {errors.api && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`rounded-[1.2rem] border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/12 dark:text-red-300 flex items-start gap-3 overflow-hidden ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  <ShieldAlert size={18} className='shrink-0 mt-0.5' />
                  <span className='leading-6'>{errors.api}</span>
                </motion.div>
              )}
              {infoMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`rounded-[1.2rem] border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/12 dark:text-emerald-300 flex items-start gap-3 overflow-hidden ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  <CheckCircle2 size={18} className='shrink-0 mt-0.5' />
                  <span className='leading-6'>{infoMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-5'>
              {!isLogin && !isResetForm && (
                <>
                  <InputField
                    icon={<User size={18} />}
                    placeholder={t.fullName}
                    autoComplete='name'
                    value={formData.name}
                    onChange={(event) => {
                      setFormData({ ...formData, name: event.target.value });
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    error={errors.name}
                    isRTL={isRTL}
                  />
                  <PhoneInputField
                    value={formData.phone}
                    autoComplete='tel-national'
                    onChange={(value) => {
                      setFormData({ ...formData, phone: normalizeKuwaitPhoneInput(value) });
                      if (errors.phone) {
                        setErrors({ ...errors, phone: '' });
                      }
                    }}
                    error={errors.phone}
                    lang={lang}
                    isRTL={isRTL}
                  />
                </>
              )}

              <InputField
                icon={<Mail size={18} />}
                placeholder={t.email}
                type='email'
                autoComplete='email'
                value={formData.email}
                onChange={(event) => {
                  setFormData({ ...formData, email: event.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                error={errors.email}
                isRTL={isRTL}
              />

              {!isResetRequest && (
                <PasswordField
                  placeholder={t.password}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword((value) => !value)}
                  value={formData.password}
                  onChange={(event) => {
                    setFormData({ ...formData, password: event.target.value });
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  error={errors.password}
                  isRTL={isRTL}
                />
              )}

              {(!isLogin || isResetForm) && !isResetRequest && (
                <PasswordField
                  placeholder={t.confirmPassword}
                  autoComplete='new-password'
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword((value) => !value)}
                  value={formData.confirmPassword}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      confirmPassword: event.target.value,
                    });
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  error={errors.confirmPassword}
                  isRTL={isRTL}
                />
              )}

              <button
                type='submit'
                disabled={loading}
                className='auth-submit-button lux-button-primary flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full py-3.5 font-bold whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
              >
                <span className='auth-submit-label inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold leading-none'>
                  {loading && <Loader2 className='shrink-0 animate-spin' size={18} />}
                  {submitLabel}
                </span>
              </button>
            </form>

            {!isResetForm && (
              <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                {isLogin ? t.newHere : t.haveAccount}
                <button
                  onClick={toggleMode}
                  className={`${isRTL ? 'mr-2' : 'ml-2'} font-bold text-brand-gold hover:underline transition-colors`}
                >
                  {isLogin ? t.btnRegister : t.btnSignIn}
                </button>
              </div>
            )}

            {isLogin && (
              <div className='text-center pt-2'>
                <button
                  onClick={goToReset}
                  className='text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors'
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ErrorText = ({ error, isRTL }) => (
  <div className='mt-2 min-h-[1.25rem]'>
    {error ? (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`text-red-500 text-xs ${isRTL ? 'pr-1 text-right' : 'pl-1 text-left'}`}
      >
        {error}
      </motion.p>
    ) : null}
  </div>
);

const PhoneInputField = ({ value, onChange, error, lang, isRTL, autoComplete }) => {
  const t = translations[lang];

  return (
    <div>
      <div className={getAuthFieldClass(error)}>
        <div
          className={`flex items-center gap-2 py-3.5 shrink-0 ${
            isRTL ? 'pl-4 pr-3 border-l' : 'pl-4 pr-3 border-r'
          } border-brand-gold/12 dark:border-white/10`}
        >
          <KuwaitFlagBadge className='h-4 w-6 rounded-[2px] object-cover shadow-sm' />
          <span className='text-sm font-semibold tracking-wide text-slate-700 dark:text-white/82'>
            {KUWAIT_DIAL_CODE}
          </span>
        </div>
        <input
          dir='ltr'
          inputMode='numeric'
          type='tel'
          autoComplete={autoComplete}
          placeholder={t.phonePlaceholder}
          value={value}
          onChange={(event) => onChange(normalizeKuwaitPhoneInput(event.target.value))}
          className={`auth-field-input w-full flex-1 bg-transparent py-3.5 tracking-[0.16em] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-white/34 ${
            isRTL ? 'pr-3 pl-4 text-right' : 'px-3 text-left'
          }`}
        />
      </div>
      <ErrorText error={error} isRTL={isRTL} />
    </div>
  );
};

const InputField = ({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  isRTL,
  autoComplete,
}) => (
  <div>
    <div className={getAuthFieldClass(error)}>
      <div
        className={`transition-colors ${error ? 'text-red-400' : 'text-brand-gold'} ${
          isRTL ? 'order-2 pr-5 pl-1' : 'pl-4'
        }`}
      >
        {icon}
      </div>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`auth-field-input w-full flex-1 bg-transparent py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-white/34 ${
          isRTL ? 'order-1 pr-4 pl-3 text-right' : 'px-3 text-left'
        }`}
      />
    </div>
    <ErrorText error={error} isRTL={isRTL} />
  </div>
);

const PasswordField = ({
  placeholder,
  showPassword,
  togglePassword,
  value,
  onChange,
  error,
  isRTL,
  autoComplete,
}) => (
  <div>
    <div className={getAuthFieldClass(error)}>
      <div
        className={`transition-colors ${error ? 'text-red-400' : 'text-brand-gold'} ${
          isRTL ? 'order-3 pr-5 pl-1' : 'pl-4'
        }`}
      >
        <Lock size={18} />
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`auth-field-input w-full flex-1 bg-transparent py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-white/34 ${
          isRTL ? 'order-2 pr-4 pl-3 text-right' : 'px-3 text-left'
        }`}
      />
      <button
        type='button'
        onClick={togglePassword}
        className={`text-slate-400 hover:text-brand-gold transition-colors ${
          isRTL ? 'order-1 pl-4 pr-2' : 'pr-4'
        }`}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    <ErrorText error={error} isRTL={isRTL} />
  </div>
);

export default AuthPage;
