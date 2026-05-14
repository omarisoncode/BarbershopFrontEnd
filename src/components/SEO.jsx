import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, lang = 'en', children }) {
  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      {children}
    </Helmet>
  );
}
