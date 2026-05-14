/* ═══════════════════════════════════════════════════════════════
   CONTI DI CASA — app.js
   Vanilla JS. Mobile-first. PWA. Supabase REST + Realtime.
   ═══════════════════════════════════════════════════════════════ */

(function () {
'use strict';

// ─── CONFIG ─────────────────────────────────────────────────
const SUPA_URL = 'https://lrvkchqvjzynfzevpqaj.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydmtjaHF2anp5bmZ6ZXZwcWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDY5NjksImV4cCI6MjA5MzIyMjk2OX0.XZXyUt9UNepHvr4HBLgCkywQYsXwtmvwYCsRrlAMBv4';
const REST = SUPA_URL + '/rest/v1/';
const T = {
  CATS: 'cdc_categorie',
  TX: 'cdc_transazioni',
  BUDGET: 'cdc_budget',
  PREFS: 'cdc_prefs',
  TS: 'cdc_update_cache',
  VER: 'cdc_app_version'
};

const LS = {
  CATS: 'cdc-cats',
  TX: 'cdc-tx',
  BUDGETS: 'cdc-budgets',
  PREFS: 'cdc-prefs',
  TS: 'cdc-ts',
  QUEUE: 'cdc-queue',
  SHA: 'cdc-deploy-sha',
  LAST_TIPO: 'cdc-last-tipo',
  LAST_MONTH: 'cdc-last-month'
};

// Tavolozza colori per categorie
const COLORS = ['#e74c3c','#f39c12','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e63',
                '#ff5722','#795548','#607d8b','#d97757','#5ab885','#8b95a1','#a777e3','#34d399'];
const EMOJIS = ['🛒','🏠','💡','🚗','🍽️','💊','🎮','👕','🎁','💰','💼','📦','🐶','✈️','📚','☕',
                '🍷','💄','💻','🎬','🏋️','🎵','🚲','⛽','🌳','🎂','💍','🧴','📱','🎓','🛠️','🚂'];

// ─── STATE ──────────────────────────────────────────────────
const S = {
  cats: [],          // categorie complete
  tx: [],            // transazioni (cache locale: ultimi 3 mesi)
  budgets: [],       // budget anno corrente
  prefs: { autori: ['Stefano', 'Partner'], autoreDefault: 'Stefano', theme: 'auto' },
  ts: 0,
  queue: [],
  // navigation
  currentView: 'home',
  currentMonth: null,  // {anno, mese}
  // filters
  listFilter: 'all',
  listSearch: '',
  donutFilter: null,   // categoria_id se filtrato
  // editing
  editTxId: null,
  editCatId: null,
  editBudgetCatId: null,
  // realtime
  realtimeClient: null,
  realtimeChannel: null,
  // versioning
  localSha: localStorage.getItem(LS.SHA) || '',
  // trend cache (RAM)
  trendCache: null,
  // pending tx tmp ids
  pendingTxIds: new Set()
};

// ─── DOM CACHE ──────────────────────────────────────────────
const D = {};
function cacheDOM() {
  ['monthLabel','btnMonthPrev','btnMonthNext','btnSettings','btnUpdate',
   'view-home','view-list','view-budget','view-cat',
   'saldoNum','saldoIn','saldoOut','ultime','donutWrap','lineWrap','budgetBars',
   'searchInput','listFilters','txList',
   'budgetList','catTabs','catList','btnAddCat',
   'fab','toast',
   // modals
   'modalQa','sheetQa','qaToggle','qaAmt','qaAmtVal','numpad','qaCats','qaTitle','qaMoreBtn','qaExtraRow','qaDesc','qaData','qaAutore',
   'modalTx','txEditAmt','txEditTipo','txEditCat','txEditData','txEditDesc','txEditAutore','txEditSave','txEditDelete',
   'modalCat','catEditTitle','catEditName','catEditTipo','catEditEmojis','catEditColors','catEditSave','catEditDelete',
   'modalBudget','budgetEditTitle','budgetEditAmt','budgetEditSave','budgetEditDelete',
   'modalSettings','setTheme','setAutoreDefault','setAutori','setSave','setExport','setClearCache','setVersion'
  ].forEach(id => D[id] = document.getElementById(id));
}

// ─── UTILS ──────────────────────────────────────────────────
const $$ = (sel, ctx) => (ctx || document).querySelectorAll(sel);
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uuid = () => 'tmp-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const isOnline = () => navigator.onLine !== false;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MESI_FULL = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const MESI_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function fmtData(s) {
  const [y, m, d] = s.split('-');
  return d + '/' + m + '/' + y;
}
function fmtDataLong(s) {
  const [y, m, d] = s.split('-');
  return d + ' ' + MESI_SHORT[Number(m)-1] + ' ' + y;
}
function fmtEur(n) {
  const x = Math.round(n * 100) / 100;
  return '€' + x.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function parseAmount(str) {
  if (!str) return NaN;
  return parseFloat(String(str).replace(',', '.'));
}
function monthKey(y, m) { return y + '-' + String(m).padStart(2,'0'); }
function inMonth(dateStr, anno, mese) {
  const [y, m] = dateStr.split('-');
  return Number(y) === anno && Number(m) === mese;
}
function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms); }
function toast(msg, ms) {
  D.toast.textContent = msg;
  D.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => D.toast.classList.remove('show'), ms || 1700);
}

// ─── SUPABASE FETCH (REST) ──────────────────────────────────
async function supaFetch(path, opts, retry) {
  opts = opts || {};
  retry = retry == null ? 0 : retry;
  const headers = Object.assign({
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + SUPA_KEY,
    'Content-Type': 'application/json'
  }, opts.headers || {});
  if (opts.method && opts.method !== 'GET') {
    headers['Prefer'] = headers['Prefer'] || 'return=representation';
  }
  try {
    const res = await fetch(REST + path, Object.assign({}, opts, { headers }));
    if (!res.ok) {
      const txt = await res.text();
      const err = new Error('HTTP ' + res.status + ': ' + txt);
      err.status = res.status;
      if (res.status >= 500 && retry < 2) {
        await sleep(300 * Math.pow(2, retry));
        return supaFetch(path, opts, retry + 1);
      }
      throw err;
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && retry < 2) {
      await sleep(300 * Math.pow(2, retry));
      return supaFetch(path, opts, retry + 1);
    }
    throw err;
  }
}

// ─── OFFLINE QUEUE ──────────────────────────────────────────
function loadQueue() {
  try { S.queue = JSON.parse(localStorage.getItem(LS.QUEUE) || '[]'); }
  catch { S.queue = []; }
}
function saveQueue() { localStorage.setItem(LS.QUEUE, JSON.stringify(S.queue)); }
function enqueue(op) {
  S.queue.push(Object.assign({ ts: Date.now(), attempts: 0 }, op));
  saveQueue();
}
async function drainQueue() {
  if (!isOnline()) return;
  if (!S.queue.length) return;
  const remaining = [];
  for (const op of S.queue) {
    try {
      await supaFetch(op.path, op.options);
    } catch (e) {
      op.attempts = (op.attempts || 0) + 1;
      if (op.attempts < 5) remaining.push(op);
    }
  }
  S.queue = remaining;
  saveQueue();
  if (S.queue.length === 0) {
    await fullReload();
    toast('Sincronizzato');
  }
}

