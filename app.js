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
  VER: 'cdc_app_version',
  USERS: 'cdc_authorized_users'
};
const OWNER_EMAIL = 'marabelli.s@gmail.com';

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
const EMOJI_CATS = [
  { id: 'casa',          icon: '🏠', emojis: '🏠 🏡 🏢 🛋️ 🛏️ 🚿 🛁 🚽 🚪 🪟 🪜 🪑 📺 🖼️ 🧹 🧺 🧼 🪣 🧴 🪥 🧻 🛠️ 🔧 🔨 🔑 🗝️ 🪞 🛒'.split(' ') },
  { id: 'cibo',          icon: '🍕', emojis: '🛒 🍕 🍔 🍟 🌭 🍿 🥗 🥙 🌮 🌯 🥘 🍝 🍜 🍱 🍣 🍤 🥟 🍙 🥪 🍞 🥐 🥖 🥨 🧀 🍳 🥞 🥩 🍗 🍖 🥑 🥒 🥦 🍅 🥕 🌽 🥔 🍠 🍎 🍏 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍒 🥭 🍍 🥥 🥝 🍯 🎂 🧁 🍰 🍩 🍪 🍫 🍬 ☕ 🫖 🍵 🥤 🧋 🍷 🍺 🥃 🍶 🥂 🍸 🍹 🍾 🥛'.split(' ') },
  { id: 'bollette',      icon: '💡', emojis: '💡 🔌 🔋 ⚡ 🔥 💧 🗑️ ♻️ 📶 📡 📞 ☎️ 📱 💻 🖥️ 🖨️ 📺 📻 🌡️ 🛜 💸 🧾 📨'.split(' ') },
  { id: 'trasporti',     icon: '🚗', emojis: '🚗 🚙 🚕 🏎️ 🚐 🛻 🚚 🛵 🏍️ 🛴 🚲 ⛽ 🚉 🚆 🚇 🚊 ✈️ 🛩️ 🚁 ⛵ 🚢 🅿️ 🚦 🚥 🛣️ 🚌 🚎 🛺 🚖 🚍'.split(' ') },
  { id: 'salute',        icon: '💊', emojis: '💊 💉 🩺 🩹 🌡️ 🦷 🧬 🏥 🚑 🧠 🫀 🫁 👁️ 👂 🦴 ♿ 🆘 ⚕️ 🩻 😷 🤒 🤕 🤧 🧴 🧼 🪥 🥼'.split(' ') },
  { id: 'svago',         icon: '🎮', emojis: '🎮 🕹️ 🎯 🎰 🎲 🧩 ♟️ 🎭 🎨 🎬 🎤 🎧 🎵 🎶 🎷 🎸 🎺 🎻 🥁 📚 📖 📰 📷 📸 🎥 🎞️ 🖼️ 🎪 🎢 🎡 🎠 🎟️ 🎫 🧸 🪅 🎳 🪩'.split(' ') },
  { id: 'sport',         icon: '⚽', emojis: '⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🏓 🏸 🥅 ⛳ 🥊 🥋 🛹 🛼 ⛸️ 🎿 ⛷️ 🏂 🪂 🏋️ 🤸 🧘 🏊 🏄 🧗 🚴 🚵 🏆 🥇 🥈 🥉 🏅 🎖️ 🏟️'.split(' ') },
  { id: 'abbigliamento', icon: '👕', emojis: '👕 👔 👖 👗 👘 🥻 👙 🩱 🩳 🦺 🧥 🧣 🧤 🧦 👞 👟 👠 👡 👢 🥾 🥿 👒 🎩 🧢 👑 💍 👓 🕶️ 🌂 🧳 👜 👝 🎒 💄 💋 👛'.split(' ') },
  { id: 'famiglia',      icon: '👶', emojis: '👶 🧒 👦 👧 🧑 👨 👩 🧓 👴 👵 🤱 🤰 🍼 🧸 🚼 👪 👫 👬 👭 💑 💏 🎓 💐 💌 💝 🤝 👨‍👩‍👧 👨‍👩‍👦'.split(' ') },
  { id: 'animali',       icon: '🐶', emojis: '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🦆 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🕷️ 🐢 🐍 🦎 🐙 🦐 🦀 🐠 🐟 🐬 🐳 🦈 🐊 🐘 🦒 🐪 🐎 🐑 🐐 🦌 🐕 🐈 🐇 🐾'.split(' ') },
  { id: 'tecnologia',    icon: '📱', emojis: '📱 💻 🖥️ 🖨️ ⌨️ 🖱️ 💾 💿 📀 📼 📷 📸 📹 🎥 📞 ☎️ 📺 📻 🎙️ 🧭 ⏱️ ⏰ 🕰️ ⌛ ⏳ 📡 🔋 🔌 💡 🔦 🪔 🛜 🔍 🔎'.split(' ') },
  { id: 'regali',        icon: '🎁', emojis: '🎁 🎀 🎉 🎊 🎈 🪅 🪆 🎂 🥳 🎄 🎃 🎆 🎇 🧧 💝 💐 🌹 🌷 🌻 🌸 💮 🍾 🥂'.split(' ') },
  { id: 'viaggi',        icon: '✈️', emojis: '✈️ 🗺️ 🧳 🎒 🏖️ 🏝️ 🏔️ ⛰️ 🌋 🏕️ ⛺ 🏞️ 🌅 🌄 🌠 🛤️ 🚂 🛳️ 🛥️ 🛩️ 🏨 🏰 🏯 🗼 🗽 ⛩️ ⛪ 🕌 🛕 🌍 🌎 🌏 📸 🗿'.split(' ') },
  { id: 'lavoro',        icon: '💼', emojis: '💼 🗂️ 📁 📂 📋 📌 📍 📎 ✂️ 🖊️ 🖋️ ✒️ 📐 📏 📑 📕 📗 📘 📙 📰 ⏰ 🏢 🖥️ ⌨️ 📞 📧 ✉️ 🪧 📇 📒'.split(' ') },
  { id: 'soldi',         icon: '💰', emojis: '💰 💵 💴 💶 💷 💸 💳 🪙 💎 🏦 🧾 📊 📈 📉 💹 🤑 🏧 🛒 🛍️ 🏪 🏬 💼'.split(' ') },
  { id: 'natura',        icon: '🌳', emojis: '🌳 🌲 🌴 🌵 🌿 ☘️ 🍀 🪴 🌱 🌾 🌻 🌹 🌷 🌼 🌸 💐 🪷 🌺 🌞 ☀️ 🌝 🌚 🌛 🌜 🌙 ⭐ 🌟 ✨ ☁️ ⛅ 🌧️ ⛈️ 🌨️ ❄️ ☃️ ⛄ 🌪️ 🌫️ 🌊 ☔'.split(' ') },
  { id: 'altro',         icon: '📦', emojis: '📦 📥 📤 📨 📩 📪 📫 ⭐ 🌟 ✨ 💫 ❤️ 🧡 💛 💚 💙 💜 🖤 💯 ✅ ❌ ✔️ ➕ ➖ ➗ ⚠️ 🚫 ❗ ❓ 💬 💭 🔔 🎯 🚩 🏁'.split(' ') }
];
// flat list (per uso di default / fallback)
const ALL_EMOJIS = EMOJI_CATS.flatMap(c => c.emojis);

// ─── STATE ──────────────────────────────────────────────────
const S = {
  cats: [],          // categorie complete
  tx: [],            // transazioni (cache locale: ultimi 3 mesi)
  budgets: [],       // budget anno corrente
  prefs: { theme: 'auto' },
  authorizedUsers: [],  // whitelist email per login Google
  currentUser: null,    // {email, nome} se loggato
  ts: 0,
  queue: [],
  // navigation
  currentView: 'home',
  currentMonth: null,  // {anno, mese}
  // filters
  listFilter: 'all',
  donutFilter: null,   // categoria_id se filtrato
  listPeriod: 'current', // current (segue header) | custom (range scelto)
  listFrom: null,       // YYYY-MM-DD (per custom)
  listTo: null,         // YYYY-MM-DD (per custom)
  // Filtri avanzati lista (modal "Seleziona filtri")
  filtersCats: [],      // categorie selezionate (array di id)
  filtersAutori: [],    // autori selezionati (array di stringhe)
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
  // carousel "Uscite per categoria / Trend mesi" in pagina Riepilogo
  carouselSlide: 0,          // 0=donut, 1=trend mesi
  trendRange: null,          // {from:{anno,mese}, to:{anno,mese}} (default: ultimi 3 mesi)
  trend3mCache: null,        // {key, data}
  autoreDonutCache: null,    // {key, segs} per il donut "Uscite per autore"
  // pending tx tmp ids
  pendingTxIds: new Set()
};

