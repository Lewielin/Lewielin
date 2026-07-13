// ===================== 動漫風角色立繪產生器 =====================
// 以純 SVG 手繪組合出Q版動漫風半身像，避免外部圖片資源，
// 並用漸層 + 陰影模擬立體光影。

let _portraitUidCounter = 0;

const CHAR_ART_CONFIG = {
  chief: {
    skin: "#ffe0c2", skinShadow: "#e8b488",
    hair: "#d8d8dc", hairShadow: "#aeaeb4",
    outfit: "#5c8a54", outfitShadow: "#3e6238",
    eye: "#6b4a2f",
    hairStyle: "combover",
    accessory: "megaphone",
    blush: true,
  },
  influencer: {
    skin: "#ffe6d9", skinShadow: "#f0b8a0",
    hair: "#ff7ecb", hairShadow: "#d94fa0",
    outfit: "#7c4dff", outfitShadow: "#5a32c9",
    eye: "#7c4dff",
    hairStyle: "twintail",
    accessory: "phone",
    blush: true,
  },
  scholar: {
    skin: "#ffe3cc", skinShadow: "#e6b590",
    hair: "#242c45", hairShadow: "#141a2c",
    outfit: "#23395d", outfitShadow: "#152441",
    eye: "#2d4a7c",
    hairStyle: "sidepart",
    accessory: "glasses",
    blush: false,
  },
  ironfist: {
    skin: "#f2d3b3", skinShadow: "#cf9f75",
    hair: "#1b1b1f", hairShadow: "#050506",
    outfit: "#8b1e1e", outfitShadow: "#5c1010",
    eye: "#1b1b1f",
    hairStyle: "spiky",
    accessory: "armor",
    blush: false,
  },
  grassroots: {
    skin: "#ffe1c7", skinShadow: "#e8ac82",
    hair: "#8a5a34", hairShadow: "#603d20",
    outfit: "#4caf50", outfitShadow: "#357a38",
    eye: "#3f6b2e",
    hairStyle: "messy",
    accessory: "sprout",
    blush: true,
  },
};

function hairShapeMarkup(style, hair, hairShadow) {
  switch (style) {
    case "combover":
      return `
        <ellipse cx="70" cy="42" rx="34" ry="24" fill="${hairShadow}"/>
        <ellipse cx="70" cy="40" rx="30" ry="20" fill="${hair}"/>
        <ellipse cx="46" cy="56" rx="9" ry="14" fill="${hair}"/>
        <ellipse cx="94" cy="56" rx="9" ry="14" fill="${hair}"/>`;
    case "twintail":
      return `
        <circle cx="70" cy="42" r="30" fill="${hair}"/>
        <ellipse cx="30" cy="80" rx="11" ry="30" fill="${hairShadow}" transform="rotate(-18 30 80)"/>
        <ellipse cx="110" cy="80" rx="11" ry="30" fill="${hairShadow}" transform="rotate(18 110 80)"/>
        <ellipse cx="30" cy="80" rx="8" ry="26" fill="${hair}" transform="rotate(-18 30 80)"/>
        <ellipse cx="110" cy="80" rx="8" ry="26" fill="${hair}" transform="rotate(18 110 80)"/>`;
    case "sidepart":
      return `
        <ellipse cx="70" cy="40" rx="31" ry="23" fill="${hair}"/>
        <path d="M42,44 Q60,20 96,34 Q80,30 60,40 Q50,44 42,52 Z" fill="${hairShadow}"/>`;
    case "spiky":
      return `
        <circle cx="70" cy="44" r="28" fill="${hair}"/>
        <path d="M42,40 L50,10 L58,36 L66,6 L74,36 L82,8 L90,36 L98,12 L100,42 Z" fill="${hair}"/>
        <path d="M42,40 L50,10 L54,34 Z" fill="${hairShadow}"/>
        <path d="M74,36 L82,8 L86,34 Z" fill="${hairShadow}"/>`;
    case "messy":
      return `
        <circle cx="70" cy="42" r="30" fill="${hair}"/>
        <circle cx="44" cy="36" r="12" fill="${hair}"/>
        <circle cx="96" cy="36" r="12" fill="${hair}"/>
        <circle cx="60" cy="18" r="11" fill="${hairShadow}"/>
        <circle cx="82" cy="20" r="10" fill="${hairShadow}"/>`;
    default:
      return "";
  }
}

