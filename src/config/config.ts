// Documentation Hub global configuration
// Central place to change all site-specific settings
// For comprehensive site management, see site.json

import siteData from './site.json';

// ===== SITE CONFIG =====
export const SITE_CONFIG = {
  name: siteData.site.name,
  shortName: siteData.site.shortName,
  description: siteData.site.description,
  url: siteData.site.url,
  basePath: siteData.site.basePath,
  ogImage: siteData.site.ogImage,
  favicon: siteData.site.favicon,
};

// ===== SEO CONFIG =====
export const SEO_CONFIG = {
  title: siteData.seo.title,
  description: siteData.seo.description,
  keywords: siteData.seo.keywords,
  author: siteData.seo.author,
  googleSiteVerification: siteData.seo.googleSiteVerification,
  robots: siteData.seo.robots,
  canonical: siteData.seo.canonical,
};

// ===== PERSONAL INFO =====
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatar: string;
  email: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: siteData.personal.name,
  title: siteData.personal.title,
  bio: siteData.personal.bio,
  location: siteData.personal.location,
  avatar: siteData.personal.avatar,
  email: siteData.personal.email,
};

// ===== WEBSITE LINKS =====
export const WEBSITE_LINKS = {
  portfolio: siteData.websites.portfolio,
  blog: siteData.websites.blog,
  publicProfile: siteData.websites.publicProfile,
  documentationHub: siteData.websites.documentationHub,
};

// ===== SOCIAL LINKS =====
export const SOCIAL_LINKS = {
  github: siteData.social.github,
  linkedin: siteData.social.linkedin,
  twitter: siteData.social.twitter,
  email: siteData.social.email,
  website: siteData.social.website,
};

// ===== MANIFEST CONFIG =====
export const MANIFEST_CONFIG = {
  name: siteData.manifest.name,
  short_name: siteData.manifest.short_name,
  description: siteData.manifest.description,
  start_url: siteData.manifest.start_url,
  display: siteData.manifest.display,
  background_color: siteData.manifest.background_color,
  theme_color: siteData.manifest.theme_color,
  lang: siteData.manifest.lang,
};

// ===== FEATURES CONFIG =====
export const FEATURES_CONFIG = {
  enableSearch: siteData.features.enableSearch,
  enableDarkMode: siteData.features.enableDarkMode,
  enableTableOfContents: siteData.features.enableTableOfContents,
  enableRepositorySwitching: siteData.features.enableRepositorySwitching,
  searchPlaceholder: siteData.features.searchPlaceholder,
  defaultTheme: siteData.features.defaultTheme,
};

// ===== CENTRALIZED SITE DATA EXPORT =====
export const SITE_DATA = siteData;

// Export individual sections for easy access
export const SITE_INFO = siteData.site;
export const SEO_INFO = siteData.seo;
export const PERSONAL = siteData.personal;
export const WEBSITES = siteData.websites;
export const SOCIAL = siteData.social;
export const MANIFEST = siteData.manifest;
export const FEATURES = siteData.features;