// ─── DOM CACHE ──────────────────────────────────────────────
const D = {};
function cacheDOM() {
  ['appTitle','appSubtitle','monthLabel','btnMonthPrev','btnMonthNext','btnUpdate','themeToggle',
   'bcRoot','bcModule','bcLeaf',
   'moduleActions','moduleMonth','moduleActionPills',
   'view-home','view-conti','view-list','view-cat',
   'homeContiDonut','homeContiSaldo','homeContiSubtle','goToList','goToCategorie',
   'saldoNum','saldoIn','saldoOut','ultime','donutWrap',
   'carouselTrack','carouselPrev','carouselNext','carouselTitle','carouselDots',
   'trendFrom','trendTo','trend3mWrap',
   'autoreFrom','autoreTo',
   'listFilters','txList','activeFiltersBar',
   'btnTogglePeriod','btnOpenFilters','filterBadge',
   'modalFilters','filterCats','filterAutori','btnApplyFilters','btnResetFilters',
   'listPeriodCustom','listPeriodFrom','listPeriodTo','listPeriodSummary',
   'budgetList','catTabs','catList','btnAddCat',
   'fab','toast',
   // modals
   'modalQa','sheetQa','qaToggle','qaAmt','qaAmtVal','numpad','qaCats','qaTitle','qaDesc','qaAutore',
   'qaDateBtn','qaDateLabel','qaDatePicker','qaSaveBtn','qaSaveLabel',
   'modalTx','txEditAmt','txEditTipo','txEditCat','txEditData','txEditDesc','txEditAutore','txEditSave','txEditDelete',
   'modalCat','catEditTitle','catEditName','catEditTipo','catEditEmojis','catEditColors','catEditSave','catEditDelete',
   'modalBudget','budgetEditTitle','budgetEditAmt','budgetEditSave','budgetEditDelete',
   'modalSettings','setTheme','setSave','setClearCache','setVersion',
   'setUsersList','setAddUser','setLogout',
   'modalUser','userEditTitle','userEditNome','userEditEmail','userEditSave',
   'autoreDonutWrap'

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

// Colori per macrocategoria — usati sia nel donut che nel line trend
const MACRO_COLORS = {
  casa:'#3498db', cibo:'#e74c3c', bollette:'#f39c12', trasporti:'#9b59b6',
  salute:'#1abc9c', svago:'#34d399', sport:'#16a34a', abbigliamento:'#a777e3',
  famiglia:'#f472b6', animali:'#fb923c', tecnologia:'#0ea5e9', regali:'#ff5722',
  viaggi:'#06b6d4', lavoro:'#64748b', soldi:'#2ecc71', natura:'#22c55e', altro:'#94a3b8',
  simboli:'#7f8c8d'
};

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

// Twemoji helper: sostituisce emoji native con immagini SVG cartoon (Twitter style)
function twemojify(el) {
  if (typeof twemoji === 'undefined') return;
  if (!el) el = document.body;
  try {
    twemoji.parse(el, { folder: 'svg', ext: '.svg', base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' });
  } catch (e) { console.warn('twemoji parse failed', e); }
}

const TOAST_ICONS = { success: '✓', error: '✕', warn: '!', info: 'i' };
function toast(msg, type, ms) {
  if (!type) type = 'info';
  const el = D.toast;
  if (!el) return;
  const icEl = document.getElementById('toastIc');
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg;
  else el.textContent = msg;
  if (icEl) icEl.textContent = TOAST_ICONS[type] || 'i';
  // Esiti delle operazioni (success/error) → toast centrato verticalmente
  const isResult = (type === 'success' || type === 'error');
  el.className = 'toast show toast-' + type + (isResult ? ' toast-center' : '');
  clearTimeout(toast._t);
  const dur = ms || (type === 'error' ? 2400 : (type === 'warn' ? 2200 : 1700));
  toast._t = setTimeout(() => el.classList.remove('show'), dur);
}

// Helper: spinner sui bottoni durante operazioni async (salva/elimina).
// Sostituisce il contenuto del bottone con uno spinner e lo disabilita;
// al ripristino rimette il testo originale.
function setBtnLoading(btn, on) {
  if (!btn) return;
  if (on) {
    if (!btn.dataset.origHtml) btn.dataset.origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="btn-spinner"></span>';
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    if (btn.dataset.origHtml !== undefined) {
      btn.innerHTML = btn.dataset.origHtml;
      delete btn.dataset.origHtml;
    }
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// Esegue un'operazione async mostrando spinner sul bottone, toast esito,
// e chiusura modal in caso di successo.
// opts: { btn, modal, okMsg, errMsg }
async function withSpinnerOp(op, opts) {
  opts = opts || {};
  setBtnLoading(opts.btn, true);
  try {
    await op();
    if (opts.modal) closeModal(opts.modal);
    toast(opts.okMsg || 'Salvato', 'success');
    return true;
  } catch (e) {
    console.warn('[withSpinnerOp] errore', e);
    toast((opts.errMsg || 'Errore') + ': ' + (e && e.message ? e.message : 'operazione non riuscita'), 'error');
    return false;
  } finally {
    setBtnLoading(opts.btn, false);
  }
}

// Confirm dialog elegante (sostituisce window.confirm)
// Ritorna una Promise<boolean>.
function confirmDlg(opts) {
  // opts: {title, message, confirmLabel, cancelLabel, danger}
  return new Promise(resolve => {
    const tEl = document.getElementById('confirmTitle');
    const mEl = document.getElementById('confirmMsg');
    const okEl = document.getElementById('confirmOk');
    const cancelEl = document.getElementById('confirmCancel');
    if (tEl) tEl.textContent = opts.title || 'Conferma';
    if (mEl) mEl.textContent = opts.message || '';
    if (okEl) {
      okEl.textContent = opts.confirmLabel || 'Conferma';
      okEl.className = opts.danger ? 'btn-danger' : 'btn-primary';
      okEl.style.marginTop = '8px';
    }
    if (cancelEl) cancelEl.textContent = opts.cancelLabel || 'Annulla';
    let settled = false;
    function settle(v) {
      if (settled) return;
      settled = true;
      okEl && okEl.removeEventListener('click', onOk);
      cancelEl && cancelEl.removeEventListener('click', onCancel);
      const modal = document.getElementById('modalConfirm');
      modal && modal.removeEventListener('cdc:closed', onClosed);
      closeModal('modalConfirm');
      resolve(v);
    }
    function onOk()     { settle(true); }
    function onCancel() { settle(false); }
    function onClosed() { settle(false); }
    okEl && okEl.addEventListener('click', onOk);
    cancelEl && cancelEl.addEventListener('click', onCancel);
    const modal = document.getElementById('modalConfirm');
    modal && modal.addEventListener('cdc:closed', onClosed);
    openModal('modalConfirm');
  });
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
  if (S.queue.length === 0 && remaining.length === 0) {
    await fullReload();
    toast('Sincronizzato', 'success');
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
  // Ogni render è isolato: un errore in una view non deve bloccare le altre.
  try { renderHeader();        } catch (e) { console.warn('[renderAll] renderHeader',        e); }
  try { renderHomeGestione();  } catch (e) { console.warn('[renderAll] renderHomeGestione',  e); }
  try { renderConti();         } catch (e) { console.warn('[renderAll] renderConti',         e); }
  try { renderList();          } catch (e) { console.warn('[renderAll] renderList',          e); }
  try { renderCatView();       } catch (e) { console.warn('[renderAll] renderCatView',       e); }
  try { renderSettings();      } catch (e) { console.warn('[renderAll] renderSettings',      e); }
}

// ─── HEADER ─────────────────────────────────────────────────
function renderHeader() {
  if (!S.currentMonth) initMonth();
  // Default: nome del mese + frecce visibili
  let label = MESI_FULL[S.currentMonth.mese - 1] + ' ' + S.currentMonth.anno;
  let showArrows = true;
  // Eccezione: in view 'list' con periodo custom selezionato, mostriamo il range
  // (es. "01 MAG 2026 - 05 LUG 2026") e nascondiamo le frecce mese
  if (S.currentView === 'list' && S.listPeriod === 'custom' && S.listFrom && S.listTo) {
    label = fmtDataLong(S.listFrom) + ' – ' + fmtDataLong(S.listTo);
    showArrows = false;
  }
  if (D.monthLabel) {
    D.monthLabel.textContent = label;
    D.monthLabel.classList.toggle('range-mode', !showArrows);
  }
  if (D.btnMonthPrev) D.btnMonthPrev.style.visibility = showArrows ? 'visible' : 'hidden';
  if (D.btnMonthNext) D.btnMonthNext.style.visibility = showArrows ? 'visible' : 'hidden';
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
  // Reset del trendRange: l'andamento mesi e il donut autori seguono il
  // nuovo mese di riferimento (default = mese corrente + 2 precedenti)
  S.trendRange = null;
  S.trend3mCache = null;
  S.autoreDonutCache = null;
  renderHeader();
  // 1° render IMMEDIATO con dati in cache (anche se vuoti) — così l'UI
  // reagisce subito al cambio mese
  renderHomeGestione(); renderConti(); renderList();
  // 2° render dopo il fetch (se servono dati del nuovo mese non in cache)
  ensureMonthLoaded().then(() => {
    renderHomeGestione(); renderConti(); renderList();
  });
}

function shiftMeseCmp(delta) {
  if (!S.meseCmp) S.meseCmp = Object.assign({}, S.currentMonth);
  let { anno, mese } = S.meseCmp;
  mese += delta;
  while (mese < 1) { mese += 12; anno--; }
  while (mese > 12) { mese -= 12; anno++; }
  S.meseCmp = { anno, mese };
  renderCompareMonth();
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

function renderConti() {
  if (!S.currentMonth) return;
  const arr = txInCurrentMonth();
  const inSum = arr.filter(t => t.tipo === 'entrata').reduce((s, t) => s + Number(t.importo), 0);
  const outSum = arr.filter(t => t.tipo === 'uscita').reduce((s, t) => s + Number(t.importo), 0);
  const saldo = inSum - outSum;
  D.saldoNum.textContent = (saldo >= 0 ? '+' : '−') + fmtEur(Math.abs(saldo)).slice(1);
  D.saldoNum.className = 'saldo-num ' + (saldo >= 0 ? 'pos' : 'neg');
  D.saldoIn.textContent = fmtEur(inSum);
  D.saldoOut.textContent = fmtEur(outSum);

  // Ultime 4
  const ultime = arr.slice(0, 4);
  if (!ultime.length) {
    D.ultime.innerHTML = '<div class="txt-faint mt-8" style="font-size:13px">Nessuna transazione in questo mese.</div>';
  } else {
    D.ultime.innerHTML = '<div class="mt-16"></div>' + ultime.map(txRowHtml).join('');
    bindTxRows(D.ultime);
  twemojify(D.ultime);
  }

  // Donut uscite RAGGRUPPATO PER MACRO-CATEGORIA
  const uscByMacro = {};
  arr.filter(t => t.tipo === 'uscita').forEach(t => {
    const c = catById(t.categoria_id);
    const macroId = (c && c.macro_categoria) || 'simboli';
    if (!uscByMacro[macroId]) uscByMacro[macroId] = { total: 0, breakdown: {} };
    uscByMacro[macroId].total += Number(t.importo);
    const cid = t.categoria_id || 0;
    uscByMacro[macroId].breakdown[cid] = (uscByMacro[macroId].breakdown[cid] || 0) + Number(t.importo);
  });
  const segs = Object.keys(uscByMacro).map(macroId => {
    const m = macroById(macroId);
    return {
      label: m ? (m.icon + ' ' + macroLabel(macroId)) : 'Senza categoria',
      value: uscByMacro[macroId].total,
      color: MACRO_COLORS[macroId] || '#666',
      macroId: macroId,
      onClick: function () {
        S.donutFilter = { type: 'macro', value: macroId };
        S.listFilter = 'uscita';
        switchView('list');
      }
    };
  });
  Charts.renderDonut(D.donutWrap, segs, { subLabel: 'uscite mese' });

  // Carousel: aggiorna anche le altre slide (trend + donut autori)
  ensureTrendRangeDefault();
  populateTrendSelects();
  renderTrend3m();
  renderAutoreDonut();
  updateCarouselTitle();
}

// Donut "Uscite per autore" — usa lo stesso range del trend mesi
// (default: mese corrente + 2 mesi precedenti). Mostra il totale numerico
// al centro e le percentuali nella legend, un colore per autore.
async function renderAutoreDonut() {
  const wrap = D.autoreDonutWrap || document.getElementById('autoreDonutWrap');
  if (!wrap) {
    console.warn('[renderAutoreDonut] elemento #autoreDonutWrap mancante');
    return;
  }
  ensureTrendRangeDefault();
  const r = S.trendRange;
  // assicura from <= to (string YYYY-MM-DD)
  if (r.from > r.to) { const tmp = r.from; r.from = r.to; r.to = tmp; }
  const startStr = r.from;
  const endStr   = r.to;

  // chiave cache: stessa chiave del trend (riusa il fetch quando possibile)
  const key = startStr + '..' + endStr + '@' + (S.ts || 0);
  let segs = (S.autoreDonutCache && S.autoreDonutCache.key === key) ? S.autoreDonutCache.segs : null;

  if (!segs) {
    try {
      const rows = await supaFetch(T.TX + '?select=importo,tipo,autore&data=gte.' + startStr + '&data=lte.' + endStr);
      const byAut = {};
      (rows || []).filter(x => x.tipo === 'uscita').forEach(rec => {
        const nome = (rec.autore && String(rec.autore).trim()) || '(non attribuito)';
        byAut[nome] = (byAut[nome] || 0) + Number(rec.importo);
      });
      segs = Object.entries(byAut)
        .sort((a, b) => b[1] - a[1])
        .map(([nome, total]) => ({
          label: nome,
          value: total,
          color: colorForAutore(nome === '(non attribuito)' ? null : nome),
          onClick: function () {
            // Click → filtra la lista per quell'autore nel range
            S.filtersAutori = [nome];
            S.filtersCats = [];
            S.donutFilter = null;
            S.listFilter = 'uscita';
            // Imposta il periodo della lista al range del donut
            S.listPeriod = 'custom';
            S.listFrom = startStr;
            S.listTo = endStr;
            switchView('list');
          }
        }));
      S.autoreDonutCache = { key, segs };
    } catch (e) {
      console.warn('[renderAutoreDonut] fetch fallito', e);
      wrap.innerHTML = '<div class="empty"><div class="emoji">📡</div><div>Dati non disponibili offline</div></div>';
      return;
    }
  }

  if (!segs.length) {
    wrap.innerHTML = '<div class="empty"><div class="emoji">👥</div><div>Nessuna uscita nel periodo</div></div>';
    return;
  }
  // Renderizza con totale numerico al centro (default) e percentuali in legend
  Charts.renderDonut(wrap, segs, { subLabel: 'uscite periodo' });
}

// ─── CAROUSEL: donut ↔ trend mesi ───────────────────────────
// S.trendRange = { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' } (range giornaliero)
// Default: dal 1° giorno di (mese corrente - 2 mesi) all'ultimo giorno del
// mese corrente. Es. mese corrente Maggio 2026 → 2026-03-01 ↔ 2026-05-31.
function ensureTrendRangeDefault() {
  if (S.trendRange && S.trendRange.from && S.trendRange.to) return;
  const cm = S.currentMonth || { anno: new Date().getFullYear(), mese: new Date().getMonth() + 1 };
  let fromY = cm.anno, fromM = cm.mese - 2;
  while (fromM < 1) { fromM += 12; fromY--; }
  const lastDay = new Date(cm.anno, cm.mese, 0).getDate();
  S.trendRange = {
    from: fromY + '-' + String(fromM).padStart(2, '0') + '-01',
    to:   cm.anno + '-' + String(cm.mese).padStart(2, '0') + '-' + String(lastDay).padStart(2, '0')
  };
}

function monthKeyYM(y, m) { return y + '-' + String(m).padStart(2, '0'); }

function syncTrendDateInputs() {
  if (!S.trendRange) ensureTrendRangeDefault();
  const f = S.trendRange.from, t = S.trendRange.to;
  console.log('[syncTrendDateInputs] f=', f, 't=', t, 'inputs:', !!D.trendFrom, !!D.trendTo, !!D.autoreFrom, !!D.autoreTo);
  if (D.trendFrom)  { D.trendFrom.value  = f; D.trendFrom.defaultValue  = f; }
  if (D.trendTo)    { D.trendTo.value    = t; D.trendTo.defaultValue    = t; }
  if (D.autoreFrom) { D.autoreFrom.value = f; D.autoreFrom.defaultValue = f; }
  if (D.autoreTo)   { D.autoreTo.value   = t; D.autoreTo.defaultValue   = t; }
}
// Compat: il nome vecchio è ancora referenziato altrove (renderConti) — lo aliaso
const populateTrendSelects = syncTrendDateInputs;

async function renderTrend3m() {
  if (!D.trend3mWrap) return;
  ensureTrendRangeDefault();
  const r = S.trendRange;
  // assicura from <= to (string compare lexicografico funziona su YYYY-MM-DD)
  if (r.from > r.to) { const tmp = r.from; r.from = r.to; r.to = tmp; }
  const startStr = r.from;
  const endStr   = r.to;
  // calcola lista mesi nel range (incluso quello di endStr) per il grafico
  const fromParts = startStr.split('-').map(Number);
  const toParts   = endStr.split('-').map(Number);
  const months = [];
  let y = fromParts[0], m = fromParts[1];
  while (y < toParts[0] || (y === toParts[0] && m <= toParts[1])) {
    months.push({ y, m });
    m++; if (m > 12) { m = 1; y++; }
    if (months.length > 36) break; // safety
  }
  const labels = months.map(o => MESI_SHORT[o.m - 1] + (o.m === 1 ? ' \'' + String(o.y).slice(-2) : ''));

  // chiave cache: range giornaliero + ts
  const key = startStr + '..' + endStr + '@' + (S.ts || 0);
  let data = S.trend3mCache && S.trend3mCache.key === key ? S.trend3mCache.data : null;
  if (!data) {
    try {
      const rows = await supaFetch(T.TX + '?select=data,importo,tipo,categoria_id&data=gte.' + startStr + '&data=lte.' + endStr);
      // buckets[macroId][monthKey] = somma uscite
      const macroBuckets = {};
      (rows || []).forEach(rec => {
        if (rec.tipo !== 'uscita') return;
        const c = catById(rec.categoria_id);
        const macroId = (c && c.macro_categoria) || 'simboli';
        const [yy, mm] = rec.data.split('-');
        const k = monthKeyYM(Number(yy), Number(mm));
        if (!macroBuckets[macroId]) {
          macroBuckets[macroId] = {};
          months.forEach(o => { macroBuckets[macroId][monthKeyYM(o.y, o.m)] = 0; });
        }
        macroBuckets[macroId][k] = (macroBuckets[macroId][k] || 0) + Number(rec.importo);
      });
      // converti in serie ordinate per total desc; click → filtra lista per quella macro
      const series = Object.keys(macroBuckets).map(macroId => {
        const points = months.map(o => macroBuckets[macroId][monthKeyYM(o.y, o.m)] || 0);
        const total = points.reduce((s, v) => s + v, 0);
        const macro = macroById(macroId);
        const label = (macro ? macro.icon + ' ' : '') + (macro ? (macroLabel(macroId)) : 'Senza categoria');
        return {
          macroId,
          label,
          color: MACRO_COLORS[macroId] || '#666',
          points,
          total,
          onClick: function () {
            S.donutFilter = { type: 'macro', value: macroId };
            S.listFilter = 'uscita';
            // Imposta il filtro periodo della lista al range del trend corrente
            const tr = S.trendRange;
            if (tr && tr.from && tr.to) {
              S.listPeriod = 'custom';
              const fy = tr.from.anno, fm = String(tr.from.mese).padStart(2, '0');
              const ty = tr.to.anno, tm = String(tr.to.mese).padStart(2, '0');
              const lastDay = new Date(ty, tr.to.mese, 0).getDate();
              S.listFrom = fy + '-' + fm + '-01';
              S.listTo   = ty + '-' + tm + '-' + String(lastDay).padStart(2, '0');
            }
            switchView('list');
          }
        };
      }).filter(s => s.total > 0)
        .sort((a, b) => b.total - a.total);
      data = { series, labels };
      S.trend3mCache = { key, data };
    } catch (e) {
      console.warn('trend3m fetch failed', e);
      D.trend3mWrap.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Trend non disponibile</div></div>';
      return;
    }
  }
  if (!data.series.length) {
    D.trend3mWrap.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Nessuna uscita nel periodo</div></div>';
    return;
  }
  Charts.renderLine(D.trend3mWrap, data.series, data.labels, { yTicks: 5, legend: true });
}

const CAROUSEL_TITLES = ['Uscite per categoria', 'Andamento mesi', 'Uscite per autore'];
const CAROUSEL_MAX = CAROUSEL_TITLES.length - 1;

function updateCarouselTitle() {
  if (!D.carouselTitle) return;
  D.carouselTitle.textContent = CAROUSEL_TITLES[S.carouselSlide] || CAROUSEL_TITLES[0];
}

function setCarouselSlide(n) {
  if (!D.carouselTrack) return;
  // wrap-around: -1 → max, max+1 → 0
  let target = n;
  if (target < 0) target = CAROUSEL_MAX;
  else if (target > CAROUSEL_MAX) target = 0;
  S.carouselSlide = target;
  D.carouselTrack.style.transform = 'translateX(' + (-100 * S.carouselSlide) + '%)';
  $$('.carousel-dot', D.carouselDots).forEach((d, i) => d.classList.toggle('active', i === S.carouselSlide));
  updateCarouselTitle();
  if (S.carouselSlide === 1) renderTrend3m();
  if (S.carouselSlide === 2) renderAutoreDonut();
}

function bindCarousel() {
  if (D.carouselPrev) D.carouselPrev.addEventListener('click', () => setCarouselSlide(S.carouselSlide - 1));
  if (D.carouselNext) D.carouselNext.addEventListener('click', () => setCarouselSlide(S.carouselSlide + 1));
  if (D.carouselDots) $$('.carousel-dot', D.carouselDots).forEach(d => {
    d.addEventListener('click', () => setCarouselSlide(Number(d.getAttribute('data-go') || 0)));
  });
  // Helper: setta from o to (string YYYY-MM-DD) + sincronizza ENTRAMBI i
  // set di date picker + invalida cache + ri-renderizza le due slide che
  // usano il range condiviso
  function setTrendFrom(value) {
    if (!value) return;
    S.trendRange.from = value;
    S.trend3mCache = null;
    S.autoreDonutCache = null;
    syncTrendDateInputs();
    renderTrend3m();
    renderAutoreDonut();
  }
  function setTrendTo(value) {
    if (!value) return;
    S.trendRange.to = value;
    S.trend3mCache = null;
    S.autoreDonutCache = null;
    syncTrendDateInputs();
    renderTrend3m();
    renderAutoreDonut();
  }
  if (D.trendFrom)  D.trendFrom.addEventListener('change',  () => setTrendFrom(D.trendFrom.value));
  if (D.trendTo)    D.trendTo.addEventListener('change',    () => setTrendTo(D.trendTo.value));
  if (D.autoreFrom) D.autoreFrom.addEventListener('change', () => setTrendFrom(D.autoreFrom.value));
  if (D.autoreTo)   D.autoreTo.addEventListener('change',   () => setTrendTo(D.autoreTo.value));
  // swipe touch sulla viewport
  const vp = D.carouselTrack && D.carouselTrack.parentElement;
  if (vp) {
    let startX = 0, dx = 0, swiping = false;
    vp.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX; dx = 0; swiping = true;
    }, { passive: true });
    vp.addEventListener('touchmove', e => {
      if (!swiping) return;
      dx = e.touches[0].clientX - startX;
    }, { passive: true });
    vp.addEventListener('touchend', () => {
      if (!swiping) return;
      swiping = false;
      if (Math.abs(dx) > 40) {
        if (dx < 0) setCarouselSlide(S.carouselSlide + 1);
        else setCarouselSlide(S.carouselSlide - 1);
      }
    });
  }
}

// ─── HOME GESTIONE CASA (widget moduli) ─────────────────────
const DEFAULT_MODULI_ORDER = ['conti', 'spesa', 'todo', 'scadenze'];
function applyModuliOrder() {
  const grid = document.querySelector('.module-grid');
  if (!grid) return;
  const order = (S.prefs.moduliOrder && S.prefs.moduliOrder.length) ? S.prefs.moduliOrder : DEFAULT_MODULI_ORDER;
  const cards = Array.from(grid.querySelectorAll('.module-card'));
  const byMod = {};
  cards.forEach(c => { byMod[c.getAttribute('data-mod')] = c; });
  order.forEach(mod => { if (byMod[mod]) grid.appendChild(byMod[mod]); });
  cards.forEach(c => {
    const m = c.getAttribute('data-mod');
    if (!order.includes(m)) grid.appendChild(c);
  });
  twemojify(grid);
}

let _moduliDragBound = false;
// Drag custom touch-friendly per i widget moduli (HTML5 dnd non funziona su iOS Safari)
function bindModuliDrag() {
  if (_moduliDragBound) return;
  _moduliDragBound = true;
  const grid = document.querySelector('.module-grid');
  if (!grid) return;
  grid.querySelectorAll('.mc-drag').forEach(handle => {
    let isDragging = false;
    let startY = 0;
    let startTop = 0;
    let card = null;
    let cardHeight = 0;
    let placeholder = null;
    let initialOrder = '';

    function cleanup() {
      if (card) {
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';
        card.style.opacity = '';
        card.classList.remove('dragging-mod');
      }
      if (placeholder && placeholder.parentNode) {
        if (card) placeholder.parentNode.insertBefore(card, placeholder);
        placeholder.remove();
      }
      placeholder = null;
      card = null;
      isDragging = false;
    }

    handle.addEventListener('pointerdown', e => {
      e.preventDefault();
      e.stopPropagation();
      const cardEl = handle.closest('.module-card');
      if (!cardEl) return;
      card = cardEl;
      const rect = card.getBoundingClientRect();
      startY = e.clientY;
      startTop = rect.top;
      cardHeight = card.offsetHeight;
      initialOrder = Array.from(grid.querySelectorAll('.module-card')).map(c => c.getAttribute('data-mod')).join('|');
      try { handle.setPointerCapture(e.pointerId); } catch {}

      // crea placeholder con bordo tratteggiato
      placeholder = document.createElement('div');
      placeholder.style.cssText = 'height:' + cardHeight + 'px;background:var(--surface-2);border:2px dashed var(--accent);border-radius:16px;margin-bottom:14px;box-sizing:border-box;opacity:.5;';
      card.parentNode.insertBefore(placeholder, card);

      // rendi la card flottante
      card.style.position = 'fixed';
      card.style.top = rect.top + 'px';
      card.style.left = rect.left + 'px';
      card.style.width = rect.width + 'px';
      card.style.zIndex = '1000';
      card.style.pointerEvents = 'none';
      card.style.opacity = '0.92';
      card.classList.add('dragging-mod');
      isDragging = true;
    });

    handle.addEventListener('pointermove', e => {
      if (!isDragging || !card) return;
      const dy = e.clientY - startY;
      card.style.top = (startTop + dy) + 'px';
      // posizione del centro della card draggata
      const cy = startTop + dy + cardHeight / 2;
      // trova dove inserire il placeholder
      const others = Array.from(grid.querySelectorAll('.module-card:not(.dragging-mod)'));
      let inserted = false;
      for (const c of others) {
        const r = c.getBoundingClientRect();
        if (cy < r.top + r.height / 2) {
          if (placeholder.nextSibling !== c) grid.insertBefore(placeholder, c);
          inserted = true;
          break;
        }
      }
      if (!inserted && grid.lastElementChild !== placeholder) {
        grid.appendChild(placeholder);
      }
    });

    handle.addEventListener('pointerup', async e => {
      if (!isDragging || !card) return;
      try { handle.releasePointerCapture(e.pointerId); } catch {}
      cleanup();
      // ordine finale
      const newOrder = Array.from(grid.querySelectorAll('.module-card')).map(c => c.getAttribute('data-mod')).join('|');
      if (newOrder !== initialOrder) {
        await persistModuliOrder();
      }
    });

    handle.addEventListener('pointercancel', cleanup);
  });
}

async function persistModuliOrder() {
  const grid = document.querySelector('.module-grid');
  if (!grid) return;
  const ids = Array.from(grid.querySelectorAll('.module-card')).map(el => el.getAttribute('data-mod'));
  S.prefs.moduliOrder = ids;
  saveLocalCache();
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: S.prefs }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
  toast('Ordine widget salvato', 'success');
}

function renderHomeGestione() {
  // Riordina i widget secondo le preferenze utente
  applyModuliOrder();
  bindModuliDrag();
  // Widget Conti di Casa: mini donut uscite + saldo del mese
  const arr = txInCurrentMonth();
  const inSum  = arr.filter(t => t.tipo === 'entrata').reduce((s, t) => s + Number(t.importo), 0);
  const outSum = arr.filter(t => t.tipo === 'uscita').reduce((s, t) => s + Number(t.importo), 0);
  const saldo  = inSum - outSum;

  if (D.homeContiSaldo) {
    D.homeContiSaldo.textContent = (saldo >= 0 ? '+' : '−') + fmtEur(Math.abs(saldo)).slice(1);
    D.homeContiSaldo.className = 'mc-saldo ' + (saldo >= 0 ? 'pos' : 'neg');
  }
  if (D.homeContiSubtle && S.currentMonth) {
    D.homeContiSubtle.textContent = MESI_FULL[S.currentMonth.mese - 1] + ' ' + S.currentMonth.anno;
  }

  // Mini donut: uscite per macro categoria (no testo centro, no legenda)
  if (D.homeContiDonut) {
    const uscByMacro = {};
    arr.filter(t => t.tipo === 'uscita').forEach(t => {
      const c = catById(t.categoria_id);
      const macroId = (c && c.macro_categoria) || 'altro';
      uscByMacro[macroId] = (uscByMacro[macroId] || 0) + Number(t.importo);
    });
    const MACRO_COLORS = {
      casa:'#3498db', cibo:'#e74c3c', bollette:'#f39c12', trasporti:'#9b59b6',
      salute:'#1abc9c', svago:'#34d399', sport:'#16a34a', abbigliamento:'#a777e3',
      famiglia:'#f472b6', animali:'#fb923c', tecnologia:'#0ea5e9', regali:'#ff5722',
      viaggi:'#06b6d4', lavoro:'#64748b', soldi:'#2ecc71', natura:'#22c55e', altro:'#94a3b8'
    };
    const segs = Object.keys(uscByMacro).map(macroId => ({
      label: macroLabel(macroId),
      value: uscByMacro[macroId],
      color: MACRO_COLORS[macroId] || '#666'
    }));
    if (segs.length) {
      Charts.renderDonut(D.homeContiDonut, segs, { noText: true, noLegend: true });
    } else {
      D.homeContiDonut.innerHTML = '<div style="width:100px;height:100px;display:grid;place-items:center;color:var(--text-faint);font-size:11px;text-align:center">Nessuna<br>uscita</div>';
    }
  }
}

// ─── TREND DEL MESE INTERO (selettore indipendente) ─────────
function renderMeseTrend() {
  if (!D.meseTrendChart) return;
  if (!S.meseTrend) S.meseTrend = Object.assign({}, S.currentMonth);
  if (D.meseTrendLabel) D.meseTrendLabel.textContent = MESI_FULL[S.meseTrend.mese - 1] + ' ' + S.meseTrend.anno;

  // Assicuro che le tx del mese siano caricate
  const { anno, mese } = S.meseTrend;
  const has = S.tx.some(t => inMonth(t.data, anno, mese));
  if (!has) {
    // Lazy load del mese e poi re-render
    const start = anno + '-' + String(mese).padStart(2,'0') + '-01';
    const lastDay = new Date(anno, mese, 0).getDate();
    const end = anno + '-' + String(mese).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
    D.meseTrendChart.innerHTML = '<div class="empty"><div class="emoji">⏳</div><div>Caricamento…</div></div>';
    supaFetch(T.TX + '?select=*&data=gte.' + start + '&data=lte.' + end + '&order=data.desc,id.desc').then(rows => {
      if (rows && rows.length) {
        const ids = new Set(S.tx.map(t => t.id));
        rows.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
        saveLocalCache();
      }
      _drawMeseTrend();
    }).catch(() => _drawMeseTrend());
  } else {
    _drawMeseTrend();
  }
}
function _drawMeseTrend() {
  const { anno, mese } = S.meseTrend;
  const daysInMonth = new Date(anno, mese, 0).getDate();
  const arr = S.tx.filter(t => inMonth(t.data, anno, mese));
  if (!arr.length) {
    D.meseTrendChart.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Nessun movimento in questo mese</div></div>';
    return;
  }
  const usc = new Array(daysInMonth).fill(0);
  const ent = new Array(daysInMonth).fill(0);
  arr.forEach(t => {
    const d = Number(t.data.split('-')[2]);
    if (d >= 1 && d <= daysInMonth) {
      if (t.tipo === 'uscita') usc[d - 1] += Number(t.importo);
      else ent[d - 1] += Number(t.importo);
    }
  });
  const labels = [];
  for (let i = 1; i <= daysInMonth; i++) labels.push(String(i));
  Charts.renderLine(D.meseTrendChart, [
    { label: 'Uscite',  color: 'var(--danger)', points: usc },
    { label: 'Entrate', color: 'var(--ok)',     points: ent }
  ], labels);
}
function shiftMeseTrend(delta) {
  if (!S.meseTrend) S.meseTrend = Object.assign({}, S.currentMonth);
  let { anno, mese } = S.meseTrend;
  mese += delta;
  while (mese < 1) { mese += 12; anno--; }
  while (mese > 12) { mese -= 12; anno++; }
  S.meseTrend = { anno, mese };
  renderMeseTrend();
}

// ─── CONFRONTO COL MESE PRECEDENTE (selettore indipendente) ─
function renderCompareMonth() {
  if (!D.compareWrap) return;
  if (!S.meseCmp) S.meseCmp = Object.assign({}, S.currentMonth);
  if (D.meseCmpLabel) D.meseCmpLabel.textContent = MESI_FULL[S.meseCmp.mese - 1] + ' ' + S.meseCmp.anno;

  const { anno, mese } = S.meseCmp;
  let prevY = anno, prevM = mese - 1;
  if (prevM < 1) { prevM = 12; prevY--; }

  // Assicura tx caricate per entrambi i mesi
  function loadIfMissing(y, m) {
    const has = S.tx.some(t => inMonth(t.data, y, m));
    if (has) return Promise.resolve();
    const start = y + '-' + String(m).padStart(2,'0') + '-01';
    const lastDay = new Date(y, m, 0).getDate();
    const end = y + '-' + String(m).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
    return supaFetch(T.TX + '?select=*&data=gte.' + start + '&data=lte.' + end).then(rows => {
      if (rows && rows.length) {
        const ids = new Set(S.tx.map(t => t.id));
        rows.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
        saveLocalCache();
      }
    }).catch(() => {});
  }
  D.compareWrap.innerHTML = '<div class="empty"><div class="emoji">⏳</div><div>Caricamento…</div></div>';
  Promise.all([loadIfMissing(anno, mese), loadIfMissing(prevY, prevM)]).then(() => _drawCompare(anno, mese, prevY, prevM));
}
function _drawCompare(anno, mese, prevY, prevM) {
  const curArr  = S.tx.filter(t => inMonth(t.data, anno, mese));
  const prevArr = S.tx.filter(t => inMonth(t.data, prevY, prevM));

  function sumByMacro(arr) {
    const m = {};
    arr.filter(t => t.tipo === 'uscita').forEach(t => {
      const c = catById(t.categoria_id);
      const macroId = (c && c.macro_categoria) || 'altro';
      m[macroId] = (m[macroId] || 0) + Number(t.importo);
    });
    return m;
  }
  const curByMacro  = sumByMacro(curArr);
  const prevByMacro = sumByMacro(prevArr);
  const allMacros = new Set([...Object.keys(curByMacro), ...Object.keys(prevByMacro)]);

  if (!allMacros.size) {
    D.compareWrap.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Nessuna spesa nei 2 mesi</div></div>';
    return;
  }

  // ordina per max(cur, prev) decrescente
  const rows = Array.from(allMacros).map(id => ({
    id,
    cur: curByMacro[id] || 0,
    prev: prevByMacro[id] || 0
  }));
  rows.sort((a, b) => Math.max(b.cur, b.prev) - Math.max(a.cur, a.prev));
  const maxVal = Math.max(...rows.map(r => Math.max(r.cur, r.prev))) || 1;

  let html = '';
  rows.forEach(r => {
    const m = macroById(r.id);
    const macroIcon = m ? m.icon : '📦';
    let delta = 0;
    let deltaCls = 'same';
    let deltaTxt = '—';
    if (r.prev > 0) {
      delta = ((r.cur - r.prev) / r.prev) * 100;
      if (Math.abs(delta) < 1) { deltaCls = 'same'; deltaTxt = '≈'; }
      else if (delta > 0)      { deltaCls = 'up';   deltaTxt = '+' + delta.toFixed(0) + '%'; }
      else                     { deltaCls = 'down'; deltaTxt = delta.toFixed(0) + '%'; }
    } else if (r.cur > 0) {
      deltaCls = 'up'; deltaTxt = 'NEW';
    } else if (r.prev > 0) {
      deltaCls = 'down'; deltaTxt = '−100%';
    }
    const curW  = (r.cur  / maxVal) * 100;
    const prevW = (r.prev / maxVal) * 100;
    html += '<div class="compare-row">' +
      '<div class="compare-top">' +
        '<span class="cmp-name">' + macroIcon + ' ' + esc(macroLabel(r.id)) + '</span>' +
        '<span class="cmp-delta ' + deltaCls + '">' + deltaTxt + '</span>' +
      '</div>' +
      '<div class="compare-bars">' +
        '<div class="compare-bar-row cur">' +
          '<span class="cmp-bar-label">ora</span>' +
          '<div class="cmp-bar"><div class="cmp-bar-fill" style="width:' + curW + '%"></div></div>' +
          '<span class="cmp-val">' + Charts.fmtEurShort(r.cur) + '</span>' +
        '</div>' +
        '<div class="compare-bar-row prev">' +
          '<span class="cmp-bar-label">prec</span>' +
          '<div class="cmp-bar"><div class="cmp-bar-fill" style="width:' + prevW + '%"></div></div>' +
          '<span class="cmp-val">' + Charts.fmtEurShort(r.prev) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  D.compareWrap.innerHTML = html;
}

// ─── HEATMAP CALENDARIO ─────────────────────────────────────
function renderHeatmap(arrCurrentMonth) {
  if (!D.heatmapWrap) return;
  const { anno, mese } = S.currentMonth;
  const daysInMonth = new Date(anno, mese, 0).getDate();
  const firstDow = (new Date(anno, mese - 1, 1).getDay() + 6) % 7; // 0 = lunedì
  const totByDay = new Array(daysInMonth).fill(0);
  arrCurrentMonth.filter(t => t.tipo === 'uscita').forEach(t => {
    const d = Number(t.data.split('-')[2]);
    if (d >= 1 && d <= daysInMonth) totByDay[d - 1] += Number(t.importo);
  });
  const maxV = Math.max.apply(null, totByDay);
  if (maxV <= 0) {
    D.heatmapWrap.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Nessuna uscita questo mese</div></div>';
    return;
  }
  function levelClass(v) {
    if (v <= 0) return 'empty';
    const r = v / maxV;
    if (r < 0.25) return 'l1';
    if (r < 0.50) return 'l2';
    if (r < 0.75) return 'l3';
    return 'l4';
  }
  const t = new Date();
  const todayStr = anno + '-' + String(mese).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
  const isCurrentMonth = (t.getFullYear() === anno && t.getMonth() + 1 === mese);

  let html = '<div class="heatmap-week-labels"><span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span></div>';
  html += '<div class="heatmap-grid">';
  for (let i = 0; i < firstDow; i++) html += '<div class="heatmap-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const v = totByDay[d - 1];
    const cls = levelClass(v);
    const todayCls = (isCurrentMonth && d === t.getDate()) ? ' today' : '';
    const dataCls = v > 0 ? ' has-data' : '';
    const title = v > 0 ? d + '/' + mese + ' — ' + Charts.fmtEur(v) : d + '/' + mese;
    html += '<div class="heatmap-cell ' + cls + dataCls + todayCls + '" title="' + title + '">' + d + '</div>';
  }
  html += '</div>';
  html += '<div class="heatmap-legend">' +
    '<span>meno</span>' +
    '<span class="hl-cell" style="background:var(--surface-2)"></span>' +
    '<span class="hl-cell l1"></span>' +
    '<span class="hl-cell l2"></span>' +
    '<span class="hl-cell l3"></span>' +
    '<span class="hl-cell l4"></span>' +
    '<span>più</span>' +
  '</div>';
  D.heatmapWrap.innerHTML = html;
}

// ─── TOP 5 SPESE DEL MESE ───────────────────────────────────
function renderTopSpese(arrCurrentMonth) {
  if (!D.topSpeseWrap) return;
  const usc = arrCurrentMonth.filter(t => t.tipo === 'uscita').slice();
  if (!usc.length) {
    D.topSpeseWrap.innerHTML = '<div class="empty" style="padding:18px 4px;font-size:13px"><div class="emoji">💸</div><div>Nessuna spesa questo mese</div></div>';
    return;
  }
  usc.sort((a, b) => Number(b.importo) - Number(a.importo));
  const top = usc.slice(0, 5);
  let html = '';
  top.forEach((t, idx) => {
    const c = catById(t.categoria_id);
    const icon = c ? c.icona : '📦';
    const color = c ? c.colore : '#94a3b8';
    const name = c ? c.nome : 'Senza categoria';
    const meta = [fmtData(t.data), t.descrizione || '', t.autore ? '👤 ' + t.autore : ''].filter(Boolean).join(' • ');
    html += '<div class="top-spesa-row" data-tx-id="' + t.id + '">' +
      '<div class="top-spesa-rank">' + (idx + 1) + '</div>' +
      '<div class="top-spesa-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="top-spesa-body">' +
        '<div class="top-spesa-name">' + esc(name) + '</div>' +
        '<div class="top-spesa-meta">' + esc(meta) + '</div>' +
      '</div>' +
      '<div class="top-spesa-amt">' + Charts.fmtEur(Number(t.importo)) + '</div>' +
    '</div>';
  });
  D.topSpeseWrap.innerHTML = html;
  $$('.top-spesa-row', D.topSpeseWrap).forEach(el => {
    el.addEventListener('click', () => openTxEdit(el.getAttribute('data-tx-id')));
  });
}

// ─── SPESE RICORRENTI RILEVATE ──────────────────────────────
// Logica: una categoria è "ricorrente" se ha avuto transazioni in almeno 2 dei 3 mesi precedenti
// (escluso il mese corrente, perché potrebbe non essere ancora completo).
function renderRicorrenti() {
  if (!D.ricorrentiWrap) return;
  const { anno, mese } = S.currentMonth;
  // 3 mesi precedenti (m-1, m-2, m-3)
  const monthsToCheck = [];
  for (let i = 1; i <= 3; i++) {
    let m = mese - i, y = anno;
    while (m < 1) { m += 12; y--; }
    monthsToCheck.push({ y, m });
  }
  // per ogni categoria, conta in quanti mesi è apparsa e somma totale
  const stats = {};
  S.tx.filter(t => t.tipo === 'uscita').forEach(t => {
    const m = monthsToCheck.find(mm => inMonth(t.data, mm.y, mm.m));
    if (!m) return;
    const cid = t.categoria_id;
    if (cid == null) return;
    if (!stats[cid]) stats[cid] = { months: new Set(), total: 0, count: 0 };
    stats[cid].months.add(monthKey(m.y, m.m));
    stats[cid].total += Number(t.importo);
    stats[cid].count++;
  });
  const ricorrenti = Object.entries(stats)
    .filter(([_, s]) => s.months.size >= 2)
    .map(([cid, s]) => {
      const c = catById(Number(cid));
      return {
        c,
        mesi: s.months.size,
        media: s.total / s.months.size,
        count: s.count
      };
    })
    .filter(r => r.c)
    .sort((a, b) => b.media - a.media)
    .slice(0, 6);

  if (!ricorrenti.length) {
    D.ricorrentiWrap.innerHTML = '<div class="empty" style="padding:18px 4px;font-size:13px"><div class="emoji">🔁</div><div>Nessuna ricorrenza rilevata nei 3 mesi scorsi</div></div>';
    return;
  }
  let html = '';
  ricorrenti.forEach(r => {
    const c = r.c;
    const badge = r.mesi === 3 ? 'Mensile' : 'Frequente';
    const badgeCls = r.mesi === 3 ? 'monthly' : '';
    html += '<div class="ricorrente-row">' +
      '<div class="ricorrente-icon" style="background:' + (c.colore || '#666') + '22;color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
      '<div class="ricorrente-body">' +
        '<div class="ricorrente-name">' + esc(c.nome) + '</div>' +
        '<div class="ricorrente-meta">media mensile · ' + r.count + ' tx in ' + r.mesi + '/3 mesi</div>' +
      '</div>' +
      '<span class="ricorrente-badge ' + badgeCls + '">' + badge + '</span>' +
      '<div class="ricorrente-amt">' + Charts.fmtEur(r.media) + '</div>' +
    '</div>';
  });
  D.ricorrentiWrap.innerHTML = html;
}

// ─── ALTRE ANALISI DONUT ────────────────────────────────────
function renderSubCatDonut(arrCurrentMonth) {
  if (!D.subDonutWrap) return;
  const usc = arrCurrentMonth.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.subDonutWrap.innerHTML = '<div class="empty"><div class="emoji">🏷️</div><div>Nessuna uscita</div></div>';
    return;
  }
  const byCat = {};
  usc.forEach(t => {
    const cid = t.categoria_id || 0;
    byCat[cid] = (byCat[cid] || 0) + Number(t.importo);
  });
  // ordina decrescente, prendi top 8, gli altri in "Altre"
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 8);
  const rest = sorted.slice(8);
  const segs = top.map(([cid, val]) => {
    const c = catById(Number(cid));
    return {
      label: c ? (c.icona + ' ' + c.nome) : 'Senza categoria',
      value: val,
      color: c ? c.colore : '#94a3b8'
    };
  });
  if (rest.length) {
    const restSum = rest.reduce((s, [_, v]) => s + v, 0);
    segs.push({ label: 'Altre (' + rest.length + ')', value: restSum, color: '#64748b' });
  }
  Charts.renderDonut(D.subDonutWrap, segs, { subLabel: 'sotto-cat' });
}

const GIORNI_SETTIMANA = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
const GIORNI_SHORT     = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
const GIORNI_COLORI    = ['#e91e63','#3498db','#9b59b6','#1abc9c','#f39c12','#34d399','#e74c3c'];

function renderWeekdayDonut(arrCurrentMonth) {
  if (!D.weekdayDonutWrap) return;
  const usc = arrCurrentMonth.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.weekdayDonutWrap.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Nessuna uscita</div></div>';
    return;
  }
  const byDay = new Array(7).fill(0);
  usc.forEach(t => {
    const d = new Date(t.data + 'T00:00:00');
    byDay[d.getDay()] += Number(t.importo);
  });
  // ordina partendo da lunedì
  const order = [1,2,3,4,5,6,0];
  const segs = order.filter(d => byDay[d] > 0).map(d => ({
    label: GIORNI_SETTIMANA[d],
    value: byDay[d],
    color: GIORNI_COLORI[d]
  }));
  Charts.renderDonut(D.weekdayDonutWrap, segs, { subLabel: 'per giorno' });
}

function renderInOutDonut(arrCurrentMonth, inSum, outSum) {
  if (!D.inOutDonutWrap) return;
  if (!inSum && !outSum) {
    D.inOutDonutWrap.innerHTML = '<div class="empty"><div class="emoji">⚖️</div><div>Nessun movimento nel mese</div></div>';
    return;
  }
  const segs = [];
  if (inSum > 0)  segs.push({ label: 'Entrate', value: inSum,  color: 'var(--ok)' });
  if (outSum > 0) segs.push({ label: 'Uscite',  value: outSum, color: 'var(--danger)' });
  Charts.renderDonut(D.inOutDonutWrap, segs, { subLabel: 'flusso mensile' });
}

// ─── TREND aggiuntivi ───────────────────────────────────────
async function renderSaldoCumulativo() {
  if (!D.saldoCumWrap) return;
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
      buckets.set(k, 0);
      labels.push(MESI_SHORT[m - 1] + (m === 1 ? ' \'' + String(y).slice(-2) : ''));
      m++; if (m > 12) { m = 1; y++; }
    }
    (rows || []).forEach(r => {
      const [yy, mm] = r.data.split('-');
      const k = monthKey(Number(yy), Number(mm));
      if (!buckets.has(k)) return;
      const sign = r.tipo === 'entrata' ? 1 : -1;
      buckets.set(k, buckets.get(k) + sign * Number(r.importo));
    });
    // cumulativo
    let acc = 0;
    const cumPts = [];
    buckets.forEach(v => { acc += v; cumPts.push(acc); });
    Charts.renderLine(D.saldoCumWrap, [
      { label: 'Saldo', color: 'var(--accent)', points: cumPts }
    ], labels);
  } catch (e) {
    D.saldoCumWrap.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Saldo non disponibile offline</div></div>';
  }
}

function renderDailyBars(arrCurrentMonth) {
  if (!D.dailyBarsWrap) return;
  const usc = arrCurrentMonth.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.dailyBarsWrap.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Nessuna uscita questo mese</div></div>';
    return;
  }
  const { anno, mese } = S.currentMonth;
  const daysInMonth = new Date(anno, mese, 0).getDate();
  const arr = new Array(daysInMonth).fill(0);
  usc.forEach(t => {
    const d = Number(t.data.split('-')[2]);
    if (d >= 1 && d <= daysInMonth) arr[d - 1] += Number(t.importo);
  });
  Charts.renderBars(D.dailyBarsWrap, arr, { color: 'var(--danger)' });
}

