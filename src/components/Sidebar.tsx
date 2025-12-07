import React from 'react';
import { Menu, Github, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import RepositorySelector from './RepositorySelector';
import FileTree from './FileTree';
import { type RepositoryConfig, getGitHubRepoUrl } from '@/config/repositories';

interface SidebarProps {
  selectedRepo: RepositoryConfig;
  onSelectRepo: (repo: RepositoryConfig) => void;
  onSelectFile: (path: string) => void;
  selectedPath?: string;
  onOpenSearch: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({
  selectedRepo,
  onSelectRepo,
  onSelectFile,
  selectedPath,
  onOpenSearch,
}) => {
  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-3 border-b border-sidebar-border lg:pr-3 pr-12">
        <RepositorySelector
          selectedRepo={selectedRepo}
          onSelectRepo={onSelectRepo}
        />
      </div>

      <div className="p-3 border-b border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border"
          onClick={onOpenSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">Search docs...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <FileTree
          repoId={selectedRepo.id}
          onSelectFile={onSelectFile}
          selectedPath={selectedPath}
        />
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <a
          href={getGitHubRepoUrl(selectedRepo)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-2 py-1.5 transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 [&>button]:z-10">
          <div className="pt-12">
          <SidebarContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
