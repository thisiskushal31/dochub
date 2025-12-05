import React from 'react';
import { repositories, type RepositoryConfig } from '@/config/repositories';
import { ChevronDown, Check, Book } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface RepositorySelectorProps {
  selectedRepo: RepositoryConfig;
  onSelectRepo: (repo: RepositoryConfig) => void;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  selectedRepo,
  onSelectRepo,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between h-auto py-2 px-3 group hover:bg-muted/50 hover:text-foreground">
          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0">
              {selectedRepo.icon ? (
                <i className={`${selectedRepo.icon} text-sm text-primary`}></i>
              ) : (
                <Book className="h-4 w-4" />
              )}
            </div>
            <div className="text-left min-w-0 flex-1 overflow-hidden">
              <div className="font-medium text-sm break-words line-clamp-2">{selectedRepo.name}</div>
              <div className="text-xs text-muted-foreground break-words line-clamp-1">{selectedRepo.description}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        {repositories.map((repo) => (
          <DropdownMenuItem
            key={repo.id}
            onClick={() => onSelectRepo(repo)}
            className="flex items-center gap-3 py-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              {repo.icon ? (
                <i className={`${repo.icon} text-sm text-primary`}></i>
              ) : (
                <Book className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{repo.name}</div>
              <div className="text-xs text-muted-foreground">{repo.description}</div>
            </div>
            {selectedRepo.id === repo.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepositorySelector;
