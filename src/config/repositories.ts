export interface RepositoryConfig {
  id: string;
  name: string;
  owner: string;
  repo: string;
  branch: string;
  basePath?: string;
  description?: string;
  icon?: string;
}

export const repositories: RepositoryConfig[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    owner: 'thisiskushal31',
    repo: 'Datastructures-and-Algorithms',
    branch: 'main',
    description: 'DSA notes and solutions',
    icon: 'fas fa-book-open'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Deep Dive',
    owner: 'thisiskushal31',
    repo: 'Kubernetes-Deep-Dive',
    branch: 'main',
    description: 'Kubernetes documentation',
    icon: 'fas fa-cube'
  },
];

export function getRawGitHubUrl(config: RepositoryConfig, path: string): string {
  const basePath = config.basePath || '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}${basePath}/${cleanPath}`;
}

export function getRepositoryById(id: string): RepositoryConfig | undefined {
  return repositories.find(r => r.id === id);
}

export function getGitHubRepoUrl(config: RepositoryConfig): string {
  return `https://github.com/${config.owner}/${config.repo}`;
}
