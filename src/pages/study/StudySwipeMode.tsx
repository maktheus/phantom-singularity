import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, BookOpen, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { RunPowerUp } from '../../store/useAppStore';
import { getRealQuestions, shuffleQuestions, REAL_QUESTIONS } from '../../services/questionEngine';
import '../../pixelart.css';

// ─── Modifier label map ───────────────────────────────────────────────────────
const MOD_LABEL: Record<string, { label: string; icon: string; color: string }> = {
  armored:  { label: 'Blindado',  icon: '🛡️', color: '#60A5FA' },
  regen:    { label: 'Regen',     icon: '💚', color: '#34D399' },
  enraged:  { label: 'Furioso',   icon: '💢', color: '#F87171' },
  boss:     { label: 'CHEFE',     icon: '👑', color: '#FBBF24' },
  none:     { label: '',          icon: '',   color: 'transparent' },
};

// ─── Sound Effects ────────────────────────────────────────────────────────────
function playSound(type: 'hit' | 'crit' | 'damage' | 'death' | 'gold' | 'levelup') {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    switch (type) {
      case 'hit':     o.type='square';   o.frequency.value=440; g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.12); o.start(); o.stop(ctx.currentTime+0.12); break;
      case 'crit':    o.type='sawtooth'; o.frequency.setValueAtTime(500,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1400,ctx.currentTime+0.3); g.gain.setValueAtTime(0.5,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.45); o.start(); o.stop(ctx.currentTime+0.5); break;
      case 'damage':  o.type='sawtooth'; o.frequency.setValueAtTime(200,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.3); g.gain.setValueAtTime(0.4,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.35); o.start(); o.stop(ctx.currentTime+0.4); break;
      case 'death':   o.type='square';   o.frequency.setValueAtTime(350,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+0.6); g.gain.setValueAtTime(0.5,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.7); o.start(); o.stop(ctx.currentTime+0.7); break;
      case 'gold':    o.type='sine';     o.frequency.setValueAtTime(880,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1760,ctx.currentTime+0.15); g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3); o.start(); o.stop(ctx.currentTime+0.3); break;
      case 'levelup': o.type='sine';     o.frequency.setValueAtTime(523,ctx.currentTime); o.frequency.setValueAtTime(659,ctx.currentTime+0.12); o.frequency.setValueAtTime(784,ctx.currentTime+0.24); o.frequency.setValueAtTime(1046,ctx.currentTime+0.36); g.gain.setValueAtTime(0.4,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.55); o.start(); o.stop(ctx.currentTime+0.6); break;
    }
  } catch { /* silent */ }
}