// ─── CAROUSEL setup ─────────────────────────────────────────
const DONUT_TITLES = ['Uscite per categoria', 'Uscite per autore'];
const TREND_TITLES = ['Trend 12 mesi', 'Trend del mese', 'Confronto col mese precedente'];
let _carouselsInited = false;
function setupCarousels() {
  if (_carouselsInited) return;
  _carouselsInited = true;
  setupCarousel(D.donutCarousel, D.donutCarouselDots, D.donutCarouselTitle, DONUT_TITLES);
  setupCarousel(D.trendCarousel, D.trendCarouselDots, D.trendCarouselTitle, TREND_TITLES);
}

function setupCarousel(track, dotsEl, titleEl, titles) {
  if (!track || !dotsEl) return;
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  if (!slides.length) return;
  // Build dots
  dotsEl.innerHTML = slides.map((_, i) => '<button class="carousel-dot' + (i===0?' active':'') + '" data-idx="' + i + '" aria-label="Vai a ' + (titles[i]||('slide '+(i+1))) + '"></button>').join('');
  // Trova frecce nel wrapper attorno al track (carousel-track-wrap)
  const wrap = track.closest('.carousel-track-wrap') || track.parentElement;
  const arrows = wrap ? Array.from(wrap.querySelectorAll('.carousel-arrow.side')) : [];
  const arrowPrev = arrows.find(a => a.getAttribute('data-dir') === '-1');
  const arrowNext = arrows.find(a => a.getAttribute('data-dir') === '1');

  let currentIdx = 0;
  function goTo(i) {
    currentIdx = Math.max(0, Math.min(slides.length - 1, i));
    track.style.transform = 'translateX(-' + (currentIdx * 100) + '%)';
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, idx) => d.classList.toggle('active', idx === currentIdx));
    if (titleEl && titles[currentIdx]) titleEl.textContent = titles[currentIdx];
    if (arrowPrev) arrowPrev.disabled = (currentIdx === 0);
    if (arrowNext) arrowNext.disabled = (currentIdx === slides.length - 1);
  }
  // dot click
  dotsEl.querySelectorAll('.carousel-dot').forEach(d => {
    d.addEventListener('click', () => goTo(Number(d.getAttribute('data-idx'))));
  });
  // arrow click
  if (arrowPrev) arrowPrev.addEventListener('click', () => goTo(currentIdx - 1));
  if (arrowNext) arrowNext.addEventListener('click', () => goTo(currentIdx + 1));
  // init
  goTo(0);
}

