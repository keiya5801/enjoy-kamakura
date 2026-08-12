/* ==========================================================================
   EnjoyKamakura - メインアプリケーションロジック
   ========================================================================== */

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const STICKERS = ['🌊', '⛩️', '🚋', '🍡', '🌸', '💕', '☀️', '🐚', '⭐'];

let quizState = null;
let photoState = { img: null, stickers: [], selectedSticker: STICKERS[0] };

/* ---------------- Navigation ---------------- */

function goTo(sectionName) {
  document.querySelectorAll('.app-section').forEach(el => {
    el.classList.toggle('active', el.id === 'section-' + sectionName);
  });
  document.querySelectorAll('.bottom-nav__item').forEach(el => {
    el.classList.toggle('active', el.dataset.goto === sectionName);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- 時間帯テーマ ---------------- */

function updateTimeTheme() {
  const h = new Date().getHours();
  let cls = 'tod-day';
  let greeting = 'こんにちは';

  if (h >= 5 && h < 10) { cls = 'tod-morning'; greeting = 'おはようございます'; }
  else if (h >= 10 && h < 16) { cls = 'tod-day'; greeting = 'こんにちは'; }
  else if (h >= 16 && h < 18) { cls = 'tod-sunset'; greeting = 'もうすぐ夕暮れ時'; }
  else { cls = 'tod-night'; greeting = 'こんばんは'; }

  document.body.classList.remove('tod-morning', 'tod-day', 'tod-sunset', 'tod-night');
  document.body.classList.add(cls);
  const greetingEl = document.getElementById('hero-greeting');
  if (greetingEl) greetingEl.textContent = greeting;
}

/* ---------------- 日没ウィジェット ---------------- */

function renderSunsetWidget(el) {
  if (!el) return;
  el.innerHTML =
    '<div class="sunset-widget__row">' +
    '<div class="sunset-widget__icon">🌅</div>' +
    '<div>' +
    '<p class="sunset-widget__title">七里ヶ浜の本日の日没</p>' +
    '<p class="sunset-widget__time" id="sunset-time-' + el.id + '">--:--</p>' +
    '<p class="sunset-widget__countdown" id="sunset-countdown-' + el.id + '"></p>' +
    '</div></div>' +
    '<p class="sunset-widget__spot" id="sunset-spot-' + el.id + '"></p>';
  updateSunsetWidget(el.id);
}

function updateSunsetWidget(containerId) {
  const timeEl = document.getElementById('sunset-time-' + containerId);
  const cdEl = document.getElementById('sunset-countdown-' + containerId);
  const spotEl = document.getElementById('sunset-spot-' + containerId);
  if (!timeEl) return;

  const now = new Date();
  const { lat, lng } = KamakuraSun.SHICHIRIGAHAMA;
  const times = KamakuraSun.getTimes(now, lat, lng);

  timeEl.textContent = times.sunset.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  const diff = times.sunset - now;
  if (diff > 0) {
    const mins = Math.floor(diff / 60000);
    const hh = Math.floor(mins / 60), mm = mins % 60;
    cdEl.textContent = '日没まで あと ' + (hh > 0 ? hh + '時間' : '') + mm + '分';
    spotEl.textContent = '📍 稲村ヶ崎公園や七里ヶ浜海岸が鑑賞におすすめ';
  } else {
    const agoMins = Math.floor(-diff / 60000);
    if (agoMins < 90) {
      cdEl.textContent = '日没から ' + agoMins + '分経過。夜景モードへ';
      spotEl.textContent = '📍 江の島シーキャンドルからの夜景がおすすめ';
    } else {
      cdEl.textContent = '本日の日没は終了しました';
      spotEl.textContent = '📍 明日はまた新しい夕日が見られます';
    }
  }
}

/* ---------------- 記念日スケジュール ---------------- */

function formatDuration(ms) {
  const mins = Math.max(0, Math.round(ms / 60000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  let out = '';
  if (d > 0) out += d + '日';
  if (h > 0) out += h + '時間';
  out += m + '分';
  return out;
}

function computeScheduleStatus(now) {
  const items = ALL_TRIP_ITEMS.map(it => ({ item: it, dt: itemDateTime(it) }));
  const first = items[0], last = items[items.length - 1];

  if (now < first.dt) return { phase: 'before', first };
  if (now >= last.dt) return { phase: 'after', last };

  let current = null, next = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].dt <= now) {
      current = items[i];
      next = items[i + 1] || null;
    } else {
      break;
    }
  }
  return { phase: 'during', current, next };
}

function renderScheduleStatus(el) {
  if (!el) return;
  const now = new Date();
  const status = computeScheduleStatus(now);
  let html = '';

  if (status.phase === 'before') {
    const diff = status.first.dt - now;
    html =
      '<p class="schedule-status__phase">旅行まであと少し</p>' +
      '<div class="schedule-status__main">' +
      '<span class="schedule-status__emoji">🎉</span>' +
      '<div class="schedule-status__body">' +
      '<p class="schedule-status__text">最初の予定は「' + status.first.item.text + '」</p>' +
      '<p class="schedule-status__sub">' + status.first.item.time + '〜</p>' +
      '</div></div>' +
      '<p class="schedule-status__countdown">⏳ あと ' + formatDuration(diff) + '</p>';
  } else if (status.phase === 'during') {
    html =
      '<p class="schedule-status__phase">' + status.current.item.dayLabel + ' ・ 進行中</p>' +
      '<div class="schedule-status__main">' +
      '<span class="schedule-status__emoji">' + status.current.item.emoji + '</span>' +
      '<div class="schedule-status__body">' +
      '<p class="schedule-status__text">只今: ' + status.current.item.text + '</p>' +
      (status.next ? '<p class="schedule-status__sub">次は ' + status.next.item.time + ' 「' + status.next.item.text + '」</p>' : '<p class="schedule-status__sub">これが最後の予定です</p>') +
      '</div></div>' +
      (status.next ? '<p class="schedule-status__countdown">⏳ 次まであと ' + formatDuration(status.next.dt - now) + '</p>' : '');
  } else {
    html =
      '<p class="schedule-status__phase">旅行終了</p>' +
      '<div class="schedule-status__main">' +
      '<span class="schedule-status__emoji">💝</span>' +
      '<div class="schedule-status__body">' +
      '<p class="schedule-status__text">素敵な2日間になりました</p>' +
      '<p class="schedule-status__sub">最後の予定は「' + status.last.item.text + '」でした</p>' +
      '</div></div>';
  }

  if (el.id === 'schedule-status-home') {
    html += '<button class="btn btn--ghost schedule-status__link" data-goto="schedule">予定をすべて見る</button>';
  }

  el.innerHTML = html;
}

function determineDefaultScheduleDayIndex() {
  const status = computeScheduleStatus(new Date());
  if (status.phase === 'before') return 0;
  if (status.phase === 'after') return TRIP_DAYS.length - 1;
  return TRIP_DAYS.findIndex(d => d.label === status.current.item.dayLabel);
}

let scheduleActiveDayIndex = 0;

function renderScheduleDayTabs() {
  const tabsEl = document.getElementById('schedule-day-tabs');
  if (!tabsEl) return;

  tabsEl.innerHTML = TRIP_DAYS.map((day, i) => {
    const dateLabel = TRIP_DATES[day.dateIndex].toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
    return (
      '<button class="schedule-day-tab ' + (i === scheduleActiveDayIndex ? 'active' : '') + '" data-day-index="' + i + '">' +
      day.label + '<small>' + dateLabel + '</small>' +
      '</button>'
    );
  }).join('');

  tabsEl.querySelectorAll('.schedule-day-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      scheduleActiveDayIndex = Number(btn.dataset.dayIndex);
      renderScheduleDayTabs();
      renderScheduleList();
    });
  });
}

