#!/usr/bin/env node
/**
 * Generate file tree JSON from local repository directory
 * This creates a tree.json file that matches GitHub API structure
 */

import fs from 'fs';
import path from 'path';

const repoDir = process.argv[2];
const outputFile = process.argv[3];

if (!repoDir || !outputFile) {
  console.error('Usage: node generate-tree.js <repo-dir> <output-file>');
  process.exit(1);
}

function generateTree(dir, basePath = '', maxDepth = 10, currentDepth = 0) {
  const items = [];
  
  if (!fs.existsSync(dir) || currentDepth >= maxDepth) {
    return items;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip hidden files, directories, and tree.json
    if (entry.name.startsWith('.') || entry.name === 'tree.json' || entry.name === 'temp') {
      continue;
    }
    
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      const children = generateTree(fullPath, relativePath, maxDepth, currentDepth + 1);
      items.push({
        name: entry.name,
        path: relativePath,
        type: 'dir',
        sha: '', // Not needed for local files
        children: children.length > 0 ? children : undefined,
      });
    } else if (entry.isFile()) {
      // Only include markdown files
      if (/\.(md|mdx|markdown)$/i.test(entry.name)) {
        const stats = fs.statSync(fullPath);
        items.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          sha: '', // Not needed for local files
          size: stats.size,
        });
      }
    }
  }
  
  return items.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

try {
  const tree = generateTree(repoDir);
  const outputDir = path.dirname(outputFile);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(tree, null, 2));
  console.log(`Generated tree.json with ${tree.length} items`);
} catch (error) {
  console.error('Error generating tree:', error);
  process.exit(1);
}

