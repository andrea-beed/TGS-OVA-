/* ══════════════════════════════════════════
   OVA #17 — Disciplina y Organizaciones Inteligentes
   LÓGICA — main.js
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   AUDIO ENGINE (Web Audio API — sin archivos externos)
══════════════════════════════════════════ */
const AC = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol, detune = 0) {
  try {
    const osc = AC.createOscillator();
    const gain = AC.createGain();
    osc.connect(gain); gain.connect(AC.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, AC.currentTime);
    if (detune) osc.detune.setValueAtTime(detune, AC.currentTime);
    gain.gain.setValueAtTime(vol, AC.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + duration);
    osc.start(AC.currentTime);
    osc.stop(AC.currentTime + duration);
  } catch (e) {}
}

function sfxCorrect() {
  playTone(523, 'sine', 0.18, 0.22);
  setTimeout(() => playTone(659, 'sine', 0.18, 0.2), 80);
  setTimeout(() => playTone(784, 'sine', 0.28, 0.22), 160);
  setTimeout(() => playTone(1047, 'sine', 0.32, 0.18), 240);
}

function sfxWrong() {
  playTone(300, 'sawtooth', 0.18, 0.12);
  setTimeout(() => playTone(220, 'sawtooth', 0.22, 0.1), 140);
}

function sfxComplete() {
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.25, 0.18), i * 90));
}

function sfxClick() {
  playTone(880, 'sine', 0.06, 0.07);
}

function sfxReveal() {
  playTone(440, 'sine', 0.12, 0.1);
  setTimeout(() => playTone(554, 'sine', 0.15, 0.09), 80);
}

// Desbloquear AudioContext al primer toque
document.addEventListener('click', () => {
  if (AC.state === 'suspended') AC.resume();
}, { once: true });

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
let toastTimer;
function showToast(msg, type = 'info', dur = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, dur);
}

/* ══════════════════════════════════════════
   BACK TO TOP + SCROLL PROGRESS
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backTop');
  if (window.scrollY > 400) btn.classList.add('show');
  else btn.classList.remove('show');

  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scrollBar').style.width = p + '%';

  updateTracker();
});

/* ══════════════════════════════════════════
   SECTION TRACKER
══════════════════════════════════════════ */
const trackerSections = [
  { id: 'hero',        label: 'Inicio' },
  { id: 'contexto',   label: 'Contexto' },
  { id: 'conceptos',  label: 'Conceptos' },
  { id: 'disciplinas',label: 'Disciplinas' },
  { id: 'origen',     label: 'Origen' },
  { id: 'ejemplos',   label: 'Ejemplos' },
  { id: 'ejercicios', label: 'Ejercicios' },
  { id: 'juegos',     label: 'Juegos' },
  { id: 'videos',     label: 'Videos' },
  { id: 'quiz',       label: 'Quiz' },
  { id: 'creditos',   label: 'Créditos' },
];

const stDots = document.getElementById('stDots');
trackerSections.forEach(s => {
  const d = document.createElement('div');
  d.className = 'st-dot';
  d.dataset.label = s.label;
  d.title = s.label;
  d.onclick = () => {
    sfxClick();
    document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' });
  };
  stDots.appendChild(d);
});

function updateTracker() {
  const dots = stDots.querySelectorAll('.st-dot');
  const tracker = document.getElementById('secTracker');
  if (window.scrollY > 200) tracker.classList.add('show');
  else tracker.classList.remove('show');

  let active = 0;
  trackerSections.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) active = i;
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === active));
}
updateTracker();

/* ══════════════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════════════ */
const statTargets = [5, 3, 10, 6];
const statEls = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statEls.forEach((el, i) => {
        const target = statTargets[i];
        let cur = 0;
        const step = Math.ceil(target / 30);
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur;
          if (cur >= target) clearInterval(t);
        }, 40);
      });
    }
  });
}, { threshold: 0.5 });

if (statEls[0]) statObserver.observe(statEls[0].closest('.stats-bar') || statEls[0]);

/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = (mx - 6) + 'px';
  cur.style.top  = (my - 6) + 'px';
});

function animCursor() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = (rx - 18) + 'px';
  ring.style.top  = (ry - 18) + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .card, .disc-card, .match-item, .quiz-opt, .tf-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; });
});

