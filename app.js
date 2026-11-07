/**
 * DİM SualUsta - Müəllimlər üçün İmtahan və Test Hazırlayıcı
 * JavaScript Mühərriki - Fiqurlar Kataloqu və Yükləmə Sistemi
 */

// Global State
let currentExam = {
  title: 'BİRLƏŞMİŞ BURAXILIŞ İMTAHANI (DİM MODELİ)',
  subject: 'Riyaziyyat',
  grade: '11-ci sinif (Buraxılış)',
  questions: []
};

let activeType = 'hendese';
let editingQuestionId = null;
let currentSelectedShape = 'right_triangle';
let lastFocusedInputId = 'geomLabelC';

// ==========================================================================
// HAZIR FİQURLAR KATALOQU (Shapes Database)
// ==========================================================================
const SHAPE_CATALOG = [
  // --- Üçbucaqlar (11 növ) ---
  {
    id: 'right_triangle',
    category: 'ucbucaq',
    name: 'Düzbucaqlı Üçbucaq',
    defaultLabels: { a: '6 sm', b: '8 sm', c: 'c = ?', angle: '90°' }
  },
  {
    id: 'right_triangle_altitude',
    category: 'ucbucaq',
    name: 'Düzbucaqlıda Hündürlük',
    defaultLabels: { a: 'c₁ = 4', b: 'c₂ = 9', c: 'h = ?', angle: '90°' }
  },
  {
    id: 'isosceles_triangle',
    category: 'ucbucaq',
    name: 'Bərabəryanlı Üçbucaq',
    defaultLabels: { a: '10 sm', b: '10 sm', c: 'b = 12 sm', angle: 'α = ?' }
  },
  {
    id: 'isosceles_altitude',
    category: 'ucbucaq',
    name: 'Bərabəryanlı və Hündürlük',
    defaultLabels: { a: '13 sm', b: 'b = 10 sm', c: 'h = ?', angle: 'α' }
  },
  {
    id: 'equilateral_triangle',
    category: 'ucbucaq',
    name: 'Bərabərtərəfli Üçbucaq',
    defaultLabels: { a: 'a = 6', b: 'a = 6', c: 'h = ?', angle: '60°' }
  },
  {
    id: 'scalene_triangle',
    category: 'ucbucaq',
    name: 'İxtiyari Üçbucaq',
    defaultLabels: { a: '7 sm', b: '9 sm', c: 'x = ?', angle: '60°' }
  },
  {
    id: 'triangle_inscribed_circle',
    category: 'ucbucaq',
    name: 'Daxilinə Çevrə Çəkilmiş',
    defaultLabels: { a: 'a = 13', b: 'b = 14', c: 'c = 15', angle: 'r = ?' }
  },
  {
    id: 'triangle_circumscribed_circle',
    category: 'ucbucaq',
    name: 'Xaricinə Çevrə Çəkilmiş',
    defaultLabels: { a: 'a = 8', b: 'b = 8', c: 'R = ?', angle: '30°' }
  },
  {
    id: 'triangle_midline',
    category: 'ucbucaq',
    name: 'Üçbucaqda Orta Xətt',
    defaultLabels: { a: 'M', b: 'N', c: 'AC = 16', angle: 'MN = ?' }
  },
  {
    id: 'obtuse_triangle',
    category: 'ucbucaq',
    name: 'Korbucaqlı Üçbucaq',
    defaultLabels: { a: 'a = 5', b: 'b = 6', c: 'c = ?', angle: '120°' }
  },
  {
    id: 'triangle_exterior_angle',
    category: 'ucbucaq',
    name: 'Üçbucağın Xarici Bucağı',
    defaultLabels: { a: '45°', b: '70°', c: 'φ = ?', angle: 'φ' }
  },

  // --- Dördbucaqlılar (7 növ) ---
  {
    id: 'quad_rectangle',
    category: 'dordbucaq',
    name: 'Düzbucaqlı və Diaqonal',
    defaultLabels: { a: 'a = 6', b: 'b = 8', c: 'd = ?', angle: '90°' }
  },
  {
    id: 'quad_square',
    category: 'dordbucaq',
    name: 'Kvadrat',
    defaultLabels: { a: 'a = 5', b: 'a = 5', c: 'd = ?', angle: '90°' }
  },
  {
    id: 'quad_rhombus',
    category: 'dordbucaq',
    name: 'Romb və Diaqonallar',
    defaultLabels: { a: 'd₁ = 12', b: 'd₂ = 16', c: 'a = ?', angle: 'α' }
  },
  {
    id: 'quad_parallelogram',
    category: 'dordbucaq',
    name: 'Paraleloqram və Hündürlük',
    defaultLabels: { a: 'a = 10', b: 'b = 6', c: 'h = ?', angle: '30°' }
  },
  {
    id: 'quad_trapezoid',
    category: 'dordbucaq',
    name: 'Trapesiya (Hündürlüklü)',
    defaultLabels: { a: 'a = 6', b: 'b = 14', c: 'S = ?', angle: 'h = 5' }
  },
  {
    id: 'quad_isosceles_trapezoid',
    category: 'dordbucaq',
    name: 'Bərabəryanlı Trapesiya',
    defaultLabels: { a: 'c = 10', b: 'b = 16', c: 'a = 4', angle: 'h = ?' }
  },
  {
    id: 'quad_right_trapezoid',
    category: 'dordbucaq',
    name: 'Düzbucaqlı Trapesiya',
    defaultLabels: { a: 'h = 8', b: 'b = 12', c: 'c = ?', angle: 'a = 6' }
  },

  // --- Çevrə & Qrafik (6 növ) ---
  {
    id: 'circle_chord',
    category: 'cevre',
    name: 'Çevrə və Vətər',
    defaultLabels: { a: 'R = 10', b: 'd = 6 sm', c: 'AB = ?', angle: 'O' }
  },
  {
    id: 'circle_tangents',
    category: 'cevre',
    name: 'İki Toxunan Xətt',
    defaultLabels: { a: 'R = 5', b: 'P', c: 'PT = ?', angle: '60°' }
  },
  {
    id: 'circle_central_inscribed',
    category: 'cevre',
    name: 'Mərkəzi və Daxilə Bucaq',
    defaultLabels: { a: 'α = ?', b: 'β = 80°', c: 'O', angle: 'O' }
  },
  {
    id: 'circle_intersecting_chords',
    category: 'cevre',
    name: 'Kəsişən Vətərlər',
    defaultLabels: { a: '3', b: '6', c: 'x = ?', angle: '4' }
  },
  {
    id: 'coordinate_parabola',
    category: 'cevre',
    name: 'Parabola Qrafiki',
    defaultLabels: { a: 'x₁ = -2', b: 'x₂ = 4', c: 'y = f(x)', angle: 'y' }
  },
  {
    id: 'coordinate_linear',
    category: 'cevre',
    name: 'Düz Xətt Qrafiki',
    defaultLabels: { a: 'A(0; 3)', b: 'B(4; 0)', c: 'k = ?', angle: 'y' }
  }
];

