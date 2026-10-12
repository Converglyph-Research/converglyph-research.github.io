'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLocale } from '@/lib/LocaleContext';

export function ClientNavbarWrapper() {
  const { locale, setLocale } = useLocale();

  return (
    <Navbar
      currentLocale={locale}
      onLocaleChange={setLocale}
      onOpenCalc={() => {
        window.location.href = '/explore';
      }}
    />
  );
}
