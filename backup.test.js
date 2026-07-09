// Test della logica pura di backup/ripristino (node --test).
const test = require('node:test');
const assert = require('node:assert');
const B = require('./backup.js');

const sampleData = {
  cdc_transazioni: [{ id: 1 }, { id: 2 }, { id: 3 }],
  cdc_categorie: [{ id: 10 }, { id: 11 }],
  cdc_budget: [],
  cdc_lista_spesa: [{ id: 'a' }],
  cdc_lista_todo: [],
  cdc_scadenze: [{ id: 'x' }, { id: 'y' }],
  cdc_prefs: [{ id: 1 }],
  cdc_authorized_users: [{ email: 'a@b.c' }, { email: 'd@e.f' }],
};

test('buildBackupRow: dati raggruppati per modulo (incl. sistema)', () => {
  const row = B.buildBackupRow(sampleData);
  assert.strictEqual(row.conti.transazioni.length, 3);
  assert.strictEqual(row.conti.categorie.length, 2);
  assert.deepStrictEqual(row.conti.budget, []);
  assert.strictEqual(row.spesa.lista_spesa.length, 1);
  assert.strictEqual(row.scadenze.scadenze.length, 2);
  assert.strictEqual(row.sistema.authorized_users.length, 2);
});

test('moduleCounts: conteggio della tabella principale di ogni modulo', () => {
  const row = B.buildBackupRow(sampleData);
  const c = B.moduleCounts(row);
  assert.deepStrictEqual(c, { conti: 3, spesa: 1, todo: 0, scadenze: 2 });
});

test('modulesInBackup: solo i moduli con dati', () => {
  const row = B.buildBackupRow(sampleData);
  assert.deepStrictEqual(B.modulesInBackup(row).sort(), ['conti', 'scadenze', 'spesa']); // todo vuoto escluso
});

test('restorePlan: espande i moduli scelti nelle loro tabelle', () => {
  const row = B.buildBackupRow(sampleData);
  const plan = B.restorePlan(row, ['conti', 'scadenze']);
  const tables = plan.map(p => p.table);
  assert.deepStrictEqual(tables, ['cdc_transazioni', 'cdc_categorie', 'cdc_budget', 'cdc_scadenze']);
  assert.strictEqual(plan.find(p => p.table === 'cdc_transazioni').rows.length, 3);
  assert.strictEqual(plan.find(p => p.table === 'cdc_scadenze').rows.length, 2);
});

test('restorePlan: ignora chiavi non ripristinabili (es. sistema) e sconosciute', () => {
  const row = B.buildBackupRow(sampleData);
  const plan = B.restorePlan(row, ['sistema', 'boh', 'spesa']);
  assert.deepStrictEqual(plan.map(p => p.table), ['cdc_lista_spesa']); // solo spesa
});

test('restorePlan TUTTI: 4 moduli → tutte le loro tabelle', () => {
  const row = B.buildBackupRow(sampleData);
  const plan = B.restorePlan(row, B.RESTORABLE_KEYS);
  assert.strictEqual(plan.length, 6); // 3 (conti) + 1 + 1 + 1
});

test('backupsToPrune: elimina i backup più vecchi di keepDays', () => {
  const giorni = ['2026-01-01', '2026-04-01', '2026-06-30', '2026-07-09'];
  const prune = B.backupsToPrune(giorni, '2026-07-09', 90); // taglio ~10 apr
  assert.ok(prune.includes('2026-01-01'));
  assert.ok(prune.includes('2026-04-01'));
  assert.ok(!prune.includes('2026-06-30'));
  assert.ok(!prune.includes('2026-07-09'));
});
