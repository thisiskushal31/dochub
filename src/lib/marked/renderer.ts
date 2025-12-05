import { marked } from 'marked';

export class Renderer {
  private marked: typeof marked;
  private openLinksInNewTab: boolean;

  constructor(openLinksInNewTab: boolean = false) {
    this.marked = marked;
    this.openLinksInNewTab = openLinksInNewTab;
    this.setupMarked();
  }

  private setupMarked(): void {
    this.marked.setOptions({
      gfm: true,
      breaks: false,
    });
  }

  parse(markdown: string): string {
    try {
      let html = this.marked.parse(markdown) as string;
      html = this.enhanceWithGitHubStyling(html);
      return html;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<div class="error">Error parsing markdown content</div>';
    }
  }

  private enhanceWithGitHubStyling(html: string): string {
    html = this.processCustomEmbeds(html);

    // Headings with anchor links
    html = html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, content) => {
      const cleanContent = content.replace(/<[^>]*>/g, '');
      const id = this.slugify(cleanContent);
      const headingClass = this.getHeadingClass(parseInt(level));

      return `
        <h${level} id="user-content-${id}" class="group relative scroll-mt-20 ${headingClass}">
          <a
            class="anchor absolute -ml-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Link to this section"
            href="#${id}"
          >
            <svg class="octicon octicon-link" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
            </svg>
          </a>
          <span>${content}</span>
        </h${level}>
      `;
    });

    // Code blocks with language
    html = html.replace(/<pre><code class="language-([^"]+)"[^>]*>(.*?)<\/code><\/pre>/gs, (match, lang, code) => {
      const trimmedCode = code.replace(/^\s+/, '');
      return `<div class="highlight highlight-${lang} notranslate">
<pre class="notranslate"><code class="language-${lang}">${trimmedCode}</code></pre>
</div>`;
    });

    // Code blocks without language
    html = html.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, (match, code) => {
      const trimmedCode = code.replace(/^\s+/, '');
      return `<div class="highlight notranslate">
<pre class="notranslate"><code>${trimmedCode}</code></pre>
</div>`;
    });

    // Inline code
    html = html.replace(/<code>(.*?)<\/code>/g, '<code class="notranslate">$1</code>');

    // Tables
    html = html.replace(/<table>/g, '<div class="table-wrapper"><table class="highlight tab-size js-file-line-container">');
    html = html.replace(/<\/table>/g, '</table></div>');

    // Blockquotes
    html = html.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 my-4 text-muted-foreground bg-muted/50 rounded-r-lg py-2">');

    // Links
    if (this.openLinksInNewTab) {
      html = html.replace(/<a\s+([^>]*?)href="([^"]+)"([^>]*?)>([^<]+)<\/a>/g, (match, beforeHref, href, afterHref, text) => {
        if (!beforeHref.includes('target=') && !afterHref.includes('target=')) {
          return `<a ${beforeHref}href="${href}"${afterHref} target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        return match;
      });

      html = html.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, (match, href, text) => {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });
    }

    // Images
    html = html.replace(/<img src="([^"]+)" alt="([^"]*)"(?: title="([^"]*)")?>/g, (match, src, alt, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `
        <div class="image-wrapper">
          <img src="${src}" alt="${alt}"${titleAttr} class="max-w-full h-auto border border-border rounded-lg shadow-sm">
        </div>
      `;
    });

    return html;
  }

  private getHeadingClass(level: number): string {
    const classes: Record<number, string> = {
      1: 'text-3xl font-bold mb-4 mt-6 border-b border-border pb-2',
      2: 'text-2xl font-semibold mb-4 mt-6 border-b border-border pb-2',
      3: 'text-xl font-semibold mb-3 mt-5',
      4: 'text-lg font-semibold mb-3 mt-4',
      5: 'text-base font-semibold mb-2 mt-3',
      6: 'text-sm font-semibold mb-2 mt-3 text-muted-foreground'
    };
    return classes[level] || 'text-base font-semibold mb-2 mt-3';
  }

  private processCustomEmbeds(html: string): string {
    // YouTube embeds: @youtube[videoId]
    html = html.replace(/@youtube\[([^\]]+)\]/g, (match, videoId) => {
      return `<div class="youtube-embed-placeholder" data-video-id="${videoId}"></div>`;
    });

    // Gist embeds: @gist[gistId]
    html = html.replace(/@gist\[([^\]]+)\]/g, (match, gistId) => {
      return `<div class="gist-embed-wrapper my-6" data-gist-id="${gistId}"><div class="gist-loading">Loading Gist...</div></div>`;
    });

    return html;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export default Renderer;