function bangsMarkup(style, hair, hairShadow) {
  switch (style) {
    case "combover":
      return `<path d="M40,46 Q70,30 100,46 Q70,40 40,46 Z" fill="${hair}"/>`;
    case "twintail":
      return `<path d="M40,48 Q70,26 100,48 Q70,38 40,48 Z" fill="${hair}"/>`;
    case "sidepart":
      return `<path d="M40,50 Q55,26 70,32 Q85,24 100,44 Q75,34 60,42 Q48,46 40,50 Z" fill="${hair}"/>`;
    case "spiky":
      return `<path d="M40,52 Q70,34 100,50 Q70,44 40,52 Z" fill="${hair}"/>`;
    case "messy":
      return `<path d="M38,50 Q70,28 102,50 Q70,42 38,50 Z" fill="${hair}"/>`;
    default:
      return "";
  }
}

function accessoryMarkup(type) {
  switch (type) {
    case "megaphone":
      return `
        <g transform="translate(96,104) rotate(-20)">
          <path d="M0,10 L26,0 L26,26 L0,16 Z" fill="#ffd43b" stroke="#c99a10" stroke-width="1.5"/>
          <rect x="-8" y="9" width="10" height="8" rx="2" fill="#e8b93a"/>
        </g>`;
    case "phone":
      return `
        <g transform="translate(94,100)">
          <rect x="0" y="0" width="18" height="30" rx="4" fill="#2c2c34" stroke="#111" stroke-width="1"/>
          <rect x="2.5" y="3" width="13" height="22" rx="1" fill="#8fd8ff"/>
          <path d="M-6,-6 L-2,-14 L2,-6 L10,-10 L4,-2 L10,4 L2,0 L-2,8 L-6,0 L-14,4 L-8,-2 L-14,-10 Z"
                fill="#ffd43b" transform="translate(-4,-2) scale(0.5)"/>
        </g>`;
    case "glasses":
      return `
        <g stroke="#c9a227" stroke-width="2.5" fill="rgba(255,255,255,0.15)">
          <circle cx="58" cy="62" r="10"/>
          <circle cx="82" cy="62" r="10"/>
          <line x1="68" y1="62" x2="72" y2="62"/>
        </g>
        <rect x="92" y="102" width="20" height="15" rx="1.5" fill="#e8dcc0" stroke="#a88b3a" stroke-width="1"/>
        <line x1="94" y1="107" x2="110" y2="107" stroke="#a88b3a" stroke-width="1"/>
        <line x1="94" y1="111" x2="110" y2="111" stroke="#a88b3a" stroke-width="1"/>`;
    case "armor":
      return `
        <g transform="translate(96,96)">
          <ellipse cx="10" cy="14" rx="14" ry="20" fill="#9aa0a6"/>
          <ellipse cx="10" cy="14" rx="14" ry="20" fill="none" stroke="#5b6167" stroke-width="2"/>
          <line x1="0" y1="6" x2="20" y2="6" stroke="#5b6167" stroke-width="1.5"/>
          <line x1="0" y1="14" x2="20" y2="14" stroke="#5b6167" stroke-width="1.5"/>
          <line x1="0" y1="22" x2="20" y2="22" stroke="#5b6167" stroke-width="1.5"/>
        </g>`;
    case "sprout":
      return `
        <g transform="translate(70,10)">
          <path d="M0,20 C-10,10 -8,-4 0,-10 C8,-4 10,10 0,20 Z" fill="#4caf50"/>
          <path d="M0,20 C-6,12 -5,2 0,-4 C5,2 6,12 0,20 Z" fill="#7bc97e"/>
          <rect x="-1.5" y="14" width="3" height="14" fill="#6b4a2f"/>
        </g>`;
    default:
      return "";
  }
}

