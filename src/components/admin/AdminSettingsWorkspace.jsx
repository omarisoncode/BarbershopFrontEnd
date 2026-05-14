import React from 'react';
import { Camera, Loader2, Moon, SunMedium } from 'lucide-react';

import KuwaitFlagBadge from '../KuwaitFlagBadge';
import { KUWAIT_DIAL_CODE } from '../../utils/kuwaitPhone';
import {
  dashboardActionButtonClass,
  dashboardInsetPanelClass,
  dashboardPrimaryButtonClass,
  dashboardSubtleButtonClass,
} from '../dashboard/dashboardTheme';
import { SectionShell, mutedPanel } from './AdminDashboardSections';

const toggleButtonClass = (active) =>
  `rounded-2xl border px-4 py-3 text-sm font-black transition ${
    active
      ? `${dashboardPrimaryButtonClass} border-brand-gold`
      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
  }`;

export default function AdminSettingsWorkspace({
  adminProfileFileInputRef,
  adminProfileImage,
  adminProfileImageProcessing,
  adminProfileName,
  adminProfilePhone,
  adminProfileSaving,
  darkMode,
  handleAdminProfilePhotoSelect,
  handleAdminProfileSave,
  hasAdminProfileChanges,
  isAdminProfilePhoneValid,
  lang,
  onAdminProfileNameChange,
  onAdminProfilePhoneChange,
  removeAdminProfilePhoto,
  setLang,
  setDarkMode,
  t,
  triggerAdminPhotoPicker,
  user,
}) {
  return (
    <SectionShell
      title={t.settingsWorkspaceTitle}
      subtitle={t.settingsWorkspaceBody}
      compact={true}
    >
      <div className='grid gap-4 xl:grid-cols-2'>
        <div className={`rounded-[1.1rem] p-4 ${mutedPanel}`}>
          <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
            {t.profileSettings || 'Profile settings'}
          </p>
          <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>
            {t.profileSettingsBody || 'Update your name and mobile number directly from the admin shell.'}
          </p>

          <div className='mt-4 grid gap-4'>
            <input
              ref={adminProfileFileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              capture='environment'
              className='hidden'
              onChange={handleAdminProfilePhotoSelect}
            />

            <div className={`rounded-2xl p-4 ${dashboardInsetPanelClass}`}>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-4'>
                  {adminProfileImage ? (
                    <img
                      src={adminProfileImage}
                      alt={adminProfileName || user?.name || 'Admin'}
                      className='h-16 w-16 rounded-2xl border border-slate-200 object-cover dark:border-slate-700'
                    />
                  ) : (
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'>
                      <Camera size={20} />
                    </div>
                  )}
                  <div>
                    <p className='text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
                      {t.profilePhotoLabel || (lang === 'ar' ? 'صورة الملف الشخصي' : 'Profile photo')}
                    </p>
                    <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300'>
                      {t.profilePhotoBody ||
                        (lang === 'ar'
                          ? 'ارفع صورة شخصية واضحة لتظهر في الشريط الجانبي ولوحة الإدارة.'
                          : 'Upload a clear square profile image for the sidebar and admin shell.')}
                    </p>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    onClick={triggerAdminPhotoPicker}
                    disabled={adminProfileImageProcessing}
                    className={`${dashboardActionButtonClass} ${dashboardSubtleButtonClass} min-h-11 rounded-[0.9rem] px-4 py-2.5`}
                  >
                    {adminProfileImageProcessing ? (
                      <Loader2 size={15} className='animate-spin' />
                    ) : (
                      <Camera size={15} />
                    )}
                    {adminProfileImageProcessing
                      ? t.preparing || (lang === 'ar' ? 'جار تجهيز الصورة...' : 'Preparing...')
                      : t.changePhoto || (lang === 'ar' ? 'تغيير الصورة' : 'Change photo')}
                  </button>

                  {adminProfileImage ? (
                    <button
                      type='button'
                      onClick={removeAdminProfilePhoto}
                      disabled={adminProfileImageProcessing}
                      className='inline-flex min-h-11 items-center justify-center rounded-[0.9rem] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-300'
                    >
                      {t.removePhoto}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
                {t.profileNameLabel || 'Display name'}
              </label>
              <input
                type='text'
                value={adminProfileName}
                onChange={(event) => onAdminProfileNameChange(event.target.value)}
                className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600'
              />
            </div>

            <div>
              <label className='mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300'>
                {t.profilePhoneLabel || 'Mobile number'}
              </label>
              <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-2'>
                <div className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold text-slate-600 dark:text-slate-300 ${dashboardInsetPanelClass}`}>
                  <KuwaitFlagBadge className='h-4 w-6 rounded-xs object-cover shadow-sm' />
                  <span>{KUWAIT_DIAL_CODE}</span>
                </div>
                <input
                  dir='ltr'
                  type='tel'
                  value={adminProfilePhone}
                  onChange={(event) => onAdminProfilePhoneChange(event.target.value)}
                  placeholder={t.phonePlaceholder || '4XXXXXXX'}
                  inputMode='numeric'
                  autoComplete='tel-national'
                  className={`min-h-12 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition dark:bg-slate-950 dark:text-white ${
                    isAdminProfilePhoneValid
                      ? 'border-slate-200 focus:border-slate-400 dark:border-slate-800 dark:focus:border-slate-600'
                      : 'border-red-300 focus:border-red-400 dark:border-red-500/70 dark:focus:border-red-400'
                  }`}
                />
              </div>
              <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-slate-300'>
                {t.profilePhoneHelp || 'Used for booking notifications and account contact.'}
              </p>
              {!isAdminProfilePhoneValid ? (
                <p className='mt-1 text-xs font-semibold text-red-500 dark:text-red-300'>
                  {t.profilePhoneInvalid || 'Enter a valid 8-digit Kuwaiti phone number.'}
                </p>
              ) : null}
            </div>

            <div className='flex justify-end'>
              <button
                type='button'
                onClick={handleAdminProfileSave}
                disabled={!hasAdminProfileChanges || !isAdminProfilePhoneValid || adminProfileSaving}
                className={`${dashboardActionButtonClass} ${dashboardPrimaryButtonClass} min-h-12 rounded-2xl px-4 py-3`}
              >
                {adminProfileSaving ? <Loader2 size={16} className='animate-spin' /> : null}
                {adminProfileSaving ? (lang === 'ar' ? 'جار الحفظ...' : 'Saving...') : t.saveChanges}
              </button>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <div className={`rounded-[1.1rem] p-4 ${mutedPanel}`}>
            <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
              {t.themeSettings}
            </p>
            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              <button
                type='button'
                onClick={() => setDarkMode(false)}
                className={toggleButtonClass(!darkMode)}
              >
                <span className='inline-flex items-center gap-2'>
                  <SunMedium size={16} />
                  {t.themeLight}
                </span>
              </button>
              <button
                type='button'
                onClick={() => setDarkMode(true)}
                className={toggleButtonClass(darkMode)}
              >
                <span className='inline-flex items-center gap-2'>
                  <Moon size={16} />
                  {t.themeDark}
                </span>
              </button>
            </div>
          </div>

          <div className={`rounded-[1.1rem] p-4 ${mutedPanel}`}>
            <p className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
              {t.languageSettings}
            </p>
            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              <button
                type='button'
                onClick={() => setLang?.('en')}
                className={toggleButtonClass(lang === 'en')}
              >
                {t.languageEnglish}
              </button>
              <button
                type='button'
                onClick={() => setLang?.('ar')}
                className={toggleButtonClass(lang === 'ar')}
              >
                {t.languageArabic}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
