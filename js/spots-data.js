/* ==========================================================================
   EnjoyKamakura - スポット・ミッション・診断コンテンツのデータ定義
   ========================================================================== */

// 鎌倉 → 七里ヶ浜 → 江の島の順で巡るルートデータ
const SPOTS = [
  {
    area: '鎌倉',
    areaEmoji: '⛩️',
    areaColor: '#4c7a5b',
    items: [
      {
        id: 'tsurugaoka',
        name: '鶴岡八幡宮',
        emoji: '⛩️',
        tag: 'shrine',
        desc: '鎌倉のシンボル的な神社。大石段の上からの眺めは圧巻で、二人で並んでおみくじを引くのが定番。',
        tip: '参道「段葛」の桜並木や、太鼓橋での写真もおすすめ。',
        mapQuery: '鶴岡八幡宮'
      },
      {
        id: 'komachi',
        name: '小町通り',
        emoji: '🍡',
        tag: 'food',
        desc: '食べ歩きグルメの聖地。クロワッサンたい焼きやしらすコロッケを二人でシェアしながら歩こう。',
        tip: '週末は混み合うので、はぐれないよう手をつないで。',
        mapQuery: '小町通り 鎌倉'
      },
      {
        id: 'daibutsu',
        name: '高徳院（鎌倉大仏）',
        emoji: '🗿',
        tag: 'photo',
        desc: '迫力満点の国宝・鎌倉大仏。定番だけど外せない記念撮影スポット。',
        tip: '大仏の胎内拝観（有料）にも挑戦してみて。',
        mapQuery: '高徳院 鎌倉大仏'
      },
      {
        id: 'houkokuji',
        name: '報国寺（竹の庭）',
        emoji: '🎋',
        tag: 'nature',
        desc: '約2000本の竹に囲まれた「竹の庭」。お抹茶をいただきながら静かなひとときを。',
        tip: '抹茶券は現地で購入可能。天候により受付時間が変わるので確認を。',
        mapQuery: '報国寺'
      },
      {
        id: 'hasedera',
        name: '長谷寺',
        emoji: '🌸',
        tag: 'view',
        desc: '見晴台からは由比ヶ浜の海が一望できる絶景スポット。',
        tip: '6月のあじさいの季節は特に人気、早めの時間がおすすめ。',
        mapQuery: '長谷寺 鎌倉'
      }
    ]
  },
  {
    area: '七里ヶ浜',
    areaEmoji: '🌊',
    areaColor: '#2f7f9e',
    items: [
      {
        id: 'shichirigahama-beach',
        name: '七里ヶ浜海岸',
        emoji: '🏄',
        tag: 'view',
        desc: '江の島と富士山を一望できる、湘南屈指の夕日スポット。サーファーのシルエットも絵になる。',
        tip: '砂浜を裸足で歩くのも気持ちいい。日没時間は必ずチェック。',
        mapQuery: '七里ヶ浜海岸'
      },
      {
        id: 'inamuragasaki',
        name: '稲村ヶ崎公園',
        emoji: '🌇',
        tag: 'view',
        desc: '「関東の富士見百景」にも選ばれた絶景スポット。夕日と富士山と江の島が一度に見られる。',
        tip: '公園のベンチに座ってのんびり夕日待ちするのが◎。',
        mapQuery: '稲村ヶ崎公園'
      },
      {
        id: 'enoden-crossing',
        name: '江ノ電 七里ヶ浜駅の踏切',
        emoji: '🚋',
        tag: 'photo',
        desc: '海をバックに江ノ電が走り抜ける、SNS映え確実の撮影スポット。',
        tip: '踏切内には立ち入らず、安全な場所から撮影しよう。',
        mapQuery: '七里ヶ浜駅'
      },
      {
        id: 'shirasu-don',
        name: 'しらす丼のお店',
        emoji: '🍚',
        tag: 'food',
        desc: '生しらす（漁がある日限定）や釜揚げしらすの丼で、湘南らしい腹ごしらえ。',
        tip: '生しらすは天候・漁の状況で売り切れることも。早めの時間が狙い目。',
        mapQuery: '七里ヶ浜 しらす丼'
      },
      {
        id: 'seaside-cafe',
        name: '海沿いカフェ',
        emoji: '☕',
        tag: 'food',
        desc: 'テラス席から海を眺めながら、まったりティータイム。',
        tip: '夕方は特に混みやすいので、休憩は少し早めの時間帯に。',
        mapQuery: '七里ヶ浜 カフェ'
      }
    ]
  },
  {
    area: '江の島',
    areaEmoji: '🏝️',
    areaColor: '#e08a3c',
    items: [
      {
        id: 'enoshima-jinja',
        name: '江島神社',
        emoji: '⛩️',
        tag: 'shrine',
        desc: '縁結び・金運のご利益で知られる神社。辺津宮・中津宮・奥津宮の三社参りを楽しもう。',
        tip: '奥津宮までは坂と階段が続くので、歩きやすい靴で。',
        mapQuery: '江島神社'
      },
      {
        id: 'sea-candle',
        name: '江の島シーキャンドル',
        emoji: '🗼',
        tag: 'view',
        desc: '展望灯台からは360度の大パノラマ。夕方から夜にかけての景色は格別。',
        tip: '冬季はイルミネーション「湘南の宝石」も開催されることがある。',
        mapQuery: '江の島シーキャンドル'
      },
      {
        id: 'iwaya-cave',
        name: '江の島岩屋',
        emoji: '🕳️',
        tag: 'photo',
        desc: '長い年月をかけて波の浸食でできた神秘的な洞窟を探検。',
        tip: '中は薄暗いので、足元に気をつけて。ろうそく（貸出）を持って進める演出も。',
        mapQuery: '江の島岩屋'
      },
      {
        id: 'benten-bridge',
        name: '江の島弁天橋',
        emoji: '🌉',
        tag: 'view',
        desc: '江の島と本土をつなぐ橋。振り返ると江の島のシルエットと夕景が広がる。',
        tip: '橋の上は風が強いことが多いので、羽織るものがあると安心。',
        mapQuery: '江の島弁天橋'
      },
      {
        id: 'nakamise',
        name: '江の島仲見世通り',
        emoji: '🍢',
        tag: 'food',
        desc: 'たこせんべいや浜焼きなど、食べ歩きグルメが並ぶ賑やかな参道。',
        tip: '出来立てのたこせんべいは、目の前で伸ばしてもらう瞬間も楽しい。',
        mapQuery: '江の島 仲見世通り'
      }
    ]
  }
];

