/**
 * DİM SualUsta - Müəllimlər üçün İmtahan və Test Hazırlayıcı
 * JavaScript Mühərriki - PowerPoint Üslublu Fiqur Studiyası və İmtahan Sistemi
 */

// Global State
let currentExam = {
  title: 'BİRLƏŞMİŞ BURAXILIŞ İMTAHANI (DİM MODELİ)',
  subject: 'Riyaziyyat',
  grade: '11-ci sinif (Buraxılış)',
  questions: []
};

let activeType = 'qapali';
let editingQuestionId = null;
let attachedFigureData = null; // null if no figure attached
let lastFocusedStudioInputId = 'studioInputC';

// Studio Internal State (Paint & Geometric Drawing Engine State)
let studioState = {
  baseShape: 'empty_right_triangle',
  color: '#000000',
  lineStyle: 'solid',
  lineWidth: '2',
  activeTool: 'select', // 'select' | 'line' | 'right_angle' | 'arrow' | 'text'
  selectedElementId: null,
  selectedElementType: null,
  vertices: [
    { x: 80, y: 220, label: 'A' },
    { x: 380, y: 220, label: 'C' },
    { x: 80, y: 50, label: 'B' }
  ],
  circle: null,
  axes: false,
  lines: [], // custom lines: [{id, x1, y1, x2, y2, color, style, width, isArrow}]
  rightAngles: [{ id: 'ra_default', x: 80, y: 220, size: 18 }],
  texts: [], // custom texts: [{id, text, x, y, color, fontSize}]
  labels: {
    a: '',
    b: '',
    c: '',
    h: '',
    angle: '',
    vertices: 'A, B, C'
  }
};

