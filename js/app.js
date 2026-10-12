/**
 * AETHERIA FRONTEND CORE LOGIC & INTERACTIVE RADAR VISUALIZATION
 * Comprehensive Fixes based on paste-4.md:
 * 1. P0: True multi-profile data binding for Einstein, Da Vinci, Curie (Radar + Descriptions update dynamically)
 * 2. P0: Live Personal Chart calculation properly renders and updates the Life Map UI
 * 3. P0: Robust Location & Timezone handling with geocoding fallback
 * 4. P0: Full HTML sanitization (textContent & DOM nodes) to prevent Stored XSS
 * 5. P1: Responsive Life Map grid & accessible form controls
 */

// Canonical profiles with real distinct astronomical/traditional configurations
const BENCHMARK_PROFILES = {
  einstein: {
    name: "Albert Einstein",
    year: 1879,
    month: 3,
    day: 14,
    hour: 11,
    minute: 30,
    use_lmt: true,
    latitude: 48.4011,
    longitude: 9.9876,
    location_name: "Ulm, Germany (LMT)",
    domain_scores: {
      "Intellect & First Principles": { w: 0.95, b: 0.92, t: 0.94, n: 0.96 },
      "Vocation & Autonomy": { w: 0.89, b: 0.91, t: 0.90, n: 0.88 },
      "Material Resources": { w: 0.76, b: 0.82, t: 0.78, n: 0.80 },
      "Personal Well-being": { w: 0.70, b: 0.74, t: 0.75, n: 0.72 },
      "Partnership & Covenant": { w: 0.62, b: 0.68, t: 0.74, n: 0.65 },
      "Inner Transformation": { w: 0.88, b: 0.92, t: 0.91, n: 0.89 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "High consensus across all 4 systems. Characterized by rigorous deductive examination and foundational physical synthesis.",
        western_driver: "Mercury conjunct Saturn in Aries (orb 1.05°); Jupiter in Aquarius",
        eastern_driver: "Yang Fire Day Master; Cung Phúc Đức in Dần (Wood)"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "Convergence on independent research directorship and institutional founding over managerial administration.",
        western_driver: "Midheaven at 12° Pisces ruled by Jupiter",
        eastern_driver: "Cung Quan Lộc (Career) in Ngọ with sovereign command stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Moderate alignment. Resources accrued as byproducts of intellectual standing rather than commercial risk appetite.",
        western_driver: "2nd/8th house planetary aspects",
        eastern_driver: "Cung Tài Bạch in Thân"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "Somatic stamina sustained through philosophical equanimity; periods of deep cognitive absorption require rhythmic pacing.",
        western_driver: "Sun in Pisces; Moon in Sagittarius",
        eastern_driver: "Cung Tật Ách in Sửu; Five Element distribution"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Tension detected: Western charts highlight contractual friction; Tử Vi points to lasting fraternal alliances.",
        western_driver: "Venus in Aries semi-square Mars in Capricorn (80° orb)",
        eastern_driver: "Cung Phu Thê in Thìn"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Continuous reflective evolution through solitude and philosophical detachment.",
        western_driver: "Saturn in Aries conjunct Mercury",
        eastern_driver: "Cung Phúc Đức (Ancestral Mind) in Dần"
      }
    ]
  },
  da_vinci: {
    name: "Leonardo da Vinci",
    year: 1452,
    month: 4,
    day: 15,
    hour: 21,
    minute: 40,
    use_lmt: true,
    latitude: 43.7874,
    longitude: 10.9262,
    location_name: "Vinci, Italy (LMT)",
    domain_scores: {
      "Intellect & First Principles": { w: 0.98, b: 0.95, t: 0.96, n: 0.97 },
      "Vocation & Autonomy": { w: 0.86, b: 0.85, t: 0.88, n: 0.84 },
      "Material Resources": { w: 0.68, b: 0.72, t: 0.70, n: 0.69 },
      "Personal Well-being": { w: 0.80, b: 0.82, t: 0.81, n: 0.79 },
      "Partnership & Covenant": { w: 0.58, b: 0.62, t: 0.64, n: 0.60 },
      "Inner Transformation": { w: 0.94, b: 0.93, t: 0.95, n: 0.92 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "Polymathic cognitive architecture uniting visual empiricism with engineering mechanics and anatomical dissection.",
        western_driver: "Sun in Taurus; Moon in Pisces; Mercury in Aries",
        eastern_driver: "Water-Wood generative cycle in Month pillar"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "Independent court polymath and master inventor; non-linear vocational output spanning military and fine arts.",
        western_driver: "Midheaven in Libra trine Mercury",
        eastern_driver: "Quan Lộc Palace with creative transformation stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Patronage-dependent capital flow; financial stability tied to aristocratic commissions rather than commercial trade.",
        western_driver: "2nd House in Sagittarius; Jupiter in aspect",
        eastern_driver: "Tài Bạch Palace influenced by mobility stars"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "High somatic vitality and physical dexterity supported by vegetarian lifestyle and polyphasic rest cycles.",
        western_driver: "Mars in Aquarius sextile Sun",
        eastern_driver: "Equilibrium between Wood and Earth elements"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Fraternal studio apprenticeship covenant; preference for solitary intellectual creation over formal marital contracts.",
        western_driver: "Venus in Taurus in 7th House boundary",
        eastern_driver: "Phu Thê Palace in solitary branch position"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Continuous observational wonder regarding natural geometry, vortex dynamics, and sacred proportionality.",
        western_driver: "Neptune / Uranus angular correlations",
        eastern_driver: "Phúc Đức Palace governed by high-order wisdom stars"
      }
    ]
  },
  curie: {
    name: "Marie Curie",
    year: 1867,
    month: 11,
    day: 7,
    hour: 12,
    minute: 0,
    use_lmt: true,
    latitude: 52.2297,
    longitude: 21.0122,
    location_name: "Warsaw, Poland (LMT)",
    domain_scores: {
      "Intellect & First Principles": { w: 0.96, b: 0.94, t: 0.95, n: 0.96 },
      "Vocation & Autonomy": { w: 0.92, b: 0.94, t: 0.93, n: 0.91 },
      "Material Resources": { w: 0.65, b: 0.70, t: 0.68, n: 0.66 },
      "Personal Well-being": { w: 0.58, b: 0.62, t: 0.60, n: 0.59 },
      "Partnership & Covenant": { w: 0.80, b: 0.78, t: 0.82, n: 0.79 },
      "Inner Transformation": { w: 0.89, b: 0.90, t: 0.91, n: 0.88 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "Relentless empirical scrutiny and isolation of novel physical elements through disciplined chemical crystallization.",
        western_driver: "Sun in Scorpio conjunct Saturn; Mercury in Scorpio",
        eastern_driver: "Yin Metal Day Master with concentrated Earth support"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "First dual Nobel laureate; established sovereign radium research institute despite patriarchal institutional barriers.",
        western_driver: "Midheaven in Scorpio conjunct Mars",
        eastern_driver: "Quan Lộc Palace with unyielding endurance stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Deliberate disavowal of patent royalties; radium process unpatented to ensure unimpeded scientific access.",
        western_driver: "2nd House in Pisces; Jupiter in aspect",
        eastern_driver: "Tài Bạch Palace showing detached capital accumulation"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "Cumulative radiation exposure and somatic fatigue; exceptional psychological fortitude enduring physical strain.",
        western_driver: "Pluto angular aspects; Saturn in Scorpio",
        eastern_driver: "Tật Ách Palace showing structural endurance with energetic strain"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Profound intellectual and personal synergy with Pierre Curie; unified research partnership sharing Nobel recognition.",
        western_driver: "7th House in Taurus ruled by Venus",
        eastern_driver: "Phu Thê Palace with mutually reinforcing nobility stars"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Unwavering stoicism, scientific altruism, and dedication to humanitarian medical radiological service.",
        western_driver: "Sun-Saturn conjunction in Scorpio",
        eastern_driver: "Phúc Đức Palace anchored in deep perseverance"
      }
    ]
  }
};

let currentProfile = BENCHMARK_PROFILES.einstein;
let activeTraditions = { w: true, b: true, t: true, n: true };

const LIFE_THEMES = [
  "Intellect & First Principles",
  "Vocation & Autonomy",
  "Material Resources",
  "Personal Well-being",
  "Partnership & Covenant",
  "Inner Transformation"
];

