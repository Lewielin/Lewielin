// ===================== 資料設定 =====================

const CHARACTERS = [
  {
    id: "chief",
    name: "里長伯・阿發",
    avatar: "🧓",
    ability: "親民加碼：每次經過起點多領 $100",
    cash: 2500,
  },
  {
    id: "influencer",
    name: "網紅議員・小澤",
    avatar: "🤳",
    ability: "聲量紅利：機會卡獲得的金額 ×1.5",
    cash: 2000,
  },
  {
    id: "scholar",
    name: "學者型政務官・林教授",
    avatar: "🧑‍🏫",
    ability: "專業加值：收租金 +10%",
    cash: 2000,
  },
  {
    id: "ironfist",
    name: "鐵血市長・鐵昆",
    avatar: "🦾",
    ability: "撙節鐵腕：繳稅金額 -20%",
    cash: 2000,
  },
  {
    id: "grassroots",
    name: "草根崛起・小草",
    avatar: "🌱",
    ability: "小額募款：每次經過起點額外 +50",
    cash: 1800,
  },
];

const PLAYER_COLORS = ["#ff6b6b", "#4dabf7", "#69db7c", "#ffd43b"];

// 24 格棋盤
const BOARD = [
  { id: 0, name: "起點｜出發拉票", type: "go" },
  { id: 1, name: "社會住宅計畫", type: "property", group: "A", price: 600, rent: 40 },
  { id: 2, name: "機會卡｜政治時事", type: "chance" },
  { id: 3, name: "育兒津貼方案", type: "property", group: "A", price: 600, rent: 40 },
  { id: 4, name: "財產申報稅", type: "tax", amount: 150 },
  { id: 5, name: "觀光振興計畫", type: "property", group: "B", price: 800, rent: 60 },
  { id: 6, name: "命運卡｜選民心聲", type: "fate" },
  { id: 7, name: "交通建設方案", type: "property", group: "B", price: 900, rent: 60 },
  { id: 8, name: "能源轉型計畫", type: "property", group: "B", price: 900, rent: 60 },
  { id: 9, name: "接受調查（只是路過）", type: "investigation" },
  { id: 10, name: "長照制度改革", type: "property", group: "C", price: 1000, rent: 80 },
  { id: 11, name: "機會卡｜政治時事", type: "chance" },
  { id: 12, name: "數位治理計畫", type: "property", group: "C", price: 1000, rent: 80 },
  { id: 13, name: "教育改革方案", type: "property", group: "C", price: 1100, rent: 80 },
  { id: 14, name: "造勢晚會｜政治獻金", type: "rally", amount: 200 },
  { id: 15, name: "農業補貼方案", type: "property", group: "D", price: 1200, rent: 100 },
  { id: 16, name: "命運卡｜選民心聲", type: "fate" },
  { id: 17, name: "產業扶植計畫", type: "property", group: "D", price: 1200, rent: 100 },
  { id: 18, name: "醫療改革方案", type: "property", group: "D", price: 1300, rent: 100 },
  { id: 19, name: "抹黑攻擊！送交調查", type: "goToInvestigation" },
  { id: 20, name: "司法改革方案", type: "property", group: "E", price: 1500, rent: 140 },
  { id: 21, name: "機會卡｜政治時事", type: "chance" },
  { id: 22, name: "環境保護計畫", type: "property", group: "E", price: 1500, rent: 140 },
  { id: 23, name: "憲政改革方案", type: "property", group: "E", price: 1800, rent: 140 },
];

const INVESTIGATION_TILE_ID = 9;
const GO_PASS_BONUS = 400;
const ROUND_LIMIT = 15;

const CHANCE_CARDS = [
  { text: "民調上升！政治獻金入帳 +$200", effect: (p) => adjustCash(p, 200) },
  { text: "被爆料緋聞，公關費 -$150", effect: (p) => adjustCash(p, -150) },
  { text: "政策利多，前進 3 格", effect: (p) => moveSteps(p, 3) },
  { text: "重新拉票，直接前進到起點", effect: (p) => moveTo(p, 0, true) },
  { text: "遭爆黑歷史，退回 2 格檢討", effect: (p) => moveSteps(p, -2) },
  { text: "記者會失言，送交調查", effect: (p) => sendToInvestigation(p) },
];