// Built-in authentic DİM Sample Questions (Both with and without figures!)
const DIM_SAMPLE_QUESTIONS = [
  {
    id: 'dim_1',
    type: 'qapali',
    subject: 'Riyaziyyat',
    points: 2,
    difficulty: 'Orta',
    text: 'Şəkildə verilmiş düzbucaqlı üçbucaqda katetlər 6 sm və 8 sm olarsa, hipotenuzun (c) uzunluğunu tapın.',
    figure: {
      baseShape: 'empty_right_triangle',
      color: '#000000',
      lineStyle: 'solid',
      lineWidth: '2',
      vertices: [
        { x: 80, y: 220, label: 'A' },
        { x: 380, y: 220, label: 'C' },
        { x: 80, y: 50, label: 'B' }
      ],
      circle: null,
      axes: false,
      rightAngles: [{ id: 'ra_default', x: 80, y: 220, size: 18 }],
      lines: [],
      texts: [],
      labels: { a: '6 sm', b: '8 sm', c: 'c = ?', h: '', angle: '', vertices: 'A, B, C' }
    },
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
    figure: null, // Şəkilsiz sadə cəbr sualı!
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
    type: 'qapali',
    subject: 'Riyaziyyat',
    points: 2,
    difficulty: 'Orta',
    text: 'Radiusu R = 10 sm olan çevrədə mərkəzdən 6 sm məsafədə yerləşən AB vətərinin uzunluğunu tapın.',
    figure: {
      baseShape: 'empty_circle',
      color: '#000000',
      lineStyle: 'solid',
      lineWidth: '2',
      circle: { cx: 230, cy: 135, r: 85 },
      vertices: [],
      axes: false,
      lines: [
        { id: 'chord_1', x1: 155, y1: 195, x2: 305, y2: 195, color: '#dc2626', style: 'solid', width: '2', isArrow: false },
        { id: 'dist_1', x1: 230, y1: 135, x2: 230, y2: 195, color: '#dc2626', style: 'dashed', width: '1.5', isArrow: false }
      ],
      texts: [
        { id: 't1', text: 'd = 6 sm', x: 238, y: 170, color: '#dc2626', fontSize: 13 },
        { id: 't2', text: 'AB = ?', x: 215, y: 215, color: '#dc2626', fontSize: 13 },
        { id: 't3', text: 'R = 10', x: 275, y: 120, color: '#000000', fontSize: 13 }
      ],
      rightAngles: [],
      labels: { a: '', b: '', c: '', h: '', angle: '', vertices: 'A, B' }
    },
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
    figure: null,
    correctAnswer: '210'
  },
  {
    id: 'dim_5',
    type: 'uygunluq',
    subject: 'Riyaziyyat',
    points: 3,
    difficulty: 'Çətin',
    text: 'Verilmiş funksiyalar və onların qrafiklərinə aid xassələr arasında uyğunluğu müəyyən edin.',
    figure: null,
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
// 1. RİYAZİ SİMVOLLARIN GÖRÜNMƏSİ (Yalnız Riyaziyyat və Fizikada)
// ==========================================================================
function updateMathToolbarVisibility() {
  const subj = currentExam.subject || 'Riyaziyyat';
  const isMathOrPhysics = (subj === 'Riyaziyyat' || subj === 'Fizika');
  const toolbar = document.getElementById('mathSymbolToolbar');
  if (toolbar) {
    if (isMathOrPhysics) {
      toolbar.classList.remove('hidden');
    } else {
      toolbar.classList.add('hidden');
    }
  }
}

// ==========================================================================
// 2. PAİNT ÜSLUBLU HƏNDƏSƏ STUDİYASI (İnteraktiv Vektor Rəsm Mühərriki)
// ==========================================================================

// Baza Fiqurlar üçün Standart Koordinat Təyinatları (460x280 SVG kətanında)
function getShapeDefaults(shapeType) {
  switch (shapeType) {
    case 'empty_right_triangle':
      return {
        vertices: [
          { x: 80, y: 220, label: 'A' },
          { x: 380, y: 220, label: 'C' },
          { x: 80, y: 55, label: 'B' }
        ],
        rightAngles: [{ id: 'ra_default', x: 80, y: 220, size: 20 }]
      };
    case 'empty_isosceles_triangle':
      return {
        vertices: [
          { x: 80, y: 220, label: 'A' },
          { x: 380, y: 220, label: 'C' },
          { x: 230, y: 55, label: 'B' }
        ],
        rightAngles: []
      };
    case 'empty_equilateral_triangle':
      return {
        vertices: [
          { x: 90, y: 220, label: 'A' },
          { x: 370, y: 220, label: 'B' },
          { x: 230, y: 55, label: 'C' }
        ],
        rightAngles: []
      };
    case 'empty_scalene_triangle':
      return {
        vertices: [
          { x: 60, y: 220, label: 'A' },
          { x: 390, y: 220, label: 'B' },
          { x: 170, y: 60, label: 'C' }
        ],
        rightAngles: []
      };
    case 'empty_obtuse_triangle':
      return {
        vertices: [
          { x: 160, y: 220, label: 'A' },
          { x: 400, y: 220, label: 'B' },
          { x: 60, y: 90, label: 'C' }
        ],
        rightAngles: []
      };
    case 'empty_square':
      return {
        vertices: [
          { x: 140, y: 50, label: 'B' },
          { x: 320, y: 50, label: 'C' },
          { x: 320, y: 230, label: 'D' },
          { x: 140, y: 230, label: 'A' }
        ],
        rightAngles: []
      };
    case 'empty_rectangle':
      return {
        vertices: [
          { x: 80, y: 65, label: 'B' },
          { x: 380, y: 65, label: 'C' },
          { x: 380, y: 215, label: 'D' },
          { x: 80, y: 215, label: 'A' }
        ],
        rightAngles: []
      };
    case 'empty_rhombus':
      return {
        vertices: [
          { x: 230, y: 40, label: 'B' },
          { x: 380, y: 140, label: 'C' },
          { x: 230, y: 240, label: 'D' },
          { x: 80, y: 140, label: 'A' }
        ],
        rightAngles: []
      };
    case 'empty_parallelogram':
      return {
        vertices: [
          { x: 140, y: 60, label: 'B' },
          { x: 390, y: 60, label: 'C' },
          { x: 320, y: 220, label: 'D' },
          { x: 70, y: 220, label: 'A' }
        ],
        rightAngles: []
      };
    case 'empty_trapezoid':
    case 'empty_isosceles_trapezoid':
      return {
        vertices: [
          { x: 140, y: 60, label: 'B' },
          { x: 320, y: 60, label: 'C' },
          { x: 390, y: 220, label: 'D' },
          { x: 70, y: 220, label: 'A' }
        ],
        rightAngles: []
      };
    case 'empty_right_trapezoid':
      return {
        vertices: [
          { x: 90, y: 60, label: 'B' },
          { x: 330, y: 60, label: 'C' },
          { x: 390, y: 220, label: 'D' },
          { x: 90, y: 220, label: 'A' }
        ],
        rightAngles: [{ id: 'ra_trapezoid', x: 90, y: 220, size: 20 }]
      };
    case 'empty_circle':
      return {
        circle: { cx: 230, cy: 135, r: 85 },
        vertices: [],
        rightAngles: []
      };
    case 'empty_coordinate_axes':
      return {
        axes: true,
        vertices: [],
        rightAngles: []
      };
    default:
      return getShapeDefaults('empty_right_triangle');
  }
}

// Baza fiquru təyin et və ya sıfırla
function initStudioShape(shapeType, preserveCustom = false) {
  studioState.baseShape = shapeType;
  const def = getShapeDefaults(shapeType);
  studioState.vertices = JSON.parse(JSON.stringify(def.vertices || []));
  studioState.circle = def.circle ? { ...def.circle } : null;
  studioState.axes = !!def.axes;

  if (!preserveCustom) {
    studioState.lines = [];
    studioState.rightAngles = JSON.parse(JSON.stringify(def.rightAngles || []));
    studioState.texts = [];
    studioState.selectedElementId = null;
    studioState.selectedElementType = null;
  }
}

// SVG Rəsm Mühərriki: Həm kətan redaktoru, həm DİM imtahan vərəqi üçün
function renderStudioSvg(state, isMini = false, isEditor = false) {
  if (!state) return '';

  // Geriye uyğunluq: Əgər köhnə saxlanmış fiqurdursa və təpə koordinatları yoxdursa:
  if ((!state.vertices || state.vertices.length === 0) && !state.circle && !state.axes) {
    const def = getShapeDefaults(state.baseShape || 'empty_right_triangle');
    state.vertices = JSON.parse(JSON.stringify(def.vertices || []));
    if (def.circle) state.circle = { ...def.circle };
    if (def.rightAngles && (!state.rightAngles || state.rightAngles.length === 0)) {
      state.rightAngles = JSON.parse(JSON.stringify(def.rightAngles));
    }
  }

  const color = state.color || '#000000';
  const strokeW = isMini ? '1.8' : (state.lineWidth || '2');
  const dashArray = state.lineStyle === 'dashed' ? '5,4' : (state.lineStyle === 'dotted' ? '2,4' : 'none');
  const fontSize = isMini ? '9' : '13';
  const width = isMini ? 70 : (isEditor ? '100%' : 360);
  const height = isMini ? 50 : (isEditor ? '100%' : 220);
  const viewBox = `0 0 460 280`;

  const lA = escapeHtml(state.labels?.a || '');
  const lB = escapeHtml(state.labels?.b || '');
  const lC = escapeHtml(state.labels?.c || '');
  const lH = escapeHtml(state.labels?.h || '');
  const lAng = escapeHtml(state.labels?.angle || '');
  const vertsInput = (state.labels?.vertices || '').split(',').map(v => v.trim());

  // 1. Defs: Kətan toru və ox başlıqları
  let defsMarkup = '';
  if (isEditor) {
    defsMarkup = `
      <defs>
        <pattern id="studioGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
          <circle cx="20" cy="20" r="0.8" fill="#cbd5e1"/>
        </pattern>
        <marker id="arrowHead" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="${color}"/>
        </marker>
        <marker id="arrowHeadRed" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="#dc2626"/>
        </marker>
        <marker id="arrowHeadBlue" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="#2563eb"/>
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="url(#studioGrid)"/>
    `;
  } else {
    defsMarkup = `
      <defs>
        <marker id="arrowHead" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="${color}"/>
        </marker>
      </defs>
    `;
  }

  // 2. Baza Fiquru (Çoxbucaqlı / Çevrə / Oxlar)
  let baseShapeMarkup = '';
  if (state.circle) {
    const c = state.circle;
    baseShapeMarkup = `
      <circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${dashArray}"/>
      <circle cx="${c.cx}" cy="${c.cy}" r="3" fill="${color}"/>
      <text x="${c.cx + 7}" y="${c.cy - 7}" font-family="sans-serif" font-size="12" font-weight="700" fill="${color}">O</text>
    `;
    if (isEditor) {
      baseShapeMarkup += `
        <circle cx="${c.cx}" cy="${c.cy}" r="7" class="canvas-handle vertex-handle" data-drag-type="circle-center" title="Mərkəz O: Tutub çevrənin yerini dəyişin"/>
        <circle cx="${c.cx + c.r}" cy="${c.cy}" r="7" class="canvas-handle line-handle" data-drag-type="circle-radius" title="Radius: Tutub çevrəni böyüdün və ya kiçildin"/>
      `;
    }
  } else if (state.axes) {
    baseShapeMarkup = `
      <line x1="40" y1="140" x2="420" y2="140" stroke="${color}" stroke-width="1.8"/>
      <polygon points="415,136 422,140 415,144" fill="${color}"/>
      <line x1="230" y1="260" x2="230" y2="20" stroke="${color}" stroke-width="1.8"/>
      <polygon points="226,25 230,18 234,25" fill="${color}"/>
      <text x="415" y="158" font-family="sans-serif" font-size="12" font-weight="700">x</text>
      <text x="215" y="25" font-family="sans-serif" font-size="12" font-weight="700">y</text>
      <text x="218" y="154" font-family="sans-serif" font-size="11">0</text>
    `;
  } else if (state.vertices && state.vertices.length > 0) {
    const pts = state.vertices.map(v => `${Math.round(v.x)},${Math.round(v.y)}`).join(' ');
    baseShapeMarkup = `
      <polygon points="${pts}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${dashArray}" stroke-linejoin="round"/>
    `;
  }

  // 3. Əlavə Xətlər (Müəllimin çəkdiyi çubuqlar, hündürlüklər, medianlar)
  let linesMarkup = '';
  (state.lines || []).forEach(l => {
    const lColor = l.color || '#dc2626';
    const lWidth = isMini ? '1.5' : (l.width || '2');
    const lDash = l.style === 'dashed' ? '5,4' : (l.style === 'dotted' ? '2,4' : 'none');
    const isSelected = (isEditor && studioState.selectedElementId === l.id);
    let markerAttr = '';
    if (l.isArrow) {
      markerAttr = lColor === '#dc2626' ? 'marker-end="url(#arrowHeadRed)"' : (lColor === '#2563eb' ? 'marker-end="url(#arrowHeadBlue)"' : 'marker-end="url(#arrowHead)"');
    }

    linesMarkup += `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${lColor}" stroke-width="${lWidth}" stroke-dasharray="${lDash}" stroke-linecap="round" ${markerAttr}/>`;

    if (isEditor) {
      // Qalın toxunma zonası (rahat tutmaq üçün) və uclardakı tutacaqlar
      linesMarkup += `
        <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${isSelected ? 'rgba(37,99,235,0.25)' : 'transparent'}" stroke-width="${isSelected ? 12 : 9}" class="canvas-line-interactive" data-drag-type="line-body" data-drag-id="${l.id}" title="Xətti tutub bütöv hərəkət etdirin"/>
        <circle cx="${l.x1}" cy="${l.y1}" r="${isSelected ? 7.5 : 6}" class="canvas-handle line-handle" data-drag-type="line-p1" data-drag-id="${l.id}" title="Başlanğıc: Dartıb uzadın və əyin"/>
        <circle cx="${l.x2}" cy="${l.y2}" r="${isSelected ? 7.5 : 6}" class="canvas-handle line-handle" data-drag-type="line-p2" data-drag-id="${l.id}" title="Son: Dartıb uzadın və əyin"/>
      `;
    }
  });

  // 4. Düz Bucaq Nişanları (90°)
  let rightAnglesMarkup = '';
  (state.rightAngles || []).forEach(ra => {
    const sz = ra.size || 20;
    const isSelected = (isEditor && studioState.selectedElementId === ra.id);
    rightAnglesMarkup += `
      <polyline points="${ra.x},${ra.y - sz} ${ra.x + sz},${ra.y - sz} ${ra.x + sz},${ra.y}" fill="none" stroke="${color}" stroke-width="1.6"/>
      <circle cx="${ra.x + sz/2}" cy="${ra.y - sz/2}" r="1.5" fill="${color}"/>
    `;
    if (isEditor) {
      rightAnglesMarkup += `
        <circle cx="${ra.x + sz/2}" cy="${ra.y - sz/2}" r="${isSelected ? 8 : 6}" class="canvas-handle line-handle" data-drag-type="right-angle" data-drag-id="${ra.id}" title="90° bucaq: Təpəyə aparın"/>
      `;
    }
  });

  // 5. Müəllimin Əlavə Etdiyi Sərbəst Yazılar / Text Bar
  let textsMarkup = '';
  (state.texts || []).forEach(t => {
    const isSelected = (isEditor && (studioState.selectedElementId === t.id || state.texts.length === 1));
    const tColor = t.color || '#000000';
    const fSize = isMini ? 9 : (t.fontSize || 16);

    if (isEditor) {
      // Bounding box for the Text Bar
      const charWidth = fSize * 0.62;
      const textLen = (t.text || '').length;
      const boxW = Math.max(60, Math.round(textLen * charWidth + 24));
      const boxH = Math.round(fSize * 1.5 + 8);
      const boxX = Math.round(t.x - 12);
      const boxY = Math.round(t.y - fSize - 2);

      textsMarkup += `
        <!-- Text Bar Box (Ortasından tutub basılı saxlayaraq istənilən yerə sürüşdürün) -->
        <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="5" ry="5" fill="${isSelected ? '#ffffff' : 'rgba(255,255,255,0.9)'}" stroke="${isSelected ? '#2563eb' : '#94a3b8'}" stroke-width="${isSelected ? '2' : '1.5'}" stroke-dasharray="${isSelected ? '4,3' : 'none'}" class="canvas-text-box-body" data-drag-type="text-box-body" data-drag-id="${t.id}" title="Ortasından tutub basılı saxlayaraq istədiyiniz yerə sürüşdürün (İki dəfə klikləyib redaktə edin)"/>
        
        <!-- Mətn -->
        <text x="${t.x}" y="${t.y}" fill="${tColor}" font-family="'STIX Two Text', serif" font-size="${fSize}" font-weight="700" pointer-events="none">${escapeHtml(t.text)}</text>
        
        <!-- 4 Künc Tutacaqları (Ölçünü böyüdüb-kiçiltmək üçün) -->
        <circle cx="${boxX}" cy="${boxY}" r="5.5" class="canvas-handle text-corner-handle" data-drag-type="text-resize" data-drag-id="${t.id}" data-corner="tl" title="Küncdən tutub ölçünü dəyişin"/>
        <circle cx="${boxX + boxW}" cy="${boxY}" r="5.5" class="canvas-handle text-corner-handle" data-drag-type="text-resize" data-drag-id="${t.id}" data-corner="tr" title="Küncdən tutub ölçünü dəyişin"/>
        <circle cx="${boxX + boxW}" cy="${boxY + boxH}" r="5.5" class="canvas-handle text-corner-handle" data-drag-type="text-resize" data-drag-id="${t.id}" data-corner="br" title="Küncdən tutub ölçünü dəyişin"/>
        <circle cx="${boxX}" cy="${boxY + boxH}" r="5.5" class="canvas-handle text-corner-handle" data-drag-type="text-resize" data-drag-id="${t.id}" data-corner="bl" title="Küncdən tutub ölçünü dəyişin"/>
        
        <!-- Sil düyməsi (Qırmızı 'x' işarəsi) -->
        <circle cx="${boxX + boxW + 6}" cy="${boxY - 4}" r="6.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" class="text-del-btn" data-action="delete-text" data-drag-id="${t.id}" title="Bu mətni sil"/>
        <text x="${boxX + boxW + 6}" y="${boxY - 1}" font-size="9" fill="#ffffff" font-family="sans-serif" font-weight="800" text-anchor="middle" pointer-events="none">&times;</text>
      `;
    } else {
      // Rəsmi DİM test vərəqində təmiz vektor mətni
      textsMarkup += `
        <text x="${t.x}" y="${t.y}" fill="${tColor}" font-family="'STIX Two Text', serif" font-size="${fSize}" font-weight="700">${escapeHtml(t.text)}</text>
      `;
    }
  });

  // 6. Təpə Nöqtələri Tutacaqları (YALNIZ Redaktorda Görünür!)
  let vertexHandlesMarkup = '';
  if (isEditor && state.vertices && state.vertices.length > 0) {
    state.vertices.forEach((v, idx) => {
      const vLabel = (vertsInput[idx] !== undefined && vertsInput[idx] !== '') ? vertsInput[idx] : (v.label || (idx === 0 ? 'A' : (idx === 1 ? 'B' : (idx === 2 ? 'C' : 'D'))));
      vertexHandlesMarkup += `
        <circle cx="${v.x}" cy="${v.y}" r="8" class="canvas-handle vertex-handle" data-drag-type="vertex" data-drag-index="${idx}" title="Təpə ${vLabel}: Tutub dartın və formanı dəyişin"/>
        <text x="${v.x + 10}" y="${v.y - 8}" font-family="sans-serif" font-size="11" font-weight="800" fill="#1d4ed8" pointer-events="none">${vLabel}</text>
      `;
    });
  } else if (!isEditor && state.vertices && state.vertices.length > 0 && !isMini) {
    // Rəsmi test vərəqində təpə hərflərini zərif göstər
    state.vertices.forEach((v, idx) => {
      const vLabel = (vertsInput[idx] !== undefined && vertsInput[idx] !== '') ? vertsInput[idx] : (v.label || (idx === 0 ? 'A' : (idx === 1 ? 'B' : (idx === 2 ? 'C' : 'D'))));
      const offX = v.x < 230 ? -16 : 8;
      const offY = v.y < 140 ? -8 : 16;
      vertexHandlesMarkup += `<text x="${v.x + offX}" y="${v.y + offY}" font-family="sans-serif" font-size="12" font-weight="700" fill="#000000">${vLabel}</text>`;
    });
  }

  // 7. Yan Paneldən Yazılmış Ölçülər (a, b, c, h, α)
  let sidebarLabelsMarkup = '';
  if (state.vertices && state.vertices.length >= 3) {
    const v1 = state.vertices[0];
    const v2 = state.vertices[1];
    const v3 = state.vertices[2];

    if (lA) {
      const mx = Math.round((v1.x + v3.x) / 2) - 20;
      const my = Math.round((v1.y + v3.y) / 2);
      sidebarLabelsMarkup += `<text x="${mx}" y="${my}" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700">${lA}</text>`;
    }
    if (lB) {
      const mx = Math.round((v1.x + v2.x) / 2);
      const my = Math.round((v1.y + v2.y) / 2) + 18;
      sidebarLabelsMarkup += `<text x="${mx}" y="${my}" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700">${lB}</text>`;
    }
    if (lC) {
      const mx = Math.round((v2.x + v3.x) / 2) + 14;
      const my = Math.round((v2.y + v3.y) / 2);
      sidebarLabelsMarkup += `<text x="${mx}" y="${my}" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#dc2626">${lC}</text>`;
    }
    if (lH) {
      sidebarLabelsMarkup += `<text x="${Math.round(v3.x + 8)}" y="${Math.round(v3.y + 40)}" font-family="'STIX Two Text', serif" font-size="${fontSize}" font-weight="700" fill="#dc2626">${lH}</text>`;
    }
    if (lAng) {
      sidebarLabelsMarkup += `<text x="${Math.round(v2.x - 30)}" y="${Math.round(v2.y - 10)}" font-family="'STIX Two Text', serif" font-size="${fontSize}">${lAng}</text>`;
    }
  }

  return `
    <svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="${isEditor ? 'interactive-studio-svg' : 'static-dim-svg'}">
      ${defsMarkup}
      ${baseShapeMarkup}
      ${rightAnglesMarkup}
      ${linesMarkup}
      ${textsMarkup}
      ${sidebarLabelsMarkup}
      ${vertexHandlesMarkup}
    </svg>
  `;
}

// Update the Studio Canvas Preview
function updateStudioCanvasPreview() {
  const container = document.getElementById('studioSvgCanvasContainer');
  if (!container) return;
  container.innerHTML = renderStudioSvg(studioState, false, true);
}

// Open Shape Studio Modal
function openShapeStudio() {
  const modal = document.getElementById('shapeStudioModal');
  if (modal) modal.classList.remove('hidden');
  if (!studioState.vertices || studioState.vertices.length === 0) {
    initStudioShape(studioState.baseShape || 'empty_right_triangle', false);
  }

  // Sync controls with studioState
  const baseSelect = document.getElementById('studioBaseShapeSelect');
  if (baseSelect && studioState.baseShape) {
    baseSelect.value = studioState.baseShape;
  }
  const styleSelect = document.getElementById('studioLineStyleSelect');
  if (styleSelect && studioState.lineStyle) {
    styleSelect.value = studioState.lineStyle;
  }
  const widthSelect = document.getElementById('studioLineWidthSelect');
  if (widthSelect && studioState.lineWidth) {
    widthSelect.value = studioState.lineWidth;
  }

  // Sync colors
  document.querySelectorAll('.color-circle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-color') === (studioState.color || '#000000'));
  });

  // Sync inputs
  const lbls = studioState.labels || {};
  const inA = document.getElementById('studioInputA');
  if (inA) inA.value = lbls.a || '';
  const inB = document.getElementById('studioInputB');
  if (inB) inB.value = lbls.b || '';
  const inC = document.getElementById('studioInputC');
  if (inC) inC.value = lbls.c || '';
  const inAng = document.getElementById('studioInputAngle');
  if (inAng) inAng.value = lbls.angle || '';
  const inVert = document.getElementById('studioInputVertices');
  if (inVert) inVert.value = lbls.vertices || 'A, B, C';

  const tbInput = document.getElementById('studioTextBarInput');
  if (tbInput) {
    if (studioState.selectedElementId && studioState.selectedElementType === 'text') {
      const selTxt = studioState.texts.find(t => t.id === studioState.selectedElementId);
      tbInput.value = selTxt ? selTxt.text : '';
    } else if (studioState.texts && studioState.texts.length > 0) {
      tbInput.value = studioState.texts[studioState.texts.length - 1].text;
    } else {
      tbInput.value = '';
    }
  }

  setActivePaintTool('select');
  updateStudioCanvasPreview();
}

