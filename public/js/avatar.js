// Modular Avatar Customizer

export const AVATAR_OPTIONS = {
  skinColors: [
    '#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#34d399', 
    '#a855f7', '#fb923c', '#e879f9', '#4ade80', '#94a3b8'
  ],
  eyes: ['normal', 'happy', 'wink', 'cool', 'stars', 'shock', 'derp', 'sleepy'],
  mouths: ['smile', 'grin', 'tongue', 'mustache', 'open', 'smirk', 'neutral'],
  accessories: ['none', 'party_hat', 'crown', 'cap', 'headphones', 'halo', 'glasses']
};

export function getRandomAvatar() {
  const skins = AVATAR_OPTIONS.skinColors;
  const eyes = AVATAR_OPTIONS.eyes;
  const mouths = AVATAR_OPTIONS.mouths;
  const accessories = AVATAR_OPTIONS.accessories;

  return {
    skinColor: skins[Math.floor(Math.random() * skins.length)],
    eye: eyes[Math.floor(Math.random() * eyes.length)],
    mouth: mouths[Math.floor(Math.random() * mouths.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)]
  };
}

export function renderAvatarSvg(avatar = {}, size = 64) {
  const skin = avatar.skinColor || '#38bdf8';
  const eye = avatar.eye || 'normal';
  const mouth = avatar.mouth || 'smile';
  const accessory = avatar.accessory || 'none';

  let eyeSvg = '';
  switch (eye) {
    case 'happy':
      eyeSvg = `
        <path d="M28 42 Q36 34 44 42" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M56 42 Q64 34 72 42" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'wink':
      eyeSvg = `
        <circle cx="36" cy="40" r="5" fill="#0f172a"/>
        <path d="M56 42 Q64 34 72 42" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'cool':
      eyeSvg = `
        <rect x="24" y="34" width="24" height="14" rx="4" fill="#0f172a"/>
        <rect x="52" y="34" width="24" height="14" rx="4" fill="#0f172a"/>
        <line x1="48" y1="40" x2="52" y2="40" stroke="#0f172a" stroke-width="4"/>
      `;
      break;
    case 'stars':
      eyeSvg = `
        <path d="M36 34 L38 39 L43 40 L39 43 L40 48 L36 45 L32 48 L33 43 L29 40 L34 39 Z" fill="#fbbf24"/>
        <path d="M64 34 L66 39 L71 40 L67 43 L68 48 L64 45 L60 48 L61 43 L57 40 L62 39 Z" fill="#fbbf24"/>
      `;
      break;
    case 'shock':
      eyeSvg = `
        <circle cx="36" cy="40" r="7" fill="#fff" stroke="#0f172a" stroke-width="3"/>
        <circle cx="36" cy="40" r="3" fill="#0f172a"/>
        <circle cx="64" cy="40" r="7" fill="#fff" stroke="#0f172a" stroke-width="3"/>
        <circle cx="64" cy="40" r="3" fill="#0f172a"/>
      `;
      break;
    case 'derp':
      eyeSvg = `
        <circle cx="34" cy="38" r="6" fill="#fff" stroke="#0f172a" stroke-width="3"/>
        <circle cx="32" cy="36" r="2.5" fill="#0f172a"/>
        <circle cx="66" cy="42" r="6" fill="#fff" stroke="#0f172a" stroke-width="3"/>
        <circle cx="68" cy="44" r="2.5" fill="#0f172a"/>
      `;
      break;
    case 'sleepy':
      eyeSvg = `
        <line x1="28" y1="40" x2="44" y2="40" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
        <line x1="56" y1="40" x2="72" y2="40" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
      `;
      break;
    default: // normal
      eyeSvg = `
        <circle cx="36" cy="40" r="5" fill="#0f172a"/>
        <circle cx="64" cy="40" r="5" fill="#0f172a"/>
        <circle cx="38" cy="38" r="1.5" fill="#fff"/>
        <circle cx="66" cy="38" r="1.5" fill="#fff"/>
      `;
      break;
  }

  let mouthSvg = '';
  switch (mouth) {
    case 'grin':
      mouthSvg = `
        <path d="M34 56 Q50 74 66 56 Z" fill="#fff" stroke="#0f172a" stroke-width="3"/>
        <line x1="34" y1="56" x2="66" y2="56" stroke="#0f172a" stroke-width="2"/>
      `;
      break;
    case 'tongue':
      mouthSvg = `
        <path d="M36 56 Q50 68 64 56" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M46 62 C46 72 54 72 54 62 Z" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>
      `;
      break;
    case 'mustache':
      mouthSvg = `
        <path d="M32 58 C40 52 48 64 50 58 C52 64 60 52 68 58 C64 66 56 62 50 64 C44 62 36 66 32 58 Z" fill="#334155"/>
        <path d="M42 68 Q50 72 58 68" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'open':
      mouthSvg = `
        <ellipse cx="50" cy="62" rx="8" ry="9" fill="#0f172a"/>
      `;
      break;
    case 'smirk':
      mouthSvg = `
        <path d="M40 60 Q54 60 62 54" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
      break;
    case 'neutral':
      mouthSvg = `
        <line x1="38" y1="60" x2="62" y2="60" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
      `;
      break;
    default: // smile
      mouthSvg = `
        <path d="M36 56 Q50 72 64 56" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
      break;
  }

  let accSvg = '';
  switch (accessory) {
    case 'party_hat':
      accSvg = `
        <polygon points="50,4 34,26 66,26" fill="#f43f5e" stroke="#0f172a" stroke-width="2.5"/>
        <circle cx="50" cy="4" r="4" fill="#fbbf24"/>
        <line x1="42" y1="15" x2="58" y2="15" stroke="#fbbf24" stroke-width="2"/>
      `;
      break;
    case 'crown':
      accSvg = `
        <polygon points="30,26 34,12 42,20 50,10 58,20 66,12 70,26" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="50" cy="10" r="2.5" fill="#f43f5e"/>
        <circle cx="34" cy="12" r="2.5" fill="#38bdf8"/>
        <circle cx="66" cy="12" r="2.5" fill="#34d399"/>
      `;
      break;
    case 'cap':
      accSvg = `
        <path d="M26 26 Q50 14 74 26 Z" fill="#3b82f6" stroke="#0f172a" stroke-width="2"/>
        <path d="M68 26 Q86 28 84 32 Q68 32 68 26 Z" fill="#1d4ed8"/>
      `;
      break;
    case 'headphones':
      accSvg = `
        <path d="M20 50 A30 30 0 0 1 80 50" stroke="#0f172a" stroke-width="6" fill="none"/>
        <rect x="14" y="40" width="10" height="20" rx="4" fill="#ec4899" stroke="#0f172a" stroke-width="2"/>
        <rect x="76" y="40" width="10" height="20" rx="4" fill="#ec4899" stroke="#0f172a" stroke-width="2"/>
      `;
      break;
    case 'halo':
      accSvg = `
        <ellipse cx="50" cy="16" rx="26" ry="6" stroke="#fbbf24" stroke-width="4" fill="none"/>
      `;
      break;
    case 'glasses':
      accSvg = `
        <rect x="22" y="32" width="24" height="18" rx="3" stroke="#e11d48" stroke-width="3" fill="rgba(255,255,255,0.2)"/>
        <rect x="54" y="32" width="24" height="18" rx="3" stroke="#e11d48" stroke-width="3" fill="rgba(255,255,255,0.2)"/>
        <line x1="46" y1="40" x2="54" y2="40" stroke="#e11d48" stroke-width="3"/>
      `;
      break;
    default:
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="avatar-svg">
      <defs>
        <radialGradient id="grad-${skin.replace('#', '')}" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
      <!-- Base Face -->
      <circle cx="50" cy="50" r="38" fill="${skin}" stroke="#0f172a" stroke-width="3.5"/>
      <circle cx="50" cy="50" r="38" fill="url(#grad-${skin.replace('#', '')})"/>
      <!-- Features -->
      ${eyeSvg}
      ${mouthSvg}
      ${accSvg}
    </svg>
  `;
}
