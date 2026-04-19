import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Swords, Repeat } from 'lucide-react';
import { useAppStore, permanentCost } from '../../store/useAppStore';
import type { BuildType } from '../../store/useAppStore';
import '../../pixelart.css';

// ─── Animated Pixel Camp Scene ─────────────────────────────────────────────────
function CampScene() {
  return (
    <div className="pixel-art" style={{ position: 'relative', width: '100%', height: 130, overflow: 'hidden',
      background: 'linear-gradient(180deg, #0F172A 0%, #1C1917 60%, #292524 100%)',
      borderBottom: '2px solid #334155' }}>
      {/* Stars */}
      {['✦','✧','✦','✧','✦','✧'].map((s, i) => (
        <motion.span key={i} animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.25 }}
          style={{ position: 'absolute', top: 6 + (i % 3) * 12, left: 8 + i * 52, fontSize: 9, color: '#E2E8F0' }}>
          {s}
        </motion.span>
      ))}
      {/* Moon */}
      <div style={{ position: 'absolute', top: 8, right: 24, fontSize: '1.4rem', opacity: 0.7 }}>🌙</div>
      {/* Ground line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
        backgroundColor: '#292524', borderTop: '3px solid #44403C' }} />
      {/* Trees */}
      {[8, 68, 82].map((pct, i) => (
        <div key={i} style={{ position: 'absolute', bottom: 24, left: `${pct}%` }}>
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.8 }}>
            <div style={{ fontSize: i === 1 ? '2.6rem' : '2rem', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.8))' }}>🌲</div>
          </motion.div>
        </div>
      ))}
      {/* Tent */}
      <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        style={{ position: 'absolute', bottom: 26, left: '36%', fontSize: '3rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
        ⛺
      </motion.div>
      {/* Campfire */}
      <motion.div animate={{ scale: [1, 1.15, 0.9, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 0.7 }}
        style={{ position: 'absolute', bottom: 28, left: '54%', fontSize: '2rem' }}>
        🔥
      </motion.div>
      {/* Hero idle */}
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
        style={{ position: 'absolute', bottom: 25, left: '45%', fontSize: '2.2rem' }}>
        🧙
      </motion.div>
      {/* Chest of gold */}
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }}
        style={{ position: 'absolute', bottom: 26, left: '64%', fontSize: '1.8rem' }}>
        🎁
      </motion.div>
      {/* Scanlines */}
      <div className="scanlines" />
    </div>
  );
}

const BUILD_INFO = {
  warrior: { emoji: '⚔️', name: 'Guerreiro', stat: '150 HP · 22 Dano · 5% Crit', color: '#EF4444', desc: 'Tanque que sobrevive ao erro.' },
  mage:    { emoji: '🔮', name: 'Mago',       stat: '80 HP · 35 Dano · 12% Crit', color: '#8B5CF6', desc: 'Acertar é obrigatório. Alto risco.' },
  rogue:   { emoji: '🗡️', name: 'Ladino',    stat: '100 HP · 18 Dano · 25% Crit', color: '#22C55E', desc: '1.5x Ouro. Vive de crits.' },
};

