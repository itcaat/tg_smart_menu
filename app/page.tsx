'use client';

import { useState, useCallback, useMemo } from 'react';
import SectionCard from '@/components/SectionCard';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';
import { getSectionsWithCount, getAllItems, getSections } from '@/lib/data';
import { searchItems } from '@/lib/search';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const sections = useMemo(() => getSectionsWithCount(), []);
  const allItems = useMemo(() => getAllItems(), []);
  
  const sectionMap = useMemo(() => {
    const allSections = getSections();
    return new Map(allSections.map(s => [s.id, s.title]));
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchItems(allItems, searchQuery, sectionMap);
  }, [searchQuery, allItems, sectionMap]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Карта канала
        </h1>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Поиск по материалам..."
        />
      </div>

      {searchQuery.trim() ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Результаты поиска ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Ничего не найдено
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  sectionTitle={item.sectionTitle}
                  showSection={true}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Разделы
          </h2>
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Нет доступных разделов
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

