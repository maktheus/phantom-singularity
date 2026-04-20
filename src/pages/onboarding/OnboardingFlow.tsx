/**
 * Onboarding redesign — principles applied:
 * 1. Sell outcomes, not features (video 0:52)
 * 2. Personalize during flow → show what it unlocked (video 3:48)
 * 3. AHA moment: let them "feel" the product before finishing (video 1:52)
 * 4. Freemium reveal at right moment, after they're hooked (video 4:56)
 * 5. Human / conversational copy (video 2:13)
 * 6. Long but feels short via animation + progress (video 5:44)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target, Trophy, Crown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ConcursoType } from '../../store/useAppStore';

const TOTAL_STEPS = 5;

// ─── Progress bar (linear, feels like momentum) ───────────────────────────────
function ProgressBar({ current }: { current: number }) {
  const pct = Math.round(((current + 1) / TOTAL_STEPS) * 100);
  return (
    <div style={{ height: 3, backgroundColor: '#1E293B', borderRadius: 999, marginBottom: 0, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6D28D9)', borderRadius: 999 }}
      />
    </div>
  );
}

// ─── Shared slide wrapper ─────────────────────────────────────────────────────
function Slide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </motion.div>
  );
}

// ─── STEP 0: Hook — sell the outcome ─────────────────────────────────────────
function HookStep({ onNext }: { onNext: () => void }) {
  return (
    <Slide>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8px' }}>

        {/* Animated battle preview */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{
              width: 110, height: 110, borderRadius: 32,
              background: 'linear-gradient(135deg, #3B82F6 0%, #6D28D9 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 60px rgba(59,130,246,0.45), 0 10px 0 rgba(29,78,216,0.8)',
              fontSize: '3.8rem',
            }}>
            ⚔️
          </motion.div>
          {/* Orbit particles */}
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3 + i, ease: 'linear' }}
              style={{ position: 'absolute', inset: -20, pointerEvents: 'none' }}>
              <motion.div style={{
                position: 'absolute', top: '50%', left: 0,
                width: 8, height: 8, borderRadius: '50%',
                background: ['#3B82F6', '#A855F7', '#22C55E'][i],
                transform: `translateY(-50%) translateX(${-4 + i * 2}px)`,
                boxShadow: `0 0 8px ${['#3B82F6', '#A855F7', '#22C55E'][i]}`,
              }} />
            </motion.div>
          ))}
        </div>

        {/* Headline — outcome, not feature */}
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 14 }}>
          Passe no concurso<br />
          <span style={{ background: 'linear-gradient(90deg,#3B82F6,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            jogando RPG.
          </span>
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, maxWidth: 290, fontWeight: 600, marginBottom: 28 }}>
          Derrote questões reais de concursos. Acumule experiência. Suba de nível enquanto estuda.
        </p>

        {/* Social proof */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 999, marginBottom: 32,
        }}>
          <div style={{ display: 'flex' }}>
            {['👨‍💼','👩‍💻','🧑‍⚖️','👮‍♀️'].map((e, i) => (
              <span key={i} style={{ fontSize: '1.1rem', marginLeft: i > 0 ? -6 : 0, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>{e}</span>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 800 }}>
            +12.400 concurseiros estudando
          </span>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['⚔️ RPG de Questões Reais', '🏆 Ranking Nacional', '🎁 Sistema de Itens'].map(f => (
            <span key={f} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
              backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93C5FD',
            }}>{f}</span>
          ))}
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={onNext}
        style={{
          width: '100%', padding: '20px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #6D28D9 100%)',
          color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.15rem',
          boxShadow: '0 6px 0 rgba(29,78,216,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
        Quero passar no concurso <ChevronRight size={20} />
      </motion.button>
    </Slide>
  );
}