const FATE_CARDS = [
  { text: "選民請你吃熱食，補貼 +$100", effect: (p) => adjustCash(p, 100) },
  { text: "在野黨杯葛議事，損失 -$100", effect: (p) => adjustCash(p, -100) },
  { text: "青年選票大量湧入，+$150", effect: (p) => adjustCash(p, 150) },
  { text: "施政滿意度下降，支付維修費 -$120", effect: (p) => adjustCash(p, -120) },
  { text: "地方樁腳相挺，+$180", effect: (p) => adjustCash(p, 180) },
];

// ===================== 遊戲狀態 =====================

let players = [];
let selectedCharacterIds = [];
let currentPlayerIndex = 0;
let round = 1;
let gameOver = false;

// ===================== DOM refs =====================

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const characterListEl = document.getElementById("character-list");
const startBtn = document.getElementById("start-btn");
const boardEl = document.getElementById("board");
const rollBtn = document.getElementById("roll-btn");
const diceResultEl = document.getElementById("dice-result");
const currentPlayerBanner = document.getElementById("current-player-banner");
const playersPanel = document.getElementById("players-panel");
const logPanel = document.getElementById("log-panel");
const roundInfo = document.getElementById("round-info");

const buyModal = document.getElementById("buy-modal");
const buyTitle = document.getElementById("buy-title");
const buyDesc = document.getElementById("buy-desc");
const buyConfirm = document.getElementById("buy-confirm");
const buySkip = document.getElementById("buy-skip");

const eventModal = document.getElementById("event-modal");
const eventTitle = document.getElementById("event-title");
const eventDesc = document.getElementById("event-desc");
const eventConfirm = document.getElementById("event-confirm");

const endModal = document.getElementById("end-modal");
const endResults = document.getElementById("end-results");
const restartBtn = document.getElementById("restart-btn");

// ===================== 角色選擇畫面 =====================

function renderCharacterList() {
  characterListEl.innerHTML = "";
  CHARACTERS.forEach((c) => {
    const card = document.createElement("div");
    card.className = "character-card";
    card.dataset.id = c.id;
    const order = selectedCharacterIds.indexOf(c.id);
    if (order !== -1) card.classList.add("selected");
    card.innerHTML = `
      <div class="portrait-wrap">${getPortraitHTML(c.id)}</div>
      <h4>${c.name}</h4>
      <div class="ability">${c.ability}</div>
      <div class="cash">起始資金 $${c.cash}</div>
      ${order !== -1 ? `<div class="order-badge">玩家 ${order + 1}</div>` : ""}
    `;
    card.addEventListener("click", () => toggleCharacter(c.id));
    attachTilt(card);
    characterListEl.appendChild(card);
  });
  startBtn.disabled = selectedCharacterIds.length < 2;
}

