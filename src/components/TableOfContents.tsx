import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className }) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*|`/g, ''); // Remove bold and code formatting
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      headings.push({ id, text, level });
    }

    setItems(headings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace('user-content-', ''));
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(`user-content-${item.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(`user-content-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={cn("space-y-1", className)}>
      <h4 className="font-semibold text-sm mb-3">On this page</h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                "text-sm w-full text-left py-1 transition-colors hover:text-foreground",
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground",
                item.level === 1 && "font-medium",
                item.level === 2 && "pl-2",
                item.level === 3 && "pl-4",
                item.level >= 4 && "pl-6"
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
