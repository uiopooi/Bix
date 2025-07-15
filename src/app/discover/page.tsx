'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/components/auth/AuthProvider';
import { mockVideos } from '@/lib/mockData';
import VideoCard from '@/components/video/VideoCard';
import BottomNav from '@/components/layout/BottomNav';

export default function DiscoverPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter videos based on search query
  const filteredVideos = mockVideos.filter(video => 
    video.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group videos by trending categories
  const categories = [
    { name: 'For You', videos: filteredVideos.slice(0, 4) },
    { name: 'Trending', videos: filteredVideos.slice(4, 8) },
    { name: 'Comedy', videos: filteredVideos.slice(2, 6) },
    { name: 'Music', videos: filteredVideos.slice(1, 5) },
  ];

  return (
    <div className="pb-20 pt-2 min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-center">Discover</h1>
      </div>
      
      <div className="px-4 my-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search videos, users, or hashtags"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {searchQuery ? (
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-3">Search Results</h2>
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredVideos.map((video) => (
                <div key={video.id} className="aspect-[9/16] rounded-lg overflow-hidden">
                  <VideoCard video={video} isCompact={true} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No results found for "{searchQuery}"</p>
          )}
        </div>
      ) : (
        <div>
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <h2 className="text-lg font-semibold px-4 mb-3">{category.name}</h2>
              <div className="overflow-x-auto">
                <div className="flex px-4 space-x-3 pb-2">
                  {category.videos.map((video) => (
                    <div key={video.id} className="w-32 flex-shrink-0">
                      <div className="aspect-[9/16] rounded-lg overflow-hidden">
                        <VideoCard video={video} isCompact={true} />
                      </div>
                      <p className="text-xs mt-1 truncate">{video.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}