// (renderAutoreDonut legacy della view-analisi rimossa: collideva con la
//  nuova async renderAutoreDonut() del carousel — il function hoisting JS
//  prendeva l'ULTIMA dichiarazione e con arrCurrentMonth=undefined faceva
//  crash su .filter(), bloccando renderConti, save/delete, realtime, ecc.)

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
  const icon = c ? c.icona : '📦';
  const color = c ? c.colore : '#94a3b8';
  const name = c ? c.nome : 'Altro';
  const macro = c && c.macro_categoria ? macroById(c.macro_categoria) : null;
  const macroPrefix = macro ? '<span class="tx-macro">' + macro.icon + ' ' + macroLabel(c.macro_categoria) + '</span> › ' : '';
  const pendingCls = S.pendingTxIds.has(t.id) ? ' pending' : '';
  const meta = [fmtData(t.data), t.descrizione || '', t.autore ? '👤 ' + t.autore : ''].filter(Boolean).join(' • ');
  return '<div class="tx-row' + pendingCls + '" data-tx-id="' + t.id + '">' +
    '<div class="tx-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
    '<div class="tx-body">' +
      '<div class="tx-cat">' + macroPrefix + esc(name) + '</div>' +
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
function getListPeriodRange() {
  // Restituisce { fromStr, toStr, label } in base allo stato del filtro periodo.
  if (S.listPeriod === 'last') {
    const { anno, mese } = S.currentMonth;
    let y = anno, m = mese - 1;
    if (m < 1) { m = 12; y--; }
    const last = new Date(y, m, 0).getDate();
    return {
      fromStr: y + '-' + String(m).padStart(2,'0') + '-01',
      toStr:   y + '-' + String(m).padStart(2,'0') + '-' + String(last).padStart(2,'0'),
      label:   MESI_FULL[m - 1] + ' ' + y
    };
  }
  if (S.listPeriod === 'custom') {
    return {
      fromStr: S.listFrom || '',
      toStr:   S.listTo || '',
      label:   (S.listFrom ? fmtData(S.listFrom) : '?') + ' → ' + (S.listTo ? fmtData(S.listTo) : '?')
    };
  }
  // default 'current': segue il currentMonth dell'header
  const { anno, mese } = S.currentMonth;
  const last = new Date(anno, mese, 0).getDate();
  return {
    fromStr: anno + '-' + String(mese).padStart(2,'0') + '-01',
    toStr:   anno + '-' + String(mese).padStart(2,'0') + '-' + String(last).padStart(2,'0'),
    label:   MESI_FULL[mese - 1] + ' ' + anno
  };
}

async function ensurePeriodLoaded(fromStr, toStr) {
  if (!fromStr || !toStr) return;
  // Determina elenco mesi (YYYY-MM) coperti dal range
  const start = new Date(fromStr + 'T00:00:00');
  const end   = new Date(toStr + 'T00:00:00');
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const months = [];
  while (cursor <= end) {
    months.push({ y: cursor.getFullYear(), m: cursor.getMonth() + 1 });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  // Per ogni mese non in cache, fetcha
  const toLoad = months.filter(({ y, m }) => !S.tx.some(t => inMonth(t.data, y, m)));
  if (!toLoad.length) return;
  const promises = toLoad.map(({ y, m }) => {
    const s = y + '-' + String(m).padStart(2,'0') + '-01';
    const ld = new Date(y, m, 0).getDate();
    const e = y + '-' + String(m).padStart(2,'0') + '-' + String(ld).padStart(2,'0');
    return supaFetch(T.TX + '?select=*&data=gte.' + s + '&data=lte.' + e + '&order=data.desc,id.desc').catch(() => []);
  });
  const results = await Promise.all(promises);
  const ids = new Set(S.tx.map(t => t.id));
  results.forEach(rows => {
    (rows || []).forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
  });
  saveLocalCache();
}

function renderList() {
  const range = getListPeriodRange();
  // Sincronizza l'header (range vs mese + visibilità frecce)
  renderHeader();
  // Aggiorna stato del pulsante "Seleziona periodo" (active quando custom)
  if (D.btnTogglePeriod) D.btnTogglePeriod.classList.toggle('active', S.listPeriod === 'custom');
  if (D.listPeriodCustom) D.listPeriodCustom.style.display = (S.listPeriod === 'custom') ? 'flex' : 'none';
  // Riflette eventuale custom range scelto da altre viste (es. trend click)
  if (S.listPeriod === 'custom') {
    if (D.listPeriodFrom && S.listFrom) D.listPeriodFrom.value = S.listFrom;
    if (D.listPeriodTo   && S.listTo)   D.listPeriodTo.value   = S.listTo;
  }
  // Badge sul pulsante "Seleziona filtri": numero filtri attivi
  updateFilterBadge();
  // Barra dei badge dei filtri attivi (sopra Tutto/Uscite/Entrate)
  renderActiveFilters();

  // Validazione custom: se manca uno dei due estremi, mostra messaggio
  if (S.listPeriod === 'custom' && (!S.listFrom || !S.listTo)) {
    if (D.txList) D.txList.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Scegli le date "Da" e "A" per filtrare.</div></div>';
    if (D.listPeriodSummary) D.listPeriodSummary.innerHTML = '';
    return;
  }
  if (S.listPeriod === 'custom' && S.listFrom > S.listTo) {
    if (D.txList) D.txList.innerHTML = '<div class="empty"><div class="emoji">⚠️</div><div>La data "Da" deve precedere "A".</div></div>';
    if (D.listPeriodSummary) D.listPeriodSummary.innerHTML = '';
    return;
  }

  // Lazy load dei mesi se range è custom o "last" non in cache
  ensurePeriodLoaded(range.fromStr, range.toStr).then(() => _drawList(range));
}

function _drawList(range) {
  let arr = S.tx.filter(t => t.data >= range.fromStr && t.data <= range.toStr);
  if (S.listFilter !== 'all') arr = arr.filter(t => t.tipo === S.listFilter);
  if (S.donutFilter != null) {
    if (typeof S.donutFilter === 'object' && S.donutFilter.type === 'macro') {
      const macroId = S.donutFilter.value;
      const catIdsInMacro = new Set(S.cats.filter(c => (c.macro_categoria || 'altro') === macroId).map(c => c.id));
      arr = arr.filter(t => catIdsInMacro.has(t.categoria_id));
    } else {
      arr = arr.filter(t => t.categoria_id === S.donutFilter);
    }
  }
  // Filtri modal: categorie selezionate (multipla, OR)
  if (S.filtersCats && S.filtersCats.length) {
    const set = new Set(S.filtersCats);
    arr = arr.filter(t => set.has(t.categoria_id));
  }
  // Filtri modal: autori selezionati (multipla, OR)
  if (S.filtersAutori && S.filtersAutori.length) {
    const set = new Set(S.filtersAutori);
    arr = arr.filter(t => set.has(t.autore));
  }

  // Aggiorna riepilogo periodo (entrate / uscite / saldo)
  if (D.listPeriodSummary) {
    const inSum  = arr.filter(t => t.tipo === 'entrata').reduce((s, t) => s + Number(t.importo), 0);
    const outSum = arr.filter(t => t.tipo === 'uscita').reduce((s, t) => s + Number(t.importo), 0);
    const saldo  = inSum - outSum;
    D.listPeriodSummary.innerHTML =
      '<div class="lps-block"><span class="lps-label">' + esc(range.label) + '</span><span class="lps-val">' + arr.length + ' tx</span></div>' +
      '<div class="lps-block"><span class="lps-label">Entrate</span><span class="lps-val pos">' + Charts.fmtEur(inSum) + '</span></div>' +
      '<div class="lps-block"><span class="lps-label">Uscite</span><span class="lps-val neg">' + Charts.fmtEur(outSum) + '</span></div>' +
      '<div class="lps-block" style="grid-column: span 3;border-top:1px solid var(--border);margin-top:6px;padding-top:6px"><span class="lps-label">Saldo</span><span class="lps-val ' + (saldo >= 0 ? 'pos' : 'neg') + '">' + (saldo >= 0 ? '+' : '−') + Charts.fmtEur(Math.abs(saldo)) + '</span></div>';
  }

  if (!arr.length) {
    D.txList.innerHTML = '<div class="empty"><div class="emoji">📭</div><div>Nessuna transazione nel periodo.</div></div>';
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
    let label;
    if (typeof S.donutFilter === 'object' && S.donutFilter.type === 'macro') {
      const m = macroById(S.donutFilter.value);
      label = (m ? m.icon + ' ' : '') + macroLabel(S.donutFilter.value);
    } else {
      const c = catById(S.donutFilter);
      label = c ? c.nome : '?';
    }
    html = '<div class="chip active" id="clearDonut">Solo: ' + label + ' ✕</div>' + html;
  }
  D.txList.innerHTML = html;
  bindTxRows(D.txList);
  twemojify(D.txList);
  const clr = $('#clearDonut');
  if (clr) clr.addEventListener('click', () => { S.donutFilter = null; renderList(); });
}

// ─── MODAL FILTRI (categorie + autori, multi-select) ────────
function updateFilterBadge() {
  if (!D.filterBadge) return;
  const n = (S.filtersCats ? S.filtersCats.length : 0) + (S.filtersAutori ? S.filtersAutori.length : 0);
  if (n > 0) {
    D.filterBadge.style.display = 'grid';
    D.filterBadge.textContent = String(n);
    if (D.btnOpenFilters) D.btnOpenFilters.classList.add('active');
  } else {
    D.filterBadge.style.display = 'none';
    if (D.btnOpenFilters) D.btnOpenFilters.classList.remove('active');
  }
}

// Mostra i badge dei filtri attivi sopra i chip Tutto/Uscite/Entrate.
// Ogni badge ha una x che rimuove SOLO quel filtro specifico.
function renderActiveFilters() {
  const bar = D.activeFiltersBar;
  if (!bar) return;
  const cats   = S.filtersCats || [];
  const autori = S.filtersAutori || [];
  if (!cats.length && !autori.length) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }
  bar.style.display = 'flex';
  let html = '';
  // Badge categorie
  cats.forEach(id => {
    const c = catById(id);
    const label = c ? ((c.icona ? c.icona + ' ' : '') + c.nome) : ('Cat #' + id);
    html += '<span class="active-filter-badge" data-type="cat" data-id="' + id + '">' +
            esc(label) +
            '<span class="badge-x" aria-label="Rimuovi filtro" role="button">✕</span>' +
            '</span>';
  });
  // Badge autori
  autori.forEach(nome => {
    html += '<span class="active-filter-badge" data-type="autore" data-id="' + esc(nome) + '">' +
            '👤 ' + esc(nome) +
            '<span class="badge-x" aria-label="Rimuovi filtro" role="button">✕</span>' +
            '</span>';
  });
  bar.innerHTML = html;
  twemojify(bar);
  // Bind click sulla x per ogni badge
  $$('.active-filter-badge .badge-x', bar).forEach(x => {
    x.addEventListener('click', e => {
      e.stopPropagation();
      const badge = x.closest('.active-filter-badge');
      if (!badge) return;
      const type = badge.getAttribute('data-type');
      const id = badge.getAttribute('data-id');
      if (type === 'cat') {
        const num = Number(id);
        S.filtersCats = (S.filtersCats || []).filter(x => x !== num);
      } else if (type === 'autore') {
        S.filtersAutori = (S.filtersAutori || []).filter(x => x !== id);
      }
      renderList();
    });
  });
}

// stato draft per il modal (non commitato finché l'utente non preme Filtra)
let _filtersDraft = null;

function openFiltersModal() {
  _filtersDraft = {
    cats:   (S.filtersCats   || []).slice(),
    autori: (S.filtersAutori || []).slice()
  };
  renderFiltersModalCats();
  renderFiltersModalAutori();
  openModal('modalFilters');
}

function renderFiltersModalCats() {
  if (!D.filterCats) return;
  if (!S.cats || !S.cats.length) {
    D.filterCats.innerHTML = '<div class="filter-empty">Nessuna categoria configurata</div>';
    return;
  }
  // Ordinamento interno: per macro_categoria, poi per ordine
  const sortCats = (a, b) => {
    const ma = (a.macro_categoria || 'zzz'), mb = (b.macro_categoria || 'zzz');
    if (ma !== mb) return ma.localeCompare(mb);
    return (a.ordine || 0) - (b.ordine || 0);
  };
  const entrate = S.cats.filter(c => c.tipo === 'entrata').sort(sortCats);
  const uscite  = S.cats.filter(c => c.tipo === 'uscita').sort(sortCats);

  const chipHtml = c => {
    const selected = _filtersDraft.cats.indexOf(c.id) !== -1;
    return '<button type="button" class="filter-chip' + (selected ? ' selected' : '') + '" data-cat-id="' + c.id + '">' +
           (c.icona ? c.icona + ' ' : '') + esc(c.nome) + '</button>';
  };

  let html = '';
  if (entrate.length) {
    html += '<div class="filter-subtitle">Entrate</div>';
    html += '<div class="filter-chips-row">' + entrate.map(chipHtml).join('') + '</div>';
  }
  if (uscite.length) {
    html += '<div class="filter-subtitle">Uscite</div>';
    html += '<div class="filter-chips-row">' + uscite.map(chipHtml).join('') + '</div>';
  }
  D.filterCats.innerHTML = html;
  twemojify(D.filterCats);
  $$('.filter-chip', D.filterCats).forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.getAttribute('data-cat-id'));
      const i = _filtersDraft.cats.indexOf(id);
      if (i >= 0) _filtersDraft.cats.splice(i, 1);
      else _filtersDraft.cats.push(id);
      el.classList.toggle('selected');
    });
  });
}

function renderFiltersModalAutori() {
  if (!D.filterAutori) return;
  const list = getAutoriList();
  if (!list.length) {
    D.filterAutori.innerHTML = '<div class="filter-empty">Nessun autore configurato</div>';
    return;
  }
  const html = list.map(nome => {
    const selected = _filtersDraft.autori.indexOf(nome) !== -1;
    return '<button type="button" class="filter-chip' + (selected ? ' selected' : '') + '" data-autore="' + esc(nome) + '">' +
           esc(nome) + '</button>';
  }).join('');
  D.filterAutori.innerHTML = html;
  $$('.filter-chip', D.filterAutori).forEach(el => {
    el.addEventListener('click', () => {
      const nome = el.getAttribute('data-autore');
      const i = _filtersDraft.autori.indexOf(nome);
      if (i >= 0) _filtersDraft.autori.splice(i, 1);
      else _filtersDraft.autori.push(nome);
      el.classList.toggle('selected');
    });
  });
}

function applyFiltersFromModal() {
  if (!_filtersDraft) return;
  S.filtersCats   = _filtersDraft.cats.slice();
  S.filtersAutori = _filtersDraft.autori.slice();
  closeModal('modalFilters');
  renderList();
}

function resetFiltersFromModal() {
  _filtersDraft = { cats: [], autori: [] };
  S.filtersCats = [];
  S.filtersAutori = [];
  renderFiltersModalCats();
  renderFiltersModalAutori();
  // non chiudo il modal, così l'utente vede la pulizia e può rifiltrare
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
  const cats = S.cats.filter(c => c.tipo === activeCatTab);
  if (!cats.length) {
    D.catList.innerHTML = '<div class="empty"><div class="emoji">📁</div><div>Nessuna categoria.</div></div>';
    return;
  }
  // Raggruppa per macro_categoria
  const groups = {};
  cats.forEach(c => {
    const m = c.macro_categoria || 'altro';
    if (!groups[m]) groups[m] = [];
    groups[m].push(c);
  });
  // Ordina sotto-categorie dentro ogni macro per ordine
  Object.values(groups).forEach(arr => arr.sort((a, b) => a.ordine - b.ordine));
  // Ordine macro: usa S.prefs.macroOrder se settato (drag&drop persistito),
  // altrimenti ordine di EMOJI_CATS, in coda eventuali macro nuove non presenti.
  const defaultOrder = EMOJI_CATS.map(e => e.id);
  const savedOrder = (S.prefs.macroOrder && S.prefs.macroOrder.length) ? S.prefs.macroOrder : defaultOrder;
  const orderedMacroIds = [];
  savedOrder.forEach(id => { if (groups[id] && !orderedMacroIds.includes(id)) orderedMacroIds.push(id); });
  Object.keys(groups).forEach(id => { if (!orderedMacroIds.includes(id)) orderedMacroIds.push(id); });

  let html = '';
  orderedMacroIds.forEach(mid => {
    const m = macroById(mid);
    const subs = groups[mid];
    html += '<div class="cat-group" data-macro="' + mid + '">';
    html +=   '<div class="cat-group-header" data-macro="' + mid + '">';
    html +=     '<span class="cgh-handle" draggable="true" title="Trascina per riordinare">⋮⋮</span>';
    html +=     '<span class="cgh-ic">' + (m ? m.icon : '📦') + '</span>';
    html +=     '<span class="cgh-name">' + esc(macroLabel(mid)) + '</span>';
    html +=     '<span class="cgh-count">' + subs.length + '</span>';
    html +=   '</div>';
    html +=   '<div class="cat-group-subs">';
    subs.forEach(c => {
      html += '<div class="cat-row sub" data-cat-id="' + c.id + '" data-macro="' + mid + '">' +
        '<span class="cat-handle" draggable="true">⋮⋮</span>' +
        '<div class="cat-icon" style="background:' + (c.colore || '#666') + '22;color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
        '<div class="cat-name">' + esc(c.nome) + '</div>' +
      '</div>';
    });
    html +=   '</div>';
    html += '</div>';
  });
  D.catList.innerHTML = html;
  bindCatDragAndClick();
  twemojify(D.catList);
}
function bindCatDragAndClick() {
  // ── Drag dei gruppi macro: dragstart parte dal handle ⋮⋮ ──────
  let draggedGroup = null;
  $$('.cgh-handle', D.catList).forEach(h => {
    h.addEventListener('dragstart', e => {
      const grp = h.closest('.cat-group');
      if (!grp) return;
      draggedGroup = grp;
      grp.classList.add('dragging-group');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'macro:' + grp.getAttribute('data-macro'));
      e.stopPropagation();
    });
    h.addEventListener('dragend', () => {
      if (draggedGroup) draggedGroup.classList.remove('dragging-group');
      $$('.drag-over-group', D.catList).forEach(x => x.classList.remove('drag-over-group'));
      const ref = draggedGroup;
      setTimeout(() => { if (ref === draggedGroup) draggedGroup = null; }, 50);
    });
  });
  // dragover/drop sull'header intero come target
  $$('.cat-group-header', D.catList).forEach(h => {
    h.addEventListener('dragover', e => {
      if (!draggedGroup) return;
      const tg = h.closest('.cat-group');
      if (!tg || tg === draggedGroup) return;
      e.preventDefault();
      e.stopPropagation();
      tg.classList.add('drag-over-group');
    });
    h.addEventListener('dragleave', () => {
      const tg = h.closest('.cat-group');
      tg && tg.classList.remove('drag-over-group');
    });
    h.addEventListener('drop', async e => {
      e.preventDefault();
      e.stopPropagation();
      const tg = h.closest('.cat-group');
      tg && tg.classList.remove('drag-over-group');
      if (!draggedGroup || draggedGroup === tg || !tg) return;
      const allGroups = Array.from($$('.cat-group', D.catList));
      const srcIdx = allGroups.indexOf(draggedGroup);
      const dstIdx = allGroups.indexOf(tg);
      if (srcIdx < dstIdx) D.catList.insertBefore(draggedGroup, tg.nextSibling);
      else D.catList.insertBefore(draggedGroup, tg);
      await persistMacroOrder();
    });
  });

  // ── Drag delle sotto-categorie: dragstart parte dal handle ⋮⋮ ──
  let draggedEl = null;
  $$('.cat-handle', D.catList).forEach(h => {
    h.addEventListener('dragstart', e => {
      const row = h.closest('.cat-row');
      if (!row) return;
      draggedEl = row;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.getAttribute('data-cat-id'));
      e.stopPropagation();
    });
    h.addEventListener('dragend', () => {
      if (draggedEl) draggedEl.classList.remove('dragging');
      $$('.drag-over', D.catList).forEach(x => x.classList.remove('drag-over'));
      const ref = draggedEl;
      setTimeout(() => { if (ref === draggedEl) draggedEl = null; }, 50);
    });
  });
  // click + dragover/drop sull'intera row
  $$('.cat-row', D.catList).forEach(el => {
    el.addEventListener('click', () => {
      if (draggedEl) return;
      openCatEdit(Number(el.getAttribute('data-cat-id')));
    });
    el.addEventListener('dragover', e => {
      if (!draggedEl || draggedEl === el) return;
      if (draggedEl.getAttribute('data-macro') !== el.getAttribute('data-macro')) return;
      e.preventDefault();
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', async e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (!draggedEl || draggedEl === el) return;
      if (draggedEl.getAttribute('data-macro') !== el.getAttribute('data-macro')) return;
      const parent = el.parentNode;
      const allInGroup = Array.from(parent.querySelectorAll('.cat-row'));
      const srcIdx = allInGroup.indexOf(draggedEl);
      const dstIdx = allInGroup.indexOf(el);
      if (srcIdx < dstIdx) parent.insertBefore(draggedEl, el.nextSibling);
      else parent.insertBefore(draggedEl, el);
      await persistCatOrder();
    });
  });
}

