// ============================================================================
// Scribble Arena - Character Customization Engine & SVG Icon Library
// Pure Vector Chibi Characters: Hair - Head - Eyes - Mouth - Outfit - Hat - Acc - Pack
// ZERO Emojis - 100% Crisp Standalone Scalable Vector Graphics (SVG)
// ============================================================================

export const AVATAR_OPTIONS = {
  skinColors: [
    '#fde8cd', '#f5d0a9', '#d4a574', '#a0785a', '#6b4423',
    '#ffffff', '#fde047', '#fbcfe8', '#67e8f9', '#c4b5fd'
  ],
  hairs: [
    'none', 'anime_spiky', 'flowing_long', 'slick_back',
    'curly_afro', 'bob_bangs', 'ponytail', 'messy_fluff'
  ],
  hats: [
    'none', 'bandana', 'headphones', 'baseball_cap',
    'golden_crown', 'beanie', 'party_hat', 'halo', 'viking_horns'
  ],
  outfits: [
    'sport_jersey', 'yellow_tee', 'blue_hoodie', 'black_jacket',
    'striped_sailor', 'formal_suit', 'red_flannel', 'hero_cape'
  ],
  eyes: [
    'dot_eyes', 'happy_curves', 'wink', 'anime_sparkle',
    'cool_shades', 'shocked', 'sleepy', 'star_eyes'
  ],
  mouths: [
    'cute_smile', 'happy_open', 'cat_mouth', 'smirk',
    'grin_teeth', 'whistle'
  ],
  accessories: [
    'none', 'red_scarf', 'gold_chain', 'bowtie',
    'nerd_glasses', 'bandaid'
  ],
  backpacks: [
    'none', 'mushroom_pack', 'angel_wings', 'ninja_swords',
    'jetpack', 'school_bag'
  ]
};