// ─── STEP 1: Goal — multi-intent, feels like "mine" ──────────────────────────
const GOALS: { key: ConcursoType; label: string; sub: string; emoji: string; color: string; outcome: string }[] = [
  { key: 'policial',      label: 'Carreira Policial',      sub: 'PF · PC · PM · PRF', emoji: '👮', color: '#3B82F6', outcome: 'questões de Direito Penal e Processo Penal' },
  { key: 'judiciario',    label: 'Poder Judiciário',        sub: 'STF · STJ · TJ · TRT', emoji: '⚖️', color: '#A78BFA', outcome: 'questões de Direito Constitucional e Processual' },
  { key: 'tributario',    label: 'Área Fiscal',             sub: 'SEFAZ · Receita · ICMS', emoji: '💰', color: '#FBBF24', outcome: 'questões de CTN, ICMS e tributos federais' },
  { key: 'administrativo',label: 'Administrativo Geral',    sub: 'IBGE · IBAMA · Correios', emoji: '📋', color: '#34D399', outcome: 'questões de LIMPE, Licitações e Servidores' },
  { key: 'ti',            label: 'TI e Tecnologia',         sub: 'SERPRO · ANAC · BC · INSS', emoji: '💻', color: '#06B6D4', outcome: 'questões de Redes, LGPD e Segurança da Informação' },
  { key: 'mixed',         label: 'Ainda não sei',           sub: 'Me ajuda a descobrir',   emoji: '🗺️', color: '#F87171', outcome: 'questões variadas de todas as áreas' },
];

