import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { ConcursoType, BuildType } from '../../store/useAppStore';

const CONCURSOS: { key: ConcursoType; emoji: string; label: string; sub: string }[] = [
  { key: 'policial',       emoji: '👮', label: 'Carreira Policial',    sub: 'PF · PC · PRF · PM' },
  { key: 'judiciario',     emoji: '⚖️', label: 'Judiciário',           sub: 'STF · STJ · TJ · TRT' },
  { key: 'administrativo', emoji: '📋', label: 'Administrativo',       sub: 'IBGE · IBAMA · Correios' },
  { key: 'tributario',     emoji: '💰', label: 'Fiscal/Tributária',    sub: 'SEFAZ · Receita Federal' },
  { key: 'ti',             emoji: '💻', label: 'TI e Tecnologia',      sub: 'SERPRO · BC · INSS' },
  { key: 'mixed',          emoji: '🎲', label: 'Geral — Caótico',      sub: 'Todas as áreas' },
];

const BUILDS: {
  key: BuildType; emoji: string; name: string; color: string;
  hp: number; dmg: number; crit: string; desc: string; locked?: boolean; unlockAt?: string;
}[] = [
  { key: 'warrior', emoji: '⚔️', name: 'Guerreiro', color: '#EF4444',
    hp: 160, dmg: 30, crit: '8%',
    desc: 'Tanque. Mata rápido, aguenta os erros.' },
  { key: 'mage', emoji: '🔮', name: 'Mago', color: '#8B5CF6',
    hp: 72, dmg: 55, crit: '22%',
    desc: 'Críticos devastadores. Não erre.', locked: true, unlockAt: '3 kills' },
  { key: 'rogue', emoji: '🗡️', name: 'Ladino', color: '#22C55E',
    hp: 110, dmg: 24, crit: '35%',
    desc: 'Crit constante + 2.2× ouro.', locked: true, unlockAt: '10 kills' },
];

// ─── Step 1: Class picker ──────────────────────────────────────────────────────
function ClassStep({ onNext }: { onNext: () => void }) {
  const [preview, setPreview] = useState<BuildType>('warrior');
  const active = BUILDS.find(b => b.key === preview)!;

  return (
    <motion.div
      key="class-step"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{ padding: '40px 24px 16px', textAlign: 'center' }}>
        {/* Animated hero icon */}
        <div style={{ position: 'relative', marginBottom: 20, display: 'inline-block' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.65, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -20, borderRadius: '50%',
              background: `radial-gradient(circle, ${active.color}40 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
          <motion.div
            key={active.key}
            initial={{ scale: 0.6, rotate: -15 }}
            animate={{ scale: 1, rotate: 0, y: [0, -10, 0] }}
            transition={{ scale: { type: 'spring', stiffness: 320, damping: 18 }, y: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' } }}
            style={{
              width: 96, height: 96, borderRadius: 28,
              background: `linear-gradient(135deg, ${active.color}28, ${active.color}10)`,
              border: `2px solid ${active.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.4rem', lineHeight: 1,
              boxShadow: `0 0 36px ${active.color}50, 0 8px 0 rgba(0,0,0,0.5)`,
            }}>
            {active.emoji}
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontWeight: 900, fontSize: '1.65rem', lineHeight: 1.15, margin: '0 0 6px' }}>
          Escolha sua Classe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
          Sua classe define como você joga. Mude entre runs!
        </motion.p>
      </div>

      {/* Class cards */}
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BUILDS.map((b, i) => {
          const isSelected = preview === b.key;
          return (
            <motion.button key={b.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 320, damping: 26 }}
              whileTap={b.locked ? {} : { scale: 0.97 }}
              onClick={() => !b.locked && setPreview(b.key)}
              style={{
                padding: '14px 16px', borderRadius: 18, textAlign: 'left',
                background: isSelected
                  ? `linear-gradient(135deg, ${b.color}22, ${b.color}08)`
                  : b.locked ? '#0A0F1E' : '#111827',
                border: `2px solid ${isSelected ? b.color + '60' : b.locked ? '#1E293B' : 'rgba(255,255,255,0.05)'}`,
                color: b.locked ? '#334155' : 'white',
                boxShadow: isSelected ? `0 4px 24px ${b.color}25` : b.locked ? 'none' : '0 2px 0 rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', gap: 14,
                opacity: b.locked ? 0.55 : 1,
                cursor: b.locked ? 'default' : 'pointer',
                transition: 'all 0.18s',
              }}>
              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: b.locked ? '#111827' : `${b.color}18`,
                border: `1.5px solid ${b.locked ? '#1E293B' : `${b.color}30`}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: b.locked ? '1.6rem' : '1.9rem',
              }}>
                {b.locked ? '🔒' : b.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 900, fontSize: '0.95rem', color: b.locked ? '#334155' : b.color }}>
                    {b.name}
                  </span>
                  {b.locked && (
                    <span style={{
                      fontSize: '0.55rem', fontWeight: 900, color: '#475569',
                      background: '#1E293B', padding: '2px 7px', borderRadius: 999,
                    }}>
                      🔓 {b.unlockAt}
                    </span>
                  )}
                </div>
                {b.locked ? (
                  <div style={{ fontSize: '0.72rem', color: '#1E293B', fontWeight: 700 }}>
                    {b.desc}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: 2 }}>
                      ❤️ {b.hp} HP · ⚔️ {b.dmg} Dano · 🎯 {b.crit} Crit
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isSelected ? '#CBD5E1' : '#64748B', fontWeight: 600 }}>
                      {b.desc}
                    </div>
                  </>
                )}
              </div>

              {/* Selected indicator */}
              {isSelected && !b.locked && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: b.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', color: 'white', fontWeight: 900,
                    boxShadow: `0 0 12px ${b.color}60`,
                  }}>
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 40px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          style={{
            width: '100%', padding: '18px',
            background: `linear-gradient(135deg, ${active.color}, ${active.color}bb)`,
            color: 'white', borderRadius: 18,
            fontWeight: 900, fontSize: '1.05rem',
            boxShadow: `0 6px 0 rgba(0,0,0,0.5)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            border: 'none', cursor: 'pointer',
          }}>
          {active.emoji} Jogar como {active.name}  →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Concurso picker ──────────────────────────────────────────────────
