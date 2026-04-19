import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { ConcursoType } from '../../store/useAppStore';

const CONCURSO_OPTIONS: {
  key: ConcursoType; label: string; subtitle: string; emoji: string;
  color: string; gradient: string; enemies: string;
}[] = [
  {
    key: 'policial', label: 'Carreira Policial', subtitle: 'PF · PC · PM · PRF',
    emoji: '👮', color: '#3B82F6', gradient: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A5F 100%)',
    enemies: 'Pegadinha da Banca · Uso da Força · Ética'
  },
  {
    key: 'tributario', label: 'Área Fiscal / Tributária', subtitle: 'SEFAZ · Receita Federal · ICMS',
    emoji: '💰', color: '#FBBF24', gradient: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
    enemies: 'CTN · Princípios · ICMS · ISS'
  },
  {
    key: 'judiciario', label: 'Poder Judiciário', subtitle: 'STF · STJ · TJ · TRT',
    emoji: '⚖️', color: '#A78BFA', gradient: 'linear-gradient(135deg, #4C1D95 0%, #2D1B69 100%)',
    enemies: 'Competências · Processo · Mandado'
  },
  {
    key: 'administrativo', label: 'Administrativo Geral', subtitle: 'IBGE · IBAMA · Correios + mais',
    emoji: '📋', color: '#34D399', gradient: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
    enemies: 'LIMPE · Servidores · Licitações'
  },
  {
    key: 'ti', label: 'TI e Tecnologia', subtitle: 'ANAC · SERPRO · Banco Central · INSS TI',
    emoji: '💻', color: '#06B6D4', gradient: 'linear-gradient(135deg, #0E7490 0%, #0C4A6E 100%)',
    enemies: 'Redes · LGPD · Segurança · SQL'
  },
  {
    key: 'mixed', label: 'Geral — Mistura Caótica', subtitle: 'Treino amplo pra qualquer banca',
    emoji: '🎲', color: '#F87171', gradient: 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)',
    enemies: 'Aleatório de todas as áreas'
  },
];

export default function StudySelect() {
  const navigate = useNavigate();
  const { selectedConcurso, setConcurso, startRun, player } = useAppStore();

  const [isStarting, setIsStarting] = useState(false);

  const handleStartRun = async (build: 'warrior' | 'mage' | 'rogue') => {
    setIsStarting(true);
    try {
      await startRun(build, selectedConcurso);
      navigate('/study');
    } finally {
      setIsStarting(false);
    }
  };

  // Which concurso is already selected
  const chosen = CONCURSO_OPTIONS.find(c => c.key === selectedConcurso)!;

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', paddingBottom: 88 }}>

      {/* Header */}
      <div style={{
        padding: '20px 20px 14px',
        background: 'linear-gradient(180deg, #1E293B 0%, #0A0F1E 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: 3 }}>📚 Escolha seu Concurso</h1>
        <p style={{ color: '#334155', fontWeight: 700, fontSize: '0.82rem' }}>
          O tipo muda os inimigos e questões da run
        </p>
      </div>

      <div style={{ padding: '14px 14px 0' }}>
        {/* Concurso Grid — 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {CONCURSO_OPTIONS.map(opt => {
            const isSelected = selectedConcurso === opt.key;
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConcurso(opt.key)}
                style={{
                  padding: '14px 12px', borderRadius: 18, textAlign: 'left',
                  background: isSelected ? opt.gradient : '#111827',
                  border: `1.5px solid ${isSelected ? opt.color : 'rgba(255,255,255,0.05)'}`,
                  color: 'white',
                  boxShadow: isSelected ? `0 4px 24px ${opt.color}30` : '0 2px 0 rgba(0,0,0,0.4)',
                  transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                  minHeight: 110,
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: 10, right: 10,
                      width: 20, height: 20, borderRadius: '50%',
                      backgroundColor: opt.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}>✓</motion.div>
                )}
                <div style={{ fontSize: '2rem', marginBottom: 8, lineHeight: 1 }}>{opt.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '0.82rem', lineHeight: 1.3, marginBottom: 4 }}>{opt.label}</div>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.3,
                  color: isSelected ? `${opt.color}cc` : '#334155',
                }}>{opt.subtitle}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected detail banner */}
        <motion.div
          key={selectedConcurso}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 18px', borderRadius: 16,
            background: chosen.gradient,
            border: `1.5px solid ${chosen.color}60`,
            marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: `0 4px 20px ${chosen.color}20`,
          }}>
          <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{chosen.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: '1rem' }}>{chosen.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginTop: 2 }}>
              ⚔️ {chosen.enemies}
            </div>
          </div>
        </motion.div>

        {/* Divider + Build section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
          <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Escolha a Classe
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { build: 'warrior', emoji: '⚔️', name: 'GUERREIRO', sub: '150HP · 22 Dmg · 5% Crit', color: '#EF4444', desc: 'Tanque. Sobrevive a erros.' },
            { build: 'mage',    emoji: '🔮', name: 'MAGO',      sub: '80HP · 35 Dmg · 12% Crit',  color: '#8B5CF6', desc: 'Mata rápido. Não pode errar.' },
            { build: 'rogue',   emoji: '🗡️', name: 'LADINO',   sub: '100HP · 18 Dmg · 25% Crit', color: '#22C55E', desc: '1.5× Ouro. Campeão de crits.' },
          ] as const).map(b => (
            <motion.button
              key={b.build}
              whileTap={{ scale: 0.97 }}
              disabled={isStarting}
              onClick={() => handleStartRun(b.build)}
              style={{
                padding: '16px 18px', borderRadius: 16,
                background: `linear-gradient(135deg, #111827, #0A0F1E)`,
                border: `1.5px solid ${b.color}30`,
                color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`,
                opacity: isStarting ? 0.6 : 1,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`,
                border: `1.5px solid ${b.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem',
              }}>{b.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: b.color }}>{b.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{b.sub}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginTop: 4 }}>{b.desc}</div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: isStarting ? '#1E293B' : `${b.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', color: b.color,
              }}>{isStarting ? '⌛' : '▶'}</div>
            </motion.button>
          ))}
        </div>

        {/* Stat bar */}
        <div style={{
          marginTop: 16, padding: '12px 16px',
          background: 'linear-gradient(135deg, #111827, #0A0F1E)',
          borderRadius: 14, border: '1px solid #1E293B',
          display: 'flex', gap: 0,
        }}>
          {[
            { l: 'Dano', v: player.damage, c: '#F87171', icon: '⚔️' },
            { l: 'HP',   v: player.maxHp,  c: '#34D399', icon: '❤️' },
            { l: 'Crit', v: `${Math.round(player.critChance * 100)}%`, c: '#FBBF24', icon: '🎯' },
            { l: 'Gold', v: `×${player.goldMultiplier.toFixed(1)}`, c: '#A78BFA', icon: '🪙' },
          ].map((s, i) => (
            <div key={s.l} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 3 ? '1px solid #1E293B' : 'none',
            }}>
              <div style={{ fontSize: '0.9rem', marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '0.58rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