function renderScheduleList() {
  const listEl = document.getElementById('schedule-list');
  if (!listEl) return;

  const now = new Date();
  const status = computeScheduleStatus(now);
  const currentItemRef = status.phase === 'during' ? status.current.item : null;
  const day = TRIP_DAYS[scheduleActiveDayIndex];

  listEl.innerHTML = day.items.map(item => {
    const dt = itemDateTime(item);
    const isNow = item === currentItemRef;
    const isPast = dt < now && !isNow;

    let cls = 'schedule-item';
    if (!item.showTime) cls += ' schedule-item--sub';
    if (isPast) cls += ' is-past';
    if (isNow) cls += ' is-now';
    if (item.spotId) cls += ' is-linkable';

    return (
      '<button class="' + cls + '"' + (item.spotId ? ' data-spot-id="' + item.spotId + '"' : '') + '>' +
      '<span class="schedule-item__marker">' + item.emoji + '</span>' +
      '<span class="schedule-item__body">' +
      (item.showTime ? '<p class="schedule-item__time">' + item.time + '</p>' : '') +
      '<p class="schedule-item__text">' + item.text + '</p>' +
      (item.rainAlt ? '<p class="schedule-item__rain-alt">☔ 雨なら → ' + item.rainAlt + '</p>' : '') +
      '</span>' +
      (isNow ? '<span class="schedule-item__now-badge">NOW</span>' : '') +
      '</button>'
    );
  }).join('');

  listEl.querySelectorAll('.schedule-item[data-spot-id]').forEach(btn => {
    btn.addEventListener('click', () => openSpotModal(btn.dataset.spotId));
  });
}

