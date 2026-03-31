import { motion } from 'framer-motion';
import { useAppStore, ITEM_POOL, EVOLUTION_TABLE } from '../../store/useAppStore';
import type { RunItem } from '../../store/useAppStore';

const RARITY_COLOR = { common: '#60A5FA', rare: '#A78BFA', legendary: '#FBBF24' };
const RARITY_BG    = { common: '#1E3A5F', rare: '#2D1B69', legendary: '#451A03' };
const RARITY_LABEL = { common: 'Comum', rare: 'Raro', legendary: '⭐ LENDÁRIO' };

function ItemCard({ item, onLevelUp, canLevelUp }: { item: RunItem; onLevelUp: () => void; canLevelUp: boolean }) {
  const isFull = item.level >= item.maxLevel;
  const color = RARITY_COLOR[item.rarity];
  const bg    = RARITY_BG[item.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ padding: '14px 16px', borderRadius: 14, backgroundColor: bg,
        border: `2px solid ${color}`, display: 'flex', alignItems: 'center', gap: 14 }}
    >
      <motion.span
        animate={isFull ? { rotate: [0, -10, 10, 0] } : { y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: isFull ? 2 : 2.5 }}
        style={{ fontSize: '2.5rem', flexShrink: 0 }}
      >
        {item.emoji}
      </motion.span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'white' }}>{item.name}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color, backgroundColor: `${color}20`, padding: '2px 6px', borderRadius: 999 }}>
            {RARITY_LABEL[item.rarity]}
          </span>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: 6 }}>
          {item.desc(item.level)}
        </div>
        {/* Level pips */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: item.maxLevel }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, backgroundColor: i < item.level ? color : '#334155' }} />
          ))}
        </div>
      </div>
      {canLevelUp && !isFull && (
        <button onClick={onLevelUp}
          style={{ padding: '8px 12px', borderRadius: 10, backgroundColor: color, color: '#0F172A',
            fontWeight: 900, fontSize: '0.8rem', flexShrink: 0, boxShadow: `0 3px 0 ${color}80` }}>
          ▲ UP
        </button>
      )}
      {isFull && (
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color, flexShrink: 0 }}>MAX</span>
      )}
    </motion.div>
  );
}

export default function ItemsPage() {
  const { runItems, levelUpItem, player } = useAppStore();

  // Which evolutions are available
  const availableEvolutions = Object.entries(EVOLUTION_TABLE).filter(([key]) => {
    const [wId, pId] = key.split('+');
    const weapon = runItems.find(x => x.id === wId);
    const passive = runItems.find(x => x.id === pId);
    return weapon && weapon.level >= weapon.maxLevel && passive;
  });

  const weapons  = runItems.filter(x => x.category === 'weapon');
  const passives = runItems.filter(x => x.category === 'passive');

  // All items not in run
  const allAvailable = ITEM_POOL.filter(x => !runItems.find(r => r.id === x.id) && x.rarity !== 'legendary');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 14px', backgroundColor: '#1E293B', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: 4 }}>🎒 Mochila</h1>
        <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 700 }}>
          Itens desta run — eles resetam ao voltar à base
        </p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* Active run stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { l: 'Dano', v: player.damage, c: '#F87171' },
            { l: 'MaxHP', v: player.maxHp, c: '#34D399' },
            { l: 'Crit',  v: `${Math.round(player.critChance * 100)}%`, c: '#FBBF24' },
            { l: 'Gold',  v: `x${player.goldMultiplier.toFixed(1)}`, c: '#A78BFA' },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, backgroundColor: '#1E293B', borderRadius: 10, padding: '10px 6px', textAlign: 'center', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 900, color: s.c, fontSize: '1rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 700 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Evolution hints */}
        {availableEvolutions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '14px', borderRadius: 12, backgroundColor: '#451A03',
              border: '2px solid #FBBF24', marginBottom: 16 }}>
            <div style={{ fontWeight: 900, color: '#FBBF24', marginBottom: 8 }}>⭐ EVOLUÇÃO DISPONÍVEL!</div>
            {availableEvolutions.map(([key, evoId]) => {
              const evo = ITEM_POOL.find(x => x.id === evoId)!;
              return (
                <div key={key} style={{ color: '#FDE68A', fontWeight: 700, fontSize: '0.9rem' }}>
                  {evo.emoji} {evo.name} — {evo.desc(1)}
                </div>
              );
            })}
            <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: 8, fontWeight: 600 }}>
              Abra um baú de chefe para evoluir automaticamente
            </div>
          </motion.div>
        )}

        {/* Run items: weapons */}
        {weapons.length > 0 && (
          <>
            <h2 style={{ fontWeight: 900, fontSize: '1rem', color: '#F87171', marginBottom: 10 }}>⚔️ Armas ({weapons.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {weapons.map(item => (
                <ItemCard key={item.id} item={item} canLevelUp={false} onLevelUp={() => levelUpItem(item.id)} />
              ))}
            </div>
          </>
        )}

        {/* Run items: passives */}
        {passives.length > 0 && (
          <>
            <h2 style={{ fontWeight: 900, fontSize: '1rem', color: '#A78BFA', marginBottom: 10 }}>🔵 Passivos ({passives.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {passives.map(item => (
                <ItemCard key={item.id} item={item} canLevelUp={false} onLevelUp={() => levelUpItem(item.id)} />
              ))}
            </div>
          </>
        )}

        {runItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>Mochila vazia</p>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Inicie uma run e derrote inimigos para ganhar itens!</p>
          </div>
        )}

        {/* Compendium — all items in pool */}
        <div style={{ borderTop: '1px solid #1E293B', paddingTop: 20, marginTop: 4 }}>
          <h2 style={{ fontWeight: 900, fontSize: '1rem', color: '#64748B', marginBottom: 6 }}>📖 Compêndio de Itens</h2>
          <p style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700, marginBottom: 14 }}>
            Itens que podem aparecer durante as runs
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allAvailable.map(item => (
              <div key={item.id}
                style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#1E293B',
                  border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.7 }}>
                <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{item.desc(1)}</div>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: RARITY_COLOR[item.rarity],
                  backgroundColor: `${RARITY_COLOR[item.rarity]}15`, padding: '3px 6px', borderRadius: 999 }}>
                  {RARITY_LABEL[item.rarity]}
                </span>
              </div>
            ))}

            {/* Evolution hints */}
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 12, backgroundColor: '#451A03',
              border: '1px solid #FBBF24', opacity: 0.8 }}>
              <div style={{ fontWeight: 900, color: '#FBBF24', fontSize: '0.88rem', marginBottom: 8 }}>
                ⭐ Evoluções (Vampire Survivors style)
              </div>
              {Object.entries(EVOLUTION_TABLE).map(([key, evoId]) => {
                const [wId, pId] = key.split('+');
                const w = ITEM_POOL.find(x => x.id === wId)!;
                const p = ITEM_POOL.find(x => x.id === pId)!;
                const e = ITEM_POOL.find(x => x.id === evoId)!;
                return (
                  <div key={key} style={{ fontSize: '0.8rem', color: '#FDE68A', fontWeight: 700, marginBottom: 4 }}>
                    {w.emoji} {w.name} Lv.MAX + {p.emoji} {p.name} → {e.emoji} {e.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
