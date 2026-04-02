/**
 * Typed API client for phantom-singularity-api.
 * All requests go to VITE_API_URL (set in .env.local).
 * Falls back to localhost:8000 in dev.
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const API = `${BASE}/api/v1`;

export interface ApiError {
  error: { code: string; message: string; details: unknown };
}

let _accessToken: string | null = null;

export function setAccessToken(t: string | null) { _accessToken = t; }
export function getAccessToken() { return _accessToken; }

async function req<T>(
  method: string, path: string,
  body?: unknown, extraHeaders: Record<string, string> = {}
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extraHeaders };
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;
  const res = await fetch(`${API}${path}`, {
    method, headers, credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({ error: { code: 'UNKNOWN', message: `HTTP ${res.status}`, details: null } }));
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserOut {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'admin';
  avatar_url: string | null;
  created_at: string;
}

export interface PlayerStateOut {
  gold: number;
  xp: number;
  level: number;
  permanent_upgrades: Record<string, number>;
  stats: {
    total_runs: number;
    total_kills: number;
    total_questions_answered: number;
    accuracy: number;
    best_run_kills: number;
    best_run_score: number;
    study_streak_days: number;
  };
}

export interface AuthResponse { access_token: string; user: UserOut; }
export interface MeResponse { user: UserOut; player_state: PlayerStateOut | null; }

export const authApi = {
  register: (name: string, email: string, password: string) =>
    req<AuthResponse>('POST', '/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    req<AuthResponse>('POST', '/auth/login', { email, password }),
  google: (id_token: string) =>
    req<AuthResponse>('POST', '/auth/google', { id_token }),
  refresh: () => req<{ access_token: string }>('POST', '/auth/refresh'),
  logout: () => req<void>('POST', '/auth/logout'),
  me: () => req<MeResponse>('GET', '/auth/me'),
};

// ─── Questions ────────────────────────────────────────────────────────────────

export interface QuestionOption { index: number; text: string; tip: string; }
export interface QuestionOut {
  id: string;
  text: string;
  options: QuestionOption[];
  correct_index: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'real' | 'ai';
  ai_generated: boolean;
  concurso_slug: string | null;
  exam_id: string | null;
  hits: number;
  misses: number;
  hit_rate: number;
  created_at: string;
}

// ─── Runs ────────────────────────────────────────────────────────────────────

export interface EnemyConfig {
  name: string; emoji: string; hp: number; max_hp: number;
  modifier: string; modifier_label: string; damage_modifier: number;
  gold_reward: number; xp_reward: number;
}

export interface StartRunResponse {
  run_id: string;
  questions: QuestionOut[];
  enemy: EnemyConfig;
}

export interface AnswerResponse {
  correct: boolean; crit: boolean;
  damage_dealt: number; damage_taken: number;
  gold_gained: number; xp_gained: number;
  enemy_hp: number; enemy_max_hp: number;
  player_hp: number; player_max_hp: number;
  enemy_dead: boolean; chest_available: boolean;
  tip: string;
}

export interface RunSummary {
  run_id: string; gold_earned: number; xp_earned: number;
  kills: number; accuracy: number; time_seconds: number; new_level: number | null;
}

export const runApi = {
  start: (concurso_id: string, build_type: string) =>
    req<StartRunResponse>('POST', '/runs', { concurso_id, build_type }),
  answer: (run_id: string, question_id: string, chosen_index: number, ms: number, idempotencyKey?: string) =>
    req<AnswerResponse>('POST', `/runs/${run_id}/answer`,
      { question_id, chosen_index, ms_to_answer: ms },
      idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
  end: (run_id: string, reason: 'death' | 'victory' | 'abandoned') =>
    req<RunSummary>('POST', `/runs/${run_id}/end`, { reason }),
};

// ─── Concursos ───────────────────────────────────────────────────────────────

export interface ConcursoOut {
  id: string; slug: string; name: string; area: string; emoji: string; color_hex: string;
}

export const concursoApi = {
  list: () => req<ConcursoOut[]>('GET', '/concursos'),
};

// ─── Player ──────────────────────────────────────────────────────────────────

export const playerApi = {
  me: () => req<PlayerStateOut>('GET', '/player/me'),
  buyUpgrade: (upgrade_key: string, levels = 1) =>
    req<{ permanent_upgrades: Record<string,number>; gold_remaining: number }>
      ('PATCH', '/player/me/upgrades', { upgrade_key, levels }),
};
