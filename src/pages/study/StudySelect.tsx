import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore, ITEM_POOL, EVOLUTION_TABLE } from '../../store/useAppStore';
import type { ConcursoType, RunItem } from '../../store/useAppStore';
import { RARITY_CONFIG, SLOT_CONFIG } from '../../data/cosmeticsDb';
import type { CosmeticSlot } from '../../data/cosmeticsDb';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CONCURSO_OPTIONS: {
  key: ConcursoType; label: string; subtitle: string; emoji: string;
  color: string; gradient: string; enemies: string;
}[] = [
  { key: 'policial',      label: 'Carreira Policial',     subtitle: 'PF · PC · PM · PRF',            emoji: '👮', color: '#3B82F6', gradient: 'linear-gradient(135deg,#1D4ED8,#1E3A5F)', enemies: 'Direito Penal · Processo · Ética' },
  { key: 'tributario',    label: 'Fiscal / Tributária',   subtitle: 'SEFAZ · Receita · ICMS',         emoji: '💰', color: '#FBBF24', gradient: 'linear-gradient(135deg,#78350F,#451A03)', enemies: 'CTN · ICMS · Tributos Federais' },
  { key: 'judiciario',    label: 'Poder Judiciário',      subtitle: 'STF · STJ · TJ · TRT',           emoji: '⚖️', color: '#A78BFA', gradient: 'linear-gradient(135deg,#4C1D95,#2D1B69)', enemies: 'Competências · Processo Civil' },
  { key: 'administrativo',label: 'Administrativo Geral',  subtitle: 'IBGE · IBAMA · Correios',         emoji: '📋', color: '#34D399', gradient: 'linear-gradient(135deg,#064E3B,#022C22)', enemies: 'LIMPE · Servidores · Licitações' },
  { key: 'ti',            label: 'TI e Tecnologia',       subtitle: 'SERPRO · ANAC · BC · INSS',      emoji: '💻', color: '#06B6D4', gradient: 'linear-gradient(135deg,#0E7490,#0C4A6E)', enemies: 'Redes · LGPD · Segurança · SQL' },
  { key: 'mixed',         label: 'Geral — Caótico',       subtitle: 'Treino amplo, qualquer banca',   emoji: '🎲', color: '#F87171', gradient: 'linear-gradient(135deg,#7F1D1D,#450A0A)', enemies: 'Aleatório de todas as áreas' },
];

const BUILD_EMOJI  = { warrior: '⚔️', mage: '🔮', rogue: '🗡️' } as const;
const BUILD_NAME   = { warrior: 'Guerreiro', mage: 'Mago', rogue: 'Ladino' } as const;
const BUILD_COLOR  = { warrior: '#EF4444', mage: '#8B5CF6', rogue: '#22C55E' } as const;

// Section divider
function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 12px' }}>
      <div style={{ flex: 1, height: 1, background: '#1E293B' }} />
      <span style={{ fontSize: '0.68rem', color: '#334155', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#1E293B' }} />
    </div>
  );
}