// ============================================================================
// PURE SVG ICON SYSTEM (Zero OS emoji dependencies)
// ============================================================================
export const SVG_ICONS = {
  // Category navigation icons
  palette: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>`,
  hair: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  hat: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17h20"/><path d="M5 17v-4a7 7 0 0 1 14 0v4"/><path d="M19 17h3a2 2 0 0 1 2 2v0a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v0a2 2 0 0 1 2-2h3"/></svg>`,
  outfit: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  mouth: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 3 4 3 4-3 4-3"/></svg>`,
  accessory: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
  backpack: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="7" width="14" height="14" rx="4"/><path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/><path d="M9 12h6"/><path d="M12 10v4"/></svg>`,

  // UI Action icons
  dice: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
  crown: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg>`,
  gamepad: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="3" rx="2"/><polyline points="17 21 12 18 7 21"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  music: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  volumeMute: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`
};

// ============================================================================
// CATEGORIES WITH PURE SVG ICONS
// ============================================================================
export const AVATAR_CATEGORIES = [
  { id: 'skinColor', name: 'Body / Skin', icon: SVG_ICONS.palette, desc: 'Choose your character body tone' },
  { id: 'hair', name: 'Hairstyle', icon: SVG_ICONS.hair, desc: 'Spiky, flowing, afro, or sleek' },
  { id: 'hat', name: 'Headwear', icon: SVG_ICONS.hat, desc: 'Bandana, headphones, caps, crowns' },
  { id: 'outfit', name: 'Outfits', icon: SVG_ICONS.outfit, desc: 'Jerseys, hoodies, tees, suits' },
  { id: 'eye', name: 'Face / Eyes', icon: SVG_ICONS.eye, desc: 'Dot eyes, sparkles, shades' },
  { id: 'mouth', name: 'Mouth / Exp.', icon: SVG_ICONS.mouth, desc: 'Smiles, grins, smirks, whistles' },
  { id: 'accessory', name: 'Accessories', icon: SVG_ICONS.accessory, desc: 'Scarves, chains, bowties, glasses' },
  { id: 'backpack', name: 'Back Gear', icon: SVG_ICONS.backpack, desc: 'Wings, jetpack, swords, mushroom' }
];

// Rich item details with human-readable labels (Zero emojis)
export const AVATAR_ITEM_DETAILS = {
  skinColor: {
    '#fde8cd': { name: 'Fair', swatch: '#fde8cd' },
    '#f5d0a9': { name: 'Light', swatch: '#f5d0a9' },
    '#d4a574': { name: 'Warm', swatch: '#d4a574' },
    '#a0785a': { name: 'Tan', swatch: '#a0785a' },
    '#6b4423': { name: 'Deep', swatch: '#6b4423' },
    '#ffffff': { name: 'Ghost White', swatch: '#ffffff' },
    '#fde047': { name: 'Sunny Yellow', swatch: '#fde047' },
    '#fbcfe8': { name: 'Bubblegum', swatch: '#fbcfe8' },
    '#67e8f9': { name: 'Neon Cyan', swatch: '#67e8f9' },
    '#c4b5fd': { name: 'Lavender', swatch: '#c4b5fd' }
  },
  hair: {
    none: { name: 'Bald / None' },
    anime_spiky: { name: 'Spiky Anime' },
    flowing_long: { name: 'Flowing Locks' },
    slick_back: { name: 'Slick Back' },
    curly_afro: { name: 'Curly Afro' },
    bob_bangs: { name: 'Bob & Bangs' },
    ponytail: { name: 'High Ponytail' },
    messy_fluff: { name: 'Messy Fluff' }
  },
  hat: {
    none: { name: 'No Hat' },
    bandana: { name: 'Bandana Wrap' },
    headphones: { name: 'Pro Headset' },
    baseball_cap: { name: 'Street Cap' },
    golden_crown: { name: 'Royal Crown' },
    beanie: { name: 'Cozy Beanie' },
    party_hat: { name: 'Party Cone' },
    halo: { name: 'Angel Halo' },
    viking_horns: { name: 'Viking Helm' }
  },
  outfit: {
    sport_jersey: { name: 'Athletic Jersey' },
    yellow_tee: { name: 'Yellow Classic Tee' },
    blue_hoodie: { name: 'Cobalt Hoodie' },
    black_jacket: { name: 'Biker Jacket' },
    striped_sailor: { name: 'Sailor Stripes' },
    formal_suit: { name: 'Tuxedo Suit' },
    red_flannel: { name: 'Red Flannel' },
    hero_cape: { name: 'Hero Suit' }
  },
  eye: {
    dot_eyes: { name: 'Classic Dots' },
    happy_curves: { name: 'Happy Curves' },
    wink: { name: 'Playful Wink' },
    anime_sparkle: { name: 'Anime Sparkle' },
    cool_shades: { name: 'VIP Shades' },
    shocked: { name: 'Shocked Wide' },
    sleepy: { name: 'Sleepy Half' },
    star_eyes: { name: 'Star Eyes' }
  },
  mouth: {
    cute_smile: { name: 'Cute Smile' },
    happy_open: { name: 'Excited Open' },
    cat_mouth: { name: 'Kitty Mouth' },
    smirk: { name: 'Confident Smirk' },
    grin_teeth: { name: 'Beaming Grin' },
    whistle: { name: 'Whistle Circle' }
  },
  accessory: {
    none: { name: 'No Neckwear' },
    red_scarf: { name: 'Crimson Scarf' },
    gold_chain: { name: 'Gold Chain' },
    bowtie: { name: 'Classy Bowtie' },
    nerd_glasses: { name: 'Wire Glasses' },
    bandaid: { name: 'Cheek Bandage' }
  },
  backpack: {
    none: { name: 'No Backpack' },
    mushroom_pack: { name: 'Mushroom Pack' },
    angel_wings: { name: 'Angel Wings' },
    ninja_swords: { name: 'Ninja Katanas' },
    jetpack: { name: 'Rocket Thrusters' },
    school_bag: { name: 'Explorer Bag' }
  }
};

/**
 * Generates a full random chibi avatar
 */
export function getRandomAvatar() {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  return {
    skinColor: pick(AVATAR_OPTIONS.skinColors),
    hair: pick(AVATAR_OPTIONS.hairs),
    hat: pick(AVATAR_OPTIONS.hats),
    outfit: pick(AVATAR_OPTIONS.outfits),
    eye: pick(AVATAR_OPTIONS.eyes),
    mouth: pick(AVATAR_OPTIONS.mouths),
    accessory: pick(AVATAR_OPTIONS.accessories),
    backpack: pick(AVATAR_OPTIONS.backpacks)
  };
}

/**
 * Returns a default hero preset avatar
 */
export function getHeroPresetAvatar() {
  return {
    skinColor: '#fde8cd',
    hair: 'anime_spiky',
    hat: 'none',
    outfit: 'sport_jersey',
    eye: 'dot_eyes',
    mouth: 'cute_smile',
    accessory: 'red_scarf',
    backpack: 'none'
  };
}

// Normalize legacy avatars for backward compatibility
function normalizeAvatar(raw = {}) {
  const av = { ...raw };

  let skin = av.skinColor || '#fde8cd';
  let hair = av.hair || 'none';
  let hat = av.hat || 'none';
  let outfit = av.outfit || 'sport_jersey';

  // Map legacy eye names
  let eye = av.eye || 'dot_eyes';
  if (eye === 'normal' || eye === 'qbit_oval') eye = 'dot_eyes';
  else if (eye === 'happy') eye = 'happy_curves';
  else if (eye === 'cool') eye = 'cool_shades';
  else if (eye === 'stars') eye = 'star_eyes';
  else if (eye === 'shock' || eye === 'derp') eye = 'shocked';

  let mouth = av.mouth || 'cute_smile';
  if (mouth === 'smile') mouth = 'cute_smile';
  else if (mouth === 'grin') mouth = 'grin_teeth';
  else if (mouth === 'open') mouth = 'happy_open';
  else if (mouth === 'tongue') mouth = 'happy_open';
  else if (mouth === 'neutral') mouth = 'smirk';
  else if (mouth === 'mustache') mouth = 'cute_smile';

  // Map legacy accessories that were hats
  let accessory = av.accessory || 'none';
  if (['headphones', 'party_hat', 'crown', 'cap', 'halo'].includes(accessory)) {
    if (hat === 'none') {
      if (accessory === 'crown') hat = 'golden_crown';
      else if (accessory === 'cap') hat = 'baseball_cap';
      else hat = accessory;
    }
    accessory = 'none';
  } else if (accessory === 'glasses') {
    accessory = 'nerd_glasses';
  }

  let backpack = av.backpack || 'none';

  return { skin, hair, hat, outfit, eye, mouth, accessory, backpack };
}

// ============================================================================
// RENDER ENGINE - Full Chibi Body Scalable Vector Graphics (SVG)
// ViewBox: 0 0 100 114
// Proportions: Big round cute head (approx 50%), chibi torso, arms & feet
// ZERO Emojis - pure crisp scalable vector paths & geometric shapes
// ============================================================================

export function renderAvatarSvg(rawAvatar = {}, size = 64) {
  const { skin, hair, hat, outfit, eye, mouth, accessory, backpack } = normalizeAvatar(rawAvatar);
  const uid = 'av' + Math.random().toString(36).substr(2, 6);

  // 1. BACKPACK (behind body)
  let backpackSvg = '';
  switch (backpack) {
    case 'mushroom_pack':
      backpackSvg = `
        <g class="layer-backpack">
          <path d="M72 68 Q80 78 76 88 Q70 90 68 78 Z" fill="#fef08a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M66 62 Q81 50 90 66 Q91 78 77 84 Q65 78 66 62 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="77" cy="62" r="2.8" fill="#ffffff"/>
          <circle cx="85" cy="71" r="2" fill="#ffffff"/>
          <circle cx="73" cy="75" r="1.6" fill="#ffffff"/>
        </g>`;
      break;
    case 'angel_wings':
      backpackSvg = `
        <g class="layer-backpack">
          <path d="M30 66 C14 54 8 64 10 76 C14 84 28 80 30 74 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
          <path d="M22 66 Q14 71 18 78" stroke="#bae6fd" stroke-width="1.2" fill="none"/>
          <path d="M70 66 C86 54 92 64 90 76 C86 84 72 80 70 74 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
          <path d="M78 66 Q86 71 82 78" stroke="#bae6fd" stroke-width="1.2" fill="none"/>
        </g>`;
      break;
    case 'ninja_swords':
      backpackSvg = `
        <g class="layer-backpack">
          <line x1="28" y1="42" x2="42" y2="82" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <rect x="33" y="56" width="6" height="3" rx="1" transform="rotate(-30 33 56)" fill="#fbbf24"/>
          <line x1="72" y1="42" x2="58" y2="82" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <rect x="61" y="54" width="6" height="3" rx="1" transform="rotate(30 61 54)" fill="#fbbf24"/>
        </g>`;
      break;
    case 'jetpack':
      backpackSvg = `
        <g class="layer-backpack">
          <rect x="24" y="66" width="8" height="20" rx="3" fill="#64748b" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M26 86 L28 96 L30 86 Z" fill="#f97316"/>
          <rect x="68" y="66" width="8" height="20" rx="3" fill="#64748b" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M70 86 L72 96 L74 86 Z" fill="#f97316"/>
          <rect x="30" y="74" width="40" height="3" fill="#334155"/>
        </g>`;
      break;
    case 'school_bag':
      backpackSvg = `
        <g class="layer-backpack">
          <rect x="30" y="64" width="40" height="22" rx="5" fill="#b45309" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="40" y="68" width="20" height="8" rx="3" fill="#92400e"/>
          <rect x="48" y="76" width="4" height="4" rx="1" fill="#fbbf24"/>
        </g>`;
      break;
  }

  // 2. BACK HAIR (behind head)
  let backHairSvg = '';
  switch (hair) {
    case 'flowing_long':
      backHairSvg = `
        <g class="layer-backhair">
          <path d="M24 38 C18 52 16 72 22 82 C26 84 30 76 32 64 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.2"/>
          <path d="M76 38 C82 52 84 72 78 82 C74 84 70 76 68 64 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.2"/>
        </g>`;
      break;
    case 'curly_afro':
      backHairSvg = `
        <g class="layer-backhair">
          <circle cx="30" cy="30" r="14" fill="#1e293b"/>
          <circle cx="70" cy="30" r="14" fill="#1e293b"/>
          <circle cx="50" cy="16" r="16" fill="#1e293b"/>
        </g>`;
      break;
    case 'ponytail':
      backHairSvg = `
        <g class="layer-backhair">
          <path d="M56 22 C68 12 82 18 80 32 C78 42 68 38 64 34 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="60" cy="24" r="2.5" fill="#ec4899"/>
        </g>`;
      break;
  }

  // 3. LEGS & SHOES
  const legsSvg = `
    <g class="layer-legs">
      <rect x="38" y="88" width="10" height="14" rx="4" fill="${skin}" stroke="#0f172a" stroke-width="1.5"/>
      <rect x="52" y="88" width="10" height="14" rx="4" fill="${skin}" stroke="#0f172a" stroke-width="1.5"/>
      <rect x="36" y="99" width="12" height="7" rx="3.5" fill="#0f172a"/>
      <rect x="52" y="99" width="12" height="7" rx="3.5" fill="#0f172a"/>
      <circle cx="42" cy="102" r="1" fill="#ffffff" opacity="0.8"/>
      <circle cx="58" cy="102" r="1" fill="#ffffff" opacity="0.8"/>
    </g>`;

  // 4. TORSO / OUTFIT / ARMS
  let outfitSvg = '';
  const armBase = (fillColor) => `
    <path d="M30 66 L20 80 L26 83 L34 72 Z" fill="${fillColor}" stroke="#0f172a" stroke-width="1.5"/>
    <circle cx="21" cy="82" r="4" fill="${skin}" stroke="#0f172a" stroke-width="1.2"/>
    <path d="M70 66 L80 80 L74 83 L66 72 Z" fill="${fillColor}" stroke="#0f172a" stroke-width="1.5"/>
    <circle cx="79" cy="82" r="4" fill="${skin}" stroke="#0f172a" stroke-width="1.2"/>`;

  switch (outfit) {
    case 'sport_jersey':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          ${armBase('#ffffff')}
          <rect x="33" y="72" width="34" height="5" fill="#dc2626"/>
          <rect x="34" y="79" width="32" height="5" fill="#0f172a"/>
          <polygon points="50,68 54,72 53,78 47,78 46,72" fill="#fbbf24" stroke="#0f172a" stroke-width="0.8"/>
        </g>`;
      break;
    case 'yellow_tee':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#facc15" stroke="#0f172a" stroke-width="1.8"/>
          ${armBase('#facc15')}
          <path d="M43 60 Q50 65 57 60" stroke="#ca8a04" stroke-width="1.8" fill="none"/>
        </g>`;
      break;
    case 'blue_hoodie':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#2563eb" stroke="#0f172a" stroke-width="1.8"/>
          ${armBase('#2563eb')}
          <rect x="40" y="76" width="20" height="10" rx="3" fill="#1d4ed8" stroke="#0f172a" stroke-width="1"/>
          <line x1="46" y1="62" x2="46" y2="72" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>
          <line x1="54" y1="62" x2="54" y2="72" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M40 56 Q50 50 60 56 Q56 60 50 58 Q44 60 40 56 Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="1"/>
        </g>`;
      break;
    case 'black_jacket':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M48 66 L52 74 L49 74 L53 82" stroke="#f59e0b" stroke-width="1.2" fill="none"/>
          <path d="M32 60 L44 60 L40 92 L34 92 Z" fill="#0f172a"/>
          <path d="M68 60 L56 60 L60 92 L66 92 Z" fill="#0f172a"/>
          ${armBase('#0f172a')}
        </g>`;
      break;
    case 'striped_sailor':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="33" y="68" width="34" height="3" fill="#1e3a8a"/>
          <rect x="34" y="74" width="32" height="3" fill="#1e3a8a"/>
          <rect x="35" y="80" width="30" height="3" fill="#1e3a8a"/>
          ${armBase('#1e3a8a')}
        </g>`;
      break;
    case 'formal_suit':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="50,63 52,68 51,82 49,82 48,68" fill="#0f172a"/>
          <path d="M32 60 L43 60 L39 92 L34 92 Z" fill="#0f172a"/>
          <path d="M68 60 L57 60 L61 92 L66 92 Z" fill="#0f172a"/>
          ${armBase('#0f172a')}
          <circle cx="40" cy="72" r="1.5" fill="#dc2626"/>
        </g>`;
      break;
    case 'red_flannel':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="33" y="70" width="34" height="3" fill="#1e293b" opacity="0.5"/>
          <rect x="34" y="80" width="32" height="3" fill="#1e293b" opacity="0.5"/>
          <line x1="44" y1="60" x2="44" y2="92" stroke="#1e293b" stroke-width="2" opacity="0.5"/>
          <line x1="56" y1="60" x2="56" y2="92" stroke="#1e293b" stroke-width="2" opacity="0.5"/>
          ${armBase('#b91c1c')}
        </g>`;
      break;
    case 'hero_cape':
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M26 64 Q16 78 22 92 Q28 88 30 76 Z" fill="#dc2626"/>
          <path d="M74 64 Q84 78 78 92 Q72 88 70 76 Z" fill="#dc2626"/>
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#0284c7" stroke="#0f172a" stroke-width="1.8"/>
          <polygon points="50,68 52,72 56,72 53,75 54,79 50,76 46,79 47,75 44,72 48,72" fill="#fbbf24"/>
          ${armBase('#0284c7')}
        </g>`;
      break;
    default:
      outfitSvg = `
        <g class="layer-outfit">
          <path d="M32 60 C32 56 68 56 68 60 L66 90 C66 92 62 93 60 93 L40 93 C38 93 34 92 34 90 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          ${armBase('#ffffff')}
        </g>`;
      break;
  }

  // 5. HEAD (Big round cute chibi head)
  const headSvg = `
    <g class="layer-head">
      <circle cx="50" cy="36" r="26" fill="${skin}" stroke="#0f172a" stroke-width="2.2"/>
      <circle cx="50" cy="36" r="26" fill="url(#${uid}-grd)"/>
    </g>`;

  // 6. EYES
  let eyesSvg = '';
  switch (eye) {
    case 'happy_curves':
      eyesSvg = `
        <g class="layer-eyes">
          <path d="M36 38 Q42 30 48 38" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M52 38 Q58 30 64 38" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        </g>`;
      break;
    case 'wink':
      eyesSvg = `
        <g class="layer-eyes">
          <path d="M36 38 Q42 33 48 38" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <ellipse cx="58" cy="36" rx="4" ry="5.5" fill="#0f172a"/>
          <ellipse cx="57" cy="34" rx="1.4" ry="1.8" fill="#ffffff"/>
        </g>`;
      break;
    case 'anime_sparkle':
      eyesSvg = `
        <g class="layer-eyes">
          <ellipse cx="42" cy="36" rx="5" ry="6.5" fill="#0f172a"/>
          <circle cx="40" cy="33.5" r="2" fill="#ffffff"/>
          <circle cx="44" cy="38" r="1" fill="#ffffff"/>
          <ellipse cx="58" cy="36" rx="5" ry="6.5" fill="#0f172a"/>
          <circle cx="56" cy="33.5" r="2" fill="#ffffff"/>
          <circle cx="60" cy="38" r="1" fill="#ffffff"/>
        </g>`;
      break;
    case 'cool_shades':
      eyesSvg = `
        <g class="layer-eyes">
          <rect x="32" y="30" width="16" height="11" rx="3" fill="#0f172a"/>
          <rect x="52" y="30" width="16" height="11" rx="3" fill="#0f172a"/>
          <line x1="48" y1="35" x2="52" y2="35" stroke="#0f172a" stroke-width="2.5"/>
          <line x1="34" y1="33" x2="44" y2="33" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
          <line x1="54" y1="33" x2="64" y2="33" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
        </g>`;
      break;
    case 'shocked':
      eyesSvg = `
        <g class="layer-eyes">
          <circle cx="42" cy="36" r="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <circle cx="42" cy="36" r="2" fill="#0f172a"/>
          <circle cx="58" cy="36" r="5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <circle cx="58" cy="36" r="2" fill="#0f172a"/>
        </g>`;
      break;
    case 'sleepy':
      eyesSvg = `
        <g class="layer-eyes">
          <line x1="36" y1="37" x2="48" y2="37" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
          <line x1="52" y1="37" x2="64" y2="37" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
        </g>`;
      break;
    case 'star_eyes':
      eyesSvg = `
        <g class="layer-eyes">
          <polygon points="42,30 43.5,34 48,35 44.5,37.5 45.5,42 42,39.5 38.5,42 39.5,37.5 36,35 40.5,34" fill="#fbbf24" stroke="#0f172a" stroke-width="1"/>
          <polygon points="58,30 59.5,34 64,35 60.5,37.5 61.5,42 58,39.5 54.5,42 55.5,37.5 52,35 56.5,34" fill="#fbbf24" stroke="#0f172a" stroke-width="1"/>
        </g>`;
      break;
    default: // dot_eyes
      eyesSvg = `
        <g class="layer-eyes">
          <ellipse cx="42" cy="36" rx="3.8" ry="5" fill="#0f172a"/>
          <ellipse cx="41" cy="34" rx="1.3" ry="1.6" fill="#ffffff"/>
          <ellipse cx="58" cy="36" rx="3.8" ry="5" fill="#0f172a"/>
          <ellipse cx="57" cy="34" rx="1.3" ry="1.6" fill="#ffffff"/>
        </g>`;
      break;
  }

  // 7. Rosy blush cheeks
  const blushSvg = `
    <g class="layer-blush">
      <ellipse cx="34" cy="42" rx="4" ry="2.5" fill="#fda4af" opacity="0.45"/>
      <ellipse cx="66" cy="42" rx="4" ry="2.5" fill="#fda4af" opacity="0.45"/>
    </g>`;

  // 8. MOUTH
  let mouthSvg = '';
  switch (mouth) {
    case 'happy_open':
      mouthSvg = `<path d="M46 46 Q50 54 54 46 Z" fill="#e11d48" stroke="#0f172a" stroke-width="1.5"/>`;
      break;
    case 'cat_mouth':
      mouthSvg = `<path d="M44 47 Q47 50 50 47 Q53 50 56 47" stroke="#0f172a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      break;
    case 'smirk':
      mouthSvg = `<path d="M46 48 Q52 49 56 44" stroke="#0f172a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
    case 'grin_teeth':
      mouthSvg = `
        <g>
          <path d="M44 46 Q50 53 56 46 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="44" y1="46" x2="56" y2="46" stroke="#0f172a" stroke-width="1"/>
        </g>`;
      break;
    case 'whistle':
      mouthSvg = `<ellipse cx="50" cy="47" rx="2.2" ry="2.5" fill="#0f172a"/>`;
      break;
    default: // cute_smile
      mouthSvg = `<path d="M46 47 Q50 51 54 47" stroke="#0f172a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
  }

  // 9. FRONT HAIR
  let frontHairSvg = '';
  switch (hair) {
    case 'anime_spiky':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M24 30 C22 16 34 6 44 5 C47 -1 53 -2 54 4 C58 -1 64 0 66 6 C76 8 80 18 78 30 C76 24 70 20 66 22 C62 25 58 21 55 23 C51 26 46 21 42 24 C38 27 34 23 30 28 C27 30 25 30 24 30 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M48 6 C51 0 55 1 53 9 Z" fill="#475569"/>
        </g>`;
      break;
    case 'flowing_long':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M23 28 C28 12 40 10 50 10 C60 10 72 12 77 28 C72 19 62 17 50 17 C38 17 28 19 23 28 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        </g>`;
      break;
    case 'slick_back':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M23 28 C23 12 35 7 50 7 C65 7 77 12 77 28 C74 20 64 16 50 16 C36 16 26 20 23 28 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M38 11 Q50 9 62 11" stroke="#475569" stroke-width="1.2" fill="none"/>
        </g>`;
      break;
    case 'curly_afro':
      frontHairSvg = `
        <g class="layer-fronthair">
          <circle cx="34" cy="16" r="10" fill="#1e293b"/>
          <circle cx="50" cy="12" r="11" fill="#1e293b"/>
          <circle cx="66" cy="16" r="10" fill="#1e293b"/>
        </g>`;
      break;
    case 'bob_bangs':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M22 30 C22 12 34 8 50 8 C66 8 78 12 78 30 C74 26 74 20 66 20 C58 20 58 23 50 23 C42 23 42 20 34 20 C26 20 26 26 22 30 Z" fill="#78350f" stroke="#0f172a" stroke-width="1.5"/>
        </g>`;
      break;
    case 'ponytail':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M23 28 C25 14 36 10 50 10 C64 10 75 14 77 28 C73 20 64 17 50 17 C36 17 27 20 23 28 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        </g>`;
      break;
    case 'messy_fluff':
      frontHairSvg = `
        <g class="layer-fronthair">
          <path d="M24 28 C23 16 33 8 43 7 C46 3 50 3 53 6 C57 2 63 4 65 8 C73 9 77 17 76 28 C73 24 69 21 66 24 C62 22 58 24 55 22 C51 25 47 22 43 25 C39 23 35 25 31 23 C27 26 25 28 24 28 Z" fill="#b45309" stroke="#0f172a" stroke-width="1.5"/>
        </g>`;
      break;
  }

  // 10. NECK ACCESSORY
  let accSvg = '';
  switch (accessory) {
    case 'red_scarf':
      accSvg = `
        <g class="layer-accessory">
          <path d="M38 58 Q50 64 62 58 Q60 64 50 66 Q40 64 38 58 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1"/>
          <ellipse cx="50" cy="62" rx="5.5" ry="4" fill="#dc2626" stroke="#0f172a" stroke-width="1"/>
          <path d="M48 64 C42 70 39 78 45 81 C49 77 50 71 49 64 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1"/>
          <path d="M52 64 C57 69 61 77 56 80 C54 76 52 70 52 64 Z" fill="#ef4444" stroke="#0f172a" stroke-width="1"/>
        </g>`;
      break;
    case 'gold_chain':
      accSvg = `
        <g class="layer-accessory">
          <path d="M40 60 Q50 70 60 60" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="68" r="3" fill="#f59e0b" stroke="#0f172a" stroke-width="0.8"/>
          <polygon points="50,66.5 51,68 52.5,68 51.3,69.3 51.8,71 50,70 48.2,71 48.7,69.3 47.5,68 49,68" fill="#ffffff"/>
        </g>`;
      break;
    case 'bowtie':
      accSvg = `
        <g class="layer-accessory">
          <polygon points="44,59 44,65 50,62" fill="#dc2626" stroke="#0f172a" stroke-width="0.8"/>
          <polygon points="56,59 56,65 50,62" fill="#dc2626" stroke="#0f172a" stroke-width="0.8"/>
          <circle cx="50" cy="62" r="2.2" fill="#991b1b" stroke="#0f172a" stroke-width="0.8"/>
        </g>`;
      break;
    case 'nerd_glasses':
      accSvg = `
        <g class="layer-accessory">
          <rect x="34" y="30" width="12" height="11" rx="3.5" stroke="#a855f7" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="54" y="30" width="12" height="11" rx="3.5" stroke="#a855f7" stroke-width="2" fill="rgba(255,255,255,0.15)"/>
          <line x1="46" y1="35" x2="54" y2="35" stroke="#a855f7" stroke-width="2"/>
        </g>`;
      break;
    case 'bandaid':
      accSvg = `
        <g class="layer-accessory">
          <rect x="30" y="42" width="8" height="4" rx="1.5" transform="rotate(-15 30 42)" fill="#fed7aa" stroke="#d97706" stroke-width="0.8"/>
        </g>`;
      break;
  }

  // 11. HAT / HEADWEAR
  let hatSvg = '';
  switch (hat) {
    case 'bandana':
      hatSvg = `
        <g class="layer-hat">
          <path d="M24 26 C24 10 36 4 50 4 C64 4 76 10 76 26 C72 22 64 20 50 20 C36 20 28 22 24 26 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M24 26 Q50 20 76 26 Q50 28 24 26 Z" fill="#334155" stroke="#0f172a" stroke-width="0.8"/>
          <path d="M74 26 L80 30 L76 34 Z" fill="#1e293b" stroke="#0f172a" stroke-width="0.8"/>
        </g>`;
      break;
    case 'headphones':
      hatSvg = `
        <g class="layer-hat">
          <path d="M22 36 A28 28 0 0 1 78 36" stroke="#0f172a" stroke-width="4.5" fill="none"/>
          <path d="M26 35 A24 24 0 0 1 74 35" stroke="#f43f5e" stroke-width="1.5" fill="none"/>
          <rect x="17" y="28" width="9" height="18" rx="3.5" fill="#ec4899" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="19" y="31" width="5" height="12" rx="2" fill="#be185d"/>
          <rect x="74" y="28" width="9" height="18" rx="3.5" fill="#ec4899" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="76" y="31" width="5" height="12" rx="2" fill="#be185d"/>
        </g>`;
      break;
    case 'baseball_cap':
      hatSvg = `
        <g class="layer-hat">
          <path d="M26 24 C26 12 38 8 50 8 C62 8 74 12 74 24 Z" fill="#2563eb" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M66 23 C82 23 84 27 74 30 C66 30 62 25 66 23 Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="1.2"/>
          <circle cx="50" cy="8" r="2" fill="#fbbf24"/>
        </g>`;
      break;
    case 'golden_crown':
      hatSvg = `
        <g class="layer-hat">
          <polygon points="30,18 34,4 42,12 50,1 58,12 66,4 70,18" fill="#fbbf24" stroke="#b45309" stroke-width="1.8"/>
          <circle cx="50" cy="1" r="2.2" fill="#f43f5e"/>
          <circle cx="34" cy="4" r="1.8" fill="#38bdf8"/>
          <circle cx="66" cy="4" r="1.8" fill="#34d399"/>
          <rect x="31" y="16" width="38" height="4" rx="1" fill="#f59e0b"/>
        </g>`;
      break;
    case 'beanie':
      hatSvg = `
        <g class="layer-hat">
          <path d="M26 24 C26 8 38 4 50 4 C62 4 74 8 74 24 Z" fill="#0284c7" stroke="#0f172a" stroke-width="1.8"/>
          <rect x="24" y="20" width="52" height="6" rx="3" fill="#0369a1" stroke="#0f172a" stroke-width="1.2"/>
          <circle cx="50" cy="3" r="3.5" fill="#bae6fd"/>
        </g>`;
      break;
    case 'party_hat':
      hatSvg = `
        <g class="layer-hat">
          <polygon points="50,-4 34,18 66,18" fill="#f43f5e" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="50" cy="-4" r="3" fill="#fbbf24"/>
          <line x1="42" y1="7" x2="58" y2="7" stroke="#fbbf24" stroke-width="1.8"/>
          <line x1="38" y1="13" x2="62" y2="13" stroke="#38bdf8" stroke-width="1.8"/>
        </g>`;
      break;
    case 'halo':
      hatSvg = `
        <g class="layer-hat">
          <ellipse cx="50" cy="6" rx="24" ry="5" stroke="#fbbf24" stroke-width="3" fill="none"/>
          <ellipse cx="50" cy="6" rx="24" ry="5" stroke="#fef08a" stroke-width="1.2" fill="none"/>
        </g>`;
      break;
    case 'viking_horns':
      hatSvg = `
        <g class="layer-hat">
          <path d="M28 22 C28 10 38 7 50 7 C62 7 72 10 72 22 Z" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M28 18 C18 14 16 2 20 0 C20 8 28 12 30 16 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M72 18 C82 14 84 2 80 0 C80 8 72 12 70 16 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
        </g>`;
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112" width="${size}" height="${size}" class="avatar-svg chibi-avatar">
      <defs>
        <radialGradient id="${uid}-grd" cx="38%" cy="30%" r="68%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
        </radialGradient>
      </defs>
      <!-- Ground Shadow -->
      <ellipse cx="50" cy="108" rx="22" ry="3" fill="rgba(0,0,0,0.25)"/>
      <!-- L1: Backpack -->
      ${backpackSvg}
      <!-- L2: Back Hair -->
      ${backHairSvg}
      <!-- L3: Legs & Shoes -->
      ${legsSvg}
      <!-- L4: Torso, Outfit & Arms -->
      ${outfitSvg}
      <!-- L5: Head Base -->
      ${headSvg}
      <!-- L6: Eyes -->
      ${eyesSvg}
      <!-- L7: Rosy Cheeks -->
      ${blushSvg}
      <!-- L8: Mouth -->
      ${mouthSvg}
      <!-- L9: Front Hair -->
      ${frontHairSvg}
      <!-- L10: Neck Accessory -->
      ${accSvg}
      <!-- L11: Hat / Headwear -->
      ${hatSvg}
    </svg>
  `.trim();
}
