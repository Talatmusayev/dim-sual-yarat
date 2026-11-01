/**
 * DİM SualUsta - Müəllimlər üçün İmtahan və Test Hazırlayıcı
 * JavaScript Mühərriki
 */

// Global State
let currentExam = {
  title: 'BİRLƏŞMİŞ BURAXILIŞ İMTAHANI (DİM MODELİ)',
  subject: 'Riyaziyyat',
  grade: '11-ci sinif Buraxılış',
  questions: []
};

let activeType = 'qapali';
let editingQuestionId = null;

// Built-in authentic DİM Sample Questions (Riyaziyyat və Buraxılış Modeli)
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
  },
  {
    id: 'dim_6',
    type: 'yazili',
    subject: 'Riyaziyyat',
    points: 3,
    difficulty: 'Çətin',
    text: 'Düzbucaqlı paralelepipedin oturacağının tərəfləri 3 sm və 4 sm, hündürlüyü isə 12 sm-dir. Paralelepipedin böyük diaqonal kəsiyinin sahəsini və tam səthinin sahəsini tapın (Həll mərhələlərini tam yazın).',
    correctAnswer: 'Diaqonal kəsiyinin sahəsi: 60 sm²; Tam səthi: 192 sm²'
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

// Generate SVG Geometry Diagrams
function generateGeometrySvg(shape, labels) {
  const lA = escapeHtml(labels.a || 'a');
  const lB = escapeHtml(labels.b || 'b');
  const lC = escapeHtml(labels.c || 'c');
  const lAng = escapeHtml(labels.angle || 'α');

  switch (shape) {
    case 'right_triangle':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <!-- Triangle -->
          <polygon points="35,135 185,135 35,30" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          <!-- Right angle symbol -->
          <polyline points="35,115 55,115 55,135" fill="none" stroke="#000000" stroke-width="1.8"/>
          <!-- Dot inside right angle -->
          <circle cx="45" cy="125" r="1.5" fill="#000000"/>
          <!-- Angle arc at hypotenuse -->
          <path d="M 160,135 A 25,25 0 0,0 170,123" fill="none" stroke="#000000" stroke-width="1.5"/>
          <text x="145" y="128" font-family="'STIX Two Text', serif" font-size="13" font-style="italic">${lAng}</text>
          <!-- Labels -->
          <text x="15" y="85" font-family="'STIX Two Text', serif" font-size="14" font-weight="600">${lA}</text>
          <text x="100" y="152" font-family="'STIX Two Text', serif" font-size="14" font-weight="600">${lB}</text>
          <text x="120" y="70" font-family="'STIX Two Text', serif" font-size="14" font-weight="700" fill="#b91c1c">${lC}</text>
          <!-- Vertices -->
          <text x="20" y="145" font-family="sans-serif" font-size="12" font-weight="700">A</text>
          <text x="190" y="145" font-family="sans-serif" font-size="12" font-weight="700">C</text>
          <text x="22" y="25" font-family="sans-serif" font-size="12" font-weight="700">B</text>
        </svg>
      `;

    case 'isosceles_triangle':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <polygon points="110,25 35,135 185,135" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          <!-- Altitude dashed -->
          <line x1="110" y1="25" x2="110" y2="135" stroke="#000000" stroke-width="1.5" stroke-dasharray="4,3"/>
          <polyline points="110,122 122,122 122,135" fill="none" stroke="#000000" stroke-width="1.4"/>
          <!-- Side tick marks -->
          <line x1="68" y1="78" x2="76" y2="82" stroke="#000000" stroke-width="2"/>
          <line x1="144" y1="78" x2="152" y2="82" stroke="#000000" stroke-width="2"/>
          <!-- Labels -->
          <text x="45" y="75" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lA}</text>
          <text x="160" y="75" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lA}</text>
          <text x="100" y="152" font-family="'STIX Two Text', serif" font-size="14" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="114" y="85" font-family="'STIX Two Text', serif" font-size="12" font-style="italic">h</text>
          <!-- Vertices -->
          <text x="105" y="18" font-family="sans-serif" font-size="12" font-weight="700">B</text>
          <text x="22" y="145" font-family="sans-serif" font-size="12" font-weight="700">A</text>
          <text x="190" y="145" font-family="sans-serif" font-size="12" font-weight="700">C</text>
        </svg>
      `;

    case 'circle_chord':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <!-- Circle -->
          <circle cx="110" cy="80" r="62" fill="none" stroke="#000000" stroke-width="2"/>
          <!-- Center point -->
          <circle cx="110" cy="80" r="3" fill="#000000"/>
          <text x="115" y="75" font-family="sans-serif" font-size="12" font-weight="700">O</text>
          <!-- Chord AB -->
          <line x1="65" y1="124" x2="155" y2="124" stroke="#000000" stroke-width="2.2"/>
          <!-- Perpendicular from center to chord -->
          <line x1="110" y1="80" x2="110" y2="124" stroke="#000000" stroke-width="1.5" stroke-dasharray="3,3"/>
          <polyline points="110,114 120,114 120,124" fill="none" stroke="#000000" stroke-width="1.2"/>
          <!-- Radius line to chord end -->
          <line x1="110" y1="80" x2="155" y2="124" stroke="#000000" stroke-width="1.2" stroke-dasharray="4,2"/>
          <!-- Labels -->
          <text x="135" y="98" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lA}</text>
          <text x="82" y="105" font-family="'STIX Two Text', serif" font-size="12" font-weight="600">${lB}</text>
          <text x="100" y="142" font-family="'STIX Two Text', serif" font-size="13" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="50" y="130" font-family="sans-serif" font-size="12" font-weight="700">A</text>
          <text x="160" y="130" font-family="sans-serif" font-size="12" font-weight="700">B</text>
        </svg>
      `;

    case 'circle_tangent':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <circle cx="95" cy="80" r="50" fill="none" stroke="#000000" stroke-width="2"/>
          <circle cx="95" cy="80" r="3" fill="#000000"/>
          <text x="82" y="78" font-family="sans-serif" font-size="12" font-weight="700">O</text>
          <!-- Tangent line at bottom -->
          <line x1="20" y1="130" x2="200" y2="130" stroke="#000000" stroke-width="2"/>
          <!-- Radius to tangent point -->
          <line x1="95" y1="80" x2="95" y2="130" stroke="#000000" stroke-width="1.5" stroke-dasharray="3,3"/>
          <polyline points="95,118 107,118 107,130" fill="none" stroke="#000000" stroke-width="1.2"/>
          <!-- Outer point P line -->
          <line x1="95" y1="80" x2="190" y2="130" stroke="#000000" stroke-width="1.5"/>
          <!-- Labels -->
          <text x="68" y="110" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lA}</text>
          <text x="90" y="145" font-family="sans-serif" font-size="12" font-weight="700">T</text>
          <text x="195" y="135" font-family="sans-serif" font-size="12" font-weight="700">P</text>
          <text x="135" y="145" font-family="'STIX Two Text', serif" font-size="13" font-weight="700" fill="#b91c1c">${lC}</text>
        </svg>
      `;

    case 'trapezoid':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <polygon points="65,40 155,40 195,130 25,130" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          <!-- Altitude dashed -->
          <line x1="65" y1="40" x2="65" y2="130" stroke="#000000" stroke-width="1.5" stroke-dasharray="4,3"/>
          <polyline points="65,118 77,118 77,130" fill="none" stroke="#000000" stroke-width="1.2"/>
          <!-- Labels -->
          <text x="100" y="32" font-family="'STIX Two Text', serif" font-size="14" font-weight="600">${lA}</text>
          <text x="100" y="148" font-family="'STIX Two Text', serif" font-size="14" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="48" y="90" font-family="'STIX Two Text', serif" font-size="13" font-style="italic">h</text>
          <text x="175" y="85" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lB}</text>
          <!-- Vertices -->
          <text x="50" y="35" font-family="sans-serif" font-size="12" font-weight="700">B</text>
          <text x="160" y="35" font-family="sans-serif" font-size="12" font-weight="700">C</text>
          <text x="12" y="140" font-family="sans-serif" font-size="12" font-weight="700">A</text>
          <text x="200" y="140" font-family="sans-serif" font-size="12" font-weight="700">D</text>
        </svg>
      `;

    case 'coordinate_axes':
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <!-- X and Y Axes -->
          <line x1="20" y1="95" x2="200" y2="95" stroke="#000000" stroke-width="1.8"/>
          <polyline points="194,91 200,95 194,99" fill="#000000"/>
          <line x1="110" y1="145" x2="110" y2="15" stroke="#000000" stroke-width="1.8"/>
          <polyline points="106,21 110,15 114,21" fill="#000000"/>
          <!-- Axis Labels -->
          <text x="195" y="112" font-family="sans-serif" font-size="12" font-weight="700">x</text>
          <text x="96" y="22" font-family="sans-serif" font-size="12" font-weight="700">y</text>
          <text x="98" y="110" font-family="sans-serif" font-size="11">0</text>
          <!-- Parabola curve -->
          <path d="M 50,25 Q 110,145 170,25" fill="none" stroke="#b91c1c" stroke-width="2.2"/>
          <circle cx="110" cy="85" r="2.5" fill="#000000"/>
          <!-- Curve label -->
          <text x="145" y="55" font-family="'STIX Two Text', serif" font-size="13" font-weight="700" fill="#b91c1c">${lC || 'y=f(x)'}</text>
        </svg>
      `;

    default: // triangle_height or general
      return `
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <polygon points="85,30 25,130 195,130" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round"/>
          <line x1="85" y1="30" x2="85" y2="130" stroke="#000000" stroke-width="1.5" stroke-dasharray="4,3"/>
          <polyline points="85,118 97,118 97,130" fill="none" stroke="#000000" stroke-width="1.2"/>
          <text x="45" y="75" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lA}</text>
          <text x="150" y="75" font-family="'STIX Two Text', serif" font-size="13" font-weight="600">${lB}</text>
          <text x="100" y="148" font-family="'STIX Two Text', serif" font-size="14" font-weight="700" fill="#b91c1c">${lC}</text>
          <text x="90" y="85" font-family="'STIX Two Text', serif" font-size="13" font-style="italic">h</text>
        </svg>
      `;
  }
}

