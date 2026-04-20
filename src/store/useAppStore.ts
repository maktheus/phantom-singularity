import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CosmeticItem, CosmeticSlot } from '../data/cosmeticsDb';

export type BuildType = 'warrior' | 'mage' | 'rogue';
export type ConcursoType = 'policial' | 'tributario' | 'judiciario' | 'administrativo' | 'ti' | 'mixed';
export type EnemyModifier = 'armored' | 'regen' | 'enraged' | 'boss' | 'none';
export type ItemRarity = 'common' | 'rare' | 'legendary';

// ─── Vampire Survivors-style Items ───────────────────────────────────────────
export interface RunItem {
  id: string;
  name: string;
  emoji: string;
  rarity: ItemRarity;
  category: 'weapon' | 'passive';
  level: number;   // 1–5
  maxLevel: number;
  evolvesIntoWith?: string;  // id of the catalyst passive needed
  evolutionResult?: string;  // id of evolved item
  desc: (level: number) => string;
  apply: (p: PlayerStats, level: number) => PlayerStats;  // bonuses per level
}

// ─── All possible items in the pool ──────────────────────────────────────────
export const ITEM_POOL: RunItem[] = [
  // ── WEAPONS ──
  {
    id: 'livro', name: 'Livro de Direito', emoji: '📖', rarity: 'common', category: 'weapon',
    level: 1, maxLevel: 5, evolvesIntoWith: 'esfera',
    desc: l => `Causa +${l * 8} dano. Nível ${l}/5`,
    apply: (p, l) => ({ ...p, damage: p.damage + l * 8 }),
  },
  {
    id: 'cronometro', name: 'Cronômetro', emoji: '⏱️', rarity: 'common', category: 'weapon',
    level: 1, maxLevel: 5, evolvesIntoWith: 'ampulheta',
    desc: l => `+${l * 5}% Chance de Crítico`,
    apply: (p, l) => ({ ...p, critChance: Math.min(0.7, p.critChance + l * 0.05) }),
  },
  {
    id: 'espada', name: 'Espada Sagrada', emoji: '⚔️', rarity: 'rare', category: 'weapon',
    level: 1, maxLevel: 5, evolvesIntoWith: 'pochete',
    desc: l => `+${l * 12} dano, +${l * 5} MaxHP`,
    apply: (p, l) => ({ ...p, damage: p.damage + l * 12, maxHp: p.maxHp + l * 5 }),
  },
  {
    id: 'biblia', name: 'Bíblia do Concurseiro', emoji: '📜', rarity: 'rare', category: 'weapon',
    level: 1, maxLevel: 5, evolvesIntoWith: 'amuleto',
    desc: l => `+${l * 40}% Ouro por kill`,
    apply: (p, l) => ({ ...p, goldMultiplier: p.goldMultiplier + l * 0.4 }),
  },
  // ── PASSIVES ──
  {
    id: 'esfera', name: 'Esfera Arcana', emoji: '🔮', rarity: 'common', category: 'passive',
    level: 1, maxLevel: 3,
    desc: l => `+${l * 10} Dano base`,
    apply: (p, l) => ({ ...p, damage: p.damage + l * 10 }),
  },
  {
    id: 'ampulheta', name: 'Ampulheta Dourada', emoji: '⏳', rarity: 'common', category: 'passive',
    level: 1, maxLevel: 3,
    desc: l => `+${l * 8}% Crítico`,
    apply: (p, l) => ({ ...p, critChance: Math.min(0.7, p.critChance + l * 0.08) }),
  },
  {
    id: 'pochete', name: 'Pochete da Sorte', emoji: '👜', rarity: 'rare', category: 'passive',
    level: 1, maxLevel: 3,
    desc: l => `+${l * 25} MaxHP`,
    apply: (p, l) => ({ ...p, maxHp: p.maxHp + l * 25, hp: p.hp + l * 25 }),
  },
  {
    id: 'amuleto', name: 'Amuleto Dourado', emoji: '🏅', rarity: 'rare', category: 'passive',
    level: 1, maxLevel: 3,
    desc: l => `+${l * 60}% Ouro`,
    apply: (p, l) => ({ ...p, goldMultiplier: p.goldMultiplier + l * 0.6 }),
  },
  // ── EVOLUTIONS (weapon + passive at max → evolve) ──
  {
    id: 'grimorio', name: '📕 GRIMÓRIO DO SABER', emoji: '📕', rarity: 'legendary', category: 'weapon',
    level: 1, maxLevel: 1,
    desc: () => `Livro+Esfera Evoluído. Triplo dano e Ouro +100%`,
    apply: (p, _) => ({ ...p, damage: p.damage * 3, goldMultiplier: p.goldMultiplier + 1 }),
  },
  {
    id: 'relogio', name: '🕰️ RELÓGIO DO DESTINO', emoji: '🕰️', rarity: 'legendary', category: 'weapon',
    level: 1, maxLevel: 1,
    desc: () => `Cronômetro+Ampulheta. Crit 60%, +30 Dano`,
    apply: (p, _) => ({ ...p, critChance: 0.6, damage: p.damage + 30 }),
  },
  {
    id: 'excalibur', name: '🗡️ EXCALIBUR', emoji: '✨', rarity: 'legendary', category: 'weapon',
    level: 1, maxLevel: 1,
    desc: () => `Espada+Pochete. +80 Dano, +100 MaxHP`,
    apply: (p, _) => ({ ...p, damage: p.damage + 80, maxHp: p.maxHp + 100, hp: p.hp + 100 }),
  },
  {
    id: 'tesourodivino', name: '👑 TESOURO DIVINO', emoji: '👑', rarity: 'legendary', category: 'weapon',
    level: 1, maxLevel: 1,
    desc: () => `Bíblia+Amuleto. Ouro x4`,
    apply: (p, _) => ({ ...p, goldMultiplier: p.goldMultiplier + 4 }),
  },
];