// ─── LOCALSTORAGE CACHE ─────────────────────────────────────
function loadLocalCache() {
  try { S.cats = JSON.parse(localStorage.getItem(LS.CATS) || '[]'); } catch { S.cats = []; }
  try { S.tx = JSON.parse(localStorage.getItem(LS.TX) || '[]'); } catch { S.tx = []; }
  try { S.budgets = JSON.parse(localStorage.getItem(LS.BUDGETS) || '[]'); } catch { S.budgets = []; }
  try {
    const p = JSON.parse(localStorage.getItem(LS.PREFS) || 'null');
    if (p) S.prefs = Object.assign(S.prefs, p);
  } catch {}
  S.ts = Number(localStorage.getItem(LS.TS) || 0);
}
function saveLocalCache() {
  localStorage.setItem(LS.CATS, JSON.stringify(S.cats));
  localStorage.setItem(LS.TX, JSON.stringify(S.tx));
  localStorage.setItem(LS.BUDGETS, JSON.stringify(S.budgets));
  localStorage.setItem(LS.PREFS, JSON.stringify(S.prefs));
  localStorage.setItem(LS.TS, String(S.ts));
}

// ─── DATA LOAD / SYNC ───────────────────────────────────────
async function fetchTs() {
  try {
    const rows = await supaFetch(T.TS + '?select=ts&id=eq.1');
    return rows && rows[0] ? Number(rows[0].ts) : 0;
  } catch { return 0; }
}

async function reloadAll() {
  // carica TUTTO da Supabase (ignorando cache)
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const cutoffStr = cutoff.getFullYear() + '-' + String(cutoff.getMonth()+1).padStart(2,'0') + '-01';

  const [cats, tx, budgets, prefsRows, verRows] = await Promise.all([
    supaFetch(T.CATS + '?select=*&order=ordine.asc,id.asc'),
    supaFetch(T.TX + '?select=*&data=gte.' + cutoffStr + '&order=data.desc,id.desc'),
    supaFetch(T.BUDGET + '?select=*&anno=eq.' + now.getFullYear()),
    supaFetch(T.PREFS + '?select=dati&id=eq.1'),
    supaFetch(T.VER + '?select=sha&id=eq.1')
  ]);
  S.cats = cats || [];
  S.tx = tx || [];
  S.budgets = budgets || [];
  if (prefsRows && prefsRows[0] && prefsRows[0].dati) {
    S.prefs = Object.assign(S.prefs, prefsRows[0].dati);
  }
  S.ts = await fetchTs();
  saveLocalCache();

  // version baseline
  const sha = verRows && verRows[0] && verRows[0].sha;
  if (sha) {
    if (!S.localSha) {
      S.localSha = sha;
      localStorage.setItem(LS.SHA, sha);
    }
    if (D.setVersion) D.setVersion.textContent = sha.slice(0, 7);
  }
}

async function syncIfStale() {
  try {
    const remoteTs = await fetchTs();
    if (remoteTs !== S.ts) {
      await reloadAll();
      return true;
    }
  } catch {}
  return false;
}

async function fullReload() {
  await reloadAll();
  renderAll();
}

// ─── RENDER ALL ─────────────────────────────────────────────
function renderAll() {
  renderHeader();
  renderHome();
  renderList();
  renderBudgetView();
  renderCatView();
  renderSettings();
}

// ─── HEADER ─────────────────────────────────────────────────
function renderHeader() {
  if (!S.currentMonth) initMonth();
  D.monthLabel.textContent = MESI_FULL[S.currentMonth.mese - 1] + ' ' + S.currentMonth.anno;
}
function initMonth() {
  const saved = localStorage.getItem(LS.LAST_MONTH);
  if (saved) {
    const [y, m] = saved.split('-').map(Number);
    S.currentMonth = { anno: y, mese: m };
    // Se è il mese corrente o successivo, riallinea
    const now = new Date();
    if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) {
      S.currentMonth = { anno: now.getFullYear(), mese: now.getMonth() + 1 };
    }
  } else {
    const now = new Date();
    S.currentMonth = { anno: now.getFullYear(), mese: now.getMonth() + 1 };
  }
  localStorage.setItem(LS.LAST_MONTH, monthKey(S.currentMonth.anno, S.currentMonth.mese));
}
function shiftMonth(delta) {
  let { anno, mese } = S.currentMonth;
  mese += delta;
  while (mese < 1) { mese += 12; anno--; }
  while (mese > 12) { mese -= 12; anno++; }
  S.currentMonth = { anno, mese };
  localStorage.setItem(LS.LAST_MONTH, monthKey(anno, mese));
  renderHeader();
  // ricarica tx del mese se non in cache
  ensureMonthLoaded().then(() => {
    renderHome();
    renderList();
  });
}

async function ensureMonthLoaded() {
  const { anno, mese } = S.currentMonth;
  const has = S.tx.some(t => inMonth(t.data, anno, mese));
  const now = new Date();
  const isRecent = (anno === now.getFullYear() && Math.abs(mese - (now.getMonth() + 1)) <= 2)
                || (anno === now.getFullYear() - 1 && mese >= 11 && now.getMonth() <= 1);
  if (has || isRecent) return;
  // fetch mese specifico
  const start = anno + '-' + String(mese).padStart(2,'0') + '-01';
  const lastDay = new Date(anno, mese, 0).getDate();
  const end = anno + '-' + String(mese).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
  try {
    const rows = await supaFetch(T.TX + '?select=*&data=gte.' + start + '&data=lte.' + end + '&order=data.desc,id.desc');
    if (rows) {
      // merge senza duplicare
      const ids = new Set(S.tx.map(t => t.id));
      rows.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
      saveLocalCache();
    }
  } catch (e) { console.warn('ensureMonthLoaded failed', e); }
}

// ─── HOME (DASHBOARD) ───────────────────────────────────────
function txInCurrentMonth() {
  const { anno, mese } = S.currentMonth;
  return S.tx.filter(t => inMonth(t.data, anno, mese));
}

