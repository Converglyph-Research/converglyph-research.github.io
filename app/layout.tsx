import type { Metadata } from 'next';
import '@/styles/globals.css';
import { LocaleProvider } from '@/lib/LocaleContext';

export const metadata: Metadata = {
  title: 'Converglyph Research — Multi-System Symbolic Intelligence',
  description: 'Translating fragmented symbolic traditions into structured, traceable claims and prospective evaluation protocols.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Google Identity Services SDK */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>
        <canvas id="space-canvas" aria-hidden="true" />
        <div className="app-wrapper">
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
