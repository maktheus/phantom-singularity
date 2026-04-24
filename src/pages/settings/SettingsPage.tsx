import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, Trash2, Info, RotateCcw, Trophy, Flame, Swords } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../hooks/useTheme';

export default function SettingsPage() {
  const navigate = useNavigate();
  const t = useTheme();
  const theme = useAppStore(s => s.theme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const soundEnabled = useAppStore(s => s.soundEnabled);
  const toggleSound = useAppStore(s => s.toggleSound);
  const [confirmReset, setConfirmReset] = useState(false);
  const respawn = useAppStore(s => s.respawn);
  const resetOnboarding = useAppStore(s => s.resetOnboarding);

  const isDark = theme === 'dark';

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    respawn();
    setConfirmReset(false);
    navigate('/home');
  };

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: t.bg, color: t.text, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        background: t.headerBg, borderBottom: `1px solid ${t.border}`,
        position: 'sticky', top: 0, zIndex: 10,
        backdropFilter: 'blur(10px)',
      }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: t.textSub, fontWeight: 800, fontSize: '0.85rem',
          padding: '6px 10px', borderRadius: 10, backgroundColor: t.bgCard, border: `1px solid ${t.borderStr}`,
          cursor: 'pointer',
        }}>
          <ArrowLeft size={15} /> Voltar
        </button>
        <h1 style={{ fontWeight: 900, fontSize: '1.2rem', flex: 1, margin: 0 }}>⚙️ Configurações</h1>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Aparência ── */}
        <Section label="Aparência" t={t}>
          <SectionRow
            icon={isDark ? <Moon size={18} color="#818CF8" /> : <Sun size={18} color="#FBBF24" />}
            label={isDark ? 'Modo Escuro' : 'Modo Claro'}
            sub="Mude a aparência do app"
            t={t}
            right={<ThemeToggle isDark={isDark} onToggle={toggleTheme} />}
          />
        </Section>

        {/* ── Áudio ── */}
        <Section label="Áudio" t={t}>
          <SectionRow
            icon={soundEnabled ? <Volume2 size={18} color="#22C55E" /> : <VolumeX size={18} color="#475569" />}
            label="Sons e Efeitos"
            sub="Efeitos de acerto, erro e level up"
            t={t}
            right={<SimpleToggle on={soundEnabled} onToggle={toggleSound} color="#22C55E" />}
          />
        </Section>

        {/* ── Dados da Run ── */}
        <Section label="Dados da Run" t={t}>
          <SectionRow
            icon={<Trash2 size={18} color={confirmReset ? '#EF4444' : '#64748B'} />}
            label={confirmReset ? '⚠️ Confirmar reset?' : 'Resetar Run Atual'}
            sub={confirmReset ? 'Toque novamente para confirmar' : 'Volta ao Lv.1 sem perder ouro'}
            t={t}
            right={
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={handleReset}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem',
                  background: confirmReset ? 'linear-gradient(135deg,#EF4444,#991B1B)' : t.bgSub,
                  color: confirmReset ? 'white' : t.textMuted,
                  border: `1px solid ${confirmReset ? '#EF4444' : t.borderStr}`,
                  cursor: 'pointer',
                }}>
                {confirmReset ? 'Confirmar' : 'Resetar'}
              </motion.button>
            }
          />
          <Divider t={t} />
          <SectionRow
            icon={<RotateCcw size={18} color="#8B5CF6" />}
            label="Ver Tutorial Novamente"
            sub="Recomeça o onboarding do zero"
            t={t}
            right={
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={() => {
                  resetOnboarding();
                  try {
                    const raw = localStorage.getItem('phantom-rpg-v3-save');
                    if (raw) {
                      const parsed = JSON.parse(raw);
                      if (parsed?.state) parsed.state.hasOnboarded = false;
                      localStorage.setItem('phantom-rpg-v3-save', JSON.stringify(parsed));
                    }
                  } catch { /* ignore */ }
                  navigate('/onboarding');
                }}
                style={{
                  padding: '8px 14px', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem',
                  background: 'linear-gradient(135deg,#7C3AED,#4C1D95)',
                  color: 'white', border: 'none', cursor: 'pointer',
                }}>
                Ver →
              </motion.button>
            }
          />
        </Section>

        {/* ── Sobre ── */}
        <Section label="Sobre" t={t}>
          <SectionRow
            icon={<Info size={18} color="#3B82F6" />}
            label="Phantom Singularity"
            sub="Versão 1.0.0"
            t={t}
            right={<span style={{ fontSize: '0.75rem', color: t.textMuted, fontWeight: 700 }}>v1.0.0</span>}
          />
        </Section>

        {/* ── Sua Jornada ── */}
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, paddingLeft: 4 }}>
            Sua Jornada
          </div>
          <div style={{
            padding: '16px', borderRadius: 16,
            background: t.bgCard, border: `1px solid ${t.borderStr}`,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatMini icon="📚" label="Questões" storeKey="totalQuestionsAnswered" t={t} />
              <StatMini icon="💀" label="Kills" storeKey="killCount" t={t} />
              <StatMini icon="🪙" label="Ouro Total" storeKey="gold" t={t} />
              <StatMini icon="🏃" label="Runs Totais" storeKey="totalRuns" t={t} />
              <StatMini icon={<Trophy size={18} color="#FBBF24" />} label="Melhor Nível" storeKey="bestLevel" t={t} />
              <StatMini icon={<Flame size={18} color="#F97316" />} label="Streak Diário" storeKey="dailyStreak" t={t} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ label, children, t }: { label: string; children: React.ReactNode; t: Theme }) {
  return (
    <div>
      <div style={{ fontSize: '0.68rem', fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, paddingLeft: 4 }}>
        {label}
      </div>
      <div style={{ background: t.bgCard, borderRadius: 16, border: `1px solid ${t.borderStr}`, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Divider({ t }: { t: Theme }) {
  return <div style={{ height: 1, backgroundColor: t.borderStr, marginLeft: 68 }} />;
}

function SectionRow({ icon, label, sub, right, t }: {
  icon: React.ReactNode; label: string; sub: string;
  right?: React.ReactNode;
  t: Theme;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: t.bgSub, border: `1px solid ${t.borderStr}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: t.text }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: t.textMuted, fontWeight: 600, marginTop: 1 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onToggle}
      style={{
        width: 56, height: 30, borderRadius: 999, flexShrink: 0,
        background: isDark ? '#3B82F6' : '#E2E8F0',
        border: 'none', cursor: 'pointer', position: 'relative', padding: 3,
        display: 'flex', alignItems: 'center',
        justifyContent: isDark ? 'flex-end' : 'flex-start',
      }}>
      <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 24, height: 24, borderRadius: '50%', background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem',
        }}>
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  );
}

function SimpleToggle({ on, onToggle, color }: { on: boolean; onToggle: () => void; color: string }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onToggle}
      style={{
        width: 56, height: 30, borderRadius: 999, flexShrink: 0,
        background: on ? color : '#334155',
        border: 'none', cursor: 'pointer', position: 'relative', padding: 3,
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}>
      <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: 24, height: 24, borderRadius: '50%', background: 'white' }} />
    </motion.button>
  );
}

type StatKey = 'totalQuestionsAnswered' | 'killCount' | 'gold' | 'totalRuns' | 'bestLevel' | 'dailyStreak';

function StatMini({ icon, label, storeKey, t }: {
  icon: React.ReactNode; label: string; storeKey: StatKey;
  t: Theme;
}) {
  const val = useAppStore(s => s[storeKey]);
  const isNode = typeof icon !== 'string';
  return (
    <div style={{ padding: '12px', background: t.bgSub, borderRadius: 12, border: `1px solid ${t.borderStr}`, textAlign: 'center' }}>
      <div style={{ fontSize: isNode ? undefined : '1.4rem', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28 }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: '1rem', color: t.text }}>{val}</div>
      <div style={{ fontSize: '0.62rem', color: t.textMuted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}