function ConcursoStep({ onBack, onLaunch, launching }: {
  onBack: () => void;
  onLaunch: (concurso: ConcursoType) => void;
  launching: boolean;
}) {
  const [selected, setSelected] = useState<ConcursoType>('mixed');

  return (
    <motion.div
      key="concurso-step"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{ padding: '40px 24px 20px' }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#475569', fontWeight: 800, fontSize: '0.82rem',
          background: '#111827', border: '1px solid #1E293B',
          padding: '6px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 20,
        }}>
          ← Voltar
        </button>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontWeight: 900, fontSize: '1.6rem', lineHeight: 1.15, margin: '0 0 6px' }}>
          Qual concurso<br />você estuda?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
          As questões serão filtradas para sua área.
        </motion.p>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {CONCURSOS.map((c, i) => {
            const isOn = selected === c.key;
            return (
              <motion.button key={c.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 320, damping: 26 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(c.key)}
                style={{
                  padding: '12px 10px', borderRadius: 16, textAlign: 'left',
                  background: isOn ? 'linear-gradient(135deg,#1E3A8A,#312E81)' : '#111827',
                  border: `2px solid ${isOn ? '#3B82F6' : 'rgba(255,255,255,0.05)'}`,
                  color: 'white', cursor: 'pointer', position: 'relative',
                  boxShadow: isOn ? '0 4px 20px rgba(59,130,246,0.3)' : '0 2px 0 rgba(0,0,0,0.3)',
                  transition: 'all 0.18s',
                }}>
                {isOn && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: 'white', fontWeight: 900,
                    }}>✓</motion.div>
                )}
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{c.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '0.72rem', lineHeight: 1.3, color: isOn ? '#E2E8F0' : '#CBD5E1' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: '0.58rem', color: isOn ? 'rgba(147,197,253,0.8)' : '#1E293B', fontWeight: 700, marginTop: 2 }}>
                  {c.sub}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Launch CTA */}
      <div style={{ padding: '16px 20px 40px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onLaunch(selected)}
          disabled={launching}
          style={{
            width: '100%', padding: '18px',
            background: launching
              ? 'linear-gradient(135deg,#334155,#1E293B)'
              : 'linear-gradient(135deg,#2563EB,#7C3AED)',
            color: 'white', borderRadius: 18,
            fontWeight: 900, fontSize: '1.1rem',
            boxShadow: launching ? 'none' : '0 6px 0 rgba(29,78,216,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            border: 'none', cursor: launching ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}>
          {launching ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block' }}>⚙️</motion.span>
              Entrando na batalha...
            </>
          ) : (
            <>⚔️ Entrar na Batalha!</>
          )}
        </motion.button>
        <p style={{ textAlign: 'center', fontSize: '0.62rem', color: '#1E293B', fontWeight: 700, marginTop: 10 }}>
          Mago e Ladino desbloqueiam conforme você progride
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OnboardingFlow() {
  const navigate  = useNavigate();
  const [step, setStep]     = useState(0);
  const [launching, setLaunching] = useState(false);

  const setConcurso      = useAppStore(s => s.setConcurso);
  const startRun         = useAppStore(s => s.startRun);
  const setHasOnboarded  = useAppStore(s => s.setHasOnboarded);
  const startTutorial    = useAppStore(s => s.startTutorial);
  const recordDailyPlay  = useAppStore(s => s.recordDailyPlay);

  const handleLaunch = async (concurso: ConcursoType) => {
    if (launching) return;
    setLaunching(true);
    setConcurso(concurso);
    setHasOnboarded();
    startTutorial();
    recordDailyPlay();
    await startRun('warrior', concurso);
    navigate('/study');
  };

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 60%)',
    }}>
      {/* Step indicator */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 7, zIndex: 10,
      }}>
        {[0, 1].map(i => (
          <motion.div key={i}
            animate={{ width: i === step ? 22 : 8, background: i === step ? '#3B82F6' : '#1E293B' }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{ height: 5, borderRadius: 999 }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <ClassStep key="class" onNext={() => setStep(1)} />
        ) : (
          <ConcursoStep key="concurso" onBack={() => setStep(0)} onLaunch={handleLaunch} launching={launching} />
        )}
      </AnimatePresence>
    </div>
  );
}
