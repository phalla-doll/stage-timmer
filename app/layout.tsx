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
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
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
