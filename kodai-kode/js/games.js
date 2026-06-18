// ============================================================
// KODAI PLAYGROUND — 5 Mini Games (Fixed + Kurikulum-Aligned)
// Kurikulum: Kemendikdasmen 2025/2026 Coding & AI SD-SMP
// ============================================================

let currentGame = 'maze';
let totalScore = 0;

function switchGame(name) {
  currentGame = name;
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('game-' + name)?.classList.add('active');
  document.querySelector(`[data-game="${name}"]`)?.classList.add('active');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function showWin(title, sub) {
  const ov = document.getElementById('winOverlay');
  if (!ov) return;
  document.getElementById('winTitle').textContent = title;
  document.getElementById('winSub').textContent = sub;
  ov.classList.add('show');
}
function hideWin() {
  document.getElementById('winOverlay')?.classList.remove('show');
}

// ============================================================
// GAME 1 — PUZZLE MAZE (FIXED)
// Kurikulum: Algoritma & Urutan Langkah (SD Kelas 5-6, SMP)
// ============================================================
const MAZE_LEVELS = [
  {
    rows: 5, cols: 5,
    // 0=jalan, 1=tembok, 2=tujuan
    grid: [
      [0,0,1,0,0],
      [0,1,0,1,0],
      [0,0,0,0,0],
      [1,0,1,0,1],
      [0,0,0,0,2],
    ],
    start: {r:0, c:0},
    desc: 'Level 1: Bawa Kodi ke ⭐! Gunakan MAJU dan KANAN.'
  },
  {
    rows: 5, cols: 6,
    grid: [
      [0,1,0,0,0,0],
      [0,1,0,1,1,0],
      [0,0,0,0,1,0],
      [1,1,1,0,1,0],
      [0,0,0,0,0,2],
    ],
    start: {r:0, c:0},
    desc: 'Level 2: Lebih susah! Coba pakai ULANGI×3 biar lebih hemat blok.'
  },
  {
    rows: 6, cols: 6,
    grid: [
      [0,0,1,0,0,0],
      [1,0,1,0,1,0],
      [0,0,0,0,1,0],
      [0,1,1,0,0,0],
      [0,0,1,0,1,1],
      [1,0,0,0,0,2],
    ],
    start: {r:0, c:0},
    desc: 'Level 3: Tantangan penuh! Pikirkan jalur terpendek.'
  },
];

let mazeLevel = 0;
let charPos = {r:0, c:0};
let placedBlocks = [];
let isRunning = false;
let visitedCells = [];

function initMaze() {
  const lv = MAZE_LEVELS[mazeLevel];
  charPos = {...lv.start};
  visitedCells = [];
  placedBlocks = [];
  isRunning = false;
  renderMaze();
  clearDropZone();
  clearConsole();
  logMsg('💡 ' + lv.desc, 'warn');
  const lbl = document.getElementById('maze-level-label');
  if (lbl) lbl.textContent = 'Level ' + (mazeLevel + 1) + ' / ' + MAZE_LEVELS.length;
  updateMazeScore();
}

function renderMaze() {
  const grid = document.getElementById('mazeGrid');
  if (!grid) return;
  const lv = MAZE_LEVELS[mazeLevel];
  grid.style.gridTemplateColumns = `repeat(${lv.cols}, 52px)`;
  grid.innerHTML = '';
  for (let r = 0; r < lv.rows; r++) {
    for (let c = 0; c < lv.cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'maze-cell';
      const isChar = r === charPos.r && c === charPos.c;
      const val = lv.grid[r][c];
      const isVisited = visitedCells.some(v => v.r===r && v.c===c);

      if (isChar)         { cell.classList.add('cell-char');    cell.textContent = '🤖'; }
      else if (val === 2) { cell.classList.add('cell-end');     cell.textContent = '⭐'; }
      else if (val === 1) { cell.classList.add('cell-wall');    cell.textContent = '🧱'; }
      else if (r===lv.start.r && c===lv.start.c) { cell.classList.add('cell-start'); cell.textContent='🏁'; }
      else if (isVisited) { cell.classList.add('cell-visited'); }
      else                { cell.classList.add('cell-empty'); }
      grid.appendChild(cell);
    }
  }
}

function addMazeBlock(name, color) {
  placedBlocks.push({name, color});
  const dz = document.getElementById('dropZone');
  const ph = document.getElementById('dz-ph');
  if (ph) ph.remove();
  const b = document.createElement('div');
  b.className = 'placed-block';
  b.style.background = color;
  b.innerHTML = `${name}<button class="rm-block" onclick="removeMazeBlock(this,event)">✕</button>`;
  dz.appendChild(b);
}

function removeMazeBlock(btn, e) {
  e.stopPropagation();
  const idx = Array.from(btn.parentElement.parentElement.children).indexOf(btn.parentElement);
  placedBlocks.splice(idx, 1);
  btn.parentElement.remove();
  if (placedBlocks.length === 0) resetDropZonePH();
}

function resetDropZonePH() {
  const dz = document.getElementById('dropZone');
  if (!dz) return;
  if (!document.getElementById('dz-ph')) {
    const ph = document.createElement('div');
    ph.id = 'dz-ph';
    ph.style.cssText = 'color:rgba(255,255,255,.2);font-size:.8rem;font-weight:600;width:100%;text-align:center;padding:18px 0;';
    ph.textContent = 'Klik blok di atas untuk tambah 👆';
    dz.appendChild(ph);
  }
}

function clearDropZone() {
  placedBlocks = [];
  const dz = document.getElementById('dropZone');
  if (dz) {
    dz.innerHTML = '';
    resetDropZonePH();
  }
}

function clearConsole() {
  const c = document.getElementById('mazeConsole');
  if (c) c.innerHTML = '';
}

function logMsg(msg, cls = '') {
  const c = document.getElementById('mazeConsole');
  if (!c) return;
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.textContent = msg;
  c.appendChild(p);
  c.scrollTop = c.scrollHeight;
}

function updateMazeScore() {
  const el = document.getElementById('mazeScore');
  if (el) el.textContent = totalScore;
}

function expandBlocks(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.name.includes('ULANGI')) {
      // Repeat previous 2 blocks 3 times
      const prev = out.slice(-2);
      if (prev.length > 0) {
        for (let r = 0; r < 3; r++) prev.forEach(x => out.push({...x}));
      }
    } else {
      out.push(b);
    }
  }
  return out;
}