function refreshSchedule() {
  renderScheduleStatus(document.getElementById('schedule-status-home'));
  renderScheduleStatus(document.getElementById('schedule-status-full'));
  renderScheduleList();
}

/* ---------------- ☔ 雨の日ヒント ---------------- */

let rainTipIndex = Math.floor(Math.random() * RAIN_TIPS.length);

function renderRainTip(el) {
  if (!el) return;
  const drops = Array.from({ length: 10 }).map((_, i) =>
    '<span class="rain-tip-card__drop" style="left:' + (i * 10 + Math.random() * 6) + '%; animation-delay:' + (Math.random() * 1.4).toFixed(2) + 's;"></span>'
  ).join('');

  el.innerHTML =
    '<div class="rain-tip-card__drops">' + drops + '</div>' +
    '<div class="rain-tip-card__body">' +
    '<p class="rain-tip-card__header">☔ 雨の日でも、めっちゃ楽しめる</p>' +
    '<p class="rain-tip-card__sub">8/13・8/14は雨予報だけど、雨だからこその楽しみ方がたくさんあるよ。</p>' +
    '<p class="rain-tip-card__tip">' + RAIN_TIPS[rainTipIndex] + '</p>' +
    '<button class="rain-tip-card__next" data-next-rain-tip>次のヒント →</button>' +
    '</div>';
}

function nextRainTip() {
  rainTipIndex = (rainTipIndex + 1) % RAIN_TIPS.length;
  renderRainTip(document.getElementById('rain-tip-home'));
  renderRainTip(document.getElementById('rain-tip-schedule'));
}

/* ---------------- ルート表示 ---------------- */

function renderRoute() {
  const list = document.getElementById('route-list');
  if (!list) return;

  list.innerHTML = SPOTS.map(area =>
    '<div class="route-area">' +
    '<div class="route-area__header">' +
    '<span class="route-area__badge" style="background:' + area.areaColor + '">' + area.areaEmoji + '</span>' +
    '<span>' + area.area + '</span>' +
    '</div>' +
    '<div class="route-area__cards">' +
    area.items.map(spot => spotCardHTML(spot)).join('') +
    '</div></div>'
  ).join('');

  list.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('click', () => openSpotModal(card.dataset.id));
  });
}

