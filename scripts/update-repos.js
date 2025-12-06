#!/usr/bin/env node
/**
 * Update cloned repositories by pulling latest changes
 * This script updates existing cloned repositories instead of re-cloning everything
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPOS_DIR = 'public/repos';
const CONFIG_FILE = 'src/config/repositories.ts';

// Helper to get absolute paths
function getReposDir() {
  return path.join(__dirname, '..', REPOS_DIR);
}

function getConfigPath() {
  return path.join(__dirname, '..', CONFIG_FILE);
}

// Read and parse the repositories config
function getRepositories() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
  const repos = [];
  
  // Extract repository configurations
  const repoMatch = configContent.match(/export const repositories:\s*RepositoryConfig\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (repoMatch) {
    const repoObjects = repoMatch[1].match(/\{[\s\S]*?\}/g) || [];
    
    for (const repoObj of repoObjects) {
      const idMatch = repoObj.match(/id:\s*['"`]([^'"`]+)['"`]/);
      const ownerMatch = repoObj.match(/owner:\s*['"`]([^'"`]+)['"`]/);
      const repoMatch = repoObj.match(/repo:\s*['"`]([^'"`]+)['"`]/);
      const branchMatch = repoObj.match(/branch:\s*['"`]([^'"`]+)['"`]/);
      const basePathMatch = repoObj.match(/basePath:\s*['"`]([^'"`]+)['"`]/);
      
      if (idMatch && ownerMatch && repoMatch && branchMatch) {
        repos.push({
          id: idMatch[1],
          owner: ownerMatch[1],
          repo: repoMatch[1],
          branch: branchMatch[1],
          basePath: basePathMatch ? basePathMatch[1] : undefined,
        });
      }
    }
  }
  
  if (repos.length === 0) {
    console.error('No valid repositories found in config file');
    console.error('Make sure repositories array contains objects with: id, owner, repo, branch');
    process.exit(1);
  }
  
  return repos;
}

// Update a single repository
function updateRepo(repo) {
  const repoDir = path.join(getReposDir(), repo.id);
  const tempDir = path.join(repoDir, 'temp');
  
  const repoName = repo.name || repo.id;
  console.log(`\n🔄 Updating ${repoName}...`);
  console.log(`   Repository: ${repo.owner}/${repo.repo}`);
  console.log(`   Branch: ${repo.branch}`);
  
  // Check if repo directory exists
  if (!fs.existsSync(repoDir)) {
    console.log(`   ⚠️  Repository not cloned yet. Run 'npm run clone-repos' first.`);
    return false;
  }
  
  // Check if temp directory exists (partial clone)
  if (fs.existsSync(tempDir)) {
    console.log(`   🧹 Cleaning up existing temp directory...`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  const repoUrl = `https://github.com/${repo.owner}/${repo.repo}.git`;
  
  try {
    // Clone fresh copy to temp directory
    console.log(`   📥 Cloning latest changes...`);
    execSync(`git clone --depth 1 --branch ${repo.branch} ${repoUrl} "${tempDir}"`, {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..'),
    });
    
    // Remove old markdown files (keep tree.json files)
    console.log(`   🗑️  Removing old markdown files...`);
    const files = fs.readdirSync(repoDir, { recursive: true, withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && /\.(md|mdx|markdown)$/i.test(file.name) && !file.name.includes('temp')) {
        const filePath = path.join(repoDir, file.name);
        fs.unlinkSync(filePath);
      }
    }
    
    // Copy new markdown files
    console.log(`   📋 Copying updated markdown files...`);
    const basePath = repo.basePath || '';
    const sourceDir = basePath ? path.join(tempDir, basePath) : tempDir;
    
    if (!fs.existsSync(sourceDir)) {
      console.log(`   ⚠️  Base path not found: ${basePath}`);
      fs.rmSync(tempDir, { recursive: true, force: true });
      return false;
    }
    
    function copyMarkdownFiles(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip hidden files, git files, and temp directory
        if (entry.name.startsWith('.') || entry.name === 'temp' || entry.name === 'node_modules') {
          continue;
        }
        
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyMarkdownFiles(srcPath, destPath);
        } else if (entry.isFile() && /\.(md|mdx|markdown)$/i.test(entry.name)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyMarkdownFiles(sourceDir, repoDir);
    
    // Regenerate tree.json files
    console.log(`   🌳 Regenerating file tree...`);
    try {
      execSync(`node scripts/generate-tree.js "${repoDir}" "${path.join(repoDir, 'tree.json')}"`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..'),
      });
    } catch (err) {
      console.error(`   ❌ Failed to generate root tree.json:`, err.message);
    }
    
    // Generate tree.json for subdirectories
    function generateSubTrees(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'temp') {
          const subdir = path.join(dir, entry.name);
          const treeJsonPath = path.join(subdir, 'tree.json');
          
          try {
            execSync(`node scripts/generate-tree.js "${subdir}" "${treeJsonPath}"`, {
              stdio: 'pipe',
              cwd: path.join(__dirname, '..'),
            });
          } catch (err) {
            // Ignore errors for subdirectories
          }
          
          // Recursively process subdirectories
          generateSubTrees(subdir);
        }
      }
    }
    
    generateSubTrees(repoDir);
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log(`   ✅ Updated ${repo.id}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed to update ${repo.id}:`, error.message);
    
    // Clean up temp directory on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    return false;
  }
}

// Main execution
console.log('🔄 Starting repository update process...');
console.log(`   Reading config from: ${CONFIG_FILE}`);

const repositories = getRepositories();

if (repositories.length === 0) {
  console.error('❌ No repositories found in config');
  process.exit(1);
}

console.log(`\n📚 Found ${repositories.length} repository(ies) to update:`);
repositories.forEach((repo, index) => {
  console.log(`   ${index + 1}. ${repo.id} (${repo.owner}/${repo.repo})`);
});

// Update each repository
let successCount = 0;
let failCount = 0;

for (const repo of repositories) {
  if (updateRepo(repo)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\n✨ Repository update completed!`);
console.log(`   ✅ Success: ${successCount}`);
if (failCount > 0) {
  console.log(`   ❌ Failed: ${failCount}`);
}

// Exit with appropriate code
if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

