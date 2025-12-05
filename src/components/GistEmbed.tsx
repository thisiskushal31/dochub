import React, { useEffect, useState } from 'react';

interface GistEmbedProps {
  gistId: string;
  className?: string;
}

const GistEmbed: React.FC<GistEmbedProps> = ({ gistId, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gistHtml, setGistHtml] = useState<string>('');

  useEffect(() => {
    const loadGist = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://api.github.com/gists/${gistId}`);

        if (!response.ok) {
          throw new Error(`Failed to load Gist: ${response.status}`);
        }

        const gistData = await response.json();
        const files = Object.values(gistData.files) as any[];
        
        if (files.length === 0) {
          throw new Error('No files found in Gist');
        }

        const firstFile = files[0];
        const content = firstFile.content;
        const language = firstFile.language || 'text';
        const filename = firstFile.filename;

        const html = `
          <div class="gist-content">
            <div class="gist-header">
              <div class="gist-meta">
                <span class="gist-filename">${filename}</span>
                <span class="gist-language">${language}</span>
              </div>
            </div>
            <div class="gist-body">
              <pre><code class="language-${language.toLowerCase()}">${content}</code></pre>
            </div>
          </div>
        `;

        setGistHtml(html);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Gist:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Gist');
        setIsLoading(false);
      }
    };

    if (gistId) {
      loadGist();
    }
  }, [gistId]);

  if (isLoading) {
    return (
      <div className={`gist-embed-wrapper ${className}`}>
        <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
          <span className="text-muted-foreground">Loading Gist...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`gist-embed-wrapper ${className}`}>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center text-destructive">
            <span>Error loading Gist: {error}</span>
          </div>
          <a
            href={`https://gist.github.com/${gistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm mt-2 inline-block"
          >
            View Gist on GitHub →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gist-embed-wrapper ${className}`}
      dangerouslySetInnerHTML={{ __html: gistHtml }}
    />
  );
};

export default GistEmbed;
