'use client';

import { Item } from '@/types/map';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/storage';
import { openTelegramLink } from '@/lib/telegram';
import { addRecent } from '@/lib/storage';
import { useState, useEffect } from 'react';
import TagPills from './TagPills';

interface ItemCardProps {
  item: Item;
  sectionTitle?: string;
  showSection?: boolean;
  onFavoriteChange?: () => void;
}

export default function ItemCard({ item, sectionTitle, showSection = false, onFavoriteChange }: ItemCardProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(item.id));
  }, [item.id]);

  const handleOpen = () => {
    addRecent(item.id);
    openTelegramLink(item.url);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(item.id);
      setIsFav(false);
    } else {
      addFavorite(item.id);
      setIsFav(true);
    }
    onFavoriteChange?.();
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    // Could add a toast notification here
    alert('Ссылка скопирована');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {item.pinned && (
              <span className="text-yellow-500" title="Закреплено">
                📌
              </span>
            )}
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
          </div>
          {showSection && sectionTitle && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
              {sectionTitle}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {item.description}
      </p>

      {item.tags.length > 0 && (
        <div className="mb-3">
          <TagPills tags={item.tags} />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleOpen}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          Открыть
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`px-4 py-2 rounded transition-colors ${
            isFav
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          title={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          ⭐
        </button>
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Скопировать ссылку"
        >
          🔗
        </button>
      </div>
    </div>
  );
}

