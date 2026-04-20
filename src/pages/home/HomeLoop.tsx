import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Share2, ShoppingBag, Repeat, Swords, Crown, Zap } from 'lucide-react';
import { useAppStore, permanentCost } from '../../store/useAppStore';
import type { BuildType } from '../../store/useAppStore';
import ChestOpenModal from '../../components/ChestOpenModal';
import type { CosmeticItem } from '../../data/cosmeticsDb';
import '../../pixelart.css';

export const FREE_DAILY_PLAYS = 3;

// ─── Tiny camp scene (compact) ───────────────────────────────────────────────
function CampScene() {
  return (
    <div className="pixel-art" style={{
      position: 'relative', width: '100%', height: 100, overflow: 'hidden',
      background: 'linear-gradient(180deg, #0B1120 0%, #1C1917 65%, #292524 100%)',
    }}>
      {['✦','✧','✦','✧','✦'].map((s, i) => (
        <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
          style={{ position: 'absolute', top: 4 + (i % 2) * 10, left: 10 + i * 60, fontSize: 8, color: '#94A3B8' }}>
          {s}
        </motion.span>
      ))}
      <div style={{ position: 'absolute', top: 6, right: 20, fontSize: '1.1rem', opacity: 0.65 }}>🌙</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, backgroundColor: '#292524', borderTop: '2px solid #44403C' }} />
      {[6, 72, 85].map((pct, i) => (
        <div key={i} style={{ position: 'absolute', bottom: 18, left: `${pct}%` }}>
          <motion.div animate={{ y: [0,-2,0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.6, delay: i }}>
            <span style={{ fontSize: i===1 ? '2rem' : '1.6rem', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.8))' }}>🌲</span>
          </motion.div>
        </div>
      ))}
      <motion.div animate={{ y: [0,-2,0] }} transition={{ repeat: Infinity, duration: 4 }}
        style={{ position: 'absolute', bottom: 20, left: '36%', fontSize: '2.2rem', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' }}>⛺</motion.div>
      <motion.div animate={{ scale: [1, 1.18, 0.9, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
        style={{ position: 'absolute', bottom: 22, left: '53%', fontSize: '1.5rem' }}>🔥</motion.div>
      <motion.div animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
        style={{ position: 'absolute', bottom: 19, left: '44%', fontSize: '1.7rem' }}>🧙</motion.div>
      <div className="scanlines" />
    </div>
  );
}

const BUILD_INFO = {
  warrior: { emoji: '⚔️', name: 'Guerreiro', stat: '150 HP · 22 Dano · 5% Crit', color: '#EF4444', desc: 'Tanque. Sobrevive ao erro.' },
  mage:    { emoji: '🔮', name: 'Mago',       stat: '80 HP · 35 Dano · 12% Crit', color: '#8B5CF6', desc: 'Alto risco. Acertar é obrigatório.' },
  rogue:   { emoji: '🗡️', name: 'Ladino',    stat: '100 HP · 18 Dano · 25% Crit', color: '#22C55E', desc: '1.5× Ouro. Vive de crits.' },
};

// ─── Energy dots ─────────────────────────────────────────────────────────────
function EnergyDots({ used, total, isPremium }: { used: number; total: number; isPremium: boolean }) {
  if (isPremium) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Crown size={14} color="#FBBF24" />
      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#FBBF24' }}>Ilimitado</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          initial={false}
          animate={{ scale: i === used - 1 ? [1.3, 1] : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 14, height: 14, borderRadius: '50%',
            backgroundColor: i < used ? '#64748B' : '#EF4444',
            border: `2px solid ${i < used ? '#334155' : '#B91C1C'}`,
            boxShadow: i >= used ? '0 0 8px rgba(239,68,68,0.5)' : 'none',
          }} />
      ))}
      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 800, marginLeft: 4 }}>
        {Math.max(0, total - used)}/{total} restantes
      </span>
    </div>
  );
}