async function persistMacroOrder() {
  const ids = Array.from($$('.cat-group', D.catList)).map(el => el.getAttribute('data-macro'));
  S.prefs.macroOrder = ids;
  saveLocalCache();
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: Object.assign({}, S.prefs, { macroOrder: ids }) }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
  toast('Ordine gruppi salvato', 'success');
}

async function persistCatOrder() {
  // Itera tutti i gruppi: ordine = posizione globale top-to-bottom
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
  toast('Ordine salvato', 'success');
}

// ─── SWITCH VIEW ────────────────────────────────────────────
// Mappa moduli noti.
// `home` = sub-view che è la home del modulo (click su "Conti di Casa" nel breadcrumb la apre).
// `viewLabels` = mappa view-id → etichetta breadcrumb leaf.
// `getActions(cv)` = elenco di azioni per le action-pill; l'ordine determina la posizione visiva.
//   Il "+" (cls: 'action-add') deve stare al CENTRO dell'array per essere visualmente centrato.
//   `caption` (opzionale) = testo mostrato sotto l'iconcina (solo pill laterali).
const MODULI = {
  conti: {
    label: '💰 Conti di Casa',
    home: 'conti',
    hasMonthNav: true,
    viewLabels: {
      conti: 'Riepilogo',
      list:  'Transazioni',
      cat:   'Categorie'
    },
    getActions: (cv) => [
      { go: 'list', label: '📋', caption: 'Transazioni', aria: 'Lista transazioni', active: cv === 'list' },
      { id: 'actAddTx', cls: 'action-add', label: '+', aria: 'Nuova transazione', onClick: openQuickAdd },
      { go: 'cat',  label: '📁', caption: 'Categorie',  aria: 'Categorie',         active: cv === 'cat'  }
    ]
  }
  // futuri moduli (todo, spesa, scadenze) → si aggiungono qui con la stessa shape
};

function moduloOf(viewName) {
  if (viewName === 'home') return null;
  if (viewName === 'conti' || viewName === 'list' || viewName === 'cat') return 'conti';
  return null;
}

function switchView(name) {
  S.currentView = name;
  ['home','conti','list','cat'].forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.classList.toggle('active', v === name);
  });
  // ri-applica twemoji al subtitle (può cambiare)
  setTimeout(() => twemojify(document.querySelector('.app-header')), 0);
  // bottom-nav: la pill attiva è il MODULO, non la sub-view
  const mod = moduloOf(name) || 'home';
  $$('.nav-pill').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-view') === mod);
  });
  // header breadcrumb + module-actions-bar
  const moduloMeta = MODULI[mod];
  renderBreadcrumb(mod, name, moduloMeta);
  if (D.moduleActions && D.moduleActionPills) {
    if (mod === 'home') {
      D.moduleActions.style.display = 'none';
      D.moduleActionPills.style.display = 'none';
    } else if (moduloMeta) {
      D.moduleActions.style.display = 'flex';
      D.moduleActionPills.style.display = 'flex';
      if (D.moduleMonth) D.moduleMonth.style.display = moduloMeta.hasMonthNav ? 'flex' : 'none';
      renderModuleActionPills(moduloMeta, name);
    } else {
      D.moduleActions.style.display = 'none';
      D.moduleActionPills.style.display = 'none';
    }
  }
  // render contenuto view
  if (name === 'home')      renderHomeGestione();
  else if (name === 'conti') renderConti();
  else if (name === 'list') renderList();
  else if (name === 'cat')  renderCatView();
  // Sincronizza monthLabel + visibilità frecce mese in base alla nuova view
  renderHeader();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderModuleActionPills(moduloMeta, currentView) {
  if (!D.moduleActionPills || !moduloMeta) return;
  const actions = moduloMeta.getActions(currentView) || [];
  let html = '';
  actions.forEach(a => {
    const cls = ['action-pill'];
    if (a.cls) cls.push(a.cls);
    if (a.active) cls.push('active');
    const id = a.id ? (' id="' + a.id + '"') : '';
    const go = a.go ? (' data-go="' + a.go + '"') : '';
    const isCenter = !!(a.cls && a.cls.indexOf('action-add') !== -1);
    const itemCls = ['ma-item'];
    if (isCenter) itemCls.push('ma-item-center');
    html += '<div class="' + itemCls.join(' ') + '">';
    html += '<button class="' + cls.join(' ') + '"' + id + go + ' aria-label="' + (a.aria || '') + '" type="button">' + a.label + '</button>';
    if (a.caption) {
      html += '<span class="ma-caption">' + a.caption + '</span>';
    }
    html += '</div>';
  });
  D.moduleActionPills.innerHTML = html;
  twemojify(D.moduleActionPills);
  // bind onClick / data-go sui pill (non sui wrapper)
  $$('.action-pill', D.moduleActionPills).forEach((el, idx) => {
    const a = actions[idx];
    if (!a) return;
    el.addEventListener('click', () => {
      if (typeof a.onClick === 'function') a.onClick();
      else if (a.go) switchView(a.go);
    });
  });
}

// ─── BREADCRUMB ─────────────────────────────────────────────
// Renderizza il percorso: Gestione Casa › <Modulo> › <View>
// - bcRoot   sempre visibile, click → home globale
// - bcModule visibile se siamo in un modulo, click → home del modulo (es. 'conti' → 'Riepilogo')
// - bcLeaf   visibile se siamo in un modulo, mostra il nome della view corrente
function renderBreadcrumb(mod, viewName, moduloMeta) {
  if (!D.bcRoot) return;
  const sep1 = document.getElementById('bcSep1');
  const sep2 = document.getElementById('bcSep2');
  if (mod === 'home' || !moduloMeta) {
    if (sep1) sep1.hidden = true;
    if (sep2) sep2.hidden = true;
    if (D.bcModule) { D.bcModule.hidden = true; D.bcModule.dataset.target = ''; }
    if (D.bcLeaf)   { D.bcLeaf.hidden = true; D.bcLeaf.textContent = ''; }
    return;
  }
  // mostra modulo
  if (sep1) sep1.hidden = false;
  if (D.bcModule) {
    D.bcModule.hidden = false;
    D.bcModule.textContent = moduloMeta.label;
    D.bcModule.dataset.target = moduloMeta.home || '';
    twemojify(D.bcModule);
  }
  // mostra leaf
  const leafLabel = (moduloMeta.viewLabels && moduloMeta.viewLabels[viewName]) || '';
  if (leafLabel) {
    if (sep2) sep2.hidden = false;
    if (D.bcLeaf) { D.bcLeaf.hidden = false; D.bcLeaf.textContent = leafLabel; }
  } else {
    if (sep2) sep2.hidden = true;
    if (D.bcLeaf) { D.bcLeaf.hidden = true; D.bcLeaf.textContent = ''; }
  }
}

function renderAnalisi() {
  const arr = txInCurrentMonth();
  _anCategorie(arr);
  _anAutore(arr);
  _anTrend12();
  _anMeseTrend();
  _anCompare();
}

// 1) Uscite per categoria (donut macro) + lista dettagliata
function _anCategorie(arr) {
  if (!D.anCatDonut) return;
  const usc = arr.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.anCatDonut.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Nessuna uscita</div></div>';
    if (D.anCatDetail) D.anCatDetail.innerHTML = '';
    return;
  }
  const MACRO_COLORS = {
    casa:'#3498db', cibo:'#e74c3c', bollette:'#f39c12', trasporti:'#9b59b6',
    salute:'#1abc9c', svago:'#34d399', sport:'#16a34a', abbigliamento:'#a777e3',
    famiglia:'#f472b6', animali:'#fb923c', tecnologia:'#0ea5e9', regali:'#ff5722',
    viaggi:'#06b6d4', lavoro:'#64748b', soldi:'#2ecc71', natura:'#22c55e', altro:'#94a3b8'
  };
  const byMacro = {};
  usc.forEach(t => {
    const c = catById(t.categoria_id);
    const mid = (c && c.macro_categoria) || 'altro';
    if (!byMacro[mid]) byMacro[mid] = { total: 0, count: 0 };
    byMacro[mid].total += Number(t.importo);
    byMacro[mid].count++;
  });
  const total = Object.values(byMacro).reduce((s, x) => s + x.total, 0);
  const sorted = Object.entries(byMacro).sort((a, b) => b[1].total - a[1].total);
  const segs = sorted.map(([mid, info]) => {
    const m = macroById(mid);
    return {
      label: (m ? m.icon : '?') + ' ' + macroLabel(mid),
      value: info.total,
      color: MACRO_COLORS[mid] || '#666'
    };
  });
  Charts.renderDonut(D.anCatDonut, segs, { subLabel: 'uscite mese' });
  // Dettaglio
  if (D.anCatDetail) {
    D.anCatDetail.innerHTML = sorted.map(([mid, info]) => {
      const m = macroById(mid);
      const color = MACRO_COLORS[mid] || '#666';
      const pct = (info.total / total) * 100;
      return '<div class="an-row">' +
        '<span class="an-dot" style="background:' + color + '"></span>' +
        '<span class="an-name">' + (m ? m.icon : '?') + ' ' + esc(macroLabel(mid)) + '</span>' +
        '<span class="an-count">' + info.count + 'tx</span>' +
        '<span class="an-pct">' + pct.toFixed(0) + '%</span>' +
        '<span class="an-amt">' + Charts.fmtEur(info.total) + '</span>' +
      '</div>';
    }).join('');
  }
}

// 2) Uscite per autore (donut) + lista dettagliata
function _anAutore(arr) {
  if (!D.anAutoreDonut) return;
  const usc = arr.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.anAutoreDonut.innerHTML = '<div class="empty"><div class="emoji">👥</div><div>Nessuna uscita</div></div>';
    if (D.anAutoreDetail) D.anAutoreDetail.innerHTML = '';
    return;
  }
  const byAut = {};
  usc.forEach(t => {
    const nome = t.autore || '(non attribuito)';
    if (!byAut[nome]) byAut[nome] = { total: 0, count: 0 };
    byAut[nome].total += Number(t.importo);
    byAut[nome].count++;
  });
  const total = Object.values(byAut).reduce((s, x) => s + x.total, 0);
  const sorted = Object.entries(byAut).sort((a, b) => b[1].total - a[1].total);
  const segs = sorted.map(([nome, info]) => ({
    label: nome,
    value: info.total,
    color: colorForAutore(nome === '(non attribuito)' ? null : nome)
  }));
  Charts.renderDonut(D.anAutoreDonut, segs, { subLabel: 'per persona' });
  if (D.anAutoreDetail) {
    D.anAutoreDetail.innerHTML = sorted.map(([nome, info]) => {
      const color = colorForAutore(nome === '(non attribuito)' ? null : nome);
      const pct = (info.total / total) * 100;
      return '<div class="an-row">' +
        '<span class="an-dot" style="background:' + color + '"></span>' +
        '<span class="an-name">👤 ' + esc(nome) + '</span>' +
        '<span class="an-count">' + info.count + 'tx</span>' +
        '<span class="an-pct">' + pct.toFixed(0) + '%</span>' +
        '<span class="an-amt">' + Charts.fmtEur(info.total) + '</span>' +
      '</div>';
    }).join('');
  }
}

// 3) Trend 12 mesi + tabella mese-per-mese
async function _anTrend12() {
  if (!D.anTrend12Chart) return;
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
    const monthKeys = [];
    let y = startY, m = startM;
    for (let i = 0; i < 12; i++) {
      const k = monthKey(y, m);
      buckets.set(k, { in: 0, out: 0 });
      monthKeys.push({ k, y, m });
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
    const inPts = [], outPts = [];
    buckets.forEach(v => { inPts.push(v.in); outPts.push(v.out); });
    Charts.renderLine(D.anTrend12Chart, [
      { label: 'Entrate', color: 'var(--ok)',     points: inPts },
      { label: 'Uscite',  color: 'var(--danger)', points: outPts }
    ], labels);
    if (D.anTrend12Detail) {
      let html = '<table class="analisi-table"><thead><tr><th>Mese</th><th class="num">Entrate</th><th class="num">Uscite</th><th class="num">Saldo</th></tr></thead><tbody>';
      monthKeys.forEach((mk, i) => {
        const b = buckets.get(mk.k);
        const saldo = b.in - b.out;
        const cls = saldo >= 0 ? 'pos' : 'neg';
        html += '<tr>' +
          '<td>' + labels[i] + '</td>' +
          '<td class="num pos">' + Charts.fmtEurShort(b.in) + '</td>' +
          '<td class="num neg">' + Charts.fmtEurShort(b.out) + '</td>' +
          '<td class="num ' + cls + '">' + (saldo >= 0 ? '+' : '−') + Charts.fmtEurShort(Math.abs(saldo)) + '</td>' +
        '</tr>';
      });
      html += '</tbody></table>';
      D.anTrend12Detail.innerHTML = html;
    }
  } catch (e) {
    D.anTrend12Chart.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Non disponibile offline</div></div>';
    if (D.anTrend12Detail) D.anTrend12Detail.innerHTML = '';
  }
}

// 4) Trend del mese (selettore inline) + tabella giorno-per-giorno
function _anMeseTrend() {
  if (!D.anMeseTrendChart) return;
  if (!S.anMeseTrend) S.anMeseTrend = Object.assign({}, S.currentMonth);
  if (D.anMeseTrendLabel) D.anMeseTrendLabel.textContent = MESI_FULL[S.anMeseTrend.mese - 1] + ' ' + S.anMeseTrend.anno;
  const { anno, mese } = S.anMeseTrend;
  const has = S.tx.some(t => inMonth(t.data, anno, mese));
  if (!has) {
    const start = anno + '-' + String(mese).padStart(2,'0') + '-01';
    const lastDay = new Date(anno, mese, 0).getDate();
    const end = anno + '-' + String(mese).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
    D.anMeseTrendChart.innerHTML = '<div class="empty"><div class="emoji">⏳</div><div>Caricamento…</div></div>';
    if (D.anMeseTrendDetail) D.anMeseTrendDetail.innerHTML = '';
    supaFetch(T.TX + '?select=*&data=gte.' + start + '&data=lte.' + end + '&order=data.desc,id.desc').then(rows => {
      if (rows && rows.length) {
        const ids = new Set(S.tx.map(t => t.id));
        rows.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
        saveLocalCache();
      }
      _drawAnMeseTrend();
    }).catch(() => _drawAnMeseTrend());
  } else {
    _drawAnMeseTrend();
  }
}
function _drawAnMeseTrend() {
  const { anno, mese } = S.anMeseTrend;
  const daysInMonth = new Date(anno, mese, 0).getDate();
  const arr = S.tx.filter(t => inMonth(t.data, anno, mese));
  if (!arr.length) {
    D.anMeseTrendChart.innerHTML = '<div class="empty"><div class="emoji">📅</div><div>Nessun movimento</div></div>';
    if (D.anMeseTrendDetail) D.anMeseTrendDetail.innerHTML = '';
    return;
  }
  const usc = new Array(daysInMonth).fill(0);
  const ent = new Array(daysInMonth).fill(0);
  arr.forEach(t => {
    const d = Number(t.data.split('-')[2]);
    if (d >= 1 && d <= daysInMonth) {
      if (t.tipo === 'uscita') usc[d - 1] += Number(t.importo);
      else ent[d - 1] += Number(t.importo);
    }
  });
  const labels = [];
  for (let i = 1; i <= daysInMonth; i++) labels.push(String(i));
  Charts.renderLine(D.anMeseTrendChart, [
    { label: 'Uscite',  color: 'var(--danger)', points: usc },
    { label: 'Entrate', color: 'var(--ok)',     points: ent }
  ], labels);
  // Tabella: solo giorni con movimenti
  if (D.anMeseTrendDetail) {
    let html = '<table class="analisi-table"><thead><tr><th>Giorno</th><th class="num">Entrate</th><th class="num">Uscite</th><th class="num">Saldo</th></tr></thead><tbody>';
    let nRows = 0;
    for (let i = 0; i < daysInMonth; i++) {
      if (ent[i] === 0 && usc[i] === 0) continue;
      const saldo = ent[i] - usc[i];
      const cls = saldo >= 0 ? 'pos' : 'neg';
      const dataLabel = String(i + 1).padStart(2,'0') + '/' + String(mese).padStart(2,'0');
      html += '<tr>' +
        '<td>' + dataLabel + '</td>' +
        '<td class="num pos">' + (ent[i] ? Charts.fmtEurShort(ent[i]) : '<span class="dim">—</span>') + '</td>' +
        '<td class="num neg">' + (usc[i] ? Charts.fmtEurShort(usc[i]) : '<span class="dim">—</span>') + '</td>' +
        '<td class="num ' + cls + '">' + (saldo >= 0 ? '+' : '−') + Charts.fmtEurShort(Math.abs(saldo)) + '</td>' +
      '</tr>';
      nRows++;
    }
    if (!nRows) html += '<tr><td colspan="4" class="dim">Nessun movimento</td></tr>';
    html += '</tbody></table>';
    D.anMeseTrendDetail.innerHTML = html;
  }
}
function shiftAnMeseTrend(delta) {
  if (!S.anMeseTrend) S.anMeseTrend = Object.assign({}, S.currentMonth);
  let { anno, mese } = S.anMeseTrend;
  mese += delta;
  while (mese < 1) { mese += 12; anno--; }
  while (mese > 12) { mese -= 12; anno++; }
  S.anMeseTrend = { anno, mese };
  _anMeseTrend();
}

