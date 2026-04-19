import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Swords, Repeat } from 'lucide-react';
import { useAppStore, permanentCost } from '../../store/useAppStore';
import type { BuildType } from '../../store/useAppStore';
import ChestOpenModal from '../../components/ChestOpenModal';
import type { CosmeticItem } from '../../data/cosmeticsDb';
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
  const pendingCosmeticChest = useAppStore(s => s.pendingCosmeticChest);
  const setPendingCosmeticChest = useAppStore(s => s.setPendingCosmeticChest);
  const [buyFeedback, setBuyFeedback] = useState<{ id: string; ok: boolean } | null>(null);
  const [showBuildSelect, setShowBuildSelect] = useState(false);

  const handleChestClose = (_item: CosmeticItem) => {
    setPendingCosmeticChest(false);
    navigate('/hero');
  };

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

      {/* ── Chest Open Modal ── */}
      <AnimatePresence>
        {pendingCosmeticChest && (
          <ChestOpenModal onClose={handleChestClose} />
        )}
      </AnimatePresence>

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
      <div style={{ background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', borderBottom: '1px solid #1E293B', padding: '16px 20px' }}>
        {/* Top row: title + gold */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.35rem', lineHeight: 1.2 }}>🏕️ Acampamento</h1>
            <p style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 700, marginTop: 2 }}>Upgrades permanentes sobrevivem a todas as runs</p>
          </div>
          {/* Gold badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            backgroundColor: '#1C0A00', border: '1.5px solid rgba(251,191,36,0.4)',
            borderRadius: 14, padding: '8px 14px',
            boxShadow: '0 0 16px rgba(251,191,36,0.1)',
          }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🪙</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#FBBF24', lineHeight: 1 }}>{gold}</div>
              <div style={{ fontSize: '0.6rem', color: '#92400E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>OURO</div>
            </div>
          </div>
        </div>

        {/* Current Build card */}
        <div style={{
          backgroundColor: '#0A0F1E', borderRadius: 16, padding: '14px 16px',
          border: `1.5px solid ${buildInfo.color}25`,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: `inset 0 0 20px ${buildInfo.color}08`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${buildInfo.color}25, ${buildInfo.color}08)`,
            border: `1.5px solid ${buildInfo.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', flexShrink: 0,
          }}>{buildInfo.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, color: buildInfo.color, fontSize: '1rem' }}>{buildInfo.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{buildInfo.stat}</div>
          </div>
          <button onClick={() => setShowBuildSelect(true)}
            style={{
              padding: '8px 14px', backgroundColor: '#1E293B', borderRadius: 10,
              color: '#64748B', fontWeight: 800, fontSize: '0.78rem',
              border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 5,
            }}>
            <Repeat size={13} /> Trocar
          </button>
        </div>

        {/* Stat Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: 'HP', val: `${player.hp}/${player.maxHp}`, color: buildInfo.color, icon: '❤️' },
            { label: 'Dano', val: player.damage, color: '#F87171', icon: '⚔️' },
            { label: 'Crit', val: `${Math.round(player.critChance * 100)}%`, color: '#FBBF24', icon: '🎯' },
            { label: 'Gold', val: `×${player.goldMultiplier.toFixed(1)}`, color: '#A78BFA', icon: '🪙' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, backgroundColor: '#0A0F1E', borderRadius: 12,
              padding: '10px 6px', textAlign: 'center', border: '1px solid #1E293B',
            }}>
              <div style={{ fontSize: '0.9rem', marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '0.88rem', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { emoji: '💀', val: killCount, label: 'Derrotados', color: '#F87171' },
            { emoji: '📖', val: totalQuestionsAnswered, label: 'Questões', color: '#60A5FA' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'linear-gradient(135deg, #1E293B, #0F172A)',
              borderRadius: 16, padding: '16px 12px', border: '1px solid #1E293B', textAlign: 'center',
              boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: '#334155', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Permanent Upgrades header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={16} color="white" />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.1rem' }}>Melhorias Permanentes</h2>
        </div>
        <p style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700, marginBottom: 16, paddingLeft: 40 }}>
          Aplicados no início de TODA run, independente da classe.
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
