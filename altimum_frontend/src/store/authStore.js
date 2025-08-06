import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      rehydrated: false,
      login: (token) => {
        try {
          const decoded = jwtDecode(token);
          set({ token, user: { email: decoded.sub }, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setRehydrated: () => set({ rehydrated: true }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state.setRehydrated();
      },
    }
  )
);

// 앱이 로드될 때 로컬 스토리지에서 상태를 복원하는 로직 추가
useAuthStore.getState()._rehydrate?.();

export default useAuthStore;