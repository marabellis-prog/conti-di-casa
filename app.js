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
  USERS: 'cdc_authorized_users',
  SPESA: 'cdc_lista_spesa',
  TODO: 'cdc_lista_todo',
  SCADENZE: 'cdc_scadenze',
  BACKUPS: 'cdc_backups'
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
  LAST_MONTH: 'cdc-last-month',
  SPESA: 'cdc-spesa',
  TODO: 'cdc-todo',
  SCADENZE: 'cdc-scadenze'
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
  accessToken: null,    // JWT della sessione Supabase (per RLS: usa l'utente, non l'anon key)
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
  // Lista della spesa
  spesa: [],                 // array di item {id, nome, icona, quantita, note, preso, ordine}
  todo: [],                  // array di item {id, nome, icona, note, scadenza, fatto, ordine}
  editTodoId: null,
  editSpesaId: null,         // id dell'item correntemente in modifica (null = nuovo)
  // Scadenze
  scadenze: [],              // array di item {id, titolo, icona, data, anticipo_giorni, ricorrenza, note, fatto, ordine}
  editScadenzaId: null,
  scadCalCursor: null,       // {anno, mese} mese visualizzato in vista calendario
  scadCalSelectedDay: null,  // 'YYYY-MM-DD' giorno selezionato per dettaglio
  // pending tx tmp ids
  pendingTxIds: new Set()
};

