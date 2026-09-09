/* Ember & Oak Admin — dashboard rendering (Phase 1.2 · Task D+)
 * Loaded after ../data.js (window.DATA) and data.js (window.AdminData).
 */
(function () {
  'use strict';
  const A = window.AdminData;
  const storeName = (id) => {
    const s = (window.DATA && window.DATA.stores || []).find(s => s.id === id);
    return s ? s.name : (id || '—');
  };

  /* ---------- Cloud-first order source (Phase 2) ---------- */
  const useCloud = () => !!(window.EOOrders && window.EOOrders.isOnline() && window.EOOrders.isReady());

  function currentOrders() {
    if (useCloud()) {
      try { return window.EOOrders.list(); } catch { /* fall through */ }
    }
    try { return A.getOrders(); } catch { return []; }
  }

  function pickLabel(order) {
    const when = order.customer.when;
    if (!when || when === 'asap' || when === '0') return 'ASAP';
    return `in ~${when} min`;
  }

  function itemsSummary(items) {
    if (!items || items.length === 0) return '<b>No items</b>';
    const list = items.map((l) => `${esc(l.name)} ×${l.qty}`).join('</li><li>');
    return `<b>${items.length} ${items.length === 1 ? 'item' : 'items'}</b><ul><li>${list}</li></ul>`;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render() {
    const listEl = document.getElementById('ordersList');
    const meta = document.getElementById('ordersMeta');
    const chip = document.getElementById('seedChip');
    if (!listEl) return;

    let orders = [];
    try { orders = currentOrders(); } catch { orders = []; }
    const seeded = !useCloud() && (typeof A.isSeed === 'function') && A.isSeed();
    const sourceTxt = useCloud()
      ? 'live orders'
      : (seeded ? 'sample data (no real orders yet)' : 'orders from localStorage');

    if (chip) chip.hidden = !seeded;
    if (meta) meta.textContent = `${orders.length} order${orders.length === 1 ? '' : 's'} · ${sourceTxt}`;

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="adm__empty">
          <div class="adm__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>
            </svg>
          </div>
          <h3>No orders yet</h3>
          <p>New orders will appear here the moment a customer checks out.</p>
        </div>`;
      return;
    }

    listEl.innerHTML = orders.map((o) => {
      const paidCls = o.paid ? 'paid' : 'unpaid';
      const paidTxt = o.paid ? 'Paid' : 'Unpaid';
      const actions = o.status === 'pending'
        ? `<button type="button" class="adm__mini adm__mini--done" data-action="order-done" data-id="${esc(o.id)}">Mark done</button>
           <button type="button" class="adm__mini adm__mini--cancel" data-action="order-cancel" data-id="${esc(o.id)}">Cancel</button>`
        : `<button type="button" class="adm__mini adm__mini--reopen" data-action="order-reopen" data-id="${esc(o.id)}">Reopen</button>`;
      return `
      <div class="orders__row is-${esc(o.status)}" data-order-id="${esc(o.id)}">
        <div class="orders__id">
          <span class="orders__id-code">${esc(o.id)}</span>
          <span class="orders__time">${A.fmtTime(o.ts)}</span>
        </div>
        <div class="orders__who">
          <span class="orders__name">${esc(o.customer.name)}</span>
          <span class="orders__store">${esc(storeName(o.customer.store))} · ${esc(pickLabel(o))}</span>
        </div>
        <div class="orders__items">${itemsSummary(o.items)}</div>
        <div class="orders__right">
          <span class="orders__total">${A.fmtMoney(o.total)}</span>
          <span class="orders__badges">
            <span class="badge badge--${esc(o.status)}">${esc(o.status)}</span>
            <span class="badge badge--${paidCls}">${paidTxt}</span>
          </span>
          <span class="orders__actions">${actions}</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ----------------------------------------------------------
   * Order actions — mark done / cancel / reopen (persisted).
   * Online: writes status to Supabase (realtime/refresh keeps UI in step).
   * Offline: falls back to the Phase 1 localStorage path.
   * ---------------------------------------------------------- */
  function orderAction(action, id) {
    const newStatus =
      (action === 'order-done')   ? 'completed' :
      (action === 'order-cancel') ? 'cancelled' :
      (action === 'order-reopen') ? 'pending'   : null;
    if (!newStatus) return;

    if (useCloud()) {
      window.EOOrders.setStatus(id, { status: newStatus }).then(() => {
        render();
        renderSales();
      });
      return;
    }

    let orders;
    try { orders = A.getOrders(); } catch { return; }
    const target = orders.find(o => o.id === id);
    if (!target) return;
    target.status = newStatus;
    A.saveOrders(orders);
    render();
    renderSales();
  }

  function startAutoRefresh() {
    // Realtime cloud updates (Phase 2) — whenever the mirrored list changes.
    if (window.EOOrders) {
      window.EOOrders.onChange(() => { render(); renderSales(); });
    }
    // Cross-tab: a customer ordering in another tab updates localStorage.
    window.addEventListener('storage', (e) => {
      if (e.key === A.ORDERS_KEY || e.key === null) { render(); renderSales(); }
    });
    // Same-document writes: let code dispatch this.
    window.addEventListener('admin:refresh', () => { render(); renderSales(); });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action="refresh-orders"]');
      if (t) {
        const btn = t;
        btn.classList.add('is-spinning');
        const done = () => setTimeout(() => btn.classList.remove('is-spinning'), 400);
        if (useCloud() && window.EOOrders) {
          window.EOOrders.refresh().then(() => { render(); renderSales(); done(); });
        } else {
          render();
          renderSales();
          done();
        }
        return;
      }
      const act = e.target.closest('[data-action^="order-"]');
      if (act) { orderAction(act.dataset.action, act.dataset.id); return; }
      const act2 = e.target.closest('[data-action^="menu-"]');
      if (act2) { menuAction(act2.dataset.action, act2.dataset.id, act2); }
    });

    // Price input commit on Enter / Escape / blur
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target && e.target.classList.contains('mnu__price-input')) {
        e.preventDefault();
        commitPrice(e.target);
      } else if (e.key === 'Escape' && e.target && e.target.classList.contains('mnu__price-input')) {
        renderMenu();
      }
    });
    document.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('mnu__price-input')) commitPrice(e.target);
    });
    // Poll as a safety net for anything realtime/storage events miss.
    setInterval(() => {
      const cached = window.__admLastCount;
      const meta = document.getElementById('ordersMeta');
      if (cached === undefined) return;
      let count;
      try { count = currentOrders().length; } catch { return; }
      if (count !== cached) { render(); renderSales(); }
    }, 3000);

    // Sales tab lazy render: only on activation.
    document.querySelectorAll('.adm__link[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'sales') renderSales();
      });
    });
  }

  startAutoRefresh();
  render();
  try { window.__admLastCount = A.getOrders().length; } catch { /* ignore */ }
  renderMenu();
  renderSales();

  // Phase 2: bring cloud orders in. onChange → re-render when it resolves.
  if (window.EOOrders) {
    window.EOOrders.init().then(() => {
      try { window.__admLastCount = currentOrders().length; } catch { /* ignore */ }
    });
  }

  /* ----------------------------------------------------------
 * Menu Manager (Task F) — inline price edit + sold-out toggle,
 * overrides persisted to localStorage, applied on top of DATA.menu.
 * ---------------------------------------------------------- */
  const MENU_OVERRIDES_KEY = 'emberOakMenuOverrides';

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(MENU_OVERRIDES_KEY);
      if (!raw) return {};
      const p = JSON.parse(raw);
      return p && typeof p === 'object' ? p : {};
    } catch { return {}; }
  }
  function saveOverrides(map) {
    try { localStorage.setItem(MENU_OVERRIDES_KEY, JSON.stringify(map)); } catch { /* ignore */ }
  }
  function clearItemOverride(id) {
    const map = loadOverrides();
    if (map[id]) { delete map[id]; saveOverrides(map); }
  }

  function effectiveMenu() {
    const base = (window.DATA && window.DATA.menu) || [];
    const ov = loadOverrides();
    return base.map(it => {
      const o = ov[it.id] || {};
      return {
        ...it,
        price: typeof o.price === 'number' ? o.price : it.price,
        soldOut: !!o.soldOut,
        edited: !!(o && (typeof o.price === 'number' || typeof o.soldOut === 'boolean')),
      };
    });
  }

  function categoryLabel(c) { return String(c || 'other'); }

  function renderMenu() {
    const listEl = document.getElementById('menuList');
    const meta = document.getElementById('menMeta');
    if (!listEl) return;
    const items = effectiveMenu();
    const soldOutCount = items.filter(i => i.soldOut).length;
    const overrides = loadOverrides();
    const ovCount = Object.keys(overrides).length;
    if (meta) meta.textContent = `${items.length} items · ${soldOutCount} sold out · ${ovCount} override${ovCount === 1 ? '' : 's'}`;

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="adm__empty">
          <div class="adm__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7h18M3 12h18M3 17h12"/>
            </svg>
          </div>
          <h3>No menu items</h3>
          <p>The customer menu (data.js) didn't load. Open the site in another tab first.</p>
        </div>`;
      return;
    }

    listEl.innerHTML = items.map(it => `
      <div class="mnu__row${it.soldOut ? ' is-soldout' : ''}" data-item-id="${esc(it.id)}">
        <img class="mnu__thumb" src="${esc(it.thumb || '')}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
        <div class="mnu__who">
          <span class="mnu__name">${esc(it.name)}${it.soldOut ? ' <span class="badge badge--soldout">Sold out</span>' : ''}</span>
          <span class="mnu__desc">${esc(it.shortDesc || '')}</span>
        </div>
        <span class="mnu__cat">${esc(categoryLabel(it.category))}</span>
        <div class="mnu__price-wrap">
          <button type="button" class="mnu__price" data-action="menu-edit-price" data-id="${esc(it.id)}" title="Click to edit price">${A.fmtMoney(it.price)}</button>
          <span class="mnu__price-hint">click to edit</span>
        </div>
        <label class="mnu__sold">
          <span class="mnu__sold-label">Sold out</span>
          <span class="switch">
            <input type="checkbox" data-action="menu-soldout" data-id="${esc(it.id)}" ${it.soldOut ? 'checked' : ''} />
            <span class="switch__slider"></span>
          </span>
        </label>
        <div class="mnu__flags">
          <span class="mnu__edited" ${it.edited ? '' : 'hidden'}>edited</span>
          ${it.edited ? `<button type="button" class="mnu__reset" data-action="menu-reset" data-id="${esc(it.id)}">reset</button>` : ''}
        </div>
      </div>`).join('');
  }

  function menuAction(action, id, target) {
    const map = loadOverrides();
    if (action === 'menu-soldout') {
      const on = !!target && target.checked;
      map[id] = Object.assign({}, map[id], { soldOut: on });
      saveOverrides(map);
      renderMenu();
      return;
    }
    if (action === 'menu-reset') {
      clearItemOverride(id);
      renderMenu();
      return;
    }
    if (action === 'menu-reset-all') {
      saveOverrides({});
      renderMenu();
      return;
    }
    if (action === 'menu-edit-price') {
      const base = effectiveMenu();
      const item = base.find(i => i.id === id);
      if (!item) return;
      const wrap = target.closest('.mnu__price-wrap');
      if (!wrap || wrap.querySelector('.mnu__price-input')) return;
      wrap.innerHTML = `
        <input type="number" step="0.25" min="0" max="99" class="mnu__price-input" value="${item.price}" aria-label="New price for ${esc(item.name)}" />
        <span class="mnu__price-hint">enter to save · esc to cancel</span>`;
      const input = wrap.querySelector('input');
      input.focus();
      input.select();
      return;
    }
  }

  function commitPrice(input) {
    const row = input.closest('.mnu__row');
    if (!row) return;
    const id = row.dataset.itemId;
    const raw = input.value.trim();
    if (raw === '') { renderMenu(); return; }
    const price = Number(raw);
    const map = loadOverrides();
    if (!isNaN(price) && price >= 0 && price <= 99) {
      map[id] = Object.assign({}, map[id], { price: Math.round(price * 100) / 100 });
      saveOverrides(map);
    }
    renderMenu();
  }

  /* ----------------------------------------------------------
 * Sales Summary (Task G) — computed from getOrders() on every
 * render. Cancelled orders are excluded from revenue/totals but
 * still counted in the order total (per spec wording).
 * ---------------------------------------------------------- */
  function isRevenueOrder(o) {
    return o && o.status !== 'cancelled';
  }

  function aggregate(orders) {
    const totals = {
      revenue: 0,
      orderCount: orders.length,
      paidCount: 0, paidRevenue: 0,
      unpaidCount: 0, unpaidRevenue: 0,
      cancelledCount: 0, cancelledRevenue: 0,
    };
    const stores = {};        // storeId -> { count, revenue, name }
    const items = {};         // itemId -> { name, qty, revenue }
    const orderStoreBuckets = new Set();

    for (const o of orders) {
      const sid = (o.customer && o.customer.store) || 'other';
      const isRev = isRevenueOrder(o);

      if (!stores[sid]) {
        const meta = (window.DATA && window.DATA.stores || []).find(s => s.id === sid);
        stores[sid] = { name: meta ? meta.name : (sid === 'other' ? 'Other' : sid), count: 0, revenue: 0 };
      }
      stores[sid].count += 1;
      if (isRev) stores[sid].revenue += o.total;
      orderStoreBuckets.add(sid);

      if (isRev) {
        totals.revenue += o.total;
        if (o.paid) {
          totals.paidCount += 1;
          totals.paidRevenue += o.total;
        } else {
          totals.unpaidCount += 1;
          totals.unpaidRevenue += o.total;
        }
      } else {
        totals.cancelledCount += 1;
        // Cancelled revenue: dollars actually booked before cancel. 0 unless explicitly set; keep 0.
        totals.cancelledRevenue += 0;
      }

      if (Array.isArray(o.items)) {
        for (const line of o.items) {
          // For top-items, count items from non-cancelled orders (revenue-relevant).
          if (!isRev) continue;
          const iid = line.itemId || line.name || 'unknown';
          if (!items[iid]) items[iid] = { name: line.name || iid, qty: 0, revenue: 0 };
          items[iid].qty += (line.qty || 0);
          // revenue here = qty * unitPrice (avoids stale lineTotal on older orders).
          items[iid].revenue += (line.qty || 0) * (line.unitPrice || 0);
        }
      }
    }
    return { totals, stores, items };
  }

  function topItems(itemsMap, limit) {
    const arr = Object.values(itemsMap);
    arr.sort((a, b) => (b.qty - a.qty) || (b.revenue - a.revenue) || a.name.localeCompare(b.name));
    return arr.slice(0, limit);
  }

  function storesSorted(storesMap) {
    // Stable order: all DATA.stores first in their declared order, then 'other', then any extras.
    const declared = (window.DATA && window.DATA.stores) || [];
    const seen = new Set();
    const out = [];
    declared.forEach(s => {
      if (storesMap[s.id]) { out.push({ id: s.id, ...storesMap[s.id] }); seen.add(s.id); }
    });
    if (storesMap.other) { out.push({ id: 'other', ...storesMap.other }); seen.add('other'); }
    Object.keys(storesMap).forEach(k => {
      if (!seen.has(k)) out.push({ id: k, ...storesMap[k] });
    });
    return out;
  }

  function renderSales() {
    const root = document.getElementById('salesPane');
    if (!root) return;

    let orders = [];
    try { orders = currentOrders(); } catch { orders = []; }
    const seeded = !useCloud() && (typeof A.isSeed === 'function') && A.isSeed();
    const { totals, stores, items } = aggregate(orders);
    const storesList = storesSorted(stores);
    const top = topItems(items, 5);
    const totalItemsSold = Object.values(items).reduce((sum, i) => sum + i.qty, 0);
    const hasData = orders.length > 0;

    // Toolbar meta
    const meta = document.getElementById('salesMeta');
    if (meta) meta.textContent = hasData
      ? `${totals.orderCount} order${totals.orderCount === 1 ? '' : 's'} · ${totalItemsSold} item${totalItemsSold === 1 ? '' : 's'} sold · ${useCloud() ? 'live data' : (seeded ? 'sample data' : 'local data')}`
      : 'No data yet — sample orders appear when storage is empty.';

    const chip = document.getElementById('salesSeedChip');
    if (chip) chip.hidden = !seeded;

    if (!hasData) {
      root.innerHTML = `
        <div class="adm__empty">
          <div class="adm__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <h3>No sales yet</h3>
          <p>Stats will appear as soon as the first order lands in storage.</p>
        </div>`;
      return;
    }

    // Stat cards (revenue, count, paid, unpaid — cancelled separated)
    const cards = [
      { label: 'Total revenue', value: A.fmtMoney(totals.revenue), hint: `${totals.orderCount - totals.cancelledCount} non-cancelled order${totals.orderCount - totals.cancelledCount === 1 ? '' : 's'}`, tone: 'primary' },
      { label: 'Total orders',  value: String(totals.orderCount),  hint: `${totals.cancelledCount} cancelled`, tone: 'neutral' },
      { label: 'Paid',          value: A.fmtMoney(totals.paidRevenue), hint: `${totals.paidCount} order${totals.paidCount === 1 ? '' : 's'}`, tone: 'paid' },
      { label: 'Unpaid',        value: A.fmtMoney(totals.unpaidRevenue), hint: `${totals.unpaidCount} order${totals.unpaidCount === 1 ? '' : 's'}`, tone: 'unpaid' },
    ];

    const cardHtml = cards.map(c => `
      <div class="sales__card sales__card--${esc(c.tone)}">
        <span class="sales__card-label">${esc(c.label)}</span>
        <span class="sales__card-value">${esc(c.value)}</span>
        <span class="sales__card-hint">${esc(c.hint)}</span>
      </div>`).join('');

    // Per-store table
    const storeRows = storesList.length === 0
      ? `<tr><td colspan="3" class="sales__empty">No store data.</td></tr>`
      : storesList.map(s => {
          const share = totals.revenue > 0 ? Math.round((s.revenue / totals.revenue) * 100) : 0;
          return `
            <tr>
              <td>${esc(s.name)}</td>
              <td class="sales__num">${s.count}</td>
              <td class="sales__num">${A.fmtMoney(s.revenue)} <span class="sales__share">${share}%</span></td>
            </tr>`;
        }).join('');

    // Top items table
    const itemRows = top.length === 0
      ? `<tr><td colspan="3" class="sales__empty">No items sold yet.</td></tr>`
      : top.map((it, i) => `
          <tr>
            <td class="sales__rank">${i + 1}</td>
            <td>${esc(it.name)}</td>
            <td class="sales__num">${it.qty}</td>
            <td class="sales__num">${A.fmtMoney(it.revenue)}</td>
          </tr>`).join('');

    root.innerHTML = `
      <div class="sales__cards">${cardHtml}</div>
      <div class="sales__grid">
        <section class="sales__panel">
          <header class="sales__panel-head">
            <h2 class="sales__panel-title">Revenue by store</h2>
            <p class="sales__panel-sub">non-cancelled orders only</p>
          </header>
          <table class="sales__table">
            <thead>
              <tr><th>Store</th><th class="sales__num">Orders</th><th class="sales__num">Revenue</th></tr>
            </thead>
            <tbody>${storeRows}</tbody>
          </table>
        </section>
        <section class="sales__panel">
          <header class="sales__panel-head">
            <h2 class="sales__panel-title">Top items</h2>
            <p class="sales__panel-sub">by quantity sold</p>
          </header>
          <table class="sales__table">
            <thead>
              <tr><th class="sales__rank">#</th><th>Item</th><th class="sales__num">Qty</th><th class="sales__num">Revenue</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
        </section>
      </div>`;
  }

  window.AdminDashboard = { render, renderMenu, renderSales };
})();