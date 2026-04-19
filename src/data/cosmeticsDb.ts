export type CosmeticRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CosmeticSlot = 'hat' | 'weapon' | 'armor' | 'amulet';

export interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  slot: CosmeticSlot;
  rarity: CosmeticRarity;
  statBonus: { damage?: number; maxHp?: number; critChance?: number; goldMultiplier?: number; };
  description: string;
  flavorText: string;
}

export const RARITY_CONFIG: Record<CosmeticRarity, { label: string; color: string; glow: string; weight: number; gradient: string }> = {
  common:    { label: 'Comum',    color: '#94A3B8', glow: 'rgba(148,163,184,0.35)', weight: 55, gradient: 'linear-gradient(135deg,#334155,#1E293B)' },
  rare:      { label: 'Raro',     color: '#3B82F6', glow: 'rgba(59,130,246,0.45)',  weight: 28, gradient: 'linear-gradient(135deg,#1D4ED8,#1E3A5F)' },
  epic:      { label: 'Épico',    color: '#A855F7', glow: 'rgba(168,85,247,0.5)',   weight: 13, gradient: 'linear-gradient(135deg,#7C3AED,#4C1D95)' },
  legendary: { label: 'Lendário', color: '#F59E0B', glow: 'rgba(245,158,11,0.55)', weight: 4,  gradient: 'linear-gradient(135deg,#D97706,#78350F)' },
};