// 5) Confronto col mese precedente (selettore inline) + tabella variazione %
function _anCompare() {
  if (!D.anCmpWrap) return;
  if (!S.anMeseCmp) S.anMeseCmp = Object.assign({}, S.currentMonth);
  if (D.anCmpLabel) D.anCmpLabel.textContent = MESI_FULL[S.anMeseCmp.mese - 1] + ' ' + S.anMeseCmp.anno;
  const { anno, mese } = S.anMeseCmp;
  let prevY = anno, prevM = mese - 1;
  if (prevM < 1) { prevM = 12; prevY--; }
  function loadIfMissing(y, m) {
    const has = S.tx.some(t => inMonth(t.data, y, m));
    if (has) return Promise.resolve();
    const start = y + '-' + String(m).padStart(2,'0') + '-01';
    const lastDay = new Date(y, m, 0).getDate();
    const end = y + '-' + String(m).padStart(2,'0') + '-' + String(lastDay).padStart(2,'0');
    return supaFetch(T.TX + '?select=*&data=gte.' + start + '&data=lte.' + end).then(rows => {
      if (rows && rows.length) {
        const ids = new Set(S.tx.map(t => t.id));
        rows.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
        saveLocalCache();
      }
    }).catch(() => {});
  }
  D.anCmpWrap.innerHTML = '<div class="empty"><div class="emoji">⏳</div><div>Caricamento…</div></div>';
  if (D.anCmpDetail) D.anCmpDetail.innerHTML = '';
  Promise.all([loadIfMissing(anno, mese), loadIfMissing(prevY, prevM)]).then(() => _drawAnCompare(anno, mese, prevY, prevM));
}
function _drawAnCompare(anno, mese, prevY, prevM) {
  const curArr  = S.tx.filter(t => inMonth(t.data, anno, mese));
  const prevArr = S.tx.filter(t => inMonth(t.data, prevY, prevM));
  function sumByMacro(arr) {
    const m = {};
    arr.filter(t => t.tipo === 'uscita').forEach(t => {
      const c = catById(t.categoria_id);
      const macroId = (c && c.macro_categoria) || 'altro';
      m[macroId] = (m[macroId] || 0) + Number(t.importo);
    });
    return m;
  }
  const curByMacro  = sumByMacro(curArr);
  const prevByMacro = sumByMacro(prevArr);
  const allMacros = new Set([...Object.keys(curByMacro), ...Object.keys(prevByMacro)]);
  if (!allMacros.size) {
    D.anCmpWrap.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Nessuna spesa nei 2 mesi</div></div>';
    return;
  }
  const rows = Array.from(allMacros).map(id => ({
    id,
    cur: curByMacro[id] || 0,
    prev: prevByMacro[id] || 0
  })).sort((a, b) => Math.max(b.cur, b.prev) - Math.max(a.cur, a.prev));
  const maxVal = Math.max(...rows.map(r => Math.max(r.cur, r.prev))) || 1;
  let barsHtml = '';
  rows.forEach(r => {
    const m = macroById(r.id);
    const icon = m ? m.icon : '📦';
    let delta = 0, cls = 'same', txt = '—';
    if (r.prev > 0) {
      delta = ((r.cur - r.prev) / r.prev) * 100;
      if (Math.abs(delta) < 1) { cls = 'same'; txt = '≈'; }
      else if (delta > 0)      { cls = 'up';   txt = '+' + delta.toFixed(0) + '%'; }
      else                     { cls = 'down'; txt = delta.toFixed(0) + '%'; }
    } else if (r.cur > 0) { cls = 'up'; txt = 'NEW'; }
    else if (r.prev > 0)  { cls = 'down'; txt = '−100%'; }
    const curW  = (r.cur  / maxVal) * 100;
    const prevW = (r.prev / maxVal) * 100;
    barsHtml += '<div class="compare-row">' +
      '<div class="compare-top">' +
        '<span class="cmp-name">' + icon + ' ' + esc(macroLabel(r.id)) + '</span>' +
        '<span class="cmp-delta ' + cls + '">' + txt + '</span>' +
      '</div>' +
      '<div class="compare-bars">' +
        '<div class="compare-bar-row cur">' +
          '<span class="cmp-bar-label">ora</span>' +
          '<div class="cmp-bar"><div class="cmp-bar-fill" style="width:' + curW + '%"></div></div>' +
          '<span class="cmp-val">' + Charts.fmtEurShort(r.cur) + '</span>' +
        '</div>' +
        '<div class="compare-bar-row prev">' +
          '<span class="cmp-bar-label">prec</span>' +
          '<div class="cmp-bar"><div class="cmp-bar-fill" style="width:' + prevW + '%"></div></div>' +
          '<span class="cmp-val">' + Charts.fmtEurShort(r.prev) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  D.anCmpWrap.innerHTML = barsHtml;
  // Tabella di dettaglio
  if (D.anCmpDetail) {
    let total_cur = rows.reduce((s, r) => s + r.cur, 0);
    let total_prev = rows.reduce((s, r) => s + r.prev, 0);
    let html = '<table class="analisi-table"><thead><tr><th>Macro</th><th class="num">Ora</th><th class="num">Prec.</th><th class="num">Δ</th></tr></thead><tbody>';
    rows.forEach(r => {
      const m = macroById(r.id);
      const icon = m ? m.icon : '📦';
      const diff = r.cur - r.prev;
      const cls = diff > 0 ? 'neg' : (diff < 0 ? 'pos' : 'dim');
      html += '<tr>' +
        '<td>' + icon + ' ' + esc(macroLabel(r.id)) + '</td>' +
        '<td class="num">' + Charts.fmtEurShort(r.cur) + '</td>' +
        '<td class="num dim">' + Charts.fmtEurShort(r.prev) + '</td>' +
        '<td class="num ' + cls + '">' + (diff > 0 ? '+' : (diff < 0 ? '−' : '')) + Charts.fmtEurShort(Math.abs(diff)) + '</td>' +
      '</tr>';
    });
    const tDiff = total_cur - total_prev;
    const tCls = tDiff > 0 ? 'neg' : (tDiff < 0 ? 'pos' : 'dim');
    html += '<tr style="font-weight:700;border-top:2px solid var(--border)">' +
      '<td>Totale</td>' +
      '<td class="num">' + Charts.fmtEurShort(total_cur) + '</td>' +
      '<td class="num dim">' + Charts.fmtEurShort(total_prev) + '</td>' +
      '<td class="num ' + tCls + '">' + (tDiff > 0 ? '+' : (tDiff < 0 ? '−' : '')) + Charts.fmtEurShort(Math.abs(tDiff)) + '</td>' +
    '</tr>';
    html += '</tbody></table>';
    D.anCmpDetail.innerHTML = html;
  }
  // Grafico "Variazione per macro"
  if (D.anCmpDiffChart) {
    const diffRows = rows.map(r => {
      const m = macroById(r.id);
      return { label: macroLabel(r.id), value: r.cur - r.prev, icon: m ? m.icon : '📦' };
    }).filter(r => r.value !== 0)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    Charts.renderDiffBars(D.anCmpDiffChart, diffRows);
  }
}
function shiftAnMeseCmp(delta) {
  if (!S.anMeseCmp) S.anMeseCmp = Object.assign({}, S.currentMonth);
  let { anno, mese } = S.anMeseCmp;
  mese += delta;
  while (mese < 1) { mese += 12; anno--; }
  while (mese > 12) { mese -= 12; anno++; }
  S.anMeseCmp = { anno, mese };
  _anCompare();
}

function renderAnalisiBudgetBars() {
  if (!D.budgetBarsAnalisi) return;
  const { anno, mese } = S.currentMonth;
  const monthBudgets = S.budgets.filter(b => b.anno === anno && b.mese === mese);
  const arr = txInCurrentMonth();
  const uscBy = {};
  arr.filter(t => t.tipo === 'uscita').forEach(t => {
    const cid = t.categoria_id;
    if (cid != null) uscBy[cid] = (uscBy[cid] || 0) + Number(t.importo);
  });
  // categorie di uscita: mostro TUTTE per permettere creazione budget al tap
  const cats = S.cats.filter(c => c.tipo === 'uscita').sort((a, b) => a.ordine - b.ordine);
  if (!cats.length) {
    D.budgetBarsAnalisi.innerHTML = '<div class="empty" style="padding:18px 4px;font-size:13px">Crea prima alcune categorie di uscita.</div>';
    return;
  }
  const rows = cats.map(c => {
    const b = monthBudgets.find(x => x.categoria_id === c.id);
    return {
      label: (c.icona ? c.icona + ' ' : '') + c.nome,
      speso: uscBy[c.id] || 0,
      budget: b ? Number(b.importo) : 0,
      onClick: () => openBudgetEdit(c.id)
    };
  });
  // Filtro: mostra solo categorie con budget oppure spesa > 0
  const visible = rows.filter(r => r.budget > 0 || r.speso > 0);
  if (!visible.length) {
    D.budgetBarsAnalisi.innerHTML = '<div class="empty" style="padding:18px 4px;font-size:13px"><div class="emoji">🎯</div><div>Nessun budget impostato e nessuna spesa</div></div>';
    return;
  }
  Charts.renderBudgetBars(D.budgetBarsAnalisi, visible);
}

// ─── QUICK ADD ──────────────────────────────────────────────
const QA = { tipo: 'uscita', amt: '', desc: '', data: '', autore: '', extraOpen: false, selectedCatId: undefined };
// selectedCatId: undefined = nessuna scelta; number = id sotto-cat; null = "Altro" (senza categoria)
let qaPickerMacroId = null; // null = mostra elenco macro; "casa"/"cibo"/... = mostra sotto-cat di quella macro
function openQuickAdd(tipo) {
  try {
    QA.tipo = tipo || localStorage.getItem(LS.LAST_TIPO) || 'uscita';
    QA.amt = '';
    QA.desc = '';
    QA.data = today();
    QA.selectedCatId = undefined;
    qaPickerMacroId = null;
    setQaTipo(QA.tipo);
    setQaAmt('');
    if (D.qaDesc) D.qaDesc.value = '';
    if (D.qaAutore) populateAutoreSelect(D.qaAutore, getDefaultAutore());
    if (D.qaDatePicker) {
      D.qaDatePicker.value = QA.data;
      D.qaDatePicker.max = today();
    }
    renderQaDateLabel();
    renderQaCats();
    updateQaSaveBtn();
    openModal('modalQa');
  } catch (err) {
    console.error('openQuickAdd failed:', err);
    toast('Errore: ricaricamento app in corso…', 'error', 3000);
    // versione HTML/JS incoerenti — forza cache wipe + reload
    setTimeout(() => { try { applyUpdate(); } catch(_) { location.reload(); } }, 400);
  }
}

// Aggiorna visibilità e label del bottone Salva
function updateQaSaveBtn() {
  if (!D.qaSaveBtn) return;
  const importo = parseAmount(QA.amt);
  const hasAmt = importo && importo > 0;
  const hasCat = QA.selectedCatId !== undefined; // null è "Altro", number è sub-cat
  if (hasAmt && hasCat) {
    let catLabel;
    if (QA.selectedCatId === null) {
      catLabel = '📦 Altro';
    } else {
      const c = catById(QA.selectedCatId);
      catLabel = c ? (c.icona + ' ' + c.nome) : '?';
    }
    if (D.qaSaveLabel) {
      D.qaSaveLabel.innerHTML = 'Salva ' + esc(catLabel) + ' · <strong>' + fmtEur(importo) + '</strong>';
    }
    D.qaSaveBtn.style.display = 'flex';
    D.qaSaveBtn.disabled = false;
  } else {
    D.qaSaveBtn.style.display = 'none';
  }
}

function renderQaDateLabel() {
  if (!D.qaDateLabel) return;
  const val = D.qaDatePicker.value || today();
  QA.data = val;
  const t = today();
  // ieri
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const ystr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  let label;
  if (val === t) label = 'Oggi';
  else if (val === ystr) label = 'Ieri';
  else {
    const [yy, mm, dd] = val.split('-');
    const curYear = String(new Date().getFullYear());
    label = dd + ' ' + MESI_SHORT[Number(mm)-1] + (yy === curYear ? '' : ' ' + yy);
  }
  D.qaDateLabel.textContent = label;
  // warning visivo se data > 7gg fa
  const diff = (Date.parse(t) - Date.parse(val)) / (1000 * 60 * 60 * 24);
  D.qaDateBtn.classList.toggle('is-past', diff > 7);
}
function setQaTipo(t) {
  QA.tipo = t;
  D.qaToggle.setAttribute('data-tipo', t);
  $$('button', D.qaToggle).forEach(b => b.classList.toggle('active', b.getAttribute('data-tipo') === t));
  D.qaTitle.textContent = (t === 'entrata' ? 'Nuova entrata' : 'Nuova uscita');
  localStorage.setItem(LS.LAST_TIPO, t);
  qaPickerMacroId = null;
  QA.selectedCatId = undefined; // reset selezione al cambio tipo
  renderQaCats();
  updateQaSaveBtn();
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
  updateQaSaveBtn();
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
  const allCats = S.cats.filter(c => c.tipo === QA.tipo);
  // se non ci sono categorie del tipo, messaggio guida
  if (!allCats.length) {
    D.qaCats.innerHTML = '<div class="empty" style="padding:20px 8px;font-size:13px">Crea prima una categoria nella sezione Categorie.</div>';
    return;
  }

  // recency per ranking
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.getFullYear() + '-' + String(cutoff.getMonth()+1).padStart(2,'0') + '-' + String(cutoff.getDate()).padStart(2,'0');
  const recent = S.tx.filter(t => t.tipo === QA.tipo && t.data >= cutoffStr);
  const useByCat = {};
  recent.forEach(t => { if (t.categoria_id != null) useByCat[t.categoria_id] = (useByCat[t.categoria_id] || 0) + 1; });

  if (qaPickerMacroId == null) {
    // ─── LIVELLO 1: macro-categorie ──────────────────────────────
    // raggruppa categorie utente per macro_categoria, mostra solo macro con >=1 sotto-cat
    const groups = new Map(); // macroId -> { count, useTotal, subs: [] }
    allCats.forEach(c => {
      const mid = c.macro_categoria || 'altro';
      if (!groups.has(mid)) groups.set(mid, { count: 0, useTotal: 0, subs: [] });
      const g = groups.get(mid);
      g.count++;
      g.useTotal += (useByCat[c.id] || 0);
      g.subs.push(c);
    });
    // ordina: macro con più uso recente prima, poi alfabetico per id
    const sorted = Array.from(groups.entries()).sort((a, b) => (b[1].useTotal - a[1].useTotal) || a[0].localeCompare(b[0]));

    D.qaCats.innerHTML = sorted.map(([mid, g]) => {
      const m = macroById(mid);
      const label = macroLabel(mid);
      const badge = '<span class="qa-cat-badge">' + g.count + '</span>';
      return '<button class="qa-cat qa-macro" data-macro="' + mid + '">' +
        '<div class="qa-cat-icon">' + (m ? m.icon : '?') + '</div>' +
        '<div class="qa-cat-name">' + esc(label) + '</div>' +
        badge +
      '</button>';
    }).join('');

    // chip "Altro" sempre presente come fallback "senza categoria"
    const altroSelCls = (QA.selectedCatId === null) ? ' qa-sel' : '';
    const altroHtml = '<button class="qa-cat qa-altro' + altroSelCls + '" data-altro="1" title="Senza categoria">' +
      '<div class="qa-cat-icon">📦</div>' +
      '<div class="qa-cat-name">Altro</div>' +
    '</button>';
    D.qaCats.insertAdjacentHTML('beforeend', altroHtml);

    $$('.qa-cat[data-macro]', D.qaCats).forEach(el => {
      el.addEventListener('click', () => {
        // apri il sub-picker per scegliere la sotto-categoria
        qaPickerMacroId = el.getAttribute('data-macro');
        renderQaCats();
      });
    });
    $$('.qa-cat[data-altro]', D.qaCats).forEach(el => {
      el.addEventListener('click', () => {
        // seleziona "Altro" (categoria_id = null) — non salva
        QA.selectedCatId = (QA.selectedCatId === null) ? undefined : null;
        renderQaCats();
        updateQaSaveBtn();
      });
    });
  } else {
    // ─── LIVELLO 2: sotto-categorie della macro selezionata ──────
    const subs = allCats
      .filter(c => (c.macro_categoria || 'altro') === qaPickerMacroId)
      .sort((a, b) => (useByCat[b.id] || 0) - (useByCat[a.id] || 0) || a.ordine - b.ordine);
    const m = macroById(qaPickerMacroId);

    let html = '<button class="qa-cat qa-back" id="qaBack" title="Indietro alle macro">' +
      '<div class="qa-cat-icon">‹</div>' +
      '<div class="qa-cat-name">' + (m ? m.icon : '?') + ' ' + esc(macroLabel(qaPickerMacroId)) + '</div>' +
    '</button>';

    html += subs.map(c => {
      const sel = (QA.selectedCatId === c.id) ? ' qa-sel' : '';
      return '<button class="qa-cat' + sel + '" data-cat-id="' + c.id + '">' +
        '<div class="qa-cat-icon" style="color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
        '<div class="qa-cat-name">' + esc(c.nome) + '</div>' +
      '</button>';
    }).join('');

    D.qaCats.innerHTML = html;
    const back = $('#qaBack', D.qaCats);
    if (back) back.addEventListener('click', () => { qaPickerMacroId = null; renderQaCats(); });
    $$('.qa-cat[data-cat-id]', D.qaCats).forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.getAttribute('data-cat-id'));
        // toggle selezione (non salva!)
        QA.selectedCatId = (QA.selectedCatId === id) ? undefined : id;
        renderQaCats();
        updateQaSaveBtn();
      });
    });
  }
}
async function quickSave(categoria_id) {
  const importo = parseAmount(QA.amt);
  if (!importo || importo <= 0) {
    toast('Inserisci l\'importo', 'warn');
    return;
  }
  const desc = D.qaDesc ? D.qaDesc.value.trim() : '';
  const dataStr = D.qaDatePicker.value || QA.data || today();
  const autore = (D.qaAutore && D.qaAutore.value) || getDefaultAutore() || null;
  setBtnLoading(D.qaSaveBtn, true);
  try {
    await saveTransaction({
      importo,
      tipo: QA.tipo,
      categoria_id,
      descrizione: desc || null,
      data: dataStr,
      autore: autore || null
    });
    closeModal('modalQa');
    vibrate(20);
    toast('Salvato', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.qaSaveBtn, false);
  }
}

