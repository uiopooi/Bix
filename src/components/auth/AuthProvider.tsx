'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Extended user type to support mock guest users
type ExtendedUser = User | {
  uid: string;
  isAnonymous: boolean;
  displayName: string | null;
  email?: string | null;
  photoURL?: string | null;
};

type AuthContextType = {
  user: ExtendedUser | null;
  loading: boolean;
  isGuest: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isGuest: false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Function to safely access localStorage (only in browser)
    const safeLocalStorage = {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            console.error('Error accessing localStorage:', e);
            return null;
          }
        }
        return null;
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (e) {
            console.error('Error setting localStorage:', e);
            return false;
          }
        }
        return false;
      }
    };

    // Function to check for mock guest user in localStorage
    const checkForMockGuestUser = () => {
      const mockGuestUser = safeLocalStorage.getItem('bix-guest-user');
      if (mockGuestUser) {
        console.log("Found mock guest user in localStorage");
        try {
          const parsedUser = JSON.parse(mockGuestUser);
          setUser(parsedUser);
          setIsGuest(true);
          setLoading(false);
          return true;
        } catch (e) {
          console.error('Error parsing guest user:', e);
        }
      }
      return false;
    };

    // Function to create a mock guest user
    const createMockGuestUser = () => {
      const guestUser = {
        uid: `guest-${Date.now()}`,
        isAnonymous: true,
        displayName: "Guest User",
        photoURL: "https://randomuser.me/api/portraits/lego/1.jpg"
      };
      
      const success = safeLocalStorage.setItem('bix-guest-user', JSON.stringify(guestUser));
      if (success) {
        console.log("Created new mock guest user:", guestUser.uid);
      } else {
        console.log("Created guest user in memory only (localStorage failed)");
      }
      
      setUser(guestUser);
      setIsGuest(true);
      setLoading(false);
      return true;
    };

    // Initial check for mock guest user
    const hasMockUser = checkForMockGuestUser();

    // If no mock guest user, listen for Firebase auth changes
    let unsubscribe: () => void = () => {};
    if (!hasMockUser) {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          console.log("Firebase auth user:", firebaseUser.uid, "isAnonymous:", firebaseUser.isAnonymous);
          setUser(firebaseUser);
          setIsGuest(firebaseUser.isAnonymous);
          setLoading(false);
        } else {
          // No Firebase user, create a mock guest user automatically
          createMockGuestUser();
        }
      });
    }

    // Clean up function
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}