function buildPortrait(id) {
  const cfg = CHAR_ART_CONFIG[id];
  if (!cfg) return "";
  // 每次呼叫都產生唯一的 gradient/filter id，避免同一角色同時出現在
  // 棋盤代幣、玩家面板、選角卡片等多處時，SVG id 互相衝突導致無法渲染。
  const uid = `${id}-${(_portraitUidCounter++).toString(36)}`;
  const blush = cfg.blush
    ? `<ellipse cx="52" cy="72" rx="6" ry="3.5" fill="#ff9baf" opacity="0.55"/>
       <ellipse cx="88" cy="72" rx="6" ry="3.5" fill="#ff9baf" opacity="0.55"/>`
    : "";

  return `
  <svg viewBox="0 0 140 150" class="portrait-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="skin-${uid}" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${cfg.skin}"/>
        <stop offset="100%" stop-color="${cfg.skinShadow}"/>
      </radialGradient>
      <linearGradient id="outfit-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${cfg.outfit}"/>
        <stop offset="100%" stop-color="${cfg.outfitShadow}"/>
      </linearGradient>
      <filter id="shadow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <g filter="url(#shadow-${uid})">
      <ellipse cx="70" cy="142" rx="46" ry="7" fill="rgba(0,0,0,0.28)"/>

      <!-- 身體 / 服裝 -->
      <path d="M18,150 C18,108 40,90 70,90 C100,90 122,108 122,150 Z" fill="url(#outfit-${uid})"/>
      <path d="M18,150 C18,116 36,98 60,92 C50,108 46,130 50,150 Z" fill="rgba(255,255,255,0.08)"/>

      <!-- 髮型（後層） -->
      ${hairShapeMarkup(cfg.hairStyle, cfg.hair, cfg.hairShadow)}

      <!-- 耳朵 -->
      <circle cx="40" cy="66" r="7" fill="url(#skin-${uid})"/>
      <circle cx="100" cy="66" r="7" fill="url(#skin-${uid})"/>

      <!-- 脖子 -->
      <rect x="58" y="82" width="24" height="18" rx="6" fill="url(#skin-${uid})"/>

      <!-- 臉 -->
      <circle cx="70" cy="60" r="32" fill="url(#skin-${uid})"/>

      ${blush}

      <!-- 瀏海（前層） -->
      ${bangsMarkup(cfg.hairStyle, cfg.hair, cfg.hairShadow)}

      <!-- 眉毛 -->
      <path d="M50,50 Q57,45 64,49" stroke="${cfg.hairShadow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M76,49 Q83,45 90,50" stroke="${cfg.hairShadow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>

      <!-- 眼睛（動漫大眼） -->
      <g>
        <ellipse cx="57" cy="60" rx="8" ry="9.5" fill="#fff"/>
        <circle cx="57" cy="61" r="6" fill="${cfg.eye}"/>
        <circle cx="57" cy="61" r="2.6" fill="#111"/>
        <circle cx="54.5" cy="58" r="1.8" fill="#fff"/>
      </g>
      <g>
        <ellipse cx="83" cy="60" rx="8" ry="9.5" fill="#fff"/>
        <circle cx="83" cy="61" r="6" fill="${cfg.eye}"/>
        <circle cx="83" cy="61" r="2.6" fill="#111"/>
        <circle cx="80.5" cy="58" r="1.8" fill="#fff"/>
      </g>

      <!-- 嘴巴 -->
      <path d="M63,76 Q70,81 77,76" stroke="#a45a3c" stroke-width="2" fill="none" stroke-linecap="round"/>

      <!-- 配件 -->
      ${accessoryMarkup(cfg.accessory)}
    </g>
  </svg>`;
}

function getPortraitHTML(id) {
  return buildPortrait(id);
}
