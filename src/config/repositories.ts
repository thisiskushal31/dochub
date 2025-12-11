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
    id: 'devops',
    name: 'DevOps Handbook',
    owner: 'thisiskushal31',
    repo: 'DevOps-Handbook',
    branch: 'main',
    description: 'CI/CD, IaC, cloud-native, observability, and security best practices',
    icon: 'fas fa-rocket'
  },
  {
    id: 'container',
    name: 'Containerization Deep Dive',
    owner: 'thisiskushal31',
    repo: 'Containerization-Deep-Dive',
    branch: 'main',
    description: 'Containerization fundamentals',
    icon: 'fas fa-box'
  },
  {
    id: 'databases',
    name: 'Databases Deep Dive',
    owner: 'thisiskushal31',
    repo: 'Databases-Deep-Dive',
    branch: 'main',
    description: 'Databases fundamentals across engines and managed services',
    icon: 'fas fa-database'
  },
  {
    id: 'networks',
    name: 'Networks Deep Dive',
    owner: 'thisiskushal31',
    repo: 'Networks-Deep-Dive',
    branch: 'main',
    description: 'Networking from physical layers to cloud-native patterns',
    icon: 'fas fa-network-wired'
  },
  {
    id: 'system-design',
    name: 'System Design Concepts',
    owner: 'thisiskushal31',
    repo: 'System-Design-Concepts',
    branch: 'main',
    description: 'System design patterns, components, and trade-offs by use case',
    icon: 'fas fa-project-diagram'
  },
  {
    id: 'cheatsheets',
    name: 'Commands and Cheatsheets',
    owner: 'thisiskushal31',
    repo: 'Commands-and-Cheatsheets',
    branch: 'main',
    description: 'Essential commands and cheatsheets',
    icon: 'fas fa-terminal'
  }
];

export function getRawGitHubUrl(config: RepositoryConfig, path: string): string {
  const basePath = config.basePath || '';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Encode each path segment separately to handle special characters like #
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}${basePath}/${encodedPath}`;
}

export function getRepositoryById(id: string): RepositoryConfig | undefined {
  return repositories.find(r => r.id === id);
}

export function getGitHubRepoUrl(config: RepositoryConfig): string {
  return `https://github.com/${config.owner}/${config.repo}`;
}
