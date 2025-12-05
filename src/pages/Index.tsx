import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { repositories, type RepositoryConfig, getRepositoryById } from '@/config/repositories';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SearchDialog from '@/components/SearchDialog';
import DocumentView from '@/components/DocumentView';
import WelcomeView from '@/components/WelcomeView';

const Index: React.FC = () => {
  const { repoId, '*': filePath } = useParams<{ repoId?: string; '*': string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedRepo, setSelectedRepo] = useState<RepositoryConfig>(repositories[0]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync URL params with state
  useEffect(() => {
    if (repoId) {
      const repo = getRepositoryById(repoId);
      if (repo) {
        setSelectedRepo(repo);
      }
    } else if (!repoId && location.pathname === '/') {
      // On root path, use default repo
      setSelectedRepo(repositories[0]);
    }
    
    if (filePath && filePath.trim()) {
      // Decode the file path (each segment was encoded separately)
      const decodedPath = filePath.split('/').map(segment => decodeURIComponent(segment)).join('/');
      setSelectedFile(decodedPath);
    } else {
      setSelectedFile(null);
    }
  }, [repoId, filePath, location.pathname]);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateUrl = useCallback((repoId: string, filePath: string | null) => {
    if (filePath) {
      // Encode the file path for URL (handle slashes by encoding each segment)
      // Split by /, encode each part, then join with /
      const encodedPath = filePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
      navigate(`/${repoId}/${encodedPath}`, { replace: true });
    } else {
      navigate(`/${repoId}`, { replace: true });
    }
  }, [navigate]);

  const handleSelectRepo = useCallback((repo: RepositoryConfig) => {
    setSelectedRepo(repo);
    setSelectedFile(null);
    updateUrl(repo.id, null);
  }, [updateUrl]);

  const handleSelectFile = useCallback((path: string) => {
    setSelectedFile(path);
    updateUrl(selectedRepo.id, path);
  }, [selectedRepo.id, updateUrl]);

  const handleSearchResult = useCallback((repoId: string, filePath: string) => {
    const repo = repositories.find(r => r.id === repoId);
    if (repo) {
      setSelectedRepo(repo);
      setSelectedFile(filePath);
      updateUrl(repoId, filePath);
    }
  }, [updateUrl]);

  const handleBack = useCallback(() => {
    setSelectedFile(null);
    updateUrl(selectedRepo.id, null);
  }, [selectedRepo.id, updateUrl]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedRepo={selectedRepo}
        onSelectRepo={handleSelectRepo}
        onSelectFile={handleSelectFile}
        selectedPath={selectedFile || undefined}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSearch={() => setSearchOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {selectedFile ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <DocumentView
                repoId={selectedRepo.id}
                filePath={selectedFile}
                onBack={handleBack}
              />
            </div>
          ) : (
            <WelcomeView onOpenSearch={() => setSearchOpen(true)} />
          )}
        </main>
      </div>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectResult={handleSearchResult}
      />
    </div>
  );
};

export default Index;
