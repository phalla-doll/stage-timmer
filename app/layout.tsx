import type {Metadata} from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import ConvexClientProvider from './ConvexClientProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css'; // Global styles

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-mono', // Reusing the mono variable so existing classes work
});

export const metadata: Metadata = {
  title: 'Stage Timer',
  description: 'A high-contrast stage timer for operators to signal speakers.',
  keywords: 'stage timer, presentation timer, speaker timer, countdown, event timer, conference timer',
  authors: [{ name: 'Stage Timer' }],
  metadataBase: new URL('https://stage-timmer.vercel.app/'),
  openGraph: {
    title: 'Stage Timer',
    description: 'A high-contrast stage timer for operators to signal speakers.',
    url: 'https://stage-timmer.vercel.app/',
    siteName: 'Stage Timer',
    images: [{
      url: '/og-image-main.png',
      width: 1200,
      height: 630,
      alt: 'Stage Timer - Professional stage timer for speakers and presentations',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stage Timer',
    description: 'A high-contrast stage timer for operators to signal speakers.',
    images: ['/og-image-main.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-zinc-600 text-white px-4 py-2 rounded-lg z-50">
          Skip to main content
        </a>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
