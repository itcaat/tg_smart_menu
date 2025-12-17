interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

export function initTelegramWebApp(): void {
  if (isTelegramWebApp()) {
    const webApp = window.Telegram!.WebApp;
    webApp.ready();
    webApp.expand();
  }
}

export function getTelegramColorScheme(): 'light' | 'dark' | null {
  if (isTelegramWebApp()) {
    return window.Telegram!.WebApp.colorScheme;
  }
  return null;
}

export function getTelegramThemeParams(): Record<string, string> | null {
  if (isTelegramWebApp()) {
    return window.Telegram!.WebApp.themeParams;
  }
  return null;
}

export function openTelegramLink(url: string): void {
  if (typeof window === 'undefined') return;
  
  // Try to open in new tab/window
  window.open(url, '_blank', 'noopener,noreferrer');
}

