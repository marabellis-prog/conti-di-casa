/* ═══════════════════════════════════════════════════════════════
   CHARTS — render SVG fatto a mano (donut, line, barre)
   I colori usano CSS variables, quindi cambio tema senza re-render.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;

  function fmtEur(n) {
    const x = Math.round(n * 100) / 100;
    return '€' + x.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function fmtEurShort(n) {
    if (Math.abs(n) >= 1000) return '€' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return '€' + Math.round(n);
  }

  // ─── DONUT ──────────────────────────────────────────────
  // segments: [{label, value, color, onClick?}]
  function renderDonut(container, segments, opts) {
    opts = opts || {};
    const total = segments.reduce((s, x) => s + x.value, 0);
    container.innerHTML = '';
    if (total <= 0) {
      container.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Nessuna uscita nel periodo</div></div>';
      return;
    }
    const SIZE = 200, R = 80, IR = 56, CX = 100, CY = 100;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + SIZE + ' ' + SIZE);
    svg.setAttribute('role', 'img');

    let acc = -Math.PI / 2;
    const sorted = segments.slice().sort((a, b) => b.value - a.value);
    sorted.forEach(s => {
      const angle = (s.value / total) * TAU;
      if (angle <= 0) return;
      // Segmento che copre (quasi) l'intero cerchio: un arco SVG con punto
      // iniziale == finale è degenere e non viene disegnato → uso un anello.
      if (angle >= TAU - 1e-6) {
        const ring = document.createElementNS(NS, 'circle');
        ring.setAttribute('cx', CX);
        ring.setAttribute('cy', CY);
        ring.setAttribute('r', (R + IR) / 2);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', s.color || 'var(--accent)');
        ring.setAttribute('stroke-width', R - IR);
        if (s.onClick) {
          ring.style.cursor = 'pointer';
          ring.addEventListener('click', () => s.onClick(s));
        }
        svg.appendChild(ring);
        acc += angle;
        return;
      }
      const a0 = acc;
      const a1 = acc + angle;
      acc = a1;
      const large = angle > Math.PI ? 1 : 0;
      const x0 = CX + Math.cos(a0) * R, y0 = CY + Math.sin(a0) * R;
      const x1 = CX + Math.cos(a1) * R, y1 = CY + Math.sin(a1) * R;
      const xi0 = CX + Math.cos(a0) * IR, yi0 = CY + Math.sin(a0) * IR;
      const xi1 = CX + Math.cos(a1) * IR, yi1 = CY + Math.sin(a1) * IR;
      const d = [
        'M', x0, y0,
        'A', R, R, 0, large, 1, x1, y1,
        'L', xi1, yi1,
        'A', IR, IR, 0, large, 0, xi0, yi0,
        'Z'
      ].join(' ');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', s.color || 'var(--accent)');
      path.setAttribute('stroke', 'var(--surface)');
      path.setAttribute('stroke-width', '2');
      if (s.onClick) {
        path.style.cursor = 'pointer';
        path.addEventListener('click', () => s.onClick(s));
      }
      svg.appendChild(path);
    });

    // Centro: totale (skip se opts.noText)
    if (!opts.noText) {
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', CX);
      txt.setAttribute('y', CY + 4);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('class', 'donut-center');
      txt.textContent = fmtEurShort(total);
      svg.appendChild(txt);

      const sub = document.createElementNS(NS, 'text');
      sub.setAttribute('x', CX);
      sub.setAttribute('y', CY + 20);
      sub.setAttribute('text-anchor', 'middle');
      sub.setAttribute('class', 'donut-center-sub');
      sub.textContent = (opts.subLabel || 'totale');
      svg.appendChild(sub);
    }

    container.appendChild(svg);

    if (opts.noLegend) return;

    // Legend
    const legend = document.createElement('div');
    legend.className = 'donut-legend';
    sorted.forEach(s => {
      const pct = (s.value / total) * 100;
      const row = document.createElement('div');
      row.className = 'legend-row';
      row.innerHTML = '<span class="legend-dot" style="background:' + (s.color || 'var(--accent)') + '"></span>' +
                      '<span>' + (s.label || '?') + '</span>' +
                      '<b>' + pct.toFixed(0) + '%</b>';
      if (s.onClick) row.addEventListener('click', () => s.onClick(s));
      legend.appendChild(row);
    });
    container.appendChild(legend);
  }

  // ─── LINE ─────────────────────────────────────────────────
  // series: [{label, color, points: [n,n,n,...]}]
  // xLabels: [string, ...]
  // opts (opzionali): { yTicks: 5 } numero di linee orizzontali + label numerici
  function renderLine(container, series, xLabels, opts) {
    opts = opts || {};
    container.innerHTML = '';
    if (!series.length || !series[0].points.length) {
      container.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Dati insufficienti</div></div>';
      return;
    }
    // Padding L più ampio per fare spazio ai label Y (es. "€2,5k")
    const W = 360, H = 200, PAD_L = 32, PAD_R = 6, PAD_T = 12, PAD_B = 26;
    const N = series[0].points.length;
    const allVals = series.flatMap(s => s.points);
    let maxV = Math.max.apply(null, allVals);
    if (opts.refLine && opts.refLine.value > maxV) maxV = opts.refLine.value; // la media deve starci dentro
    if (maxV <= 0) maxV = 1;
    // arrotonda max al "nice number"
    const niceMax = niceCeil(maxV);
    const stepX = (W - PAD_L - PAD_R) / Math.max(1, N - 1);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // grid orizzontale + label sull'asse Y per ogni tick
    const yTicks = Math.max(2, opts.yTicks || 5);
    for (let i = 0; i <= yTicks; i++) {
      const y = PAD_T + ((H - PAD_T - PAD_B) * i / yTicks);
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', PAD_L);
      ln.setAttribute('x2', W - PAD_R);
      ln.setAttribute('y1', y);
      ln.setAttribute('y2', y);
      ln.setAttribute('stroke', 'var(--border)');
      ln.setAttribute('stroke-width', '1');
      ln.setAttribute('opacity', i === yTicks ? '1' : '.35');
      svg.appendChild(ln);
      // label numerico: niceMax è in alto (i=0), 0 è in basso (i=yTicks)
      const tickValue = niceMax * (yTicks - i) / yTicks;
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', PAD_L - 4);
      txt.setAttribute('y', y + 3);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--text-faint)');
      txt.setAttribute('font-size', '9');
      txt.textContent = i === yTicks ? '0' : fmtEurShort(tickValue);
      svg.appendChild(txt);
    }

    const baseY = H - PAD_B; // y dell'asse delle ascisse (valore 0)

    // Tooltip su click di un punto: bolla colorata con "Mese · €cifra".
    // Ri-cliccando lo stesso punto (o cliccando fuori) la bolla si chiude.
    let tipKey = null;
    function clearTip() {
      let el = svg.querySelector('.pt-tip'); if (el) el.remove();
      el = svg.querySelector('.pt-hi'); if (el) el.remove();
      tipKey = null;
    }
    function showPointTip(key, i, v, x, y, color) {
      if (tipKey === key) { clearTip(); return; } // toggle off
      clearTip();
      tipKey = key;
      const hi = document.createElementNS(NS, 'circle');
      hi.setAttribute('class', 'pt-hi');
      hi.setAttribute('cx', x); hi.setAttribute('cy', y); hi.setAttribute('r', '5');
      hi.setAttribute('fill', color);
      hi.setAttribute('stroke', 'var(--surface)');
      hi.setAttribute('stroke-width', '2');
      svg.appendChild(hi);
      const monthLbl = (opts.pointLabels && opts.pointLabels[i]) || xLabels[i] || '';
      const label = (monthLbl ? monthLbl + ' · ' : '') + fmtEur(v);
      const fs = 10, h = 18;
      const w = Math.max(34, label.length * fs * 0.55 + 10);
      let bx = Math.max(PAD_L, Math.min(x - w / 2, W - PAD_R - w));
      let by = y - h - 7;
      if (by < PAD_T) by = y + 9; // se non c'è spazio sopra, mostra sotto
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pt-tip');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', bx.toFixed(1)); rect.setAttribute('y', by.toFixed(1));
      rect.setAttribute('width', w.toFixed(1)); rect.setAttribute('height', h);
      rect.setAttribute('rx', '5'); rect.setAttribute('fill', color);
      g.appendChild(rect);
      const tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', (bx + w / 2).toFixed(1));
      tx.setAttribute('y', (by + h / 2 + 3.3).toFixed(1));
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('fill', '#fff');
      tx.setAttribute('font-size', fs); tx.setAttribute('font-weight', '700');
      tx.textContent = label;
      g.appendChild(tx);
      svg.appendChild(g);
    }

    // linee per serie
    series.forEach((s, si) => {
      // drop-lines tratteggiate dal punto fino all'asse delle ascisse
      if (opts.dropLines) {
        s.points.forEach((v, i) => {
          const x = PAD_L + i * stepX;
          const y = H - PAD_B - ((v / niceMax) * (H - PAD_T - PAD_B));
          const dl = document.createElementNS(NS, 'line');
          dl.setAttribute('x1', x.toFixed(1)); dl.setAttribute('x2', x.toFixed(1));
          dl.setAttribute('y1', y.toFixed(1)); dl.setAttribute('y2', baseY);
          dl.setAttribute('stroke', s.color);
          dl.setAttribute('stroke-width', '1');
          dl.setAttribute('stroke-dasharray', '3 3');
          dl.setAttribute('opacity', '.45');
          svg.appendChild(dl);
        });
      }
      let path = '';
      s.points.forEach((v, i) => {
        const x = PAD_L + i * stepX;
        const y = H - PAD_B - ((v / niceMax) * (H - PAD_T - PAD_B));
        path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
      });
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', path);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', s.color);
      p.setAttribute('stroke-width', '2');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      if (s.onClick) {
        p.style.cursor = 'pointer';
        p.addEventListener('click', () => s.onClick(s));
      }
      svg.appendChild(p);
      // puntini (cliccabili se onClick / pointTooltip / onPoint)
      const interactive = !!(s.onClick || opts.pointTooltip || opts.onPoint);
      s.points.forEach((v, i) => {
        const x = PAD_L + i * stepX;
        const y = H - PAD_B - ((v / niceMax) * (H - PAD_T - PAD_B));
        const handle = (ev) => {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          if (opts.pointTooltip) showPointTip(si + ':' + i, i, v, x, y, s.color);
          if (typeof opts.onPoint === 'function') opts.onPoint(i, v, s);
          if (typeof s.onClick === 'function') s.onClick(s);
        };
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', interactive ? 4 : 2.5);
        c.setAttribute('fill', s.color);
        if (interactive) { c.style.cursor = 'pointer'; c.addEventListener('click', handle); }
        svg.appendChild(c);
        // bersaglio invisibile più ampio per il tap su mobile
        if (interactive) {
          const hit = document.createElementNS(NS, 'circle');
          hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', '10');
          hit.setAttribute('fill', 'transparent');
          hit.style.cursor = 'pointer';
          hit.addEventListener('click', handle);
          svg.appendChild(hit);
        }
      });
    });

    // Linea di riferimento orizzontale tratteggiata (es. media mensile)
    if (opts.refLine && opts.refLine.value > 0) {
      const ry = baseY - (opts.refLine.value / niceMax) * (H - PAD_T - PAD_B);
      const rl = document.createElementNS(NS, 'line');
      rl.setAttribute('x1', PAD_L); rl.setAttribute('x2', W - PAD_R);
      rl.setAttribute('y1', ry.toFixed(1)); rl.setAttribute('y2', ry.toFixed(1));
      rl.setAttribute('stroke', opts.refLine.color || 'var(--accent)');
      rl.setAttribute('stroke-width', '1.5');
      rl.setAttribute('stroke-dasharray', '5 3');
      svg.appendChild(rl);
      if (opts.refLine.label) {
        const rt = document.createElementNS(NS, 'text');
        rt.setAttribute('x', PAD_L + 3);
        rt.setAttribute('y', ((ry - 3 < PAD_T + 6) ? ry + 9 : ry - 3).toFixed(1));
        rt.setAttribute('fill', opts.refLine.color || 'var(--accent)');
        rt.setAttribute('font-size', '8.5');
        rt.setAttribute('font-weight', '700');
        rt.textContent = opts.refLine.label;
        svg.appendChild(rt);
      }
    }

    // x-labels: di default ogni N/6 per non affollare; opts.allXLabels = tutte
    const everyN = Math.max(1, Math.ceil(N / 6));
    const xfs = (opts.allXLabels && N > 8) ? '8' : '10';
    xLabels.forEach((lbl, i) => {
      if (!opts.allXLabels && i % everyN !== 0 && i !== N - 1) return;
      const x = PAD_L + i * stepX;
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x);
      t.setAttribute('y', H - 8);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', 'var(--text-faint)');
      t.setAttribute('font-size', xfs);
      t.textContent = lbl;
      svg.appendChild(t);
    });

    // Legenda colori in alto a destra, dentro il grafico (utile con più serie).
    // pointer-events:none → non intercetta i tap (i punti sotto restano cliccabili).
    if (opts.legendTopRight && series.length) {
      const lfs = 9, dotR = 3, gap = 4, lh = lfs + 5, padX = 5, padY = 3;
      const widths = series.map(s => dotR * 2 + gap + String(s.label || '').length * lfs * 0.55);
      const maxW = Math.max.apply(null, widths);
      const boxW = maxW + padX * 2;
      const boxH = series.length * lh + padY * 2 - 2;
      const boxX = W - PAD_R - boxW;
      const boxY = PAD_T - 1;
      const lg = document.createElementNS(NS, 'g');
      lg.setAttribute('pointer-events', 'none');
      const bg = document.createElementNS(NS, 'rect');
      bg.setAttribute('x', boxX.toFixed(1)); bg.setAttribute('y', boxY.toFixed(1));
      bg.setAttribute('width', boxW.toFixed(1)); bg.setAttribute('height', boxH.toFixed(1));
      bg.setAttribute('rx', '5');
      bg.setAttribute('fill', 'var(--surface)');
      bg.setAttribute('opacity', '0.82');
      lg.appendChild(bg);
      series.forEach((s, k) => {
        const cy = boxY + padY + k * lh + lfs / 2 + 1;
        const x0 = boxX + padX;
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', (x0 + dotR).toFixed(1));
        dot.setAttribute('cy', cy.toFixed(1));
        dot.setAttribute('r', dotR);
        dot.setAttribute('fill', s.color || 'var(--accent)');
        lg.appendChild(dot);
        const tx = document.createElementNS(NS, 'text');
        tx.setAttribute('x', (x0 + dotR * 2 + gap).toFixed(1));
        tx.setAttribute('y', (cy + lfs * 0.36).toFixed(1));
        tx.setAttribute('fill', 'var(--text-dim)');
        tx.setAttribute('font-size', lfs);
        tx.setAttribute('font-weight', '600');
        tx.textContent = String(s.label || '');
        lg.appendChild(tx);
      });
      svg.appendChild(lg);
    }

    // Click sullo sfondo del grafico (non su un punto) → chiude il tooltip.
    if (opts.pointTooltip) svg.addEventListener('click', clearTip);

    container.appendChild(svg);

    // Legend (riusa stili .donut-legend / .legend-row / .legend-dot)
    if (opts.legend) {
      const total = allVals.reduce((s, v) => s + v, 0);
      const legend = document.createElement('div');
      legend.className = 'donut-legend line-legend';
      series.forEach(s => {
        const seriesTotal = s.points.reduce((a, b) => a + b, 0);
        const pct = total > 0 ? (seriesTotal / total) * 100 : 0;
        const row = document.createElement('div');
        row.className = 'legend-row';
        row.innerHTML = '<span class="legend-dot" style="background:' + (s.color || 'var(--accent)') + '"></span>' +
                        '<span>' + (s.label || '?') + '</span>' +
                        '<b>' + fmtEurShort(seriesTotal) + '</b>';
        if (s.onClick) row.addEventListener('click', () => s.onClick(s));
        legend.appendChild(row);
      });
      container.appendChild(legend);
    }
  }

  function niceCeil(n) {
    if (n <= 0) return 1;
    const exp = Math.pow(10, Math.floor(Math.log10(n)));
    const f = n / exp;
    let nf;
    if (f <= 1) nf = 1;
    else if (f <= 2) nf = 2;
    else if (f <= 5) nf = 5;
    else nf = 10;
    return nf * exp;
  }

  // ─── BARRE BUDGET ─────────────────────────────────────────
  // rows: [{label, speso, budget, color, onClick}]
  function renderBudgetBars(container, rows) {
    container.innerHTML = '';
    if (!rows.length) {
      container.innerHTML = '<div class="empty"><div class="emoji">🎯</div><div>Nessun budget impostato</div></div>';
      return;
    }
    rows.sort((a, b) => (b.speso / Math.max(b.budget, 1)) - (a.speso / Math.max(a.budget, 1)));
    rows.forEach(r => {
      const pct = r.budget > 0 ? (r.speso / r.budget) * 100 : 0;
      const cls = pct > 100 ? 'over' : (pct > 70 ? 'warn' : 'ok');
      const widthPct = Math.min(100, pct);
      const div = document.createElement('div');
      div.className = 'budget-row';
      div.innerHTML =
        '<div class="budget-row-top">' +
          '<span>' + r.label + '</span>' +
          '<span><b>' + fmtEur(r.speso) + '</b> / ' + fmtEur(r.budget) + '</span>' +
        '</div>' +
        '<div class="budget-bar">' +
          '<div class="budget-bar-fill ' + cls + '" style="width:' + widthPct + '%"></div>' +
        '</div>' +
        '<div class="budget-pct">' + pct.toFixed(0) + '%' +
          (pct > 100 ? ' — superato di ' + fmtEur(r.speso - r.budget) : '') +
        '</div>';
      if (r.onClick) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => r.onClick(r));
      }
      container.appendChild(div);
    });
  }

  // ─── BARRE verticali (giornaliere) ────────────────────────
  // values: array di numeri (uno per giorno)
  // opts: { color, labelStep }
  function renderBars(container, values, opts) {
    opts = opts || {};
    container.innerHTML = '';
    if (!values.length) {
      container.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Dati insufficienti</div></div>';
      return;
    }
    const W = 360, H = 200, PAD_L = 14, PAD_R = 6, PAD_T = 12, PAD_B = 22;
    const N = values.length;
    let maxV = Math.max.apply(null, values);
    if (maxV <= 0) maxV = 1;
    const niceMax = niceCeil(maxV);
    const slotW = (W - PAD_L - PAD_R) / N;
    const barW = Math.max(2, slotW * 0.7);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // grid
    for (let i = 0; i <= 3; i++) {
      const y = PAD_T + ((H - PAD_T - PAD_B) * i / 3);
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', PAD_L); ln.setAttribute('x2', W - PAD_R);
      ln.setAttribute('y1', y);     ln.setAttribute('y2', y);
      ln.setAttribute('stroke', 'var(--border)');
      ln.setAttribute('stroke-width', '1');
      ln.setAttribute('opacity', i === 3 ? '1' : '.35');
      svg.appendChild(ln);
    }
    const lblMax = document.createElementNS(NS, 'text');
    lblMax.setAttribute('x', PAD_L + 2);
    lblMax.setAttribute('y', PAD_T + 9);
    lblMax.setAttribute('fill', 'var(--text-faint)');
    lblMax.setAttribute('font-size', '10');
    lblMax.textContent = fmtEurShort(niceMax);
    svg.appendChild(lblMax);

    // bars
    const color = opts.color || 'var(--accent)';
    values.forEach((v, i) => {
      if (v <= 0) return;
      const h = ((v / niceMax) * (H - PAD_T - PAD_B));
      const x = PAD_L + i * slotW + (slotW - barW) / 2;
      const y = H - PAD_B - h;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x.toFixed(1));
      r.setAttribute('y', y.toFixed(1));
      r.setAttribute('width', barW.toFixed(1));
      r.setAttribute('height', h.toFixed(1));
      r.setAttribute('fill', color);
      r.setAttribute('rx', '1.5');
      svg.appendChild(r);
    });

    // x labels: ogni N/6 (es. giorni 1,5,10,15,20,25,fine)
    const step = Math.max(1, Math.ceil(N / 6));
    for (let i = 0; i < N; i += step) {
      const x = PAD_L + i * slotW + slotW / 2;
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x);
      t.setAttribute('y', H - 6);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', 'var(--text-faint)');
      t.setAttribute('font-size', '10');
      t.textContent = String(i + 1);
      svg.appendChild(t);
    }
    // ultimo
    if ((N - 1) % step !== 0) {
      const x = PAD_L + (N - 1) * slotW + slotW / 2;
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x);
      t.setAttribute('y', H - 6);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', 'var(--text-faint)');
      t.setAttribute('font-size', '10');
      t.textContent = String(N);
      svg.appendChild(t);
    }

    container.appendChild(svg);
  }

  // ─── BARRE DIFF (variazione positiva/negativa con asse 0) ─
  // rows: [{ label, value, icon }]  - value può essere negativo
  function renderDiffBars(container, rows, opts) {
    opts = opts || {};
    container.innerHTML = '';
    if (!rows.length) {
      container.innerHTML = '<div class="empty"><div class="emoji">📊</div><div>Nessuna variazione</div></div>';
      return;
    }
    const W = 360, H = 200, PAD_L = 4, PAD_R = 4, PAD_T = 18, PAD_B = 28;
    const N = rows.length;
    const maxAbs = Math.max.apply(null, rows.map(r => Math.abs(r.value))) || 1;
    const niceMax = niceCeil(maxAbs);
    const innerH = H - PAD_T - PAD_B;
    const zeroY = PAD_T + innerH / 2;
    const slotW = (W - PAD_L - PAD_R) / N;
    const barW = Math.max(8, slotW * 0.55);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // linea asse 0
    const axis = document.createElementNS(NS, 'line');
    axis.setAttribute('x1', PAD_L); axis.setAttribute('x2', W - PAD_R);
    axis.setAttribute('y1', zeroY); axis.setAttribute('y2', zeroY);
    axis.setAttribute('stroke', 'var(--border)');
    axis.setAttribute('stroke-width', '1.5');
    svg.appendChild(axis);
    // label max +/−
    const lblPos = document.createElementNS(NS, 'text');
    lblPos.setAttribute('x', PAD_L + 2); lblPos.setAttribute('y', PAD_T + 9);
    lblPos.setAttribute('fill', 'var(--text-faint)');
    lblPos.setAttribute('font-size', '10');
    lblPos.textContent = '+' + fmtEurShort(niceMax);
    svg.appendChild(lblPos);
    const lblNeg = document.createElementNS(NS, 'text');
    lblNeg.setAttribute('x', PAD_L + 2); lblNeg.setAttribute('y', H - PAD_B + 12);
    lblNeg.setAttribute('fill', 'var(--text-faint)');
    lblNeg.setAttribute('font-size', '10');
    lblNeg.textContent = '−' + fmtEurShort(niceMax);
    svg.appendChild(lblNeg);

    // barre
    rows.forEach((r, i) => {
      const h = (Math.abs(r.value) / niceMax) * (innerH / 2);
      const x = PAD_L + i * slotW + (slotW - barW) / 2;
      const isUp = r.value > 0;
      const y = isUp ? (zeroY - h) : zeroY;
      const color = r.value === 0 ? 'var(--text-faint)' : (isUp ? 'var(--danger)' : 'var(--ok)');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', x.toFixed(1));
      rect.setAttribute('y', y.toFixed(1));
      rect.setAttribute('width', barW.toFixed(1));
      rect.setAttribute('height', h.toFixed(1));
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
      // valore sopra/sotto la barra
      if (r.value !== 0) {
        const valTxt = document.createElementNS(NS, 'text');
        valTxt.setAttribute('x', (x + barW / 2).toFixed(1));
        valTxt.setAttribute('y', isUp ? (y - 3).toFixed(1) : (y + h + 9).toFixed(1));
        valTxt.setAttribute('text-anchor', 'middle');
        valTxt.setAttribute('fill', color);
        valTxt.setAttribute('font-size', '9');
        valTxt.setAttribute('font-weight', '700');
        valTxt.textContent = (isUp ? '+' : '−') + fmtEurShort(Math.abs(r.value));
        svg.appendChild(valTxt);
      }
      // icona sotto come label
      const ic = document.createElementNS(NS, 'text');
      ic.setAttribute('x', (x + barW / 2).toFixed(1));
      ic.setAttribute('y', H - 6);
      ic.setAttribute('text-anchor', 'middle');
      ic.setAttribute('font-size', '13');
      ic.textContent = r.icon || '?';
      svg.appendChild(ic);
    });

    container.appendChild(svg);
  }

  // Expose
  window.Charts = { renderDonut, renderLine, renderBars, renderBudgetBars, renderDiffBars, fmtEur, fmtEurShort };
})();
