'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/components/auth/AuthProvider';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { ArrowLeftIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [sound, setSound] = useState('Original Sound');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a video
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      
      // Check file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size should be less than 100MB');
        return;
      }
      
      setFile(selectedFile);
      
      // Create a preview URL for the video
      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(previewUrl);
      
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video to upload');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    setIsUploading(true);
    setError('');
    
    // Clean up video preview URL
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    try {
      // Create a unique filename
      const fileName = `${user.uid}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `videos/${fileName}`);
      
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressValue);
        },
        (error) => {
          setError('Error uploading video: ' + error.message);
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Process tags
          const tagsList = tags
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);
            
          // Save video metadata to Firestore
          await addDoc(collection(db, 'videos'), {
            userId: user.uid,
            username: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
            userImage: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
            caption,
            videoUrl: downloadURL,
            audioTitle: sound,
            tags: tagsList,
            likes: 0,
            comments: 0,
            shares: 0,
            createdAt: serverTimestamp(),
          });
          
          setIsUploading(false);
          setFile(null);
          setVideoPreview(null);
          setCaption('');
          setTags('');
          setSound('Original Sound');
          setProgress(0);
          
          // Redirect to feed
          router.push('/feed');
        }
      );
    } catch (err: any) {
      setError('Error uploading video: ' + err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="pb-16 bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-xl font-bold flex-1">Create New Video</h1>
      </div>
      
      {error && (
        <div className="m-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="p-4">
        {/* Video Preview or Upload Area */}
        <div className="mb-6">
          {videoPreview ? (
            <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
              <video
                src={videoPreview}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                loop
              />
              <button
                onClick={() => {
                  if (videoPreview) {
                    URL.revokeObjectURL(videoPreview);
                  }
                  setVideoPreview(null);
                  setFile(null);
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="aspect-[9/16] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg 
                className="h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Tap to select a video</p>
              <p className="text-xs text-gray-500">MP4, WebM, or Ogg (Max 100MB)</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden" 
              />
            </div>
          )}
        </div>
        
        {/* Caption */}
        <div className="mb-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1 resize-none border-none focus:ring-0 focus:outline-none"
              placeholder="Write a caption..."
              rows={2}
            />
            <span className="text-gray-400 text-xs">{caption.length}/150</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-4">
          <div className="flex items-center border-b border-gray-200 py-2">
            <HashtagIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 border-none focus:ring-0 focus:outline-none"
              placeholder="Add tags, separated by commas"
            />
          </div>
        </div>
        
        {/* Sound */}
        <div className="mb-6">
          <div className="flex items-center border-b border-gray-200 py-2">
            <MusicalNoteIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={sound}
              onChange={(e) => setSound(e.target.value)}
              className="flex-1 border-none focus:ring-0 focus:outline-none"
              placeholder="Add sound name"
            />
          </div>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading: {progress.toFixed(0)}%</p>
          </div>
        )}
        
        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isUploading || !file
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 active:bg-indigo-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Post'}
        </button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}