// ─── Equipment Slot (compact) ─────────────────────────────────────────────────
function EquipSlot({ slot, equippedId, inventory, onTap }: {
  slot: CosmeticSlot;
  equippedId: string | null;
  inventory: ReturnType<typeof useAppStore>['cosmeticInventory'];
  onTap: () => void;
}) {
  const item = equippedId ? inventory.find(i => i.id === equippedId) : null;
  const cfg  = item ? RARITY_CONFIG[item.rarity] : null;
  const slotCfg = SLOT_CONFIG[slot];

  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onTap}
      style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: item ? cfg!.gradient : '#0F172A',
        border: `2px solid ${item ? cfg!.color : '#1E293B'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 1, cursor: 'pointer',
        boxShadow: item ? `0 0 12px ${cfg!.glow}` : 'none',
      }}>
      {item ? (
        <>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{item.emoji}</span>
          <span style={{ fontSize: '0.38rem', color: cfg!.color, fontWeight: 900, textTransform: 'uppercase' }}>{cfg!.label}</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: '1.1rem', opacity: 0.3 }}>{slotCfg.icon}</span>
          <span style={{ fontSize: '0.42rem', color: '#334155', fontWeight: 700 }}>{slotCfg.label}</span>
        </>
      )}
    </motion.button>
  );
}

// ─── Run Item Chip ─────────────────────────────────────────────────────────────
function RunItemChip({ item, evoReady }: { item: RunItem; evoReady: boolean }) {
  const color = evoReady ? '#FBBF24' : item.rarity === 'legendary' ? '#FBBF24' : item.rarity === 'rare' ? '#A78BFA' : '#60A5FA';
  return (
    <motion.div
      animate={evoReady ? { boxShadow: ['0 0 0px #FBBF2400','0 0 10px #FBBF2460','0 0 0px #FBBF2400'] } : {}}
      transition={{ repeat: Infinity, duration: 1.6 }}
      style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '8px 10px', borderRadius: 12, minWidth: 56,
        background: evoReady ? '#2D1500' : '#111827',
        border: `1.5px solid ${evoReady ? '#FBBF24' : color + '40'}`,
      }}>
      <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{item.emoji}</span>
      {/* Level pips */}
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: item.maxLevel }).map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: i < item.level ? color : 'rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
      {evoReady && (
        <motion.span
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 0.9 }}
          style={{ fontSize: '0.45rem', fontWeight: 900, color: '#FBBF24' }}>⚡</motion.span>
      )}
    </motion.div>
  );
}

// ─── Main unified screen ──────────────────────────────────────────────────────
export default function StudySelect() {
  const navigate = useNavigate();
  const {
    selectedConcurso, setConcurso, startRun, player,
    cosmeticInventory, equippedCosmetics,
    runItems, gold,
  } = useAppStore();

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
  const buildColor = BUILD_COLOR[player.build];
  const buildEmoji = BUILD_EMOJI[player.build];
  const buildName  = BUILD_NAME[player.build];

  // Cosmetic bonuses
  const cosBonus = { damage: 0, maxHp: 0 };
  for (const id of Object.values(equippedCosmetics)) {
    if (!id) continue;
    const item = cosmeticInventory.find(i => i.id === id);
    if (!item) continue;
    if (item.statBonus.damage) cosBonus.damage += item.statBonus.damage;
    if (item.statBonus.maxHp)  cosBonus.maxHp  += item.statBonus.maxHp;
  }

  // Evolution readiness for run items
  const evoReadyIds = new Set<string>();
  for (const [key] of Object.entries(EVOLUTION_TABLE)) {
    const [wId, pId] = key.split('+');
    const w = runItems.find(x => x.id === wId);
    const p = runItems.find(x => x.id === pId);
    if (w && w.level >= w.maxLevel && p) {
      evoReadyIds.add(wId); evoReadyIds.add(pId);
    }
  }
  const hasEvoReady = evoReadyIds.size > 0;

  // Synergy hint for an item not owned yet
  function partnerName(item: RunItem): string | null {
    if (item.category === 'weapon' && item.evolvesIntoWith) {
      const p = ITEM_POOL.find(x => x.id === item.evolvesIntoWith);
      return p ? `+ ${p.emoji}` : null;
    }
    if (item.category === 'passive') {
      for (const key of Object.keys(EVOLUTION_TABLE)) {
        const [wId, pId] = key.split('+');
        if (pId === item.id) {
          const w = ITEM_POOL.find(x => x.id === wId);
          return w ? `+ ${w.emoji}` : null;
        }
      }
    }
    return null;
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', paddingBottom: 90 }}>

      {/* ── Sticky Header ──────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg,#1E293B,#0A0F1E)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>⚔️ Arena</h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#1C0A00', border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 10, padding: '4px 10px',
        }}>
          <span style={{ fontSize: '0.85rem' }}>🪙</span>
          <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#FBBF24' }}>{gold}</span>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ══════════════════════════════════════════════════
            HERÓI — character + equipment slots
        ══════════════════════════════════════════════════ */}
        <SectionTitle label="Herói" />

        <div style={{
          background: '#111827', borderRadius: 20, border: `1px solid ${buildColor}20`,
          padding: '16px', position: 'relative', overflow: 'hidden',
          boxShadow: `0 4px 30px ${buildColor}0D`,
        }}>
          {/* Subtle bg glow */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${buildColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Equipment grid: slots | avatar | slots */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 14 }}>

            {/* Left: hat + weapon */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <EquipSlot slot="hat"    equippedId={equippedCosmetics.hat}    inventory={cosmeticInventory} onTap={() => navigate('/hero')} />
              <EquipSlot slot="weapon" equippedId={equippedCosmetics.weapon} inventory={cosmeticInventory} onTap={() => navigate('/hero')} />
            </div>

            {/* Center: avatar */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                style={{ fontSize: '4.5rem', lineHeight: 1, filter: `drop-shadow(0 4px 16px ${buildColor}60)` }}>
                {buildEmoji}
              </motion.div>
              <div style={{ fontSize: '0.65rem', color: buildColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 6 }}>
                {buildName}
              </div>
            </div>

            {/* Right: amulet + armor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              <EquipSlot slot="amulet" equippedId={equippedCosmetics.amulet} inventory={cosmeticInventory} onTap={() => navigate('/hero')} />
              <EquipSlot slot="armor"  equippedId={equippedCosmetics.armor}  inventory={cosmeticInventory} onTap={() => navigate('/hero')} />
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', background: '#0F172A', borderRadius: 12, overflow: 'hidden', marginBottom: 12, border: '1px solid #1E293B' }}>
            {[
              { l: 'Dano',  v: cosBonus.damage > 0 ? `${player.damage}+${cosBonus.damage}` : player.damage, c: '#F87171' },
              { l: 'HP',    v: player.maxHp,                                                                 c: '#34D399' },
              { l: 'Crit',  v: `${Math.round(player.critChance * 100)}%`,                                   c: '#FBBF24' },
              { l: 'Gold',  v: `×${player.goldMultiplier.toFixed(1)}`,                                       c: '#A78BFA' },
            ].map((s, i) => (
              <div key={s.l} style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                borderRight: i < 3 ? '1px solid #1E293B' : 'none',
              }}>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', color: s.c }}>{s.v}</div>
                <div style={{ fontSize: '0.55rem', color: '#334155', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Manage hero button */}
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/hero')}
            style={{
              width: '100%', padding: '10px', borderRadius: 12,
              background: `linear-gradient(135deg, ${buildColor}18, ${buildColor}08)`,
              border: `1px solid ${buildColor}30`,
              color: buildColor, fontWeight: 800, fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
            }}>
            👗 Gerenciar Cosméticos e Aparência →
          </motion.button>
        </div>

        {/* ══════════════════════════════════════════════════
            MOCHILA — run items (VS build)
        ══════════════════════════════════════════════════ */}
        <SectionTitle label="Mochila da Run" />

        {runItems.length === 0 ? (
          <div style={{
            padding: '16px', borderRadius: 16, background: '#0F172A',
            border: '1px dashed #1E293B', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700, lineHeight: 1.6 }}>
              📭 Sem itens ainda<br />
              <span style={{ fontSize: '0.68rem', color: '#1E293B' }}>Derrote inimigos para ganhar itens. A cada 3 kills cai um baú.</span>
            </div>
          </div>
        ) : (
          <div style={{ background: '#111827', borderRadius: 16, border: hasEvoReady ? '1.5px solid rgba(251,191,36,0.4)' : '1px solid #1E293B', overflow: 'hidden' }}>
            {/* Evolution ready banner */}
            {hasEvoReady && (
              <motion.div
                animate={{ opacity: [0.85, 1, 0.85] }} transition={{ repeat: Infinity, duration: 1.2 }}
                style={{
                  padding: '8px 14px', background: 'linear-gradient(90deg,#2D1500,#1A0900)',
                  borderBottom: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                <span style={{ fontSize: '0.75rem' }}>⚡</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FBBF24' }}>EVOLUÇÃO DISPONÍVEL — abra um baú de chefe!</span>
              </motion.div>
            )}

            {/* Items scroll */}
            <div style={{ padding: '12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {runItems.map(item => (
                <RunItemChip key={item.id} item={item} evoReady={evoReadyIds.has(item.id)} />
              ))}
            </div>

            {/* Synergy hints */}
            <div style={{ padding: '0 12px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {runItems.filter(i => partnerName(i)).map(item => {
                const partner = partnerName(item);
                const hasPartner = runItems.find(r => r.id === item.evolvesIntoWith) ||
                  Object.keys(EVOLUTION_TABLE).some(k => { const [wId, pId] = k.split('+'); return pId === item.id && runItems.find(r => r.id === wId); });
                return (
                  <span key={item.id} style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: hasPartner ? '#FBBF24' : '#334155',
                    background: hasPartner ? 'rgba(251,191,36,0.1)' : '#0F172A',
                    border: `1px solid ${hasPartner ? 'rgba(251,191,36,0.3)' : '#1E293B'}`,
                    padding: '3px 8px', borderRadius: 999,
                  }}>
                    {item.emoji} {partner}
                  </span>
                );
              })}
            </div>

            {/* Full items link */}
            <div style={{ borderTop: '1px solid #1E293B', padding: '10px 14px', textAlign: 'right' }}>
              <button onClick={() => navigate('/items')}
                style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
                Ver mochila completa →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CONCURSO selection
        ══════════════════════════════════════════════════ */}
        <SectionTitle label="Área do Concurso" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {CONCURSO_OPTIONS.map(opt => {
            const isSel = selectedConcurso === opt.key;
            return (
              <motion.button key={opt.key} whileTap={{ scale: 0.95 }} onClick={() => setConcurso(opt.key)}
                style={{
                  padding: '12px 10px', borderRadius: 16, textAlign: 'left',
                  background: isSel ? opt.gradient : '#111827',
                  border: `1.5px solid ${isSel ? opt.color : 'rgba(255,255,255,0.05)'}`,
                  color: 'white',
                  boxShadow: isSel ? `0 4px 16px ${opt.color}30` : 'none',
                  transition: 'all 0.2s', position: 'relative', overflow: 'hidden', minHeight: 90,
                  cursor: 'pointer',
                }}>
                {isSel && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 18, height: 18, borderRadius: '50%',
                      background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.62rem',
                    }}>✓</motion.div>
                )}
                <div style={{ fontSize: '1.7rem', marginBottom: 5, lineHeight: 1 }}>{opt.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '0.75rem', lineHeight: 1.3, marginBottom: 3 }}>{opt.label}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: isSel ? `${opt.color}cc` : '#1E293B' }}>{opt.subtitle}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected concurso detail */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedConcurso}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '11px 14px', borderRadius: 14, background: chosen.gradient,
              border: `1.5px solid ${chosen.color}60`, marginBottom: 4,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{chosen.emoji}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>{chosen.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                ⚔️ {chosen.enemies}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════
            CLASSE — start run
        ══════════════════════════════════════════════════ */}
        <SectionTitle label="Escolha a Classe e Batalhe" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { build: 'warrior', emoji: '⚔️', name: 'GUERREIRO', sub: '150HP · 22 Dano · 5% Crit',  color: '#EF4444', desc: 'Tanque. Aguenta erros.' },
            { build: 'mage',    emoji: '🔮', name: 'MAGO',      sub: '80HP · 35 Dano · 12% Crit',  color: '#8B5CF6', desc: 'Mata rápido. Não pode errar.' },
            { build: 'rogue',   emoji: '🗡️', name: 'LADINO',   sub: '100HP · 18 Dano · 25% Crit', color: '#22C55E', desc: '1.5× Ouro. Rei dos crits.' },
          ] as const).map(b => (
            <motion.button key={b.build} whileTap={{ scale: 0.97 }}
              disabled={isStarting} onClick={() => handleStartRun(b.build)}
              style={{
                padding: '14px 16px', borderRadius: 16, textAlign: 'left',
                background: 'linear-gradient(135deg, #111827, #0A0F1E)',
                border: `1.5px solid ${b.color}30`, color: 'white',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 0 rgba(0,0,0,0.4)`,
                opacity: isStarting ? 0.6 : 1, cursor: isStarting ? 'not-allowed' : 'pointer',
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `linear-gradient(135deg, ${b.color}22, ${b.color}08)`,
                border: `1.5px solid ${b.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
              }}>{b.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: b.color }}>{b.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginTop: 2 }}>{b.sub}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: 3 }}>{b.desc}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: isStarting ? '#1E293B' : `${b.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', color: b.color,
              }}>{isStarting ? '⌛' : '▶'}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