async function runMaze() {
  if (isRunning) { showToast('⏳ Program sedang berjalan!', 'warning'); return; }
  if (placedBlocks.length === 0) { showToast('⚠️ Tambahkan blok dulu!', 'warning'); return; }

  isRunning = true;
  clearConsole();
  logMsg('▶ Program dimulai...');

  const lv = MAZE_LEVELS[mazeLevel];
  charPos = {...lv.start};
  visitedCells = [];
  renderMaze();

  const actions = expandBlocks(placedBlocks);
  let won = false;

  for (let i = 0; i < actions.length; i++) {
    const b = actions[i];
    await delay(400);

    const prev = {...charPos};
    let moved = false;

    if (b.name.includes('MAJU')) {
      if (charPos.r > 0) { charPos.r--; moved = true; }
      logMsg('⬆ Maju');
    } else if (b.name.includes('MUNDUR')) {
      if (charPos.r < lv.rows - 1) { charPos.r++; moved = true; }
      logMsg('⬇ Mundur');
    } else if (b.name.includes('KANAN')) {
      if (charPos.c < lv.cols - 1) { charPos.c++; moved = true; }
      logMsg('➡ Kanan');
    } else if (b.name.includes('KIRI')) {
      if (charPos.c > 0) { charPos.c--; moved = true; }
      logMsg('⬅ Kiri');
    } else if (b.name.includes('JIKA')) {
      logMsg('❓ Cek kondisi...');
    }

    if (moved) {
      // Wall check
      if (lv.grid[charPos.r][charPos.c] === 1) {
        logMsg('💥 Nabrak tembok! Program berhenti.', 'err');
        charPos = {...prev};
        renderMaze();
        isRunning = false;
        showToast('💥 Nabrak tembok! Coba rute lain.', 'error');
        return;
      }

      // Out of bounds check
      if (charPos.r < 0 || charPos.r >= lv.rows || charPos.c < 0 || charPos.c >= lv.cols) {
        charPos = {...prev};
        logMsg('⚠️ Keluar batas maze!', 'err');
        renderMaze();
        isRunning = false;
        return;
      }

      visitedCells.push({...charPos});
      renderMaze();

      // Win check
      if (lv.grid[charPos.r][charPos.c] === 2) {
        logMsg('🎉 BERHASIL! Kodi sampai ke tujuan!', 'ok');
        totalScore += 300;
        updateMazeScore();
        won = true;
        break;
      }
    }
  }

  isRunning = false;
  if (won) {
    showToast('🎉 Level ' + (mazeLevel + 1) + ' selesai! +300 XP', 'success');
    setTimeout(() => showWin('Maze Selesai! 🎉', `Pakai ${placedBlocks.length} blok, Kodi berhasil sampai tujuan!`), 300);
  } else {
    logMsg('⚠️ Program selesai tapi Kodi belum sampai tujuan.', 'warn');
    showToast('🤔 Kodi belum sampai! Tambahkan blok lagi.', 'warning');
  }
}

