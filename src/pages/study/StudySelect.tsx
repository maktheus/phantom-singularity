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
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', backgroundColor: '#1E293B', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: 4 }}>📚 Escolha seu Concurso</h1>
        <p style={{ color: '#64748B', fontWeight: 700, fontSize: '0.88rem' }}>
          O tipo muda os inimigos e questões da run
        </p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Concurso Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {CONCURSO_OPTIONS.map(opt => {
            const isSelected = selectedConcurso === opt.key;
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConcurso(opt.key)}
                style={{
                  padding: '16px 14px', borderRadius: 16, textAlign: 'left',
                  background: isSelected ? opt.gradient : '#1E293B',
                  border: `2px solid ${isSelected ? opt.color : '#334155'}`,
                  color: 'white',
                  boxShadow: isSelected ? `0 4px 20px ${opt.color}40, 0 6px 0 ${opt.color}30` : '0 3px 0 #0F172A',
                  transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 10, height: 10,
                    backgroundColor: opt.color, borderRadius: '50%',
                    boxShadow: `0 0 8px ${opt.color}` }} />
                )}
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{opt.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', lineHeight: 1.3 }}>{opt.label}</div>
                <div style={{ fontSize: '0.7rem', color: isSelected ? `${opt.color}dd` : '#64748B',
                  fontWeight: 700, marginTop: 4 }}>{opt.subtitle}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected detail card */}
        <motion.div
          key={selectedConcurso}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '16px 20px', borderRadius: 16, background: chosen.gradient,
            border: `2px solid ${chosen.color}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: '2.5rem' }}>{chosen.emoji}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{chosen.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>{chosen.enemies}</div>
            </div>
          </div>
        </motion.div>

        {/* Build Selection */}
        <h2 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 4 }}>Escolha sua Classe</h2>
        <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700, marginBottom: 14 }}>
          Cada run reseta. Upgrades permanentes continuam.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { build: 'warrior', emoji: '⚔️', name: 'GUERREIRO', sub: '150HP · 22 Dmg · 5% Crit', color: '#EF4444', desc: 'Tanque. Sobrevive a erros.' },
            { build: 'mage',    emoji: '🔮', name: 'MAGO',      sub: '80HP · 35 Dmg · 12% Crit',  color: '#8B5CF6', desc: 'Mata rápido. Não pode errar.' },
            { build: 'rogue',   emoji: '🗡️', name: 'LADINO',   sub: '100HP · 18 Dmg · 25% Crit', color: '#22C55E', desc: '1.5x Ouro. Campeão de crits.' },
          ] as const).map(b => (
            <motion.button
              key={b.build}
              whileTap={{ scale: 0.97 }}
              disabled={isStarting}
              onClick={() => handleStartRun(b.build)}
              style={{
                padding: '16px 20px', borderRadius: 14, backgroundColor: '#1E293B',
                border: `2px solid ${b.color}40`, color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: `0 4px 0 #0F172A`,
                opacity: isStarting ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: '2.8rem', flexShrink: 0 }}>{b.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: '1rem', color: b.color }}>{b.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{b.sub}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>{b.desc}</div>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{isStarting ? '⌛' : '▶'}</span>
            </motion.button>
          ))}
        </div>

        {/* Current player stats mini */}
        <div style={{ marginTop: 20, padding: '12px 16px', backgroundColor: '#1E293B', borderRadius: 12, border: '1px solid #334155', display: 'flex', gap: 12 }}>
          {[
            { l: 'Dano', v: player.damage, c: '#F87171' },
            { l: 'HP',   v: player.maxHp,  c: '#34D399' },
            { l: 'Crit', v: `${Math.round(player.critChance * 100)}%`, c: '#FBBF24' },
            { l: 'Gold', v: `x${player.goldMultiplier.toFixed(1)}`,    c: '#A78BFA' },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 700 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