function renderHome() {
  if (!S.currentMonth) return;
  const arr = txInCurrentMonth();
  const inSum = arr.filter(t => t.tipo === 'entrata').reduce((s, t) => s + Number(t.importo), 0);
  const outSum = arr.filter(t => t.tipo === 'uscita').reduce((s, t) => s + Number(t.importo), 0);
  const saldo = inSum - outSum;
  D.saldoNum.textContent = (saldo >= 0 ? '+' : '−') + fmtEur(Math.abs(saldo)).slice(1);
  D.saldoNum.className = 'saldo-num ' + (saldo >= 0 ? 'pos' : 'neg');
  D.saldoIn.textContent = fmtEur(inSum);
  D.saldoOut.textContent = fmtEur(outSum);

  // Ultime 5
  const ultime = arr.slice(0, 5);
  if (!ultime.length) {
    D.ultime.innerHTML = '<div class="txt-faint mt-8" style="font-size:13px">Nessuna transazione in questo mese.</div>';
  } else {
    D.ultime.innerHTML = '<div class="mt-16"></div>' + ultime.map(txRowHtml).join('');
    bindTxRows(D.ultime);
  }

  // Donut uscite
  const uscBy = {};
  arr.filter(t => t.tipo === 'uscita').forEach(t => {
    const cid = t.categoria_id || 0;
    uscBy[cid] = (uscBy[cid] || 0) + Number(t.importo);
  });
  const segs = Object.keys(uscBy).map(cid => {
    const c = catById(Number(cid));
    return {
      label: c ? c.nome : 'Senza categoria',
      value: uscBy[cid],
      color: c ? c.colore : '#666',
      onClick: function () {
        S.donutFilter = c ? c.id : null;
        S.listFilter = 'uscita';
        switchView('list');
      }
    };
  });
  Charts.renderDonut(D.donutWrap, segs, { subLabel: 'uscite mese' });

  // Trend 12 mesi
  renderTrend();

  // Budget vs reale
  renderBudgetBars();
}

async function renderTrend() {
  // memo RAM per sessione (chiave: anno-mese corrente)
  const key = monthKey(S.currentMonth.anno, S.currentMonth.mese);
  let data = S.trendCache && S.trendCache.key === key ? S.trendCache.data : null;
  if (!data) {
    // calcola range 12 mesi a partire dal mese corrente all'indietro
    const endY = S.currentMonth.anno, endM = S.currentMonth.mese;
    let startY = endY, startM = endM - 11;
    while (startM < 1) { startM += 12; startY--; }
    const startStr = startY + '-' + String(startM).padStart(2,'0') + '-01';
    const lastDay = new Date(endY, endM, 0).getDate();
    const endStr = endY + '-' + String(endM).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
    try {
      const rows = await supaFetch(T.TX + '?select=data,importo,tipo&data=gte.' + startStr + '&data=lte.' + endStr);
      const buckets = new Map();
      const labels = [];
      let y = startY, m = startM;
      for (let i = 0; i < 12; i++) {
        const k = monthKey(y, m);
        buckets.set(k, { in: 0, out: 0 });
        labels.push(MESI_SHORT[m - 1] + (m === 1 ? ' \'' + String(y).slice(-2) : ''));
        m++; if (m > 12) { m = 1; y++; }
      }
      (rows || []).forEach(r => {
        const [yy, mm] = r.data.split('-');
        const k = monthKey(Number(yy), Number(mm));
        const b = buckets.get(k);
        if (!b) return;
        if (r.tipo === 'entrata') b.in += Number(r.importo);
        else b.out += Number(r.importo);
      });
      const inPts = []; const outPts = [];
      buckets.forEach(v => { inPts.push(v.in); outPts.push(v.out); });
      data = { inPts, outPts, labels };
    } catch (e) {
      console.warn('trend fetch failed', e);
      D.lineWrap.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Trend non disponibile offline</div></div>';
      return;
    }
    S.trendCache = { key, data };
  }
  Charts.renderLine(D.lineWrap, [
    { label: 'Entrate', color: 'var(--ok)', points: data.inPts },
    { label: 'Uscite', color: 'var(--danger)', points: data.outPts }
  ], data.labels);
}

function renderBudgetBars() {
  const { anno, mese } = S.currentMonth;
  const monthBudgets = S.budgets.filter(b => b.anno === anno && b.mese === mese);
  const arr = txInCurrentMonth();
  const uscBy = {};
  arr.filter(t => t.tipo === 'uscita').forEach(t => {
    const cid = t.categoria_id;
    if (cid != null) uscBy[cid] = (uscBy[cid] || 0) + Number(t.importo);
  });
  const rows = monthBudgets.map(b => {
    const c = catById(b.categoria_id);
    return {
      label: c ? (c.icona ? c.icona + ' ' + c.nome : c.nome) : '?',
      speso: uscBy[b.categoria_id] || 0,
      budget: Number(b.importo),
      onClick: () => openBudgetEdit(b.categoria_id)
    };
  });
  Charts.renderBudgetBars(D.budgetBars, rows);
}

// ─── HELPERS ────────────────────────────────────────────────
function catById(id) { return S.cats.find(c => c.id === id); }

function txRowHtml(t) {
  const c = catById(t.categoria_id);
  const icon = c ? c.icona : '❔';
  const color = c ? c.colore : '#666';
  const name = c ? c.nome : 'Senza categoria';
  const pendingCls = S.pendingTxIds.has(t.id) ? ' pending' : '';
  const meta = [fmtData(t.data), t.descrizione || '', t.autore || ''].filter(Boolean).join(' • ');
  return '<div class="tx-row' + pendingCls + '" data-tx-id="' + t.id + '">' +
    '<div class="tx-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
    '<div class="tx-body">' +
      '<div class="tx-cat">' + esc(name) + '</div>' +
      '<div class="tx-meta">' + esc(meta) + '</div>' +
    '</div>' +
    '<div class="tx-amt ' + (t.tipo === 'entrata' ? 'in' : 'out') + '">' +
      (t.tipo === 'entrata' ? '+' : '−') + fmtEur(Number(t.importo)) +
    '</div>' +
  '</div>';
}
function bindTxRows(container) {
  $$('.tx-row', container).forEach(el => {
    el.addEventListener('click', () => openTxEdit(el.getAttribute('data-tx-id')));
  });
}

// ─── LISTA TRANSAZIONI ──────────────────────────────────────
function renderList() {
  const { anno, mese } = S.currentMonth;
  let arr = S.tx.filter(t => inMonth(t.data, anno, mese));
  if (S.listFilter !== 'all') arr = arr.filter(t => t.tipo === S.listFilter);
  if (S.donutFilter != null) arr = arr.filter(t => t.categoria_id === S.donutFilter);
  if (S.listSearch) {
    const q = S.listSearch.toLowerCase();
    arr = arr.filter(t => {
      const c = catById(t.categoria_id);
      const name = c ? c.nome.toLowerCase() : '';
      return (t.descrizione || '').toLowerCase().includes(q) ||
             name.includes(q) ||
             (t.autore || '').toLowerCase().includes(q);
    });
  }

  if (!arr.length) {
    D.txList.innerHTML = '<div class="empty"><div class="emoji">📭</div><div>Nessuna transazione.</div></div>';
    return;
  }
  // raggruppa per data
  const groups = {};
  arr.forEach(t => { (groups[t.data] = groups[t.data] || []).push(t); });
  const dates = Object.keys(groups).sort().reverse();
  let html = '';
  dates.forEach(d => {
    html += '<div class="tx-day-header">' + fmtDataLong(d) + '</div>';
    html += groups[d].map(txRowHtml).join('');
  });
  // filtro donut indicatore
  if (S.donutFilter != null) {
    const c = catById(S.donutFilter);
    html = '<div class="chip active" id="clearDonut">Solo: ' + (c ? c.nome : '?') + ' ✕</div>' + html;
  }
  D.txList.innerHTML = html;
  bindTxRows(D.txList);
  const clr = $('#clearDonut');
  if (clr) clr.addEventListener('click', () => { S.donutFilter = null; renderList(); });
}