function resetMaze() {
  isRunning = false;
  initMaze();
}

function nextMazeLevel() {
  mazeLevel = (mazeLevel + 1) % MAZE_LEVELS.length;
  hideWin();
  initMaze();
}

// ============================================================
// GAME 2 — URUTKAN ALGORITMA
// Kurikulum: Urutan Langkah & Berpikir Komputasional (SD Kelas 5-6)
// Siswa menyusun langkah-langkah yang acak menjadi urutan yang benar
// ============================================================
const ALGO_CHALLENGES = [
  {
    title: 'Cara Membuat Mie Instan 🍜',
    desc: 'Urutkan langkah-langkah membuat mie instan yang benar! Drag atau klik nomor urutan.',
    steps: [
      'Rebus air hingga mendidih',
      'Masukkan mie ke dalam air mendidih',
      'Tunggu 3 menit sampai mie matang',
      'Tiriskan air dari mie',
      'Masukkan bumbu ke dalam mangkuk',
      'Tuang mie ke mangkuk dan aduk',
    ],
    correct: [0,1,2,3,4,5],
    emoji: '🍜'
  },
  {
    title: 'Login ke Aplikasi 📱',
    desc: 'Ini adalah algoritma login. Susun langkahnya agar benar!',
    steps: [
      'Buka aplikasi',
      'Masukkan username',
      'Masukkan password',
      'Klik tombol Login',
      'Cek apakah username & password benar',
      'Jika benar → masuk ke halaman utama',
      'Jika salah → tampilkan pesan error',
    ],
    correct: [0,1,2,3,4,5,6],
    emoji: '📱'
  },
  {
    title: 'Mencari Nilai Terbesar 🔢',
    desc: 'Algoritma mencari angka terbesar dari 3 angka. Susun dengan benar!',
    steps: [
      'Mulai dengan angka pertama sebagai "terbesar"',
      'Bandingkan "terbesar" dengan angka kedua',
      'Jika angka kedua lebih besar, ganti "terbesar"',
      'Bandingkan "terbesar" dengan angka ketiga',
      'Jika angka ketiga lebih besar, ganti "terbesar"',
      'Tampilkan nilai "terbesar"',
    ],
    correct: [0,1,2,3,4,5],
    emoji: '🔢'
  },
];

let algoIdx = 0;
let algoOrder = [];
let algoScore = 0;
let algoSelected = null;

function initAlgo() {
  const ch = ALGO_CHALLENGES[algoIdx];
  document.getElementById('algo-title').textContent = ch.title;
  document.getElementById('algo-desc').textContent = ch.desc;
  document.getElementById('algo-score').textContent = algoScore;
  document.getElementById('algo-level').textContent = `Soal ${algoIdx + 1}/${ALGO_CHALLENGES.length}`;

  // Shuffle steps
  algoOrder = [...Array(ch.steps.length).keys()].sort(() => Math.random() - .5);
  algoSelected = null;
  renderAlgoSteps();
  document.getElementById('algo-feedback').textContent = '';
}

