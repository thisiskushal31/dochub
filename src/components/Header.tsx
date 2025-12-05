import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { SITE_CONFIG, FEATURES_CONFIG } from '@/config/config';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:hidden" />
        
        <Link to="/" className="hidden lg:flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Book className="h-5 w-5 text-primary" />
          <span className="font-semibold">{SITE_CONFIG.name}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
