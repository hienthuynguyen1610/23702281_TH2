import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  login: (input?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  login: (_input?: string) => {
    const stamp = examStamp();
    const fakeToken = `ktxgo-${STUDENT.mssv}-${stamp}`;
    set({ token: fakeToken });
  },
  logout: () => {
    set({ token: null });
  },
}));

export default useAuthStore;
