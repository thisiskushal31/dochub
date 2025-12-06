import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { repositories, type RepositoryConfig } from '@/config/repositories';
import { FEATURES_CONFIG } from '@/config/config';
import { fetchFileTree, isMarkdownFile, getFileDisplayName, type GitHubFile } from '@/utils/github';

interface SearchResult {
  repo: RepositoryConfig;
  file: GitHubFile;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResult: (repoId: string, filePath: string) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  open,
  onOpenChange,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allFiles, setAllFiles] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllFiles = useCallback(async () => {
    setIsLoading(true);
    const files: SearchResult[] = [];

    for (const repo of repositories) {
      try {
        const repoFiles = await fetchFileTree(repo.id);
        const flatFiles = await flattenFiles(repoFiles, repo);
        files.push(...flatFiles);
      } catch (err) {
        console.error(`Failed to load files from ${repo.name}:`, err);
      }
    }

    setAllFiles(files);
    setIsLoading(false);
  }, []);

  // Recursively flatten all files from directories
  const flattenFiles = async (files: GitHubFile[], repo: RepositoryConfig): Promise<SearchResult[]> => {
    const result: SearchResult[] = [];
    
    for (const file of files) {
      if (file.type === 'dir') {
        // Recursively fetch files from subdirectories
        try {
          const subFiles = await fetchFileTree(repo.id, file.path);
          const subResults = await flattenFiles(subFiles, repo);
          result.push(...subResults);
        } catch (err) {
          console.error(`Failed to load files from ${file.path}:`, err);
        }
      } else if (isMarkdownFile(file.name)) {
        result.push({ repo, file });
      }
    }
    
    return result;
  };

  useEffect(() => {
    if (open && allFiles.length === 0 && !isLoading) {
      loadAllFiles();
    }
  }, [open, allFiles.length, isLoading, loadAllFiles]);

  useEffect(() => {
    if (allFiles.length === 0) {
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults(allFiles.slice(0, 10));
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const filtered = allFiles.filter(
      (item) => {
        const fileName = getFileDisplayName(item.file.name).toLowerCase();
        const filePath = item.file.path.toLowerCase();
        const repoName = item.repo.name.toLowerCase();
        const rawFileName = item.file.name.toLowerCase();
        
        return fileName.includes(lowerQuery) ||
               filePath.includes(lowerQuery) ||
               repoName.includes(lowerQuery) ||
               rawFileName.includes(lowerQuery);
      }
    );

    setResults(filtered.slice(0, 20)); // Increased from 10 to 20
  }, [query, allFiles]);

  const handleSelect = (result: SearchResult) => {
    onSelectResult(result.repo.id, result.file.path);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="sr-only">
            Search Documentation
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search through all documentation files across topics
          </DialogDescription>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder={FEATURES_CONFIG.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-base placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading files...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={`${result.repo.id}-${result.file.path}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {getFileDisplayName(result.file.name)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {result.repo.icon ? (
                        <i className={`${result.repo.icon} text-xs`}></i>
                      ) : null}
                      <span>{result.repo.name} / {result.file.path}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {query ? 'No results found' : 'Start typing to search...'}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Cmd+K</kbd> to open search
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
