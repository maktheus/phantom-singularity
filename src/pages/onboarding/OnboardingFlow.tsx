import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Zap, Clock, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const TOTAL_STEPS = 4;

function ProgressDots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 24 : 8, opacity: i <= current ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ height: 8, borderRadius: 999, backgroundColor: i === current ? '#3B82F6' : '#334155' }}
        />
      ))}
    </div>
  );
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const setHasOnboarded = useAppStore(s => s.setHasOnboarded);
  const nextStep = () => setStep(s => s + 1);

  const handleFinish = () => {
    setHasOnboarded();
    navigate('/home');
  };

  return (
    <div style={{
      padding: '48px 24px 32px',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0A0F1E',
      color: 'white',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%)',
    }}>
      <ProgressDots current={step} />
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeStep key="s0" onNext={nextStep} />}
        {step === 1 && <GoalStep key="s1" onNext={nextStep} />}
        {step === 2 && <TimeStep key="s2" onNext={nextStep} />}
        {step === 3 && <RevealStep key="s3" onFinish={handleFinish} />}
      </AnimatePresence>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Center content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            width: 100, height: 100, borderRadius: 30,
            background: 'linear-gradient(135deg, #3B82F6 0%, #6D28D9 100%)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            marginBottom: 32,
            boxShadow: '0 0 60px rgba(59,130,246,0.4), 0 8px 0 rgba(29,78,216,0.8)',
          }}>
          <Zap color="white" size={52} />
        </motion.div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: 16, fontWeight: 900, lineHeight: 1.15, letterSpacing: -0.5 }}>
          Pare de estudar<br />no escuro.
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: 280, fontWeight: 600 }}>
          Derrote questões. Ganhe ouro.<br />Evolua como concurseiro.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['⚔️ RPG de Estudos', '🎯 Questões Reais', '🏆 Ranking'].map(f => (
            <span key={f} style={{
              padding: '6px 14px', borderRadius: 999,
              backgroundColor: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.25)',
              fontSize: '0.8rem', fontWeight: 700, color: '#93C5FD',
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        style={{
          width: '100%', padding: '20px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #6D28D9 100%)',
          color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.15rem',
          boxShadow: '0 6px 0 rgba(29,78,216,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          letterSpacing: 0.3,
        }}>
        Começar Aventura ⚔️
      </motion.button>
    </motion.div>
  );
}

const GOALS = [
  { label: 'Carreira Policial', sub: 'PF · PC · PM · PRF', emoji: '👮', color: '#3B82F6' },
  { label: 'Tribunais', sub: 'STF · STJ · TJ · TRT', emoji: '⚖️', color: '#A78BFA' },
  { label: 'Área Fiscal', sub: 'SEFAZ · Receita · ICMS', emoji: '💰', color: '#FBBF24' },
  { label: 'Administrativo', sub: 'IBGE · IBAMA · Correios', emoji: '📋', color: '#34D399' },
  { label: 'TI / Tecnologia', sub: 'SERPRO · ANAC · INSS TI', emoji: '💻', color: '#06B6D4' },
  { label: 'Tô perdido(a)', sub: 'Deixa o app guiar você', emoji: '🗺️', color: '#F87171' },
];

function GoalStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.35 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 6, lineHeight: 1.2 }}>Escolha sua classe:</h2>
        <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Cada área tem seus próprios inimigos e questões</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {GOALS.map(g => (
          <motion.button
            key={g.label}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            style={{
              padding: '14px 16px',
              background: '#111827',
              color: 'white', borderRadius: 16, fontWeight: 700, fontSize: '0.97rem',
              border: `1.5px solid rgba(255,255,255,0.06)`,
              textAlign: 'left',
              boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
            <span style={{
              fontSize: '1.6rem',
              width: 48, height: 48,
              borderRadius: 14,
              backgroundColor: `${g.color}18`,
              border: `1.5px solid ${g.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{g.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800 }}>{g.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginTop: 1 }}>{g.sub}</div>
            </div>
            <span style={{ color: '#334155', fontSize: '1rem', flexShrink: 0 }}>›</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

const TIMES = [
  { label: 'Trabalho 6×1', sub: 'Até 2h por dia', emoji: '⏱️', val: 120, color: '#34D399' },
  { label: 'Rotina Normal', sub: 'Entre 2h e 4h', emoji: '⏰', val: 180, color: '#3B82F6' },
  { label: 'Tempo Integral', sub: '4 horas ou mais', emoji: '🔥', val: 300, color: '#EF4444' },
];

function TimeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.35 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8, lineHeight: 1.2 }}>Quanto tempo você tem?</h2>
        <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Sem culpa. O algoritmo vai ajustar sua rota.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
        {TIMES.map(t => (
          <motion.button
            key={t.label}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            style={{
              padding: '20px 20px',
              background: 'linear-gradient(135deg, #111827 0%, #0A0F1E 100%)',
              color: 'white', borderRadius: 18, fontWeight: 700,
              border: `1.5px solid ${t.color}25`,
              textAlign: 'left',
              boxShadow: `0 4px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
            <span style={{
              fontSize: '2rem',
              width: 56, height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${t.color}20, ${t.color}08)`,
              border: `1.5px solid ${t.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{t.emoji}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>{t.label}</div>
              <div style={{ fontSize: '0.82rem', color: t.color, fontWeight: 700, marginTop: 2 }}>{t.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div style={{ height: 16 }} />
    </motion.div>
  );
}

function RevealStep({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setLoading(false); return 100; }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      {loading ? (
        <div style={{ width: '100%', maxWidth: 280 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ fontSize: '4rem', marginBottom: 32 }}>
            <Target size={64} color="#3B82F6" strokeWidth={1.5} />
          </motion.div>
          <p style={{ color: '#64748B', fontWeight: 700, marginBottom: 20, fontSize: '0.95rem' }}>
            Configurando sua jornada...
          </p>
          {/* Progress bar */}
          <div style={{ height: 6, backgroundColor: '#1E293B', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6D28D9)', borderRadius: 999 }}
            />
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#334155', fontWeight: 700 }}>
            {progress < 40 ? 'Analisando perfil...' : progress < 80 ? 'Montando missões...' : 'Quase lá...'}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{ width: '100%' }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            style={{ fontSize: '5rem', marginBottom: 24 }}>⚔️</motion.div>

          <h2 style={{ fontSize: '2rem', marginBottom: 12, fontWeight: 900, lineHeight: 1.2 }}>Herói criado!</h2>
          <p style={{ color: '#64748B', marginBottom: 48, fontWeight: 600, fontSize: '1rem', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 40px' }}>
            Sua missão: derrotar questões, acumular ouro e evoluir. A constância vence a intensidade.
          </p>

          {/* Stats preview */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
            {[{ icon: '⚔️', label: '22 Dano' }, { icon: '❤️', label: '150 HP' }, { icon: '🪙', label: '×1.0 Gold' }].map(s => (
              <div key={s.label} style={{
                padding: '10px 14px', borderRadius: 12,
                backgroundColor: '#111827', border: '1px solid #1E293B',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onFinish}
            style={{
              width: '100%', padding: '20px',
              background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
              color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.15rem',
              boxShadow: '0 6px 0 rgba(21,128,61,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            <Trophy size={22} /> Ir para o Acampamento
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
