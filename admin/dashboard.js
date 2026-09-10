/* Ember & Oak Admin — dashboard rendering (Phase 1.2 · Task D+)
 * Loaded after ../data.js (window.DATA) and data.js (window.AdminData).
 */
(function () {
  'use strict';
  const A = window.AdminData;
  function t(key) { return window.EOI18n ? EOI18n.t(key) : key; }
  function fmtMoney(n) { return window.EOI18n ? EOI18n.money(n) : A.fmtMoney(n); }
  const storeName = (id) => {
    const s = (window.DATA && window.DATA.stores || []).find(s => s.id === id);
    return s ? s.name : (id || '—');
  };

  /* ---------- Cloud-first order source (Phase 2) ---------- */
  const useCloud = () => !!(window.EOOrders && window.EOOrders.isOnline() && window.EOOrders.isReady());

  // Menu cloud data — must be initialized BEFORE any render call that may read it
  let cloudMenuItems = [];

  function currentOrders() {
    if (useCloud()) {
      try { return window.EOOrders.list(); } catch { /* fall through */ }
    }
    try { return A.getOrders(); } catch { return []; }
  }

  function pickLabel(order) {
    const when = order.customer.when;
    if (!when || when === 'asap' || when === '0') return t('time.asap');
    return t('time.' + when) || `in ~${when} min`;
  }

  function itemsSummary(items) {
    if (!items || items.length === 0) return '<b>' + t('misc.itemDefault') + '</b>';
    const list = items.map((l) => `${esc(l.name)} ×${l.qty}`).join('</li><li>');
    return `<b>${items.length} ${items.length === 1 ? t('admin.item') : t('admin.items')}</b><ul><li>${list}</li></ul>`;
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
      ? t('admin.liveOrders')
      : (seeded ? t('admin.sampleData') : t('admin.localStorage'));

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
          <h3>${t('admin.noOrders')}</h3>
          <p>${t('admin.noOrdersSub')}</p>
        </div>`;
      return;
    }

    listEl.innerHTML = orders.map((o) => {
      const paidCls = o.paid ? 'paid' : 'unpaid';
      const paidTxt = o.paid ? t('admin.paid') : t('admin.unpaid');
      const actions = o.status === 'pending'
        ? `<button type="button" class="adm__mini adm__mini--done" data-action="order-done" data-id="${esc(o.id)}">${t('admin.markDone')}</button>
           <button type="button" class="adm__mini adm__mini--cancel" data-action="order-cancel" data-id="${esc(o.id)}">${t('admin.cancel')}</button>`
        : `<button type="button" class="adm__mini adm__mini--reopen" data-action="order-reopen" data-id="${esc(o.id)}">${t('admin.reopen')}</button>`;
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
          <span class="orders__total">${fmtMoney(o.total)}</span>
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

  // Load menu from DB and subscribe to realtime
  loadMenuFromDB().then(() => {
    renderMenu();
    renderSales();
    // Subscribe to menu changes for live updates
    if (window.EO_SUPABASE && window.supabase) {
      const client = window.supabase.createClient(window.EO_SUPABASE.url, window.EO_SUPABASE.anonKey);
      client.channel('eo-admin-menu')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'menu_items' },
          async () => { await loadMenuFromDB(); renderMenu(); renderSales(); })
        .subscribe();
    }
  });

  /* ----------------------------------------------------------
 * Menu Manager (Task F) — inline price edit + sold-out toggle,
 * DB-first with localStorage fallback for offline.
 * ---------------------------------------------------------- */
  const MENU_OVERRIDES_KEY = 'emberOakMenuOverrides';

  async function loadMenuFromDB() {
    const cfg = window.EO_SUPABASE;
    if (!cfg || !window.supabase) return false;
    try {
      const client = window.supabase.createClient(cfg.url, cfg.anonKey);
      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      if (error) {
        console.warn('[menu-db] admin load:', error.message);
        return false;
      }
      cloudMenuItems = data || [];
      return true;
    } catch (e) {
      console.warn('[menu-db] admin load failed:', e.message);
      return false;
    }
  }

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
    if (cloudMenuItems.length > 0) {
      return cloudMenuItems.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        shortDesc: row.short_desc,
        price: Number(row.price),
        thumb: row.thumb,
        soldOut: !!row.sold_out,
        edited: false,
      }));
    }
    // Fallback: DATA.js + localStorage overrides (offline mode)
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
          <h3>${t('admin.noMenu')}</h3>
          <p>${t('admin.menuSub')}</p>
        </div>`;
      return;
    }

    listEl.innerHTML = items.map(it => `
      <div class="mnu__row${it.soldOut ? ' is-soldout' : ''}" data-item-id="${esc(it.id)}">
        <img class="mnu__thumb" src="${esc(it.thumb || '')}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
        <div class="mnu__who">
          <span class="mnu__name">${esc(it.name)}${it.soldOut ? ' <span class="badge badge--soldout">' + t('admin.soldOutBadge') + '</span>' : ''}</span>
          <span class="mnu__desc">${esc(it.shortDesc || '')}</span>
        </div>
        <span class="mnu__cat">${esc(categoryLabel(it.category))}</span>
        <div class="mnu__price-wrap">
          <button type="button" class="mnu__price" data-action="menu-edit-price" data-id="${esc(it.id)}" title="${t('admin.clickToEdit')}">${fmtMoney(it.price)}</button>
          <span class="mnu__price-hint">${t('admin.clickToEdit')}</span>
        </div>
        <label class="mnu__sold">
          <span class="mnu__sold-label">${t('menu.soldOut')}</span>
          <span class="switch">
            <input type="checkbox" data-action="menu-soldout" data-id="${esc(it.id)}" ${it.soldOut ? 'checked' : ''} />
            <span class="switch__slider"></span>
          </span>
        </label>
        <div class="mnu__flags">
          <span class="mnu__edited" ${it.edited ? '' : 'hidden'}>${t('admin.edited')}</span>
          ${it.edited ? `<button type="button" class="mnu__reset" data-action="menu-reset" data-id="${esc(it.id)}">${t('admin.reset')}</button>` : ''}
        </div>
      </div>`).join('');
  }

  async function menuAction(action, id, target) {
    const cfg = window.EO_SUPABASE;
    const client = (cfg && window.supabase)
      ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

    if (action === 'menu-soldout') {
      const on = !!target && target.checked;
      if (client) {
        const { error } = await client.from('menu_items')
          .update({ sold_out: on, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) console.warn('[menu] soldout update:', error.message);
        await loadMenuFromDB();
      } else {
        // Fallback: localStorage
        const map = loadOverrides();
        map[id] = Object.assign({}, map[id], { soldOut: on });
        saveOverrides(map);
      }
      renderMenu();
      return;
    }

    if (action === 'menu-reset') {
      if (client) {
        const baseItem = (window.DATA && DATA.menu || []).find(i => i.id === id);
        if (baseItem) {
          const { error } = await client.from('menu_items')
            .update({ price: baseItem.price, sold_out: false, updated_at: new Date().toISOString() })
            .eq('id', id);
          if (error) console.warn('[menu] reset:', error.message);
          await loadMenuFromDB();
        }
      } else {
        clearItemOverride(id);
      }
      renderMenu();
      return;
    }

    if (action === 'menu-reset-all') {
      if (client) {
        for (const baseItem of (window.DATA && DATA.menu || [])) {
          await client.from('menu_items')
            .update({ price: baseItem.price, sold_out: false, updated_at: new Date().toISOString() })
            .eq('id', baseItem.id);
        }
        await loadMenuFromDB();
      } else {
        saveOverrides({});
      }
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
        <input type="number" step="0.25" min="0" max="99" class="mnu__price-input" value="${item.price}" aria-label="${t('admin.clickToEdit')} ${esc(item.name)}" />
        <span class="mnu__price-hint">${t('admin.enterToSave')}</span>`;
      const input = wrap.querySelector('input');
      input.focus();
      input.select();
      return;
    }
  }

  async function commitPrice(input) {
    const row = input.closest('.mnu__row');
    if (!row) return;
    const id = row.dataset.itemId;
    const raw = input.value.trim();
    if (raw === '') { renderMenu(); return; }
    const price = Number(raw);
    if (isNaN(price) || price < 0 || price > 99) { renderMenu(); return; }

    const cfg = window.EO_SUPABASE;
    const client = (cfg && window.supabase)
      ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

    if (client) {
      const { error } = await client.from('menu_items')
        .update({ price: Math.round(price * 100) / 100, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) console.warn('[menu] price update:', error.message);
      await loadMenuFromDB();
    } else {
      const map = loadOverrides();
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
      ? `${totals.orderCount} ${totals.orderCount === 1 ? t('admin.item') : t('admin.items')} · ${totalItemsSold} ${t('admin.items')} · ${useCloud() ? t('admin.liveData') : (seeded ? t('admin.sampleDataShort') : t('admin.localData'))}`
      : t('admin.noDataYet');

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
          <h3>${t('admin.noSales')}</h3>
          <p>${t('admin.noDataYet')}</p>
        </div>`;
      return;
    }

    // Stat cards (revenue, count, paid, unpaid — cancelled separated)
    const cards = [
      { label: t('admin.totalRevenue'), value: fmtMoney(totals.revenue), hint: `${totals.orderCount - totals.cancelledCount} ${(totals.orderCount - totals.cancelledCount) === 1 ? t('admin.nonCancelled') : t('admin.nonCancelledPlural')}`, tone: 'primary' },
      { label: t('admin.totalOrders'),  value: String(totals.orderCount),  hint: `${totals.cancelledCount} ${t('admin.cancelled')}`, tone: 'neutral' },
      { label: t('admin.paid'),          value: fmtMoney(totals.paidRevenue), hint: `${totals.paidCount} ${t('admin.item')}${totals.paidCount === 1 ? '' : 's'}`, tone: 'paid' },
      { label: t('admin.unpaid'),        value: fmtMoney(totals.unpaidRevenue), hint: `${totals.unpaidCount} ${t('admin.item')}${totals.unpaidCount === 1 ? '' : 's'}`, tone: 'unpaid' },
    ];

    const cardHtml = cards.map(c => `
      <div class="sales__card sales__card--${esc(c.tone)}">
        <span class="sales__card-label">${esc(c.label)}</span>
        <span class="sales__card-value">${esc(c.value)}</span>
        <span class="sales__card-hint">${esc(c.hint)}</span>
      </div>`).join('');

    // Per-store table
    const storeRows = storesList.length === 0
      ? `<tr><td colspan="3" class="sales__empty">${t('admin.noStoreData')}</td></tr>`
      : storesList.map(s => {
          const share = totals.revenue > 0 ? Math.round((s.revenue / totals.revenue) * 100) : 0;
          return `
            <tr>
              <td>${esc(s.name)}</td>
              <td class="sales__num">${s.count}</td>
              <td class="sales__num">${fmtMoney(s.revenue)} <span class="sales__share">${share}%</span></td>
            </tr>`;
        }).join('');

    // Top items table
    const itemRows = top.length === 0
      ? `<tr><td colspan="3" class="sales__empty">${t('admin.noItemsSold')}</td></tr>`
      : top.map((it, i) => `
          <tr>
            <td class="sales__rank">${i + 1}</td>
            <td>${esc(it.name)}</td>
            <td class="sales__num">${it.qty}</td>
            <td class="sales__num">${fmtMoney(it.revenue)}</td>
          </tr>`).join('');

    root.innerHTML = `
      <div class="sales__cards">${cardHtml}</div>
      <div class="sales__grid">
        <section class="sales__panel">
          <header class="sales__panel-head">
            <h2 class="sales__panel-title">${t('admin.revenueByStore')}</h2>
            <p class="sales__panel-sub">${t('admin.nonCancelledPlural')}</p>
          </header>
          <table class="sales__table">
            <thead>
              <tr><th>${t('admin.store')}</th><th class="sales__num">${t('admin.ordersCol')}</th><th class="sales__num">${t('admin.revenue')}</th></tr>
            </thead>
            <tbody>${storeRows}</tbody>
          </table>
        </section>
        <section class="sales__panel">
          <header class="sales__panel-head">
            <h2 class="sales__panel-title">${t('admin.topItems')}</h2>
            <p class="sales__panel-sub">${t('admin.byQuantity')}</p>
          </header>
          <table class="sales__table">
            <thead>
              <tr><th class="sales__rank">#</th><th>${t('admin.itemCol')}</th><th class="sales__num">${t('admin.qty')}</th><th class="sales__num">${t('admin.revenue')}</th></tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
        </section>
      </div>`;
  }

  /* Re-render all panels when language changes */
  window.addEventListener('eo:languagechange', function () {
    render();
    renderMenu();
    renderSales();
  });

  window.AdminDashboard = { render, renderMenu, renderSales };
})();