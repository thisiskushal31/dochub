#!/usr/bin/env node
/**
 * Clone repositories and copy markdown files to public/repos directory
 * Reads from src/config/repositories.ts and dynamically processes all repositories
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
  const configPath = path.resolve(__dirname, '..', CONFIG_FILE);
  
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }
  
  const configContent = fs.readFileSync(configPath, 'utf-8');
  
  // Extract repositories array - handle multiline and nested objects
  const repoMatch = configContent.match(/export const repositories:\s*RepositoryConfig\[\]\s*=\s*\[([\s\S]*?)\];/);
  
  if (!repoMatch) {
    console.error('Could not find repositories array in config file');
    console.error('Expected format: export const repositories: RepositoryConfig[] = [...]');
    process.exit(1);
  }
  
  const reposArrayContent = repoMatch[1];
  const repos = [];
  
  // More robust parsing - handle nested objects and multiline
  // Find all repository objects (handles nested braces)
  let depth = 0;
  let start = -1;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < reposArrayContent.length; i++) {
    const char = reposArrayContent[i];
    const prevChar = i > 0 ? reposArrayContent[i - 1] : '';
    
    // Handle string literals
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
      continue;
    }
    
    if (inString) continue;
    
    if (char === '{') {
      if (depth === 0) {
        start = i;
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const repoObj = reposArrayContent.substring(start, i + 1);
        
        // Extract fields with more flexible regex
        const idMatch = repoObj.match(/id:\s*['"`]([^'"`]+)['"`]/);
        const ownerMatch = repoObj.match(/owner:\s*['"`]([^'"`]+)['"`]/);
        const repoNameMatch = repoObj.match(/repo:\s*['"`]([^'"`]+)['"`]/);
        const branchMatch = repoObj.match(/branch:\s*['"`]([^'"`]+)['"`]/);
        const basePathMatch = repoObj.match(/basePath:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = repoObj.match(/name:\s*['"`]([^'"`]+)['"`]/);
        
        if (idMatch && ownerMatch && repoNameMatch && branchMatch) {
          repos.push({
            id: idMatch[1],
            owner: ownerMatch[1],
            repo: repoNameMatch[1],
            branch: branchMatch[1],
            basePath: basePathMatch ? basePathMatch[1] : '',
            name: nameMatch ? nameMatch[1] : idMatch[1],
          });
        } else {
          console.warn(`⚠️  Skipping invalid repository object (missing required fields)`);
        }
        
        start = -1;
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

// Clone repository and copy markdown files
function cloneAndCopyRepo(repo) {
  const repoDir = path.join(getReposDir(), repo.id);
  const tempDir = path.join(repoDir, 'temp');
  
  const repoName = repo.name || repo.id;
  console.log(`\n📦 Processing ${repoName}...`);
  console.log(`   Repository: ${repo.owner}/${repo.repo}`);
  console.log(`   Branch: ${repo.branch}`);
  if (repo.basePath) {
    console.log(`   Base Path: ${repo.basePath}`);
  }
  
  // Clean up existing directory
  if (fs.existsSync(repoDir)) {
    console.log(`   Cleaning existing directory...`);
    fs.rmSync(repoDir, { recursive: true, force: true });
  }
  fs.mkdirSync(repoDir, { recursive: true });
  
  // Clone repository
  const repoUrl = `https://github.com/${repo.owner}/${repo.repo}.git`;
  console.log(`   Cloning from ${repoUrl}...`);
  
    try {
      execSync(`git clone --depth 1 --branch ${repo.branch} ${repoUrl} "${tempDir}"`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
  } catch (error) {
    console.error(`   ⚠️  Failed to clone ${repo.owner}/${repo.repo}: ${error.message}`);
    return false;
  }
  
  if (!fs.existsSync(tempDir)) {
    console.error(`   ⚠️  Clone directory not found: ${tempDir}`);
    return false;
  }
  
  // Determine source directory (with basePath if specified)
  const sourceDir = repo.basePath 
    ? path.join(tempDir, repo.basePath.replace(/^\//, ''))
    : tempDir;
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`   ⚠️  Source directory not found: ${sourceDir}`);
    fs.rmSync(tempDir, { recursive: true, force: true });
    return false;
  }
  
  // Copy markdown files, preserving directory structure
  console.log(`   Copying markdown files...`);
  let fileCount = 0;
  
  function copyMarkdownFiles(src, dest, relativePath = '') {
    if (!fs.existsSync(src)) return;
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      // Skip hidden files, directories, and temp
      if (entry.name.startsWith('.') || entry.name === 'temp' || entry.name === 'node_modules') {
        continue;
      }
      
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyMarkdownFiles(srcPath, destPath, newRelativePath);
      } else if (entry.isFile()) {
        // Only copy markdown files
        if (/\.(md|mdx|markdown)$/i.test(entry.name)) {
          fs.copyFileSync(srcPath, destPath);
          fileCount++;
        }
      }
    }
  }
  
  copyMarkdownFiles(sourceDir, repoDir);
  console.log(`   ✅ Copied ${fileCount} markdown files`);
  
  // Generate file tree JSON for root
  console.log(`   Generating file tree...`);
  try {
      execSync(`node scripts/generate-tree.js "${repoDir}" "${path.join(repoDir, 'tree.json')}"`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
  } catch (error) {
    console.error(`   ⚠️  Failed to generate root tree.json: ${error.message}`);
  }
  
  // Generate tree.json for subdirectories
  function generateSubTrees(dir, basePath = '') {
    if (!fs.existsSync(dir)) return;
    
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
        } catch (error) {
          // Ignore errors for subdirectories
        }
        
        // Recursively process subdirectories
        generateSubTrees(subdir, path.join(basePath, entry.name));
      }
    }
  }
  
  generateSubTrees(repoDir);
  
  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  console.log(`   ✅ Completed ${repo.id}`);
  return true;
}

// Main execution
console.log('🚀 Starting repository cloning process...');
console.log(`   Reading config from: ${CONFIG_FILE}`);

const repositories = getRepositories();

if (repositories.length === 0) {
  console.error('❌ No repositories found in config');
  process.exit(1);
}

console.log(`\n📚 Found ${repositories.length} repository(ies) to process:`);
repositories.forEach((repo, index) => {
  console.log(`   ${index + 1}. ${repo.id} (${repo.owner}/${repo.repo})`);
});

// Create repos directory
const reposDirPath = getReposDir();
if (!fs.existsSync(reposDirPath)) {
  fs.mkdirSync(reposDirPath, { recursive: true });
}

// Process each repository
let successCount = 0;
let failCount = 0;

for (const repo of repositories) {
  if (cloneAndCopyRepo(repo)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\n✨ Repository cloning completed!`);
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

