import { getRepositoryById, getRawGitHubUrl, type RepositoryConfig } from '@/config/repositories';
import { getCached, setCached, MARKDOWN_TTL, DEFAULT_TTL } from './cache';

// Base path for local repository files (served from gh-pages)
const LOCAL_REPOS_BASE = '/dochub/repository';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size?: number;
  download_url?: string;
}

export interface FetchOptions {
  repoId: string;
  path: string;
}

export async function fetchMarkdown(options: FetchOptions, forceRefresh = false): Promise<string> {
  const repo = getRepositoryById(options.repoId);
  if (!repo) {
      throw new Error(`Topic not found: ${options.repoId}`);
  }
  
  // If not forcing refresh, try local files first (from gh-pages or local dev)
  if (!forceRefresh) {
    try {
      const localPath = `${LOCAL_REPOS_BASE}/${options.repoId}/${options.path}`;
      const response = await fetch(localPath, { cache: 'default' });
      
      if (response.ok) {
        const content = await response.text();
        // Cache the local content
        setCached('markdown', options.repoId, content, MARKDOWN_TTL, options.path);
        return content;
      }
    } catch (error) {
      // Local file not found, continue to check cache/API
      console.debug(`Local file not found: ${options.path}, trying cache/API`);
    }
    
    // Check cache
    const cached = getCached<string>('markdown', options.repoId, options.path);
    if (cached) {
      return cached;
    }
    
    // In development, if local files don't exist, fall back to GitHub API
    // This allows local dev to work without running clone script
    if (import.meta.env.DEV) {
      console.log(`[DEV] Local file not found, fetching from GitHub API: ${options.path}`);
      // Continue to API fetch below
    } else {
      // In production, if no local file and no cache, throw error
      // This should rarely happen if CI worked correctly
      throw new Error(`File not found locally and no cache available: ${options.path}. Please ensure CI build completed successfully.`);
    }
  }
  
  // Force refresh OR dev mode fallback: fetch from GitHub API (raw.githubusercontent.com)
  let url = getRawGitHubUrl(repo, options.path);
  if (forceRefresh) {
    url += `?t=${Date.now()}`; // Cache-busting for refresh
  } else if (import.meta.env.DEV) {
    url += `?t=${Date.now()}`; // Timestamp for dev to avoid stale cache
  }
  
  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
  if (!response.ok) {
      if (response.status === 403) {
        // Rate limited - try local file or cached data
        try {
          const localPath = `${LOCAL_REPOS_BASE}/${options.repoId}/${options.path}`;
          const localResponse = await fetch(localPath);
          if (localResponse.ok) {
            return await localResponse.text();
          }
        } catch {
          // Local file not available
        }
        
        const cached = getCached<string>('markdown', options.repoId, options.path);
        if (cached) {
          console.warn('Rate limited, returning cached content');
          return cached;
        }
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to fetch from ${repo.name}: ${options.path} (${response.status})`);
  }
    
    const content = await response.text();
    
    // Cache the content
    setCached('markdown', options.repoId, content, MARKDOWN_TTL, options.path);
    
    return content;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If network error, try local file or cached data
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      try {
        const localPath = `${LOCAL_REPOS_BASE}/${options.repoId}/${options.path}`;
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          return await localResponse.text();
}
      } catch {
        // Local file not available
      }
      
      const cached = getCached<string>('markdown', options.repoId, options.path);
      if (cached) {
        console.warn('Network error, returning cached content');
        return cached;
      }
      throw new Error(`Network error: Unable to connect to GitHub. Please check your internet connection.`);
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      // Try local file or cached data on timeout
      try {
        const localPath = `${LOCAL_REPOS_BASE}/${options.repoId}/${options.path}`;
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          return await localResponse.text();
        }
      } catch {
        // Local file not available
      }
      
      const cached = getCached<string>('markdown', options.repoId, options.path);
      if (cached) {
        console.warn('Request timeout, returning cached content');
        return cached;
      }
      throw new Error(`Request timeout: Unable to fetch from ${repo.name}. Please check your internet connection.`);
    }
    throw error;
  }
}

export async function fetchFileTree(repoId: string, path: string = '', forceRefresh = false): Promise<GitHubFile[]> {
  const repo = getRepositoryById(repoId);
  if (!repo) {
      throw new Error(`Topic not found: ${repoId}`);
  }
  
  // If not forcing refresh, try local file tree first (from gh-pages or local dev)
  if (!forceRefresh) {
    try {
      const treePath = path ? `${path}/tree.json` : 'tree.json';
      const localPath = `${LOCAL_REPOS_BASE}/${repoId}/${treePath}`;
      const response = await fetch(localPath, { cache: 'default' });
      
      if (response.ok) {
        const data = await response.json();
        const files = Array.isArray(data) ? data : [data];
        // Cache the local file tree
        setCached('filetree', repoId, files, DEFAULT_TTL, path);
        return files;
      }
    } catch (error) {
      // Local file tree not found, continue to check cache/API
      console.debug(`Local file tree not found: ${path}, trying cache/API`);
    }
    
    // Check cache
    const cached = getCached<GitHubFile[]>('filetree', repoId, path);
    if (cached) {
      return cached;
    }
    
    // In development, if local files don't exist, fall back to GitHub API
    if (import.meta.env.DEV) {
      console.log(`[DEV] Local file tree not found, fetching from GitHub API: ${path || 'root'}`);
      // Continue to API fetch below
    } else {
      // In production, if no local file and no cache, throw error
      throw new Error(`File tree not found locally and no cache available: ${path || 'root'}. Please ensure CI build completed successfully.`);
    }
  }
  
  // Force refresh OR dev mode fallback: fetch from GitHub API
  const basePath = repo.basePath || '';
  const fullPath = path ? `${basePath}/${path}` : basePath;
  let apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents${fullPath}?ref=${repo.branch}`;
  if (forceRefresh) {
    apiUrl += `&t=${Date.now()}`; // Cache-busting for refresh
  } else if (import.meta.env.DEV) {
    apiUrl += `&t=${Date.now()}`; // Timestamp for dev to avoid stale cache
  }
  
  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
  if (!response.ok) {
    if (response.status === 403) {
        // Rate limited - try local file tree or cached data
        try {
          const treePath = path ? `${path}/tree.json` : 'tree.json';
          const localPath = `${LOCAL_REPOS_BASE}/${repoId}/${treePath}`;
          const localResponse = await fetch(localPath);
          if (localResponse.ok) {
            const data = await localResponse.json();
            return Array.isArray(data) ? data : [data];
          }
        } catch {
          // Local file tree not available
        }
        
        const cached = getCached<GitHubFile[]>('filetree', repoId, path);
        if (cached) {
          console.warn('Rate limited, returning cached file tree');
          return cached;
        }
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
      throw new Error(`Failed to fetch file tree from ${repo.name} (${response.status})`);
  }
  
  const data = await response.json();
    const files = Array.isArray(data) ? data : [data];
    
    // Cache the file tree
    setCached('filetree', repoId, files, DEFAULT_TTL, path);
    
    return files;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If network error or rate limit, try local file tree or cached data
    if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('rate limit'))) {
      try {
        const treePath = path ? `${path}/tree.json` : 'tree.json';
        const localPath = `${LOCAL_REPOS_BASE}/${repoId}/${treePath}`;
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          const data = await localResponse.json();
          return Array.isArray(data) ? data : [data];
        }
      } catch {
        // Local file tree not available
      }
      
      const cached = getCached<GitHubFile[]>('filetree', repoId, path);
      if (cached) {
        console.warn('Network/rate limit error, returning cached file tree');
        return cached;
      }
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      // Try local file tree or cached data on timeout
      try {
        const treePath = path ? `${path}/tree.json` : 'tree.json';
        const localPath = `${LOCAL_REPOS_BASE}/${repoId}/${treePath}`;
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          const data = await localResponse.json();
  return Array.isArray(data) ? data : [data];
        }
      } catch {
        // Local file tree not available
      }
      
      const cached = getCached<GitHubFile[]>('filetree', repoId, path);
      if (cached) {
        console.warn('Request timeout, returning cached file tree');
        return cached;
      }
      throw new Error(`Request timeout: Unable to fetch file tree from ${repo.name}. Please check your internet connection.`);
    }
    throw error;
  }
}

