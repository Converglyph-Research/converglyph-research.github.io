'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

export function ClientNavbarWrapper() {
  const [locale, setLocale] = React.useState<'en' | 'vi'>('en');

  return (
    <Navbar
      currentLocale={locale}
      onLocaleChange={setLocale}
      activeView="research"
      onViewChange={(v) => {
        if (v === 'consumer') window.location.href = '/';
      }}
      onOpenCalc={() => {
        window.location.href = '/explore';
      }}
    />
  );
}
