import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Loader2, RefreshCw } from 'lucide-react';
import { fetchFileTree, isMarkdownFile, getFileDisplayName, type GitHubFile } from '@/utils/github';
import { getCached, clearCache } from '@/utils/cache';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileTreeProps {
  repoId: string;
  onSelectFile: (path: string) => void;
  selectedPath?: string;
}

interface TreeNode extends GitHubFile {
  children?: TreeNode[];
  isLoading?: boolean;
  isExpanded?: boolean;
}

const FileTreeItem: React.FC<{
  node: TreeNode;
  level: number;
  repoId: string;
  onSelectFile: (path: string) => void;
  selectedPath?: string;
  onToggle: (path: string, expanded: boolean) => void;
  onLoadChildren: (path: string) => void;
}> = ({ node, level, repoId, onSelectFile, selectedPath, onToggle, onLoadChildren }) => {
  const isDirectory = node.type === 'dir';
  const isMarkdown = isMarkdownFile(node.name);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (isDirectory) {
      if (!node.children && !node.isLoading) {
        onLoadChildren(node.path);
      }
      onToggle(node.path, !node.isExpanded);
    } else if (isMarkdown) {
      onSelectFile(node.path);
    }
  };

  if (!isDirectory && !isMarkdown) return null;

  const displayName = isDirectory ? node.name : getFileDisplayName(node.name);
  const fullName = isDirectory ? node.name : node.name;

  const buttonContent = (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-2 py-1.5 px-2 text-sm rounded-md transition-colors text-left",
        "hover:bg-muted/50 hover:text-foreground",
        isSelected && "bg-muted text-foreground font-medium",
        "min-w-0 group" // Allow flex item to shrink, group for hover
      )}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
    >
      <div className="flex-shrink-0 flex items-start pt-0.5">
        {isDirectory ? (
          <>
            {node.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : node.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {node.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary ml-1" />
            ) : (
              <Folder className="h-4 w-4 text-primary ml-1" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileText className="h-4 w-4 text-muted-foreground ml-1" />
          </>
        )}
      </div>
      <span className="break-words min-w-0 flex-1 text-left leading-relaxed">
        {displayName}
      </span>
    </button>
  );

  return (
    <div>
      {buttonContent}

      {isDirectory && node.isExpanded && node.children && (
        <div>
          {node.children
            .filter(child => child.type === 'dir' || isMarkdownFile(child.name))
            .sort((a, b) => {
              if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map(child => (
              <FileTreeItem
                key={child.path}
                node={child}
                level={level + 1}
                repoId={repoId}
                onSelectFile={onSelectFile}
                selectedPath={selectedPath}
                onToggle={onToggle}
                onLoadChildren={onLoadChildren}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ repoId, onSelectFile, selectedPath }) => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all parent directory paths from a file path
  const getParentPaths = (filePath: string): string[] => {
    const parts = filePath.split('/').filter(Boolean);
    const parents: string[] = [];
    for (let i = 1; i < parts.length; i++) {
      parents.push(parts.slice(0, i).join('/'));
    }
    return parents;
  };

  useEffect(() => {
    const loadTree = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if we're in dev mode and using API
        const isDev = import.meta.env.DEV;
        if (isDev) {
          // Check if local files exist
          try {
            const localTreePath = `/dochub/repos/${repoId}/tree.json`;
            const localResponse = await fetch(localTreePath);
            if (!localResponse.ok) {
              console.log(`[DEV] Local files not found, fetching from GitHub API for ${repoId}`);
            }
          } catch {
            console.log(`[DEV] Local files not found, fetching from GitHub API for ${repoId}`);
          }
        }
        
        const files = await fetchFileTree(repoId);
        setTree(files.map(f => ({ ...f, isExpanded: false })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load files');
      } finally {
        setIsLoading(false);
      }
    };

    loadTree();
  }, [repoId]);

  // Helper to find a node in the tree by path
  const findNode = (nodes: TreeNode[], targetPath: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.path === targetPath) return node;
      if (node.children) {
        const found = findNode(node.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const handleLoadChildren = async (path: string) => {
    setTree(prev => updateNodeInTree(prev, path, { isLoading: true }));
    try {
      const children = await fetchFileTree(repoId, path);
      setTree(prev => updateNodeInTree(prev, path, { 
        children: children.map(c => ({ ...c, isExpanded: false })), 
        isLoading: false,
        isExpanded: true 
      }));
      return children;
    } catch (err) {
      setTree(prev => updateNodeInTree(prev, path, { isLoading: false }));
      throw err;
    }
  };

  // Recursively ensure a directory path is loaded and expanded
  const ensurePathLoaded = async (targetPath: string): Promise<void> => {
    return new Promise((resolve) => {
      setTree(prev => {
        const node = findNode(prev, targetPath);
        
        // If node exists and is a directory
        if (node && node.type === 'dir') {
          // Expand it
          const updated = updateNodeInTree(prev, targetPath, { isExpanded: true });
          
          // Load children if needed
          if (!node.children && !node.isLoading) {
            handleLoadChildren(targetPath).then(() => resolve()).catch(() => resolve());
          } else {
            resolve();
          }
          
          return updated;
        }
        
        // If node doesn't exist, load its parent first
        const pathParts = targetPath.split('/').filter(Boolean);
        if (pathParts.length > 1) {
          const parentPath = pathParts.slice(0, -1).join('/');
          const parent = findNode(prev, parentPath);
          
          if (parent && parent.type === 'dir') {
            // Expand parent and load its children
            const updated = updateNodeInTree(prev, parentPath, { isExpanded: true });
            
            if (!parent.children && !parent.isLoading) {
              handleLoadChildren(parentPath)
                .then(() => {
                  // After parent loads, try again
                  setTimeout(() => ensurePathLoaded(targetPath).then(() => resolve()), 100);
                })
                .catch(() => resolve());
            } else {
              // Parent already has children, try again
              setTimeout(() => ensurePathLoaded(targetPath).then(() => resolve()), 100);
            }
            
            return updated;
          }
        }
        
        resolve();
        return prev;
      });
    });
  };

  // Auto-expand parent directories when a file is selected
  useEffect(() => {
    if (selectedPath && !isLoading && tree.length > 0) {
      const parentPaths = getParentPaths(selectedPath);
      
      const expandParents = async () => {
        // Process each parent path in order (root to deepest)
        for (const parentPath of parentPaths) {
          await ensurePathLoaded(parentPath);
        }
      };

      expandParents();
    }
  }, [selectedPath, repoId, isLoading]);

  const handleToggle = (path: string, expanded: boolean) => {
    setTree(prev => updateNodeInTree(prev, path, { isExpanded: expanded }));
  };

  const updateNodeInTree = (nodes: TreeNode[], path: string, updates: Partial<TreeNode>): TreeNode[] => {
    return nodes.map(node => {
      if (node.path === path) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, path, updates) };
      }
      return node;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
        {import.meta.env.DEV && (
          <p className="text-xs text-muted-foreground">
            Loading from {window.location.hostname === 'localhost' ? 'GitHub API' : 'local files'}...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    const isRateLimit = error.includes('rate limit');
    const hasCached = getCached<GitHubFile[]>('filetree', repoId) !== null;
    
    return (
      <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg space-y-3">
        <div className="font-medium">{error}</div>
        {isRateLimit && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">
              <strong>Quick fix:</strong> Open browser console (F12) and run: <code className="bg-background px-1 py-0.5 rounded text-xs font-mono">localStorage.clear()</code> then reload the page.
            </p>
            {hasCached && (
              <>
                <p className="text-muted-foreground text-xs">
                  Or use cached file tree below:
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const cached = getCached<GitHubFile[]>('filetree', repoId);
                    if (cached) {
                      setTree(cached.map(f => ({ ...f, isExpanded: false })));
                      setError(null);
                    }
                  }}
                  className="w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Use Cached File Tree
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                clearCache(repoId);
                window.location.reload();
              }}
              className="w-full text-xs"
            >
              Clear Cache & Reload
            </Button>
          </div>
        )}
      </div>
    );
  }

  const visibleNodes = tree.filter(node => node.type === 'dir' || isMarkdownFile(node.name));

  return (
    <div className="space-y-0.5">
      {visibleNodes
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
          return a.name.localeCompare(b.name);
        })
        .map(node => (
          <FileTreeItem
            key={node.path}
            node={node}
            level={0}
            repoId={repoId}
            onSelectFile={onSelectFile}
            selectedPath={selectedPath}
            onToggle={handleToggle}
            onLoadChildren={handleLoadChildren}
          />
        ))}
    </div>
  );
};

export default FileTree;