// Built-in authentic DİM Sample Questions
const DIM_SAMPLE_QUESTIONS = [
  {
    id: 'dim_1',
    type: 'hendese',
    subject: 'Riyaziyyat',
    points: 2,
    difficulty: 'Orta',
    text: 'Şəkildə verilmiş düzbucaqlı üçbucaqda katetlər a = 6 sm və b = 8 sm olarsa, hipotenuzun (c) uzunluğunu tapın.',
    svgShape: 'right_triangle',
    shapeLabels: { a: '6 sm', b: '8 sm', c: 'c = ?', angle: '90°' },
    options: {
      A: '9 sm',
      B: '10 sm',
      C: '12 sm',
      D: '14 sm',
      E: '15 sm'
    },
    correctAnswer: 'B'
  },
  {
    id: 'dim_2',
    type: 'qapali',
    subject: 'Riyaziyyat',
    points: 1,
    difficulty: 'Asan',
    text: 'x² - 7x + 12 = 0 kvadrat tənliyinin köklərinin cəmini tapın.',
    options: {
      A: '-7',
      B: '12',
      C: '7',
      D: '-12',
      E: '1'
    },
    correctAnswer: 'C'
  },
  {
    id: 'dim_3',
    type: 'hendese',
    subject: 'Riyaziyyat',
    points: 2,
    difficulty: 'Orta',
    text: 'Radiusu R = 10 sm olan çevrədə mərkəzdən 6 sm məsafədə yerləşən AB vətərinin uzunluğunu tapın.',
    svgShape: 'circle_chord',
    shapeLabels: { a: 'R = 10', b: 'd = 6 sm', c: 'AB = ?', angle: 'O' },
    options: {
      A: '12 sm',
      B: '14 sm',
      C: '16 sm',
      D: '18 sm',
      E: '20 sm'
    },
    correctAnswer: 'C'
  },
  {
    id: 'dim_4',
    type: 'aciq',
    subject: 'Riyaziyyat',
    points: 2,
    difficulty: 'Orta',
    text: '(an) ədədi silsiləsində birinci hədd a₁ = 3 və silsilə fərqi d = 4 olarsa, silsilənin ilk 10 həddinin cəmini (S₁₀) hesablayın.',
    correctAnswer: '210'
  },
  {
    id: 'dim_5',
    type: 'uygunluq',
    subject: 'Riyaziyyat',
    points: 3,
    difficulty: 'Çətin',
    text: 'Verilmiş funksiyalar və onların qrafiklərinə aid xassələr arasında uyğunluğu müəyyən edin.',
    matching: {
      left: ['1. y = 2x - 4', '2. y = x² - 9', '3. y = 6 / x'],
      right: [
        'a. Qrafiki paraboladır',
        'b. Qrafiki hiperboladır',
        'c. Qrafiki absis oxunu (2; 0) nöqtəsində kəsir',
        'd. Qrafiki ordinat oxunu (0; -9) nöqtəsində kəsir',
        'e. Koordinat başlanğıcından keçir'
      ]
    },
    correctAnswer: '1-c; 2-a,d; 3-b'
  }
];

// Initialize Storage
function initStorage() {
  const saved = localStorage.getItem('dim_exam_data');
  if (saved) {
    try {
      currentExam = JSON.parse(saved);
    } catch (e) {
      currentExam.questions = [...DIM_SAMPLE_QUESTIONS];
    }
  } else {
    currentExam.questions = [...DIM_SAMPLE_QUESTIONS];
  }
}

function saveStorage() {
  localStorage.setItem('dim_exam_data', JSON.stringify(currentExam));
}