function renderAlgoSteps() {
  const ch = ALGO_CHALLENGES[algoIdx];
  const container = document.getElementById('algoSteps');
  container.innerHTML = algoOrder.map((stepIdx, pos) => `
    <div class="algo-step ${algoSelected === pos ? 'selected' : ''}" onclick="selectAlgoStep(${pos})" data-pos="${pos}">
      <div class="step-num">${pos + 1}</div>
      <div class="step-text">${ch.steps[stepIdx]}</div>
      <div class="step-arrows">
        ${pos > 0 ? `<button onclick="moveAlgoStep(${pos}, ${pos-1}, event)">⬆</button>` : '<span></span>'}
        ${pos < algoOrder.length-1 ? `<button onclick="moveAlgoStep(${pos}, ${pos+1}, event)">⬇</button>` : '<span></span>'}
      </div>
    </div>
  `).join('');
}

function selectAlgoStep(pos) {
  if (algoSelected === null) {
    algoSelected = pos;
  } else if (algoSelected === pos) {
    algoSelected = null;
  } else {
    // Swap
    const tmp = algoOrder[algoSelected];
    algoOrder[algoSelected] = algoOrder[pos];
    algoOrder[pos] = tmp;
    algoSelected = null;
  }
  renderAlgoSteps();
}

function moveAlgoStep(from, to, e) {
  e.stopPropagation();
  const tmp = algoOrder[from];
  algoOrder[from] = algoOrder[to];
  algoOrder[to] = tmp;
  algoSelected = null;
  renderAlgoSteps();
}

function checkAlgo() {
  const ch = ALGO_CHALLENGES[algoIdx];
  const isCorrect = algoOrder.every((v, i) => v === ch.correct[i]);
  const fb = document.getElementById('algo-feedback');

  if (isCorrect) {
    algoScore += 200;
    document.getElementById('algo-score').textContent = algoScore;
    totalScore += 200;
    fb.textContent = '✅ Urutan benar! Algoritma kamu sempurna!';
    fb.style.color = '#2EC486';
    showToast('🎉 Urutan benar! +200 XP', 'success');
    setTimeout(() => {
      algoIdx = (algoIdx + 1) % ALGO_CHALLENGES.length;
      initAlgo();
    }, 1800);
  } else {
    fb.textContent = '❌ Belum tepat. Coba pikirkan langkah yang logis!';
    fb.style.color = '#FF4444';
    showToast('❌ Urutannya belum benar. Coba lagi!', 'error');
    // Highlight wrong positions
    document.querySelectorAll('.algo-step').forEach((el, i) => {
      if (algoOrder[i] !== ch.correct[i]) {
        el.style.borderColor = '#FF4444';
        setTimeout(() => el.style.borderColor = '', 1500);
      }
    });
  }
}

function resetAlgo() {
  initAlgo();
}

// ============================================================
// GAME 3 — LOGIKA IF-ELSE
// Kurikulum: Percabangan & Kondisi (SD Kelas 6 - SMP Kelas 7)
// ============================================================
const IFELSE_CHALLENGES = [
  {
    title: 'Gerbang Sekolah 🏫',
    scenario: 'Sistem gerbang otomatis sekolah. Siswa bisa masuk HANYA jika sudah punya kartu pelajar DAN datang sebelum jam 07:30.',
    conditions: { kartu: true, jam: '07:15' },
    question: 'Budi punya kartu pelajar, tiba jam 07:15. Apa yang terjadi?',
    options: ['Gerbang terbuka ✅', 'Gerbang tertutup ❌', 'Menunggu dulu ⏳', 'Error 🔴'],
    answer: 0,
    explanation: 'Kartu ✅ DAN jam 07:15 < 07:30 ✅ → kedua kondisi terpenuhi → gerbang TERBUKA!'
  },
  {
    title: 'Kalkulator Nilai 📊',
    scenario: 'Program menentukan kelulusan ujian.\nJIKA nilai >= 75 → "LULUS"\nJIKA nilai >= 60 DAN < 75 → "REMIDI"\nJIKA nilai < 60 → "TIDAK LULUS"',
    conditions: { nilai: 68 },
    question: 'Sari mendapat nilai 68. Apa hasilnya?',
    options: ['LULUS', 'REMIDI', 'TIDAK LULUS', 'ERROR'],
    answer: 1,
    explanation: '68 >= 60 ✅ DAN 68 < 75 ✅ → masuk kondisi kedua → REMIDI!'
  },
  {
    title: 'Lampu Lalu Lintas 🚦',
    scenario: 'Robot pengatur lalu lintas.\nMERAH → Berhenti\nKUNING → Siap-siap\nHIJAU → Jalan\nSelain itu → Rusak',
    conditions: { warna: 'HIJAU' },
    question: 'Lampu menunjukkan warna HIJAU. Apa yang harus dilakukan?',
    options: ['Berhenti', 'Siap-siap', 'Jalan', 'Panggil montir'],
    answer: 2,
    explanation: 'warna == "HIJAU" ✅ → instruksi: JALAN!'
  },
  {
    title: 'Diskon Belanja 🛒',
    scenario: 'Toko online beri diskon:\nJIKA total belanja >= 100.000 → diskon 20%\nJIKA total belanja >= 50.000 → diskon 10%\nJIKA total belanja < 50.000 → tidak ada diskon',
    conditions: { total: 75000 },
    question: 'Rafi belanja total Rp 75.000. Berapa diskon yang didapat?',
    options: ['Tidak ada diskon', 'Diskon 10%', 'Diskon 20%', 'Diskon 50%'],
    answer: 1,
    explanation: '75.000 < 100.000 → kondisi pertama TIDAK terpenuhi.\n75.000 >= 50.000 ✅ → kondisi kedua terpenuhi → diskon 10%!'
  },
];

