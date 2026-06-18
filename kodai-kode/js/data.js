const COURSES = [
  {
    id:1, cat:'algoritma', emoji:'🧩', title:'Algoritma Dasar',
    level:'Pemula', color:'linear-gradient(135deg,#9B5DE5,#4DABF7)',
    desc:'Pelajari cara berpikir seperti komputer dengan cara yang menyenangkan!',
    dur:'2 jam', xp:200, progress:75,
    video:'Pengenalan: Apa Itu Algoritma?',
    videoDesc:'Video animasi interaktif menjelaskan konsep algoritma lewat contoh kehidupan sehari-hari.',
    syllabus:['Apa itu Algoritma?','Langkah-langkah berurutan','Percabangan sederhana','Latihan flowchart','Quiz & Badge Algoritma']
  },
  {
    id:2, cat:'logika', emoji:'🔀', title:'Logika IF/ELSE',
    level:'Pemula', color:'linear-gradient(135deg,#2EC486,#FFD93D)',
    desc:'Buat program yang bisa mengambil keputusan sendiri!',
    dur:'1.5 jam', xp:180, progress:60,
    video:'Pengenalan: Logika & Keputusan',
    videoDesc:'Animasi karakter Kodi memilih jalan lewat kondisi IF dan ELSE.',
    syllabus:['Apa itu kondisi?','Menggunakan IF','Menggunakan IF/ELSE','Kondisi bersarang','Quiz Logika']
  },
  {
    id:3, cat:'ai', emoji:'🤖', title:'Pengenalan AI',
    level:'Menengah', color:'linear-gradient(135deg,#FF4D8B,#FF6B35)',
    desc:'Mulai mengenal kecerdasan buatan dari dasar — bukan hanya pakai AI, tapi pahami cara kerjanya!',
    dur:'3 jam', xp:350, progress:40,
    video:'Apa Itu Kecerdasan Buatan?',
    videoDesc:'Penjelasan visual tentang AI, machine learning, dan contoh penerapannya di dunia nyata.',
    syllabus:['Apa itu AI?','Cara kerja Machine Learning','Data & Training Model','Contoh AI sehari-hari','Proyek AI sederhana']
  },
  {
    id:4, cat:'algoritma', emoji:'🔄', title:'Perulangan (Loop)',
    level:'Pemula', color:'linear-gradient(135deg,#4DABF7,#9B5DE5)',
    desc:'Pelajari cara menjalankan perintah berkali-kali dengan efisien.',
    dur:'2 jam', xp:220, progress:0,
    video:'Loop: Kerjain Tugas Berkali-Kali!',
    videoDesc:'Demonstrasi animasi bagaimana for loop dan while loop bekerja.',
    syllabus:['Konsep perulangan','For loop dasar','While loop','Perulangan bersarang','Latihan pola bintang']
  },
  {
    id:5, cat:'kolaborasi', emoji:'🤝', title:'Proyek Bareng',
    level:'Pemula', color:'linear-gradient(135deg,#FFD93D,#FF6B35)',
    desc:'Belajar bekerja sama dalam tim untuk membuat proyek coding yang keren!',
    dur:'4 jam', xp:400, progress:90,
    video:'Tim Coding: Kekuatan Kolaborasi',
    videoDesc:'Cara bekerja dalam tim coding, pembagian tugas, dan komunikasi yang efektif.',
    syllabus:['Pengantar kerja tim','Pembagian tugas','Kolaborasi online','Code review bareng','Presentasi proyek']
  },
  {
    id:6, cat:'ai', emoji:'🧠', title:'Machine Learning Dasar',
    level:'Menengah', color:'linear-gradient(135deg,#00D4AA,#9B5DE5)',
    desc:'Pelajari bagaimana komputer bisa belajar dari data secara mandiri!',
    dur:'4 jam', xp:450, progress:0,
    video:'Komputer yang Bisa Belajar Sendiri',
    videoDesc:'Visualisasi proses training model machine learning dengan contoh nyata.',
    syllabus:['Dataset & fitur','Supervised learning','Contoh klasifikasi','Mengukur akurasi model','Proyek prediksi sederhana']
  },
  {
    id:7, cat:'logika', emoji:'📦', title:'Fungsi & Variabel',
    level:'Menengah', color:'linear-gradient(135deg,#FF6B35,#FF4D8B)',
    desc:'Organisasi kode kamu seperti seorang pro! Variabel dan fungsi adalah kunci.',
    dur:'2.5 jam', xp:280, progress:0,
    video:'Variabel & Fungsi: Blok Pembangun Kode',
    videoDesc:'Penjelasan visual tentang variabel sebagai kotak penyimpanan dan fungsi sebagai resep.',
    syllabus:['Apa itu variabel?','Tipe data dasar','Membuat fungsi','Parameter & return','Kalkulator sederhana']
  },
  {
    id:8, cat:'kolaborasi', emoji:'🎨', title:'Desain UI Bersama',
    level:'Lanjut', color:'linear-gradient(135deg,#9B5DE5,#FF4D8B)',
    desc:'Buat tampilan aplikasi yang indah bersama tim! HTML, CSS, dan desain.',
    dur:'5 jam', xp:500, progress:0,
    video:'UI Design: Membuat Tampilan yang Keren',
    videoDesc:'Panduan visual membangun antarmuka web yang responsif dan menarik.',
    syllabus:['Dasar HTML','Styling CSS','Flexbox & Grid','Responsive design','Proyek website sekolah']
  },
];

// Render course cards
function renderCourses(filter = 'all') {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? COURSES : COURSES.filter(c => c.cat === filter);
  grid.innerHTML = filtered.map(c => `
    <div class="course-card card" onclick="openCourseModal(${c.id})">
      <div class="course-thumb" style="background:${c.color}">
        <div class="thumb-overlay">${c.emoji}</div>
        <span class="level-badge level-${c.level.toLowerCase()}">${c.level}</span>
      </div>
      <div class="course-body">
        <h3>${c.title}</h3>
        <p>${c.desc.substring(0,80)}...</p>
        <div class="course-meta">
          <span class="course-dur">⏱️ ${c.dur}</span>
          <span class="course-xp">💎 +${c.xp} XP</span>
        </div>
        ${c.progress > 0
          ? `<div class="prog-bar"><div class="prog-fill" style="width:${c.progress}%;background:${c.color}"></div></div>`
          : `<div class="prog-bar"><div class="prog-fill" style="width:0%"></div></div>`}
        <button class="btn-course">${c.progress > 0 ? '▶ Lanjutkan' : '🚀 Mulai Belajar'}</button>
      </div>
    </div>
  `).join('');
}

function filterCourse(btn, cat) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderCourses(cat);
}

function openCourseModal(id) {
  const c = COURSES.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modal-emoji').textContent = c.emoji;
  document.getElementById('modal-title').textContent = c.title;
  document.getElementById('modal-video-label').textContent = '▶ ' + c.video;
  document.getElementById('modal-video-desc').textContent = c.videoDesc;
  document.getElementById('modal-desc').textContent = c.desc;
  document.getElementById('modal-syllabus').innerHTML = c.syllabus.map((s,i) =>
    `<li><div class="syllabus-num">${i+1}</div>${s}</li>`
  ).join('');
  document.getElementById('courseModal').classList.add('open');
}

function closeCourseModal(e) {
  if (e.target === document.getElementById('courseModal'))
    document.getElementById('courseModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
});
