import mapData from '@/data/map.json';
import { MapData, Section, Item, SectionWithCount } from '@/types/map';

export function getMapData(): MapData {
  return mapData as MapData;
}

export function getSections(): Section[] {
  const data = getMapData();
  return [...data.sections].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getSectionsWithCount(): SectionWithCount[] {
  const data = getMapData();
  const sections = getSections();
  
  const itemCounts = data.items.reduce((acc, item) => {
    acc[item.sectionId] = (acc[item.sectionId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return sections.map(section => ({
    ...section,
    itemCount: itemCounts[section.id] || 0,
  }));
}

export function getSection(id: string): Section | undefined {
  const data = getMapData();
  return data.sections.find(s => s.id === id);
}

export function getItemsBySectionId(sectionId: string): Item[] {
  const data = getMapData();
  const items = data.items.filter(item => item.sectionId === sectionId);
  
  // Сортировка: сначала pinned, затем по title
  return items.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function getItemById(id: string): Item | undefined {
  const data = getMapData();
  return data.items.find(item => item.id === id);
}

export function getItemsByIds(ids: string[]): Item[] {
  const data = getMapData();
  return ids
    .map(id => data.items.find(item => item.id === id))
    .filter((item): item is Item => item !== undefined);
}

export function getAllItems(): Item[] {
  const data = getMapData();
  return data.items;
}