// ─── BUDGET VIEW ────────────────────────────────────────────
function renderBudgetView() {
  const { anno, mese } = S.currentMonth;
  const arr = txInCurrentMonth();
  const uscBy = {};
  arr.filter(t => t.tipo === 'uscita').forEach(t => {
    const cid = t.categoria_id;
    if (cid != null) uscBy[cid] = (uscBy[cid] || 0) + Number(t.importo);
  });
  const cats = S.cats.filter(c => c.tipo === 'uscita');
  if (!cats.length) {
    D.budgetList.innerHTML = '<div class="empty"><div class="emoji">🎯</div><div>Crea prima alcune categorie di uscita.</div></div>';
    return;
  }
  D.budgetList.innerHTML = cats.map(c => {
    const b = S.budgets.find(x => x.categoria_id === c.id && x.anno === anno && x.mese === mese);
    const speso = uscBy[c.id] || 0;
    const budget = b ? Number(b.importo) : 0;
    const pct = budget > 0 ? (speso / budget) * 100 : 0;
    const cls = pct > 100 ? 'over' : (pct > 70 ? 'warn' : 'ok');
    const widthPct = budget > 0 ? Math.min(100, pct) : 0;
    const right = budget > 0
      ? '<span><b>' + fmtEur(speso) + '</b> / ' + fmtEur(budget) + '</span>'
      : '<span class="txt-faint">+ imposta</span>';
    return '<div class="budget-row" data-cat-id="' + c.id + '" style="cursor:pointer;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;margin-bottom:8px">' +
      '<div class="budget-row-top">' +
        '<span>' + (c.icona ? c.icona + ' ' : '') + esc(c.nome) + '</span>' +
        right +
      '</div>' +
      (budget > 0
        ? '<div class="budget-bar"><div class="budget-bar-fill ' + cls + '" style="width:' + widthPct + '%"></div></div>' +
          '<div class="budget-pct">' + pct.toFixed(0) + '%' + (pct > 100 ? ' — superato di ' + fmtEur(speso - budget) : '') + '</div>'
        : '') +
    '</div>';
  }).join('');
  $$('[data-cat-id]', D.budgetList).forEach(el => {
    el.addEventListener('click', () => openBudgetEdit(Number(el.getAttribute('data-cat-id'))));
  });
}

// ─── CATEGORIE VIEW ─────────────────────────────────────────
let activeCatTab = 'uscita';
function renderCatView() {
  const cats = S.cats.filter(c => c.tipo === activeCatTab).sort((a, b) => a.ordine - b.ordine);
  if (!cats.length) {
    D.catList.innerHTML = '<div class="empty"><div class="emoji">📁</div><div>Nessuna categoria.</div></div>';
    return;
  }
  D.catList.innerHTML = cats.map(c =>
    '<div class="cat-row" draggable="true" data-cat-id="' + c.id + '">' +
      '<span class="cat-handle">⋮⋮</span>' +
      '<div class="cat-icon" style="background:' + (c.colore || '#666') + '22;color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
      '<span class="cat-name">' + esc(c.nome) + '</span>' +
    '</div>').join('');
  bindCatDragAndClick();
}
function bindCatDragAndClick() {
  let draggedEl = null;
  $$('.cat-row', D.catList).forEach(el => {
    el.addEventListener('click', e => {
      if (draggedEl) return;
      openCatEdit(Number(el.getAttribute('data-cat-id')));
    });
    el.addEventListener('dragstart', e => {
      draggedEl = el;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', el.getAttribute('data-cat-id'));
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      $$('.drag-over', D.catList).forEach(x => x.classList.remove('drag-over'));
      setTimeout(() => { draggedEl = null; }, 50);
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      if (draggedEl && draggedEl !== el) el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', async e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (!draggedEl || draggedEl === el) return;
      const allRows = Array.from($$('.cat-row', D.catList));
      const srcIdx = allRows.indexOf(draggedEl);
      const dstIdx = allRows.indexOf(el);
      if (srcIdx < dstIdx) D.catList.insertBefore(draggedEl, el.nextSibling);
      else D.catList.insertBefore(draggedEl, el);
      await persistCatOrder();
    });
  });
  // touch drag fallback (long-press + manual reorder via touchmove)
  // Per semplicità su mobile usiamo solo dragstart/drop nativo che funziona anche per touch nei browser recenti.
}

async function persistCatOrder() {
  const rows = Array.from($$('.cat-row', D.catList));
  const updates = rows.map((el, idx) => ({ id: Number(el.getAttribute('data-cat-id')), ordine: idx }));
  // Aggiorna locale
  updates.forEach(u => {
    const c = catById(u.id);
    if (c) c.ordine = u.ordine;
  });
  saveLocalCache();
  // Aggiorna remoto via PATCH multiple
  for (const u of updates) {
    const path = T.CATS + '?id=eq.' + u.id;
    const options = { method: 'PATCH', body: JSON.stringify({ ordine: u.ordine }) };
    if (!isOnline()) { enqueue({ path, options }); continue; }
    try { await supaFetch(path, options); }
    catch { enqueue({ path, options }); }
  }
  toast('Ordine salvato');
}

// ─── SWITCH VIEW ────────────────────────────────────────────
function switchView(name) {
  S.currentView = name;
  ['home','list','budget','cat'].forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.classList.toggle('active', v === name);
  });
  $$('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-view') === name);
  });
  if (name === 'home') renderHome();
  else if (name === 'list') renderList();
  else if (name === 'budget') renderBudgetView();
  else if (name === 'cat') renderCatView();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ─── QUICK ADD ──────────────────────────────────────────────