// Evolution table: weapon_id + passive_id → evolution_id
export const EVOLUTION_TABLE: Record<string, string> = {
  'livro+esfera':     'grimorio',
  'cronometro+ampulheta': 'relogio',
  'espada+pochete':   'excalibur',
  'biblia+amuleto':   'tesourodivino',
};

// ─── Other types ─────────────────────────────────────────────────────────────
export interface PlayerStats {
  hp: number;
  maxHp: number;
  damage: number;
  critChance: number;
  goldMultiplier: number;
  build: BuildType;
}

export interface EnemyState {
  level: number;
  hp: number;
  maxHp: number;
  name: string;
  emoji: string;
  modifier: EnemyModifier;
  armor: number;
}

export interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  level: number;
  maxLevel: number;
}

export interface RunPowerUp {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  rarity: ItemRarity;
  apply: (p: PlayerStats) => PlayerStats;
}

// ─── Game State ───────────────────────────────────────────────────────────────
interface GameState {
  player: PlayerStats;
  gold: number;
  totalQuestionsAnswered: number;
  streak: number;
  enemy: EnemyState;
  isGameOver: boolean;
  killCount: number;
  runKills: number;
  permanentUpgrades: PermanentUpgrade[];
  pendingRunUpgrades: RunPowerUp[] | null;
  selectedConcurso: ConcursoType;

  // Onboarding flag — skip onboarding for returning users
  hasOnboarded: boolean;

  // VS-style items
  runItems: RunItem[];     // items acquired this run
  pendingItemDrop: boolean; // show item chest modal
  lastEvolvedItem: string | null; // id of last evolved item, for reveal animation

  // Backend sync
  runId: string | null;
  currentQuestions: any[]; // Questão vinda do back

  // Theming
  theme: 'dark' | 'light';
  // Cosmetic inventory (persists between runs)
  cosmeticInventory: CosmeticItem[];
  equippedCosmetics: { hat: string|null; weapon: string|null; armor: string|null; amulet: string|null };
  pendingCosmeticChest: boolean;

