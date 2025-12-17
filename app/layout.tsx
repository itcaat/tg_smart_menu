import type { Metadata, Viewport } from 'next';
import './globals.css';
import TabsNav from '@/components/TabsNav';
import TelegramProvider from './TelegramProvider';

export const metadata: Metadata = {
  title: 'Карта канала',
  description: 'Удобная навигация по материалам канала',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#2481cc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        />
      </head>
      <body>
        <TelegramProvider>
          <main className="min-h-screen pb-20">
            {children}
          </main>
          <TabsNav />
        </TelegramProvider>
      </body>
    </html>
  );
}

