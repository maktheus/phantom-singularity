import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, BookOpen, Flame, Pause, Play, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, powerUpStackCost } from '../../store/useAppStore';
import type { RunPowerUp, RunItem, BuildType } from '../../store/useAppStore';
import { getRealQuestions, shuffleQuestions, REAL_QUESTIONS } from '../../services/questionEngine';
import '../../pixelart.css';

// ─── Pause Modal ─────────────────────────────────────────────────────────────
function PauseModal({ onResume, onAbandon, runKills, gold, enemyLevel, soundEnabled, onToggleSound }: {
  onResume: () => void;
  onAbandon: () => void;
  runKills: number;
  gold: number;
  enemyLevel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        style={{
          width: '100%', maxWidth: 380,
          background: 'linear-gradient(160deg, #111827 0%, #0A0F1E 100%)',
          borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Pause size={16} color="#818CF8" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#F1F5F9' }}>Pausado</div>
              <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700 }}>Run em andamento</div>
            </div>
          </div>
          {/* Sound toggle */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={onToggleSound} style={{
            width: 36, height: 36, borderRadius: 10,
            background: soundEnabled ? 'rgba(34,197,94,0.12)' : 'rgba(71,85,105,0.15)',
            border: `1px solid ${soundEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(71,85,105,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            {soundEnabled
              ? <Volume2 size={16} color="#22C55E" />
              : <VolumeX size={16} color="#475569" />}
          </motion.button>
        </div>

        {/* Run stats */}
        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: '⚔️', label: 'Nível', value: enemyLevel },
            { icon: '💀', label: 'Kills', value: runKills },
            { icon: '🪙', label: 'Ouro', value: gold },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              textAlign: 'center', padding: '12px 8px',
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#F1F5F9' }}>{value}</div>
              <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Resume */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onResume}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              color: 'white', borderRadius: 14, border: 'none',
              fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 0 rgba(49,46,129,0.8)',
            }}
          >
            <Play size={18} /> Continuar Run
          </motion.button>

          {/* Abandon */}
          {!confirmAbandon ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmAbandon(true)}
              style={{
                width: '100%', padding: '13px',
                background: 'rgba(239,68,68,0.08)',
                color: '#F87171', borderRadius: 14,
                border: '1px solid rgba(239,68,68,0.2)',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <LogOut size={16} /> Abandonar Run
            </motion.button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmAbandon(false)}
                style={{
                  flex: 1, padding: '13px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94A3B8', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onAbandon}
                style={{
                  flex: 1, padding: '13px',
                  background: 'linear-gradient(135deg,#EF4444,#991B1B)',
                  color: 'white', borderRadius: 14, border: 'none',
                  fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                ☠️ Confirmar
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tutorial Hint (non-blocking overlay) ────────────────────────────────────
function TutorialHint({ text, emoji, visible }: { text: string; emoji: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          style={{
            position: 'absolute', bottom: 12, left: 12, right: 12,
            background: 'rgba(10,15,30,0.96)',
            border: '1px solid rgba(99,102,241,0.45)',
            borderRadius: 16, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            zIndex: 250,
            boxShadow: '0 4px 32px rgba(99,102,241,0.2)',
            backdropFilter: 'blur(10px)',
          }}>
          {/* Pulse dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{emoji}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
  if (!useAppStore.getState().soundEnabled) return;
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

function PowerUpModal({ upgrades, playerBuild, onChoose, onSkip, gold, runPowerUpCounts }: {
  upgrades: RunPowerUp[];
  playerBuild: BuildType;
  onChoose: (u: RunPowerUp) => void;
  onSkip: () => void;
  gold: number;
  runPowerUpCounts: Record<string, number>;
}) {
  const isLucky = upgrades.length >= 4; // 4 choices = lucky roll

  const buildColor = playerBuild === 'warrior' ? '#EF4444' : playerBuild === 'mage' ? '#8B5CF6' : '#22C55E';
  const buildName  = playerBuild === 'warrior' ? 'Guerreiro' : playerBuild === 'mage' ? 'Mago' : 'Ladino';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', zIndex: 200 }}>
      <motion.div
        initial={{ y: 400 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          padding: '20px 20px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          background: '#0F172A', borderRadius: '24px 24px 0 0',
          border: `1px solid ${isLucky ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: isLucky ? '0 -8px 40px rgba(251,191,36,0.15)' : 'none',
        }}>

        {/* Lucky roll banner */}
        {isLucky && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{
              textAlign: 'center', marginBottom: 10,
              background: 'linear-gradient(90deg, #78350F, #92400E, #78350F)',
              borderRadius: 12, padding: '7px 14px',
              border: '1px solid #FBBF24',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            <motion.span animate={{ rotate: [0,15,-15,0] }} transition={{ repeat: Infinity, duration: 0.8 }}>🎰</motion.span>
            <span style={{ fontWeight: 900, fontSize: '0.78rem', color: '#FBBF24', letterSpacing: 1 }}>SORTE RARA — 4 OPÇÕES!</span>
            <motion.span animate={{ rotate: [0,-15,15,0] }} transition={{ repeat: Infinity, duration: 0.8 }}>🎰</motion.span>
          </motion.div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <motion.div animate={{ rotate: [0,-10,10,0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <span style={{ fontSize: isLucky ? '2.5rem' : '2rem' }}>{isLucky ? '🎁✨' : '🎁'}</span>
          </motion.div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem', marginTop: 6 }}>INIMIGO DERROTADO!</h2>
          <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', marginTop: 3 }}>Escolha 1 poder para esta run</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {upgrades.map(u => {
            const isClassExclusive = !!u.forClass;
            const count = runPowerUpCounts[u.id] ?? 0;
            const cost = powerUpStackCost(u.rarity, count);
            const canAfford = cost === 0 || gold >= cost;
            return (
              <motion.button key={u.id} whileTap={canAfford ? { scale: 0.97 } : {}} onClick={() => canAfford && onChoose(u)}
                disabled={!canAfford}
                style={{
                  padding: '13px 16px', borderRadius: 14,
                  background: isClassExclusive
                    ? `linear-gradient(135deg, ${buildColor}18, #0A0F1E)`
                    : `linear-gradient(135deg, ${RARITY_BG[u.rarity]}, #0A0F1E)`,
                  border: `1.5px solid ${isClassExclusive ? buildColor + '60' : RARITY_COLORS[u.rarity] + '40'}`,
                  color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: isClassExclusive
                    ? `0 4px 20px ${buildColor}20`
                    : `0 4px 20px ${RARITY_COLORS[u.rarity]}15`,
                  position: 'relative', overflow: 'hidden',
                  opacity: canAfford ? 1 : 0.4,
                  cursor: canAfford ? 'pointer' : 'default',
                }}>
                {/* Class-exclusive shimmer */}
                {isClassExclusive && (
                  <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 2.5 }}
                    style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent 40%,${buildColor}15 50%,transparent 60%)`, pointerEvents: 'none' }} />
                )}
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{u.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{u.name}</span>
                    {count > 0 && (
                      <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94A3B8', backgroundColor: 'rgba(148,163,184,0.15)', padding: '2px 6px', borderRadius: 999, border: '1px solid rgba(148,163,184,0.3)' }}>
                        ×{count + 1}
                      </span>
                    )}
                    {isClassExclusive && (
                      <span style={{ fontSize: '0.55rem', fontWeight: 900, color: buildColor, backgroundColor: `${buildColor}22`, padding: '2px 6px', borderRadius: 999, border: `1px solid ${buildColor}40` }}>
                        {buildName.toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: RARITY_COLORS[u.rarity], backgroundColor: `${RARITY_COLORS[u.rarity]}18`, padding: '2px 6px', borderRadius: 999 }}>
                      {RARITY_LABEL[u.rarity]}
                    </span>
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600 }}>{u.desc}</div>
                </div>
                {/* Cost badge */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  {cost === 0 ? (
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.15)', padding: '3px 8px', borderRadius: 999 }}>GRÁTIS</span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: canAfford ? '#FBBF24' : '#F87171', backgroundColor: canAfford ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)', padding: '3px 8px', borderRadius: 999 }}>
                      🪙 {cost}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
        <button onClick={onSkip} style={{ marginTop: 12, width: '100%', padding: '10px', color: '#334155', fontWeight: 800, fontSize: '0.82rem' }}>
          Pular →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Item Chest Modal + Evolution Reveal ─────────────────────────────────────
import { ITEM_POOL, EVOLUTION_TABLE } from '../../store/useAppStore';

const RCOLOR: Record<string, string> = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
const RBG:    Record<string, string> = { common: '#0F2040', rare: '#1E1040', legendary: '#2D1500' };
const RLABEL: Record<string, string> = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

// Checks if adding `item` to current runItems would trigger an evolution
function wouldEvolve(item: RunItem, runItems: RunItem[]): { evolvedId: string; evolvedItem: RunItem } | null {
  const hypothetical = [...runItems, { ...item, level: item.category === 'weapon' ? item.maxLevel : 1 }];
  const weapons = hypothetical.filter(x => x.category === 'weapon' && x.level >= x.maxLevel);
  const passives = hypothetical.filter(x => x.category === 'passive');
  for (const w of weapons) {
    for (const p of passives) {
      const key = `${w.id}+${p.id}`;
      if (EVOLUTION_TABLE[key]) {
        const evolved = ITEM_POOL.find(x => x.id === EVOLUTION_TABLE[key]);
        if (evolved) return { evolvedId: EVOLUTION_TABLE[key], evolvedItem: evolved };
      }
    }
  }
  return null;
}

// Returns a synergy hint string for an item (null if no synergy to show)
function getSynergyHint(item: RunItem, runItems: RunItem[]): string | null {
  if (item.category === 'weapon' && item.evolvesIntoWith) {
    const passive = ITEM_POOL.find(x => x.id === item.evolvesIntoWith);
    if (passive) return `🔗 Evolui com: ${passive.emoji} ${passive.name}`;
  }
  if (item.category === 'passive') {
    for (const key of Object.keys(EVOLUTION_TABLE)) {
      const [wId, pId] = key.split('+');
      if (pId === item.id) {
        const weapon = ITEM_POOL.find(x => x.id === wId);
        if (weapon) {
          const ownedWeapon = runItems.find(r => r.id === wId);
          return `🔗 Catalisa: ${weapon.emoji} ${weapon.name}${ownedWeapon ? ' ✓' : ''}`;
        }
      }
    }
  }
  return null;
}

function ItemChestModal({ onPick, onSkip, ownedIds, runItems }: {
  onPick: (id: string) => void;
  onSkip: () => void;
  ownedIds: string[];
  runItems: RunItem[];
}) {
  // Roll 3 choices once (stable via useState)
  const [choices] = useState<RunItem[]>(() => {
    const notOwned = ITEM_POOL.filter(x => x.rarity !== 'legendary' && !ownedIds.includes(x.id));
    const upgradeable = ITEM_POOL.filter(x => {
      const inRun = runItems.find(r => r.id === x.id);
      return inRun && inRun.level < inRun.maxLevel;
    });
    const pool = [...notOwned, ...upgradeable].sort(() => Math.random() - 0.5);
    const unique: RunItem[] = [];
    const seen = new Set<string>();
    for (const item of pool) {
      if (!seen.has(item.id)) { seen.add(item.id); unique.push(item); }
      if (unique.length === 3) break;
    }
    return unique;
  });

  const anyEvolution = choices.some(c => wouldEvolve(c, runItems));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', zIndex: 200 }}>
      <motion.div
        initial={{ y: 500 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ padding: '24px 20px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          background: '#080D1A', borderRadius: '24px 24px 0 0', border: `1px solid ${anyEvolution ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.07)'}` }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <motion.span
            animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ fontSize: '3.5rem', display: 'block', lineHeight: 1, marginBottom: 8 }}>
            🎁
          </motion.span>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#FBBF24', marginBottom: 6 }}>
            BAÚ DE RECOMPENSA!
          </h2>
          {anyEvolution && (
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 1.1 }}
              style={{
                display: 'inline-block', padding: '4px 16px', borderRadius: 999, marginBottom: 8,
                background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                color: '#000', fontWeight: 900, fontSize: '0.78rem',
              }}>
              ⚡ EVOLUÇÃO DISPONÍVEL!
            </motion.div>
          )}
          <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.82rem' }}>
            Escolha 1 item para a mochila
          </p>
        </div>

        {/* 3 choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {choices.map((item, i) => {
            const evo = wouldEvolve(item, runItems);
            const synergy = getSynergyHint(item, runItems);
            const isUpgrade = ownedIds.includes(item.id);
            const ownedItem = runItems.find(r => r.id === item.id);
            const color = evo ? '#FBBF24' : RCOLOR[item.rarity];
            const bg    = evo ? '#2D1500' : RBG[item.rarity];

            return (
              <motion.button key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 340, damping: 28 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPick(item.id)}
                style={{
                  padding: '14px 16px', borderRadius: 16,
                  background: evo
                    ? 'linear-gradient(135deg, #2D1500, #180C00)'
                    : `linear-gradient(135deg, ${bg}, #0A0F1E)`,
                  border: `2px solid ${evo ? '#FBBF24' : `${color}50`}`,
                  color: 'white', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: evo ? '0 0 24px rgba(251,191,36,0.25)' : `0 4px 20px ${color}12`,
                  position: 'relative', overflow: 'hidden',
                }}>
                {/* Shimmer on evolution items */}
                {evo && (
                  <motion.div
                    animate={{ x: ['-100%', '220%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', top: 0, bottom: 0, width: '40%',
                      background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.18), transparent)',
                      pointerEvents: 'none',
                    }} />
                )}

                {/* Emoji */}
                <motion.span
                  animate={evo
                    ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                    : { y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: evo ? 1.6 : 2.5 }}
                  style={{ fontSize: '2.4rem', flexShrink: 0, lineHeight: 1 }}>
                  {item.emoji}
                </motion.span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '0.93rem' }}>{item.name}</span>
                    {evo ? (
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#000',
                        background: '#FBBF24', padding: '2px 8px', borderRadius: 999 }}>
                        ⚡ EVOLUI!
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, color,
                        background: `${color}18`, padding: '2px 6px', borderRadius: 999 }}>
                        {isUpgrade ? '▲ LEVEL UP' : RLABEL[item.rarity]}
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 600,
                    marginBottom: (evo || synergy) ? 5 : 0 }}>
                    {isUpgrade && ownedItem
                      ? `Lv.${ownedItem.level}→${ownedItem.level + 1}: ${item.desc(ownedItem.level + 1)}`
                      : item.desc(1)}
                  </div>
                  {/* Synergy / evolution result */}
                  {evo ? (
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FBBF24',
                      display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⭐ Vira: {evo.evolvedItem.emoji} {evo.evolvedItem.name}
                    </div>
                  ) : synergy ? (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>
                      {synergy}
                    </div>
                  ) : null}
                </div>

                <span style={{ fontSize: '1.4rem', color: `${color}80`, flexShrink: 0 }}>›</span>
              </motion.button>
            );
          })}
        </div>

        <button onClick={onSkip}
          style={{ marginTop: 14, width: '100%', padding: '12px', color: '#334155', fontWeight: 800, fontSize: '0.85rem' }}>
          Pular →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Evolution Reveal Modal ───────────────────────────────────────────────────