// Localization Dictionary (Pure English and Pure Vietnamese - Zero Mixing)
const I18N = {
  en: {
    nav_explore: "✦ Explore",
    nav_audit: "🔬 Audit",
    nav_lifemap: "Life Map",
    nav_blog: "Methods & Blog",
    nav_deepdive: "East–West Lab",
    nav_matrix: "Matrix",
    nav_claims: "Claims",
    nav_ledger: "Ledger",
    nav_registry: "Registry",
    hero_eyebrow: "A digital ritual across four symbolic traditions",
    hero_title: "One life.<br><em>Many celestial lenses.</em>",
    hero_subhead: "Where do ancient systems agree? And where do their doctrines break apart?",
    hero_desc: "We translate Tử Vi, Bát Tự, Western astrology, and Pythagorean numerology into structured, traceable claims. Explore your life map across multiple traditions, inspect the classical rules behind each claim, and track predictions against real-world milestones over time.",
    btn_explore_sample: "Explore Sample Life Map",
    btn_build_map: "Build My Own Map",
    hero_disclaimer: "Designed for deep self-reflection and comparative inquiry. Predictive accuracy is a hypothesis under test, not an unquestioned dogma.",
    blog_eyebrow: "Publications & Method Monographs",
    blog_title: "Foundational Research Notes",
    blog_desc: "Explore our architectural monographs breaking down every calculation canon we have implemented and planned — from sub-arcsecond Swiss Ephemerides to True Solar Time BaZi and the cryptographic Brier scoring protocol.",
    deepdive_eyebrow: "Interactive Foundations Lab",
    deepdive_title: "East–West Comparative Laboratory",
    deepdive_desc: "Explore our dual calculation baselines: authentic Tử Vi Đẩu Số 12 palaces computed with the Ho Ngoc Duc lunisolar calendar alongside Astrodienst-standard Swiss Ephemeris coordinates and aspect matrices.",
    tab_synthesis: "✦ East–West Synthesis Monograph",
    tab_tuvi: "☯ Tử Vi 12 Palaces Matrix",
    tab_astro: "🪐 Astrodienst Planetary Wheel",
    tuvi_grid_hint: "Ho Ngoc Duc Lunisolar Algorithmic Ephemeris",
    astro_bigthree_title: "The Big Three & Cardinal Angles",
    astro_aspects_title: "Geometric Aspects & Strict Orbs",
    th_aspect: "Aspect",
    th_bodies: "Bodies",
    th_orb: "Angle / Orb"
  },
  vi: {
    nav_explore: "✦ Khám Phá",
    nav_audit: "🔬 Kiểm Toán",
    nav_lifemap: "Bản Đồ Mệnh",
    nav_blog: "Phương Pháp & Chuyên Đề",
    nav_deepdive: "Đông–Tây Đối Sánh",
    nav_matrix: "Ma Trận Đối Chiếu",
    nav_claims: "Mệnh Đề",
    nav_ledger: "Sổ Cái",
    nav_registry: "Hệ Quy Chuẩn",
    hero_eyebrow: "Một nghi thức số hóa qua bốn trường phái biểu tượng",
    hero_title: "Một đời người.<br><em>Đa chiều tinh tú.</em>",
    hero_subhead: "Các cổ thư đồng thuận ở đâu? Và học thuyết phân kỳ tại những điểm nào?",
    hero_desc: "Chúng tôi quy chuẩn Tử Vi, Bát Tự, Chiêm Tinh Tây phương và Thần Số Học thành các mệnh đề cấu trúc có thể truy nguyên. Khám phá bản đồ cuộc đời đa hệ thống, kiểm chứng quy tắc cổ điển và theo dõi các dự đoán theo kết quả thực tế qua thời gian.",
    btn_explore_sample: "Khám Phá Bản Mẫu",
    btn_build_map: "Lập Bản Đồ Cá Nhân",
    hero_disclaimer: "Công cụ phục vụ tự phản tư và đối chiếu học thuật. Năng lực dự báo là giả thuyết cần kiểm chứng, không phải lời hứa bán hàng.",
    blog_eyebrow: "Chuyên Đề & Chuyên Khảo Học Thuật",
    blog_title: "Ghi Chép Phương Pháp Nghiên Cứu",
    blog_desc: "Tìm hiểu các chuyên khảo kiến trúc chi tiết từng môn phái: từ thiên văn Swiss Ephemeris chuẩn xác đến Giờ Mặt Trời Thực trong Bát Tự và giao thức chấm điểm Brier Loss có khóa SHA-256.",
    deepdive_eyebrow: "Phòng Thí Nghiệm Cơ Sở",
    deepdive_title: "Đối Sánh Nền Tảng Đông – Tây",
    deepdive_desc: "Khám phá hai hệ quy chiếu cơ sở: lá số Tử Vi Đẩu Số 12 cung chính phái theo Lịch Vạn Niên Hồ Ngọc Đức song hành cùng tọa độ Swiss Ephemeris và góc chiếu chuẩn Astrodienst.",
    tab_synthesis: "✦ Chuyên Khảo Hợp Nhất Đông – Tây",
    tab_tuvi: "☯ Lá Số Tử Vi 12 Cung",
    tab_astro: "🪐 Bản Đồ Sao Chiêm Tinh",
    tuvi_grid_hint: "Lịch Âm Dương Thiên Văn Hồ Ngọc Đức & Jean Meeus",
    astro_bigthree_title: "Bộ Ba Trọng Yếu & Các Điểm Trục",
    astro_aspects_title: "Mạng Lưới Góc Chiếu & Sai Số Chuẩn",
    th_aspect: "Góc Chiếu",
    th_bodies: "Thiên Thể",
    th_orb: "Góc / Sai Số"
  }
};

let currentLang = "en";

// Auto-detect language based on browser/locale or saved preference
function detectUserLanguage() {
  const saved = localStorage.getItem('aetheria_lang');
  if (saved === 'vi' || saved === 'en') return saved;
  
  // Check navigator language and timezone
  const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  
  if (navLang.startsWith('vi') || tz.includes('Saigon') || tz.includes('Ho_Chi_Minh') || tz.includes('Bangkok') || tz.includes('Hanoi')) {
    return 'vi';
  }
  return 'en';
}