  // ─── Freemium + Daily tracking ────────────────────────────────────────────
  isPremium: boolean;
  dailyPlaysUsed: number;
  dailyStreak: number;
  lastPlayDate: string;        // 'YYYY-MM-DD' — last day a run was started
  todayStats: { questions: number; kills: number; goldEarned: number; runsCompleted: number };

  // Actions
  setHasOnboarded: () => void;
  resetOnboarding: () => void;
  startRun: (build: BuildType, concursoId?: string) => Promise<void>;
  attackEnemy: (questionId: string, chosenIndex: number, ms: number) => Promise<{ result: 'alive' | 'dead'; isCrit: boolean; actualDmg: number; correct: boolean; tip: string }>;
  /** Full offline combat: updates enemy HP + player HP locally, returns combat result */
  localAttack: (isCorrect: boolean, optionTip?: string) => { result: 'alive' | 'dead'; isCrit: boolean; actualDmg: number; correct: boolean };
  endRun: (reason: 'death' | 'victory' | 'abandoned') => Promise<void>;
  takeDamage: (dmg: number) => void;
  spawnNextEnemy: () => void;
  collectGold: (base: number) => void;
  purchasePermanent: (id: string) => boolean;
  chooseRunUpgrade: (up: RunPowerUp) => void;
  skipRunUpgrade: () => void;
  pickItem: (itemId: string) => void;
  levelUpItem: (itemId: string) => boolean;
  dismissItemDrop: () => void;
  confirmEvolution: () => void;
  respawn: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementQuestions: () => void;
  setConcurso: (c: ConcursoType) => void;
  toggleTheme: () => void;
  addCosmeticItem: (item: CosmeticItem) => void;
  equipCosmetic: (itemId: string) => void;
  unequipCosmetic: (slot: CosmeticSlot) => void;
  setPendingCosmeticChest: (v: boolean) => void;
  /** Returns false if free daily limit reached */
  recordDailyPlay: () => boolean;
  setPremium: (v: boolean) => void;
  addTodayStats: (s: Partial<{ questions: number; kills: number; goldEarned: number; runsCompleted: number }>) => void;
}

// ─── Enemy Roster ─────────────────────────────────────────────────────────────
const ENEMY_ROSTER = [
  { name: 'Questão Fácil',      emoji: '🐛', modifier: 'none'    as EnemyModifier },
  { name: 'Alternativa Falsa',  emoji: '🦊', modifier: 'none'    as EnemyModifier },
  { name: 'Pegadinha da Banca', emoji: '🐺', modifier: 'armored' as EnemyModifier },
  { name: 'Artigo Decoreba',    emoji: '📜', modifier: 'regen'   as EnemyModifier },
  { name: 'Questão CESPE',      emoji: '😈', modifier: 'enraged' as EnemyModifier },
  { name: 'Recurso Indeferido', emoji: '🧙', modifier: 'regen'   as EnemyModifier },
  { name: 'Simulado Brutal',    emoji: '💀', modifier: 'none'    as EnemyModifier },
  { name: 'CHEFE: Banca FGV',   emoji: '🐉', modifier: 'boss'    as EnemyModifier },
];

function buildEnemy(level: number): EnemyState {
  const isBoss = level % 5 === 0;
  const pool = isBoss
    ? ENEMY_ROSTER.filter(e => e.modifier === 'boss')
    : ENEMY_ROSTER.filter(e => e.modifier !== 'boss');
  const e = pool[Math.floor(Math.random() * pool.length)];
  const baseHp = isBoss ? 100 : 30;
  const hp = Math.floor(baseHp * Math.pow(1.18, level - 1));
  return { level, hp, maxHp: hp, name: e.name, emoji: e.emoji, modifier: e.modifier, armor: e.modifier === 'armored' ? Math.floor(level * 1.5) : 0 };
}

