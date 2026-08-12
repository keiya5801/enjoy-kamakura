/* ==========================================================================
   EnjoyKamakura - 記念日トリップのスケジュールデータ
   ========================================================================== */

// 旅行当日の日付（年, 月0始まり, 日）
const TRIP_DATES = [
  new Date(2026, 7, 13),
  new Date(2026, 7, 14)
];

const TRIP_DAYS = [
  {
    label: 'DAY 1',
    dateIndex: 0,
    subtitle: '横浜 → 七里ヶ浜 → 鎌倉 → ホテル',
    items: [
      { time: '09:30', dateIndex: 0, emoji: '🚉', text: '横浜駅集合', showTime: true },
      { time: '10:30', dateIndex: 0, emoji: '🌊', text: '七里ヶ浜到着', showTime: true },
      { time: '11:00', dateIndex: 0, emoji: '⛩️', text: '鎌倉到着', showTime: true },
      { time: '11:20', dateIndex: 0, emoji: '🍚', text: '小町通りでしらす丼', showTime: false, spotId: 'komachi' },
      { time: '12:30', dateIndex: 0, emoji: '🕊', text: '鶴岡八幡宮お参り', showTime: false, spotId: 'tsurugaoka' },
      { time: '13:30', dateIndex: 0, emoji: '👣', text: 'ぷらぷら散策', showTime: false },
      { time: '15:00', dateIndex: 0, emoji: '✅', text: 'ホテルチェックイン', showTime: true },
      { time: '15:30', dateIndex: 0, emoji: '🏊', text: 'プール', showTime: true },
      { time: '17:00', dateIndex: 0, emoji: '🚿', text: '部屋でシャワー', showTime: true },
      { time: '18:00', dateIndex: 0, emoji: '🌉', text: 'ホテルのレストランでディナー', showTime: true },
      { time: '20:00', dateIndex: 0, emoji: '🚶', text: 'お散歩', showTime: true },
      { time: '21:30', dateIndex: 0, emoji: '💕', text: '二人の時間', showTime: true },
      { time: '02:00', dateIndex: 1, emoji: '😴', text: 'おやすみなさい', showTime: true }
    ]
  },
  {
    label: 'DAY 2',
    dateIndex: 1,
    subtitle: '朝食 → 七里ヶ浜 → 江の島',
    items: [
      { time: '07:00', dateIndex: 1, emoji: '☀️', text: 'おはよう', showTime: true },
      { time: '08:00', dateIndex: 1, emoji: '🍳', text: '朝ごはん', showTime: true },
      { time: '10:00', dateIndex: 1, emoji: '🚶', text: 'お散歩', showTime: true },
      { time: '12:00', dateIndex: 1, emoji: '✅', text: 'チェックアウト', showTime: true },
      { time: '13:00', dateIndex: 1, emoji: '🍽️', text: '七里ヶ浜あたりでランチ', showTime: true },
      { time: '15:00', dateIndex: 1, emoji: '🏝️', text: '江の島到着', showTime: true },
      { time: '16:00', dateIndex: 1, emoji: '⛩️', text: '階段を登った先の神社にお参り', showTime: true, spotId: 'enoshima-jinja' },
      { time: '17:00', dateIndex: 1, emoji: '🌅', text: '夕日を見る', showTime: true },
      { time: '17:50', dateIndex: 1, emoji: '😋', text: '夜ごはん', showTime: false },
      { time: '19:30', dateIndex: 1, emoji: '🌃', text: 'シーキャンドル（塔）に登る', showTime: true, spotId: 'sea-candle' },
      { time: '20:30', dateIndex: 1, emoji: '👣', text: 'ぷらぷら', showTime: false }
    ]
  }
];

function itemDateTime(item) {
  const parts = item.time.split(':');
  const hh = Number(parts[0]);
  const mm = Number(parts[1]);
  const base = TRIP_DATES[item.dateIndex];
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm);
}

// 各アイテムに所属日のラベルを付与（TRIP_DAYS側と同じオブジェクト参照を保つ）
TRIP_DAYS.forEach(day => {
  day.items.forEach(item => { item.dayLabel = day.label; });
});

// 全アイテムを時系列順に並べたフラットな配列（ステータス判定に使用）
const ALL_TRIP_ITEMS = TRIP_DAYS
  .reduce((acc, day) => acc.concat(day.items), [])
  .sort((a, b) => itemDateTime(a) - itemDateTime(b));
