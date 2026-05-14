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
  prefs: { theme: 'auto', autori: ['Stefano', 'Flavia'], autoreDefault: 'Stefano' },
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
   'modalQa','sheetQa','qaToggle','qaAmt','qaAmtVal','numpad','qaCats','qaTitle','qaDesc','qaAutore',
   'qaDateBtn','qaDateLabel','qaDatePicker','qaSaveBtn','qaSaveLabel',
   'modalTx','txEditAmt','txEditTipo','txEditCat','txEditData','txEditDesc','txEditAutore','txEditSave','txEditDelete',
   'modalCat','catEditTitle','catEditName','catEditTipo','catEditEmojis','catEditColors','catEditSave','catEditDelete',
   'modalBudget','budgetEditTitle','budgetEditAmt','budgetEditSave','budgetEditDelete',
   'modalSettings','setTheme','setAutori','setAutoreDefault','setSave','setExport','setClearCache','setVersion',
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
  el.className = 'toast show toast-' + type;
  clearTimeout(toast._t);
  const dur = ms || (type === 'error' ? 2400 : (type === 'warn' ? 2200 : 1700));
  toast._t = setTimeout(() => el.classList.remove('show'), dur);
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
  // colore macro: prende il colore della prima categoria utente sotto quella macro,
  // oppure un colore stabile derivato dall'id macro
  const MACRO_COLORS = {
    casa:'#3498db', cibo:'#e74c3c', bollette:'#f39c12', trasporti:'#9b59b6',
    salute:'#1abc9c', svago:'#34d399', sport:'#16a34a', abbigliamento:'#a777e3',
    famiglia:'#f472b6', animali:'#fb923c', tecnologia:'#0ea5e9', regali:'#ff5722',
    viaggi:'#06b6d4', lavoro:'#64748b', soldi:'#2ecc71', natura:'#22c55e', altro:'#94a3b8'
  };
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

  // Donut uscite per AUTORE
  renderAutoreDonut(arr);

  // Trend 12 mesi
  renderTrend();

  // Budget vs reale
  renderBudgetBars();
}

