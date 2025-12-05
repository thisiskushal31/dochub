import { useEffect } from 'react';
import { SEO_CONFIG, SITE_CONFIG, PERSONAL_INFO } from '@/config/config';

/**
 * SEOHead Component
 * Dynamically updates meta tags and document title based on config
 */
const SEOHead: React.FC = () => {
  useEffect(() => {
    // Update document title
    document.title = SEO_CONFIG.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateMetaTag('description', SEO_CONFIG.description);
    updateMetaTag('author', SEO_CONFIG.author);
    updateMetaTag('keywords', SEO_CONFIG.keywords);
    updateMetaTag('robots', SEO_CONFIG.robots);
    updateMetaTag('google-site-verification', SEO_CONFIG.googleSiteVerification);
    updateMetaTag('canonical', SEO_CONFIG.canonical);

    // Open Graph meta tags
    updateMetaTag('og:title', SEO_CONFIG.title, true);
    updateMetaTag('og:description', SEO_CONFIG.description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:image', SITE_CONFIG.ogImage, true);
    updateMetaTag('og:url', SITE_CONFIG.url, true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', SEO_CONFIG.title);
    updateMetaTag('twitter:description', SEO_CONFIG.description);
    updateMetaTag('twitter:image', SITE_CONFIG.ogImage);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', SEO_CONFIG.canonical);

    // Update theme color
    updateMetaTag('theme-color', '#ffffff');
  }, []);

  return null; // This component doesn't render anything
};

export default SEOHead;

