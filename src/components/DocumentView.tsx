import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ExternalLink, Loader2, RefreshCw, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MarkdownViewer from './MarkdownViewer';
import TableOfContents from './TableOfContents';
import { fetchMarkdown, processImagePaths, getFileDisplayName } from '@/utils/github';
import { getRepositoryById, getRawGitHubUrl, type RepositoryConfig } from '@/config/repositories';
import { getCached, clearCache } from '@/utils/cache';

interface DocumentViewProps {
  repoId: string;
  filePath: string;
  onBack: () => void;
}

const DocumentView: React.FC<DocumentViewProps> = ({ repoId, filePath, onBack }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repo, setRepo] = useState<RepositoryConfig | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const loadContent = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
        const repoConfig = getRepositoryById(repoId);
        if (!repoConfig) {
          setError('Topic not found');
      setIsLoading(false);
      return;
    }
    
    setRepo(repoConfig);

    try {
      // Force refresh bypasses cache to get latest content
      let markdown = await fetchMarkdown({ repoId, path: filePath }, forceRefresh);
      markdown = processImagePaths(markdown, repoConfig, filePath);
      setContent(markdown);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load document';
      
      // If rate limited, try to load from cache
      if (errorMessage.includes('rate limit')) {
        const cached = getCached<string>('markdown', repoId, filePath);
        if (cached) {
          const processedMarkdown = processImagePaths(cached, repoConfig, filePath);
          setContent(processedMarkdown);
          setLastUpdated(new Date());
          toast({
            title: "Using cached content",
            description: "GitHub API rate limit exceeded. Showing cached version.",
            variant: "default",
          });
          setIsLoading(false);
          return;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [repoId, filePath, toast]);

  useEffect(() => {
    // Initial load - use cache for faster loading
    loadContent(false);
  }, [loadContent]);

  const handleRefresh = () => {
    // Force refresh to get latest content from GitHub
    loadContent(true);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayName,
          text: `Check out this documentation: ${displayName}`,
          url: currentUrl,
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(currentUrl);
        setLinkCopied(true);
        toast({
          title: "Link copied!",
          description: "The document link has been copied to your clipboard.",
        });
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled share or error occurred
      if (err instanceof Error && err.name !== 'AbortError') {
        // Fallback to copying URL if share fails
        try {
          await navigator.clipboard.writeText(currentUrl);
          setLinkCopied(true);
          toast({
            title: "Link copied!",
            description: "The document link has been copied to your clipboard.",
          });
          setTimeout(() => setLinkCopied(false), 2000);
        } catch (copyErr) {
          toast({
            title: "Failed to copy link",
            description: "Please try copying the URL manually from your browser.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const fileName = filePath.split('/').pop() || '';
  const displayName = getFileDisplayName(fileName);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        {import.meta.env.DEV && (
          <p className="text-sm text-muted-foreground">
            Loading from {window.location.hostname === 'localhost' ? 'GitHub API' : 'local files'}...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    const isRateLimit = error.includes('rate limit');
    const hasCached = getCached<string>('markdown', repoId, filePath) !== null;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-2xl mx-auto">
        <div className="text-destructive mb-4 text-lg font-medium">{error}</div>
        
        {isRateLimit && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4 text-left w-full">
            <p className="text-sm text-foreground mb-3 font-medium">Options to resolve:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Wait 1 hour for GitHub rate limit to reset</li>
              <li>Use cached content if available (button below)</li>
              <li>Clear browser cache and reload the page</li>
              <li>Open browser console (F12) and run: <code className="bg-background px-2 py-1 rounded text-xs font-mono">localStorage.clear()</code></li>
            </ol>
          </div>
        )}
        
        {isRateLimit && hasCached && (
          <p className="text-muted-foreground mb-4 text-sm">
            Cached content is available. Click "Use Cached" to view it.
          </p>
        )}
        
        <div className="flex gap-3 flex-wrap justify-center">
          {isRateLimit && hasCached && (
            <Button 
              onClick={() => {
                const cached = getCached<string>('markdown', repoId, filePath);
                if (cached && repo) {
                  const processedMarkdown = processImagePaths(cached, repo, filePath);
                  setContent(processedMarkdown);
                  setError(null);
                  setLastUpdated(new Date());
                  toast({
                    title: "Loaded from cache",
                    description: "Showing cached version of the document.",
                  });
                }
              }} 
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Use Cached
            </Button>
          )}
          {isRateLimit && (
            <Button 
              onClick={() => {
                clearCache(repoId);
                toast({
                  title: "Cache cleared",
                  description: "Cache cleared. Please wait a few minutes before trying again.",
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }} 
              variant="outline"
            >
              Clear Cache & Reload
            </Button>
          )}
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-full">
      <article className="flex-1 min-w-0 animate-fade-in">
        <div className="mb-6">
          <Button onClick={onBack} variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to files
          </Button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{displayName}</h1>
              {repo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{repo.icon}</span>
                  <span>{repo.name}</span>
                  <span>/</span>
                  <span className="truncate max-w-[300px]">{filePath}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
                  {lastUpdated && (
                    <span className="text-xs text-muted-foreground">
                      Updated: {lastUpdated.toLocaleString()}
                    </span>
                  )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-sm"
                title="Copy link to share this document"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-sm"
                title="Refresh to get latest content from GitHub"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {repo && (
                <a
                  href={`https://github.com/${repo.owner}/${repo.repo}/blob/${repo.branch}/${filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Edit on GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <MarkdownViewer content={content} />
        </div>
      </article>

      {/* Table of Contents - Desktop only */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <TableOfContents content={content} />
        </div>
      </aside>
    </div>
  );
};

export default DocumentView;
