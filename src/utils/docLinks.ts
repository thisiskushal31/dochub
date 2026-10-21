import {
  getGitHubRepoUrl,
  getRawGitHubUrl,
  getRepositoryById,
  repositories,
  type RepositoryConfig,
} from '@/config/repositories';

const MARKDOWN_FILE = /\.(md|mdx|markdown)$/i;

export type ClassifiedLink =
  | { kind: 'anchor' }
  | { kind: 'doc'; href: string }
  | { kind: 'external'; href: string };

function repoByGitHubName(name: string): RepositoryConfig | undefined {
  const decoded = decodeURIComponent(name);
  return repositories.find((repo) => repo.repo.toLowerCase() === decoded.toLowerCase());
}

export function encodeDocPath(filePath: string): string {
  return filePath
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/** Hash route the docs app already uses, for example `#/dsa/Algorithms/01_Time_Complexity_and_Space_Complexity.md`. */
export function docHash(repoId: string, filePath: string | null, section?: string): string {
  const route = filePath ? `#/${repoId}/${encodeDocPath(filePath)}` : `#/${repoId}`;
  return section ? `${route}?section=${encodeURIComponent(section)}` : route;
}

function resolveAgainstFile(currentFilePath: string, hrefPath: string): string {
  const fromRepoRoot = hrefPath.startsWith('/');
  const currentDir = currentFilePath.includes('/')
    ? currentFilePath.slice(0, currentFilePath.lastIndexOf('/'))
    : '';
  const parts = fromRepoRoot ? [] : currentDir.split('/').filter(Boolean);

  for (const segment of hrefPath.split('/')) {
    if (!segment || segment === '.') continue;
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      decoded = segment;
    }
    if (decoded === '..') {
      parts.pop();
    } else {
      parts.push(decoded);
    }
  }

  return parts.join('/');
}

function splitPathAndSection(href: string): { path: string; section?: string } {
  const hashAt = href.indexOf('#');
  if (hashAt <= 0) {
    return { path: href.split('?')[0] };
  }
  const section = href.slice(hashAt + 1).split('?')[0];
  return {
    path: href.slice(0, hashAt).split('?')[0],
    section: section || undefined,
  };
}

function fromGitHub(href: string): ClassifiedLink | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  if (url.hostname === 'thisiskushal31.github.io' && url.pathname.replace(/\/+$/, '') === '/dochub') {
    if (url.hash.startsWith('#/')) {
      return { kind: 'doc', href: url.hash };
    }
    return null;
  }

  if (url.hostname === 'github.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'thisiskushal31' || !parts[1]) return null;
    const repo = repoByGitHubName(parts[1]);
    if (!repo) return null;

    const section = url.hash ? url.hash.slice(1) : undefined;
    if (!parts[2]) {
      return { kind: 'doc', href: docHash(repo.id, null) };
    }
    if (parts[2] !== 'blob' && parts[2] !== 'tree') return null;

    const rest = parts.slice(4).map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    }).join('/');

    if (!rest) return { kind: 'doc', href: docHash(repo.id, null) };
    if (MARKDOWN_FILE.test(rest)) {
      return { kind: 'doc', href: docHash(repo.id, rest, section) };
    }
    return null;
  }

  if (url.hostname === 'raw.githubusercontent.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'thisiskushal31' || !parts[1]) return null;
    const repo = repoByGitHubName(parts[1]);
    if (!repo) return null;
    const rest = parts.slice(3).map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    }).join('/');
    if (MARKDOWN_FILE.test(rest)) {
      return { kind: 'doc', href: docHash(repo.id, rest) };
    }
  }

  return null;
}

function assetHref(repo: RepositoryConfig, resolvedPath: string): string {
  if (!resolvedPath) {
    return `${getGitHubRepoUrl(repo)}/tree/${repo.branch}`;
  }
  if (/\.[^/]+$/.test(resolvedPath)) {
    return getRawGitHubUrl(repo, resolvedPath);
  }
  const encoded = resolvedPath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${getGitHubRepoUrl(repo)}/tree/${repo.branch}/${encoded}`;
}

/**
 * Decide where a markdown link should go.
 * Notes inside a configured repository stay on the docs hash route.
 * Other files in that repository open on GitHub instead of the site root.
 */
export function classifyDocLink(rawHref: string, repoId: string, filePath: string): ClassifiedLink {
  const href = rawHref.trim();
  if (!href) return { kind: 'external', href };
  if (href.startsWith('#') && !href.startsWith('#/')) return { kind: 'anchor' };
  if (href.startsWith('#/')) return { kind: 'doc', href };

  const github = fromGitHub(href);
  if (github) return github;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
  if (hasScheme) return { kind: 'external', href };

  const repo = getRepositoryById(repoId);
  if (!repo) return { kind: 'external', href };

  const { path, section } = splitPathAndSection(href);
  const resolved = resolveAgainstFile(filePath, path);
  if (!resolved) return { kind: 'doc', href: docHash(repo.id, null) };
  if (MARKDOWN_FILE.test(resolved)) {
    return { kind: 'doc', href: docHash(repo.id, resolved, section) };
  }
  return { kind: 'external', href: assetHref(repo, resolved) };
}