function setLanguage(lang) {
  currentLang = (lang === 'vi') ? 'vi' : 'en';
  localStorage.setItem('aetheria_lang', currentLang);
  document.documentElement.lang = currentLang;

  // Update lang buttons
  const btnEn = document.getElementById('btn-lang-en');
  const btnVi = document.getElementById('btn-lang-vi');
  if (btnEn) btnEn.classList.toggle('active', currentLang === 'en');
  if (btnVi) btnVi.classList.toggle('active', currentLang === 'vi');

  // Update all elements with data-i18n
  const dict = I18N[currentLang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Re-fetch localized content
  loadArticles();
  loadSynthesisMonograph();
}

// Helper: Escape HTML string safely
function escapeHtml(str) {
  if (typeof str !== 'string') return String((str !== null && str !== undefined) ? str : '');
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function roundVal(v) {
  return Math.round(Math.min(1.0, Math.max(0.4, v)) * 100) / 100;
}

// Background Canvas
function initCelestialCanvas() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('space-canvas');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  for (let i = 0; i < 75; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const step = 90;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    for (const s of stars) {
      s.x += s.dx; s.y += s.dy;
      if (s.x < 0) s.x = width; if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height; if (s.y > height) s.y = 0;

      ctx.fillStyle = `rgba(245, 158, 11, ${s.alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
}

// Draw Multi-Layer Radar SVG
function drawRadarSVG(svgId, radius = 135) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  svg.innerHTML = '';

  const numAxes = LIFE_THEMES.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Concentric Web
  const rings = [0.25, 0.5, 0.75, 1.0];
  rings.forEach((rScale, idx) => {
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * (radius * rScale);
      const y = Math.sin(angle) * (radius * rScale);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', points.join(' '));
    poly.setAttribute('fill', idx === rings.length - 1 ? 'rgba(18, 24, 36, 0.45)' : 'none');
    poly.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
    poly.setAttribute('stroke-width', '1');
    svg.appendChild(poly);
  });

  // Axes & Axis Labels
  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0'); line.setAttribute('y1', '0');
    line.setAttribute('x2', x.toFixed(1)); line.setAttribute('y2', y.toFixed(1));
    line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
    line.setAttribute('stroke-dasharray', '2 2');
    svg.appendChild(line);

    const labelX = Math.cos(angle) * (radius + 24);
    const labelY = Math.sin(angle) * (radius + 18);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelX.toFixed(1));
    text.setAttribute('y', labelY.toFixed(1));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#94a3b8');
    text.setAttribute('font-size', '10px');
    text.setAttribute('font-family', 'Inter, sans-serif');
    text.setAttribute('font-weight', '500');
    text.textContent = LIFE_THEMES[i];
    svg.appendChild(text);
  }

  // Layers for each tradition
  const layers = [
    { key: 'w', color: '#38bdf8', fill: 'rgba(56, 189, 248, 0.12)' },
    { key: 'b', color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.12)' },
    { key: 't', color: '#ec4899', fill: 'rgba(236, 72, 153, 0.10)' },
    { key: 'n', color: '#a855f7', fill: 'rgba(168, 85, 247, 0.10)' }
  ];

  layers.forEach(layer => {
    if (!activeTraditions[layer.key]) return;

    const polyPoints = [];
    for (let i = 0; i < numAxes; i++) {
      const theme = LIFE_THEMES[i];
      const val = (currentProfile.domain_scores[theme] || {})[layer.key] || 0.75;
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * (radius * val);
      const y = Math.sin(angle) * (radius * val);
      polyPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', polyPoints.join(' '));
    poly.setAttribute('fill', layer.fill);
    poly.setAttribute('stroke', layer.color);
    poly.setAttribute('stroke-width', '1.6');
    svg.appendChild(poly);

    for (let i = 0; i < numAxes; i++) {
      const theme = LIFE_THEMES[i];
      const val = (currentProfile.domain_scores[theme] || {})[layer.key] || 0.75;
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * (radius * val);
      const y = Math.sin(angle) * (radius * val);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('r', '2.5');
      circle.setAttribute('fill', layer.color);
      svg.appendChild(circle);
    }
  });
}

// Render Thematic Details Dynamically from currentProfile for Moon Ivory Editorial Specimen
function renderThemeList() {
  const container = document.getElementById('domain-cards-list');
  if (!container) return;
  container.innerHTML = '';

  // Also update report masthead title & subtitle if present
  const mastheadName = document.getElementById('report-subject-name');
  const mastheadCoords = document.getElementById('report-subject-coords');
  if (mastheadName) mastheadName.textContent = currentProfile.name;
  if (mastheadCoords) {
    const hr = currentProfile.hour !== null ? String(currentProfile.hour).padStart(2, '0') : '--';
    const mn = currentProfile.minute !== null ? String(currentProfile.minute).padStart(2, '0') : '--';
    mastheadCoords.textContent = `${currentProfile.year}-${String(currentProfile.month).padStart(2, '0')}-${String(currentProfile.day).padStart(2, '0')} • ${hr}:${mn} • ${currentProfile.location_name}`;
  }

  const details = currentProfile.theme_details || [];
  details.forEach(item => {
    const card = document.createElement('div');
    card.className = 'theme-editorial-item';

    // Header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'theme-header-row';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'theme-title';
    titleEl.textContent = `${item.icon} ${item.theme}`;

    const badgeSpan = document.createElement('span');
    const isVi = (currentLang === 'vi');
    const isTension = (item.theme.includes('Partnership') || (item.synthesis && (item.synthesis.includes('Tension') || item.synthesis.includes('xung đột'))));
    if (isTension) {
      badgeSpan.className = 'status-chip contradicted';
      badgeSpan.textContent = isVi ? 'Có Điểm Bất Đồng' : 'Doctrinal Divergence';
    } else {
      badgeSpan.className = 'status-chip confirmed';
      badgeSpan.textContent = isVi ? 'Đồng Thuận Diễn Giải' : 'Interpretive Consensus';
    }
    headerDiv.appendChild(titleEl);
    headerDiv.appendChild(badgeSpan);

    // Synthesis paragraph
    const pEl = document.createElement('p');
    pEl.className = 'theme-summary-text';
    pEl.textContent = item.synthesis;

    // Driver box
    const driverBox = document.createElement('div');
    driverBox.className = 'theme-driver-box';
    
    const westDiv = document.createElement('div');
    westDiv.innerHTML = `<strong>Western:</strong> ${escapeHtml(item.western_driver)}`;
    
    const eastDiv = document.createElement('div');
    eastDiv.style.marginTop = "0.2rem";
    eastDiv.innerHTML = `<strong>Eastern:</strong> ${escapeHtml(item.eastern_driver)}`;

    driverBox.appendChild(westDiv);
    driverBox.appendChild(eastDiv);

    card.appendChild(headerDiv);
    card.appendChild(pEl);
    card.appendChild(driverBox);

    container.appendChild(card);
  });
}

// Canonical Claim Lifecycle Data
const CLAIMS_LIFECYCLE = [
  {
    id: "W-INT-01",
    tradition: "Western Astrodienst Ephemeris",
    tradition_tag: "western",
    original: "Mercury at 03°08' Aries conjunct Saturn at 04°19' Aries (orb 1.1°); Midheaven at 12° Pisces; Jupiter at 27° Aquarius.",
    normalized: "Cognitive style fuses pioneering theoretical inquiry with deep mathematical scrutiny applied to foundational first principles.",
    mapping_rationale: "Mercury-Saturn tight conjunction in cardinal fire (Aries) signifies rigorous deductive discipline applied to unproven assumptions.",
    criteria: "Publication of peer-reviewed physical monographs overturning reigning classical paradigms within observation cycle.",
    falsification_status: "Verified in 1905 Historical Retrospective (Photoelectric & Relativity monographs)."
  },
  {
    id: "T-VOC-01",
    tradition: "Tử Vi Đẩu Số (12 Palaces)",
    tradition_tag: "tuvi",
    original: "Cung Quan Lộc (Career Palace) positioned in Earthly Branch Ngọ (Fire) with sovereign command star configurations.",
    normalized: "Destiny trajectory dictates autonomous executive agency and academic mastery over bureaucratic or corporate administration.",
    mapping_rationale: "Cung Quan Lộc governs professional authority and public standing in traditional Tử Vi.",
    criteria: "Appointment to sovereign academic directorship or Nobel prize conferral without administrative subjugation.",
    falsification_status: "Verified in 1914–1921 Retrospective (Kaiser Wilhelm Directorship & Nobel Prize)."
  },
  {
    id: "N-VOC-01",
    tradition: "Pythagorean & Chaldean Numerology",
    tradition_tag: "numerology",
    original: "Full digit sum: 1+8+7+9+0+3+1+4 = 33 (Master 33). Period reduction: (1879=7) + (03=3) + (14=5) = 15 -> 6 (Guardian).",
    normalized: "Life path reflects foundational systems stewardship (6) and universal teaching/elevation mandate (Master 33).",
    mapping_rationale: "Documents both documented calculation conventions: Master preservation vs standard period reduction.",
    criteria: "Dedication to universal educational or open theoretical systems dissemination.",
    falsification_status: "Retrospective thematic congruence; not prospective proof."
  }
];

function renderClaimLifecycle() {
  const container = document.getElementById('claims-container');
  if (!container) return;
  container.innerHTML = '';

  CLAIMS_LIFECYCLE.forEach(c => {
    const card = document.createElement('div');
    card.className = 'claim-card-editorial';

    // Header
    const topDiv = document.createElement('div');
    topDiv.className = 'claim-top-row';
    topDiv.innerHTML = `
      <div>
        <span class="tradition-tag ${escapeHtml(c.tradition_tag)}">${escapeHtml(c.tradition)}</span>
        <strong style="font-size:0.95rem; color:var(--moon-ivory); font-family:var(--font-mono);">${escapeHtml(c.id)}</strong>
      </div>
      <span class="status-chip demo">Traceable Lifecycle</span>
    `;

    // Lifecycle 3 steps
    const lifecycleDiv = document.createElement('div');
    lifecycleDiv.className = 'claim-phases-grid';

    // Step 1
    const s1 = document.createElement('div');
    s1.innerHTML = `<div class="phase-step-title">Phase I: Original Tradition Statement</div><p class="phase-step-body">${escapeHtml(c.original)}</p>`;

    // Step 2
    const s2 = document.createElement('div');
    s2.innerHTML = `
      <div class="phase-step-title">Phase II: Normalized Claim & Rationale</div>
      <p class="phase-step-body"><strong>Claim:</strong> ${escapeHtml(c.normalized)}</p>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;"><em>Rationale:</em> ${escapeHtml(c.mapping_rationale)}</div>
    `;

    // Step 3
    const s3 = document.createElement('div');
    s3.innerHTML = `
      <div class="phase-step-title">Phase III: Falsification Rule & Verification</div>
      <p class="phase-step-body"><strong>Criteria:</strong> ${escapeHtml(c.criteria)}</p>
      <div style="font-size:0.75rem; color:var(--celestial-gold); margin-top:0.4rem; font-family:var(--font-mono);">${escapeHtml(c.falsification_status)}</div>
    `;

    lifecycleDiv.appendChild(s1);
    lifecycleDiv.appendChild(s2);
    lifecycleDiv.appendChild(s3);

    card.appendChild(topDiv);
    card.appendChild(lifecycleDiv);
    container.appendChild(card);
  });
}

// Fetch and Render Prediction Ledger with DOM element creation (Strictly Sanitized)
async function loadPredictionLedger() {
  const container = document.getElementById('ledger-records-list');
  if (!container) return;

  try {
    const res = await fetch('/api/outcomes');
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();

    container.innerHTML = '';
    data.records.forEach(r => {
      const item = document.createElement('div');
      item.className = 'ledger-record-item';
      
      const isVi = (currentLang === 'vi');
      let typeLabel = isVi ? "DỰ ĐOÁN ĐĂNG KÝ TRƯỚC" : "PROSPECTIVE PRE-REGISTRATION";
      let typeClass = "confirmed";
      if (r.record_type === 'retrospective_demo') {
        typeLabel = isVi ? "MINH HỌA HỒI TỐ (DEMO)" : "RETROSPECTIVE ILLUSTRATION (DEMO)";
        typeClass = "demo";
      } else if (r.record_type === 'synthetic_test') {
        typeLabel = isVi ? "DỮ LIỆU KIỂM THỬ THUẬT TOÁN" : "SYNTHETIC TEST BENCHMARK";
        typeClass = "demo";
      } else if (r.record_type !== 'prospective_pre_reg') {
        typeLabel = isVi ? "LOẠI BẢN GHI KHÔNG XÁC ĐỊNH" : "UNSPECIFIED RECORD TYPE";
        typeClass = "demo";
      }

      let statusBadge = isVi ? "Chưa Xác Định" : "Unresolved";
      let statusClass = "demo";
      if (r.status === 'confirmed_aligned') {
        statusBadge = isVi ? "Đã Xác Thực Phù Hợp" : "Confirmed Aligned";
        statusClass = "confirmed";
      } else if (r.status === 'contradicted') {
        statusBadge = isVi ? "Bị Bác Bỏ (Sai Lệch)" : "Contradicted (Falsified)";
        statusClass = "contradicted";
      } else if (r.status === 'locked_pending') {
        statusBadge = isVi ? "Đã Khóa (Đang Chờ Thời Hạn)" : "Locked (Pending Window)";
        statusClass = "pending";
      } else if (r.status === 'unresolved') {
        statusBadge = isVi ? "Chưa Thể Kết Luận" : "Unresolved / Indeterminate";
        statusClass = "demo";
      }
      const shortSha = (r.sha256_lock || '').substring(0, 16) + '...';

      // Header row
      const headerRow = document.createElement('div');
      headerRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem; flex-wrap:wrap; gap:0.5rem;";

      const leftDiv = document.createElement('div');
      const badgeSpan = document.createElement('span');
      badgeSpan.className = `status-chip ${typeClass}`;
      badgeSpan.textContent = typeLabel;

      const subjectEl = document.createElement('strong');
      subjectEl.style.cssText = "margin-left:0.5rem; font-size:0.875rem; color:var(--moon-ivory);";
      subjectEl.textContent = r.subject_name;

      leftDiv.appendChild(badgeSpan);
      leftDiv.appendChild(subjectEl);

      const statusSpan = document.createElement('span');
      statusSpan.className = `status-chip ${statusClass}`;
      statusSpan.textContent = statusBadge;
      headerRow.appendChild(leftDiv);
      headerRow.appendChild(statusSpan);

      // Statement row
      const stmtRow = document.createElement('div');
      stmtRow.style.cssText = "font-size:0.875rem; color:#cbd5e1; margin-bottom:0.4rem;";
      stmtRow.textContent = `Forecast (${r.target_window}): ${r.statement}`;

      // Observed row
      const obsRow = document.createElement('div');
      const outcomeVal = (r.observed_outcome && r.observed_outcome.trim() !== '') ? r.observed_outcome : (isVi ? "Khoảng thời gian quan sát đang diễn ra hoặc chưa có báo cáo kết quả." : "Observation window active or outcome report pending.");
      obsRow.textContent = `${isVi ? 'Kết quả quan sát:' : 'Observed Outcome:'} ${outcomeVal}`;
      // Footer row
      const footerRow = document.createElement('div');
      footerRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim); flex-wrap:wrap; gap:0.5rem;";

      const shaDiv = document.createElement('div');
      shaDiv.textContent = `SHA-256 Lock: ${shortSha} `;

      const auditBtn = document.createElement('button');
      auditBtn.type = "button";
      auditBtn.className = "btn-inspect-audit";
      auditBtn.setAttribute("data-id", r.record_id);
      auditBtn.style.cssText = "background:none; border:none; color:var(--cyan-light); cursor:pointer; text-decoration:underline; margin-left:0.5rem;";
      auditBtn.textContent = "Inspect Full Audit";
      auditBtn.addEventListener('click', () => inspectAuditRecord(r.record_id));

      shaDiv.appendChild(auditBtn);

      const lossDiv = document.createElement('div');
      if (typeof r.brier_loss === 'number' && !isNaN(r.brier_loss)) {
        lossDiv.textContent = `${isVi ? 'Điểm Brier Loss:' : 'Brier Loss:'} ${r.brier_loss}`;
      } else if (typeof r.forecast_probability === 'number' && !isNaN(r.forecast_probability)) {
        lossDiv.textContent = `${isVi ? 'Xác suất dự báo:' : 'Forecast Prob:'} ${r.forecast_probability}`;
      } else {
        lossDiv.textContent = isVi ? 'Chưa chấm điểm' : 'Unscored';
      }
      footerRow.appendChild(shaDiv);
      footerRow.appendChild(lossDiv);

      item.appendChild(headerRow);
      item.appendChild(stmtRow);
      item.appendChild(obsRow);
      item.appendChild(footerRow);

      container.appendChild(item);
    });
  } catch (err) {
    console.warn("Could not load prediction ledger:", err);
  }
}

// Fetch and Render Methodology Registry from /api/methodologies
async function loadMethodologyRegistry() {
  const container = document.getElementById('methodologies-list');
  if (!container) return;

  try {
    const res = await fetch('/api/methodologies');
    if (!res.ok) throw new Error("API request failed");
    const registry = await res.json();

    container.innerHTML = '';
    Object.entries(registry).forEach(([canonKey, item]) => {
      const card = document.createElement('div');
      card.className = 'registry-editorial-card';

      const headerDiv = document.createElement('div');
      headerDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;";
      
      const titleEl = document.createElement('h4');
      titleEl.style.cssText = "font-family:var(--font-serif); font-size:1.35rem; font-weight:500; color:var(--moon-ivory);";
      titleEl.textContent = item.name;

      const badgeSpan = document.createElement('span');
      badgeSpan.className = 'status-chip demo';
      badgeSpan.textContent = item.canon_id;


      headerDiv.appendChild(titleEl);
      headerDiv.appendChild(badgeSpan);

      const metaDiv = document.createElement('div');
      metaDiv.className = 'registry-meta';
      metaDiv.innerHTML = `<span><strong>Engine:</strong> ${escapeHtml(item.primary_engine)}</span> <span>•</span> <span><strong>Status:</strong> ${escapeHtml(item.implementation_status)}</span>`;

      const inputP = document.createElement('p');
      inputP.style.cssText = "font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem; line-height:1.6;";
      inputP.innerHTML = `<strong>Input Requirements:</strong> ${escapeHtml(item.input_requirements)}`;

      const sourcesBox = document.createElement('div');
      sourcesBox.style.cssText = "background:rgba(0,0,0,0.3); border-radius:8px; padding:0.85rem; font-size:0.8rem; margin-bottom:0.75rem;";
      
      const sourcesTitle = document.createElement('strong');
      sourcesTitle.style.color = "var(--text-main)";
      sourcesTitle.textContent = "Classical Textual Citations:";

      const ulEl = document.createElement('ul');
      ulEl.style.cssText = "padding-left:1.25rem; margin-top:0.35rem; line-height:1.6; color:#cbd5e1;";
      (item.classical_sources || []).forEach(src => {
        const li = document.createElement('li');
        li.textContent = src;
        ulEl.appendChild(li);
      });

      sourcesBox.appendChild(sourcesTitle);
      sourcesBox.appendChild(ulEl);

      const limitationsDiv = document.createElement('div');
      limitationsDiv.style.cssText = "font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);";
      limitationsDiv.innerHTML = `<strong>Known Limitations:</strong> ${escapeHtml(item.known_limitations)}`;

      card.appendChild(headerDiv);
      card.appendChild(metaDiv);
      card.appendChild(inputP);
      card.appendChild(sourcesBox);
      card.appendChild(limitationsDiv);

      container.appendChild(card);
    });
  } catch (err) {
    console.warn("Could not load methodology registry:", err);
  }
}

// Audit Record Inspector Modal (Safe textContent rendering)
async function inspectAuditRecord(recordId) {
  const modal = document.getElementById('audit-drawer');
  const backdrop = document.getElementById('audit-backdrop');
  const content = document.getElementById('audit-detail-content');
  if (!modal || !content) return;

  try {
    const res = await fetch(`/api/ledger/verify/${encodeURIComponent(recordId)}`);
    if (!res.ok) throw new Error("Record not found");
    const data = await res.json();

    content.innerHTML = '';

    const topDiv = document.createElement('div');
    topDiv.style.marginBottom = "1.25rem";

    const badgeSpan = document.createElement('span');
    badgeSpan.className = "status-badge working";
    badgeSpan.textContent = String(data.record_type || '').toUpperCase();

    const titleEl = document.createElement('h4');
    titleEl.style.cssText = "font-size:1.1rem; font-weight:700; margin-top:0.5rem;";
    titleEl.textContent = `Record ID: ${data.record_id}`;

    const timeDiv = document.createElement('div');
    timeDiv.style.cssText = "font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono); margin-top:0.25rem;";
    timeDiv.textContent = `Timestamp: ${data.timestamp} UTC`;

    topDiv.appendChild(badgeSpan);
    topDiv.appendChild(titleEl);
    topDiv.appendChild(timeDiv);

    // Full SHA-256 textarea
    const shaGroup = document.createElement('div');
    shaGroup.className = "form-group";
    const shaLabel = document.createElement('label');
    shaLabel.className = "form-label";
    shaLabel.textContent = "Full SHA-256 Cryptographic Hash Digest";

    const shaTextarea = document.createElement('textarea');
    shaTextarea.className = "text-input";
    shaTextarea.readOnly = true;
    shaTextarea.style.cssText = "font-family:var(--font-mono); font-size:0.75rem; height:60px; resize:none;";
    shaTextarea.value = data.sha256_lock || '';

    shaGroup.appendChild(shaLabel);
    shaGroup.appendChild(shaTextarea);

    // Payload pre
    const payloadGroup = document.createElement('div');
    payloadGroup.className = "form-group";
    const payloadLabel = document.createElement('label');
    payloadLabel.className = "form-label";
    payloadLabel.textContent = "Pre-Registered JSON Payload";

    const preEl = document.createElement('pre');
    preEl.style.cssText = "background:var(--bg-elevated); padding:0.85rem; border-radius:8px; font-size:0.75rem; font-family:var(--font-mono); color:#cbd5e1; overflow-x:auto;";
    preEl.textContent = JSON.stringify(data.raw_payload, null, 2);

    payloadGroup.appendChild(payloadLabel);
    payloadGroup.appendChild(preEl);

    // Conditional Verified / Mismatch note based on data.is_verified boolean
    const verifiedDiv = document.createElement('div');
    if (data.is_verified === true) {
      verifiedDiv.style.cssText = "background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:0.75rem; font-size:0.75rem; color:var(--emerald-accent);";
      verifiedDiv.innerHTML = `<strong>✓ Cryptographic Verification Passed:</strong> Payload re-hash matches locked SHA-256 digest.<br><span style="color:var(--text-muted);">${escapeHtml(data.verifier_notes || '')}</span>`;
    } else {
      verifiedDiv.style.cssText = "background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); border-radius:8px; padding:0.75rem; font-size:0.75rem; color:var(--rose-accent);";
      verifiedDiv.innerHTML = `<strong>⚠ Verification Indeterminate or Failed:</strong> Payload digest could not be independently corroborated.`;
    }
    content.appendChild(topDiv);
    content.appendChild(shaGroup);
    content.appendChild(payloadGroup);
    content.appendChild(verifiedDiv);

    modal.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  } catch (err) {
    alert("Could not load audit verification details.");
  }
}

// City coordinates mapping for robust client-side geocoding fallback
const CITY_GEO_FALLBACK = {
  "paris": { lat: 48.8566, lon: 2.3522, tz: 1.0 },
  "london": { lat: 51.5074, lon: -0.1278, tz: 0.0 },
  "berlin": { lat: 52.5200, lon: 13.4050, tz: 1.0 },
  "ulm": { lat: 48.4011, lon: 9.9876, tz: 1.0 },
  "hanoi": { lat: 21.0285, lon: 105.8542, tz: 7.0 },
  "warsaw": { lat: 52.2297, lon: 21.0122, tz: 1.0 },
  "tokyo": { lat: 35.6762, lon: 139.6503, tz: 9.0 },
  "new york": { lat: 40.7128, lon: -74.0060, tz: -5.0 }
};

// Load Deep East-West Synthesis Monograph
async function loadSynthesisMonograph() {
  const container = document.getElementById('synthesis-monograph-container');
  if (!container) return;

  try {
    const payload = {
      name: currentProfile.name,
      year: currentProfile.year,
      month: currentProfile.month,
      day: currentProfile.day,
      hour: currentProfile.hour !== null ? currentProfile.hour : 12,
      minute: currentProfile.minute !== null ? currentProfile.minute : 0,
      gender: 1,
      latitude: currentProfile.latitude,
      longitude: currentProfile.longitude,
      use_lmt: currentProfile.use_lmt || false,
      lang: currentLang
    };

    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Synthesis API failed");
    const data = await res.json();
    const comp = data.comparison || {};

    container.innerHTML = '';

    const domainKeys = ['identity', 'career', 'wealth', 'relationship', 'elements', 'master_verdict'];
    const isVi = (currentLang === 'vi');

    domainKeys.forEach(k => {
      const item = comp[k];
      if (!item) return;

      const card = document.createElement('div');
      card.className = 'synthesis-editorial-card';

      const title = document.createElement('h3');
      title.className = 'synthesis-card-title';
      title.textContent = item.title || k.toUpperCase();

      const cols = document.createElement('div');
      cols.className = 'synthesis-columns';

      // Tu Vi subbox with clean formatting
      const tuviBox = document.createElement('div');
      tuviBox.className = 'synthesis-subbox';
      const tuviLabel = isVi ? "TỬ VI ĐẨU SỐ" : "TỬ VI PALACES";
      let tuviItemsHtml = '';
      if (item.tuvi) {
        tuviItemsHtml = Object.entries(item.tuvi).map(function(pair) {
          const k = pair[0];
          const v = pair[1];
          let keyLabel = k.replace(/_/g, ' ');
          if (isVi) {
            if (k === 'menh_cung') keyLabel = 'Cung Mệnh';
            if (k === 'chinh_tinh') keyLabel = 'Chính Tinh';
            if (k === 'ban_menh') keyLabel = 'Bản Mệnh';
            if (k === 'cuc') keyLabel = 'Cục';
            if (k === 'cung_quan') keyLabel = 'Cung Quan';
            if (k === 'cung_tai') keyLabel = 'Cung Tài';
            if (k === 'cung_phu_the') keyLabel = 'Cung Phu Thê';
            if (k === 'vi_tri') keyLabel = 'Vị Trí';
          } else {
            if (k === 'life_palace') keyLabel = 'Life Palace';
            if (k === 'primary_stars') keyLabel = 'Primary Stars';
            if (k === 'elemental_destiny') keyLabel = 'Constitutional Phase';
            if (k === 'palace_bureau') keyLabel = 'Bureau (Cục)';
            if (k === 'career_palace') keyLabel = 'Career Palace';
            if (k === 'wealth_palace') keyLabel = 'Wealth Palace';
            if (k === 'marriage_palace') keyLabel = 'Marriage Palace';
          }
          return `<div><strong>${escapeHtml(keyLabel)}:</strong> ${escapeHtml(String(v))}</div>`;
        }).join('');
      }
      tuviBox.innerHTML = `<strong style="color:var(--color-tuvi);">${tuviLabel}</strong><div style="margin-top:0.35rem; font-size:0.8rem; line-height:1.5;">${tuviItemsHtml}</div>`;

      // Astro subbox with clean formatting
      const astroBox = document.createElement('div');
      astroBox.className = 'synthesis-subbox';
      const astroLabel = isVi ? "CHIÊM TINH HỌC" : "WESTERN EPHEMERIS";
      let astroItemsHtml = '';
      if (item.astro) {
        astroItemsHtml = Object.entries(item.astro).map(function(pair) {
          const k = pair[0];
          const v = pair[1];
          let keyLabel = k.replace(/_/g, ' ');
          if (isVi) {
            if (k === 'sun') keyLabel = 'Mặt Trời (Sun)';
            if (k === 'moon') keyLabel = 'Mặt Trăng (Moon)';
            if (k === 'ascendant') keyLabel = 'Cung Mọc (Ascendant)';
            if (k === 'midheaven') keyLabel = 'Thiên Đỉnh (MC)';
            if (k === 'saturn') keyLabel = 'Sao Thổ (Saturn)';
            if (k === 'jupiter') keyLabel = 'Sao Mộc (Jupiter)';
            if (k === 'venus') keyLabel = 'Sao Kim (Venus)';
            if (k === 'mars') keyLabel = 'Sao Hỏa (Mars)';
            if (k === 'second_house') keyLabel = 'Nhà 2 (Tài)';
            if (k === 'eighth_house') keyLabel = 'Nhà 8 (Đầu tư)';
            if (k === 'seventh_house') keyLabel = 'Nhà 7 (Hôn phối)';
            if (k === 'tenth_house_sign') keyLabel = 'Dấu Hiệu Nhà 10';
          } else {
            if (k === 'sun') keyLabel = 'Sun';
            if (k === 'moon') keyLabel = 'Moon';
            if (k === 'ascendant') keyLabel = 'Ascendant';
            if (k === 'midheaven') keyLabel = 'Midheaven';
            if (k === 'saturn') keyLabel = 'Saturn';
            if (k === 'jupiter') keyLabel = 'Jupiter';
            if (k === 'venus') keyLabel = 'Venus';
            if (k === 'mars') keyLabel = 'Mars';
            if (k === 'second_house') keyLabel = '2nd House';
            if (k === 'eighth_house') keyLabel = '8th House';
            if (k === 'seventh_house') keyLabel = '7th House';
            if (k === 'tenth_house_sign') keyLabel = '10th House Sign';
          }
          return `<div><strong>${escapeHtml(keyLabel)}:</strong> ${escapeHtml(String(v))}</div>`;
        }).join('');
      }
      astroBox.innerHTML = `<strong style="color:var(--color-western);">${astroLabel}</strong><div style="margin-top:0.35rem; font-size:0.8rem; line-height:1.5;">${astroItemsHtml}</div>`;

      cols.appendChild(tuviBox);
      cols.appendChild(astroBox);

      const synthP = document.createElement('p');
      synthP.style.cssText = "font-size:0.875rem; color:var(--moon-ivory); line-height:1.6; border-top:1px solid var(--border-subtle); padding-top:0.85rem;";
      const synthLabel = isVi ? "Hợp Nhất Luận Giải" : "Unified Synthesis Verdict";
      synthP.innerHTML = `<strong style="color:var(--celestial-gold);">${synthLabel}:</strong> ${escapeHtml(item.synthesis || item.content || '')}`;

      card.appendChild(title);
      card.appendChild(cols);
      card.appendChild(synthP);
      container.appendChild(card);
    });

    // Also update Tu Vi Palaces & Astro Angles Views from the same response
    if (data.tuvi && data.tuvi.palaces) {
      renderTuViPalaces(data.tuvi);
    }
    if (data.astro) {
      renderAstroAngles(data.astro);
    }

  } catch (err) {
    console.warn("Could not load East-West synthesis monograph:", err);
  }
}

// Render Tu Vi 12 Palaces Grid
function renderTuViPalaces(tuviData) {
  const grid = document.getElementById('tuvi-palaces-grid');
  const summary = document.getElementById('tuvi-thienban-summary');
  if (!grid) return;

  if (summary && tuviData.thienBan) {
    const tb = tuviData.thienBan;
    const isVi = (currentLang === 'vi');
    if (isVi) {
      summary.innerHTML = `<strong>Bản Mệnh:</strong> ${escapeHtml(tb.banMenh || '')} • <strong>Cục:</strong> ${escapeHtml(tb.cuc || '')} • <strong>Can Chi:</strong> ${escapeHtml(tb.canChiNam || '')}`;
    } else {
      summary.innerHTML = `<strong>Constitutional Element:</strong> ${escapeHtml(tb.banMenh || '')} • <strong>Bureau:</strong> ${escapeHtml(tb.cuc || '')} • <strong>Year Stem/Branch:</strong> ${escapeHtml(tb.canChiNam || '')}`;
    }
  }
  grid.innerHTML = '';
  (tuviData.palaces || []).forEach(p => {
    const cell = document.createElement('div');
    cell.className = 'tuvi-palace-cell';
    const chinhStr = (p.chinhTinh || []).join(', ') || 'Vô Chính Diệu';
    const phuStr = (p.phuTinh || []).slice(0, 5).join(', ');

    cell.innerHTML = `
      <div class="tuvi-palace-title">
        <span>${escapeHtml(p.tenCung)} (${escapeHtml(p.cungCanChi)})</span>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--celestial-gold);">${escapeHtml(p.hanhCung || '')}</span>
      </div>
      <div style="font-size:0.825rem; font-weight:600; color:${p.chinhTinh && p.chinhTinh.length ? 'var(--color-tuvi)' : 'var(--text-dim)'}; margin-bottom:0.35rem;">
        ★ ${escapeHtml(chinhStr)}
      </div>
      <div class="tuvi-stars-list">
        ${escapeHtml(phuStr)}${p.phuTinh && p.phuTinh.length > 5 ? '...' : ''}
      </div>
      <div style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-dim); margin-top:0.4rem; display:flex; justify-content:space-between;">
        <span>Đại Hạn: ${escapeHtml(String(p.daiHan || ''))}</span>
        <span>${p.isThan ? '★ Thân Cư' : ''}</span>
      </div>
    `;
    grid.appendChild(cell);
  });
}

// Render Astro Angles & Aspects
function renderAstroAngles(astroData) {
  const anglesBox = document.getElementById('astro-angles-content');
  const aspectsTbody = document.querySelector('#astro-aspects-table tbody');
  const isVi = (currentLang === 'vi');

  if (anglesBox && astroData.big_three) {
    const b3 = astroData.big_three;
    const sunLabel = isVi ? "☉ Mặt Trời (Sun)" : "☉ Natal Sun";
    const moonLabel = isVi ? "☽ Mặt Trăng (Moon)" : "☽ Natal Moon";
    const ascLabel = isVi ? "↑ Cung Mọc (Ascendant)" : "↑ Ascendant (AC)";
    const mcLabel = isVi ? "MC Thiên Đỉnh (Midheaven)" : "MC Midheaven";

    const sunSign = isVi ? (b3.sun || {}).sign_vn : (b3.sun || {}).sign;
    const moonSign = isVi ? (b3.moon || {}).sign_vn : (b3.moon || {}).sign;
    const ascSign = isVi ? (b3.ascendant || {}).sign_vn : (b3.ascendant || {}).sign;
    const mcSign = isVi ? ((astroData.angles || {}).Midheaven || {}).sign_vn : ((astroData.angles || {}).Midheaven || {}).sign;

    anglesBox.innerHTML = `
      <div class="astro-angle-box">
        <span>${sunLabel}</span>
        <span class="astro-angle-val">${escapeHtml(sunSign || '')} (${escapeHtml((b3.sun || {}).formatted || '')})</span>
      </div>
      <div class="astro-angle-box">
        <span>${moonLabel}</span>
        <span class="astro-angle-val">${escapeHtml(moonSign || '')} (${escapeHtml((b3.moon || {}).formatted || '')})</span>
      </div>
      <div class="astro-angle-box">
        <span>${ascLabel}</span>
        <span class="astro-angle-val">${escapeHtml(ascSign || '')} (${escapeHtml((b3.ascendant || {}).formatted || '')})</span>
      </div>
      <div class="astro-angle-box">
        <span>${mcLabel}</span>
        <span class="astro-angle-val">${escapeHtml(mcSign || '')} (${escapeHtml(((astroData.angles || {}).Midheaven || {}).formatted || '')})</span>
      </div>
    `;
  }

  if (aspectsTbody && astroData.aspects) {
    aspectsTbody.innerHTML = '';
    (astroData.aspects || []).slice(0, 10).forEach(asp => {
      const tr = document.createElement('tr');
      const aspType = isVi ? (asp.name_vn || asp.type) : asp.type;
      tr.innerHTML = `
        <td><span style="color:var(--color-western); font-weight:600;">${escapeHtml(aspType || '')} (${escapeHtml(asp.symbol || '')})</span></td>
        <td>${escapeHtml(asp.p1 || '')} &amp; ${escapeHtml(asp.p2 || '')}</td>
        <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${escapeHtml(String(asp.angle || ''))}° (orb ${escapeHtml(String(asp.orb || ''))}°)</span></td>
      `;
      aspectsTbody.appendChild(tr);
    });
  }
}

// Load Blog & Research Monograph Articles
async function loadArticles() {
  const grid = document.getElementById('blog-articles-grid');
  if (!grid) return;

  try {
    const res = await fetch(`/api/articles?lang=${currentLang}`);
    if (!res.ok) throw new Error("Articles request failed");
    const data = await res.json();
    const articles = data.articles || [];

    grid.innerHTML = '';
    articles.forEach(art => {
      const card = document.createElement('div');
      card.className = 'blog-article-card';
      const readLabel = currentLang === 'vi' ? 'Đọc chuyên khảo →' : 'Read Monograph →';

      card.innerHTML = `
        <div>
          <div class="blog-card-meta">
            <span class="status-chip demo">${escapeHtml(art.category)}</span>
            <span>${escapeHtml(art.read_time)}</span>
          </div>
          <h3 class="blog-card-title">${escapeHtml(art.title)}</h3>
          <p class="blog-card-summary">${escapeHtml(art.summary)}</p>
        </div>
        <button type="button" class="btn btn-outline btn-read-article" data-slug="${escapeHtml(art.slug)}" style="width:100%; font-size:0.8rem;">
          ${readLabel}
        </button>
      `;
      grid.appendChild(card);
    });

    // Attach article modal readers
    grid.querySelectorAll('.btn-read-article').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        openArticleModal(slug);
      });
    });
  } catch (err) {
    console.warn("Could not load research articles:", err);
  }
}

// Open and render Article Modal
async function openArticleModal(slug) {
  const drawer = document.getElementById('article-drawer');
  const backdrop = document.getElementById('article-backdrop');
  const titleEl = document.getElementById('article-drawer-title');
  const catEl = document.getElementById('article-modal-cat');
  const metaEl = document.getElementById('article-modal-meta');
  const bodyEl = document.getElementById('article-modal-body');

  if (!drawer || !bodyEl) return;

  try {
    const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&lang=${currentLang}`);
    if (!res.ok) throw new Error("Article fetch failed");
    const art = await res.json();

    if (titleEl) titleEl.textContent = art.title || '';
    if (catEl) catEl.textContent = art.category || '';
    if (metaEl) metaEl.textContent = `${art.read_time} • ${art.date}`;

    // Format markdown headers into HTML safely
    let formatted = escapeHtml(art.content || '')
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>');
    bodyEl.innerHTML = `<p>${formatted}</p>`;

    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  } catch (err) {
    alert("Could not load article monograph.");
  }
}

