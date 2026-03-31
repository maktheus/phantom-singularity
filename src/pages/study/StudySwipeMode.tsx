import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Skull, Cpu, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { RunPowerUp } from '../../store/useAppStore';
import {
  generateAIQuestions, getRealQuestions, shuffleQuestions,
  REAL_QUESTIONS
} from '../../services/questionEngine';
import type { GeneratedQuestion } from '../../services/questionEngine';
import '../../pixelart.css';


// ─── 8-bit CSS Pixel Sprites ──────────────────────────────────────────────────
// Built purely with CSS box-shadow "pixel" technique — zero image files needed
function PixelSprite({ type, size = 64, shake, flash }: { type: string; size?: number; shake?: boolean; flash?: boolean }) {
  const sprites: Record<string, string> = {
    '🐛': '🐛', '🦊': '🦊', '🐺': '🐺', '🦁': '🦁',
    '📜': '📜', '😈': '😈', '🧙': '🧙', '🐉': '🐉',
    '⚔️': '⚔️', '🔮': '🔮', '🗡️': '🗡️',
  };
  const icon = sprites[type] ?? '👾';

  return (
    <div className={`pixel-art ${shake ? 'anim-shake' : ''}`}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block',
        filter: flash ? 'brightness(5) saturate(0)' : 'none',
        transition: 'filter 0.1s',
        animation: !shake ? 'idle-bob 1.8s ease-in-out infinite' : undefined }}>
      {icon}
    </div>
  );
}

// ─── Attack Animation Overlay ─────────────────────────────────────────────────
function AttackSlash({ isCrit, visible }: { isCrit: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotate: -40 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 1.4, 1.1, 0.8], rotate: [-40, 20, 30, 50] }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ position: 'absolute', top: '10%', left: '30%', fontSize: isCrit ? '4rem' : '3rem',
        zIndex: 20, pointerEvents: 'none', textShadow: `0 0 20px ${isCrit ? '#FBBF24' : '#F87171'}` }}>
      {isCrit ? '⚡💥' : '⚔️'}
    </motion.div>
  );
}

