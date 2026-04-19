import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { CosmeticSlot, CosmeticItem } from '../../data/cosmeticsDb';
import { RARITY_CONFIG, SLOT_CONFIG } from '../../data/cosmeticsDb';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../hooks/useTheme';

export default function CosmeticsPage() {
  const navigate = useNavigate();
  const t = useTheme();
  const cosmeticInventory = useAppStore(s => s.cosmeticInventory);
  const equippedCosmetics = useAppStore(s => s.equippedCosmetics);
  const equipCosmetic = useAppStore(s => s.equipCosmetic);
  const unequipCosmetic = useAppStore(s => s.unequipCosmetic);
  const player = useAppStore(s => s.player);

  const [selectedSlot, setSelectedSlot] = useState<CosmeticSlot | null>(null);

  // Compute total cosmetic bonuses
  const cosmeticBonus = { damage: 0, maxHp: 0, critChance: 0, goldMultiplier: 0 };
  for (const itemId of Object.values(equippedCosmetics)) {
    if (!itemId) continue;
    const item = cosmeticInventory.find(i => i.id === itemId);
    if (!item) continue;
    if (item.statBonus.damage)         cosmeticBonus.damage         += item.statBonus.damage;
    if (item.statBonus.maxHp)          cosmeticBonus.maxHp          += item.statBonus.maxHp;
    if (item.statBonus.critChance)     cosmeticBonus.critChance     += item.statBonus.critChance;
    if (item.statBonus.goldMultiplier) cosmeticBonus.goldMultiplier += item.statBonus.goldMultiplier;
  }

  const buildEmoji = player.build === 'warrior' ? '⚔️' : player.build === 'mage' ? '🔮' : '🗡️';

  // Owned items deduplicated display (show count)
  const owned = new Map<string, { item: CosmeticItem; count: number }>();
  for (const item of cosmeticInventory) {
    if (owned.has(item.id)) owned.get(item.id)!.count++;
    else owned.set(item.id, { item, count: 1 });
  }
  const displayItems = [...owned.values()].filter(({ item }) => !selectedSlot || item.slot === selectedSlot);

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: t.bg, color: t.text, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        background: t.headerBg, borderBottom: `1px solid ${t.border}`,
        position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)',
      }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 6, color: t.textSub, fontWeight: 800,
          fontSize: '0.85rem', padding: '6px 10px', borderRadius: 10,
          backgroundColor: t.bgCard, border: `1px solid ${t.borderStr}`,
          cursor: 'pointer',
        }}>
          <ArrowLeft size={15} /> Voltar
        </button>
        <h1 style={{ fontWeight: 900, fontSize: '1.2rem', flex: 1, margin: 0 }}>👤 Herói</h1>
        {cosmeticInventory.length === 0 && (
          <span style={{ fontSize: '0.7rem', color: t.textMuted, fontWeight: 700 }}>
            Complete runs para ganhar itens!
          </span>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Character + Equipment Slots */}
        <div style={{
          background: t.bgCard, borderRadius: 20, border: `1px solid ${t.borderStr}`,
          padding: '20px', position: 'relative',
        }}>
          {/* Stat bonuses from cosmetics */}
          {(cosmeticBonus.damage > 0 || cosmeticBonus.maxHp > 0 || cosmeticBonus.critChance > 0 || cosmeticBonus.goldMultiplier > 0) && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {cosmeticBonus.damage > 0        && <BonusBadge label={`+${cosmeticBonus.damage} dano`}     color="#EF4444" />}
              {cosmeticBonus.maxHp > 0         && <BonusBadge label={`+${cosmeticBonus.maxHp} HP`}        color="#22C55E" />}
              {cosmeticBonus.critChance > 0     && <BonusBadge label={`+${Math.round(cosmeticBonus.critChance * 100)}% crit`} color="#FBBF24" />}
              {cosmeticBonus.goldMultiplier > 0 && <BonusBadge label={`+${Math.round(cosmeticBonus.goldMultiplier * 100)}% ouro`} color="#A78BFA" />}
            </div>
          )}

          {/* Equip grid layout: hat | avatar | amulet, weapon | — | armor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
            {/* Left column: hat + weapon */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <SlotButton slot="hat" equippedId={equippedCosmetics.hat} inventory={cosmeticInventory}
                selected={selectedSlot === 'hat'}
                onPress={() => setSelectedSlot(s => s === 'hat' ? null : 'hat')}
                t={t} />
              <SlotButton slot="weapon" equippedId={equippedCosmetics.weapon} inventory={cosmeticInventory}
                selected={selectedSlot === 'weapon'}
                onPress={() => setSelectedSlot(s => s === 'weapon' ? null : 'weapon')}
                t={t} />
            </div>

            {/* Center: character */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{ fontSize: '5rem', lineHeight: 1 }}>
                {buildEmoji}
              </motion.div>
              <div style={{ fontSize: '0.7rem', color: t.textMuted, fontWeight: 800, marginTop: 6, textTransform: 'uppercase' }}>
                {player.build === 'warrior' ? 'Guerreiro' : player.build === 'mage' ? 'Mago' : 'Ladino'}
              </div>
            </div>

            {/* Right column: amulet + armor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <SlotButton slot="amulet" equippedId={equippedCosmetics.amulet} inventory={cosmeticInventory}
                selected={selectedSlot === 'amulet'}
                onPress={() => setSelectedSlot(s => s === 'amulet' ? null : 'amulet')}
                t={t} />
              <SlotButton slot="armor" equippedId={equippedCosmetics.armor} inventory={cosmeticInventory}
                selected={selectedSlot === 'armor'}
                onPress={() => setSelectedSlot(s => s === 'armor' ? null : 'armor')}
                t={t} />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div>
          {/* Slot filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
            <FilterTab label="Todos" active={!selectedSlot} onPress={() => setSelectedSlot(null)} t={t} />
            {(['hat', 'weapon', 'armor', 'amulet'] as CosmeticSlot[]).map(slot => (
              <FilterTab key={slot} label={`${SLOT_CONFIG[slot].icon} ${SLOT_CONFIG[slot].label}`}
                active={selectedSlot === slot}
                onPress={() => setSelectedSlot(s => s === slot ? null : slot)} t={t} />
            ))}
          </div>

          {displayItems.length === 0 ? (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              background: t.bgCard, borderRadius: 16, border: `1px solid ${t.borderStr}`,
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎁</div>
              <div style={{ fontWeight: 800, color: t.textSub, marginBottom: 6 }}>Sem itens ainda</div>
              <div style={{ fontSize: '0.82rem', color: t.textMuted }}>Complete runs para ganhar itens de raridade!</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {displayItems.map(({ item, count }) => {
                const cfg = RARITY_CONFIG[item.rarity];
                const isEquipped = Object.values(equippedCosmetics).includes(item.id);
                return (
                  <motion.button key={item.id} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isEquipped) unequipCosmetic(item.slot);
                      else { equipCosmetic(item.id); setSelectedSlot(null); }
                    }}
                    style={{
                      padding: '14px 12px', borderRadius: 16, textAlign: 'center',
                      background: isEquipped ? cfg.gradient : t.bgCard,
                      border: `2px solid ${isEquipped ? cfg.color : t.borderStr}`,
                      color: t.text, position: 'relative',
                      boxShadow: isEquipped ? `0 0 20px ${cfg.glow}` : '0 2px 0 rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                    }}>
                    {isEquipped && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        background: cfg.color, borderRadius: '50%',
                        width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 900, color: 'white',
                      }}>✓</div>
                    )}
                    {count > 1 && (
                      <div style={{
                        position: 'absolute', top: 8, left: 8,
                        background: 'rgba(0,0,0,0.6)', borderRadius: 6,
                        padding: '1px 5px', fontSize: '0.6rem', fontWeight: 900, color: 'white',
                      }}>×{count}</div>
                    )}
                    <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>{item.emoji}</div>
                    <div style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(0,0,0,0.25)', border: `1px solid ${cfg.color}`,
                      fontSize: '0.58rem', fontWeight: 900, color: cfg.color,
                      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
                    }}>{cfg.label}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: isEquipped ? '#F1F5F9' : t.text, lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isEquipped ? cfg.color : t.textMuted, fontWeight: 700, marginTop: 3 }}>
                      {item.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SlotButton({ slot, equippedId, inventory, selected, onPress, t }: {
  slot: CosmeticSlot;
  equippedId: string | null;
  inventory: CosmeticItem[];
  selected: boolean;
  onPress: () => void;
  t: Theme;
}) {
  const item = equippedId ? inventory.find(i => i.id === equippedId) : null;
  const cfg = item ? RARITY_CONFIG[item.rarity] : null;
  const slotCfg = SLOT_CONFIG[slot];
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onPress}
      style={{
        width: 60, height: 60, borderRadius: 16, flexShrink: 0,
        background: item ? cfg!.gradient : t.bgSub,
        border: `2px solid ${item ? cfg!.color : (selected ? '#3B82F6' : t.borderStr)}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: item ? `0 0 16px ${cfg!.glow}` : 'none',
        gap: 2, position: 'relative', cursor: 'pointer',
      }}>
      {item ? (
        <>
          <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.emoji}</span>
          <span style={{ fontSize: '0.45rem', color: cfg!.color, fontWeight: 900, textTransform: 'uppercase' }}>
            {cfg!.label}
          </span>
        </>
      ) : (
        <>
          <span style={{ fontSize: '1.3rem', opacity: 0.4 }}>{slotCfg.icon}</span>
          <span style={{ fontSize: '0.5rem', color: t.textMuted, fontWeight: 700 }}>{slotCfg.label}</span>
        </>
      )}
    </motion.button>
  );
}

function BonusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 800,
      background: `${color}20`, border: `1px solid ${color}50`, color,
    }}>{label}</span>
  );
}

function FilterTab({ label, active, onPress, t }: { label: string; active: boolean; onPress: () => void; t: Theme }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }} onClick={onPress}
      style={{
        padding: '6px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0,
        fontWeight: 800, fontSize: '0.75rem',
        background: active ? '#3B82F6' : t.bgCard,
        color: active ? 'white' : t.textSub,
        border: `1px solid ${active ? '#3B82F6' : t.borderStr}`,
        cursor: 'pointer',
      }}>
      {label}
    </motion.button>
  );
}
