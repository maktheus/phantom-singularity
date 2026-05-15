import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, Trash2, Info, RotateCcw, Trophy, Flame, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../hooks/useTheme';
import { useToastStore } from '../../store/useToastStore';
import { useT, TRANSLATIONS } from '../../i18n';

export default function SettingsPage() {
  const navigate = useNavigate();
  const t = useTheme();
  const theme = useAppStore(s => s.theme);
  const toggleTheme = useAppStore(s => s.toggleTheme);
  const soundEnabled = useAppStore(s => s.soundEnabled);
  const toggleSound = useAppStore(s => s.toggleSound);
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const [confirmReset, setConfirmReset] = useState(false);
  const respawn = useAppStore(s => s.respawn);
  const resetOnboarding = useAppStore(s => s.resetOnboarding);
  const { show } = useToastStore();

  const tr = useT(language);
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    toggleTheme();
    const next = theme === 'dark' ? 'light' : 'dark';
    show(next === 'dark' ? tr.toastDark : tr.toastLight, 'info', next === 'dark' ? '🌙' : '☀️');
  };

  const handleToggleSound = () => {
    toggleSound();
    show(soundEnabled ? tr.toastSoundOff : tr.toastSoundOn, 'info', soundEnabled ? '🔇' : '🔊');
  };

  const handleToggleLanguage = () => {
    const next = language === 'pt' ? 'en' : 'pt';
    setLanguage(next);
    const nextTr = useT_static(next);
    show(next === 'en' ? nextTr.toastLangEn : nextTr.toastLangPt, 'info', '🌐');
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    respawn();
    setConfirmReset(false);
    show(tr.toastResetDone, 'success', '🔄');
    navigate('/home');
  };

  const handleTutorial = () => {
    resetOnboarding();
    try {
      const raw = localStorage.getItem('phantom-rpg-v3-save');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.state) parsed.state.hasOnboarded = false;
        localStorage.setItem('phantom-rpg-v3-save', JSON.stringify(parsed));
      }
    } catch { /* ignore */ }
    show(tr.toastTutorial, 'info', '🎓');
    setTimeout(() => navigate('/onboarding'), 400);
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
          <ArrowLeft size={15} /> {tr.back}
        </button>
        <h1 style={{ fontWeight: 900, fontSize: '1.2rem', flex: 1, margin: 0 }}>{tr.title}</h1>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Aparência / Appearance ── */}
        <Section label={tr.appearance} t={t}>
          <SectionRow
            icon={isDark ? <Moon size={18} color="#818CF8" /> : <Sun size={18} color="#FBBF24" />}
            label={isDark ? tr.darkMode : tr.lightMode}
            sub={tr.themeDesc}
            t={t}
            right={<ThemeToggle isDark={isDark} onToggle={handleToggleTheme} />}
          />
        </Section>

        {/* ── Áudio / Audio ── */}
        <Section label={tr.audio} t={t}>
          <SectionRow
            icon={soundEnabled ? <Volume2 size={18} color="#22C55E" /> : <VolumeX size={18} color="#475569" />}
            label={tr.soundEffects}
            sub={tr.soundDesc}
            t={t}
            right={<SimpleToggle on={soundEnabled} onToggle={handleToggleSound} color="#22C55E" />}
          />
        </Section>

        {/* ── Idioma / Language ── */}
        <Section label={tr.language} t={t}>
          <SectionRow
            icon={<Globe size={18} color="#3B82F6" />}
            label={tr.languageLabel}
            sub={tr.languageDesc}
            t={t}
            right={
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleLanguage}
                style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  borderRadius: 10, overflow: 'hidden',
                  border: `1px solid ${t.borderStr}`, flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  padding: '7px 12px', fontWeight: 900, fontSize: '0.78rem',
                  background: language === 'pt' ? '#3B82F6' : t.bgSub,
                  color: language === 'pt' ? 'white' : t.textMuted,
                  borderRight: `1px solid ${t.borderStr}`,
                }}>PT</div>
                <div style={{
                  padding: '7px 12px', fontWeight: 900, fontSize: '0.78rem',
                  background: language === 'en' ? '#3B82F6' : t.bgSub,
                  color: language === 'en' ? 'white' : t.textMuted,
                }}>EN</div>
              </motion.button>
            }
          />
        </Section>

        {/* ── Dados da Run ── */}
        <Section label={tr.runData} t={t}>
          <SectionRow
            icon={<Trash2 size={18} color={confirmReset ? '#EF4444' : '#64748B'} />}
            label={confirmReset ? tr.confirmReset : tr.resetRun}
            sub={confirmReset ? tr.confirmResetDesc : tr.resetRunDesc}
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
                {confirmReset ? tr.confirmBtn : tr.resetBtn}
              </motion.button>
            }
          />
          <Divider t={t} />
          <SectionRow
            icon={<RotateCcw size={18} color="#8B5CF6" />}
            label={tr.tutorial}
            sub={tr.tutorialDesc}
            t={t}
            right={
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={handleTutorial}
                style={{
                  padding: '8px 14px', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem',
                  background: 'linear-gradient(135deg,#7C3AED,#4C1D95)',
                  color: 'white', border: 'none', cursor: 'pointer',
                }}>
                {tr.tutorialBtn}
              </motion.button>
            }
          />
        </Section>

        {/* ── Sobre / About ── */}
        <Section label={tr.about} t={t}>
          <SectionRow
            icon={<Info size={18} color="#3B82F6" />}
            label={tr.aboutTitle}
            sub={tr.version}
            t={t}
            right={<span style={{ fontSize: '0.75rem', color: t.textMuted, fontWeight: 700 }}>v1.0.0</span>}
          />
        </Section>

        {/* ── Sua Jornada / Journey ── */}
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, paddingLeft: 4 }}>
            {tr.journey}
          </div>
          <div style={{
            padding: '16px', borderRadius: 16,
            background: t.bgCard, border: `1px solid ${t.borderStr}`,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatMini icon="📚" label={tr.questions} storeKey="totalQuestionsAnswered" t={t} />
              <StatMini icon="💀" label={tr.kills} storeKey="killCount" t={t} />
              <StatMini icon="🪙" label={tr.gold} storeKey="gold" t={t} />
              <StatMini icon="🏃" label={tr.totalRuns} storeKey="totalRuns" t={t} />
              <StatMini icon={<Trophy size={18} color="#FBBF24" />} label={tr.bestLevel} storeKey="bestLevel" t={t} />
              <StatMini icon={<Flame size={18} color="#F97316" />} label={tr.dailyStreak} storeKey="dailyStreak" t={t} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function useT_static(lang: 'pt' | 'en') {
  return TRANSLATIONS[lang].settings;
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