let ifelseIdx = 0;
let ifelseScore = 0;

function initIfElse() {
  const ch = IFELSE_CHALLENGES[ifelseIdx];
  document.getElementById('ie-title').textContent = ch.title;
  document.getElementById('ie-scenario').textContent = ch.scenario;
  document.getElementById('ie-question').textContent = ch.question;
  document.getElementById('ie-score').textContent = ifelseScore;
  document.getElementById('ie-level').textContent = `Soal ${ifelseIdx + 1}/${IFELSE_CHALLENGES.length}`;
  document.getElementById('ie-explanation').textContent = '';
  document.getElementById('ie-explanation').style.display = 'none';

  const opts = document.getElementById('ie-options');
  opts.innerHTML = ch.options.map((opt, i) =>
    `<button class="ie-option" onclick="checkIfElse(this, ${i})">${opt}</button>`
  ).join('');
}

function checkIfElse(btn, idx) {
  const ch = IFELSE_CHALLENGES[ifelseIdx];
  document.querySelectorAll('.ie-option').forEach(b => b.disabled = true);
  const exp = document.getElementById('ie-explanation');

  if (idx === ch.answer) {
    btn.classList.add('ie-correct');
    ifelseScore += 150;
    totalScore += 150;
    document.getElementById('ie-score').textContent = ifelseScore;
    exp.textContent = '✅ ' + ch.explanation;
    exp.style.color = '#2EC486';
    exp.style.display = 'block';
    showToast('🎉 Logika benar! +150 XP', 'success');
    setTimeout(() => {
      ifelseIdx = (ifelseIdx + 1) % IFELSE_CHALLENGES.length;
      initIfElse();
    }, 2000);
  } else {
    btn.classList.add('ie-wrong');
    document.querySelectorAll('.ie-option')[ch.answer].classList.add('ie-correct');
    exp.textContent = '❌ ' + ch.explanation;
    exp.style.color = '#FF4444';
    exp.style.display = 'block';
    showToast('❌ Belum tepat! Baca penjelasannya ya.', 'error');
    setTimeout(() => {
      document.querySelectorAll('.ie-option').forEach(b => {
        b.disabled = false;
        b.classList.remove('ie-wrong', 'ie-correct');
      });
      exp.style.display = 'none';
    }, 2500);
  }
}

// ============================================================
// GAME 4 — PATTERN RECOGNITION + SORTING
// Kurikulum: Pola, Struktur Data, Berpikir Komputasional (SD-SMP)
// ============================================================
const PATTERN_LEVELS = [
  { seq: [2,4,6,'?'], answer: 8, choices: [7,8,9,10], rule: 'Pola +2', colors: ['#9B5DE5','#9B5DE5','#9B5DE5',null] },
  { seq: [1,3,9,'?'], answer: 27, choices: [12,18,27,30], rule: 'Pola ×3', colors: ['#FF4D8B','#FF4D8B','#FF4D8B',null] },
  { seq: ['🔴','🔵','🔴','?'], answer: '🔵', choices: ['🔴','🔵','🟡','🟢'], rule: 'Pola bergantian', colors: ['#FF4444','#4DABF7','#FF4444',null] },
  { seq: [1,1,2,3,5,'?'], answer: 8, choices: [6,7,8,9], rule: 'Fibonacci: tiap angka = jumlah 2 angka sebelumnya', colors: ['#00D4AA','#00D4AA','#00D4AA','#00D4AA','#00D4AA',null] },
  { seq: [100,50,25,'?'], answer: 12.5, choices: [10,12.5,20,25], rule: 'Pola ÷2', colors: ['#FF6B35','#FF6B35','#FF6B35',null] },
  { seq: ['🌑','🌒','🌓','?'], answer: '🌔', choices: ['🌕','🌔','🌙','🌑'], rule: 'Fase bulan berurutan', colors: ['#333','#555','#777',null] },
];
let patIdx = 0, patScore = 0, patStreak = 0;