// ==========================================================================
// SVG GEOMETRY ENGINE (Bütün fiqurlar üçün dəqiq vektor qrafikləri)
// ==========================================================================
function generateGeometrySvg(shape, labels, isThumb = false) {
  const lA = escapeHtml(labels.a || '');
  const lB = escapeHtml(labels.b || '');
  const lC = escapeHtml(labels.c || '');
  const lAng = escapeHtml(labels.angle || '');

  const strokeW = isThumb ? '1.8' : '2.2';
  const fontSize = isThumb ? '9' : '13';
  const width = isThumb ? 110 : 220;
  const height = isThumb ? 75 : 155;
  const viewBox = `0 0 220 155`;

  switch (shape) {
    // 1. Düzbucaqlı üçbucaq
    case 'right_triangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="35,130 185,130 35,25" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <polyline points="35,112 53,112 53,130" fill="none" stroke="#000000" stroke-width="1.6"/>
          <circle cx="44" cy="121" r="1.5" fill="#000000"/>
          ${lAng ? `<path d="M 160,130 A 25,25 0 0,0 170,118" fill="none" stroke="#000000" stroke-width="1.3"/><text x="145" y="122" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-style="italic">${lAng}</text>` : ''}
          <text x="14" y="82" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lA}</text>
          <text x="100" y="147" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lB}</text>
          <text x="118" y="65" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="18" y="140" font-family="sans-serif" font-size="11" font-weight="700">A</text>
          <text x="190" y="140" font-family="sans-serif" font-size="11" font-weight="700">C</text>
          <text x="22" y="20" font-family="sans-serif" font-size="11" font-weight="700">B</text>
        </svg>
      `;

    // 2. Düzbucaqlı üçbucaqda hipotenuza çəkilmiş hündürlük
    case 'right_triangle_altitude':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="30,130 190,130 30,25" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <polyline points="30,114 46,114 46,130" fill="none" stroke="#000000" stroke-width="1.5"/>
          <!-- Altitude to hypotenuse -->
          <line x1="30" y1="25" x2="110" y2="130" stroke="#000000" stroke-width="1.8" stroke-dasharray="4,2"/>
          <polyline points="103,121 110,115 117,124" fill="none" stroke="#000000" stroke-width="1.3"/>
          <text x="60" y="70" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="65" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="145" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="115" y="146" font-family="sans-serif" font-size="11" font-weight="700">H</text>
        </svg>
      `;

    // 3. Bərabəryanlı üçbucaq
    case 'isosceles_triangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,22 35,130 185,130" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <!-- Ticks on equal sides -->
          <line x1="68" y1="75" x2="76" y2="79" stroke="#000000" stroke-width="2"/>
          <line x1="144" y1="75" x2="152" y2="79" stroke="#000000" stroke-width="2"/>
          <text x="40" y="72" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lA}</text>
          <text x="160" y="72" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lB}</text>
          <text x="95" y="147" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="105" y="15" font-family="sans-serif" font-size="11" font-weight="700">B</text>
        </svg>
      `;

    // 4. Bərabəryanlı üçbucaqda hündürlük
    case 'isosceles_altitude':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,22 35,130 185,130" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <line x1="110" y1="22" x2="110" y2="130" stroke="#000000" stroke-width="1.6" stroke-dasharray="4,3"/>
          <polyline points="110,118 122,118 122,130" fill="none" stroke="#000000" stroke-width="1.3"/>
          <text x="42" y="75" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lA}</text>
          <text x="115" y="78" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="95" y="147" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="600">${lB}</text>
        </svg>
      `;

    // 5. Bərabərtərəfli üçbucaq
    case 'equilateral_triangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,20 40,130 180,130" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <line x1="72" y1="72" x2="78" y2="76" stroke="#000000" stroke-width="1.8"/>
          <line x1="142" y1="72" x2="148" y2="76" stroke="#000000" stroke-width="1.8"/>
          <line x1="107" y1="127" x2="113" y2="133" stroke="#000000" stroke-width="1.8"/>
          <text x="45" y="70" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="155" y="70" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="95" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="50" y="125" font-family="'STIX Two Text', serif" font-size="${fontSize}">60°</text>
        </svg>
      `;

    // 6. Müxtəliftərəfli (İxtiyari) üçbucaq
    case 'scalene_triangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="80,25 25,130 195,130" fill="none" stroke="#000000" stroke-width="${strokeW}" stroke-linejoin="round"/>
          <text x="35" y="75" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="145" y="75" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="100" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="75" y="42" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lAng}</text>
        </svg>
      `;

    // 7. Daxilinə çevrə çəkilmiş üçbucaq
    case 'triangle_inscribed_circle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,22 30,130 190,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <circle cx="110" cy="94" r="36" fill="none" stroke="#b91c1c" stroke-width="1.8"/>
          <circle cx="110" cy="94" r="2.5" fill="#b91c1c"/>
          <line x1="110" y1="94" x2="110" y2="130" stroke="#b91c1c" stroke-width="1.4" stroke-dasharray="3,2"/>
          <text x="115" y="115" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lAng || 'r'}</text>
          <text x="95" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC}</text>
        </svg>
      `;

    // 8. Xaricinə çevrə çəkilmiş üçbucaq
    case 'triangle_circumscribed_circle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="80" r="58" fill="none" stroke="#000000" stroke-width="1.8"/>
          <polygon points="110,22 55,105 165,105" fill="none" stroke="#b91c1c" stroke-width="${strokeW}"/>
          <circle cx="110" cy="80" r="2.5" fill="#000000"/>
          <line x1="110" y1="80" x2="165" y2="105" stroke="#000000" stroke-width="1.4" stroke-dasharray="3,2"/>
          <text x="135" y="88" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC || 'R'}</text>
        </svg>
      `;

    // 9. Üçbucaqda orta xətt
    case 'triangle_midline':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,22 30,130 190,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="70" y1="76" x2="150" y2="76" stroke="#b91c1c" stroke-width="2.2"/>
          <text x="95" y="68" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lAng || 'MN'}</text>
          <text x="95" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC}</text>
        </svg>
      `;

    // 10. Korbucaqlı üçbucaq
    case 'obtuse_triangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="140,40 50,125 190,125" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <text x="75" y="80" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="110" y="142" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC}</text>
          <text x="85" y="118" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lAng}</text>
        </svg>
      `;

    // 11. Üçbucağın xarici bucağı
    case 'triangle_exterior_angle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,30 30,125 150,125" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="150" y1="125" x2="205" y2="125" stroke="#000000" stroke-width="1.8" stroke-dasharray="3,2"/>
          <path d="M 170,125 A 20,20 0 0,0 162,112" fill="none" stroke="#b91c1c" stroke-width="1.8"/>
          <text x="172" y="115" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lAng || 'φ'}</text>
          <text x="50" y="118" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="90" y="48" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
        </svg>
      `;

    // --- Dördbucaqlılar ---
    case 'quad_rectangle':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <rect x="35" y="35" width="150" height="90" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="35" y1="125" x2="185" y2="35" stroke="#b91c1c" stroke-width="1.8" stroke-dasharray="4,2"/>
          <text x="15" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="100" y="142" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="110" y="75" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'quad_square':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <rect x="55" y="30" width="100" height="100" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="55" y1="130" x2="155" y2="30" stroke="#b91c1c" stroke-width="1.8" stroke-dasharray="4,2"/>
          <text x="35" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="95" y="145" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="110" y="75" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'quad_rhombus':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,25 180,80 110,135 40,80" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="110" y1="25" x2="110" y2="135" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="3,2"/>
          <line x1="40" y1="80" x2="180" y2="80" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="3,2"/>
          <text x="60" y="50" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC || 'a'}</text>
          <text x="115" y="60" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lA}</text>
          <text x="145" y="95" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lB}</text>
        </svg>
      `;

    case 'quad_parallelogram':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="65,35 185,35 155,130 35,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="65" y1="35" x2="65" y2="130" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="4,2"/>
          <text x="50" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lC || 'h'}</text>
          <text x="100" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="175" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
        </svg>
      `;

    case 'quad_trapezoid':
    case 'trapezoid':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="65,35 155,35 195,130 25,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="65" y1="35" x2="65" y2="130" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="4,2"/>
          <text x="100" y="28" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="100" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="48" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lAng || 'h'}</text>
          <text x="135" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'quad_isosceles_trapezoid':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="65,35 155,35 190,130 30,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="45" y1="80" x2="52" y2="84" stroke="#000000" stroke-width="2"/>
          <line x1="168" y1="80" x2="175" y2="84" stroke="#000000" stroke-width="2"/>
          <text x="100" y="28" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lC || 'a'}</text>
          <text x="100" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="32" y="80" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
        </svg>
      `;

    case 'quad_right_trapezoid':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40,35 150,35 185,130 40,130" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <polyline points="40,114 56,114 56,130" fill="none" stroke="#000000" stroke-width="1.5"/>
          <text x="20" y="85" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA || 'h'}</text>
          <text x="90" y="28" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lAng || 'a'}</text>
          <text x="100" y="146" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="172" y="80" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    // --- Çevrə & Qrafik ---
    case 'circle_chord':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="80" r="58" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <circle cx="110" cy="80" r="3" fill="#000000"/>
          <text x="115" y="76" font-family="sans-serif" font-size="11" font-weight="700">O</text>
          <line x1="65" y1="122" x2="155" y2="122" stroke="#000000" stroke-width="2.2"/>
          <line x1="110" y1="80" x2="110" y2="122" stroke="#b91c1c" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="110" y1="80" x2="155" y2="122" stroke="#000000" stroke-width="1.3" stroke-dasharray="4,2"/>
          <text x="135" y="98" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="85" y="105" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lB}</text>
          <text x="100" y="140" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'circle_tangents':
    case 'circle_tangent':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="85" cy="80" r="45" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <circle cx="85" cy="80" r="2.5" fill="#000000"/>
          <line x1="185" y1="80" x2="85" y2="35" stroke="#000000" stroke-width="1.8"/>
          <line x1="185" y1="80" x2="85" y2="125" stroke="#000000" stroke-width="1.8"/>
          <circle cx="185" cy="80" r="3" fill="#000000"/>
          <text x="190" y="85" font-family="sans-serif" font-size="11" font-weight="700">P</text>
          <text x="130" y="50" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="65" y="80" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
        </svg>
      `;

    case 'circle_central_inscribed':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="80" r="55" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <circle cx="110" cy="80" r="3" fill="#000000"/>
          <line x1="65" y1="115" x2="110" y2="80" stroke="#000000" stroke-width="1.5"/>
          <line x1="155" y1="115" x2="110" y2="80" stroke="#000000" stroke-width="1.5"/>
          <line x1="65" y1="115" x2="110" y2="25" stroke="#b91c1c" stroke-width="1.5"/>
          <line x1="155" y1="115" x2="110" y2="25" stroke="#b91c1c" stroke-width="1.5"/>
          <text x="102" y="45" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lA}</text>
          <text x="102" y="98" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
        </svg>
      `;

    case 'circle_intersecting_chords':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="80" r="55" fill="none" stroke="#000000" stroke-width="${strokeW}"/>
          <line x1="60" y1="60" x2="160" y2="105" stroke="#000000" stroke-width="2"/>
          <line x1="75" y1="120" x2="145" y2="40" stroke="#b91c1c" stroke-width="2"/>
          <text x="80" y="65" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lA}</text>
          <text x="140" y="105" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lB}</text>
          <text x="100" y="55" font-family="'STIX Two Text', serif" font-size="${fontSize}" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'coordinate_parabola':
    case 'coordinate_axes':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="95" x2="200" y2="95" stroke="#000000" stroke-width="1.6"/>
          <polyline points="194,91 200,95 194,99" fill="#000000"/>
          <line x1="110" y1="145" x2="110" y2="15" stroke="#000000" stroke-width="1.6"/>
          <polyline points="106,21 110,15 114,21" fill="#000000"/>
          <text x="195" y="112" font-family="sans-serif" font-size="11" font-weight="700">x</text>
          <text x="96" y="22" font-family="sans-serif" font-size="11" font-weight="700">y</text>
          <path d="M 50,25 Q 110,145 170,25" fill="none" stroke="#b91c1c" stroke-width="2.2"/>
          <text x="145" y="55" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC || 'y=f(x)'}</text>
        </svg>
      `;

    case 'coordinate_linear':
      return `
        <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="95" x2="200" y2="95" stroke="#000000" stroke-width="1.6"/>
          <polyline points="194,91 200,95 194,99" fill="#000000"/>
          <line x1="110" y1="145" x2="110" y2="15" stroke="#000000" stroke-width="1.6"/>
          <polyline points="106,21 110,15 114,21" fill="#000000"/>
          <line x1="45" y1="135" x2="175" y2="35" stroke="#b91c1c" stroke-width="2.2"/>
          <text x="150" y="55" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#b91c1c">${lC || 'y=kx+b'}</text>
        </svg>
      `;

    default:
      return generateGeometrySvg('right_triangle', labels, isThumb);
  }
}

// Render the Visual Shape Cards Gallery
function renderShapeCards(activeCategory = 'ucbucaq') {
  const container = document.getElementById('shapeCardsContainer');
  if (!container) return;

  const filtered = SHAPE_CATALOG.filter(s => s.category === activeCategory);

  container.innerHTML = filtered.map(shape => {
    const isSelected = shape.id === currentSelectedShape;
    const miniSvg = generateGeometrySvg(shape.id, shape.defaultLabels, true);

    return `
      <div class="shape-thumb-card ${isSelected ? 'active' : ''}" data-shape-id="${shape.id}" onclick="selectShape('${shape.id}')">
        <div class="shape-thumb-svg">${miniSvg}</div>
        <span class="shape-thumb-title">${shape.name}</span>
      </div>
    `;
  }).join('');
}

// Select a shape from the gallery
window.selectShape = function(shapeId) {
  const shape = SHAPE_CATALOG.find(s => s.id === shapeId);
  if (!shape) return;

  currentSelectedShape = shapeId;

  // Set Question Type to Hendese
  setQuestionType('hendese');

  // Update title
  const titleEl = document.getElementById('selectedShapeName');
  if (titleEl) titleEl.textContent = `Seçilmiş: ${shape.name}`;

  // Fill default inputs
  const lA = document.getElementById('geomLabelA');
  const lB = document.getElementById('geomLabelB');
  const lC = document.getElementById('geomLabelC');
  const lAng = document.getElementById('geomAngle');

  if (lA) lA.value = shape.defaultLabels.a || '';
  if (lB) lB.value = shape.defaultLabels.b || '';
  if (lC) lC.value = shape.defaultLabels.c || '';
  if (lAng) lAng.value = shape.defaultLabels.angle || '';

  // Update active card styling
  document.querySelectorAll('.shape-thumb-card').forEach(c => {
    if (c.getAttribute('data-shape-id') === shapeId) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  // Update SVG
  updateLiveGeometryPreview();
};

// Set quick input value like '?'
window.setShapeInput = function(inputId, val) {
  const el = document.getElementById(inputId);
  if (el) {
    el.value = val;
    el.focus();
    updateLiveGeometryPreview();
  }
};

// Append unit or symbol to the last active shape input
window.appendUnitToActive = function(unit) {
  const targetId = lastFocusedInputId || 'geomLabelC';
  const el = document.getElementById(targetId);
  if (el) {
    if (unit === '?') {
      el.value = el.value ? `${el.value} = ?` : '?';
    } else if (unit === '√') {
      el.value = `√(${el.value || 'x'})`;
    } else {
      el.value = `${el.value} ${unit}`.trim();
    }
    el.focus();
    updateLiveGeometryPreview();
  }
};

// Update live geometry preview inside editor box
function updateLiveGeometryPreview() {
  const container = document.getElementById('geomSvgContainer');
  if (!container) return;

  const lA = document.getElementById('geomLabelA')?.value || '';
  const lB = document.getElementById('geomLabelB')?.value || '';
  const lC = document.getElementById('geomLabelC')?.value || '';
  const lAng = document.getElementById('geomAngle')?.value || '';

  const svg = generateGeometrySvg(currentSelectedShape, { a: lA, b: lB, c: lC, angle: lAng }, false);
  container.innerHTML = svg;
}

// Render Questions to DİM Examination Booklet
function renderExamBooklet() {
  const container = document.getElementById('dimQuestionsContainer');
  const emptyState = document.getElementById('noQuestionsNotice');
  const countEl = document.getElementById('totalQuestionsCount');
  const pointsEl = document.getElementById('totalPointsSum');
  const subjDisplay = document.getElementById('displaySubjectName');

  const paperSubject = document.getElementById('paperSubject');
  const paperGrade = document.getElementById('paperGrade');

  if (paperSubject) paperSubject.innerHTML = `Fənn: <strong>${currentExam.subject}</strong>`;
  if (paperGrade) paperGrade.innerHTML = `Səviyyə: <strong>${currentExam.grade}</strong>`;
  if (subjDisplay) subjDisplay.textContent = currentExam.subject;

  let totalPoints = 0;
  currentExam.questions.forEach(q => {
    totalPoints += parseFloat(q.points) || 1;
  });

  if (countEl) countEl.textContent = currentExam.questions.length;
  if (pointsEl) pointsEl.textContent = totalPoints;

  if (currentExam.questions.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (container) container.innerHTML = '';
    renderAnswerKey();
    renderBubbleSheet();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = currentExam.questions.map((q, idx) => {
    const qNum = idx + 1;
    let contentHtml = '';

    // Render Geometry figure if present
    let figureHtml = '';
    if (q.svgShape) {
      const svg = generateGeometrySvg(q.svgShape, q.shapeLabels || {});
      figureHtml = `<div class="dim-q-figure">${svg}</div>`;
    }

    // Question body
    if (q.type === 'qapali' || q.type === 'hendese') {
      const opts = q.options || {};
      const optsList = ['A', 'B', 'C', 'D', 'E'].map(letter => {
        const text = opts[letter] || '';
        return `
          <div class="dim-opt">
            <span class="opt-letter">${letter})</span>
            <span class="opt-text">${escapeHtml(text)}</span>
          </div>
        `;
      }).join('');

      contentHtml = `<div class="dim-options-list">${optsList}</div>`;
    } else if (q.type === 'aciq') {
      contentHtml = `
        <div class="dim-coded-box">
          <span class="box-label">Cavab:</span>
          <div class="answer-grid-mock">
            <div class="grid-cell">&nbsp;</div>
            <div class="grid-cell">&nbsp;</div>
            <div class="grid-cell">&nbsp;</div>
            <div class="grid-cell">&nbsp;</div>
          </div>
        </div>
      `;
    } else if (q.type === 'yazili') {
      contentHtml = `
        <div class="dim-written-box">
          <em>(Həll mərhələləri üçün ayrılmış cavab sahəsi)</em>
        </div>
      `;
    } else if (q.type === 'uygunluq') {
      const m = q.matching || { left: [], right: [] };
      const leftHtml = (m.left || []).map(item => `<div>${escapeHtml(item)}</div>`).join('');
      const rightHtml = (m.right || []).map(item => `<div>${escapeHtml(item)}</div>`).join('');

      contentHtml = `
        <div class="dim-matching-wrap">
          <div class="match-list-left">${leftHtml}</div>
          <div class="match-list-right">${rightHtml}</div>
        </div>
      `;
    } else if (q.type === 'situasiya') {
      const sub1 = q.subQ1 ? `<div class="mt-2"><strong>${qNum}.1.</strong> ${escapeHtml(q.subQ1)}</div>` : '';
      const sub2 = q.subQ2 ? `<div class="mt-2"><strong>${qNum}.2.</strong> ${escapeHtml(q.subQ2)}</div>` : '';

      contentHtml = `<div class="dim-situation-body">${sub1}${sub2}</div>`;
    }

    return `
      <article class="dim-question-item" data-id="${q.id}">
        <div class="dim-q-header">
          <div>
            <span class="dim-q-num">${qNum}.</span>
            <span class="dim-q-badge-meta">${q.points || 1} bal • ${q.difficulty || 'Orta'}</span>
          </div>
          <div class="dim-q-actions no-print">
            <button class="q-action-btn edit" onclick="editQuestion('${q.id}')" title="Sualı Redaktə Et">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="q-action-btn delete" onclick="deleteQuestion('${q.id}')" title="Sualı Sil">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="dim-q-text">${escapeHtml(q.text)}</div>
        ${figureHtml}
        ${contentHtml}
      </article>
    `;
  }).join('');

  renderAnswerKey();
  renderBubbleSheet();
}

// Render Teacher's Assessment & Answer Key Table
function renderAnswerKey() {
  const tbody = document.getElementById('keyTableBody');
  if (!tbody) return;

  if (currentExam.questions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #94a3b8;">Sual yoxdur</td></tr>';
    return;
  }

  tbody.innerHTML = currentExam.questions.map((q, idx) => {
    let typeName = 'Qapalı';
    if (q.type === 'hendese') typeName = 'Həndəsə (Fiqurlu)';
    if (q.type === 'aciq') typeName = 'Açıq (Kodlaşdırılan)';
    if (q.type === 'yazili') typeName = 'Yazılı Həlli Tələb Olunan';
    if (q.type === 'uygunluq') typeName = 'Uyğunlaşdırma';
    if (q.type === 'situasiya') typeName = 'Situasiya / Kontekst';

    return `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>${typeName}</td>
        <td><strong style="color: #1e3a8a;">${escapeHtml(q.correctAnswer || 'Qeyd edilməyib')}</strong></td>
        <td>${q.points || 1} bal</td>
      </tr>
    `;
  }).join('');
}

// Render Student Bubble Answer Sheet
function renderBubbleSheet() {
  const container = document.getElementById('bubbleGridContainer');
  if (!container) return;

  const total = Math.max(currentExam.questions.length, 10);
  let rowsHtml = '';

  for (let i = 1; i <= total; i++) {
    rowsHtml += `
      <div class="bubble-row">
        <span class="bubble-q-num">${i}.</span>
        <div class="bubbles-group">
          <span class="bubble-circle">A</span>
          <span class="bubble-circle">B</span>
          <span class="bubble-circle">C</span>
          <span class="bubble-circle">D</span>
          <span class="bubble-circle">E</span>
        </div>
      </div>
    `;
  }
  container.innerHTML = rowsHtml;
}

// Math Symbol Insertion
function insertMathSymbol(sym) {
  const activeInput = document.activeElement;
  if (activeInput && (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA')) {
    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const val = activeInput.value;
    activeInput.value = val.substring(0, start) + sym + val.substring(end);
    activeInput.selectionStart = activeInput.selectionEnd = start + sym.length;
    activeInput.focus();
  } else {
    const qText = document.getElementById('questionText');
    if (qText) {
      qText.value += sym;
      qText.focus();
    }
  }
}

// Question Type Switcher
function setQuestionType(type) {
  activeType = type;

  document.querySelectorAll('.type-tab').forEach(t => {
    if (t.getAttribute('data-type') === type) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const optionsGroup = document.getElementById('optionsGroup');
  const shapeSection = document.getElementById('shapeLibrarySection');
  const openGroup = document.getElementById('openAnswerGroup');
  const writtenGroup = document.getElementById('writtenAnswerGroup');
  const matchGroup = document.getElementById('matchingGroup');
  const situationGroup = document.getElementById('situationGroup');

  if (optionsGroup) optionsGroup.classList.add('hidden');
  if (openGroup) openGroup.classList.add('hidden');
  if (writtenGroup) writtenGroup.classList.add('hidden');
  if (matchGroup) matchGroup.classList.add('hidden');
  if (situationGroup) situationGroup.classList.add('hidden');

  if (type === 'qapali') {
    if (optionsGroup) optionsGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.add('hidden');
  } else if (type === 'hendese') {
    if (optionsGroup) optionsGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.remove('hidden');
    updateLiveGeometryPreview();
  } else if (type === 'aciq') {
    if (openGroup) openGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.add('hidden');
  } else if (type === 'yazili') {
    if (writtenGroup) writtenGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.add('hidden');
  } else if (type === 'uygunluq') {
    if (matchGroup) matchGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.add('hidden');
  } else if (type === 'situasiya') {
    if (situationGroup) situationGroup.classList.remove('hidden');
    if (shapeSection) shapeSection.classList.add('hidden');
  }
}

// Handle Form Submission
function handleQuestionSubmit(e) {
  e.preventDefault();

  const textInput = document.getElementById('questionText');
  const pointsInput = document.getElementById('questionPoints');
  const diffInput = document.getElementById('questionDifficulty');

  const text = textInput.value.trim();
  const points = parseFloat(pointsInput.value) || 2;
  const difficulty = diffInput.value;

  if (!text) {
    showToast('Zəhmət olmasa sualın şərtini daxil edin');
    return;
  }

  let questionObj = {
    id: editingQuestionId || `q_${Date.now()}`,
    type: activeType,
    subject: currentExam.subject,
    points,
    difficulty,
    text
  };

  if (activeType === 'qapali' || activeType === 'hendese') {
    const optA = document.getElementById('optA').value.trim();
    const optB = document.getElementById('optB').value.trim();
    const optC = document.getElementById('optC').value.trim();
    const optD = document.getElementById('optD').value.trim();
    const optE = document.getElementById('optE').value.trim();
    const checkedRadio = document.querySelector('input[name="correctOption"]:checked');

    if (!optA || !optB || !optC || !optD || !optE) {
      showToast('Zəhmət olmasa bütün 5 variantı (A, B, C, D, E) doldurun');
      return;
    }

    questionObj.options = { A: optA, B: optB, C: optC, D: optD, E: optE };
    questionObj.correctAnswer = checkedRadio ? checkedRadio.value : 'A';

    if (activeType === 'hendese') {
      questionObj.svgShape = currentSelectedShape;
      questionObj.shapeLabels = {
        a: document.getElementById('geomLabelA')?.value || '',
        b: document.getElementById('geomLabelB')?.value || '',
        c: document.getElementById('geomLabelC')?.value || '',
        angle: document.getElementById('geomAngle')?.value || ''
      };
    }
  } else if (activeType === 'aciq') {
    const ans = document.getElementById('openCorrectAnswer').value.trim();
    if (!ans) {
      showToast('Düzgün ədədi cavabı qeyd edin');
      return;
    }
    questionObj.correctAnswer = ans;
  } else if (activeType === 'yazili') {
    const steps = document.getElementById('writtenSolutionSteps').value.trim();
    questionObj.correctAnswer = steps || 'Mərhələli meyarlar əsasında';
  } else if (activeType === 'uygunluq') {
    const l1 = document.getElementById('matchLeft1').value.trim();
    const l2 = document.getElementById('matchLeft2').value.trim();
    const l3 = document.getElementById('matchLeft3').value.trim();

    const rA = document.getElementById('matchRightA').value.trim();
    const rB = document.getElementById('matchRightB').value.trim();
    const rC = document.getElementById('matchRightC').value.trim();
    const rD = document.getElementById('matchRightD').value.trim();
    const rE = document.getElementById('matchRightE').value.trim();

    const code = document.getElementById('matchCorrectCode').value.trim();

    questionObj.matching = {
      left: [l1, l2, l3].filter(Boolean),
      right: [rA, rB, rC, rD, rE].filter(Boolean)
    };
    questionObj.correctAnswer = code || 'Uyğunluq qeyd edilməyib';
  } else if (activeType === 'situasiya') {
    const context = document.getElementById('situationContext').value.trim();
    const sub1 = document.getElementById('subQ1').value.trim();
    const sub2 = document.getElementById('subQ2').value.trim();

    questionObj.text = context ? `${context}\n\n${text}` : text;
    questionObj.subQ1 = sub1;
    questionObj.subQ2 = sub2;
    questionObj.correctAnswer = 'Situasiya cavab meyarları';
  }

  if (editingQuestionId) {
    const idx = currentExam.questions.findIndex(q => q.id === editingQuestionId);
    if (idx !== -1) {
      currentExam.questions[idx] = questionObj;
      showToast('Sual yeniləndi!');
    }
    cancelEditing();
  } else {
    currentExam.questions.push(questionObj);
    showToast('Yeni sual imtahana əlavə olundu!');
    resetQuestionForm();
  }

  saveStorage();
  renderExamBooklet();
}

// Reset Form
function resetQuestionForm() {
  document.getElementById('questionForm').reset();
  document.getElementById('questionPoints').value = '2';
  document.getElementById('questionDifficulty').value = 'Orta';
  editingQuestionId = null;
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.classList.add('hidden');
  const saveBtn = document.getElementById('saveQuestionBtn');
  if (saveBtn) saveBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Sualı İmtahana Əlavə Et
  `;
}