export function processImagePaths(
  markdown: string,
  repoConfig: RepositoryConfig,
  currentFilePath: string
): string {
  const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
  
  return markdown.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (match, alt, imagePath) => {
      let resolvedPath = imagePath;
      
      if (imagePath.startsWith('./')) {
        resolvedPath = `${currentDir}/${imagePath.slice(2)}`;
      } else if (imagePath.startsWith('../')) {
        const parts = currentDir.split('/').filter(Boolean);
        const upCount = (imagePath.match(/\.\.\//g) || []).length;
        const remaining = imagePath.replace(/\.\.\//g, '');
        resolvedPath = [...parts.slice(0, -upCount), remaining].join('/');
      } else if (!imagePath.startsWith('/')) {
        resolvedPath = `${currentDir}/${imagePath}`;
      }
      
      resolvedPath = resolvedPath.replace(/\/+/g, '/').replace(/^\//, '');
      const rawUrl = getRawGitHubUrl(repoConfig, resolvedPath);
      return `![${alt}](${rawUrl})`;
    }
  );
}

export function isMarkdownFile(filename: string): boolean {
  return /\.(md|mdx|markdown)$/i.test(filename);
}

export function getFileDisplayName(filename: string): string {
  return filename
    .replace(/\.(md|mdx|markdown)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/^\d+[._\s]*/, '');
}

/**
 * Calculate reading time in minutes based on word count
 * Assumes average reading speed of 100 words per minute
 */
export function calculateReadingTime(content: string): number {
  // Remove markdown syntax, code blocks, and HTML tags
  const text = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  // Count words (split by whitespace and filter empty strings)
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate reading time (100 words per minute)
  const readingTime = Math.ceil(wordCount / 100);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
}
