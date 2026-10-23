import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  isConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ayur_demo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            token
          });
        } else {
          // If no Firebase user, check local demo user
          const saved = localStorage.getItem('ayur_demo_user');
          setCurrentUser(saved ? JSON.parse(saved) : null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  const loginDemoUser = (name = 'Aarav Sharma') => {
    const demoUser = {
      uid: 'demo-user-101',
      displayName: name,
      email: 'aarav.sharma@ayurveda.example',
      isDemo: true,
      token: 'demo-user-101'
    };
    setCurrentUser(demoUser);
    localStorage.setItem('ayur_demo_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const loginWithEmail = async (email, password) => {
    if (isConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } else {
      return loginDemoUser(email.split('@')[0]);
    }
  };

  const signupWithEmail = async (email, password, name) => {
    if (isConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return cred.user;
    } else {
      return loginDemoUser(name || email.split('@')[0]);
    }
  };

  const loginWithGoogle = async () => {
    if (isConfigured && auth) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
    } else {
      return loginDemoUser('Google User (Demo)');
    }
  };

  const logout = async () => {
    if (isConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem('ayur_demo_user');
    setCurrentUser(null);
  };

  const getToken = async () => {
    if (isConfigured && auth && auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
    return currentUser?.token || 'demo-user-101';
  };

  const value = {
    currentUser,
    isConfigured,
    loading,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loginDemoUser,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
