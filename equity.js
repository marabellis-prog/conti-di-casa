// ============================================================================
//  equity.js — MOTORE CONTABILE PURO di Conti di Casa
//  Nessuna dipendenza dal DOM/stato: tutte le funzioni prendono i dati come
//  argomenti e restituiscono valori. Così la logica dei soldi è testabile fuori
//  dal browser (node --test) ed è single-source-of-truth per l'app.
//
//  Caricamento dual (UMD-lite):
//   - browser: <script src="equity.js"> → espone window.CDCEquity
//   - node   : require('./equity.js')   → module.exports
// ============================================================================
;(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CDCEquity = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

  // Solo i movimenti del NUOVO modello hanno una `fonte` valorizzata.
  function isNuovoModello(t) { return !!t.fonte; }

  // Spese comuni "valide": nuovo modello, movimento=spesa, non personali.
  function commonSpese(tx) {
    return (tx || []).filter(t => isNuovoModello(t) && (t.tipo_movimento || 'spesa') === 'spesa' && !t.personale);
  }

  // Quota di divisione di una spesa → { nome: percentuale } che somma 100.
  // quota null/assente ⇒ divisione equa.
  function parseQuota(q, A) {
    const out = {};
    if (q && typeof q === 'object' && !Array.isArray(q)) {
      let sum = 0;
      A.forEach(n => { out[n] = Number(q[n]) || 0; sum += out[n]; });
      if (sum > 0) return out;
    }
    const each = 100 / (A.length || 1);
    A.forEach(n => out[n] = each);
    return out;
  }

  // Mesi di competenza {y,m} coperti da una spesa. Se non c'è periodo di
  // competenza esplicito → il mese della data di pagamento.
  function spesaCompMonths(t) {
    const da = t.competenza_da, a = t.competenza_a;
    if (da && a) {
      const [sy, sm] = String(da).split('-').map(Number);
      const [ey, em] = String(a).split('-').map(Number);
      const out = [];
      let cy = sy, cmn = sm, guard = 0;
      while ((cy < ey || (cy === ey && cmn <= em)) && guard < 120) {
        out.push({ y: cy, m: cmn });
        cmn++; if (cmn > 12) { cmn = 1; cy++; }
        guard++;
      }
      if (out.length) return out;
    }
    const [yy, mm] = String(t.data || '').split('-').map(Number);
    if (yy && mm) return [{ y: yy, m: mm }];
    return [];
  }

  // Stato scatolo + equità a SOMMA ZERO. Vedi memoria/audit per la semantica.
  //   box        = versamenti − spese-da-scatolo − prelievi (cumulativo)
  //   contrib[n] = versamenti + spese da conto/buoni − prelievi (anno)
  //   over[n]    = saldo personale (>0 credito, <0 debito). Σ over = 0.
  function computeEquity(tx, A, yr) {
    const res = { A: A.slice(), year: yr, box: 0, contrib: {}, over: {}, totComuni: 0, unknownAutori: {} };
    A.forEach(n => { res.contrib[n] = 0; res.over[n] = 0; });
    const otherOf = n => A.find(x => x !== n);
    const credit = (who, amt) => {
      if (!who) return;
      const o = otherOf(who);
      res.over[who] = (res.over[who] || 0) + amt;
      if (o) res.over[o] = (res.over[o] || 0) - amt;
    };
    // segnala (senza sbilanciare) autori fuori dalla lista → sentinella per la UI
    const noteUnknown = (a, imp) => { if (a && res.contrib[a] == null) res.unknownAutori[a] = round2((res.unknownAutori[a] || 0) + imp); };

    (tx || []).forEach(t => {
      if (!isNuovoModello(t)) return;
      const mov = t.tipo_movimento || 'spesa';
      const imp = Number(t.importo) || 0;
      if (!imp) return;
      const inYear = String(t.data || '').slice(0, 4) === String(yr);
      if (mov === 'versamento') {
        res.box += imp;
        if (inYear) {
          noteUnknown(t.autore, imp);
          if (res.contrib[t.autore] != null) { res.contrib[t.autore] += imp; credit(t.autore, imp / 2); }
        }
      } else if (mov === 'prelievo') {
        res.box -= imp;
        if (inYear) {
          noteUnknown(t.autore, imp);
          if (res.contrib[t.autore] != null) { res.contrib[t.autore] -= imp; credit(t.autore, -imp / 2); }
        }
      } else { // spesa
        if (t.personale) {
          // difensivo: una personale pagata DALLO SCATOLO consuma denaro comune
          // per una persona sola → scala il box e addebita chi ne ha beneficiato.
          if (t.fonte === 'scatolo') { res.box -= imp; if (inYear) noteUnknown(t.autore, imp); if (inYear && res.over[t.autore] != null) credit(t.autore, -imp / 2); }
          return;
        }
        if (t.fonte === 'scatolo') {
          res.box -= imp;
          if (inYear) {
            res.totComuni += imp;
            // quota ≠ 50/50 su spesa dallo SCATOLO: chi beneficia oltre la metà
            // "deve" l'eccedenza all'altro (il fondo è comune 50/50). Con 2 persone
            // l'aggiustamento è a somma zero → si applica UNA volta sola (sul primo
            // autore); l'altro è compensato automaticamente.
            if (A.length === 2 && t.quota) {
              const q = parseQuota(t.quota, A);
              const share = (q[A[0]] || 0) - 50;
              if (Math.abs(share) > 0.0001) credit(A[0], -(imp * share / 100));
            }
          }
        } else if (inYear && res.contrib[t.autore] == null) {
          noteUnknown(t.autore, imp); // spesa da conto/buoni con autore sconosciuto
        } else if (t.autore && inYear) {
          res.totComuni += imp;
          if (res.contrib[t.autore] != null) res.contrib[t.autore] += imp;
          const q = parseQuota(t.quota, A);
          const o = otherOf(t.autore);
          credit(t.autore, imp * ((o ? q[o] : 50) || 0) / 100);
        }
      }
    });
    A.forEach(n => { res.over[n] = round2(res.over[n]); res.contrib[n] = round2(res.contrib[n]); });
    res.box = round2(res.box);
    return res;
  }

  // Chi deve dare quanto a chi (2 persone). Trasferimento diretto dell'intero
  // `owed` (mai "prendi dallo scatolo 1:1", che compenserebbe solo metà).
  function equitySettlement(eq) {
    const A = eq.A;
    if (A.length !== 2) return { state: 'na' };
    const [a, b] = A;
    const oa = round2(eq.over[a]), ob = round2(eq.over[b]);
    const box = round2(eq.box);
    if (Math.abs(oa) < 0.01 && Math.abs(ob) < 0.01) return { state: 'pari', box };
    const creditor = oa > 0 ? a : b;
    const debtor = oa > 0 ? b : a;
    const owed = round2(Math.abs(eq.over[creditor]));
    return { state: 'sbilanciato', creditor, debtor, owed, box };
  }

  // Media mensile competenza-spread dell'anno in corso, fino al mese corrente.
  function mediaComuniAnnoInfo(tx, yr, curMonth) {
    const allocM = new Array(13).fill(0);
    commonSpese(tx).filter(t => !t.straordinaria).forEach(t => {
      const months = spesaCompMonths(t);
      if (!months.length) return;
      const per = (Number(t.importo) || 0) / months.length;
      months.forEach(({ y, m }) => { if (y === yr && m <= curMonth) allocM[m] += per; });
    });
    let firstM = null, sumYear = 0;
    for (let m = 1; m <= curMonth; m++) {
      if (allocM[m] > 0.0001 && firstM === null) firstM = m;
      sumYear += allocM[m];
    }
    const win = firstM === null ? 1 : (curMonth - firstM + 1);
    const media = firstM === null ? 0 : sumYear / win;
    return { year: yr, curMonth, allocM, firstM, lastM: curMonth, win, media };
  }

  // Contribuzione per utente (versamenti + pagamenti diretti − prelievi).
  function contribByAutore(tx, A, yr, month, day) {
    const out = {}; A.forEach(n => { out[n] = 0; });
    (tx || []).forEach(t => {
      if (!isNuovoModello(t)) return;
      const [y, m, d] = String(t.data || '').split('-').map(Number);
      if (y !== yr) return;
      if (month && m !== month) return;
      if (day && d !== day) return;
      const a = t.autore; if (!a || out[a] == null) return;
      const mov = t.tipo_movimento || 'spesa';
      const imp = Number(t.importo) || 0;
      if (mov === 'versamento') out[a] += imp;
      else if (mov === 'prelievo') out[a] -= imp;
      else { if (t.personale || t.fonte === 'scatolo') return; out[a] += imp; }
    });
    A.forEach(n => out[n] = round2(out[n]));
    return out;
  }

  // Aggiunge `addM` mesi a (y,m,d) senza overflow: il giorno viene CLAMPato
  // all'ultimo del mese risultante (31 gen + 1 mese → 28/29 feb, non 2/3 mar).
  function addMonthsClamped(y, m, d, addM) {
    let ny = y, nm = m + addM;
    while (nm > 12) { nm -= 12; ny++; }
    while (nm < 1) { nm += 12; ny--; }
    const last = new Date(ny, nm, 0).getDate();
    return { y: ny, m: nm, d: Math.min(d, last) };
  }

  // Fine di un periodo di competenza che PARTE da startStr e dura `months` mesi:
  // (inizio + months) − 1 giorno, robusto ai fine-mese. Restituisce 'YYYY-MM-DD'.
  function compEndFromStart(startStr, months) {
    const [y, m, d] = String(startStr).split('-').map(Number);
    if (!y || !m || !d) return startStr;
    const p = addMonthsClamped(y, m, d, months);           // stesso giorno, mese +N
    const end = new Date(p.y, p.m - 1, p.d);               // poi −1 giorno
    end.setDate(end.getDate() - 1);
    const pad = n => String(n).padStart(2, '0');
    return end.getFullYear() + '-' + pad(end.getMonth() + 1) + '-' + pad(end.getDate());
  }

  return {
    round2, isNuovoModello, commonSpese, parseQuota, spesaCompMonths,
    computeEquity, equitySettlement, mediaComuniAnnoInfo, contribByAutore,
    addMonthsClamped, compEndFromStart
  };
});
