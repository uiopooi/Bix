'use client';

import { useEffect, useState, useRef } from 'react';
import VideoCard from '@/components/video/VideoCard';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { mockVideos } from '@/lib/mockData';

export default function FeedPage() {
  const { user, loading, isGuest } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState(mockVideos);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Auth check effect
  useEffect(() => {
    console.log("Feed page - Auth state:", { 
      user: user ? user.uid : null, 
      loading, 
      isGuest
    });

    // We'll always have a user now (either real or guest)
    if (!loading) {
      setCheckingAuth(false);
      setShouldRender(true);
    }
  }, [user, loading, isGuest]);

  // Scroll to current video when index changes
  useEffect(() => {
    if (shouldRender && feedContainerRef.current) {
      const videoElements = feedContainerRef.current.querySelectorAll('.video-item');
      if (videoElements[currentVideoIndex]) {
        videoElements[currentVideoIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentVideoIndex, shouldRender]);

  // Handle scrolling to next video
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // Loop back to the first video
      setCurrentVideoIndex(0);
    }
  };

  // Create a simple loading component
  const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="ml-3 text-indigo-500">Loading feed...</p>
    </div>
  );

  // Show loading state while checking authentication
  if (typeof window === 'undefined') {
    // We're on the server, return a simple loading state
    return <LoadingScreen />;
  }

  if (loading || checkingAuth) {
    return <LoadingScreen />;
  }

  // Don't render if not authenticated
  if (!shouldRender) {
    return null;
  }

  // User is authenticated (either through Firebase or as a guest)
  console.log("Rendering feed for user:", user?.uid || "guest user");
  
  return (
    <div className="h-screen bg-black">
      {isGuest && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 p-2 text-center text-black text-sm">
          You are browsing as a guest. Some features may be limited.
        </div>
      )}
      
      {/* Main feed with vertical snap scrolling */}
      <div 
        ref={feedContainerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="video-item h-screen w-full snap-start">
            <VideoCard 
              video={video} 
              autoPlay={index === currentVideoIndex}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        ))}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}