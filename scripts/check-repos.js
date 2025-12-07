#!/usr/bin/env node
/**
 * Check if repositories are cloned locally
 * If not, automatically clone them
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPOS_DIR = 'public/repository';
const CONFIG_FILE = 'src/config/repositories.ts';

function checkReposExist() {
  const reposDirPath = path.join(__dirname, '..', REPOS_DIR);
  if (!fs.existsSync(reposDirPath)) {
    return false;
  }
  
  // Read config to see what repos should exist
  const configPath = path.join(__dirname, '..', CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const repoIds = [];
  
  // Extract repository IDs
  const repoMatch = configContent.match(/export const repositories:\s*RepositoryConfig\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (repoMatch) {
    const repoObjects = repoMatch[1].match(/\{[\s\S]*?\}/g) || [];
    for (const repoObj of repoObjects) {
      const idMatch = repoObj.match(/id:\s*['"`]([^'"`]+)['"`]/);
      if (idMatch) {
        repoIds.push(idMatch[1]);
      }
    }
  }
  
  // Check if all repos exist and have at least one markdown file
  for (const repoId of repoIds) {
    const repoDir = path.join(reposDirPath, repoId);
    const treeFile = path.join(repoDir, 'tree.json');
    
    if (!fs.existsSync(repoDir) || !fs.existsSync(treeFile)) {
      return false;
    }
    
    // Check if there are any markdown files (not just empty directory)
    const hasMarkdownFiles = fs.readdirSync(repoDir, { recursive: true, withFileTypes: true })
      .some(entry => entry.isFile() && /\.(md|mdx|markdown)$/i.test(entry.name));
    
    if (!hasMarkdownFiles) {
      return false;
    }
  }
  
  return repoIds.length > 0;
}

function main() {
  console.log('🔍 Checking for local repository files...');
  
  if (checkReposExist()) {
    console.log('✅ Local repositories found. Starting dev server...\n');
    return true;
  } else {
    console.log('📦 Local repositories not found.');
    console.log('🚀 Cloning repositories...\n');
    
    try {
      execSync('node scripts/clone-repos.js', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      console.log('\n✅ Repositories cloned successfully!');
      return true;
    } catch (error) {
      console.error('\n❌ Failed to clone repositories:', error.message);
      console.log('\n⚠️  Dev server will start but will use GitHub API (may hit rate limits)');
      console.log('💡 Run "npm run clone-repos" manually to clone repositories\n');
      return false;
    }
  }
}

// Run if executed directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                      process.argv[1]?.includes('check-repos.js');

if (isMainModule) {
  main();
  // Always exit with 0 so dev server can start even if cloning fails
  // (it will just use GitHub API instead)
  process.exit(0);
}

export { checkReposExist, main };