function GoalStep({ onNext }: { onNext: (goal: ConcursoType) => void }) {
  const [selected, setSelected] = useState<ConcursoType | null>(null);

  return (
    <Slide>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: 6, lineHeight: 1.2 }}>Qual é sua batalha final?</h2>
        <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.5 }}>
          Cada área tem seus próprios inimigos, questões e estratégias.
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
        {GOALS.map(g => {
          const isSel = selected === g.key;
          return (
            <motion.button key={g.key} whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(g.key)}
              style={{
                padding: '13px 16px', borderRadius: 16, textAlign: 'left',
                background: isSel ? `linear-gradient(135deg, ${g.color}22, ${g.color}08)` : '#111827',
                border: `1.5px solid ${isSel ? g.color : 'rgba(255,255,255,0.05)'}`,
                color: 'white', display: 'flex', alignItems: 'center', gap: 13,
                boxShadow: isSel ? `0 0 20px ${g.color}22` : '0 2px 0 rgba(0,0,0,0.4)',
                transition: 'all 0.15s',
              }}>
              <span style={{
                fontSize: '1.6rem', width: 46, height: 46, borderRadius: 13,
                backgroundColor: `${g.color}18`, border: `1.5px solid ${g.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{g.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isSel ? g.color : '#E2E8F0' }}>{g.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, marginTop: 1 }}>{g.sub}</div>
              </div>
              <motion.div animate={{ scale: isSel ? 1 : 0 }} transition={{ type: 'spring', stiffness: 400 }}
                style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', flexShrink: 0 }}>
                ✓
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <div style={{ height: 14 }} />
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => selected && onNext(selected)}
        animate={{ opacity: selected ? 1 : 0.4 }}
        style={{
          width: '100%', padding: '18px',
          background: selected ? 'linear-gradient(135deg, #3B82F6, #6D28D9)' : '#1E293B',
          color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.1rem',
          boxShadow: selected ? '0 6px 0 rgba(29,78,216,0.8)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        Essa é minha batalha <ChevronRight size={18} />
      </motion.button>
    </Slide>
  );
}

// ─── STEP 2: Time — conversational ───────────────────────────────────────────
const TIMES = [
  { val: 'light',  label: 'Correndo contra o tempo', sub: 'Até 30 min por dia',  emoji: '⏱️', color: '#34D399', outcome: 5 },
  { val: 'normal', label: 'Rotina equilibrada',       sub: 'Entre 30 min e 2h',  emoji: '⏰', color: '#3B82F6', outcome: 12 },
  { val: 'heavy',  label: 'Foco total no concurso',   sub: '2h ou mais por dia', emoji: '🔥', color: '#EF4444', outcome: 25 },
];

function TimeStep({ onNext }: { onNext: (questionsPerDay: number) => void }) {
  return (
    <Slide>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: 6, lineHeight: 1.2 }}>Quanto tempo você tem?</h2>
        <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.5 }}>
          Sem culpa. O algoritmo ajusta sua rota de acordo com você.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1, justifyContent: 'center' }}>
        {TIMES.map(t => (
          <motion.button key={t.val} whileTap={{ scale: 0.97 }}
            onClick={() => onNext(t.outcome)}
            style={{
              padding: '20px', borderRadius: 18, textAlign: 'left',
              background: 'linear-gradient(135deg, #111827, #0A0F1E)',
              border: `1.5px solid ${t.color}25`, color: 'white',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: `0 4px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}>
            <span style={{
              fontSize: '2rem', width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(135deg, ${t.color}20, ${t.color}08)`,
              border: `1.5px solid ${t.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{t.emoji}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem' }}>{t.label}</div>
              <div style={{ fontSize: '0.8rem', color: t.color, fontWeight: 700, marginTop: 2 }}>{t.sub}</div>
            </div>
            <ChevronRight size={18} color="#334155" style={{ marginLeft: 'auto', flexShrink: 0 }} />
          </motion.button>
        ))}
      </div>
    </Slide>
  );
}

// ─── STEP 3: Plan reveal — show what their answers unlocked ──────────────────
function PlanRevealStep({ goal, questionsPerDay, onNext }: {
  goal: ConcursoType; questionsPerDay: number; onNext: () => void;
}) {
  const goalInfo = GOALS.find(g => g.key === goal) ?? GOALS[0];
  const monthly = questionsPerDay * 30;
  const accuracy30 = 62; // average starting accuracy for new users
  const projectedLvl = Math.floor(monthly / 15);

  return (
    <Slide>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
            ✦ Seu plano está pronto
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
            Em 30 dias, você<br />
            <span style={{ color: goalInfo.color }}>dominará {goalInfo.emoji}</span>
          </h2>
          <p style={{ color: '#475569', fontWeight: 700, fontSize: '0.88rem', marginBottom: 20 }}>
            Baseado nas suas respostas, simulamos sua evolução:
          </p>
        </motion.div>

        {/* Projection cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { delay: 0.15, icon: '📚', label: `${monthly} questões respondidas`, sub: 'Em 30 dias de treino', color: '#60A5FA' },
            { delay: 0.25, icon: '🏆', label: `Nível ${projectedLvl} alcançado`, sub: 'Subindo de patamar', color: '#FBBF24' },
            { delay: 0.35, icon: '🎯', label: `~${accuracy30}% de acertos`, sub: 'Média de quem começa hoje', color: '#34D399' },
          ].map(c => (
            <motion.div key={c.label}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: c.delay, type: 'spring', stiffness: 200 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
                background: '#111827', borderRadius: 14, border: `1px solid ${c.color}20`,
              }}>
              <span style={{
                fontSize: '1.6rem', width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `${c.color}15`, border: `1px solid ${c.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: c.color }}>{c.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginTop: 1 }}>{c.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* First enemy preview */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: '14px 16px', borderRadius: 16,
            background: 'linear-gradient(135deg, #1A0505, #2D0A0A)',
            border: '1px solid #7F1D1D',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ fontSize: '2.5rem', flexShrink: 0 }}>🐛</motion.div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#FCA5A5' }}>Primeiro inimigo: Questão Fácil</div>
            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginTop: 1 }}>
              Tópico: {goalInfo.outcome}
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#7F1D1D', fontWeight: 800, background: '#450A0A', padding: '3px 8px', borderRadius: 6 }}>
            HP: 30
          </span>
        </motion.div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={onNext}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{
          width: '100%', padding: '20px',
          background: `linear-gradient(135deg, ${goalInfo.color}, ${goalInfo.color}99)`,
          color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.1rem',
          boxShadow: `0 6px 0 ${goalInfo.color}88`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
        <Target size={20} /> Aceito o desafio!
      </motion.button>
    </Slide>
  );
}

