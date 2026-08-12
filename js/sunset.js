/* ==========================================================================
   EnjoyKamakura - 日没時刻の計算ユーティリティ
   NOAA / 天文学の標準的な太陽位置計算式に基づく簡易実装（誤差 約1分程度）
   ========================================================================== */

const KamakuraSun = (function () {
  const RAD = Math.PI / 180;
  const DAY_MS = 86400000;
  const J1970 = 2440588;
  const J2000 = 2451545;
  const OBLIQUITY = RAD * 23.4397;

  // 七里ヶ浜の緯度経度（デフォルト基準地点）
  const SHICHIRIGAHAMA = { lat: 35.3067, lng: 139.5147 };

  function toJulian(date) {
    return date.valueOf() / DAY_MS - 0.5 + J1970;
  }

  function fromJulian(j) {
    return new Date((j + 0.5 - J1970) * DAY_MS);
  }

  function toDays(date) {
    return toJulian(date) - J2000;
  }

  function declination(l) {
    return Math.asin(Math.sin(l) * Math.sin(OBLIQUITY));
  }

  function solarMeanAnomaly(d) {
    return RAD * (357.5291 + 0.98560028 * d);
  }

  function eclipticLongitude(M) {
    const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = RAD * 102.9372;
    return M + C + P + Math.PI;
  }

  function julianCycle(d, lw) {
    return Math.round(d - 0.0009 - lw / (2 * Math.PI));
  }

  function approxTransit(Ht, lw, n) {
    return 0.0009 + (Ht + lw) / (2 * Math.PI) + n;
  }

  function solarTransitJ(ds, M, L) {
    return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  }

  function hourAngle(h, phi, dec) {
    const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    return Math.acos(Math.max(-1, Math.min(1, cosH)));
  }

  /**
   * 指定した日付・緯度経度の日の出/日の入り/南中時刻を計算する
   * @param {Date} date
   * @param {number} lat
   * @param {number} lng
   * @returns {{sunrise: Date, sunset: Date, solarNoon: Date}}
   */
  function getTimes(date, lat, lng) {
    const lw = RAD * -lng;
    const phi = RAD * lat;
    const d = toDays(date);
    const n = julianCycle(d, lw);
    const ds = approxTransit(0, lw, n);
    const M = solarMeanAnomaly(ds);
    const L = eclipticLongitude(M);
    const dec = declination(L);
    const Jnoon = solarTransitJ(ds, M, L);

    const h0 = RAD * -0.833; // 大気差・太陽半径を考慮した標準角度
    const w0 = hourAngle(h0, phi, dec);
    const Jset = solarTransitJ(approxTransit(w0, lw, n), M, L);
    const Jrise = Jnoon - (Jset - Jnoon);

    return {
      sunrise: fromJulian(Jrise),
      sunset: fromJulian(Jset),
      solarNoon: fromJulian(Jnoon)
    };
  }

  return { getTimes, SHICHIRIGAHAMA };
})();
