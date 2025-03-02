import './globals.css';
import { Inter } from 'next/font/google';
import defaultMetadata from './metadata';
import type { Viewport } from 'next';
import { Navbar } from '@/components/ui/Navbar';
import { SchedulerInitializer } from '@/components/ui/SchedulerInitializer';
import { Footer } from '@/components/ui/Footer';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  ...defaultMetadata,
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.png', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.png' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Modern Art News',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Unjica - Art News & AI Digest</title>
        <meta name="description" content="Discover modern art news and AI-generated digest articles." />
        <link rel="canonical" href="https://unjica.com" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Modern Art News',
              description: 'Your curated source for contemporary art insights',
              url: 'https://unjica.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://unjica.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>

      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-gray-900`}>
        <SessionProvider>
          <SchedulerInitializer />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
