/* ─────────────────────────────────────
   Particle Canvas
───────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;

  const COLORS  = ['#00d4ff', '#a855f7', '#ec4899'];
  const COUNT   = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + .4,
      dx:   (Math.random() - .5) * .4,
      dy:   (Math.random() - .5) * .4,
      c:    COLORS[Math.floor(Math.random() * COLORS.length)],
      a:    Math.random() * .5 + .1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ─────────────────────────────────────
   3-D Tilt on card hover
───────────────────────────────────── */
(function initTilt() {
  const card = document.getElementById('card');
  if (!card) return;

  const MAX_TILT = 8;

  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * MAX_TILT;
    const rotY   =  dx * MAX_TILT;

    card.style.transition = 'transform .05s, box-shadow .4s';
    card.style.transform  =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s';
    card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
})();

/* ─────────────────────────────────────
   Animated counter for stats
───────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat__num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1400;
      const start  = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: .5 });

  nums.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────
   Typing cursor effect on name
───────────────────────────────────── */
(function initTyping() {
  const el = document.querySelector('.bio');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '2px solid #a855f7';

  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => { el.style.borderRight = 'none'; }, 800);
    }
  }, 60);
})();

/* ─────────────────────────────────────
   Mini Terminal Animation
───────────────────────────────────── */
(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const SCRIPT = [
    { type: 'cmd',  text: 'whoami' },
    { type: 'out',  text: '<span class="t-hi">WHATWANT</span>' },
    { type: 'cmd',  text: 'cat about.txt' },
    { type: 'out',  text: 'Developer @ <span class="t-ok">Samsung</span>' },
    { type: 'out',  text: 'Location: Dongtan, Korea 🇰🇷' },
    { type: 'cmd',  text: 'ls skills/' },
    { type: 'out',  text: '<span class="t-cyan">Python</span>  <span class="t-cyan">Kubernetes</span>  <span class="t-cyan">MLOps</span>' },
    { type: 'out',  text: '<span class="t-cyan">Docker</span>   <span class="t-cyan">AI/ML</span>      <span class="t-cyan">DevOps</span>' },
    { type: 'cmd',  text: 'git log --oneline -3' },
    { type: 'out',  text: '<span class="t-ok">a1b2c3d</span> feat: add AI to everything' },
    { type: 'out',  text: '<span class="t-ok">e4f5g6h</span> fix: coffee overflow error' },
    { type: 'out',  text: '<span class="t-ok">i7j8k9l</span> init: hello world' },
    { type: 'cmd',  text: '' },
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let phase    = 'prompt';

  const cursor = document.createElement('span');
  cursor.className = 't-cursor';

  function currentLine() {
    return body.lastElementChild;
  }

  function newLine(classes = '') {
    const el = document.createElement('span');
    el.className = 't-line' + (classes ? ' ' + classes : '');
    body.appendChild(el);
    return el;
  }

  function appendCursor() {
    body.appendChild(cursor);
  }

  function tick() {
    if (lineIdx >= SCRIPT.length) {
      appendCursor();
      return;
    }

    const entry = SCRIPT[lineIdx];

    if (phase === 'prompt') {
      const line = newLine();
      if (entry.type === 'cmd') {
        line.innerHTML = '<span class="t-prompt">❯ </span><span class="t-cmd"></span>';
      }
      phase = 'type';
      charIdx = 0;
      setTimeout(tick, 120);
      return;
    }

    if (phase === 'type') {
      const entry = SCRIPT[lineIdx];

      if (entry.type === 'cmd') {
        const cmdSpan = currentLine().querySelector('.t-cmd');
        if (charIdx < entry.text.length) {
          cmdSpan.textContent += entry.text[charIdx];
          charIdx++;
          setTimeout(tick, 55 + Math.random() * 40);
        } else {
          lineIdx++;
          phase = 'wait';
          setTimeout(tick, entry.text === '' ? 600 : 380);
        }
      } else {
        const line = newLine('t-out');
        line.innerHTML = entry.text;
        lineIdx++;
        phase = 'prompt';
        setTimeout(tick, 60);
      }
      return;
    }

    if (phase === 'wait') {
      phase = 'prompt';
      setTimeout(tick, 80);
    }
  }

  appendCursor();
  setTimeout(tick, 700);
})();

/* ─────────────────────────────────────
   Skill hover ripple
───────────────────────────────────── */
document.querySelectorAll('.skill').forEach(skill => {
  skill.addEventListener('click', () => {
    skill.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.15)' },
      { transform: 'scale(1)' },
    ], { duration: 200, easing: 'ease-out' });
  });
});

/* ─────────────────────────────────────
   Glitch flash on name (occasional)
───────────────────────────────────── */
(function initGlitch() {
  const name = document.querySelector('.name');
  if (!name) return;

  function glitch() {
    name.style.filter = 'hue-rotate(40deg) brightness(1.3)';
    setTimeout(() => { name.style.filter = ''; }, 80);
    setTimeout(() => {
      name.style.filter = 'hue-rotate(-30deg) brightness(1.2)';
      setTimeout(() => { name.style.filter = ''; }, 60);
    }, 120);
  }

  setInterval(glitch, 4000 + Math.random() * 3000);
})();
