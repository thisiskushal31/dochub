# Documentation Hub

A modern, production-ready documentation website that fetches and displays markdown files from multiple GitHub repositories. Built with React, TypeScript, and Vite. Features clean design, multi-repository support, and GitHub Flavored Markdown (GFM) rendering.

## 🚀 Features

- **React 18** + **TypeScript** for type-safe development
- **Vite** for fast builds and development
- **Tailwind CSS** for responsive styling
- **GitHub Flavored Markdown** with syntax highlighting (Prism.js)
- **Multi-Repository Support** - Browse documentation from multiple GitHub repos
- **Theme switching** (Light/Dark mode)
- **Full-text search** across all repositories
- **File tree navigation** with lazy loading
- **Table of contents** auto-generation
- **GitHub Pages** deployment ready
- **Centralized Configuration** - All site info configurable from one JSON file

## 📁 Project Structure

```
dochub/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── DocumentView.tsx
│   │   ├── FileTree.tsx
│   │   ├── MarkdownViewer.tsx
│   │   ├── RepositorySelector.tsx
│   │   ├── SEOHead.tsx  # Dynamic SEO meta tags
│   │   └── ...
│   ├── config/          # Configuration files
│   │   ├── site.json    # Centralized site configuration
│   │   ├── config.ts    # Config exports
│   │   └── repositories.ts  # Repository configurations
│   ├── hooks/           # Custom React hooks
│   │   └── useTheme.tsx
│   ├── lib/             # Libraries
│   │   └── marked/      # Markdown renderer (from blog)
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   │   └── markdown.css # Markdown styling (from blog)
│   ├── utils/           # Utility functions
│   │   └── github.ts    # GitHub API utilities
│   └── App.tsx
├── public/
│   └── repositories.json # Repository config (optional)
└── package.json
```

## ⚙️ Configuration

### Centralized Site Configuration

All website information is configurable from a single JSON file: `src/config/site.json`

This centralized configuration system makes it easy to update site information, SEO settings, and features without modifying multiple files.

#### Configuration File Structure

The `src/config/site.json` file contains:

1. **Site Information (`site`)**
   - `name`: Full site name
   - `shortName`: Short name for mobile/PWA
   - `description`: Site description
   - `url`: Base URL of the site
   - `basePath`: Base path for routing (usually `/`)
   - `ogImage`: Open Graph image URL
   - `favicon`: Favicon path

2. **SEO Configuration (`seo`)**
   - `title`: Page title
   - `description`: Meta description
   - `keywords`: SEO keywords (comma-separated)
   - `author`: Site author
   - `googleSiteVerification`: Google Search Console verification code
   - `robots`: Robots meta tag content
   - `canonical`: Canonical URL

3. **Personal Information (`personal`)**
   - `name`: Your name
   - `title`: Your professional title
   - `bio`: Short bio
   - `location`: Location
   - `avatar`: Avatar image path
   - `email`: Email address

4. **Website Links (`websites`)**
   - `portfolio`: Portfolio URL
   - `blog`: Blog URL
   - `publicProfile`: Public profile URL
   - `documentationHub`: Documentation hub URL

5. **Social Links (`social`)**
   - `github`: GitHub profile URL
   - `linkedin`: LinkedIn profile URL
   - `twitter`: Twitter/X profile URL
   - `email`: Email link
   - `website`: Personal website URL

6. **Manifest Configuration (`manifest`)**
   - PWA manifest settings (name, description, theme colors, etc.)

7. **Features Configuration (`features`)**
   - `enableSearch`: Enable/disable search feature
   - `enableDarkMode`: Enable/disable dark mode
   - `enableTableOfContents`: Enable/disable TOC
   - `enableRepositorySwitching`: Enable/disable repo switching
   - `searchPlaceholder`: Search input placeholder text
   - `defaultTheme`: Default theme (`light`, `dark`, or `system`)

### Using Configuration in Components

Import config exports:

```typescript
import { SITE_CONFIG, SEO_CONFIG, FEATURES_CONFIG, PERSONAL_INFO, SOCIAL_LINKS } from '@/config/config';
```

Examples:

```typescript
// Use site name
<SITE_CONFIG.name>

// Use SEO description
<SEO_CONFIG.description>

// Use feature flags
{FEATURES_CONFIG.enableSearch && <SearchComponent />}

// Use personal info
<PERSONAL_INFO.name>

// Use social links
<a href={SOCIAL_LINKS.github}>GitHub</a>
```

### Dynamic SEO Meta Tags

The `SEOHead` component automatically updates meta tags based on the configuration:

```typescript
import SEOHead from '@/components/SEOHead';

// In your App component
<SEOHead />
```

This component:
- Updates document title
- Sets all SEO meta tags
- Updates Open Graph tags
- Updates Twitter Card tags
- Sets canonical URL

