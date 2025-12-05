import React, { useState, useEffect, useRef } from 'react';
import { Renderer } from '@/lib/marked/renderer';
import { useTheme } from '@/hooks/useTheme';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import GistEmbed from './GistEmbed';
import YouTubeEmbed from './YouTubeEmbed';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-markdown';
import '@/styles/markdown.css';

interface MarkdownViewerProps {
  content: string;
  className?: string;
  onContentLoaded?: () => void;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = '',
  onContentLoaded
}) => {
  const { theme } = useTheme();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const parserRef = useRef<Renderer | null>(null);

  useEffect(() => {
    parserRef.current = new Renderer(true);
  }, []);

  useEffect(() => {
    if (!parserRef.current) return;

    try {
      setIsLoading(true);
      const parsedHtml = parserRef.current.parse(content);
      const sanitizedHtml = DOMPurify.sanitize(parsedHtml, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'ul', 'ol', 'li',
          'a', 'img', 'iframe',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'pre', 'code',
          'blockquote', 'hr',
          'div', 'span',
          'svg', 'path',
          'button', 'input',
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'id',
          'target', 'rel', 'loading',
          'aria-label', 'aria-hidden',
          'type', 'checked', 'disabled',
          'fill', 'viewBox', 'fill-rule', 'clip-rule', 'd',
          'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'stroke',
          'frameborder', 'allowfullscreen', 'allow'
        ],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true,
      });

      setHtmlContent(sanitizedHtml);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setHtmlContent('<div class="error text-destructive">Error parsing markdown content</div>');
      setIsLoading(false);
    }
  }, [content]);

  // Apply syntax highlighting
  useEffect(() => {
    if (htmlContent && containerRef.current) {
      const codeElements = containerRef.current.querySelectorAll('.blog-markdown .highlight pre code');
      codeElements.forEach(code => {
        try {
          Prism.highlightElement(code as HTMLElement);
        } catch (error) {
          console.warn('Prism highlighting failed:', error);
        }
      });
    }
  }, [htmlContent, theme]);

  // Handle link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link) {
        if (link.target === '_blank') {
          e.preventDefault();
          window.open(link.href, '_blank', 'noopener,noreferrer');
          return;
        }

        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const id = href.slice(1);
          const element = document.getElementById(id) || document.getElementById(`user-content-${id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleLinkClick);
      return () => container.removeEventListener('click', handleLinkClick);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (!isLoading && onContentLoaded) {
      onContentLoaded();
    }
  }, [isLoading, onContentLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const processEmbeds = (html: string) => {
    const gistEmbeds: Array<{ id: string; placeholder: string }> = [];
    const youtubeEmbeds: Array<{ id: string; placeholder: string }> = [];
    let processedHtml = html;

    const gistRegex = /<div class="gist-embed-wrapper[^"]*" data-gist-id="([^"]+)">[^<]*<div class="gist-loading">Loading Gist\.\.\.<\/div>[^<]*<\/div>/g;
    let match;
    let index = 0;

    while ((match = gistRegex.exec(html)) !== null) {
      const gistId = match[1];
      const placeholder = `__GIST_EMBED_${index}__`;
      gistEmbeds.push({ id: gistId, placeholder });
      processedHtml = processedHtml.replace(match[0], placeholder);
      index++;
    }

    const youtubeRegex = /<div class="youtube-embed-placeholder" data-video-id="([^"]+)"><\/div>/g;
    index = 0;

    while ((match = youtubeRegex.exec(html)) !== null) {
      const videoId = match[1];
      const placeholder = `__YOUTUBE_EMBED_${index}__`;
      youtubeEmbeds.push({ id: videoId, placeholder });
      processedHtml = processedHtml.replace(match[0], placeholder);
      index++;
    }

    return { processedHtml, gistEmbeds, youtubeEmbeds };
  };

  const { processedHtml, gistEmbeds, youtubeEmbeds } = processEmbeds(htmlContent);

  return (
    <div
      ref={containerRef}
      className={`blog-markdown${className ? ' ' + className : ''}`}
    >
      {processedHtml.split(/(__GIST_EMBED_\d+__|__YOUTUBE_EMBED_\d+__)/).map((part, index) => {
        const gistEmbed = gistEmbeds.find(embed => embed.placeholder === part);
        const youtubeEmbed = youtubeEmbeds.find(embed => embed.placeholder === part);

        if (gistEmbed) {
          return <GistEmbed key={index} gistId={gistEmbed.id} />;
        }

        if (youtubeEmbed) {
          return <YouTubeEmbed key={index} videoId={youtubeEmbed.id} />;
        }

        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </div>
  );
};

export default MarkdownViewer;