// Close Shape Studio Modal
function closeShapeStudio() {
  const modal = document.getElementById('shapeStudioModal');
  if (modal) modal.classList.add('hidden');
}

// Set quick input in Studio
window.setStudioInput = function(inputId, val) {
  const el = document.getElementById(inputId);
  if (el) {
    el.value = val;
    el.dispatchEvent(new Event('input'));
    el.focus();
  }
};

// Append unit in Studio
window.appendStudioUnit = function(unit) {
  const targetId = lastFocusedStudioInputId || 'studioInputC';
  const el = document.getElementById(targetId);
  if (el) {
    if (unit === '?') {
      el.value = el.value ? `${el.value} = ?` : '?';
    } else if (unit === '√') {
      el.value = `√(${el.value || 'x'})`;
    } else {
      el.value = `${el.value} ${unit}`.trim();
    }
    el.dispatchEvent(new Event('input'));
    el.focus();
  }
};

// Apply Studio Shape to the Question Form
function applyStudioShape() {
  attachedFigureData = JSON.parse(JSON.stringify(studioState));
  closeShapeStudio();

  // Update UI on question form
  const notAtt = document.getElementById('figureNotAttachedView');
  const attBar = document.getElementById('figureAttachedView');
  const thumb = document.getElementById('attachedFigureThumb');

  if (notAtt) notAtt.classList.add('hidden');
  if (attBar) attBar.classList.remove('hidden');
  if (thumb) {
    thumb.innerHTML = renderStudioSvg(attachedFigureData, true, false);
  }

  showToast('✓ Həndəsi fiqur suala əlavə olundu!');
}