/* ══════════════════════════════════════════
   CANVAS BG (partículas)
══════════════════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 70; i++) {
  pts.push({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    r: Math.random() * 1.4 + .4
  });
}

function animBg() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,240,255,.55)'; ctx.fill();
  });
  pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < 110) {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(0,240,255,${.12 * (1 - d / 110)})`;
      ctx.lineWidth = .4; ctx.stroke();
    }
  }));
  requestAnimationFrame(animBg);
}
animBg();

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  })
);

/* ══════════════════════════════════════════
   SCROLL FADE
══════════════════════════════════════════ */
const obs = new IntersectionObserver(entries =>
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }),
  { threshold: .08 }
);
document.querySelectorAll('.fade-up, .fade-left').forEach(el => obs.observe(el));

/* ══════════════════════════════════════════
   EXERCISE TOGGLE (ver/ocultar respuesta)
══════════════════════════════════════════ */
function toggle(id) {
  const el = document.getElementById(id);
  const show = el.style.display !== 'block';
  el.style.display = show ? 'block' : 'none';
  const btn = el.previousElementSibling;
  if (btn && btn.classList.contains('reveal-btn'))
    btn.textContent = show ? 'Ocultar Respuesta' : 'Ver Respuesta';
  if (show) { sfxReveal(); showToast('💡 Respuesta revelada', 'info', 1800); }
}

