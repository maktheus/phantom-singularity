import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { ConcursoType } from '../../store/useAppStore';
import { RARITY_CONFIG } from '../../data/cosmeticsDb';

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

const BUILD_EMOJI = { warrior: '⚔️', mage: '🔮', rogue: '🗡️' };
const BUILD_NAME  = { warrior: 'Guerreiro', mage: 'Mago', rogue: 'Ladino' };
const BUILD_COLOR = { warrior: '#EF4444', mage: '#8B5CF6', rogue: '#22C55E' };

export default function StudySelect() {
  const navigate = useNavigate();
  const { selectedConcurso, setConcurso, startRun, player, cosmeticInventory, equippedCosmetics, runItems, gold } = useAppStore();
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

  const chosen = CONCURSO_OPTIONS.find(c => c.key === selectedConcurso)!;

  // Equipped cosmetic items for preview
  const equippedItems = Object.values(equippedCosmetics)
    .filter(Boolean)
    .map(id => cosmeticInventory.find(i => i.id === id))
    .filter(Boolean) as typeof cosmeticInventory;

  const buildColor = BUILD_COLOR[player.build];
  const buildEmoji = BUILD_EMOJI[player.build];
  const buildName  = BUILD_NAME[player.build];

  // Cosmetic stat bonuses
  const cosmeticBonus = { damage: 0, maxHp: 0, critChance: 0, goldMultiplier: 0 };
  for (const item of equippedItems) {
    if (item.statBonus.damage)         cosmeticBonus.damage         += item.statBonus.damage;
    if (item.statBonus.maxHp)          cosmeticBonus.maxHp          += item.statBonus.maxHp;
    if (item.statBonus.critChance)     cosmeticBonus.critChance     += item.statBonus.critChance;
    if (item.statBonus.goldMultiplier) cosmeticBonus.goldMultiplier += item.statBonus.goldMultiplier;
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', paddingBottom: 88 }}>

      {/* ── Hero Card ─────────────────────────────────────────── */}
      <div style={{
        padding: '16px 16px 0',
        background: 'linear-gradient(180deg, #1E293B 0%, #0A0F1E 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 16,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: '#111827', borderRadius: 18, padding: '14px 16px',
          border: `1px solid ${buildColor}25`,
          boxShadow: `0 4px 20px ${buildColor}10`,
        }}>
          {/* Avatar + equipped items */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ fontSize: '3.5rem', lineHeight: 1, filter: `drop-shadow(0 4px 12px ${buildColor}50)` }}>
              {buildEmoji}
            </motion.div>
            {/* Equipped item dots */}
            {equippedItems.length > 0 && (
              <div style={{ position: 'absolute', bottom: -4, right: -6, display: 'flex', gap: 2 }}>
                {equippedItems.slice(0, 4).map((item, i) => {
                  const cfg = RARITY_CONFIG[item.rarity];
                  return (
                    <div key={i} style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: cfg.color, fontSize: '0.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(0,0,0,0.5)',
                    }}>
                      {item.emoji[0]}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hero info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontWeight: 900, fontSize: '1rem', color: buildColor }}>{buildName}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#334155', background: '#0A0F1E',
                padding: '2px 6px', borderRadius: 999 }}>
                🪙 {gold}
              </span>
            </div>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { v: player.damage, c: '#F87171', icon: '⚔️' },
                { v: `${player.hp}❤️`, c: '#34D399', icon: '' },
                { v: `${Math.round(player.critChance * 100)}%`, c: '#FBBF24', icon: '🎯' },
              ].map((s, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem', fontWeight: 800, color: s.c,
                  background: `${s.c}14`, padding: '2px 8px', borderRadius: 999,
                  border: `1px solid ${s.c}25`,
                }}>
                  {s.icon && <>{s.icon} </>}{s.v}
                </span>
              ))}
              {/* Cosmetic bonuses */}
              {cosmeticBonus.damage > 0 && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F87171', opacity: 0.7 }}>
                  +{cosmeticBonus.damage}✨
                </span>
              )}
            </div>

            {/* Run items preview */}
            {runItems.length > 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 700 }}>🎒</span>
                {runItems.slice(0, 6).map(item => (
                  <span key={item.id} style={{ fontSize: '0.85rem' }} title={item.name}>{item.emoji}</span>
                ))}
                {runItems.length > 6 && <span style={{ fontSize: '0.6rem', color: '#334155' }}>+{runItems.length - 6}</span>}
              </div>
            )}
          </div>

          {/* Hero management button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate('/hero')}
            style={{
              flexShrink: 0, padding: '8px 10px', borderRadius: 12,
              background: '#0F172A', border: `1px solid ${buildColor}30`,
              color: buildColor, fontWeight: 800, fontSize: '0.7rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer',
            }}>
            👤
            <span style={{ fontSize: '0.55rem' }}>Herói</span>
          </motion.button>
        </div>
      </div>

      <div style={{ padding: '14px 14px 0' }}>

        {/* ── Section: Concurso ────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
          <span style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Área do Concurso
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
        </div>

        {/* Concurso Grid — 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {CONCURSO_OPTIONS.map(opt => {
            const isSelected = selectedConcurso === opt.key;
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConcurso(opt.key)}
                style={{
                  padding: '12px 10px', borderRadius: 16, textAlign: 'left',
                  background: isSelected ? opt.gradient : '#111827',
                  border: `1.5px solid ${isSelected ? opt.color : 'rgba(255,255,255,0.05)'}`,
                  color: 'white',
                  boxShadow: isSelected ? `0 4px 20px ${opt.color}30` : '0 2px 0 rgba(0,0,0,0.4)',
                  transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                  minHeight: 96,
                }}>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 18, height: 18, borderRadius: '50%',
                      backgroundColor: opt.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem',
                    }}>✓</motion.div>
                )}
                <div style={{ fontSize: '1.8rem', marginBottom: 6, lineHeight: 1 }}>{opt.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '0.78rem', lineHeight: 1.3, marginBottom: 3 }}>{opt.label}</div>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, lineHeight: 1.3,
                  color: isSelected ? `${opt.color}cc` : '#334155',
                }}>{opt.subtitle}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected detail banner */}
        <motion.div
          key={selectedConcurso}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '12px 16px', borderRadius: 14,
            background: chosen.gradient,
            border: `1.5px solid ${chosen.color}60`,
            marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `0 4px 16px ${chosen.color}20`,
          }}>
          <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{chosen.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{chosen.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
              ⚔️ {chosen.enemies}
            </div>
          </div>
        </motion.div>

        {/* ── Section: Classe ──────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
          <span style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Escolha a Classe
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1E293B' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { build: 'warrior', emoji: '⚔️', name: 'GUERREIRO', sub: '150HP · 22 Dmg · 5% Crit',  color: '#EF4444', desc: 'Tanque. Sobrevive a erros.' },
            { build: 'mage',    emoji: '🔮', name: 'MAGO',      sub: '80HP · 35 Dmg · 12% Crit',  color: '#8B5CF6', desc: 'Mata rápido. Não pode errar.' },
            { build: 'rogue',   emoji: '🗡️', name: 'LADINO',   sub: '100HP · 18 Dmg · 25% Crit', color: '#22C55E', desc: '1.5× Ouro. Campeão de crits.' },
          ] as const).map(b => (
            <motion.button
              key={b.build}
              whileTap={{ scale: 0.97 }}
              disabled={isStarting}
              onClick={() => handleStartRun(b.build)}
              style={{
                padding: '14px 16px', borderRadius: 16,
                background: `linear-gradient(135deg, #111827, #0A0F1E)`,
                border: `1.5px solid ${b.color}30`,
                color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 0 rgba(0,0,0,0.4)`,
                opacity: isStarting ? 0.6 : 1,
                cursor: isStarting ? 'not-allowed' : 'pointer',
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`,
                border: `1.5px solid ${b.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.7rem',
              }}>{b.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: b.color }}>{b.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{b.sub}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: 3 }}>{b.desc}</div>
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
          marginTop: 14, padding: '12px 16px',
          background: '#111827', borderRadius: 14, border: '1px solid #1E293B',
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
              <div style={{ fontSize: '0.85rem', marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '0.88rem', color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '0.56rem', color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
