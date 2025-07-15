'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { VideoCameraIcon, BookmarkIcon, HeartIcon, UserPlusIcon, ShareIcon, PencilIcon } from '@heroicons/react/24/outline';
import { mockVideos } from '@/lib/mockData';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user display name and username
  const displayName = user?.displayName || (user?.isAnonymous ? 'Guest User' : user?.email?.split('@')[0] || 'User');
  const username = user?.isAnonymous ? 'guest_user' : user?.email?.split('@')[0] || 'user';
  
  // Filter videos for this user (for demo, just use first 3 videos)
  const userVideos = mockVideos.slice(0, 3);
  const likedVideos = mockVideos.slice(3, 6);
  
  return (
    <div className="pb-16 bg-white min-h-screen">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center">
        <h1 className="text-xl font-bold flex-1 text-center">Profile</h1>
      </div>
      
      {/* Profile Info */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
            <Image
              src={user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-gray-500">@{username}</p>
            
            <div className="flex space-x-4 mt-2">
              <div>
                <span className="font-bold">42</span>
                <span className="text-gray-500 text-sm ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">1.2K</span>
                <span className="text-gray-500 text-sm ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">8.5K</span>
                <span className="text-gray-500 text-sm ml-1">Likes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <p className="mt-3 text-sm">
          Digital creator | Sharing my creative journey ✨ | Follow for daily content
        </p>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-md flex items-center justify-center">
            <UserPlusIcon className="h-5 w-5 mr-1" />
            Follow
          </button>
          <button className="w-12 border border-gray-300 rounded-md flex items-center justify-center">
            <ShareIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button className="w-12 border border-gray-300 rounded-md flex items-center justify-center">
            <PencilIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 mt-4">
          <Tab className={({ selected }) => 
            `flex-1 py-3 text-center ${
              selected 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <VideoCameraIcon className="h-5 w-5 mx-auto" />
          </Tab>
          <Tab className={({ selected }) => 
            `flex-1 py-3 text-center ${
              selected 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <HeartIcon className="h-5 w-5 mx-auto" />
          </Tab>
          <Tab className={({ selected }) => 
            `flex-1 py-3 text-center ${
              selected 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <BookmarkIcon className="h-5 w-5 mx-auto" />
          </Tab>
        </Tab.List>
        <Tab.Panels>
          {/* Videos Tab */}
          <Tab.Panel>
            {userVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1">
                {userVideos.map((video) => (
                  <div key={video.id} className="aspect-square bg-gray-100 relative overflow-hidden">
                    <video
                      src={video.videoUrl}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 left-1 flex items-center">
                      <HeartIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs ml-1">{video.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No videos yet</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">
                  Upload your first video
                </button>
              </div>
            )}
          </Tab.Panel>
          
          {/* Liked Tab */}
          <Tab.Panel>
            {likedVideos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-1">
                {likedVideos.map((video) => (
                  <div key={video.id} className="aspect-square bg-gray-100 relative overflow-hidden">
                    <video
                      src={video.videoUrl}
                      className="object-cover w-full h-full"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 left-1 flex items-center">
                      <HeartIcon className="h-3 w-3 text-white" />
                      <span className="text-white text-xs ml-1">{video.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No liked videos yet</p>
              </div>
            )}
          </Tab.Panel>
          
          {/* Saved Tab */}
          <Tab.Panel>
            <div className="p-8 text-center">
              <p className="text-gray-500">No saved videos yet</p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}