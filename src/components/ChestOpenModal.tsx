import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CosmeticItem } from '../data/cosmeticsDb';
import { RARITY_CONFIG, rollCosmeticItem } from '../data/cosmeticsDb';
import { useAppStore } from '../store/useAppStore';

export default function ChestOpenModal({ onClose }: { onClose: (item: CosmeticItem) => void }) {
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'flash' | 'reveal' | 'done'>('idle');
  const [item, setItem] = useState<CosmeticItem | null>(null);
  const addCosmeticItem = useAppStore(s => s.addCosmeticItem);

  const handleTap = () => {
    if (phase !== 'idle') return;
    setPhase('shaking');
    setTimeout(() => {
      const rolled = rollCosmeticItem();
      setItem(rolled);
      addCosmeticItem(rolled);
      setPhase('flash');
      setTimeout(() => {
        setPhase('reveal');
        setTimeout(() => setPhase('done'), 600);
      }, 400);
    }, 900);
  };

  const cfg = item ? RARITY_CONFIG[item.rarity] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(8px)',
      }}>

      {/* Flash overlay */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div key="flash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 10 }} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* CHEST PHASE */}
        {(phase === 'idle' || phase === 'shaking') && (
          <motion.div key="chest"
            exit={{ scale: 2, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

            {/* Chest */}
            <motion.div
              animate={phase === 'idle'
                ? { y: [0, -10, 0], rotate: [0, 1, -1, 0] }
                : { rotate: [-15, 15, -12, 12, -8, 8, -4, 4, 0], scale: [1, 1.05, 0.98, 1.04, 1] }
              }
              transition={phase === 'idle'
                ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                : { duration: 0.9, ease: 'easeInOut' }
              }
              onClick={handleTap}
              style={{
                fontSize: '8rem', cursor: 'pointer', userSelect: 'none',
                filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.6))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              📦
            </motion.div>

            {/* Pulsing glow ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                position: 'absolute',
                width: 180, height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

            {/* Stars particles around chest (idle only) */}
            {phase === 'idle' && [0, 1, 2, 3, 4, 5].map(i => (
              <motion.div key={i}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                  opacity: [0, 1, 0], scale: [0, 1, 0],
                }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.33, ease: 'easeInOut' }}
                style={{ position: 'absolute', fontSize: '1.2rem', pointerEvents: 'none' }}>
                ✨
              </motion.div>
            ))}

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FBBF24', marginBottom: 6 }}>
                🎁 Baú de Recompensa
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>
                {phase === 'idle' ? 'Toque para abrir' : '...'}
              </div>
            </div>
          </motion.div>
        )}

        {/* REVEAL PHASE */}
        {(phase === 'reveal' || phase === 'done') && item && cfg && (
          <motion.div key="reveal"
            initial={{ y: -120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: '100%', padding: '0 24px' }}>

            {/* Rarity beam from above */}
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 200, opacity: 0.5 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 4, background: `linear-gradient(to bottom, ${cfg.color}, transparent)`,
                borderRadius: 4, marginBottom: 16,
              }} />

            {/* Item Card */}
            <motion.div
              initial={{ scale: 0.6 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.15 }}
              style={{
                width: '100%', maxWidth: 300,
                background: cfg.gradient,
                borderRadius: 24,
                border: `2px solid ${cfg.color}`,
                boxShadow: `0 0 60px ${cfg.glow}, 0 8px 0 rgba(0,0,0,0.4)`,
                overflow: 'hidden',
                position: 'relative',
              }}>

              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                  pointerEvents: 'none',
                }} />

              <div style={{ padding: '28px 24px', textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '5rem', marginBottom: 12, lineHeight: 1 }}>{item.emoji}</div>

                {/* Rarity badge */}
                <div style={{
                  display: 'inline-block', padding: '4px 14px', borderRadius: 999,
                  background: 'rgba(0,0,0,0.35)', border: `1px solid ${cfg.color}`,
                  fontSize: '0.72rem', fontWeight: 900, color: cfg.color,
                  letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
                }}>
                  {'⭐'.repeat(item.rarity === 'legendary' ? 4 : item.rarity === 'epic' ? 3 : item.rarity === 'rare' ? 2 : 1)} {cfg.label}
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F1F5F9', marginBottom: 6 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: cfg.color, fontWeight: 800, marginBottom: 8 }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{item.flavorText}"
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <AnimatePresence>
              {phase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%', maxWidth: 300 }}>
                  <motion.button whileTap={{ scale: 0.96 }}
                    onClick={() => onClose(item)}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 14, fontWeight: 900,
                      background: 'linear-gradient(135deg,#22C55E,#15803D)',
                      color: 'white', fontSize: '0.9rem',
                      boxShadow: '0 4px 0 #14532D',
                      border: 'none', cursor: 'pointer',
                    }}>
                    ⚔️ Ir ao Herói
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }}
                    onClick={() => onClose(item)}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 14, fontWeight: 900,
                      background: '#111827', color: '#94A3B8', fontSize: '0.9rem',
                      border: '1px solid #1E293B',
                      boxShadow: '0 4px 0 rgba(0,0,0,0.4)',
                      cursor: 'pointer',
                    }}>
                    Fechar
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