const QA = { tipo: 'uscita', amt: '', desc: '', data: '', autore: '', extraOpen: false };
function openQuickAdd(tipo) {
  QA.tipo = tipo || localStorage.getItem(LS.LAST_TIPO) || 'uscita';
  QA.amt = '';
  QA.desc = '';
  QA.data = today();
  QA.autore = S.prefs.autoreDefault || (S.prefs.autori && S.prefs.autori[0]) || 'Stefano';
  QA.extraOpen = false;
  setQaTipo(QA.tipo);
  setQaAmt('');
  D.qaDesc.value = '';
  D.qaData.value = QA.data;
  populateAutoreSelect(D.qaAutore, QA.autore);
  D.qaExtraRow.style.display = 'none';
  D.qaMoreBtn.textContent = '+ Mostra altre opzioni';
  renderQaCats();
  openModal('modalQa');
}
function setQaTipo(t) {
  QA.tipo = t;
  D.qaToggle.setAttribute('data-tipo', t);
  $$('button', D.qaToggle).forEach(b => b.classList.toggle('active', b.getAttribute('data-tipo') === t));
  D.qaTitle.textContent = (t === 'entrata' ? 'Nuova entrata' : 'Nuova uscita');
  localStorage.setItem(LS.LAST_TIPO, t);
  renderQaCats();
}
function setQaAmt(v) {
  QA.amt = v;
  if (!v) {
    D.qaAmt.classList.add('empty');
    D.qaAmtVal.textContent = '0';
  } else {
    D.qaAmt.classList.remove('empty');
    D.qaAmtVal.textContent = v;
  }
}
function numpadPress(k) {
  let v = QA.amt;
  if (k === 'bs') {
    v = v.slice(0, -1);
  } else if (k === ',') {
    if (!v.includes(',')) v = (v || '0') + ',';
  } else {
    if (v === '0') v = '';
    // limite due decimali
    if (v.includes(',')) {
      const dec = v.split(',')[1];
      if (dec.length >= 2) return;
    }
    if (v.length >= 9) return;
    v += k;
  }
  setQaAmt(v);
  vibrate(8);
}
function renderQaCats() {
  // Top 8 categorie più usate degli ultimi 90 giorni del tipo corrente
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.getFullYear() + '-' + String(cutoff.getMonth()+1).padStart(2,'0') + '-' + String(cutoff.getDate()).padStart(2,'0');
  const recent = S.tx.filter(t => t.tipo === QA.tipo && t.data >= cutoffStr);
  const count = {};
  recent.forEach(t => { if (t.categoria_id != null) count[t.categoria_id] = (count[t.categoria_id] || 0) + 1; });
  const all = S.cats.filter(c => c.tipo === QA.tipo);
  all.sort((a, b) => (count[b.id] || 0) - (count[a.id] || 0) || a.ordine - b.ordine);
  const top = all.slice(0, 8);
  const others = all.length > 8;
  D.qaCats.innerHTML = top.map(c =>
    '<button class="qa-cat" data-cat-id="' + c.id + '">' +
      '<div class="qa-cat-icon" style="color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
      '<div class="qa-cat-name">' + esc(c.nome) + '</div>' +
    '</button>').join('') +
    (others ? '<button class="qa-cat more" id="qaMoreCats"><div class="qa-cat-icon">…</div><div class="qa-cat-name">Altre</div></button>' : '');
  $$('.qa-cat[data-cat-id]', D.qaCats).forEach(el => {
    el.addEventListener('click', () => {
      const cid = Number(el.getAttribute('data-cat-id'));
      quickSave(cid);
    });
  });
  const more = $('#qaMoreCats', D.qaCats);
  if (more) more.addEventListener('click', showAllCats);
}
function showAllCats() {
  const all = S.cats.filter(c => c.tipo === QA.tipo);
  D.qaCats.innerHTML = all.map(c =>
    '<button class="qa-cat" data-cat-id="' + c.id + '">' +
      '<div class="qa-cat-icon" style="color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
      '<div class="qa-cat-name">' + esc(c.nome) + '</div>' +
    '</button>').join('');
  $$('.qa-cat', D.qaCats).forEach(el => {
    el.addEventListener('click', () => {
      const cid = Number(el.getAttribute('data-cat-id'));
      quickSave(cid);
    });
  });
}
async function quickSave(categoria_id) {
  const importo = parseAmount(QA.amt);
  if (!importo || importo <= 0) {
    toast('Inserisci l\'importo');
    return;
  }
  const desc = D.qaDesc.value.trim();
  const dataStr = D.qaData.value || today();
  const autore = D.qaAutore.value || QA.autore;
  await saveTransaction({
    importo,
    tipo: QA.tipo,
    categoria_id,
    descrizione: desc || null,
    data: dataStr,
    autore
  });
  closeModal('modalQa');
  vibrate(20);
  toast('Salvato');
}

