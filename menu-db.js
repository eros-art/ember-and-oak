/* ==========================================================
   Ember & Oak Coffee — menu-db.js
   Loads menu items + add-ons from Supabase.
   Falls back to DATA.js if Supabase is unreachable.
   Exposes window.EOMenu for the rest of the app.
   ========================================================== */
window.EOMenu = (function () {
  'use strict';

  const state = {
    items: [],
    addons: [],
    addonMap: {},         // menuItemId -> [addon objects]
    ready: false,
    online: false,
    listeners: new Set(),
    channel: null,
  };

  function notify() {
    state.listeners.forEach(fn => { try { fn(); } catch {} });
  }

  function addonMapKey(itemId, addonId) { return `${itemId}:${addonId}`; }

  // Build the addon associations from menu_item_addons rows
  function buildAddonMap(addonRows, assocRows) {
    const addonById = {};
    addonRows.forEach(a => { addonById[a.id] = a; });
    const map = {};
    assocRows.forEach(assoc => {
      const addon = addonById[assoc.addon_id];
      if (!addon) return;
      if (!map[assoc.menu_item_id]) map[assoc.menu_item_id] = [];
      map[assoc.menu_item_id].push(addon);
    });
    return map;
  }

  // Transform DB row to the shape DATA.menu expects
  function rowToItem(row) {
    return {
      id: row.id,
      category: row.category,
      name: row.name,
      price: Number(row.price),
      shortDesc: row.short_desc,
      longDesc: row.long_desc,
      image: row.image,
      thumb: row.thumb,
      tags: row.tags || [],
      soldOut: !!row.sold_out,
      availableAddOns: (state.addonMap[row.id] || []).map(a => a.id),
    };
  }

  async function load() {
    const cfg = window.EO_SUPABASE;
    if (!cfg || !window.supabase) return false;
    try {
      const client = window.supabase.createClient(cfg.url, cfg.anonKey);

      const [itemRes, addonRes, assocRes] = await Promise.all([
        client.from('menu_items').select('*').eq('active', true).order('sort_order'),
        client.from('addons').select('*').eq('active', true).order('sort_order'),
        client.from('menu_item_addons').select('menu_item_id, addon_id'),
      ]);

      if (itemRes.error || addonRes.error || assocRes.error) {
        console.warn('[menu-db] load error:', itemRes.error || addonRes.error || assocRes.error);
        return false;
      }

      state.items = (itemRes.data || []).map(rowToItem);
      state.addons = addonRes.data || [];
      state.addonMap = buildAddonMap(addonRes.data || [], assocRes.data || []);
      state.ready = true;
      state.online = true;
      return true;
    } catch (e) {
      console.warn('[menu-db] load failed:', e.message);
      return false;
    }
  }

  function subscribe() {
    const cfg = window.EO_SUPABASE;
    if (!cfg || !window.supabase || state.channel) return;
    const client = window.supabase.createClient(cfg.url, cfg.anonKey);
    state.channel = client.channel('eo-menu')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        async () => { await load(); notify(); })
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'addons' },
        async () => { await load(); notify(); })
      .subscribe();
  }

  function fallbackItems() {
    return (window.DATA && DATA.menu) || [];
  }
  function fallbackAddOns() {
    return (window.DATA && DATA.addOns) || [];
  }

  function getItems() {
    return state.ready && state.online ? state.items : fallbackItems();
  }
  function getAddOns() {
    return state.ready && state.online
      ? state.addons.map(a => ({ id: a.id, name: a.name, price: Number(a.price) }))
      : fallbackAddOns();
  }
  function getAddOn(addOnId) {
    return getAddOns().find(a => a.id === addOnId);
  }
  function getItem(itemId) {
    return getItems().find(i => i.id === itemId);
  }
  function isReady() { return state.ready && state.online; }

  function onChange(fn) { state.listeners.add(fn); return () => state.listeners.delete(fn); }

  async function init() {
    const ok = await load();
    if (ok) subscribe();
    return ok;
  }

  return { init, getItems, getAddOns, getAddOn, getItem, isReady, onChange };
})();