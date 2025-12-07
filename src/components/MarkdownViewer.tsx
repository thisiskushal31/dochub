import React, { useState, useEffect, useRef } from 'react';
import { Renderer } from '@/lib/marked/renderer';
import { useTheme } from '@/hooks/useTheme';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import katex from 'katex';
import 'katex/dist/katex.min.css';
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

  // Normalize custom math notation to proper LaTeX
  const normalizeMathNotation = (text: string): string => {
    // Handle Log{_b}{a} patterns with $ delimiters: $Log{_b}{a}$ → $\log_{b} a$
    text = text.replace(/\$Log\{_([^}]+)\}\{([^}]+)\}\$/g, '$\\log_{$1} $2$');
    
    // Handle patterns like n$Log{_b}{a}$ → $n^{\log_{b} a}$
    text = text.replace(/([a-zA-Z])\$Log\{_([^}]+)\}\{([^}]+)\}\$/g, (match, base, logBase, logArg) => {
      return `$${base}^{\\log_{${logBase}} ${logArg}}$`;
    });
    
    // Handle patterns like O(nc), Θ(nc), Ω(nc) → $O(n^c)$, $Θ(n^c)$, $Ω(n^c)$
    // This wraps them in math delimiters if not already wrapped
    text = text.replace(/([OΩΘ])\(([a-zA-Z]+)([a-zA-Z])([0-9]+)\)/g, (match, func, prefix, base, exp) => {
      // Only convert if it looks like math (single letter base, single digit exponent)
      if (base.length === 1 && exp.length === 1 && prefix.length <= 2) {
        return `$${func}(${prefix}${base}^{${exp}})$`;
      }
      return match;
    });
    
    // Handle patterns like (nc) in parentheses → (n^c) and wrap in math if in math context
    text = text.replace(/\(([a-zA-Z])([0-9]+)\)/g, (match, base, exp) => {
      if (base.length === 1 && exp.length === 1) {
        return `(${base}^{${exp}})`;
      }
      return match;
    });
    
    // Handle standalone nc patterns in math-like contexts
    // This is more conservative - only convert when clearly in a math expression
    text = text.replace(/([^`$\\a-zA-Z])([a-zA-Z])([0-9]+)([^`$a-zA-Z])/g, (match, before, base, exp, after) => {
      // Only convert single-letter bases with single-digit exponents
      // when surrounded by math-like delimiters
      if (base.length === 1 && exp.length === 1 && 
          (before === '(' || before === ' ' || before === '=' || before === '<' || before === '>') &&
          (after === ')' || after === ' ' || after === ',' || after === '.')) {
        return `${before}${base}^{${exp}}${after}`;
      }
      return match;
    });
    
    return text;
  };

  // Render math expressions with KaTeX
  const renderMath = (html: string): string => {
    // First, protect code blocks from math processing
    const codeBlockPlaceholders: string[] = [];
    let placeholderIndex = 0;
    
    html = html.replace(/<pre[^>]*>[\s\S]*?<\/pre>/g, (match) => {
      const placeholder = `__CODE_BLOCK_${placeholderIndex}__`;
      codeBlockPlaceholders.push(match);
      placeholderIndex++;
      return placeholder;
    });
    
    // Process block math ($$...$$)
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        const normalized = normalizeMathNotation(math.trim());
        return katex.renderToString(normalized, { displayMode: true, throwOnError: false });
      } catch (error) {
        console.warn('KaTeX block math error:', error);
        return match;
      }
    });

    // Process inline math ($...$)
    html = html.replace(/\$([^$\n]+?)\$/g, (match, math) => {
      try {
        const normalized = normalizeMathNotation(math.trim());
        return katex.renderToString(normalized, { displayMode: false, throwOnError: false });
      } catch (error) {
        console.warn('KaTeX inline math error:', error);
        return match;
      }
    });
    
    // Restore code blocks
    codeBlockPlaceholders.forEach((codeBlock, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, codeBlock);
    });

    return html;
  };

  useEffect(() => {
    if (!parserRef.current) return;

    try {
      setIsLoading(true);
      // Normalize math notation before parsing
      const normalizedContent = normalizeMathNotation(content);
      const parsedHtml = parserRef.current.parse(normalizedContent);
      
      // Render math expressions
      let htmlWithMath = renderMath(parsedHtml);
      
      let sanitizedHtml = DOMPurify.sanitize(htmlWithMath, {
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
          'math', 'mrow', 'mi', 'mo', 'mn', 'msub', 'msup', 'mfrac', 'mroot', 'mover', 'munder', 'munderover', 'mtable', 'mtr', 'mtd', 'mtext', 'menclose', 'mspace', 'mpadded', 'mphantom', 'maction', 'semantics', 'annotation', 'annotation-xml',
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'id',
          'target', 'rel', 'loading',
          'aria-label', 'aria-hidden',
          'type', 'checked', 'disabled',
          'fill', 'viewBox', 'fill-rule', 'clip-rule', 'd',
          'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'stroke',
          'frameborder', 'allowfullscreen', 'allow',
          'style', 'data-*', 'role', 'tabindex', 'focusable',
        ],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true,
      });

      // Post-process to ensure all external links have target="_blank" and rel="noopener noreferrer"
      sanitizedHtml = sanitizedHtml.replace(/<a\s+([^>]*?)href="([^"]+)"([^>]*?)>(.*?)<\/a>/gs, (match, beforeHref, href, afterHref, content) => {
        // Skip anchor links (internal page navigation)
        if (href.startsWith('#')) {
          return match;
        }
        
        // Check if target and rel already exist
        const hasTarget = beforeHref.includes('target=') || afterHref.includes('target=');
        const hasRel = beforeHref.includes('rel=') || afterHref.includes('rel=');
        
        if (!hasTarget && !hasRel) {
          // Add both target and rel
          return `<a ${beforeHref}href="${href}"${afterHref} target="_blank" rel="noopener noreferrer">${content}</a>`;
        } else if (!hasTarget) {
          // Add target only
          return `<a ${beforeHref}href="${href}"${afterHref} target="_blank">${content}</a>`;
        } else if (!hasRel) {
          // Add rel only
          return `<a ${beforeHref}href="${href}"${afterHref} rel="noopener noreferrer">${content}</a>`;
        }
        return match;
      });

      setHtmlContent(sanitizedHtml);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setHtmlContent('<div class="error text-destructive">Error parsing markdown content</div>');
      setIsLoading(false);
    }
  }, [content]);

  // Re-render math after HTML is set (for dynamic content)
  useEffect(() => {
    if (htmlContent && containerRef.current) {
      const mathElements = containerRef.current.querySelectorAll('.katex, [class*="katex"]');
      if (mathElements.length === 0) {
        // If no KaTeX elements found, try to render math in the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textNodes: Node[] = [];
        const walker = document.createTreeWalker(
          tempDiv,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // Skip if parent is code, pre, or script
              const parent = node.parentElement;
              if (parent && (parent.tagName === 'CODE' || parent.tagName === 'PRE' || parent.tagName === 'SCRIPT')) {
                return NodeFilter.FILTER_REJECT;
              }
              // Check if node contains math delimiters
              if (node.textContent && (/\$[^$\n]+\$/.test(node.textContent) || /\$\$[\s\S]+\$\$/.test(node.textContent))) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            }
          }
        );
        
        let node;
        while ((node = walker.nextNode())) {
          textNodes.push(node);
        }
        
        // This is a fallback - the main rendering happens in renderMath above
      }
    }
  }, [htmlContent]);

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