async function saveTransaction(payload) {
  const tmpId = uuid();
  const row = Object.assign({ id: tmpId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, payload);
  // optimistic locale
  S.tx.unshift(row);
  S.pendingTxIds.add(tmpId);
  saveLocalCache();
  renderHome();
  renderList();
  // remoto
  const path = T.TX + '?select=*';
  const body = Object.assign({}, payload);
  const options = { method: 'POST', body: JSON.stringify(body), headers: { 'Prefer': 'return=representation' } };
  try {
    if (!isOnline()) { enqueue({ path, options }); return; }
    const res = await supaFetch(path, options);
    if (res && res[0]) {
      // sostituisci tmp con quello reale
      const realId = res[0].id;
      const idx = S.tx.findIndex(t => t.id === tmpId);
      if (idx >= 0) S.tx[idx] = res[0];
      S.pendingTxIds.delete(tmpId);
      saveLocalCache();
      renderHome();
      renderList();
    }
  } catch (e) {
    enqueue({ path, options });
  }
}

// ─── EDIT TRANSAZIONE ───────────────────────────────────────
function openTxEdit(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const t = S.tx.find(x => x.id === id);
  if (!t) return;
  S.editTxId = id;
  D.txEditAmt.value = t.importo;
  D.txEditTipo.value = t.tipo;
  populateCatSelect(D.txEditCat, t.tipo, t.categoria_id);
  D.txEditData.value = t.data;
  D.txEditDesc.value = t.descrizione || '';
  populateAutoreSelect(D.txEditAutore, t.autore || '');
  // cambia categorie quando cambia tipo
  D.txEditTipo.onchange = () => populateCatSelect(D.txEditCat, D.txEditTipo.value, null);
  openModal('modalTx');
}

async function saveTxEdit() {
  if (S.editTxId == null) return;
  const payload = {
    importo: parseAmount(D.txEditAmt.value),
    tipo: D.txEditTipo.value,
    categoria_id: D.txEditCat.value ? Number(D.txEditCat.value) : null,
    data: D.txEditData.value || today(),
    descrizione: D.txEditDesc.value.trim() || null,
    autore: D.txEditAutore.value || null
  };
  if (!payload.importo || payload.importo <= 0) { toast('Importo non valido'); return; }
  // optimistic
  const idx = S.tx.findIndex(t => t.id === S.editTxId);
  if (idx >= 0) S.tx[idx] = Object.assign({}, S.tx[idx], payload);
  saveLocalCache();
  renderHome(); renderList();
  closeModal('modalTx');
  toast('Modificato');
  const path = T.TX + '?id=eq.' + S.editTxId;
  const options = { method: 'PATCH', body: JSON.stringify(payload) };
  if (!isOnline()) { enqueue({ path, options }); S.editTxId = null; return; }
  try { await supaFetch(path, options); }
  catch { enqueue({ path, options }); }
  S.editTxId = null;
}
async function deleteTxEdit() {
  if (S.editTxId == null) return;
  if (!confirm('Eliminare la transazione?')) return;
  // optimistic
  S.tx = S.tx.filter(t => t.id !== S.editTxId);
  saveLocalCache();
  renderHome(); renderList();
  closeModal('modalTx');
  toast('Eliminata');
  const path = T.TX + '?id=eq.' + S.editTxId;
  const options = { method: 'DELETE' };
  if (!isOnline()) { enqueue({ path, options }); S.editTxId = null; return; }
  try { await supaFetch(path, options); }
  catch { enqueue({ path, options }); }
  S.editTxId = null;
}

function populateCatSelect(sel, tipo, currentId) {
  const cats = S.cats.filter(c => c.tipo === tipo).sort((a,b) => a.ordine - b.ordine);
  sel.innerHTML = '<option value="">(senza categoria)</option>' +
    cats.map(c => '<option value="' + c.id + '"' + (c.id === currentId ? ' selected' : '') + '>' +
      (c.icona ? c.icona + ' ' : '') + esc(c.nome) + '</option>').join('');
}
function populateAutoreSelect(sel, current) {
  const list = (S.prefs.autori && S.prefs.autori.length) ? S.prefs.autori : ['Stefano','Partner'];
  sel.innerHTML = list.map(a => '<option' + (a === current ? ' selected' : '') + '>' + esc(a) + '</option>').join('');
}

// ─── EDIT CATEGORIA ─────────────────────────────────────────
let catEditState = { icona: '🛒', colore: COLORS[0], isNew: false };
function openCatEdit(id) {
  S.editCatId = id;
  let c;
  if (id == null) {
    c = { id: null, nome: '', tipo: activeCatTab, icona: EMOJIS[0], colore: COLORS[0], ordine: S.cats.length };
    catEditState.isNew = true;
    D.catEditTitle.textContent = 'Nuova categoria';
    D.catEditDelete.style.display = 'none';
  } else {
    c = catById(id);
    if (!c) return;
    catEditState.isNew = false;
    D.catEditTitle.textContent = 'Modifica categoria';
    D.catEditDelete.style.display = 'block';
  }
  catEditState.icona = c.icona || EMOJIS[0];
  catEditState.colore = c.colore || COLORS[0];
  D.catEditName.value = c.nome || '';
  D.catEditTipo.value = c.tipo || 'uscita';
  renderEmojiPicker();
  renderColorPicker();
  openModal('modalCat');
}
function renderEmojiPicker() {
  D.catEditEmojis.innerHTML = EMOJIS.map(e =>
    '<button data-e="' + e + '" class="' + (e === catEditState.icona ? 'sel' : '') + '">' + e + '</button>'
  ).join('');
  $$('button', D.catEditEmojis).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.icona = b.getAttribute('data-e');
      renderEmojiPicker();
    });
  });
}
function renderColorPicker() {
  D.catEditColors.innerHTML = COLORS.map(c =>
    '<button data-c="' + c + '" style="background:' + c + '" class="' + (c === catEditState.colore ? 'sel' : '') + '"></button>'
  ).join('');
  $$('button', D.catEditColors).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.colore = b.getAttribute('data-c');
      renderColorPicker();
    });
  });
}
async function saveCatEdit() {
  const nome = D.catEditName.value.trim();
  if (!nome) { toast('Nome richiesto'); return; }
  const payload = {
    nome,
    tipo: D.catEditTipo.value,
    icona: catEditState.icona,
    colore: catEditState.colore
  };
  if (catEditState.isNew) {
    payload.ordine = S.cats.filter(c => c.tipo === payload.tipo).length;
    try {
      const res = await supaFetch(T.CATS + '?select=*', { method: 'POST', body: JSON.stringify(payload), headers: { 'Prefer': 'return=representation' } });
      if (res && res[0]) {
        S.cats.push(res[0]);
        saveLocalCache();
      }
      closeModal('modalCat');
      activeCatTab = payload.tipo;
      $$('button', D.catTabs).forEach(b => b.classList.toggle('active', b.getAttribute('data-tipo') === activeCatTab));
      renderCatView();
      toast('Categoria creata');
    } catch (e) {
      toast('Errore: ' + e.message);
    }
  } else {
    // optimistic locale
    const c = catById(S.editCatId);
    if (c) Object.assign(c, payload);
    saveLocalCache();
    renderCatView(); renderHome(); renderList();
    closeModal('modalCat');
    toast('Modificato');
    const path = T.CATS + '?id=eq.' + S.editCatId;
    const options = { method: 'PATCH', body: JSON.stringify(payload) };
    if (!isOnline()) { enqueue({ path, options }); S.editCatId = null; return; }
    try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    S.editCatId = null;
  }
}
async function deleteCatEdit() {
  if (S.editCatId == null) return;
  if (!confirm('Eliminare la categoria? Le transazioni esistenti diventeranno "Senza categoria".')) return;
  S.cats = S.cats.filter(c => c.id !== S.editCatId);
  S.tx.forEach(t => { if (t.categoria_id === S.editCatId) t.categoria_id = null; });
  saveLocalCache();
  renderCatView(); renderHome(); renderList();
  closeModal('modalCat');
  toast('Eliminata');
  const path = T.CATS + '?id=eq.' + S.editCatId;
  const options = { method: 'DELETE' };
  if (!isOnline()) { enqueue({ path, options }); S.editCatId = null; return; }
  try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
  S.editCatId = null;
}

