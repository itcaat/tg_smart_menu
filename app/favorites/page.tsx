'use client';

import { useState, useEffect, useMemo } from 'react';
import ItemCard from '@/components/ItemCard';
import { getFavorites } from '@/lib/storage';
import { getItemsByIds, getSections } from '@/lib/data';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const ids = getFavorites();
    setFavoriteIds(ids);
  };

  const items = useMemo(() => {
    if (!mounted) return [];
    return getItemsByIds(favoriteIds);
  }, [favoriteIds, mounted]);

  const sectionMap = useMemo(() => {
    const sections = getSections();
    return new Map(sections.map(s => [s.id, s.title]));
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Избранное
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Избранное
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {items.length === 0 ? 'Пока пусто' : `Сохранено материалов: ${items.length}`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-gray-500 dark:text-gray-400">
            Здесь будут ваши избранные материалы
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Добавьте материалы в избранное, нажав ⭐ на карточке
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
              onFavoriteChange={loadFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}