// ─── Builds ───────────────────────────────────────────────────────────────────
function defaultPlayer(build: BuildType): PlayerStats {
  switch (build) {
    case 'warrior': return { hp: 150, maxHp: 150, damage: 22, critChance: 0.05, goldMultiplier: 1, build };
    case 'mage':    return { hp: 80,  maxHp: 80,  damage: 35, critChance: 0.12, goldMultiplier: 1, build };
    case 'rogue':   return { hp: 100, maxHp: 100, damage: 18, critChance: 0.25, goldMultiplier: 1.5, build };
  }
}

// ─── Permanent Upgrades ───────────────────────────────────────────────────────
const DEFAULT_PERMANENTS: PermanentUpgrade[] = [
  { id: 'p_sword',   name: 'Espada Afiada',   description: '+10 Dano base (toda run)',    emoji: '⚔️', baseCost: 30, level: 0, maxLevel: 10 },
  { id: 'p_shield',  name: 'Armadura Pesada', description: '+25 HP Máximo base',          emoji: '🛡️', baseCost: 25, level: 0, maxLevel: 8 },
  { id: 'p_crit',    name: 'Olho de Águia',   description: '+5% Crítico base',            emoji: '🦅', baseCost: 50, level: 0, maxLevel: 5 },
  { id: 'p_gold',    name: 'Cofre',           description: '+40% Ouro base',              emoji: '🏦', baseCost: 60, level: 0, maxLevel: 5 },
  { id: 'p_phoenix', name: 'Pena da Fênix',   description: 'Regen: +20HP ao matar chefe', emoji: '🌅', baseCost: 80, level: 0, maxLevel: 3 },
];

export function permanentCost(u: PermanentUpgrade) {
  return Math.floor(u.baseCost * Math.pow(1.6, u.level));
}

function applyPermanents(base: PlayerStats, ups: PermanentUpgrade[]): PlayerStats {
  let p = { ...base };
  ups.forEach(u => {
    for (let i = 0; i < u.level; i++) {
      if (u.id === 'p_sword')   p.damage    += 10;
      if (u.id === 'p_shield')  { p.maxHp   += 25; p.hp += 25; }
      if (u.id === 'p_crit')    p.critChance = Math.min(0.7, p.critChance + 0.05);
      if (u.id === 'p_gold')    p.goldMultiplier += 0.4;
    }
  });
  return p;
}

// ─── Run Power-ups (mid-battle random bonus picks) ────────────────────────────
const RUN_POWERUPS: RunPowerUp[] = [
  { id: 'r1', rarity: 'common',    emoji: '🗡️', name: 'Fio da Navalha',  desc: '+12 Dano nesta run',          apply: p => ({ ...p, damage: p.damage + 12 }) },
  { id: 'r2', rarity: 'common',    emoji: '❤️', name: 'Bandagem',         desc: '+30 HP (recupera vida)',       apply: p => ({ ...p, hp: Math.min(p.hp + 30, p.maxHp) }) },
  { id: 'r3', rarity: 'common',    emoji: '💛', name: 'Adrenalina',       desc: '+20 HP Máximo',               apply: p => ({ ...p, maxHp: p.maxHp + 20, hp: p.hp + 20 }) },
  { id: 'r4', rarity: 'rare',      emoji: '🎯', name: 'Mira Precisa',     desc: '+15% Chance de Crítico',      apply: p => ({ ...p, critChance: Math.min(0.7, p.critChance + 0.15) }) },
  { id: 'r5', rarity: 'rare',      emoji: '🪙', name: 'Ganância',         desc: '+80% Ouro',                   apply: p => ({ ...p, goldMultiplier: p.goldMultiplier + 0.8 }) },
  { id: 'r6', rarity: 'rare',      emoji: '🔥', name: 'Aura de Chamas',   desc: '+25 Dano, -15 HP Máx',        apply: p => ({ ...p, damage: p.damage + 25, maxHp: Math.max(20, p.maxHp - 15) }) },
  { id: 'r7', rarity: 'legendary', emoji: '⚡', name: 'MODO BERSERK',     desc: 'Dano x2, Crítico 50%',        apply: p => ({ ...p, damage: p.damage * 2, critChance: 0.5 }) },
  { id: 'r8', rarity: 'legendary', emoji: '🌀', name: 'Alquimia Total',   desc: 'Vida vira Dano, Dano vira Vida', apply: p => ({ ...p, damage: p.maxHp, maxHp: p.damage, hp: Math.min(p.hp, p.damage) }) },
  { id: 'r9', rarity: 'rare',      emoji: '🎲', name: 'Dado do Caos',     desc: 'Dano aleatório: 1-60',         apply: p => ({ ...p, damage: Math.floor(Math.random() * 60) + 1 }) },
];