// 滑鼠移動時做輕微 3D 傾斜，增加立體感
function attachTilt(el) {
  const strength = 10;
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateY(-4px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
}

function toggleCharacter(id) {
  const idx = selectedCharacterIds.indexOf(id);
  if (idx !== -1) {
    selectedCharacterIds.splice(idx, 1);
  } else {
    if (selectedCharacterIds.length >= 4) return;
    selectedCharacterIds.push(id);
  }
  renderCharacterList();
}

startBtn.addEventListener("click", startGame);

function startGame() {
  players = selectedCharacterIds.map((id, i) => {
    const c = CHARACTERS.find((ch) => ch.id === id);
    return {
      ...c,
      color: PLAYER_COLORS[i],
      cash: c.cash,
      position: 0,
      properties: [],
      skipTurn: false,
      bankrupt: false,
    };
  });
  currentPlayerIndex = 0;
  round = 1;
  gameOver = false;
  BOARD.forEach((t) => { if (t.type === "property") t.owner = null; });

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  renderBoard();
  renderPlayers();
  updateBanner();
  logPanel.innerHTML = "";
  log("🎬 選戰開始！祝各位參選人好運。");
}

// ===================== 棋盤渲染 =====================

function getDisplayOrder() {
  const order = [];
  const rows = 4, cols = 6;
  for (let r = 0; r < rows; r++) {
    const rowIds = [];
    for (let c = 0; c < cols; c++) rowIds.push(r * cols + c);
    if (r % 2 === 1) rowIds.reverse();
    order.push(...rowIds);
  }
  return order;
}

function renderBoard() {
  boardEl.innerHTML = "";
  const order = getDisplayOrder();
  order.forEach((id) => {
    const tile = BOARD[id];
    const div = document.createElement("div");
    div.className = `tile type-${tile.type}${tile.group ? ` group-${tile.group}` : ""}`;
    div.dataset.id = id;

    let priceHtml = "";
    if (tile.type === "property") {
      priceHtml = `<div class="tile-price">$${tile.price}</div>`;
    } else if (tile.type === "tax") {
      priceHtml = `<div class="tile-price">-$${tile.amount}</div>`;
    } else if (tile.type === "rally") {
      priceHtml = `<div class="tile-price">+$${tile.amount}</div>`;
    }

    const ownerHtml = tile.owner
      ? `<div class="tile-owner">👑 ${players.find((p) => p.id === tile.owner)?.name || ""}</div>`
      : "";

    div.innerHTML = `
      <div class="tile-name">${tile.name}</div>
      ${priceHtml}
      ${ownerHtml}
      <div class="tokens"></div>
    `;
    boardEl.appendChild(div);
  });
  renderTokens();
}

function renderTokens() {
  document.querySelectorAll(".tile .tokens").forEach((el) => (el.innerHTML = ""));
  players.forEach((p) => {
    if (p.bankrupt) return;
    const tileEl = boardEl.querySelector(`.tile[data-id="${p.position}"] .tokens`);
    if (tileEl) {
      const span = document.createElement("span");
      span.className = "token";
      span.title = p.name;
      span.style.borderColor = p.color;
      span.innerHTML = getPortraitHTML(p.id);
      tileEl.appendChild(span);
    }
  });
}

function renderTileOwner(tileId) {
  const tile = BOARD[tileId];
  const tileEl = boardEl.querySelector(`.tile[data-id="${tileId}"]`);
  if (!tileEl) return;
  const ownerEl = tileEl.querySelector(".tile-owner");
  if (tile.owner) {
    const owner = players.find((p) => p.id === tile.owner);
    if (ownerEl) ownerEl.textContent = `👑 ${owner ? owner.name : ""}`;
  }
}

// ===================== 玩家面板 =====================

function renderPlayers() {
  playersPanel.innerHTML = "";
  players.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = `player-card${i === currentPlayerIndex ? " active" : ""}${p.bankrupt ? " bankrupt" : ""}`;
    card.style.borderLeftColor = p.color;
    card.innerHTML = `
      <span class="player-card-id"><span class="mini-portrait">${getPortraitHTML(p.id)}</span>${p.name}</span>
      <span>$${p.cash}｜地產 ${p.properties.length}</span>
    `;
    playersPanel.appendChild(card);
  });
}

function updateBanner() {
  const p = players[currentPlayerIndex];
  currentPlayerBanner.innerHTML = `
    <span class="mini-portrait banner-portrait">${getPortraitHTML(p.id)}</span>
    輪到　<strong>${p.name}</strong>　的回合
  `;
  currentPlayerBanner.style.background = `${p.color}33`;
}

// ===================== 遊戲邏輯 =====================

function log(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  logPanel.prepend(div);
}

function adjustCash(player, amount) {
  player.cash += amount;
  checkBankrupt(player);
}