function spotCardHTML(spot) {
  const tag = TAG_META[spot.tag];
  return (
    '<button class="spot-card" data-id="' + spot.id + '">' +
    '<span class="spot-card__emoji">' + spot.emoji + '</span>' +
    '<span class="spot-card__body">' +
    '<p class="spot-card__name">' + spot.name + '</p>' +
    '<p class="spot-card__desc">' + spot.desc + '</p>' +
    '</span>' +
    (spot.rainFriendly ? '<span class="spot-card__rain-badge" title="雨の日でも◎">☔</span>' : '') +
    '<span class="spot-card__tag" style="background:' + tag.color + '">' + tag.label + '</span>' +
    '</button>'
  );
}

function openSpotModal(id) {
  const spot = getAllSpots().find(s => s.id === id);
  if (!spot) return;
  const tag = TAG_META[spot.tag];
  const card = document.getElementById('spot-modal-card');
  card.innerHTML =
    '<button class="modal__close" data-close-modal>✕</button>' +
    '<div class="modal__emoji">' + spot.emoji + '</div>' +
    '<h3 class="modal__title">' + spot.name + '</h3>' +
    '<p class="modal__area">' + spot.area + ' ・ <span style="color:' + tag.color + '">' + tag.label + '</span></p>' +
    '<p class="modal__desc">' + spot.desc + '</p>' +
    '<div class="modal__tip">💡 ' + spot.tip + '</div>' +
    (spot.rainFriendly ? '<div class="modal__rain-note">☔ ' + spot.rainNote + '</div>' : '') +
    '<a class="modal__map-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(spot.mapQuery) + '">地図アプリで開く ↗</a>';
  document.getElementById('spot-modal').classList.add('is-open');
}

function closeSpotModal() {
  document.getElementById('spot-modal').classList.remove('is-open');
}

/* ---------------- デートビンゴ ---------------- */

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function isWithinTripDates(date) {
  return TRIP_DATES.some(d =>
    d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
  );
}

let bingoMode = 'sunny';

function getActiveMissions() {
  return bingoMode === 'rain' ? MISSIONS_RAIN : MISSIONS;
}

function getBingoStorageKey() {
  return 'ek_bingo_' + (bingoMode === 'rain' ? 'rain_' : '') + todayKey();
}

function getBingoState() {
  try {
    return JSON.parse(localStorage.getItem(getBingoStorageKey())) || [];
  } catch (e) {
    return [];
  }
}

function setBingoState(arr) {
  localStorage.setItem(getBingoStorageKey(), JSON.stringify(arr));
}

function hasBingoLine(checkedIds) {
  const missions = getActiveMissions();
  const idxSet = new Set(checkedIds.map(cid => missions.findIndex(m => m.id === cid)));
  return WIN_LINES.some(line => line.every(i => idxSet.has(i)));
}

function renderBingoModeToggle() {
  const toggleEl = document.getElementById('bingo-mode-toggle');
  if (!toggleEl) return;
  toggleEl.querySelectorAll('.bingo-mode-toggle__btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === bingoMode);
  });
}

function setBingoMode(mode) {
  bingoMode = mode;
  localStorage.setItem('ek_bingo_mode_' + todayKey(), mode);
  renderBingoModeToggle();
  renderBingo();
}

function renderBingo() {
  const grid = document.getElementById('bingo-grid');
  if (!grid) return;
  const missions = getActiveMissions();
  const checked = getBingoState();

  grid.innerHTML = missions.map(m =>
    '<button class="bingo-cell ' + (checked.includes(m.id) ? 'is-checked' : '') + '" data-id="' + m.id + '">' +
    '<span class="bingo-cell__emoji">' + m.emoji + '</span>' +
    '<span class="bingo-cell__text">' + m.text + '</span>' +
    '</button>'
  ).join('');

  grid.querySelectorAll('.bingo-cell').forEach(cell => {
    cell.addEventListener('click', () => toggleBingo(cell.dataset.id));
  });

  updateBingoStatus(checked);
}