// Update the live geometry preview inside teacher's creator box
function updateLiveGeometryPreview() {
  const container = document.getElementById('geomSvgContainer');
  if (!container) return;

  const shapeType = document.getElementById('geomShapeType').value;
  const lA = document.getElementById('geomLabelA').value;
  const lB = document.getElementById('geomLabelB').value;
  const lC = document.getElementById('geomLabelC').value;
  const lAng = document.getElementById('geomAngle').value;

  const svg = generateGeometrySvg(shapeType, { a: lA, b: lB, c: lC, angle: lAng });
  container.innerHTML = svg;
}

// Render Questions to DİM Examination Booklet
function renderExamBooklet() {
  const container = document.getElementById('dimQuestionsContainer');
  const emptyState = document.getElementById('noQuestionsNotice');
  const countEl = document.getElementById('totalQuestionsCount');
  const pointsEl = document.getElementById('totalPointsSum');
  const subjDisplay = document.getElementById('displaySubjectName');

  const paperTitle = document.getElementById('paperExamTitle');
  const paperSubject = document.getElementById('paperSubject');
  const paperGrade = document.getElementById('paperGrade');

  // Update header text in paper
  if (paperTitle) paperTitle.textContent = currentExam.title || 'BURAXILIŞ İMTAHANI MODELİ';
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

    // Question body depending on type
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

      contentHtml = `
        <div class="dim-options-list">
          ${optsList}
        </div>
      `;
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

      contentHtml = `
        <div class="dim-situation-body">
          ${sub1}
          ${sub2}
        </div>
      `;
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
    // Default to main question textarea
    const qText = document.getElementById('questionText');
    if (qText) {
      qText.value += sym;
      qText.focus();
    }
  }
}