async function saveTransaction(payload) {
  const tmpId = uuid();
  const row = Object.assign({ id: tmpId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, payload);
  // optimistic locale
  S.tx.unshift(row);
  S.pendingTxIds.add(tmpId);
  saveLocalCache();
  renderHomeGestione(); renderConti();
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
      renderHomeGestione(); renderConti();
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
  if (D.txEditAutore) populateAutoreSelect(D.txEditAutore, t.autore || getDefaultAutore());
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
    autore: (D.txEditAutore && D.txEditAutore.value) || null
  };
  if (!payload.importo || payload.importo <= 0) { toast('Importo non valido', 'warn'); return; }
  setBtnLoading(D.txEditSave, true);
  try {
    // optimistic
    const idx = S.tx.findIndex(t => t.id === S.editTxId);
    if (idx >= 0) S.tx[idx] = Object.assign({}, S.tx[idx], payload);
    saveLocalCache();
    renderHomeGestione(); renderConti(); renderList();
    const path = T.TX + '?id=eq.' + S.editTxId;
    const options = { method: 'PATCH', body: JSON.stringify(payload) };
    if (isOnline()) {
      try { await supaFetch(path, options); }
      catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalTx');
    toast('Transazione modificata', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.txEditSave, false);
    S.editTxId = null;
  }
}
async function deleteTxEdit() {
  if (S.editTxId == null) return;
  const ok = await confirmDlg({
    title: 'Elimina transazione',
    message: 'Vuoi davvero eliminare questa transazione? L\'azione non è reversibile.',
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  setBtnLoading(D.txEditDelete, true);
  try {
    // optimistic
    S.tx = S.tx.filter(t => t.id !== S.editTxId);
    saveLocalCache();
    renderHomeGestione(); renderConti(); renderList();
    const path = T.TX + '?id=eq.' + S.editTxId;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); }
      catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalTx');
    toast('Transazione eliminata', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.txEditDelete, false);
    S.editTxId = null;
  }
}

function populateCatSelect(sel, tipo, currentId) {
  const cats = S.cats.filter(c => c.tipo === tipo).sort((a,b) => a.ordine - b.ordine);
  sel.innerHTML = '<option value="">(senza categoria)</option>' +
    cats.map(c => '<option value="' + c.id + '"' + (c.id === currentId ? ' selected' : '') + '>' +
      (c.icona ? c.icona + ' ' : '') + esc(c.nome) + '</option>').join('');
}
// ─── AUTORI: derivati da cdc_authorized_users (NON da prefs) ─
// La lista degli autori è esattamente la lista degli utenti autorizzati.
// Il default per le nuove transazioni è il nome dell'utente loggato.
function getAutoriList() {
  const users = S.authorizedUsers || [];
  const names = users.map(u => u && u.nome).filter(Boolean);
  if (names.length) return names;
  return ['Stefano Marabelli', 'Flavia Spina']; // fallback se whitelist non ancora caricata
}
function getDefaultAutore() {
  if (S.currentUser && S.currentUser.nome) return S.currentUser.nome;
  const list = getAutoriList();
  return list[0] || 'Stefano Marabelli';
}

function populateAutoreSelect(sel, current) {
  const list = getAutoriList();
  // Se 'current' non è nella lista (es. autore storico mai aggiornato), lo aggiungiamo
  // come opzione disabilitata per non perdere il dato esistente nelle edit.
  const inList = list.indexOf(current) !== -1;
  let html = list.map(a => '<option' + (a === current ? ' selected' : '') + '>' + esc(a) + '</option>').join('');
  if (current && !inList) {
    html += '<option selected>' + esc(current) + '</option>';
  }
  sel.innerHTML = html;
}

// Colore stabile per autore (per donut autori)
const AUTORE_COLORS = ['#3498db', '#e91e63', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
function colorForAutore(nome) {
  if (!nome) return '#94a3b8';
  const list = getAutoriList();
  const idx = list.indexOf(nome);
  if (idx >= 0) return AUTORE_COLORS[idx % AUTORE_COLORS.length];
  // fallback: hash semplice (per autori storici non più nella whitelist)
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) & 0xffffffff;
  return AUTORE_COLORS[Math.abs(h) % AUTORE_COLORS.length];
}

// ─── EDIT CATEGORIA ─────────────────────────────────────────
let catEditState = { icona: '🛒', colore: COLORS[0], isNew: false, emojiCatIdx: 0, macro_categoria: 'cibo' };
function openCatEdit(id) {
  S.editCatId = id;
  let c;
  if (id == null) {
    c = { id: null, nome: '', tipo: activeCatTab, icona: EMOJI_CATS[0].emojis[0], colore: COLORS[0], ordine: S.cats.length, macro_categoria: EMOJI_CATS[0].id };
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
  catEditState.icona = c.icona || EMOJI_CATS[0].emojis[0];
  catEditState.colore = c.colore || COLORS[0];
  // posiziona la tab emoji sulla macro esistente, oppure deduci dalla icona
  let idx = -1;
  if (c.macro_categoria) {
    idx = EMOJI_CATS.findIndex(cat => cat.id === c.macro_categoria);
  }
  if (idx < 0) idx = EMOJI_CATS.findIndex(cat => cat.emojis.includes(catEditState.icona));
  catEditState.emojiCatIdx = idx >= 0 ? idx : 0;
  catEditState.macro_categoria = EMOJI_CATS[catEditState.emojiCatIdx].id;
  D.catEditName.value = c.nome || '';
  D.catEditTipo.value = c.tipo || 'uscita';
  // aggiorna breadcrumb quando l'utente digita
  D.catEditName.oninput = renderCatBreadcrumb;
  renderEmojiPicker();
  renderColorPicker();
  renderCatBreadcrumb();
  openModal('modalCat');
}

function macroById(id) {
  return EMOJI_CATS.find(m => m.id === id);
}
function macroLabel(id) {
  const m = macroById(id);
  if (!m) return id || '?';
  return m.id.charAt(0).toUpperCase() + m.id.slice(1);
}
function renderCatBreadcrumb() {
  let bc = document.getElementById('catBreadcrumb');
  if (!bc) {
    bc = document.createElement('div');
    bc.id = 'catBreadcrumb';
    bc.className = 'cat-breadcrumb';
    const body = document.querySelector('#modalCat .sheet-body');
    if (body) body.insertBefore(bc, body.firstChild);
  }
  const macro = macroById(catEditState.macro_categoria);
  bc.innerHTML = '<span class="bc-macro">' + (macro ? macro.icon : '?') + ' ' + macroLabel(catEditState.macro_categoria) + '</span>' +
                 '<span class="bc-sep">›</span>' +
                 '<span class="bc-leaf">' + catEditState.icona + ' ' + (D.catEditName.value || 'sotto-categoria') + '</span>';
}

function renderEmojiPicker() {
  const wrap = D.catEditEmojis;
  const idx = catEditState.emojiCatIdx;
  const cur = EMOJI_CATS[idx];
  // costruisco struttura: tab strip + grid
  let html = '<div class="ec-tabs-wrap">';
  html += '<button type="button" class="ec-arrow ec-prev" aria-label="Categoria precedente">‹</button>';
  html += '<div class="ec-tabs-strip" id="ecTabsStrip">';
  EMOJI_CATS.forEach((cat, i) => {
    html += '<button type="button" class="ec-tab' + (i === idx ? ' active' : '') + '" data-ci="' + i + '" title="' + cat.id + '">' + cat.icon + '</button>';
  });
  html += '</div>';
  html += '<button type="button" class="ec-arrow ec-next" aria-label="Categoria successiva">›</button>';
  html += '</div>';
  html += '<div class="ec-grid" id="ecGrid">';
  cur.emojis.forEach(e => {
    html += '<button type="button" data-e="' + e + '" class="' + (e === catEditState.icona ? 'sel' : '') + '">' + e + '</button>';
  });
  html += '</div>';
  wrap.innerHTML = html;

  // tab clicks (cambio macro-categoria)
  $$('.ec-tab', wrap).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.emojiCatIdx = Number(b.getAttribute('data-ci'));
      catEditState.macro_categoria = EMOJI_CATS[catEditState.emojiCatIdx].id;
      // se l'emoji selezionata non sta più nella nuova macro, prendi la prima della macro
      const newMacro = EMOJI_CATS[catEditState.emojiCatIdx];
      if (!newMacro.emojis.includes(catEditState.icona)) {
        catEditState.icona = newMacro.emojis[0];
      }
      renderEmojiPicker();
      renderCatBreadcrumb();
      scrollActiveTabIntoView();
    });
  });
  // emoji clicks (sotto-categoria)
  $$('.ec-grid button', wrap).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.icona = b.getAttribute('data-e');
      catEditState.macro_categoria = EMOJI_CATS[catEditState.emojiCatIdx].id;
      renderEmojiPicker();
      renderCatBreadcrumb();
      scrollActiveTabIntoView();
    });
  });
  // arrows
  const prev = $('.ec-prev', wrap), next = $('.ec-next', wrap);
  prev && prev.addEventListener('click', () => shiftEmojiCat(-1));
  next && next.addEventListener('click', () => shiftEmojiCat(1));

  // swipe sulla grid
  bindEmojiGridSwipe();
  scrollActiveTabIntoView();
}

function shiftEmojiCat(delta) {
  const n = EMOJI_CATS.length;
  catEditState.emojiCatIdx = ((catEditState.emojiCatIdx + delta) % n + n) % n;
  catEditState.macro_categoria = EMOJI_CATS[catEditState.emojiCatIdx].id;
  const newMacro = EMOJI_CATS[catEditState.emojiCatIdx];
  if (!newMacro.emojis.includes(catEditState.icona)) {
    catEditState.icona = newMacro.emojis[0];
  }
  renderEmojiPicker();
  renderCatBreadcrumb();
}