export const SLOT_CONFIG: Record<CosmeticSlot, { label: string; icon: string }> = {
  hat:    { label: 'Chapéu',   icon: '🪖' },
  weapon: { label: 'Arma',     icon: '⚔️' },
  armor:  { label: 'Armadura', icon: '🛡️' },
  amulet: { label: 'Amuleto',  icon: '💎' },
};

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // HAT
  { id:'hat_scholar',    name:'Chapéu do Estudioso', emoji:'🎓', slot:'hat', rarity:'common',    statBonus:{ maxHp:10 },                         description:'+10 HP',                   flavorText:'Usado por quem já decorou o edital três vezes.' },
  { id:'hat_cowboy',     name:'Chapéu Sertanejo',    emoji:'🤠', slot:'hat', rarity:'common',    statBonus:{ goldMultiplier:0.1 },                description:'+10% ouro',                flavorText:'Do interior pra capital, o concurso não me para.' },
  { id:'hat_mortarboard',name:'Birô Dourado',         emoji:'🏫', slot:'hat', rarity:'rare',      statBonus:{ maxHp:20, damage:3 },                description:'+20 HP · +3 dano',         flavorText:'Formatura + concurso = combo perfeito.' },
  { id:'hat_detective',  name:'Chapéu Detetive',      emoji:'🕵️', slot:'hat', rarity:'rare',      statBonus:{ critChance:0.05 },                   description:'+5% crítico',              flavorText:'"Elementar, meu caro concurseiro."' },
  { id:'hat_ninja',      name:'Capuz Ninja',           emoji:'🥷', slot:'hat', rarity:'epic',      statBonus:{ critChance:0.08, damage:5 },          description:'+8% crítico · +5 dano',    flavorText:'Ataque-surpresa. A banca não esperava.' },
  { id:'hat_wizard',     name:'Chapéu do Arcano',     emoji:'🧙', slot:'hat', rarity:'epic',      statBonus:{ damage:8, maxHp:20 },                 description:'+8 dano · +20 HP',         flavorText:'Sábio ancestral, mestre das matérias.' },
  { id:'hat_crown',      name:'Coroa do Aprovado',    emoji:'👑', slot:'hat', rarity:'legendary', statBonus:{ maxHp:40, critChance:0.08 },          description:'+40 HP · +8% crítico',     flavorText:'Só para quem passou em primeiro lugar.' },
  // WEAPON
  { id:'weapon_pen',      name:'Caneta da Verdade',   emoji:'🖊️', slot:'weapon', rarity:'common',    statBonus:{ damage:5 },                           description:'+5 dano',                  flavorText:'Mais poderosa que qualquer espada.' },
  { id:'weapon_slingshot',name:'Estilingue Jurídico', emoji:'🏹', slot:'weapon', rarity:'common',    statBonus:{ damage:4, goldMultiplier:0.05 },       description:'+4 dano · +5% ouro',       flavorText:'Simples mas eficaz. Como um bom dispositivo legal.' },
  { id:'weapon_ruler',    name:'Régua de Aço',        emoji:'📏', slot:'weapon', rarity:'rare',      statBonus:{ damage:9, critChance:0.03 },           description:'+9 dano · +3% crítico',    flavorText:'Mede a questão e parte ao meio.' },
  { id:'weapon_scroll',   name:'Rolo de Édito',       emoji:'📜', slot:'weapon', rarity:'rare',      statBonus:{ damage:7, goldMultiplier:0.15 },       description:'+7 dano · +15% ouro',      flavorText:'Cada artigo é um golpe devastador.' },
  { id:'weapon_book',     name:'Compêndio Ancestral', emoji:'📚', slot:'weapon', rarity:'epic',      statBonus:{ damage:14, maxHp:15 },                description:'+14 dano · +15 HP',        flavorText:'5000 páginas de pura destruição doutrinária.' },
  { id:'weapon_hammer',   name:'Martelo da Justiça',  emoji:'⚖️', slot:'weapon', rarity:'epic',      statBonus:{ damage:12, critChance:0.07 },          description:'+12 dano · +7% crítico',   flavorText:'A lei é o martelo, o concurso é o prego.' },
  { id:'weapon_gauntlet', name:'Manopla do Edital',   emoji:'🥊', slot:'weapon', rarity:'legendary', statBonus:{ damage:24, critChance:0.06 },          description:'+24 dano · +6% crítico',   flavorText:'Com ela você bate em qualquer questão da CESPE.' },
  // ARMOR
  { id:'armor_vest',     name:'Colete do Candidato',  emoji:'🦺', slot:'armor', rarity:'common',    statBonus:{ maxHp:20 },                           description:'+20 HP',                   flavorText:'Protege das questões de português e matemática.' },
  { id:'armor_cloak',    name:'Capa do Concurseiro',  emoji:'🦸', slot:'armor', rarity:'common',    statBonus:{ maxHp:15, goldMultiplier:0.05 },       description:'+15 HP · +5% ouro',        flavorText:'Todo herói precisa de uma capa. E de um código de ética.' },
  { id:'armor_badge',    name:'Distintivo Federal',   emoji:'🏅', slot:'armor', rarity:'rare',      statBonus:{ maxHp:25, critChance:0.03 },           description:'+25 HP · +3% crítico',     flavorText:'Aprovado. Nomeado. Empossado.' },
  { id:'armor_robe',     name:'Toga Judiciária',      emoji:'🥋', slot:'armor', rarity:'rare',      statBonus:{ maxHp:35 },                           description:'+35 HP',                   flavorText:'O traje oficial de quem vai pra posse.' },
  { id:'armor_shield_c', name:'Escudo da Lei',        emoji:'🛡️', slot:'armor', rarity:'epic',      statBonus:{ maxHp:50, goldMultiplier:0.15 },       description:'+50 HP · +15% ouro',       flavorText:'"A lei é o escudo de todos." — Art. 5º CF/88' },
  { id:'armor_mail',     name:'Malha Tecnocrática',   emoji:'⚙️', slot:'armor', rarity:'epic',      statBonus:{ maxHp:45, damage:6 },                 description:'+45 HP · +6 dano',         flavorText:'Burocracia como defesa. É mais resistente do que parece.' },
  { id:'armor_dragon',   name:'Armadura do Dragão',   emoji:'🐉', slot:'armor', rarity:'legendary', statBonus:{ maxHp:85, damage:10 },                description:'+85 HP · +10 dano',        flavorText:'Forjada nas chamas dos concursos mais difíceis.' },
  // AMULET
  { id:'amulet_star',    name:'Estrela da Aprovação', emoji:'⭐', slot:'amulet', rarity:'common',    statBonus:{ goldMultiplier:0.1 },                  description:'+10% ouro',                flavorText:'Um dia o nome vai sair no DOU.' },
  { id:'amulet_luck',    name:'Amuleto da Sorte',     emoji:'🍀', slot:'amulet', rarity:'common',    statBonus:{ critChance:0.03, goldMultiplier:0.05 }, description:'+3% crítico · +5% ouro',   flavorText:'Para quando a questão é "verdadeiro ou falso".' },
  { id:'amulet_compass', name:'Bússola do Saber',     emoji:'🧭', slot:'amulet', rarity:'rare',      statBonus:{ critChance:0.06, damage:4 },            description:'+6% crítico · +4 dano',    flavorText:'Sempre aponta para o gabarito certo.' },
  { id:'amulet_gold',    name:'Moeda Dourada',        emoji:'🪙', slot:'amulet', rarity:'rare',      statBonus:{ goldMultiplier:0.25 },                  description:'+25% ouro',                flavorText:'Cada acerto vale mais com ela no pescoço.' },
  { id:'amulet_crystal', name:'Cristal de Foco',      emoji:'💎', slot:'amulet', rarity:'epic',      statBonus:{ critChance:0.12, damage:6 },            description:'+12% crítico · +6 dano',   flavorText:'Concentração máxima. Questão CESPE? Não me assusta.' },
  { id:'amulet_eye',     name:'Olho do Gabarito',     emoji:'👁️', slot:'amulet', rarity:'epic',      statBonus:{ critChance:0.10, goldMultiplier:0.2 },  description:'+10% crítico · +20% ouro', flavorText:'Enxerga o erro antes mesmo de ler a alternativa.' },
  { id:'amulet_phoenix', name:'Fênix do Gabarito',    emoji:'🔥', slot:'amulet', rarity:'legendary', statBonus:{ critChance:0.15, goldMultiplier:0.3, damage:8 }, description:'+15% crit · +30% ouro · +8 dano', flavorText:'Renasça das cinzas de cada reprovação.' },
];

export function rollCosmeticItem(): CosmeticItem {
  const total = Object.values(RARITY_CONFIG).reduce((a, r) => a + r.weight, 0);
  let roll = Math.random() * total;
  let rarity: CosmeticRarity = 'common';
  for (const [r, cfg] of Object.entries(RARITY_CONFIG) as [CosmeticRarity, typeof RARITY_CONFIG[CosmeticRarity]][]) {
    roll -= cfg.weight;
    if (roll <= 0) { rarity = r; break; }
  }
  const pool = COSMETIC_ITEMS.filter(i => i.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}