// Type Tabs Switcher
function setQuestionType(type) {
  activeType = type;

  // Update tabs UI
  document.querySelectorAll('.type-tab').forEach(t => {
    if (t.getAttribute('data-type') === type) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  // Groups
  const optionsGroup = document.getElementById('optionsGroup');
  const geomBox = document.getElementById('geometryStudioBox');
  const openGroup = document.getElementById('openAnswerGroup');
  const writtenGroup = document.getElementById('writtenAnswerGroup');
  const matchGroup = document.getElementById('matchingGroup');
  const situationGroup = document.getElementById('situationGroup');

  // Hide all dynamic blocks first
  if (optionsGroup) optionsGroup.classList.add('hidden');
  if (openGroup) openGroup.classList.add('hidden');
  if (writtenGroup) writtenGroup.classList.add('hidden');
  if (matchGroup) matchGroup.classList.add('hidden');
  if (situationGroup) situationGroup.classList.add('hidden');

  if (type === 'qapali') {
    if (optionsGroup) optionsGroup.classList.remove('hidden');
  } else if (type === 'hendese') {
    if (optionsGroup) optionsGroup.classList.remove('hidden');
    updateLiveGeometryPreview();
  } else if (type === 'aciq') {
    if (openGroup) openGroup.classList.remove('hidden');
  } else if (type === 'yazili') {
    if (writtenGroup) writtenGroup.classList.remove('hidden');
  } else if (type === 'uygunluq') {
    if (matchGroup) matchGroup.classList.remove('hidden');
  } else if (type === 'situasiya') {
    if (situationGroup) situationGroup.classList.remove('hidden');
  }

  // Toggle geometry box visibility
  if (geomBox) {
    if (type === 'hendese') {
      geomBox.classList.remove('hidden');
      updateLiveGeometryPreview();
    } else {
      geomBox.classList.add('hidden');
    }
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
      questionObj.svgShape = document.getElementById('geomShapeType').value;
      questionObj.shapeLabels = {
        a: document.getElementById('geomLabelA').value,
        b: document.getElementById('geomLabelB').value,
        c: document.getElementById('geomLabelC').value,
        angle: document.getElementById('geomAngle').value
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
    questionObj.correctAnswer = code || 'Uyğunluq kodu qeyd edilməyib';
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

    if (q.type === 'hendese') {
      document.getElementById('geomShapeType').value = q.svgShape || 'right_triangle';
      const labels = q.shapeLabels || {};
      document.getElementById('geomLabelA').value = labels.a || '';
      document.getElementById('geomLabelB').value = labels.b || '';
      document.getElementById('geomLabelC').value = labels.c || '';
      document.getElementById('geomAngle').value = labels.angle || '';
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

  // Scroll smoothly to left toolset
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

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initStorage();

  // Question Type Buttons
  document.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.getAttribute('data-type');
      setQuestionType(type);
    });
  });

  // Math Symbol Quick Bar
  document.querySelectorAll('.sym-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sym = btn.getAttribute('data-sym');
      insertMathSymbol(sym);
    });
  });

  // Geometry Inputs live preview change
  const geomInputs = ['geomShapeType', 'geomLabelA', 'geomLabelB', 'geomLabelC', 'geomAngle'];
  geomInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateLiveGeometryPreview);
      el.addEventListener('change', updateLiveGeometryPreview);
    }
  });

  // Form Submit
  const qForm = document.getElementById('questionForm');
  if (qForm) qForm.addEventListener('submit', handleQuestionSubmit);

  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEditing);

  // Exam Meta Inputs
  const titleInput = document.getElementById('examTitleInput');
  const subjSelect = document.getElementById('subjectSelect');
  const gradeSelect = document.getElementById('gradeSelect');

  if (titleInput) {
    titleInput.value = currentExam.title || 'BİRLƏŞMİŞ BURAXILIŞ İMTAHANI (DİM MODELİ)';
    titleInput.addEventListener('input', (e) => {
      currentExam.title = e.target.value;
      saveStorage();
      renderExamBooklet();
    });
  }

  if (subjSelect) {
    subjSelect.value = currentExam.subject || 'Riyaziyyat';
    subjSelect.addEventListener('change', (e) => {
      currentExam.subject = e.target.value;
      saveStorage();
      renderExamBooklet();
    });
  }

  if (gradeSelect) {
    gradeSelect.value = currentExam.grade || '11-ci sinif Buraxılış';
    gradeSelect.addEventListener('change', (e) => {
      currentExam.grade = e.target.value;
      saveStorage();
      renderExamBooklet();
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

  // Print Exam Button
  const printBtn = document.getElementById('printExamBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Answer Key Toggle
  const toggleKeyBtn = document.getElementById('toggleAnswerKeyBtn');
  const answerKeySection = document.getElementById('answerKeySection');
  if (toggleKeyBtn && answerKeySection) {
    toggleKeyBtn.addEventListener('click', () => {
      answerKeySection.classList.toggle('hidden');
      toggleKeyBtn.classList.toggle('btn-primary');
      toggleKeyBtn.classList.toggle('btn-outline');
    });
  }

  // Bubble Sheet Toggle
  const toggleBubbleBtn = document.getElementById('toggleBubbleSheetBtn');
  const bubbleSheetSection = document.getElementById('bubbleSheetSection');
  if (toggleBubbleBtn && bubbleSheetSection) {
    toggleBubbleBtn.addEventListener('click', () => {
      bubbleSheetSection.classList.toggle('hidden');
      toggleBubbleBtn.classList.toggle('btn-primary');
      toggleBubbleBtn.classList.toggle('btn-outline');
    });
  }

  // Initialize view
  setQuestionType('qapali');
  renderExamBooklet();
  updateLiveGeometryPreview();
});
