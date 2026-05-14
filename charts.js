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

    // Centro: totale
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

    container.appendChild(svg);

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
  function renderLine(container, series, xLabels) {
    container.innerHTML = '';
    if (!series.length || !series[0].points.length) {
      container.innerHTML = '<div class="empty"><div class="emoji">📈</div><div>Dati insufficienti</div></div>';
      return;
    }
    const W = 360, H = 200, PAD_L = 4, PAD_R = 4, PAD_T = 14, PAD_B = 26;
    const N = series[0].points.length;
    const allVals = series.flatMap(s => s.points);
    let maxV = Math.max.apply(null, allVals);
    if (maxV <= 0) maxV = 1;
    // arrotonda max al "nice number"
    const niceMax = niceCeil(maxV);
    const stepX = (W - PAD_L - PAD_R) / Math.max(1, N - 1);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // grid orizzontale (4 linee)
    for (let i = 0; i <= 4; i++) {
      const y = PAD_T + ((H - PAD_T - PAD_B) * i / 4);
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', PAD_L);
      ln.setAttribute('x2', W - PAD_R);
      ln.setAttribute('y1', y);
      ln.setAttribute('y2', y);
      ln.setAttribute('stroke', 'var(--border)');
      ln.setAttribute('stroke-width', '1');
      ln.setAttribute('opacity', i === 4 ? '1' : '.4');
      svg.appendChild(ln);
    }
    // label asse Y in alto a sinistra
    const lblMax = document.createElementNS(NS, 'text');
    lblMax.setAttribute('x', PAD_L + 4);
    lblMax.setAttribute('y', PAD_T + 10);
    lblMax.setAttribute('fill', 'var(--text-faint)');
    lblMax.setAttribute('font-size', '10');
    lblMax.textContent = fmtEurShort(niceMax);
    svg.appendChild(lblMax);

    // linee per serie
    series.forEach(s => {
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
      svg.appendChild(p);
      // puntini
      s.points.forEach((v, i) => {
        const x = PAD_L + i * stepX;
        const y = H - PAD_B - ((v / niceMax) * (H - PAD_T - PAD_B));
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', 2.5);
        c.setAttribute('fill', s.color);
        svg.appendChild(c);
      });
    });

    // x-labels (ogni 2 per non affollare)
    xLabels.forEach((lbl, i) => {
      if (i % Math.ceil(N / 6) !== 0 && i !== N - 1) return;
      const x = PAD_L + i * stepX;
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x);
      t.setAttribute('y', H - 8);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', 'var(--text-faint)');
      t.setAttribute('font-size', '10');
      t.textContent = lbl;
      svg.appendChild(t);
    });

    container.appendChild(svg);
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

  // Expose
  window.Charts = { renderDonut, renderLine, renderBars, renderBudgetBars, fmtEur, fmtEurShort };
})();
