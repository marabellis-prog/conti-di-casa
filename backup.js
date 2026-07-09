// ============================================================================
//  backup.js — logica PURA di backup/ripristino (UMD, testabile con node)
//  Un backup = una riga per GIORNO in cdc_backups, con i dati dei moduli in
//  colonne JSONB distinte. Qui solo trasformazioni pure; le chiamate REST stanno
//  in app.js. Vedi tabella in RLS-conti-di-casa.sql.
// ============================================================================
;(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CDCBackup = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // I 4 moduli dell'app + "sistema" (salvato ma non ripristinabile da UI:
  // prefs/whitelist non vanno sovrascritti per errore).
  const MODULES = [
    { key: 'conti',    nome: 'Conti di Casa',     icona: '💰', tables: [
      { k: 'transazioni', t: 'cdc_transazioni' }, { k: 'categorie', t: 'cdc_categorie' }, { k: 'budget', t: 'cdc_budget' } ] },
    { key: 'spesa',    nome: 'Lista della spesa', icona: '🛒', tables: [ { k: 'lista_spesa', t: 'cdc_lista_spesa' } ] },
    { key: 'todo',     nome: 'To-Do',             icona: '✅', tables: [ { k: 'lista_todo', t: 'cdc_lista_todo' } ] },
    { key: 'scadenze', nome: 'Scadenze',          icona: '📅', tables: [ { k: 'scadenze', t: 'cdc_scadenze' } ] },
  ];
  const SISTEMA = { key: 'sistema', tables: [ { k: 'prefs', t: 'cdc_prefs' }, { k: 'authorized_users', t: 'cdc_authorized_users' } ] };
  const RESTORABLE_KEYS = MODULES.map(m => m.key);

  // Costruisce l'oggetto-riga di backup da una mappa {nomeTabella: righe[]}.
  function buildBackupRow(dataByTable) {
    const row = {};
    MODULES.concat([SISTEMA]).forEach(m => {
      const obj = {};
      m.tables.forEach(({ k, t }) => { obj[k] = Array.isArray(dataByTable[t]) ? dataByTable[t] : []; });
      row[m.key] = obj;
    });
    return row; // { conti:{transazioni,categorie,budget}, spesa:{lista_spesa}, ... }
  }

  // Numero di elementi per modulo (per le card del ripristino). Considera solo
  // la tabella "principale" del modulo (transazioni, lista_spesa, ...): è ciò che
  // l'utente riconosce come "quante cose c'erano".
  function moduleCounts(backupRow) {
    const out = {};
    MODULES.forEach(m => {
      const main = m.tables[0];
      const box = (backupRow && backupRow[m.key]) || {};
      out[m.key] = Array.isArray(box[main.k]) ? box[main.k].length : 0;
    });
    return out;
  }

  // I moduli effettivamente presenti (con almeno un dato) in un backup.
  function modulesInBackup(backupRow) {
    const counts = moduleCounts(backupRow);
    return MODULES.filter(m => counts[m.key] > 0).map(m => m.key);
  }

  // Piano di ripristino: per ogni modulo selezionato, la lista {table, rows} da
  // riscrivere. Ignora chiavi non ripristinabili/sconosciute.
  function restorePlan(backupRow, selectedKeys) {
    const plan = [];
    (selectedKeys || []).forEach(key => {
      if (RESTORABLE_KEYS.indexOf(key) < 0) return;
      const mod = MODULES.find(m => m.key === key);
      const box = (backupRow && backupRow[key]) || {};
      mod.tables.forEach(({ k, t }) => {
        plan.push({ table: t, rows: Array.isArray(box[k]) ? box[k] : [] });
      });
    });
    return plan;
  }

  // Giorni da conservare: mantiene gli ultimi `keepDays`; ritorna i `giorno`
  // (stringhe 'YYYY-MM-DD') da eliminare, dato l'elenco esistente e "oggi".
  function backupsToPrune(giorni, todayStr, keepDays) {
    keepDays = keepDays || 90;
    const cutoff = new Date(todayStr + 'T00:00:00');
    cutoff.setDate(cutoff.getDate() - keepDays);
    const pad = n => String(n).padStart(2, '0');
    const cut = cutoff.getFullYear() + '-' + pad(cutoff.getMonth() + 1) + '-' + pad(cutoff.getDate());
    return (giorni || []).filter(g => g < cut);
  }

  return { MODULES, SISTEMA, RESTORABLE_KEYS, buildBackupRow, moduleCounts, modulesInBackup, restorePlan, backupsToPrune };
});
