// ============================================================================
// Wayground Qbit Modular Avatar System (Exact Wayground / Qbit Customizer)
// ============================================================================

export const AVATAR_OPTIONS = {
  // String arrays for 100% backward compatibility
  skinColors: [
    '#ffffff', '#fde047', '#fed7aa', '#fbcfe8', '#67e8f9',
    '#c4b5fd', '#86efac', '#fdba74', '#94a3b8', '#334155'
  ],
  hairs: [
    'none', 'anime_spiky', 'flowing_dark', 'slick_back',
    'curly_afro', 'bob_bangs', 'ponytail', 'messy_fluff'
  ],
  hats: [
    'none', 'pirate_wrap', 'headphones', 'baseball_cap',
    'golden_crown', 'beanie', 'party_hat', 'halo', 'viking_horns'
  ],
  outfits: [
    'sport_jersey', 'yellow_tee', 'blue_hoodie', 'black_jacket',
    'striped_sailor', 'formal_suit', 'red_flannel', 'hero_cape'
  ],
  eyes: [
    'qbit_oval', 'happy_curves', 'wink', 'anime_sparkle',
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

// Category navigation structure for the Wayground Studio
export const AVATAR_CATEGORIES = [
  { id: 'skinColor', name: 'Body / Skin', icon: '🎨', desc: 'Choose your Qbit body tone' },
  { id: 'hair', name: 'Hairstyle', icon: '💇', desc: 'Anime spiky, flowing, afro, or sleek' },
  { id: 'hat', name: 'Headwear', icon: '🧢', desc: 'Bandana wrap, headphones, caps, crowns' },
  { id: 'outfit', name: 'Outfits', icon: '👕', desc: 'Athletic jerseys, hoodies, tees, suits' },
  { id: 'eye', name: 'Face / Eyes', icon: '👀', desc: 'Wayground ovals, sparkles, shades' },
  { id: 'mouth', name: 'Mouth / Expression', icon: '👄', desc: 'Smiles, grins, smirks, whistles' },
  { id: 'accessory', name: 'Accessories', icon: '🧣', desc: 'Signature red scarf, chains, bowties' },
  { id: 'backpack', name: 'Backpack Gear', icon: '🎒', desc: 'Mushroom pack, wings, jetpack, swords' }
];

// Rich item details with human-readable labels and preview icons
export const AVATAR_ITEM_DETAILS = {
  skinColor: {
    '#ffffff': { name: 'Qbit White', swatch: '#ffffff' },
    '#fde047': { name: 'Sunny Yellow', swatch: '#fde047' },
    '#fed7aa': { name: 'Peach Cream', swatch: '#fed7aa' },
    '#fbcfe8': { name: 'Bubblegum', swatch: '#fbcfe8' },
    '#67e8f9': { name: 'Neon Cyan', swatch: '#67e8f9' },
    '#c4b5fd': { name: 'Lavender Glow', swatch: '#c4b5fd' },
    '#86efac': { name: 'Mint Fresh', swatch: '#86efac' },
    '#fdba74': { name: 'Sunset Bronze', swatch: '#fdba74' },
    '#94a3b8': { name: 'Cool Slate', swatch: '#94a3b8' },
    '#334155': { name: 'Midnight Shadow', swatch: '#334155' }
  },
  hair: {
    none: { name: 'Bald / None', icon: '⚪' },
    anime_spiky: { name: 'Spiky Anime', icon: '⚡' },
    flowing_dark: { name: 'Flowing Locks', icon: '🌊' },
    slick_back: { name: 'Slick Back', icon: '✨' },
    curly_afro: { name: 'Curly Afro', icon: '☁️' },
    bob_bangs: { name: 'Bob & Bangs', icon: '💇' },
    ponytail: { name: 'High Ponytail', icon: '🎀' },
    messy_fluff: { name: 'Messy Fluff', icon: '🌪️' }
  },
  hat: {
    none: { name: 'No Hat', icon: '❌' },
    pirate_wrap: { name: 'Bandana Wrap', icon: '🏴‍☠️' },
    headphones: { name: 'Pro Headset', icon: '🎧' },
    baseball_cap: { name: 'Street Cap', icon: '🧢' },
    golden_crown: { name: 'Royal Crown', icon: '👑' },
    beanie: { name: 'Cozy Beanie', icon: '❄️' },
    party_hat: { name: 'Party Cone', icon: '🎉' },
    halo: { name: 'Angel Halo', icon: '😇' },
    viking_horns: { name: 'Viking Helm', icon: '⚔️' }
  },
  outfit: {
    sport_jersey: { name: 'Athletic Jersey', icon: '🏅' },
    yellow_tee: { name: 'Yellow Classic Tee', icon: '👕' },
    blue_hoodie: { name: 'Cobalt Hoodie', icon: '🧥' },
    black_jacket: { name: 'Biker Jacket', icon: '🏍️' },
    striped_sailor: { name: 'Sailor Stripes', icon: '⚓' },
    formal_suit: { name: 'Tuxedo Suit', icon: '🤵' },
    red_flannel: { name: 'Red Plaid Flannel', icon: '🪵' },
    hero_cape: { name: 'Hero Suit', icon: '🦸' }
  },
  eye: {
    qbit_oval: { name: 'Wayground Oval', icon: '👀' },
    happy_curves: { name: 'Happy ^ ^', icon: '😊' },
    wink: { name: 'Playful Wink', icon: '😉' },
    anime_sparkle: { name: 'Anime Sparkle', icon: '✨' },
    cool_shades: { name: 'VIP Shades', icon: '🕶️' },
    shocked: { name: 'Shocked !', icon: '😲' },
    sleepy: { name: 'Sleepy Half', icon: '😴' },
    star_eyes: { name: 'Star Eyes', icon: '🤩' }
  },
  mouth: {
    cute_smile: { name: 'Cute Smile', icon: '🙂' },
    happy_open: { name: 'Excited Open', icon: '😃' },
    cat_mouth: { name: 'Kitty :3', icon: '🐱' },
    smirk: { name: 'Confident Smirk', icon: '😏' },
    grin_teeth: { name: 'Beaming Grin', icon: '😁' },
    whistle: { name: 'Whistle O', icon: '😗' }
  },
  accessory: {
    none: { name: 'No Neckwear', icon: '❌' },
    red_scarf: { name: 'Crimson Scarf', icon: '🧣' },
    gold_chain: { name: 'Gold Chain', icon: '⛓️' },
    bowtie: { name: 'Classy Bowtie', icon: '👔' },
    nerd_glasses: { name: 'Wire Glasses', icon: '👓' },
    bandaid: { name: 'Cheek Bandage', icon: '🩹' }
  },
  backpack: {
    none: { name: 'No Backpack', icon: '❌' },
    mushroom_pack: { name: 'Mushroom Pack', icon: '🍄' },
    angel_wings: { name: 'Angel Wings', icon: '🪽' },
    ninja_swords: { name: 'Ninja Katanas', icon: '🗡️' },
    jetpack: { name: 'Rocket Thrusters', icon: '🚀' },
    school_bag: { name: 'Explorer Bag', icon: '🎒' }
  }
};

/**
 * Generates a full random Wayground Qbit avatar
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
 * Generates the Wayground hero avatar shown on the right side of the screenshot
 */
export function getWaygroundHeroAvatar() {
  return {
    skinColor: '#ffffff',
    hair: 'flowing_dark',
    hat: 'pirate_wrap',
    outfit: 'sport_jersey',
    eye: 'qbit_oval',
    mouth: 'cute_smile',
    accessory: 'red_scarf',
    backpack: 'mushroom_pack'
  };
}

/**
 * Normalizes an avatar object for robust backward-compatibility
 */
function normalizeAvatar(raw = {}) {
  const av = { ...raw };

  // Skin tone
  let skin = av.skinColor || '#ffffff';

  // Hair
  let hair = av.hair || 'none';

  // Headwear / Hat (maps legacy accessories if needed)
  let hat = av.hat || 'none';
  if (hat === 'none' && av.accessory) {
    if (['headphones', 'party_hat', 'crown', 'cap', 'halo', 'glasses'].includes(av.accessory)) {
      if (av.accessory === 'crown') hat = 'golden_crown';
      else if (av.accessory === 'cap') hat = 'baseball_cap';
      else if (av.accessory === 'glasses') hat = 'none';
      else hat = av.accessory;
    }
  }

  // Outfit
  let outfit = av.outfit || 'sport_jersey';

  // Eyes (maps legacy eyes)
  let eye = av.eye || 'qbit_oval';
  if (eye === 'normal') eye = 'qbit_oval';
  else if (eye === 'happy') eye = 'happy_curves';
  else if (eye === 'cool') eye = 'cool_shades';
  else if (eye === 'stars') eye = 'star_eyes';
  else if (eye === 'shock' || eye === 'derp') eye = 'shocked';

  // Mouth
  let mouth = av.mouth || 'cute_smile';
  if (mouth === 'smile') mouth = 'cute_smile';
  else if (mouth === 'grin') mouth = 'grin_teeth';
  else if (mouth === 'open') mouth = 'happy_open';

  // Neck accessory
  let accessory = av.accessory || 'none';
  if (['headphones', 'party_hat', 'crown', 'cap', 'halo'].includes(accessory)) {
    accessory = 'none';
  } else if (accessory === 'glasses') {
    accessory = 'nerd_glasses';
  }

  // Backpack
  let backpack = av.backpack || 'none';

  return { skin, hair, hat, outfit, eye, mouth, accessory, backpack };
}

/**
 * Renders high-definition SVG vector graphic of the Wayground Qbit avatar
 */
export function renderAvatarSvg(rawAvatar = {}, size = 64) {
  const { skin, hair, hat, outfit, eye, mouth, accessory, backpack } = normalizeAvatar(rawAvatar);
  const gradId = 'qbit-grad-' + skin.replace('#', '') + '-' + Math.abs(Math.round(size));

  // 1. BACKPACK LAYER (behind torso and head)
  let backpackSvg = '';
  switch (backpack) {
    case 'mushroom_pack': // Signature red mushroom with white spots from Image 2
      backpackSvg = `
        <g class="layer-backpack">
          <!-- Mushroom stem -->
          <path d="M68 64 Q76 74 72 82 Q66 84 64 72 Z" fill="#fef08a" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Mushroom dome cap -->
          <path d="M62 58 Q77 46 86 62 Q87 74 73 80 Q61 74 62 58 Z" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
          <!-- Mushroom spots -->
          <circle cx="73" cy="58" r="3.2" fill="#ffffff"/>
          <circle cx="81" cy="67" r="2.4" fill="#ffffff"/>
          <circle cx="69" cy="71" r="2" fill="#ffffff"/>
        </g>
      `;
      break;

    case 'angel_wings':
      backpackSvg = `
        <g class="layer-backpack">
          <!-- Left Wing -->
          <path d="M34 58 C18 45 10 56 12 68 C16 78 30 74 34 68 Z" fill="#ffffff" stroke="#38bdf8" stroke-width="1.8"/>
          <path d="M28 58 Q18 64 24 72" stroke="#bae6fd" stroke-width="1.4" fill="none"/>
          <!-- Right Wing -->
          <path d="M66 58 C82 45 90 56 88 68 C84 78 70 74 66 68 Z" fill="#ffffff" stroke="#38bdf8" stroke-width="1.8"/>
          <path d="M72 58 Q82 64 76 72" stroke="#bae6fd" stroke-width="1.4" fill="none"/>
        </g>
      `;
      break;

    case 'ninja_swords':
      backpackSvg = `
        <g class="layer-backpack">
          <!-- Sword 1 (left) -->
          <line x1="22" y1="36" x2="42" y2="64" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
          <line x1="22" y1="36" x2="30" y2="47" stroke="#dc2626" stroke-width="2.2"/>
          <rect x="28" y="44" width="7" height="3" rx="1" transform="rotate(-35 28 44)" fill="#fbbf24"/>
          <!-- Sword 2 (right) -->
          <line x1="78" y1="36" x2="58" y2="64" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
          <line x1="78" y1="36" x2="70" y2="47" stroke="#dc2626" stroke-width="2.2"/>
          <rect x="65" y="42" width="7" height="3" rx="1" transform="rotate(35 65 42)" fill="#fbbf24"/>
        </g>
      `;
      break;

    case 'jetpack':
      backpackSvg = `
        <g class="layer-backpack">
          <!-- Left Thruster -->
          <rect x="22" y="58" width="9" height="22" rx="3" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M24 80 L26.5 90 L29 80 Z" fill="#38bdf8"/>
          <!-- Right Thruster -->
          <rect x="69" y="58" width="9" height="22" rx="3" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M71 80 L73.5 90 L76 80 Z" fill="#38bdf8"/>
          <!-- Connection Bar -->
          <rect x="28" y="66" width="44" height="4" fill="#334155"/>
        </g>
      `;
      break;

    case 'school_bag':
      backpackSvg = `
        <g class="layer-backpack">
          <rect x="26" y="56" width="48" height="24" rx="6" fill="#b45309" stroke="#0f172a" stroke-width="2"/>
          <path d="M36 56 L36 80 M64 56 L64 80" stroke="#78350f" stroke-width="2"/>
        </g>
      `;
      break;
    default:
      break;
  }

  // 2. BACK HAIR LAYER (Behind head/torso)
  let backHairSvg = '';
  switch (hair) {
    case 'flowing_dark': // Flowing dark hair peeking behind shoulders (Image 2 right)
      backHairSvg = `
        <g class="layer-back-hair">
          <path d="M26 44 C20 58 20 74 24 82 C28 84 32 78 34 68 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M74 44 C80 58 80 74 76 82 C72 84 68 78 66 68 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'curly_afro':
      backHairSvg = `
        <g class="layer-back-hair">
          <circle cx="28" cy="38" r="15" fill="#1e293b"/>
          <circle cx="72" cy="38" r="15" fill="#1e293b"/>
          <circle cx="50" cy="22" r="18" fill="#1e293b"/>
          <circle cx="36" cy="26" r="14" fill="#1e293b"/>
          <circle cx="64" cy="26" r="14" fill="#1e293b"/>
        </g>
      `;
      break;

    case 'ponytail':
      backHairSvg = `
        <g class="layer-back-hair">
          <path d="M54 26 C66 16 80 22 78 36 C76 46 66 42 62 38 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
          <circle cx="58" cy="28" r="3" fill="#ec4899"/>
        </g>
      `;
      break;
    default:
      break;
  }

  // 3. TORSO & OUTFIT LAYER
  let outfitSvg = '';
  switch (outfit) {
    case 'sport_jersey': // Signature white/red/black stripe athletic jersey with chest crest from Image 2
      outfitSvg = `
        <g class="layer-outfit">
          <!-- Pants & Shoes -->
          <rect x="34" y="82" width="32" height="9" fill="#1e293b"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Torso base (White) -->
          <path d="M30 62 C30 58 70 58 70 62 L68 83 C68 86 64 87 62 87 L38 87 C36 87 32 86 32 83 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <!-- Arms -->
          <path d="M31 63 L22 75 L28 78 L33 69 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M22 75 L25 79" stroke="#dc2626" stroke-width="2"/>
          <path d="M69 63 L78 75 L72 78 L67 69 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M78 75 L75 79" stroke="#dc2626" stroke-width="2"/>
          <!-- Bold Red Horizontal Stripe -->
          <path d="M31 70 L69 70 L68 76 L32 76 Z" fill="#dc2626"/>
          <!-- Bold Black Horizontal Stripe -->
          <path d="M32 77 L68 77 L67 83 L33 83 Z" fill="#0f172a"/>
          <!-- Chest Crest Shield (Baseball Home Plate Emblem from Image 2) -->
          <polygon points="50,67 54,71 53,77 47,77 46,71" fill="#ffffff" stroke="#0f172a" stroke-width="0.8"/>
        </g>
      `;
      break;

    case 'yellow_tee': // Bright Yellow T-Shirt with blue pants from Image 2 left
      outfitSvg = `
        <g class="layer-outfit">
          <!-- Blue Jeans & Shoes -->
          <rect x="34" y="81" width="32" height="10" fill="#2563eb"/>
          <circle cx="50" cy="85" r="1.5" fill="#f8fafc"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Yellow T-Shirt Torso -->
          <path d="M30 62 C30 58 70 58 70 62 L68 82 C68 85 64 86 62 86 L38 86 C36 86 32 85 32 82 Z" fill="#facc15" stroke="#0f172a" stroke-width="2"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 75 L28 78 L33 69 Z" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 75 L72 78 L67 69 Z" fill="#facc15" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Crew Collar Arc -->
          <path d="M43 62 Q50 67 57 62" stroke="#ca8a04" stroke-width="2" fill="none"/>
        </g>
      `;
      break;

    case 'blue_hoodie':
      outfitSvg = `
        <g class="layer-outfit">
          <!-- Pants & Shoes -->
          <rect x="34" y="82" width="32" height="9" fill="#1e293b"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Blue Hoodie Body -->
          <path d="M30 62 C30 58 70 58 70 62 L68 83 C68 86 64 87 62 87 L38 87 C36 87 32 86 32 83 Z" fill="#2563eb" stroke="#0f172a" stroke-width="2"/>
          <!-- Kangaroo Pouch -->
          <rect x="39" y="73" width="22" height="10" rx="2" fill="#1d4ed8" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Drawstrings -->
          <line x1="46" y1="63" x2="46" y2="72" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="54" y1="63" x2="54" y2="72" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 76 L28 79 L33 69 Z" fill="#2563eb" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 76 L72 79 L67 69 Z" fill="#2563eb" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'black_jacket':
      outfitSvg = `
        <g class="layer-outfit">
          <rect x="34" y="82" width="32" height="9" fill="#475569"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- White Graphic Tee inside -->
          <path d="M32 62 L68 62 L66 84 L34 84 Z" fill="#ffffff"/>
          <path d="M48 68 L52 74 L49 74 L53 80" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
          <!-- Biker Leather Jacket Lapels -->
          <path d="M30 62 L43 62 L39 85 L32 85 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M70 62 L57 62 L61 85 L68 85 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 76 L28 79 L33 69 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 76 L72 79 L67 69 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'striped_sailor':
      outfitSvg = `
        <g class="layer-outfit">
          <rect x="34" y="82" width="32" height="9" fill="#1e3a8a"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Torso base -->
          <path d="M30 62 C30 58 70 58 70 62 L68 83 C68 86 64 87 62 87 L38 87 C36 87 32 86 32 83 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <!-- Horizontal sailor navy stripes -->
          <rect x="31" y="66" width="38" height="3" fill="#1e3a8a"/>
          <rect x="32" y="72" width="36" height="3" fill="#1e3a8a"/>
          <rect x="33" y="78" width="34" height="3" fill="#1e3a8a"/>
          <path d="M31 63 L22 75 L28 78 L33 69 Z" fill="#1e3a8a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 75 L72 78 L67 69 Z" fill="#1e3a8a" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'formal_suit':
      outfitSvg = `
        <g class="layer-outfit">
          <rect x="34" y="82" width="32" height="9" fill="#0f172a"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Tuxedo White Shirt -->
          <path d="M32 62 L68 62 L66 85 L34 85 Z" fill="#ffffff"/>
          <!-- Black Tie -->
          <polygon points="50,65 52,70 51,79 49,79 48,70" fill="#0f172a"/>
          <!-- Black Blazer Lapels -->
          <path d="M30 62 L42 62 L37 86 L32 86 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M70 62 L58 62 L63 86 L68 86 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="39" cy="72" r="1.8" fill="#dc2626"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 76 L28 79 L33 69 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 76 L72 79 L67 69 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'red_flannel':
      outfitSvg = `
        <g class="layer-outfit">
          <rect x="34" y="82" width="32" height="9" fill="#1e293b"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#0f172a"/>
          <!-- Red base -->
          <path d="M30 62 C30 58 70 58 70 62 L68 83 C68 86 64 87 62 87 L38 87 C36 87 32 86 32 83 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="2"/>
          <!-- Plaid grid -->
          <rect x="31" y="68" width="38" height="3" fill="#1e293b" opacity="0.6"/>
          <rect x="32" y="76" width="36" height="3" fill="#1e293b" opacity="0.6"/>
          <line x1="42" y1="62" x2="42" y2="86" stroke="#1e293b" stroke-width="2.5" opacity="0.6"/>
          <line x1="58" y1="62" x2="58" y2="86" stroke="#1e293b" stroke-width="2.5" opacity="0.6"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 75 L28 78 L33 69 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 75 L72 78 L67 69 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'hero_cape':
      outfitSvg = `
        <g class="layer-outfit">
          <!-- Cape fluttering behind -->
          <path d="M26 62 Q16 76 22 88 Q30 84 32 74 Z" fill="#dc2626"/>
          <path d="M74 62 Q84 76 78 88 Q70 84 68 74 Z" fill="#dc2626"/>
          <rect x="34" y="82" width="32" height="9" fill="#1e3a8a"/>
          <rect x="32" y="88" width="15" height="7" rx="3.5" fill="#dc2626"/>
          <rect x="53" y="88" width="15" height="7" rx="3.5" fill="#dc2626"/>
          <!-- Hero Suit -->
          <path d="M30 62 C30 58 70 58 70 62 L68 83 C68 86 64 87 62 87 L38 87 C36 87 32 86 32 83 Z" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
          <!-- Golden chest star / emblem -->
          <polygon points="50,67 52,71 56,71 53,74 54,78 50,75 46,78 47,74 44,71 48,71" fill="#fbbf24"/>
          <!-- Sleeves -->
          <path d="M31 63 L22 75 L28 78 L33 69 Z" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
          <path d="M69 63 L78 75 L72 78 L67 69 Z" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
        </g>
      `;
      break;

    default:
      break;
  }

  // 4. HEAD & FACE BASE (The signature Wayground Qbit geometry)
  const headSvg = `
    <g class="layer-head">
      <!-- Stubby ears -->
      <circle cx="22" cy="44" r="4.2" fill="${skin}" stroke="#0f172a" stroke-width="1.8"/>
      <circle cx="78" cy="44" r="4.2" fill="${skin}" stroke="#0f172a" stroke-width="1.8"/>
      <!-- Chubby rounded head shape -->
      <rect x="22" y="24" width="56" height="42" rx="21" ry="20" fill="${skin}" stroke="#0f172a" stroke-width="2.6"/>
      <rect x="22" y="24" width="56" height="42" rx="21" ry="20" fill="url(#${gradId})"/>
    </g>
  `;

  // 5. EYES & EXPRESSION LAYER
  let eyesSvg = '';
  switch (eye) {
    case 'happy_curves': // Cheerful arc eyes ^ ^
      eyesSvg = `
        <g class="layer-eyes">
          <path d="M33 46 Q40 37 47 46" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M53 46 Q60 37 67 46" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'wink':
      eyesSvg = `
        <g class="layer-eyes">
          <path d="M33 46 Q40 40 47 46" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="45" rx="4.8" ry="6.8" transform="rotate(6 60 45)" fill="#0f172a"/>
          <ellipse cx="58.5" cy="42.5" rx="1.6" ry="2.2" fill="#ffffff"/>
        </g>
      `;
      break;

    case 'anime_sparkle':
      eyesSvg = `
        <g class="layer-eyes">
          <ellipse cx="40" cy="45" rx="5.5" ry="7.5" fill="#0f172a"/>
          <circle cx="38" cy="42" r="2.2" fill="#ffffff"/>
          <circle cx="42" cy="48" r="1.2" fill="#ffffff"/>
          <polygon points="41,41 42,43 44,43 42.5,44 43,46 41,44.5 39,46 39.5,44 38,43 40,43" fill="#bae6fd"/>
          <ellipse cx="60" cy="45" rx="5.5" ry="7.5" fill="#0f172a"/>
          <circle cx="58" cy="42" r="2.2" fill="#ffffff"/>
          <circle cx="62" cy="48" r="1.2" fill="#ffffff"/>
          <polygon points="61,41 62,43 64,43 62.5,44 63,46 61,44.5 59,46 59.5,44 58,43 60,43" fill="#bae6fd"/>
        </g>
      `;
      break;

    case 'cool_shades':
      eyesSvg = `
        <g class="layer-eyes">
          <rect x="27" y="38" width="20" height="13" rx="3" fill="#0f172a"/>
          <rect x="53" y="38" width="20" height="13" rx="3" fill="#0f172a"/>
          <line x1="47" y1="42" x2="53" y2="42" stroke="#0f172a" stroke-width="3"/>
          <line x1="29" y1="41" x2="43" y2="41" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
          <line x1="55" y1="41" x2="69" y2="41" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        </g>
      `;
      break;

    case 'shocked':
      eyesSvg = `
        <g class="layer-eyes">
          <circle cx="39" cy="44" r="6" fill="#ffffff" stroke="#0f172a" stroke-width="2.2"/>
          <circle cx="39" cy="44" r="2.2" fill="#0f172a"/>
          <circle cx="61" cy="44" r="6" fill="#ffffff" stroke="#0f172a" stroke-width="2.2"/>
          <circle cx="61" cy="44" r="2.2" fill="#0f172a"/>
          <!-- Blue nervous sweatdrop -->
          <path d="M72 36 Q75 32 74 38 Q72 40 70 38 Z" fill="#38bdf8"/>
        </g>
      `;
      break;

    case 'sleepy':
      eyesSvg = `
        <g class="layer-eyes">
          <line x1="33" y1="45" x2="47" y2="45" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
          <line x1="53" y1="45" x2="67" y2="45" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'star_eyes':
      eyesSvg = `
        <g class="layer-eyes">
          <polygon points="40,38 42,43 47,43 43,46 45,51 40,48 35,51 37,46 33,43 38,43" fill="#fbbf24" stroke="#0f172a" stroke-width="1.2"/>
          <polygon points="60,38 62,43 67,43 63,46 65,51 60,48 55,51 57,46 53,43 58,43" fill="#fbbf24" stroke="#0f172a" stroke-width="1.2"/>
        </g>
      `;
      break;

    default: // 'qbit_oval' - The EXACT signature tilted black ovals with glossy shine from Image 2!
      eyesSvg = `
        <g class="layer-eyes">
          <ellipse cx="40" cy="45" rx="4.8" ry="6.8" transform="rotate(-6 40 45)" fill="#0f172a"/>
          <ellipse cx="38.5" cy="42.5" rx="1.6" ry="2.2" fill="#ffffff"/>
          <ellipse cx="60" cy="45" rx="4.8" ry="6.8" transform="rotate(6 60 45)" fill="#0f172a"/>
          <ellipse cx="58.5" cy="42.5" rx="1.6" ry="2.2" fill="#ffffff"/>
        </g>
      `;
      break;
  }

  // 6. MOUTH & CHEEK LAYER
  let mouthSvg = '';
  switch (mouth) {
    case 'happy_open':
      mouthSvg = `
        <g class="layer-mouth">
          <path d="M44 52 Q50 63 56 52 Z" fill="#e11d48" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M46 56 Q50 62 54 56 Z" fill="#fb7185"/>
        </g>
      `;
      break;

    case 'cat_mouth':
      mouthSvg = `
        <g class="layer-mouth">
          <path d="M44 54 Q47 57 50 54 Q53 57 56 54" stroke="#0f172a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'smirk':
      mouthSvg = `
        <g class="layer-mouth">
          <path d="M46 55 Q53 56 57 51" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'grin_teeth':
      mouthSvg = `
        <g class="layer-mouth">
          <path d="M43 52 Q50 61 57 52 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          <line x1="43" y1="52" x2="57" y2="52" stroke="#0f172a" stroke-width="1.2"/>
        </g>
      `;
      break;

    case 'whistle':
      mouthSvg = `
        <g class="layer-mouth">
          <ellipse cx="50" cy="54" rx="2.4" ry="2.8" fill="#0f172a"/>
        </g>
      `;
      break;

    default: // 'cute_smile' - The EXACT gentle arc from Image 2
      mouthSvg = `
        <g class="layer-mouth">
          <path d="M46 54 Q50 58 54 54" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
      `;
      break;
  }

  // 7. FRONT HAIR LAYER (Crown and forehead styling)
  let frontHairSvg = '';
  switch (hair) {
    case 'anime_spiky': // Spiky anime hair tuft from Image 2 left!
      frontHairSvg = `
        <g class="layer-front-hair">
          <!-- Main dark spiky silhouette -->
          <path d="M24 38 C22 24 34 14 44 13 C47 7 53 6 54 12 C58 7 64 8 66 14 C75 16 78 26 76 38 C74 32 68 28 65 30 C62 33 58 29 55 31 C51 34 46 29 42 32 C38 35 34 31 30 36 C27 38 25 38 24 38 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <!-- Spiky front tuft highlight (matching Image 2) -->
          <path d="M48 14 C51 8 55 9 53 17 Z" fill="#475569"/>
          <path d="M40 22 C44 16 48 18 46 25 Z" fill="#475569"/>
        </g>
      `;
      break;

    case 'flowing_dark':
      frontHairSvg = `
        <g class="layer-front-hair">
          <path d="M23 34 C28 20 40 18 50 18 C60 18 72 20 77 34 C72 27 62 25 50 25 C38 25 28 27 23 34 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
        </g>
      `;
      break;

    case 'slick_back':
      frontHairSvg = `
        <g class="layer-front-hair">
          <path d="M23 35 C23 20 35 15 50 15 C65 15 77 20 77 35 C74 27 64 24 50 24 C36 24 26 27 23 35 Z" fill="#0f172a" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M38 19 Q50 17 62 19" stroke="#475569" stroke-width="1.4" fill="none"/>
        </g>
      `;
      break;

    case 'curly_afro':
      frontHairSvg = `
        <g class="layer-front-hair">
          <circle cx="34" cy="24" r="10" fill="#1e293b"/>
          <circle cx="50" cy="20" r="11" fill="#1e293b"/>
          <circle cx="66" cy="24" r="10" fill="#1e293b"/>
        </g>
      `;
      break;

    case 'bob_bangs':
      frontHairSvg = `
        <g class="layer-front-hair">
          <path d="M22 36 C22 20 34 16 50 16 C66 16 78 20 78 36 C74 34 74 28 66 28 C58 28 58 31 50 31 C42 31 42 28 34 28 C26 28 26 34 22 36 Z" fill="#78350f" stroke="#0f172a" stroke-width="1.8"/>
        </g>
      `;
      break;

    case 'ponytail':
      frontHairSvg = `
        <g class="layer-front-hair">
          <path d="M23 34 C25 22 36 18 50 18 C64 18 75 22 77 34 C73 28 64 25 50 25 C36 25 27 28 23 34 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
        </g>
      `;
      break;

    case 'messy_fluff':
      frontHairSvg = `
        <g class="layer-front-hair">
          <path d="M24 35 C23 23 33 16 43 15 C46 11 50 11 53 14 C57 10 63 12 65 16 C73 17 77 25 76 35 C73 31 69 29 66 32 C62 30 58 32 55 30 C51 33 47 30 43 33 C39 31 35 33 31 31 C27 34 25 35 24 35 Z" fill="#b45309" stroke="#0f172a" stroke-width="1.8"/>
        </g>
      `;
      break;

    default:
      break;
  }

  // 8. NECK ACCESSORY (Red knotted neck scarf from Image 2, etc.)
  let accSvg = '';
  switch (accessory) {
    case 'red_scarf': // The signature tied crimson neck scarf with fluttering tails from Image 2!
      accSvg = `
        <g class="layer-accessory">
          <!-- Collar puff wrap -->
          <path d="M38 61 Q50 67 62 61 Q60 67 50 69 Q40 67 38 61 Z" fill="#b91c1c" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Knotted scarf center rosette/knot -->
          <ellipse cx="50" cy="65" rx="6.5" ry="5" fill="#dc2626" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Left scarf tail fluttering down (matching Image 2) -->
          <path d="M47 67 C40 73 37 81 44 85 C48 80 50 74 49 67 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1.2"/>
          <!-- Right scarf tail folded (matching Image 2) -->
          <path d="M52 67 C58 72 63 80 57 84 C54 79 52 73 52 67 Z" fill="#ef4444" stroke="#0f172a" stroke-width="1.2"/>
        </g>
      `;
      break;

    case 'gold_chain':
      accSvg = `
        <g class="layer-accessory">
          <path d="M40 62 Q50 72 60 62" stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="71" r="3.5" fill="#f59e0b" stroke="#0f172a" stroke-width="1"/>
          <polygon points="50,69 51,70.5 53,70.5 51.5,72 52,73.5 50,72.5 48,73.5 48.5,72 47,70.5 49,70.5" fill="#ffffff"/>
        </g>
      `;
      break;

    case 'bowtie':
      accSvg = `
        <g class="layer-accessory">
          <polygon points="44,63 44,69 50,66" fill="#dc2626" stroke="#0f172a" stroke-width="1"/>
          <polygon points="56,63 56,69 50,66" fill="#dc2626" stroke="#0f172a" stroke-width="1"/>
          <circle cx="50" cy="66" r="2.5" fill="#991b1b" stroke="#0f172a" stroke-width="1"/>
        </g>
      `;
      break;

    case 'nerd_glasses':
      accSvg = `
        <g class="layer-accessory">
          <rect x="33" y="38" width="14" height="13" rx="4" stroke="#e11d48" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/>
          <rect x="53" y="38" width="14" height="13" rx="4" stroke="#e11d48" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/>
          <line x1="47" y1="44" x2="53" y2="44" stroke="#e11d48" stroke-width="2.2"/>
        </g>
      `;
      break;

    case 'bandaid':
      accSvg = `
        <g class="layer-accessory">
          <rect x="30" y="50" width="8" height="4" rx="1.5" transform="rotate(-20 30 50)" fill="#fed7aa" stroke="#d97706" stroke-width="0.8"/>
        </g>
      `;
      break;

    default:
      break;
  }

  // 9. HEADWEAR & HATS LAYER (Bandana wrap from Image 2, headphones from Image 1, etc.)
  let hatSvg = '';
  switch (hat) {
    case 'pirate_wrap': // Signature navy bandana wrap with seam folds from Image 2 right!
      hatSvg = `
        <g class="layer-hat">
          <!-- Main bandana dome -->
          <path d="M22 34 C22 17 34 12 50 12 C66 12 78 17 78 34 C74 30 65 29 50 29 C35 29 26 30 22 34 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <!-- Bandana forehead fold seam (matching Image 2) -->
          <path d="M22 34 Q50 28 78 34 Q50 36 22 34 Z" fill="#334155" stroke="#0f172a" stroke-width="1"/>
          <!-- Knot tied on side -->
          <path d="M76 34 L82 38 L78 42 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1"/>
        </g>
      `;
      break;

    case 'headphones': // Gamer headphones from Image 1!
      hatSvg = `
        <g class="layer-hat">
          <path d="M20 44 A30 30 0 0 1 80 44" stroke="#0f172a" stroke-width="5" fill="none"/>
          <path d="M24 43 A26 26 0 0 1 76 43" stroke="#f43f5e" stroke-width="2" fill="none"/>
          <!-- Left earcup -->
          <rect x="15" y="34" width="10" height="20" rx="4" fill="#ec4899" stroke="#0f172a" stroke-width="2"/>
          <rect x="17" y="38" width="6" height="12" rx="2" fill="#be185d"/>
          <!-- Right earcup -->
          <rect x="75" y="34" width="10" height="20" rx="4" fill="#ec4899" stroke="#0f172a" stroke-width="2"/>
          <rect x="77" y="38" width="6" height="12" rx="2" fill="#be185d"/>
        </g>
      `;
      break;

    case 'baseball_cap':
      hatSvg = `
        <g class="layer-hat">
          <path d="M25 32 C25 20 37 16 50 16 C63 16 75 20 75 32 Z" fill="#2563eb" stroke="#0f172a" stroke-width="2"/>
          <!-- Cap visor bill -->
          <path d="M68 31 C84 31 86 35 76 38 C68 38 64 33 68 31 Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="50" cy="16" r="2" fill="#fbbf24"/>
        </g>
      `;
      break;

    case 'golden_crown':
      hatSvg = `
        <g class="layer-hat">
          <polygon points="28,26 33,12 42,20 50,9 58,20 67,12 72,26" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
          <circle cx="50" cy="9" r="2.5" fill="#f43f5e"/>
          <circle cx="33" cy="12" r="2.2" fill="#38bdf8"/>
          <circle cx="67" cy="12" r="2.2" fill="#34d399"/>
          <rect x="29" y="24" width="42" height="4" rx="1" fill="#f59e0b"/>
        </g>
      `;
      break;

    case 'beanie':
      hatSvg = `
        <g class="layer-hat">
          <path d="M24 32 C24 16 36 12 50 12 C64 12 76 16 76 32 Z" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
          <!-- Rolled cuff -->
          <rect x="22" y="28" width="56" height="7" rx="3.5" fill="#0369a1" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="50" cy="11" r="3.5" fill="#bae6fd"/>
        </g>
      `;
      break;

    case 'party_hat':
      hatSvg = `
        <g class="layer-hat">
          <polygon points="50,4 34,26 66,26" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>
          <circle cx="50" cy="4" r="3.5" fill="#fbbf24"/>
          <line x1="42" y1="15" x2="58" y2="15" stroke="#fbbf24" stroke-width="2"/>
          <line x1="38" y1="21" x2="62" y2="21" stroke="#38bdf8" stroke-width="2"/>
        </g>
      `;
      break;

    case 'halo':
      hatSvg = `
        <g class="layer-hat">
          <ellipse cx="50" cy="14" rx="26" ry="6" stroke="#fbbf24" stroke-width="3.5" fill="none"/>
          <ellipse cx="50" cy="14" rx="26" ry="6" stroke="#fef08a" stroke-width="1.5" fill="none"/>
        </g>
      `;
      break;

    case 'viking_horns':
      hatSvg = `
        <g class="layer-hat">
          <!-- Iron helm -->
          <path d="M26 30 C26 18 36 15 50 15 C64 15 74 18 74 30 Z" fill="#64748b" stroke="#0f172a" stroke-width="2"/>
          <!-- Left horn -->
          <path d="M26 26 C16 22 14 10 18 8 C18 16 26 20 28 24 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8"/>
          <!-- Right horn -->
          <path d="M74 26 C84 22 86 10 82 8 C82 16 74 20 72 24 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8"/>
        </g>
      `;
      break;

    default:
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="avatar-svg qbit-avatar">
      <defs>
        <radialGradient id="${gradId}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
          <stop offset="70%" stop-color="#000000" stop-opacity="0.0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
        </radialGradient>
      </defs>
      <!-- Ground Contact Shadow -->
      <ellipse cx="50" cy="94" rx="26" ry="4" fill="rgba(0, 0, 0, 0.35)"/>
      <!-- Layer 1: Backpack -->
      ${backpackSvg}
      <!-- Layer 2: Back Hair -->
      ${backHairSvg}
      <!-- Layer 3: Outfit / Torso -->
      ${outfitSvg}
      <!-- Layer 4: Head & Ears -->
      ${headSvg}
      <!-- Layer 5: Eyes -->
      ${eyesSvg}
      <!-- Layer 6: Mouth -->
      ${mouthSvg}
      <!-- Layer 7: Front Hair -->
      ${frontHairSvg}
      <!-- Layer 8: Neck Accessory -->
      ${accSvg}
      <!-- Layer 9: Headwear / Hat -->
      ${hatSvg}
    </svg>
  `.trim();
}