function EvolutionRevealModal({ itemId, onConfirm }: { itemId: string; onConfirm: () => void }) {
  const item = ITEM_POOL.find(x => x.id === itemId);
  if (!item) return null;

  // Find which weapon + passive produced this evolution
  const fromEntry = Object.entries(EVOLUTION_TABLE).find(([, v]) => v === itemId);
  let fromWeapon: RunItem | null = null;
  let fromPassive: RunItem | null = null;
  if (fromEntry) {
    const [wId, pId] = fromEntry[0].split('+');
    fromWeapon = ITEM_POOL.find(x => x.id === wId) ?? null;
    fromPassive = ITEM_POOL.find(x => x.id === pId) ?? null;
  }

  const STARS = [...Array(14)].map((_, i) => ({
    angle: i * (360 / 14),
    delay: 0.4 + i * 0.04,
    radius: 100 + Math.random() * 60,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'radial-gradient(ellipse at center, #1A0A00 0%, #080410 60%, #000 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '32px 24px',
        overflow: 'hidden',
      }}>

      {/* Particle ring */}
      {STARS.map((s, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.4, 0],
            x: Math.cos(s.angle * Math.PI / 180) * s.radius,
            y: Math.sin(s.angle * Math.PI / 180) * s.radius,
          }}
          transition={{ delay: s.delay, duration: 1.4, repeat: Infinity, repeatDelay: 1.2 }}
          style={{ position: 'absolute', fontSize: '1.1rem', color: '#FBBF24', pointerEvents: 'none' }}>
          ✦
        </motion.div>
      ))}

      {/* "EVOLUÇÃO!" label */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
        style={{ marginBottom: 16 }}>
        <span style={{
          fontSize: '0.8rem', fontWeight: 900, color: '#FBBF24',
          letterSpacing: 6, textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(251,191,36,0.8)',
        }}>⭐ EVOLUÇÃO!</span>
      </motion.div>

      {/* Big evolved item emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 14 }}
        style={{ marginBottom: 20 }}>
        <motion.span
          animate={{
            scale: [1, 1.08, 1],
            filter: ['drop-shadow(0 0 20px rgba(251,191,36,0.6))', 'drop-shadow(0 0 50px rgba(251,191,36,1))', 'drop-shadow(0 0 20px rgba(251,191,36,0.6))'],
          }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          style={{ fontSize: '7rem', lineHeight: 1, display: 'block' }}>
          {item.emoji}
        </motion.span>
      </motion.div>

      {/* Item name + description */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, type: 'spring' }}
        style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#FBBF24',
          marginBottom: 8, textShadow: '0 2px 12px rgba(251,191,36,0.5)' }}>
          {item.name}
        </div>
        <div style={{ color: '#FDE68A', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.5 }}>
          {item.desc(1)}
        </div>
      </motion.div>

      {/* From: weapon + passive → evolved */}
      {fromWeapon && fromPassive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
            background: 'rgba(255,255,255,0.06)', padding: '12px 20px', borderRadius: 16,
            border: '1px solid rgba(251,191,36,0.2)',
          }}>
          <span style={{ fontSize: '2rem' }}>{fromWeapon.emoji}</span>
          <span style={{ color: '#475569', fontWeight: 900, fontSize: '1.1rem' }}>+</span>
          <span style={{ fontSize: '2rem' }}>{fromPassive.emoji}</span>
          <span style={{ color: '#475569', fontWeight: 900, fontSize: '1.1rem' }}>→</span>
          <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
        </motion.div>
      )}

      {/* Confirm button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        whileTap={{ scale: 0.97 }}
        onClick={onConfirm}
        style={{
          padding: '18px 40px', borderRadius: 16, fontWeight: 900, fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #FBBF24, #D97706)',
          color: '#000', boxShadow: '0 5px 0 #92400E', cursor: 'pointer',
        }}>
        ✦ Incrível! Continuar
      </motion.button>
    </motion.div>
  );
}

// ─── Build Strip ─────────────────────────────────────────────────────────────
// Compact item bar shown during combat: shows items + evolution readiness
function BuildStrip({ runItems, onPress }: { runItems: RunItem[]; onPress: () => void }) {
  if (runItems.length === 0) return null;

  // Detect which items are ready to evolve
  const readyIds = new Set<string>();
  for (const [key, evoId] of Object.entries(EVOLUTION_TABLE)) {
    const [wId, pId] = key.split('+');
    const w = runItems.find(x => x.id === wId);
    const p = runItems.find(x => x.id === pId);
    if (w && w.level >= w.maxLevel && p) {
      readyIds.add(wId);
      readyIds.add(pId);
      readyIds.add(evoId); // evolved item if present
    }
  }
  const hasEvoReady = readyIds.size > 0;

  return (
    <motion.button
      onClick={onPress}
      animate={hasEvoReady ? {
        borderColor: ['rgba(251,191,36,0.3)', 'rgba(251,191,36,0.9)', 'rgba(251,191,36,0.3)'],
      } : {}}
      transition={{ repeat: Infinity, duration: 1.8 }}
      style={{
        width: '100%', flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '6px 14px', gap: 8,
        background: hasEvoReady
          ? 'linear-gradient(90deg, rgba(45,21,0,0.9), rgba(10,15,30,0.95))'
          : 'rgba(10,15,30,0.92)',
        borderTop: 'none',
        borderBottom: `1px solid ${hasEvoReady ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.04)'}`,
        cursor: 'pointer',
      }}>

      {/* Items row */}
      <div style={{ display: 'flex', gap: 6, flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {runItems.map(item => {
          const isReady = readyIds.has(item.id);
          const color = isReady ? '#FBBF24' : (item.rarity === 'legendary' ? '#FBBF24' : item.rarity === 'rare' ? '#A78BFA' : '#60A5FA');
          return (
            <motion.div key={item.id}
              animate={isReady ? { boxShadow: ['0 0 0px #FBBF2400', '0 0 8px #FBBF2480', '0 0 0px #FBBF2400'] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                padding: '3px 8px', borderRadius: 8,
                background: isReady ? 'rgba(45,21,0,0.8)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isReady ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.emoji}</span>
              {/* Level pips */}
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: item.maxLevel }).map((_, i) => (
                  <div key={i} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: i < item.level ? color : 'rgba(255,255,255,0.12)',
                  }} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right: evo indicator or bag icon */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
        {hasEvoReady ? (
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ fontSize: '0.65rem', fontWeight: 900, color: '#FBBF24' }}>
            ⚡ PRONTO
          </motion.span>
        ) : (
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#334155' }}>
            🎒 {runItems.length}
          </span>
        )}
        <span style={{ fontSize: '0.55rem', color: '#334155' }}>›</span>
      </div>
    </motion.button>
  );
}

// ─── Question Preview Modal ───────────────────────────────────────────────────
function QuestionPreviewModal({ question, onReveal }: { question: any; onReveal: () => void }) {
  const topicLabel = question.topic ?? null;
  const sourceLabel = question.source === 'real' ? 'Questão Real' : question.source === 'ai' ? 'Gerada por IA' : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 180,
        background: 'rgba(2,6,18,0.92)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onReveal} // tap backdrop = reveal
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #080D1A 100%)',
          borderRadius: '28px 28px 0 0',
          border: '1px solid rgba(255,255,255,0.07)',
          borderBottom: 'none',
          overflow: 'hidden',
          boxShadow: '0 -12px 60px rgba(0,0,0,0.7)',
        }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', maxHeight: '80dvh', padding: '16px 20px 0', scrollbarWidth: 'none' }}>

          {/* ── Title row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                Leia com atenção
              </span>
            </div>
            {/* Badges row */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {topicLabel && (
                <span style={{
                  fontSize: '0.58rem', fontWeight: 800, color: '#818CF8',
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                  padding: '3px 8px', borderRadius: 999,
                }}>
                  {topicLabel}
                </span>
              )}
              {sourceLabel && (
                <span style={{
                  fontSize: '0.58rem', fontWeight: 800,
                  color: question.source === 'real' ? '#86EFAC' : '#93C5FD',
                  background: question.source === 'real' ? 'rgba(5,46,22,0.6)' : 'rgba(15,32,64,0.6)',
                  border: `1px solid ${question.source === 'real' ? '#166534' : '#1D4ED8'}`,
                  padding: '3px 8px', borderRadius: 999,
                }}>
                  {sourceLabel}
                </span>
              )}
            </div>
          </div>

          {/* ── Passage ── */}
          {question.passage && (
            <div style={{ marginBottom: 14, borderRadius: 16, overflow: 'hidden', border: '1px solid #1E293B' }}>
              <div style={{
                padding: '8px 14px',
                background: 'linear-gradient(90deg, #1E293B, #0F172A)',
                fontSize: '0.62rem', fontWeight: 900, color: '#64748B',
                textTransform: 'uppercase', letterSpacing: 0.6,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <BookOpen size={11} color="#475569" />
                {question.passageTitle ?? 'Texto de referência'}
              </div>
              <div style={{
                maxHeight: 180, overflowY: 'auto', padding: '14px 16px',
                background: '#060B16',
                fontSize: '0.9rem', lineHeight: 1.75, color: '#94A3B8',
                fontStyle: 'italic', whiteSpace: 'pre-line',
                scrollbarWidth: 'thin', scrollbarColor: '#1E293B transparent',
              }}>
                {question.passage}
              </div>
              {question.passage.length > 280 && (
                <div style={{ padding: '5px 14px', background: '#060B16', borderTop: '1px solid #0F172A', fontSize: '0.58rem', color: '#334155', fontWeight: 800, textAlign: 'center' }}>
                  ↑ role para ler o texto completo ↑
                </div>
              )}
            </div>
          )}

          {/* ── Question text ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #0A0F1E 100%)',
            borderRadius: 18,
            border: '1px solid #1E293B',
            padding: '18px 18px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle accent bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
              background: 'linear-gradient(180deg, #3B82F6, #7C3AED)',
              borderRadius: '18px 0 0 18px',
            }} />
            {question.passage && (
              <span style={{
                display: 'block', fontSize: '0.6rem', fontWeight: 900,
                color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8,
                marginBottom: 10, paddingLeft: 10,
              }}>
                Com base no texto acima:
              </span>
            )}
            <p style={{
              fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.7,
              color: '#E2E8F0', margin: 0,
              paddingLeft: question.passage ? 10 : 8,
            }}>
              {question.text}
            </p>
          </div>
        </div>

        {/* ── Sticky CTA ── */}
        <div style={{ padding: '14px 20px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onReveal}
            style={{
              width: '100%', padding: '17px',
              background: 'linear-gradient(135deg, #DC2626 0%, #7C3AED 100%)',
              color: 'white', borderRadius: 18,
              fontWeight: 900, fontSize: '1.05rem',
              boxShadow: '0 5px 0 rgba(109,7,26,0.7), 0 0 30px rgba(220,38,38,0.25)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              letterSpacing: 0.3,
            }}>
            ⚔️ Ver Alternativas!
          </motion.button>
          <p style={{ textAlign: 'center', fontSize: '0.62rem', color: '#1E293B', fontWeight: 700, margin: '8px 0 0' }}>
            ou toque fora para fechar
          </p>
        </div>
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
    setPendingCosmeticChest,
    lastEvolvedItem, confirmEvolution,
    isTutorial, tutorialStep, advanceTutorial,
    runPowerUpCounts,
    soundEnabled, toggleSound,
    endRun, runKills,
  } = useAppStore();

  const [isPaused, setIsPaused]       = useState(false);
  const [qIndex, setQIndex]           = useState(0);
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [peekModalOpen, setPeekModalOpen] = useState(false); // re-open preview after reveal
  const [selectedIdx, setSelectedIdx] = useState<null | number>(null);
  const [isFirstHitThisEnemy, setIsFirstHitThisEnemy] = useState(true);
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
  const [shownHint, setShownHint]     = useState<number>(-1); // last hint step shown

  // Reset question preview on each new question
  useEffect(() => { setQuestionRevealed(false); setPeekModalOpen(false); }, [qIndex]);

  // Reset first-hit tracker when a new enemy spawns (enemy.level changes)
  useEffect(() => { setIsFirstHitThisEnemy(true); }, [enemy.level]);

  // Tutorial hint timing
  useEffect(() => {
    if (!isTutorial || tutorialStep <= shownHint) return;
    setShownHint(tutorialStep);
    // Auto-advance step 1 and 2 after display time
    if (tutorialStep === 1 || tutorialStep === 2) {
      const t = setTimeout(() => advanceTutorial(), 3200);
      return () => clearTimeout(t);
    }
  }, [isTutorial, tutorialStep]);

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
  const shuffledOpts = useMemo(() => {
    if (!currentQ) return [];
    const opts = [...(currentQ.options as any[])];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [qIndex, questionQueue]);
  const selectedOpt  = useMemo(() => selectedIdx !== null ? shuffledOpts[selectedIdx] : null, [selectedIdx, shuffledOpts]);

  // Instinto Acadêmico: eliminate N wrong options from view (stable per question)
  const eliminatedIndices = useMemo(() => {
    const count = player.eliminateOptions ?? 0;
    if (count <= 0 || shuffledOpts.length === 0) return new Set<number>();
    const wrongIndices = shuffledOpts
      .map((opt: any, i: number) => ({ i, isCorrect: opt.isCorrect }))
      .filter((x: any) => !x.isCorrect)
      .map((x: any) => x.i);
    // Shuffle and take up to `count`
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    return new Set<number>(shuffled.slice(0, Math.min(count, wrongIndices.length - 1)));
  }, [qIndex, questionQueue, player.eliminateOptions]);

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
    // Tutorial: step 0 → 1 on first answer
    if (isTutorial && tutorialStep === 0) advanceTutorial();
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
          collectGold(20 + enemy.level * 5);
          addCoins(Math.min(8, 3 + Math.floor(enemy.level / 2)));
          setTimeout(() => { playSound('gold'); playSound('death'); playSound('levelup'); }, 150);
          setCombatLog(`☠️ ${enemy.name} derrotado! +ouro`);
          // Tutorial: step 2 → 3 on first kill
          if (isTutorial && tutorialStep >= 1) advanceTutorial();
        } else {
          setCombatLog(isCrit ? `⚡ CRÍTICO! −${actualDmg} HP` : `⚔️ Acertou! −${actualDmg} HP`);
        }
      } else {
        playSound('damage');
        triggerFlash('#3D0A0A');
        setPlayerShake(true);
        setTimeout(() => setPlayerShake(false), 400);
        resetStreak();
        const modSuffix2 = enemy.modifier === 'enraged' ? ' 💢FURIOSO' : enemy.modifier === 'regen' ? ' 💚Regen+6' : '';
        setCombatLog(`💢 Errou! −${actualDmg} HP${modSuffix2}`);
      }
    } else {
      // Offline combat
      const healAmt = player.healOnHit ?? 0;
      const wasFirst = isFirstHitThisEnemy;
      const { result, isCrit, actualDmg, correct, wasShielded } = localAttack(opt.isCorrect, wasFirst);
      if (correct) {
        // After first correct hit, mark first-hit as used for this enemy
        if (wasFirst) setIsFirstHitThisEnemy(false);
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
        const healSuffix = healAmt > 0 ? ` ♥+${healAmt}` : '';
        const firstSuffix = wasFirst && player.firstHitBonus ? ' ⚡×2' : '';
        const streakSuffix = (player.streakDmgBonus ?? 0) > 0 && streak > 0 ? ` 🔥×${(1 + Math.min(streak, 10) * (player.streakDmgBonus ?? 0)).toFixed(1)}` : '';
        if (result === 'dead') {
          collectGold(20 + enemy.level * 5);
          addCoins(Math.min(8, 3 + Math.floor(enemy.level / 2)));
          setTimeout(() => { playSound('gold'); playSound('death'); playSound('levelup'); }, 150);
          setCombatLog(`☠️ ${enemy.name} derrotado! +ouro${healSuffix}`);
          if (isTutorial && tutorialStep >= 1) advanceTutorial();
        } else {
          setCombatLog(isCrit ? `⚡ CRÍTICO! −${actualDmg} HP${healSuffix}` : `⚔️ Acertou! −${actualDmg} HP${firstSuffix}${streakSuffix}${healSuffix}`);
        }
      } else {
        if (wasShielded) {
          // Shield absorbed — no damage, no player shake
          setCombatLog(`🔰 Escudo Arcano! Dano bloqueado.`);
        } else {
          playSound('damage');
          triggerFlash('#3D0A0A');
          setPlayerShake(true);
          setTimeout(() => setPlayerShake(false), 400);
          resetStreak();
          const modSuffix = enemy.modifier === 'enraged' ? ' 💢×1.5' : enemy.modifier === 'regen' ? ' 💚+6' : '';
          // shieldedHits is already decremented in store after this wrong answer
          const shieldNote = (player.shieldedHits ?? 0) > 1 ? ` 🔰${(player.shieldedHits ?? 0) - 1} restantes` : '';
          setCombatLog(`💢 Errou! −${actualDmg} HP${modSuffix}${shieldNote}`);
        }
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
    <div style={{ height: '100dvh', backgroundColor: '#0A0F1E', display: 'flex', flexDirection: 'column', color: 'white', overflow: 'hidden' }}>

      {/* Screen flash */}
      <AnimatePresence>{flashColor && <ScreenFlash key={flashColor + Date.now()} color={flashColor} />}</AnimatePresence>

      {/* Pause Modal */}
      <AnimatePresence>
        {isPaused && (
          <PauseModal
            onResume={() => setIsPaused(false)}
            onAbandon={async () => {
              setIsPaused(false);
              await endRun('abandoned');
              navigate('/home');
            }}
            runKills={runKills}
            gold={gold}
            enemyLevel={enemy.level}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>{pendingRunUpgrades && !pendingItemDrop && <PowerUpModal upgrades={pendingRunUpgrades} playerBuild={player.build} onChoose={(up) => { chooseRunUpgrade(up); if (isTutorial && tutorialStep >= 2) { setTimeout(() => advanceTutorial(), 400); } }} onSkip={skipRunUpgrade} gold={gold} runPowerUpCounts={runPowerUpCounts} />}</AnimatePresence>
      <AnimatePresence>{pendingItemDrop && !lastEvolvedItem && <ItemChestModal onPick={pickItem} onSkip={dismissItemDrop} ownedIds={runItems.map(x => x.id)} runItems={runItems} />}</AnimatePresence>
      <AnimatePresence>{lastEvolvedItem && <EvolutionRevealModal key={lastEvolvedItem} itemId={lastEvolvedItem} onConfirm={confirmEvolution} />}</AnimatePresence>

      {/* ── Top Bar ── */}
      <div style={{
        padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0, zIndex: 10,
      }}>
        {/* Pause / Back */}
        <button onClick={() => setIsPaused(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#475569', fontWeight: 800, fontSize: '0.85rem',
          padding: '6px 10px', borderRadius: 10, backgroundColor: '#0F172A', border: '1px solid #1E293B',
          cursor: 'pointer',
        }}>
          <Pause size={15} /> Pausar
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

      {/* ── Build Strip ── */}
      <BuildStrip runItems={runItems} onPress={() => navigate('/items')} />

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

      {/* ── Tutorial Hints ── */}
      <div style={{ position: 'relative' }}>
        <TutorialHint
          visible={isTutorial && tutorialStep === 0}
          emoji="👆"
          text="Escolha a alternativa correta para atacar o inimigo!"
        />
        <TutorialHint
          visible={isTutorial && tutorialStep === 1}
          emoji="⚔️"
          text="Ótimo! Acertando você ataca. Errando, o inimigo contra-ataca."
        />
        <TutorialHint
          visible={isTutorial && tutorialStep === 2}
          emoji="💀"
          text="Derrote o inimigo para ganhar Ouro e desbloquear upgrades!"
        />
        <TutorialHint
          visible={isTutorial && tutorialStep === 3}
          emoji="🎒"
          text="Escolha um upgrade — eles ficam até você morrer nessa run!"
        />
      </div>

      {/* ── Question Section ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
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
              {/* ── Re-open preview button ── */}
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPeekModalOpen(true)}
                style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 9px', borderRadius: 999,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                  color: '#818CF8', fontSize: '0.6rem', fontWeight: 800,
                  cursor: 'pointer',
                }}>
                👁 Reler
              </motion.button>
            </div>

            {/* ── Optional image ── */}
            {currentQ.imageUrl && (
              <div style={{ marginBottom: 12, borderRadius: 14, overflow: 'hidden', border: '1px solid #1E293B' }}>
                <img
                  src={currentQ.imageUrl}
                  alt="Imagem da questão"
                  style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'contain', backgroundColor: '#0F172A' }}
                />
              </div>
            )}

            {/* ── Optional literary / normative passage ── */}
            {currentQ.passage && (
              <div style={{ marginBottom: 12, borderRadius: 14, border: '1px solid #334155', overflow: 'hidden' }}>
                {/* Passage header bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px',
                  background: 'linear-gradient(90deg, #1E293B 0%, #0F172A 100%)',
                  borderBottom: '1px solid #1E293B',
                }}>
                  <BookOpen size={13} color="#94A3B8" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', letterSpacing: 0.4 }}>
                    {currentQ.passageTitle ?? 'Leia o texto a seguir:'}
                  </span>
                </div>
                {/* Scrollable passage body */}
                <div style={{
                  maxHeight: 200, overflowY: 'auto',
                  padding: '12px 14px',
                  backgroundColor: '#0A0F1E',
                  fontSize: '0.87rem', lineHeight: 1.75, color: '#CBD5E1',
                  fontStyle: 'italic', fontWeight: 500,
                  whiteSpace: 'pre-line',
                  /* Custom scrollbar */
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#334155 transparent',
                }}>
                  {currentQ.passage}
                </div>
                {/* "Scroll to read" hint when passage is long */}
                {currentQ.passage.length > 300 && (
                  <div style={{
                    textAlign: 'center', padding: '4px 0',
                    fontSize: '0.6rem', fontWeight: 800, color: '#334155',
                    background: '#0A0F1E', borderTop: '1px solid #1E293B',
                    letterSpacing: 0.5,
                  }}>
                    ↑ role para ler todo o texto ↑
                  </div>
                )}
              </div>
            )}

            {/* ── Question text ── */}
            <div style={{
              fontSize: '0.97rem', fontWeight: 700, lineHeight: 1.65, color: '#E2E8F0',
              marginBottom: 16, padding: '14px 16px',
              backgroundColor: '#0F172A', borderRadius: 14, border: '1px solid #1E293B',
            }}>
              {currentQ.passage && (
                <span style={{ display: 'block', fontSize: '0.63rem', fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                  Com base no texto acima:
                </span>
              )}
              {currentQ.text}
            </div>

            {/* Instinto Acadêmico indicator */}
            {(player.eliminateOptions ?? 0) > 0 && selectedIdx === null && eliminatedIndices.size > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 8, padding: '5px 10px', borderRadius: 8,
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <span style={{ fontSize: '0.85rem' }}>🔍</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#818CF8' }}>
                  Instinto Acadêmico eliminou {eliminatedIndices.size} alternativa{eliminatedIndices.size > 1 ? 's' : ''} errada{eliminatedIndices.size > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Answer options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {shuffledOpts.map((opt: any, i: number) => {
                const isSel = selectedIdx === i;
                const isRev = selectedIdx !== null;
                const isCorrect = opt.isCorrect;
                const isEliminated = !isRev && eliminatedIndices.has(i);

                let bg = '#111827';
                let border = 'rgba(255,255,255,0.06)';
                let txtColor = '#CBD5E1';
                let opacity = 1;
                let icon = null;

                if (isEliminated) {
                  bg = '#0A0F1E'; border = 'rgba(99,102,241,0.15)'; txtColor = '#334155'; opacity = 0.45;
                }
                if (isRev) {
                  if (isCorrect)         { bg = '#052E16'; border = '#22C55E'; txtColor = '#86EFAC'; icon = '✅'; opacity = 1; }
                  else if (isSel)        { bg = '#2D0A0A'; border = '#EF4444'; txtColor = '#FCA5A5'; icon = '❌'; opacity = 1; }
                  else                   { opacity = 0.25; }
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => !isEliminated && handleSelect(i)}
                    disabled={isRev || isGameOver || isEliminated}
                    animate={isSel && !isCorrect ? { x: [-10, 10, -6, 6, 0] } : {}}
                    whileTap={!isRev && !isEliminated ? { scale: 0.985 } : {}}
                    style={{
                      textAlign: 'left', padding: '14px 16px', borderRadius: 14,
                      backgroundColor: bg,
                      border: `1.5px solid ${border}`,
                      color: txtColor, fontWeight: 600, fontSize: '0.92rem',
                      lineHeight: 1.45, opacity,
                      transition: 'all 0.18s',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
                      boxShadow: isRev ? 'none' : '0 2px 0 rgba(0,0,0,0.4)',
                      cursor: isEliminated ? 'not-allowed' : undefined,
                    }}>
                    <span style={{ flex: 1, textDecoration: isEliminated ? 'line-through' : 'none' }}>{opt.text}</span>
                    {isEliminated && <span style={{ flexShrink: 0, fontSize: '0.7rem', color: '#4338CA', fontWeight: 800 }}>🔍</span>}
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
      <AnimatePresence>
        {selectedIdx !== null && !isGameOver && !pendingRunUpgrades && !pendingItemDrop && (
          <motion.div
            key="continue-btn"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{
              flexShrink: 0,
              padding: '12px 16px',
              paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
              backgroundColor: 'rgba(10,15,30,0.98)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
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
      </AnimatePresence>

      {/* ── Question Preview Modal (initial + re-open peek) ── */}
      <AnimatePresence>
        {(!questionRevealed || peekModalOpen) && !isGameOver && !pendingRunUpgrades && !pendingItemDrop && currentQ && (
          <QuestionPreviewModal
            key={`preview-${qIndex}-${peekModalOpen ? 'peek' : 'initial'}`}
            question={currentQ}
            onReveal={() => { setQuestionRevealed(true); setPeekModalOpen(false); }}
          />
        )}
      </AnimatePresence>

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
                onClick={() => {
                  setPendingCosmeticChest(true);
                  respawn();
                  setSelectedIdx(null);
                  setQIndex(0);
                  setCombatLog('');
                  navigate('/home');
                }}
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
