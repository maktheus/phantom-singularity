import { useAppStore } from '../store/useAppStore';

export const DARK = {
  bg:         '#0A0F1E',
  bgCard:     '#111827',
  bgSub:      '#0F172A',
  text:       '#F1F5F9',
  textSub:    '#94A3B8',
  textMuted:  '#475569',
  border:     'rgba(255,255,255,0.06)',
  borderStr:  '#1E293B',
  headerBg:   'linear-gradient(180deg,#1E293B 0%,#0A0F1E 100%)',
};

export const LIGHT = {
  bg:         '#EFF6FF',
  bgCard:     '#FFFFFF',
  bgSub:      '#F8FAFC',
  text:       '#0F172A',
  textSub:    '#475569',
  textMuted:  '#94A3B8',
  border:     'rgba(0,0,0,0.07)',
  borderStr:  '#E2E8F0',
  headerBg:   'linear-gradient(180deg,#FFFFFF 0%,#EFF6FF 100%)',
};

export type Theme = typeof DARK;

export function useTheme(): Theme {
  const theme = useAppStore(s => s.theme);
  return theme === 'light' ? LIGHT : DARK;
}
