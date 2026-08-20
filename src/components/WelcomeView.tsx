import React from 'react';
import { BookOpen, Container, Database, Network, LayoutDashboard, Terminal, Settings, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { repositories, type RepositoryConfig } from '@/config/repositories';
import { PERSONAL_INFO, WEBSITE_LINKS } from '@/config/config';

interface WelcomeViewProps {
  onOpenSearch: () => void;
  onSelectRepo?: (repo: RepositoryConfig) => void;
}

const TOPIC_ICONS: Record<string, LucideIcon> = {
  dsa: BookOpen,
  devops: Settings,
  container: Container,
  databases: Database,
  networks: Network,
  'system-design': LayoutDashboard,
  cheatsheets: Terminal,
};

const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectRepo }) => {
  const repoCount = repositories.length;

  return (
    <div className="min-h-screen">
      {/* Profile intro */}
      <section className="relative overflow-hidden py-16 md:py-20 px-6">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

        <div className="relative container max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
              <img
                src={PERSONAL_INFO.avatar}
                alt={PERSONAL_INFO.name}
                className="relative w-28 h-28 rounded-full border-2 border-primary/40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const initials = PERSONAL_INFO.name.split(' ').map((n) => n[0]).join('');
                    parent.innerHTML = `<div class="relative w-28 h-28 rounded-full border-2 border-primary/40 bg-primary/20 flex items-center justify-center"><span class="text-primary font-bold text-2xl font-mono">${initials}</span></div>`;
                  }
                }}
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Hi, I'm {PERSONAL_INFO.name}</span>
            </h1>

            <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase mb-6 max-w-2xl">
              {PERSONAL_INFO.title}
            </p>

            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed mb-8">
              {PERSONAL_INFO.bio}
            </p>

            {WEBSITE_LINKS.publicProfile && (
              <a
                href={WEBSITE_LINKS.publicProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all glow-teal"
              >
                <span>🔗</span> View My Public Profile
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Topics — click a card to open that repository */}
      <section className="py-16 md:py-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-12 text-center animate-fade-in">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">Knowledge Base</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Topics</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              {repoCount} curated repositories of engineering knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repositories.map((repo) => {
              const Icon = TOPIC_ICONS[repo.id] || BookOpen;
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => onSelectRepo?.(repo)}
                  className="group relative flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:bg-muted/40 text-left w-full"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {repo.name}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomeView;
