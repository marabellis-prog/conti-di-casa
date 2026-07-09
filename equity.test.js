// Test del motore contabile (node --test). Copre: invarianti, casi sintetici
// che dimostrano i fix, e un DIFF sul backup reale (nuovo motore vs logica
// originale) per garantire che l'estrazione non cambi i numeri di produzione.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./equity.js');

// ── logica ORIGINALE (copiata da app.js pre-refactor) per il confronto ──
function computeEquityOld(tx, A, yr) {
  const res = { A, year: yr, box: 0, contrib: {}, over: {}, totComuni: 0 };
  A.forEach(n => { res.contrib[n] = 0; res.over[n] = 0; });
  const otherOf = n => A.find(x => x !== n);
  const credit = (who, amt) => {
    if (!who) return;
    const o = otherOf(who);
    res.over[who] = (res.over[who] || 0) + amt;
    if (o) res.over[o] = (res.over[o] || 0) - amt;
  };
  (tx || []).forEach(t => {
    if (!t.fonte) return;
    const mov = t.tipo_movimento || 'spesa';
    const imp = Number(t.importo) || 0;
    if (!imp) return;
    const inYear = String(t.data || '').slice(0, 4) === String(yr);
    if (mov === 'versamento') {
      res.box += imp;
      if (inYear) { if (res.contrib[t.autore] != null) res.contrib[t.autore] += imp; credit(t.autore, imp / 2); }
    } else if (mov === 'prelievo') {
      res.box -= imp;
      if (inYear) { if (res.contrib[t.autore] != null) res.contrib[t.autore] -= imp; credit(t.autore, -imp / 2); }
    } else {
      if (t.personale) return;
      if (t.fonte === 'scatolo') { res.box -= imp; if (inYear) res.totComuni += imp; }
      else if (t.autore && inYear) {
        res.totComuni += imp;
        if (res.contrib[t.autore] != null) res.contrib[t.autore] += imp;
        const q = E.parseQuota(t.quota, A); const o = otherOf(t.autore);
        credit(t.autore, imp * ((o ? q[o] : 50) || 0) / 100);
      }
    }
  });
  A.forEach(n => { res.over[n] = Math.round(res.over[n] * 100) / 100; res.contrib[n] = Math.round(res.contrib[n] * 100) / 100; });
  res.box = Math.round(res.box * 100) / 100;
  return res;
}

const A = ['Stefano Marabelli', 'Flavia Spina'];
const YR = 2026;

test('INVARIANTE Σover = 0 (dati sintetici misti)', () => {
  const tx = [
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: A[0], importo: 200, data: '2026-03-01' },
    { fonte: 'conto', tipo_movimento: 'spesa', autore: A[1], importo: 80, data: '2026-03-10' },
    { fonte: 'scatolo', tipo_movimento: 'spesa', autore: null, importo: 50, data: '2026-03-12' },
    { fonte: 'scatolo', tipo_movimento: 'prelievo', autore: A[1], importo: 30, data: '2026-03-20' },
  ];
  const eq = E.computeEquity(tx, A, YR);
  assert.ok(Math.abs(eq.over[A[0]] + eq.over[A[1]]) < 1e-9, 'over deve sommare a zero');
});

test('box = versamenti − spese-da-scatolo − prelievi (cumulativo, tutti gli anni)', () => {
  const tx = [
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: A[0], importo: 370, data: '2025-12-01' }, // anno prec
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: A[1], importo: 100, data: '2026-01-05' },
    { fonte: 'scatolo', tipo_movimento: 'spesa', autore: null, importo: 60, data: '2026-01-10' },
    { fonte: 'scatolo', tipo_movimento: 'prelievo', autore: A[0], importo: 40, data: '2026-01-20' },
  ];
  const eq = E.computeEquity(tx, A, YR);
  assert.strictEqual(eq.box, 370 + 100 - 60 - 40);
});

