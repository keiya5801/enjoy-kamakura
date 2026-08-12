/* ==========================================================================
   EnjoyKamakura - 軽量な紙吹雪エフェクト（外部ライブラリ不使用）
   ========================================================================== */

const KamakuraConfetti = (function () {
  let canvas, ctx, particles = [], animId = null;
  const COLORS = ['#ff7e5f', '#feb47b', '#2f7f9e', '#4c7a5b', '#e08a3c', '#d8577c', '#ffd166'];

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(count) {
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 0,
        maxLife: 220 + Math.random() * 80
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.rotation += p.rotationSpeed;
      p.life++;

      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter(p => p.life < p.maxLife && p.y < window.innerHeight + 40);

    if (particles.length > 0) {
      animId = requestAnimationFrame(tick);
    } else {
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * 紙吹雪を発射する
   * @param {{count?: number}} opts
   */
  function launch(opts) {
    opts = opts || {};
    ensureCanvas();
    spawn(opts.count || 120);
    if (!animId) {
      animId = requestAnimationFrame(tick);
    }
  }

  return { launch };
})();

function launchConfetti(opts) {
  KamakuraConfetti.launch(opts);
}