function updateBingoStatus(checked) {
  const statusEl = document.getElementById('bingo-status');
  if (!statusEl) return;
  const total = getActiveMissions().length;
  if (checked.length === total) {
    statusEl.textContent = '🎉 コンプリート！最高のデートでした！';
  } else if (hasBingoLine(checked)) {
    statusEl.textContent = '🎉 ビンゴ達成中！';
  } else {
    statusEl.textContent = checked.length + ' / ' + total + ' 達成';
  }
}

function toggleBingo(id) {
  let checked = getBingoState();
  const isChecking = !checked.includes(id);
  const hadLineBefore = hasBingoLine(checked);

  checked = isChecking ? checked.concat([id]) : checked.filter(x => x !== id);
  setBingoState(checked);
  renderBingo();

  const hasLineAfter = hasBingoLine(checked);
  if (isChecking && checked.length === getActiveMissions().length) {
    launchConfetti({ count: 220 });
  } else if (isChecking && hasLineAfter && !hadLineBefore) {
    launchConfetti({ count: 150 });
  }
}

/* ---------------- おみくじ ---------------- */

function weightedPick(arr) {
  const total = arr.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of arr) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return arr[arr.length - 1];
}

function drawOmikuji() {
  const box = document.getElementById('omikuji-box');
  box.classList.add('is-shaking');
  setTimeout(() => box.classList.remove('is-shaking'), 500);

  const fortune = weightedPick(OMIKUJI_FORTUNES);
  const allSpots = getAllSpots();
  const luckySpot = allSpots[Math.floor(Math.random() * allSpots.length)];
  const luckyFood = LUCKY_FOODS[Math.floor(Math.random() * LUCKY_FOODS.length)];

  setTimeout(() => {
    const resultEl = document.getElementById('omikuji-result');
    resultEl.innerHTML =
      '<p class="omikuji-result__rank">' + fortune.rank + '</p>' +
      '<p class="omikuji-result__message">' + fortune.message + '</p>' +
      '<p class="omikuji-result__advice">💡 ' + fortune.advice + '</p>' +
      '<div class="omikuji-result__meta">' +
      '<div><b>' + luckySpot.emoji + ' ' + luckySpot.name + '</b>ラッキースポット</div>' +
      '<div><b>🍴 ' + luckyFood + '</b>ラッキーフード</div>' +
      '</div>';
    resultEl.classList.add('is-visible');
    if (fortune.rank === '超・大吉' || fortune.rank === '大吉') {
      launchConfetti({ count: 160 });
    }
  }, 350);
}

/* ---------------- 相性診断ミニゲーム ---------------- */

function resetQuiz() {
  quizState = { phase: 'a', index: 0, answersA: [], answersB: [] };
  renderQuiz();
}

function renderQuiz() {
  const stage = document.getElementById('quiz-stage');
  const introEl = document.getElementById('quiz-intro');
  if (!stage) return;

  if (quizState.phase === 'handoff') {
    introEl.style.display = 'none';
    stage.innerHTML =
      '<div class="quiz-handoff">' +
      '<div class="quiz-handoff__emoji">🔄</div>' +
      '<p class="quiz-handoff__text">一人目、回答ありがとう！<br>スマホを二人目に渡してね。</p>' +
      '<button class="btn btn--primary" id="quiz-start-b">二人目スタート</button>' +
      '</div>';
    document.getElementById('quiz-start-b').addEventListener('click', () => {
      quizState.phase = 'b';
      quizState.index = 0;
      renderQuiz();
    });
    return;
  }

  if (quizState.phase === 'result') {
    introEl.style.display = 'none';
    renderQuizResult(stage);
    return;
  }

  introEl.style.display = 'block';
  introEl.textContent = quizState.phase === 'a' ? '一人目、答えてね。' : '二人目、答えてね。';

  const q = QUIZ_QUESTIONS[quizState.index];
  const progressDots = QUIZ_QUESTIONS.map((_, i) => {
    let cls = 'quiz-progress__dot';
    if (i < quizState.index) cls += ' is-done';
    else if (i === quizState.index) cls += ' is-current';
    return '<div class="' + cls + '"></div>';
  }).join('');

  stage.innerHTML =
    '<div class="quiz-progress">' + progressDots + '</div>' +
    '<div class="quiz-turn-badge">' + (quizState.phase === 'a' ? '👤 一人目' : '👤 二人目') +
    ' ・ ' + (quizState.index + 1) + '/' + QUIZ_QUESTIONS.length + '</div>' +
    '<p class="quiz-question">' + q.text + '</p>' +
    '<div class="quiz-options">' +
    '<button class="quiz-option" data-choice="a"><span class="quiz-option__emoji">' + q.a.emoji + '</span>' + q.a.text + '</button>' +
    '<button class="quiz-option" data-choice="b"><span class="quiz-option__emoji">' + q.b.emoji + '</span>' + q.b.text + '</button>' +
    '</div>';

  stage.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(btn.dataset.choice));
  });
}