// ─── DOM CACHE ──────────────────────────────────────────────
const D = {};
function cacheDOM() {
  ['appTitle','appSubtitle','monthLabel','btnMonthPrev','btnMonthNext','btnUpdate','themeToggle',
   'bcRoot','bcModule','bcLeaf',
   'moduleActions','moduleMonth','moduleActionPills',
   'view-home','view-conti','view-list','view-cat','view-spesa',
   'spesaListToBuy','spesaListBought','spesaCountToBuy','spesaCountBought',
   'modalSpesa','spesaEditTitle','spesaEditIconBtn','spesaEditNome','spesaEditQtyMinus','spesaEditQtyValue','spesaEditQtyPlus','spesaEditNote','spesaEditSave','spesaEditDelete',
   'view-todo','todoListToDo','todoListDone','todoCountToDo','todoCountDone',
   'homeTodoPreview','homeTodoCount',
   'modalTodo','todoEditTitle','todoEditIconBtn','todoEditNome','todoEditScadenza','todoEditNote','todoEditSave','todoEditDelete',
   'modalClearTodo',
   // Scadenze
   'view-scadenze-list','view-scadenze-cal',
   'scadenzeListContent',
   'scadCalPrev','scadCalNext','scadCalTitle','scadCalGrid','scadCalDayDetails','scadCalDayTitle','scadCalDayList',
   'homeScadenzePreview','homeScadenzeCount',
   'modalScadenza','scadenzaEditTitle','scadenzaEditIconBtn','scadenzaEditTitolo','scadenzaEditData','scadenzaEditNote','scadenzaEditSave','scadenzaEditDelete',
   'scadenzaAnticipoChips','scadenzaRicorrenzaChips',
   'modalScadenzaComplete','scadCompleteTitle','scadCompleteSubtitle','scadCompleteNota','scadCompleteSave',
   'modalClearScadenze',
   'modalIconPicker','iconPickerSearch','iconPickerCategories','iconPickerGrid',
   'homeContiDonut','homeContiSaldo','homeContiSubtle','homeContiPeriod','goToList','goToCategorie',
   'homeSpesaPreview','homeSpesaCount',
   'saldoNum','saldoIn','saldoOut','ultime','donutWrap',
   'carouselTrack','carouselPrev','carouselNext','carouselTitle','carouselDots',
   'categFrom','categTo',
   'trendFrom','trendTo','trend3mWrap',
   'autoreFrom','autoreTo',
   'listFilters','txList','txTrendWrap','activeFiltersBar',
   'btnTogglePeriod','btnOpenFilters','filterBadge',
   'modalFilters','filterCats','filterAutori','btnApplyFilters','btnResetFilters',
   'listPeriodCustom','listPeriodFrom','listPeriodTo','listPeriodSummary',
   // Transazioni v2
   'tx2Search','tx2SearchClear','tx2FiltBtn','tx2FiltBadge','tx2ActiveBar','tx2Panel',
   'tx2Quick','tx2From','tx2To','tx2DatesClear','tx2CatFilter','tx2AutoreFilter','tx2ScatoloChip','tx2Chart','tx2Summary','tx2List',
   'tx2PerPage','tx2Prev','tx2Next','tx2PageInfo',
   'budgetList','catTabs','catList','btnAddCat',
   'fab','toast',
   // modals
   'modalQa','sheetQa','qaToggle','qaAmt','qaAmtVal','numpad','qaCats','qaTitle','qaDesc','qaAutore','qaPersonale',
   'qaDateBtn','qaDateLabel','qaDatePicker','qaSaveBtn','qaSaveLabel',
   // Wizard nuova transazione (fullscreen multi-step)
   'modalWizard','wizClose','wizProgress','wizStepNum','wizCats','wizCatLabel','wizBack','wizNext','wizDelFooter',
   'wizStep1Title','wizMov','wizSpesaBlock','wizComune','wizFonti',
   'wizSplit','wizSplitChips','wizSplitCustom','wizSplitRange','wizSplitReadout','wizStraord','wizStraordRow',
   'wizBoxBlock','wizBoxInfo','wizChiLabel','wizChi','wizMotivoWrap','wizMotivo',
   'wizAmt','wizAmtVal','wizNumpad',
   'wizDataPagBtn','wizDataPag','wizDataPagLabel','wizDataLbl','wizStep3Title','wizCompSection','wizCompQuick','wizCompDa','wizCompA','wizRecap','wizNote',
   // Conti — dashboard Riepilogo (modello scatolo/equità)
   'cdScatolo','cdScatoloCard','cdScatoloFoot','cdEquityLbl','cdEquityMain','cdEquityInstr','cdEquityPersons','cdSettleBtn',
   'cdCashFlow','cdCashFlowK','cdAvgMonthCell','cdAvgMonth','cdAvgMonthK','cdAvgMeanCell','cdAvgMean','cdAvgMeanSub','cdAvgNote','cdGuidaBtn','cdRecent',
   'statsSpeseMeseBtn','statsMediaBtn','statsDetNav','statsDetPrev','statsDetMonthLabel','statsDetNext','statsScope','statsAnno','statsMese','statsTitle','statsSub','statsChart','statsContribTitle','statsContrib','statsListTitle','statsList',
   'statsMPrev','statsMLabel','statsMNext','statsMTitle','statsMChart','statsMSub','statsMContribTitle','statsMContrib','statsMListTitle','statsMList',
   'tx2RiallineaBtn','modalRiallineo','rialBalance','rialDir','rialAmt','rialContaRow','rialConta','rialNote','rialSave','rialHint',
   'modalTx','txEditTitle','txEditTypeBadge','txEditAmt','txEditData','txEditSave','txEditDelete',
   'txEditSpesaFields','txEditFonte','txEditCat','txEditPersonale',
   'txEditSplitWrap','txEditSplit','txEditSplitCustom','txEditSplitRange','txEditSplitReadout','txEditStraord','txEditStraordRow',
   'txEditBoxFields','txEditChiLabel','txEditAutore','txEditMotivoWrap','txEditMotivo',
   'txEditCompQuick','txEditCompDa','txEditCompA',
   'modalCat','catEditTitle','catEditName','catEditTipo','catEditMacro','catEditEmojis','catEditColors','catEditSave','catEditDelete',
   'modalBudget','budgetEditTitle','budgetEditAmt','budgetEditSave','budgetEditDelete',
   'modalSettings','setTheme','setSave','setClearCache','setVersion','setRestore',
   'setBackupNow','setBackupKeep','setBackupKeepSave','modalRestore','restoreBody',
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
      // RE-CACHE: innerHTML replacement crea NUOVI nodi DOM. I riferimenti
      // in D (es. D.qaSaveLabel) puntano ai vecchi nodi ora detached, e
      // ogni successivo D.qaSaveLabel.innerHTML = ... scrive nel vuoto.
      // Aggiorniamo D con i nuovi nodi figli che hanno id.
      btn.querySelectorAll('[id]').forEach(el => { D[el.id] = el; });
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
  // apikey = SEMPRE la anon key (identifica il progetto). Authorization = JWT
  // dell'utente loggato se disponibile → PostgREST valuta le RLS come QUELL'utente
  // (auth.email()); se manca la sessione si ricade sulla anon key (comportamento
  // storico). Così l'app resta identica finché le RLS restano permissive, ma è
  // già pronta per le policy per-utente.
  const bearer = S.accessToken || SUPA_KEY;
  const headers = Object.assign({
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + bearer,
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
    // Robusto ai corpi VUOTI: con `Prefer: return=minimal` PostgREST risponde
    // 200/201 SENZA body → res.json() darebbe "Unexpected end of JSON input".
    if (res.status === 204 || res.status === 205) return null;
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch (_) { return null; }
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
  try { S.spesa = JSON.parse(localStorage.getItem(LS.SPESA) || '[]'); } catch { S.spesa = []; }
  try { S.todo  = JSON.parse(localStorage.getItem(LS.TODO)  || '[]'); } catch { S.todo  = []; }
  try { S.scadenze = JSON.parse(localStorage.getItem(LS.SCADENZE) || '[]'); } catch { S.scadenze = []; }
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
  localStorage.setItem(LS.SPESA, JSON.stringify(S.spesa));
  localStorage.setItem(LS.TODO,  JSON.stringify(S.todo));
  localStorage.setItem(LS.SCADENZE, JSON.stringify(S.scadenze));
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

  const [cats, tx, budgets, prefsRows, verRows, spesa, todo, scadenze] = await Promise.all([
    supaFetch(T.CATS + '?select=*&order=ordine.asc,id.asc'),
    supaFetch(T.TX + '?select=*&data=gte.' + cutoffStr + '&order=data.desc,id.desc'),
    supaFetch(T.BUDGET + '?select=*&anno=eq.' + now.getFullYear()),
    supaFetch(T.PREFS + '?select=dati&id=eq.1'),
    supaFetch(T.VER + '?select=sha&id=eq.1'),
    supaFetch(T.SPESA + '?select=*&order=ordine.asc,created_at.asc'),
    supaFetch(T.TODO + '?select=*&order=ordine.asc,created_at.asc'),
    supaFetch(T.SCADENZE + '?select=*&order=data.asc,id.asc')
  ]);
  S.cats = cats || [];
  S.tx = tx || [];
  // reloadAll carica solo gli ultimi ~3 mesi: lo storico completo (per i totali
  // annuali della home/statistiche) va ricaricato → resetta il flag, altrimenti
  // il widget Conti mostrerebbe una cifra parziale finché non si fa un refresh.
  S.allTxLoaded = false;
  S.budgets = budgets || [];
  S.spesa = spesa || [];
  S.todo  = todo  || [];
  S.scadenze = scadenze || [];
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
  try { renderSpesa();         } catch (e) { console.warn('[renderAll] renderSpesa',         e); }
  try { renderTodo();          } catch (e) { console.warn('[renderAll] renderTodo',          e); }
  try { renderScadenzeList();  } catch (e) { console.warn('[renderAll] renderScadenzeList',  e); }
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
  // Nota: NON resettiamo S.trendRange — adesso il default del carousel
  // è "anno corrente" (indipendente dal mese selezionato in alto). Se
  // l'utente ha personalizzato il range vogliamo preservarlo.
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

// ─── LISTA DELLA SPESA ──────────────────────────────────────
// Categorie del selettore icone (modal). Ogni categoria ha un set di emoji.
// Le keyword sotto fanno match ANCHE su radici/prefissi (es. "natalin" → 🎄
// per matchare "natalini, natalino, natalina, natale").
// ─── ICONE UNIFICATE: una marea, condivise da tutti i moduli ─
// Spesa / ToDo / Scadenze attingono dallo stesso pool gigante.
// ~34 categorie tematiche, ~750+ emoji totali.
const ALL_ICON_CATS = [
  { id: 'food', label: 'Cibo & Cucina', icon: '🍽',
    emojis: ['🍞','🥖','🥐','🥯','🥪','🍕','🍝','🍜','🍲','🍱','🥟','🍣','🍤','🥘','🥗','🌮','🌯','🥙','🍔','🍟','🌭','🥨','🧇','🥞','🍳','🍿','🥫','🥣','🍚','🍙','🍘','🍢','🍡','🥠','🫔','🍛','🍴','🥄','🔪','🍽','🥢','🧑‍🍳'] },
  { id: 'fruit', label: 'Frutta', icon: '🍎',
    emojis: ['🍎','🍏','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🌰','🥜','🍇'] },
  { id: 'veg', label: 'Verdura', icon: '🥦',
    emojis: ['🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🫛','🍄','🌽','🫚','🫛'] },
  { id: 'drinks', label: 'Bevande', icon: '🥤',
    emojis: ['💧','🥛','☕','🫖','🍵','🧃','🥤','🧋','🍶','🍾','🍷','🥂','🍺','🍻','🥃','🍸','🍹','🧉'] },
  { id: 'sweet', label: 'Dolci & Dessert', icon: '🍰',
    emojis: ['🍫','🍬','🍭','🍮','🍯','🍰','🎂','🧁','🍩','🍪','🥧','🍦','🍨','🍧','🌰','🍡'] },
  { id: 'meat', label: 'Carne & Pesce', icon: '🥩',
    emojis: ['🥩','🥓','🍗','🍖','🌭','🍔','🐟','🐠','🐡','🦐','🦑','🦞','🦀','🐙','🦪','🍤','🍣','🥚'] },
  { id: 'dairy', label: 'Latticini & Uova', icon: '🧀',
    emojis: ['🧀','🥚','🥛','🧈','🍳','🥞','🍶'] },
  { id: 'home', label: 'Casa & Arredo', icon: '🏠',
    emojis: ['🏠','🏡','🛏','🛋','🚪','🪟','🪑','🖼','🪞','📺','💡','🕯','🛁','🚽','🚿','🛜','🔌','🔋','🗝','🔑','🪜','🪤','🛟','🪧','🪟'] },
  { id: 'clean', label: 'Pulizia & Bagno', icon: '🧼',
    emojis: ['🧹','🧺','🧻','🧴','🧼','🪣','🧽','🪥','🪒','🧯','🗑','♻️','🚿','🛁','🚽','🚰','🪠'] },
  { id: 'health', label: 'Salute & Medico', icon: '🩺',
    emojis: ['💊','🩹','🩺','💉','🌡','🩼','🦷','👓','😷','🏥','🩸','💓','🧬','🦴','🧠','🫀','🫁','🩻','🧪','🔬','🤧','🤒','🤕','🥽','🚑','🆘','👁','👂','👃','🦷','🦠','🧫','⚕️'] },
  { id: 'baby', label: 'Bambini', icon: '👶',
    emojis: ['👶','🍼','🧸','🧷','🎈','🪀','🍭','🎀','🪅','🛒','🦄','🎂'] },
  { id: 'family', label: 'Persone & Famiglia', icon: '👨‍👩‍👧',
    emojis: ['👨‍👩‍👧','👨‍👩‍👦','👨‍👨‍👧','👫','👬','👭','👶','🧒','👦','👧','🧑','👨','👩','👴','👵','🤝','💌','💝','🎂','🎁','🤰','🤱','🤵','👰','💑','💏','🧑‍🤝‍🧑','👯','🧜'] },
  { id: 'pets', label: 'Animali', icon: '🐾',
    emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🐝','🦋','🐌','🐞','🐢','🐍','🦎','🐠','🐟','🐡','🦈','🐙','🦀','🦐','🦞','🐚','🐾','🦴','🐕','🐩','🐈','🐴','🐎','🦄','🦏','🐂','🐃','🦒','🐘','🦬','🦛','🦓','🦘','🦔','🦦','🦫','🦥','🦨','🦡'] },
  { id: 'plants', label: 'Piante & Natura', icon: '🪴',
    emojis: ['🪴','🌱','🌿','🍀','🍃','🌳','🌲','🌴','🌵','🌾','🍂','🍁','☘','🌹','🌷','🌺','🌸','🌼','🌻','🪷','💐','🌱'] },
  { id: 'weather', label: 'Meteo & Stagioni', icon: '☀️',
    emojis: ['☀','⛅','☁','🌧','⛈','🌩','❄','☃','⛄','🌨','🌬','🌫','🌪','🌈','🌤','🌥','🌦','💨','🌡','☔','💧','🔥','💦','🌊','⚡','🌙','⭐','🌟','✨','💫','🌍','🌎','🌏','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌚','🌛','🌜'] },
  { id: 'tools', label: 'Bricolage & Utensili', icon: '🛠',
    emojis: ['🛠','🔨','🔧','🪛','🔩','⚙️','🪚','🪜','📏','📐','✂️','🧰','🧲','🪤','⛓','🪓','⚒','🗜','🧱','🪟'] },
  { id: 'office', label: 'Ufficio & Documenti', icon: '📋',
    emojis: ['📋','📑','📄','📃','✏️','🖊','🖋','✒️','📨','📬','📭','📮','💼','🪪','🧾','📂','📁','📊','📈','📉','📌','📎','🖇','🗂','📰','📝','📒','📓','📔','📕','📗','📘','📙','📚','📖','🖍','🖌','🪧','⚖️','🏛'] },
  { id: 'money', label: 'Banca & Soldi', icon: '💰',
    emojis: ['🏦','💳','💰','💸','💵','💴','💶','💷','🪙','💹','📈','📉','🧾','🤝','💼','💎','🏧','🪪'] },
  { id: 'tech', label: 'Tecnologia', icon: '📱',
    emojis: ['📱','💻','⌨️','🖱','🖥','🖨','📷','📸','🎧','🔋','🔌','💾','💿','📀','📻','🎮','🕹','📺','💡','📡','📞','☎️','🔭','🔬','📠','📟','📹','🎥','🛰','🤖','🧮'] },
  { id: 'travel', label: 'Viaggi', icon: '✈️',
    emojis: ['✈','🛫','🛬','🛩','🛳','⛴','⛵','🚢','🚤','🛥','🛶','🏨','🗺','🧭','🎫','🛂','🛃','🛄','🛅','🪪','🏖','🏝','🏔','⛰','🌋','🗽','🎢','🎡','🎠','🛝','🎪','🗿','🏞','🏜','🌅','🌄','🌇'] },
  { id: 'transport', label: 'Trasporti', icon: '🚗',
    emojis: ['🚗','🚙','🚕','🚖','🛻','🚚','🚛','🚜','🏍','🛵','🛴','🚲','🚂','🚆','🚄','🚅','🚇','🚌','🚏','🚦','🚥','⛽','🅿','🛞','🛣','🛤','🚉','🚊','🚞','🚝','🚟','🚎','🚍','🚘'] },
  { id: 'buildings', label: 'Edifici & Luoghi', icon: '🏛',
    emojis: ['🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏪','🏬','🏭','🏯','🏰','🕌','⛪','🕍','🛕','🏛','⛩','🏗','🏚','🏘','🏟','🏨','💒','🗼','🗽','🌁','🌆','🌃'] },
  { id: 'clothes', label: 'Abbigliamento', icon: '👕',
    emojis: ['👕','👖','👗','👘','👙','👚','👔','👞','👟','🥾','👢','👠','👡','🩴','🧢','🎩','👒','🧣','🧤','🧦','🩲','🩳','🥼','🥋','🦺','👜','👛','👝','🎒','🕶','👓','💍','💄','💼','🪖','🥻','🩱'] },
  { id: 'gifts', label: 'Regali & Feste', icon: '🎁',
    emojis: ['🎁','🎀','🎂','🎈','🎊','🎉','🥳','🎆','🎇','🎄','🌟','⭐','🕯','🎃','🐰','🥚','💝','🍾','🥂','🪅','🪩','🎭','🎨','🎤','🧧','🎏','🎎','🎐','🎑','🪔'] },
  { id: 'sport', label: 'Sport', icon: '⚽',
    emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','⛳','🥅','🏹','🎣','🛹','🛼','🎿','⛷','🏂','🏊','🚴','🚵','🏋️','🤸','🧘','⛸','🥌','🥋','🥊','🤿','🤺','🪂','⛹','🏇','🏌','🤾','🤽','🤼','🏃','🚶','🧗'] },
  { id: 'hobby', label: 'Hobby & Giochi', icon: '🎮',
    emojis: ['🎨','🎬','🎤','🎧','🎮','🕹','🎲','🎳','🎯','🃏','🀄','🎴','🧩','♟','🪅','🪀','🧶','🧵','🪡','📷','📸','📹','🎥','🎞','🖼','🪆','🪄'] },
  { id: 'music', label: 'Musica', icon: '🎵',
    emojis: ['🎵','🎶','🎼','🎷','🎺','🎸','🪕','🎻','🥁','🪘','🎹','🎤','🎧','🎙','📯','🪗','📻','🔊','🔇','🔈','🔉','📣','📢'] },
  { id: 'school', label: 'Scuola & Studio', icon: '🎓',
    emojis: ['🏫','🎓','📚','📖','✏','🖊','📓','📕','📒','📐','📏','✒','🖍','📝','🪧','🔬','🔭','🧮','👨‍🏫','👩‍🏫','👨‍🎓','👩‍🎓','📔','📗','📘','📙','📜','🧪'] },
  { id: 'work', label: 'Lavoro', icon: '💼',
    emojis: ['💼','💻','🖥','📊','📈','📉','📞','📧','📅','📆','⏰','⌛','⏳','🪪','🤝','📋','📑','👔','🏢','⚙️','🧑‍💼','👨‍💼','👩‍💼','👨‍⚕️','👩‍⚕️','👨‍🔬','👩‍🔬','👨‍🌾','👩‍🌾','👨‍🍳','👩‍🍳','👨‍🚒','👩‍🚒','👮','🕵','💂','🥷','🤵'] },
  { id: 'shop', label: 'Shopping', icon: '🛒',
    emojis: ['🛒','🛍','🧾','💳','💰','🏪','🏬','🏤','🏣','📦','📮','📭','📬','🪙','🏷','🎫','🎟','🔖'] },
  { id: 'comm', label: 'Comunicazione', icon: '📞',
    emojis: ['📞','📱','📟','📠','📧','✉','📨','📤','📥','📩','💬','🗨','🗯','💭','📢','📣','📯','🔔','🔕','📡','📺','📻','📰','💌','📩','📤','📥','📦','📫','📪','📬','📭'] },
  { id: 'religion', label: 'Religione', icon: '⛪',
    emojis: ['⛪','✝','✡','☪','☸','🕉','☯','🙏','📿','🕌','🕍','🛕','🪔','🕯','⛩','👼','😇','👑','💒','⚱️','🪦','🕊'] },
  { id: 'safety', label: 'Sicurezza & Emergenza', icon: '🚨',
    emojis: ['🚨','🚓','🚑','🚒','🚔','🧯','🚧','⚠','⛔','🚫','🛑','📴','🆘','♨','☢','☣','🚷','🚭','🚳','🚯','🚱','🚹','🚺','🛂','🛅','🛡','🔐','🔒','🔓','🔏','🔑','🗝'] },
  { id: 'symbols', label: 'Simboli', icon: '⭐',
    emojis: ['⭐','🌟','✨','💫','⚡','🔥','💥','💢','💯','✅','❌','⭕','❗','❓','♻','✔','✖','➕','➖','➗','✳','✴','❇','❎','🔴','🟢','🔵','🟡','🟠','🟣','⚪','⚫','🟤','🔶','🔷','🔸','🔹','🔺','🔻','▶','◀','⬆','⬇','⬅','➡','↗','↘','↙','↖','↕','↔','🔃','🔄','🔼','🔽','🆗','🆕','🆒','🆙','🆓','🆖','🔠','🔡','🔢','🔣','💠','♾','♂','♀'] },
  { id: 'time', label: 'Tempo & Calendario', icon: '⏰',
    emojis: ['⌚','⌛','⏰','⏱','⏲','🕰','🌅','🌄','🌇','🌆','🌃','🌉','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','📅','📆','🗓','📇','🗒','🗓','⏳','⏱','⌛'] }
];

// Alias retro-compat: tutti i moduli usano lo stesso pool gigantesco.
const TODO_ICON_CATS = ALL_ICON_CATS;

// Keyword TODO: azioni comuni (chiamare, pagare, prenotare, riparare...)
// Match identico a quello della spesa: substring anywhere bidirezionale.
const TODO_KEYWORD_ICONS = [
  // Comunicazione / chiamate
  ['chiama', '📞'], ['telefon', '📱'], ['call', '📞'], ['skype', '📞'], ['zoom', '📞'],
  ['email', '📧'], ['mail', '📧'], ['scriv', '✏️'], ['mess', '💬'], ['whats', '💬'],
  ['sms', '💬'], ['risp', '💬'], ['contatt', '📞'], ['invi', '📤'], ['spedi', '📦'],
  ['ricev', '📥'], ['inoltr', '📤'], ['pec', '📧'], ['fax', '📠'],

  // Pagamenti / finanze
  ['paga', '💳'], ['bonifi', '💸'], ['banc', '🏦'], ['mutuo', '🏦'], ['prestit', '🏦'],
  ['rata', '💸'], ['rate', '💸'], ['tasse', '💰'], ['tax', '💰'], ['iva', '🧾'],
  ['730', '🧾'], ['modello', '📑'], ['imu', '🏠'], ['tari', '🗑'], ['bollett', '🧾'],
  ['fattur', '🧾'], ['stipendi', '💰'], ['nomin', '💰'], ['pension', '💰'],
  ['risparm', '💰'], ['invest', '📈'], ['azione', '📈'], ['borsa', '📈'],

  // Casa / manutenzione
  ['elettr', '🔌'], ['idraul', '🚿'], ['muratore', '🔨'], ['imbianch', '🎨'],
  ['pittor', '🎨'], ['falegnam', '🪚'], ['ripar', '🔧'], ['aggiust', '🔧'],
  ['cambia', '🔧'], ['sostitu', '🔧'], ['install', '🛠'], ['mont', '🛠'],
  ['smont', '🛠'], ['avvit', '🪛'], ['ferrament', '🛠'], ['bricolag', '🛠'],
  ['lavandin', '🚿'], ['rubinett', '🚿'], ['scaric', '🚽'], ['caldai', '🔥'],
  ['boiler', '🔥'], ['termosifon', '🌡'], ['climatiz', '❄️'], ['ariacondiz', '❄️'],
  ['lampadin', '💡'], ['lampada', '💡'], ['interruttor', '🔌'], ['presa', '🔌'],
  ['cavo', '🔌'], ['serratur', '🔑'], ['chiav', '🔑'], ['porta', '🚪'],
  ['finestr', '🪟'], ['tapparell', '🪟'], ['veneziana', '🪟'], ['zanzar', '🪟'],
  ['armadi', '🛋'], ['letto', '🛏'], ['materass', '🛏'], ['lenzuol', '🛏'],
  ['cuscin', '🛏'], ['divano', '🛋'], ['sedie', '🪑'], ['tavolo', '🪑'],

  // Pulizie
  ['pul', '🧹'], ['ripuliscoperi', '🧹'], ['scoperi', '🧹'], ['lava', '🧴'],
  ['lavatric', '🧴'], ['lavastovi', '🧴'], ['stira', '👔'], ['piega', '👕'],
  ['aspirap', '🧹'], ['scopa', '🧹'], ['scopin', '🧹'], ['spazz', '🧹'],
  ['mocio', '🧹'], ['polver', '🧹'], ['ragnatel', '🕸'], ['rifuit', '🗑'],
  ['rifiut', '🗑'], ['spazzatura', '🗑'], ['immondi', '🗑'], ['butta', '🗑'],
  ['raccolta', '♻️'], ['riciclag', '♻️'], ['carta plast', '♻️'],

  // Spesa & commissioni esterne
  ['spesa', '🛒'], ['compra', '🛒'], ['acquist', '🛒'], ['supermerc', '🏪'],
  ['mercato', '🏪'], ['negozio', '🏬'], ['post', '🏤'], ['poste', '🏤'],
  ['pacc', '📦'], ['ritir', '📦'], ['conse', '📦'], ['ordi', '📦'],
  ['amazon', '📦'], ['corrier', '🚚'], ['restitu', '📦'], ['reso', '📦'],

  // Cucina / casa giornaliera
  ['cuc', '🍳'], ['cucinare', '🍳'], ['preparare', '🍳'], ['cena', '🍽'],
  ['pranzo', '🍽'], ['colazione', '☕'], ['merenda', '🍪'], ['ricett', '📖'],
  ['ingred', '🥗'], ['conservare', '🧊'], ['frigorif', '🧊'], ['congel', '🧊'],
  ['frigo', '🧊'],

  // Salute & medico
  ['medic', '🩺'], ['dottor', '🩺'], ['pediatr', '🩺'], ['ginec', '🩺'],
  ['cardio', '🫀'], ['dermat', '🩺'], ['oculist', '👓'], ['dentist', '🦷'],
  ['ortodont', '🦷'], ['estetist', '💄'], ['parruccher', '💇'], ['barbier', '💈'],
  ['visit', '🩺'], ['esame', '🧪'], ['analisi', '🧪'], ['sangu', '🩸'],
  ['urina', '🧪'], ['radiograf', '🩻'], ['risonanz', '🩻'], ['ecograf', '🩺'],
  ['vaccin', '💉'], ['punt', '💉'], ['terap', '💊'], ['cura', '💊'],
  ['medicin', '💊'], ['farmac', '💊'], ['prescrizion', '📑'], ['ricetta', '📑'],
  ['mutua', '🩺'], ['ssn', '🩺'], ['cup', '🩺'],

  // Amministrazione / burocrazia
  ['ammin', '💼'], ['condom', '🏢'], ['assemb', '👥'], ['contratto', '📑'],
  ['firma', '✒️'], ['notai', '📑'], ['avvoc', '⚖️'], ['commerci', '💼'],
  ['caaf', '📑'], ['caf', '📑'], ['agenzia entrate', '🏛'], ['comune', '🏛'],
  ['anagraf', '📑'], ['certific', '📑'], ['carta identit', '🪪'], ['passapor', '🛂'],
  ['patent', '🪪'], ['codice fisc', '🪪'], ['inps', '🏛'], ['inail', '🏛'],
  ['cud', '📑'], ['unic', '📑'], ['isee', '📑'], ['multa', '🚨'], ['ricorso', '⚖️'],
  ['polizia', '🚨'], ['carabinier', '🚨'],

  // Auto / mezzi
  ['auto', '🚗'], ['benzin', '⛽'], ['gasoli', '⛽'], ['lavaggio auto', '🚗'],
  ['gomme', '🛞'], ['pneumatic', '🛞'], ['olio motor', '🛢'], ['filtri', '🚗'],
  ['tagliando', '🚗'], ['revision', '🚗'], ['boll', '🚗'], ['rca', '🚗'],
  ['assicur', '🛡'], ['meccanic', '🔧'], ['carrozzier', '🚗'], ['bici', '🚴'],
  ['motor', '🏍'], ['scooter', '🛵'], ['taxi', '🚕'], ['treno', '🚂'],
  ['aereo', '✈️'], ['volo', '✈️'], ['bigli', '🎫'], ['ticket', '🎫'],

  // Viaggi & vacanze
  ['vacanz', '🏖'], ['viaggio', '🗺'], ['prenot', '🏨'], ['hotel', '🏨'],
  ['b&b', '🏨'], ['airbnb', '🏨'], ['campegg', '⛺'], ['valig', '🧳'],
  ['zaino', '🎒'], ['itinerari', '🗺'], ['mappa', '🗺'], ['gps', '🧭'],
  ['mare', '🏖'], ['montagn', '⛰'], ['piscin', '🏊'],

  // Famiglia / eventi
  ['compleann', '🎂'], ['regal', '🎁'], ['anniver', '💐'], ['matrimon', '💍'],
  ['battes', '👶'], ['comunion', '👼'], ['cresima', '👼'], ['laurea', '🎓'],
  ['festa', '🎉'], ['cena', '🍽'], ['invit', '💌'], ['augur', '💌'],
  ['nonn', '👵'], ['mamma', '👩'], ['papa', '👨'], ['suocer', '👴'],
  ['fratel', '👫'], ['cugin', '👨‍👩‍👧'], ['parent', '👨‍👩‍👧'], ['amic', '🤝'],

  // Animali domestici
  ['veter', '🩺'], ['vacc cane', '💉'], ['toelett', '✂️'], ['guinz', '🐕'],
  ['lettier', '🐾'], ['crocch', '🐾'], ['gatto', '🐱'], ['cane', '🐶'],
  ['canile', '🐶'], ['pension cani', '🐶'], ['pet shop', '🐾'],

  // Lavoro / ufficio
  ['riunion', '👥'], ['meeting', '👥'], ['call lavoro', '💻'], ['conference', '💻'],
  ['videoconf', '💻'], ['progett', '💼'], ['client', '🤝'], ['fornitor', '🤝'],
  ['propost', '📑'], ['present', '📊'], ['report', '📊'], ['ferie', '🏖'],
  ['malatt', '🤒'], ['cv', '📄'], ['curriculum', '📄'], ['collo', '🤝'],
  ['assunzion', '🤝'], ['licenz', '📑'], ['contratt lavor', '📑'], ['busta paga', '💰'],

  // Scuola / studio
  ['scuola', '🏫'], ['materna', '🏫'], ['element', '🏫'], ['medie', '🏫'],
  ['licei', '🏫'], ['universit', '🎓'], ['esame univers', '📚'], ['compiti', '📝'],
  ['lezione', '📚'], ['ripetizion', '📚'], ['studi', '📚'], ['libro', '📚'],
  ['libri', '📚'], ['cancellaria', '✏️'], ['zaino scuol', '🎒'], ['mensa', '🍽'],
  ['professor', '👨‍🏫'],

  // Tempo libero
  ['palestr', '🏋️'], ['yoga', '🧘'], ['pilates', '🧘'], ['corso', '🎓'],
  ['danza', '💃'], ['nuoto', '🏊'], ['calcio', '⚽'], ['tennis', '🎾'],
  ['cinema', '🎬'], ['teatro', '🎭'], ['concer', '🎵'], ['music', '🎵'],
  ['mostra', '🎨'], ['museo', '🏛'], ['libro lett', '📖'], ['lettura', '📖'],
  ['hobby', '🎨'], ['pittura', '🎨'], ['fotograf', '📷'],

  // Generici utili
  ['controll', '🔍'], ['verific', '🔍'], ['cerca', '🔍'], ['guarda', '👁'],
  ['ricord', '🔔'], ['promemoria', '🔔'], ['preparar', '📋'], ['fare', '📝'],
  ['important', '⚠️'], ['urgent', '🚨'], ['scaden', '⏰'], ['appunto', '📝'],
  ['nota', '📝'], ['programm', '📅'], ['agenda', '📒'], ['lista', '📋'],

  // ── ESPANSIONE: pagamenti / banca dettagliati ──────────────
  ['postepay', '💳'], ['paypal', '💳'], ['satispay', '💳'], ['carta credito', '💳'],
  ['carta debito', '💳'], ['carta prepag', '💳'], ['bancomat', '💳'], ['rid', '💸'],
  ['sdd', '💸'], ['domiciliazion', '💸'], ['ricarica', '💳'], ['prelievo', '🏦'],
  ['versament', '🏦'], ['estratto cont', '🧾'], ['saldo cont', '🏦'], ['iban', '🏦'],
  ['conto corrent', '🏦'], ['libretto', '🏦'], ['poste italiane', '🏤'],
  ['f24', '🧾'], ['f23', '🧾'], ['ravvedimento', '⚖️'], ['cartella esattor', '🧾'],
  ['rottamazion', '🧾'], ['agenzia riscoss', '🏛'], ['equitalia', '🏛'],
  ['cedolare', '🧾'], ['irpef', '🧾'], ['imposta', '🧾'],

  // ── ESPANSIONE: bollette / utenze dettagliate ──────────────
  ['enel', '⚡'], ['eni', '🔥'], ['a2a', '⚡'], ['hera', '⚡'], ['acea', '💧'],
  ['mm', '💧'], ['luce', '💡'], ['energia', '⚡'], ['gas', '🔥'], ['acqua', '💧'],
  ['fastweb', '📡'], ['tim', '📡'], ['vodafone', '📡'], ['wind', '📡'], ['iliad', '📡'],
  ['sky', '📺'], ['netflix', '📺'], ['amazon prime', '📺'], ['disney', '📺'],
  ['spotify', '🎵'], ['canone rai', '📺'], ['fibra', '📡'], ['adsl', '📡'],
  ['internet', '📡'], ['telecom', '📡'], ['wifi', '🛜'], ['router', '📡'],

  // ── ESPANSIONE: medico / specialisti dettagliati ───────────
  ['otorin', '👂'], ['ortopedic', '🦴'], ['neurolo', '🧠'], ['psicolo', '🧠'],
  ['psichiat', '🧠'], ['logoped', '🗣'], ['fisioterap', '🦴'], ['osteopat', '🦴'],
  ['agopuntura', '💉'], ['nutrizion', '🥗'], ['dietolo', '🥗'], ['endocrin', '🩺'],
  ['urolog', '🩺'], ['androlog', '🩺'], ['proctolog', '🩺'], ['gastroenter', '🩺'],
  ['pneumolog', '🫁'], ['allergolog', '🤧'], ['reumatolog', '🦴'], ['ematolog', '🩸'],
  ['oncolog', '🩺'], ['radiolog', '🩻'], ['anestes', '🩺'], ['chirurg', '🩺'],
  ['guardia medic', '🏥'], ['118', '🚑'], ['pronto soccor', '🏥'], ['ospedal', '🏥'],
  ['clinic', '🏥'], ['ambulator', '🏥'], ['poliambulator', '🏥'], ['ricov', '🏥'],
  ['operazione', '🩺'], ['intervento', '🩺'], ['biopsia', '🧪'], ['tampone', '🧪'],
  ['ecg', '💓'], ['holter', '💓'], ['mammograf', '🩻'], ['pap test', '🩺'],
  ['cup salute', '🩺'], ['sanitar', '🩺'], ['esent', '📑'], ['ricetta dem', '📑'],
  ['ricetta bian', '📑'], ['piano terap', '💊'], ['protesi', '🦷'],

  // ── ESPANSIONE: documenti / burocrazia ─────────────────────
  ['rinnov', '📑'], ['rinnovo patent', '🪪'], ['rinnovo carta', '🪪'],
  ['duplicato', '📑'], ['autocertificaz', '📑'], ['delega', '📑'], ['procura', '📑'],
  ['testamento', '📑'], ['donazione', '📑'], ['eredità', '📑'], ['successione', '📑'],
  ['catasto', '🏛'], ['visura', '📑'], ['atto', '📑'], ['rogito', '📑'],
  ['compromess', '📑'], ['cila', '📑'], ['scia', '📑'], ['dia', '📑'],
  ['permesso costru', '📑'], ['agibilit', '📑'], ['ape', '📑'],
  ['certificato medic', '📑'], ['referto', '📑'], ['cartella clin', '📑'],
  ['ddt', '📑'], ['scontrino', '🧾'], ['ricevuta', '🧾'], ['preventiv', '📑'],
  ['offerta', '📑'], ['gara', '⚖️'], ['appalto', '⚖️'], ['concorso', '⚖️'],
  ['domanda', '📑'], ['richiesta', '📑'], ['ricorso ammin', '⚖️'],

  // ── ESPANSIONE: scuola / studio ────────────────────────────
  ['iscrizione', '📑'], ['iscriversi', '📑'], ['immatricol', '🎓'], ['tasse univers', '🎓'],
  ['esame', '📚'], ['tesi', '📜'], ['relator', '👨‍🏫'], ['laurea trien', '🎓'],
  ['magistral', '🎓'], ['dottorato', '🎓'], ['master', '🎓'], ['corso aggiorn', '📚'],
  ['ecm', '📚'], ['professor', '👨‍🏫'], ['maestr', '👩‍🏫'], ['insegnant', '👨‍🏫'],
  ['preside', '🏫'], ['segreteria', '📑'], ['portfolio', '📂'],
  ['recital', '🎭'], ['saggio', '🎭'], ['gita', '🚌'], ['campo scuol', '🎒'],
  ['quaderno', '📓'], ['diario', '📒'], ['agenda scolast', '📒'], ['astuccio', '✏️'],
  ['merenda scuol', '🍪'],

  // ── ESPANSIONE: cura della persona / bellezza ──────────────
  ['taglio capell', '✂️'], ['piega', '💇'], ['colore capell', '💇'], ['tinta', '💇'],
  ['mèche', '💇'], ['shatush', '💇'], ['extensions', '💇'], ['barba', '💈'],
  ['manicur', '💅'], ['pedicur', '💅'], ['ricostruz unghie', '💅'], ['smalto', '💅'],
  ['laser', '✨'], ['ceretta', '✨'], ['epilaz', '✨'], ['depilaz', '✨'],
  ['massagg', '💆'], ['terma', '♨️'], ['spa', '♨️'], ['sauna', '♨️'],
  ['solarium', '☀'],

  // ── ESPANSIONE: bambini ────────────────────────────────────
  ['asilo nido', '👶'], ['nido', '👶'], ['scuola material', '🏫'],
  ['baby sitter', '👶'], ['tata', '👶'], ['centro estiv', '⛱'],
  ['campo estiv', '⛱'], ['vaccino bimb', '💉'], ['controlli pediat', '🩺'],
  ['fila scuol', '🚶'], ['recital scuol', '🎭'], ['rientro scuol', '🏫'],
  ['gita scolast', '🚌'], ['libri scuol', '📚'], ['zaino scolast', '🎒'],
  ['quadern scuol', '📓'], ['parlamentari scuol', '👨‍🏫'],

  // ── ESPANSIONE: cucina dettagliata ─────────────────────────
  ['ricetta', '📖'], ['menu', '📋'], ['lista spes', '🛒'], ['preparare pranzo', '🍽'],
  ['preparare cena', '🍽'], ['fare il pane', '🍞'], ['fare la pasta', '🍝'],
  ['fare la pizza', '🍕'], ['fare il sugo', '🥫'], ['fare la pasta frol', '🍪'],
  ['impastare', '🍞'], ['lievitar', '🍞'], ['cuocere', '🍳'], ['friggere', '🍳'],
  ['arrostire', '🍖'], ['bollire', '♨️'], ['vapore', '♨️'], ['marinatur', '🍖'],
  ['marinare', '🍖'], ['conserve', '🫙'], ['confettura', '🍯'], ['sottolio', '🫙'],
  ['sottacet', '🫙'], ['mettere in frigo', '🧊'], ['scongelar', '🧊'], ['lavar piatti', '🍽'],

  // ── ESPANSIONE: auto / mezzi / trasporti ───────────────────
  ['parcheggi', '🅿️'], ['multa parcheggi', '🚨'], ['ztl', '🚨'], ['autostrad', '🛣'],
  ['casello', '🛣'], ['telepass', '🛣'], ['viacard', '🛣'], ['benzinaio', '⛽'],
  ['distributor', '⛽'], ['concessionar', '🚗'], ['vendita auto', '🚗'],
  ['acquisto auto', '🚗'], ['noleggio auto', '🚗'], ['car sharing', '🚗'],
  ['blocco motore', '🔧'], ['gomma forat', '🛞'], ['gomme inverno', '🛞'],
  ['gomme estive', '🛞'], ['catene neve', '⛓'], ['portapacchi', '🚗'],
  ['portabici', '🚴'], ['cric', '🔧'], ['guida pratic', '🚗'], ['scuola guida', '🚗'],
  ['esame patente', '🪪'], ['foglio rosa', '🪪'], ['rinnovo bollo', '🚗'],
  ['rinnovo assicur', '🛡'], ['rinnovo revis', '🚗'], ['cambio gomme', '🛞'],

  // ── ESPANSIONE: viaggi / vacanze dettagliate ───────────────
  ['booking', '🏨'], ['prenotazione', '🏨'], ['check in', '🏨'], ['check out', '🏨'],
  ['carta imbarco', '🛂'], ['boarding pass', '🛂'], ['bagaglio', '🧳'],
  ['valigia', '🧳'], ['trolley', '🧳'], ['imbarco', '🛬'], ['aeroporto', '🛫'],
  ['stazione', '🚉'], ['treno alta vel', '🚄'], ['italo', '🚄'], ['frecciaross', '🚄'],
  ['frecciaarg', '🚄'], ['intercity', '🚂'], ['regionale', '🚂'], ['metro', '🚇'],
  ['tram', '🚊'], ['bus turis', '🚌'], ['transfer', '🚐'], ['volo low cost', '✈️'],
  ['ryanair', '✈️'], ['easyjet', '✈️'], ['alitalia', '✈️'], ['ita airways', '✈️'],
  ['turisti', '🗺'], ['tour', '🗺'], ['escursion', '🗺'], ['museo viagg', '🏛'],
  ['monumento', '🏛'], ['guida turistic', '🗺'], ['app mappe', '🧭'], ['gps viaggi', '🧭'],
  ['sci', '🎿'], ['snowboard', '🏂'], ['skipass', '🎿'], ['rifugio', '⛰'],
  ['ostello', '🏨'], ['agriturismo', '🏡'], ['casa vacanze', '🏡'], ['villaggio', '🏖'],

  // ── ESPANSIONE: shopping / acquisti ────────────────────────
  ['centro commerc', '🏬'], ['outlet', '🏬'], ['black friday', '🛍'],
  ['saldi', '🛍'], ['sconto', '🛍'], ['promozion', '🛍'], ['coupon', '🎫'],
  ['buono regalo', '🎁'], ['carta fedelt', '💳'], ['punti fedelt', '🎫'],
  ['negozio online', '💻'], ['amazon prime ord', '📦'], ['ebay', '💻'],
  ['subito.it', '💻'], ['vinted', '💻'], ['etsy', '💻'], ['shein', '💻'],
  ['zalando', '👟'], ['ikea', '🪑'], ['leroy merlin', '🛠'], ['brico', '🛠'],

  // ── ESPANSIONE: hobby / interessi ──────────────────────────
  ['ricamo', '🧵'], ['cucito', '🧵'], ['uncinetto', '🧶'], ['maglia', '🧶'],
  ['knit', '🧶'], ['bricolage hobby', '🛠'], ['modellismo', '🚂'], ['lego', '🧱'],
  ['puzzle', '🧩'], ['scacchi', '♟'], ['carte', '🃏'], ['burraco', '🃏'],
  ['briscola', '🃏'], ['poker', '🃏'], ['videogioc', '🎮'], ['ps5', '🎮'],
  ['xbox', '🎮'], ['nintendo', '🎮'], ['switch', '🎮'], ['streaming', '📺'],
  ['serie tv', '📺'], ['film', '🎬'], ['documentar', '🎬'], ['libro audio', '🎧'],
  ['podcast', '🎙'], ['radio', '📻'], ['vinile', '💿'],

  // ── ESPANSIONE: sport ──────────────────────────────────────
  ['allen', '🏋️'], ['allenamento', '🏋️'], ['cross', '🏋️'], ['crossfit', '🏋️'],
  ['running', '🏃'], ['corsa', '🏃'], ['mezza marat', '🏃'], ['maratona', '🏃'],
  ['triathlon', '🏊'], ['ciclismo', '🚴'], ['mtb', '🚵'], ['bici corsa', '🚴'],
  ['arrampi', '🧗'], ['boulder', '🧗'], ['trekking', '🥾'], ['escursionismo', '🥾'],
  ['rugby', '🏉'], ['pallavolo', '🏐'], ['basket', '🏀'], ['hockey', '🏒'],
  ['baseball', '⚾'], ['surf', '🏄'], ['windsurf', '🏄'], ['kitesurf', '🪁'],
  ['vela', '⛵'], ['canoa', '🛶'], ['kayak', '🛶'], ['rafting', '🛶'],
  ['equitazione', '🐴'], ['cavallo', '🐴'], ['scherma', '🤺'], ['arti marz', '🥋'],
  ['karate', '🥋'], ['judo', '🥋'], ['kung fu', '🥋'], ['boxe', '🥊'],
  ['mma', '🥋'], ['kickboxing', '🥋'],

  // ── ESPANSIONE: animali domestici dettagliato ──────────────
  ['veterinari', '🩺'], ['microchip', '🐾'], ['sverm', '💊'], ['antiparassit', '💊'],
  ['pulci', '🐾'], ['zecche', '🐾'], ['leishman', '🐾'], ['leishmaniosi', '🐾'],
  ['filaria', '🐾'], ['toelettatura', '✂️'], ['educatore cinof', '🐕'], ['addestrator', '🐕'],
  ['parco cani', '🌳'], ['dog sitter', '🐶'], ['acquario', '🐠'],
  ['terrario', '🦎'], ['gabbia', '🐦'], ['voliera', '🐦'], ['mangim', '🐾'],
  ['ciotole', '🍽'], ['cucce', '🐾'], ['cuccia', '🐾'], ['tiragraffi', '🐱'],
  ['trasportin', '🧳'],

  // ── ESPANSIONE: giardino / esterno ────────────────────────
  ['giardino', '🪴'], ['orto', '🌱'], ['piant', '🪴'], ['fiori giard', '🌷'],
  ['potatur', '✂️'], ['potare', '✂️'], ['concime', '🌾'], ['concimar', '🌾'],
  ['innaff', '💧'], ['annaffi', '💧'], ['irrigaz', '💧'], ['terriccio', '🌱'],
  ['vaso piant', '🪴'], ['piant fiori', '🌷'], ['piant aromat', '🌿'], ['siepe', '🌳'],
  ['prato', '🌱'], ['tagliaerba', '🌱'], ['decespugliat', '🌳'], ['motosega', '🪚'],
  ['legna', '🪵'], ['stufa', '🔥'], ['caminetto', '🔥'], ['barbecu', '🍖'],
  ['bbq', '🍖'], ['grigliata', '🍖'],

  // ── ESPANSIONE: condom / casa / amm. ──────────────────────
  ['quota condom', '🧾'], ['fondo condom', '🧾'], ['spese condom', '🧾'],
  ['preventivo condom', '📑'], ['verbale assemb', '📑'], ['regolam condom', '📑'],
  ['tabelle millesim', '📑'], ['lavori condom', '🛠'], ['portone condom', '🚪'],
  ['ascensore', '🛗'], ['scala', '🪜'], ['cantina', '📦'], ['box auto', '🅿️'],
  ['garage', '🅿️'], ['posto auto', '🅿️'],

  // ── ESPANSIONE: tecnologia / digital ───────────────────────
  ['password', '🔑'], ['cambiare password', '🔑'], ['otp', '🔐'], ['2fa', '🔐'],
  ['spid', '🪪'], ['cie', '🪪'], ['identit digit', '🪪'], ['cns', '🪪'],
  ['firma digit', '✒️'], ['backup', '💾'], ['cloud', '☁️'], ['google drive', '☁️'],
  ['dropbox', '☁️'], ['icloud', '☁️'], ['onedrive', '☁️'], ['hard disk', '💾'],
  ['ssd', '💾'], ['memoria', '💾'], ['aggiornare app', '📱'], ['aggiornare softw', '💻'],
  ['installare app', '📱'], ['disinstallar', '📱'], ['cancellare account', '🗑'],
  ['recuperare password', '🔑'], ['email recup', '📧'], ['sim', '📱'],
  ['cambiare sim', '📱'], ['portabilit', '📱'],

  // ── ESPANSIONE: lavoro extra ───────────────────────────────
  ['busta pag', '💰'], ['cedolin', '💰'], ['ferie lav', '🏖'], ['permess lav', '📑'],
  ['malattia lav', '🤒'], ['certificato malatt', '📑'], ['visita fiscale', '🩺'],
  ['mobilità', '📑'], ['naspi', '📑'], ['cassa integraz', '📑'], ['tfr', '💰'],
  ['contributi inps', '🏛'], ['regime forfett', '🧾'], ['partita iva', '🧾'],
  ['fattura elettr', '🧾'], ['sdi', '🧾'], ['enpam', '🏛'], ['cassa professio', '🏛'],
  ['ordine professio', '⚖️'], ['onorari', '💰'],

  // ── ESPANSIONE: relazioni / amici ─────────────────────────
  ['invito', '💌'], ['rsvp', '💌'], ['augurar', '💌'], ['chiamare zia', '📞'],
  ['chiamare zio', '📞'], ['nipote', '👶'], ['nipoti', '👶'], ['cognato', '👫'],
  ['cognata', '👫'], ['suocera', '👵'], ['suocero', '👴'], ['nonna', '👵'],
  ['nonno', '👴'], ['amica', '🤝'], ['amico', '🤝'], ['collega', '🤝'],
  ['vicin di casa', '🏡'],

  // ── ESPANSIONE: religione / culto ──────────────────────────
  ['chiesa', '⛪'], ['parrocch', '⛪'], ['don ', '⛪'], ['parroco', '⛪'],
  ['messa', '⛪'], ['confess', '⛪'], ['battesimo bimb', '👼'], ['matrim rel', '💒'],
  ['funerale', '⚱'], ['cimitero', '🪦'], ['fiori tomba', '💐'], ['rosario', '📿'],
  ['preghiera', '🙏'], ['catechismo', '⛪'],

  // ── ESPANSIONE: emergenza / sicurezza ──────────────────────
  ['115', '🚒'], ['vigili fuoco', '🚒'], ['vigili urbani', '🚓'], ['112', '🚨'],
  ['emergenza', '🚨'], ['allarme', '🚨'], ['antifurto', '🚨'], ['cancello', '🚪'],
  ['videocamere', '📹'], ['videosorvegl', '📹'], ['blindata', '🚪'], ['cassaforte', '🔒'],

  // ── ESPANSIONE: smartphone / cellulare ─────────────────────
  ['contratto telefon', '📑'], ['ricarica telefon', '📱'], ['cambio gestore', '📱'],
  ['portabilità', '📱'], ['credito residuo', '📱'], ['offerta cellul', '📱'],
  ['rinnovo contratto', '📑'], ['custodia', '📱'], ['vetro temp', '📱'],
  ['caricabatt', '🔌'], ['power bank', '🔋'],

  // ── ESPANSIONE: posta / spedizioni ─────────────────────────
  ['raccomand', '📨'], ['raccomandata', '📨'], ['posta racco', '📨'], ['atto giud', '⚖️'],
  ['ar ', '📨'], ['ritirare raccoman', '📨'], ['avviso giac', '📨'], ['giacenza post', '📦'],
  ['spedire pacc', '📦'], ['poste ricevute', '🧾'], ['posta privata', '📨'],
  ['gls', '🚚'], ['brt', '🚚'], ['sda', '🚚'], ['dhl', '🚚'], ['ups', '🚚'],
  ['fedex', '🚚'],

  // ── ESPANSIONE: extra utili / generici ────────────────────
  ['comprare regalo', '🎁'], ['inviare cartolin', '💌'], ['preparare valig', '🧳'],
  ['fare benzin', '⛽'], ['fare la spesa', '🛒'], ['ritirare ricetta', '📑'],
  ['prenotare visita', '🩺'], ['fissare appunt', '📅'], ['portare auto', '🚗'],
  ['portare cane', '🐶'], ['organizzare evento', '🎉'], ['invitare amic', '🤝'],
  ['rispondere mail', '📧'], ['richiamare', '📞'], ['ricontattare', '📞'],
  ['mandare auguri', '💌'], ['scrivere email', '📧'], ['stampare', '🖨'],
  ['scannerizzare', '📷'], ['firmare', '✒️'], ['consegnare', '📦'],
  ['ritirare', '📦'], ['restituire', '📦'], ['scambio', '🔄'], ['cambiare', '🔄'],
  ['rispondere', '💬'], ['confermare', '✔️'], ['cancellare', '🗑'], ['rinviare', '⏰']
];

function todoIconSuggestions(name, max) {
  if (max == null) max = 5;
  if (!name) return ['📝'];
  const n = String(name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  if (!n || n.length < SPESA_MIN_QUERY_LEN) return ['📝'];
  const matches = [];
  const seen = new Set();
  // Attinge dal pool UNIFICATO ALL_KEYWORD_ICONS: spesa+todo+scadenze.
  for (const [kw, ic] of ALL_KEYWORD_ICONS) {
    const nameContainsKw = n.indexOf(kw) !== -1;
    const kwContainsName = kw.indexOf(n) !== -1;
    if ((nameContainsKw || kwContainsName) && !seen.has(ic)) {
      const isPrefix = kw.indexOf(n) === 0;
      const score = (nameContainsKw ? 100 : 0) + (isPrefix ? 20 : 0) + kw.length;
      matches.push({ kw, ic, score });
      seen.add(ic);
    }
  }
  matches.sort((a, b) => b.score - a.score);
  const out = matches.slice(0, max).map(m => m.ic);
  if (!out.length) out.push('📝');
  return out;
}
function todoIconForName(name) {
  const s = todoIconSuggestions(name, 1);
  return s[0] || '📝';
}

// Alias retro-compat: tutti i moduli usano lo stesso pool gigantesco ALL_ICON_CATS.
const SPESA_ICON_CATS = ALL_ICON_CATS;

// Mappa keyword → emoji per suggerimento automatico icona dal nome elemento.
// Match smart: split in parole, prefisso 4+ char, la più specifica vince.
// Includere radici/lemmi (senza desinenza) per matchare plurali/femminili/diminutivi
// es: "natalin" matcha "natalino, natalini, natalina, natale" e "natalini pacchetti"
const SPESA_KEYWORD_ICONS = [
  // Frutta
  ['mel', '🍎'], ['pera', '🍐'], ['pere', '🍐'], ['perin', '🍐'],
  ['banan', '🍌'], ['aranc', '🍊'], ['limon', '🍋'], ['fragol', '🍓'],
  ['cilieg', '🍒'], ['uva', '🍇'], ['anguri', '🍉'], ['cocomer', '🍉'],
  ['melon', '🍈'], ['pesc', '🍑'], ['pesch', '🍑'], ['ananas', '🍍'],
  ['mango', '🥭'], ['cocco', '🥥'], ['kiwi', '🥝'], ['mirtill', '🫐'],
  ['lampon', '🫐'], ['fico', '🍈'], ['fichi', '🍈'], ['cachi', '🍑'],
  ['albicocc', '🍑'], ['susin', '🍑'], ['castagn', '🌰'], ['noc', '🌰'],
  // Verdura
  ['pomodor', '🍅'], ['pomidor', '🍅'], ['pomidoro', '🍅'],
  ['carot', '🥕'], ['cetriol', '🥒'], ['peperon', '🫑'], ['peperoni', '🫑'],
  ['mais', '🌽'], ['granoturco', '🌽'], ['patat', '🥔'], ['cipoll', '🧅'],
  ['aglio', '🧄'], ['broccol', '🥦'], ['cavolfior', '🥦'], ['cavol', '🥬'],
  ['lattug', '🥬'], ['insalat', '🥬'], ['rucol', '🥬'], ['spinac', '🥬'],
  ['melanzan', '🍆'], ['zucchin', '🥒'], ['zucca', '🎃'], ['fungh', '🍄'],
  ['fagiol', '🫘'], ['fagiolin', '🥦'], ['pisell', '🫛'], ['cec', '🫘'],
  ['lentic', '🫘'], ['asparag', '🌱'], ['finocch', '🥬'], ['sedan', '🥬'],
  // Pane / cereali / pasta
  ['pane', '🍞'], ['panin', '🥖'], ['baguett', '🥖'], ['ciabatt', '🥖'],
  ['cracker', '🍘'], ['grissin', '🥖'], ['biscott', '🍪'], ['frollin', '🍪'],
  ['cereal', '🥣'], ['ris', '🍚'], ['pasta', '🍝'], ['spaghett', '🍝'],
  ['pen', '🍝'], ['fusill', '🍝'], ['rigaton', '🍝'], ['gnocch', '🥟'],
  ['lasagn', '🍝'], ['toast', '🍞'], ['cornett', '🥐'], ['brioche', '🥐'],
  ['focacc', '🥖'], ['pizza', '🍕'], ['piad', '🌮'], ['fett', '🍞'],
  // Carne / pesce
  ['carne', '🥩'], ['bistec', '🥩'], ['poll', '🍗'], ['tacchin', '🍗'],
  ['salsicc', '🌭'], ['wurstel', '🌭'], ['hamburger', '🍔'], ['polpett', '🍖'],
  ['prosciutt', '🥓'], ['bacon', '🥓'], ['speck', '🥓'], ['salam', '🥓'],
  ['mortadell', '🥓'], ['braciol', '🥩'], ['arrost', '🍖'], ['stinco', '🍖'],
  ['pesce', '🐟'], ['pesci', '🐟'], ['tonno', '🐟'], ['salmon', '🐟'],
  ['sgombr', '🐟'], ['merlu', '🐟'], ['gamber', '🦐'], ['cozz', '🦪'],
  ['vongol', '🦪'], ['calam', '🦑'], ['polp', '🐙'],
  // Latticini / uova
  ['latte', '🥛'], ['lactos', '🥛'], ['lattin', '🥛'], ['form', '🧀'],
  ['parmigian', '🧀'], ['grana', '🧀'], ['mozzarell', '🧀'], ['stracchin', '🧀'],
  ['ricott', '🧀'], ['robiol', '🧀'], ['pecorin', '🧀'], ['provolon', '🧀'],
  ['burro', '🧈'], ['yogurt', '🥛'], ['panna', '🥛'], ['uova', '🥚'], ['uovo', '🥚'],
  ['frittat', '🍳'],
  // Dolci / snack / dessert
  ['ciocc', '🍫'], ['kinder', '🍫'], ['nutella', '🍫'], ['nutell', '🍫'],
  ['caramell', '🍬'], ['gelat', '🍦'], ['ghiacciol', '🍧'], ['sorbett', '🍧'],
  ['torta', '🍰'], ['dolce', '🍰'], ['dolci', '🍰'], ['miele', '🍯'],
  ['marmellat', '🍯'], ['confettur', '🍯'], ['ciambell', '🍩'],
  ['popcorn', '🍿'], ['nutella', '🍫'], ['merendin', '🧁'], ['merendine', '🧁'],
  ['snack', '🍫'], ['patatin', '🍟'], ['krek', '🍘'], ['waffle', '🧇'],
  ['frutta sec', '🌰'], ['mandorl', '🌰'], ['noccio', '🌰'], ['pistacch', '🌰'],
  // Bevande
  ['acqua', '💧'], ['frizzant', '💧'], ['minerale', '💧'], ['naturale', '💧'],
  ['vino', '🍷'], ['rosso', '🍷'], ['bianco', '🍷'], ['rosé', '🍷'],
  ['birra', '🍺'], ['birrett', '🍺'], ['prosecc', '🍾'], ['lambrusc', '🍾'],
  ['champag', '🍾'], ['spumant', '🍾'], ['caffe', '☕'], ['cappuc', '☕'],
  ['the ', '🍵'], ['tè', '🍵'], ['tisane', '🍵'], ['camomill', '🍵'],
  ['succ', '🧃'], ['cocacol', '🥤'], ['coca', '🥤'], ['fanta', '🥤'],
  ['sprite', '🥤'], ['bibit', '🥤'], ['energy', '🥤'], ['rum', '🥃'],
  ['whisky', '🥃'], ['vodka', '🥃'], ['gin', '🥃'], ['amaro', '🥃'],
  ['liquor', '🥃'], ['grappa', '🥃'], ['aperitiv', '🥂'], ['spritz', '🥂'],
  // Condimenti
  ['sale', '🧂'], ['zucchero', '🍬'], ['olio', '🫒'], ['oliv', '🫒'],
  ['pepe', '🌶'], ['peperoncin', '🌶'], ['salsa', '🥫'], ['ketchup', '🥫'],
  ['maionese', '🥫'], ['senape', '🌭'], ['aceto', '🫙'], ['vaniglia', '🍦'],
  // Pulizia casa
  ['detersiv', '🧴'], ['detergent', '🧴'], ['saponett', '🧼'], ['sapon', '🧼'],
  ['shampoo', '🧴'], ['balsamo', '🧴'], ['ammorbidente', '🧴'],
  ['carta igien', '🧻'], ['scottex', '🧻'], ['rotolo', '🧻'], ['rotoli', '🧻'],
  ['tovaglio', '🧻'], ['scope', '🧹'], ['scopa', '🧹'], ['spazzolon', '🧹'],
  ['paletta', '🧹'], ['straccio', '🧹'], ['stracci', '🧹'], ['secchi', '🪣'],
  ['guanti', '🧤'], ['mocio', '🧹'], ['candegg', '🧴'], ['amuchi', '🧴'],
  // Igiene personale
  ['dentifric', '🪥'], ['spazzolin', '🪥'], ['profum', '🧴'], ['deodorant', '🧴'],
  ['rasoi', '🪒'], ['lametta', '🪒'], ['filo interden', '🪥'], ['collutorio', '🪥'],
  ['salviett', '🧻'], ['fazzolett', '🧻'], ['cotone', '🧻'],
  // Bimbi
  ['pannolin', '👶'], ['biberon', '🍼'], ['salviette', '🧻'], ['ciuccio', '👶'],
  ['gioco', '🧸'], ['giochi', '🧸'], ['peluche', '🧸'],
  // Animali
  ['cibo gatto', '🐱'], ['cibo cane', '🐶'], ['croccantin', '🐾'],
  ['lettiera', '🐾'], ['gatto', '🐱'], ['cane', '🐶'],
  // Feste / regali / espressioni colloquiali
  ['natal', '🎄'], ['natalin', '🎄'], ['pandor', '🎄'], ['panetton', '🎄'],
  ['albero', '🎄'], ['regal', '🎁'], ['pacc', '📦'], ['pacchett', '🎁'],
  ['compleann', '🎂'], ['festa', '🎉'], ['party', '🥳'], ['fest', '🎊'],
  ['pasqu', '🐰'], ['coloma', '🎂'], ['colomba', '🐰'], ['uovo di pasq', '🥚'],
  ['valent', '💝'], ['cuore', '❤️'], ['cuori', '❤️'], ['rose', '🌹'],
  ['halloween', '🎃'], ['zucca', '🎃'], ['carnev', '🎭'], ['masc', '🎭'],
  ['battesimo', '🎉'], ['matrimon', '💐'], ['anniversar', '💐'],
  // Altro / casa
  ['fiori', '💐'], ['fior', '💐'], ['piant', '🪴'], ['vaso', '🪴'],
  ['candele', '🕯'], ['candela', '🕯'], ['libro', '📖'], ['libri', '📖'],
  ['quaderno', '📓'], ['penne', '🖊'], ['penna', '🖊'], ['matit', '✏️'],
  ['batter', '🔋'], ['lampadin', '💡'], ['pile', '🔋'],
  ['busta', '📨'], ['buste', '📨'], ['sacchett', '🛍'], ['borse', '👜'],
  ['ombrell', '☂️'], ['scarp', '👟'], ['calz', '🧦'], ['vestit', '👔'],
  // Tecnologia
  ['carica', '🔌'], ['cavo', '🔌'], ['cavi', '🔌'], ['cuffi', '🎧'],
  ['auricola', '🎧'], ['cellular', '📱'], ['telefono', '📱'], ['computer', '💻'],
  // Sport / hobby
  ['palla', '⚽'], ['pallone', '⚽'], ['scarpe sport', '👟'], ['tute', '🦺'],

  // ── ESPANSIONI ──────────────────────────────────────────────
  // Frutta secca / snack salati
  ['arachid', '🥜'], ['arachide', '🥜'], ['noccioline', '🥜'], ['noccioli', '🥜'],
  ['frutta sec', '🌰'], ['frutta secca', '🌰'], ['mandorl', '🌰'], ['nocciol', '🌰'],
  ['pistacch', '🌰'], ['anacardi', '🌰'], ['pinoli', '🌰'], ['semi di gira', '🌻'],
  ['semi zucca', '🎃'], ['noce di cocco', '🥥'],

  // Cibo italiano comune
  ['pizza', '🍕'], ['margherita', '🍕'], ['focacc', '🥖'], ['focaccia', '🥖'],
  ['bruschett', '🥖'], ['crostin', '🥖'], ['piad', '🌮'], ['arancin', '🍙'],
  ['suppli', '🍙'], ['raviol', '🥟'], ['tortellin', '🥟'], ['agnolott', '🥟'],
  ['cannellon', '🍝'], ['lasagn', '🍝'], ['crepes', '🥞'], ['pancake', '🥞'],
  ['pretzel', '🥨'], ['bagel', '🥯'], ['orecchiett', '🍝'], ['farfall', '🍝'],

  // Pesce specifico
  ['branzin', '🐟'], ['spigol', '🐟'], ['orat', '🐟'], ['trot', '🐟'],
  ['sardin', '🐟'], ['acciugh', '🐟'], ['alic', '🐟'], ['baccala', '🐟'],
  ['stoccafisso', '🐟'], ['platess', '🐟'], ['ostrich', '🦪'],
  ['ricci di mare', '🦪'], ['cernia', '🐟'], ['nasell', '🐟'],

  // Carne specifica
  ['macinat', '🥩'], ['ossobuc', '🍖'], ['spezzatin', '🍖'], ['filetto', '🥩'],
  ['costat', '🥩'], ['vitello', '🥩'], ['agnello', '🍖'], ['coniglio', '🥩'],
  ['anatra', '🍗'], ['oca', '🍗'], ['quaglia', '🍗'], ['petto di pollo', '🍗'],
  ['cotechino', '🌭'], ['zampone', '🌭'], ['guancial', '🥓'], ['pancetta', '🥓'],
  ['lardo', '🥓'], ['bresaola', '🥓'], ['coppa', '🥓'],

  // Frutta extra
  ['prugn', '🍑'], ['susina', '🍑'], ['bergamott', '🍋'], ['pompelm', '🍊'],
  ['mandarin', '🍊'], ['clementin', '🍊'], ['kumquat', '🍊'], ['cedri', '🍋'],
  ['frutti di bosc', '🫐'], ['ribes', '🫐'], ['more', '🫐'], ['avocado', '🥑'],
  ['datter', '🌴'], ['feijoa', '🥝'], ['fragoline', '🍓'],

  // Verdura extra
  ['pomodorin', '🍅'], ['ciliegin', '🍅'], ['pachin', '🍅'], ['datterin', '🍅'],
  ['friggitell', '🫑'], ['jalapeno', '🌶'], ['chili', '🌶'], ['curcum', '🌶'],
  ['carciof', '🥬'], ['bietola', '🥬'], ['bietole', '🥬'], ['catalogn', '🥬'],
  ['cima di rapa', '🥬'], ['rape', '🥕'], ['ravanell', '🥕'], ['topinambur', '🥔'],
  ['radicchio', '🥬'], ['scarol', '🥬'], ['valeriana', '🥬'], ['indivia', '🥬'],
  ['barbabietol', '🥕'], ['cetriolin', '🥒'],

  // Erbe aromatiche
  ['basilico', '🌿'], ['prezzemol', '🌿'], ['origano', '🌿'], ['timo', '🌿'],
  ['rosmarin', '🌿'], ['salvia', '🌿'], ['erbe', '🌿'], ['erbett', '🌿'],
  ['alloro', '🌿'], ['menta', '🌿'], ['santoreggi', '🌿'], ['maggioran', '🌿'],
  ['edera', '🌿'], ['borragine', '🌿'], ['dragoncello', '🌿'],

  // Spezie
  ['cannella', '🧂'], ['noce moscat', '🌰'], ['chiodi di garof', '🌰'],
  ['zafferano', '🌾'], ['paprika', '🌶'], ['cumino', '🌶'], ['anice', '🌾'],
  ['vaniglia', '🍦'],

  // Dolci/desserts italiani
  ['crostat', '🥧'], ['bigne', '🍰'], ['profiterol', '🍰'], ['tiramisu', '🍰'],
  ['panna cott', '🍮'], ['crema', '🍮'], ['mascarpon', '🧀'], ['savoiard', '🍪'],
  ['pavesin', '🍪'], ['amarett', '🍪'], ['baci', '🍫'], ['gianduiott', '🍫'],
  ['pralin', '🍫'], ['liquirizia', '🍬'], ['gomma', '🍬'], ['nutella', '🍫'],
  ['kinder', '🍫'], ['marshmallow', '🍬'], ['confett', '🍬'],

  // Bevande extra
  ['aranciat', '🥤'], ['chinott', '🥤'], ['gazzos', '🥤'], ['frappe', '🥤'],
  ['frullat', '🥤'], ['centrifug', '🥤'], ['estratto', '🥤'], ['smoothie', '🥤'],
  ['orzo', '☕'], ['ginseng', '☕'], ['camomilla', '🍵'], ['decaffeinato', '☕'],
  ['the verde', '🍵'], ['mojito', '🍹'], ['negroni', '🥃'], ['aperol', '🥂'],
  ['campari', '🍷'],

  // Pulizia / casa
  ['spugna', '🧽'], ['spugne', '🧽'], ['ammoniaca', '🧴'], ['bicarbonato', '🥣'],
  ['alcool', '🧴'], ['anticalcar', '🧴'], ['lavavetri', '🧴'], ['lavapiatt', '🧴'],
  ['sgrassator', '🧴'], ['profuma', '🧴'], ['ammorbidente', '🧴'],
  ['pattumiera', '🗑'], ['sacchi della spazz', '🗑'], ['sacchetti', '🛍'],
  ['pellicola', '🧻'], ['carta forno', '🧻'], ['stagnola', '🧻'], ['alluminio', '🧻'],
  ['stuzzicadent', '🪥'], ['stoviglie', '🍽'], ['piatti', '🍽'],

  // Igiene / bagno
  ['bagnoschiuma', '🧴'], ['crema corpo', '🧴'], ['crema viso', '🧴'],
  ['burro cacao', '🧴'], ['assorbent', '🧻'], ['tampon', '🧻'], ['carta velina', '🧻'],
  ['filo interden', '🪥'], ['collutori', '🪥'], ['cotone idro', '🧻'],
  ['cerott', '🩹'], ['amuchin', '🧴'], ['disinfettant', '🧴'],

  // Salute
  ['medicin', '💊'], ['farmac', '💊'], ['tachipirin', '💊'], ['nurofen', '💊'],
  ['vitamin', '💊'], ['integratori', '💊'], ['probiotic', '💊'], ['sciroppo', '💊'],
  ['aerosol', '🩺'], ['termomet', '🌡'], ['cerotti', '🩹'],

  // Casa / cancelleria
  ['penne biro', '🖊'], ['evidenziator', '🖍'], ['matita', '✏️'], ['gomma cancell', '✏️'],
  ['righello', '📏'], ['nastro adesivo', '🪛'], ['post-it', '📒'], ['post it', '📒'],
  ['quaderno', '📓'], ['agenda', '📒'], ['calendar', '📅'],

  // Animali specifico
  ['crocchett', '🐾'], ['lettier', '🐾'], ['guinzagli', '🐕'], ['ciotol', '🍽'],

  // Bimbi specifici
  ['pannolin', '👶'], ['salviettin', '🧻'], ['biberon', '🍼'], ['ciuccio', '👶'],
  ['omogeneizz', '🍼'], ['latte in polver', '🍼'], ['pappa', '🍼'],

  // Auto / esterno
  ['benzin', '⛽'], ['gasoli', '⛽'], ['carburant', '⛽'], ['auto', '🚗'],
  ['biciclett', '🚴'], ['bici', '🚴'], ['moto', '🏍'],

  // Bricolage extra
  ['viti', '🔩'], ['chiod', '🔨'], ['avvitator', '🪛'], ['trapan', '🔧'],
  ['silicone', '🧴'], ['colla', '🧴'], ['nastro', '📏'], ['vernice', '🎨'],

  // Stagione / vario
  ['vacanze', '🏖'], ['mare', '🏖'], ['piscina', '🏊'], ['montagna', '⛰'],
  ['ombrellone', '⛱'], ['sdraio', '🏖'], ['creme solar', '🧴'], ['solar', '☀'],
  ['costume', '👙'], ['abbronzante', '🧴'], ['dopo sole', '🧴']
];

// ─── KEYWORD UNIFICATE per SCADENZE (extra rispetto a spesa+todo) ──
// Ricorrenze tipiche, eventi, rinnovi documenti, festività.
const SCADENZA_KEYWORD_ICONS_EXTRA = [
  // Festività italiane
  ['epifania', '✨'], ['befana', '🧹'], ['carnevale', '🎭'],
  ['pasqua', '🐰'], ['pasquetta', '🐰'], ['25 aprile', '🇮🇹'],
  ['liberazione', '🇮🇹'], ['lavoratori', '⚒'], ['festa repubblic', '🇮🇹'],
  ['ferragosto', '🏖'], ['ognissanti', '⚱'], ['immacolata', '⛪'],
  ['natale', '🎄'], ['santo stefano', '🎄'], ['capodanno', '🥂'],
  ['san valentin', '💝'], ['festa donna', '💐'], ['festa pap', '👨'],
  ['festa mamm', '👩'], ['halloween scaden', '🎃'],

  // Ricorrenze ricorrenti
  ['scadenza patente', '🪪'], ['scadenza carta', '🪪'], ['scadenza passap', '🛂'],
  ['scadenza assicur', '🛡'], ['scadenza bollo', '🚗'], ['scadenza revis', '🚗'],
  ['scadenza contratt', '📑'], ['rinnovo contratto', '📑'], ['scaden affitto', '🏠'],
  ['scadenza certific', '📑'], ['rinnovo certific', '📑'],
  ['scadenza farmaco', '💊'], ['scadenza ricetta', '📑'], ['scaden visita', '🩺'],

  // Eventi personali
  ['compleanno', '🎂'], ['compleanno mio', '🎂'], ['anniversari', '💐'],
  ['nozze', '💍'], ['matrimon', '💍'], ['onomastico', '🎉'],
  ['battesim', '👼'], ['comunione', '👼'], ['cresima', '👼'],
  ['laurea', '🎓'], ['diploma', '🎓'], ['maturit', '🎓'],
  ['funerale', '⚱'], ['cimitero', '🪦'], ['ricorrenza famiglia', '💐'],

  // Banche / pagamenti scaduti
  ['scadenza rata', '💸'], ['scadenza mutuo', '🏦'], ['scadenza prestit', '🏦'],
  ['scadenza f24', '🧾'], ['scadenza tasse', '💰'], ['scadenza iva', '🧾'],
  ['scadenza imu', '🏠'], ['scadenza tari', '🗑'], ['scadenza bollett', '🧾'],

  // Lavoro / progetti
  ['consegna progetto', '📑'], ['consegna lavoro', '💼'], ['deadline', '⏰'],
  ['data limite', '⏰'], ['entro il', '⏰'], ['promemoria', '🔔'],
  ['evento', '🎉'], ['scadenza fattur', '🧾'], ['scadenza ordine', '📦'],

  // Salute
  ['controllo medico', '🩺'], ['visita controllo', '🩺'], ['richiamo vaccin', '💉'],
  ['scadenza farmaco', '💊'], ['scadenza prescriz', '📑'],

  // Auto
  ['cambio gomme', '🛞'], ['cambio olio', '🛢'], ['scadenza tagliando', '🔧'],

  // Casa
  ['scadenza affitto', '🏠'], ['rinnovo contratto luce', '⚡'],
  ['rinnovo contratto gas', '🔥'], ['scadenza condominio', '🏢']
];

// Tutte le keyword unite: Spesa + ToDo + Scadenze.
// Usata da TUTTI i moduli per suggerimenti e ricerca nel picker.
const ALL_KEYWORD_ICONS = SPESA_KEYWORD_ICONS
  .concat(TODO_KEYWORD_ICONS)
  .concat(SCADENZA_KEYWORD_ICONS_EXTRA);

// Smart match: priorità per token più lungo o keyword più specifica.
function spesaIconForName(name) {
  const s = spesaIconSuggestions(name, 1);
  return s[0] || '🛒';
}

// Restituisce fino a `max` emoji suggerite per il nome, ordinate per
// specificità. Match PROMISCUO (stessa logica del modal selettore):
// - nome contiene keyword OVUNQUE (es. "pane integrale" matcha 'pane' → 🍞)
// - keyword contiene nome OVUNQUE (es. "mel" matcha 'mel','melon',
//   'melanzan','caramell','marmellat' → 🍎 🍈 🍆 🍬 🍯)
// Priorità (score): match diretto (nome ⊇ kw) > kw più lunga > prefix.
const SPESA_MIN_QUERY_LEN = 3;
function spesaIconSuggestions(name, max) {
  if (max == null) max = 5;
  if (!name) return ['🛒'];
  const n = String(name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  if (!n || n.length < SPESA_MIN_QUERY_LEN) return ['🛒'];
  const matches = [];
  const seen = new Set();
  // Attinge dal pool UNIFICATO ALL_KEYWORD_ICONS: spesa+todo+scadenze.
  for (const [kw, ic] of ALL_KEYWORD_ICONS) {
    const nameContainsKw = n.indexOf(kw) !== -1;    // nome contiene kw
    const kwContainsName = kw.indexOf(n) !== -1;    // kw contiene nome (anywhere)
    if ((nameContainsKw || kwContainsName) && !seen.has(ic)) {
      // Score: nome⊇kw +100, prefix-match +20 (kw inizia con nome), poi kw.length
      const isPrefix = kw.indexOf(n) === 0;
      const score = (nameContainsKw ? 100 : 0) + (isPrefix ? 20 : 0) + kw.length;
      matches.push({ kw, ic, score });
      seen.add(ic);
    }
  }
  matches.sort((a, b) => b.score - a.score);
  const out = matches.slice(0, max).map(m => m.ic);
  if (!out.length) out.push('🛒');
  return out;
}

// Helper unificati per scadenze (alias delle versioni spesa con default emoji diversa)
function scadenzaIconForName(name) {
  const s = spesaIconSuggestions(name, 1);
  return (s && s[0] && s[0] !== '🛒') ? s[0] : '📅';
}
function scadenzaIconSuggestions(name, max) {
  const s = spesaIconSuggestions(name, max);
  // Sostituisce il default '🛒' con '📅' più appropriato per scadenze
  if (s.length === 1 && s[0] === '🛒') return ['📅'];
  return s;
}

// ─── MODAL SELETTORE ICONE (condiviso Spesa/Todo/Scadenze) ──
// Tutti i moduli pescano dallo stesso pool ALL_ICON_CATS / ALL_KEYWORD_ICONS.
// `_iconPickerCtx` serve solo a sapere quale state (spesa/todo/scadenza)
// aggiornare quando l'utente sceglie un'emoji.
let _iconPickerCat = 'all'; // 'all' o id di categoria attiva
let _iconPickerSearch = '';
let _iconPickerCtx = 'spesa'; // 'spesa' | 'todo' | 'scadenza'

function openIconPicker(ctx) {
  _iconPickerCtx = (ctx === 'todo' || ctx === 'scadenza') ? ctx : 'spesa';
  _iconPickerCat = 'all';
  _iconPickerSearch = '';
  if (D.iconPickerSearch) D.iconPickerSearch.value = '';
  renderIconPickerCats();
  renderIconPickerGrid();
  openModal('modalIconPicker');
  setTimeout(() => { if (D.iconPickerSearch) D.iconPickerSearch.focus(); }, 60);
}

function _iconPickerCatsArr() { return ALL_ICON_CATS; }
function _iconPickerKwArr()   { return ALL_KEYWORD_ICONS; }

function renderIconPickerCats() {
  if (!D.iconPickerCategories) return;
  const cats = _iconPickerCatsArr();
  const html = '<button class="icon-picker-cat' + (_iconPickerCat === 'all' ? ' active' : '') + '" data-cat="all">Tutte</button>' +
    cats.map(c =>
      '<button class="icon-picker-cat' + (_iconPickerCat === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' +
        c.icon + ' ' + esc(c.label) +
      '</button>'
    ).join('');
  D.iconPickerCategories.innerHTML = html;
  twemojify(D.iconPickerCategories);
  $$('.icon-picker-cat', D.iconPickerCategories).forEach(b => {
    b.addEventListener('click', () => {
      _iconPickerCat = b.getAttribute('data-cat');
      renderIconPickerCats();
      renderIconPickerGrid();
    });
  });
}

function renderIconPickerGrid() {
  if (!D.iconPickerGrid) return;
  let emojis;
  const cats = _iconPickerCatsArr();
  const kwArr = _iconPickerKwArr();
  const q = (_iconPickerSearch || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  if (q) {
    if (q.length < SPESA_MIN_QUERY_LEN) {
      if (_iconPickerCat === 'all') emojis = cats.flatMap(c => c.emojis);
      else {
        const cat = cats.find(c => c.id === _iconPickerCat);
        emojis = cat ? cat.emojis : [];
      }
    } else {
      const found = new Set();
      kwArr.forEach(([kw, ic]) => {
        if (kw.indexOf(q) !== -1 || q.indexOf(kw) !== -1) found.add(ic);
      });
      cats.forEach(c => {
        const labLower = c.label.toLowerCase();
        if (labLower.indexOf(q) !== -1) c.emojis.forEach(e => found.add(e));
      });
      emojis = Array.from(found);
    }
  } else if (_iconPickerCat === 'all') {
    emojis = cats.flatMap(c => c.emojis);
  } else {
    const cat = cats.find(c => c.id === _iconPickerCat);
    emojis = cat ? cat.emojis : [];
  }
  // dedup
  emojis = Array.from(new Set(emojis));
  if (!emojis.length) {
    D.iconPickerGrid.innerHTML = '<div class="icon-picker-empty">Nessuna icona trovata per "' + esc(q) + '"</div>';
    return;
  }
  // Icona "selezionata" = quella centrale (slot 0) dello state attivo
  let cur = null;
  if (_iconPickerCtx === 'todo')          cur = _todoEditState && _todoEditState.icone && _todoEditState.icone[0];
  else if (_iconPickerCtx === 'scadenza') cur = _scadenzaEditState && _scadenzaEditState.icone && _scadenzaEditState.icone[0];
  else                                     cur = _spesaEditState && _spesaEditState.icone && _spesaEditState.icone[0];
  D.iconPickerGrid.innerHTML = emojis.map(e =>
    '<button class="icon-picker-cell' + (e === cur ? ' selected' : '') + '" data-emoji="' + e + '" type="button">' +
      e +
    '</button>'
  ).join('');
  twemojify(D.iconPickerGrid);
  $$('.icon-picker-cell', D.iconPickerGrid).forEach(b => {
    b.addEventListener('click', () => {
      const e = b.getAttribute('data-emoji');
      if (_iconPickerCtx === 'todo') {
        _todoEditState.iconaManual = true;
        updateTodoEditIcon(e);
      } else if (_iconPickerCtx === 'scadenza') {
        _scadenzaEditState.iconaManual = true;
        updateScadenzaEditIcon(e);
      } else {
        _spesaEditState.iconaManual = true;
        updateSpesaEditIcon(e);
      }
      closeModal('modalIconPicker');
    });
  });
}

function renderSpesa() {
  if (!D.spesaListToBuy || !D.spesaListBought) return;
  const items = (S.spesa || []).slice().sort((a, b) => (a.ordine || 0) - (b.ordine || 0));
  const toBuy   = items.filter(x => !x.preso);
  const bought  = items.filter(x =>  x.preso);
  if (D.spesaCountToBuy)  D.spesaCountToBuy.textContent  = toBuy.length;
  if (D.spesaCountBought) D.spesaCountBought.textContent = bought.length;
  D.spesaListToBuy.innerHTML  = toBuy.map(spesaItemHtml).join('');
  D.spesaListBought.innerHTML = bought.map(spesaItemHtml).join('');
  twemojify(D.spesaListToBuy);
  twemojify(D.spesaListBought);
  bindSpesaItemEvents();
}

function spesaItemHtml(it) {
  const icon = it.icona || '🛒';
  const qty  = (it.quantita && it.quantita > 1) ? '<span class="spesa-item-qty">×' + it.quantita + '</span>' : '';
  const note = it.note ? ' — ' + esc(it.note) : '';
  return '<div class="spesa-item' + (it.preso ? ' preso' : '') + '" data-id="' + it.id + '">' +
           '<button class="spesa-item-icon" data-action="toggle" type="button" aria-label="Segna preso/non preso">' +
             '<span class="spesa-icon-emoji">' + icon + '</span>' +
             '<span class="check-mark">✓</span>' +
           '</button>' +
           '<div class="spesa-item-body" data-action="edit">' +
             '<div class="spesa-item-name">' + qty + esc(it.nome || '') + '</div>' +
             ((it.note || (it.quantita && it.quantita > 1)) ? '<div class="spesa-item-meta">' + esc(it.note || '') + '</div>' : '') +
           '</div>' +
         '</div>';
}

function bindSpesaItemEvents() {
  // Toggle preso/non preso al click sull'icona
  $$('.spesa-item .spesa-item-icon').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = btn.closest('.spesa-item');
      if (item) toggleSpesaPreso(item.getAttribute('data-id'));
    });
  });
  // Apertura modal modifica al click sul body
  $$('.spesa-item .spesa-item-body').forEach(body => {
    body.addEventListener('click', () => {
      const item = body.closest('.spesa-item');
      if (item) openSpesaEdit(item.getAttribute('data-id'));
    });
  });
}

async function toggleSpesaPreso(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const it = S.spesa.find(x => x.id === id);
  if (!it) return;
  const newPreso = !it.preso;
  // optimistic
  it.preso = newPreso;
  it.updated_at = new Date().toISOString();
  saveLocalCache();
  vibrate(10);
  renderSpesa();
  // remoto
  const path = T.SPESA + '?id=eq.' + id;
  const options = { method: 'PATCH', body: JSON.stringify({ preso: newPreso }) };
  if (isOnline()) {
    try { await supaFetch(path, options); }
    catch { enqueue({ path, options }); }
  } else {
    enqueue({ path, options });
  }
}

// ─── MODAL Aggiungi/Modifica elemento ───────────────────────
// icone[0] = centro (icona scelta), icone[1..4] = suggerimenti laterali
let _spesaEditState = { icone: ['🛒'], iconaManual: false, qty: 1 };

function openSpesaAdd() {
  S.editSpesaId = null;
  _spesaEditState = { icone: ['🛒'], iconaManual: false, qty: 1 };
  if (D.spesaEditTitle) D.spesaEditTitle.textContent = 'Nuovo elemento';
  if (D.spesaEditNome)  D.spesaEditNome.value = '';
  if (D.spesaEditNote)  D.spesaEditNote.value = '';
  updateSpesaEditQty(1);
  updateSpesaEditIcons(['🛒']);
  if (D.spesaEditDelete) D.spesaEditDelete.style.display = 'none';
  openModal('modalSpesa');
  setTimeout(() => { if (D.spesaEditNome) D.spesaEditNome.focus(); }, 80);
}

function openSpesaEdit(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const it = S.spesa.find(x => x.id === id);
  if (!it) return;
  S.editSpesaId = id;
  _spesaEditState = { icone: [it.icona || '🛒'], iconaManual: true, qty: it.quantita || 1 };
  if (D.spesaEditTitle) D.spesaEditTitle.textContent = 'Modifica elemento';
  if (D.spesaEditNome)  D.spesaEditNome.value = it.nome || '';
  if (D.spesaEditNote)  D.spesaEditNote.value = it.note || '';
  updateSpesaEditQty(_spesaEditState.qty);
  updateSpesaEditIcons(_spesaEditState.icone);
  if (D.spesaEditDelete) D.spesaEditDelete.style.display = 'block';
  openModal('modalSpesa');
}

function updateSpesaEditQty(n) {
  _spesaEditState.qty = Math.max(1, Math.min(99, n));
  if (D.spesaEditQtyValue) D.spesaEditQtyValue.textContent = String(_spesaEditState.qty);
}

// Aggiorna le 5 icone: centro (slot 0) + max 4 laterali (slot 1..4)
function updateSpesaEditIcons(icone) {
  if (!Array.isArray(icone) || !icone.length) icone = ['🛒'];
  _spesaEditState.icone = icone.slice(0, 5);
  // Centro
  if (D.spesaEditIconBtn) {
    D.spesaEditIconBtn.innerHTML = _spesaEditState.icone[0];
    twemojify(D.spesaEditIconBtn);
  }
  // 4 side slot (data-slot=1..4)
  document.querySelectorAll('.spesa-icon-side').forEach(el => {
    const slot = Number(el.getAttribute('data-slot'));
    const ic = _spesaEditState.icone[slot];
    if (ic) {
      el.hidden = false;
      el.innerHTML = ic;
      twemojify(el);
    } else {
      el.hidden = true;
      el.innerHTML = '';
    }
  });
}

// Compat con codice legacy che chiamava updateSpesaEditIcon (singolo)
function updateSpesaEditIcon(icon) {
  if (!icon) icon = '🛒';
  // Sostituisce solo il centro mantenendo i laterali
  const arr = _spesaEditState.icone.slice();
  // Se l'icona scelta era in uno dei side, rimuovila da lì (no duplicati)
  const existing = arr.indexOf(icon, 1);
  if (existing > 0) arr.splice(existing, 1);
  arr[0] = icon;
  updateSpesaEditIcons(arr);
}

function onSpesaEditNomeInput() {
  const nome = D.spesaEditNome ? D.spesaEditNome.value : '';
  const trimmed = nome.trim();
  // Sotto la lunghezza minima non ricalcoliamo: l'utente sta ancora digitando
  // e non vogliamo "spegnere" l'icona corrente (es. cancellando un char)
  if (trimmed.length < SPESA_MIN_QUERY_LEN) return;
  const suggestions = spesaIconSuggestions(nome, 5);
  const currentIcon = _spesaEditState.icone && _spesaEditState.icone[0];
  // L'icona corrente è ancora rilevante per il nuovo nome?
  const stillRelevant = suggestions.indexOf(currentIcon) !== -1;
  if (_spesaEditState.iconaManual && stillRelevant) {
    // Utente aveva scelto manualmente E la scelta è ancora coerente:
    // tengo l'icona al centro e aggiorno solo i laterali
    const lateral = suggestions.filter(e => e !== currentIcon).slice(0, 4);
    updateSpesaEditIcons([currentIcon].concat(lateral));
  } else {
    // Il nome è cambiato in modo significativo → reset e ricalcolo
    _spesaEditState.iconaManual = false;
    updateSpesaEditIcons(suggestions);
  }
}

// Swap di una icona laterale col centro: l'utente clicca un side → la
// icona laterale diventa centro, e quella che era centro va al posto del
// side cliccato. Marca iconaManual=true così smetto di sovrascrivere
// dall'auto-suggestion del nome.
function swapSpesaIcon(slot) {
  const arr = _spesaEditState.icone.slice();
  if (!arr[slot]) return;
  const tmp = arr[0];
  arr[0] = arr[slot];
  arr[slot] = tmp;
  _spesaEditState.iconaManual = true;
  updateSpesaEditIcons(arr);
}

async function saveSpesaEdit() {
  const nome = D.spesaEditNome ? D.spesaEditNome.value.trim() : '';
  if (!nome) { toast('Inserisci il nome', 'warn'); return; }
  const note = D.spesaEditNote ? D.spesaEditNote.value.trim() : '';
  const quantita = _spesaEditState.qty;
  const icona = (_spesaEditState.icone && _spesaEditState.icone[0]) || spesaIconForName(nome);
  setBtnLoading(D.spesaEditSave, true);
  try {
    if (S.editSpesaId == null) {
      // INSERT
      const ordineNew = (S.spesa.length ? Math.max.apply(null, S.spesa.map(x => x.ordine || 0)) : 0) + 1;
      const payload = { nome, note: note || null, quantita, icona, preso: false, ordine: ordineNew };
      const tmpId = 'tmp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      const row = Object.assign({ id: tmpId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, payload);
      S.spesa.push(row);
      saveLocalCache();
      renderSpesa();
      const path = T.SPESA + '?select=*';
      const options = { method: 'POST', body: JSON.stringify(payload), headers: { 'Prefer': 'return=representation' } };
      if (isOnline()) {
        try {
          const res = await supaFetch(path, options);
          if (res && res[0]) {
            const idx = S.spesa.findIndex(x => x.id === tmpId);
            if (idx >= 0) S.spesa[idx] = res[0];
            saveLocalCache();
            renderSpesa();
          }
        } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalSpesa');
      toast('Aggiunto alla lista', 'success');
    } else {
      // UPDATE
      const idx = S.spesa.findIndex(x => x.id === S.editSpesaId);
      const payload = { nome, note: note || null, quantita, icona };
      if (idx >= 0) S.spesa[idx] = Object.assign({}, S.spesa[idx], payload, { updated_at: new Date().toISOString() });
      saveLocalCache();
      renderSpesa();
      const path = T.SPESA + '?id=eq.' + S.editSpesaId;
      const options = { method: 'PATCH', body: JSON.stringify(payload) };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalSpesa');
      toast('Modifiche salvate', 'success');
    }
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.spesaEditSave, false);
    S.editSpesaId = null;
  }
}

async function deleteSpesaEdit() {
  if (S.editSpesaId == null) return;
  const ok = await confirmDlg({
    title: 'Elimina elemento',
    message: 'Vuoi davvero eliminare questo elemento dalla lista?',
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  setBtnLoading(D.spesaEditDelete, true);
  try {
    const idToDelete = S.editSpesaId;
    S.spesa = S.spesa.filter(x => x.id !== idToDelete);
    saveLocalCache();
    renderSpesa();
    const path = T.SPESA + '?id=eq.' + idToDelete;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalSpesa');
    toast('Elemento eliminato', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.spesaEditDelete, false);
    S.editSpesaId = null;
  }
}

// Step 1: apri modal scelta scope (Da prendere / Presi / Tutto)
function confirmClearSpesa() {
  if (!S.spesa.length) { toast('Lista già vuota', 'info'); return; }
  openModal('modalClearSpesa');
}

// Step 2: chiamato dal modal scope → mostra conferma finale → esegue
async function clearSpesaScope(scope) {
  const all = S.spesa || [];
  let items, msg;
  if (scope === 'toBuy') {
    items = all.filter(x => !x.preso);
    if (!items.length) { closeModal('modalClearSpesa'); toast('Nessun elemento "Da prendere"', 'info'); return; }
    msg = 'Eliminare i ' + items.length + ' elementi della lista "Da prendere"? L\'azione non è reversibile.';
  } else if (scope === 'bought') {
    items = all.filter(x => x.preso);
    if (!items.length) { closeModal('modalClearSpesa'); toast('Nessun elemento "Preso"', 'info'); return; }
    msg = 'Eliminare i ' + items.length + ' elementi della lista "Presi"? L\'azione non è reversibile.';
  } else {
    items = all.slice();
    msg = 'Eliminare TUTTI i ' + items.length + ' elementi della lista (sia "Da prendere" che "Presi")? L\'azione non è reversibile.';
  }
  closeModal('modalClearSpesa');
  const ok = await confirmDlg({
    title: 'Conferma svuotamento',
    message: msg,
    confirmLabel: 'Svuota',
    danger: true
  });
  if (!ok) return;
  try {
    const ids = items.map(x => x.id).filter(id => typeof id === 'number');
    // optimistic locale
    if (scope === 'all')   S.spesa = [];
    else if (scope === 'toBuy')  S.spesa = all.filter(x => x.preso);
    else                          S.spesa = all.filter(x => !x.preso);
    saveLocalCache();
    renderSpesa();
    // remoto
    if (ids.length) {
      const path = T.SPESA + '?id=in.(' + ids.join(',') + ')';
      const options = { method: 'DELETE' };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
    }
    toast(scope === 'all' ? 'Lista svuotata' : 'Elementi eliminati', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'svuotamento fallito'), 'error');
  }
}

// Realtime listener per cdc_lista_spesa — INSERT/UPDATE/DELETE sincronizzati
// in tempo reale tra tutti i dispositivi collegati
function onSpesaChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    if (!S.spesa.find(x => x.id === p.new.id)) S.spesa.push(p.new);
  } else if (ev === 'UPDATE') {
    const idx = S.spesa.findIndex(x => x.id === p.new.id);
    if (idx >= 0) S.spesa[idx] = p.new;
    else S.spesa.push(p.new);
  } else if (ev === 'DELETE') {
    S.spesa = S.spesa.filter(x => x.id !== p.old.id);
  }
  saveLocalCache();
  // Aggiorna ENTRAMBE le viste rilevanti: la lista nel modulo Spesa E
  // il widget anteprima nella Home Gestione Casa
  try { renderSpesa(); } catch {}
  try { renderHomeGestione(); } catch {}
}

// Refresh esplicito della lista spesa: usato dal watchdog quando l'app
// torna visibile (su Safari iOS PWA il WebSocket Realtime può addormentarsi
// in background e gli eventi UPDATE/INSERT/DELETE andrebbero persi)
async function refreshSpesaNow() {
  try {
    const rows = await supaFetch(T.SPESA + '?select=*&order=ordine.asc,created_at.asc');
    if (rows) {
      S.spesa = rows;
      saveLocalCache();
      renderSpesa();
      renderHomeGestione();
    }
  } catch (e) { /* offline o errore: niente */ }
}

// ═══════════════════════════════════════════════════════════════
// TODO — stessa logica della Spesa ma su tabella cdc_lista_todo
// Item: {id, nome, icona, note, scadenza, fatto, ordine, ...}
// ═══════════════════════════════════════════════════════════════
function renderTodo() {
  if (!D.todoListToDo || !D.todoListDone) return;
  const items = (S.todo || []).slice().sort((a, b) => {
    // Ordine: scadenza prima (asc), poi ordine, poi created
    const sa = a.scadenza || '9999-99-99';
    const sb = b.scadenza || '9999-99-99';
    if (sa !== sb) return sa < sb ? -1 : 1;
    return (a.ordine || 0) - (b.ordine || 0);
  });
  const todo = items.filter(x => !x.fatto);
  const done = items.filter(x =>  x.fatto);
  if (D.todoCountToDo) D.todoCountToDo.textContent = todo.length;
  if (D.todoCountDone) D.todoCountDone.textContent = done.length;
  D.todoListToDo.innerHTML = todo.map(todoRowHtml).join('');
  D.todoListDone.innerHTML = done.map(todoRowHtml).join('');
  bindTodoRows(D.todoListToDo);
  bindTodoRows(D.todoListDone);
  twemojify(D.todoListToDo);
  twemojify(D.todoListDone);
}

function todoRowHtml(it) {
  const fatto = !!it.fatto;
  // Badge scadenza con "urgent" se entro oggi
  let scadHtml = '';
  if (it.scadenza) {
    const today = new Date(); today.setHours(0,0,0,0);
    const sd = new Date(it.scadenza + 'T00:00:00');
    const diffDays = Math.floor((sd - today) / 86400000);
    const urgent = diffDays <= 1 && !fatto;
    scadHtml = '<span class="todo-item-scadenza' + (urgent ? ' urgent' : '') + '">' + fmtDataLong(it.scadenza) + '</span>';
  }
  const note = it.note ? esc(it.note) : '';
  const meta = (scadHtml || note) ? '<div class="todo-item-meta">' + scadHtml + (note ? '<span>' + note + '</span>' : '') + '</div>' : '';
  return '<div class="todo-item ' + (fatto ? 'fatto' : '') + '" data-id="' + it.id + '">' +
           '<button class="todo-item-icon" type="button" data-action="toggle" aria-label="' + (fatto ? 'Non fatto' : 'Segna come fatto') + '">' +
             (it.icona || '📝') +
           '</button>' +
           '<div class="todo-item-body" data-action="edit">' +
             '<div class="todo-item-name">' + esc(it.nome || '') + '</div>' +
             meta +
           '</div>' +
         '</div>';
}

function bindTodoRows(container) {
  $$('.todo-item', container).forEach(row => {
    const id = Number(row.getAttribute('data-id'));
    const iconBtn = row.querySelector('[data-action="toggle"]');
    const body    = row.querySelector('[data-action="edit"]');
    if (iconBtn) iconBtn.addEventListener('click', e => { e.stopPropagation(); toggleTodoDone(id); });
    if (body)    body.addEventListener('click', () => openTodoEdit(id));
  });
}

async function toggleTodoDone(id) {
  const it = S.todo.find(x => x.id === id);
  if (!it) return;
  const newVal = !it.fatto;
  it.fatto = newVal;
  saveLocalCache();
  renderTodo();
  renderHomeGestione();
  // remoto
  const path = T.TODO + '?id=eq.' + id;
  const options = { method: 'PATCH', body: JSON.stringify({ fatto: newVal }) };
  if (isOnline()) {
    try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
  } else {
    enqueue({ path, options });
  }
}

// ─── MODAL Nuovo/Modifica ToDo ──────────────────────────────
let _todoEditState = { icone: ['📝'], iconaManual: false };

function openTodoAdd() {
  S.editTodoId = null;
  _todoEditState = { icone: ['📝'], iconaManual: false };
  if (D.todoEditTitle)    D.todoEditTitle.textContent = 'Nuovo ToDo';
  if (D.todoEditNome)     D.todoEditNome.value = '';
  if (D.todoEditScadenza) D.todoEditScadenza.value = '';
  if (D.todoEditNote)     D.todoEditNote.value = '';
  updateTodoEditIcons(['📝']);
  if (D.todoEditDelete) D.todoEditDelete.style.display = 'none';
  openModal('modalTodo');
  setTimeout(() => { if (D.todoEditNome) D.todoEditNome.focus(); }, 80);
}

function openTodoEdit(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const it = S.todo.find(x => x.id === id);
  if (!it) return;
  S.editTodoId = id;
  _todoEditState = { icone: [it.icona || '📝'], iconaManual: true };
  if (D.todoEditTitle)    D.todoEditTitle.textContent = 'Modifica ToDo';
  if (D.todoEditNome)     D.todoEditNome.value = it.nome || '';
  if (D.todoEditScadenza) D.todoEditScadenza.value = it.scadenza || '';
  if (D.todoEditNote)     D.todoEditNote.value = it.note || '';
  updateTodoEditIcons(_todoEditState.icone);
  if (D.todoEditDelete) D.todoEditDelete.style.display = 'block';
  openModal('modalTodo');
}

function updateTodoEditIcons(icone) {
  if (!Array.isArray(icone) || !icone.length) icone = ['📝'];
  _todoEditState.icone = icone.slice(0, 5);
  if (D.todoEditIconBtn) {
    D.todoEditIconBtn.innerHTML = _todoEditState.icone[0];
    twemojify(D.todoEditIconBtn);
  }
  document.querySelectorAll('.spesa-icon-side[data-todo-slot]').forEach(el => {
    const slot = Number(el.getAttribute('data-todo-slot'));
    const ic = _todoEditState.icone[slot];
    if (ic) { el.hidden = false; el.innerHTML = ic; twemojify(el); }
    else    { el.hidden = true;  el.innerHTML = ''; }
  });
}

function updateTodoEditIcon(icon) {
  if (!icon) icon = '📝';
  const arr = _todoEditState.icone.slice();
  const existing = arr.indexOf(icon, 1);
  if (existing > 0) arr.splice(existing, 1);
  arr[0] = icon;
  updateTodoEditIcons(arr);
}

function onTodoEditNomeInput() {
  const nome = D.todoEditNome ? D.todoEditNome.value : '';
  if (nome.trim().length < SPESA_MIN_QUERY_LEN) return;
  const suggestions = todoIconSuggestions(nome, 5);
  const currentIcon = _todoEditState.icone && _todoEditState.icone[0];
  const stillRelevant = suggestions.indexOf(currentIcon) !== -1;
  if (_todoEditState.iconaManual && stillRelevant) {
    const lateral = suggestions.filter(e => e !== currentIcon).slice(0, 4);
    updateTodoEditIcons([currentIcon].concat(lateral));
  } else {
    _todoEditState.iconaManual = false;
    updateTodoEditIcons(suggestions);
  }
}

function swapTodoIcon(slot) {
  const arr = _todoEditState.icone.slice();
  if (!arr[slot]) return;
  const tmp = arr[0]; arr[0] = arr[slot]; arr[slot] = tmp;
  _todoEditState.iconaManual = true;
  updateTodoEditIcons(arr);
}

async function saveTodoEdit() {
  const nome = D.todoEditNome ? D.todoEditNome.value.trim() : '';
  if (!nome) { toast('Inserisci cosa devi fare', 'warn'); return; }
  const icona = (_todoEditState.icone && _todoEditState.icone[0]) || todoIconForName(nome);
  const scadenza = (D.todoEditScadenza && D.todoEditScadenza.value) || null;
  const note = D.todoEditNote ? D.todoEditNote.value.trim() : '';
  setBtnLoading(D.todoEditSave, true);
  try {
    if (S.editTodoId == null) {
      // nuovo
      const maxOrd = (S.todo || []).reduce((m, x) => Math.max(m, x.ordine || 0), 0);
      const payload = { nome, icona, scadenza, note: note || null, ordine: maxOrd + 1, fatto: false };
      const tmpId = uuid();
      const row = Object.assign({ id: tmpId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, payload);
      S.todo.push(row);
      saveLocalCache();
      renderTodo(); renderHomeGestione();
      const path = T.TODO + '?select=*';
      const options = { method: 'POST', body: JSON.stringify(payload), headers: { 'Prefer': 'return=representation' } };
      if (isOnline()) {
        try {
          const res = await supaFetch(path, options);
          if (res && res[0]) {
            const idx = S.todo.findIndex(x => x.id === tmpId);
            if (idx >= 0) S.todo[idx] = res[0];
            saveLocalCache();
            renderTodo(); renderHomeGestione();
          }
        } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalTodo');
      toast('ToDo aggiunto', 'success');
    } else {
      // modifica
      const idx = S.todo.findIndex(x => x.id === S.editTodoId);
      const payload = { nome, icona, scadenza, note: note || null };
      if (idx >= 0) S.todo[idx] = Object.assign({}, S.todo[idx], payload);
      saveLocalCache();
      renderTodo(); renderHomeGestione();
      const path = T.TODO + '?id=eq.' + S.editTodoId;
      const options = { method: 'PATCH', body: JSON.stringify(payload) };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalTodo');
      toast('ToDo modificato', 'success');
    }
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.todoEditSave, false);
    S.editTodoId = null;
  }
}

async function deleteTodoEdit() {
  if (S.editTodoId == null) return;
  const ok = await confirmDlg({
    title: 'Elimina ToDo',
    message: 'Vuoi davvero eliminare questo ToDo? L\'azione non è reversibile.',
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  setBtnLoading(D.todoEditDelete, true);
  try {
    const id = S.editTodoId;
    S.todo = S.todo.filter(x => x.id !== id);
    saveLocalCache();
    renderTodo(); renderHomeGestione();
    const path = T.TODO + '?id=eq.' + id;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalTodo');
    toast('ToDo eliminato', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.todoEditDelete, false);
    S.editTodoId = null;
  }
}

// Step 1: scelta scope svuotamento ToDo
function confirmClearTodo() {
  if (!S.todo.length) { toast('Lavagna già vuota', 'info'); return; }
  openModal('modalClearTodo');
}

async function clearTodoScope(scope) {
  const all = S.todo || [];
  let items, msg;
  if (scope === 'toDo') {
    items = all.filter(x => !x.fatto);
    if (!items.length) { closeModal('modalClearTodo'); toast('Niente "Da fare"', 'info'); return; }
    msg = 'Cancellare i ' + items.length + ' ToDo "Da fare"? L\'azione non è reversibile.';
  } else if (scope === 'done') {
    items = all.filter(x => x.fatto);
    if (!items.length) { closeModal('modalClearTodo'); toast('Niente "Fatti"', 'info'); return; }
    msg = 'Cancellare i ' + items.length + ' ToDo "Fatti"? L\'azione non è reversibile.';
  } else {
    items = all.slice();
    msg = 'Pulire TUTTA la lavagna (' + items.length + ' ToDo)? L\'azione non è reversibile.';
  }
  closeModal('modalClearTodo');
  const ok = await confirmDlg({
    title: 'Conferma pulizia lavagna',
    message: msg,
    confirmLabel: 'Pulisci',
    danger: true
  });
  if (!ok) return;
  try {
    const ids = items.map(x => x.id).filter(id => typeof id === 'number');
    if (scope === 'all')      S.todo = [];
    else if (scope === 'toDo')S.todo = all.filter(x => x.fatto);
    else                       S.todo = all.filter(x => !x.fatto);
    saveLocalCache();
    renderTodo(); renderHomeGestione();
    if (ids.length) {
      const path = T.TODO + '?id=in.(' + ids.join(',') + ')';
      const options = { method: 'DELETE' };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
    }
    toast(scope === 'all' ? 'Lavagna pulita' : 'ToDo eliminati', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'pulizia fallita'), 'error');
  }
}

// Realtime ToDo
function onTodoChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    if (!S.todo.find(x => x.id === p.new.id)) S.todo.push(p.new);
  } else if (ev === 'UPDATE') {
    const idx = S.todo.findIndex(x => x.id === p.new.id);
    if (idx >= 0) S.todo[idx] = p.new;
    else S.todo.push(p.new);
  } else if (ev === 'DELETE') {
    S.todo = S.todo.filter(x => x.id !== p.old.id);
  }
  saveLocalCache();
  try { renderTodo(); } catch {}
  try { renderHomeGestione(); } catch {}
}

async function refreshTodoNow() {
  try {
    const rows = await supaFetch(T.TODO + '?select=*&order=ordine.asc,created_at.asc');
    if (rows) {
      S.todo = rows;
      saveLocalCache();
      renderTodo();
      renderHomeGestione();
    }
  } catch (e) { /* offline o errore: niente */ }
}

// ═══════════════════════════════════════════════════════════════
// SCADENZE — gestione promemoria con vista lista + calendario
// Item: {id, titolo, icona, data, anticipo_giorni, ricorrenza, note, fatto, ordine}
// ═══════════════════════════════════════════════════════════════

// Helper: data odierna come 'YYYY-MM-DD'
function _todayStr() {
  const t = new Date();
  return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
}

// ─── FESTIVITÀ ITALIANE ─────────────────────────────────────
// Algoritmo di Gauss/Computus per calcolare la Pasqua (gregoriana).
// Restituisce {anno, mese (1-12), giorno (1-31)}.
function _easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = aprile
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { anno: year, mese: month, giorno: day };
}

// Cache per anno → Set di 'YYYY-MM-DD' festivi italiani
const _holidayCache = {};
function italianHolidaysSet(year) {
  if (_holidayCache[year]) return _holidayCache[year];
  const set = new Set();
  const add = (m, d) => set.add(year + '-' + String(m).padStart(2,'0') + '-' + String(d).padStart(2,'0'));
  // Festività fisse italiane
  add(1, 1);   // Capodanno
  add(1, 6);   // Epifania
  add(4, 25);  // Festa della Liberazione
  add(5, 1);   // Festa del Lavoro
  add(6, 2);   // Festa della Repubblica
  add(8, 15);  // Ferragosto (Assunzione)
  add(11, 1);  // Ognissanti
  add(12, 8);  // Immacolata Concezione
  add(12, 25); // Natale
  add(12, 26); // Santo Stefano
  // Variabili: Pasqua + Lunedì dell'Angelo (Pasquetta)
  const easter = _easterSunday(year);
  add(easter.mese, easter.giorno);
  // Pasquetta = Pasqua + 1 giorno
  const pasquetta = new Date(easter.anno, easter.mese - 1, easter.giorno + 1);
  add(pasquetta.getMonth() + 1, pasquetta.getDate());
  _holidayCache[year] = set;
  return set;
}

function isItalianHoliday(ds) {
  if (!ds) return false;
  const [y] = ds.split('-');
  return italianHolidaysSet(Number(y)).has(ds);
}

// Helper: numero giorni di distanza tra due 'YYYY-MM-DD' (b - a)
function _daysBetween(aStr, bStr) {
  const a = new Date(aStr + 'T00:00:00');
  const b = new Date(bStr + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

// Helper: calcola la PROSSIMA occorrenza tenendo conto della ricorrenza.
// Per scadenze 'mensile' o 'annuale' che sono passate, restituisce la prossima data.
// Per 'no' restituisce la data originale anche se passata.
function nextOccurrence(scad) {
  if (!scad || !scad.data) return null;
  const today = _todayStr();
  let d = scad.data;
  if (scad.ricorrenza === 'no' || !scad.ricorrenza) return d;
  // Per giornaliera / settimanale: avanza per giorni
  if (scad.ricorrenza === 'giornaliera' || scad.ricorrenza === 'settimanale') {
    const stepDays = (scad.ricorrenza === 'giornaliera') ? 1 : 7;
    // Salto diretto: calcola quanti step servono
    let diff = _daysBetween(d, today);
    if (diff <= 0) return d;
    // Arrotonda per eccesso al prossimo step
    const steps = Math.ceil(diff / stepDays);
    const base = new Date(d + 'T00:00:00');
    base.setDate(base.getDate() + steps * stepDays);
    return base.getFullYear() + '-' + String(base.getMonth()+1).padStart(2,'0') + '-' + String(base.getDate()).padStart(2,'0');
  }
  // Per mensile / annuale: avanza ciclicamente
  while (d < today) {
    const [y, m, day] = d.split('-').map(Number);
    let ny = y, nm = m;
    if (scad.ricorrenza === 'mensile') {
      nm += 1;
      if (nm > 12) { nm = 1; ny += 1; }
    } else if (scad.ricorrenza === 'annuale') {
      ny += 1;
    } else break;
    // Mantieni il giorno (se il mese non lo supporta, usa l'ultimo giorno)
    const lastDay = new Date(ny, nm, 0).getDate();
    const useDay = Math.min(day, lastDay);
    d = ny + '-' + String(nm).padStart(2,'0') + '-' + String(useDay).padStart(2,'0');
  }
  return d;
}

// Helper: stato urgenza scadenza: 'past' | 'today' | 'soon' | 'future'
// 'soon' = entro anticipo_giorni
function scadStatus(scad) {
  const nextDate = nextOccurrence(scad);
  if (!nextDate) return 'future';
  const today = _todayStr();
  const diff = _daysBetween(today, nextDate);
  const ant = (scad.anticipo_giorni != null) ? scad.anticipo_giorni : 7;
  // Scadenze NON ricorrenti passate restano "past" (anche se fatte mostra grigio)
  if (scad.ricorrenza === 'no' && nextDate < today) return 'past';
  if (diff < 0) return 'past';
  if (diff === 0) return 'today';
  if (diff <= ant) return 'soon';
  return 'future';
}

// Helper: formato data "Lun 12 mag 2026"
function fmtScadDataShort(s) {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  const giorni = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  return giorni[d.getDay()] + ' ' + d.getDate() + ' ' + MESI_SHORT[d.getMonth()] + ' ' + d.getFullYear();
}

// ─── RENDER LISTA ────────────────────────────────────────────
function renderScadenzeList() {
  if (!D.scadenzeListContent) return;
  const nowMs = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  // Filtra fuori le scadenze completate da più di 1 giorno
  const items = (S.scadenze || []).filter(it => {
    if (!it.fatto) return true;
    if (!it.completato_at) return true; // se manca timestamp, mostra (legacy)
    const age = nowMs - new Date(it.completato_at).getTime();
    return age < ONE_DAY_MS;             // mostra solo se completata < 24h fa
  });
  // Calcola data effettiva (next occurrence) per ogni item
  items.forEach(it => { it._nextDate = nextOccurrence(it); });
  items.sort((a, b) => {
    const da = a._nextDate || '9999-12-31';
    const db = b._nextDate || '9999-12-31';
    if (da !== db) return da < db ? -1 : 1;
    return (a.ordine || 0) - (b.ordine || 0);
  });

  if (!items.length) {
    D.scadenzeListContent.innerHTML = '<div class="scadenze-empty">📅 Nessuna scadenza<br><br>Tocca il <b>+</b> in alto per aggiungerne una.</div>';
    return;
  }

  // Raggruppa per mese (YYYY-MM)
  const groups = new Map();
  items.forEach(it => {
    const d = it._nextDate || '9999-12';
    const key = d.slice(0, 7);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  });
  const todayMonth = _todayStr().slice(0, 7);

  let html = '';
  for (const [monthKey, group] of groups) {
    const [y, m] = monthKey.split('-');
    const title = MESI_FULL[Number(m) - 1] + ' ' + y;
    const isCurrent = monthKey === todayMonth;
    html += '<div class="scad-month-group' + (isCurrent ? ' is-current' : '') + '">';
    html += '<h3 class="scad-month-title"><span>' + title + '</span><span class="scad-month-count">' + group.length + '</span></h3>';
    group.forEach(it => { html += scadItemHtml(it); });
    html += '</div>';
  }
  D.scadenzeListContent.innerHTML = html;
  twemojify(D.scadenzeListContent);
  bindScadenzeItems(D.scadenzeListContent);
}

function scadItemHtml(it) {
  const date = it._nextDate || it.data;
  const status = scadStatus(it);
  const cls = ['scad-item'];
  if (it.fatto) cls.push('is-fatto');
  if (status === 'past')  cls.push('is-past');
  if (status === 'today') cls.push('is-today');
  if (status === 'soon')  cls.push('is-soon');
  // Tags
  let tagHtml = '';
  if (status === 'past' && !it.fatto)  tagHtml += '<span class="scad-tag urg">In ritardo</span>';
  if (status === 'today' && !it.fatto) tagHtml += '<span class="scad-tag urg">Oggi</span>';
  if (status === 'soon' && !it.fatto) {
    const diff = _daysBetween(_todayStr(), date);
    tagHtml += '<span class="scad-tag soon">' + (diff === 1 ? 'Domani' : 'tra ' + diff + ' gg') + '</span>';
  }
  if (it.ricorrenza && it.ricorrenza !== 'no') {
    const ricLabel = {
      giornaliera: '↻ giornaliera',
      settimanale: '↻ settimanale',
      mensile:     '↻ mensile',
      annuale:     '↻ annuale'
    }[it.ricorrenza] || '↻';
    tagHtml += '<span class="scad-tag ricorr">' + ricLabel + '</span>';
  }
  if (it.note) tagHtml += '<span class="scad-tag">' + esc(String(it.note).slice(0, 40)) + (it.note.length > 40 ? '…' : '') + '</span>';

  // Footer "completata da X il dd/mm" se fatto
  let completedFooter = '';
  if (it.fatto && it.completato_da) {
    const dt = it.completato_at ? new Date(it.completato_at) : null;
    const when = dt ? (String(dt.getDate()).padStart(2,'0') + '/' + String(dt.getMonth()+1).padStart(2,'0') + '/' + dt.getFullYear()) : '';
    completedFooter = '<div class="scad-item-completed-info">' +
                        '<span>✓ ' + esc(it.completato_da) + '</span>' +
                        (when ? '<span class="ci-sep">·</span><span>' + when + '</span>' : '') +
                        (it.nota_completamento ? '<span class="ci-sep">·</span><span class="ci-note">' + esc(it.nota_completamento) + '</span>' : '') +
                      '</div>';
  }

  const [, m, d] = date.split('-');
  // Action button: ✓ apre modal complete (se non fatto) o riporta a not-fatto (se fatto)
  const actionLabel = it.fatto ? 'Annulla completamento' : 'Segna come completata';
  return '<div class="' + cls.join(' ') + '" data-id="' + it.id + '">' +
           '<div class="scad-item-date">' +
             '<div class="day">' + Number(d) + '</div>' +
             '<div class="month">' + MESI_SHORT[Number(m) - 1] + '</div>' +
           '</div>' +
           '<div class="scad-item-body">' +
             '<div class="scad-item-name">' +
               '<span class="scad-item-icon-wrap">' +
                 '<span class="scad-icon">' + (it.icona || '📅') + '</span>' +
                 '<span class="check-mark">✓</span>' +
               '</span>' +
               esc(it.titolo || '') +
             '</div>' +
             (tagHtml ? '<div class="scad-item-meta">' + tagHtml + '</div>' : '') +
             completedFooter +
           '</div>' +
           '<button class="scad-item-action" data-action="complete" type="button" aria-label="' + actionLabel + '" title="' + actionLabel + '">✓</button>' +
         '</div>';
}

function bindScadenzeItems(container) {
  $$('.scad-item', container).forEach(row => {
    const id = row.getAttribute('data-id');
    // Bottone azione ✓ a destra → apre modal complete (o annulla se già fatto)
    const actionBtn = row.querySelector('[data-action="complete"]');
    if (actionBtn) {
      actionBtn.addEventListener('click', e => {
        e.stopPropagation();
        const it = (S.scadenze || []).find(x => String(x.id) === String(id));
        if (!it) return;
        if (it.fatto) uncompleteScadenza(id);
        else openScadenzaComplete(id);
      });
    }
    // Click ovunque sulla riga (eccetto sul bottone azione) → modifica
    row.addEventListener('click', e => {
      if (e.target && e.target.closest('[data-action="complete"]')) return;
      openScadenzaEdit(id);
    });
  });
}

// ─── COMPLETAMENTO scadenza ─────────────────────────────────
function openScadenzaComplete(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const it = (S.scadenze || []).find(x => x.id === id || String(x.id) === String(id));
  if (!it) return;
  S.editScadenzaId = it.id;
  if (D.scadCompleteTitle) D.scadCompleteTitle.textContent = 'Segna come completata';
  if (D.scadCompleteSubtitle) {
    D.scadCompleteSubtitle.textContent = 'Vuoi segnare "' + (it.titolo || 'questa scadenza') + '" come completata?';
  }
  if (D.scadCompleteNota) D.scadCompleteNota.value = '';
  openModal('modalScadenzaComplete');
  setTimeout(() => { if (D.scadCompleteNota) D.scadCompleteNota.focus(); }, 80);
}

async function saveScadenzaComplete() {
  const id = S.editScadenzaId;
  if (id == null) { closeModal('modalScadenzaComplete'); return; }
  const it = (S.scadenze || []).find(x => x.id === id || String(x.id) === String(id));
  if (!it) { closeModal('modalScadenzaComplete'); return; }
  const nota = D.scadCompleteNota ? D.scadCompleteNota.value.trim() : '';
  const autore = getDefaultAutore();
  const completato_at = new Date().toISOString();
  setBtnLoading(D.scadCompleteSave, true);
  try {
    const payload = {
      fatto: true,
      completato_da: autore,
      completato_at,
      nota_completamento: nota || null
    };
    // Update optimistic locale
    const idx = S.scadenze.findIndex(x => x.id === id || String(x.id) === String(id));
    if (idx >= 0) S.scadenze[idx] = Object.assign({}, S.scadenze[idx], payload);
    saveLocalCache();
    _rerenderScadenze();
    // Remoto
    const path = T.SCADENZE + '?id=eq.' + it.id;
    const options = { method: 'PATCH', body: JSON.stringify(payload) };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalScadenzaComplete');
    toast('✓ Completata', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio'), 'error');
  } finally {
    setBtnLoading(D.scadCompleteSave, false);
    S.editScadenzaId = null;
  }
}

async function uncompleteScadenza(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const idx = S.scadenze.findIndex(x => x.id === id || String(x.id) === String(id));
  if (idx < 0) return;
  const it = S.scadenze[idx];
  const payload = { fatto: false, completato_da: null, completato_at: null, nota_completamento: null };
  S.scadenze[idx] = Object.assign({}, it, payload);
  saveLocalCache();
  _rerenderScadenze();
  const path = T.SCADENZE + '?id=eq.' + it.id;
  const options = { method: 'PATCH', body: JSON.stringify(payload) };
  if (isOnline()) {
    try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
  } else {
    enqueue({ path, options });
  }
  toast('Completamento annullato', 'info');
}

// ─── RENDER CALENDARIO ───────────────────────────────────────
function renderScadenzeCal() {
  if (!D.scadCalGrid || !S.scadCalCursor) return;
  const { anno, mese } = S.scadCalCursor;
  if (D.scadCalTitle) D.scadCalTitle.textContent = MESI_FULL[mese - 1] + ' ' + anno;

  // Mappa giorno YYYY-MM-DD → array di scadenze
  const byDay = new Map();
  (S.scadenze || []).forEach(it => {
    // Per ricorrenze, calcola tutte le occorrenze cadenti nel mese visualizzato
    const occurrences = scadOccurrencesInMonth(it, anno, mese);
    occurrences.forEach(d => {
      if (!byDay.has(d)) byDay.set(d, []);
      byDay.get(d).push(it);
    });
  });

  // Costruisci griglia 7×N (Lun = 1)
  const firstDay = new Date(anno, mese - 1, 1);
  const lastDay  = new Date(anno, mese, 0).getDate();
  // Lun=0, Mar=1, ... Dom=6
  let weekDayFirst = firstDay.getDay() - 1;
  if (weekDayFirst < 0) weekDayFirst = 6;
  const today = _todayStr();

  let html = '';
  // Celle vuote prima
  for (let i = 0; i < weekDayFirst; i++) html += '<div class="scad-cal-cell empty"></div>';
  for (let d = 1; d <= lastDay; d++) {
    const ds = anno + '-' + String(mese).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const items = byDay.get(ds) || [];
    const cls = ['scad-cal-cell'];
    if (ds === today) cls.push('today');
    if (S.scadCalSelectedDay === ds) cls.push('selected');
    if (isItalianHoliday(ds)) cls.push('is-festivo');
    if (items.length) {
      // priorità colore: past > today > soon > generic
      let pri = 'has-scad';
      let allFatto = items.every(x => x.fatto);
      if (!allFatto) {
        if (ds < today) pri = 'has-past';
        else if (ds === today) pri = 'has-past'; // oggi = urgentissimo
        else {
          // se almeno una è "soon" rispetto a oggi
          const minDiff = _daysBetween(today, ds);
          if (minDiff <= 7) pri = 'has-soon';
        }
      }
      cls.push(pri);
    }
    // Mostra fino a 3 icone come dot, poi +N. Le scadenze fatte → b/n.
    const dotsHtml = items.slice(0, 3).map(x => {
      const cls = 'day-dot' + (x.fatto ? ' is-fatto' : '');
      return '<span class="' + cls + '">' + (x.icona || '📅') + '</span>';
    }).join('');
    const moreHtml = items.length > 3 ? '<span class="day-more">+' + (items.length - 3) + '</span>' : '';
    html += '<div class="' + cls.join(' ') + '" data-day="' + ds + '">' +
              '<div class="day-num">' + d + '</div>' +
              (items.length ? '<div class="day-dots">' + dotsHtml + moreHtml + '</div>' : '') +
            '</div>';
  }
  D.scadCalGrid.innerHTML = html;
  twemojify(D.scadCalGrid);
  // Bind click cella
  $$('.scad-cal-cell[data-day]', D.scadCalGrid).forEach(c => {
    c.addEventListener('click', () => {
      S.scadCalSelectedDay = c.getAttribute('data-day');
      renderScadenzeCal();
      renderScadCalDayDetails(S.scadCalSelectedDay, byDay.get(S.scadCalSelectedDay) || []);
    });
  });
  // Render details del giorno selezionato (o oggi se nessuno)
  const selectedDay = S.scadCalSelectedDay || today;
  renderScadCalDayDetails(selectedDay, byDay.get(selectedDay) || []);
}

// Restituisce le date 'YYYY-MM-DD' del mese in cui la scadenza ricorre
function scadOccurrencesInMonth(scad, anno, mese) {
  if (!scad || !scad.data) return [];
  const [oy, om, od] = scad.data.split('-').map(Number);
  const origin = new Date(oy, om - 1, od);
  const monthFirst = new Date(anno, mese - 1, 1);
  const monthLastDay = new Date(anno, mese, 0).getDate();
  const monthLast = new Date(anno, mese - 1, monthLastDay);
  if (scad.ricorrenza === 'no' || !scad.ricorrenza) {
    return (oy === anno && om === mese) ? [scad.data] : [];
  }
  if (scad.ricorrenza === 'giornaliera' || scad.ricorrenza === 'settimanale') {
    const stepDays = (scad.ricorrenza === 'giornaliera') ? 1 : 7;
    if (monthLast < origin) return [];
    // Trova la prima occorrenza >= max(origin, monthFirst)
    let start = origin > monthFirst ? new Date(origin) : new Date(monthFirst);
    // Allinea alla griglia: se monthFirst > origin, calcola quanti giorni dall'origine
    if (start.getTime() === monthFirst.getTime() && monthFirst > origin) {
      const diff = Math.round((monthFirst - origin) / 86400000);
      const offset = diff % stepDays;
      if (offset !== 0) start.setDate(start.getDate() + (stepDays - offset));
    }
    const out = [];
    while (start <= monthLast) {
      out.push(start.getFullYear() + '-' + String(start.getMonth()+1).padStart(2,'0') + '-' + String(start.getDate()).padStart(2,'0'));
      start.setDate(start.getDate() + stepDays);
    }
    return out;
  }
  if (scad.ricorrenza === 'mensile') {
    // Tutti i mesi dalla data originale in poi (e prima se data > mese cursore non includere)
    if (anno < oy || (anno === oy && mese < om)) return [];
    const lastDay = new Date(anno, mese, 0).getDate();
    const useDay = Math.min(od, lastDay);
    return [anno + '-' + String(mese).padStart(2,'0') + '-' + String(useDay).padStart(2,'0')];
  }
  if (scad.ricorrenza === 'annuale') {
    if (mese !== om) return [];
    if (anno < oy) return [];
    const lastDay = new Date(anno, mese, 0).getDate();
    const useDay = Math.min(od, lastDay);
    return [anno + '-' + String(mese).padStart(2,'0') + '-' + String(useDay).padStart(2,'0')];
  }
  return [];
}

function renderScadCalDayDetails(day, items) {
  if (!D.scadCalDayList || !D.scadCalDayTitle) return;
  D.scadCalDayTitle.textContent = fmtScadDataShort(day);
  if (!items.length) {
    D.scadCalDayList.innerHTML = '<div class="scad-cal-day-list-empty">Nessuna scadenza in questo giorno</div>';
    return;
  }
  // Inietta _nextDate per il render
  items.forEach(it => { it._nextDate = day; });
  D.scadCalDayList.innerHTML = items.map(scadItemHtml).join('');
  twemojify(D.scadCalDayList);
  bindScadenzeItems(D.scadCalDayList);
}

function shiftScadCalMonth(delta) {
  if (!S.scadCalCursor) {
    const t = new Date();
    S.scadCalCursor = { anno: t.getFullYear(), mese: t.getMonth() + 1 };
  }
  let { anno, mese } = S.scadCalCursor;
  mese += delta;
  while (mese < 1) { mese += 12; anno -= 1; }
  while (mese > 12) { mese -= 12; anno += 1; }
  S.scadCalCursor = { anno, mese };
  S.scadCalSelectedDay = null;
  renderScadenzeCal();
}

// ─── MODAL Nuovo/Modifica Scadenza ───────────────────────────
let _scadenzaEditState = { icone: ['📅'], iconaManual: false, anticipo: 7, ricorrenza: 'no' };

function openScadenzaAdd() {
  S.editScadenzaId = null;
  _scadenzaEditState = { icone: ['📅'], iconaManual: false, anticipo: 7, ricorrenza: 'no' };
  if (D.scadenzaEditTitle)  D.scadenzaEditTitle.textContent = 'Nuova Scadenza';
  if (D.scadenzaEditTitolo) D.scadenzaEditTitolo.value = '';
  if (D.scadenzaEditData)   D.scadenzaEditData.value = '';
  if (D.scadenzaEditNote)   D.scadenzaEditNote.value = '';
  updateScadenzaEditIcons(['📅']);
  updateScadenzaAnticipoChips(7);
  updateScadenzaRicorrenzaChips('no');
  if (D.scadenzaEditDelete) D.scadenzaEditDelete.style.display = 'none';
  openModal('modalScadenza');
  setTimeout(() => { if (D.scadenzaEditTitolo) D.scadenzaEditTitolo.focus(); }, 80);
}

function openScadenzaEdit(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const it = (S.scadenze || []).find(x => x.id === id || String(x.id) === String(id));
  if (!it) return;
  S.editScadenzaId = it.id;
  _scadenzaEditState = {
    icone: [it.icona || '📅'],
    iconaManual: true,
    anticipo: (it.anticipo_giorni != null) ? it.anticipo_giorni : 7,
    ricorrenza: it.ricorrenza || 'no'
  };
  if (D.scadenzaEditTitle)  D.scadenzaEditTitle.textContent = 'Modifica Scadenza';
  if (D.scadenzaEditTitolo) D.scadenzaEditTitolo.value = it.titolo || '';
  if (D.scadenzaEditData)   D.scadenzaEditData.value = it.data || '';
  if (D.scadenzaEditNote)   D.scadenzaEditNote.value = it.note || '';
  updateScadenzaEditIcons(_scadenzaEditState.icone);
  updateScadenzaAnticipoChips(_scadenzaEditState.anticipo);
  updateScadenzaRicorrenzaChips(_scadenzaEditState.ricorrenza);
  if (D.scadenzaEditDelete) D.scadenzaEditDelete.style.display = 'block';
  openModal('modalScadenza');
}

function updateScadenzaEditIcons(icone) {
  if (!Array.isArray(icone) || !icone.length) icone = ['📅'];
  _scadenzaEditState.icone = icone.slice(0, 5);
  if (D.scadenzaEditIconBtn) {
    D.scadenzaEditIconBtn.innerHTML = _scadenzaEditState.icone[0];
    twemojify(D.scadenzaEditIconBtn);
  }
  document.querySelectorAll('.spesa-icon-side[data-scadenza-slot]').forEach(el => {
    const slot = Number(el.getAttribute('data-scadenza-slot'));
    const ic = _scadenzaEditState.icone[slot];
    if (ic) { el.hidden = false; el.innerHTML = ic; twemojify(el); }
    else    { el.hidden = true;  el.innerHTML = ''; }
  });
}

function updateScadenzaEditIcon(icon) {
  if (!icon) icon = '📅';
  const arr = _scadenzaEditState.icone.slice();
  const existing = arr.indexOf(icon, 1);
  if (existing > 0) arr.splice(existing, 1);
  arr[0] = icon;
  updateScadenzaEditIcons(arr);
}

function onScadenzaEditTitoloInput() {
  const t = D.scadenzaEditTitolo ? D.scadenzaEditTitolo.value : '';
  if (t.trim().length < SPESA_MIN_QUERY_LEN) return;
  const suggestions = scadenzaIconSuggestions(t, 5);
  const currentIcon = _scadenzaEditState.icone && _scadenzaEditState.icone[0];
  const stillRelevant = suggestions.indexOf(currentIcon) !== -1;
  if (_scadenzaEditState.iconaManual && stillRelevant) {
    const lateral = suggestions.filter(e => e !== currentIcon).slice(0, 4);
    updateScadenzaEditIcons([currentIcon].concat(lateral));
  } else {
    _scadenzaEditState.iconaManual = false;
    updateScadenzaEditIcons(suggestions);
  }
}

function swapScadenzaIcon(slot) {
  const arr = _scadenzaEditState.icone.slice();
  if (!arr[slot]) return;
  const tmp = arr[0]; arr[0] = arr[slot]; arr[slot] = tmp;
  _scadenzaEditState.iconaManual = true;
  updateScadenzaEditIcons(arr);
}

function updateScadenzaAnticipoChips(value) {
  _scadenzaEditState.anticipo = Number(value);
  if (!D.scadenzaAnticipoChips) return;
  $$('.anticipo-chip', D.scadenzaAnticipoChips).forEach(c => {
    c.classList.toggle('active', Number(c.getAttribute('data-anticipo')) === Number(value));
  });
}

function updateScadenzaRicorrenzaChips(value) {
  _scadenzaEditState.ricorrenza = value;
  if (!D.scadenzaRicorrenzaChips) return;
  $$('.anticipo-chip', D.scadenzaRicorrenzaChips).forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-ric') === value);
  });
}

async function saveScadenzaEdit() {
  const titolo = D.scadenzaEditTitolo ? D.scadenzaEditTitolo.value.trim() : '';
  const data   = D.scadenzaEditData ? D.scadenzaEditData.value : '';
  if (!titolo) { toast('Inserisci il titolo', 'warn'); return; }
  if (!data)   { toast('Inserisci la data', 'warn'); return; }
  const icona = (_scadenzaEditState.icone && _scadenzaEditState.icone[0]) || scadenzaIconForName(titolo);
  const anticipo_giorni = Number(_scadenzaEditState.anticipo) || 0;
  const ricorrenza = _scadenzaEditState.ricorrenza || 'no';
  const note = D.scadenzaEditNote ? D.scadenzaEditNote.value.trim() : '';
  setBtnLoading(D.scadenzaEditSave, true);
  try {
    if (S.editScadenzaId == null) {
      const maxOrd = (S.scadenze || []).reduce((m, x) => Math.max(m, x.ordine || 0), 0);
      const payload = { titolo, icona, data, anticipo_giorni, ricorrenza, note: note || null, ordine: maxOrd + 1, fatto: false };
      const tmpId = uuid();
      const row = Object.assign({ id: tmpId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, payload);
      S.scadenze.push(row);
      saveLocalCache();
      _rerenderScadenze();
      const path = T.SCADENZE + '?select=*';
      const options = { method: 'POST', body: JSON.stringify(payload), headers: { 'Prefer': 'return=representation' } };
      if (isOnline()) {
        try {
          const res = await supaFetch(path, options);
          if (res && res[0]) {
            const idx = S.scadenze.findIndex(x => x.id === tmpId);
            if (idx >= 0) S.scadenze[idx] = res[0];
            saveLocalCache();
            _rerenderScadenze();
          }
        } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalScadenza');
      toast('Scadenza aggiunta', 'success');
    } else {
      const idx = S.scadenze.findIndex(x => x.id === S.editScadenzaId);
      const payload = { titolo, icona, data, anticipo_giorni, ricorrenza, note: note || null };
      if (idx >= 0) S.scadenze[idx] = Object.assign({}, S.scadenze[idx], payload);
      saveLocalCache();
      _rerenderScadenze();
      const path = T.SCADENZE + '?id=eq.' + S.editScadenzaId;
      const options = { method: 'PATCH', body: JSON.stringify(payload) };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
      closeModal('modalScadenza');
      toast('Scadenza modificata', 'success');
    }
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.scadenzaEditSave, false);
    S.editScadenzaId = null;
  }
}

async function deleteScadenzaEdit() {
  if (S.editScadenzaId == null) return;
  const ok = await confirmDlg({
    title: 'Elimina scadenza',
    message: 'Vuoi davvero eliminare questa scadenza? L\'azione non è reversibile.',
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  setBtnLoading(D.scadenzaEditDelete, true);
  try {
    const id = S.editScadenzaId;
    S.scadenze = S.scadenze.filter(x => x.id !== id);
    saveLocalCache();
    _rerenderScadenze();
    const path = T.SCADENZE + '?id=eq.' + id;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeModal('modalScadenza');
    toast('Scadenza eliminata', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'eliminazione non riuscita'), 'error');
  } finally {
    setBtnLoading(D.scadenzaEditDelete, false);
    S.editScadenzaId = null;
  }
}

// Helper: re-render la view corretta (lista o calendario) + home widget
function _rerenderScadenze() {
  try {
    if (S.currentView === 'scadenze-list') renderScadenzeList();
    else if (S.currentView === 'scadenze-cal') renderScadenzeCal();
  } catch {}
  try { renderHomeGestione(); } catch {}
}

// ─── Pulizia scadenze ───────────────────────────────────────
function confirmClearScadenze() {
  if (!S.scadenze.length) { toast('Nessuna scadenza da pulire', 'info'); return; }
  openModal('modalClearScadenze');
}

async function clearScadenzeScope(scope) {
  const all = S.scadenze || [];
  const today = _todayStr();
  let items, msg;
  if (scope === 'passed') {
    items = all.filter(x => x.ricorrenza === 'no' && (x._nextDate || x.data) < today);
    if (!items.length) { closeModal('modalClearScadenze'); toast('Niente scadenze passate', 'info'); return; }
    msg = 'Eliminare le ' + items.length + ' scadenze passate (non ricorrenti)? L\'azione non è reversibile.';
  } else if (scope === 'done') {
    items = all.filter(x => x.fatto);
    if (!items.length) { closeModal('modalClearScadenze'); toast('Niente scadenze fatte', 'info'); return; }
    msg = 'Eliminare le ' + items.length + ' scadenze "fatte"? L\'azione non è reversibile.';
  } else {
    items = all.slice();
    msg = 'Eliminare TUTTE le ' + items.length + ' scadenze? L\'azione non è reversibile.';
  }
  closeModal('modalClearScadenze');
  const ok = await confirmDlg({
    title: 'Conferma eliminazione',
    message: msg,
    confirmLabel: 'Elimina',
    danger: true
  });
  if (!ok) return;
  try {
    const ids = items.map(x => x.id).filter(id => typeof id === 'number');
    const toKeep = new Set(all.filter(x => !items.includes(x)).map(x => x.id));
    S.scadenze = all.filter(x => toKeep.has(x.id));
    saveLocalCache();
    _rerenderScadenze();
    if (ids.length) {
      const path = T.SCADENZE + '?id=in.(' + ids.join(',') + ')';
      const options = { method: 'DELETE' };
      if (isOnline()) {
        try { await supaFetch(path, options); } catch { enqueue({ path, options }); }
      } else {
        enqueue({ path, options });
      }
    }
    toast('Scadenze eliminate', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'pulizia fallita'), 'error');
  }
}

// ─── Realtime Scadenze ──────────────────────────────────────
function onScadenzaChange(p) {
  const ev = p.eventType;
  if (ev === 'INSERT') {
    if (!S.scadenze.find(x => x.id === p.new.id)) S.scadenze.push(p.new);
  } else if (ev === 'UPDATE') {
    const idx = S.scadenze.findIndex(x => x.id === p.new.id);
    if (idx >= 0) S.scadenze[idx] = p.new;
    else S.scadenze.push(p.new);
  } else if (ev === 'DELETE') {
    S.scadenze = S.scadenze.filter(x => x.id !== p.old.id);
  }
  saveLocalCache();
  _rerenderScadenze();
}

async function refreshScadenzeNow() {
  try {
    const rows = await supaFetch(T.SCADENZE + '?select=*&order=data.asc,id.asc');
    if (rows) {
      S.scadenze = rows;
      saveLocalCache();
      _rerenderScadenze();
    }
  } catch (e) { /* offline o errore: niente */ }
}

// ─── HOME (DASHBOARD) ───────────────────────────────────────
// Filtra "in comune": esclude tx personali. Tutte le view del modulo
// Conti (saldo, donut, trend, lista, autori, budget) lavorano sui soli
// "in comune". Le personali vivono nella sub-view dedicata.
function txComune() {
  return S.tx.filter(t => !t.personale);
}
function txInCurrentMonth() {
  const { anno, mese } = S.currentMonth;
  return txComune().filter(t => inMonth(t.data, anno, mese));
}

// Invalida cache aggregate (donut autori, trend mesi, saldo cumulativo)
// per forzare ricalcolo al prossimo render. Da chiamare DOPO ogni
// mutazione di S.tx (insert/update/delete via UI o Realtime) così che
// statistiche e grafici riflettano immediatamente le novità.
//
// Nota: queste cache usano S.ts nella chiave ma S.ts viene bumpato solo
// dal server tramite trigger; per le mutazioni ottimistiche locali (e per
// gli eventi Realtime che arrivano prima del fetch di S.ts) dobbiamo
// invalidare esplicitamente.
function invalidateTxCharts() {
  S.trend3mCache = null;
  S.autoreDonutCache = null;
  S.trendCache = null;
}

// ─────────────────────────────────────────────────────────────
// MODELLO CONTI CONDIVISI (scatolo + equità 50/50)
// ─────────────────────────────────────────────────────────────
function shortName(n) { return (n || '').trim().split(/\s+/)[0] || (n || ''); }
function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Solo i movimenti del NUOVO modello hanno una `fonte` valorizzata: così le
// vecchie transazioni di test restano nello storico ma non sporcano l'equità.
function isNuovoModello(t) { return !!t.fonte; }

function parseQuota(q, A) { return CDCEquity.parseQuota(q, A); }

// Calcola lo stato dello scatolo + l'equità (modello a SOMMA ZERO).
//   box        = contanti nello scatolo (versamenti − spese da scatolo − prelievi)
//   contrib[n] = quanto n ha messo di tasca propria (versamenti + spese da conto/buoni − prelievi)
//   over[n]    = saldo personale: >0 in credito (ha messo più della sua metà),
//                <0 in debito. Garantito Σ over[n] = 0 → mai entrambi in credito.
// Principio: ogni euro che n mette di tasca propria (versamento nello scatolo
// o spesa pagata dal suo conto/buoni) è un contributo comune 50/50 → l'altro
// gliene deve metà. Le spese pagate DALLO SCATOLO sono neutre (denaro comune).
// Motore contabile in equity.js (testato con node --test). Qui solo il wiring
// coi dati dell'app: transazioni, lista autori, anno solare corrente.
function computeEquity() {
  return CDCEquity.computeEquity(S.tx || [], getAutoriList(), new Date().getFullYear());
}

// Dato lo stato di equità (2 persone) calcola chi deve dare quanto a chi.
// NOTA MATEMATICA: prelevare dallo scatolo NON compensa 1:1 il creditore
// (lo scatolo è fondo comune al 50%: prelevare P lo compensa solo di P/2,
// perché metà di quel denaro era già suo). L'unico pareggio esatto è il
// trasferimento DIRETTO debitore→creditore dell'intero `owed` — volendo anche
// via scatolo: il debitore mette `owed` e il creditore ritira `owed`
// (fondo invariato, saldi a zero).
function equitySettlement(eq) {
  return CDCEquity.equitySettlement(eq);
}

// Carica TUTTO lo storico transazioni (serve all'equità cumulativa).
// ⚠ PostgREST tronca ogni risposta a max 1000 righe: senza paginazione, oltre
// le 1000 transazioni il saldo scatolo verrebbe amputato in silenzio.
async function ensureAllTxLoaded() {
  if (S.allTxLoaded) return;
  try {
    const PAGE = 1000;
    let offset = 0, complete = false;
    const fetched = [];
    for (let guard = 0; guard < 50; guard++) {   // hard cap 50k righe
      const rows = await supaFetch(T.TX + '?select=*&order=data.desc,id.desc&limit=' + PAGE + '&offset=' + offset);
      if (!Array.isArray(rows)) return;          // risposta anomala: non marcare loaded
      fetched.push(...rows);
      if (rows.length < PAGE) { complete = true; break; }
      offset += PAGE;
    }
    if (!complete) return;
    const ids = new Set(S.tx.map(t => t.id));
    fetched.forEach(r => { if (!ids.has(r.id)) S.tx.push(r); });
    S.allTxLoaded = true;
    saveLocalCache();
  } catch (e) { /* offline: usa la cache disponibile */ }
}

// Spese comuni "valide" (nuovo modello, non personali).
function commonSpese() { return CDCEquity.commonSpese(S.tx || []); }

// Mesi coperti dalla competenza (in equity.js, testato). Se manca → mese pagamento.
function spesaCompMonths(t) { return CDCEquity.spesaCompMonths(t); }

// Media mensile delle spese comuni dell'ANNO IN CORSO (competenza-spread,
// straordinarie escluse). È una media "in divenire": si ferma al MESE CORRENTE
// (i mesi futuri NON contano, né al numeratore né al denominatore — altrimenti
// le quote di competenza di spese annuali diluirebbero la media su mesi non
// ancora avvenuti). Denominatore = mesi trascorsi dal primo mese con spese fino
// a oggi. Sorgente unica condivisa tra dashboard (riquadro "Media mensile") e
// vista Statistiche (linea media).
function mediaComuniAnnoInfo() {
  const now = new Date();
  return CDCEquity.mediaComuniAnnoInfo(S.tx || [], now.getFullYear(), now.getMonth() + 1);
}

function renderConti() {
  if (!D.cdScatolo) return; // DOM non pronto
  const A = getAutoriList();
  const eq = computeEquity();
  const s = equitySettlement(eq);

  // ── SCATOLO ──
  D.cdScatolo.textContent = (eq.box < -0.005 ? '−' : '') + fmtEur(Math.abs(eq.box));
  D.cdScatolo.className = 'cd-scatolo-num' + (eq.box < -0.005 ? ' neg' : '');

  // ── EQUITÀ (anno solare) ──
  if (D.cdEquityLbl) D.cdEquityLbl.textContent = 'Equilibrio spese comuni · ' + eq.year;
  if (D.cdEquityPersons) {
    D.cdEquityPersons.innerHTML = A.map(n => {
      const o = round2(eq.over[n] || 0);
      const cls = o > 0.005 ? 'pos' : (o < -0.005 ? 'neg' : 'zero');
      const txt = Math.abs(o) < 0.005 ? 'in pari' : (o > 0 ? 'in credito' : 'in debito');
      const amt = Math.abs(o) < 0.005 ? '—' : (o > 0 ? '+' : '−') + fmtEur(Math.abs(o));
      return '<div class="cd-person"><span class="cd-person-name">' + esc(shortName(n)) + '</span>' +
        '<span class="cd-person-val ' + cls + '">' + amt + ' <small>' + txt + '</small></span></div>';
    }).join('');
  }
  let mainTxt = '', instrTxt = '', showBtn = false;
  if (s.state === 'pari') {
    mainTxt = '✅ Siete in pari';
    instrTxt = eq.box > 0.005 ? 'Nello scatolo ci sono ' + fmtEur(eq.box) + ' di fondo comune.' : 'Nessuno deve niente all\'altro.';
  } else if (s.state === 'sbilanciato') {
    mainTxt = shortName(s.creditor) + ' ha anticipato ' + fmtEur(s.owed) + ' in più';
    instrTxt = 'Per pareggiare: ' + shortName(s.debtor) + ' dà ' + fmtEur(s.owed) + ' a ' + shortName(s.creditor) +
      '. Quando è fatto, premi «Registra il riequilibrio».';
    showBtn = true;
  } else {
    mainTxt = '—';
    instrTxt = 'Aggiungi movimenti per vedere l\'equilibrio.';
  }
  if (D.cdEquityMain) D.cdEquityMain.textContent = mainTxt;
  if (D.cdEquityInstr) D.cdEquityInstr.textContent = instrTxt;
  if (D.cdSettleBtn) D.cdSettleBtn.hidden = !showBtn;
  // Sentinella "autore fantasma": movimenti con autore fuori whitelist non
  // entrano nell'equità → avvisa (raro, ma altrimenti silenzioso).
  const _unk = Object.keys(eq.unknownAutori || {});
  if (D.cdEquityPersons && _unk.length) {
    D.cdEquityPersons.insertAdjacentHTML('afterbegin',
      '<div class="cd-warn">⚠️ ' + _unk.length + (_unk.length === 1 ? ' movimento ha' : ' movimenti hanno') +
      ' un autore non in lista (' + _unk.map(esc).join(', ') + '): esclusi dall\'equilibrio. Correggili o aggiungi l\'utente nelle Impostazioni.</div>');
    twemojify(D.cdEquityPersons);
  }

  // ── MEDIE SPESE COMUNI (spalmate sul periodo di competenza) ──
  // Sempre il mese/anno reale di oggi (il Riepilogo non ha più selettore mese).
  const _now = new Date();
  const cm = { anno: _now.getFullYear(), mese: _now.getMonth() + 1 };
  // Mappa mese→importo: ogni spesa comune (non straordinaria) viene divisa
  // sui mesi del suo periodo di competenza (es. TARI semestrale = 1/6 al mese).
  const mi = mediaComuniAnnoInfo();
  const monthSum = mi.allocM[cm.mese] || 0;          // competenza del mese corrente
  // Flusso cassa: contante uscito per spese comuni nel mese corrente, contato
  // per DATA di pagamento (senza spalmare la competenza) — la "cifra grezza".
  const cashFlow = commonSpese()
    .filter(t => inMonth(t.data, cm.anno, cm.mese))
    .reduce((s, t) => s + (Number(t.importo) || 0), 0);
  if (D.cdCashFlow) D.cdCashFlow.textContent = fmtEur(cashFlow);
  if (D.cdCashFlowK) D.cdCashFlowK.textContent = (MESI_FULL[cm.mese - 1] || '') + ' ' + cm.anno;
  if (D.cdAvgMonth) D.cdAvgMonth.textContent = fmtEur(monthSum);
  if (D.cdAvgMonthK) D.cdAvgMonthK.textContent = (MESI_FULL[cm.mese - 1] || '') + ' ' + cm.anno;
  if (D.cdAvgMean) D.cdAvgMean.textContent = fmtEur(mi.media);
  if (D.cdAvgMeanSub) {
    // Intervallo coperto nell'anno in corso (dal primo all'ultimo mese con spese)
    const fM = mi.firstM || cm.mese, lM = mi.lastM || cm.mese;
    const endDay = new Date(cm.anno, lM, 0).getDate();
    const ms = m => (MESI_SHORT[m - 1] || '').toLowerCase();
    const rangeLbl = '1 ' + ms(fM) + ' - ' + endDay + ' ' + ms(lM) + ' ' + cm.anno;
    D.cdAvgMeanSub.innerHTML = 'anno in corso<br><span class="cd-avg-range">(' + rangeLbl + ')</span>';
  }
  if (D.cdAvgNote) D.cdAvgNote.innerHTML = '<b>Spese per questo mese</b> e <b>Media</b>: spalmate per competenza, <b>straordinarie escluse</b>. <b>Flusso cassa</b>: tutto il contante uscito nel mese, <b>incluse le straordinarie</b>.';

  // ── ULTIME OPERAZIONI ──
  if (D.cdRecent) {
    const recent = (S.tx || []).filter(t => isNuovoModello(t) && !t.personale)
      .slice().sort((x, y) => {
        if (x.data !== y.data) return x.data < y.data ? 1 : -1;
        const cx = x.created_at || '', cy = y.created_at || '';
        return cx < cy ? 1 : (cx > cy ? -1 : 0);
      }).slice(0, 8);
    if (!recent.length) {
      D.cdRecent.innerHTML = '<div class="txt-faint" style="font-size:13px;padding:8px 0">Ancora nessuna operazione. Premi <b>+</b> per iniziare.</div>';
    } else {
      D.cdRecent.innerHTML = recent.map(txRowHtml).join('');
      bindTxRows(D.cdRecent);
      twemojify(D.cdRecent);
    }
  }
}

// Registra il riequilibrio: il debitore dà l'intero `owed` al creditore.
// Viene annotato come coppia di movimenti "Riequilibrio conti" (versamento del
// debitore + prelievo del creditore, STESSO importo): lo scatolo resta
// invariato (+X e −X), i saldi di equità tornano a zero (credit ±X/2 ±X/2 = X),
// i contributi dell'anno si pareggiano, e NULLA entra in spese/medie/flusso di
// cassa (è un trasferimento tra persone, non un costo della casa).
const RIEQ_DESC = 'Riequilibrio conti';

async function registerRiequilibrio() {
  const eq = computeEquity();
  const s = equitySettlement(eq);
  if (!s || s.state !== 'sbilanciato') { toast('Siete già in pari', 'info'); return; }
  const msg = shortName(s.debtor) + ' deve dare ' + fmtEur(s.owed) + ' a ' + shortName(s.creditor) + ' per tornare in pari.\n\n' +
    'Potete farlo a mano o con bonifico — oppure via scatolo: ' + shortName(s.debtor) + ' mette ' + fmtEur(s.owed) +
    ' e ' + shortName(s.creditor) + ' li ritira (il fondo resta uguale).\n\n' +
    'Premi «Fatto, registra» quando lo avete fatto: verranno annotati due movimenti «Riequilibrio conti», esclusi dalle spese di casa.';
  const ok = await confirmDlg({ title: '⚖️ Registra il riequilibrio', message: msg, confirmLabel: 'Fatto, registra', cancelLabel: 'Annulla' });
  if (!ok) return;
  const d = today();
  const note = 'Riequilibrio: ' + shortName(s.debtor) + ' → ' + shortName(s.creditor) + ' ' + fmtEur(s.owed);
  try {
    await saveTransaction(boxPayload('versamento', s.debtor, s.owed, d, RIEQ_DESC, note));
    await saveTransaction(boxPayload('prelievo',  s.creditor, s.owed, d, RIEQ_DESC, note));
    toast('Riequilibrio registrato: siete in pari', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'non riuscito'), 'error');
  }
}

function boxPayload(mov, autore, importo, data, desc, note) {
  return {
    tipo_movimento: mov,
    tipo: mov === 'versamento' ? 'entrata' : 'uscita',
    importo: round2(importo),
    categoria_id: null,
    descrizione: desc || null,
    note: note || null,
    data: data || today(),
    autore: autore || null,
    fonte: 'scatolo',
    personale: false,
    straordinaria: false,
    quota: null,
    competenza_da: null, competenza_a: null, competenza_tipo: null
  };
}

// ---- Riallineamento fondi scatolo ----------------------------------------
// Corregge il saldo dello scatolo (es. ho speso contanti ma non l'ho segnato,
// oppure ho ricontato i contanti). NON tocca MAI l'equità tra le persone
// (autore=null → credit() no-op). Cambia solo il saldo box.
//  • Togli + "Conta come spesa di casa" = SÌ → spesa fonte=scatolo (box−, entra
//    nelle medie spese comuni, equità neutra).
//  • Togli + conta = NO → prelievo autore=null (box−, fuori dalle medie, equità
//    neutra) — pura correzione di conteggio.
//  • Aggiungi → versamento autore=null (box+, fuori dalle medie, equità neutra).
const RIAL_DESC = 'Riallineamento fondi scatolo';

async function openRiallineo() {
  setRialDir('togli');
  if (D.rialAmt) D.rialAmt.value = '';
  if (D.rialConta) D.rialConta.checked = true;
  if (D.rialNote) D.rialNote.value = '';
  if (D.rialBalance) D.rialBalance.textContent = '…';
  openModal('modalRiallineo');
  setTimeout(() => { try { D.rialAmt.focus(); } catch (e) {} }, 120);
  // Il saldo scatolo è cumulativo su tutti gli anni → servono tutte le tx
  try { await ensureAllTxLoaded(); } catch (e) {}
  const eq = computeEquity();
  if (D.rialBalance) D.rialBalance.textContent = fmtEur(eq.box || 0);
}

function setRialDir(dir) {
  const seg = D.rialDir;
  if (!seg) return;
  seg.dataset.val = dir;
  seg.querySelectorAll('button[data-val]').forEach(b => b.classList.toggle('active', b.dataset.val === dir));
  // La domanda "conta come spesa" ha senso solo quando si TOLGONO soldi
  const isTogli = dir === 'togli';
  if (D.rialContaRow) D.rialContaRow.style.display = isTogli ? '' : 'none';
  if (D.rialHint) D.rialHint.style.display = isTogli ? '' : 'none';
}

async function saveRiallineo() {
  const dir = (D.rialDir && D.rialDir.dataset.val) || 'togli';
  const imp = round2(parseAmount(D.rialAmt.value) || 0);
  if (!imp || imp <= 0) { toast('Inserisci un importo valido', 'warn'); return; }
  const note = (D.rialNote.value || '').trim() || null;
  const eq = computeEquity();
  const box = eq.box || 0;
  if (dir === 'togli' && imp > box + 0.001) {
    if (!confirm('Nello scatolo ci sono ' + fmtEur(box) + '. Vuoi comunque togliere ' + fmtEur(imp) + '? Il saldo diventerà negativo.')) return;
  }

  let payload;
  if (dir === 'aggiungi') {
    // versamento neutro (nessun autore → niente equità, fuori dalle medie)
    payload = boxPayload('versamento', null, imp, today(), RIAL_DESC, note);
  } else if (D.rialConta && D.rialConta.checked) {
    // spesa pagata dallo scatolo (entra nelle medie, equità neutra)
    payload = {
      tipo_movimento: 'spesa', tipo: 'uscita', importo: imp,
      categoria_id: null, descrizione: RIAL_DESC, note,
      data: today(), autore: null, fonte: 'scatolo',
      personale: false, straordinaria: false, quota: null,
      competenza_da: null, competenza_a: null, competenza_tipo: null
    };
  } else {
    // prelievo neutro (solo correzione di conteggio)
    payload = boxPayload('prelievo', null, imp, today(), RIAL_DESC, note);
  }

  setBtnLoading(D.rialSave, true);
  try {
    await saveTransaction(payload);
    closeModal('modalRiallineo');
    toast('Scatolo riallineato', 'success');
  } catch (e) {
    console.error('riallineo', e);
    toast('Errore nel salvataggio', 'error');
  } finally {
    setBtnLoading(D.rialSave, false);
  }
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
// Default: ANNO CORRENTE (1 gennaio anno corrente → oggi).
// Es. oggi 27 maggio 2026 → 2026-01-01 ↔ 2026-05-27.
function ensureTrendRangeDefault() {
  if (S.trendRange && S.trendRange.from && S.trendRange.to) return;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const pad = n => String(n).padStart(2, '0');
  S.trendRange = {
    from: y + '-01-01',
    to:   y + '-' + pad(m) + '-' + pad(d)
  };
}

function monthKeyYM(y, m) { return y + '-' + String(m).padStart(2, '0'); }

function syncTrendDateInputs() {
  if (!S.trendRange) ensureTrendRangeDefault();
  const f = S.trendRange.from, t = S.trendRange.to;
  if (D.categFrom)  { D.categFrom.value  = f; D.categFrom.defaultValue  = f; }
  if (D.categTo)    { D.categTo.value    = t; D.categTo.defaultValue    = t; }
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
            // Slide "Andamento mesi": vai alla lista con periodo = range
            // del trend selezionato nei date picker (S.trendRange ora è
            // {from:'YYYY-MM-DD', to:'YYYY-MM-DD'} → uso direttamente)
            S.donutFilter = { type: 'macro', value: macroId };
            S.listFilter = 'uscita';
            S.filtersCats = [];
            S.filtersAutori = [];
            const tr = S.trendRange;
            if (tr && tr.from && tr.to) {
              S.listPeriod = 'custom';
              S.listFrom = tr.from;
              S.listTo   = tr.to;
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
  // Helper: setta from o to (string YYYY-MM-DD) + sincronizza TUTTI i
  // 3 set di date picker (categFrom/To + trendFrom/To + autoreFrom/To)
  // + invalida cache + ri-renderizza tutte le 3 slide del carousel.
  function setTrendFrom(value) {
    if (!value) return;
    S.trendRange.from = value;
    S.trend3mCache = null;
    S.autoreDonutCache = null;
    syncTrendDateInputs();
    renderConti();        // re-render slide 0 (donut categoria su nuovo range)
    renderHomeGestione(); // aggiorna anche il "periodo" accanto al titolo del widget Home
  }
  function setTrendTo(value) {
    if (!value) return;
    S.trendRange.to = value;
    S.trend3mCache = null;
    S.autoreDonutCache = null;
    syncTrendDateInputs();
    renderConti();
    renderHomeGestione();
  }
  if (D.categFrom)  D.categFrom.addEventListener('change',  () => setTrendFrom(D.categFrom.value));
  if (D.categTo)    D.categTo.addEventListener('change',    () => setTrendTo(D.categTo.value));
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
  // Widget Conti di Casa: TOTALE delle spese comuni sostenute per la casa
  // nell'ANNO IN CORSO (solo spese in comune del nuovo modello; niente
  // versamenti/prelievi, niente personali).
  const annoCorrente = new Date().getFullYear();
  const annoStart = annoCorrente + '-01-01';
  const annoEnd   = annoCorrente + '-12-31';
  const speseAnno = commonSpese().filter(t => t.data >= annoStart && t.data <= annoEnd);
  const totaleCasa = speseAnno.reduce((s, t) => s + Number(t.importo), 0);

  if (D.homeContiSaldo) {
    D.homeContiSaldo.textContent = fmtEur(totaleCasa);
    D.homeContiSaldo.className = 'mc-saldo'; // totale spese: neutro (né + né −)
  }
  if (D.homeContiSubtle) {
    D.homeContiSubtle.textContent = 'spese casa ' + annoCorrente;
  }
  if (D.homeContiPeriod) {
    D.homeContiPeriod.textContent = String(annoCorrente);
  }

  // Mini donut: quanto ha messo ciascun utente verso la casa nell'anno in corso
  // = contributi (anticipi nello scatolo + pagamenti dal proprio conto/buoni,
  // al netto dei prelievi). Lo scatolo è un anticipo, quindi chi lo alimenta
  // compare anche se non ha pagato direttamente. No testo, no legenda.
  if (D.homeContiDonut) {
    const eq = computeEquity();
    const segs = (eq.A || [])
      .map(nome => ({ label: shortName(nome), value: Math.max(0, round2(eq.contrib[nome] || 0)), color: colorForAutore(nome) }))
      .filter(s => s.value > 0.005)
      .sort((a, b) => b.value - a.value);
    if (segs.length) {
      Charts.renderDonut(D.homeContiDonut, segs, { noText: true, noLegend: true });
    } else {
      D.homeContiDonut.innerHTML = '<div style="width:100px;height:100px;display:grid;place-items:center;color:var(--text-faint);font-size:11px;text-align:center">Nessuna<br>spesa</div>';
    }
  }
  // Il totale annuale richiede tutto lo storico: caricalo una volta e ri-renderizza.
  if (!S.allTxLoaded) ensureAllTxLoaded().then(() => { if (S.allTxLoaded) renderHomeGestione(); });

  // Widget Lista della Spesa: primi 6 elementi "da prendere" in grid
  // (CSS auto-fit: 3 colonne quando ci stanno, altrimenti 2 o 1). Il
  // numero effettivamente visibile dipende dalla larghezza schermo.
  if (D.homeSpesaPreview) {
    const items = (S.spesa || []).slice().sort((a, b) => (a.ordine || 0) - (b.ordine || 0));
    const toBuy = items.filter(x => !x.preso);
    const PREVIEW_MAX = 6;
    const preview = toBuy.slice(0, PREVIEW_MAX);
    if (D.homeSpesaCount) {
      D.homeSpesaCount.textContent = toBuy.length ? (toBuy.length + ' da prendere') : 'lista vuota';
    }
    if (!toBuy.length) {
      D.homeSpesaPreview.innerHTML = '<div class="mc-spesa-empty">Nessun elemento da prendere</div>';
    } else {
      let html = preview.map(it => {
        const qty = (it.quantita && it.quantita > 1) ? '<span class="mc-spesa-row-qty">×' + it.quantita + '</span>' : '';
        return '<div class="mc-spesa-row">' +
                 '<span class="mc-spesa-row-icon">' + (it.icona || '🛒') + '</span>' +
                 '<span class="mc-spesa-row-text">' +
                   '<span class="mc-spesa-row-name">' + esc(it.nome || '') + '</span>' +
                   qty +
                 '</span>' +
               '</div>';
      }).join('');
      if (toBuy.length > PREVIEW_MAX) {
        html += '<div class="mc-spesa-more">+ ' + (toBuy.length - PREVIEW_MAX) + ' altri</div>';
      }
      D.homeSpesaPreview.innerHTML = html;
    }
    twemojify(D.homeSpesaPreview);
  }

  // Widget ToDo: primi 6 elementi "da fare" in grid (stessa logica della Spesa)
  // Mostriamo solo i non-fatti per riflettere ciò che resta da fare.
  if (D.homeTodoPreview) {
    const items = (S.todo || []).slice().sort((a, b) => {
      // Ordine: prima per scadenza ASC (i più urgenti in cima), poi per ordine, poi per id
      const sa = a.scadenza || '9999-12-31';
      const sb = b.scadenza || '9999-12-31';
      if (sa !== sb) return sa < sb ? -1 : 1;
      return (a.ordine || 0) - (b.ordine || 0);
    });
    const toDo = items.filter(x => !x.fatto);
    const PREVIEW_MAX = 6;
    const preview = toDo.slice(0, PREVIEW_MAX);
    if (D.homeTodoCount) {
      D.homeTodoCount.textContent = toDo.length ? (toDo.length + ' da fare') : 'lavagna vuota';
    }
    if (!toDo.length) {
      D.homeTodoPreview.innerHTML = '<div class="mc-spesa-empty">Niente da fare</div>';
    } else {
      const todayStr = (() => {
        const t = new Date();
        return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
      })();
      let html = preview.map(it => {
        const urg = (it.scadenza && it.scadenza <= todayStr) ? ' urgent' : '';
        // formato compatto DD/MM per home widget
        let scaTxt = '';
        if (it.scadenza) {
          const [, m, d] = it.scadenza.split('-');
          scaTxt = d + '/' + m;
        }
        const sca = scaTxt ? '<span class="mc-spesa-row-qty' + urg + '">' + scaTxt + '</span>' : '';
        return '<div class="mc-spesa-row">' +
                 '<span class="mc-spesa-row-icon">' + (it.icona || '📝') + '</span>' +
                 '<span class="mc-spesa-row-text">' +
                   '<span class="mc-spesa-row-name">' + esc(it.nome || '') + '</span>' +
                   sca +
                 '</span>' +
               '</div>';
      }).join('');
      if (toDo.length > PREVIEW_MAX) {
        html += '<div class="mc-spesa-more">+ ' + (toDo.length - PREVIEW_MAX) + ' altri</div>';
      }
      D.homeTodoPreview.innerHTML = html;
    }
    twemojify(D.homeTodoPreview);
  }

  // Widget Scadenze a 3 sezioni:
  // 1) SALTATE/NON COMPLETATE entro la data  → badge rosso pastello + ⚠️
  // 2) Oltre data REMINDER (entro anticipo) ma non ancora a today  → badge giallo + 🔔
  // 3) Prossime 4 normali (oltre il reminder, future)
  if (D.homeScadenzePreview) {
    const today = _todayStr();
    const allActive = (S.scadenze || []).map(it => {
      const nextDate = nextOccurrence(it);
      return Object.assign({}, it, { _nextDate: nextDate });
    }).filter(it => {
      // Escludi una tantum già completate
      if (it.fatto && (it.ricorrenza === 'no' || !it.ricorrenza)) return false;
      return !!it._nextDate;
    });

    // 1) Saltate: data passata e NON completata (per ricorrenti = appena scaduta, per una tantum non-fatto e nextDate<today)
    const saltate = allActive.filter(it => {
      const d = _daysBetween(today, it._nextDate);
      return d < 0 && !it.fatto;
    }).sort((a, b) => (a._nextDate < b._nextDate ? -1 : 1));

    // 2) Reminder superato: dentro anticipo_giorni (compreso oggi) e non passata
    const reminderItems = allActive.filter(it => {
      if (it.fatto) return false;
      const d = _daysBetween(today, it._nextDate);
      const ant = (it.anticipo_giorni != null) ? it.anticipo_giorni : 7;
      return d >= 0 && d <= ant;
    }).sort((a, b) => (a._nextDate < b._nextDate ? -1 : 1));

    // 3) Prossime future (oltre anticipo)
    const prossime = allActive.filter(it => {
      if (it.fatto) return false;
      const d = _daysBetween(today, it._nextDate);
      const ant = (it.anticipo_giorni != null) ? it.anticipo_giorni : 7;
      return d > ant;
    }).sort((a, b) => (a._nextDate < b._nextDate ? -1 : 1));

    // Conteggio totale in alto (oltre alle saltate + reminder)
    if (D.homeScadenzeCount) {
      const tot = saltate.length + reminderItems.length;
      D.homeScadenzeCount.textContent = tot
        ? (tot + (tot === 1 ? ' urgente' : ' urgenti'))
        : 'tutto sotto controllo';
    }

    const rowHtml = it => {
      const [, m, d] = (it._nextDate || it.data).split('-');
      const status = scadStatus(it);
      let pillCls = '';
      if (status === 'past')       pillCls = ' past';
      else if (status === 'today') pillCls = ' today';
      else if (status === 'soon')  pillCls = ' soon';
      const pill = '<span class="mc-scad-date-pill' + pillCls + '">' + Number(d) + '/' + Number(m) + '</span>';
      return '<div class="mc-spesa-row">' +
               '<span class="mc-spesa-row-icon">' + (it.icona || '📅') + '</span>' +
               '<span class="mc-spesa-row-text">' +
                 pill +
                 '<span class="mc-spesa-row-name">' + esc(it.titolo || '') + '</span>' +
               '</span>' +
             '</div>';
    };

    let html = '';

    // Sez 1: OLTRE IL PROMEMORIA = data passata, in ritardo (badge rosso + ⚠️)
    if (saltate.length) {
      html += '<div class="mc-scad-section alert">';
      html += '<div class="mc-scad-section-title"><span class="sec-icon">⚠️</span><span>Oltre il promemoria</span><span class="sec-count">' + saltate.length + '</span></div>';
      html += saltate.slice(0, 4).map(rowHtml).join('');
      if (saltate.length > 4) html += '<div class="mc-spesa-more">+ ' + (saltate.length - 4) + ' altre</div>';
      html += '</div>';
    }

    // Sez 2: IN SCADENZA = entro l'anticipo (badge giallo + 🔔)
    if (reminderItems.length) {
      html += '<div class="mc-scad-section warn">';
      html += '<div class="mc-scad-section-title"><span class="sec-icon">🔔</span><span>In scadenza</span><span class="sec-count">' + reminderItems.length + '</span></div>';
      html += reminderItems.slice(0, 4).map(rowHtml).join('');
      if (reminderItems.length > 4) html += '<div class="mc-spesa-more">+ ' + (reminderItems.length - 4) + ' altre</div>';
      html += '</div>';
    }

    // Sez 3: PROSSIME 4 (elenco normale)
    if (prossime.length) {
      html += prossime.slice(0, 4).map(rowHtml).join('');
      if (prossime.length > 4) html += '<div class="mc-spesa-more">+ ' + (prossime.length - 4) + ' altre prossime</div>';
    }

    if (!html) {
      html = '<div class="mc-spesa-empty">Nessuna scadenza</div>';
    }
    D.homeScadenzePreview.innerHTML = html;
    twemojify(D.homeScadenzePreview);
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
  const arr = txComune().filter(t => inMonth(t.data, anno, mese));
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
  const tComune = txComune();
  const curArr  = tComune.filter(t => inMonth(t.data, anno, mese));
  const prevArr = tComune.filter(t => inMonth(t.data, prevY, prevM));

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
  txComune().filter(t => t.tipo === 'uscita').forEach(t => {
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

function fonteShort(fonte, autore) {
  if (fonte === 'scatolo') return '📦 scatolo';
  if (fonte === 'conto')   return '💳 ' + shortName(autore || '');
  if (fonte === 'buoni')   return '🍽 ' + shortName(autore || '');
  return '';
}
// Etichetta compatta del periodo di competenza (es. "1 mar → 30 apr 2026").
function compRangeLabel(da, a) {
  if (!da || !a) return '';
  const [y1, m1, d1] = da.split('-').map(Number);
  const [y2, m2, d2] = a.split('-').map(Number);
  const left = d1 + ' ' + (MESI_SHORT[m1 - 1] || '') + (y1 !== y2 ? ' ' + y1 : '');
  const right = d2 + ' ' + (MESI_SHORT[m2 - 1] || '') + ' ' + y2;
  return left + ' → ' + right;
}
function txRowHtml(t) {
  const mov = t.tipo_movimento || 'spesa';
  const pendingCls = S.pendingTxIds.has(t.id) ? ' pending' : '';
  const amtCls = t.tipo === 'entrata' ? 'in' : 'out';
  const amtHtml = '<div class="tx-amt ' + amtCls + '">' + (t.tipo === 'entrata' ? '+' : '−') + fmtEur(Number(t.importo)) + '</div>';
  if (mov === 'versamento' || mov === 'prelievo') {
    const isVers = mov === 'versamento';
    const isRieq = String(t.descrizione || '').startsWith('Riequilibrio');
    const icon = isRieq ? '⚖️' : (isVers ? '📥' : '📤');
    const color = isRieq ? '#f59e0b' : (isVers ? '#22c55e' : '#ef4444');
    const name = isRieq ? ('Riequilibrio conti · ' + (isVers ? 'dà' : 'riceve')) : (isVers ? 'Versamento scatolo' : 'Prelievo scatolo');
    const meta = [fmtData(t.data), isRieq ? '' : (t.descrizione || ''), t.autore ? '👤 ' + t.autore : ''].filter(Boolean).join(' • ');
    const noteLine = t.note ? '<div class="tx-note">' + esc(t.note) + '</div>' : '';
    return '<div class="tx-row' + pendingCls + '" data-tx-id="' + t.id + '">' +
      '<div class="tx-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="tx-body"><div class="tx-cat">' + esc(name) + '</div><div class="tx-meta">' + esc(meta) + '</div>' + noteLine + '</div>' +
      amtHtml + '</div>';
  }
  // spesa
  const c = catById(t.categoria_id);
  const icon = c ? c.icona : (t.fonte === 'scatolo' && t.descrizione ? '⚖️' : '📦');
  const color = c ? c.colore : '#94a3b8';
  const name = c ? c.nome : (t.descrizione || 'Altro');
  const macro = c && c.macro_categoria ? macroById(c.macro_categoria) : null;
  const macroPrefix = macro ? '<span class="tx-macro">' + macro.icon + ' ' + macroLabel(c.macro_categoria) + '</span> › ' : '';
  const meta = ['Pagato il ' + fmtData(t.data), t.fonte ? fonteShort(t.fonte, t.autore) : (t.autore ? '👤 ' + t.autore : ''),
    t.personale ? '👤 personale' : '', t.straordinaria ? '✨ straord.' : ''].filter(Boolean).join(' • ');
  const compLine = (t.competenza_da && t.competenza_a)
    ? '<div class="tx-comp">🗓 ' + esc(compRangeLabel(t.competenza_da, t.competenza_a)) + '</div>' : '';
  const noteLine = t.note ? '<div class="tx-note">' + esc(t.note) + '</div>' : '';
  return '<div class="tx-row' + pendingCls + '" data-tx-id="' + t.id + '">' +
    '<div class="tx-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
    '<div class="tx-body">' +
      '<div class="tx-cat">' + macroPrefix + esc(name) + '</div>' +
      '<div class="tx-meta">' + esc(meta) + '</div>' + compLine + noteLine +
    '</div>' + amtHtml +
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

// ─── Scelte rapide periodo (Ultimo anno / 6m / 3m / Questo mese) ──
// Applica un preset di range alle date Da/A e renderizza la lista.
function applyListQuickPeriod(q) {
  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const todayStr = y + '-' + pad(m) + '-' + pad(d);
  let from, to;
  if (q === 'month') {
    // "Questo mese": 1° → ultimo giorno del mese corrente
    const lastDay = new Date(y, m, 0).getDate();
    from = y + '-' + pad(m) + '-01';
    to   = y + '-' + pad(m) + '-' + pad(lastDay);
  } else if (q === '1y') {
    // "Questo Anno": 1 gennaio → 31 dicembre dell'anno corrente (anno solare intero)
    from = y + '-01-01';
    to   = y + '-12-31';
  } else {
    // "Ultimi 6/3 mesi": oggi - N mesi → oggi
    const months = q === '6m' ? 6 : 3;
    const start = new Date(now);
    start.setMonth(start.getMonth() - months);
    from = start.getFullYear() + '-' + pad(start.getMonth() + 1) + '-' + pad(start.getDate());
    to   = todayStr;
  }
  S.listPeriod = 'custom';
  S.listFrom = from;
  S.listTo   = to;
  if (D.listPeriodFrom) D.listPeriodFrom.value = from;
  if (D.listPeriodTo)   D.listPeriodTo.value   = to;
  refreshListQuickActive();
  renderList();
}

// Evidenzia il pulsante rapido che corrisponde all'attuale range Da/A.
function refreshListQuickActive() {
  const all = $$('.lpq-btn');
  if (!all.length) return;
  const matchKey = _detectQuickPeriodKey(S.listFrom, S.listTo);
  all.forEach(b => b.classList.toggle('active', b.getAttribute('data-quick') === matchKey));
}

function _detectQuickPeriodKey(from, to) {
  if (!from || !to) return null;
  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const todayStr = y + '-' + pad(m) + '-' + pad(now.getDate());
  // "month" = mese corrente full (1°-ultimo giorno)
  if (from === y + '-' + pad(m) + '-01' && to === y + '-' + pad(m) + '-' + pad(lastDay)) return 'month';
  // "1y" = Questo Anno: 1 gennaio → 31 dicembre anno corrente
  if (from === y + '-01-01' && to === y + '-12-31') return '1y';
  // "6m" / "3m" = today - N mesi → today (paragono entrambe le date)
  if (to !== todayStr) return null;
  for (const [k, n] of [['6m', 6], ['3m', 3]]) {
    const start = new Date(now);
    start.setMonth(start.getMonth() - n);
    const startStr = start.getFullYear() + '-' + pad(start.getMonth() + 1) + '-' + pad(start.getDate());
    if (from === startStr) return k;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
// TRANSAZIONI v2 — ricerca + filtri periodo/categoria + paginazione
// Stato in S.tx2. Mostra SOLO transazioni "in comune" (txComune).
// ══════════════════════════════════════════════════════════════
function _tx2State() {
  if (!S.tx2) S.tx2 = { search: '', from: null, to: null, quick: null, cats: [], autori: [], scatoloOnly: false, perPage: 20, page: 1 };
  if (!S.tx2.autori) S.tx2.autori = [];
  return S.tx2;
}

// Calcola range {from,to} per i preset rapidi (basati su OGGI reale)
function tx2QuickRange(key) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const pad = n => String(n).padStart(2, '0');
  const lastDay = (yy, mm) => new Date(yy, mm, 0).getDate();
  const monthsAgo = (months) => { let yy = y, mm = m - months; while (mm < 1) { mm += 12; yy--; } return { yy, mm }; };
  if (key === 'month')     return { from: y + '-' + pad(m) + '-01', to: y + '-' + pad(m) + '-' + pad(lastDay(y, m)) };
  if (key === 'lastmonth') { let yy = y, mm = m - 1; if (mm < 1) { mm = 12; yy--; } return { from: yy + '-' + pad(mm) + '-01', to: yy + '-' + pad(mm) + '-' + pad(lastDay(yy, mm)) }; }
  if (key === '3m')        { const s = monthsAgo(2); return { from: s.yy + '-' + pad(s.mm) + '-01', to: y + '-' + pad(m) + '-' + pad(lastDay(y, m)) }; }
  if (key === '6m')        { const s = monthsAgo(5); return { from: s.yy + '-' + pad(s.mm) + '-01', to: y + '-' + pad(m) + '-' + pad(lastDay(y, m)) }; }
  if (key === 'year')      return { from: y + '-01-01', to: y + '-12-31' };
  return { from: null, to: null };
}

function tx2Filtered() {
  const st = _tx2State();
  let arr = txComune();
  if (st.from) arr = arr.filter(t => t.data >= st.from);
  if (st.to)   arr = arr.filter(t => t.data <= st.to);
  if (st.cats.length) {
    const set = new Set(st.cats);
    const inclAltro = set.has(0);
    arr = arr.filter(t => (t.categoria_id == null) ? inclAltro : set.has(t.categoria_id));
  }
  if (st.autori && st.autori.length) {
    const aset = new Set(st.autori);
    arr = arr.filter(t => t.autore && aset.has(t.autore));
  }
  if (st.scatoloOnly) {
    arr = arr.filter(t => t.fonte === 'scatolo');   // versamenti, prelievi e spese pagate dallo scatolo
  }
  const q = (st.search || '').toLowerCase().trim();
  if (q) {
    arr = arr.filter(t => {
      const c = catById(t.categoria_id);
      const hay = [
        t.descrizione || '',
        c ? c.nome : 'Altro',
        c && c.macro_categoria ? macroLabel(c.macro_categoria) : '',
        t.autore || '',
        String(t.importo).replace('.', ','),
        fmtData(t.data),
        t.tipo
      ].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }
  // più recente prima (per data, poi created_at)
  arr = arr.slice().sort((a, b) => {
    if (a.data !== b.data) return a.data < b.data ? 1 : -1;
    const ca = a.created_at || '', cb = b.created_at || '';
    return ca < cb ? 1 : (ca > cb ? -1 : 0);
  });
  return arr;
}

const TX2_QUICK_LABELS = { month: 'Questo mese', lastmonth: 'Mese scorso', '3m': 'Ultimi 3 mesi', '6m': 'Ultimi 6 mesi', year: "Quest'anno" };

function tx2FilterCount() {
  const st = _tx2State();
  let n = 0;
  if (st.quick || st.from || st.to) n++;
  n += st.cats.length;
  n += (st.autori ? st.autori.length : 0);
  if (st.scatoloOnly) n++;
  return n;
}

function tx2SyncToolbar() {
  const st = _tx2State();
  if (D.tx2Search && document.activeElement !== D.tx2Search) D.tx2Search.value = st.search;
  if (D.tx2SearchClear) D.tx2SearchClear.hidden = !st.search;
  if (D.tx2From) D.tx2From.value = st.from || '';
  if (D.tx2To)   D.tx2To.value   = st.to   || '';
  if (D.tx2Quick) $$('button', D.tx2Quick).forEach(b => b.classList.toggle('active', b.getAttribute('data-q') === st.quick));
  if (D.tx2ScatoloChip) D.tx2ScatoloChip.classList.toggle('active', !!st.scatoloOnly);
  // Bottone "Riallinea fondi scatolo": visibile solo nel filtro movimenti scatolo
  if (D.tx2RiallineaBtn) D.tx2RiallineaBtn.hidden = !st.scatoloOnly;
  // badge sul bottone filtri
  if (D.tx2FiltBadge) {
    const n = tx2FilterCount();
    D.tx2FiltBadge.hidden = n === 0;
    D.tx2FiltBadge.textContent = String(n);
  }
  renderTx2Active();
}

// Badge dei filtri attivi (chip removibili) sopra la lista
function renderTx2Active() {
  if (!D.tx2ActiveBar) return;
  const st = _tx2State();
  const chips = [];
  if (st.quick) chips.push({ type: 'period', label: '📅 ' + (TX2_QUICK_LABELS[st.quick] || 'Periodo') });
  else if (st.from && st.to) chips.push({ type: 'period', label: '📅 ' + fmtData(st.from) + ' – ' + fmtData(st.to) });
  else if (st.from) chips.push({ type: 'period', label: '📅 dal ' + fmtData(st.from) });
  else if (st.to)   chips.push({ type: 'period', label: '📅 fino al ' + fmtData(st.to) });
  st.cats.forEach(id => {
    let l;
    if (id === 0) l = '📦 Altro';
    else { const c = catById(id); l = c ? ((c.icona ? c.icona + ' ' : '') + c.nome) : '?'; }
    chips.push({ type: 'cat', id, label: l });
  });
  (st.autori || []).forEach(name => chips.push({ type: 'autore', name, label: '👤 ' + shortName(name) }));
  if (st.scatoloOnly) chips.push({ type: 'scatolo', label: '📦 Movimenti scatolo' });
  if (!chips.length) { D.tx2ActiveBar.hidden = true; D.tx2ActiveBar.innerHTML = ''; return; }
  D.tx2ActiveBar.hidden = false;
  D.tx2ActiveBar.innerHTML = chips.map(ch =>
    '<span class="tx2-abadge" data-type="' + ch.type + '"' +
      (ch.id != null ? ' data-id="' + ch.id + '"' : '') +
      (ch.name != null ? ' data-name="' + esc(ch.name) + '"' : '') + '>' +
      esc(ch.label) + '<b class="tx2-abadge-x">✕</b></span>'
  ).join('') + '<button type="button" class="tx2-aclear" id="tx2ClearAll">Azzera tutto</button>';
  twemojify(D.tx2ActiveBar);
  $$('.tx2-abadge', D.tx2ActiveBar).forEach(b => {
    const x = b.querySelector('.tx2-abadge-x');
    if (!x) return;
    x.addEventListener('click', () => {
      const type = b.getAttribute('data-type');
      if (type === 'period') { st.quick = null; st.from = null; st.to = null; }
      else if (type === 'autore') { const n = b.getAttribute('data-name'); const i = st.autori.indexOf(n); if (i >= 0) st.autori.splice(i, 1); }
      else if (type === 'scatolo') { st.scatoloOnly = false; }
      else { const id = Number(b.getAttribute('data-id')); const i = st.cats.indexOf(id); if (i >= 0) st.cats.splice(i, 1); }
      st.page = 1;
      renderList();
    });
  });
  const ca = $('#tx2ClearAll', D.tx2ActiveBar);
  if (ca) ca.addEventListener('click', () => {
    st.quick = null; st.from = null; st.to = null; st.cats = []; st.autori = []; st.scatoloOnly = false; st.search = ''; st.page = 1;
    if (D.tx2Search) D.tx2Search.value = '';
    renderList();
  });
}

function renderTx2CatChips() {
  if (!D.tx2CatFilter) return;
  const st = _tx2State();
  const sortCats = (a, b) => {
    const ma = a.macro_categoria || 'zzz', mb = b.macro_categoria || 'zzz';
    if (ma !== mb) return ma.localeCompare(mb);
    return (a.ordine || 0) - (b.ordine || 0);
  };
  const usc = S.cats.filter(c => c.tipo === 'uscita').sort(sortCats);
  const ent = S.cats.filter(c => c.tipo === 'entrata').sort(sortCats);
  const chip = c => '<button type="button" class="tx2-cat-chip' + (st.cats.indexOf(c.id) !== -1 ? ' active' : '') + '" data-cat-id="' + c.id + '">' +
    (c.icona ? c.icona + ' ' : '') + esc(c.nome) + '</button>';
  let html = '';
  if (usc.length) html += '<div class="tx2-cat-sub">Uscite</div><div class="tx2-cat-row">' + usc.map(chip).join('') + '</div>';
  if (ent.length) html += '<div class="tx2-cat-sub">Entrate</div><div class="tx2-cat-row">' + ent.map(chip).join('') + '</div>';
  html += '<div class="tx2-cat-sub">Senza categoria</div><div class="tx2-cat-row"><button type="button" class="tx2-cat-chip' + (st.cats.indexOf(0) !== -1 ? ' active' : '') + '" data-cat-id="0">📦 Altro</button></div>';
  D.tx2CatFilter.innerHTML = html;
  twemojify(D.tx2CatFilter);
  $$('.tx2-cat-chip', D.tx2CatFilter).forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.getAttribute('data-cat-id'));
      const i = st.cats.indexOf(id);
      if (i >= 0) st.cats.splice(i, 1); else st.cats.push(id);
      st.page = 1;
      el.classList.toggle('active');
      tx2SyncToolbar();
      drawTx2();
    });
  });
}

function renderTx2AutoreChips() {
  if (!D.tx2AutoreFilter) return;
  const st = _tx2State();
  const A = getAutoriList();
  D.tx2AutoreFilter.innerHTML = A.map(n =>
    '<button type="button" class="tx2-cat-chip' + (st.autori.indexOf(n) !== -1 ? ' active' : '') + '" data-autore="' + esc(n) + '">👤 ' + esc(shortName(n)) + '</button>'
  ).join('');
  twemojify(D.tx2AutoreFilter);
  $$('.tx2-cat-chip', D.tx2AutoreFilter).forEach(el => {
    el.addEventListener('click', () => {
      const n = el.getAttribute('data-autore');
      const i = st.autori.indexOf(n);
      if (i >= 0) st.autori.splice(i, 1); else st.autori.push(n);
      st.page = 1;
      el.classList.toggle('active');
      tx2SyncToolbar();
      drawTx2();
    });
  });
}

function renderList() {
  if (!D.tx2List) return;          // pagina non montata
  renderHeader();
  const st = _tx2State();
  renderTx2CatChips();
  renderTx2AutoreChips();
  tx2SyncToolbar();
  // Garantisce che i dati ci siano: carica il range attivo, oppure di
  // default l'ANNO CORRENTE (così la lista non è mai vuota per cache stale).
  const now = new Date();
  const defFrom = now.getFullYear() + '-01-01';
  const defTo   = now.getFullYear() + '-12-31';
  ensurePeriodLoaded(st.from || defFrom, st.to || defTo).then(drawTx2);
  drawTx2();
}

// Grafico delle USCITE del set filtrato (Transazioni / Dettagli): bucket per
// giorno se il periodo è breve (≤ ~75 gg), altrimenti per mese.
function renderTx2Chart(all) {
  if (!D.tx2Chart || !window.Charts) return;
  // Solo SPESE vere: prelievi/versamenti scatolo (incl. riequilibri) sono
  // movimenti di cassa, non costi → fuori dal grafico "Uscite".
  const usc = (all || []).filter(t => (t.tipo_movimento || 'spesa') === 'spesa' && t.tipo === 'uscita');
  if (usc.length < 2) { D.tx2Chart.hidden = true; D.tx2Chart.innerHTML = ''; return; }
  const dates = usc.map(t => String(t.data)).sort();
  const start = new Date(dates[0] + 'T00:00:00');
  const end = new Date(dates[dates.length - 1] + 'T00:00:00');
  const spanDays = Math.round((end - start) / 86400000);
  let labels, points, ptLabels;
  if (spanDays <= 75) {
    // giornaliero dal primo all'ultimo giorno
    const buckets = []; const cur = new Date(start);
    while (cur <= end) { buckets.push(cur.getFullYear() + '-' + String(cur.getMonth() + 1).padStart(2, '0') + '-' + String(cur.getDate()).padStart(2, '0')); cur.setDate(cur.getDate() + 1); }
    const sum = {}; usc.forEach(t => { sum[t.data] = (sum[t.data] || 0) + Number(t.importo); });
    points = buckets.map(d => sum[d] || 0);
    labels = buckets.map(d => String(Number(d.slice(8, 10))));
    ptLabels = buckets.map(d => Number(d.slice(8, 10)) + ' ' + (MESI_SHORT[Number(d.slice(5, 7)) - 1] || '').toLowerCase());
  } else {
    // mensile
    const buckets = []; const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) { buckets.push({ y: cur.getFullYear(), m: cur.getMonth() + 1 }); cur.setMonth(cur.getMonth() + 1); }
    const sum = {}; usc.forEach(t => { const k = t.data.slice(0, 7); sum[k] = (sum[k] || 0) + Number(t.importo); });
    points = buckets.map(b => sum[b.y + '-' + String(b.m).padStart(2, '0')] || 0);
    labels = buckets.map(b => (MESI_SHORT[b.m - 1] || '') + (b.m === 1 ? " '" + String(b.y).slice(2) : ''));
    ptLabels = buckets.map(b => (MESI_FULL[b.m - 1] || '') + ' ' + b.y);
  }
  D.tx2Chart.hidden = false;
  Charts.renderLine(D.tx2Chart, [{ label: 'Uscite', color: 'var(--danger)', points }], labels, {
    yTicks: 4, spanLine: true, pointTooltip: true, pointLabels: ptLabels
  });
}

function drawTx2() {
  if (!D.tx2List) return;
  const st = _tx2State();
  const all = tx2Filtered();

  // Grafico delle uscite filtrate (sopra la lista)
  renderTx2Chart(all);

  // Riepilogo
  if (D.tx2Summary) {
    const inSum  = all.filter(t => t.tipo === 'entrata').reduce((s, t) => s + Number(t.importo), 0);
    const outSum = all.filter(t => t.tipo === 'uscita').reduce((s, t) => s + Number(t.importo), 0);
    D.tx2Summary.innerHTML = all.length + (all.length === 1 ? ' transazione' : ' transazioni') +
      ' · <span class="pos">+' + fmtEur(inSum) + '</span> · <span class="neg">−' + fmtEur(outSum) + '</span>';
  }

  // Paginazione
  const pp = st.perPage;
  const pages = Math.max(1, Math.ceil(all.length / pp));
  if (st.page > pages) st.page = pages;
  if (st.page < 1) st.page = 1;
  const startIdx = (st.page - 1) * pp;
  const pageItems = all.slice(startIdx, startIdx + pp);

  if (!all.length) {
    D.tx2List.innerHTML = '<div class="empty"><div class="emoji">📭</div><div>Nessuna transazione</div></div>';
  } else {
    let html = '', lastDate = null;
    pageItems.forEach(t => {
      if (t.data !== lastDate) { html += '<div class="tx-day-header">' + fmtDataLong(t.data) + '</div>'; lastDate = t.data; }
      html += txRowHtml(t);
    });
    D.tx2List.innerHTML = html;
    bindTxRows(D.tx2List);
    twemojify(D.tx2List);
  }

  // Pager controls
  if (D.tx2PageInfo) D.tx2PageInfo.textContent = st.page + ' / ' + pages;
  if (D.tx2Prev) D.tx2Prev.disabled = st.page <= 1;
  if (D.tx2Next) D.tx2Next.disabled = st.page >= pages;
  if (D.tx2PerPage) $$('button', D.tx2PerPage).forEach(b => b.classList.toggle('active', Number(b.getAttribute('data-pp')) === pp));
}

// Applica/toggla un preset rapido di periodo
function tx2ApplyQuick(key) {
  const st = _tx2State();
  if (st.quick === key) { st.quick = null; st.from = null; st.to = null; }
  else { const r = tx2QuickRange(key); st.quick = key; st.from = r.from; st.to = r.to; }
  st.page = 1;
  tx2SyncToolbar();
  if (st.from && st.to) ensurePeriodLoaded(st.from, st.to).then(drawTx2);
  drawTx2();
}

// Modifica manuale delle date → annulla il preset
function tx2OnDateChange() {
  const st = _tx2State();
  st.from = (D.tx2From && D.tx2From.value) || null;
  st.to   = (D.tx2To && D.tx2To.value) || null;
  st.quick = null;
  st.page = 1;
  tx2SyncToolbar();
  if (st.from && st.to) ensurePeriodLoaded(st.from, st.to).then(drawTx2);
  drawTx2();
}

// ─── Grafico Andamento sopra la lista transazioni ─────────────
// SOLO punti corrispondenti a tx reali (sparse buckets): se non c'è
// nessuna transazione in un mese/giorno, quel punto NON viene
// disegnato — altrimenti la linea si appiattisce a zero distorcendo
// il trend (es. filtro "bollette luce" → solo i mesi di pagamento).
// Aggregazione: giorno se range ≤ 62gg, altrimenti mese.
// Per filtro 'all' mostra entrambe le serie usando l'unione dei
// bucket esistenti; per filtro 'uscita'/'entrata' una sola serie.
function renderTxTrend(arr, range) {
  if (!D.txTrendWrap) return;
  if (!arr.length) {
    D.txTrendWrap.innerHTML = '';
    return;
  }
  const fromD = new Date(range.fromStr + 'T00:00:00');
  const toD   = new Date(range.toStr   + 'T00:00:00');
  const days  = Math.round((toD - fromD) / 86400000) + 1;
  const mode = days <= 62 ? 'day' : 'month';

  // Costruisci bucket SPARSI: una entry solo dove c'è almeno una tx.
  const bucketsMap = new Map(); // key → { sortKey, label, in, out }
  arr.forEach(t => {
    let key, label;
    if (mode === 'day') {
      key = t.data;            // 'YYYY-MM-DD'
      const [, mm, dd] = t.data.split('-');
      label = days <= 31 ? String(Number(dd)) : (Number(dd) + '/' + Number(mm));
    } else {
      key = t.data.slice(0, 7); // 'YYYY-MM'
      const [yy, mm] = t.data.split('-');
      label = MESI_SHORT[Number(mm) - 1] + (Number(mm) === 1 ? ' \'' + String(yy).slice(-2) : '');
    }
    if (!bucketsMap.has(key)) bucketsMap.set(key, { sortKey: key, label, in: 0, out: 0 });
    const b = bucketsMap.get(key);
    if (t.tipo === 'entrata') b.in  += Number(t.importo);
    else                      b.out += Number(t.importo);
  });

  // Ordinamento cronologico per sortKey (stringa YYYY-MM o YYYY-MM-DD)
  const buckets = Array.from(bucketsMap.values()).sort(
    (a, b) => a.sortKey < b.sortKey ? -1 : (a.sortKey > b.sortKey ? 1 : 0)
  );

  // Serie in base al filtro attivo
  const series = [];
  const showIn  = S.listFilter !== 'uscita';
  const showOut = S.listFilter !== 'entrata';
  if (showIn)  series.push({ label: 'Entrate', color: 'var(--ok)',     points: buckets.map(b => b.in)  });
  if (showOut) series.push({ label: 'Uscite',  color: 'var(--danger)', points: buckets.map(b => b.out) });

  // Se l'unica serie attiva è tutta zero (es. utente filtra uscita ma
  // tutte le tx filtrate sono entrate), nascondi il grafico
  const hasAnyValue = series.some(s => s.points.some(v => v > 0));
  if (!hasAnyValue) {
    D.txTrendWrap.innerHTML = '';
    return;
  }

  // Titolo + counter buckets
  const bucketWord = mode === 'day'
    ? (buckets.length === 1 ? 'giorno con tx' : 'giorni con tx')
    : (buckets.length === 1 ? 'mese con tx'  : 'mesi con tx');
  const title = '<div class="tx-trend-title"><span>📈 Andamento</span><span class="tt-bucket">' + buckets.length + ' ' + bucketWord + '</span></div>';
  const chartDiv = document.createElement('div');
  chartDiv.className = 'tx-trend-chart';
  D.txTrendWrap.innerHTML = title;
  D.txTrendWrap.appendChild(chartDiv);
  Charts.renderLine(chartDiv, series, buckets.map(b => b.label), { yTicks: 4, legend: series.length > 1 });
}

function _drawList(range) {
  // Modulo Conti: SOLO transazioni "in comune", le personali sono escluse
  let arr = txComune().filter(t => t.data >= range.fromStr && t.data <= range.toStr);
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
  // Il sentinel 0 rappresenta "Senza categoria" (categoria_id NULL).
  if (S.filtersCats && S.filtersCats.length) {
    const set = new Set(S.filtersCats);
    const includesAltro = set.has(0);
    arr = arr.filter(t => {
      if (t.categoria_id == null) return includesAltro;
      return set.has(t.categoria_id);
    });
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

  // Grafico andamento sopra l'elenco: mostra entrate/uscite aggregate
  // per giorno (range breve) o mese (range lungo), rispettando filtri
  // e periodo attualmente attivi.
  renderTxTrend(arr, range);

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
  // Badge categorie (id=0 = "Altro" / senza categoria)
  cats.forEach(id => {
    let label;
    if (id === 0) {
      label = '📦 Altro';
    } else {
      const c = catById(id);
      label = c ? ((c.icona ? c.icona + ' ' : '') + c.nome) : ('Cat #' + id);
    }
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

// Stato draft mantenuto per retrocompat ma allineato sempre a S
// (i filtri si applicano LIVE: ogni tap su un chip aggiorna direttamente
// S e ri-renderizza la lista, senza bisogno di premere "Filtra").
let _filtersDraft = null;

function openFiltersModal() {
  // Ri-sincronizza draft = S correnti (mantenuto per coerenza interna)
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
    const selected = (S.filtersCats || []).indexOf(c.id) !== -1;
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
  // Chip speciale "📦 Altro" — categoria_id NULL (sentinel 0)
  const altroSelected = (S.filtersCats || []).indexOf(0) !== -1;
  html += '<div class="filter-subtitle">Senza categoria</div>';
  html += '<div class="filter-chips-row"><button type="button" class="filter-chip' + (altroSelected ? ' selected' : '') + '" data-cat-id="0">📦 Altro</button></div>';
  D.filterCats.innerHTML = html;
  twemojify(D.filterCats);
  $$('.filter-chip', D.filterCats).forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.getAttribute('data-cat-id'));
      // Modifica DIRETTAMENTE S e ri-renderizza lista + grafico
      const arr = (S.filtersCats = (S.filtersCats || []).slice());
      const i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(id);
      // Sync draft per coerenza
      _filtersDraft.cats = arr.slice();
      el.classList.toggle('selected');
      renderList(); // aggiorna lista + grafico + badge filtri attivi
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
    const selected = (S.filtersAutori || []).indexOf(nome) !== -1;
    return '<button type="button" class="filter-chip' + (selected ? ' selected' : '') + '" data-autore="' + esc(nome) + '">' +
           esc(nome) + '</button>';
  }).join('');
  D.filterAutori.innerHTML = html;
  $$('.filter-chip', D.filterAutori).forEach(el => {
    el.addEventListener('click', () => {
      const nome = el.getAttribute('data-autore');
      const arr = (S.filtersAutori = (S.filtersAutori || []).slice());
      const i = arr.indexOf(nome);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(nome);
      _filtersDraft.autori = arr.slice();
      el.classList.toggle('selected');
      renderList();
    });
  });
}

// Il bottone "Filtra" ora chiude semplicemente il modal — i filtri sono
// già stati applicati live a ogni chip-tap. Mantenuto per retrocompat.
function applyFiltersFromModal() {
  closeModal('modalFilters');
}

function resetFiltersFromModal() {
  S.filtersCats = [];
  S.filtersAutori = [];
  _filtersDraft = { cats: [], autori: [] };
  renderFiltersModalCats();
  renderFiltersModalAutori();
  renderList(); // applica subito la pulizia
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
// ─── VISTA "STATISTICHE" ───────────────────────────────────
// Ambito (badge in alto): 'anno' = grafico annuale + lista; 'mese' = vista
// mensile (in arrivo). "Anno" è il default.
function setStatsScope(scope) {
  S.statsScope = scope;
  if (D.statsScope) $$('button[data-scope]', D.statsScope).forEach(b => b.classList.toggle('active', b.getAttribute('data-scope') === scope));
  if (D.statsAnno) D.statsAnno.hidden = (scope !== 'anno');
  if (D.statsMese) D.statsMese.hidden = (scope !== 'mese');
  if (scope === 'anno') { renderStats(); }
  else if (scope === 'mese') {
    if (!S.statsMese) { const n = new Date(); S.statsMese = { y: n.getFullYear(), m: n.getMonth() + 1 }; }
    S.statsMeseDay = null;
    renderStatsMese();
  }
}

// Ri-render della vista Statistiche attiva (usato dopo il caricamento dati)
function renderStatsActive() {
  if (S.statsScope === 'mese') renderStatsMese();
  else renderStats();
}

// Vista Statistiche. S.statsView: 'main' (grafico + donut + lista per DATA),
// 'mese' (dettaglio competenza del mese con selettore mese sincronizzato al
// grafico), 'media' (dettaglio competenza dell'anno fino a oggi). I due bottoni
// fanno da toggle: ripremendoli si torna a 'main'.
function renderStats() {
  if (!D.statsChart || !window.Charts) return;
  const yr = new Date().getFullYear();
  const curMonth = new Date().getMonth() + 1;
  const view = S.statsView || 'main';
  if (D.statsSpeseMeseBtn) D.statsSpeseMeseBtn.classList.toggle('active', view === 'mese');
  if (D.statsMediaBtn) D.statsMediaBtn.classList.toggle('active', view === 'media');

  const monthly = new Array(12).fill(0);
  commonSpese().forEach(t => {
    const [y, m] = String(t.data || '').split('-').map(Number);
    if (y === yr && m >= 1 && m <= 12) monthly[m - 1] += Number(t.importo) || 0;
  });
  const tot = monthly.reduce((a, b) => a + b, 0);
  const media = mediaComuniAnnoInfo().media;
  const refLine = media > 0 ? { value: media, color: 'var(--accent)' } : null;
  const legendExtra = media > 0 ? [{ label: 'Media', value: media, color: 'var(--accent)', dash: true }] : [];

  if (D.statsTitle) D.statsTitle.textContent = 'Uscite ' + yr;
  if (D.statsSub) D.statsSub.textContent = 'Totale anno ' + fmtEur(tot) + ' · per data, incl. straordinarie · la linea Media le esclude';
  if (D.statsDetNav) D.statsDetNav.style.display = (view === 'mese') ? '' : 'none';

  const baseOpts = {
    yTicks: 5, allXLabels: true, spanLine: true, pointLabels: MESI_FULL,
    legendTopRight: true, legendValues: true, legendExtra: legendExtra, refLine: refLine
  };
  const line = [{ label: 'Uscite ' + yr, color: 'var(--danger)', points: monthly }];

  if (view === 'mese') {
    if (!S.statsSelMonth) S.statsSelMonth = curMonth;
    const selM = S.statsSelMonth;
    Charts.renderLine(D.statsChart, line, MESI_SHORT, Object.assign({}, baseOpts, {
      markIndex: selM - 1,
      onPick: (i) => { S.statsSelMonth = i + 1; renderStats(); }
    }));
    if (D.statsDetMonthLabel) D.statsDetMonthLabel.textContent = (MESI_FULL[selM - 1] || '') + ' ' + yr;
    if (D.statsDetPrev) D.statsDetPrev.disabled = (selM <= 1);
    if (D.statsDetNext) D.statsDetNext.disabled = (selM >= curMonth);
    statsDonutInto(D.statsContrib, D.statsContribTitle, 'Contribuzione · ' + (MESI_FULL[selM - 1] || '') + ' ' + yr, statsContribSegs(yr, selM));
    renderSpreadListInto(D.statsList, D.statsListTitle, 'mese', yr, selM);
  } else if (view === 'media') {
    Charts.renderLine(D.statsChart, line, MESI_SHORT, baseOpts);
    statsDonutInto(D.statsContrib, D.statsContribTitle, 'Contribuzione · ' + yr, statsContribSegs(yr, null));
    renderSpreadListInto(D.statsList, D.statsListTitle, 'media', yr, curMonth);
  } else {
    Charts.renderLine(D.statsChart, line, MESI_SHORT, Object.assign({}, baseOpts, {
      dropLines: true, pointTooltip: true,
      onSelect: (i) => { S.statsSelMonth = (i == null ? null : i + 1); renderStatsMonth(S.statsSelMonth); }
    }));
    renderStatsMonth(S.statsSelMonth);
  }
}

// Lista "spalmata" (competenza) in pagina. mode 'mese' = quota nel mese (yr,m);
// mode 'media' = quota nell'anno fino a oggi. Righe cliccabili → modifica.
function renderSpreadListInto(listEl, titleEl, mode, yr, m) {
  const cur = new Date().getMonth() + 1;
  const items = [];
  commonSpese().filter(t => !t.straordinaria).forEach(t => {
    const months = spesaCompMonths(t);
    if (!months.length) return;
    let quota = 0;
    if (mode === 'mese') { if (months.some(mm => mm.y === yr && mm.m === m)) quota = (Number(t.importo) || 0) / months.length; }
    else { const cnt = months.filter(mm => mm.y === yr && mm.m >= 1 && mm.m <= cur).length; quota = (Number(t.importo) || 0) / months.length * cnt; }
    if (quota > 0.0001) items.push({ t, quota, n: months.length });
  });
  items.sort((a, b) => b.quota - a.quota);
  const total = items.reduce((s, x) => s + x.quota, 0);
  if (titleEl) {
    if (mode === 'mese') titleEl.textContent = 'Spese di ' + (MESI_FULL[m - 1] || '') + ' ' + yr + (items.length ? ' · ' + fmtEur(total) : '');
    else { const mi = mediaComuniAnnoInfo(); titleEl.innerHTML = 'Media <b>' + fmtEur(mi.media) + '</b> · ' + mi.win + (mi.win === 1 ? ' mese' : ' mesi') + ' (totale ' + fmtEur(total) + ')'; }
  }
  if (!listEl) return;
  if (!items.length) { listEl.innerHTML = '<div class="txt-faint" style="font-size:13px;padding:10px 2px">Nessuna spesa nel periodo.</div>'; return; }
  listEl.innerHTML = items.map(({ t, quota, n }) => {
    const c = catById(t.categoria_id);
    const icon = c ? c.icona : (t.fonte === 'scatolo' && t.descrizione ? '⚖️' : '📦');
    const color = c ? c.colore : '#94a3b8';
    const name = c ? c.nome : (t.descrizione || 'Altro');
    const full = Number(t.importo) || 0;
    const comp = (t.competenza_da && t.competenza_a) ? compRangeLabel(t.competenza_da, t.competenza_a) : ('pagato il ' + fmtData(t.data));
    const meta = (n > 1 ? 'quota di ' + fmtEur(full) + ' · ' + n + ' mesi · ' : '') + '🗓 ' + comp;
    return '<div class="spread-row" data-tx-id="' + t.id + '">' +
      '<div class="tx-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="spread-body"><div class="spread-name">' + esc(name) + '</div>' +
      '<div class="spread-meta">' + esc(meta) + '</div></div>' +
      '<div class="spread-amt">' + fmtEur(quota) + '</div></div>';
  }).join('');
  $$('.spread-row', listEl).forEach(el => el.addEventListener('click', () => openTxEdit(el.getAttribute('data-tx-id'))));
  twemojify(listEl);
}

// Toggle bottoni: ripremendo torna alla vista principale (come "Statistiche").
function toggleStatsView(mode) {
  if (S.statsView === mode) { S.statsView = 'main'; S.statsSelMonth = null; }
  else { S.statsView = mode; if (mode === 'mese' && !S.statsSelMonth) S.statsSelMonth = new Date().getMonth() + 1; }
  renderStats();
}

// Selettore mese della vista 'mese' (anno in corso, gen→mese corrente)
function statsDetShiftMonth(delta) {
  if (S.statsView !== 'mese') return;
  const cur = new Date().getMonth() + 1;
  let m = (S.statsSelMonth || cur) + delta;
  if (m < 1) m = 1; if (m > cur) m = cur;
  S.statsSelMonth = m;
  renderStats();
}

// Elenco spese comuni dell'anno (Anno): month null = tutto l'anno, altrimenti il mese.
function renderStatsList(month) {
  const yr = new Date().getFullYear();
  const rows = commonSpese()
    .filter(t => month ? inMonth(t.data, yr, month) : String(t.data).slice(0, 4) === String(yr))
    .slice()
    .sort((a, b) => (a.data < b.data ? 1 : (a.data > b.data ? -1 : 0)));
  const title = month ? ('Spese di ' + (MESI_FULL[month - 1] || '') + ' ' + yr) : ('Spese ' + yr);
  statsListInto(D.statsList, D.statsListTitle, title, rows);
}

// Contribuzione per utente (anticipi scatolo + pagamenti diretti − prelievi).
// month null = tutto l'anno; day null = tutto il mese.
function contribByAutore(yr, month, day) {
  return CDCEquity.contribByAutore(S.tx || [], getAutoriList(), yr, month, day);
}

// ── Helper condivisi Statistiche (Anno + Mese) ──
// Segmenti contribuzione per il donut.
function statsContribSegs(yr, month, day) {
  const by = contribByAutore(yr, month, day);
  return Object.keys(by)
    .map(n => ({ label: shortName(n), value: Math.max(0, round2(by[n])), color: colorForAutore(n) }))
    .filter(s => s.value > 0.005)
    .sort((a, b) => b.value - a.value);
}
// Disegna il donut contribuzione + legenda custom "Nome €cifra (xx%)".
function statsDonutInto(wrap, titleEl, title, segs) {
  if (titleEl) titleEl.textContent = title;
  if (!wrap || !window.Charts) return;
  if (!segs.length) {
    wrap.innerHTML = '<div class="txt-faint" style="font-size:13px;padding:8px 2px">Nessuna contribuzione nel periodo.</div>';
    return;
  }
  Charts.renderDonut(wrap, segs, { noLegend: true, subLabel: 'contribuito' });
  const total = segs.reduce((s, x) => s + x.value, 0);
  const leg = document.createElement('div');
  leg.className = 'donut-legend scl-legend';
  leg.innerHTML = segs.map(s => {
    const pct = total > 0 ? Math.round(s.value / total * 100) : 0;
    return '<div class="legend-row"><span class="legend-dot" style="background:' + s.color + '"></span>' +
      '<span class="scl-txt">' + esc(s.label) + ' ' + fmtEur(s.value) +
      ' <span class="scl-pct">(' + pct + '%)</span></span></div>';
  }).join('');
  wrap.appendChild(leg);
}
// Disegna la lista spese (righe cliccabili) + totale nel titolo.
function statsListInto(listEl, titleEl, title, rows) {
  if (titleEl) titleEl.textContent = title + (rows.length ? ' · ' + fmtEur(rows.reduce((s, t) => s + (Number(t.importo) || 0), 0)) : '');
  if (!listEl) return;
  if (!rows.length) {
    listEl.innerHTML = '<div class="txt-faint" style="font-size:13px;padding:8px 2px">Nessuna spesa nel periodo.</div>';
    return;
  }
  listEl.innerHTML = rows.map(txRowHtml).join('');
  bindTxRows(listEl);
  twemojify(listEl);
}

// Donut contribuzione (Anno): month null = anno, altrimenti il mese.
function renderStatsContribDonut(month) {
  const yr = new Date().getFullYear();
  const title = 'Contribuzione · ' + (month ? (MESI_FULL[month - 1] || '') + ' ' + yr : yr);
  statsDonutInto(D.statsContrib, D.statsContribTitle, title, statsContribSegs(yr, month || null));
}

// Aggiorna insieme donut contribuzione + lista spese per un mese (Anno)
function renderStatsMonth(m) {
  renderStatsContribDonut(m);
  renderStatsList(m);
}

// ─── STATISTICHE · vista MESE (giorno per giorno) ──────────────
// Naviga il mese selezionato (S.statsMese {y,m}); il grafico mostra le uscite
// comuni giorno per giorno. Selezione di un giorno → donut+lista di quel giorno;
// nulla selezionato → totale del mese. Tap sul titolo = dettagli per utente.
function statsMeseShiftMonth(delta) {
  const now = new Date();
  if (!S.statsMese) S.statsMese = { y: now.getFullYear(), m: now.getMonth() + 1 };
  let { y, m } = S.statsMese;
  m += delta;
  while (m > 12) { m -= 12; y++; }
  while (m < 1) { m += 12; y--; }
  // non oltre il mese corrente
  if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) return;
  S.statsMese = { y, m };
  S.statsMeseDay = null;
  renderStatsMese();
}

function renderStatsMese() {
  if (!D.statsMChart || !window.Charts) return;
  const now = new Date();
  if (!S.statsMese) S.statsMese = { y: now.getFullYear(), m: now.getMonth() + 1 };
  const { y, m } = S.statsMese;
  if (D.statsMLabel) D.statsMLabel.textContent = (MESI_FULL[m - 1] || '') + ' ' + y;
  const atCurrent = (y === now.getFullYear() && m === now.getMonth() + 1);
  if (D.statsMNext) D.statsMNext.disabled = atCurrent || (y > now.getFullYear());
  const days = new Date(y, m, 0).getDate();
  const dayLabels = []; for (let d = 1; d <= days; d++) dayLabels.push(String(d));
  const ptLabels = dayLabels.map(d => d + ' ' + (MESI_SHORT[m - 1] || '').toLowerCase());
  const detail = !!S.statsMeseDetail;
  // uscite comuni grezze giorno per giorno
  const daily = new Array(days).fill(0);
  commonSpese().forEach(t => {
    const [ty, tm, td] = String(t.data || '').split('-').map(Number);
    if (ty === y && tm === m && td >= 1 && td <= days) daily[td - 1] += Number(t.importo) || 0;
  });
  const tot = daily.reduce((a, b) => a + b, 0);
  // media giornaliera "in divenire": fino a oggi se mese corrente, altrimenti tutto il mese
  const lastDay = atCurrent ? Math.min(now.getDate(), days) : days;
  let sumTo = 0; for (let d = 1; d <= lastDay; d++) sumTo += daily[d - 1];
  const mediaDay = lastDay > 0 ? sumTo / lastDay : 0;
  const refLine = mediaDay > 0 ? { value: mediaDay, color: 'var(--accent)' } : null;
  const legendExtra = [];
  if (mediaDay > 0) legendExtra.push({ label: 'Media/g', value: mediaDay, color: 'var(--accent)', dash: true });

  if (D.statsMTitle) D.statsMTitle.textContent = 'Uscite ' + (MESI_FULL[m - 1] || '') + (detail ? ' - dettagli' : '');
  let series;
  if (!detail) {
    series = [{ label: 'Uscite', color: 'var(--danger)', points: daily }];
    if (D.statsMSub) D.statsMSub.textContent = 'Spese giorno per giorno · totale mese ' + fmtEur(tot) + ' · tocca il titolo per i dettagli';
  } else {
    // Dettaglio: una linea per utente = contributo giornaliero (versamenti scatolo
    // + spese dal proprio conto/buoni − prelievi) + linea "Scatolo" = spese dal
    // fondo. Sempre TUTTI gli utenti + scatolo.
    const A = getAutoriList();
    const perUser = {}; A.forEach(n => { perUser[n] = new Array(days).fill(0); });
    const scatolo = new Array(days).fill(0);
    (S.tx || []).forEach(t => {
      if (!isNuovoModello(t)) return;
      const [ty, tm, td] = String(t.data || '').split('-').map(Number);
      if (ty !== y || tm !== m || !(td >= 1 && td <= days)) return;
      const mov = t.tipo_movimento || 'spesa';
      const imp = Number(t.importo) || 0;
      if (mov === 'spesa' && !t.personale && t.fonte === 'scatolo') { scatolo[td - 1] += imp; return; }
      const a = t.autore; if (!a || !perUser[a]) return;
      if (mov === 'versamento') perUser[a][td - 1] += imp;
      else if (mov === 'prelievo') perUser[a][td - 1] -= imp;
      else if (mov === 'spesa' && !t.personale) perUser[a][td - 1] += imp;
    });
    series = A.map(n => ({ label: shortName(n), color: colorForAutore(n), points: perUser[n].map(v => Math.max(0, round2(v))) }));
    series.push({ label: 'Scatolo', color: '#94a3b8', points: scatolo.map(v => round2(v)) });
    if (D.statsMSub) D.statsMSub.textContent = 'Contributo per utente (versamenti + pagamenti) + spese dallo scatolo · tocca il titolo per tornare';
  }

  Charts.renderLine(D.statsMChart, series, dayLabels, {
    yTicks: 4, dropLines: false, pointTooltip: true, spanLine: true, pointLabels: ptLabels,
    legendTopRight: true, legendValues: true, legendExtra: legendExtra, refLine: refLine,
    onSelect: (i) => { S.statsMeseDay = (i == null ? null : i + 1); renderStatsMeseDetail(); }
  });
  renderStatsMeseDetail();
}

// Donut contribuzione + lista del mese selezionato (giorno se selezionato)
function renderStatsMeseDetail() {
  if (!S.statsMese) return;
  const { y, m } = S.statsMese;
  const day = S.statsMeseDay || null;
  const periodo = (day ? day + ' ' : '') + (MESI_FULL[m - 1] || '') + ' ' + y;
  statsDonutInto(D.statsMContrib, D.statsMContribTitle, 'Contribuzione · ' + periodo, statsContribSegs(y, m, day));
  const rows = commonSpese()
    .filter(t => { const [ty, tm, td] = String(t.data || '').split('-').map(Number); return ty === y && tm === m && (!day || td === day); })
    .slice()
    .sort((a, b) => (a.data < b.data ? 1 : (a.data > b.data ? -1 : 0)));
  statsListInto(D.statsMList, D.statsMListTitle, 'Spese ' + periodo, rows);
}

function renderCatView() {
  // Pagina Categorie svuotata (rebuild in corso): no-op se manca il DOM.
  if (!D.catList) return;
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
    hasMonthNav: false,  // Riepilogo cumulativo: nessun selettore mese
    viewLabels: {
      conti:     'Riepilogo',
      list:      'Transazioni',
      cat:       'Categorie',
      stats:     'Statistiche'
    },
    getActions: (cv) => [
      { go: 'list', label: '📋', caption: 'Transazioni', aria: 'Lista transazioni', active: cv === 'list' },
      { go: 'cat',  label: '📁', caption: 'Categorie',  aria: 'Categorie',         active: cv === 'cat'  },
      { id: 'actAddTx', cls: 'action-add', label: '+', aria: 'Nuova transazione', onClick: openTxWizard },
      { go: 'stats', label: '📊', caption: 'Statistiche', aria: 'Statistiche', active: cv === 'stats' },
      { go: 'conti', label: '🏠', caption: 'Home', aria: 'Home Conti (Riepilogo)', active: cv === 'conti' }
    ]
  },
  spesa: {
    label: '🛒 Lista della spesa',
    home: 'spesa',
    hasMonthNav: false,
    viewLabels: { spesa: 'Lista' },
    getActions: () => [
      { id: 'actAddSpesa', cls: 'action-add', label: '+', aria: 'Nuovo elemento', onClick: openSpesaAdd },
      { id: 'actClearSpesa', label: '🗑', caption: 'Svuota', aria: 'Svuota lista', onClick: confirmClearSpesa }
    ]
  },
  todo: {
    label: '✅ ToDo',
    home: 'todo',
    hasMonthNav: false,
    viewLabels: { todo: 'Lavagna' },
    getActions: () => [
      { id: 'actAddTodo', cls: 'action-add', label: '+', aria: 'Nuovo ToDo', onClick: openTodoAdd },
      { id: 'actClearTodo', label: '🧽', caption: 'Pulisci', aria: 'Pulisci lavagna', onClick: confirmClearTodo }
    ]
  },
  scadenze: {
    label: '📅 Scadenze',
    home: 'scadenze-list',
    hasMonthNav: false,
    viewLabels: { 'scadenze-list': 'Lista', 'scadenze-cal': 'Calendario' },
    getActions: (cv) => [
      { go: 'scadenze-cal',  label: '📆', caption: 'Calendario', aria: 'Vista calendario', active: cv === 'scadenze-cal' },
      { id: 'actAddScad', cls: 'action-add', label: '+', aria: 'Nuova scadenza', onClick: openScadenzaAdd },
      { go: 'scadenze-list', label: '📋', caption: 'Lista',      aria: 'Vista lista',      active: cv === 'scadenze-list' }
    ]
  }
};

function moduloOf(viewName) {
  if (viewName === 'home') return null;
  if (viewName === 'conti' || viewName === 'list' || viewName === 'cat' || viewName === 'stats') return 'conti';
  if (viewName === 'spesa') return 'spesa';
  if (viewName === 'todo') return 'todo';
  if (viewName === 'scadenze-list' || viewName === 'scadenze-cal') return 'scadenze';
  return null;
}

function switchView(name) {
  S.currentView = name;
  ['home','conti','list','cat','stats','spesa','todo','scadenze-list','scadenze-cal'].forEach(v => {
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
  // Apron di sfondo dietro le pill: attivo solo nei moduli (non home)
  document.body.classList.toggle('has-modulebar', mod !== 'home' && !!moduloMeta);
  if (D.moduleActions && D.moduleActionPills) {
    if (mod === 'home') {
      D.moduleActions.style.display = 'none';
      D.moduleActionPills.style.display = 'none';
    } else if (moduloMeta) {
      D.moduleActions.style.display = 'flex';
      D.moduleActionPills.style.display = 'flex';
      // Nav mese: solo dove serve. NON nella vista Transazioni (ha i suoi
      // filtri data) né in Categorie/Personale.
      const showMonth = moduloMeta.hasMonthNav && !(name === 'list' || name === 'cat' || name === 'stats');
      if (D.moduleMonth) D.moduleMonth.style.display = showMonth ? 'flex' : 'none';
      renderModuleActionPills(moduloMeta, name);
    } else {
      D.moduleActions.style.display = 'none';
      D.moduleActionPills.style.display = 'none';
    }
  }
  // render contenuto view
  if (name === 'home') {
    renderHomeGestione();
    refreshSpesaNow();
    refreshTodoNow();
    refreshScadenzeNow();
  }
  else if (name === 'conti') { renderConti(); ensureAllTxLoaded().then(renderConti); }
  else if (name === 'list') {
    // entrando in Transazioni: pannello filtri sempre chiuso di default
    if (D.tx2Panel) D.tx2Panel.hidden = true;
    if (D.tx2FiltBtn) D.tx2FiltBtn.classList.remove('open');
    renderList();
  }
  else if (name === 'cat')  renderCatView();
  else if (name === 'stats') { S.statsView = 'main'; S.statsSelMonth = null; S.statsMeseDay = null; setStatsScope('anno'); ensureAllTxLoaded().then(renderStatsActive); }
  else if (name === 'spesa') {
    renderSpesa();
    refreshSpesaNow();
  }
  else if (name === 'todo') {
    renderTodo();
    refreshTodoNow();
  }
  else if (name === 'scadenze-list') {
    renderScadenzeList();
    refreshScadenzeNow();
  }
  else if (name === 'scadenze-cal') {
    if (!S.scadCalCursor) {
      const t = new Date();
      S.scadCalCursor = { anno: t.getFullYear(), mese: t.getMonth() + 1 };
    }
    renderScadenzeCal();
    refreshScadenzeNow();
  }
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
  const arr = txComune().filter(t => inMonth(t.data, anno, mese));
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
  const tComune = txComune();
  const curArr  = tComune.filter(t => inMonth(t.data, anno, mese));
  const prevArr = tComune.filter(t => inMonth(t.data, prevY, prevM));
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

// ═══════════════════════════════════════════════════════════════
// WIZARD NUOVA TRANSAZIONE — procedura guidata fullscreen multi-step
// Step 1: tipo (entrata/uscita) + chi paga + categoria + personale
// Step 2: (da definire)
// ═══════════════════════════════════════════════════════════════
const WIZ_STEPS = 4;
const WIZ = {
  step: 1,
  editId: null,            // null = nuovo movimento; id = modifica di un movimento esistente
  mov: 'spesa',            // 'spesa' | 'versamento' | 'prelievo'
  tipo: 'uscita',          // derivato (per il filtro categorie)
  comune: true,            // spesa in comune (true) o personale (false)
  fonte: null,             // 'scatolo' | 'conto' | 'buoni' (per la spesa)
  fonteAutore: null,       // persona del conto/buoni (null per scatolo)
  autore: null,            // chi versa / preleva (versamento/prelievo)
  motivo: 'riequilibrio',  // motivo del prelievo
  straord: false,
  splitMode: '5050',       // '5050' | 'allA' | 'allB' | 'custom'
  splitA: 50,              // % a carico del 1° autore (custom)
  categoria_id: undefined, // undefined = non scelta; null = "Altro"; number = sotto-cat
  amt: '',
  data: '',
  note: '',                // nota libera opzionale
  compTipo: null,
  compDa: '',
  compA: '',
};
let _wizMacroId = null;     // null = mostra macro; id = mostra sotto-cat di quella macro

function openTxWizard(arg) {
  const opts = (arg && typeof arg === 'object') ? arg : {};
  WIZ.step = 1;
  WIZ.editId = null;
  WIZ.mov = opts.mov || 'spesa';
  WIZ.tipo = 'uscita';
  WIZ.comune = true;
  WIZ.fonte = null;
  WIZ.fonteAutore = null;
  WIZ.autore = opts.autore || getDefaultAutore() || null;
  WIZ.motivo = opts.motivo || 'riequilibrio';
  WIZ.straord = false;
  WIZ.splitMode = '5050';
  WIZ.splitA = 50;
  WIZ.categoria_id = undefined;
  WIZ.amt = (opts.amt != null) ? String(opts.amt).replace('.', ',') : '';
  WIZ.data = today();
  WIZ.note = '';
  WIZ.compTipo = null;
  WIZ.compDa = '';
  WIZ.compA = '';
  _wizMacroId = null;
  if (D.wizStraord) D.wizStraord.checked = false;
  if (D.wizNote) D.wizNote.value = '';
  if (D.wizDelFooter) D.wizDelFooter.hidden = true;   // inserimento: niente elimina
  applyWizMov();           // imposta blocchi/etichette in base a WIZ.mov + render chips
  renderWizCats();
  setWizAmt(WIZ.amt);
  if (D.wizDataPag) D.wizDataPag.value = WIZ.data;
  renderWizDataPagLabel();
  setWizComp('mensile');
  showWizStep(1);
  if (D.modalWizard) D.modalWizard.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTxWizard() {
  if (D.modalWizard) D.modalWizard.classList.remove('open');
  document.body.style.overflow = '';
  WIZ.editId = null;
}

function motivoKeyFromPlain(s) {
  // startsWith: copre sia 'Riequilibrio' (wizard) sia 'Riequilibrio conti' (bottone dashboard)
  return String(s || '').startsWith('Riequilibrio') ? 'riequilibrio' : (s === 'Spesa personale' ? 'personale' : 'altro');
}

// Apre il wizard in modalità MODIFICA, precompilato col movimento esistente.
function openTxWizardEdit(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const t = S.tx.find(x => x.id === id);
  if (!t) return;
  WIZ.editId = id;
  WIZ.step = 1;
  const mov = t.tipo_movimento || 'spesa';
  WIZ.mov = mov;
  WIZ.tipo = 'uscita';
  WIZ.amt = (t.importo != null) ? String(t.importo).replace('.', ',') : '';
  WIZ.data = t.data || today();
  WIZ.note = t.note || '';
  if (mov === 'spesa') {
    WIZ.comune = !t.personale;
    WIZ.fonte = t.fonte || 'scatolo';
    WIZ.fonteAutore = (t.fonte && t.fonte !== 'scatolo') ? (t.autore || null) : null;
    WIZ.autore = t.autore || getDefaultAutore();
    WIZ.straord = !!t.straordinaria;
    WIZ.categoria_id = (t.categoria_id == null) ? null : t.categoria_id;
    const A = getAutoriList();
    const q = t.quota;
    if (q && typeof q === 'object') {
      const pa = Number(q[A[0]]);
      if (pa === 100) { WIZ.splitMode = 'allA'; WIZ.splitA = 100; }
      else if (pa === 0) { WIZ.splitMode = 'allB'; WIZ.splitA = 0; }
      else { WIZ.splitMode = 'custom'; WIZ.splitA = isNaN(pa) ? 50 : pa; }
    } else { WIZ.splitMode = '5050'; WIZ.splitA = 50; }
    WIZ.compTipo = t.competenza_tipo || null;
    WIZ.compDa = t.competenza_da || '';
    WIZ.compA = t.competenza_a || '';
    const c = (t.categoria_id != null) ? catById(t.categoria_id) : null;
    _wizMacroId = c ? (c.macro_categoria || 'altro') : null;
  } else {
    WIZ.comune = true;
    WIZ.fonte = 'scatolo'; WIZ.fonteAutore = null;
    WIZ.autore = t.autore || getDefaultAutore();
    WIZ.motivo = (mov === 'prelievo') ? motivoKeyFromPlain(t.descrizione || 'Riequilibrio') : 'riequilibrio';
    WIZ.straord = false;
    WIZ.categoria_id = undefined;
    WIZ.compTipo = null; WIZ.compDa = ''; WIZ.compA = '';
    _wizMacroId = null;
  }
  if (D.wizStraord) D.wizStraord.checked = WIZ.straord;
  if (D.wizNote) D.wizNote.value = WIZ.note;
  if (D.wizDelFooter) D.wizDelFooter.hidden = false;   // modifica: mostra Elimina nel footer
  applyWizMov();
  renderWizCats();
  setWizAmt(WIZ.amt);
  if (D.wizDataPag) D.wizDataPag.value = WIZ.data;
  renderWizDataPagLabel();
  // competenza: rifletti i valori salvati senza forzare un preset
  if (mov === 'spesa') {
    if (D.wizCompDa) D.wizCompDa.value = WIZ.compDa || '';
    if (D.wizCompA)  D.wizCompA.value  = WIZ.compA || '';
    if (D.wizCompQuick) $$('button', D.wizCompQuick).forEach(b => b.classList.toggle('active', b.getAttribute('data-comp') === WIZ.compTipo));
  }
  showWizStep(1);
  if (D.modalWizard) D.modalWizard.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showWizStep(n) {
  WIZ.step = n;
  $$('.wiz-step', D.modalWizard).forEach(s => {
    const sn = Number(s.getAttribute('data-step'));
    const on = sn === n;
    s.classList.toggle('active', on);
    s.hidden = !on;
  });
  if (D.wizProgress) {
    $$('.wiz-dot', D.wizProgress).forEach(d => {
      d.classList.toggle('active', Number(d.getAttribute('data-step')) <= n);
    });
  }
  if (D.wizStepNum) D.wizStepNum.textContent = n + ' / ' + WIZ_STEPS;
  if (D.wizBack) D.wizBack.disabled = (n === 1);
  if (D.wizNext) D.wizNext.textContent = (n === WIZ_STEPS) ? (WIZ.editId != null ? '✓ Salva modifiche' : '✓ Salva') : 'Continua';
  if (n === 4) renderWizRecap();
  // Ogni step parte dall'alto (niente scroll ereditato dallo step precedente).
  const body = D.modalWizard && D.modalWizard.querySelector('.wiz-body');
  if (body) body.scrollTop = 0;
  updateWizNext();
}

// Imposta i blocchi visibili + le etichette in base al tipo di movimento.
function applyWizMov() {
  const mov = WIZ.mov;
  const isSpesa = mov === 'spesa';
  if (D.wizMov) $$('button', D.wizMov).forEach(b => b.classList.toggle('active', b.getAttribute('data-mov') === mov));
  if (D.wizSpesaBlock) D.wizSpesaBlock.hidden = !isSpesa;
  if (D.wizBoxBlock) D.wizBoxBlock.hidden = isSpesa;
  if (D.wizStep1Title) D.wizStep1Title.textContent =
    isSpesa ? 'Dettagli della spesa' : (mov === 'versamento' ? 'Versamento nello scatolo' : 'Prelievo dallo scatolo');
  if (isSpesa) {
    renderWizComune();
    if (D.wizSplit) D.wizSplit.hidden = !WIZ.comune;
    if (D.wizStraordRow) D.wizStraordRow.style.display = WIZ.comune ? '' : 'none';
    renderWizFonti();
    if (WIZ.comune) renderWizSplit();
  } else {
    const isPrel = mov === 'prelievo';
    if (D.wizChiLabel) D.wizChiLabel.textContent = isPrel ? 'Chi preleva dallo scatolo?' : 'Chi mette i soldi nello scatolo?';
    if (D.wizMotivoWrap) D.wizMotivoWrap.hidden = !isPrel;
    if (D.wizBoxInfo) D.wizBoxInfo.textContent = isPrel
      ? '📤 Esce denaro dallo scatolo (riequilibrio o spesa personale di chi è in credito).'
      : '📥 Entra denaro nello scatolo (es. l\'affitto in contanti).';
    if (isPrel) renderWizMotivo();
    renderWizChi();
    if (D.wizBoxInfo) twemojify(D.wizBoxInfo);
  }
  if (D.wizCompSection) D.wizCompSection.style.display = isSpesa ? '' : 'none';
  if (D.wizDataLbl) D.wizDataLbl.textContent = isSpesa ? 'Giorno del pagamento' : (mov === 'versamento' ? 'Giorno del versamento' : 'Giorno del prelievo');
  if (D.wizStep3Title) D.wizStep3Title.textContent = isSpesa ? 'Quando e per quale periodo?' : 'Quando?';
  updateWizNext();
}

function setWizMov(mov) {
  WIZ.mov = mov;
  WIZ.categoria_id = undefined;
  _wizMacroId = null;
  if (mov === 'spesa') { WIZ.fonte = null; WIZ.fonteAutore = null; }
  else { WIZ.autore = WIZ.autore || getDefaultAutore(); }
  applyWizMov();
  renderWizCats();
}

function renderWizComune() {
  if (!D.wizComune) return;
  const val = WIZ.comune ? 'comune' : 'personale';
  D.wizComune.setAttribute('data-val', val);
  $$('button', D.wizComune).forEach(b => b.classList.toggle('active', b.getAttribute('data-val') === val));
}

function setWizComune(val) {
  WIZ.comune = (val === 'comune');
  renderWizComune();
  if (D.wizSplit) D.wizSplit.hidden = !WIZ.comune;
  if (D.wizStraordRow) D.wizStraordRow.style.display = WIZ.comune ? '' : 'none';
  if (!WIZ.comune && WIZ.fonte === 'scatolo') { WIZ.fonte = null; WIZ.fonteAutore = null; }
  renderWizFonti();
  if (WIZ.comune) renderWizSplit();
  updateWizNext();
}

function renderWizFonti() {
  if (!D.wizFonti) return;
  const A = getAutoriList();
  const items = [];
  if (WIZ.comune) items.push({ key: 'scatolo', autore: null, icon: '📦', label: 'Scatolo' });
  A.forEach(n => items.push({ key: 'conto', autore: n, icon: '💳', label: 'Conto ' + shortName(n) }));
  A.forEach(n => items.push({ key: 'buoni', autore: n, icon: '🍽', label: 'Buoni ' + shortName(n) }));
  D.wizFonti.innerHTML = items.map((it, i) => {
    const active = WIZ.fonte === it.key && (it.autore || null) === (WIZ.fonteAutore || null);
    return '<button type="button" class="wiz-chip' + (active ? ' active' : '') + '" data-i="' + i + '">' + it.icon + ' ' + esc(it.label) + '</button>';
  }).join('');
  twemojify(D.wizFonti);
  $$('.wiz-chip', D.wizFonti).forEach(el => {
    el.addEventListener('click', () => {
      const it = items[Number(el.getAttribute('data-i'))];
      WIZ.fonte = it.key; WIZ.fonteAutore = it.autore;
      renderWizFonti(); updateWizNext();
    });
  });
}

function renderWizChi() {
  if (!D.wizChi) return;
  const A = getAutoriList();
  D.wizChi.innerHTML = A.map(n =>
    '<button type="button" class="wiz-chip' + (n === WIZ.autore ? ' active' : '') + '" data-autore="' + esc(n) + '">' + esc(n) + '</button>'
  ).join('');
  $$('.wiz-chip', D.wizChi).forEach(el => {
    el.addEventListener('click', () => { WIZ.autore = el.getAttribute('data-autore'); renderWizChi(); updateWizNext(); });
  });
}

function renderWizMotivo() {
  if (!D.wizMotivo) return;
  $$('button', D.wizMotivo).forEach(b => b.classList.toggle('active', b.getAttribute('data-motivo') === WIZ.motivo));
  // F-6: il prelievo con motivo "Riequilibrio" fatto a mano compensa solo metà
  // (lo scatolo è comune 50/50). Rimanda al bottone corretto della dashboard.
  let hint = document.getElementById('wizRiqHint');
  const show = WIZ.motivo === 'riequilibrio';
  if (show && !hint && D.wizMotivoWrap) {
    hint = document.createElement('div');
    hint.id = 'wizRiqHint';
    hint.className = 'wiz-hint';
    D.wizMotivoWrap.appendChild(hint);
  }
  if (hint) {
    hint.hidden = !show;
    if (show) hint.textContent = '⚠️ Per pareggiare i conti usa «⚖️ Registra il riequilibrio» nella dashboard: questo prelievo da solo non azzera i saldi.';
  }
}

function renderWizSplit() {
  if (!D.wizSplitChips) return;
  const A = getAutoriList();
  const a = shortName(A[0] || 'Stefano'), b = shortName(A[1] || 'Flavia');
  const modes = [
    { key: '5050', label: '50 / 50' },
    { key: 'allA', label: 'Tutta ' + a },
    { key: 'allB', label: 'Tutta ' + b },
    { key: 'custom', label: 'Personalizza' },
  ];
  D.wizSplitChips.innerHTML = modes.map(m =>
    '<button type="button" class="wiz-chip' + (WIZ.splitMode === m.key ? ' active' : '') + '" data-split="' + m.key + '">' + esc(m.label) + '</button>'
  ).join('');
  $$('.wiz-chip', D.wizSplitChips).forEach(el => el.addEventListener('click', () => setWizSplitMode(el.getAttribute('data-split'))));
  const showCustom = WIZ.splitMode === 'custom';
  if (D.wizSplitCustom) D.wizSplitCustom.hidden = !showCustom;
  if (showCustom) {
    if (D.wizSplitRange) D.wizSplitRange.value = WIZ.splitA;
    renderWizSplitReadout();
  }
}

function setWizSplitMode(mode) {
  WIZ.splitMode = mode;
  if (mode === '5050') WIZ.splitA = 50;
  else if (mode === 'allA') WIZ.splitA = 100;
  else if (mode === 'allB') WIZ.splitA = 0;
  renderWizSplit();
  updateWizNext();
}

function renderWizSplitReadout() {
  if (!D.wizSplitReadout) return;
  const A = getAutoriList();
  const a = shortName(A[0] || 'Stefano'), b = shortName(A[1] || 'Flavia');
  D.wizSplitReadout.innerHTML = '<b>' + esc(a) + '</b> ' + WIZ.splitA + '%  ·  <b>' + esc(b) + '</b> ' + (100 - WIZ.splitA) + '%';
}

// Etichette di riepilogo
function motivoLabel(m) { return m === 'riequilibrio' ? '⚖️ Riequilibrio' : (m === 'personale' ? '👤 Spesa personale' : '📝 Altro'); }
function motivoPlain(m) { return m === 'riequilibrio' ? 'Riequilibrio' : (m === 'personale' ? 'Spesa personale' : 'Altro'); }
function wizFonteLabel() {
  if (WIZ.fonte === 'scatolo') return '📦 Scatolo';
  if (WIZ.fonte === 'conto')   return '💳 Conto ' + shortName(WIZ.fonteAutore || '');
  if (WIZ.fonte === 'buoni')   return '🍽 Buoni ' + shortName(WIZ.fonteAutore || '');
  return '—';
}
function wizSplitLabel() {
  const A = getAutoriList();
  const a = shortName(A[0] || 'A'), b = shortName(A[1] || 'B');
  if (!WIZ.comune) return '—';
  if (Number(WIZ.splitA) === 50) return '50 / 50';
  if (Number(WIZ.splitA) === 100) return 'Tutta ' + a;
  if (Number(WIZ.splitA) === 0) return 'Tutta ' + b;
  return a + ' ' + WIZ.splitA + '% · ' + b + ' ' + (100 - WIZ.splitA) + '%';
}

function renderWizCats() {
  if (!D.wizCats) return;
  const allCats = S.cats.filter(c => c.tipo === WIZ.tipo);
  if (!allCats.length) {
    D.wizCats.innerHTML = '<div class="wiz-placeholder" style="grid-column:1/-1;padding:24px 8px">Nessuna categoria ' +
      (WIZ.tipo === 'entrata' ? 'di entrata' : 'di uscita') + '.<br><small>Creane una in Categorie</small></div>';
    if (D.wizCatLabel) D.wizCatLabel.textContent = 'Categoria';
    return;
  }

  // recency per ranking (ultimi 90 giorni)
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.getFullYear() + '-' + String(cutoff.getMonth()+1).padStart(2,'0') + '-' + String(cutoff.getDate()).padStart(2,'0');
  const recent = txComune().filter(t => t.tipo === WIZ.tipo && t.data >= cutoffStr);
  const useByCat = {};
  recent.forEach(t => { if (t.categoria_id != null) useByCat[t.categoria_id] = (useByCat[t.categoria_id] || 0) + 1; });

  if (_wizMacroId == null) {
    // LIVELLO 1: macro-categorie
    if (D.wizCatLabel) D.wizCatLabel.textContent = 'Categoria';
    const groups = new Map();
    allCats.forEach(c => {
      const mid = c.macro_categoria || 'altro';
      if (!groups.has(mid)) groups.set(mid, { count: 0, useTotal: 0 });
      const g = groups.get(mid);
      g.count++;
      g.useTotal += (useByCat[c.id] || 0);
    });
    const sorted = Array.from(groups.entries()).sort((a, b) => (b[1].useTotal - a[1].useTotal) || a[0].localeCompare(b[0]));
    let html = sorted.map(([mid, g]) => {
      const m = macroById(mid);
      return '<button type="button" class="wiz-cat" data-macro="' + mid + '">' +
        '<span class="wiz-cat-badge">' + g.count + '</span>' +
        '<span class="wiz-cat-icon">' + (m ? m.icon : '📦') + '</span>' +
        '<span class="wiz-cat-name">' + esc(macroLabel(mid)) + '</span>' +
      '</button>';
    }).join('');
    // chip "Altro" (senza categoria)
    html += '<button type="button" class="wiz-cat' + (WIZ.categoria_id === null ? ' active' : '') + '" data-altro="1">' +
      '<span class="wiz-cat-icon">📦</span><span class="wiz-cat-name">Altro</span></button>';
    D.wizCats.innerHTML = html;
    twemojify(D.wizCats);
    $$('.wiz-cat[data-macro]', D.wizCats).forEach(el => {
      el.addEventListener('click', () => { _wizMacroId = el.getAttribute('data-macro'); renderWizCats(); });
    });
    $$('.wiz-cat[data-altro]', D.wizCats).forEach(el => {
      el.addEventListener('click', () => {
        WIZ.categoria_id = (WIZ.categoria_id === null) ? undefined : null;
        renderWizCats();
        updateWizNext();
      });
    });
  } else {
    // LIVELLO 2: sotto-categorie della macro selezionata
    const m = macroById(_wizMacroId);
    if (D.wizCatLabel) D.wizCatLabel.textContent = 'Categoria · ' + macroLabel(_wizMacroId);
    const subs = allCats
      .filter(c => (c.macro_categoria || 'altro') === _wizMacroId)
      .sort((a, b) => (useByCat[b.id] || 0) - (useByCat[a.id] || 0) || a.ordine - b.ordine);
    let html = '<button type="button" class="wiz-cat wiz-back-cat" data-wizback="1">' +
      '<span class="wiz-cat-icon">‹</span><span class="wiz-cat-name">Indietro</span></button>';
    html += subs.map(c =>
      '<button type="button" class="wiz-cat' + (WIZ.categoria_id === c.id ? ' active' : '') + '" data-cat-id="' + c.id + '">' +
        '<span class="wiz-cat-icon" style="color:' + (c.colore || '#666') + '">' + (c.icona || '?') + '</span>' +
        '<span class="wiz-cat-name">' + esc(c.nome) + '</span>' +
      '</button>'
    ).join('');
    D.wizCats.innerHTML = html;
    twemojify(D.wizCats);
    const back = $('.wiz-cat[data-wizback]', D.wizCats);
    if (back) back.addEventListener('click', () => { _wizMacroId = null; renderWizCats(); });
    $$('.wiz-cat[data-cat-id]', D.wizCats).forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.getAttribute('data-cat-id'));
        WIZ.categoria_id = (WIZ.categoria_id === id) ? undefined : id;
        renderWizCats();
        updateWizNext();
      });
    });
  }
}

// ─── Step 2: tastierino importo ─────────────────────────────
function setWizAmt(v) {
  WIZ.amt = v;
  if (D.wizAmtVal) D.wizAmtVal.textContent = v || '0';
  if (D.wizAmt) D.wizAmt.classList.toggle('is-empty', !v);
  updateWizNext();
}
function wizNumpadPress(k) {
  let v = WIZ.amt || '';
  if (k === 'bs') {
    v = v.slice(0, -1);
  } else if (k === ',') {
    if (!v.includes(',')) v = (v || '0') + ',';
  } else {
    if (v === '0') v = '';
    // max 2 decimali
    if (v.includes(',')) {
      const dec = v.split(',')[1];
      if (dec.length >= 2) return;
    }
    if (v.replace(',', '').length >= 9) return;
    v += k;
  }
  setWizAmt(v);
  vibrate(8);
}

// ─── Step 3: data pagamento + periodo competenza ────────────
function renderWizDataPagLabel() {
  if (!D.wizDataPagLabel) return;
  const val = (D.wizDataPag && D.wizDataPag.value) || WIZ.data || today();
  WIZ.data = val;
  const t = today();
  const d = new Date(); d.setDate(d.getDate() - 1);
  const ystr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  let label;
  if (val === t) label = 'Oggi';
  else if (val === ystr) label = 'Ieri';
  else { const [yy, mm, dd] = val.split('-'); label = dd + ' ' + MESI_SHORT[Number(mm)-1] + ' ' + yy; }
  D.wizDataPagLabel.textContent = label;
}

// Calcola il periodo di competenza dell'ANNO CORRENTE che contiene
// la data di pagamento, in base al tipo scelto.
function compPeriodFor(type, refStr) {
  const ref = refStr ? new Date(refStr + 'T00:00:00') : new Date();
  const y = ref.getFullYear();
  const m = ref.getMonth() + 1; // 1-12
  const pad = n => String(n).padStart(2, '0');
  const lastDay = (yy, mm) => new Date(yy, mm, 0).getDate();
  let sm, em;
  if (type === 'annuale')          { sm = 1;  em = 12; }
  else if (type === 'semestrale')  { if (m <= 6) { sm = 1; em = 6; } else { sm = 7; em = 12; } }
  else if (type === 'bimestrale')  { const idx = Math.floor((m - 1) / 2); sm = idx * 2 + 1; em = sm + 1; }
  else                             { sm = m; em = m; } // mensile
  return {
    da: y + '-' + pad(sm) + '-01',
    a:  y + '-' + pad(em) + '-' + pad(lastDay(y, em))
  };
}

function setWizComp(type) {
  WIZ.compTipo = type;
  const p = compPeriodFor(type, WIZ.data || today());
  WIZ.compDa = p.da;
  WIZ.compA  = p.a;
  if (D.wizCompDa) D.wizCompDa.value = p.da;
  if (D.wizCompA)  D.wizCompA.value  = p.a;
  if (D.wizCompQuick) {
    $$('button', D.wizCompQuick).forEach(b => b.classList.toggle('active', b.getAttribute('data-comp') === type));
  }
  updateWizNext();
}

function compDurationMonths(type) {
  return type === 'annuale' ? 12 : type === 'semestrale' ? 6 : type === 'bimestrale' ? 2 : 1;
}
// Fine del periodo = inizio + N mesi − 1 giorno (in equity.js, robusto ai
// fine-mese: 31 gen +1 → 27 feb, non 2 mar). Testato con node --test.
function compEndFromStart(startStr, months) { return CDCEquity.compEndFromStart(startStr, months); }

// Cambio data INIZIO: se c'è un preset attivo, la fine si adatta alla durata
// (es. bimestrale: 1 mar → 30 apr; annuale: 1 gen → 31 dic).
function onWizCompDaChange() {
  WIZ.compDa = (D.wizCompDa && D.wizCompDa.value) || '';
  if (WIZ.compTipo && WIZ.compDa) {
    WIZ.compA = compEndFromStart(WIZ.compDa, compDurationMonths(WIZ.compTipo));
    if (D.wizCompA) D.wizCompA.value = WIZ.compA;
  } else {
    WIZ.compA = (D.wizCompA && D.wizCompA.value) || '';
  }
  updateWizNext();
}

// Cambio data FINE manuale → periodo personalizzato (deseleziona il preset).
function onWizCompAChange() {
  WIZ.compA = (D.wizCompA && D.wizCompA.value) || '';
  WIZ.compTipo = null;
  if (D.wizCompQuick) $$('button', D.wizCompQuick).forEach(b => b.classList.remove('active'));
  updateWizNext();
}

// ─── Step 4: riepilogo ──────────────────────────────────────
function fmtRecapDate(s) {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return d + ' ' + MESI_SHORT[Number(m)-1] + ' ' + y;
}
function renderWizRecap() {
  if (!D.wizRecap) return;
  const imp = parseAmount(WIZ.amt) || 0;
  let rows;
  if (WIZ.mov === 'spesa') {
    let catLabel, catIcon;
    if (WIZ.categoria_id === null || WIZ.categoria_id === undefined) { catLabel = 'Altro'; catIcon = '📦'; }
    else { const c = catById(WIZ.categoria_id); catLabel = c ? c.nome : '?'; catIcon = c ? (c.icona || '🏷') : '🏷'; }
    const compLabel = WIZ.compTipo ? cap(WIZ.compTipo) : 'Personalizzato';
    rows = [
      ['Tipo', '<span class="wiz-recap-v neg">💸 Spesa</span>'],
      ['Importo', '<span class="wiz-recap-v big neg">−' + fmtEur(imp) + '</span>'],
      ['Categoria', '<span class="wiz-recap-v">' + catIcon + ' ' + esc(catLabel) + '</span>'],
      ['Da', '<span class="wiz-recap-v">' + wizFonteLabel() + '</span>'],
      [WIZ.comune ? 'Divisione' : 'Tipo spesa', '<span class="wiz-recap-v">' + (WIZ.comune ? wizSplitLabel() : '👤 Personale') + '</span>'],
    ];
    if (WIZ.comune && WIZ.straord) rows.push(['Straordinaria', '<span class="wiz-recap-v">✨ Sì</span>']);
    rows.push(['Pagato il', '<span class="wiz-recap-v">' + fmtRecapDate(WIZ.data) + '</span>']);
    rows.push(['Competenza', '<span class="wiz-recap-v"><span class="wiz-recap-badge">' + compLabel + '</span></span>']);
    rows.push(['Periodo', '<span class="wiz-recap-v">' + fmtRecapDate(WIZ.compDa) + ' → ' + fmtRecapDate(WIZ.compA) + '</span>']);
  } else if (WIZ.mov === 'versamento') {
    rows = [
      ['Tipo', '<span class="wiz-recap-v pos">📥 Versamento</span>'],
      ['Importo', '<span class="wiz-recap-v big pos">+' + fmtEur(imp) + '</span>'],
      ['Chi versa', '<span class="wiz-recap-v">' + esc(WIZ.autore || '—') + '</span>'],
      ['Dove', '<span class="wiz-recap-v">📦 Scatolo (fondo comune)</span>'],
      ['Data', '<span class="wiz-recap-v">' + fmtRecapDate(WIZ.data) + '</span>'],
    ];
  } else {
    rows = [
      ['Tipo', '<span class="wiz-recap-v neg">📤 Prelievo</span>'],
      ['Importo', '<span class="wiz-recap-v big neg">−' + fmtEur(imp) + '</span>'],
      ['Chi preleva', '<span class="wiz-recap-v">' + esc(WIZ.autore || '—') + '</span>'],
      ['Motivo', '<span class="wiz-recap-v">' + motivoLabel(WIZ.motivo) + '</span>'],
      ['Data', '<span class="wiz-recap-v">' + fmtRecapDate(WIZ.data) + '</span>'],
    ];
  }
  D.wizRecap.innerHTML = rows.map(([k, v]) =>
    '<div class="wiz-recap-row"><span class="wiz-recap-k">' + k + '</span>' + v + '</div>'
  ).join('');
  twemojify(D.wizRecap);
}

// ─── Salvataggio finale ─────────────────────────────────────
async function wizSave() {
  const imp = parseAmount(WIZ.amt);
  if (!imp || imp <= 0) { toast('Importo non valido', 'warn'); return; }
  const A = getAutoriList();
  const note = (WIZ.note || '').trim() || null;
  let payload;
  if (WIZ.mov === 'spesa') {
    let quota = null;
    if (WIZ.comune && Number(WIZ.splitA) !== 50) {
      quota = {};
      quota[A[0]] = Number(WIZ.splitA);
      if (A[1]) quota[A[1]] = 100 - Number(WIZ.splitA);
    }
    payload = {
      tipo_movimento: 'spesa',
      tipo: 'uscita',
      importo: imp,
      categoria_id: (WIZ.categoria_id === null || WIZ.categoria_id === undefined) ? null : WIZ.categoria_id,
      descrizione: null,
      note: note,
      data: WIZ.data || today(),
      autore: WIZ.fonte === 'scatolo' ? null : (WIZ.fonteAutore || null),
      fonte: WIZ.fonte,
      personale: !WIZ.comune,
      straordinaria: WIZ.comune ? !!WIZ.straord : false,
      quota: quota,
      competenza_da: WIZ.compDa || null,
      competenza_a: WIZ.compA || null,
      competenza_tipo: WIZ.compTipo || null
    };
  } else if (WIZ.mov === 'versamento') {
    payload = boxPayload('versamento', WIZ.autore, imp, WIZ.data, 'Versamento scatolo', note);
  } else {
    payload = boxPayload('prelievo', WIZ.autore, imp, WIZ.data, motivoPlain(WIZ.motivo), note);
  }
  const isEdit = WIZ.editId != null;
  setBtnLoading(D.wizNext, true);
  try {
    if (isEdit) {
      await updateTransaction(WIZ.editId, payload);
      vibrate(20);
      closeTxWizard();
      toast('Movimento modificato', 'success');
    } else {
      await saveTransaction(payload);
      vibrate(20);
      closeTxWizard();
      toast(WIZ.mov === 'versamento' ? 'Versamento salvato' : (WIZ.mov === 'prelievo' ? 'Prelievo salvato' : 'Spesa salvata'), 'success');
    }
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'salvataggio non riuscito'), 'error');
  } finally {
    setBtnLoading(D.wizNext, false);
  }
}

// PATCH di un movimento esistente (optimistic + coda offline).
async function updateTransaction(id, payload) {
  const idx = S.tx.findIndex(t => t.id === id);
  if (idx >= 0) S.tx[idx] = Object.assign({}, S.tx[idx], payload);
  invalidateTxCharts();
  saveLocalCache();
  renderHomeGestione(); renderConti(); renderList();
  const path = T.TX + '?id=eq.' + id;
  const options = { method: 'PATCH', body: JSON.stringify(payload) };
  if (isOnline()) {
    try { await supaFetch(path, options); } catch (e) { enqueue({ path, options }); }
  } else {
    enqueue({ path, options });
  }
}

// Elimina il movimento in modifica (dal wizard).
async function wizDelete() {
  if (WIZ.editId == null) return;
  const id = WIZ.editId;
  const ok = await confirmDlg({ title: 'Elimina movimento', message: 'Vuoi davvero eliminarlo? L\'azione non è reversibile.', confirmLabel: 'Elimina', danger: true });
  if (!ok) return;
  try {
    S.tx = S.tx.filter(t => t.id !== id);
    invalidateTxCharts();
    saveLocalCache();
    renderHomeGestione(); renderConti(); renderList();
    const path = T.TX + '?id=eq.' + id;
    const options = { method: 'DELETE' };
    if (isOnline()) {
      try { await supaFetch(path, options); } catch (e) { enqueue({ path, options }); }
    } else {
      enqueue({ path, options });
    }
    closeTxWizard();
    toast('Movimento eliminato', 'success');
  } catch (e) {
    toast('Errore: ' + (e && e.message ? e.message : 'non riuscito'), 'error');
  }
}

// Continua si accende solo se i campi obbligatori dello step sono validi.
function updateWizNext() {
  if (!D.wizNext) return;
  let ok = false;
  const mov = WIZ.mov;
  if (WIZ.step === 1) {
    if (mov === 'spesa') ok = !!WIZ.fonte && WIZ.categoria_id !== undefined;
    else if (mov === 'versamento') ok = !!WIZ.autore;
    else ok = !!WIZ.autore && !!WIZ.motivo;
  } else if (WIZ.step === 2) {
    const imp = parseAmount(WIZ.amt);
    ok = !!imp && imp > 0;
  } else if (WIZ.step === 3) {
    if (mov === 'spesa') ok = !!WIZ.data && !!WIZ.compDa && !!WIZ.compA && WIZ.compDa <= WIZ.compA;
    else ok = !!WIZ.data;
  } else {
    ok = true;
  }
  D.wizNext.disabled = !ok;
}

function wizNext() {
  if (WIZ.step < WIZ_STEPS) {
    showWizStep(WIZ.step + 1);
  } else {
    wizSave(); // ultimo step (riepilogo) → salva su DB
  }
}

function wizBack() {
  if (WIZ.step > 1) showWizStep(WIZ.step - 1);
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
    if (D.qaPersonale) D.qaPersonale.checked = false; // default: "in comune"
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
  const personale = !!(D.qaPersonale && D.qaPersonale.checked);
  setBtnLoading(D.qaSaveBtn, true);
  try {
    await saveTransaction({
      importo,
      tipo: QA.tipo,
      categoria_id,
      descrizione: desc || null,
      data: dataStr,
      autore: autore || null,
      personale
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
  invalidateTxCharts();
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
      // sostituisci tmp con quello reale — ma prima elimina un eventuale
      // doppione già inserito dall'evento Realtime (che può arrivare PRIMA
      // della risposta del POST): altrimenti la stessa tx comparirebbe 2 volte.
      const realId = res[0].id;
      S.tx = S.tx.filter(t => t.id === tmpId || t.id !== realId);
      const idx = S.tx.findIndex(t => t.id === tmpId);
      if (idx >= 0) S.tx[idx] = res[0]; else if (!S.tx.some(t => t.id === realId)) S.tx.unshift(res[0]);
      S.pendingTxIds.delete(tmpId);
      invalidateTxCharts();
      saveLocalCache();
      renderHomeGestione(); renderConti();
      renderList();
    }
  } catch (e) {
    enqueue({ path, options });
  }
}

// ─── EDIT TRANSAZIONE ───────────────────────────────────────
let _txEditCompTipo = null; // preset competenza selezionato nel modal modifica

// Imposta il periodo di competenza nel modal modifica da un preset
function setTxEditComp(type) {
  _txEditCompTipo = type;
  const ref = (D.txEditData && D.txEditData.value) || today();
  const p = compPeriodFor(type, ref);
  if (D.txEditCompDa) D.txEditCompDa.value = p.da;
  if (D.txEditCompA)  D.txEditCompA.value  = p.a;
  if (D.txEditCompQuick) $$('button', D.txEditCompQuick).forEach(b => b.classList.toggle('active', b.getAttribute('data-comp') === type));
}

// Stato della scheda modifica (coerente col tipo di movimento)
const TXE = { mov: 'spesa', comune: true, fonte: 'scatolo', fonteAutore: null, splitMode: '5050', splitA: 50 };

function renderTxEditFonte() {
  if (!D.txEditFonte) return;
  const A = getAutoriList();
  const opts = [];
  if (TXE.comune) opts.push({ v: 'scatolo', label: '📦 Scatolo' });
  A.forEach(n => opts.push({ v: 'conto|' + n, label: '💳 Conto ' + shortName(n) }));
  A.forEach(n => opts.push({ v: 'buoni|' + n, label: '🍽 Buoni ' + shortName(n) }));
  const cur = TXE.fonte === 'scatolo' ? 'scatolo' : (TXE.fonte ? TXE.fonte + '|' + (TXE.fonteAutore || '') : '');
  D.txEditFonte.innerHTML = opts.map(o => '<option value="' + esc(o.v) + '"' + (o.v === cur ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('');
  if (![...D.txEditFonte.options].some(o => o.selected)) { D.txEditFonte.selectedIndex = 0; onTxEditFonteChange(); }
}
function onTxEditFonteChange() {
  const v = D.txEditFonte ? D.txEditFonte.value : '';
  if (v === 'scatolo') { TXE.fonte = 'scatolo'; TXE.fonteAutore = null; }
  else { const [k, n] = v.split('|'); TXE.fonte = k; TXE.fonteAutore = n; }
}
function renderTxEditSplit() {
  if (!D.txEditSplit) return;
  const A = getAutoriList();
  const oa = D.txEditSplit.querySelector('option[value="allA"]');
  const ob = D.txEditSplit.querySelector('option[value="allB"]');
  if (oa) oa.textContent = 'Tutta ' + shortName(A[0] || 'A');
  if (ob) ob.textContent = 'Tutta ' + shortName(A[1] || 'B');
  D.txEditSplit.value = TXE.splitMode;
  const showCustom = TXE.splitMode === 'custom';
  if (D.txEditSplitCustom) D.txEditSplitCustom.hidden = !showCustom;
  if (showCustom) { if (D.txEditSplitRange) D.txEditSplitRange.value = TXE.splitA; renderTxEditSplitReadout(); }
}
function renderTxEditSplitReadout() {
  if (!D.txEditSplitReadout) return;
  const A = getAutoriList();
  D.txEditSplitReadout.innerHTML = '<b>' + esc(shortName(A[0] || 'A')) + '</b> ' + TXE.splitA + '%  ·  <b>' + esc(shortName(A[1] || 'B')) + '</b> ' + (100 - TXE.splitA) + '%';
}
function updateTxEditPersonaleUI() {
  TXE.comune = !(D.txEditPersonale && D.txEditPersonale.checked);
  if (D.txEditSplitWrap) D.txEditSplitWrap.style.display = TXE.comune ? '' : 'none';
  if (D.txEditStraordRow) D.txEditStraordRow.style.display = TXE.comune ? '' : 'none';
  if (!TXE.comune && TXE.fonte === 'scatolo') { TXE.fonte = null; TXE.fonteAutore = null; }
  renderTxEditFonte();
}

function openTxEdit(idStr) {
  // La modifica usa lo STESSO wizard guidato dell'inserimento (precompilato).
  openTxWizardEdit(idStr);
}
// (legacy) vecchia scheda di modifica a modal singolo — non più usata.
function openTxEditLegacy(idStr) {
  const id = isNaN(Number(idStr)) ? idStr : Number(idStr);
  const t = S.tx.find(x => x.id === id);
  if (!t) return;
  S.editTxId = id;
  const mov = t.tipo_movimento || 'spesa';
  TXE.mov = mov;
  const isSpesa = mov === 'spesa';
  if (D.txEditTitle) D.txEditTitle.textContent = isSpesa ? 'Modifica spesa' : (mov === 'versamento' ? 'Modifica versamento' : 'Modifica prelievo');
  if (D.txEditTypeBadge) {
    D.txEditTypeBadge.textContent = isSpesa ? '💸 Spesa' : (mov === 'versamento' ? '📥 Versamento nello scatolo' : '📤 Prelievo dallo scatolo');
    D.txEditTypeBadge.className = 'tx-edit-typebadge ' + (mov === 'versamento' ? 'pos' : 'neg');
    twemojify(D.txEditTypeBadge);
  }
  D.txEditAmt.value = t.importo;
  D.txEditData.value = t.data;
  if (D.txEditSpesaFields) D.txEditSpesaFields.hidden = !isSpesa;
  if (D.txEditBoxFields) D.txEditBoxFields.hidden = isSpesa;

  if (isSpesa) {
    if (D.txEditPersonale) D.txEditPersonale.checked = !!t.personale;
    TXE.comune = !t.personale;
    TXE.fonte = t.fonte || 'scatolo';
    TXE.fonteAutore = (t.fonte && t.fonte !== 'scatolo') ? (t.autore || null) : null;
    renderTxEditFonte();
    populateCatSelect(D.txEditCat, 'uscita', t.categoria_id);
    // divisione dalla quota
    const A = getAutoriList();
    const q = t.quota;
    if (q && typeof q === 'object') {
      const pa = Number(q[A[0]]);
      if (pa === 100) { TXE.splitMode = 'allA'; TXE.splitA = 100; }
      else if (pa === 0) { TXE.splitMode = 'allB'; TXE.splitA = 0; }
      else { TXE.splitMode = 'custom'; TXE.splitA = isNaN(pa) ? 50 : pa; }
    } else { TXE.splitMode = '5050'; TXE.splitA = 50; }
    renderTxEditSplit();
    if (D.txEditStraord) D.txEditStraord.checked = !!t.straordinaria;
    _txEditCompTipo = t.competenza_tipo || null;
    if (D.txEditCompDa) D.txEditCompDa.value = t.competenza_da || '';
    if (D.txEditCompA)  D.txEditCompA.value  = t.competenza_a  || '';
    if (D.txEditCompQuick) $$('button', D.txEditCompQuick).forEach(b => b.classList.toggle('active', b.getAttribute('data-comp') === _txEditCompTipo));
    updateTxEditPersonaleUI();
  } else {
    if (D.txEditChiLabel) D.txEditChiLabel.textContent = mov === 'prelievo' ? 'Chi preleva' : 'Chi versa';
    if (D.txEditAutore) populateAutoreSelect(D.txEditAutore, t.autore || getDefaultAutore());
    if (D.txEditMotivoWrap) D.txEditMotivoWrap.hidden = (mov !== 'prelievo');
    if (mov === 'prelievo' && D.txEditMotivo) {
      const m = t.descrizione || 'Riequilibrio';
      D.txEditMotivo.value = ['Riequilibrio', 'Spesa personale', 'Altro'].indexOf(m) !== -1 ? m : 'Altro';
    }
  }
  openModal('modalTx');
}

async function saveTxEdit() {
  if (S.editTxId == null) return;
  const imp = parseAmount(D.txEditAmt.value);
  if (!imp || imp <= 0) { toast('Importo non valido', 'warn'); return; }
  const A = getAutoriList();
  let payload;
  if (TXE.mov === 'spesa') {
    onTxEditFonteChange();
    const comune = !(D.txEditPersonale && D.txEditPersonale.checked);
    let quota = null;
    if (comune && Number(TXE.splitA) !== 50) {
      quota = {}; quota[A[0]] = Number(TXE.splitA); if (A[1]) quota[A[1]] = 100 - Number(TXE.splitA);
    }
    payload = {
      tipo_movimento: 'spesa', tipo: 'uscita', importo: imp,
      data: D.txEditData.value || today(),
      categoria_id: D.txEditCat.value ? Number(D.txEditCat.value) : null,
      fonte: TXE.fonte,
      autore: TXE.fonte === 'scatolo' ? null : (TXE.fonteAutore || null),
      personale: !comune,
      straordinaria: comune ? !!(D.txEditStraord && D.txEditStraord.checked) : false,
      quota: quota,
      descrizione: null,
      competenza_da: (D.txEditCompDa && D.txEditCompDa.value) || null,
      competenza_a:  (D.txEditCompA && D.txEditCompA.value) || null,
      competenza_tipo: _txEditCompTipo || null
    };
  } else {
    const autore = (D.txEditAutore && D.txEditAutore.value) || null;
    const desc = TXE.mov === 'prelievo' ? ((D.txEditMotivo && D.txEditMotivo.value) || 'Riequilibrio') : 'Versamento scatolo';
    payload = {
      tipo_movimento: TXE.mov, tipo: TXE.mov === 'versamento' ? 'entrata' : 'uscita', importo: imp,
      data: D.txEditData.value || today(),
      categoria_id: null, fonte: 'scatolo', autore: autore,
      personale: false, straordinaria: false, quota: null, descrizione: desc,
      competenza_da: null, competenza_a: null, competenza_tipo: null
    };
  }
  setBtnLoading(D.txEditSave, true);
  try {
    // optimistic
    const idx = S.tx.findIndex(t => t.id === S.editTxId);
    if (idx >= 0) S.tx[idx] = Object.assign({}, S.tx[idx], payload);
    invalidateTxCharts();
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
    invalidateTxCharts();
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
// Default autore = il nome della WHITELIST che corrisponde all'email loggata
// (NON il nome del profilo Google, che può differire e creare un "autore
// fantasma" fuori lista → equità sbilanciata). Fallback: primo della lista.
function getDefaultAutore() {
  const email = S.currentUser && S.currentUser.email;
  if (email) {
    const u = (S.authorizedUsers || []).find(x => (x.email || '').toLowerCase() === String(email).toLowerCase());
    if (u && u.nome) return u.nome;
  }
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
  renderCatMacroSelect();
  renderEmojiPicker();
  renderColorPicker();
  renderCatBreadcrumb();
  openModal('modalCat');
}

// Selettore "Macro-categoria" (indipendente dall'icona): permette di spostare
// una sotto-categoria in qualsiasi macro tenendo la sua icona.
function renderCatMacroSelect() {
  const sel = D.catEditMacro;
  if (!sel) return;
  sel.innerHTML = EMOJI_CATS.map(m =>
    '<option value="' + m.id + '">' + m.icon + ' ' + esc(macroLabel(m.id)) + '</option>'
  ).join('');
  sel.value = catEditState.macro_categoria || EMOJI_CATS[0].id;
  sel.onchange = () => {
    catEditState.macro_categoria = sel.value;
    renderCatBreadcrumb();
  };
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

  // tab clicks: cambiano solo il GRUPPO di icone mostrato (non la macro)
  $$('.ec-tab', wrap).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.emojiCatIdx = Number(b.getAttribute('data-ci'));
      renderEmojiPicker();
      scrollActiveTabIntoView();
    });
  });
  // emoji clicks: scelgono l'icona (la macro resta quella del selettore)
  $$('.ec-grid button', wrap).forEach(b => {
    b.addEventListener('click', () => {
      catEditState.icona = b.getAttribute('data-e');
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
  // Navigazione SOLO dei gruppi di icone: la macro-categoria è indipendente
  // (si imposta col selettore "Macro-categoria"), così posso scegliere un'icona
  // di un gruppo qualsiasi tenendo la macro che voglio.
  renderEmojiPicker();
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
      if (D.catTabs) $$('button', D.catTabs).forEach(b => b.classList.toggle('active', b.getAttribute('data-tipo') === activeCatTab));
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
  if (D.setBackupKeep) D.setBackupKeep.value = Number(S.prefs.backupKeep) || 30;
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
// ─── BACKUP / RIPRISTINO NEL DB (tabella cdc_backups, 1 riga per giorno) ────
// Logica pura in backup.js (testata). Qui le chiamate REST.

// Rilegge fresco tutte le tabelle dei moduli (+ sistema), con paginazione.
async function fetchAllForBackup() {
  const out = {};
  const groups = CDCBackup.MODULES.concat([CDCBackup.SISTEMA]);
  for (const m of groups) {
    for (const { t } of m.tables) {
      let all = [], offset = 0;
      for (let g = 0; g < 50; g++) {
        const rows = await supaFetch(t + '?select=*&limit=1000&offset=' + offset);
        if (!Array.isArray(rows)) throw new Error('lettura ' + t + ' fallita');
        all.push(...rows);
        if (rows.length < 1000) break;
        offset += 1000;
      }
      out[t] = all;
    }
  }
  return out;
}

// Crea/aggiorna il backup di OGGI (upsert su giorno) + potatura oltre 90 giorni.
async function createBackupNow(silent) {
  try {
    const data = await fetchAllForBackup();
    const payload = Object.assign({ giorno: today(), updated_at: new Date().toISOString() }, CDCBackup.buildBackupRow(data));
    await supaFetch(T.BACKUPS + '?on_conflict=giorno', {
      method: 'POST', body: JSON.stringify(payload),
      headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' }
    });
    try {
      const keep = Number(S.prefs.backupKeep) || 30;   // quanti backup conservare
      const giorni = await supaFetch(T.BACKUPS + '?select=giorno');
      const prune = CDCBackup.backupsToPruneByCount((giorni || []).map(r => r.giorno), keep);
      for (const g of prune) await supaFetch(T.BACKUPS + '?giorno=eq.' + g, { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } });
    } catch (_) {}
    if (!silent) toast('Backup salvato', 'success');
    return true;
  } catch (e) {
    if (!silent) toast('Backup non riuscito: ' + (e && e.message ? e.message : 'errore'), 'error');
    return false;
  }
}

// All'avvio: se manca il backup di oggi, crealo (silenzioso). Se la tabella non
// esiste ancora (RLS script non eseguito) fallisce in silenzio.
async function ensureDailyBackup() {
  try {
    const ex = await supaFetch(T.BACKUPS + '?select=giorno&giorno=eq.' + today());
    if (Array.isArray(ex) && ex.length) return;
    await createBackupNow(true);
  } catch (_) {}
}

function fmtBackupDate(g) {
  if (!g) return '';
  const [y, m, d] = String(g).split('-').map(Number);
  const t = today().split('-').map(Number);
  if (y === t[0] && m === t[1] && d === t[2]) return 'Oggi';
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  if (y === yd.getFullYear() && m === yd.getMonth() + 1 && d === yd.getDate()) return 'Ieri';
  return d + ' ' + (MESI_FULL[m - 1] || '') + ' ' + y;
}

// Backup manuale (dal bottone in Impostazioni)
async function doManualBackup() {
  if (D.setBackupNow) setBtnLoading(D.setBackupNow, true);
  try { await createBackupNow(false); }
  finally { if (D.setBackupNow) setBtnLoading(D.setBackupNow, false); }
}

// Salva "quanti backup tenere" (in prefs, come il tema)
async function saveBackupKeep() {
  let n = parseInt(D.setBackupKeep && D.setBackupKeep.value, 10);
  if (!n || n < 1) n = 1; if (n > 365) n = 365;
  if (D.setBackupKeep) D.setBackupKeep.value = n;
  S.prefs.backupKeep = n;
  saveLocalCache();
  toast('Terrò gli ultimi ' + n + ' backup', 'success');
  const path = T.PREFS + '?id=eq.1';
  const options = { method: 'PATCH', body: JSON.stringify({ dati: S.prefs }) };
  try { if (isOnline()) await supaFetch(path, options); else enqueue({ path, options }); }
  catch { enqueue({ path, options }); }
}

let _restore = { giorno: null, row: null, mods: new Set() };
async function openRestore() {
  _restore = { giorno: null, row: null, mods: new Set() };
  openModal('modalRestore');
  if (!D.restoreBody) return;
  D.restoreBody.innerHTML = '<div class="txt-faint" style="padding:22px;text-align:center">Carico i backup…</div>';
  try {
    const rows = await supaFetch(T.BACKUPS + '?select=giorno,created_at&order=giorno.desc');
    renderRestoreDates(rows || []);
  } catch (e) {
    D.restoreBody.innerHTML = '<div class="cd-warn">Backup non disponibili. Se hai appena creato la tabella, riapri tra poco.</div>';
  }
}
function renderRestoreDates(list) {
  if (!D.restoreBody) return;
  if (!list.length) {
    D.restoreBody.innerHTML = '<div class="txt-faint" style="padding:22px;text-align:center">Ancora nessun backup.<br>Ne viene creato uno in automatico ogni giorno all\'apertura.</div>';
    return;
  }
  D.restoreBody.innerHTML =
    '<div class="restore-step">1 · Scegli una data</div>' +
    '<div class="restore-dates">' + list.map(b =>
      '<button type="button" class="restore-date" data-g="' + b.giorno + '">' + esc(fmtBackupDate(b.giorno)) + '</button>'
    ).join('') + '</div>' +
    '<div id="restoreModsWrap"></div>';
  $$('.restore-date', D.restoreBody).forEach(el => el.addEventListener('click', () => selectRestoreDate(el.getAttribute('data-g'), el)));
}
async function selectRestoreDate(g, el) {
  _restore.giorno = g; _restore.mods = new Set();
  $$('.restore-date', D.restoreBody).forEach(b => b.classList.toggle('active', b === el));
  const wrap = document.getElementById('restoreModsWrap');
  if (wrap) wrap.innerHTML = '<div class="txt-faint" style="padding:12px">Carico i moduli…</div>';
  try {
    const rows = await supaFetch(T.BACKUPS + '?giorno=eq.' + g + '&select=*');
    _restore.row = rows && rows[0];
    renderRestoreModules(_restore.row);
  } catch (e) { if (wrap) wrap.innerHTML = '<div class="cd-warn">Backup non leggibile.</div>'; }
}
function renderRestoreModules(row) {
  const wrap = document.getElementById('restoreModsWrap');
  if (!wrap) return;
  const counts = CDCBackup.moduleCounts(row || {});
  const present = CDCBackup.MODULES.filter(m => counts[m.key] > 0);
  if (!present.length) { wrap.innerHTML = '<div class="txt-faint" style="padding:12px">Questo backup è vuoto.</div>'; return; }
  wrap.innerHTML =
    '<div class="restore-step">2 · Cosa ripristinare</div>' +
    '<div class="restore-mods">' + present.map(m =>
      '<button type="button" class="restore-mod" data-k="' + m.key + '">' +
        '<span class="restore-mod-ic">' + m.icona + '</span>' +
        '<span class="restore-mod-nome">' + esc(m.nome) + '</span>' +
        '<span class="restore-mod-n">' + counts[m.key] + (counts[m.key] === 1 ? ' voce' : ' voci') + '</span>' +
      '</button>'
    ).join('') + '</div>' +
    '<label class="restore-all"><input type="checkbox" id="restoreAll"> <span>Tutti i moduli</span></label>' +
    '<button type="button" id="restoreGo" class="btn-danger" disabled>Ripristina</button>';
  twemojify(wrap);
  const sync = () => {
    const allCb = document.getElementById('restoreAll');
    if (allCb) allCb.checked = present.every(m => _restore.mods.has(m.key));
    const go = document.getElementById('restoreGo');
    if (go) { go.disabled = _restore.mods.size === 0; go.textContent = _restore.mods.size ? ('Ripristina ' + _restore.mods.size + (_restore.mods.size === 1 ? ' modulo' : ' moduli')) : 'Ripristina'; }
  };
  $$('.restore-mod', wrap).forEach(el => el.addEventListener('click', () => {
    const k = el.getAttribute('data-k');
    if (_restore.mods.has(k)) _restore.mods.delete(k); else _restore.mods.add(k);
    el.classList.toggle('sel', _restore.mods.has(k));
    sync();
  }));
  const allCb = document.getElementById('restoreAll');
  if (allCb) allCb.addEventListener('change', () => {
    _restore.mods = new Set(allCb.checked ? present.map(m => m.key) : []);
    $$('.restore-mod', wrap).forEach(el => el.classList.toggle('sel', _restore.mods.has(el.getAttribute('data-k'))));
    sync();
  });
  const go = document.getElementById('restoreGo');
  if (go) go.addEventListener('click', executeRestore);
}
async function executeRestore() {
  const keys = Array.from(_restore.mods);
  if (!keys.length || !_restore.row) return;
  const nomi = keys.map(k => (CDCBackup.MODULES.find(m => m.key === k) || {}).nome).filter(Boolean);
  const ok = await confirmDlg({
    title: '⚠️ Ripristino dati',
    message: 'SOVRASCRIVO questi moduli con il backup del ' + fmtBackupDate(_restore.giorno) + ':\n\n• ' + nomi.join('\n• ') +
      '\n\nI dati attuali di questi moduli verranno sostituiti. Prima salvo un backup di sicurezza di oggi (così è reversibile). Procedo?',
    confirmLabel: 'Sì, ripristina', cancelLabel: 'Annulla', danger: true
  });
  if (!ok) return;
  const go = document.getElementById('restoreGo');
  if (go) setBtnLoading(go, true);
  try {
    await createBackupNow(true);                     // rete di sicurezza: stato attuale in "oggi"
    const plan = CDCBackup.restorePlan(_restore.row, keys);
    for (const { table, rows } of plan) await restoreTable(table, rows);
    await reloadAll(); renderAll();
    closeModal('modalRestore');
    toast('Ripristino completato', 'success');
  } catch (e) {
    toast('Ripristino interrotto: ' + (e && e.message ? e.message : '') + ' — lo stato attuale è salvato nel backup di oggi.', 'error');
  } finally { if (go) setBtnLoading(go, false); }
}
// Riporta una tabella allo stato del backup: upsert delle righe del backup
// (aggiorna le esistenti, reinserisce le mancanti) poi elimina gli "extra"
// aggiunti dopo il backup. Lo stato pre-ripristino è nel backup di oggi.
async function restoreTable(table, rows) {
  rows = rows || [];
  if (rows.length) {
    for (let i = 0; i < rows.length; i += 500) {
      await supaFetch(table + '?on_conflict=id', {
        method: 'POST', body: JSON.stringify(rows.slice(i, i + 500)),
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' }
      });
    }
    const ids = rows.map(r => r.id);
    const list = ids.map(v => (typeof v === 'number' ? v : '"' + String(v).replace(/"/g, '') + '"')).join(',');
    await supaFetch(table + '?id=not.in.(' + list + ')', { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } });
  } else {
    await supaFetch(table + '?id=not.is.null', { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } });
  }
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
  // pulisce TUTTE le chiavi note (comprese spesa/todo/scadenze/queue), non un
  // sottoinsieme scritto a mano.
  Object.values(LS).forEach(k => localStorage.removeItem(k));
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
  // Mantieni il token della sessione allineato (login iniziale, refresh automatico,
  // logout) così supaFetch invia sempre il JWT giusto per le RLS.
  if (!S._authSubscribed) {
    S._authSubscribed = true;
    try {
      client.auth.onAuthStateChange((_e, sess) => {
        S.accessToken = (sess && sess.access_token) || null;
        // tieni allineato anche il canale Realtime (refresh token / re-login)
        try { if (S.realtimeClient && S.realtimeClient.realtime && S.realtimeClient.realtime.setAuth) S.realtimeClient.realtime.setAuth(S.accessToken); } catch (_) {}
      });
    } catch (_) {}
  }
  try {
    const { data: { session } } = await client.auth.getSession();
    S.accessToken = (session && session.access_token) || null;
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
    // Con le RLS attive il Realtime filtra gli eventi in base al ruolo: il canale
    // deve autenticarsi come l'UTENTE (JWT), non come anon, altrimenti smette di
    // ricevere le modifiche. Innocuo con RLS permissive.
    try { if (S.accessToken && S.realtimeClient.realtime && S.realtimeClient.realtime.setAuth) S.realtimeClient.realtime.setAuth(S.accessToken); } catch (_) {}
    const ch = S.realtimeClient.channel('conti-di-casa-live');
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.TX }, p => onTxChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.CATS }, p => onCatChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.BUDGET }, p => onBudgetChange(p));
    ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: T.PREFS, filter: 'id=eq.1' }, p => onPrefsChange(p));
    ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: T.VER, filter: 'id=eq.1' }, p => onVersionChange(p && p.new && p.new.sha));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.SPESA }, p => onSpesaChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.TODO },  p => onTodoChange(p));
    ch.on('postgres_changes', { event: '*', schema: 'public', table: T.SCADENZE }, p => onScadenzaChange(p));
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
  // Invalida cache aggregati DONUT/TREND/SALDO per forzare ricalcolo
  // delle statistiche/grafici al prossimo render.
  invalidateTxCharts();
  saveLocalCache();
  // aggiorna sempre il widget Home (mini donut + saldo) e la view attiva.
  // Se siamo nel modulo Conti renderizziamo tutto (saldo + carousel
  // donut/trend/autori) per riflettere subito la novità.
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
      // Refresh esplicito della lista spesa: il WebSocket Realtime su
      // Safari iOS PWA si addormenta in background → recuperiamo lo
      // stato vero della tabella quando torna visibile
      refreshSpesaNow();
      refreshTodoNow();
      refreshScadenzeNow();
    }
  });
  window.addEventListener('online', () => {
    ensureRealtimeAlive();
    checkAppVersionNow();
    refreshSpesaNow();
    refreshTodoNow();
    refreshScadenzeNow();
  });
  // Polling di backup: ogni 60s se la tab è visibile, controlla il SHA.
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
  if (D.setRestore)    D.setRestore.addEventListener('click', openRestore);
  if (D.setBackupNow)  D.setBackupNow.addEventListener('click', doManualBackup);
  if (D.setBackupKeepSave) D.setBackupKeepSave.addEventListener('click', saveBackupKeep);
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
    refreshListQuickActive();
    renderList();
  });
  if (D.listPeriodTo) D.listPeriodTo.addEventListener('change', () => {
    S.listTo = D.listPeriodTo.value || null;
    refreshListQuickActive();
    renderList();
  });
  // Pulsanti scelta rapida periodo: Ultimo anno / 6 mesi / 3 mesi / Questo mese
  $$('.lpq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-quick');
      applyListQuickPeriod(q);
    });
  });
  // Pulsante "Seleziona Filtri" → apre modal
  if (D.btnOpenFilters)   D.btnOpenFilters.addEventListener('click', openFiltersModal);
  if (D.btnApplyFilters)  D.btnApplyFilters.addEventListener('click', applyFiltersFromModal);
  if (D.btnResetFilters)  D.btnResetFilters.addEventListener('click', resetFiltersFromModal);
  // ── Transazioni v2: ricerca / periodo / categorie / paginazione ──
  if (D.tx2Search) {
    D.tx2Search.addEventListener('input', () => {
      _tx2State().search = D.tx2Search.value || '';
      _tx2State().page = 1;
      if (D.tx2SearchClear) D.tx2SearchClear.hidden = !D.tx2Search.value;
      drawTx2();
    });
  }
  if (D.tx2SearchClear) D.tx2SearchClear.addEventListener('click', () => {
    _tx2State().search = ''; _tx2State().page = 1;
    if (D.tx2Search) D.tx2Search.value = '';
    D.tx2SearchClear.hidden = true;
    drawTx2();
  });
  if (D.tx2Quick) {
    $$('button', D.tx2Quick).forEach(b => b.addEventListener('click', () => tx2ApplyQuick(b.getAttribute('data-q'))));
  }
  if (D.tx2From) D.tx2From.addEventListener('change', tx2OnDateChange);
  if (D.tx2To)   D.tx2To.addEventListener('change', tx2OnDateChange);
  if (D.tx2DatesClear) D.tx2DatesClear.addEventListener('click', () => {
    const st = _tx2State(); st.from = null; st.to = null; st.quick = null; st.page = 1;
    tx2SyncToolbar(); drawTx2();
  });
  if (D.tx2ScatoloChip) D.tx2ScatoloChip.addEventListener('click', () => {
    const st = _tx2State(); st.scatoloOnly = !st.scatoloOnly; st.page = 1;
    tx2SyncToolbar(); drawTx2();
  });
  // Bottone ⚙ → mostra/nasconde il pannello filtri
  if (D.tx2FiltBtn && D.tx2Panel) {
    D.tx2FiltBtn.addEventListener('click', () => {
      const open = D.tx2Panel.hidden;
      D.tx2Panel.hidden = !open;
      D.tx2FiltBtn.classList.toggle('open', open);
    });
  }
  if (D.tx2PerPage) {
    $$('button', D.tx2PerPage).forEach(b => b.addEventListener('click', () => {
      _tx2State().perPage = Number(b.getAttribute('data-pp')) || 20;
      _tx2State().page = 1;
      drawTx2();
    }));
  }
  if (D.tx2Prev) D.tx2Prev.addEventListener('click', () => { const st = _tx2State(); if (st.page > 1) { st.page--; drawTx2(); window.scrollTo({top:0,behavior:'instant'}); } });
  if (D.tx2Next) D.tx2Next.addEventListener('click', () => { const st = _tx2State(); st.page++; drawTx2(); window.scrollTo({top:0,behavior:'instant'}); });
  // ── Wizard nuova transazione ──
  if (D.wizClose) D.wizClose.addEventListener('click', closeTxWizard);
  if (D.wizBack)  D.wizBack.addEventListener('click', wizBack);
  if (D.wizNext)  D.wizNext.addEventListener('click', wizNext);
  if (D.wizDelFooter) D.wizDelFooter.addEventListener('click', wizDelete);
  if (D.wizNote) D.wizNote.addEventListener('input', () => { WIZ.note = D.wizNote.value; });
  // Tipo di movimento (spesa / versamento / prelievo)
  if (D.wizMov) {
    $$('button', D.wizMov).forEach(b => b.addEventListener('click', () => setWizMov(b.getAttribute('data-mov'))));
  }
  // In comune / Personale
  if (D.wizComune) {
    $$('button', D.wizComune).forEach(b => b.addEventListener('click', () => setWizComune(b.getAttribute('data-val'))));
  }
  // Motivo prelievo (statico)
  if (D.wizMotivo) {
    $$('button', D.wizMotivo).forEach(b => b.addEventListener('click', () => { WIZ.motivo = b.getAttribute('data-motivo'); renderWizMotivo(); updateWizNext(); }));
  }
  // Spesa straordinaria
  if (D.wizStraord) D.wizStraord.addEventListener('change', () => { WIZ.straord = D.wizStraord.checked; });
  // Slider divisione personalizzata
  if (D.wizSplitRange) D.wizSplitRange.addEventListener('input', () => { WIZ.splitA = Number(D.wizSplitRange.value); renderWizSplitReadout(); updateWizNext(); });
  // Bottone "Registra il riequilibrio" nella dashboard
  if (D.cdSettleBtn) D.cdSettleBtn.addEventListener('click', registerRiequilibrio);
  // Card scatolo cliccabile → pagina Transazioni filtrata sui movimenti scatolo
  if (D.cdScatoloCard) {
    const goScatolo = () => {
      const st = _tx2State();
      st.scatoloOnly = true; st.page = 1;
      switchView('list');
      tx2SyncToolbar(); drawTx2();
    };
    D.cdScatoloCard.addEventListener('click', goScatolo);
    D.cdScatoloCard.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goScatolo(); }
    });
  }
  // Statistiche: i due bottoni fanno da toggle (ripremendo → vista principale)
  if (D.statsSpeseMeseBtn) D.statsSpeseMeseBtn.addEventListener('click', () => toggleStatsView('mese'));
  if (D.statsMediaBtn) D.statsMediaBtn.addEventListener('click', () => toggleStatsView('media'));
  // Selettore mese della vista 'mese' (sincronizzato col grafico)
  if (D.statsDetPrev) D.statsDetPrev.addEventListener('click', () => statsDetShiftMonth(-1));
  if (D.statsDetNext) D.statsDetNext.addEventListener('click', () => statsDetShiftMonth(1));
  // Dashboard: i riquadri "Spese per questo mese" / "Media mensile" aprono la
  // vista Statistiche nel dettaglio corrispondente.
  const goStatsDetail = (mode) => {
    switchView('stats');
    S.statsView = mode;
    if (mode === 'mese') S.statsSelMonth = new Date().getMonth() + 1;
    renderStats();
  };
  const bindCell = (el, mode) => {
    if (!el) return;
    el.addEventListener('click', () => goStatsDetail(mode));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStatsDetail(mode); } });
  };
  bindCell(D.cdAvgMonthCell, 'mese');
  bindCell(D.cdAvgMeanCell, 'media');
  if (D.cdGuidaBtn) D.cdGuidaBtn.addEventListener('click', () => openModal('modalGuida'));
  // Statistiche Mese: frecce selettore mese + toggle dettagli per utente
  if (D.statsMPrev) D.statsMPrev.addEventListener('click', () => statsMeseShiftMonth(-1));
  if (D.statsMNext) D.statsMNext.addEventListener('click', () => statsMeseShiftMonth(1));
  if (D.statsMTitle) D.statsMTitle.addEventListener('click', () => { S.statsMeseDetail = !S.statsMeseDetail; renderStatsMese(); });
  // Riallineamento fondi scatolo
  if (D.tx2RiallineaBtn) D.tx2RiallineaBtn.addEventListener('click', openRiallineo);
  if (D.rialDir) $$('button[data-val]', D.rialDir).forEach(b => b.addEventListener('click', () => setRialDir(b.getAttribute('data-val'))));
  if (D.rialSave) D.rialSave.addEventListener('click', saveRiallineo);
  if (D.wizNumpad) {
    $$('button', D.wizNumpad).forEach(b => {
      // niente focus sul bottone → niente auto-scroll del contenitore al primo tap
      b.addEventListener('mousedown', e => e.preventDefault());
      b.addEventListener('click', () => wizNumpadPress(b.getAttribute('data-k')));
    });
  }
  // Step 3: data pagamento (NON tocca le date di competenza: sono indipendenti)
  if (D.wizDataPag) {
    D.wizDataPag.addEventListener('change', renderWizDataPagLabel);
  }
  if (D.wizDataPagBtn && D.wizDataPag) {
    let _opening = false;
    D.wizDataPagBtn.addEventListener('click', e => {
      if (e.target === D.wizDataPag) return;
      if (_opening) return;
      _opening = true; setTimeout(() => { _opening = false; }, 400);
      try { if (typeof D.wizDataPag.showPicker === 'function') { D.wizDataPag.showPicker(); return; } } catch (err) {}
      try { D.wizDataPag.focus(); D.wizDataPag.click(); } catch (err) {}
    });
  }
  // Step 3: preset competenza
  if (D.wizCompQuick) {
    $$('button', D.wizCompQuick).forEach(b => b.addEventListener('click', () => setWizComp(b.getAttribute('data-comp'))));
  }
  if (D.wizCompDa) D.wizCompDa.addEventListener('change', onWizCompDaChange);
  if (D.wizCompA)  D.wizCompA.addEventListener('change', onWizCompAChange);
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
  // Date pill: l'INTERO bottone deve essere cliccabile (non solo l'icona
  // triangolino). Il click apre il date picker via showPicker (Chrome/Safari
  // 16+) o fallback su focus+click sull'input nativo (browser più vecchi).
  if (D.qaDatePicker) {
    D.qaDatePicker.addEventListener('change', renderQaDateLabel);
    D.qaDatePicker.addEventListener('input', renderQaDateLabel);
  }
  if (D.qaDateBtn && D.qaDatePicker) {
    // Il qaDateBtn è un <label for="qaDatePicker">: cliccando OVUNQUE
    // sulla pill (icona, label, freccia, padding), il browser dispatch
    // nativamente un click sull'input → apre il calendarietto.
    // Però:
    // - Firefox/alcuni browser su date input non aprono il picker via
    //   label-click-dispatch (solo focus). Quindi chiamiamo esplicitamente
    //   showPicker() come backup.
    // - Per evitare doppia apertura usiamo un flag con timeout breve.
    let _qaPickerOpening = false;
    D.qaDateBtn.addEventListener('click', e => {
      // Se l'evento è già stato dispatched DAL label sull'input stesso,
      // l'apertura nativa è in corso: non duplichiamo.
      if (e.target === D.qaDatePicker) return;
      if (_qaPickerOpening) return;
      _qaPickerOpening = true;
      setTimeout(() => { _qaPickerOpening = false; }, 400);
      // showPicker() richiede user gesture: siamo dentro un handler click
      // sincrono, quindi è valido.
      try {
        if (typeof D.qaDatePicker.showPicker === 'function') {
          D.qaDatePicker.showPicker();
          return;
        }
      } catch (err) {
        // showPicker può rifiutare in alcuni contesti — proviamo focus+click
      }
      try {
        // fallback per browser più vecchi
        D.qaDatePicker.focus();
        D.qaDatePicker.click();
      } catch (err) {}
    });
  }
  // tx edit
  D.txEditSave.addEventListener('click', saveTxEdit);
  D.txEditDelete.addEventListener('click', deleteTxEdit);
  // Edit coerente per tipo movimento: personale, fonte, divisione
  if (D.txEditPersonale) D.txEditPersonale.addEventListener('change', updateTxEditPersonaleUI);
  if (D.txEditFonte) D.txEditFonte.addEventListener('change', onTxEditFonteChange);
  if (D.txEditSplit) D.txEditSplit.addEventListener('change', () => {
    TXE.splitMode = D.txEditSplit.value;
    if (TXE.splitMode === '5050') TXE.splitA = 50;
    else if (TXE.splitMode === 'allA') TXE.splitA = 100;
    else if (TXE.splitMode === 'allB') TXE.splitA = 0;
    renderTxEditSplit();
  });
  if (D.txEditSplitRange) D.txEditSplitRange.addEventListener('input', () => { TXE.splitA = Number(D.txEditSplitRange.value); renderTxEditSplitReadout(); });
  // Edit: preset periodo competenza + modifica manuale date (deseleziona preset)
  if (D.txEditCompQuick) {
    $$('button', D.txEditCompQuick).forEach(b => b.addEventListener('click', () => setTxEditComp(b.getAttribute('data-comp'))));
  }
  const _txEditCompManual = () => {
    _txEditCompTipo = null;
    if (D.txEditCompQuick) $$('button', D.txEditCompQuick).forEach(x => x.classList.remove('active'));
  };
  if (D.txEditCompDa) D.txEditCompDa.addEventListener('change', _txEditCompManual);
  if (D.txEditCompA)  D.txEditCompA.addEventListener('change', _txEditCompManual);
  // Lista della spesa: modal add/edit
  if (D.spesaEditSave)     D.spesaEditSave.addEventListener('click', saveSpesaEdit);
  if (D.spesaEditDelete)   D.spesaEditDelete.addEventListener('click', deleteSpesaEdit);
  if (D.spesaEditQtyMinus) D.spesaEditQtyMinus.addEventListener('click', () => updateSpesaEditQty(_spesaEditState.qty - 1));
  if (D.spesaEditQtyPlus)  D.spesaEditQtyPlus.addEventListener('click', () => updateSpesaEditQty(_spesaEditState.qty + 1));
  if (D.spesaEditNome)     D.spesaEditNome.addEventListener('input', onSpesaEditNomeInput);
  // Click sull'icona circolare CENTRALE → apri modal selettore icone (spesa)
  if (D.spesaEditIconBtn) {
    D.spesaEditIconBtn.addEventListener('click', () => openIconPicker('spesa'));
  }
  // Click su un suggerimento laterale spesa → swap col centro
  $$('.spesa-icon-side[data-slot]').forEach(el => {
    el.addEventListener('click', () => swapSpesaIcon(Number(el.getAttribute('data-slot'))));
  });

  // ── ToDo modal: bind add/edit ────────────────────────────
  if (D.todoEditSave)    D.todoEditSave.addEventListener('click', saveTodoEdit);
  if (D.todoEditDelete)  D.todoEditDelete.addEventListener('click', deleteTodoEdit);
  if (D.todoEditNome)    D.todoEditNome.addEventListener('input', onTodoEditNomeInput);
  if (D.todoEditIconBtn) D.todoEditIconBtn.addEventListener('click', () => openIconPicker('todo'));
  $$('.spesa-icon-side[data-todo-slot]').forEach(el => {
    el.addEventListener('click', () => swapTodoIcon(Number(el.getAttribute('data-todo-slot'))));
  });
  // Modal scope svuotamento ToDo
  const btnClearTodoToDo = document.getElementById('clearTodoToDo');
  const btnClearTodoDone = document.getElementById('clearTodoDone');
  const btnClearTodoAll  = document.getElementById('clearTodoAll');
  if (btnClearTodoToDo) btnClearTodoToDo.addEventListener('click', () => clearTodoScope('toDo'));
  if (btnClearTodoDone) btnClearTodoDone.addEventListener('click', () => clearTodoScope('done'));
  if (btnClearTodoAll)  btnClearTodoAll.addEventListener('click',  () => clearTodoScope('all'));

  // ── Scadenze: modal bind + chips + calendario nav ──
  if (D.scadenzaEditSave)    D.scadenzaEditSave.addEventListener('click', saveScadenzaEdit);
  if (D.scadenzaEditDelete)  D.scadenzaEditDelete.addEventListener('click', deleteScadenzaEdit);
  if (D.scadenzaEditTitolo)  D.scadenzaEditTitolo.addEventListener('input', onScadenzaEditTitoloInput);
  if (D.scadenzaEditIconBtn) D.scadenzaEditIconBtn.addEventListener('click', () => openIconPicker('scadenza'));
  $$('.spesa-icon-side[data-scadenza-slot]').forEach(el => {
    el.addEventListener('click', () => swapScadenzaIcon(Number(el.getAttribute('data-scadenza-slot'))));
  });
  // Chips anticipo
  if (D.scadenzaAnticipoChips) {
    $$('.anticipo-chip', D.scadenzaAnticipoChips).forEach(c => {
      c.addEventListener('click', () => updateScadenzaAnticipoChips(c.getAttribute('data-anticipo')));
    });
  }
  // Chips ricorrenza
  if (D.scadenzaRicorrenzaChips) {
    $$('.anticipo-chip', D.scadenzaRicorrenzaChips).forEach(c => {
      c.addEventListener('click', () => updateScadenzaRicorrenzaChips(c.getAttribute('data-ric')));
    });
  }
  // Calendario nav
  if (D.scadCalPrev) D.scadCalPrev.addEventListener('click', () => shiftScadCalMonth(-1));
  if (D.scadCalNext) D.scadCalNext.addEventListener('click', () => shiftScadCalMonth(1));
  // Modal scope svuotamento Scadenze
  const btnClearScadPassed = document.getElementById('clearScadPassed');
  const btnClearScadDone   = document.getElementById('clearScadDone');
  const btnClearScadAll    = document.getElementById('clearScadAll');
  if (btnClearScadPassed) btnClearScadPassed.addEventListener('click', () => clearScadenzeScope('passed'));
  if (btnClearScadDone)   btnClearScadDone.addEventListener('click',   () => clearScadenzeScope('done'));
  if (btnClearScadAll)    btnClearScadAll.addEventListener('click',    () => clearScadenzeScope('all'));
  // Modal "segna come completata"
  if (D.scadCompleteSave) D.scadCompleteSave.addEventListener('click', saveScadenzaComplete);
  if (D.scadCompleteNota) {
    D.scadCompleteNota.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); saveScadenzaComplete(); }
    });
  }
  if (D.iconPickerSearch) {
    D.iconPickerSearch.addEventListener('input', e => {
      _iconPickerSearch = e.target.value || '';
      renderIconPickerGrid();
    });
  }
  // Modal scelta scope svuotamento Lista Spesa
  const btnClearToBuy  = document.getElementById('clearSpesaToBuy');
  const btnClearBought = document.getElementById('clearSpesaBought');
  const btnClearAll    = document.getElementById('clearSpesaAll');
  if (btnClearToBuy)  btnClearToBuy.addEventListener('click',  () => clearSpesaScope('toBuy'));
  if (btnClearBought) btnClearBought.addEventListener('click', () => clearSpesaScope('bought'));
  if (btnClearAll)    btnClearAll.addEventListener('click',    () => clearSpesaScope('all'));
  // Home Gestione Casa: tap su widget moduli
  // Il click su qualsiasi parte della card apre il modulo, TRANNE che sul
  // drag handle (.mc-drag) che serve per riordinare i widget.
  $$('.module-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target && e.target.closest('.mc-drag')) return; // ignora drag handle
      const mod = card.getAttribute('data-mod');
      if (mod === 'conti')         switchView('conti');
      else if (mod === 'spesa')    switchView('spesa');
      else if (mod === 'todo')     switchView('todo');
      else if (mod === 'scadenze') switchView('scadenze-list');
      else                         toast('Modulo in arrivo', 'info');
    });
  });
  // Modulo Conti: pulsanti per andare a sotto-pagine
  if (D.goToList)      D.goToList.addEventListener('click', () => switchView('list'));
  if (D.goToCategorie) D.goToCategorie.addEventListener('click', () => switchView('cat'));
  // cat edit (modalCat resta nel DOM; i trigger della pagina Categorie
  // sono stati rimossi nel rebuild → guardie su btnAddCat / catTabs)
  if (D.catEditSave)   D.catEditSave.addEventListener('click', saveCatEdit);
  if (D.catEditDelete) D.catEditDelete.addEventListener('click', deleteCatEdit);
  if (D.btnAddCat)     D.btnAddCat.addEventListener('click', () => openCatEdit(null));
  if (D.catTabs) {
    $$('button', D.catTabs).forEach(b => b.addEventListener('click', () => {
      activeCatTab = b.getAttribute('data-tipo');
      $$('button', D.catTabs).forEach(x => x.classList.toggle('active', x === b));
      renderCatView();
    }));
  }
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
  if (action === 'add-uscita') setTimeout(() => openTxWizard('uscita'), 300);
  else if (action === 'add-entrata') setTimeout(() => openTxWizard('entrata'), 300);
}