function rollPowerUps(): RunPowerUp[] {
  const weighted = RUN_POWERUPS.flatMap(p =>
    p.rarity === 'legendary' ? [p] : p.rarity === 'rare' ? [p, p] : [p, p, p]
  ).sort(() => Math.random() - 0.5);
  const unique: RunPowerUp[] = [];
  const seen = new Set<string>();
  for (const p of weighted) {
    if (!seen.has(p.id)) { seen.add(p.id); unique.push(p); }
    if (unique.length === 3) break;
  }
  return unique;
}

// Roll 3 random items from pool (not already owned)
// Item options for chest are picked inline in pickItem

// Check for possible evolution
function checkEvolution(items: RunItem[]): { weaponId: string; evolution: string } | null {
  const weapons = items.filter(x => x.category === 'weapon' && x.level >= x.maxLevel);
  const passives = items.filter(x => x.category === 'passive');
  for (const w of weapons) {
    for (const passive of passives) {
      const key = `${w.id}+${passive.id}`;
      if (EVOLUTION_TABLE[key]) {
        return { weaponId: w.id, evolution: EVOLUTION_TABLE[key] };
      }
    }
  }
  return null;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAppStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: applyPermanents(defaultPlayer('warrior'), DEFAULT_PERMANENTS),
      gold: 0,
      totalQuestionsAnswered: 0,
      streak: 0,
      enemy: buildEnemy(1),
      isGameOver: false,
      killCount: 0,
      runKills: 0,
      permanentUpgrades: DEFAULT_PERMANENTS,
      pendingRunUpgrades: null,
      selectedConcurso: 'mixed' as ConcursoType,
      hasOnboarded: false,
      runItems: [],
      pendingItemDrop: false,
      lastEvolvedItem: null,
      runId: null,
      currentQuestions: [],
      theme: 'dark' as 'dark' | 'light',
      cosmeticInventory: [],
      equippedCosmetics: { hat: null, weapon: null, armor: null, amulet: null },
      pendingCosmeticChest: false,
      isPremium: false,
      dailyPlaysUsed: 0,
      dailyStreak: 0,
      lastPlayDate: '',
      todayStats: { questions: 0, kills: 0, goldEarned: 0, runsCompleted: 0 },

      setHasOnboarded: () => set({ hasOnboarded: true }),
      resetOnboarding: () => set({ hasOnboarded: false }),

      startRun: async (build, concursoId) => {
        const { permanentUpgrades } = get();
        
        // 1. If backend is available and user is logged in
        // (For now, we'll try to find the concursoId mapping or fallback to local)
        if (concursoId) {
          try {
            const { runApi } = await import('../services/api');
            const res = await runApi.start(concursoId, build);
            set({
              runId: res.run_id,
              currentQuestions: res.questions,
              enemy: {
                level: 1,
                hp: res.enemy.hp,
                maxHp: res.enemy.max_hp,
                name: res.enemy.name,
                emoji: res.enemy.emoji,
                modifier: res.enemy.modifier as any,
                armor: 0, // Backend deals with armor in damage calc
              },
              player: applyPermanents(defaultPlayer(build), permanentUpgrades),
              isGameOver: false,
              streak: 0,
              runKills: 0,
              pendingRunUpgrades: null,
              runItems: [],
              pendingItemDrop: false,
              lastEvolvedItem: null,
            });
            return;
          } catch (e) {
            console.error("Failed to start run on backend, falling back to local", e);
          }
        }

        // Fallback local
        const player = applyPermanents(defaultPlayer(build), permanentUpgrades);

        // Apply equipped cosmetic bonuses
        const { cosmeticInventory, equippedCosmetics } = get();
        const withCosmetics = (() => {
          let p = { ...player };
          for (const itemId of Object.values(equippedCosmetics)) {
            if (!itemId) continue;
            const item = cosmeticInventory.find(i => i.id === itemId);
            if (!item) continue;
            const b = item.statBonus;
            if (b.damage)         p.damage         += b.damage;
            if (b.maxHp)         { p.maxHp          += b.maxHp; p.hp += b.maxHp; }
            if (b.critChance)     p.critChance      = Math.min(0.85, p.critChance + b.critChance);
            if (b.goldMultiplier) p.goldMultiplier  += b.goldMultiplier;
          }
          return p;
        })();

        set({ player: withCosmetics, enemy: buildEnemy(1), isGameOver: false, streak: 0, runKills: 0, pendingRunUpgrades: null, runItems: [], pendingItemDrop: false, lastEvolvedItem: null, runId: null, currentQuestions: [] });
      },

      attackEnemy: async (questionId, chosenIndex, ms) => {
        const { player, enemy, runId } = get();
        
        if (runId) {
          try {
            const { runApi } = await import('../services/api');
            const res = await runApi.answer(runId, questionId, chosenIndex, ms);
            
            // Sync state from backend
            set({
              enemy: {
                ...enemy,
                hp: res.enemy_hp,
                maxHp: res.enemy_max_hp,
              },
              player: {
                ...player,
                hp: res.player_hp,
                maxHp: res.player_max_hp,
              }
            });

            if (res.player_hp <= 0) set({ isGameOver: true });

            return { 
              result: res.enemy_dead ? 'dead' : 'alive', 
              isCrit: res.crit, 
              actualDmg: res.damage_dealt,
              correct: res.correct,
              tip: res.tip
            };
          } catch (e) {
            console.error("Backend answer failed", e);
          }
        }

        // Fallback when backend is completely unreachable
        // (use localAttack for proper offline combat)
        return { result: 'alive', isCrit: false, actualDmg: 0, correct: false, tip: '' };
      },

      localAttack: (isCorrect) => {
        const { player, enemy } = get();
        if (isCorrect) {
          const rolled = Math.random() < player.critChance;
          const baseDmg = Math.max(1, Math.floor(player.damage * (rolled ? 2 : 1)));
          // Apply armor reduction
          const effectiveDmg = enemy.modifier === 'armored'
            ? Math.max(1, baseDmg - enemy.armor)
            : baseDmg;
          const newEnemyHp = Math.max(0, enemy.hp - effectiveDmg);
          set({ enemy: { ...enemy, hp: newEnemyHp } });
          return { result: newEnemyHp === 0 ? 'dead' as const : 'alive' as const, isCrit: rolled, actualDmg: effectiveDmg, correct: true };
        } else {
          // Enemy counterattack
          const enemyDmg = Math.max(1, Math.floor(3 + enemy.level * 2));
          const newHp = Math.max(0, player.hp - enemyDmg);
          if (newHp <= 0) set({ player: { ...player, hp: 0 }, isGameOver: true });
          else set({ player: { ...player, hp: newHp } });
          return { result: 'alive' as const, isCrit: false, actualDmg: enemyDmg, correct: false };
        }
      },

      endRun: async (reason) => {
        const { runId } = get();
        if (runId) {
          try {
            const { runApi } = await import('../services/api');
            await runApi.end(runId, reason);
          } catch (e) {
            console.error("Failed to end run on backend", e);
          }
        }
        set({ runId: null, isGameOver: true });
      },

      takeDamage: (dmg) => {
        const { player } = get();
        const newHp = Math.max(0, player.hp - dmg);
        if (newHp <= 0) set({ player: { ...player, hp: 0 }, isGameOver: true });
        else set({ player: { ...player, hp: newHp } });
      },

      spawnNextEnemy: () => {
        const { enemy, runKills, killCount, player } = get();
        const newKills = runKills + 1;
        const isBoss = enemy.modifier === 'boss';

        // Phoenix regen
        let newPlayer = { ...player };
        const phoenix = get().permanentUpgrades.find(u => u.id === 'p_phoenix');
        if (isBoss && phoenix && phoenix.level > 0) {
          newPlayer = { ...newPlayer, hp: Math.min(newPlayer.maxHp, newPlayer.hp + 20) };
        }

        // Every kill: offer power-ups; boss / every 3rd kill: item chest instead
        const dropItem = isBoss || newKills % 3 === 0;
        const pending  = dropItem ? null : rollPowerUps(); // item chest replaces power-ups

        const ts = get().todayStats;
        set({
          enemy: buildEnemy(enemy.level + 1),
          runKills: newKills,
          killCount: killCount + 1,
          pendingRunUpgrades: pending,
          pendingItemDrop: dropItem,
          player: newPlayer,
          todayStats: { ...ts, kills: ts.kills + 1 },
        });
      },

      collectGold: (base) => {
        const { gold, player, enemy, todayStats } = get();
        const isBoss = enemy.modifier === 'boss';
        const amount = Math.floor(base * player.goldMultiplier * (1 + enemy.level * 0.1) * (isBoss ? 3 : 1));
        set({ gold: gold + amount, todayStats: { ...todayStats, goldEarned: todayStats.goldEarned + amount } });
      },

      purchasePermanent: (id) => {
        const { gold, permanentUpgrades, player } = get();
        const u = permanentUpgrades.find(x => x.id === id);
        if (!u || u.level >= u.maxLevel) return false;
        const cost = permanentCost(u);
        if (gold < cost) return false;
        const newUps = permanentUpgrades.map(x => x.id === id ? { ...x, level: x.level + 1 } : x);
        let p = { ...player };
        if (id === 'p_sword')   p.damage    += 10;
        if (id === 'p_shield')  { p.maxHp   += 25; p.hp += 25; }
        if (id === 'p_crit')    p.critChance = Math.min(0.7, p.critChance + 0.05);
        if (id === 'p_gold')    p.goldMultiplier += 0.4;
        set({ gold: gold - cost, permanentUpgrades: newUps, player: p });
        return true;
      },

      chooseRunUpgrade: (up) => {
        const { player } = get();
        set({ player: up.apply(player), pendingRunUpgrades: null });
      },
      skipRunUpgrade: () => set({ pendingRunUpgrades: null }),

      pickItem: (itemId) => {
        const { runItems, player } = get();
        const template = ITEM_POOL.find(x => x.id === itemId);
        if (!template) return;
        const newItem = { ...template, level: 1 };
        const allItems = [...runItems, newItem];

        // Check evolution immediately
        const evo = checkEvolution(allItems);
        let finalItems = allItems;
        let newPlayer = template.apply(player, 1);

        if (evo) {
          const evoTemplate = ITEM_POOL.find(x => x.id === evo.evolution);
          if (evoTemplate) {
            finalItems = allItems.filter(x => x.id !== evo.weaponId);
            finalItems.push({ ...evoTemplate, level: 1 });
            newPlayer = evoTemplate.apply(newPlayer, 1);
          }
        }

        set({ runItems: finalItems, player: newPlayer, pendingItemDrop: false, lastEvolvedItem: evo?.evolution ?? null });
      },

      levelUpItem: (itemId) => {
        const { runItems, player } = get();
        const idx = runItems.findIndex(x => x.id === itemId);
        if (idx < 0) return false;
        const item = runItems[idx];
        if (item.level >= item.maxLevel) return false;
        const newLevel = item.level + 1;
        const updatedItems = runItems.map((x, i) => i === idx ? { ...x, level: newLevel } : x);
        const newPlayer = item.apply(player, 1); // delta of 1 level

        // Check evolution after level-up
        const evo = checkEvolution(updatedItems);
        let finalItems = updatedItems;
        let finalPlayer = newPlayer;
        if (evo) {
          const evoTemplate = ITEM_POOL.find(x => x.id === evo.evolution);
          if (evoTemplate) {
            finalItems = updatedItems.filter(x => x.id !== evo.weaponId);
            finalItems.push({ ...evoTemplate, level: 1 });
            finalPlayer = evoTemplate.apply(finalPlayer, 1);
          }
        }

        set({ runItems: finalItems, player: finalPlayer, lastEvolvedItem: evo ? evo.evolution : null });
        return true;
      },

      dismissItemDrop: () => set({ pendingItemDrop: false }),
      confirmEvolution: () => set({ lastEvolvedItem: null }),

      respawn: () => {
        const { permanentUpgrades, player, cosmeticInventory, equippedCosmetics } = get();
        const base = defaultPlayer(player.build);
        const basePlayer = applyPermanents(base, permanentUpgrades);
        const withCosmetics = (() => {
          let p = { ...basePlayer };
          for (const itemId of Object.values(equippedCosmetics)) {
            if (!itemId) continue;
            const item = cosmeticInventory.find(i => i.id === itemId);
            if (!item) continue;
            const b = item.statBonus;
            if (b.damage)         p.damage         += b.damage;
            if (b.maxHp)         { p.maxHp          += b.maxHp; p.hp += b.maxHp; }
            if (b.critChance)     p.critChance      = Math.min(0.85, p.critChance + b.critChance);
            if (b.goldMultiplier) p.goldMultiplier  += b.goldMultiplier;
          }
          return p;
        })();
        set({ player: withCosmetics, enemy: buildEnemy(1), isGameOver: false, streak: 0, runKills: 0, pendingRunUpgrades: null, runItems: [], pendingItemDrop: false, lastEvolvedItem: null });
      },

      incrementStreak: () => set(s => ({ streak: s.streak + 1 })),
      resetStreak: () => set({ streak: 0 }),
      incrementQuestions: () => set(s => ({
        totalQuestionsAnswered: s.totalQuestionsAnswered + 1,
        todayStats: { ...s.todayStats, questions: s.todayStats.questions + 1 },
      })),
      setConcurso: (c) => set({ selectedConcurso: c }),

      recordDailyPlay: () => {
        const { isPremium, dailyPlaysUsed, dailyStreak, lastPlayDate } = get();
        const FREE_LIMIT = 3;
        const today = new Date().toISOString().slice(0, 10);
        const isNewDay = lastPlayDate !== today;

        if (!isNewDay && !isPremium && dailyPlaysUsed >= FREE_LIMIT) return false;

        // Streak logic
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newStreak = isNewDay
          ? (lastPlayDate === yesterday ? dailyStreak + 1 : 1)
          : dailyStreak;

        set({
          dailyPlaysUsed: isNewDay ? 1 : dailyPlaysUsed + 1,
          dailyStreak: newStreak,
          lastPlayDate: today,
          todayStats: isNewDay
            ? { questions: 0, kills: 0, goldEarned: 0, runsCompleted: 0 }
            : get().todayStats,
        });
        return true;
      },

      setPremium: (v) => set({ isPremium: v }),

      addTodayStats: (s) => set(state => ({ todayStats: { ...state.todayStats, ...Object.fromEntries(Object.entries(s).map(([k, v]) => [k, (state.todayStats as any)[k] + (v ?? 0)])) } })),

      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      addCosmeticItem: (item) => set(s => ({
        cosmeticInventory: [...s.cosmeticInventory, item],
      })),

      equipCosmetic: (itemId) => set(s => {
        const item = s.cosmeticInventory.find(i => i.id === itemId);
        if (!item) return s;
        return { equippedCosmetics: { ...s.equippedCosmetics, [item.slot]: itemId } };
      }),

      unequipCosmetic: (slot) => set(s => ({ equippedCosmetics: { ...s.equippedCosmetics, [slot]: null } })),

      setPendingCosmeticChest: (v) => set({ pendingCosmeticChest: v }),
    }),
    { name: 'phantom-rpg-v3-save' }
  )
);
