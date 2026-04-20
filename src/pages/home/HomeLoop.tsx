import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Share2, Repeat, Swords, Crown, Zap } from 'lucide-react';
import { useAppStore, SHOP_BLUEPRINTS, RUN_POWERUPS } from '../../store/useAppStore';
import type { BuildType, ShopBlueprint } from '../../store/useAppStore';
import ChestOpenModal from '../../components/ChestOpenModal';
import type { CosmeticItem } from '../../data/cosmeticsDb';
import '../../pixelart.css';

export const FREE_DAILY_PLAYS = 3;

// ─── Camp Scene — hero in focus ──────────────────────────────────────────────
function CampScene() {
  const player      = useAppStore(s => s.player);
  const gold        = useAppStore(s => s.gold);
  const dailyStreak = useAppStore(s => s.dailyStreak);
  const killCount   = useAppStore(s => s.killCount);

  const buildEmoji = player.build === 'warrior' ? '⚔️' : player.build === 'mage' ? '🔮' : '🗡️';
  const buildColor = player.build === 'warrior' ? '#EF4444' : player.build === 'mage' ? '#8B5CF6' : '#22C55E';
  const buildName  = player.build === 'warrior' ? 'Guerreiro' : player.build === 'mage' ? 'Mago' : 'Ladino';

  return (
    <div className="pixel-art" style={{
      position: 'relative', width: '100%', height: 240, overflow: 'hidden',
      background: 'linear-gradient(180deg, #020916 0%, #050E1F 35%, #0A1828 60%, #111A12 80%, #1C1917 100%)',
    }}>
      {/* ── Stars ── */}
      {[...Array(18)].map((_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.2 + (i % 3) * 0.2, 1, 0.2 + (i % 3) * 0.2] }}
          transition={{ repeat: Infinity, duration: 1.8 + (i % 5) * 0.6, delay: i * 0.17 }}
          style={{
            position: 'absolute',
            top: 2 + (i % 6) * 7,
            left: `${4 + i * 5.2}%`,
            width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2,
            borderRadius: '50%', backgroundColor: '#E2E8F0',
          }} />
      ))}

      {/* ── Moon ── */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        style={{ position: 'absolute', top: 10, right: 22, fontSize: '1.4rem', opacity: 0.8 }}>
        🌙
      </motion.div>

      {/* ── Mountain silhouette ── */}
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, display: 'flex', alignItems: 'flex-end' }}>
        {[{ w: 90, h: 55, l: -10 }, { w: 120, h: 72, l: 50 }, { w: 80, h: 48, l: 150 }, { w: 140, h: 80, l: 220 }, { w: 90, h: 52, l: 330 }, { w: 110, h: 65, l: 420 }].map((m, i) => (
          <div key={i} style={{
            position: 'absolute', left: m.l, bottom: 0,
            width: 0, height: 0,
            borderLeft: `${m.w / 2}px solid transparent`,
            borderRight: `${m.w / 2}px solid transparent`,
            borderBottom: `${m.h}px solid #0B1A0F`,
            opacity: 0.7 + (i % 2) * 0.2,
          }} />
        ))}
      </div>

      {/* ── Ground strip ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, backgroundColor: '#1C2410', borderTop: '2px solid #2D3B1A' }} />
      <div style={{ position: 'absolute', bottom: 62, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, transparent, #3D5A22 20%, #3D5A22 80%, transparent)' }} />

      {/* ── Trees (behind hero) ── */}
      {[{ l: '4%', s: '1.7rem', d: 3.2 }, { l: '14%', s: '2.1rem', d: 2.8 }, { l: '72%', s: '2rem', d: 3.5 }, { l: '84%', s: '1.8rem', d: 2.5 }, { l: '92%', s: '2.2rem', d: 4 }].map((t, i) => (
        <motion.div key={i}
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: t.d, delay: i * 0.4 }}
          style={{ position: 'absolute', bottom: 60, left: t.l, fontSize: t.s, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.7))' }}>
          🌲
        </motion.div>
      ))}

      {/* ── Tent ── */}
      <div style={{ position: 'absolute', bottom: 60, left: '22%', fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>⛺</div>

      {/* ── Campfire ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 0.92, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        style={{ position: 'absolute', bottom: 62, left: '38%', fontSize: '1.6rem' }}>
        🔥
      </motion.div>
      {/* Fire glow on ground */}
      <div style={{ position: 'absolute', bottom: 62, left: 'calc(38% - 12px)', width: 36, height: 14, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(251,146,60,0.35) 0%, transparent 70%)', filter: 'blur(4px)' }} />

      {/* ── HERO — center, large ── */}
      <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)' }}>
        {/* Hero glow */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          background: `radial-gradient(circle, ${buildColor}30 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{ fontSize: '3.8rem', lineHeight: 1, filter: `drop-shadow(0 6px 18px ${buildColor}70)`, position: 'relative' }}>
          {buildEmoji}
        </motion.div>
        {/* Class label */}
        <div style={{
          textAlign: 'center', marginTop: 4,
          fontSize: '0.5rem', fontWeight: 900, color: buildColor,
          textTransform: 'uppercase', letterSpacing: 1,
          textShadow: `0 0 8px ${buildColor}`,
        }}>{buildName}</div>
      </div>

      {/* ── HUD overlays ── */}
      {/* Top-left: streak */}
      <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '0.9rem' }}>{dailyStreak >= 3 ? '🔥' : '💤'}</span>
        <span style={{ fontWeight: 900, fontSize: '0.72rem', color: dailyStreak > 0 ? '#FB923C' : '#475569' }}>
          {dailyStreak}d streak
        </span>
      </div>

      {/* Top-right: gold */}
      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(251,191,36,0.15)' }}>
        <span style={{ fontSize: '0.85rem' }}>🪙</span>
        <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#FBBF24' }}>{gold}</span>
      </div>

      {/* Bottom-left: kills */}
      <div style={{ position: 'absolute', bottom: 6, left: 12, display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '0.85rem' }}>💀</span>
        <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#F87171' }}>{killCount} kills</span>
      </div>

      {/* Bottom-right: HP */}
      <div style={{ position: 'absolute', bottom: 6, right: 12, display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(34,197,94,0.15)' }}>
        <span style={{ fontSize: '0.85rem' }}>❤️</span>
        <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#34D399' }}>{player.hp}/{player.maxHp}</span>
      </div>

      <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

const BUILD_INFO = {
  warrior: { emoji: '⚔️', name: 'Guerreiro', stat: '160 HP · 30 Dano · 8% Crit',  color: '#EF4444', desc: 'Tanque. Mata rápido, sobrevive ao erro.' },
  mage:    { emoji: '🔮', name: 'Mago',       stat: '72 HP · 55 Dano · 22% Crit',  color: '#8B5CF6', desc: 'Crit = 137 dano. Não erre.' },
  rogue:   { emoji: '🗡️', name: 'Ladino',    stat: '110 HP · 24 Dano · 35% Crit', color: '#22C55E', desc: '2.2× Ouro. Crit constante.' },
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

  const accuracy = todayStats.questions > 0
    ? Math.min(100, Math.round((todayStats.kills / Math.max(1, todayStats.kills + todayStats.questions * 0.3)) * 100))
    : 0;

  const handleShare = async () => {
    try {
      // Generate canvas image
      const canvas = document.createElement('canvas');
      const DPR = Math.min(window.devicePixelRatio || 2, 3);
      const W = 400, H = 580;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(DPR, DPR);

      // ── Background ──
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#060B16');
      bgGrad.addColorStop(0.5, '#0D1526');
      bgGrad.addColorStop(1, '#0A0F1E');
      ctx.fillStyle = bgGrad;
      ctx.roundRect(0, 0, W, H, 24);
      ctx.fill();

      // ── Top accent glow ──
      const glowGrad = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, 200);
      glowGrad.addColorStop(0, 'rgba(99,102,241,0.25)');
      glowGrad.addColorStop(1, 'rgba(99,102,241,0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H/2);

      // ── Border ──
      ctx.strokeStyle = 'rgba(99,102,241,0.35)';
      ctx.lineWidth = 1.5;
      ctx.roundRect(1, 1, W-2, H-2, 23);
      ctx.stroke();

      // ── Logo / Icon ──
      ctx.font = '52px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚔️', W/2, 80);

      // ── Title ──
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('Concurseiro RPG', W/2, 115);

      // ── Subtitle ──
      ctx.font = '700 12px system-ui, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('RESULTADO DO DIA', W/2, 138);

      // ── Divider ──
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(32, 155); ctx.lineTo(W-32, 155); ctx.stroke();

      // ── Class badge ──
      const buildEmoji = build === 'warrior' ? '🛡️' : build === 'mage' ? '🔮' : '🗡️';
      const buildName2  = build === 'warrior' ? 'Guerreiro' : build === 'mage' ? 'Mago' : 'Ladino';
      const buildColor2 = build === 'warrior' ? '#EF4444' : build === 'mage' ? '#A855F7' : '#22C55E';

      // pill background
      ctx.fillStyle = buildColor2 + '22';
      const pillW = 140, pillH = 32, pillX = W/2 - pillW/2, pillY = 164;
      ctx.roundRect(pillX, pillY, pillW, pillH, 999);
      ctx.fill();
      ctx.strokeStyle = buildColor2 + '60';
      ctx.lineWidth = 1;
      ctx.roundRect(pillX, pillY, pillW, pillH, 999);
      ctx.stroke();
      ctx.font = '700 13px system-ui, sans-serif';
      ctx.fillStyle = buildColor2;
      ctx.fillText(`${buildEmoji} ${buildName2}`, W/2, 185);

      // ── Stats 2x2 grid ──
      const stats = [
        { icon: '📚', value: String(todayStats.questions), label: 'Questões', color: '#60A5FA' },
        { icon: '💀', value: String(todayStats.kills),     label: 'Derrotados', color: '#F87171' },
        { icon: '🔥', value: String(streak),               label: 'Dias Streak', color: '#FB923C' },
        { icon: '🪙', value: String(todayStats.goldEarned),label: 'Ouro', color: '#FBBF24' },
      ];
      const gridTop = 212, cellW = 176, cellH = 120;
      stats.forEach((s, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const cx = 12 + col * cellW, cy = gridTop + row * cellH;
        // cell bg
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.roundRect(cx, cy, cellW - 8, cellH - 8, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.roundRect(cx, cy, cellW - 8, cellH - 8, 14);
        ctx.stroke();
        // icon
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.icon, cx + (cellW-8)/2, cy + 38);
        // value
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillStyle = s.color;
        ctx.fillText(s.value || '0', cx + (cellW-8)/2, cy + 72);
        // label
        ctx.font = '600 11px system-ui, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(s.label, cx + (cellW-8)/2, cy + 92);
      });

      // ── Footer ──
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(32, H-80); ctx.lineTo(W-32, H-80); ctx.stroke();

      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'center';
      ctx.fillText('maktheus.github.io/phantom-singularity', W/2, H-52);

      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillStyle = '#6366F1';
      ctx.fillText('Estude como RPG ⚔️', W/2, H-28);

      // ── Convert to blob and share ──
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'concurseiro-rpg.png', { type: 'image/png' });
        try {
          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Concurseiro RPG',
              text: `${buildEmoji} ${buildName2} — ${todayStats.kills} inimigos derrotados hoje!`,
              files: [file],
            });
          } else {
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'concurseiro-rpg.png'; a.click();
            URL.revokeObjectURL(url);
          }
          setShared(true);
          setTimeout(() => setShared(false), 2500);
        } catch {/* cancelled */}
      }, 'image/png');
    } catch { /* silent */ }
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
    player, killCount, totalQuestionsAnswered,
    startRun,
    dailyPlaysUsed, dailyStreak, isPremium, todayStats,
    recordDailyPlay,
  } = useAppStore();
  const pendingCosmeticChest = useAppStore(s => s.pendingCosmeticChest);
  const setPendingCosmeticChest = useAppStore(s => s.setPendingCosmeticChest);
  const unlockedBuilds = useAppStore(s => s.unlockedBuilds);

  const gold             = useAppStore(s => s.gold);
  const ownedBlueprints  = useAppStore(s => s.ownedBlueprints);
  const buyBlueprint     = useAppStore(s => s.buyBlueprint);
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
                {(Object.entries(BUILD_INFO) as [BuildType, typeof BUILD_INFO.warrior][]).map(([key, b]) => {
                  const isLocked = !unlockedBuilds.includes(key);
                  const unlockAt = key === 'mage' ? '3 kills' : key === 'rogue' ? '10 kills' : null;
                  return (
                    <motion.button key={key} whileTap={isLocked ? {} : { scale: 0.97 }}
                      onClick={() => !isLocked && handleStartRun(key)}
                      style={{
                        padding: '16px 18px', borderRadius: 16, backgroundColor: isLocked ? '#0A0F1E' : '#111827',
                        border: `2px solid ${isLocked ? '#1E293B' : b.color + '30'}`, color: isLocked ? '#334155' : 'white', textAlign: 'left',
                        display: 'flex', gap: 14, alignItems: 'center',
                        boxShadow: isLocked ? 'none' : `0 4px 0 rgba(0,0,0,0.4), inset 0 0 20px ${b.color}06`,
                        opacity: isLocked ? 0.5 : 1, cursor: isLocked ? 'default' : 'pointer',
                      }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                        background: isLocked ? '#111827' : `linear-gradient(135deg, ${b.color}20, ${b.color}08)`,
                        border: `1.5px solid ${isLocked ? '#1E293B' : b.color + '30'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                      }}>{isLocked ? '🔒' : b.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: '1rem', color: isLocked ? '#334155' : b.color }}>{b.name}</div>
                        <div style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, marginTop: 1 }}>
                          {isLocked ? `Desbloqueie com ${unlockAt}` : b.stat}
                        </div>
                        {!isLocked && <div style={{ color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 600, marginTop: 3 }}>{b.desc}</div>}
                      </div>
                      {!isLocked && (
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${b.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: b.color }}>▶</div>
                      )}
                    </motion.button>
                  );
                })}
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

        {/* ── LOJA DE PODER (Blueprint Shop) ── */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>⚗️ Loja de Poder</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FBBF24' }}>🪙 {gold} ouro</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SHOP_BLUEPRINTS.filter((b: ShopBlueprint) => b.discoverAt <= killCount).map((bp: ShopBlueprint) => {
              const powerUp = RUN_POWERUPS.find(p => p.id === bp.id);
              const owned = ownedBlueprints.includes(bp.id);
              const canAfford = gold >= bp.cost;
              return (
                <div key={bp.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14,
                  background: owned ? 'rgba(34,197,94,0.08)' : '#0F172A',
                  border: `1.5px solid ${owned ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  opacity: (!owned && !canAfford) ? 0.5 : 1,
                }}>
                  <span style={{ fontSize: '1.4rem' }}>{powerUp?.emoji ?? '❓'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: owned ? '#86EFAC' : '#E2E8F0' }}>
                      {powerUp?.name ?? bp.id}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600, marginTop: 2 }}>
                      {powerUp?.desc ?? ''}
                    </div>
                  </div>
                  {owned ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#22C55E' }}>✓ Ativo</span>
                  ) : bp.cost === 0 ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#FBBF24' }}>Grátis</span>
                  ) : (
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => buyBlueprint(bp.id)}
                      disabled={!canAfford}
                      style={{
                        padding: '6px 12px', borderRadius: 10, fontWeight: 900, fontSize: '0.72rem',
                        background: canAfford ? 'linear-gradient(135deg, #D97706, #92400E)' : '#1E293B',
                        color: canAfford ? '#000' : '#334155', border: 'none', cursor: canAfford ? 'pointer' : 'default',
                      }}>
                      🪙 {bp.cost}
                    </motion.button>
                  )}
                </div>
              );
            })}
            {SHOP_BLUEPRINTS.filter((b: ShopBlueprint) => b.discoverAt <= killCount).length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#334155', fontSize: '0.78rem', fontWeight: 700 }}>
                Derrote inimigos para desbloquear itens na loja!
              </div>
            )}
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
