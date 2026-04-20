import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { ConcursoType } from '../../store/useAppStore';

const CONCURSOS: { key: ConcursoType; emoji: string; label: string; sub: string }[] = [
  { key: 'policial',       emoji: '👮', label: 'Carreira Policial',    sub: 'PF · PC · PRF · PM' },
  { key: 'judiciario',     emoji: '⚖️', label: 'Judiciário',           sub: 'STF · STJ · TJ · TRT' },
  { key: 'administrativo', emoji: '📋', label: 'Administrativo',       sub: 'IBGE · IBAMA · Correios' },
  { key: 'tributario',     emoji: '💰', label: 'Fiscal/Tributária',    sub: 'SEFAZ · Receita Federal' },
  { key: 'ti',             emoji: '💻', label: 'TI e Tecnologia',      sub: 'SERPRO · BC · INSS' },
  { key: 'mixed',          emoji: '🎲', label: 'Geral — Caótico',      sub: 'Todas as áreas' },
];

export default function OnboardingFlow() {
  const navigate  = useNavigate();
  const [selected, setSelected] = useState<ConcursoType>('mixed');
  const [launching, setLaunching] = useState(false);

  const setConcurso      = useAppStore(s => s.setConcurso);
  const startRun         = useAppStore(s => s.startRun);
  const setHasOnboarded  = useAppStore(s => s.setHasOnboarded);
  const startTutorial    = useAppStore(s => s.startTutorial);
  const recordDailyPlay  = useAppStore(s => s.recordDailyPlay);

  const handleLaunch = async () => {
    if (launching) return;
    setLaunching(true);
    setConcurso(selected);
    setHasOnboarded();
    startTutorial();
    recordDailyPlay();
    await startRun('warrior', selected);
    navigate('/study');
  };

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 60%)',
    }}>

      {/* ── Hero section ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px 16px', textAlign: 'center' }}>

        {/* Animated hero */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {/* Outer glow ring */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -24, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Character */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
            style={{
              width: 110, height: 110, borderRadius: 32,
              background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)',
              border: '2px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.8rem',
              boxShadow: '0 0 40px rgba(59,130,246,0.35), 0 10px 0 rgba(29,78,216,0.6)',
            }}>
            ⚔️
          </motion.div>
          {/* Orbit particles */}
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4 + i * 1.2, ease: 'linear' }}
              style={{ position: 'absolute', inset: -16, pointerEvents: 'none' }}>
              <div style={{
                position: 'absolute', top: '50%', left: i === 0 ? 0 : i === 1 ? '100%' : '50%',
                width: 7, height: 7, borderRadius: '50%', marginTop: -3.5,
                background: ['#3B82F6', '#A855F7', '#22D3EE'][i],
                boxShadow: `0 0 8px ${['#3B82F6', '#A855F7', '#22D3EE'][i]}`,
                transform: i === 2 ? 'translateX(-50%) translateY(-280%)' : 'translateX(-50%)',
              }} />
            </motion.div>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontWeight: 900, fontSize: '1.9rem', lineHeight: 1.15, margin: '0 0 10px' }}>
          Concurseiro<br />
          <span style={{ background: 'linear-gradient(90deg,#60A5FA,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            RPG
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: '#64748B', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6, maxWidth: 280, margin: 0 }}>
          Estude respondendo questões.<br />Mate inimigos. Evolua seu herói.
        </motion.p>
      </div>

      {/* ── Concurso picker ── */}
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#334155', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 12px', textAlign: 'center' }}>
          Qual concurso você está estudando?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {CONCURSOS.map(c => {
            const isOn = selected === c.key;
            return (
              <motion.button key={c.key} whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(c.key)}
                style={{
                  padding: '10px 10px', borderRadius: 14, textAlign: 'left',
                  background: isOn ? 'linear-gradient(135deg,#1E3A8A,#312E81)' : '#111827',
                  border: `1.5px solid ${isOn ? '#3B82F6' : 'rgba(255,255,255,0.05)'}`,
                  color: 'white', cursor: 'pointer', position: 'relative',
                  boxShadow: isOn ? '0 4px 16px rgba(59,130,246,0.25)' : 'none',
                  transition: 'all 0.18s',
                }}>
                {isOn && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: 'white', fontWeight: 900,
                    }}>✓</motion.div>
                )}
                <div style={{ fontSize: '1.4rem', marginBottom: 3 }}>{c.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '0.72rem', lineHeight: 1.3 }}>{c.label}</div>
                <div style={{ fontSize: '0.58rem', color: isOn ? 'rgba(147,197,253,0.8)' : '#1E293B', fontWeight: 700, marginTop: 2 }}>{c.sub}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Launch CTA ── */}
      <div style={{ padding: '0 20px 36px' }}>
        {/* Warrior class preview */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 14,
          background: '#111827', border: '1px solid rgba(239,68,68,0.2)',
          marginBottom: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
          }}>⚔️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#EF4444' }}>Guerreiro — sua classe inicial</div>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, marginTop: 1 }}>160 HP · 30 Dano · Tanque. Mata rápido, aguenta erros.</div>
          </div>
          <div style={{
            marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 900, color: '#475569',
            background: '#0F172A', border: '1px solid #1E293B',
            padding: '3px 8px', borderRadius: 6,
          }}>Nv.1</div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLaunch}
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

        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#1E293B', fontWeight: 700, marginTop: 10 }}>
          Mage e Ladino desbloqueiam conforme você progride
        </p>
      </div>
    </div>
  );
}