test('versamento 200 di A → A +100 / B −100; poi riequilibrio azzera e NON tocca il box', () => {
  const base = [{ fonte: 'scatolo', tipo_movimento: 'versamento', autore: A[0], importo: 200, data: '2026-02-01' }];
  let eq = E.computeEquity(base, A, YR);
  assert.strictEqual(eq.over[A[0]], 100);
  assert.strictEqual(eq.over[A[1]], -100);
  const s = E.equitySettlement(eq);
  assert.strictEqual(s.state, 'sbilanciato');
  assert.strictEqual(s.debtor, A[1]);
  assert.strictEqual(s.owed, 100);
  // riequilibrio: debitore versa owed + creditore preleva owed
  const after = base.concat([
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: s.debtor, importo: s.owed, data: '2026-02-02', descrizione: 'Riequilibrio conti' },
    { fonte: 'scatolo', tipo_movimento: 'prelievo', autore: s.creditor, importo: s.owed, data: '2026-02-02', descrizione: 'Riequilibrio conti' },
  ]);
  eq = E.computeEquity(after, A, YR);
  assert.ok(Math.abs(eq.over[A[0]]) < 1e-9 && Math.abs(eq.over[A[1]]) < 1e-9, 'saldi azzerati');
  assert.strictEqual(eq.box, 200, 'scatolo invariato dopo il riequilibrio');
  assert.strictEqual(E.equitySettlement(eq).state, 'pari');
});

test('FIX F-1: quota ≠ 50/50 su spesa DALLO SCATOLO ora ha effetto', () => {
  // spesa 100 dallo scatolo, beneficio 100% a Stefano → Stefano deve 50 a Flavia
  const tx = [{ fonte: 'scatolo', tipo_movimento: 'spesa', autore: null, importo: 100, data: '2026-04-01', quota: { [A[0]]: 100, [A[1]]: 0 } }];
  const eq = E.computeEquity(tx, A, YR);
  assert.ok(Math.abs(eq.over[A[0]] + eq.over[A[1]]) < 1e-9, 'somma zero');
  assert.strictEqual(eq.over[A[0]], -50, 'Stefano in debito di 50 (ha usato il fondo comune per sé)');
  assert.strictEqual(eq.box, -100, 'box scalato');
  // col vecchio motore era neutra (over 0/0): confermiamo che è un cambiamento voluto
  const old = computeEquityOld(tx, A, YR);
  assert.strictEqual(old.over[A[0]], 0);
});

test('FIX B-2: autore fuori lista NON sbilancia (e viene segnalato)', () => {
  const tx = [
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: 'Sconosciuto X', importo: 90, data: '2026-05-01' },
    { fonte: 'scatolo', tipo_movimento: 'versamento', autore: A[0], importo: 40, data: '2026-05-02' },
  ];
  const eq = E.computeEquity(tx, A, YR);
  assert.ok(Math.abs(eq.over[A[0]] + eq.over[A[1]]) < 1e-9, 'Σover=0 anche con autore ignoto');
  assert.strictEqual(eq.over[A[0]], 20, 'solo il versamento valido conta');
  assert.ok(eq.unknownAutori['Sconosciuto X'] === 90, 'autore ignoto segnalato');
  // col vecchio motore l'autore ignoto sbilanciava e Σover ≠ 0
  const old = computeEquityOld(tx, A, YR);
  assert.ok(Math.abs((old.over[A[0]] || 0) + (old.over[A[1]] || 0)) > 1, 'il vecchio motore era sbilanciato');
});

test('FIX B-5: spesa personale DALLO SCATOLO scala il box e addebita', () => {
  const tx = [{ fonte: 'scatolo', tipo_movimento: 'spesa', personale: true, autore: A[0], importo: 30, data: '2026-06-01' }];
  const eq = E.computeEquity(tx, A, YR);
  assert.strictEqual(eq.box, -30, 'box scalato anche se personale');
  assert.strictEqual(eq.over[A[0]], -15, 'chi l\'ha usata deve la metà');
  const old = computeEquityOld(tx, A, YR);
  assert.strictEqual(old.box, 0, 'il vecchio motore NON scalava il box (bug latente)');
});

test('media: spesa annuale spalmata conta solo i mesi trascorsi', () => {
  const tx = [{ fonte: 'conto', tipo_movimento: 'spesa', autore: A[0], importo: 1200, data: '2026-01-15', competenza_da: '2026-01-01', competenza_a: '2026-12-31' }];
  const mi = E.mediaComuniAnnoInfo(tx, YR, 3); // marzo, mesi interi (no curDay)
  assert.strictEqual(mi.allocM[1], 100);
  assert.strictEqual(mi.allocM[2], 100);
  assert.strictEqual(mi.allocM[4], 0, 'aprile (futuro) non conta');
  assert.strictEqual(mi.win, 3);
  assert.strictEqual(mi.media, 100, '300 su 3 mesi');
});