// ─── Screen Flash ─────────────────────────────────────────────────────────────
function ScreenFlash({ color }: { color: string }) {
  return (
    <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: color, pointerEvents: 'none', zIndex: 150 }} />
  );
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
function HpBar({ hp, maxHp, color, label }: { hp: number; maxHp: number; color: string; label: string }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const barColor = pct < 25 ? '#EF4444' : pct < 50 ? '#F97316' : color;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>{hp}/{maxHp}</span>
      </div>
      <div style={{ height: 8, backgroundColor: '#0A0F1E', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`, boxShadow: `0 0 6px ${barColor}80` }}
        />
      </div>
    </div>
  );
}

// ─── Battle Arena ─────────────────────────────────────────────────────────────
function BattleArena({ enemy, player, enemyShake, enemyFlash, playerShake, coins, damageNumbers, onRemoveCoin, onRemoveDmg, combatLog, attackVisible, attackIsCrit }: any) {
  const buildIcon = player.build === 'warrior' ? '⚔️' : player.build === 'mage' ? '🔮' : '🗡️';
  const buildColor = player.build === 'warrior' ? '#EF4444' : player.build === 'mage' ? '#8B5CF6' : '#22C55E';
  const mod = MOD_LABEL[enemy.modifier] || MOD_LABEL.none;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      background: 'linear-gradient(180deg, #050A14 0%, #0C1525 50%, #1A0A00 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Scanlines */}
      <div className="scanlines" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }}
            style={{ position: 'absolute', top: `${8 + (i % 3) * 12}%`, left: `${5 + i * 13}%`, fontSize: 7, color: '#94A3B8' }}>
            ✦
          </motion.div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '12px 16px' }}>

        {/* HP Bars row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 14 }}>
          {/* Enemy HP */}
          <HpBar hp={enemy.hp} maxHp={enemy.maxHp} color="#F87171" label="Inimigo" />
          {/* Separator */}
          <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 900, flexShrink: 0, paddingBottom: 2 }}>VS</div>
          {/* Player HP */}
          <HpBar hp={player.hp} maxHp={player.maxHp} color={buildColor} label="Herói" />
        </div>

        {/* Sprites row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 120, paddingBottom: 12 }}>

          {/* Enemy side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
            {/* Enemy name + modifier */}
            <div style={{ textAlign: 'center', maxWidth: 140 }}>
              <div style={{
                fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8',
                textTransform: 'uppercase', letterSpacing: 0.5,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 130,
              }}>{enemy.name}</div>
              {mod.label && (
                <span style={{
                  fontSize: '0.6rem', fontWeight: 800, color: mod.color,
                  backgroundColor: `${mod.color}18`, padding: '2px 6px', borderRadius: 999,
                  border: `1px solid ${mod.color}30`, marginTop: 2, display: 'inline-block',
                }}>{mod.icon} {mod.label}</span>
              )}
            </div>

            {/* Enemy sprite */}
            <div style={{ position: 'relative' }}>
              <motion.div
                className={`pixel-art ${enemyShake ? 'anim-shake' : ''}`}
                animate={enemyShake ? {} : { y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{
                  fontSize: 72, lineHeight: 1,
                  filter: enemyFlash ? 'brightness(5) saturate(0)' : `drop-shadow(0 4px 12px rgba(248,113,113,0.4))`,
                  transition: 'filter 0.1s',
                }}>
                {enemy.emoji}
              </motion.div>
              {/* Damage numbers */}
              <AnimatePresence>
                {damageNumbers.map((d: any) => (
                  <motion.div key={d.id}
                    initial={{ y: 0, opacity: 1, scale: d.isCrit ? 1.6 : 1 }}
                    animate={{ y: -65, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    onAnimationComplete={() => onRemoveDmg(d.id)}
                    style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      color: d.isCrit ? '#FBBF24' : '#F87171', fontWeight: 900,
                      fontSize: d.isCrit ? '1.6rem' : '1.1rem', fontFamily: 'monospace',
                      textShadow: '0 2px 8px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 30, whiteSpace: 'nowrap',
                    }}>
                    {d.isCrit ? '⚡' : '−'}{d.value}
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* Gold coins */}
              <AnimatePresence>
                {coins.map((c: any) => (
                  <motion.div key={c.id}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: (Math.random() - 0.5) * 80, y: -(30 + Math.random() * 50), opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    onAnimationComplete={() => onRemoveCoin(c.id)}
                    style={{ position: 'absolute', top: 0, left: '50%', fontSize: '1.1rem', pointerEvents: 'none', zIndex: 30 }}>
                    🪙
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Level badge */}
            <div style={{
              fontSize: '0.6rem', fontWeight: 800, color: '#475569',
              backgroundColor: '#0A0F1E', padding: '2px 8px', borderRadius: 999, border: '1px solid #1E293B',
            }}>Lv.{enemy.level}</div>
          </div>

          {/* Attack slash in center */}
          <AnimatePresence>
            {attackVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.5, 1.2, 0.5], rotate: [-30, 15, 25, 45] }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', top: '30%', left: '38%', fontSize: attackIsCrit ? '3.5rem' : '2.5rem', zIndex: 20, pointerEvents: 'none' }}>
                {attackIsCrit ? '⚡💥' : '⚔️'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: buildColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {buildIcon} Herói
            </div>
            <motion.div
              animate={playerShake ? { x: [-8, 8, -5, 5, 0] } : { y: [0, -5, 0] }}
              transition={playerShake ? { duration: 0.35 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ fontSize: 72, lineHeight: 1, filter: `drop-shadow(0 4px 12px ${buildColor}50)` }}>
              {player.build === 'warrior' ? '🛡️' : player.build === 'mage' ? '🔮' : '🗡️'}
            </motion.div>
          </div>
        </div>

        {/* Combat log */}
        <AnimatePresence>
          {combatLog && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                fontSize: '0.72rem', color: '#FDE68A',
                background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 8,
                textAlign: 'center', border: '1px solid rgba(251,191,36,0.2)',
                fontWeight: 700, marginBottom: 4,
              }}>
              {combatLog}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Power-Up Modal ───────────────────────────────────────────────────────────
const RARITY_COLORS = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
const RARITY_BG     = { common: '#0F2040', rare: '#1E1040', legendary: '#2D1500' };
const RARITY_LABEL  = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

function PowerUpModal({ upgrades, onChoose, onSkip }: { upgrades: RunPowerUp[]; onChoose: (u: RunPowerUp) => void; onSkip: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', zIndex: 200 }}>
      <motion.div
        initial={{ y: 400 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ padding: '24px 20px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', background: '#0F172A', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.div animate={{ rotate: [0,-10,10,0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <span style={{ fontSize: '3rem' }}>🎁</span>
          </motion.div>
          <h2 style={{ fontWeight: 900, fontSize: '1.2rem', marginTop: 8 }}>INIMIGO DERROTADO!</h2>
          <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.85rem', marginTop: 4 }}>Escolha 1 poder para esta run</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {upgrades.map(u => (
            <motion.button key={u.id} whileTap={{ scale: 0.97 }} onClick={() => onChoose(u)}
              style={{
                padding: '16px 18px', borderRadius: 16,
                background: `linear-gradient(135deg, ${RARITY_BG[u.rarity]}, #0A0F1E)`,
                border: `1.5px solid ${RARITY_COLORS[u.rarity]}40`,
                color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 20px ${RARITY_COLORS[u.rarity]}15`,
              }}>
              <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{u.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>{u.name}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: RARITY_COLORS[u.rarity], backgroundColor: `${RARITY_COLORS[u.rarity]}18`, padding: '2px 6px', borderRadius: 999 }}>
                    {RARITY_LABEL[u.rarity]}
                  </span>
                </div>
                <div style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 600 }}>{u.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onSkip} style={{ marginTop: 14, width: '100%', padding: '12px', color: '#334155', fontWeight: 800, fontSize: '0.85rem' }}>
          Pular →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Item Chest Modal ─────────────────────────────────────────────────────────
import { ITEM_POOL } from '../../store/useAppStore';

function ItemChestModal({ onPick, onSkip, ownedIds }: { onPick: (id: string) => void; onSkip: () => void; ownedIds: string[] }) {
  const available = ITEM_POOL
    .filter(x => !ownedIds.includes(x.id) && x.rarity !== 'legendary')
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const RCOLOR: Record<string, string> = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
  const RBG:    Record<string, string> = { common: '#0F2040', rare: '#1E1040', legendary: '#2D1500' };
  const RLABEL: Record<string, string> = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', zIndex: 200 }}>
      <motion.div
        initial={{ y: 400 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ padding: '24px 20px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', background: '#0F172A', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.div animate={{ rotate: [0,-15,15,-10,10,0], scale: [1,1.1,1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <span style={{ fontSize: '3rem' }}>🎁</span>
          </motion.div>
          <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#FBBF24', marginTop: 8 }}>BAÚ DE RECOMPENSA!</h2>
          <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.82rem', marginTop: 4 }}>Escolha 1 item para a mochila</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map(item => (
            <motion.button key={item.id} whileTap={{ scale: 0.97 }} onClick={() => onPick(item.id)}
              style={{
                padding: '14px 18px', borderRadius: 16,
                background: `linear-gradient(135deg, ${RBG[item.rarity]}, #0A0F1E)`,
                border: `1.5px solid ${RCOLOR[item.rarity]}40`,
                color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 20px ${RCOLOR[item.rarity]}15`,
              }}>
              <motion.span animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ fontSize: '2.2rem', flexShrink: 0 }}>{item.emoji}</motion.span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{item.name}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: RCOLOR[item.rarity], backgroundColor: `${RCOLOR[item.rarity]}18`, padding: '2px 6px', borderRadius: 999 }}>
                    {RLABEL[item.rarity]}
                  </span>
                </div>
                <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>{item.desc(1)}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onSkip} style={{ marginTop: 14, width: '100%', padding: '12px', color: '#334155', fontWeight: 800, fontSize: '0.85rem' }}>
          Pular →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudySwipeMode() {
  const navigate = useNavigate();
  const {
    player, enemy, gold, streak, isGameOver, pendingRunUpgrades, pendingItemDrop,
    attackEnemy, localAttack, spawnNextEnemy, collectGold,
    respawn, incrementStreak, resetStreak, incrementQuestions,
    chooseRunUpgrade, skipRunUpgrade, pickItem, dismissItemDrop,
    runItems, selectedConcurso: storeConcurso,
    runId, currentQuestions,
  } = useAppStore();

  const [qIndex, setQIndex]           = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<null | number>(null);
  const [enemyShake, setEnemyShake]   = useState(false);
  const [enemyFlash, setEnemyFlash]   = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [flashColor, setFlashColor]   = useState<string | null>(null);
  const [coins, setCoins]             = useState<{ id: number }[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<{ id: number; value: number; isCrit: boolean }[]>([]);
  const [combatLog, setCombatLog]     = useState('');
  const [attackVisible, setAttackVisible] = useState(false);
  const [attackIsCrit, setAttackIsCrit]   = useState(false);
  const [questionQueue, setQuestionQueue] = useState<any[]>([]);
  const [aiStatus, setAiStatus]       = useState<'idle' | 'ok' | 'offline'>('idle');

  // Build initial question queue
  useEffect(() => {
    if (runId && currentQuestions.length > 0) {
      setQuestionQueue(currentQuestions);
      setAiStatus('ok');
    } else {
      const real = shuffleQuestions(getRealQuestions(storeConcurso));
      setQuestionQueue(real.length > 0 ? real : shuffleQuestions(REAL_QUESTIONS));
      setAiStatus('offline');
    }
    setQIndex(0);
  }, [storeConcurso, runId, currentQuestions]);

  const currentQ = questionQueue[qIndex % Math.max(1, questionQueue.length)];
  const shuffledOpts = useMemo(() => (currentQ ? currentQ.options as any[] : []), [qIndex, questionQueue, currentQ]);
  const selectedOpt  = useMemo(() => selectedIdx !== null ? shuffledOpts[selectedIdx] : null, [selectedIdx, shuffledOpts]);

  const addCoins = useCallback((n: number) => {
    setCoins(c => [...c, ...Array.from({ length: n }, (_, i) => ({ id: Date.now() + i + Math.random() }))]);
  }, []);

  const addDmg = (val: number, isCrit: boolean) => {
    setDamageNumbers(d => [...d, { id: Date.now() + Math.random(), value: val, isCrit }]);
  };

  const triggerFlash = (color: string) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 300);
  };

  const handleSelect = async (idx: number) => {
    if (selectedIdx !== null || isGameOver || pendingRunUpgrades || !currentQ) return;
    setSelectedIdx(idx);
    incrementQuestions();
    const opt = shuffledOpts[idx];
    const ms = 1000; // simplified

    if (runId) {
      const { result, isCrit, actualDmg, correct } = await attackEnemy(currentQ.id, opt.index ?? idx, ms);
      if (correct) {
        setAttackIsCrit(isCrit);
        setAttackVisible(true);
        setTimeout(() => setAttackVisible(false), 420);
        setEnemyFlash(true);
        setTimeout(() => { setEnemyFlash(false); setEnemyShake(true); }, 80);
        setTimeout(() => setEnemyShake(false), 450);
        addDmg(actualDmg, isCrit);
        playSound(isCrit ? 'crit' : 'hit');
        triggerFlash(isCrit ? '#78350F' : '#162040');
        incrementStreak();
        if (result === 'dead') {
          collectGold(10 + enemy.level * 3);
          addCoins(Math.min(8, 3 + Math.floor(enemy.level / 2)));
          setTimeout(() => { playSound('gold'); playSound('death'); playSound('levelup'); }, 150);
          setCombatLog(`☠️ ${enemy.name} derrotado! +ouro`);
        } else {
          setCombatLog(isCrit ? `⚡ CRÍTICO! −${actualDmg} HP` : `⚔️ Acertou! −${actualDmg} HP`);
        }
      } else {
        playSound('damage');
        triggerFlash('#3D0A0A');
        setPlayerShake(true);
        setTimeout(() => setPlayerShake(false), 400);
        resetStreak();
        setCombatLog(`💢 Errou! ${enemy.name} contra-atacou!`);
      }
    } else {
      // Offline combat
      const { result, isCrit, actualDmg, correct } = localAttack(opt.isCorrect);
      if (correct) {
        setAttackIsCrit(isCrit);
        setAttackVisible(true);
        setTimeout(() => setAttackVisible(false), 420);
        setEnemyFlash(true);
        setTimeout(() => { setEnemyFlash(false); setEnemyShake(true); }, 80);
        setTimeout(() => setEnemyShake(false), 450);
        addDmg(actualDmg, isCrit);
        playSound(isCrit ? 'crit' : 'hit');
        triggerFlash(isCrit ? '#78350F' : '#162040');
        incrementStreak();
        if (result === 'dead') {
          collectGold(10 + enemy.level * 3);
          addCoins(Math.min(8, 3 + Math.floor(enemy.level / 2)));
          setTimeout(() => { playSound('gold'); playSound('death'); playSound('levelup'); }, 150);
          setCombatLog(`☠️ ${enemy.name} derrotado! +ouro`);
        } else {
          setCombatLog(isCrit ? `⚡ CRÍTICO! −${actualDmg} HP` : `⚔️ Acertou! −${actualDmg} HP`);
        }
      } else {
        playSound('damage');
        triggerFlash('#3D0A0A');
        setPlayerShake(true);
        setTimeout(() => setPlayerShake(false), 400);
        resetStreak();
        setCombatLog(`💢 Errou! −${actualDmg} HP`);
      }
    }
  };

  const handleContinue = () => {
    const answerWasCorrect = selectedIdx !== null && shuffledOpts[selectedIdx]?.isCorrect;
    const enemyDefeated = answerWasCorrect && enemy.hp <= 0;
    if (enemyDefeated) spawnNextEnemy();
    setSelectedIdx(null);
    setQIndex(q => q + 1);
    setCombatLog('');
  };

  if (!currentQ) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', flexDirection: 'column', gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
          <span style={{ fontSize: '2.5rem' }}>⚙️</span>
        </motion.div>
        <span style={{ color: '#475569', fontWeight: 700 }}>Carregando questões...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', display: 'flex', flexDirection: 'column', color: 'white' }}>

      {/* Screen flash */}
      <AnimatePresence>{flashColor && <ScreenFlash key={flashColor + Date.now()} color={flashColor} />}</AnimatePresence>

      {/* Modals */}
      <AnimatePresence>{pendingRunUpgrades && !pendingItemDrop && <PowerUpModal upgrades={pendingRunUpgrades} onChoose={chooseRunUpgrade} onSkip={skipRunUpgrade} />}</AnimatePresence>
      <AnimatePresence>{pendingItemDrop && <ItemChestModal onPick={pickItem} onSkip={dismissItemDrop} ownedIds={runItems.map(x => x.id)} />}</AnimatePresence>

      {/* ── Top Bar ── */}
      <div style={{
        padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0, zIndex: 10,
      }}>
        {/* Back */}
        <button onClick={() => navigate('/home')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#475569', fontWeight: 800, fontSize: '0.85rem',
          padding: '6px 10px', borderRadius: 10, backgroundColor: '#0F172A', border: '1px solid #1E293B',
        }}>
          <ArrowLeft size={15} /> Base
        </button>

        {/* Center: streak + ai status */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* AI pill */}
          <span style={{
            fontSize: '0.6rem', fontWeight: 800, padding: '3px 8px', borderRadius: 999,
            backgroundColor: aiStatus === 'ok' ? '#052E16' : '#1C1917',
            color: aiStatus === 'ok' ? '#86EFAC' : '#475569',
            border: `1px solid ${aiStatus === 'ok' ? '#166534' : '#1E293B'}`,
          }}>
            {aiStatus === 'ok' ? '✦ IA' : '📖 Banco'}
          </span>
          {/* Streak */}
          {streak >= 2 && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                backgroundColor: '#431407', border: '1px solid #ea580c',
                borderRadius: 999, padding: '3px 10px',
                fontSize: '0.75rem', fontWeight: 900, color: '#fb923c',
              }}>
              <Flame size={11} /> {streak}
            </motion.div>
          )}
        </div>

        {/* Gold */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          backgroundColor: '#1C0A00', border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: 10, padding: '5px 10px',
        }}>
          <span style={{ fontSize: '0.9rem' }}>🪙</span>
          <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#FBBF24' }}>{gold}</span>
        </div>
      </div>

      {/* ── Battle Arena ── */}
      <BattleArena
        enemy={enemy}
        player={player}
        enemyShake={enemyShake}
        enemyFlash={enemyFlash}
        playerShake={playerShake}
        coins={coins}
        damageNumbers={damageNumbers}
        onRemoveCoin={(id: number) => setCoins(c => c.filter(x => x.id !== id))}
        onRemoveDmg={(id: number) => setDamageNumbers(d => d.filter(x => x.id !== id))}
        combatLog={combatLog}
        attackVisible={attackVisible}
        attackIsCrit={attackIsCrit}
      />

      {/* ── Question Section ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 140px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}>

            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                padding: '3px 10px', borderRadius: 999,
                backgroundColor: '#0F172A', border: '1px solid #1E293B',
                fontSize: '0.68rem', fontWeight: 800, color: '#475569',
              }}>Q{qIndex + 1}</div>
              {currentQ.source === 'real' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, backgroundColor: '#052E16', border: '1px solid #166534' }}>
                  <BookOpen size={9} color="#86EFAC" />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#86EFAC' }}>Real</span>
                </div>
              )}
              {currentQ.source === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, backgroundColor: '#0F2040', border: '1px solid #1D4ED8' }}>
                  <Zap size={9} color="#93C5FD" />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#93C5FD' }}>IA</span>
                </div>
              )}
              {currentQ.topic && (
                <span style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 700, marginLeft: 'auto' }}>
                  {currentQ.topic}
                </span>
              )}
            </div>

            {/* Question text */}
            <div style={{
              fontSize: '1rem', fontWeight: 700, lineHeight: 1.6, color: '#E2E8F0',
              marginBottom: 16, padding: '14px 16px',
              backgroundColor: '#0F172A', borderRadius: 14, border: '1px solid #1E293B',
            }}>
              {currentQ.text}
            </div>

            {/* Answer options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {shuffledOpts.map((opt: any, i: number) => {
                const isSel = selectedIdx === i;
                const isRev = selectedIdx !== null;
                const isCorrect = opt.isCorrect;

                let bg = '#111827';
                let border = 'rgba(255,255,255,0.06)';
                let txtColor = '#CBD5E1';
                let opacity = 1;
                let icon = null;

                if (isRev) {
                  if (isCorrect)         { bg = '#052E16'; border = '#22C55E'; txtColor = '#86EFAC'; icon = '✅'; }
                  else if (isSel)        { bg = '#2D0A0A'; border = '#EF4444'; txtColor = '#FCA5A5'; icon = '❌'; }
                  else                   { opacity = 0.25; }
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={isRev || isGameOver}
                    animate={isSel && !isCorrect ? { x: [-10, 10, -6, 6, 0] } : {}}
                    whileTap={!isRev ? { scale: 0.985 } : {}}
                    style={{
                      textAlign: 'left', padding: '14px 16px', borderRadius: 14,
                      backgroundColor: bg,
                      border: `1.5px solid ${border}`,
                      color: txtColor, fontWeight: 600, fontSize: '0.92rem',
                      lineHeight: 1.45, opacity,
                      transition: 'all 0.18s',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
                      boxShadow: isRev ? 'none' : '0 2px 0 rgba(0,0,0,0.4)',
                    }}>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    {isRev && icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation card */}
            {selectedOpt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 12, padding: '14px 16px', borderRadius: 14,
                  backgroundColor: selectedOpt.isCorrect ? '#052E16' : '#1A0505',
                  border: `1.5px solid ${selectedOpt.isCorrect ? '#16A34A' : '#7F1D1D'}`,
                  color: selectedOpt.isCorrect ? '#86EFAC' : '#FCA5A5',
                }}>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={14} />
                  {selectedOpt.isCorrect ? 'Por quê está certa:' : 'Por quê você errou:'}
                </div>
                <div style={{ fontSize: '0.87rem', fontWeight: 600, lineHeight: 1.55, color: selectedOpt.isCorrect ? '#86EFAC' : '#FCA5A5', opacity: 0.9 }}>
                  {selectedOpt.tip}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Continue Button ── */}
      {selectedIdx !== null && !isGameOver && !pendingRunUpgrades && !pendingItemDrop && (
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }}
          style={{
            position: 'fixed', bottom: 0,
            left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 600,
            padding: '12px 16px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            backgroundColor: 'rgba(10,15,30,0.97)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            zIndex: 50,
          }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            style={{
              width: '100%', padding: '18px',
              borderRadius: 16, fontWeight: 900, fontSize: '1.05rem',
              background: selectedOpt?.isCorrect
                ? 'linear-gradient(135deg, #22C55E, #15803D)'
                : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              color: 'white',
              boxShadow: `0 5px 0 ${selectedOpt?.isCorrect ? '#14532D' : '#1e3a8a'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            {enemy.hp <= 0 && selectedOpt?.isCorrect
              ? `🎁 Escolher Power-Up! (Lv.${enemy.level + 1})`
              : selectedOpt?.isCorrect ? '✓ Próxima questão →' : '→ Continuar'}
          </motion.button>
        </motion.div>
      )}

      {/* ── Game Over Screen ── */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 200,
            }}>
            <motion.div
              initial={{ y: 500 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{
                padding: '32px 24px', paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
                background: 'linear-gradient(180deg, #0F172A 0%, #0A0F1E 100%)',
                borderRadius: '28px 28px 0 0',
                border: '1px solid rgba(239,68,68,0.2)',
                textAlign: 'center',
              }}>
              <motion.div
                animate={{ rotate: [0,-12,12,-8,0] }} transition={{ repeat: Infinity, duration: 2.5 }}
                style={{ fontSize: '5rem', marginBottom: 16 }}>💀</motion.div>
              <h1 className="pixel-text" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EF4444', marginBottom: 8, letterSpacing: 2 }}>
                GAME OVER
              </h1>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 6, fontWeight: 700 }}>
                Derrotado por: <span style={{ color: '#E2E8F0' }}>{enemy.emoji} {enemy.name} Lv.{enemy.level}</span>
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                backgroundColor: '#1C0A00', border: '1.5px solid rgba(251,191,36,0.3)',
                borderRadius: 12, padding: '10px 20px', margin: '16px 0 28px',
              }}>
                <span style={{ fontSize: '1.3rem' }}>🪙</span>
                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#FBBF24' }}>{gold}</span>
                <span style={{ color: '#92400E', fontSize: '0.8rem', fontWeight: 700 }}>de ouro preservado</span>
              </div>

              {/* Stats summary */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                {[
                  { label: 'Kill streak', val: streak, icon: '🔥' },
                  { label: 'Nível atingido', val: `Lv.${enemy.level}`, icon: '⚔️' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, backgroundColor: '#0F172A', borderRadius: 12, padding: '12px 8px', border: '1px solid #1E293B' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>{s.val}</div>
                    <div style={{ fontSize: '0.65rem', color: '#334155', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { respawn(); setSelectedIdx(null); setQIndex(0); setCombatLog(''); navigate('/home'); }}
                style={{
                  width: '100%', padding: '18px',
                  background: 'linear-gradient(135deg, #3B82F6, #6D28D9)',
                  color: 'white', borderRadius: 16,
                  fontWeight: 900, fontSize: '1.05rem',
                  boxShadow: '0 5px 0 #1e1b4b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                🏕️ Voltar à Base
              </motion.button>

              <button
                onClick={() => { respawn(); setSelectedIdx(null); setQIndex(0); setCombatLog(''); }}
                style={{ marginTop: 12, width: '100%', padding: '12px', color: '#475569', fontWeight: 800, fontSize: '0.85rem' }}>
                🔄 Tentar novamente
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