/* ══════════════════════════════════════════
   GAME TABS
══════════════════════════════════════════ */
function switchGame(id, btn) {
  sfxClick();
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ══════════════════════════════════════════
   GAME 1: MATCH (Relacionar conceptos)
══════════════════════════════════════════ */
const matchData = [
  { left: 'Pensamiento Sistémico', right: 'Ver el todo y sus interrelaciones' },
  { left: 'Dominio Personal',      right: 'Crecimiento y aspiración individual' },
  { left: 'Modelos Mentales',      right: 'Supuestos internos que filtran la realidad' },
  { left: 'Visión Compartida',     right: 'Futuro deseado construido colectivamente' },
  { left: 'Aprendizaje en Equipo', right: 'Diálogo genuino y pensar juntos' },
];
let selLeft = null, selRight = null, matchScore = 0;

function buildMatch() {
  const lc = document.getElementById('leftCol');
  const rc = document.getElementById('rightCol');
  lc.innerHTML = ''; rc.innerHTML = '';
  const rights = [...matchData].sort(() => Math.random() - .5);

  matchData.forEach((d, i) => {
    const l = document.createElement('div');
    l.className = 'match-item'; l.textContent = d.left;
    l.dataset.idx = i; l.dataset.side = 'left';
    l.onclick = () => selectMatch(l);
    lc.appendChild(l);
  });

  rights.forEach(d => {
    const r = document.createElement('div');
    r.className = 'match-item'; r.textContent = d.right;
    r.dataset.val = d.left; r.dataset.side = 'right';
    r.onclick = () => selectMatch(r);
    rc.appendChild(r);
  });

  matchScore = 0; updateMatchScore();
}

function selectMatch(el) {
  if (el.classList.contains('correct')) return;
  sfxClick();
  if (el.dataset.side === 'left') {
    document.querySelectorAll('#leftCol .match-item').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected'); selLeft = el;
  } else {
    document.querySelectorAll('#rightCol .match-item').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected'); selRight = el;
  }

  if (selLeft && selRight) {
    const correct = matchData[selLeft.dataset.idx].left === selRight.dataset.val;
    if (correct) {
      selLeft.classList.remove('selected'); selLeft.classList.add('correct');
      selRight.classList.remove('selected'); selRight.classList.add('correct');
      matchScore++;
      sfxCorrect();
      showToast('✅ ¡Par correcto!', 'correct');
      document.getElementById('matchMsg').textContent = '✅ ¡Correcto!';
      document.getElementById('matchMsg').style.color = '#10b981';
    } else {
      selLeft.classList.add('wrong'); selRight.classList.add('wrong');
      sfxWrong();
      showToast('❌ Ese no es el par correcto', 'wrong');
      document.getElementById('matchMsg').textContent = '❌ Inténtalo de nuevo';
      document.getElementById('matchMsg').style.color = '#f43f5e';
      setTimeout(() => {
        selLeft.classList.remove('wrong', 'selected');
        selRight.classList.remove('wrong', 'selected');
        document.getElementById('matchMsg').textContent = '';
      }, 900);
    }
    selLeft = null; selRight = null; updateMatchScore();
    if (matchScore === matchData.length) {
      sfxComplete();
      document.getElementById('matchMsg').textContent = '🎉 ¡Completaste todos los pares!';
      document.getElementById('matchMsg').style.color = '#00f0ff';
      showToast('🎉 ¡Juego completado!', 'correct', 3000);
    }
  }
}

function updateMatchScore() {
  document.getElementById('matchScore').textContent = `Pares encontrados: ${matchScore} / ${matchData.length}`;
}

function resetMatch() {
  selLeft = null; selRight = null; sfxClick(); buildMatch();
  document.getElementById('matchMsg').textContent = '';
}
buildMatch();

/* ══════════════════════════════════════════
   GAME 2: SCRAMBLE (Descifra la palabra)
══════════════════════════════════════════ */
const wordBank = [
  { word: 'HOMEOSTASIS',       hint: 'Tendencia de un sistema a mantener su equilibrio interno' },
  { word: 'RETROALIMENTACION', hint: 'Proceso por el cual la salida de un sistema vuelve como entrada' },
  { word: 'SINERGIA',          hint: 'El todo es mayor que la suma de sus partes' },
  { word: 'CIBERNETICA',       hint: 'Estudio del control y la comunicación en sistemas' },
  { word: 'HOLISMO',           hint: 'Enfoque que considera el sistema como un todo integrado' },
  { word: 'ENTROPIA',          hint: 'Tendencia de los sistemas cerrados al desorden' },
  { word: 'EMERGENCIA',        hint: 'Propiedades que surgen de la interacción de los componentes del sistema' },
];
let wIdx = 0, wCorrect = 0;

function scramble(s) { return s.split('').sort(() => Math.random() - .5).join(''); }

function loadWord() {
  const w = wordBank[wIdx];
  let sc = scramble(w.word);
  while (sc === w.word) sc = scramble(w.word);
  document.getElementById('scrambledWord').textContent = sc;
  document.getElementById('wordHint').textContent = '💡 Pista: ' + w.hint;
  document.getElementById('wordInput').value = '';
  document.getElementById('wordResult').textContent = '';
  document.getElementById('wordProgress').textContent = `Palabra ${wIdx + 1} de ${wordBank.length} · Correctas: ${wCorrect}`;
}

function checkWord() {
  const ans = document.getElementById('wordInput').value.trim().toUpperCase().replace(/\s/g, '');
  if (!ans) return;
  if (ans === wordBank[wIdx].word) {
    sfxCorrect();
    document.getElementById('wordResult').textContent = '✅ ¡Correcto!';
    document.getElementById('wordResult').style.color = '#10b981';
    showToast('✅ ¡Correcto! +1', 'correct');
    wCorrect++;
    setTimeout(nextWord, 800);
  } else {
    sfxWrong();
    document.getElementById('wordResult').textContent = '❌ Intenta de nuevo';
    document.getElementById('wordResult').style.color = '#f43f5e';
    showToast('❌ No es correcto, sigue intentando', 'wrong');
  }
}

function nextWord() {
  sfxClick();
  wIdx = (wIdx + 1) % wordBank.length;
  loadWord();
}
loadWord();

/* ══════════════════════════════════════════
   GAME 3: VERDADERO O FALSO
══════════════════════════════════════════ */
const tfData = [
  { q: 'Peter Senge publicó "La Quinta Disciplina" en 1990, definiendo las organizaciones que aprenden.', a: true,  fb: 'Correcto. La obra fue publicada en 1990 y se convirtió en un clásico de la administración moderna.' },
  { q: 'El Pensamiento Sistémico es la primera disciplina de Senge y puede aplicarse de forma aislada sin las demás.', a: false, fb: 'Falso. El Pensamiento Sistémico es la disciplina integradora (la "quinta"). Sin las otras cuatro disciplinas pierde su potencia transformadora.' },
  { q: 'Los modelos mentales son creencias arraigadas que pueden impedir ver nuevas oportunidades organizacionales.', a: true,  fb: 'Correcto. Los modelos mentales actúan como filtros cognitivos que pueden limitar la innovación si no se cuestionan.' },
  { q: 'El aprendizaje organizacional solo ocurre cuando todos los empleados reciben formación formal y certificada.', a: false, fb: 'Falso. El aprendizaje organizacional también ocurre de forma informal, a través de la práctica, el diálogo y la reflexión colectiva.' },
  { q: 'La Visión Compartida, según Senge, debe ser impuesta por la alta gerencia para garantizar la alineación de todos los miembros.', a: false, fb: 'Falso. La visión compartida debe emerger del diálogo genuino. Cuando se impone, genera cumplimiento superficial, no compromiso real.' },
  { q: 'Un bucle de retroalimentación reforzador amplifica continuamente una conducta o tendencia en el sistema.', a: true,  fb: 'Correcto. También llamado "círculo vicioso" o "espiral virtuosa" según el contexto, el bucle reforzador intensifica el comportamiento inicial.' },
];
let tfIdx = 0, tfRight = 0, tfAnswered = false;

function loadTF() {
  document.getElementById('tfQ').textContent = tfData[tfIdx].q;
  document.getElementById('tfFeedback').textContent = '';
  document.getElementById('tfFeedback').style.color = '';
  document.getElementById('tfScore').textContent = `Pregunta ${tfIdx + 1} de ${tfData.length} · Correctas: ${tfRight}`;
  document.getElementById('tfNextBtn').style.display = 'none';
  tfAnswered = false;
}

function checkTF(ans) {
  if (tfAnswered) return; tfAnswered = true;
  const d = tfData[tfIdx];
  if (ans === d.a) {
    sfxCorrect();
    document.getElementById('tfFeedback').textContent = '✅ ' + d.fb;
    document.getElementById('tfFeedback').style.color = '#10b981';
    showToast('✅ ¡Correcto!', 'correct');
    tfRight++;
  } else {
    sfxWrong();
    document.getElementById('tfFeedback').textContent = '❌ ' + d.fb;
    document.getElementById('tfFeedback').style.color = '#f43f5e';
    showToast('❌ Incorrecto — ' + d.fb.substring(0, 40) + '…', 'wrong', 3000);
  }
  document.getElementById('tfScore').textContent = `Pregunta ${tfIdx + 1} de ${tfData.length} · Correctas: ${tfRight}`;
  document.getElementById('tfNextBtn').style.display = 'inline-block';
}

function nextTF() {
  sfxClick();
  tfIdx = (tfIdx + 1) % tfData.length;
  if (tfIdx === 0) tfRight = 0;
  loadTF();
}
loadTF();

/* ══════════════════════════════════════════
   QUIZ FINAL
══════════════════════════════════════════ */
const quizData = [
  { q: '¿Cuál es el nombre de la obra de Peter Senge publicada en 1990 que establece el marco de las organizaciones inteligentes?', opts: ['El Arte de la Guerra', 'La Quinta Disciplina', 'Gestión del Conocimiento', 'La Organización del Futuro'], ans: 1, fb: 'La Quinta Disciplina (1990) es la obra seminal de Peter Senge donde desarrolla las cinco disciplinas de las organizaciones que aprenden.' },
  { q: '¿Cuál de las siguientes es considerada la disciplina integradora en el modelo de Senge?', opts: ['Dominio Personal', 'Visión Compartida', 'Pensamiento Sistémico', 'Aprendizaje en Equipo'], ans: 2, fb: 'El Pensamiento Sistémico es la "quinta disciplina" que integra y potencia a las otras cuatro, permitiendo ver las interdependencias del sistema.' },
  { q: 'Los modelos mentales son:', opts: ['Representaciones matemáticas del sistema', 'Supuestos e imágenes internamente arraigadas que influyen en nuestra comprensión del mundo', 'Herramientas de software para modelar organizaciones', 'Organigramas jerarquizados de la empresa'], ans: 1, fb: 'Los modelos mentales son supuestos e imágenes mentales arraigadas que filtran cómo percibimos el mundo y tomamos decisiones.' },
  { q: '¿Qué distingue el aprendizaje de "doble circuito" del de "circuito simple"?', opts: ['El doble circuito usa más recursos', 'El circuito simple cuestiona supuestos subyacentes', 'El doble circuito cuestiona los supuestos subyacentes, no solo corrige errores', 'Son términos equivalentes'], ans: 2, fb: 'Según Argyris y Schön, el aprendizaje de doble circuito va más allá de corregir errores para cuestionar los supuestos y normas que generaron el error.' },
  { q: '¿Cuál empresa es un ejemplo clásico de organización inteligente por su sistema de mejora continua Kaizen?', opts: ['Microsoft', 'Apple', 'Toyota', 'Amazon'], ans: 2, fb: 'Toyota y su sistema TPS con la filosofía Kaizen es un referente mundial de organización que aprende y mejora continuamente.' },
  { q: 'Un bucle de retroalimentación compensador en un sistema organizacional:', opts: ['Amplifica continuamente un comportamiento', 'Busca estabilizar el sistema hacia un objetivo', 'Siempre genera efectos negativos', 'Es equivalente al aprendizaje de circuito simple'], ans: 1, fb: 'Los bucles compensadores buscan llevar el sistema hacia un estado objetivo o de equilibrio, estabilizando el comportamiento.' },
  { q: 'La Visión Compartida según Senge debe:', opts: ['Ser definida exclusivamente por la gerencia', 'Emerger del diálogo genuino entre los miembros de la organización', 'Estar enfocada solo en metas financieras', 'Cambiar anualmente para adaptarse al mercado'], ans: 1, fb: 'La visión compartida genuina emerge de un proceso dialógico. Cuando se impone desde arriba, genera cumplimiento pero no el compromiso real necesario.' },
  { q: '¿Cuál de las siguientes NO es una de las cinco disciplinas de Senge?', opts: ['Dominio Personal', 'Gestión por Objetivos', 'Aprendizaje en Equipo', 'Modelos Mentales'], ans: 1, fb: 'La Gestión por Objetivos (MBO) es una herramienta de administración, pero no es una de las cinco disciplinas de Senge.' },
  { q: 'El concepto de "palanca de cambio" en el pensamiento sistémico se refiere a:', opts: ['Herramientas físicas para mover maquinaria', 'El punto del sistema donde una pequeña acción produce grandes cambios', 'La persona más influyente de la organización', 'Un tipo de contrato organizacional'], ans: 1, fb: 'En el pensamiento sistémico, la palanca de cambio es el lugar del sistema donde una pequeña intervención puede producir cambios significativos y duraderos.' },
  { q: '¿Cuál es la relación entre la Teoría General de Sistemas (TGS) y las organizaciones inteligentes?', opts: ['No tienen relación', 'La TGS provee el marco conceptual para entender las organizaciones como sistemas complejos que aprenden', 'Las organizaciones inteligentes reemplazaron a la TGS', 'La TGS solo aplica a sistemas físicos, no organizacionales'], ans: 1, fb: 'La TGS provee el fundamento teórico: las organizaciones son sistemas abiertos con entradas, procesos, salidas y retroalimentación. El Pensamiento Sistémico de Senge es, esencialmente, una aplicación de la TGS.' },
];
let qCurrent = 0, qScore = 0, qAnswered = false;

function renderQuiz() {
  const c = document.getElementById('quizContainer');
  if (qCurrent >= quizData.length) {
    const pct = Math.round(qScore / quizData.length * 100);
    let grade = '', col = '';
    sfxComplete();
    if (pct >= 90) { grade = '🏆 Excelente — Dominio completo del tema'; col = 'var(--cyan)'; showToast('🏆 ¡Resultado excelente!', 'correct', 4000); }
    else if (pct >= 70) { grade = '👍 Bueno — Comprensión sólida con algunos vacíos'; col = 'var(--emerald)'; showToast('👍 ¡Buen resultado!', 'correct', 3000); }
    else if (pct >= 50) { grade = '📖 Regular — Se recomienda repasar el material'; col = 'var(--amber)'; showToast('📖 Repasa el contenido', 'info', 3000); }
    else { grade = '💡 Sigue estudiando — Vuelve a revisar los conceptos'; col = 'var(--rose)'; showToast('💡 ¡Sigue estudiando!', 'wrong', 3000); }

    c.innerHTML = `
      <div class="quiz-result">
        <div class="big-score">${qScore}/${quizData.length}</div>
        <p>${pct}% de respuestas correctas</p>
        <div class="grade" style="color:${col}">${grade}</div>
        <button class="btn btn-primary" style="margin-top:32px" onclick="resetQuiz()"><span>Intentar de nuevo</span></button>
      </div>`;
    document.getElementById('qProgress').style.width = '100%';
    return;
  }

  const d = quizData[qCurrent];
  document.getElementById('qProgress').style.width = (qCurrent / quizData.length * 100) + '%';
  c.innerHTML = `
    <div class="quiz-num-indicator">Pregunta ${qCurrent + 1} de ${quizData.length}</div>
    <div class="quiz-q">${d.q}</div>
    <div class="quiz-opts">${d.opts.map((o, i) => `<button class="quiz-opt" onclick="answerQuiz(${i})">${String.fromCharCode(65 + i)}. ${o}</button>`).join('')}</div>
    <div class="quiz-feedback" id="qfb"></div>
    <div class="quiz-nav">
      <span class="quiz-counter">Correctas: ${qScore} de ${qCurrent}</span>
      <button class="btn btn-outline" id="qnext" style="display:none" onclick="nextQ()">Siguiente →</button>
    </div>`;
  qAnswered = false;
}

function answerQuiz(i) {
  if (qAnswered) return; qAnswered = true;
  const d = quizData[qCurrent];
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach(o => o.style.pointerEvents = 'none');
  if (i === d.ans) {
    opts[i].classList.add('correct');
    qScore++;
    sfxCorrect();
    showToast('✅ ¡Correcto!', 'correct');
    document.getElementById('qfb').textContent = '✅ ' + d.fb;
    document.getElementById('qfb').style.color = '#10b981';
  } else {
    opts[i].classList.add('wrong');
    opts[d.ans].classList.add('correct');
    sfxWrong();
    showToast('❌ Respuesta incorrecta', 'wrong');
    document.getElementById('qfb').textContent = '❌ ' + d.fb;
    document.getElementById('qfb').style.color = '#f43f5e';
  }
  document.getElementById('qnext').style.display = 'inline-block';
}

function nextQ() { sfxClick(); qCurrent++; renderQuiz(); }
function resetQuiz() { sfxClick(); qCurrent = 0; qScore = 0; renderQuiz(); }
renderQuiz();

/* ══════════════════════════════════════════
   VIDEO (carga iframe al hacer clic)
══════════════════════════════════════════ */
function playVideo(id, videoId) {
  sfxClick();
  const el = document.getElementById(id);
  el.classList.add('loaded');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  el.appendChild(iframe);
}

/* ══════════════════════════════════════════
   EJERCICIOS INTERACTIVOS
══════════════════════════════════════════ */
const exFeedback = {
  1: {
    b: { correct: true,  msg: '✅ <strong>¡Correcto! Es Aprendizaje en Equipo.</strong><br>La clave está en el diálogo sin jerarquías y la suspensión de supuestos: características centrales de esta disciplina. También hay un elemento de Visión Compartida al buscar objetivos comunes.' },
    other: { correct: false, msg: '❌ <strong>No es la más precisa.</strong><br>La disciplina principal aquí es el <em>Aprendizaje en Equipo</em>: reuniones sin jerarquías + escuchar activamente + suspender juicios = diálogo genuino colectivo.' }
  },
  2: {
    a: { correct: true,  msg: '✅ <strong>¡Correcto! Es un Bucle Reforzador.</strong><br>Cada variable amplifica la siguiente: más estrés → más errores → más vigilancia → menos autonomía → más estrés. Se autoalimenta en espiral. Para romperlo, el pensamiento sistémico sugiere intervenir en la <em>palanca de cambio</em> con mayor apalancamiento: la <strong>autonomía</strong>.' },
    other: { correct: false, msg: '❌ <strong>No es correcto.</strong><br>El bucle es <em>Reforzador</em> (también llamado "espiral viciosa"): cada elemento amplifica el siguiente y el ciclo se retroalimenta indefinidamente, agravando el problema original.' }
  },
  3: {
    c: { correct: true,  msg: '✅ <strong>¡Correcto! Es un modelo mental rígido.</strong><br>Este supuesto ("vigilancia = productividad") es la <em>Teoría X de McGregor</em>: ver al empleado como perezoso por naturaleza. La disciplina de Modelos Mentales propone: llevar el supuesto a la superficie → someterlo a escrutinio con evidencia → practicar la indagación reflexiva.' },
    other: { correct: false, msg: '❌ <strong>No es la descripción más precisa.</strong><br>El núcleo del problema es un <em>modelo mental rígido</em>: un supuesto arraigado ("sin vigilancia no hay productividad") que filtra la evidencia real y bloquea el cambio. La disciplina de Modelos Mentales aborda exactamente esto.' }
  }
};

function checkOpt(exNum, btn, correctKey) {
  const opts = document.querySelectorAll('#exOpts' + exNum + ' .ex-opt');
  opts.forEach(o => { o.disabled = true; });

  const allOpts = Array.from(opts);
  const idx = allOpts.indexOf(btn);
  const letters = ['a', 'b', 'c', 'd'];
  const chosen = letters[idx];

  const fb = document.getElementById('exFb' + exNum);
  const isCorrect = chosen === correctKey;

  if (isCorrect) {
    btn.classList.add('opt-correct');
    sfxCorrect();
    showToast('✅ ¡Respuesta correcta!', 'correct');
    fb.innerHTML = exFeedback[exNum][correctKey].msg;
    fb.className = 'ex-feedback show fb-correct';
  } else {
    btn.classList.add('opt-wrong');
    allOpts[letters.indexOf(correctKey)].classList.add('opt-correct');
    sfxWrong();
    showToast('❌ Respuesta incorrecta — revisa la explicación', 'wrong', 3000);
    fb.innerHTML = exFeedback[exNum][correctKey === chosen ? correctKey : 'other'].msg;
    fb.className = 'ex-feedback show fb-wrong';
  }
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── EJERCICIO 4: respuesta abierta ── */
const disciplinas = [
  'pensamiento sistémico', 'dominio personal', 'modelos mentales',
  'visión compartida', 'aprendizaje en equipo'
];

function checkText4() {
  const val = document.getElementById('exText4').value.trim().toLowerCase();
  const fb = document.getElementById('exFb4');

  if (val.length < 30) {
    fb.innerHTML = '⚠️ Escribe una respuesta más completa (describe la iniciativa y menciona la disciplina).';
    fb.className = 'ex-feedback show fb-wrong';
    sfxWrong();
    return;
  }

  const found = disciplinas.filter(d => val.includes(d));
  if (found.length === 0) {
    fb.innerHTML = '⚠️ <strong>Casi...</strong> Tu respuesta tiene contenido, pero no mencionas explícitamente el nombre de alguna disciplina de Senge.<br><br>Las cinco disciplinas son: <em>Pensamiento Sistémico, Dominio Personal, Modelos Mentales, Visión Compartida, Aprendizaje en Equipo</em>. Intenta incluir alguna en tu respuesta.';
    fb.className = 'ex-feedback show fb-wrong';
    sfxWrong();
    showToast('⚠️ Incluye el nombre de una disciplina', 'wrong', 3000);
  } else {
    const nombradas = found.map(d => '<strong>' + d.charAt(0).toUpperCase() + d.slice(1) + '</strong>').join(', ');
    fb.innerHTML = '✅ <strong>¡Excelente respuesta!</strong> Mencionaste correctamente: ' + nombradas + '.<br><br><em>Respuesta modelo como referencia:</em><br>• <strong>Foros interfacultades</strong> → Aprendizaje en Equipo<br>• <strong>Plan estratégico participativo</strong> → Visión Compartida<br>• <strong>Revisión de procesos con datos</strong> → Modelos Mentales + Pensamiento Sistémico<br>• <strong>Formación y autoconocimiento docente</strong> → Dominio Personal';
    fb.className = 'ex-feedback show fb-correct';
    sfxCorrect();
    showToast('✅ ¡Muy bien! Respuesta válida', 'correct', 3000);
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function resetEx4() {
  document.getElementById('exText4').value = '';
  const fb = document.getElementById('exFb4');
  fb.className = 'ex-feedback';
  fb.innerHTML = '';
  sfxClick();
}
