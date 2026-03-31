import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Zap } from 'lucide-react';

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const nextStep = () => setStep(s => s + 1);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', color: 'white' }}>
      <AnimatePresence mode="wait">
        {step === 0 && <WelcomeStep key="s0" onNext={nextStep} />}
        {step === 1 && <GoalStep key="s1" onNext={nextStep} />}
        {step === 2 && <TimeStep key="s2" onNext={nextStep} />}
        {step === 3 && <RevealStep key="s3" onFinish={() => navigate('/home')} />}
      </AnimatePresence>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      <div style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#3B82F6', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, boxShadow: '0 6px 0 #1D4ED8' }}>
        <Zap color="white" size={40} />
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: 12, fontWeight: 900 }}>Pare de estudar no escuro.</h1>
      <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: 40 }}>Derrote questões. Ganhe ouro. Evolua.</p>
      <button onClick={onNext} style={{ width: '100%', padding: '18px', backgroundColor: '#3B82F6', color: 'white', borderRadius: 16, fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 6px 0 #1D4ED8' }}>
        Começar Aventura ⚔️
      </button>
    </motion.div>
  );
}

function GoalStep({ onNext }: { onNext: () => void }) {
  const goals = ['Carreira Policial ⚔️', 'Tribunais ⚖️', 'Área Fiscal 💰', 'Administrativo 📋', 'TI 💻', 'Tô perdido(a) 🗺️'];
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 24 }}
    >
      <h2 style={{ fontSize: '1.8rem', marginTop: 40, marginBottom: 24, textAlign: 'center', fontWeight: 900 }}>Escolha sua classe:</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.map(g => (
          <button key={g} onClick={onNext}
            style={{ padding: '18px 20px', backgroundColor: '#1E293B', color: 'white', borderRadius: 16, fontWeight: 700, fontSize: '1.1rem', border: '2px solid #334155', textAlign: 'left', boxShadow: '0 4px 0 #0F172A' }}>
            {g}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function TimeStep({ onNext }: { onNext: () => void }) {
  const times = [
    { label: '⏱️ Trabalho 6x1 (até 2h/dia)', val: 120 },
    { label: '⏰ Rotina Normal (2h a 4h)', val: 180 },
    { label: '🔥 Tempo Integral (4h+)', val: 300 }
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <h2 style={{ fontSize: '1.8rem', marginTop: 40, marginBottom: 8, textAlign: 'center', fontWeight: 900 }}>Quanto tempo real você tem?</h2>
      <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: 24, fontWeight: 700 }}>Sem culpa. O algoritmo ajustará sua rota.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {times.map(t => (
          <button key={t.label} onClick={onNext}
            style={{ padding: '18px 20px', backgroundColor: '#1E293B', color: 'white', borderRadius: 16, fontWeight: 700, fontSize: '1.05rem', border: '2px solid #334155', textAlign: 'left', boxShadow: '0 4px 0 #0F172A' }}>
            {t.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function RevealStep({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
          <Target size={64} color="#3B82F6" />
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <div style={{ fontSize: '5rem', marginBottom: 24 }}>⚔️</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 12, fontWeight: 900 }}>Herói criado!</h2>
          <p style={{ color: '#94A3B8', marginBottom: 32, fontWeight: 600, fontSize: '1.1rem' }}>
            Sua missão: derrotar questões, acumular ouro e evoluir seu personagem. A constância vence a intensidade.
          </p>
          <button onClick={onFinish}
            style={{ width: '100%', padding: '18px', backgroundColor: '#22C55E', color: 'white', borderRadius: 16, fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 6px 0 #15803D' }}>
            Ir para o Acampamento 🏕️
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