// Remove attached figure
function removeAttachedFigure() {
  attachedFigureData = null;
  const notAtt = document.getElementById('figureNotAttachedView');
  const attBar = document.getElementById('figureAttachedView');

  if (notAtt) notAtt.classList.remove('hidden');
  if (attBar) attBar.classList.add('hidden');
  showToast('Fiqur sualdan silindi');
}

// Reset Studio Shape
function resetStudioShape() {
  initStudioShape(studioState.baseShape || 'empty_right_triangle', false);
  studioState.labels = { a: '', b: '', c: '', angle: '', vertices: 'A, B, C' };

  // Reset inputs
  ['studioInputA', 'studioInputB', 'studioInputC', 'studioInputAngle'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const tbInput = document.getElementById('studioTextBarInput');
  if (tbInput) tbInput.value = '';
  const vEl = document.getElementById('studioInputVertices');
  if (vEl) vEl.value = 'A, B, C';

  setActivePaintTool('select');
  updateStudioCanvasPreview();
  showToast('Fiqur sıfırlandı');
}

// ==========================================================================
// PAİNT ALƏTLƏRİ VƏ İNTERAKTİV HƏNDƏSƏ ƏMƏLİYYATLARI
// ==========================================================================

function setActivePaintTool(tool) {
  studioState.activeTool = tool;
  document.querySelectorAll('.ribbon-tool-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-paint-tool') === tool);
  });
}

