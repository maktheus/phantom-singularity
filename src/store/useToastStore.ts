import { create } from 'zustand';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  emoji?: string;
}

interface ToastStore {
  toasts: Toast[];
  show: (message: string, type?: Toast['type'], emoji?: string) => void;
  dismiss: (id: number) => void;
}

let _nextId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = 'success', emoji) => {
    const id = _nextId++;
    set(s => ({ toasts: [...s.toasts, { id, message, type, emoji }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 2800);
  },
  dismiss: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
