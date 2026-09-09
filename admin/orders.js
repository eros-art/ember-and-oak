/* Ember & Oak Admin — cloud orders bridge (Phase 2)
 * Loads orders from Supabase and mirrors them in-memory.
 * When online+ready the dashboard reads from here; otherwise it falls back
 * to window.AdminData (localStorage + seeds) exactly like Phase 1.
 * Loaded after ../supabase-config.js, the supabase-js CDN, and data.js.
 */
(function () {
  'use strict';

  const A = window.AdminData;

  const state = {
    client: null,
    online: false,   // last load/init succeeded
    ready: false,    // list has been populated at least once
    list: [],        // normalized orders, newest first
    channel: null,
    loading: false,
    error: null,
    listeners: new Set(),
  };

  function buildClient() {
    if (state.client) return state.client;
    const cfg = window.EO_SUPABASE;
    if (!cfg || !window.supabase) return null;
    state.client = window.supabase.createClient(cfg.url, cfg.anonKey);
    return state.client;
  }

  function notify() {
    state.listeners.forEach(fn => { try { fn(); } catch { /* ignore */ } });
  }

  /* Normalize a DB row into the same shape AdminData uses.
   * data jsonb is the source of truth; mirrored columns fill any gaps. */
  function normalizeRow(row) {
    const order = (row && row.data && typeof row.data === 'object') ? row.data : (row || {});
    let status = String(order.status || row.status || '').toLowerCase() || 'pending';
    if (status === 'new') status = 'pending';
    const out = Object.assign({}, order, {
      id: order.id || row.eo_id || 'EO-UNKNOWN',
      ts: typeof order.ts === 'number' ? order.ts : row.ts,
      status,
      paid: !!(order.paid === true || row.paid === true),
    });
    return (A && typeof A.normalize === 'function') ? A.normalize(out) : out;
  }

  async function load() {
    const c = buildClient();
    if (!c) return false;
    if (state.loading) return true; // an in-flight load will update us
    state.loading = true;
    try {
      const { data, error } = await c.from('orders')
        .select('eo_id,ts,status,paid,data')
        .order('ts', { ascending: false });
      if (error) {
        console.warn('[cloud] load:', error.message);
        state.online = false;
        state.error = error.message;
        return false;
      }
      state.list = (data || []).map(normalizeRow);
      state.online = true;
      state.ready = true;
      state.error = null;
      return true;
    } catch (e) {
      state.online = false;
      state.error = e && e.message;
      return false;
    } finally {
      state.loading = false;
    }
  }

  async function refresh() {
    const ok = await load();
    if (ok) notify();
    return ok;
  }

  function subscribe() {
    const c = state.client;
    if (!c || state.channel) return;
    state.channel = c.channel('eo-orders')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          const ok = await load();
          if (ok) notify();
        })
      .subscribe();
  }

  /* Persist a status/paid change to Supabase + keep local copy in step. */
  async function setStatus(eo_id, patch) {
    const c = state.client;
    if (!c) return { ok: false, error: 'no-client' };
    const { error } = await c.from('orders').update(patch).eq('eo_id', eo_id);
    if (error) {
      console.warn('[cloud] update:', error.message);
      return { ok: false, error };
    }
    if (A && typeof A.saveOrders === 'function') {
      const local = A.getOrders();
      const t = local.find(o => o.id === eo_id);
      if (t) Object.assign(t, patch);
      A.saveOrders(local);
    }
    const ok = await load();
    if (ok) notify();
    return { ok: true };
  }

  /* One-time import of existing localStorage orders into Supabase. */
  async function importLocal() {
    const c = state.client;
    if (!c) return 0;
    const local = A.getOrders();
    const have = {};
    state.list.forEach(o => { have[o.id] = true; });
    const toInsert = local.filter(o => !have[o.id]);
    if (toInsert.length === 0) return 0;
    const rows = toInsert.map(o => ({
      eo_id: o.id,
      ts: o.ts,
      status: o.status === 'completed' || o.status === 'cancelled' ? o.status : 'pending',
      paid: !!o.paid,
      data: o,
    }));
    const { error } = await c.from('orders').insert(rows);
    if (error) console.warn('[cloud] import:', error.message);
    await load();
    notify();
    return error ? 0 : toInsert.length;
  }

  function onChange(fn) {
    state.listeners.add(fn);
    return () => state.listeners.delete(fn);
  }

  window.EOOrders = {
    isReady: () => state.ready,
    isOnline: () => state.online,
    list: () => state.list,
    init: () => Promise.resolve().then(refresh).then(ok => { if (ok) subscribe(); return ok; }),
    refresh,
    setStatus,
    importLocal,
    onChange,
  };
})();