// ─── Battle Scene Background ──────────────────────────────────────────────────
function BattleScene({ enemyEmoji, enemyHp, enemyMaxHp, enemyName, enemyModifier, enemyShake, enemyFlash, playerHp, playerMaxHp, playerBuild, playerShake, combatLog, coins, damageNumbers, onRemoveCoin, onRemoveDmg }: any) {
  const buildIcon = playerBuild === 'warrior' ? '🛡️' : playerBuild === 'mage' ? '🔮' : '🗡️';
  const buildColor = playerBuild === 'warrior' ? '#EF4444' : playerBuild === 'mage' ? '#8B5CF6' : '#22C55E';

  const modifierBadge: Record<string, string> = {
    armored: '🛡️ ARM', regen: '💚 REG', enraged: '💢 FÚR', boss: '👑 CHEFE', none: ''
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #0C0A09 0%, #1C0A00 40%, #292524 100%)',
      borderBottom: '2px solid #334155' }}>
      <div className="scanlines" style={{ height: '100%', position: 'absolute', inset: 0 }} />

      {/* Sky with moon/stars */}
      <div style={{ padding: '10px 16px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Enemy side */}
          <div style={{ flex: 1 }}>
            <div className="pixel-text" style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: 4 }}>
              {enemyName} {modifierBadge[enemyModifier] && `[${modifierBadge[enemyModifier]}]`}
            </div>
            {/* Enemy HP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Skull size={12} color="#F87171" />
              <div style={{ flex: 1, height: 10, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden', border: '1px solid #334155' }}>
                <motion.div animate={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  style={{ height: '100%', backgroundColor: enemyHp / enemyMaxHp < 0.25 ? '#EF4444' : '#F87171' }} />
              </div>
              <span className="pixel-text" style={{ fontSize: '0.6rem', color: '#64748B' }}>{enemyHp}/{enemyMaxHp}</span>
            </div>
          </div>

          <div style={{ width: 16 }} />

          {/* Player side */}
          <div style={{ flex: 1 }}>
            <div className="pixel-text" style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: 4, textAlign: 'right' }}>
              {buildIcon} Herói
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Heart size={12} color={buildColor} fill={buildColor} />
              <div style={{ flex: 1, height: 10, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden', border: '1px solid #334155' }}>
                <motion.div animate={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  style={{ height: '100%', backgroundColor: playerHp / playerMaxHp < 0.25 ? '#EF4444' : buildColor }} />
              </div>
              <span className="pixel-text" style={{ fontSize: '0.6rem', color: '#64748B' }}>{playerHp}/{playerMaxHp}</span>
            </div>
          </div>
        </div>

        {/* Battle sprites row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 12, position: 'relative', minHeight: 100 }}>
          {/* Enemy sprite */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PixelSprite type={enemyEmoji} size={60} shake={enemyShake} flash={enemyFlash} />
            {/* Coin particles */}
            <div style={{ position: 'absolute', top: 0, left: '50%' }}>
              <AnimatePresence>
                {coins.map((c: any) => (
                  <motion.div key={c.id}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: (Math.random() - 0.5) * 120, y: -(40 + Math.random() * 60), opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    onAnimationComplete={() => onRemoveCoin(c.id)}
                    style={{ position: 'absolute', fontSize: '1.2rem', pointerEvents: 'none', zIndex: 30 }}>
                    🪙
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Damage numbers */}
            <AnimatePresence>
              {damageNumbers.map((d: any) => (
                <motion.div key={d.id}
                  initial={{ y: 0, opacity: 1, scale: d.isCrit ? 1.8 : 1 }}
                  animate={{ y: -70, opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  onAnimationComplete={() => onRemoveDmg(d.id)}
                  style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    color: d.isCrit ? '#FBBF24' : '#F87171', fontWeight: 900,
                    fontSize: d.isCrit ? '1.8rem' : '1.2rem', fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 40,
                    whiteSpace: 'nowrap' }}>
                  {d.isCrit ? '⚡' : '-'}{d.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* VS in middle */}
          <div className="pixel-text crt-glow" style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: 900, opacity: 0.6 }}>VS</div>

          {/* Player sprite */}
          <motion.div animate={playerShake ? { x: [-6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PixelSprite type={playerBuild === 'warrior' ? '⚔️' : playerBuild === 'mage' ? '🔮' : '🗡️'} size={60} />
          </motion.div>
        </div>

        {/* Combat Log bar */}
        <AnimatePresence>
          {combatLog && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pixel-text"
              style={{ fontSize: '0.7rem', color: '#FDE68A', backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '6px 10px', borderRadius: 4, marginBottom: 10, textAlign: 'center', border: '1px solid #78350F' }}>
              {combatLog}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Run Upgrade Modal ────────────────────────────────────────────────────────
const RARITY_COLORS = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
const RARITY_BG     = { common: '#1E3A5F', rare: '#2D1B69', legendary: '#451A03' };
const RARITY_LABEL  = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

function RunUpgradeModal({ upgrades, onChoose, onSkip }: { upgrades: RunPowerUp[]; onChoose: (u: RunPowerUp) => void; onSkip: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: 20 }}>
      <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <div style={{ fontSize: '3rem' }}>🎁</div>
          </motion.div>
          <h2 className="pixel-text" style={{ fontWeight: 900, fontSize: '1.1rem', color: 'white', marginTop: 8 }}>INIMIGO DERROTADO!</h2>
          <p style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.9rem' }}>Escolha um poder para esta run</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {upgrades.map(u => (
            <motion.button key={u.id} whileTap={{ scale: 0.96 }} onClick={() => onChoose(u)}
              style={{ padding: '14px 18px', borderRadius: 12, backgroundColor: RARITY_BG[u.rarity],
                border: `2px solid ${RARITY_COLORS[u.rarity]}`, color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 20px ${RARITY_COLORS[u.rarity]}30` }}>
              <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{u.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 900 }}>{u.name}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: RARITY_COLORS[u.rarity],
                    backgroundColor: `${RARITY_COLORS[u.rarity]}20`, padding: '2px 6px', borderRadius: 999 }}>
                    {RARITY_LABEL[u.rarity]}
                  </span>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>{u.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onSkip} style={{ marginTop: 14, width: '100%', padding: '10px', color: '#475569', fontWeight: 700 }}>Pular →</button>
      </motion.div>
    </motion.div>
  );
}

// ─── Sound Effects ────────────────────────────────────────────────────────────
function playSound(type: 'hit' | 'crit' | 'damage' | 'death' | 'gold' | 'levelup') {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    switch (type) {
      case 'hit':    o.type='square';   o.frequency.value=440; g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.12); o.start(); o.stop(ctx.currentTime+0.12); break;
      case 'crit':   o.type='sawtooth'; o.frequency.setValueAtTime(500,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1400,ctx.currentTime+0.3); g.gain.setValueAtTime(0.5,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.45); o.start(); o.stop(ctx.currentTime+0.5); break;
      case 'damage': o.type='sawtooth'; o.frequency.setValueAtTime(200,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.3); g.gain.setValueAtTime(0.4,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.35); o.start(); o.stop(ctx.currentTime+0.4); break;
      case 'death':  o.type='square';   o.frequency.setValueAtTime(350,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+0.6); g.gain.setValueAtTime(0.5,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.7); o.start(); o.stop(ctx.currentTime+0.7); break;
      case 'gold':   o.type='sine';     o.frequency.setValueAtTime(880,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1760,ctx.currentTime+0.15); g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.3); o.start(); o.stop(ctx.currentTime+0.3); break;
      case 'levelup':o.type='sine';     o.frequency.setValueAtTime(523,ctx.currentTime); o.frequency.setValueAtTime(659,ctx.currentTime+0.12); o.frequency.setValueAtTime(784,ctx.currentTime+0.24); o.frequency.setValueAtTime(1046,ctx.currentTime+0.36); g.gain.setValueAtTime(0.4,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.55); o.start(); o.stop(ctx.currentTime+0.6); break;
    }
  } catch { /* silent */ }
}

// ─── Item Chest Modal (VS-style) ─────────────────────────────────────────────
import { ITEM_POOL } from '../../store/useAppStore';

function ItemChestModal({ onPick, onSkip, ownedIds }: { onPick: (id: string) => void; onSkip: () => void; ownedIds: string[] }) {
  const available = ITEM_POOL
    .filter(x => !ownedIds.includes(x.id) && x.rarity !== 'legendary')
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const RARITY_COLOR: Record<string, string> = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
  const RARITY_BG:    Record<string, string> = { common: '#1E3A5F', rare: '#2D1B69', legendary: '#451A03' };
  const RARITY_LABEL: Record<string, string> = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: 20 }}>
      <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.div animate={{ rotate: [0,-15,15,-10,10,0], scale: [1,1.1,1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
            <div style={{ fontSize: '3.5rem' }}>🎁</div>
          </motion.div>
          <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#FBBF24', marginTop: 8 }}>BAÚ DE RECOMPENSA!</h2>
          <p style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.85rem' }}>Escolha 1 item para adicionar à mochila</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map(item => (
            <motion.button key={item.id} whileTap={{ scale: 0.97 }} onClick={() => onPick(item.id)}
              style={{ padding: '14px 18px', borderRadius: 12, backgroundColor: RARITY_BG[item.rarity],
                border: `2px solid ${RARITY_COLOR[item.rarity]}`, color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 20px ${RARITY_COLOR[item.rarity]}25` }}>
              <motion.span animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ fontSize: '2.4rem', flexShrink: 0 }}>{item.emoji}</motion.span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 900 }}>{item.name}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: RARITY_COLOR[item.rarity],
                    backgroundColor: `${RARITY_COLOR[item.rarity]}20`, padding: '2px 6px', borderRadius: 999 }}>
                    {RARITY_LABEL[item.rarity]}
                  </span>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600 }}>{item.desc(1)}</div>
                {item.evolvesIntoWith && (
                  <div style={{ fontSize: '0.7rem', color: '#FBBF24', marginTop: 4, fontWeight: 700 }}>
                    ⭐ Evolui com outro item!
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={onSkip} style={{ marginTop: 14, width: '100%', padding: '10px', color: '#475569', fontWeight: 700 }}>
          Pular →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Screen Flash ─────────────────────────────────────────────────────────────
function ScreenFlash({ color }: { color: string }) {
  return (
    <motion.div initial={{ opacity: 0.7 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: color, pointerEvents: 'none', zIndex: 150 }} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudySwipeMode() {
  const navigate = useNavigate();
  const {
    player, enemy, gold, streak, isGameOver, pendingRunUpgrades, pendingItemDrop,
    attackEnemy, takeDamage, spawnNextEnemy, collectGold,
    respawn, incrementStreak, resetStreak, incrementQuestions,
    chooseRunUpgrade, skipRunUpgrade, pickItem, dismissItemDrop,
    runItems, selectedConcurso: storeConcurso,
  } = useAppStore();

  const [qIndex, setQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<null | number>(null);
  const [enemyShake, setEnemyShake] = useState(false);
  const [enemyFlash, setEnemyFlash] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [coins, setCoins] = useState<{ id: number }[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<{ id: number; value: number; isCrit: boolean }[]>([]);

  // Question system — use store concurso
  const concurso = storeConcurso;
  const [questionQueue, setQuestionQueue] = useState<GeneratedQuestion[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'ok' | 'offline'>('idle');
  const [combatLog, setCombatLog] = useState('');
  const [attackVisible, setAttackVisible] = useState(false);
  const [attackIsCrit, setAttackIsCrit] = useState(false);

  // Build initial queue from real questions
  useEffect(() => {
    const real = shuffleQuestions(getRealQuestions(concurso));
    setQuestionQueue(real.length > 0 ? real : shuffleQuestions(REAL_QUESTIONS));
    setQIndex(0);
  }, [concurso]);

  // Try loading AI questions in the background
  useEffect(() => {
    let cancelled = false;
    setAiStatus('loading');
    generateAIQuestions(concurso, 3)
      .then(aiQs => {
        if (cancelled) return;
        setQuestionQueue(prev => shuffleQuestions([...prev, ...aiQs]));
        setAiStatus('ok');
      })
      .catch(() => { if (!cancelled) setAiStatus('offline'); });
    return () => { cancelled = true; };
  }, [concurso]);

  const currentQ = questionQueue[qIndex % Math.max(1, questionQueue.length)];
  const shuffledOpts = useMemo(() => {
    if (!currentQ) return [];
    const a = [...currentQ.options];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [qIndex, questionQueue]);

  const addCoins = useCallback((n: number) => {
    setCoins(c => [...c, ...Array.from({ length: n }, (_, i) => ({ id: Date.now() + i + Math.random() }))]);
  }, []);

  const addDmg = (val: number, isCrit: boolean) => {
    setDamageNumbers(d => [...d, { id: Date.now() + Math.random(), value: val, isCrit }]);
  };

  const triggerFlash = (color: string) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 350);
  };

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null || isGameOver || pendingRunUpgrades || !currentQ) return;
    setSelectedIdx(idx);
    incrementQuestions();
    const opt = shuffledOpts[idx];

    if (opt.isCorrect) {
      const { result, isCrit, actualDmg } = attackEnemy();
      setAttackIsCrit(isCrit);
      setAttackVisible(true);
      setTimeout(() => setAttackVisible(false), 450);
      setEnemyFlash(true);
      setTimeout(() => { setEnemyFlash(false); setEnemyShake(true); }, 80);
      setTimeout(() => setEnemyShake(false), 480);
      addDmg(actualDmg, isCrit);
      playSound(isCrit ? 'crit' : 'hit');
      triggerFlash(isCrit ? '#78350F' : '#1E3A5F');
      incrementStreak();

      if (result === 'dead') {
        const base = 10 + enemy.level * 3;
        collectGold(base);
        addCoins(Math.min(10, 3 + Math.floor(enemy.level / 2)));
        setTimeout(() => { playSound('gold'); playSound('death'); playSound('levelup'); }, 150);
        setCombatLog(`☠️ ${enemy.name} derrotado! ${enemy.modifier === 'boss' ? '×3 OURO DE CHEFE!' : 'Ouro coletado!'}`);
      } else {
        setCombatLog(isCrit ? `⚡ CRÍTICO! ${actualDmg} de dano!` : `⚔️ Acertou! ${actualDmg} de dano.${enemy.modifier === 'regen' ? ' (inimigo regen +3HP)' : ''}`);
      }
    } else {
      const base = 10 + enemy.level * 2;
      const dmg = Math.max(5, Math.floor(base * (enemy.modifier === 'enraged' ? 2 : 1)));
      takeDamage(dmg);
      playSound('damage');
      triggerFlash('#450A0A');
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 500);
      resetStreak();
      setCombatLog(`💢 ${enemy.name} contra-ataca! −${dmg} HP${enemy.modifier === 'enraged' ? ' (FURIOSO!)' : ''}`);
    }
  };

  const handleContinue = () => {
    const defeated = selectedIdx !== null && shuffledOpts[selectedIdx]?.isCorrect && enemy.hp === 0;
    if (defeated) spawnNextEnemy();
    setSelectedIdx(null);
    setQIndex(q => q + 1);
    setCombatLog('');
  };

  const selectedOpt = selectedIdx !== null ? shuffledOpts[selectedIdx] : null;
  // Build color used in battle scene via playerBuild prop

  if (!currentQ) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0F172A', color: 'white' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}>⚙️</motion.div>
        <span style={{ marginLeft: 12 }}>Carregando questões...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'Nunito, system-ui, sans-serif' }}>
      <AnimatePresence>{flashColor && <ScreenFlash key={flashColor + Date.now()} color={flashColor} />}</AnimatePresence>
      <AnimatePresence>{pendingRunUpgrades && !pendingItemDrop && <RunUpgradeModal upgrades={pendingRunUpgrades} onChoose={chooseRunUpgrade} onSkip={skipRunUpgrade} />}</AnimatePresence>

      {/* VS Item Chest Modal */}
      <AnimatePresence>
        {pendingItemDrop && (
          <ItemChestModal
            onPick={pickItem}
            onSkip={dismissItemDrop}
            ownedIds={runItems.map(x => x.id)}
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', borderBottom: '1px solid #334155', flexShrink: 0 }}>
        <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontWeight: 700 }}>
          <ArrowLeft size={18} /> Base
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* AI Status pill */}
          <span title={aiStatus === 'ok' ? 'IA gerando questões' : aiStatus === 'loading' ? 'Conectando IA...' : 'Banco real'}             style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 6px', borderRadius: 999,
              backgroundColor: aiStatus === 'ok' ? '#052E16' : aiStatus === 'loading' ? '#1E3A5F' : '#1C1917',
              color: aiStatus === 'ok' ? '#86EFAC' : aiStatus === 'loading' ? '#93C5FD' : '#64748B',
              display: 'flex', alignItems: 'center', gap: 4 }}>
            <Cpu size={10} />
            {aiStatus === 'ok' ? 'IA ON' : aiStatus === 'loading' ? 'IA...' : 'Banco'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: '#FBBF24', fontSize: '0.95rem' }}>🪙 {gold}</span>
          {streak >= 2 && (
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
              style={{ fontWeight: 900, color: '#FB923C', fontSize: '0.9rem' }}>
              🔥{streak}
            </motion.span>
          )}
        </div>
      </div>

      {/* Battle Scene */}
      <div style={{ flexShrink: 0, position: 'relative' }}>
        <BattleScene
          enemyEmoji={enemy.emoji}
          enemyHp={enemy.hp}
          enemyMaxHp={enemy.maxHp}
          enemyName={enemy.name}
          enemyLevel={enemy.level}
          enemyModifier={enemy.modifier}
          enemyShake={enemyShake}
          enemyFlash={enemyFlash}
          playerHp={player.hp}
          playerMaxHp={player.maxHp}
          playerBuild={player.build}
          playerShake={playerShake}
          combatLog={combatLog}
          coins={coins}
          damageNumbers={damageNumbers}
          onRemoveCoin={(id: number) => setCoins(c => c.filter(x => x.id !== id))}
          onRemoveDmg={(id: number) => setDamageNumbers(d => d.filter(x => x.id !== id))}
        />
        <AttackSlash isCrit={attackIsCrit} visible={attackVisible} />
      </div>

      {/* Question Section */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 140px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={qIndex}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}>

            {/* Question meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Q{qIndex + 1}
                </span>
                {currentQ.source === 'ai' && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#1E3A5F', color: '#93C5FD',
                    padding: '2px 6px', borderRadius: 999 }}>
                    <Cpu size={9} style={{ display: 'inline', marginRight: 2 }} />IA
                  </span>
                )}
                {currentQ.source === 'real' && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#052E16', color: '#86EFAC',
                    padding: '2px 6px', borderRadius: 999 }}>
                    <BookOpen size={9} style={{ display: 'inline', marginRight: 2 }} />Real
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>Lv.{enemy.level}</span>
            </div>

            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.55, marginBottom: 14, color: '#E2E8F0' }}>
              {currentQ.text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {shuffledOpts.map((opt, i) => {
                const isSel = selectedIdx === i;
                const isRev = selectedIdx !== null;
                let bg = '#1E293B', border = '#334155', txtColor = '#CBD5E1', opacity = 1;
                if (isRev) {
                  if (opt.isCorrect)  { bg = '#052E16'; border = '#22C55E'; txtColor = '#86EFAC'; }
                  else if (isSel)     { bg = '#450A0A'; border = '#EF4444'; txtColor = '#FCA5A5'; }
                  else                { opacity = 0.2; }
                }
                return (
                  <motion.button key={i} onClick={() => handleSelect(i)} disabled={isRev || isGameOver}
                    animate={isSel && !opt.isCorrect ? { x: [-12, 12, -8, 8, 0] } : {}}
                    whileTap={!isRev ? { scale: 0.97 } : {}}
                    style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 12, backgroundColor: bg,
                      border: `2px solid ${border}`, color: txtColor, fontWeight: 700, fontSize: '0.94rem',
                      lineHeight: 1.4, opacity, transition: 'all 0.2s',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      boxShadow: isRev ? 'none' : '0 3px 0 #0F172A' }}>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    {isRev && opt.isCorrect && <span style={{ marginLeft: 10, flexShrink: 0 }}>✅</span>}
                    {isRev && isSel && !opt.isCorrect && <span style={{ marginLeft: 10, flexShrink: 0 }}>❌</span>}
                  </motion.button>
                );
              })}
            </div>

            {selectedOpt && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 14, padding: '13px 16px', borderRadius: 12,
                  backgroundColor: selectedOpt.isCorrect ? '#052E16' : '#450A0A',
                  border: `2px solid ${selectedOpt.isCorrect ? '#22C55E' : '#EF4444'}`,
                  color: selectedOpt.isCorrect ? '#86EFAC' : '#FCA5A5', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: 6 }}>
                  {selectedOpt.isCorrect ? '📖 Por quê está certa:' : '📖 Por quê você errou:'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedOpt.tip}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      {selectedIdx !== null && !isGameOver && !pendingRunUpgrades && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 18px',
            backgroundColor: '#0F172A', borderTop: '1px solid #1E293B', zIndex: 50 }}>
          <button onClick={handleContinue}
            style={{ width: '100%', padding: '17px', borderRadius: 14, fontWeight: 900, fontSize: '1.1rem',
              backgroundColor: selectedOpt?.isCorrect ? '#22C55E' : '#3B82F6',
              color: 'white', boxShadow: `0 5px 0 ${selectedOpt?.isCorrect ? '#15803D' : '#1D4ED8'}` }}>
            {enemy.hp === 0 && selectedOpt?.isCorrect ? `🎁 Escolher Power-Up! (Lv.${enemy.level + 1})` : 'Continuar →'}
          </button>
        </motion.div>
      )}

      {/* Game Over */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center', zIndex: 200, padding: 32, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0.7, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}>
              <motion.div animate={{ rotate: [0, -12, 12, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <div style={{ fontSize: '5rem', marginBottom: 16 }}>💀</div>
              </motion.div>
              <h1 className="pixel-text" style={{ fontSize: '2rem', fontWeight: 900, color: '#EF4444', marginBottom: 8 }}>GAME OVER</h1>
              <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: 6 }}>
                Derrotado por: <strong style={{ color: 'white' }}>{enemy.emoji} {enemy.name} Lv.{enemy.level}</strong>
              </p>
              <p style={{ color: '#FBBF24', fontWeight: 800, fontSize: '1.2rem', marginBottom: 36 }}>🪙 {gold} de ouro preservado</p>
              <button onClick={() => { respawn(); setSelectedIdx(null); setQIndex(0); setCombatLog(''); }}
                style={{ padding: '18px 40px', backgroundColor: '#3B82F6', color: 'white', borderRadius: 14,
                  fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 6px 0 #1D4ED8', width: '100%' }}>
                🏕️ Voltar à Base
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