// ─── EDIT BUDGET ────────────────────────────────────────────
function openBudgetEdit(catId) {
  const c = catById(catId);
  if (!c) return;
  const { anno, mese } = S.currentMonth;
  const b = S.budgets.find(x => x.categoria_id === catId && x.anno === anno && x.mese === mese);
  S.editBudgetCatId = catId;
  D.budgetEditTitle.textContent = 'Budget ' + (c.icona || '') + ' ' + c.nome + ' — ' + MESI_FULL[mese - 1];
  D.budgetEditAmt.value = b ? b.importo : '';
  D.budgetEditDelete.style.display = b ? 'block' : 'none';
  openModal('modalBudget');
}
async function saveBudgetEdit() {
  if (S.editBudgetCatId == null) return;
  const importo = parseAmount(D.budgetEditAmt.value);
  if (!(importo >= 0)) { toast('Valore non valido'); return; }
  const { anno, mese } = S.currentMonth;
  const existing = S.budgets.find(x => x.categoria_id === S.editBudgetCatId && x.anno === anno && x.mese === mese);
  if (existing) {
    existing.importo = importo;
  } else {
    S.budgets.push({ id: uuid(), categoria_id: S.editBudgetCatId, anno, mese, importo });
  }
  saveLocalCache();
  renderBudgetView(); renderHome();
  closeModal('modalBudget');
  toast('Budget salvato');
  // remoto: upsert via on_conflict
  const path = T.BUDGET + '?on_conflict=categoria_id,anno,mese';
  const body = { categoria_id: S.editBudgetCatId, anno, mese, importo };
  const options = { method: 'POST', body: JSON.stringify(body), headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' } };
  try {
    if (!isOnline()) { enqueue({ path, options }); S.editBudgetCatId = null; return; }
    const res = await supaFetch(path, options);
    if (res && res[0]) {
      // riallinea con id reale
      const real = res[0];
      const idx = S.budgets.findIndex(x => x.categoria_id === real.categoria_id && x.anno === real.anno && x.mese === real.mese);
      if (idx >= 0) S.budgets[idx] = real;
      saveLocalCache();
    }
  } catch { enqueue({ path, options }); }
  S.editBudgetCatId = null;
}
async function deleteBudgetEdit() {
  if (S.editBudgetCatId == null) return;
  const { anno, mese } = S.currentMonth;
  const existing = S.budgets.find(x => x.categoria_id === S.editBudgetCatId && x.anno === anno && x.mese === mese);
  if (!existing) { closeModal('modalBudget'); return; }
  S.budgets = S.budgets.filter(x => x !== existing);
  saveLocalCache();
  renderBudgetView(); renderHome();
  closeModal('modalBudget');
  toast('Budget rimosso');
  if (typeof existing.id === 'number') {
    const path = T.BUDGET + '?id=eq.' + existing.id;
    const options = { method: 'DELETE' };
    if (!isOnline()) { enqueue({ path, options }); }
    else { try { await supaFetch(path, options); } catch { enqueue({ path, options }); } }
  } else {
    // tmp non sincronizzato — niente da fare lato remoto
  }
  S.editBudgetCatId = null;
}

// ─── IMPOSTAZIONI ───────────────────────────────────────────
function renderSettings() {
  D.setTheme.value = S.prefs.theme || 'auto';
  D.setAutori.value = (S.prefs.autori || []).join(', ');
  populateAutoreSelect(D.setAutoreDefault, S.prefs.autoreDefault || (S.prefs.autori && S.prefs.autori[0]) || 'Stefano');
}
async function saveSettings() {
  const themeNew = D.setTheme.value;
  const autoriNew = D.setAutori.value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  const autoreDefaultNew = D.setAutoreDefault.value || autoriNew[0] || 'Stefano';
  S.prefs.theme = themeNew;
  S.prefs.autori = autoriNew.length ? autoriNew : ['Stefano', 'Partner'];
  S.prefs.autoreDefault = autoreDefaultNew;
  applyTheme();
  saveLocalCache();
  closeModal('modalSettings');
  toast('Impostazioni salvate');
  // sync prefs su Supabase
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: { autori: S.prefs.autori, autoreDefault: S.prefs.autoreDefault } }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', S.prefs.theme || 'auto');
}
function exportCsv() {
  const rows = [['data','tipo','importo','categoria','descrizione','autore']];
  S.tx.slice().sort((a,b) => a.data.localeCompare(b.data)).forEach(t => {
    const c = catById(t.categoria_id);
    rows.push([t.data, t.tipo, String(t.importo).replace('.', ','), c ? c.nome : '', t.descrizione || '', t.autore || '']);
  });
  const csv = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'transazioni-' + today() + '.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
  toast('CSV scaricato');
}
async function clearCache() {
  if (!confirm('Pulire la cache locale e ricaricare?')) return;
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  ['cdc-cats','cdc-tx','cdc-budgets','cdc-prefs','cdc-ts','cdc-deploy-sha'].forEach(k => localStorage.removeItem(k));
  location.reload();
}

// ─── MODAL HELPERS ──────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
  // reset sheet position se draggata
  const sheet = m.querySelector('.sheet');
  if (sheet) sheet.style.transform = '';
}

function bindModalClose() {
  $$('[data-close]').forEach(b => {
    b.addEventListener('click', () => closeModal(b.getAttribute('data-close')));
  });
  $$('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) closeModal(m.id);
    });
  });
}

function bindDragToClose() {
  $$('[data-drag]').forEach(handle => {
    const sheet = handle.closest('.sheet');
    const modal = handle.closest('.modal');
    let startY = null, dy = 0, h = 0;
    handle.addEventListener('pointerdown', e => {
      startY = e.clientY;
      h = sheet.getBoundingClientRect().height;
      sheet.classList.add('dragging');
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e => {
      if (startY == null) return;
      dy = Math.max(0, e.clientY - startY);
      sheet.style.transform = 'translateY(' + dy + 'px)';
    });
    handle.addEventListener('pointerup', e => {
      if (startY == null) return;
      sheet.classList.remove('dragging');
      if (dy > h * 0.28) closeModal(modal.id);
      else sheet.style.transform = '';
      startY = null; dy = 0;
      try { handle.releasePointerCapture(e.pointerId); } catch {}
    });
    handle.addEventListener('pointercancel', () => {
      sheet.classList.remove('dragging');
      sheet.style.transform = '';
      startY = null; dy = 0;
    });
  });
}

// ─── REALTIME ───────────────────────────────────────────────
function setupRealtime() {
  if (typeof supabase === 'undefined') {
    console.warn('supabase-js non caricato — Realtime disabilitato');
    return;
  }
  try {
    S.realtimeClient = supabase.createClient(SUPA_URL, SUPA_KEY, {
      realtime: { params: { eventsPerSecond: 5 } }
    });
    const ch = S.realtimeClient.channel('conti-di-casa-live');
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.TX }, p => onTxChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.CATS }, p => onCatChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.BUDGET }, p => onBudgetChange(p));
    ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: T.PREFS, filter: 'id=eq.1' }, p => onPrefsChange(p));
    ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: T.VER, filter: 'id=eq.1' }, p => onVersionChange(p && p.new && p.new.sha));
    ch.subscribe(status => { if (status === 'SUBSCRIBED') console.log('Realtime connesso'); });
    S.realtimeChannel = ch;
  } catch (e) { console.warn('Realtime init failed', e); }
}

function onTxChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    const r = p.new;
    if (!S.tx.find(t => t.id === r.id)) { S.tx.unshift(r); }
    // ordinamento: ricalcolo solo sort, no full re-render se non visibile
  } else if (ev === 'UPDATE') {
    const idx = S.tx.findIndex(t => t.id === p.new.id);
    if (idx >= 0) S.tx[idx] = p.new;
    else S.tx.unshift(p.new);
  } else if (ev === 'DELETE') {
    S.tx = S.tx.filter(t => t.id !== p.old.id);
  }
  saveLocalCache();
  if (S.currentView === 'home') renderHome();
  else if (S.currentView === 'list') renderList();
  // dashboard widgets (saldo, donut, budget bars) si aggiornano nei rispettivi renderHome
}
function onCatChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    if (!S.cats.find(c => c.id === p.new.id)) S.cats.push(p.new);
  } else if (ev === 'UPDATE') {
    const idx = S.cats.findIndex(c => c.id === p.new.id);
    if (idx >= 0) S.cats[idx] = p.new;
  } else if (ev === 'DELETE') {
    S.cats = S.cats.filter(c => c.id !== p.old.id);
  }
  saveLocalCache();
  renderHome();
  if (S.currentView === 'list') renderList();
  if (S.currentView === 'cat') renderCatView();
  if (S.currentView === 'budget') renderBudgetView();
}
function onBudgetChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    if (!S.budgets.find(b => b.id === p.new.id)) S.budgets.push(p.new);
  } else if (ev === 'UPDATE') {
    const idx = S.budgets.findIndex(b => b.id === p.new.id);
    if (idx >= 0) S.budgets[idx] = p.new;
  } else if (ev === 'DELETE') {
    S.budgets = S.budgets.filter(b => b.id !== p.old.id);
  }
  saveLocalCache();
  renderHome();
  if (S.currentView === 'budget') renderBudgetView();
}
function onPrefsChange(p) {
  if (p && p.new && p.new.dati) {
    const remote = p.new.dati;
    if (remote.autori) S.prefs.autori = remote.autori;
    if (remote.autoreDefault) S.prefs.autoreDefault = remote.autoreDefault;
    saveLocalCache();
    renderSettings();
  }
}

// ─── VERSIONING / DEPLOY BADGE ──────────────────────────────
function onVersionChange(newSha) {
  if (!newSha) return;
  if (!S.localSha) {
    S.localSha = newSha;
    localStorage.setItem(LS.SHA, newSha);
    if (D.setVersion) D.setVersion.textContent = newSha.slice(0, 7);
    return;
  }
  if (newSha !== S.localSha) {
    D.btnUpdate.classList.add('show');
  }
}
async function applyUpdate() {
  D.btnUpdate.disabled = true;
  D.btnUpdate.textContent = '...';
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
  } catch (e) { console.warn('cache cleanup err', e); }
  localStorage.removeItem(LS.SHA);
  const url = window.location.pathname + '?_r=' + Date.now() + window.location.hash;
  window.location.replace(url);
}

// ─── EVENT BINDING ──────────────────────────────────────────
function bindEvents() {
  // nav
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchView(b.getAttribute('data-view'))));
  // month nav
  D.btnMonthPrev.addEventListener('click', () => shiftMonth(-1));
  D.btnMonthNext.addEventListener('click', () => shiftMonth(1));
  // fab
  D.fab.addEventListener('click', () => openQuickAdd());
  // settings
  D.btnSettings.addEventListener('click', () => { renderSettings(); openModal('modalSettings'); });
  D.setSave.addEventListener('click', saveSettings);
  D.setExport.addEventListener('click', exportCsv);
  D.setClearCache.addEventListener('click', clearCache);
  // update
  D.btnUpdate.addEventListener('click', applyUpdate);
  // list filters
  $$('.chip', D.listFilters).forEach(c => c.addEventListener('click', () => {
    $$('.chip', D.listFilters).forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    S.listFilter = c.getAttribute('data-tipo');
    S.donutFilter = null;
    renderList();
  }));
  D.searchInput.addEventListener('input', e => { S.listSearch = e.target.value; renderList(); });
  // qa
  $$('button', D.qaToggle).forEach(b => b.addEventListener('click', () => setQaTipo(b.getAttribute('data-tipo'))));
  $$('button', D.numpad).forEach(b => b.addEventListener('click', () => numpadPress(b.getAttribute('data-k'))));
  D.qaMoreBtn.addEventListener('click', () => {
    QA.extraOpen = !QA.extraOpen;
    D.qaExtraRow.style.display = QA.extraOpen ? 'grid' : 'none';
    D.qaMoreBtn.textContent = QA.extraOpen ? '− Nascondi opzioni' : '+ Mostra altre opzioni';
  });
  // tx edit
  D.txEditSave.addEventListener('click', saveTxEdit);
  D.txEditDelete.addEventListener('click', deleteTxEdit);
  // cat edit
  D.catEditSave.addEventListener('click', saveCatEdit);
  D.catEditDelete.addEventListener('click', deleteCatEdit);
  D.btnAddCat.addEventListener('click', () => openCatEdit(null));
  $$('button', D.catTabs).forEach(b => b.addEventListener('click', () => {
    activeCatTab = b.getAttribute('data-tipo');
    $$('button', D.catTabs).forEach(x => x.classList.toggle('active', x === b));
    renderCatView();
  }));
  // budget edit
  D.budgetEditSave.addEventListener('click', saveBudgetEdit);
  D.budgetEditDelete.addEventListener('click', deleteBudgetEdit);
  // online/offline
  window.addEventListener('online', () => { toast('Online — sincronizzo'); drainQueue(); });
  window.addEventListener('offline', () => toast('Modalità offline'));
  // modal close + drag
  bindModalClose();
  bindDragToClose();
  // shortcut da URL ?action=add-uscita / add-entrata
  const params = new URLSearchParams(location.search);
  const action = params.get('action');
  if (action === 'add-uscita') setTimeout(() => openQuickAdd('uscita'), 300);
  else if (action === 'add-entrata') setTimeout(() => openQuickAdd('entrata'), 300);
}

// ─── PWA SW REGISTRATION ────────────────────────────────────
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  // ignora se siamo in pagina cache-bust dopo update
  navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW reg failed', err));
}

// ─── INIT ───────────────────────────────────────────────────
async function init() {
  cacheDOM();
  loadLocalCache();
  loadQueue();
  applyTheme();
  bindEvents();
  initMonth();
  renderHeader();
  // render iniziale da cache
  if (S.cats.length || S.tx.length) {
    renderAll();
  }
  // sync da rete
  try {
    const changed = await syncIfStale();
    if (changed) renderAll();
    else {
      // se cache vuota anche dopo sync, prova full reload
      if (!S.cats.length && !S.tx.length) {
        await reloadAll();
        renderAll();
      }
    }
  } catch (e) {
    console.warn('init sync failed', e);
  }
  // versioning baseline
  try {
    const verRows = await supaFetch(T.VER + '?select=sha&id=eq.1');
    const sha = verRows && verRows[0] && verRows[0].sha;
    if (sha && D.setVersion) D.setVersion.textContent = sha.slice(0, 7);
  } catch {}
  // realtime
  setupRealtime();
  // drain queue se online
  if (isOnline()) drainQueue();
  // SW
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);

})();
