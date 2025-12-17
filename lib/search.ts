import { Item } from '@/types/map';

export interface SearchResult extends Item {
  sectionTitle?: string;
  matchScore: number;
}

export function searchItems(items: Item[], query: string, sectionMap?: Map<string, string>): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const item of items) {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descriptionLower = item.description.toLowerCase();
    const tagsLower = item.tags.join(' ').toLowerCase();

    // Exact title match - highest score
    if (titleLower === normalizedQuery) {
      score += 100;
    } else if (titleLower.includes(normalizedQuery)) {
      score += 50;
    }

    // Description match
    if (descriptionLower.includes(normalizedQuery)) {
      score += 20;
    }

    // Tags match
    if (tagsLower.includes(normalizedQuery)) {
      score += 30;
    }

    // Word boundary matches get bonus
    const wordRegex = new RegExp(`\\b${normalizedQuery}`, 'i');
    if (wordRegex.test(item.title)) {
      score += 25;
    }

    if (score > 0) {
      results.push({
        ...item,
        sectionTitle: sectionMap?.get(item.sectionId),
        matchScore: score,
      });
    }
  }

  // Sort by score (descending)
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}