// タグごとの表示ラベル・色
const TAG_META = {
  shrine: { label: '縁結び', color: '#8a6bbd' },
  food: { label: 'グルメ', color: '#e08a3c' },
  photo: { label: '撮影', color: '#d8577c' },
  nature: { label: '自然', color: '#4c7a5b' },
  view: { label: '絶景', color: '#2f7f9e' }
};

// デートビンゴ（3x3）のミッション一覧
const MISSIONS = [
  { id: 'm1', text: '鶴岡八幡宮で一緒におみくじを引く', emoji: '🎋' },
  { id: 'm2', text: '小町通りで食べ歩きグルメをシェアする', emoji: '🍡' },
  { id: 'm3', text: '江ノ電と海を一緒に写真におさめる', emoji: '🚋' },
  { id: 'm4', text: '七里ヶ浜・稲村ヶ崎で夕日を見る', emoji: '🌇' },
  { id: 'm5', text: 'しらす丼など海鮮グルメを食べる', emoji: '🍚' },
  { id: 'm6', text: '江島神社でお参りする', emoji: '⛩️' },
  { id: 'm7', text: '江の島シーキャンドルから景色を見る', emoji: '🗼' },
  { id: 'm8', text: '二人で自撮り写真を撮る', emoji: '🤳' },
  { id: 'm9', text: '江の島仲見世でお土産を選ぶ', emoji: '🐚' }
];