// Edit Question
window.editQuestion = function(id) {
  const q = currentExam.questions.find(item => item.id === id);
  if (!q) return;

  editingQuestionId = id;
  setQuestionType(q.type || 'qapali');

  document.getElementById('questionText').value = q.text || '';
  document.getElementById('questionPoints').value = q.points || '2';
  document.getElementById('questionDifficulty').value = q.difficulty || 'Orta';

  if (q.type === 'qapali' || q.type === 'hendese') {
    const opts = q.options || {};
    document.getElementById('optA').value = opts.A || '';
    document.getElementById('optB').value = opts.B || '';
    document.getElementById('optC').value = opts.C || '';
    document.getElementById('optD').value = opts.D || '';
    document.getElementById('optE').value = opts.E || '';

    const radio = document.querySelector(`input[name="correctOption"][value="${q.correctAnswer}"]`);
    if (radio) radio.checked = true;

    if (q.type === 'hendese' && q.svgShape) {
      selectShape(q.svgShape);
      const labels = q.shapeLabels || {};
      if (document.getElementById('geomLabelA')) document.getElementById('geomLabelA').value = labels.a || '';
      if (document.getElementById('geomLabelB')) document.getElementById('geomLabelB').value = labels.b || '';
      if (document.getElementById('geomLabelC')) document.getElementById('geomLabelC').value = labels.c || '';
      if (document.getElementById('geomAngle')) document.getElementById('geomAngle').value = labels.angle || '';
      updateLiveGeometryPreview();
    }
  } else if (q.type === 'aciq') {
    document.getElementById('openCorrectAnswer').value = q.correctAnswer || '';
  } else if (q.type === 'yazili') {
    document.getElementById('writtenSolutionSteps').value = q.correctAnswer || '';
  }

  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  const saveBtn = document.getElementById('saveQuestionBtn');
  if (saveBtn) saveBtn.innerHTML = '💾 Dəyişikliyi Yadda Saxla';

  document.querySelector('.toolset-panel').scrollTop = 0;
};

