import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, ITEM_POOL, EVOLUTION_TABLE } from '../../store/useAppStore';
import type { RunItem } from '../../store/useAppStore';

const RARITY_COLOR = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
const RARITY_BG    = { common: '#0F2040', rare: '#2D1B69', legendary: '#2D1500' };
const RARITY_LABEL = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

// ─── Evolution readiness helpers ─────────────────────────────────────────────
function getEvolutionReadiness(runItems: RunItem[]) {
  const ready: { key: string; weaponId: string; passiveId: string; evoId: string }[] = [];
  const possible: { key: string; weaponId: string; passiveId: string; evoId: string }[] = [];

  for (const [key, evoId] of Object.entries(EVOLUTION_TABLE)) {
    const [wId, pId] = key.split('+');
    const weapon  = runItems.find(x => x.id === wId);
    const passive = runItems.find(x => x.id === pId);
    const entry = { key, weaponId: wId, passiveId: pId, evoId };

    if (weapon && weapon.level >= weapon.maxLevel && passive) {
      ready.push(entry);
    } else if (weapon || passive) {
      possible.push(entry);
    }
  }
  return { ready, possible };
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, partnerItem, evolutionReady, evolutionPossible }: {
  item: RunItem;
  partnerItem: RunItem | null;
  evolutionReady: boolean;
  evolutionPossible: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isFull  = item.level >= item.maxLevel;
  const color   = RARITY_COLOR[item.rarity];
  const bg      = RARITY_BG[item.rarity];
  const evoItem = evolutionReady && item.category === 'weapon'
    ? (() => {
        const key = Object.keys(EVOLUTION_TABLE).find(k => k.startsWith(item.id + '+'));
        return key ? ITEM_POOL.find(x => x.id === EVOLUTION_TABLE[key]) : null;
      })()
    : null;

  const glowColor = evolutionReady ? '#FBBF24' : color;

  return (
    <motion.div
      layout
      animate={evolutionReady ? {
        boxShadow: ['0 0 0px #FBBF2400', '0 0 24px #FBBF2480', '0 0 0px #FBBF2400'],
      } : {}}
      transition={{ repeat: Infinity, duration: 2.2 }}
      onClick={() => setExpanded(e => !e)}
      style={{
        padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
        background: evolutionReady
          ? 'linear-gradient(135deg, #2D1500, #1A0A00)'
          : `linear-gradient(135deg, ${bg}, #0A0F1E)`,
        border: `2px solid ${evolutionReady ? '#FBBF24' : (evolutionPossible ? `${color}60` : `${color}30`)}`,
        position: 'relative', overflow: 'hidden',
      }}>

      {/* Evolution shimmer */}
      {evolutionReady && (
        <motion.div
          animate={{ x: ['-100%', '220%'] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.15), transparent)',
            pointerEvents: 'none',
          }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Emoji */}
        <motion.span
          animate={evolutionReady
            ? { scale: [1, 1.18, 1], rotate: [0, -6, 6, 0] }
            : isFull ? { rotate: [0, -8, 8, 0] } : { y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: evolutionReady ? 1.5 : 2.5 }}
          style={{ fontSize: '2.5rem', flexShrink: 0, lineHeight: 1 }}>
          {item.emoji}
        </motion.span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 900, fontSize: '0.92rem', color: 'white' }}>{item.name}</span>
            {evolutionReady ? (
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ fontSize: '0.58rem', fontWeight: 900, color: '#000',
                  background: '#FBBF24', padding: '2px 7px', borderRadius: 999 }}>
                ⚡ PRONTO!
              </motion.span>
            ) : (
              <span style={{ fontSize: '0.58rem', fontWeight: 800, color: glowColor,
                background: `${glowColor}20`, padding: '2px 6px', borderRadius: 999 }}>
                {isFull ? 'MAX ✓' : RARITY_LABEL[item.rarity]}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: 6 }}>
            {item.desc(item.level)}
          </div>

          {/* Level bar */}
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: item.maxLevel }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 999,
                background: i < item.level
                  ? `linear-gradient(90deg, ${glowColor}, ${glowColor}cc)`
                  : '#334155',
                boxShadow: i < item.level ? `0 0 4px ${glowColor}80` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded: synergy info */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 12, paddingTop: 12 }}>
              {/* Evolution chain */}
              {partnerItem && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800,
                    color: evolutionReady ? '#FBBF24' : '#475569' }}>
                    {item.category === 'weapon' ? '🔗 Evolui com:' : '🔗 Catalisa:'}
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>{partnerItem.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700,
                    color: evolutionReady ? '#FDE68A' : '#64748B' }}>
                    {partnerItem.name}
                  </span>
                  {evolutionReady ? (
                    <span style={{ fontSize: '0.6rem', color: '#FBBF24', fontWeight: 900 }}>✓ Pronto!</span>
                  ) : (
                    <span style={{ fontSize: '0.6rem', color: '#334155', fontWeight: 700 }}>
                      {evolutionPossible ? '(parceiro na bag)' : '(falta este item)'}
                    </span>
                  )}
                </div>
              )}
              {/* Evolution result */}
              {evoItem && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(251,191,36,0.08)', padding: '8px 12px', borderRadius: 10,
                  border: '1px solid rgba(251,191,36,0.2)' }}>
                  <span style={{ fontSize: '1.4rem' }}>{evoItem.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#FBBF24' }}>{evoItem.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700 }}>{evoItem.desc(1)}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Synergy Web (evolution chains at a glance) ───────────────────────────────
function SynergyChart({ runItems }: { runItems: RunItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(EVOLUTION_TABLE).map(([key, evoId]) => {
        const [wId, pId] = key.split('+');
        const w   = ITEM_POOL.find(x => x.id === wId)!;
        const p   = ITEM_POOL.find(x => x.id === pId)!;
        const e   = ITEM_POOL.find(x => x.id === evoId)!;
        const hasW   = runItems.find(r => r.id === wId);
        const hasP   = runItems.find(r => r.id === pId);
        const wReady = hasW && hasW.level >= hasW.maxLevel;
        const ready  = wReady && hasP;
        const possible = hasW || hasP;

        return (
          <div key={key}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 12,
              background: ready ? '#1A0900' : possible ? '#0A0F1E' : 'transparent',
              border: `1px solid ${ready ? '#FBBF24' : possible ? '#1E293B' : '#0F172A'}`,
              opacity: possible ? 1 : 0.45,
            }}>
            <span style={{ fontSize: '1.5rem', opacity: hasW ? 1 : 0.4 }}>{w.emoji}</span>
            <span style={{ fontSize: '0.8rem', color: wReady ? '#22C55E' : hasW ? '#FBBF24' : '#334155', fontWeight: 900 }}>
              {wReady ? 'MAX' : hasW ? `Lv${hasW.level}` : '—'}
            </span>
            <span style={{ color: '#1E293B', fontWeight: 900 }}>+</span>
            <span style={{ fontSize: '1.5rem', opacity: hasP ? 1 : 0.4 }}>{p.emoji}</span>
            <span style={{ fontSize: '0.8rem', color: hasP ? '#22C55E' : '#334155', fontWeight: 900 }}>
              {hasP ? '✓' : '—'}
            </span>
            <span style={{ color: '#1E293B', fontWeight: 900, marginLeft: 2 }}>→</span>
            <span style={{ fontSize: '1.5rem', opacity: ready ? 1 : 0.35, marginLeft: 2 }}>{e.emoji}</span>
            <span style={{ flex: 1, fontSize: '0.78rem', color: ready ? '#FBBF24' : '#334155', fontWeight: 800, marginLeft: 2 }}>
              {ready ? e.name : e.name}
            </span>
            {ready && (
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ fontSize: '0.65rem', fontWeight: 900, color: '#FBBF24' }}>
                ⚡
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ItemsPage() {
  const { runItems, player } = useAppStore();
  const [tab, setTab] = useState<'build' | 'compendium'>('build');

  const weapons  = runItems.filter(x => x.category === 'weapon');
  const passives = runItems.filter(x => x.category === 'passive');
  const { ready: evoReady, possible: evoPossible } = getEvolutionReadiness(runItems);

  // All items not yet in run (for compendium)
  const allAvailable = ITEM_POOL.filter(x => !runItems.find(r => r.id === x.id) && x.rarity !== 'legendary');

  // Per-item helpers
  function getPartnerItem(item: RunItem): RunItem | null {
    if (item.category === 'weapon' && item.evolvesIntoWith) {
      return ITEM_POOL.find(x => x.id === item.evolvesIntoWith) ?? null;
    }
    if (item.category === 'passive') {
      for (const key of Object.keys(EVOLUTION_TABLE)) {
        const [, pId] = key.split('+');
        if (pId === item.id) {
          const [wId] = key.split('+');
          return ITEM_POOL.find(x => x.id === wId) ?? null;
        }
      }
    }
    return null;
  }

  function isEvoReady(item: RunItem): boolean {
    return evoReady.some(e => e.weaponId === item.id || e.passiveId === item.id);
  }

  function isEvoPossible(item: RunItem): boolean {
    return evoPossible.some(e => e.weaponId === item.id || e.passiveId === item.id);
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 14px', background: 'linear-gradient(180deg,#1E293B,#0A0F1E)', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>🎒 Build da Run</h1>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: 999,
              background: '#0F172A', border: '1px solid #1E293B', color: '#475569',
            }}>
              {runItems.length}/8 slots
            </span>
          </div>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { l: 'DMG',  v: player.damage,                           c: '#F87171' },
            { l: 'HP',   v: `${player.hp}/${player.maxHp}`,          c: '#34D399' },
            { l: 'CRIT', v: `${Math.round(player.critChance * 100)}%`, c: '#FBBF24' },
            { l: 'GOLD', v: `×${player.goldMultiplier.toFixed(1)}`,  c: '#A78BFA' },
          ].map(s => (
            <div key={s.l} style={{
              flex: 1, background: '#111827', borderRadius: 10, padding: '8px 4px',
              textAlign: 'center', border: '1px solid #1E293B',
            }}>
              <div style={{ fontWeight: 900, color: s.c, fontSize: '0.95rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.58rem', color: '#475569', fontWeight: 800, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1E293B', background: '#080D1A' }}>
        {(['build', 'compendium'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px', fontWeight: 800, fontSize: '0.82rem',
              color: tab === t ? 'white' : '#475569',
              borderBottom: tab === t ? '2px solid #3B82F6' : '2px solid transparent',
              background: 'transparent',
              transition: 'all 0.15s',
            }}>
            {t === 'build' ? '⚔️ Mochila' : '📖 Compêndio'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {tab === 'build' ? (
          <>
            {/* Evolution ready alert */}
            {evoReady.length > 0 && (
              <motion.div
                animate={{ boxShadow: ['0 0 0px #FBBF2400', '0 0 30px #FBBF2450', '0 0 0px #FBBF2400'] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                style={{
                  padding: '14px 16px', borderRadius: 16, marginBottom: 16,
                  background: 'linear-gradient(135deg, #2D1500, #1A0A00)',
                  border: '2px solid #FBBF24',
                }}>
                <div style={{ fontWeight: 900, color: '#FBBF24', fontSize: '1rem', marginBottom: 8 }}>
                  ⚡ EVOLUÇÃO PRONTA!
                </div>
                {evoReady.map(({ evoId }) => {
                  const evo = ITEM_POOL.find(x => x.id === evoId)!;
                  return (
                    <div key={evoId} style={{ color: '#FDE68A', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                      {evo.emoji} {evo.name}
                    </div>
                  );
                })}
                <div style={{ color: '#92400E', fontSize: '0.75rem', fontWeight: 600, marginTop: 6 }}>
                  Abra um baú de chefe para evoluir automaticamente
                </div>
              </motion.div>
            )}

            {/* Weapons */}
            {weapons.length > 0 && (
              <>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#F87171',
                  marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                  ⚔️ Armas ({weapons.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {weapons.map(item => (
                    <ItemCard key={item.id} item={item}
                      partnerItem={getPartnerItem(item)}
                      evolutionReady={isEvoReady(item)}
                      evolutionPossible={isEvoPossible(item)} />
                  ))}
                </div>
              </>
            )}

            {/* Passives */}
            {passives.length > 0 && (
              <>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#A78BFA',
                  marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                  🔵 Passivos ({passives.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {passives.map(item => (
                    <ItemCard key={item.id} item={item}
                      partnerItem={getPartnerItem(item)}
                      evolutionReady={isEvoReady(item)}
                      evolutionPossible={isEvoPossible(item)} />
                  ))}
                </div>
              </>
            )}

            {/* Synergy chart */}
            {runItems.length > 0 && (
              <>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#64748B',
                  marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                  🔗 Evoluções
                </div>
                <SynergyChart runItems={runItems} />
              </>
            )}

            {/* Empty state */}
            {runItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ fontSize: '4rem', marginBottom: 16 }}>
                  📭
                </motion.div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#334155', marginBottom: 8 }}>
                  Mochila vazia
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 700 }}>
                  Derrote inimigos para ganhar itens!<br />A cada 3 kills cai um baú.
                </div>
              </div>
            )}
          </>
        ) : (
          /* Compendium tab */
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#64748B',
                marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                📖 Itens disponíveis
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allAvailable.map(item => {
                  const color = RARITY_COLOR[item.rarity];
                  // Synergy hint
                  let synergyHint: string | null = null;
                  if (item.category === 'weapon' && item.evolvesIntoWith) {
                    const p = ITEM_POOL.find(x => x.id === item.evolvesIntoWith);
                    if (p) synergyHint = `🔗 + ${p.emoji} ${p.name}`;
                  }
                  if (item.category === 'passive') {
                    for (const key of Object.keys(EVOLUTION_TABLE)) {
                      const [wId, pId] = key.split('+');
                      if (pId === item.id) {
                        const w = ITEM_POOL.find(x => x.id === wId);
                        if (w) synergyHint = `🔗 Catalisa ${w.emoji} ${w.name}`;
                      }
                    }
                  }

                  return (
                    <div key={item.id}
                      style={{
                        padding: '12px 14px', borderRadius: 12, background: '#111827',
                        border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                      <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{item.name}</span>
                          <span style={{ fontSize: '0.58rem', fontWeight: 800, color,
                            background: `${color}15`, padding: '2px 6px', borderRadius: 999 }}>
                            {RARITY_LABEL[item.rarity]}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                          {item.desc(1)}
                        </div>
                        {synergyHint && (
                          <div style={{ fontSize: '0.68rem', color: '#334155', fontWeight: 700, marginTop: 3 }}>
                            {synergyHint}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evolutions list */}
            <div style={{ borderTop: '1px solid #1E293B', paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#92400E',
                marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                ⭐ Receitas de Evolução
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(EVOLUTION_TABLE).map(([key, evoId]) => {
                  const [wId, pId] = key.split('+');
                  const w = ITEM_POOL.find(x => x.id === wId)!;
                  const p = ITEM_POOL.find(x => x.id === pId)!;
                  const e = ITEM_POOL.find(x => x.id === evoId)!;
                  return (
                    <div key={key}
                      style={{
                        padding: '12px 14px', borderRadius: 12,
                        background: '#1A0900', border: '1px solid rgba(251,191,36,0.2)',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                      <span style={{ fontSize: '1.5rem' }}>{w.emoji}</span>
                      <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#FBBF24' }}>MAX</span>
                      <span style={{ color: '#334155' }}>+</span>
                      <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                      <span style={{ color: '#334155' }}>→</span>
                      <span style={{ fontSize: '1.5rem' }}>{e.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#FBBF24' }}>{e.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>{e.desc(1)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