function checkBankrupt(player) {
  if (player.cash < 0 && !player.bankrupt) {
    player.bankrupt = true;
    BOARD.forEach((t) => {
      if (t.type === "property" && t.owner === player.id) t.owner = null;
    });
    player.properties = [];
    log(`💸 ${player.name} 資金歸零，宣告退選！`);
  }
}

function moveTo(player, tileId, passGoBonus) {
  if (passGoBonus === undefined) passGoBonus = tileId < player.position;
  player.position = tileId;
  if (passGoBonus) grantGoBonus(player);
}

function moveSteps(player, steps) {
  let newPos = player.position + steps;
  let passedGo = false;
  if (newPos >= BOARD.length) { newPos -= BOARD.length; passedGo = true; }
  if (newPos < 0) newPos += BOARD.length;
  player.position = newPos;
  if (passedGo) grantGoBonus(player);
}

function grantGoBonus(player) {
  let bonus = GO_PASS_BONUS;
  if (player.id === "chief") bonus += 100;
  if (player.id === "grassroots") bonus += 50;
  adjustCash(player, bonus);
  log(`🏁 ${player.name} 經過起點，領取拉票金 +$${bonus}`);
}

function sendToInvestigation(player) {
  player.position = INVESTIGATION_TILE_ID;
  player.skipTurn = true;
  log(`🚨 ${player.name} 被送交調查，下回合暫停！`);
}

function calcRent(tile, owner) {
  let rent = tile.rent;
  const groupTiles = BOARD.filter((t) => t.type === "property" && t.group === tile.group);
  const ownsAll = groupTiles.every((t) => t.owner === owner.id);
  if (ownsAll) rent *= 2;
  if (owner.id === "scholar") rent = Math.round(rent * 1.1);
  return rent;
}

// ===================== 擲骰 & 回合 =====================

rollBtn.addEventListener("click", handleRoll);

function handleRoll() {
  if (gameOver) return;
  const player = players[currentPlayerIndex];
  rollBtn.disabled = true;

  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  const total = d1 + d2;
  diceResultEl.textContent = `🎲 ${d1} + ${d2} = ${total}`;

  moveSteps(player, total);
  renderBoard();
  renderPlayers();
  log(`👣 ${player.name} 擲出 ${total}，移動到「${BOARD[player.position].name}」`);

  resolveTile(player);
}

function resolveTile(player) {
  const tile = BOARD[player.position];

  switch (tile.type) {
    case "property":
      if (!tile.owner) {
        if (player.cash >= tile.price) {
          showBuyModal(player, tile);
          return; // 等待玩家操作後才 finishTurn
        } else {
          log(`🤷 ${player.name} 資金不足，無法購買「${tile.name}」`);
        }
      } else if (tile.owner !== player.id) {
        const owner = players.find((p) => p.id === tile.owner);
        if (owner && !owner.bankrupt) {
          const rent = calcRent(tile, owner);
          adjustCash(player, -rent);
          adjustCash(owner, rent);
          log(`💰 ${player.name} 支付租金 $${rent} 給 ${owner.name}（${tile.name}）`);
        }
      }
      break;

    case "tax": {
      let amount = tile.amount;
      if (player.id === "ironfist") amount = Math.round(amount * 0.8);
      adjustCash(player, -amount);
      log(`🧾 ${player.name} 繳納${tile.name} -$${amount}`);
      break;
    }

    case "rally":
      adjustCash(player, tile.amount);
      log(`🎉 ${player.name} 出席造勢晚會，獲得政治獻金 +$${tile.amount}`);
      break;

    case "chance":
    case "fate": {
      const deck = tile.type === "chance" ? CHANCE_CARDS : FATE_CARDS;
      const card = deck[Math.floor(Math.random() * deck.length)];
      showEventModal(tile.type === "chance" ? "機會卡" : "命運卡", card, player, tile.type);
      return; // 等待玩家關閉 modal 後才 finishTurn
    }

    case "goToInvestigation":
      sendToInvestigation(player);
      break;

    case "investigation":
    case "go":
    default:
      break;
  }

  finishTurn();
}