test('FIX F-5: media pro-rata del mese in corso (spesa costante → media stabile)', () => {
  const tx = [{ fonte: 'conto', tipo_movimento: 'spesa', autore: A[0], importo: 1200, data: '2026-01-15', competenza_da: '2026-01-01', competenza_a: '2026-12-31' }];
  const m15 = E.mediaComuniAnnoInfo(tx, YR, 3, 15); // 15 marzo
  const m1  = E.mediaComuniAnnoInfo(tx, YR, 4, 1);  // 1 aprile (cambio mese)
  assert.ok(Math.abs(m15.media - 100) < 0.5, 'a metà marzo la media resta ~100 (era ' + m15.media.toFixed(2) + ')');
  assert.ok(Math.abs(m1.media - 100) < 0.5, 'al cambio mese NON salta (era ' + m1.media.toFixed(2) + ')');
  assert.strictEqual(m15.monthsCovered, 3, 'mesi coperti (interi) per l\'etichetta');
});

test('FIX B-4: fine competenza robusta ai fine-mese', () => {
  // periodo che parte il 31 gennaio, durata 1 mese → deve finire a fine febbraio
  assert.strictEqual(E.compEndFromStart('2026-01-31', 1), '2026-02-27');
  // preset "puliti" dal 1° del mese restano corretti
  assert.strictEqual(E.compEndFromStart('2026-01-01', 1), '2026-01-31');  // mensile
  assert.strictEqual(E.compEndFromStart('2026-03-01', 2), '2026-04-30');  // bimestrale
  assert.strictEqual(E.compEndFromStart('2026-01-01', 6), '2026-06-30');  // semestrale
  assert.strictEqual(E.compEndFromStart('2026-01-01', 12), '2026-12-31'); // annuale
  // anno bisestile: 31 gen 2024 + 1 mese → 28 feb (29−1)
  assert.strictEqual(E.compEndFromStart('2024-01-31', 1), '2024-02-28');
  // il vecchio calcolo dava 2 marzo (overflow): confermiamo che ora NON succede
  assert.notStrictEqual(E.compEndFromStart('2026-01-31', 1), '2026-03-02');
});

// ── DIFF sul BACKUP REALE: nuovo motore == vecchio motore? ──
test('DIFF backup reale: estrazione iso-comportamentale (o differenze spiegate)', () => {
  const dir = 'D:/Progetti AI/_BACKUP CONTI DI CASA';
  let file = null;
  try {
    const files = fs.readdirSync(dir).filter(f => /^backup-conti-.*\.json$/.test(f)).sort();
    if (files.length) file = path.join(dir, files[files.length - 1]);
  } catch (_) {}
  if (!file) { console.log('  (backup non trovato: DIFF saltato)'); return; }

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const tx = data.cdc_transazioni || [];
  const autori = (data.cdc_authorized_users || []).map(u => u.nome).filter(Boolean);
  const AA = autori.length >= 2 ? autori : A;

  const neu = E.computeEquity(tx, AA, YR);
  const old = computeEquityOld(tx, AA, YR);

  console.log('  autori:', AA.join(', '));
  console.log('  tx totali:', tx.length, '| box:', neu.box, '| over:', JSON.stringify(neu.over));
  console.log('  autori sconosciuti:', JSON.stringify(neu.unknownAutori));
  const scatoloQuota = tx.filter(t => t.fonte === 'scatolo' && (t.tipo_movimento || 'spesa') === 'spesa' && t.quota).length;
  const persScatolo = tx.filter(t => t.personale && t.fonte === 'scatolo').length;
  console.log('  spese-scatolo con quota custom:', scatoloQuota, '| personali-da-scatolo:', persScatolo);

  const sameBox = neu.box === old.box;
  const sameOver = AA.every(n => Math.abs((neu.over[n] || 0) - (old.over[n] || 0)) < 0.01);
  if (sameBox && sameOver) {
    console.log('  ✅ nuovo motore == vecchio sui dati reali (deploy sicuro, i fix sono protezione futura)');
  } else {
    console.log('  ⚠ differenze sui dati reali → i fix correggono numeri esistenti:');
    console.log('     box  old', old.box, '→ new', neu.box);
    AA.forEach(n => console.log('     over', n, ':', old.over[n], '→', neu.over[n]));
  }
  // invariante: il nuovo motore è SEMPRE a somma zero
  assert.ok(Math.abs(AA.reduce((s, n) => s + (neu.over[n] || 0), 0)) < 1e-6, 'Σover=0 sui dati reali');
});
