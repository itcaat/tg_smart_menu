'use client';

import { useEffect } from 'react';
import { initTelegramWebApp } from '@/lib/telegram';

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return <>{children}</>;
}