function answerQuiz(choice) {
  const arr = quizState.phase === 'a' ? quizState.answersA : quizState.answersB;
  arr.push(choice);
  quizState.index++;

  if (quizState.index >= QUIZ_QUESTIONS.length) {
    quizState.phase = quizState.phase === 'a' ? 'handoff' : 'result';
  }
  renderQuiz();
}

function renderQuizResult(stage) {
  const matches = quizState.answersA.filter((a, i) => a === quizState.answersB[i]).length;
  const total = QUIZ_QUESTIONS.length;
  const tier = QUIZ_RESULTS.find(r => matches >= r.min && matches <= r.max) || QUIZ_RESULTS[0];

  const rows = QUIZ_QUESTIONS.map((q, i) => {
    const isMatch = quizState.answersA[i] === quizState.answersB[i];
    return (
      '<div class="quiz-answer-compare__row ' + (isMatch ? 'is-match' : 'is-diff') + '">' +
      '<span class="quiz-answer-compare__mark">' + (isMatch ? '💞' : '🔀') + '</span>' +
      '<span class="quiz-answer-compare__q">' + q.text + '</span>' +
      '</div>'
    );
  }).join('');

  stage.innerHTML =
    '<div class="quiz-result">' +
    '<p class="quiz-result__score">' + matches + '<span>/' + total + ' 一致</span></p>' +
    '<p class="quiz-result__title">' + tier.title + '</p>' +
    '<p class="quiz-result__message">' + tier.message + '</p>' +
    '<div class="quiz-answer-compare">' + rows + '</div>' +
    '<button class="btn btn--ghost" id="quiz-retry">もう一度診断する</button>' +
    '</div>';

  document.getElementById('quiz-retry').addEventListener('click', resetQuiz);
  if (matches >= 6) launchConfetti({ count: 180 });
}

/* ---------------- フォトフレームメーカー ---------------- */

function initPhotoTools() {
  const bar = document.getElementById('sticker-bar');
  bar.innerHTML = STICKERS.map((s, i) =>
    '<button class="sticker-btn ' + (i === 0 ? 'is-selected' : '') + '" data-sticker="' + s + '">' + s + '</button>'
  ).join('');

  bar.querySelectorAll('.sticker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.sticker-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      photoState.selectedSticker = btn.dataset.sticker;
    });
  });

  document.getElementById('photo-input').addEventListener('change', handlePhotoUpload);
  document.getElementById('photo-canvas').addEventListener('click', handleCanvasClick);
  document.getElementById('photo-undo').addEventListener('click', undoSticker);
  document.getElementById('photo-download').addEventListener('click', downloadPhoto);
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;

  const hintEl = document.getElementById('photo-hint');
  hintEl.textContent = '読み込み中…';
  hintEl.style.display = 'block';

  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    photoState.img = img;
    photoState.stickers = [];
    hintEl.style.display = 'none';
    drawPhotoCanvas();
    URL.revokeObjectURL(objectUrl);
  };

  img.onerror = () => {
    hintEl.textContent = 'この写真は読み込めませんでした。別の写真かスクリーンショットでお試しください。';
    hintEl.style.display = 'block';
    URL.revokeObjectURL(objectUrl);
  };

  img.src = objectUrl;
}

