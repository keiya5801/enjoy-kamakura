/* ==========================================================================
   EnjoyKamakura - Web Audio APIで生成する波の音（外部音源ファイル不使用）
   ========================================================================== */

const WaveAudio = (function () {
  let ctx = null;
  let noiseSource = null;
  let filter = null;
  let lfo = null;
  let lfoGain = null;
  let masterGain = null;
  let playing = false;

  function createNoiseBuffer(audioCtx) {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // ブラウンノイズ寄りにして、波音らしい柔らかさを出す
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.2;
    }
    return buffer;
  }

  function start() {
    if (playing) return;
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();

    noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(ctx);
    noiseSource.loop = true;

    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.7;

    // LFOでフィルタのカットオフを揺らし、寄せては返す波の質感を作る
    lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    noiseSource.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    noiseSource.start();
    lfo.start();

    const now = ctx.currentTime;
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.16, now + 1.2);

    playing = true;
  }

  function stop() {
    if (!playing) return;
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 0.6);

    const src = noiseSource;
    const osc = lfo;
    setTimeout(() => {
      try { src.stop(); } catch (e) { /* noop */ }
      try { osc.stop(); } catch (e) { /* noop */ }
    }, 650);

    playing = false;
  }

  function toggle() {
    if (playing) {
      stop();
    } else {
      start();
    }
    return playing;
  }

  function isPlaying() {
    return playing;
  }

  return { toggle, isPlaying };
})();