// Sərbəst xətt (çubuq) əlavə et
function addNewLine(isArrow = false) {
  const newLine = {
    id: 'line_' + Date.now(),
    x1: 170,
    y1: 85,
    x2: 280,
    y2: 215,
    color: studioState.color || '#dc2626',
    style: studioState.lineStyle || 'solid',
    width: studioState.lineWidth || '2',
    isArrow: isArrow
  };
  studioState.lines.push(newLine);
  studioState.selectedElementId = newLine.id;
  studioState.selectedElementType = 'line';
  setActivePaintTool('select');
  updateStudioCanvasPreview();
  showToast(isArrow ? '🏹 Ox əlavə olundu - uclarından tutub uzadın və əyin' : '📏 Xətt əlavə olundu - uclarından tutub uzadın və əyin');
}

// 90° düz bucaq nişanı əlavə et
function addNewRightAngle() {
  const newRa = {
    id: 'ra_' + Date.now(),
    x: 180,
    y: 190,
    size: 20
  };
  studioState.rightAngles.push(newRa);
  studioState.selectedElementId = newRa.id;
  studioState.selectedElementType = 'right_angle';
  setActivePaintTool('select');
  updateStudioCanvasPreview();
  showToast('📐 90° düz bucaq nişanı əlavə olundu - təpəyə yerləşdirin');
}

// Sərbəst Mətn / Yazı Qutusu (Text Bar) əlavə et
function addTextBarToCanvas(defaultText) {
  const input = document.getElementById('studioTextBarInput');
  const txtVal = defaultText || (input ? input.value.trim() : '') || 'h = ?';
  const newText = {
    id: 'txt_' + Date.now(),
    text: txtVal,
    x: 210,
    y: 135,
    color: studioState.color || '#000000',
    fontSize: 16
  };
  studioState.texts.push(newText);
  studioState.selectedElementId = newText.id;
  studioState.selectedElementType = 'text';
  if (input) input.value = txtVal;
  setActivePaintTool('select');
  updateStudioCanvasPreview();
  showToast('✓ Mətn qutusu kətana əlavə olundu - ortasından tutub istədiyiniz yerə sürüşdürün');
}

// Sürətli etiketlər (h = ?, m = ?, S = ? və s.)
window.setTextBarValue = function(val) {
  const input = document.getElementById('studioTextBarInput');
  if (input) input.value = val;
  if (studioState.selectedElementId && studioState.selectedElementType === 'text') {
    const t = studioState.texts.find(item => item.id === studioState.selectedElementId);
    if (t) {
      t.text = val;
      updateStudioCanvasPreview();
      return;
    }
  }
  addTextBarToCanvas(val);
};

// Ribbon düyməsi ilə mətn əlavə et
function addNewTextPrompt() {
  const input = document.getElementById('studioTextBarInput');
  const defaultVal = input && input.value.trim() ? input.value.trim() : 'h = ?';
  const txt = prompt('Fiqur üzərinə yazmaq istədiyiniz ölçü və ya mətni daxil edin:\n(Məsələn: h = ?, 6 sm, α, 30°, MN)', defaultVal);
  if (txt && txt.trim()) {
    addTextBarToCanvas(txt.trim());
  }
}

// Seçilmiş xətti və ya elementi sil
function deleteSelectedStudioElement() {
  if (!studioState.selectedElementId) {
    showToast('Zəhmət olmasa silmək üçün xətti və ya elementi seçin');
    return;
  }
  const id = studioState.selectedElementId;
  studioState.lines = studioState.lines.filter(l => l.id !== id);
  studioState.rightAngles = studioState.rightAngles.filter(ra => ra.id !== id);
  studioState.texts = studioState.texts.filter(t => t.id !== id);
  studioState.selectedElementId = null;
  studioState.selectedElementType = null;
  updateStudioCanvasPreview();
  showToast('Element silindi');
}

// Bütün əlavə xətləri və elementləri təmizlə
function clearAllStudioCustomElements() {
  if (confirm('Bütün əlavə edilmiş xətlər, bucaqlar və yazılar silinsin? Baza fiquru qalacaq.')) {
    studioState.lines = [];
    studioState.rightAngles = [];
    studioState.texts = [];
    studioState.selectedElementId = null;
    studioState.selectedElementType = null;
    updateStudioCanvasPreview();
    showToast('Kətan təmizləndi');
  }
}

// Rəng dəyişimi
function setStudioColor(newColor) {
  studioState.color = newColor;
  if (studioState.selectedElementId) {
    const line = studioState.lines.find(l => l.id === studioState.selectedElementId);
    if (line) line.color = newColor;
    const txt = studioState.texts.find(t => t.id === studioState.selectedElementId);
    if (txt) txt.color = newColor;
  }
  updateStudioCanvasPreview();
}

// Xətt növü dəyişimi
function setStudioLineStyle(newStyle) {
  studioState.lineStyle = newStyle;
  if (studioState.selectedElementId) {
    const line = studioState.lines.find(l => l.id === studioState.selectedElementId);
    if (line) line.style = newStyle;
  }
  updateStudioCanvasPreview();
}

// Xətt qalınlığı dəyişimi
function setStudioLineWidth(newWidth) {
  studioState.lineWidth = newWidth;
  if (studioState.selectedElementId) {
    const line = studioState.lines.find(l => l.id === studioState.selectedElementId);
    if (line) line.width = newWidth;
  }
  updateStudioCanvasPreview();
}

// ==========================================================================
// KƏTAN ÜZƏRİNDƏ SİÇAN VƏ TOXUNMA İLƏ TUTUB DARTMA (DRAG & DROP)
// ==========================================================================

let studioDragTarget = null;
let studioDragStartPoint = null;
let studioDragInitialData = null;

