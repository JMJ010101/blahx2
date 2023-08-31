/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { InAuthUser } from '../models/in_auth_user';
import useFirebaseAuth from '@/hooks/use_firebase_auth';

interface InAuthUserContext {
  // 어떤 걸 반환해주는지 특정
  authUser: InAuthUser | null;
  /** 로그인 여부가 진행중인지 체크 */
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null, //처음이라 무조건 null
  loading: true, // 최초에는 로딩 진행중
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

// Provider: Context내에서 매번 변경되는 값을 뽑아서 사용 가능
export const AuthUserProvider = function ({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};

export const useAuth = () => useContext(AuthUserContext);