// Cancel Editing
function cancelEditing() {
  resetQuestionForm();
}

// Delete Question
window.deleteQuestion = function(id) {
  currentExam.questions = currentExam.questions.filter(q => q.id !== id);
  saveStorage();
  renderExamBooklet();
  showToast('Sual silindi');
};

// ==========================================================================
// TESTİ YÜKLƏMƏ MÜHƏRRİKİ (PDF və Word .doc Formatları)
// ==========================================================================
function openDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.classList.remove('hidden');
}

function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.classList.add('hidden');
}

// PDF Sənədi Kimi Yüklə (Print-to-PDF)
function downloadAsPdf() {
  closeDownloadModal();
  const incKeys = document.getElementById('includeAnswerKeyCheckbox')?.checked;
  const incBubble = document.getElementById('includeBubbleSheetCheckbox')?.checked;

  const keySec = document.getElementById('answerKeySection');
  const bubbleSec = document.getElementById('bubbleSheetSection');

  if (keySec) {
    if (incKeys) keySec.classList.remove('hidden');
    else keySec.classList.add('hidden');
  }
  if (bubbleSec) {
    if (incBubble) bubbleSec.classList.remove('hidden');
    else bubbleSec.classList.add('hidden');
  }

  showToast('PDF yükləmə pəncərəsi açılır...');
  setTimeout(() => {
    window.print();
  }, 300);
}

