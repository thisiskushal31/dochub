/**
 * Animation Configuration
 * Centralized animation settings for background elements and page transitions
 */

export interface AnimatedElement {
  content: string;
  className: string;
  style: React.CSSProperties;
}

/**
 * Background logo animation elements configuration
 * These are the tech stack logos that float in the background
 */
export const ANIMATED_BACKGROUND_ELEMENTS: AnimatedElement[] = [
  // Code Elements
  {
    content: '</>',
    className: 'absolute top-10 left-10 text-6xl font-mono text-primary/10 select-none animate-float-rotate',
    style: { animationDuration: '20s' }
  },
  {
    content: '{}',
    className: 'absolute bottom-10 right-10 text-4xl font-mono text-accent/10 select-none animate-gentle-bounce',
    style: { animationDuration: '8s' }
  },
  {
    content: '<div>',
    className: 'absolute top-1/2 left-1/4 text-3xl font-mono text-muted-foreground/10 select-none animate-drift',
    style: { animationDuration: '15s' }
  },
  
  // Frontend Frameworks
  {
    content: 'React',
    className: 'absolute top-1/3 right-1/4 text-2xl font-mono text-blue-500/30 select-none animate-rotate-slow',
    style: { animationDelay: '0s', animationDuration: '40s' }
  },
  {
    content: 'TypeScript',
    className: 'absolute bottom-1/3 left-1/3 text-xl font-mono text-purple-500/30 select-none animate-pulse-slow',
    style: { animationDelay: '2s', animationDuration: '5s' }
  },
  {
    content: 'Node.js',
    className: 'absolute top-2/3 right-1/3 text-lg font-mono text-teal-500/30 select-none animate-drift',
    style: { animationDelay: '1s', animationDuration: '18s' }
  },
  {
    content: 'Vue',
    className: 'absolute top-1/5 left-1/2 text-xl font-mono text-green-500/30 select-none animate-slide-in-out',
    style: { animationDelay: '0s', animationDuration: '12s' }
  },
  
  // Cloud & Infrastructure
  {
    content: 'AWS',
    className: 'absolute bottom-1/5 right-1/4 text-lg font-mono text-cyan-500/30 select-none animate-drift',
    style: { animationDelay: '3s', animationDuration: '22s' }
  },
  {
    content: 'Docker',
    className: 'absolute top-4/5 left-1/5 text-base font-mono text-orange-500/30 select-none animate-float-rotate',
    style: { animationDelay: '2s', animationDuration: '25s' }
  },
  
  // Kubernetes Ecosystem
  {
    content: 'K8s',
    className: 'absolute top-2/3 left-1/4 text-lg font-mono text-blue-400/30 select-none animate-rotate-slow',
    style: { animationDelay: '5s', animationDuration: '35s' }
  },
  {
    content: 'Helm',
    className: 'absolute top-1/6 right-1/6 text-base font-mono text-purple-400/30 select-none animate-drift',
    style: { animationDelay: '4s', animationDuration: '20s' }
  },
  {
    content: 'Terraform',
    className: 'absolute bottom-1/6 left-3/4 text-sm font-mono text-teal-400/30 select-none animate-pulse-slow',
    style: { animationDelay: '6s', animationDuration: '6s' }
  },
  {
    content: 'Git',
    className: 'absolute top-1/3 left-1/6 text-base font-mono text-orange-400/30 select-none animate-gentle-bounce',
    style: { animationDelay: '7s', animationDuration: '7s' }
  },
  {
    content: 'Ansible',
    className: 'absolute top-3/4 right-1/6 text-base font-mono text-green-400/30 select-none animate-float-rotate',
    style: { animationDelay: '3s', animationDuration: '28s' }
  },
  {
    content: 'Jenkins',
    className: 'absolute bottom-2/3 right-1/3 text-sm font-mono text-red-400/30 select-none animate-slide-in-out',
    style: { animationDelay: '8s', animationDuration: '15s' }
  },
  
  // AI/ML
  {
    content: 'TensorFlow',
    className: 'absolute top-1/4 left-3/5 text-base font-mono text-yellow-400/30 select-none animate-drift',
    style: { animationDelay: '5s', animationDuration: '24s' }
  },
  {
    content: 'PyTorch',
    className: 'absolute bottom-1/3 left-2/5 text-base font-mono text-red-400/30 select-none animate-rotate-slow',
    style: { animationDelay: '6s', animationDuration: '32s' }
  },
  {
    content: 'OpenAI',
    className: 'absolute top-1/2 right-2/5 text-sm font-mono text-blue-300/30 select-none animate-pulse-slow',
    style: { animationDelay: '9s', animationDuration: '5s' }
  },
  {
    content: 'LangChain',
    className: 'absolute top-1/6 left-1/3 text-xs font-mono text-emerald-400/30 select-none animate-gentle-bounce',
    style: { animationDelay: '10s', animationDuration: '8s' }
  },
  
  // Observability & Platform Engineering
  {
    content: 'Prometheus',
    className: 'absolute top-2/5 right-3/5 text-sm font-mono text-orange-300/30 select-none animate-float-rotate',
    style: { animationDelay: '4s', animationDuration: '30s' }
  },
  {
    content: 'Grafana',
    className: 'absolute bottom-1/4 right-2/5 text-sm font-mono text-teal-300/30 select-none animate-slide-in-out',
    style: { animationDelay: '11s', animationDuration: '16s' }
  },
  {
    content: 'ArgoCD',
    className: 'absolute top-3/5 left-1/2 text-xs font-mono text-blue-300/30 select-none animate-drift',
    style: { animationDelay: '7s', animationDuration: '26s' }
  },
  {
    content: 'Istio',
    className: 'absolute bottom-1/5 left-4/5 text-xs font-mono text-purple-300/30 select-none animate-rotate-slow',
    style: { animationDelay: '8s', animationDuration: '38s' }
  }
];

/**
 * Animated dots configuration
 */
export const ANIMATED_DOTS = [
  { className: 'absolute top-1/4 right-1/5 w-2 h-2 bg-primary/20 rounded-full animate-pulse-slow', style: { animationDelay: '1s', animationDuration: '3s' } },
  { className: 'absolute bottom-1/4 left-1/5 w-1 h-1 bg-accent/20 rounded-full animate-gentle-bounce', style: { animationDelay: '3s', animationDuration: '5s' } },
  { className: 'absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-blue-500/20 rounded-full animate-rotate-slow', style: { animationDelay: '2s', animationDuration: '8s' } },
  { className: 'absolute top-1/2 right-1/2 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-pulse-slow', style: { animationDelay: '4s', animationDuration: '4s' } },
  { className: 'absolute top-1/3 left-1/2 w-1 h-1 bg-green-400/20 rounded-full animate-rotate-slow', style: { animationDelay: '12s', animationDuration: '6s' } },
  { className: 'absolute bottom-1/3 right-1/5 w-1.5 h-1.5 bg-orange-400/20 rounded-full animate-gentle-bounce', style: { animationDelay: '9s', animationDuration: '7s' } }
];

