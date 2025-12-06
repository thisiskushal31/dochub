import React from 'react';
import { Github, BookOpen, Folder, Book } from 'lucide-react';
import { repositories } from '@/config/repositories';
import { PERSONAL_INFO, WEBSITE_LINKS } from '@/config/config';
import { ANIMATED_BACKGROUND_ELEMENTS, ANIMATED_DOTS } from '@/config/animations';

interface WelcomeViewProps {
  onOpenSearch: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onOpenSearch }) => {
  // Calculate stats
  const repoCount = repositories.length;

  return (
    <div className="min-h-screen">
      {/* Intro Section with Animated Background */}
      <section id="intro-section" className="relative py-12 px-4 overflow-hidden">
        {/* Full Animated Background with Tech Stack Logos */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-teal-600/10">
            {/* Animated Line Pattern Background */}
            <div className="absolute inset-0 opacity-60">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="line-pattern" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="15" y2="0" stroke="#3b82f6" strokeWidth="1" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite"/>
                    </line>
                    <line x1="0" y1="0" x2="0" y2="15" stroke="#3b82f6" strokeWidth="1" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite"/>
                    </line>
                    <circle cx="7.5" cy="7.5" r="1" fill="#3b82f6" opacity="0.3">
                      <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite"/>
                    </circle>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#line-pattern)"/>
              </svg>
      </div>

            {/* Floating Tech Stack Logos */}
            {ANIMATED_BACKGROUND_ELEMENTS.map((element, index) => (
          <div
            key={index}
                className={element.className}
                style={element.style}
              >
                {element.content}
              </div>
            ))}
            
            {/* Animated Dots */}
            {ANIMATED_DOTS.map((dot, index) => (
              <div
                key={index}
                className={dot.className}
                style={dot.style}
              />
            ))}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-background/55" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Intro Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white/20 dark:border-gray-700/20">
                  <img 
                    src={PERSONAL_INFO.avatar} 
                    alt={PERSONAL_INFO.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const initials = PERSONAL_INFO.name.split(' ').map(n => n[0]).join('');
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"><span class="text-white font-bold text-xl">${initials}</span></div>`;
                      }
                    }}
                  />
                </div>
      </div>

              {/* Bio */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Hi, I'm {PERSONAL_INFO.name}
                </h1>
                <p className="text-base text-muted-foreground mb-3">{PERSONAL_INFO.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {PERSONAL_INFO.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
              <Folder className="w-3 h-3 text-primary" />
              <span>{repoCount} Topics</span>
            </div>
          </div>

          {/* Public Profile Link */}
          {WEBSITE_LINKS.publicProfile && (
            <div className="text-center">
              <a
                href={WEBSITE_LINKS.publicProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                <span className="mr-2">🔗</span>
                View My Public Profile
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Repositories Section */}
      <section id="repositories" className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Topics
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  {repo.icon ? (
                    <i className={`${repo.icon} text-3xl text-primary`}></i>
                  ) : (
                    <Book className="h-8 w-8 text-primary" />
                  )}
      </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{repo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                  <a
                    href={`https://github.com/${repo.owner}/${repo.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
                    <Github className="h-3 w-3" />
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
      </div>
      </section>

    </div>
  );
};

export default WelcomeView;