function scrollActiveTabIntoView() {
  const strip = document.getElementById('ecTabsStrip');
  const active = strip && strip.querySelector('.ec-tab.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function bindEmojiGridSwipe() {
  const grid = document.getElementById('ecGrid');
  if (!grid) return;
  let sx = null, sy = null, moved = false;
  grid.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    moved = false;
  }, { passive: true });
  grid.addEventListener('touchmove', e => {
    if (sx == null) return;
    const dx = e.touches[0].clientX - sx;
    const dy = e.touches[0].clientY - sy;
    if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      moved = true;
    }
  }, { passive: true });
  grid.addEventListener('touchend', e => {
    if (sx == null) return;
    if (moved) {
      const dx = (e.changedTouches[0].clientX) - sx;
      if (Math.abs(dx) > 50) {
        shiftEmojiCat(dx < 0 ? 1 : -1);
      }
    }
    sx = null; sy = null; moved = false;
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
  if (!nome) { toast('Inserisci un nome per la categoria', 'warn'); return; }
  const payload = {
    nome,
    tipo: D.catEditTipo.value,
    icona: catEditState.icona,
    colore: catEditState.colore,
    macro_categoria: catEditState.macro_categoria || null
  };
  setBtnLoading(D.catEditSave, true);
  try {
    if (catEditState.isNew) {
      payload.ordine = S.cats.filter(c => c.tipo === payload.tipo).length;
      const res = await supaFetch(T.CATS + '?select=*', { method: 'POST', body: JSON.stringify(payload), headers: { 'Prefer': 'return=representation' } });
      if (res && res[0]) {
        S.cats.push(res[0]);
        saveLocalCache();
      }
      closeModal('modalCat');
      activeCatTab = payload.tipo;
      $$('button', D.catTabs).forEach(b => b.classList.toggle('active', b.getAttribute('data-tipo') === activeCatTab));
      renderCatView();
      toast('Categoria creata', 'success');
    } else {
      // optimistic locale
      const c = catById(S.editCatId);
      if (c) Object.assign(c, payload);
      saveLocalCache();
      renderCatView(); renderHomeGestione(); renderConti(); renderList();
      const path = T.CATS + '?id=eq.' + S.editCatId;
      const options = { method: 'PATCH', body: JSON.stringify(payload) };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalCat');
      toast('Categoria modificata', 'success');
      S.editCatId = null;
    }
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.catEditSave, false);
  }
}
async function deleteCatEdit() {
  if (S.editCatId == null) return;
  const ok = await confirmDlg({
    title: 'Elimina categoria',
    message: 'Le transazioni associate diventeranno "Senza categoria" ma non verranno cancellate. Procedere?',
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  setBtnLoading(D.catEditDelete, true);
  try {
    S.cats = S.cats.filter(c => c.id !== S.editCatId);
    S.tx.forEach(t => { if (t.categoria_id === S.editCatId) t.categoria_id = null; });
    saveLocalCache();
    renderCatView(); renderHomeGestione(); renderConti(); renderList();
    const path = T.CATS + '?id=eq.' + S.editCatId;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalCat');
    toast('Categoria eliminata', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.catEditDelete, false);
    S.editCatId = null;
  }
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
  if (!(importo >= 0)) { toast('Inserisci un importo valido (numero ≥ 0)', 'warn'); return; }
  setBtnLoading(D.budgetEditSave, true);
  try {
    const { anno, mese } = S.currentMonth;
    const existing = S.budgets.find(x => x.categoria_id === S.editBudgetCatId && x.anno === anno && x.mese === mese);
    if (existing) {
      existing.importo = importo;
    } else {
      S.budgets.push({ id: uuid(), categoria_id: S.editBudgetCatId, anno, mese, importo });
    }
    saveLocalCache();
    renderHomeGestione(); renderConti();
    // remoto: upsert via on_conflict
    const path = T.BUDGET + '?on_conflict=categoria_id,anno,mese';
    const body = { categoria_id: S.editBudgetCatId, anno, mese, importo };
    const options = { method: 'POST', body: JSON.stringify(body), headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' } };
    if (isOnline()) {
      try {
        const res = await supaFetch(path, options);
        if (res && res[0]) {
          const real = res[0];
          const idx = S.budgets.findIndex(x => x.categoria_id === real.categoria_id && x.anno === real.anno && x.mese === real.mese);
          if (idx >= 0) S.budgets[idx] = real;
          saveLocalCache();
        }
      } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalBudget');
    toast('Budget salvato', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.budgetEditSave, false);
    S.editBudgetCatId = null;
  }
}
async function deleteBudgetEdit() {
  if (S.editBudgetCatId == null) return;
  const { anno, mese } = S.currentMonth;
  const existing = S.budgets.find(x => x.categoria_id === S.editBudgetCatId && x.anno === anno && x.mese === mese);
  if (!existing) { closeModal('modalBudget'); return; }
  setBtnLoading(D.budgetEditDelete, true);
  try {
    S.budgets = S.budgets.filter(x => x !== existing);
    saveLocalCache();
    renderHomeGestione(); renderConti();
    if (typeof existing.id === 'number') {
      const path = T.BUDGET + '?id=eq.' + existing.id;
      const options = { method: 'DELETE' };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
    }
    closeModal('modalBudget');
    toast('Budget rimosso', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.budgetEditDelete, false);
    S.editBudgetCatId = null;
  }
}

// ─── IMPOSTAZIONI ───────────────────────────────────────────
function renderSettings() {
  D.setTheme.value = S.prefs.theme || 'auto';
  renderUsersList();
  // Logout button visibile solo se loggato
  if (D.setLogout) D.setLogout.style.display = (S.currentUser ? 'block' : 'none');
}

// ─── GESTIONE UTENTI AUTORIZZATI ────────────────────────────
async function loadAuthorizedUsers() {
  try {
    const rows = await supaFetch(T.USERS + '?select=*&order=is_owner.desc,nome.asc');
    S.authorizedUsers = rows || [];
  } catch (e) {
    console.warn('loadAuthorizedUsers failed', e);
    S.authorizedUsers = [];
  }
}

function renderUsersList() {
  if (!D.setUsersList) return;
  const users = S.authorizedUsers || [];
  if (!users.length) {
    D.setUsersList.innerHTML = '<div class="txt-faint" style="font-size:13px;padding:14px 4px">Caricamento utenti…</div>';
    return;
  }
  D.setUsersList.innerHTML = users.map(u => {
    const initial = (u.nome || u.email || '?').charAt(0).toUpperCase();
    const badge = u.is_owner ? '<span class="user-badge">Owner</span>' : '';
    const del = u.is_owner
      ? ''
      : '<button class="user-del-btn" data-email="' + esc(u.email) + '" aria-label="Elimina utente">✕</button>';
    return '<div class="user-row">' +
      '<div class="user-avatar">' + esc(initial) + '</div>' +
      '<div class="user-info">' +
        '<div class="user-nome">' + esc(u.nome) + '</div>' +
        '<div class="user-email">' + esc(u.email) + '</div>' +
      '</div>' +
      badge +
      del +
    '</div>';
  }).join('');
  $$('.user-del-btn', D.setUsersList).forEach(b => {
    b.addEventListener('click', () => deleteAuthorizedUser(b.getAttribute('data-email')));
  });
}

function openUserAdd() {
  if (D.userEditNome)  D.userEditNome.value = '';
  if (D.userEditEmail) D.userEditEmail.value = '';
  if (D.userEditTitle) D.userEditTitle.textContent = 'Nuovo utente autorizzato';
  openModal('modalUser');
}

async function saveAuthorizedUser() {
  const nome  = (D.userEditNome && D.userEditNome.value || '').trim();
  const email = (D.userEditEmail && D.userEditEmail.value || '').trim().toLowerCase();
  if (!nome) { toast('Inserisci il nome', 'warn'); return; }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Email non valida', 'warn'); return; }
  try {
    const res = await supaFetch(T.USERS + '?select=*', {
      method: 'POST',
      body: JSON.stringify({ email, nome, is_owner: false }),
      headers: { 'Prefer': 'return=representation' }
    });
    if (res && res[0]) S.authorizedUsers.push(res[0]);
    S.authorizedUsers.sort((a, b) => (b.is_owner - a.is_owner) || a.nome.localeCompare(b.nome));
    renderUsersList();
    closeModal('modalUser');
    toast('Utente autorizzato aggiunto', 'success');
  } catch (e) {
    if (String(e).includes('409') || String(e).includes('duplicate')) {
      toast('Email già autorizzata', 'warn');
    } else {
      toast('Errore: ' + e.message, 'error');
    }
  }
}

async function deleteAuthorizedUser(email) {
  if (!email || email === OWNER_EMAIL) {
    toast('L\'owner non può essere rimosso', 'warn');
    return;
  }
  const ok = await confirmDlg({
    title: 'Rimuovi utente',
    message: 'L\'utente ' + email + ' perderà l\'accesso all\'app al prossimo login.',
    confirmLabel: 'Rimuovi',
    danger: true
  });
  if (!ok) return;
  try {
    await supaFetch(T.USERS + '?email=eq.' + encodeURIComponent(email), { method: 'DELETE' });
    S.authorizedUsers = S.authorizedUsers.filter(u => u.email !== email);
    renderUsersList();
    toast('Utente rimosso', 'success');
  } catch (e) {
    toast('Errore: ' + e.message, 'error');
  }
}
async function saveSettings() {
  const themeNew = D.setTheme.value;
  S.prefs.theme = themeNew;
  // Gli autori sono presi solo da cdc_authorized_users — nessun campo prefs da salvare
  applyTheme();
  saveLocalCache();
  closeModal('modalSettings');
  toast('Impostazioni salvate', 'success');
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: S.prefs }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
}
const THEME_CYCLE = ['auto', 'dark', 'light'];
const THEME_ICONS = { auto: '🌓', dark: '🌙', light: '☀️' };
function applyTheme() {
  document.documentElement.setAttribute('data-theme', S.prefs.theme || 'auto');
  if (D.themeToggle) D.themeToggle.textContent = THEME_ICONS[S.prefs.theme || 'auto'] || '🌓';
}
async function cycleTheme() {
  const cur = S.prefs.theme || 'auto';
  const idx = THEME_CYCLE.indexOf(cur);
  const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
  console.log('[theme] cycle:', cur, '→', next);
  S.prefs.theme = next;
  applyTheme();
  saveLocalCache();
  toast('Tema: ' + (next === 'auto' ? 'automatico' : next === 'dark' ? 'scuro' : 'chiaro'), 'info');
  // sync remoto soft (merge con altri prefs)
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: S.prefs }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
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
  toast('CSV scaricato', 'success');
}
async function clearCache() {
  const ok = await confirmDlg({
    title: 'Pulisci cache locale',
    message: 'Verranno cancellati i dati salvati in locale e l\'app verrà ricaricata. I dati su Supabase non saranno toccati.',
    confirmLabel: 'Pulisci e ricarica'
  });
  if (!ok) return;
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
  const wasOpen = m.classList.contains('open');
  m.classList.remove('open');
  document.body.style.overflow = '';
  // reset sheet position se draggata
  const sheet = m.querySelector('.sheet');
  if (sheet) sheet.style.transform = '';
  if (wasOpen) m.dispatchEvent(new CustomEvent('cdc:closed'));
}

function bindModalClose() {
  $$('[data-close]').forEach(b => {
    b.addEventListener('click', () => closeModal(b.getAttribute('data-close')));
  });
  // Chiusura tap su backdrop: chiude SOLO se l'utente ha iniziato il press
  // direttamente sul backdrop (non dentro un figlio). Cosi' selezionare testo
  // dentro un input e rilasciare fuori NON chiude il modal.
  $$('.modal').forEach(m => {
    let pressedOnBackdrop = false;
    m.addEventListener('pointerdown', e => {
      pressedOnBackdrop = (e.target === m);
    });
    // fallback per browser senza pointerevents
    m.addEventListener('mousedown', e => {
      pressedOnBackdrop = (e.target === m);
    });
    m.addEventListener('touchstart', e => {
      pressedOnBackdrop = (e.target === m);
    }, { passive: true });
    m.addEventListener('click', e => {
      if (e.target === m && pressedOnBackdrop) closeModal(m.id);
      pressedOnBackdrop = false;
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

// ─── AUTH (Google OAuth + whitelist) ────────────────────────
function getSupabaseClient() {
  if (typeof supabase === 'undefined') return null;
  if (!S.supabaseClient) {
    S.supabaseClient = supabase.createClient(SUPA_URL, SUPA_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return S.supabaseClient;
}

async function isEmailAuthorized(email) {
  if (!email) return false;
  const normalized = String(email).toLowerCase();
  try {
    const rows = await supaFetch(T.USERS + '?select=email&email=eq.' + encodeURIComponent(normalized));
    return rows && rows.length > 0;
  } catch (e) {
    console.warn('isEmailAuthorized failed', e);
    return false;
  }
}

async function initAuth() {
  // Restituisce true se l'utente è autenticato e autorizzato → app procede
  console.log('[auth] initAuth start, supabase global =', typeof supabase);
  const client = getSupabaseClient();
  if (!client) {
    console.warn('[auth] supabase-js non caricato — overlay login mostrato comunque');
    showLoginOverlay('Errore: libreria Supabase non caricata. Verifica connessione.');
    return false; // BLOCCA invece di lasciare entrare
  }
  try {
    const { data: { session } } = await client.auth.getSession();
    console.log('[auth] session =', session ? session.user?.email : null);
    if (session && session.user && session.user.email) {
      const email = session.user.email.toLowerCase();
      const ok = await isEmailAuthorized(email);
      console.log('[auth] isEmailAuthorized(' + email + ') =', ok);
      if (ok) {
        S.currentUser = {
          email,
          nome: (session.user.user_metadata && (session.user.user_metadata.full_name || session.user.user_metadata.name)) || email,
          picture: session.user.user_metadata && session.user.user_metadata.picture
        };
        hideLoginOverlay();
        return true;
      } else {
        await client.auth.signOut();
        showLoginOverlay('L\'email ' + email + ' non è autorizzata.\nChiedi all\'amministratore di aggiungerla.');
        return false;
      }
    }
    // nessuna sessione: mostra schermata login
    console.log('[auth] nessuna sessione → mostro overlay login');
    showLoginOverlay();
    return false;
  } catch (e) {
    console.warn('[auth] initAuth error', e);
    showLoginOverlay('Errore di autenticazione: ' + e.message);
    return false;
  }
}

async function doLogin() {
  const client = getSupabaseClient();
  if (!client) { toast('Sistema di login non disponibile', 'error'); return; }
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.style.display = 'none';
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    });
    if (error) {
      const msg = error.message || String(error);
      showLoginOverlay('Login fallito: ' + msg + '\n\nVerifica che Google sia abilitato in Supabase Authentication → Providers.');
    }
    // Se ok, redirect a Google → ritorno con session → onAuthStateChange ricarica
  } catch (e) {
    showLoginOverlay('Errore: ' + e.message);
  }
}

async function doLogout() {
  const client = getSupabaseClient();
  if (client) {
    try { await client.auth.signOut(); } catch {}
  }
  S.currentUser = null;
  location.reload();
}

function showLoginOverlay(errorMsg) {
  const ov = document.getElementById('loginOverlay');
  const errEl = document.getElementById('loginError');
  const verEl = document.getElementById('loginVer');
  if (ov) ov.style.display = 'flex';
  if (errEl) {
    if (errorMsg) {
      errEl.textContent = errorMsg;
      errEl.style.display = 'block';
    } else {
      errEl.style.display = 'none';
    }
  }
  if (verEl) verEl.textContent = (S.localSha || '').slice(0, 7) || '—';
  document.body.style.overflow = 'hidden';
}

function hideLoginOverlay() {
  const ov = document.getElementById('loginOverlay');
  if (ov) ov.style.display = 'none';
  document.body.style.overflow = '';
}

function bindLoginButton() {
  const btn = document.getElementById('loginGoogleBtn');
  if (btn) btn.addEventListener('click', doLogin);
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
  // aggiorna sempre il widget Home (mini donut + saldo) e la view attiva
  renderHomeGestione();
  if (S.currentView === 'conti') renderConti();
  else if (S.currentView === 'list') renderList();
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
  renderHomeGestione(); renderConti();
  if (S.currentView === 'list') renderList();
  if (S.currentView === 'cat') renderCatView();
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
  renderHomeGestione(); renderConti();
}
function onPrefsChange(p) {
  if (p && p.new && p.new.dati) {
    // Solo le prefs UI-only (theme, ordini, ecc.) vengono sincronizzate.
    // autori/autoreDefault sono deprecati: la lista autori è derivata da
    // cdc_authorized_users — ignoriamo eventuali valori legacy.
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
    if (D.btnUpdate) D.btnUpdate.classList.add('show');
  }
}

// Check esplicito del SHA remoto: usato per recuperare aggiornamenti quando
// Realtime non ha consegnato l'evento (es. WebSocket idle in background,
// tab appena tornato in foreground, connessione appena ripristinata).
async function checkAppVersionNow() {
  try {
    const rows = await supaFetch(T.VER + '?select=sha&id=eq.1');
    const sha = rows && rows[0] && rows[0].sha;
    if (sha) onVersionChange(sha);
  } catch (e) { /* offline: niente da fare */ }
}

// Riconnette il channel Realtime se è in stato chiuso/errore (Safari iOS
// pausa i WebSocket in background; quando l'app torna visibile bisogna
// forzare la subscribe).
function ensureRealtimeAlive() {
  const ch = S.realtimeChannel;
  if (!ch) return;
  const state = ch.state || (ch.socket && ch.socket.connectionState && ch.socket.connectionState());
  if (state === 'closed' || state === 'errored' || state === 'leaving') {
    try { ch.subscribe(); } catch {}
  }
}

// Setup dei trigger per il check "vivo" del SHA: visibility change, online,
// più un polling di backup ogni 60s.
let _versionPollId = null;
function setupVersionWatchdog() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      ensureRealtimeAlive();
      checkAppVersionNow();
    }
  });
  window.addEventListener('online', () => {
    ensureRealtimeAlive();
    checkAppVersionNow();
  });
  // Polling di backup: ogni 60s se la tab è visibile, controlla il SHA.
  // Costo: 1 GET sub-100B ogni minuto, niente lato server.
  if (_versionPollId) clearInterval(_versionPollId);
  _versionPollId = setInterval(() => {
    if (!document.hidden) checkAppVersionNow();
  }, 60000);
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
  // nav: 5 pill (data-view per modulo, data-mod-soon per placeholder, data-action="settings")
  $$('.nav-pill').forEach(b => b.addEventListener('click', () => {
    const action = b.getAttribute('data-action');
    if (action === 'settings') { renderSettings(); openModal('modalSettings'); return; }
    const view = b.getAttribute('data-view');
    if (view) { switchView(view); return; }
    const modSoon = b.getAttribute('data-mod-soon');
    if (modSoon) { toast('Modulo in arrivo', 'info'); return; }
  }));
  // month nav (dentro module-actions-bar)
  if (D.btnMonthPrev) D.btnMonthPrev.addEventListener('click', () => shiftMonth(-1));
  if (D.btnMonthNext) D.btnMonthNext.addEventListener('click', () => shiftMonth(1));
  // FAB legacy non più presente nell'HTML — il + è in module-actions-bar di Conti
  // theme toggle in header
  if (D.themeToggle) D.themeToggle.addEventListener('click', cycleTheme);
  // breadcrumb navigazione
  if (D.bcRoot)   D.bcRoot.addEventListener('click', () => switchView('home'));
  if (D.bcModule) D.bcModule.addEventListener('click', () => {
    const target = D.bcModule.dataset.target;
    if (target) switchView(target);
  });
  // carousel pagina Riepilogo (donut ↔ trend mesi)
  bindCarousel();
  if (D.setSave)       D.setSave.addEventListener('click', saveSettings);
  if (D.setClearCache) D.setClearCache.addEventListener('click', clearCache);
  if (D.setAddUser)    D.setAddUser.addEventListener('click', openUserAdd);
  if (D.userEditSave)  D.userEditSave.addEventListener('click', saveAuthorizedUser);
  if (D.setLogout)     D.setLogout.addEventListener('click', () => doLogout());
  // update
  if (D.btnUpdate) D.btnUpdate.addEventListener('click', applyUpdate);
  // list filters (chip Tutto/Uscite/Entrate)
  if (D.listFilters) {
    $$('.chip', D.listFilters).forEach(c => c.addEventListener('click', () => {
      $$('.chip', D.listFilters).forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      S.listFilter = c.getAttribute('data-tipo');
      S.donutFilter = null;
      renderList();
    }));
  }
  // Toggle "Seleziona Periodo" → entra/esce dalla modalità custom range
  if (D.btnTogglePeriod) D.btnTogglePeriod.addEventListener('click', () => {
    if (S.listPeriod !== 'custom') {
      S.listPeriod = 'custom';
      // Default range = mese corrente se non già impostato
      if (!S.listFrom || !S.listTo) {
        const { anno, mese } = S.currentMonth;
        const last = new Date(anno, mese, 0).getDate();
        S.listFrom = anno + '-' + String(mese).padStart(2,'0') + '-01';
        S.listTo   = anno + '-' + String(mese).padStart(2,'0') + '-' + String(last).padStart(2,'0');
      }
      if (D.listPeriodFrom) D.listPeriodFrom.value = S.listFrom;
      if (D.listPeriodTo)   D.listPeriodTo.value   = S.listTo;
    } else {
      // torna a "current" (segue header)
      S.listPeriod = 'current';
    }
    renderList();
  });
  if (D.listPeriodFrom) D.listPeriodFrom.addEventListener('change', () => {
    S.listFrom = D.listPeriodFrom.value || null;
    renderList();
  });
  if (D.listPeriodTo) D.listPeriodTo.addEventListener('change', () => {
    S.listTo = D.listPeriodTo.value || null;
    renderList();
  });
  // Pulsante "Seleziona Filtri" → apre modal
  if (D.btnOpenFilters)   D.btnOpenFilters.addEventListener('click', openFiltersModal);
  if (D.btnApplyFilters)  D.btnApplyFilters.addEventListener('click', applyFiltersFromModal);
  if (D.btnResetFilters)  D.btnResetFilters.addEventListener('click', resetFiltersFromModal);
  // qa
  $$('button', D.qaToggle).forEach(b => b.addEventListener('click', () => setQaTipo(b.getAttribute('data-tipo'))));
  $$('button', D.numpad).forEach(b => b.addEventListener('click', () => numpadPress(b.getAttribute('data-k'))));
  // Salva button (visibile solo quando importo + categoria scelti)
  if (D.qaSaveBtn) {
    D.qaSaveBtn.addEventListener('click', () => {
      if (QA.selectedCatId === undefined) return;
      quickSave(QA.selectedCatId);
    });
  }
  // Date pill: l'input type=date è in overlay sopra il bottone (opacity 0),
  // riceve direttamente il click dell'utente e su iOS Safari apre il
  // calendario nativo. Il button parent serve solo come stile visivo.
  if (D.qaDatePicker) {
    D.qaDatePicker.addEventListener('change', renderQaDateLabel);
    D.qaDatePicker.addEventListener('input', renderQaDateLabel);
  }
  // Fallback per browser desktop (Chrome/Edge): se il click arriva al
  // bottone parent (perché l'input ha pointer-events:none in qualche
  // edge case), chiamiamo showPicker. Niente preventDefault, così se
  // l'input ha già aperto il picker non interferiamo.
  if (D.qaDateBtn && D.qaDatePicker) {
    D.qaDateBtn.addEventListener('click', e => {
      if (e.target === D.qaDatePicker) return; // l'input gestisce da solo
      try {
        if (typeof D.qaDatePicker.showPicker === 'function') {
          D.qaDatePicker.showPicker();
        }
      } catch (err) { /* ignora: l'input nativo è già visibile */ }
    });
  }
  // tx edit
  D.txEditSave.addEventListener('click', saveTxEdit);
  D.txEditDelete.addEventListener('click', deleteTxEdit);
  // Home Gestione Casa: tap su widget moduli
  $$('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const mod = card.getAttribute('data-mod');
      if (mod === 'conti') {
        switchView('conti');
      } else {
        toast('Modulo in arrivo', 'info');
      }
    });
  });
  // Modulo Conti: pulsanti per andare a sotto-pagine
  if (D.goToList)      D.goToList.addEventListener('click', () => switchView('list'));
  if (D.goToCategorie) D.goToCategorie.addEventListener('click', () => switchView('cat'));
  // cat edit
  D.catEditSave.addEventListener('click', saveCatEdit);
  D.catEditDelete.addEventListener('click', deleteCatEdit);
  D.btnAddCat.addEventListener('click', () => openCatEdit(null));
  $$('button', D.catTabs).forEach(b => b.addEventListener('click', () => {
    activeCatTab = b.getAttribute('data-tipo');
    $$('button', D.catTabs).forEach(x => x.classList.toggle('active', x === b));
    renderCatView();
  }));
  // budget edit (modal ancora presente, ma non più accessibile dall'UI principale)
  if (D.budgetEditSave)   D.budgetEditSave.addEventListener('click', saveBudgetEdit);
  if (D.budgetEditDelete) D.budgetEditDelete.addEventListener('click', deleteBudgetEdit);
  // selettori mese inline (trend mese + confronto)
  if (D.meseTrendPrev) D.meseTrendPrev.addEventListener('click', () => shiftMeseTrend(-1));
  if (D.meseTrendNext) D.meseTrendNext.addEventListener('click', () => shiftMeseTrend(1));
  if (D.meseCmpPrev)   D.meseCmpPrev.addEventListener('click', () => shiftMeseCmp(-1));
  if (D.meseCmpNext)   D.meseCmpNext.addEventListener('click', () => shiftMeseCmp(1));
  // Analisi: selettori mese inline
  if (D.anMeseTrendPrev) D.anMeseTrendPrev.addEventListener('click', () => shiftAnMeseTrend(-1));
  if (D.anMeseTrendNext) D.anMeseTrendNext.addEventListener('click', () => shiftAnMeseTrend(1));
  if (D.anCmpPrev)       D.anCmpPrev.addEventListener('click', () => shiftAnMeseCmp(-1));
  if (D.anCmpNext)       D.anCmpNext.addEventListener('click', () => shiftAnMeseCmp(1));
  // online/offline
  window.addEventListener('online', () => { toast('Online — sincronizzo', 'success'); drainQueue(); });
  window.addEventListener('offline', () => toast('Modalità offline', 'warn'));
  // modal close + drag
  bindModalClose();
  bindDragToClose();
  // shortcut da URL ?action=add-uscita / add-entrata
  const params = new URLSearchParams(location.search);
  const action = params.get('action');
  if (action === 'add-uscita') setTimeout(() => openQuickAdd('uscita'), 300);
  else if (action === 'add-entrata') setTimeout(() => openQuickAdd('entrata'), 300);
}

// ─── PULL TO REFRESH ────────────────────────────────────────
// DISABILITATO (richiesta utente: troppi reload accidentali).
// - Il PTR nativo del browser è spento da overscroll-behavior:contain in CSS
// - Il PTR custom è stato rimosso: nessun touch handler globale per il drag
// - L'elemento #ptr viene nascosto definitivamente
function setupPullToRefresh() {
  const PTR = document.getElementById('ptr');
  if (PTR) PTR.style.display = 'none';
}

// ─── PWA SW REGISTRATION ────────────────────────────────────
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  // ignora se siamo in pagina cache-bust dopo update
  navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW reg failed', err));
}

// ─── INIT ───────────────────────────────────────────────────
// elementi critici che devono esistere — se mancano, HTML e JS sono in
// versioni incoerenti (caso classico: SW serve vecchio app.js con nuovo HTML).
const CRITICAL_DOM_IDS = ['modalQa','qaDatePicker','qaCats','toast','view-home','view-conti','loginOverlay','themeToggle','moduleActions'];
function checkDomIntegrity() {
  const missing = CRITICAL_DOM_IDS.filter(id => !document.getElementById(id));
  if (missing.length) {
    console.error('[cdc] HTML/JS mismatch — missing IDs:', missing, '— forcing hard reload');
    // ultima visita ricarico: se sono passati < 30s dall'ultimo auto-reload, evita loop
    const last = Number(sessionStorage.getItem('cdc-auto-reload') || 0);
    if (Date.now() - last < 30000) return;
    sessionStorage.setItem('cdc-auto-reload', String(Date.now()));
    try {
      caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))
        .then(() => navigator.serviceWorker.getRegistrations())
        .then(rs => Promise.all((rs || []).map(r => r.unregister())))
        .then(() => location.replace(location.pathname + '?_r=' + Date.now()));
    } catch (_) { location.reload(); }
  }
}

function hideBootSplash() {
  const el = document.getElementById('bootSplash');
  if (!el) return;
  if (!el.classList.contains('hide')) el.classList.add('hide');
  setTimeout(() => { try { el.remove(); } catch(_){} }, 300);
}
// fallback aggressivo: splash forzato a sparire dopo 2.5s qualunque cosa succeda
setTimeout(hideBootSplash, 2500);
// ultimo paracadute: dopo 6s lo rimuoviamo direttamente dal DOM
setTimeout(() => { try { document.getElementById('bootSplash')?.remove(); } catch(_){} }, 6000);
// se l'utente arriva con cache-buster ?_r=... e qualcosa si blocca, dopo 12s ricarica pulito
if (typeof location !== 'undefined' && /[?&]_r=/.test(location.search)) {
  setTimeout(() => {
    if (document.getElementById('bootSplash')) {
      console.warn('[boot] splash ancora presente dopo 12s con ?_r=..., reload pulito');
      try { location.replace(location.pathname + location.hash); } catch(_) { location.reload(); }
    }
  }, 12000);
}

async function init() {
  console.log('[init] start');
  try {
    cacheDOM();
    console.log('[init] cacheDOM ok, D.bcRoot=', !!D.bcRoot, 'D.themeToggle=', !!D.themeToggle);
    checkDomIntegrity();
    loadLocalCache();
    loadQueue();
    applyTheme();
    bindLoginButton();
    // Pulisci eventuale cache-buster ?_r=... dall'URL una volta che siamo arrivati al bootstrap
    if (/[?&]_r=/.test(location.search)) {
      try { history.replaceState({}, '', location.pathname + location.hash); } catch(_) {}
    }
    // Twemoji: prima conversione dell'HTML statico (titolo, nav-pill icons, ecc.)
    twemojify(document.body);
    console.log('[init] twemojify ok');
  } catch (e) {
    console.error('[init] errore pre-auth', e);
    hideBootSplash();
    return;
  }
  // ── AUTH: se l'utente non è autenticato/autorizzato, l'overlay blocca l'app
  // Timeout di sicurezza: se initAuth non risponde in 8s, mostriamo errore
  let authed = false;
  try {
    authed = await Promise.race([
      initAuth(),
      new Promise(res => setTimeout(() => { console.warn('[init] initAuth timeout'); res(false); }, 8000))
    ]);
    console.log('[init] initAuth =', authed);
  } catch (e) {
    console.error('[init] initAuth errore', e);
  }
  if (!authed) {
    // Mantieni l'overlay visibile; non procedere con il resto dell'init
    hideBootSplash();
    return;
  }
  try {
  bindEvents();
  initMonth();
  renderHeader();
  // header iniziale: siamo in home → breadcrumb solo root, niente module-actions
  renderBreadcrumb('home', 'home', null);
  if (D.moduleActions) D.moduleActions.style.display = 'none';
  S.currentView = 'home';
  // render iniziale da cache
  if (S.cats.length || S.tx.length) {
    renderAll();
  }
  // UI di base pronta → nascondi splash subito (la sync da rete continua in background)
  hideBootSplash();
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
  // versioning: check all'init se il SHA locale è diverso dal remoto → mostra badge
  try {
    const verRows = await supaFetch(T.VER + '?select=sha&id=eq.1');
    const sha = verRows && verRows[0] && verRows[0].sha;
    if (sha) {
      if (D.setVersion) D.setVersion.textContent = sha.slice(0, 7);
      if (!S.localSha) {
        // prima visita: registra il SHA corrente come baseline (no badge)
        S.localSha = sha;
        localStorage.setItem(LS.SHA, sha);
      } else if (sha !== S.localSha) {
        // c'è stato un nuovo deploy mentre l'utente era offline / via Realtime
        console.log('[update] new sha detected at init:', sha, 'vs local', S.localSha);
        if (D.btnUpdate) D.btnUpdate.classList.add('show');
      }
    }
  } catch {}
  // utenti autorizzati (per gestione UI nelle impostazioni)
  loadAuthorizedUsers();
  // realtime
  setupRealtime();
  // Watchdog del badge "↻ Aggiorna": riconnette Realtime su visibilitychange/
  // online e fa polling del SHA ogni 60s come backup (in PWA iOS i WebSocket
  // vengono pausati in background, quindi l'evento di deploy può perdersi)
  setupVersionWatchdog();
  // pull-to-refresh
  setupPullToRefresh();
  // drain queue se online
  if (isOnline()) drainQueue();
  // SW
  registerSW();
  } catch (e) {
    console.error('[init] errore post-auth', e);
    hideBootSplash();
  }
  console.log('[init] done');
}

document.addEventListener('DOMContentLoaded', init);

})();
