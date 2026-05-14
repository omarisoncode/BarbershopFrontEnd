import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { businessInfo, getBusinessValue } from '../config/businessInfo';
import { translations } from '../utils/i18n';
import { localizeDigits } from '../utils/localizeDigits';
import { repairArabicObject } from '../utils/repairArabicText';
import { ScissorsIcon } from './Icons';
import { HOME_SECTION_IDS } from './home/homeContent';

const footerSectionLinks = (t) => [
  { to: `/#${HOME_SECTION_IDS.hero}`, label: t.navHome },
  { to: `/#${HOME_SECTION_IDS.services}`, label: t.navServices },
  { to: `/#${HOME_SECTION_IDS.barbers}`, label: t.navBarbers },
  { to: `/#${HOME_SECTION_IDS.gallery}`, label: t.navGallery },
  { to: `/#${HOME_SECTION_IDS.about}`, label: t.navAbout },
  { to: `/#${HOME_SECTION_IDS.location}`, label: t.navLocation },
  { to: `/#${HOME_SECTION_IDS.faq}`, label: t.navFAQ },
  { to: `/#${HOME_SECTION_IDS.contact}`, label: t.navContact },
];

const footerServiceLinks = (t) => [
  t.footerServiceLink1,
  t.footerServiceLink2,
  t.footerServiceLink3,
  t.footerServiceLink4,
];

const footerSupportLinks = (t) => [
  t.footerSupportLink1,
  t.footerSupportLink2,
  t.footerSupportLink3,
];

const FooterAction = ({ href, icon, label, value }) => {
  const IconComponent = icon;

  return (
    <a
      href={href}
      className='inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/60 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/5 dark:text-white/80'
    >
      <IconComponent size={16} />
      <span>{label}</span>
      {value ? <ArrowUpRight size={14} className='text-brand-gold' /> : null}
    </a>
  );
};

export default function Footer({ lang }) {
  const { user } = useContext(AuthContext);
  const t = useMemo(() => repairArabicObject(translations[lang] || translations.en), [lang]);
  const [logoPrimary, logoAccent] = String(t.logo || 'THE CUT').split(' ');

  const quickLinks = footerSectionLinks(t);
  const services = footerServiceLinks(t);
  const supportLinks = footerSupportLinks(t);
  const locationAddress = getBusinessValue(businessInfo.address, lang) || t.locationAddress;
  const locationHours = getBusinessValue(businessInfo.hours, lang) || t.locationHours;
  const locationEmail = getBusinessValue(businessInfo.email, lang) || t.locationEmail;
  const locationEmailHref = businessInfo.emailHref || t.locationEmailHref;
  const locationPhoneHref = businessInfo.phoneHref || t.locationPhoneHref;
  const locationWhatsappHref = businessInfo.whatsappHref || t.locationWhatsappHref;
  const displayPhone = localizeDigits(
    getBusinessValue(businessInfo.phoneDisplay, lang) || t.locationPhone,
    lang,
  );
  const dashboardLink =
    user?.role === 'admin'
      ? { to: '/admin', label: t.navAdmin }
      : user
        ? { to: '/dashboard', label: t.navDashboard }
        : { to: '/login', label: t.navLogin };

  return (
    <footer className='relative overflow-hidden border-t border-black/8 bg-[#f2ecdf] pb-10 pt-18 text-slate-900 dark:border-white/10 dark:bg-[#070605] dark:text-white'>
      <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent' />
      <div className='absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl' />
      <div className='absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-gold/8 blur-3xl' />

      <div className='lux-section-shell relative z-10'>
        <div className='lux-panel mb-10 overflow-hidden p-6 sm:p-8'>
          <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center'>
            <div>
              <p className='lux-kicker'>{t.footerTagline}</p>
              <h3 className='mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl'>
                {t.footerCTA}
              </h3>
              <p className='lux-copy mt-4 max-w-2xl'>{t.footerCTASub}</p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row xl:justify-end'>
              <Link
                to='/booking'
                className='lux-button-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold'
              >
                {t.footerBookBtn}
              </Link>
              <Link
                to={dashboardLink.to}
                className='lux-button-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold'
              >
                {dashboardLink.label}
              </Link>
            </div>
          </div>
        </div>

        <div className='grid gap-10 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]'>
          <div>
            <Link to='/' className='flex items-center gap-3'>
              <div className='text-brand-gold'>
                <ScissorsIcon />
              </div>
              <span className='font-display text-[1.9rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
                {logoPrimary} <span className='text-brand-gold'>{logoAccent}</span>
              </span>
            </Link>

            <p className='lux-copy mt-5 max-w-sm'>{t.footerBrandStatement}</p>

            <div className='mt-6 flex flex-wrap gap-3'>
              <FooterAction href={locationPhoneHref} icon={Phone} label={t.homeLocationCallCta} value />
              <FooterAction
                href={locationWhatsappHref}
                icon={MessageCircle}
                label={t.homeLocationWhatsappCta}
                value
              />
              <FooterAction href={locationEmailHref} icon={Mail} label={t.locationEmailTitle} value />
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold'>
              {t.footerQuickLinksTitle}
            </p>
            <div className='mt-5 grid gap-3'>
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className='text-sm text-slate-600 transition hover:text-brand-gold dark:text-white/70 dark:hover:text-brand-gold'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold'>
              {t.footerServicesTitle}
            </p>
            <div className='mt-5 grid gap-3'>
              {services.map((label) => (
                <Link
                  key={label}
                  to={`/#${HOME_SECTION_IDS.services}`}
                  className='text-sm text-slate-600 transition hover:text-brand-gold dark:text-white/70 dark:hover:text-brand-gold'
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold'>
              {t.footerSupportTitle}
            </p>
            <div className='mt-5 grid gap-3'>
              {supportLinks.map((label) => (
                <Link
                  key={label}
                  to={`/#${HOME_SECTION_IDS.faq}`}
                  className='text-sm text-slate-600 transition hover:text-brand-gold dark:text-white/70 dark:hover:text-brand-gold'
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold'>
              {t.footerContact}
            </p>
            <div className='mt-5 space-y-4 text-sm text-slate-600 dark:text-white/70'>
              <div className='flex items-start gap-3'>
                <MapPin size={16} className='mt-1 shrink-0 text-brand-gold' />
                <span>{locationAddress}</span>
              </div>
              <div className='flex items-start gap-3'>
                <Clock3 size={16} className='mt-1 shrink-0 text-brand-gold' />
                <span>{locationHours}</span>
              </div>
              <div className='flex items-start gap-3'>
                <Mail size={16} className='mt-1 shrink-0 text-brand-gold' />
                <a href={locationEmailHref} className='transition hover:text-brand-gold'>
                  {locationEmail}
                </a>
              </div>
              <div className='flex items-start gap-3'>
                <Phone size={16} className='mt-1 shrink-0 text-brand-gold' />
                <a href={locationPhoneHref} className='transition hover:text-brand-gold'>
                  {displayPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-10 flex flex-col gap-3 border-t border-black/8 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-white/50 sm:flex-row sm:items-center sm:justify-between'>
          <p>{t.footerCopyright}</p>
          <p>{t.footerMadeWith}</p>
        </div>
      </div>
    </footer>
  );
}