function getSvgCanvasPoint(e, svgEl) {
  const rect = svgEl.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const x = (clientX - rect.left) * (460 / rect.width);
  const y = (clientY - rect.top) * (280 / rect.height);
  return {
    x: Math.round(Math.max(10, Math.min(450, x))),
    y: Math.round(Math.max(10, Math.min(270, y)))
  };
}

function onCanvasPointerDown(e) {
  const container = document.getElementById('studioSvgCanvasContainer');
  const svgEl = container ? container.querySelector('svg') : null;
  if (!svgEl) return;

  const target = e.target;

  // 1. Text Box Silmə ('x' düyməsi)
  const delBtn = target.closest ? (target.dataset.action === 'delete-text' ? target : target.closest('[data-action="delete-text"]')) : null;
  if (delBtn) {
    e.stopPropagation();
    e.preventDefault();
    const id = delBtn.dataset.dragId;
    studioState.texts = studioState.texts.filter(t => t.id !== id);
    if (studioState.selectedElementId === id) {
      studioState.selectedElementId = null;
      studioState.selectedElementType = null;
      const tbInput = document.getElementById('studioTextBarInput');
      if (tbInput) tbInput.value = '';
    }
    updateStudioCanvasPreview();
    showToast('Mətn qutusu silindi');
    return;
  }

  const pt = getSvgCanvasPoint(e, svgEl);
  const dragType = target.dataset.dragType;

  if (dragType) {
    e.stopPropagation();
    e.preventDefault();
    studioDragStartPoint = pt;

    if (dragType === 'vertex') {
      const idx = parseInt(target.dataset.dragIndex, 10);
      studioDragTarget = { type: 'vertex', index: idx };
    } else if (dragType === 'circle-center') {
      studioDragTarget = { type: 'circle-center' };
    } else if (dragType === 'circle-radius') {
      studioDragTarget = { type: 'circle-radius' };
    } else if (dragType === 'line-p1') {
      const id = target.dataset.dragId;
      studioState.selectedElementId = id;
      studioState.selectedElementType = 'line';
      studioDragTarget = { type: 'line-p1', id };
    } else if (dragType === 'line-p2') {
      const id = target.dataset.dragId;
      studioState.selectedElementId = id;
      studioState.selectedElementType = 'line';
      studioDragTarget = { type: 'line-p2', id };
    } else if (dragType === 'line-body') {
      const id = target.dataset.dragId;
      const line = studioState.lines.find(l => l.id === id);
      if (line) {
        studioState.selectedElementId = id;
        studioState.selectedElementType = 'line';
        studioDragTarget = {
          type: 'line-body',
          id,
          p1: { x: line.x1, y: line.y1 },
          p2: { x: line.x2, y: line.y2 }
        };
      }
    } else if (dragType === 'right-angle') {
      const id = target.dataset.dragId;
      const ra = studioState.rightAngles.find(r => r.id === id);
      if (ra) {
        studioState.selectedElementId = id;
        studioState.selectedElementType = 'right_angle';
        studioDragTarget = { type: 'right-angle', id, orig: { x: ra.x, y: ra.y } };
      }
    } else if (dragType === 'text-box-body' || dragType === 'text') {
      const id = target.dataset.dragId;
      const txt = studioState.texts.find(t => t.id === id);
      if (txt) {
        studioState.selectedElementId = id;
        studioState.selectedElementType = 'text';
        studioDragTarget = { type: 'text-box-body', id, origX: txt.x, origY: txt.y };
        const tbInput = document.getElementById('studioTextBarInput');
        if (tbInput) tbInput.value = txt.text || '';

        // İki dəfə ardıcıl klikləyəndə birbaşa redaktə et
        const now = Date.now();
        if (txt._lastClick && (now - txt._lastClick < 350)) {
          const edited = prompt('Mətni redaktə edin:', txt.text);
          if (edited !== null && edited.trim()) {
            txt.text = edited.trim();
            if (tbInput) tbInput.value = edited.trim();
            updateStudioCanvasPreview();
          }
          return;
        }
        txt._lastClick = now;
      }
    } else if (dragType === 'text-resize') {
      const id = target.dataset.dragId;
      const corner = target.dataset.corner;
      const txt = studioState.texts.find(t => t.id === id);
      if (txt) {
        studioState.selectedElementId = id;
        studioState.selectedElementType = 'text';
        studioDragTarget = { type: 'text-resize', id, corner, origFontSize: txt.fontSize || 16 };
        const tbInput = document.getElementById('studioTextBarInput');
        if (tbInput) tbInput.value = txt.text || '';
      }
    }

    target.classList.add('active-drag');
    updateStudioCanvasPreview();
  } else {
    // Kətana boş yerdə klikləyəndə: Alətə uyğun yeni element yarat
    if (studioState.activeTool === 'line' || studioState.activeTool === 'arrow') {
      const isArrow = (studioState.activeTool === 'arrow');
      const newLine = {
        id: 'line_' + Date.now(),
        x1: pt.x,
        y1: pt.y,
        x2: Math.min(450, pt.x + 80),
        y2: pt.y,
        color: studioState.color || '#dc2626',
        style: studioState.lineStyle || 'solid',
        width: studioState.lineWidth || '2',
        isArrow: isArrow
      };
      studioState.lines.push(newLine);
      studioState.selectedElementId = newLine.id;
      studioState.selectedElementType = 'line';
      studioDragTarget = { type: 'line-p2', id: newLine.id };
      studioDragStartPoint = pt;
      setActivePaintTool('select');
      updateStudioCanvasPreview();
    } else if (studioState.activeTool === 'right_angle') {
      const newRa = {
        id: 'ra_' + Date.now(),
        x: pt.x,
        y: pt.y,
        size: 20
      };
      studioState.rightAngles.push(newRa);
      studioState.selectedElementId = newRa.id;
      studioState.selectedElementType = 'right_angle';
      setActivePaintTool('select');
      updateStudioCanvasPreview();
    } else if (studioState.activeTool === 'text') {
      const tbIn = document.getElementById('studioTextBarInput');
      const defVal = (tbIn && tbIn.value.trim()) ? tbIn.value.trim() : 'h = ?';
      const txt = prompt('Yazını daxil edin:', defVal);
      if (txt && txt.trim()) {
        const newText = {
          id: 'txt_' + Date.now(),
          text: txt.trim(),
          x: pt.x,
          y: pt.y,
          color: studioState.color || '#000000',
          fontSize: 16
        };
        studioState.texts.push(newText);
        studioState.selectedElementId = newText.id;
        studioState.selectedElementType = 'text';
        if (tbIn) tbIn.value = txt.trim();
        setActivePaintTool('select');
        updateStudioCanvasPreview();
      }
    } else {
      studioState.selectedElementId = null;
      studioState.selectedElementType = null;
      updateStudioCanvasPreview();
    }
  }
}

