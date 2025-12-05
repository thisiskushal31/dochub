import React, { useState } from 'react';
import { Play, AlertTriangle } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    if (isLoaded || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 300);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`youtube-embed-wrapper ${className}`}>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Video unavailable</h3>
          <p className="text-destructive/80 mb-4">This video cannot be displayed.</p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch on YouTube
          </a>
        </div>
      </div>
    );
  }

  if (isLoaded) {
    return (
      <div className={`youtube-embed-wrapper ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`youtube-embed-wrapper ${className}`}>
      <div
        className="relative cursor-pointer rounded-lg overflow-hidden bg-secondary"
        style={{ paddingBottom: '56.25%' }}
        onClick={handleClick}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="YouTube video thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          onError={handleError}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
          <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white" />
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-sm text-white/90">
            {isLoading ? 'Loading video...' : 'Click to load YouTube video'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