// 相性診断ミニゲームの質問
const QUIZ_QUESTIONS = [
  { text: '今日のテンションは？', a: { emoji: '🌊', text: '海派！' }, b: { emoji: '⛰️', text: '自然・山派！' } },
  { text: 'お昼ごはんに食べたいのは？', a: { emoji: '🍚', text: 'しらす丼' }, b: { emoji: '🥐', text: 'たい焼き・食べ歩き' } },
  { text: '移動スタイルは？', a: { emoji: '🚋', text: '江ノ電でのんびり' }, b: { emoji: '🚶', text: '歩いて散策' } },
  { text: 'デートのペースは？', a: { emoji: '☀️', text: '朝から活動的に' }, b: { emoji: '🌙', text: 'お昼からゆったり' } },
  { text: '写真を撮るなら？', a: { emoji: '📸', text: 'ばっちりポーズ' }, b: { emoji: '🎞️', text: '自然体のスナップ' } },
  { text: '記念に残すなら？', a: { emoji: '⛩️', text: 'お守り・御朱印' }, b: { emoji: '🍡', text: '食べ物のお土産' } },
  { text: '夕日を見るならどこ？', a: { emoji: '🌇', text: '稲村ヶ崎' }, b: { emoji: '🌉', text: '江の島弁天橋' } },
  { text: '帰り道は？', a: { emoji: '🚃', text: '江ノ電に揺られて余韻' }, b: { emoji: '🏃', text: '早めに帰ってゆっくり' } }
];

// 相性スコアごとのメッセージ
const QUIZ_RESULTS = [
  { min: 0, max: 2, title: '個性派カップル', message: '好みはバラバラ？でも、それは新しい発見がたくさんあるということ。お互いの「好き」を教え合う一日にしよう。' },
  { min: 3, max: 4, title: 'いい感じコンビ', message: '違いも共通点もほどよくあるバランス型。譲り合いながら、お互いのペースを楽しんで。' },
  { min: 5, max: 6, title: '息ぴったりペア', message: 'かなり気が合う二人！迷ったときはどちらかの意見に乗っかっても、きっと楽しめるはず。' },
  { min: 7, max: 8, title: '運命的シンクロ', message: 'ほぼ全部一致！まるで双子みたいな相性の良さ。今日は二人の「好き」を思いきり満喫して。' }
];

// 今日のおみくじ（運勢ランク）
const OMIKUJI_FORTUNES = [
  { rank: '超・大吉', weight: 5, message: '二人の運気は最高潮！何をしても上手くいく特別な一日になりそう。', advice: '思い切って、行きたかった場所まで足を延ばしてみて。' },
  { rank: '大吉', weight: 15, message: '笑顔があふれる、幸せいっぱいのデート日和。', advice: '写真をたくさん撮っておこう。きっと良い思い出になる。' },
  { rank: '中吉', weight: 25, message: '穏やかで居心地の良い時間が流れる予感。', advice: '無理に予定を詰め込まず、のんびり過ごすのが吉。' },
  { rank: '吉', weight: 25, message: 'ちょっとしたハプニングも、後で笑い話になる日。', advice: '食べ歩きグルメで気分転換すると運気アップ。' },
  { rank: '小吉', weight: 20, message: '二人のペースを大事にすれば、じわじわ良い一日に。', advice: '焦らずゆっくり歩くくらいがちょうどいい。' },
  { rank: '末吉', weight: 10, message: 'これから運気が上向く、伸びしろのある日。', advice: '夕方以降、江の島あたりでツキが巡ってくるかも。' }
];

const LUCKY_FOODS = ['しらす丼', 'クロワッサンたい焼き', '鳩サブレー', 'たこせんべい', '抹茶と和菓子', '釜揚げしらす', '浜焼き', 'しらすコロッケ'];

// 全スポットをフラットな配列で取得
function getAllSpots() {
  return SPOTS.reduce((acc, area) => acc.concat(area.items.map(item => Object.assign({ area: area.area }, item))), []);
}
