// ── LOADER (hanya di halaman pertama, bukan antar halaman) ──
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (!l) return;
  setTimeout(() => {
    l.style.opacity = '0';
    setTimeout(() => l.remove(), 300);
  }, 800); // lebih cepat dari sebelumnya
});

// ── MOBILE MENU ──
function toggleMobile() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}

// ── TOAST ──
function showToast(msg, type = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100px)';
    t.style.transition = 'all .3s';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ── STAT COUNTER ──
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    let cur = 0;
    const inc = target / 60;
    const tmr = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(tmr); }
      el.textContent = Math.floor(cur).toLocaleString('id') + suffix;
    }, 20);
  });
}

// ── KODI AI ──
const KODI_SYSTEM = `Kamu adalah Kodi, asisten AI yang ceria dan ramah untuk platform belajar KODAI.
Membantu siswa SD dan SMP Indonesia belajar coding dan AI.
Gaya bahasa: santai, menyemangati, sesekali pakai emoji. Jawaban singkat (maks 3 kalimat).
Kamu bisa: menjelaskan konsep coding, beri hint game, evaluasi logika siswa, kasih semangat.
Selalu jawab dalam Bahasa Indonesia.`;

let kodiHistory = [];

function toggleKodiChat() {
  const panel = document.getElementById('kodiPanel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open') && kodiHistory.length === 0) {
    addKodiMsg('bot', 'Halo! Aku Kodi 🤖✨ Siap bantu kamu belajar coding & AI! Tanya apa aja atau minta hint kalau lagi stuck!');
  }
}

function addKodiMsg(role, text) {
  const msgs = document.getElementById('kodiMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'kodi-msg ' + (role === 'user' ? 'user' : '');
  div.innerHTML = role === 'user'
    ? `<div class="kodi-msg-av" style="background:var(--purple)">👤</div><div class="kodi-bubble">${text}</div>`
    : `<div class="kodi-msg-av">🤖</div><div class="kodi-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  if (role === 'bot') kodiHistory.push({ role: 'assistant', content: text });
}

function showKodiTyping() {
  const msgs = document.getElementById('kodiMessages');
  if (!msgs) return null;
  const div = document.createElement('div');
  div.className = 'kodi-msg'; div.id = 'kodiTyping';
  div.innerHTML = `<div class="kodi-msg-av">🤖</div><div class="kodi-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

async function sendKodiMessage() {
  const input = document.getElementById('kodiInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addKodiMsg('user', text);
  kodiHistory.push({ role: 'user', content: text });
  const typing = showKodiTyping();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: KODI_SYSTEM,
        messages: kodiHistory.slice(-10)
      })
    });
    const data = await res.json();
    typing?.remove();
    const reply = data.content?.[0]?.text || 'Maaf, aku lagi bingung 😅 Coba tanya lagi ya!';
    addKodiMsg('bot', reply);
  } catch(e) {
    typing?.remove();
    addKodiMsg('bot', 'Aduh, koneksi gangguan 😅 Coba lagi sebentar ya!');
  }
}

// ── PROGRESS BAR ANIMATION ──
function animateProgressBars() {
  document.querySelectorAll('.prog-fill').forEach(bar => {
    const w = bar.getAttribute('data-width') || bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 150);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('kodiInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendKodiMessage();
  });
  setTimeout(animateCounters, 500);
});
