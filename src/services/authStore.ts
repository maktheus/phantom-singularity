import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, setAccessToken, UserOut, PlayerStateOut, ApiError } from './api';

interface AuthState {
  user: UserOut | null;
  playerState: PlayerStateOut | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      playerState: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(email, password);
          setAccessToken(res.access_token);
          const me = await authApi.me();
          set({ user: res.user, playerState: me.player_state, isLoading: false });
        } catch (e) {
          const err = e as ApiError;
          set({ error: err?.error?.message ?? 'Erro ao fazer login', isLoading: false });
          throw e;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(name, email, password);
          setAccessToken(res.access_token);
          const me = await authApi.me();
          set({ user: res.user, playerState: me.player_state, isLoading: false });
        } catch (e) {
          const err = e as ApiError;
          set({ error: err?.error?.message ?? 'Erro ao criar conta', isLoading: false });
          throw e;
        }
      },

      loginWithGoogle: async (idToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.google(idToken);
          setAccessToken(res.access_token);
          const me = await authApi.me();
          set({ user: res.user, playerState: me.player_state, isLoading: false });
        } catch (e) {
          const err = e as ApiError;
          set({ error: err?.error?.message ?? 'Erro ao entrar com Google', isLoading: false });
          throw e;
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch (_) { /* ignore */ }
        setAccessToken(null);
        set({ user: null, playerState: null });
      },

      refreshSession: async () => {
        try {
          const res = await authApi.refresh();
          setAccessToken(res.access_token);
          const me = await authApi.me();
          set({ user: me.user, playerState: me.player_state });
          return true;
        } catch (_) {
          setAccessToken(null);
          set({ user: null, playerState: null });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'phantom-auth-v1', partialise: (s) => ({ user: s.user }) }
  ) as any
);