### Editing Configuration

Simply edit `src/config/site.json` to update:
- Site name and description
- SEO meta tags
- Social media links
- Personal information
- Feature toggles

The changes will automatically be reflected throughout the application.

**Note**: Keep `public/manifest.json` in sync with the `manifest` section in `site.json` when making changes.

### Repository Configuration

Repositories are configured in `src/config/repositories.ts`:

```typescript
export const repositories: RepositoryConfig[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    owner: 'thisiskushal31',
    repo: 'Datastructures-and-Algorithms',
    branch: 'main',
    description: 'DSA notes and solutions',
    icon: '📚'
  },
  // Add more repositories...
];
```

## 📝 Adding a New Repository

Edit `src/config/repositories.ts` and add a new repository configuration:

```typescript
export const repositories: RepositoryConfig[] = [
  // ... existing repositories
  {
    id: 'new-repo',
    name: 'New Repository',
    owner: 'username',
    repo: 'repo-name',
    branch: 'main',
    description: 'Repository description',
    icon: '📦'
  },
];
```

The website will automatically:
- Fetch the file tree from the repository
- Allow browsing markdown files
- Convert relative image paths to GitHub raw URLs
- Include the repository in search results

## 🛠️ Development

### Quick Start (Automatic Setup)

The dev server automatically checks and clones repositories if needed:

```bash
# Install dependencies
npm install

# Start development server (automatically clones repos if needed)
npm run dev
```

**What happens:**
1. ✅ Checks if `public/repos/` exists with all repositories
2. ✅ If missing, automatically clones all repos from `src/config/repositories.ts`
3. ✅ Shows status messages during cloning
4. ✅ Starts dev server (uses local files if available, falls back to API if cloning failed)

**You'll see:**
- `🔍 Checking for local repository files...`
- `✅ Local repositories found. Starting dev server...` (if repos exist)
- OR `📦 Local repositories not found.` → `🚀 Cloning repositories...` (if missing)

### Full Setup (With Local Repository Files)

For a production-like experience with static files:

```bash
# Install dependencies
npm install

# Clone repositories and copy files (optional, for local dev)
npm run clone-repos

# Start development server
npm run dev
```

This will:
- Clone all repositories from `src/config/repositories.ts`
- Copy markdown files to `public/repos/`
- Generate file tree JSON files
- Serve files locally (no API calls needed)

### Updating Cloned Repositories

When source repositories are updated, you can update the cloned files:

```bash
# Update all cloned repositories with latest changes
npm run update-repos
```

This will:
- Pull latest changes from each source repository
- Update markdown files in `public/repos/`
- Regenerate file tree JSON files
- Preserve existing structure (only updates changed files)

**Note:** The CI/CD workflow automatically updates repositories on each deployment, so manual updates are only needed for local development.

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Markdown Rendering