function finishTurn() {
  renderBoard();
  renderPlayers();

  if (checkGameEnd()) return;

  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  if (currentPlayerIndex === 0) {
    round++;
    roundInfo.textContent = `第 ${Math.min(round, ROUND_LIMIT)} / ${ROUND_LIMIT} 輪`;
  }

  const next = players[currentPlayerIndex];
  if (next.bankrupt) {
    return finishTurn(); // 跳過已退選玩家
  }
  if (next.skipTurn) {
    next.skipTurn = false;
    log(`⏸️ ${next.name} 正忙於應訊，跳過本回合`);
    return finishTurn();
  }

  if (round > ROUND_LIMIT) {
    return endGame();
  }

  updateBanner();
  diceResultEl.textContent = "";
  rollBtn.disabled = false;
}

function checkGameEnd() {
  const active = players.filter((p) => !p.bankrupt);
  if (active.length <= 1) {
    endGame();
    return true;
  }
  return false;
}

// ===================== 購買 / 事件 Modal =====================

let pendingBuy = null;

function showBuyModal(player, tile) {
  pendingBuy = { player, tile };
  buyTitle.textContent = `是否購買「${tile.name}」？`;
  buyDesc.textContent = `價格 $${tile.price}｜基本租金 $${tile.rent}（${player.name} 目前資金 $${player.cash}）`;
  buyModal.classList.remove("hidden");
}

buyConfirm.addEventListener("click", () => {
  const { player, tile } = pendingBuy;
  adjustCash(player, -tile.price);
  tile.owner = player.id;
  player.properties.push(tile.id);
  log(`🏛️ ${player.name} 購入「${tile.name}」`);
  buyModal.classList.add("hidden");
  renderTileOwner(tile.id);
  pendingBuy = null;
  finishTurn();
});

buySkip.addEventListener("click", () => {
  log(`🙅 ${pendingBuy.player.name} 放棄購買「${pendingBuy.tile.name}」`);
  buyModal.classList.add("hidden");
  pendingBuy = null;
  finishTurn();
});

let pendingEvent = null;

function showEventModal(label, card, player, deckType) {
  pendingEvent = { card, player, deckType };
  eventTitle.textContent = `📇 ${label}`;
  eventDesc.textContent = card.text;
  eventModal.classList.remove("hidden");
}

eventConfirm.addEventListener("click", () => {
  const { card, player, deckType } = pendingEvent;
  const cashBefore = player.cash;
  card.effect(player);

  // 網紅議員：機會卡帶來的正向金額加成 x1.5
  if (deckType === "chance" && player.id === "influencer") {
    const delta = player.cash - cashBefore;
    if (delta > 0) {
      const bonus = Math.round(delta * 0.5);
      adjustCash(player, bonus);
      log(`🤳 ${player.name} 聲量紅利加成 +$${bonus}`);
    }
  }

  eventModal.classList.add("hidden");
  pendingEvent = null;
  renderBoard();
  renderPlayers();
  log(`📇 ${player.name}：${card.text}`);

  finishTurn();
});

// ===================== 結束遊戲 =====================

function endGame() {
  gameOver = true;
  rollBtn.disabled = true;

  const ranked = [...players]
    .map((p) => {
      const propertyValue = p.properties.reduce((sum, tid) => sum + BOARD[tid].price, 0);
      return { ...p, netWorth: p.bankrupt ? -1 : p.cash + propertyValue };
    })
    .sort((a, b) => b.netWorth - a.netWorth);

  endResults.innerHTML = "";
  ranked.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = `result-row${i === 0 && !p.bankrupt ? " winner" : ""}`;
    const status = p.bankrupt ? "已退選" : i === 0 ? "🎉 當選總統" : "落選";
    row.innerHTML = `<span>${p.avatar} ${p.name}</span><span>${status}｜資產 $${Math.max(p.netWorth, 0)}</span>`;
    endResults.appendChild(row);
  });

  endModal.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
  endModal.classList.add("hidden");
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  selectedCharacterIds = [];
  renderCharacterList();
});

// ===================== 初始化 =====================

renderCharacterList();