// Word (.doc) Faylı Kimi Yüklə
function downloadAsWordDoc() {
  closeDownloadModal();

  const title = currentExam.title || 'DİM İmtahan Testi';
  const subject = currentExam.subject;
  const grade = currentExam.grade;

  let bodyHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; color: #000; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 15px; }
        .q-item { margin-bottom: 15px; }
        .q-num { font-weight: bold; }
        .options { margin-left: 20px; }
        .opt { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin: 0; font-size: 14pt;">AZƏRBAYCAN RESPUBLİKASI DÖVLƏT İMTAHAN MƏRKƏZİ</h2>
        <h3 style="margin: 4px 0;">${title}</h3>
        <p style="margin: 0;">Fənn: <b>${subject}</b> &nbsp;|&nbsp; Səviyyə: <b>${grade}</b> &nbsp;|&nbsp; Variant: <b>A</b></p>
      </div>
  `;

  currentExam.questions.forEach((q, idx) => {
    const qNum = idx + 1;
    bodyHtml += `
      <div class="q-item">
        <p><b>${qNum}.</b> ${escapeHtml(q.text)} <i>(${q.points || 1} bal)</i></p>
    `;

    if (q.type === 'qapali' || q.type === 'hendese') {
      const opts = q.options || {};
      bodyHtml += `<div class="options">`;
      ['A', 'B', 'C', 'D', 'E'].forEach(let => {
        bodyHtml += `<div class="opt"><b>${let})</b> ${escapeHtml(opts[let] || '')}</div>`;
      });
      bodyHtml += `</div>`;
    } else if (q.type === 'aciq') {
      bodyHtml += `<p><i>[Cavab üçün xana: __________]</i></p>`;
    } else if (q.type === 'uygunluq') {
      const m = q.matching || { left: [], right: [] };
      bodyHtml += `<table width="100%" style="margin-top: 5px;"><tr><td width="50%" valign="top">`;
      (m.left || []).forEach(item => { bodyHtml += `<div>${escapeHtml(item)}</div>`; });
      bodyHtml += `</td><td width="50%" valign="top">`;
      (m.right || []).forEach(item => { bodyHtml += `<div>${escapeHtml(item)}</div>`; });
      bodyHtml += `</td></tr></table>`;
    }
    bodyHtml += `</div>`;
  });

  // Include Answer key if checked
  const incKeys = document.getElementById('includeAnswerKeyCheckbox')?.checked;
  if (incKeys) {
    bodyHtml += `
      <br><hr><br>
      <h3>DÜZGÜN CAVABLAR AÇARI:</h3>
      <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <tr><th>Sual №</th><th>Tipi</th><th>Düzgün Cavab</th><th>Bal</th></tr>
    `;
    currentExam.questions.forEach((q, idx) => {
      bodyHtml += `<tr><td>${idx + 1}</td><td>${q.type}</td><td><b>${escapeHtml(q.correctAnswer || '')}</b></td><td>${q.points || 1}</td></tr>`;
    });
    bodyHtml += `</table>`;
  }

  bodyHtml += `</body></html>`;

  const blob = new Blob(['\ufeff', bodyHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DIM_${subject}_Test_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Word (.doc) sənədi yükləndi!');
}

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Helper: Toast
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

// ==========================================================================
// Setup Event Listeners on DOM Load
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();

  // Shape Category Filters
  document.querySelectorAll('.shape-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.shape-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      renderShapeCards(cat);
    });
  });

  // Track focused shape label input
  ['geomLabelA', 'geomLabelB', 'geomLabelC', 'geomAngle'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('focus', () => { lastFocusedInputId = id; });
      el.addEventListener('input', updateLiveGeometryPreview);
    }
  });

  // Question Type Buttons
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.getAttribute('data-type');
      setQuestionType(type);
    });
  });

  // Math Symbol Toolbar
  document.querySelectorAll('.sym-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sym = btn.getAttribute('data-sym');
      insertMathSymbol(sym);
    });
  });

  // Auto question text button
  const autoBtn = document.getElementById('autoQuestionTextBtn');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      const qText = document.getElementById('questionText');
      if (qText) {
        qText.value = 'Şəkildə verilmiş fiqura əsasən, axtarılan göstəricini tapın.';
        qText.focus();
      }
    });
  }

  // Form Submit
  const qForm = document.getElementById('questionForm');
  if (qForm) qForm.addEventListener('submit', handleQuestionSubmit);

  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEditing);

  // Clean Header Dropdowns
  const subjSelect = document.getElementById('subjectSelect');
  const gradeSelect = document.getElementById('gradeSelect');

  if (subjSelect) {
    subjSelect.value = currentExam.subject || 'Riyaziyyat';
    subjSelect.addEventListener('change', (e) => {
      currentExam.subject = e.target.value;
      saveStorage();
      renderExamBooklet();
    });
  }

  if (gradeSelect) {
    gradeSelect.value = currentExam.grade || '11-ci sinif (Buraxılış)';
    gradeSelect.addEventListener('change', (e) => {
      currentExam.grade = e.target.value;
      saveStorage();
      renderExamBooklet();
    });
  }

  // Download Exam Button (replaces Print)
  const downloadBtn = document.getElementById('downloadExamBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', openDownloadModal);
  }

  const closeModBtn = document.getElementById('closeDownloadModalBtn');
  if (closeModBtn) {
    closeModBtn.addEventListener('click', closeDownloadModal);
  }

  const pdfOpt = document.getElementById('downloadPdfOption');
  if (pdfOpt) pdfOpt.addEventListener('click', downloadAsPdf);

  const docOpt = document.getElementById('downloadDocOption');
  if (docOpt) docOpt.addEventListener('click', downloadAsWordDoc);

  // Close modal when clicking outside
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDownloadModal();
    });
  }

  // Sample Exam Button
  const sampleBtn = document.getElementById('loadSampleExamBtn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      currentExam.questions = JSON.parse(JSON.stringify(DIM_SAMPLE_QUESTIONS));
      saveStorage();
      renderExamBooklet();
      showToast('DİM nümunəvi imtahan modeli yükləndi!');
    });
  }

  // Clear All Button
  const clearBtn = document.getElementById('clearAllBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Bütün sualları silmək istədiyinizdən əminsiniz?')) {
        currentExam.questions = [];
        saveStorage();
        renderExamBooklet();
        showToast('Bütün suallar təmizləndi');
      }
    });
  }

  // Answer Key & Bubble Sheet Toggles
  const toggleKeyBtn = document.getElementById('toggleAnswerKeyBtn');
  const answerKeySection = document.getElementById('answerKeySection');
  if (toggleKeyBtn && answerKeySection) {
    toggleKeyBtn.addEventListener('click', () => {
      answerKeySection.classList.toggle('hidden');
      toggleKeyBtn.classList.toggle('btn-primary');
      toggleKeyBtn.classList.toggle('btn-outline');
    });
  }

  const toggleBubbleBtn = document.getElementById('toggleBubbleSheetBtn');
  const bubbleSheetSection = document.getElementById('bubbleSheetSection');
  if (toggleBubbleBtn && bubbleSheetSection) {
    toggleBubbleBtn.addEventListener('click', () => {
      bubbleSheetSection.classList.toggle('hidden');
      toggleBubbleBtn.classList.toggle('btn-primary');
      toggleBubbleBtn.classList.toggle('btn-outline');
    });
  }

  // Initialize View
  renderShapeCards('ucbucaq');
  selectShape('right_triangle');
  renderExamBooklet();
});