// ─── STEP 4: Finish — hero + freemium reveal ──────────────────────────────────
function FinishStep({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); setPhase('done'); return 100; }
        return p + 5;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <Slide>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {phase === 'loading' ? (
          <div style={{ width: '100%', maxWidth: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
              <Target size={60} color="#3B82F6" strokeWidth={1.5} />
            </motion.div>
            <p style={{ color: '#475569', fontWeight: 700, margin: '24px 0 16px', fontSize: '0.95rem' }}>
              {progress < 40 ? 'Analisando seu perfil...' : progress < 75 ? 'Gerando seu first boss...' : 'Quase lá...'}
            </p>
            <div style={{ height: 6, backgroundColor: '#1E293B', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${progress}%` }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6D28D9)', borderRadius: 999 }} />
            </div>
          </div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ width: '100%' }}>

            <motion.div animate={{ y: [0,-12,0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ fontSize: '5.5rem', marginBottom: 16 }}>⚔️</motion.div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>Herói criado!</h2>
            <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 24px' }}>
              Sua jornada começa com <strong style={{ color: '#E2E8F0' }}>3 batalhas por dia</strong>.<br />
              Acumule ouro, evolua e vença o concurso.
            </p>

            {/* Hero stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' }}>
              {[{ icon: '⚔️', label: '22 Dano' }, { icon: '❤️', label: '150 HP' }, { icon: '🪙', label: '×1.0 Ouro' }].map(s => (
                <div key={s.label} style={{
                  padding: '10px 14px', borderRadius: 12,
                  backgroundColor: '#111827', border: '1px solid #1E293B', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Freemium plans */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              {/* Free */}
              <div style={{
                flex: 1, padding: '14px 12px', borderRadius: 14,
                background: '#0F172A', border: '1px solid #1E293B', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>🆓</div>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', marginBottom: 4 }}>Grátis</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, lineHeight: 1.5 }}>
                  3 runs/dia<br />Itens comuns<br />Ranking geral
                </div>
                <div style={{ marginTop: 8, fontSize: '0.78rem', fontWeight: 900, color: '#22C55E' }}>Agora</div>
              </div>
              {/* PRO */}
              <div style={{
                flex: 1, padding: '14px 12px', borderRadius: 14,
                background: 'linear-gradient(135deg, #78350F, #451A03)',
                border: '1.5px solid #D97706', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <motion.div animate={{ x: ['-100%','200%'] }} transition={{ repeat: Infinity, duration: 2.5 }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)', pointerEvents: 'none' }} />
                <Crown size={18} color="#FBBF24" style={{ marginBottom: 4 }} />
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#FDE68A', marginBottom: 4 }}>PRO</div>
                <div style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700, lineHeight: 1.5 }}>
                  Ilimitado<br />Épicos garantidos<br />Streak freeze
                </div>
                <div style={{ marginTop: 8, fontSize: '0.72rem', fontWeight: 900, color: '#FBBF24' }}>R$19,90/mês</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {phase === 'done' && (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onFinish}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            width: '100%', padding: '20px',
            background: 'linear-gradient(135deg, #22C55E, #15803D)',
            color: 'white', borderRadius: 18, fontWeight: 900, fontSize: '1.15rem',
            boxShadow: '0 6px 0 rgba(21,128,61,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
          <Trophy size={22} /> Começar Aventura
        </motion.button>
      )}
    </Slide>
  );
}

// ─── Main flow ────────────────────────────────────────────────────────────────
export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<ConcursoType>('mixed');
  const [questionsPerDay, setQuestionsPerDay] = useState(12);
  const navigate = useNavigate();
  const { setHasOnboarded, setConcurso } = useAppStore(s => ({ setHasOnboarded: s.setHasOnboarded, setConcurso: s.setConcurso }));

  const handleGoal = (goal: ConcursoType) => { setSelectedGoal(goal); setConcurso(goal); setStep(2); };
  const handleTime = (qpd: number) => { setQuestionsPerDay(qpd); setStep(3); };
  const handleFinish = () => { setHasOnboarded(); navigate('/home'); };

  return (
    <div style={{
      padding: 0, minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      backgroundColor: '#0A0F1E', color: 'white',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 65%)',
    }}>
      {/* Progress bar */}
      <ProgressBar current={step} />

      {/* Step counter + skip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <span style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 800 }}>
          {step + 1} de {TOTAL_STEPS}
        </span>
        {step < 3 && (
          <button onClick={handleFinish}
            style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 800, padding: '4px 8px', borderRadius: 8 }}>
            Pular →
          </button>
        )}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 24px', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {step === 0 && <HookStep key="s0" onNext={() => setStep(1)} />}
          {step === 1 && <GoalStep key="s1" onNext={handleGoal} />}
          {step === 2 && <TimeStep key="s2" onNext={handleTime} />}
          {step === 3 && <PlanRevealStep key="s3" goal={selectedGoal} questionsPerDay={questionsPerDay} onNext={() => setStep(4)} />}
          {step === 4 && <FinishStep key="s4" onFinish={handleFinish} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
