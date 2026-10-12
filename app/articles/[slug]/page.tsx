import React from 'react';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { ArticleContentClient } from '@/components/articles/ArticleContentClient';

export function generateStaticParams() {
  return [
    { slug: 'western-astrodienst-ephemeris' },
    { slug: 'bazi-four-pillars-lst' },
    { slug: 'tu-vi-dau-so-classical-matrix' },
    { slug: 'pythagorean-numerology-reductions' },
    { slug: 'iching-divination-archetypes' },
    { slug: 'prospective-prediction-ledger-brier' }
  ];
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />
      <main className="section">
        <ArticleContentClient slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