function initPattern() {
  const lv = PATTERN_LEVELS[patIdx];
  document.getElementById('pat-level').textContent = `Level ${patIdx+1}/${PATTERN_LEVELS.length}`;
  document.getElementById('pat-score').textContent = patScore;
  document.getElementById('pat-streak').textContent = patStreak;
  document.getElementById('pat-rule').textContent = '';

  const seq = document.getElementById('patSeq');
  seq.innerHTML = lv.seq.map((item, i) => {
    const blank = item === '?';
    return `<div class="pat-item ${blank ? 'blank' : ''}" style="background:${blank ? 'transparent' : (lv.colors[i]||'#9B5DE5')}">${blank ? '?' : item}</div>`;
  }).join('');

  const choices = document.getElementById('patChoices');
  choices.innerHTML = lv.choices.map(ch =>
    `<button class="choice-btn" onclick="checkPattern(this,'${ch}')">${ch}</button>`
  ).join('');
}

function checkPattern(btn, val) {
  const lv = PATTERN_LEVELS[patIdx];
  const correct = String(val) === String(lv.answer);
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) {
    patScore += 100 + patStreak * 20;
    patStreak++;
    totalScore += 100;
    document.getElementById('pat-score').textContent = patScore;
    document.getElementById('pat-streak').textContent = patStreak;
    document.getElementById('pat-rule').textContent = '✅ ' + lv.rule;
    showToast(`🎉 Benar! +${100 + (patStreak-1)*20} XP`, 'success');
    setTimeout(() => { patIdx = (patIdx + 1) % PATTERN_LEVELS.length; initPattern(); }, 1800);
  } else {
    patStreak = 0;
    document.getElementById('pat-streak').textContent = '0';
    document.getElementById('pat-rule').textContent = '💡 Coba perhatikan hubungan antar elemen!';
    showToast('❌ Hampir! Coba lagi.', 'error');
    setTimeout(() => {
      document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = false; b.classList.remove('wrong'); });
    }, 1200);
  }
}

// ============================================================
// GAME 5 — AI TRAINER (Data Labeling)
// Kurikulum: Pengenalan AI & Machine Learning (SMP Kelas 7-9)
// ============================================================
const AI_TRAINING_DATA = [
  { emoji:'🐱', name:'Kucing', isAnimal:true },
  { emoji:'🐶', name:'Anjing', isAnimal:true },
  { emoji:'🦅', name:'Elang', isAnimal:true },
  { emoji:'🚗', name:'Mobil', isAnimal:false },
  { emoji:'✈️', name:'Pesawat', isAnimal:false },
  { emoji:'🐟', name:'Ikan', isAnimal:true },
  { emoji:'🏠', name:'Rumah', isAnimal:false },
  { emoji:'🦋', name:'Kupu-kupu', isAnimal:true },
  { emoji:'📱', name:'HP', isAnimal:false },
  { emoji:'🐸', name:'Katak', isAnimal:true },
];
const AI_TEST_DATA = [
  { emoji:'🦊', name:'Rubah', isAnimal:true },
  { emoji:'🚂', name:'Kereta', isAnimal:false },
  { emoji:'🦜', name:'Beo', isAnimal:true },
  { emoji:'💻', name:'Laptop', isAnimal:false },
];
let aiLabels = {};
let aiTrained = false;

