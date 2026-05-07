# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
npm run deploy     # Build + push to gh-pages branch
```

No test suite is configured. Type-checking via `tsc --noEmit` is the main correctness gate.

## Architecture

**Phantom Singularity** ("Concurseiro RPG") is a mobile-first React 19 SPA — a roguelike RPG where Brazilian civil-service exam questions are the combat mechanic. Answering correctly attacks enemies; wrong answers deal damage to the player.

### Routing & Shell (`src/App.tsx`)

- Uses `HashRouter` (required for gh-pages static hosting).
- `AnimatePresence` + `key={location.pathname}` drives page-transition animations via Framer Motion.
- `BottomNavbar` is rendered inside `AppContent` and only shows on `/home` and `/select`.
- A `SplashScreen` plays on first load (before the router mounts).
- `NAV_HEIGHT = 64` is exported and used by pages to offset their bottom CTA buttons above the nav bar.

### State (`src/store/useAppStore.ts`)

Single Zustand store (`persist` to `localStorage` under key `phantom-rpg-v3-save`). Everything lives here:

- **Run state**: `player`, `enemy`, `gold`, `streak`, `runKills`, `runItems`, `pendingRunUpgrades`, `pendingItemDrop`
- **Meta/permanent**: `killCount`, `permanentUpgrades`, `cosmeticInventory`, `equippedCosmetics`, `ownedBlueprints`
- **Freemium**: `isPremium`, `dailyPlaysUsed`, `lastPlayDate`, `dailyStreak`, `todayStats`

Key logic in the store:
- `localAttack(isCorrect, isFirstHit?)` — pure local combat resolution (offline mode). Applies crit, armor, enrage, regen, shield, vampirism, and streak bonuses.
- `spawnNextEnemy()` — increments kill count, rolls power-up offers or item chest drop (every boss or every 2nd kill), scales Rogue's crit passively.
- `startRun(build, concursoId?)` — tries backend first, falls back to local. Applies permanent upgrades + equipped cosmetic stat bonuses.
- `pickItem / levelUpItem` — VS-style item acquisition with evolution checking via `EVOLUTION_TABLE`.
- `recordDailyPlay()` — enforces 3-play free daily limit; returns `false` if blocked.

### Backend Integration (`src/services/api.ts`)

REST client pointing to `VITE_API_URL` (defaults to `http://localhost:8000`). Three API groups:
- `authApi` — register / login / Google OAuth / refresh / logout / me
- `runApi` — start run, submit answer, end run
- `concursoApi` — list available concursos

Backend is **optional**: every action has a local fallback. The store tries backend calls inside `try/catch` and falls back silently. Access token is stored in-memory (`_accessToken`); refresh token is cookie-based.

Auth state lives separately in `src/services/authStore.ts`.

### Game Systems

- **Builds**: `warrior` (tank), `mage` (glass cannon, 3× crit mult), `rogue` (crit machine + gold king). Unlocked progressively by `killCount` (mage at 3, rogue at 10).
- **Enemies** (`buildEnemy`): scale HP by `1.14^(level-1)`; boss every 4th kill. Modifiers: `armored` (damage reduction), `regen` (heals on wrong answers), `enraged` (1.5× counter-attack), `boss`.
- **Items** (VS-style): `ITEM_POOL` weapons + passives, level 1–5. Max-level weapon + matching passive triggers an evolution (`EVOLUTION_TABLE`).
- **Power-ups**: `RUN_POWERUPS` pool (generic + class-exclusive). Offered every non-item kill. Stacking the same power-up costs gold (`powerUpStackCost`).
- **Blueprints** (Dead Cells style): `SHOP_BLUEPRINTS` — player buys blueprints with gold to add power-ups to their run pool.
- **Cosmetics** (`src/data/cosmeticsDb.ts`): 4 slots (hat/weapon/armor/amulet), 4 rarities. Equipped items apply `statBonus` at run start.
- **Permanent upgrades**: 5 meta-progression upgrades bought with gold between runs.

### UI Conventions

- All styling is inline CSS-in-JS (no Tailwind, no CSS modules). Color palette: dark navy (`#0F172A`, `#060B18`) + blue/purple accents (`#3B82F6`, `#7C3AED`) + red action (`#EF4444`).
- Framer Motion is used everywhere: page transitions, combat feedback flashes, modals (spring physics: `stiffness: 380, damping: 28`).
- `src/pixelart.css` provides the `.pixel-art` class for the camp scene aesthetic.
- `maxWidth: 600` container on all pages — strictly mobile-portrait layout.
- `lucide-react` for icons.

### Pages

| Route | File | Purpose |
|---|---|---|
| `/onboarding` | `OnboardingFlow.tsx` | First-run class + concurso selection |
| `/home` | `HomeLoop.tsx` | Camp scene, meta-upgrades, blueprint shop, daily stats |
| `/select` | `StudySelect.tsx` | Pre-run class picker + concurso selector |
| `/study` | `StudySwipeMode.tsx` | Main combat loop |
| `/items` | `ItemsPage.tsx` | In-run item inventory |
| `/law` | `LawViva.tsx` | Oral-exam flash-card mode |
| `/hero` | `CosmeticsPage.tsx` | Cosmetic inventory + equip |
| `/settings` | `SettingsPage.tsx` | Theme, sound, reset |
| `/auth` | `AuthPage.tsx` | Login / register |

### Environment

Create `.env.local` to point at a backend:
```
VITE_API_URL=https://your-api.example.com
```
Without it the app runs fully offline using `src/services/questionEngine.ts` (local question bank).
