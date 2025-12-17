'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import SearchBar from '@/components/SearchBar';
import { getSection, getItemsBySectionId } from '@/lib/data';
import { searchItems } from '@/lib/search';

interface SectionPageClientProps {
  sectionId: string;
}

export default function SectionPageClient({ sectionId }: SectionPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const section = useMemo(() => getSection(sectionId), [sectionId]);
  const items = useMemo(() => getItemsBySectionId(sectionId), [sectionId]);
  
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return searchItems(items, searchQuery);
  }, [items, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (!section) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Назад
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Раздел не найден
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
      >
        <span>←</span>
        <span>Назад</span>
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {section.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {section.description}
        </p>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder={`Поиск в разделе "${section.title}"...`}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Материалы {searchQuery.trim() ? `(${filteredItems.length})` : `(${items.length})`}
        </h2>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery.trim() ? 'Ничего не найдено' : 'Материалы отсутствуют'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