function onCanvasPointerMove(e) {
  if (!studioDragTarget) return;

  const container = document.getElementById('studioSvgCanvasContainer');
  const svgEl = container ? container.querySelector('svg') : null;
  if (!svgEl) return;

  const pt = getSvgCanvasPoint(e, svgEl);
  const dx = pt.x - studioDragStartPoint.x;
  const dy = pt.y - studioDragStartPoint.y;

  if (studioDragTarget.type === 'vertex') {
    const v = studioState.vertices[studioDragTarget.index];
    if (v) {
      v.x = pt.x;
      v.y = pt.y;
    }
  } else if (studioDragTarget.type === 'circle-center') {
    if (studioState.circle) {
      studioState.circle.cx = pt.x;
      studioState.circle.cy = pt.y;
    }
  } else if (studioDragTarget.type === 'circle-radius') {
    if (studioState.circle) {
      const cdx = pt.x - studioState.circle.cx;
      const cdy = pt.y - studioState.circle.cy;
      studioState.circle.r = Math.max(15, Math.round(Math.sqrt(cdx * cdx + cdy * cdy)));
    }
  } else if (studioDragTarget.type === 'line-p1') {
    const line = studioState.lines.find(l => l.id === studioDragTarget.id);
    if (line) {
      line.x1 = pt.x;
      line.y1 = pt.y;
    }
  } else if (studioDragTarget.type === 'line-p2') {
    const line = studioState.lines.find(l => l.id === studioDragTarget.id);
    if (line) {
      line.x2 = pt.x;
      line.y2 = pt.y;
    }
  } else if (studioDragTarget.type === 'line-body') {
    const line = studioState.lines.find(l => l.id === studioDragTarget.id);
    if (line && studioDragTarget.p1 && studioDragTarget.p2) {
      line.x1 = Math.round(Math.max(10, Math.min(450, studioDragTarget.p1.x + dx)));
      line.y1 = Math.round(Math.max(10, Math.min(270, studioDragTarget.p1.y + dy)));
      line.x2 = Math.round(Math.max(10, Math.min(450, studioDragTarget.p2.x + dx)));
      line.y2 = Math.round(Math.max(10, Math.min(270, studioDragTarget.p2.y + dy)));
    }
  } else if (studioDragTarget.type === 'right-angle') {
    const ra = studioState.rightAngles.find(r => r.id === studioDragTarget.id);
    if (ra && studioDragTarget.orig) {
      ra.x = Math.round(Math.max(10, Math.min(430, studioDragTarget.orig.x + dx)));
      ra.y = Math.round(Math.max(30, Math.min(270, studioDragTarget.orig.y + dy)));
    }
  } else if (studioDragTarget.type === 'text-box-body') {
    const txt = studioState.texts.find(t => t.id === studioDragTarget.id);
    if (txt) {
      txt.x = Math.round(Math.max(15, Math.min(435, studioDragTarget.origX + dx)));
      txt.y = Math.round(Math.max(25, Math.min(265, studioDragTarget.origY + dy)));
    }
  } else if (studioDragTarget.type === 'text-resize') {
    const txt = studioState.texts.find(t => t.id === studioDragTarget.id);
    if (txt) {
      const corner = studioDragTarget.corner;
      let delta = 0;
      if (corner === 'br') delta = (dx + dy) / 2;
      else if (corner === 'tr') delta = (dx - dy) / 2;
      else if (corner === 'bl') delta = (-dx + dy) / 2;
      else if (corner === 'tl') delta = (-dx - dy) / 2;
      const newSize = Math.max(10, Math.min(38, Math.round(studioDragTarget.origFontSize + delta * 0.2)));
      txt.fontSize = newSize;
    }
  }

  updateStudioCanvasPreview();
}

function onCanvasPointerUp(e) {
  if (studioDragTarget) {
    studioDragTarget = null;
    updateStudioCanvasPreview();
  }
}

function setupStudioCanvasEvents() {
  const container = document.getElementById('studioSvgCanvasContainer');
  if (!container) return;

  container.addEventListener('mousedown', onCanvasPointerDown);
  container.addEventListener('touchstart', onCanvasPointerDown, { passive: false });

  window.addEventListener('mousemove', onCanvasPointerMove);
  window.addEventListener('touchmove', onCanvasPointerMove, { passive: false });

  window.addEventListener('mouseup', onCanvasPointerUp);
  window.addEventListener('touchend', onCanvasPointerUp);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        deleteSelectedStudioElement();
      }
    }
  });
}