function renderAutoreDonut(arrCurrentMonth) {
  if (!D.autoreDonutWrap) return;
  const usc = arrCurrentMonth.filter(t => t.tipo === 'uscita');
  if (!usc.length) {
    D.autoreDonutWrap.innerHTML = '<div class="empty"><div class="emoji">👥</div><div>Nessuna uscita nel mese</div></div>';
    return;
  }
  const byAut = {};
  usc.forEach(t => {
    const nome = t.autore || '(non attribuito)';
    byAut[nome] = (byAut[nome] || 0) + Number(t.importo);
  });
  const segs = Object.keys(byAut).map(nome => ({
    label: nome,
    value: byAut[nome],
    color: colorForAutore(nome === '(non attribuito)' ? null : nome)
  }));
  Charts.renderDonut(D.autoreDonutWrap, segs, { subLabel: 'per persona' });
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
function renderList() {
  const { anno, mese } = S.currentMonth;
  let arr = S.tx.filter(t => inMonth(t.data, anno, mese));
  if (S.listFilter !== 'all') arr = arr.filter(t => t.tipo === S.listFilter);
  if (S.donutFilter != null) {
    if (typeof S.donutFilter === 'object' && S.donutFilter.type === 'macro') {
      const macroId = S.donutFilter.value;
      const catIdsInMacro = new Set(S.cats.filter(c => (c.macro_categoria || 'altro') === macroId).map(c => c.id));
      arr = arr.filter(t => catIdsInMacro.has(t.categoria_id));
    } else {
      // legacy: filter by categoria_id
      arr = arr.filter(t => t.categoria_id === S.donutFilter);
    }
  }
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
    html +=   '<div class="cat-group-header" draggable="true" data-macro="' + mid + '">';
    html +=     '<span class="cgh-handle" title="Trascina per riordinare">⋮⋮</span>';
    html +=     '<span class="cgh-ic">' + (m ? m.icon : '📦') + '</span>';
    html +=     '<span class="cgh-name">' + esc(macroLabel(mid)) + '</span>';
    html +=     '<span class="cgh-count">' + subs.length + '</span>';
    html +=   '</div>';
    html +=   '<div class="cat-group-subs">';
    subs.forEach(c => {
      html += '<div class="cat-row sub" draggable="true" data-cat-id="' + c.id + '" data-macro="' + mid + '">' +
        '<span class="cat-handle">⋮⋮</span>' +
        '<div class="cat-icon" style="background:' + (c.colore || '#666') + '22;color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</div>' +
        '<div class="cat-name">' + esc(c.nome) + '</div>' +
      '</div>';
    });
    html +=   '</div>';
    html += '</div>';
  });
  D.catList.innerHTML = html;
  bindCatDragAndClick();
}
function bindCatDragAndClick() {
  // ── Drag&drop dei gruppi macro (sui cat-group-header) ──────────
  let draggedGroup = null;
  $$('.cat-group-header', D.catList).forEach(h => {
    h.addEventListener('dragstart', e => {
      draggedGroup = h.closest('.cat-group');
      if (!draggedGroup) return;
      draggedGroup.classList.add('dragging-group');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'macro:' + h.getAttribute('data-macro'));
      // stopPropagation in modo che dragstart non scateni anche su cat-row
      e.stopPropagation();
    });
    h.addEventListener('dragend', () => {
      if (draggedGroup) draggedGroup.classList.remove('dragging-group');
      $$('.drag-over-group', D.catList).forEach(x => x.classList.remove('drag-over-group'));
      const ref = draggedGroup;
      setTimeout(() => { if (ref === draggedGroup) draggedGroup = null; }, 50);
    });
    h.addEventListener('dragover', e => {
      if (!draggedGroup) return;
      const tg = h.closest('.cat-group');
      if (!tg || tg === draggedGroup) return;
      e.preventDefault();
      e.stopPropagation();
      tg.classList.add('drag-over-group');
    });
    h.addEventListener('dragleave', e => {
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

  // ── Drag&drop delle sotto-categorie (intra-macro) ──────────────
  let draggedEl = null;
  $$('.cat-row', D.catList).forEach(el => {
    el.addEventListener('click', () => {
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
      if (!draggedEl || draggedEl === el) return;
      // riordino consentito solo intra-macro (la macro cambia dal modal di modifica)
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
      // sposta dentro lo stesso .cat-group-subs
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
    if (D.qaAutore) populateAutoreSelect(D.qaAutore, S.prefs.autoreDefault || (S.prefs.autori && S.prefs.autori[0]) || 'Stefano');
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
  const autore = (D.qaAutore && D.qaAutore.value) || S.prefs.autoreDefault || null;
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
  if (D.txEditAutore) populateAutoreSelect(D.txEditAutore, t.autore || S.prefs.autoreDefault);
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
  // optimistic
  const idx = S.tx.findIndex(t => t.id === S.editTxId);
  if (idx >= 0) S.tx[idx] = Object.assign({}, S.tx[idx], payload);
  saveLocalCache();
  renderHome(); renderList();
  closeModal('modalTx');
  toast('Transazione modificata', 'success');
  const path = T.TX + '?id=eq.' + S.editTxId;
  const options = { method: 'PATCH', body: JSON.stringify(payload) };
  if (!isOnline()) { enqueue({ path, options }); S.editTxId = null; return; }
  try { await supaFetch(path, options); }
  catch { enqueue({ path, options }); }
  S.editTxId = null;
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
  // optimistic
  S.tx = S.tx.filter(t => t.id !== S.editTxId);
  saveLocalCache();
  renderHome(); renderList();
  closeModal('modalTx');
  toast('Transazione eliminata', 'success');
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
  const list = (S.prefs.autori && S.prefs.autori.length) ? S.prefs.autori : ['Stefano','Flavia'];
  sel.innerHTML = list.map(a => '<option' + (a === current ? ' selected' : '') + '>' + esc(a) + '</option>').join('');
}
// Colore stabile per autore (per donut autori)
const AUTORE_COLORS = ['#3498db', '#e91e63', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
function colorForAutore(nome) {
  if (!nome) return '#94a3b8';
  const list = (S.prefs.autori && S.prefs.autori.length) ? S.prefs.autori : ['Stefano','Flavia'];
  const idx = list.indexOf(nome);
  if (idx >= 0) return AUTORE_COLORS[idx % AUTORE_COLORS.length];
  // fallback: hash semplice
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
      toast('Categoria creata', 'success');
    } catch (e) {
      toast('Errore: ' + e.message, 'error');
    }
  } else {
    // optimistic locale
    const c = catById(S.editCatId);
    if (c) Object.assign(c, payload);
    saveLocalCache();
    renderCatView(); renderHome(); renderList();
    closeModal('modalCat');
    toast('Categoria modificata', 'success');
    const path = T.CATS + '?id=eq.' + S.editCatId;
    const options = { method: 'PATCH', body: JSON.stringify(payload) };
    if (!isOnline()) { enqueue({ path, options }); S.editCatId = null; return; }
    try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    S.editCatId = null;
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
  S.cats = S.cats.filter(c => c.id !== S.editCatId);
  S.tx.forEach(t => { if (t.categoria_id === S.editCatId) t.categoria_id = null; });
  saveLocalCache();
  renderCatView(); renderHome(); renderList();
  closeModal('modalCat');
  toast('Categoria eliminata', 'success');
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
  if (!(importo >= 0)) { toast('Inserisci un importo valido (numero ≥ 0)', 'warn'); return; }
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
  toast('Budget salvato', 'success');
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
  toast('Budget rimosso', 'success');
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
  if (D.setAutori) D.setAutori.value = (S.prefs.autori || ['Stefano', 'Flavia']).join(', ');
  if (D.setAutoreDefault) populateAutoreSelect(D.setAutoreDefault, S.prefs.autoreDefault || (S.prefs.autori && S.prefs.autori[0]) || 'Stefano');
}
async function saveSettings() {
  const themeNew = D.setTheme.value;
  const autoriNew = D.setAutori
    ? D.setAutori.value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
    : (S.prefs.autori || ['Stefano', 'Flavia']);
  const autoreDefaultNew = (D.setAutoreDefault && D.setAutoreDefault.value) || autoriNew[0] || 'Stefano';
  S.prefs.theme = themeNew;
  S.prefs.autori = autoriNew.length ? autoriNew : ['Stefano', 'Flavia'];
  S.prefs.autoreDefault = autoreDefaultNew;
  applyTheme();
  saveLocalCache();
  closeModal('modalSettings');
  toast('Impostazioni salvate', 'success');
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: S.prefs }) };
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
  // Salva button (visibile solo quando importo + categoria scelti)
  if (D.qaSaveBtn) {
    D.qaSaveBtn.addEventListener('click', () => {
      if (QA.selectedCatId === undefined) return;
      quickSave(QA.selectedCatId);
    });
  }
  // Date pill: tap apre il date picker nativo
  if (D.qaDateBtn && D.qaDatePicker) {
    D.qaDateBtn.addEventListener('click', e => {
      e.preventDefault();
      // showPicker() richiede gesto utente sincrono — non await/setTimeout
      try {
        if (typeof D.qaDatePicker.showPicker === 'function') {
          D.qaDatePicker.showPicker();
        } else {
          D.qaDatePicker.focus();
          D.qaDatePicker.click();
        }
      } catch (err) {
        console.warn('showPicker failed, falling back to focus', err);
        D.qaDatePicker.focus();
      }
    });
    D.qaDatePicker.addEventListener('change', renderQaDateLabel);
    D.qaDatePicker.addEventListener('input', renderQaDateLabel);
  }
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
function setupPullToRefresh() {
  const PTR = document.getElementById('ptr');
  if (!PTR) return;
  const ic = PTR.querySelector('.ptr-ic');
  const THRESHOLD = 80;
  const MAX = 140;
  let startY = null, dy = 0, active = false, refreshing = false;

  function paint() {
    const t = Math.max(0, Math.min(dy, MAX));
    PTR.style.transform = 'translateY(' + (t - 60) + 'px)';
    if (ic) ic.style.transform = 'rotate(' + (t * 2.6) + 'deg)';
    PTR.classList.add('active');
    PTR.classList.toggle('ready', t >= THRESHOLD);
  }
  function snapBack() {
    PTR.classList.remove('active', 'ready');
    PTR.style.transform = '';
    if (ic) ic.style.transform = '';
    startY = null; dy = 0; active = false;
  }

  document.addEventListener('touchstart', e => {
    if (refreshing) return;
    if (window.scrollY > 0) return;
    if (document.querySelector('.modal.open')) return;
    startY = e.touches[0].clientY;
    dy = 0;
    active = false;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (startY == null || refreshing) return;
    if (window.scrollY > 0) { startY = null; return; }
    dy = e.touches[0].clientY - startY;
    if (dy > 6) {
      active = true;
      paint();
    }
  }, { passive: true });

  document.addEventListener('touchend', async () => {
    if (refreshing) return;
    if (!active) { snapBack(); return; }
    if (dy >= THRESHOLD) {
      refreshing = true;
      PTR.classList.add('spinning', 'ready', 'active');
      PTR.style.transform = 'translateY(20px)';
      vibrate(15);
      try {
        S.trendCache = null;
        await reloadAll();
        renderAll();
      } catch (err) {
        console.warn('PTR reload failed', err);
        toast('Aggiornamento non riuscito', 'error');
      }
      PTR.classList.remove('spinning');
      setTimeout(() => {
        snapBack();
        refreshing = false;
      }, 280);
    } else {
      snapBack();
    }
  });

  document.addEventListener('touchcancel', () => {
    if (!refreshing) snapBack();
  });
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
const CRITICAL_DOM_IDS = ['fab','modalQa','qaDatePicker','qaCats','toast'];
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

async function init() {
  cacheDOM();
  checkDomIntegrity();
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
  // pull-to-refresh
  setupPullToRefresh();
  // drain queue se online
  if (isOnline()) drainQueue();
  // SW
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);

})();
