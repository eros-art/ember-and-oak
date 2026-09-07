/* Ember & Oak Admin — orders data source (Phase 1.2 · Task C)
 * Reads the SAME emberOakOrders key the customer checkout writes to,
 * falls back to demo seed orders when none are stored yet.
 * Exposes window.AdminData for the dashboard tabs.
 */
(function () {
  'use strict';

  const ORDERS_KEY = 'emberOakOrders';
  const VERSION = 1;

  /* ----------------------------------------------------------
   * Stored orders (authoritative)
   * ---------------------------------------------------------- */
  function loadOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (!raw) return null; // nothing stored -> use seeds
      const parsed = JSON.parse(raw);
      const data = (parsed && typeof parsed === 'object' && 'data' in parsed) ? parsed.data : parsed;
      if (!Array.isArray(data)) return null; // malformed -> fall back to seeds
      return data;
    } catch {
      return null; // unreadable -> fall back to seeds
    }
  }

  function saveOrders(arr) {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify({ version: VERSION, data: arr })); }
    catch { /* ignore quota/private mode */ }
  }

  /* ----------------------------------------------------------
   * Normalization — customer orders don't carry status/paid yet,
   * so we derive safe defaults without mutating stored data.
   * ---------------------------------------------------------- */
  function normalize(o, idx) {
    if (!o || typeof o !== 'object') return null;
    const status = ['completed', 'cancelled'].includes(o.status) ? o.status : o.status || 'pending';
    return {
      ...o,
      status,
      paid: o.paid === true,
      items: Array.isArray(o.items) ? o.items : [],
      total: typeof o.total === 'number' ? o.total : 0,
      id: o.id || `EO-${new Date().getFullYear()}-${String(idx + 1).padStart(4, '0')}`,
      ts: o.ts || Date.now(),
      customer: Object.assign({ name: 'Guest', phone: '', address: '', store: null, when: 'asap', notes: '' }, o.customer || {}),
    };
  }

  /* ----------------------------------------------------------
   * Seed orders — realistic demo data, only used when the store
   * doesn't have any real orders yet. Never written to storage.
   * ---------------------------------------------------------- */
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  function ago(ms) { return Date.now() - ms; }

  function seedOrders() {
    return [
      {
        id: 'EO-2026-0001',
        ts: ago(12 * MINUTE),
        status: 'pending',
        paid: false,
        customer: {
          name: 'Maya Chen',
          phone: '(503) 555-0147',
          address: '',
          store: 'maple',
          when: '15',
          notes: 'Extra hot, please.',
        },
        items: [
          { lineId: 'seed-s1', itemId: 'honeyoat', storeId: 'maple', name: 'Honey Oat Latte', qty: 1, addOnIds: ['shot'], unitPrice: 6.5, lineTotal: 6.5 },
          { lineId: 'seed-s2', itemId: 'almond',   storeId: 'maple', name: 'Almond Croissant', qty: 2, addOnIds: [],        unitPrice: 4.5, lineTotal: 9.0 },
        ],
        total: 15.5,
      },
      {
        id: 'EO-2026-0002',
        ts: ago(34 * MINUTE),
        status: 'pending',
        paid: false,
        customer: {
          name: 'Theo Grant',
          phone: '(503) 555-0284',
          address: '',
          store: 'pearl',
          when: 'asap',
          notes: 'Call on arrival.',
        },
        items: [
          { lineId: 'seed-p1', itemId: 'mocha',  storeId: 'pearl', name: 'Mocha Ember', qty: 2, addOnIds: ['vanilla'], unitPrice: 6.25, lineTotal: 12.5 },
          { lineId: 'seed-p2', itemId: 'banana', storeId: 'pearl', name: 'Banana Bread', qty: 1, addOnIds: [],          unitPrice: 4.0, lineTotal: 4.0 },
        ],
        total: 16.5,
      },
      {
        id: 'EO-2026-0003',
        ts: ago(2 * HOUR + 5 * MINUTE),
        status: 'completed',
        paid: true,
        customer: {
          name: 'Priya Nair',
          phone: '(503) 555-0319',
          address: '',
          store: 'hawthorne',
          when: '20',
          notes: '',
        },
        items: [
          { lineId: 'seed-h1', itemId: 'cold',   storeId: 'hawthorne', name: 'Cold Brew', qty: 2, addOnIds: [],         unitPrice: 4.75, lineTotal: 9.5 },
          { lineId: 'seed-h2', itemId: 'avo',    storeId: 'hawthorne', name: 'Avocado Toast', qty: 1, addOnIds: [],      unitPrice: 8.5, lineTotal: 8.5 },
          { lineId: 'seed-h3', itemId: 'matcha', storeId: 'hawthorne', name: 'Matcha Oat', qty: 1, addOnIds: ['oat'],   unitPrice: 5.5, lineTotal: 5.5 },
        ],
        total: 23.5,
      },
      {
        id: 'EO-2026-0004',
        ts: ago(3 * HOUR + 20 * MINUTE),
        status: 'cancelled',
        paid: false,
        customer: {
          name: 'Dana Ortiz',
          phone: '(503) 555-0402',
          address: '',
          store: 'beaverton',
          when: 'asap',
          notes: 'Never mind — heading out of town.',
        },
        items: [
          { lineId: 'seed-b1', itemId: 'pourover', storeId: 'beaverton', name: 'Pour Over', qty: 1, addOnIds: [], unitPrice: 5.0, lineTotal: 5.0 },
        ],
        total: 5.0,
      },
      {
        id: 'EO-2026-0005',
        ts: ago(5 * HOUR + 10 * MINUTE),
        status: 'completed',
        paid: true,
        customer: {
          name: 'Sam Whitfield',
          phone: '(503) 555-0507',
          address: '4108 NE 17th Ave, Portland, OR 97212',
          store: 'maple',
          when: '45',
          notes: 'Delivery to side door.',
        },
        items: [
          { lineId: 'seed-s3', itemId: 'house',  storeId: 'maple', name: 'House Drip', qty: 3, addOnIds: [],       unitPrice: 3.5, lineTotal: 10.5 },
          { lineId: 'seed-s4', itemId: 'french', storeId: 'maple', name: 'French Press', qty: 1, addOnIds: ['oat'], unitPrice: 5.0, lineTotal: 5.0 },
          { lineId: 'seed-s5', itemId: 'yogurt', storeId: 'maple', name: 'Yogurt Bowl', qty: 2, addOnIds: ['honey'], unitPrice: 6.5, lineTotal: 13.0 },
        ],
        total: 28.5,
      },
    ];
  }

  /* ----------------------------------------------------------
   * Public API
   * ---------------------------------------------------------- */
  function getOrders() {
    const stored = loadOrders();
    if (stored) return stored.map(normalize);
    return seedOrders().map(normalize);
  }

  function isSeed() {
    const stored = loadOrders();
    return stored === null || (Array.isArray(stored) && stored.length === 0);
  }

  function clearSeeds() {
    // Force stored = [] so seeds stop appearing (used once real state exists).
    try {
      if (!localStorage.getItem(ORDERS_KEY)) saveOrders([]);
    } catch { /* ignore */ }
  }

  function fmtMoney(n) {
    const v = Number(n || 0);
    return '$' + v.toFixed(2);
  }

  function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(', ', ' · ');
  }

  window.AdminData = {
    ORDERS_KEY,
    getOrders,
    isSeed,
    saveOrders,
    clearSeeds,
    fmtMoney,
    fmtTime,
  };
})();