// Helper to close article drawer
function closeArticleDrawer() {
  const drawer = document.getElementById('article-drawer');
  const backdrop = document.getElementById('article-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// Event Bindings
document.addEventListener('DOMContentLoaded', () => {
  initCelestialCanvas();
  drawRadarSVG('main-radar-svg', 135);
  renderThemeList();
  renderClaimLifecycle();
  loadPredictionLedger();
  loadMethodologyRegistry();
  // Auto-detect Language or use saved preference FIRST
  currentLang = detectUserLanguage();
  setLanguage(currentLang);

  // Language button event bindings
  const btnLangEn = document.getElementById('btn-lang-en');
  const btnLangVi = document.getElementById('btn-lang-vi');
  if (btnLangEn) btnLangEn.addEventListener('click', () => setLanguage('en'));
  if (btnLangVi) btnLangVi.addEventListener('click', () => setLanguage('vi'));

  // Deep Dive Lab Sub-tab switcher (Synthesis, Tu Vi, Astro)
  const subTabs = [
    { btn: 'btn-tab-synthesis', pane: 'tab-pane-synthesis' },
    { btn: 'btn-tab-tuvi', pane: 'tab-pane-tuvi' },
    { btn: 'btn-tab-astro', pane: 'tab-pane-astro' }
  ];

  subTabs.forEach(t => {
    const bEl = document.getElementById(t.btn);
    if (!bEl) return;
    bEl.addEventListener('click', () => {
      subTabs.forEach(other => {
        const otherBtn = document.getElementById(other.btn);
        const otherPane = document.getElementById(other.pane);
        if (otherBtn) otherBtn.classList.toggle('active', other.btn === t.btn);
        if (otherPane) otherPane.style.display = (other.btn === t.btn) ? (t.pane === 'tab-pane-astro' ? 'grid' : 'flex') : 'none';
      });
    });
  });

  // Article Drawer Close
  const btnCloseArt = document.getElementById('btn-close-article');
  const artBackdrop = document.getElementById('article-backdrop');
  if (btnCloseArt) btnCloseArt.addEventListener('click', closeArticleDrawer);
  if (artBackdrop) artBackdrop.addEventListener('click', closeArticleDrawer);

  // Audience View Switcher: Explore (Consumer) vs Audit (Research)
  const btnConsumer = document.getElementById('btn-view-consumer');
  const btnResearch = document.getElementById('btn-view-research');
  const navConsumer = document.getElementById('nav-group-consumer');
  const navResearch = document.getElementById('nav-group-research');

  if (btnConsumer && btnResearch) {
    btnConsumer.addEventListener('click', () => {
      btnConsumer.classList.add('active');
      btnConsumer.setAttribute('aria-selected', 'true');
      btnResearch.classList.remove('active');
      btnResearch.setAttribute('aria-selected', 'false');
      if (navConsumer) navConsumer.style.display = 'flex';
      if (navResearch) navResearch.style.display = 'none';
    });

    btnResearch.addEventListener('click', () => {
      btnResearch.classList.add('active');
      btnResearch.setAttribute('aria-selected', 'true');
      btnConsumer.classList.remove('active');
      btnConsumer.setAttribute('aria-selected', 'false');
      if (navConsumer) navConsumer.style.display = 'none';
      if (navResearch) navResearch.style.display = 'flex';
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Benchmark Profile Switcher
  const benchSelect = document.getElementById('benchmark-select');
  if (benchSelect) {
    benchSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (BENCHMARK_PROFILES[val]) {
        currentProfile = BENCHMARK_PROFILES[val];
        drawRadarSVG('main-radar-svg', 135);
        renderThemeList();
        loadSynthesisMonograph();
      }
    });
  }

  // Tradition Toggle Buttons
  const traditionsMap = {
    'btn-toggle-tradition-w': 'w',
    'btn-toggle-tradition-b': 'b',
    'btn-toggle-tradition-t': 't',
    'btn-toggle-tradition-n': 'n'
  };

  Object.entries(traditionsMap).forEach(([btnId, key]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      activeTraditions[key] = !activeTraditions[key];
      btn.classList.toggle('active', activeTraditions[key]);
      btn.setAttribute('aria-pressed', String(activeTraditions[key]));
      btn.style.opacity = activeTraditions[key] ? '1' : '0.4';
      drawRadarSVG('main-radar-svg', 135);
      renderThemeList();
    });
  });
  const timeUnknownCheckbox = document.getElementById('form-time-unknown');
  const timeInputsContainer = document.getElementById('time-inputs-container');
  const timeUnknownNote = document.getElementById('time-unknown-note');
  if (timeUnknownCheckbox) {
    timeUnknownCheckbox.addEventListener('change', (e) => {
      const isUnknown = e.target.checked;
      if (timeInputsContainer) timeInputsContainer.style.display = isUnknown ? 'none' : 'grid';
      if (timeUnknownNote) timeUnknownNote.style.display = isUnknown ? 'block' : 'none';
    });
  }

  // Location Autocomplete / Coordinate helper
  const formLocInput = document.getElementById('form-loc');
  const formLatInput = document.getElementById('form-lat');
  const formLonInput = document.getElementById('form-lon');
  if (formLocInput && formLatInput && formLonInput) {
    formLocInput.addEventListener('blur', () => {
      const locQuery = formLocInput.value.toLowerCase().trim();
      for (const [cityName, coords] of Object.entries(CITY_GEO_FALLBACK)) {
        if (locQuery.includes(cityName)) {
          if (!formLatInput.value) formLatInput.value = coords.lat;
          if (!formLonInput.value) formLonInput.value = coords.lon;
          break;
        }
      }
    });
  }

  // Load Demo Profile Button (Fills Einstein parameters on user request, otherwise starts blank)
  const btnLoadDemo = document.getElementById('btn-load-demo-profile');
  if (btnLoadDemo) {
    btnLoadDemo.addEventListener('click', () => {
      document.getElementById('form-name').value = "Albert Einstein";
      document.getElementById('form-year').value = 1879;
      document.getElementById('form-month').value = 3;
      document.getElementById('form-day').value = 14;
      document.getElementById('form-hour').value = 11;
      document.getElementById('form-min').value = 30;
      document.getElementById('form-loc').value = "Ulm, Germany";
      document.getElementById('form-lat').value = 48.40;
      document.getElementById('form-lon').value = 9.99;
      document.getElementById('form-use-lmt').checked = true;
    });
  }

  // Drawers and Modals
  const calcDrawer = document.getElementById('calc-drawer');
  const lockDrawer = document.getElementById('lock-drawer');
  const auditDrawer = document.getElementById('audit-drawer');
  const backdrop = document.getElementById('calc-backdrop');
  const auditBackdrop = document.getElementById('audit-backdrop');

  const btnOpenCalc = document.getElementById('btn-open-calc');
  const btnHeroCalc = document.getElementById('btn-hero-calc');
  const btnCloseCalc = document.getElementById('btn-close-calc');
  const btnOpenLock = document.getElementById('btn-open-lock-drawer');
  const btnCloseLock = document.getElementById('btn-close-lock');
  const btnCloseAudit = document.getElementById('btn-close-audit');

  function openCalc() {
    if (calcDrawer && backdrop) {
      calcDrawer.classList.add('open');
      backdrop.classList.add('active');
    }
  }

  function openLock() {
    if (lockDrawer && backdrop) {
      lockDrawer.classList.add('open');
      backdrop.classList.add('active');
    }
  }

  function closeAll() {
    if (calcDrawer) calcDrawer.classList.remove('open');
    if (lockDrawer) lockDrawer.classList.remove('open');
    if (auditDrawer) auditDrawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    if (auditBackdrop) auditBackdrop.classList.remove('active');
  }

  if (btnOpenCalc) btnOpenCalc.addEventListener('click', openCalc);
  if (btnHeroCalc) btnHeroCalc.addEventListener('click', openCalc);
  if (btnCloseCalc) btnCloseCalc.addEventListener('click', closeAll);
  if (btnOpenLock) btnOpenLock.addEventListener('click', openLock);
  if (btnCloseLock) btnCloseLock.addEventListener('click', closeAll);
  if (btnCloseAudit) btnCloseAudit.addEventListener('click', closeAll);
  if (backdrop) backdrop.addEventListener('click', closeAll);
  if (auditBackdrop) auditBackdrop.addEventListener('click', closeAll);

  // Escape key closes modal dialogs including article-drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
      closeArticleDrawer();
    }
  });

  // Profile Form Submission: Updates Life Map and renders calculated results live!
  const calcForm = document.getElementById('profile-calc-form');
  const submitBtn = calcForm ? calcForm.querySelector('button[type="submit"]') : null;

  if (calcForm) {
    calcForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isTimeUnknown = document.getElementById('form-time-unknown').checked;
      const rawHour = document.getElementById('form-hour').value;
      const rawMin = document.getElementById('form-min').value;
      const locVal = document.getElementById('form-loc').value.trim();
      let latVal = parseFloat(document.getElementById('form-lat').value);
      let lonVal = parseFloat(document.getElementById('form-lon').value);

      // Require valid coordinates or resolved location
      if (isNaN(latVal) || isNaN(lonVal)) {
        for (const [cityName, coords] of Object.entries(CITY_GEO_FALLBACK)) {
          if (locVal.toLowerCase().includes(cityName)) {
            latVal = coords.lat;
            lonVal = coords.lon;
            break;
          }
        }
      }

      if (isNaN(latVal) || isNaN(lonVal)) {
        alert(currentLang === 'vi' 
          ? "Vui lòng nhập tọa độ (Vĩ độ & Kinh độ) hợp lệ hoặc chọn thành phố được hỗ trợ." 
          : "Please specify valid Latitude and Longitude coordinates or enter a recognized city name.");
        return;
      }
      const payload = {
        name: document.getElementById('form-name').value.trim() || "Anonymous Subject",
        year: parseInt(document.getElementById('form-year').value),
        month: parseInt(document.getElementById('form-month').value),
        day: parseInt(document.getElementById('form-day').value),
        is_time_unknown: isTimeUnknown,
        hour: isTimeUnknown ? null : (rawHour !== "" ? parseInt(rawHour) : 12),
        minute: isTimeUnknown ? null : (rawMin !== "" ? parseInt(rawMin) : 0),
        location_name: locVal || "Specified Coordinates",
        use_lmt: document.getElementById('form-use-lmt').checked,
        latitude: latVal,
        longitude: lonVal
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Computing Multi-System Engines...";
      }

      try {
        const resp = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${resp.status}`);
        }

        const data = await resp.json();

        // Calculate personalized deterministic domain scores from returned calculation data!
        // Western, BaZi, TuVi, Numerology weights derived from actual chart balances & numbers
        const fireAirWeight = Math.min(1.0, Math.max(0.5, ((data.western.elements.Fire || 0) + (data.western.elements.Air || 0)) / 10.0 + 0.35));
        const earthWaterWeight = Math.min(1.0, Math.max(0.5, ((data.western.elements.Earth || 0) + (data.western.elements.Water || 0)) / 10.0 + 0.35));
        const lpVal = (data.numerology.life_path_reduced.number % 9) / 10.0 + 0.55;
        const baziWood = ((data.bazi.elements_distribution.Wood || 20) / 100.0) * 0.4 + 0.6;
        const baziFire = ((data.bazi.elements_distribution.Fire || 20) / 100.0) * 0.4 + 0.6;
        const baziMetal = ((data.bazi.elements_distribution.Metal || 20) / 100.0) * 0.4 + 0.6;
        const baziWater = ((data.bazi.elements_distribution.Water || 20) / 100.0) * 0.4 + 0.6;

        const calculatedProfile = {
          name: payload.name,
          year: payload.year,
          month: payload.month,
          day: payload.day,
          hour: payload.hour,
          minute: payload.minute,
          latitude: payload.latitude,
          longitude: payload.longitude,
          use_lmt: payload.use_lmt,
          location_name: payload.location_name,
          domain_scores: {
            "Intellect & First Principles": { 
              w: roundVal(fireAirWeight * 0.95), 
              b: roundVal(baziWood * 0.90), 
              t: roundVal(0.85 + (data.tuvi.palaces.length > 0 ? 0.05 : 0)), 
              n: roundVal(lpVal * 0.98) 
            },
            "Vocation & Autonomy": { 
              w: roundVal(0.75 + (data.western.midheaven.degree % 15) / 60.0), 
              b: roundVal(baziFire * 0.88), 
              t: roundVal(0.88), 
              n: roundVal(lpVal * 0.92) 
            },
            "Material Resources": { 
              w: roundVal(earthWaterWeight * 0.85), 
              b: roundVal(baziMetal * 0.85), 
              t: roundVal(0.78), 
              n: roundVal(0.72) 
            },
            "Personal Well-being": { 
              w: roundVal(earthWaterWeight * 0.80), 
              b: roundVal(baziWater * 0.82), 
              t: roundVal(0.75), 
              n: roundVal(0.70) 
            },
            "Partnership & Covenant": { 
              w: roundVal(0.65 + ((data.western.elements.Air || 2) / 15.0)), 
              b: roundVal(0.70), 
              t: roundVal(0.76), 
              n: roundVal(0.68) 
            },
            "Inner Transformation": { 
              w: roundVal(0.85 + ((data.western.elements.Water || 2) / 20.0)), 
              b: roundVal(baziWood * 0.92), 
              t: roundVal(0.90), 
              n: roundVal(lpVal * 0.95) 
            }
          },
          theme_details: [
            {
              icon: "🧠",
              synthesis: `Computed cognitive configuration for ${payload.name}. Combines foundational analytical reduction with creative pattern synthesis.`,
              western_driver: `Mercury in ${(data.western.planets.find(p=>p.name==='Mercury') || {}).sign || 'Aries'} (${(data.western.planets.find(p=>p.name==='Mercury') || {}).degree || 0}°)`,
              eastern_driver: `Day Master: ${data.bazi.day_master.name} (${data.bazi.day_master.element})`
            },
            {
              theme: "Vocation & Autonomy",
              icon: "🏛️",
              synthesis: `Vocational trajectory governed by ${data.western.midheaven.sign} Midheaven and Cung Quan Lộc at ${(data.tuvi.palaces.find(p=>p.name.includes('Career')) || {}).branch_vi || 'Ngọ'}.`,
              western_driver: `Midheaven at ${data.western.midheaven.degree}° ${data.western.midheaven.sign}`,
              eastern_driver: `Quan Lộc Palace branch: ${(data.tuvi.palaces.find(p=>p.name.includes('Career')) || {}).branch || 'Wu'}`
            },
            {
              theme: "Material Resources",
              icon: "💎",
              synthesis: `Financial orientation shows deliberate resource pacing and capital mobilization.`,
              western_driver: `2nd/8th houses Placidus division`,
              eastern_driver: `Tài Bạch Palace configuration`
            },
            {
              theme: "Personal Well-being",
              icon: "🌱",
              synthesis: `Personal stamina and somatic pacing anchored in Five Element distribution.`,
              western_driver: `Sun in ${(data.western.planets.find(p=>p.name==='Sun') || {}).sign || 'Pisces'}; Moon in ${(data.western.planets.find(p=>p.name==='Moon') || {}).sign || 'Sagittarius'}`,
              eastern_driver: `Five Elements: Wood ${data.bazi.elements_distribution.Wood}%, Fire ${data.bazi.elements_distribution.Fire}%, Earth ${data.bazi.elements_distribution.Earth}%`
            },
            {
              theme: "Partnership & Covenant",
              icon: "🤝",
              synthesis: `Relational contracts and peer dynamics across 7th House & Cung Phu Thê.`,
              western_driver: `Venus in ${(data.western.planets.find(p=>p.name==='Venus') || {}).sign || 'Aries'}`,
              eastern_driver: `Phu Thê Palace in ${(data.tuvi.palaces.find(p=>p.name.includes('Spouse')) || {}).branch || 'Chen'}`
            },
            {
              theme: "Inner Transformation",
              icon: "🔮",
              synthesis: `Philosophical resilience reflected in Life Path ${data.numerology.life_path_reduced.number} and Hexagram ${data.divination.hexagram.number} (${data.divination.hexagram.name}).`,
              western_driver: `Saturn in ${(data.western.planets.find(p=>p.name==='Saturn') || {}).sign || 'Aries'}`,
              eastern_driver: `Cung Phúc Đức in ${(data.tuvi.palaces.find(p=>p.name.includes('Mind')) || {}).branch || 'Yin'}`
            }
          ]
        };
        // Refresh dependent views (Radar, Themes, and Synthesis Monograph)
        loadSynthesisMonograph();

        closeAll();

        // Smooth scroll to life-map-report section
        const reportSection = document.getElementById('life-map-report');
        if (reportSection) reportSection.scrollIntoView({ behavior: 'smooth' });

        // Update benchmark dropdown UI to reflect custom profile
        if (benchSelect) {
          let customOpt = benchSelect.querySelector('option[value="custom_computed"]');
          if (!customOpt) {
            customOpt = document.createElement('option');
            customOpt.value = "custom_computed";
            benchSelect.appendChild(customOpt);
          }
          customOpt.textContent = `★ ${payload.name} (Calculated Profile)`;
          benchSelect.value = "custom_computed";
        }


      } catch (err) {
        alert(`Calculation failed: ${err.message || 'Please check input parameters and try again.'}`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Calculate Multi-System Life Map";
        }
      }
    });
  }

  // Pre-Registration Submission
  const lockForm = document.getElementById('lock-pred-form');
  const lockSubmitBtn = lockForm ? lockForm.querySelector('button[type="submit"]') : null;

  if (lockForm) {
    lockForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        subject_name: document.getElementById('lock-subject').value.trim(),
        tradition: document.getElementById('lock-tradition').value,
        domain: document.getElementById('lock-domain').value,
        statement: document.getElementById('lock-statement').value.trim(),
        target_window: document.getElementById('lock-window').value.trim(),
        forecast_probability: parseFloat(document.getElementById('lock-prob').value),
        resolution_criteria: document.getElementById('lock-criteria').value.trim()
      };

      if (!payload.subject_name || !payload.statement) {
        alert("Please provide both subject identifier and statement.");
        return;
      }

      if (lockSubmitBtn) {
        lockSubmitBtn.disabled = true;
        lockSubmitBtn.textContent = "Locking State Hash...";
      }

      try {
        const resp = await fetch('/api/ledger/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${resp.status}`);
        }

        const res = await resp.json();
        alert(`✓ Pre-Registration Locked!\nRecord ID: ${res.record_id}\nSHA-256 Digest: ${res.sha256_lock}`);
        closeAll();
        loadPredictionLedger();
      } catch (err) {
        alert(`Pre-registration failed: ${err.message}`);
      } finally {
        if (lockSubmitBtn) {
          lockSubmitBtn.disabled = false;
          lockSubmitBtn.textContent = "Lock Cryptographic Pre-Registration";
        }
      }
    });
  }
});