// ─── PULL TO REFRESH ────────────────────────────────────────
// DISABILITATO (richiesta utente: troppi reload accidentali).
// - Il PTR nativo del browser è spento da overscroll-behavior:contain in CSS
// - Il PTR custom è stato rimosso: nessun touch handler globale per il drag
// - L'elemento #ptr viene nascosto definitivamente
function setupPullToRefresh() {
  const PTR = document.getElementById('ptr');
  if (PTR) PTR.style.display = 'none';
  // Blocco aggressivo del pull-to-refresh nativo iOS (Safari in modalità PWA
  // ignora overscroll-behavior:contain): se l'utente trascina verso il basso
  // mentre la pagina è già scrollata al top, preveniamo l'evento di default
  // che farebbe il reload. Restano comunque scrollabili tutti i container
  // interni (modal sheets) perché controlliamo il target.
  let startY = 0;
  let startScrollY = 0;
  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    startScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    // Se siamo al top della pagina e l'utente trascina verso il basso → blocca
    if (startScrollY <= 0) {
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        // Verifica che il drag non sia dentro un elemento scrollabile interno
        // (es. sheet-body di un modal): risali l'albero cercando container
        // con overflow auto/scroll che NON sono al top del proprio scroll
        let el = e.target;
        let allowScroll = false;
        while (el && el !== document.body && el !== document.documentElement) {
          if (el.scrollHeight > el.clientHeight) {
            const ov = getComputedStyle(el).overflowY;
            if (ov === 'auto' || ov === 'scroll') {
              if (el.scrollTop > 0) { allowScroll = true; break; }
            }
          }
          el = el.parentElement;
        }
        if (!allowScroll) {
          try { e.preventDefault(); } catch (_) {}
        }
      }
    }
  }, { passive: false });
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
  if (S.cats.length || S.tx.length || S.spesa.length || S.todo.length || S.scadenze.length) {
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
      if (!S.cats.length && !S.tx.length && !S.spesa.length && !S.todo.length && !S.scadenze.length) {
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
  // backup giornaliero automatico nel DB (silenzioso, non blocca l'avvio)
  setTimeout(() => { ensureDailyBackup(); }, 4000);
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
