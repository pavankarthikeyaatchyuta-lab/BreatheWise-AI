import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BreatheWise AI — Urban Air Quality & Sustainable Living Assistant',
  description:
    'An intelligent, family-first urban air quality decision platform helping families navigate severe winter smog with CPCB 8-pollutant NAQI, smart daily routine planning, dynamic indoor coaching, sustainable alternatives, and explainable impact intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#f5f8f6] text-slate-900 antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