// ==========================================================================
// 3. RENDER EXAM BOOKLET & QUESTION FLOW
// ==========================================================================
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

    // Render Geometry figure IF present
    let figureHtml = '';
    if (q.figure) {
      const svg = renderStudioSvg(q.figure, false, false);
      figureHtml = `<div class="dim-q-figure">${svg}</div>`;
    }

    // Question body based on type
    if (q.type === 'qapali') {
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
    if (q.type === 'aciq') typeName = 'Açıq (Kodlaşdırılan)';
    if (q.type === 'yazili') typeName = 'Yazılı Həlli Tələb Olunan';
    if (q.type === 'uygunluq') typeName = 'Uyğunlaşdırma';
    if (q.type === 'situasiya') typeName = 'Situasiya';

    const hasFig = q.figure ? ' (Fiqurlu)' : '';

    return `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>${typeName}${hasFig}</td>
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
  } else if (type === 'aciq') {
    if (openGroup) openGroup.classList.remove('hidden');
  } else if (type === 'yazili') {
    if (writtenGroup) writtenGroup.classList.remove('hidden');
  } else if (type === 'uygunluq') {
    if (matchGroup) matchGroup.classList.remove('hidden');
  } else if (type === 'situasiya') {
    if (situationGroup) situationGroup.classList.remove('hidden');
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
    text,
    figure: attachedFigureData ? JSON.parse(JSON.stringify(attachedFigureData)) : null
  };

  if (activeType === 'qapali') {
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
  attachedFigureData = null;

  const notAtt = document.getElementById('figureNotAttachedView');
  const attBar = document.getElementById('figureAttachedView');
  if (notAtt) notAtt.classList.remove('hidden');
  if (attBar) attBar.classList.add('hidden');

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

  // Restore attached figure
  if (q.figure) {
    attachedFigureData = JSON.parse(JSON.stringify(q.figure));
    studioState = JSON.parse(JSON.stringify(q.figure));
    if ((!studioState.vertices || studioState.vertices.length === 0) && !studioState.circle && !studioState.axes) {
      initStudioShape(studioState.baseShape || 'empty_right_triangle', true);
    }
    const notAtt = document.getElementById('figureNotAttachedView');
    const attBar = document.getElementById('figureAttachedView');
    const thumb = document.getElementById('attachedFigureThumb');
    if (notAtt) notAtt.classList.add('hidden');
    if (attBar) attBar.classList.remove('hidden');
    if (thumb) thumb.innerHTML = renderStudioSvg(attachedFigureData, true, false);
  } else {
    attachedFigureData = null;
    const notAtt = document.getElementById('figureNotAttachedView');
    const attBar = document.getElementById('figureAttachedView');
    if (notAtt) notAtt.classList.remove('hidden');
    if (attBar) attBar.classList.add('hidden');
  }

  if (q.type === 'qapali') {
    const opts = q.options || {};
    document.getElementById('optA').value = opts.A || '';
    document.getElementById('optB').value = opts.B || '';
    document.getElementById('optC').value = opts.C || '';
    document.getElementById('optD').value = opts.D || '';
    document.getElementById('optE').value = opts.E || '';

    const radio = document.querySelector(`input[name="correctOption"][value="${q.correctAnswer}"]`);
    if (radio) radio.checked = true;
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
// 4. DOWNLOAD MÜHƏRRİKİ (PDF və Word .doc Formatları)
// ==========================================================================
function openDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.classList.remove('hidden');
}

function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.classList.add('hidden');
}

// PDF Yükləmə (Print-to-PDF)
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

    if (q.figure) {
      bodyHtml += `<div style="text-align: center; margin: 10px 0;">${renderStudioSvg(q.figure, false, false)}</div>`;
    }

    if (q.type === 'qapali') {
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

  // Fənn və Sinif seçimi
  const subjSelect = document.getElementById('subjectSelect');
  const gradeSelect = document.getElementById('gradeSelect');

  if (subjSelect) {
    subjSelect.value = currentExam.subject || 'Riyaziyyat';
    subjSelect.addEventListener('change', (e) => {
      currentExam.subject = e.target.value;
      saveStorage();
      updateMathToolbarVisibility(); // Math toolbar ONLY for Riyaziyyat/Fizika
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

  // Initial check for Math symbols toolbar visibility
  updateMathToolbarVisibility();

  // Shape Studio Modal Open / Close
  const openStudioBtn = document.getElementById('openShapeStudioBtn');
  if (openStudioBtn) openStudioBtn.addEventListener('click', openShapeStudio);

  const editFigBtn = document.getElementById('editAttachedFigureBtn');
  if (editFigBtn) {
    editFigBtn.addEventListener('click', () => {
      if (attachedFigureData) {
        studioState = JSON.parse(JSON.stringify(attachedFigureData));
      }
      openShapeStudio();
    });
  }

  const removeFigBtn = document.getElementById('removeAttachedFigureBtn');
  if (removeFigBtn) removeFigBtn.addEventListener('click', removeAttachedFigure);

  const closeStudioBtn = document.getElementById('closeShapeStudioBtn');
  if (closeStudioBtn) closeStudioBtn.addEventListener('click', closeShapeStudio);

  const applyStudioBtn = document.getElementById('applyStudioShapeBtn');
  if (applyStudioBtn) applyStudioBtn.addEventListener('click', applyStudioShape);

  const resetStudioBtn = document.getElementById('resetStudioShapeBtn');
  if (resetStudioBtn) resetStudioBtn.addEventListener('click', resetStudioShape);

  // Studio: Base Shape Dropdown
  const baseSelect = document.getElementById('studioBaseShapeSelect');
  if (baseSelect) {
    baseSelect.addEventListener('change', (e) => {
      initStudioShape(e.target.value, false);
      updateStudioCanvasPreview();
    });
  }

  // Studio: Paint Tools (Seç, Xətt, Bucaq, Ox, Mətn)
  const toolSelectBtn = document.getElementById('toolSelect');
  if (toolSelectBtn) {
    toolSelectBtn.addEventListener('click', () => setActivePaintTool('select'));
  }

  const toolAddLineBtn = document.getElementById('toolAddLine');
  if (toolAddLineBtn) {
    toolAddLineBtn.addEventListener('click', () => addNewLine(false));
  }

  const toolAddRightAngleBtn = document.getElementById('toolAddRightAngle');
  if (toolAddRightAngleBtn) {
    toolAddRightAngleBtn.addEventListener('click', () => addNewRightAngle());
  }

  const toolAddArrowBtn = document.getElementById('toolAddArrow');
  if (toolAddArrowBtn) {
    toolAddArrowBtn.addEventListener('click', () => addNewLine(true));
  }

  const toolAddTextBtn = document.getElementById('toolAddText');
  if (toolAddTextBtn) {
    toolAddTextBtn.addEventListener('click', () => addNewTextPrompt());
  }

  // Studio: Silmə və Təmizləmə
  const delElemBtn = document.getElementById('studioDeleteElementBtn');
  if (delElemBtn) {
    delElemBtn.addEventListener('click', deleteSelectedStudioElement);
  }

  const clearElemBtn = document.getElementById('studioClearElementsBtn');
  if (clearElemBtn) {
    clearElemBtn.addEventListener('click', clearAllStudioCustomElements);
  }

  // Studio: Color Buttons
  document.querySelectorAll('.color-circle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-circle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const clr = btn.getAttribute('data-color') || '#000000';
      setStudioColor(clr);
    });
  });

  // Studio: Line Style & Width
  const styleSelect = document.getElementById('studioLineStyleSelect');
  if (styleSelect) {
    styleSelect.addEventListener('change', (e) => {
      setStudioLineStyle(e.target.value);
    });
  }
  const widthSelect = document.getElementById('studioLineWidthSelect');
  if (widthSelect) {
    widthSelect.addEventListener('change', (e) => {
      setStudioLineWidth(e.target.value);
    });
  }

  // Setup interactive SVG canvas drag-and-drop
  setupStudioCanvasEvents();
  initStudioShape(studioState.baseShape || 'empty_right_triangle', true);

  // Studio: Text Bar Input & Add Button
  const tbInput = document.getElementById('studioTextBarInput');
  const addTbBtn = document.getElementById('addTextBarBtn');

  if (addTbBtn) {
    addTbBtn.addEventListener('click', () => {
      addTextBarToCanvas();
    });
  }

  if (tbInput) {
    tbInput.addEventListener('input', (e) => {
      if (studioState.selectedElementId && studioState.selectedElementType === 'text') {
        const t = studioState.texts.find(item => item.id === studioState.selectedElementId);
        if (t) {
          t.text = e.target.value;
          updateStudioCanvasPreview();
        }
      }
    });

    tbInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!studioState.selectedElementId || studioState.selectedElementType !== 'text') {
          addTextBarToCanvas();
        }
      }
    });
  }

  // Studio: Input fields for measurements
  const fieldMapping = {
    'studioInputA': 'a',
    'studioInputB': 'b',
    'studioInputC': 'c',
    'studioInputAngle': 'angle',
    'studioInputVertices': 'vertices'
  };

  Object.keys(fieldMapping).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('focus', () => { lastFocusedStudioInputId = id; });
      el.addEventListener('input', (e) => {
        const key = fieldMapping[id];
        studioState.labels[key] = e.target.value;
        updateStudioCanvasPreview();
      });
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

  // Form Submit
  const qForm = document.getElementById('questionForm');
  if (qForm) qForm.addEventListener('submit', handleQuestionSubmit);

  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEditing);

  // Download Exam Button (Modal)
  const downloadBtn = document.getElementById('downloadExamBtn');
  if (downloadBtn) downloadBtn.addEventListener('click', openDownloadModal);

  const closeModBtn = document.getElementById('closeDownloadModalBtn');
  if (closeModBtn) closeModBtn.addEventListener('click', closeDownloadModal);

  const pdfOpt = document.getElementById('downloadPdfOption');
  if (pdfOpt) pdfOpt.addEventListener('click', downloadAsPdf);

  const docOpt = document.getElementById('downloadDocOption');
  if (docOpt) docOpt.addEventListener('click', downloadAsWordDoc);

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

  // Initial View Setup
  setQuestionType('qapali');
  renderExamBooklet();
});