function initAITrainer() {
  aiLabels = {};
  aiTrained = false;
  const grid = document.getElementById('aiDataGrid');
  if (!grid) return;
  grid.innerHTML = AI_TRAINING_DATA.map(d =>
    `<div class="data-point" id="dp-${d.name}" onclick="labelData('${d.name}')">
      <div class="dp-emoji">${d.emoji}</div>
      <div class="dp-name">${d.name}</div>
      <div class="dp-label none" id="lbl-${d.name}">Belum dilabeli</div>
    </div>`
  ).join('');
  const res = document.getElementById('aiResult');
  if (res) res.classList.remove('show');
  const pz = document.getElementById('aiPredictZone');
  if (pz) pz.style.display = 'none';
  document.getElementById('ai-labeled-count').textContent = '0';
}

function labelData(name) {
  const cur = aiLabels[name];
  if (!cur) aiLabels[name] = 'hewan';
  else if (cur === 'hewan') aiLabels[name] = 'bukan';
  else delete aiLabels[name];

  const dp = document.getElementById(`dp-${name}`);
  const lbl = document.getElementById(`lbl-${name}`);
  if (aiLabels[name] === 'hewan') {
    dp.className = 'data-point labeled-yes';
    lbl.className = 'dp-label y'; lbl.textContent = '✅ Hewan';
  } else if (aiLabels[name] === 'bukan') {
    dp.className = 'data-point labeled-no';
    lbl.className = 'dp-label n'; lbl.textContent = '❌ Bukan Hewan';
  } else {
    dp.className = 'data-point';
    lbl.className = 'dp-label none'; lbl.textContent = 'Belum dilabeli';
  }
  document.getElementById('ai-labeled-count').textContent = Object.keys(aiLabels).length;
}

function trainAI() {
  const labeled = Object.keys(aiLabels).length;
  if (labeled < 5) { showToast('Labeli minimal 5 data dulu!', 'warning'); return; }

  let correct = 0;
  Object.entries(aiLabels).forEach(([name, label]) => {
    const item = AI_TRAINING_DATA.find(d => d.name === name);
    if (!item) return;
    if ((item.isAnimal && label === 'hewan') || (!item.isAnimal && label === 'bukan')) correct++;
  });

  const acc = Math.round((correct / labeled) * 100);
  const prec = Math.min(acc + Math.floor(Math.random()*5), 100);
  const rec = Math.max(acc - Math.floor(Math.random()*8), 0);

  aiTrained = true;
  totalScore += Math.floor(acc * 2);

  document.getElementById('ai-acc-bar').style.width = acc + '%';
  document.getElementById('ai-acc-val').textContent = acc + '%';
  document.getElementById('ai-prec-bar').style.width = prec + '%';
  document.getElementById('ai-prec-val').textContent = prec + '%';
  document.getElementById('ai-rec-bar').style.width = rec + '%';
  document.getElementById('ai-rec-val').textContent = rec + '%';
  document.getElementById('aiResult').classList.add('show');

  if (acc >= 80) showToast('🤖 Model bagus! Akurasi ' + acc + '%', 'success');
  else showToast('⚠️ Akurasi ' + acc + '% — perbaiki labelmu!', 'warning');

  const pz = document.getElementById('aiPredictZone');
  if (pz) {
    pz.style.display = 'grid';
    pz.innerHTML = AI_TEST_DATA.map(t =>
      `<div class="predict-item" onclick="predictAI(this,'${t.name}')">
        <div class="pi-emoji">${t.emoji}</div>
        <div class="pi-name">${t.name}</div>
        <div class="pi-result" id="pred-${t.name}" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.4);">Klik prediksi!</div>
      </div>`
    ).join('');
  }
}

function predictAI(el, name) {
  if (!aiTrained) { showToast('Train dulu modelnya!', 'warning'); return; }
  const item = AI_TEST_DATA.find(d => d.name === name);
  if (!item) return;
  const result = document.getElementById(`pred-${name}`);
  if (item.isAnimal) {
    result.style.background = 'var(--green)'; result.style.color = 'white';
    result.textContent = '✅ Hewan';
  } else {
    result.style.background = 'var(--red)'; result.style.color = 'white';
    result.textContent = '❌ Bukan Hewan';
  }
  showToast('🤖 Prediksi dibuat!', 'success');
}

// ============================================================
// INIT ON LOAD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initMaze();
  initAlgo();
  initIfElse();
  initPattern();
  initAITrainer();
  switchGame('maze');
});
