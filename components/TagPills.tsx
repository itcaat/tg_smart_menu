interface TagPillsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function TagPills({ tags, onTagClick }: TagPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded ${
            onTagClick ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600' : ''
          }`}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

