import { useEffect, useState } from 'react';
import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';
import { InAuthUser } from '../models/in_auth_user';
import FirebaseClient from '@/models/firebase_client';

export default function useFirebaseAuth() {
  // useState: 컴포넌트 내에 있는 상태값 변경
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    // 예외 처리
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      if (signInResult.user) {
        console.info(signInResult.user);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //초기화
  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  //auth 상태가 변경될 때마다
  const authStateChanged = async (authState: User | null) => {
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
    });
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}