function drawPhotoCanvas() {
  const canvas = document.getElementById('photo-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#fffaf3';
  ctx.fillRect(0, 0, W, H);

  if (photoState.img) {
    const img = photoState.img;
    const pad = 28;
    const areaW = W - pad * 2, areaH = H - pad * 2 - 90;
    const scale = Math.min(areaW / img.width, areaH / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    const dx = (W - dw) / 2, dy = pad + (areaH - dh) / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 20;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  const grad = ctx.createLinearGradient(0, H - 90, 0, H);
  grad.addColorStop(0, '#ff7e5f');
  grad.addColorStop(1, '#feb47b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 90, W, 90);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Kamakura Date ⛩️', 30, H - 38);

  ctx.font = '20px sans-serif';
  ctx.textAlign = 'right';
  const dateStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillText(dateStr, W - 30, H - 38);

  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  photoState.stickers.forEach(st => {
    ctx.font = st.size + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(st.emoji, st.x, st.y);
  });
}

function handleCanvasClick(e) {
  if (!photoState.img) return;
  const canvas = document.getElementById('photo-canvas');
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  photoState.stickers.push({ emoji: photoState.selectedSticker, x: x, y: y, size: 56 });
  drawPhotoCanvas();
}

function undoSticker() {
  photoState.stickers.pop();
  drawPhotoCanvas();
}

function downloadPhoto() {
  if (!photoState.img) {
    alert('先に写真を選んでね');
    return;
  }
  const canvas = document.getElementById('photo-canvas');
  const link = document.createElement('a');
  link.download = 'kamakura-date.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* ---------------- 初期化 ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  updateTimeTheme();
  setInterval(updateTimeTheme, 60000);

  renderSunsetWidget(document.getElementById('sunset-widget-home'));
  renderSunsetWidget(document.getElementById('sunset-widget-route'));
  setInterval(() => {
    updateSunsetWidget('sunset-widget-home');
    updateSunsetWidget('sunset-widget-route');
  }, 30000);

  scheduleActiveDayIndex = determineDefaultScheduleDayIndex();
  renderScheduleDayTabs();
  refreshSchedule();
  setInterval(refreshSchedule, 30000);

  renderRainTip(document.getElementById('rain-tip-home'));
  renderRainTip(document.getElementById('rain-tip-schedule'));

  renderRoute();

  const savedBingoMode = localStorage.getItem('ek_bingo_mode_' + todayKey());
  bingoMode = savedBingoMode || (isWithinTripDates(new Date()) ? 'rain' : 'sunny');
  renderBingoModeToggle();
  renderBingo();
  resetQuiz();
  initPhotoTools();

  document.getElementById('bingo-mode-toggle').querySelectorAll('.bingo-mode-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => setBingoMode(btn.dataset.mode));
  });

  document.getElementById('bingo-reset').addEventListener('click', () => {
    if (confirm('今日のビンゴ記録をリセットしますか？')) {
      setBingoState([]);
      renderBingo();
    }
  });

  document.getElementById('omikuji-box').addEventListener('click', drawOmikuji);
  document.getElementById('omikuji-draw').addEventListener('click', drawOmikuji);

  const audioBtn = document.getElementById('audio-toggle');
  audioBtn.addEventListener('click', () => {
    const playing = WaveAudio.toggle();
    audioBtn.textContent = playing ? '🔊' : '🔇';
    audioBtn.classList.toggle('is-active', playing);
  });

  document.body.addEventListener('click', (e) => {
    const gotoBtn = e.target.closest('[data-goto]');
    if (gotoBtn) {
      goTo(gotoBtn.dataset.goto);
      return;
    }
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) {
      closeSpotModal();
      return;
    }
    const nextTipBtn = e.target.closest('[data-next-rain-tip]');
    if (nextTipBtn) {
      nextRainTip();
    }
  });
});
