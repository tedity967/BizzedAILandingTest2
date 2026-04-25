/* =============================================
   Animated Particle Background
   Canvas-based background with floating particles,
   glowing orbs, and interconnecting lines.
   ============================================= */

(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, particles;
  var COLORS = [
    'rgba(139,92,246,',
    'rgba(196,181,253,',
    'rgba(236,72,153,',
    'rgba(244,114,182,',
    'rgba(59,130,246,'
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkP() {
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.22,
      color: c,
      a: Math.random() * 0.55 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      ps: Math.random() * 0.008 + 0.003
    };
  }

  function init() {
    resize();
    var n = Math.min(Math.floor((W * H) / 8000), 160);
    particles = [];
    for (var i = 0; i < n; i++) particles.push(mkP());
  }

  var orbs = [
    { x: 0.15, y: 0.10, r: 0.38, color: 'rgba(139,92,246,', phase: 0, speed: 0.0004 },
    { x: 0.85, y: 0.22, r: 0.28, color: 'rgba(236,72,153,', phase: 1.57, speed: 0.0003 },
    { x: 0.50, y: 0.85, r: 0.32, color: 'rgba(59,130,246,', phase: 3.14, speed: 0.00035 }
  ];

  var t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Vignette
    var grd = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    grd.addColorStop(0, 'rgba(10,8,22,0)');
    grd.addColorStop(1, 'rgba(10,8,22,0.92)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Glowing orbs
    orbs.forEach(function (o) {
      var cx = W * o.x + Math.sin(t * o.speed + o.phase) * W * 0.06;
      var cy = H * o.y + Math.cos(t * o.speed * 0.7 + o.phase) * H * 0.05;
      var rr = Math.max(W, H) * o.r;
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
      g.addColorStop(0, o.color + '0.22)');
      g.addColorStop(0.5, o.color + '0.08)');
      g.addColorStop(1, o.color + '0)');
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Connecting lines
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(196,181,253,' + (1 - d / 110) * 0.06 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(function (p) {
      p.pulse += p.ps;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (p.a + Math.sin(p.pulse) * 0.12) + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () { resize(); });
  init();
  draw();
})();
