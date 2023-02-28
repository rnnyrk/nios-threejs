import './global.css';
import type * as i from 'types';
import clsx from 'clsx';

import { Inter } from '@next/font/google';

import { RootLayout } from 'modules/layouts/RootLayout';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Nios',
    template: '%s | Nios',
  },
  description: 'Photographer hitchhiking the world',
  openGraph: {
    title: 'Nios',
    description: 'Photographer hitchhiking the world',
    url: 'https://nios.life',
    siteName: 'Nios',
    images: [
      {
        url: 'https://nios.life/og.jpg',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Nios',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/images/favicon/favicon.ico',
  },
};

const Layout = ({ children }: Props) => {
  return (
    <html
      lang="en"
      className={clsx('text-black bg-white dark:text-white dark:bg-[#111111]', inter.className)}
    >
      <head />
      <RootLayout>{children}</RootLayout>
    </html>
  );
};

type Props = i.NextPageProps<{
  children: React.ReactNode;
}>;

export default Layout;
