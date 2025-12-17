'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabsNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Разделы', icon: '📂' },
    { href: '/favorites', label: 'Избранное', icon: '⭐' },
    { href: '/recent', label: 'Недавние', icon: '🕐' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(tab.href)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

