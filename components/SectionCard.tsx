import Link from 'next/link';
import { SectionWithCount } from '@/types/map';

interface SectionCardProps {
  section: SectionWithCount;
}

export default function SectionCard({ section }: SectionCardProps) {
  return (
    <Link
      href={`/section/${section.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {section.title}
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
          {section.itemCount}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {section.description}
      </p>
    </Link>
  );
}