export default function HomeLoop() {
  const navigate = useNavigate();
  const { player, gold, killCount, totalQuestionsAnswered, permanentUpgrades, purchasePermanent, startRun } = useAppStore();
  const [buyFeedback, setBuyFeedback] = useState<{ id: string; ok: boolean } | null>(null);
  const [showBuildSelect, setShowBuildSelect] = useState(false);

  const handleBuy = (id: string) => {
    const ok = purchasePermanent(id);
    setBuyFeedback({ id, ok });
    setTimeout(() => setBuyFeedback(null), 800);
  };

  const handleStartRun = (build: BuildType) => {
    startRun(build);
    setShowBuildSelect(false);
    navigate('/study');
  };

  const buildInfo = BUILD_INFO[player.build] || BUILD_INFO.warrior;

  // CTA height ~76px + nav height 72px = ~148px total fixed bottom area
  const BOTTOM_SAFE_PAD = 160;

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0F172A', color: 'white', paddingBottom: BOTTOM_SAFE_PAD }}>

      {/* ── Camp Scene ── */}
      <CampScene />

      {/* ── Build Select Modal ── */}
      <AnimatePresence>
        {showBuildSelect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: 24 }}>
            <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}
              style={{ width: '100%', maxWidth: 400 }}>
              <h2 style={{ fontWeight: 900, fontSize: '1.5rem', textAlign: 'center', marginBottom: 8 }}>Escolha sua Classe</h2>
              <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: 24, fontWeight: 700 }}>
                Cada run começa do zero. Upgrades permanentes são mantidos.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(Object.entries(BUILD_INFO) as [BuildType, typeof BUILD_INFO.warrior][]).map(([key, b]) => (
                  <motion.button key={key} whileTap={{ scale: 0.97 }} onClick={() => handleStartRun(key)}
                    style={{ padding: '20px', borderRadius: 16, backgroundColor: '#1E293B',
                      border: `2px solid ${b.color}`, color: 'white', textAlign: 'left', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: '3rem', flexShrink: 0 }}>{b.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem', color: b.color }}>{b.name}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: 700, marginTop: 2 }}>{b.stat}</div>
                      <div style={{ color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>{b.desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setShowBuildSelect(false)}
                style={{ marginTop: 16, width: '100%', padding: '12px', color: '#64748B', fontWeight: 700 }}>
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ backgroundColor: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.4rem' }}>🏕️ Acampamento</h1>
            <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 700 }}>Upgrades permanentes sobrevivem a todas as runs</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FBBF24' }}>🪙 {gold}</div>
            <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>Ouro</div>
          </div>
        </div>

        {/* Current Build */}
        <div style={{ backgroundColor: '#0F172A', borderRadius: 14, padding: '14px 16px', border: `2px solid ${buildInfo.color}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>{buildInfo.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: buildInfo.color }}>{buildInfo.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>{buildInfo.stat}</div>
          </div>
          <button onClick={() => setShowBuildSelect(true)}
            style={{ padding: '8px 14px', backgroundColor: '#1E293B', borderRadius: 10, color: '#94A3B8', fontWeight: 700, fontSize: '0.8rem',
              border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Repeat size={14} /> Trocar
          </button>
        </div>

        {/* Stat Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: 'HP', val: `${player.hp}/${player.maxHp}`, color: buildInfo.color },
            { label: 'Dmg', val: player.damage, color: '#F87171' },
            { label: 'Crit', val: `${Math.round(player.critChance * 100)}%`, color: '#FBBF24' },
            { label: 'Gold', val: `x${player.goldMultiplier.toFixed(1)}`, color: '#A78BFA' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, backgroundColor: '#0F172A', borderRadius: 10, padding: '9px 6px', textAlign: 'center', border: '1px solid #1E293B' }}>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, backgroundColor: '#1E293B', borderRadius: 14, padding: '14px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F87171' }}>💀 {killCount}</div>
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700 }}>Derrotados (total)</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#1E293B', borderRadius: 14, padding: '14px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#60A5FA' }}>📖 {totalQuestionsAnswered}</div>
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700 }}>Questões respondidas</div>
          </div>
        </div>

        {/* Permanent Upgrades */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <ShoppingBag size={18} color="#A78BFA" />
          <h2 style={{ fontWeight: 900, fontSize: '1.15rem' }}>Melhorias Permanentes</h2>
        </div>
        <p style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: 16 }}>
          Esses bônus são aplicados ao início de TODA run, independente da classe.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {permanentUpgrades.map(u => {
            const cost = permanentCost(u);
            const canBuy = gold >= cost && u.level < u.maxLevel;
            const isFull = u.level >= u.maxLevel;
            const fb = buyFeedback?.id === u.id;
            return (
              <AnimatePresence key={u.id} mode="wait">
                <motion.div
                  animate={fb && !buyFeedback!.ok ? { x: [-6, 6, -4, 4, 0] } : {}}
                  style={{ backgroundColor: '#1E293B', borderRadius: 14, padding: '14px 18px',
                    border: `2px solid ${fb && buyFeedback!.ok ? '#22C55E' : fb ? '#EF4444' : '#334155'}`,
                    display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.3s' }}>
                  <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{u.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>{u.name}
                      {u.level > 0 && <span style={{ marginLeft: 8, fontSize: '0.7rem', color: '#A78BFA', fontWeight: 800 }}>Lv.{u.level}</span>}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 700 }}>{u.description}</div>
                    <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                      {Array.from({ length: u.maxLevel }).map((_, i) => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: i < u.level ? '#A78BFA' : '#334155' }} />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleBuy(u.id)} disabled={!canBuy}
                    style={{ padding: '10px 14px', borderRadius: 10, fontWeight: 900,
                      backgroundColor: isFull ? '#334155' : canBuy ? '#6D28D9' : '#1E293B',
                      color: isFull ? '#64748B' : canBuy ? 'white' : '#64748B',
                      border: `2px solid ${isFull ? '#334155' : canBuy ? '#7C3AED' : '#334155'}`,
                      boxShadow: canBuy ? '0 4px 0 #4C1D95' : 'none',
                      fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: canBuy ? 'pointer' : 'not-allowed' }}>
                    {isFull ? 'MAX ✓' : `🪙 ${cost}`}
                  </button>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      {/* ── Big Battle CTA ── positioned ABOVE the BottomNavbar (72px) */}
      <div style={{
        position: 'fixed',
        bottom: 72,   /* sits directly above the bottom nav */
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 600,
        padding: '12px 20px',
        backgroundColor: '#0F172A',
        borderTop: '1px solid #1E293B',
        zIndex: 100,
      }}>
        <button onClick={() => setShowBuildSelect(true)}
          style={{ width: '100%', padding: '18px', backgroundColor: '#EF4444', color: 'white',
            fontSize: '1.15rem', fontWeight: 900, borderRadius: 16, boxShadow: '0 6px 0 #B91C1C',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Swords size={24} /> Iniciar Nova Run
        </button>
      </div>
    </div>
  );
}
