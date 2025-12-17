'use client';

import { useState, useEffect, useMemo } from 'react';
import ItemCard from '@/components/ItemCard';
import { getRecent, clearRecent } from '@/lib/storage';
import { getItemsByIds, getSections } from '@/lib/data';

export default function RecentPage() {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadRecent();
  }, []);

  const loadRecent = () => {
    const ids = getRecent();
    setRecentIds(ids);
  };

  const handleClearRecent = () => {
    if (confirm('Очистить историю просмотров?')) {
      clearRecent();
      loadRecent();
    }
  };

  const items = useMemo(() => {
    if (!mounted) return [];
    return getItemsByIds(recentIds);
  }, [recentIds, mounted]);

  const sectionMap = useMemo(() => {
    const sections = getSections();
    return new Map(sections.map(s => [s.id, s.title]));
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Недавние
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Недавние
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length === 0 ? 'История пуста' : `Просмотрено: ${items.length}`}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearRecent}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Очистить
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🕐</div>
          <p className="text-gray-500 dark:text-gray-400">
            История просмотров пуста
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Открытые материалы будут отображаться здесь
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item}
              sectionTitle={sectionMap.get(item.sectionId)}
              showSection={true}
              onFavoriteChange={loadRecent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