// ─── Shareable "Hoje" card ────────────────────────────────────────────────────
function TodayCard({ todayStats, streak, build }: {
  todayStats: { questions: number; kills: number; goldEarned: number; runsCompleted: number };
  streak: number;
  build: BuildType;
}) {
  const [shared, setShared] = useState(false);
  const buildInfo = BUILD_INFO[build] ?? BUILD_INFO.warrior;

  const accuracy = todayStats.questions > 0
    ? Math.min(100, Math.round((todayStats.kills / Math.max(1, todayStats.kills + todayStats.questions * 0.3)) * 100))
    : 0;

  const handleShare = async () => {
    const text = [
      `⚔️ Concurseiro RPG — ${buildInfo.name}`,
      `🔥 ${streak} dia${streak !== 1 ? 's' : ''} seguido${streak !== 1 ? 's' : ''}!`,
      `📚 ${todayStats.questions} questões hoje`,
      `💀 ${todayStats.kills} inimigos derrotados`,
      `🪙 ${todayStats.goldEarned} ouro acumulado`,
      ``,
      `Estude como RPG 👉 maktheus.github.io/phantom-singularity`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Meu progresso hoje — Concurseiro RPG', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {/* cancelled */}
  };

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      border: '1px solid rgba(139,92,246,0.25)',
      boxShadow: '0 4px 24px rgba(139,92,246,0.12)',
    }}>
      {/* Card header */}
      <div style={{
        padding: '14px 16px 10px',
        background: 'linear-gradient(90deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1 }}>
            📊 Resultado de Hoje
          </div>
          <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginTop: 1 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={handleShare}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 10,
            background: shared ? 'rgba(34,197,94,0.2)' : 'rgba(139,92,246,0.15)',
            border: `1px solid ${shared ? '#22C55E' : 'rgba(139,92,246,0.3)'}`,
            color: shared ? '#86EFAC' : '#A78BFA', fontWeight: 800, fontSize: '0.75rem',
          }}>
          <Share2 size={12} />
          {shared ? 'Copiado!' : 'Compartilhar'}
        </motion.button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {[
          { icon: '📚', val: todayStats.questions, label: 'Questões', color: '#60A5FA' },
          { icon: '💀', val: todayStats.kills,     label: 'Derrotados', color: '#F87171' },
          { icon: '🪙', val: todayStats.goldEarned,label: 'Ouro Ganho',  color: '#FBBF24' },
          { icon: '🎯', val: `${accuracy}%`,       label: 'Precisão',   color: '#34D399' },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '14px 16px', textAlign: 'center',
            borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>
              {todayStats.questions === 0 && s.label !== 'Precisão' ? '—' : s.val}
            </div>
            <div style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational footer */}
      {todayStats.questions === 0 && (
        <div style={{
          padding: '10px 16px', textAlign: 'center',
          fontSize: '0.8rem', color: '#475569', fontWeight: 700,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          🎯 Nenhuma run hoje ainda — vamos começar!
        </div>
      )}
    </div>
  );
}

// ─── Premium upsell banner ────────────────────────────────────────────────────
function PremiumBanner({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 18, overflow: 'hidden',
        background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
        border: '1.5px solid #D97706',
        boxShadow: '0 0 30px rgba(217,119,6,0.2)',
      }}>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Crown size={22} color="#FBBF24" />
          </motion.div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#FDE68A' }}>Concurseiro PRO</div>
            <div style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>Você usou todas as runs de hoje</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {['⚡ Runs ilimitadas todos os dias', '🎁 Itens épicos e lendários garantidos', '🔥 Proteção de sequência 1×/semana', '📊 Análise de desempenho por matéria'].map(f => (
            <div key={f} style={{ fontSize: '0.8rem', color: '#FDE68A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              {f}
            </div>
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.96 }} onClick={onUpgrade}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #FBBF24, #D97706)',
            color: '#1C0A00', borderRadius: 14, fontWeight: 900, fontSize: '1rem',
            boxShadow: '0 4px 0 #92400E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          <Zap size={18} />
          Assinar PRO — R$19,90/mês
        </motion.button>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.68rem', color: '#92400E', fontWeight: 700 }}>
          Cancele quando quiser · Próximas runs grátis às 00:00
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeLoop() {
  const navigate = useNavigate();
  const {
    player, gold, killCount, totalQuestionsAnswered,
    permanentUpgrades, purchasePermanent, startRun,
    dailyPlaysUsed, dailyStreak, isPremium, todayStats,
    recordDailyPlay,
  } = useAppStore();
  const pendingCosmeticChest = useAppStore(s => s.pendingCosmeticChest);
  const setPendingCosmeticChest = useAppStore(s => s.setPendingCosmeticChest);

  const [buyFeedback, setBuyFeedback] = useState<{ id: string; ok: boolean } | null>(null);
  const [showBuildSelect, setShowBuildSelect] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [timeToReset, setTimeToReset] = useState('');

  // Countdown to midnight reset
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeToReset(`${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

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
    const canPlay = recordDailyPlay();
    if (!canPlay) { setShowPaywall(true); setShowBuildSelect(false); return; }
    startRun(build);
    setShowBuildSelect(false);
    navigate('/study');
  };

  const handlePlayPress = () => {
    const remaining = FREE_DAILY_PLAYS - dailyPlaysUsed;
    if (!isPremium && remaining <= 0) { setShowPaywall(true); return; }
    setShowBuildSelect(true);
  };

  const buildInfo = BUILD_INFO[player.build] ?? BUILD_INFO.warrior;
  const remaining = isPremium ? Infinity : Math.max(0, FREE_DAILY_PLAYS - dailyPlaysUsed);
  const outOfPlays = !isPremium && remaining <= 0;

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', paddingBottom: 160 }}>

      {/* ── Chest Modal ── */}
      <AnimatePresence>
        {pendingCosmeticChest && <ChestOpenModal onClose={handleChestClose} />}
      </AnimatePresence>

      {/* ── Build Select Modal ── */}
      <AnimatePresence>
        {showBuildSelect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              zIndex: 200, padding: '0 0 80px',
            }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              transition={{ type: 'spring', stiffness: 380, damping: 35 }}
              style={{ padding: '24px 20px', background: '#0F172A', borderRadius: '24px 24px 0 0', borderTop: '1px solid #1E293B' }}>
              <div style={{ width: 40, height: 4, background: '#334155', borderRadius: 99, margin: '0 auto 20px' }} />
              <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: 6 }}>Escolha sua Classe</h2>
              <p style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: 20 }}>
                Upgrades permanentes são mantidos entre runs
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(Object.entries(BUILD_INFO) as [BuildType, typeof BUILD_INFO.warrior][]).map(([key, b]) => (
                  <motion.button key={key} whileTap={{ scale: 0.97 }} onClick={() => handleStartRun(key)}
                    style={{
                      padding: '16px 18px', borderRadius: 16, backgroundColor: '#111827',
                      border: `2px solid ${b.color}30`, color: 'white', textAlign: 'left',
                      display: 'flex', gap: 14, alignItems: 'center',
                      boxShadow: `0 4px 0 rgba(0,0,0,0.4), inset 0 0 20px ${b.color}06`,
                    }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`,
                      border: `1.5px solid ${b.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                    }}>{b.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: '1rem', color: b.color }}>{b.name}</div>
                      <div style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, marginTop: 1 }}>{b.stat}</div>
                      <div style={{ color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 600, marginTop: 3 }}>{b.desc}</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `${b.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: b.color }}>▶</div>
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setShowBuildSelect(false)}
                style={{ marginTop: 14, width: '100%', padding: '12px', color: '#475569', fontWeight: 700 }}>
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Camp Scene ── */}
      <CampScene />

      {/* ── Profile strip ── */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(180deg,rgba(30,41,59,0.95) 0%,rgba(10,15,30,0.95) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Build avatar */}
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${buildInfo.color}25, ${buildInfo.color}08)`,
          border: `2px solid ${buildInfo.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
        }}>{buildInfo.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: '0.95rem', color: buildInfo.color }}>{buildInfo.name}</div>
          <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, marginTop: 1 }}>
            ❤️ {player.hp}/{player.maxHp} · ⚔️ {player.damage} · 🎯 {Math.round(player.critChance * 100)}%
          </div>
        </div>
        <button onClick={() => setShowBuildSelect(true)}
          style={{
            padding: '6px 10px', background: '#111827', borderRadius: 10,
            color: '#475569', fontWeight: 800, fontSize: '0.72rem', border: '1px solid #1E293B',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
          <Repeat size={11} /> Trocar
        </button>
        {/* Gold */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          backgroundColor: '#1C0A00', border: '1.5px solid rgba(251,191,36,0.35)',
          borderRadius: 12, boxShadow: '0 0 12px rgba(251,191,36,0.08)',
        }}>
          <span style={{ fontSize: '1.1rem' }}>🪙</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#FBBF24', lineHeight: 1 }}>{gold}</div>
            <div style={{ fontSize: '0.5rem', color: '#92400E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>OURO</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Streak card ── */}
        <div style={{
          borderRadius: 20,
          background: dailyStreak >= 3
            ? 'linear-gradient(135deg, #431407 0%, #7C2D12 50%, #1C0A00 100%)'
            : 'linear-gradient(135deg, #1E293B, #0F172A)',
          border: `1.5px solid ${dailyStreak >= 3 ? '#EA580C' : '#1E293B'}`,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: dailyStreak >= 3 ? '0 0 24px rgba(234,88,12,0.2)' : 'none',
        }}>
          <motion.div
            animate={dailyStreak > 0 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ fontSize: '2.8rem', lineHeight: 1, flexShrink: 0 }}>
            {dailyStreak >= 7 ? '🔥' : dailyStreak >= 3 ? '🔥' : '💤'}
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, color: dailyStreak > 0 ? '#FB923C' : '#475569' }}>
              {dailyStreak} {dailyStreak === 1 ? 'dia' : 'dias'}
            </div>
            <div style={{ fontSize: '0.78rem', color: dailyStreak > 0 ? '#C2410C' : '#334155', fontWeight: 700, marginTop: 2 }}>
              {dailyStreak === 0
                ? 'Comece hoje e inicie sua sequência!'
                : dailyStreak >= 7
                ? '🏆 Sequência épica! Não pare agora.'
                : dailyStreak >= 3
                ? '🚀 Você está em chamas! Continue.'
                : 'Sequência ativa — não quebre!'}
            </div>
          </div>
          {dailyStreak >= 7 && (
            <div style={{
              padding: '4px 10px', borderRadius: 999, background: '#7C2D12',
              border: '1px solid #EA580C', fontSize: '0.68rem', fontWeight: 900, color: '#FED7AA',
            }}>ÉPICO</div>
          )}
        </div>

        {/* ── Energy / plays ── */}
        <div style={{
          borderRadius: 16, background: '#111827', border: '1px solid #1E293B',
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#94A3B8', marginBottom: 5 }}>⚡ Energia de Batalha</div>
            <EnergyDots used={dailyPlaysUsed} total={FREE_DAILY_PLAYS} isPremium={isPremium} />
          </div>
          {!isPremium && outOfPlays && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700 }}>Recarga em</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FBBF24' }}>{timeToReset}</div>
            </div>
          )}
          {!isPremium && !outOfPlays && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700 }}>Recarga</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>00:00h</div>
            </div>
          )}
        </div>

        {/* ── Today's shareable card ── */}
        <TodayCard todayStats={todayStats} streak={dailyStreak} build={player.build} />

        {/* ── Paywall banner (only when out of plays) ── */}
        {showPaywall && !isPremium && (
          <PremiumBanner onUpgrade={() => {
            // TODO: integrate payment flow
            alert('Em breve: pagamento integrado! Por enquanto, aproveite as runs gratuitas.');
            setShowPaywall(false);
          }} />
        )}

        {/* ── Life stats ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { emoji: '💀', val: killCount, label: 'Total Kills', color: '#F87171' },
            { emoji: '📖', val: totalQuestionsAnswered, label: 'Total Questões', color: '#60A5FA' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'linear-gradient(135deg,#1E293B,#0F172A)',
              borderRadius: 16, padding: '14px 10px', border: '1px solid #1E293B',
              textAlign: 'center', boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: '#334155', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Permanent Upgrades ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#7C3AED,#4C1D95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={14} color="white" />
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '1rem' }}>Melhorias Permanentes</h2>
          </div>
          <p style={{ color: '#334155', fontSize: '0.75rem', fontWeight: 700, marginBottom: 12, paddingLeft: 38 }}>
            Aplicadas no início de TODA run
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {permanentUpgrades.map(u => {
              const cost = permanentCost(u);
              const canBuy = gold >= cost && u.level < u.maxLevel;
              const isFull = u.level >= u.maxLevel;
              const fb = buyFeedback?.id === u.id;
              return (
                <AnimatePresence key={u.id} mode="wait">
                  <motion.div
                    animate={fb && !buyFeedback!.ok ? { x: [-6,6,-4,4,0] } : {}}
                    style={{
                      backgroundColor: '#111827', borderRadius: 14, padding: '12px 16px',
                      border: `2px solid ${fb && buyFeedback!.ok ? '#22C55E' : fb ? '#EF4444' : '#1E293B'}`,
                      display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.3s',
                    }}>
                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{u.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                        {u.name}
                        {u.level > 0 && <span style={{ marginLeft: 7, fontSize: '0.68rem', color: '#A78BFA', fontWeight: 800 }}>Lv.{u.level}</span>}
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, marginTop: 1 }}>{u.description}</div>
                      <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                        {Array.from({ length: u.maxLevel }).map((_, i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, backgroundColor: i < u.level ? '#A78BFA' : '#1E293B' }} />
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleBuy(u.id)} disabled={!canBuy}
                      style={{
                        padding: '9px 12px', borderRadius: 10, fontWeight: 900,
                        backgroundColor: isFull ? '#1E293B' : canBuy ? '#6D28D9' : '#111827',
                        color: isFull ? '#475569' : canBuy ? 'white' : '#334155',
                        border: `1.5px solid ${isFull ? '#1E293B' : canBuy ? '#7C3AED' : '#1E293B'}`,
                        boxShadow: canBuy ? '0 4px 0 #4C1D95' : 'none',
                        fontSize: '0.8rem', whiteSpace: 'nowrap',
                      }}>
                      {isFull ? 'MAX ✓' : `🪙 ${cost}`}
                    </button>
                  </motion.div>
                </AnimatePresence>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fixed Battle CTA ── */}
      <div style={{
        position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 600,
        padding: '10px 16px',
        background: 'rgba(10,15,30,0.98)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 100,
      }}>
        {outOfPlays && !isPremium ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              flex: 1, padding: '16px', background: '#111827',
              borderRadius: 16, border: '1px solid #1E293B', textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>Recarga em</div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FBBF24' }}>{timeToReset}</div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowPaywall(p => !p)}
              style={{
                flex: 3, padding: '16px',
                background: 'linear-gradient(135deg, #D97706, #92400E)',
                color: 'white', borderRadius: 16, fontWeight: 900, fontSize: '1rem',
                boxShadow: '0 5px 0 #78350F',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <Crown size={20} /> Assinar PRO
            </motion.button>
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlayPress}
            style={{
              width: '100%', padding: '18px',
              background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
              color: 'white', fontSize: '1.15rem', fontWeight: 900, borderRadius: 16,
              boxShadow: '0 6px 0 #991B1B',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
            }}>
            <Swords size={24} /> Entrar em Batalha
            {!isPremium && (
              <span style={{
                fontSize: '0.7rem', background: 'rgba(0,0,0,0.25)',
                padding: '2px 8px', borderRadius: 99, fontWeight: 800,
              }}>
                {remaining} run{remaining !== 1 ? 's' : ''} hoje
              </span>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