The markdown rendering system is copied from the [blog repository](https://github.com/thisiskushal31/blog):
- Uses `marked` library for parsing
- Prism.js for syntax highlighting
- DOMPurify for HTML sanitization
- Supports GitHub Flavored Markdown (tables, strikethrough, task lists)
- Custom embeds: YouTube and GitHub Gists
- Linkable headers with anchor links

## 📝 File Naming & Display

The documentation hub automatically processes file names for cleaner display in the sidebar. Here's how it works:

### Display Name Processing

The `getFileDisplayName()` function cleans up filenames in 3 steps:

1. **Remove file extension**: Strips `.md`, `.mdx`, or `.markdown`
2. **Replace separators**: Converts `-` and `_` to spaces
3. **Remove leading numbers**: Strips numbered prefixes like `01-`, `02_`, etc.

### Examples

| Actual Filename | Display Name |
|----------------|--------------|
| `01-Array_&_String.md` | `Array & String` |
| `02-Linked_List.md` | `Linked List` |
| `docker.md` | `docker` |
| `README.md` | `README` |
| `my-awesome-guide.md` | `my awesome guide` |
| `10_Binary_Tree.md` | `Binary Tree` |

### How File Mapping Works

The system uses two pieces of information from GitHub's API:

- **`node.name`**: Just the filename (e.g., `"01-Array_&_String.md"`)
- **`node.path`**: Full path from repo root (e.g., `"DataStructures/01-Array_&_String.md"`)

**Important**: 
- The **display name** is only for UI presentation
- The **actual file path** (`node.path`) is always used to fetch content from GitHub
- This ensures files are fetched correctly regardless of how they're displayed

### File Selection Flow

```typescript
// 1. GitHub API returns file with both name and path
{
  name: "01-Array_&_String.md",                    // Just filename
  path: "DataStructures/01-Array_&_String.md",    // Full path
  type: "file"
}

// 2. Display: Clean up the name for UI
displayName = getFileDisplayName(node.name)
// Result: "Array & String"

// 3. Click: Use the FULL PATH to fetch the file
onSelectFile(node.path)  // Uses "DataStructures/01-Array_&_String.md"
```

### Supported Filename Formats

The system handles any filename format:
- ✅ Numbered prefixes: `01-file.md`, `02_file.md`
- ✅ No prefixes: `docker.md`, `README.md`
- ✅ Dashes and underscores: `my-file.md`, `my_file.md`
- ✅ Mixed formats: `01-My_File.md`

All formats work correctly - the display name is cleaned for readability, but the actual file path is always preserved for fetching.

## 🔄 Real-Time Updates

### How Changes Work

## 🔄 How Content Updates Work

### Normal Browsing (Default - No API Calls)
- Files are served from static copies in `public/repos/{repoId}/`
- These are cloned and copied during CI/CD build
- **Fast, no rate limits, works offline**
- Updates when you push to main branch (triggers CI)

### Live Updates (When You Click "Refresh")
- Fetches fresh content from `raw.githubusercontent.com`
- Uses GitHub API (rate limited, but only when explicitly requested)
- Updates cache for faster future access
- Shows latest changes immediately

### CI/CD Build Process
1. Updates or clones all repositories from `src/config/repositories.ts` (uses `update-repos.js` if repos exist, otherwise `clone-repos.js`)
2. Copies markdown files to `public/repos/{repoId}/`
3. Generates `tree.json` files for file tree navigation
4. Generates sitemap.xml
5. Builds the site with static files
6. Deploys to GitHub Pages

**To update content**: 
- **Automatic (Scheduled)**: The workflow `update-content.yaml` runs daily at 2 AM UTC to check for updates
- **Manual (GitHub Actions)**: Go to Actions → "Update Content from Source Repositories" → "Run workflow" to manually trigger an update
- **Manual (Local)**: Run `npm run update-repos` to update cloned repositories locally, then commit and push the updated `public/repos/` directory
- **Via Webhook**: Set up a webhook in your source repositories to trigger `repository_dispatch` events (see setup below)

---

### How to See Latest Changes

**Method 1: Refresh Button (Recommended)**
1. Open the document you want to update
2. Click the **"Refresh"** button in the top-right corner
3. This forces a fresh fetch from GitHub, bypassing all caches

**Method 2: Reload Page**
- Simply reload the browser page (F5 or Cmd+R)
- Navigate back to the document

**Method 3: Hard Refresh**
- Use **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
- This clears browser cache and fetches fresh content

### Cache-Busting

The app includes cache-busting mechanisms:
- **Query Parameters**: When you click "Refresh", a timestamp is added to the URL
- **Fetch Options**: Uses `cache: 'no-store'` for forced refreshes

### Refresh Button Features

- ✅ Bypasses browser cache
- ✅ Bypasses GitHub CDN cache
- ✅ Shows last update time
- ✅ Provides visual feedback (spinner while loading)
- ✅ Always fetches latest content from GitHub

---

## 🔔 Automatic Content Updates

The documentation hub can automatically update when source repositories change. Here are the available methods:

### Method 1: Scheduled Updates (Automatic)
- The `update-content.yaml` workflow runs **daily at 2 AM UTC**
- Automatically checks for updates in all source repositories
- Updates and redeploys if changes are found
- **No action needed** - works automatically

### Method 2: Manual Trigger (GitHub Actions)
1. Go to **Actions** tab in the `dochub` repository
2. Select **"Update Content from Source Repositories"**
3. Click **"Run workflow"** → **"Run workflow"**
4. This will immediately check for updates and redeploy

### Method 3: Webhook Setup (Real-Time Updates)
To trigger updates immediately when you push to source repositories:

1. **Go to your source repository** (e.g., `Datastructures-and-Algorithms`)
2. **Settings → Webhooks → Add webhook**
3. **Configure:**
   - **Payload URL**: `https://api.github.com/repos/thisiskushal31/dochub/dispatches`
   - **Content type**: `application/json`
   - **Secret**: (optional)
   - **Events**: Select "Just the push event"
   - **Active**: ✅ Checked

4. **Add authentication** (if needed):
   - The workflow uses `GITHUB_TOKEN` which should work automatically
   - For custom tokens, add as secret `SOURCE_REPO_TOKEN`

**Note**: The scheduled daily update ensures content stays fresh even without webhooks.

---

## Copyright and Licensing

© 2025 Kushal Gupta. All Rights Reserved.

The source code and all content within this repository are the exclusive property of Kushal Gupta. This content is not to be used, reproduced, or distributed without explicit permission.

## About

A public repository containing the website code for my personal documentation hub. All code is for my exclusive use and is not licensed for public distribution.

**Live Site**: [https://thisiskushal31.github.io/dochub/](https://thisiskushal31.github.io/dochub/)
