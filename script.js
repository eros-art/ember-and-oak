/* ==========================================================
   Ember & Oak Coffee — script.js
   Interactions: scroll reveals, parallax, menu filter,
   testimonial slider, form validation, theme toggle, etc.
   ========================================================== */

(() => {
  'use strict';

  // ---------- Helpers ----------
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => `$${n.toFixed(2)}`;

  // ---------- 0. Render menu from DATA ----------
  // Value-card icons (Lucide-style inline SVG)
  const VALUE_ICONS = {
    bean:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 8c0-3-2-5-5-5S7 5 7 8c0 4 5 11 5 11s5-7 5-11Z"/><path d="M12 5v14"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5 .5 2.5-2 4.05-3.5 4.5C9 9.5 6.5 11 6.5 13.5c0 1 .5 1.5 1 1.5"/></svg>',
    leaf:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1 1.5.5 7-2 9.5-2.65 2.65-6 4-9 4Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
  };

  // Add-on popover — for now we add the item with no add-ons; a future step will
  // open a per-line editor in the drawer.
  function renderMenu() {
    const grid = $('#menuGrid');
    if (!grid || !window.DATA) return;
    grid.innerHTML = '';
    DATA.menu.forEach(item => {
      const tagsHtml = (item.tags || []).map((t, i) =>
        `<span class="tag${t === 'Fan Favorite' ? ' tag--accent' : ''}">${t}</span>`
      ).join('');
      const card = document.createElement('article');
      card.className = 'card menu-card';
      card.dataset.category = item.category;
      card.dataset.itemId = item.id;
      card.dataset.img = item.image;
      card.dataset.descLong = item.longDesc;
      card.innerHTML = `
        <div class="menu-card__img">
          <img src="${item.thumb}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="menu-card__body">
          <div class="menu-card__head">
            <h3 class="menu-card__title">${item.name}</h3>
            <span class="menu-card__price">${money(item.price)}</span>
          </div>
          <p class="menu-card__desc">${item.shortDesc}</p>
          ${tagsHtml}
          <button class="btn btn--primary menu-card__add" type="button"
                  data-action="add-to-cart" data-item-id="${item.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add to cart
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
    // re-observe new cards for reveals
    if ('IntersectionObserver' in window && !isReducedMotion) {
      $$('.reveal', grid).forEach(el => revealIO?.observe(el));
    }
  }

  // ---------- 0b. Render about from DATA ----------
  function renderAbout() {
    if (!window.DATA) return;
    const { eyebrow, title, paragraphs, values } = DATA.about;
    const eyebrowEl = $('[data-about-eyebrow]');
    const titleEl   = $('[data-about-title]');
    const copyEl    = $('[data-about-copy]');
    const valuesEl  = $('[data-about-values]');
    if (eyebrowEl) eyebrowEl.textContent = eyebrow;
    if (titleEl)   titleEl.innerHTML = title;
    if (copyEl) {
      copyEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    if (valuesEl) {
      valuesEl.innerHTML = values.map(v => `
        <div class="value-card">
          <span class="value-card__icon" aria-hidden="true">${VALUE_ICONS[v.icon] || ''}</span>
          <h4>${v.title}</h4>
          <p>${v.text}</p>
        </div>
      `).join('');
    }
  }

  // ---------- 0c. Render reviews from DATA ----------
  function renderReviews() {
    const track = $('#revTrack');
    if (!track || !window.DATA) return;
    track.innerHTML = DATA.reviews.map((r, i) => `
      <article class="card review${i === 0 ? ' is-active' : ''}">
        <div class="stars" aria-label="${r.rating} out of ${r.rating} stars">
          ${'<span>★</span>'.repeat(r.rating)}
        </div>
        <p class="review__quote">&ldquo;${r.quote}&rdquo;</p>
        <div class="review__author">
          <div class="avatar" style="--c1:${r.avatarColor1};--c2:${r.avatarColor2}">${r.initials}</div>
          <div>
            <strong>${r.name}</strong>
            <span>${r.role}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ==========================================================
  // 0d. CART STATE + PERSISTENCE
  // ==========================================================
  const CART_KEY = 'emberOakCart';

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // versioned payload: { version, data }
      const data = (parsed && typeof parsed === 'object' && 'data' in parsed) ? parsed.data : parsed;
      if (!Array.isArray(data)) return [];
      const v = (parsed && parsed.version) || 0;
      if (v !== (window.DATA && DATA.version)) return []; // rebuild from scratch on schema bump
      return data;
    } catch { return []; }
  }
  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ version: (window.DATA && DATA.version) || 1, data: state.cart }));
    } catch { /* quota or private mode — ignore */ }
  }

  const state = {
    cart: loadCart(),
  };

  // ---------- 0e. Price helpers ----------
  function getItem(itemId) {
    return DATA.menu.find(m => m.id === itemId);
  }
  function getAddOn(addOnId) {
    return DATA.addOns.find(a => a.id === addOnId);
  }
  function lineUnitPrice(line) {
    const item = getItem(line.itemId);
    if (!item) return 0;
    const addOnTotal = (line.addOnIds || []).reduce((sum, id) => {
      const a = getAddOn(id);
      return sum + (a ? a.price : 0);
    }, 0);
    return item.price + addOnTotal;
  }
  function lineSubtotal(line) {
    return lineUnitPrice(line) * (line.qty || 0);
  }
  function cartSubtotal() {
    return state.cart.reduce((sum, l) => sum + lineSubtotal(l), 0);
  }
  function cartCount() {
    return state.cart.reduce((sum, l) => sum + (l.qty || 0), 0);
  }
  function storeFor(storeId) {
    return DATA.stores.find(s => s.id === storeId);
  }
  // Default store = primary store
  function defaultStoreId() {
    return (DATA && DATA.primaryStoreId) || (DATA.stores[0] && DATA.stores[0].id);
  }
  function addOnsKey(addOnIds) {
    return [...(addOnIds || [])].sort().join('|');
  }

  // ---------- 0f. Cart mutators ----------
  function addToCart(itemId, storeId, qty = 1, addOnIds = []) {
    const item = getItem(itemId);
    if (!item) return;
    const useStore = storeId || defaultStoreId();
    const key = addOnsKey(addOnIds);
    // merge by itemId + storeId + sorted addOnIds
    const existing = state.cart.find(l =>
      l.itemId === itemId && l.storeId === useStore && addOnsKey(l.addOnIds) === key
    );
    if (existing) {
      existing.qty = (existing.qty || 0) + qty;
    } else {
      state.cart.push({
        lineId: 'l_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        itemId,
        storeId: useStore,
        qty,
        addOnIds: [...addOnIds],
      });
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
  function changeQty(lineId, delta) {
    const line = state.cart.find(l => l.lineId === lineId);
    if (!line) return;
    const next = (line.qty || 0) + delta;
    if (next <= 0) {
      removeLine(lineId);
      return;
    }
    line.qty = next;
    saveCart();
    updateCartBadge();
    renderCart();
  }
  function removeLine(lineId) {
    state.cart = state.cart.filter(l => l.lineId !== lineId);
    saveCart();
    updateCartBadge();
    renderCart();
  }
  function removeAddOn(lineId, addOnId) {
    const line = state.cart.find(l => l.lineId === lineId);
    if (!line) return;
    line.addOnIds = (line.addOnIds || []).filter(id => id !== addOnId);
    saveCart();
    renderCart();
  }

  // ---------- 0g. Cart rendering ----------
  function updateCartBadge() {
    const badge = $('#navCartCount');
    if (!badge) return;
    const n = cartCount();
    badge.textContent = String(n);
    badge.classList.toggle('is-visible', n > 0);
  }

  function cartLineRow(line) {
    const item = getItem(line.itemId);
    const store = storeFor(line.storeId);
    if (!item) return '';
    const addOnChips = (line.addOnIds || []).map(id => {
      const a = getAddOn(id);
      if (!a) return '';
      return `<li>${a.name} <button type="button" data-action="cart-remove-addon" data-line-id="${line.lineId}" data-addon-id="${id}" aria-label="Remove ${a.name}">×</button></li>`;
    }).join('');
    return `
      <article class="cart-line">
        <img class="cart-line__img" src="${item.thumb}" alt="${item.name}" loading="lazy" />
        <div class="cart-line__body">
          <div class="cart-line__head">
            <span class="cart-line__name">${item.name}</span>
            <span class="cart-line__price">${money(lineSubtotal(line))}</span>
          </div>
          <div class="cart-line__store">Pickup at ${store ? store.name : 'store'}</div>
          ${addOnChips ? `<ul class="cart-line__addons">${addOnChips}</ul>` : ''}
          <div class="cart-line__qty">
            <button type="button" class="qty-btn" data-action="cart-dec" data-line-id="${line.lineId}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${line.qty}</span>
            <button type="button" class="qty-btn" data-action="cart-inc" data-line-id="${line.lineId}" aria-label="Increase quantity">+</button>
            <button type="button" class="cart-line__remove" data-action="cart-remove-line" data-line-id="${line.lineId}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCart() {
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    const subEl = $('#cartSubtotal');
    if (!body) return;
    if (state.cart.length === 0) {
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <div class="cart-drawer__empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p>Add a drink or pastry from the menu to get started.</p>
          <button class="btn btn--primary" type="button" data-action="close-cart">Browse menu</button>
        </div>`;
      if (foot) foot.hidden = true;
    } else {
      body.innerHTML = state.cart.map(cartLineRow).join('');
      if (foot) foot.hidden = false;
      if (subEl) subEl.textContent = money(cartSubtotal());
    }
  }

  // ---------- 0h. Cart drawer visibility ----------
  function openCart() {
    const drawer = $('#cartDrawer');
    const backdrop = $('#cartBackdrop');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.hidden = false;
      // next frame so the transition fires
      requestAnimationFrame(() => backdrop.classList.add('is-open'));
    }
    document.body.classList.add('drawer-open');
  }
  function closeCart() {
    const drawer = $('#cartDrawer');
    const backdrop = $('#cartBackdrop');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      // hide after transition
      setTimeout(() => { backdrop.hidden = true; }, 300);
    }
    document.body.classList.remove('drawer-open');
  }

  // ---------- 0i. Delegated cart actions ----------
  function handleCartAction(action, target) {
    switch (action) {
      case 'add-to-cart': {
        const id = target.dataset.itemId;
        if (id) addToCart(id);
        openCart();
        break;
      }
      case 'open-cart':     openCart(); break;
      case 'close-cart':    closeCart(); break;
      case 'cart-inc':      changeQty(target.dataset.lineId, +1); break;
      case 'cart-dec':      changeQty(target.dataset.lineId, -1); break;
      case 'cart-remove-line':   removeLine(target.dataset.lineId); break;
      case 'cart-remove-addon':  removeAddOn(target.dataset.lineId, target.dataset.addonId); break;
    }
  }

  // ==========================================================
  // 0j. CHECKOUT MODAL + ORDERS
  // ==========================================================
  const ORDERS_KEY = 'emberOakOrders';
  const checkoutModal = $('#checkoutModal');
  const checkoutForm  = $('#checkoutForm');

  function loadOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const data = (parsed && typeof parsed === 'object' && 'data' in parsed) ? parsed.data : parsed;
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }
  function saveOrders(arr) {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify({ version: 1, data: arr })); }
    catch { /* ignore */ }
  }

  function nextOrderId(orders) {
    const year = new Date().getFullYear();
    const seq = orders.length + 1;
    return `EO-${year}-${String(seq).padStart(4, '0')}`;
  }

  function openCheckout() {
    if (state.cart.length === 0) return;
    renderCheckoutSummary();
    populateStoreOptions();
    // Reset to form step + clear validation markers
    setCheckoutStep('form');
    checkoutForm?.reset();
    $$('#checkoutForm .form__group').forEach(g => g.classList.remove('has-error'));
    $$('#checkoutForm .form__error').forEach(e => { e.textContent = ''; });
    // Close the cart drawer underneath before showing checkout
    closeCart();
    if (checkoutModal) {
      checkoutModal.hidden = false;
      document.body.classList.add('drawer-open'); // reuse body-scroll-lock class
    }
  }
  function closeCheckout() {
    if (checkoutModal) checkoutModal.hidden = true;
    document.body.classList.remove('drawer-open');
  }

  function setCheckoutStep(step) {
    $$('.checkout__step').forEach(el => el.classList.remove('is-active'));
    $(`.checkout__step--${step}`)?.classList.add('is-active');
  }

  function renderCheckoutSummary() {
    const totalQty = state.cart.reduce((s, l) => s + l.qty, 0);
    const total = cartSubtotal();
    const ic = $('#co-item-count');
    const tt = $('#co-total');
    if (ic) ic.textContent = totalQty;
    if (tt) tt.textContent = money(total);
  }

  function populateStoreOptions() {
    const sel = $('#co-store');
    if (!sel || !window.DATA) return;
    const cur = sel.value;
    sel.innerHTML = window.DATA.stores
      .map(s => `<option value="${s.id}">${s.name} — ${s.neighborhood}</option>`)
      .join('');
    // Default to first line's store if not set
    if (state.cart.length) {
      sel.value = state.cart[0].storeId || window.DATA.stores[0].id;
    }
    if (cur) sel.value = cur;
  }

  function validateCheckout() {
    let ok = true;
    const fields = [
      { id: 'co-name',    key: 'name' },
      { id: 'co-phone',   key: 'phone' },
      { id: 'co-address', key: 'address' },
      { id: 'co-store',   key: 'store' },
    ];
    fields.forEach(({ id, key }) => {
      const el = $('#' + id);
      const wrap = el.closest('.form__group');
      const err = wrap.querySelector('.form__error');
      err.textContent = '';
      wrap.classList.remove('has-error');
      const v = (el.value || '').trim();
      if (key === 'name' && v.length < 2) {
        err.textContent = 'Please enter your name';
        wrap.classList.add('has-error');
        ok = false;
      } else if (key === 'phone') {
        // Permissive phone check: 7+ digits
        const digits = v.replace(/\D/g, '');
        if (digits.length < 7) {
          err.textContent = 'Please enter a valid phone';
          wrap.classList.add('has-error');
          ok = false;
        }
      } else if (key === 'address' && v.length < 5) {
        err.textContent = 'Please enter a pickup address';
        wrap.classList.add('has-error');
        ok = false;
      } else if (key === 'store' && !v) {
        err.textContent = 'Please choose a store';
        wrap.classList.add('has-error');
        ok = false;
      }
    });
    return ok;
  }

  function placeOrder() {
    if (state.cart.length === 0) return null;
    if (!validateCheckout()) return null;

    const form = checkoutForm;
    const data = Object.fromEntries(new FormData(form).entries());
    const orders = loadOrders();
    const order = {
      id: nextOrderId(orders),
      ts: Date.now(),
      customer: {
        name:    (data.name || '').trim(),
        phone:   (data.phone || '').trim(),
        address: (data.address || '').trim(),
        store:   data.store || null,
        when:    data.when || 'asap',
        notes:   (data.notes || '').trim(),
      },
      items: state.cart.map(l => ({
        lineId: l.lineId,
        itemId: l.itemId,
        storeId: l.storeId,
        name: getItem(l.itemId)?.name || 'Item',
        qty: l.qty,
        addOnIds: [...(l.addOnIds || [])],
        unitPrice: lineUnitPrice(l),
        lineTotal: lineSubtotal(l),
      })),
      total: cartSubtotal(),
    };
    orders.push(order);
    saveOrders(orders);

    // Show success step
    const oid = $('#co-order-id');
    const ps  = $('#co-pickup-store');
    const pw  = $('#co-pickup-when');
    if (oid) oid.textContent = order.id;
    const storeObj = window.DATA.stores.find(s => s.id === order.customer.store);
    if (ps) ps.textContent = storeObj ? `${storeObj.name}` : '—';
    if (pw) pw.textContent = ({
      asap: 'as soon as it’s ready',
      '15': 'in 15 minutes',
      '30': 'in 30 minutes',
      '45': 'in 45 minutes',
      '60': 'in 1 hour',
    })[order.customer.when] || '—';
    setCheckoutStep('success');
  }

  // Delegated checkout actions
  function handleCheckoutAction(action) {
    switch (action) {
      case 'open-checkout':              openCheckout(); break;
      case 'close-checkout':             closeCheckout(); break;
      case 'close-checkout-and-continue':
        closeCheckout();
        // Clear cart & re-render
        state.cart = [];
        saveCart();
        updateCartBadge();
        renderCart();
        break;
    }
  }

  // Checkout form submit -> placeOrder
  // (The submit handler is registered once at module top level below,
  //  with a loading state and a simulated network delay.)

  // ==========================================================
  // 0k. AUTH MODAL (login / signup — demo mock)
  // ==========================================================
  const authModal = $('#authModal');
  const loginForm = $('#loginForm');
  const signupForm = $('#signupForm');

  function openAuth(pane = 'login') {
    if (!authModal) return;
    setAuthPane(pane);
    authModal.hidden = false;
    document.body.classList.add('drawer-open');
    setTimeout(() => $('#authModal input')?.focus({ preventScroll: true }), 50);
  }
  function closeAuth() {
    if (authModal) authModal.hidden = true;
    document.body.classList.remove('drawer-open');
  }
  function setAuthPane(pane) {
    if (!authModal) return;
    $$('.auth__tab', authModal).forEach(t => {
      const active = t.dataset.authAction === `show-${pane}`;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    $$('.auth__pane', authModal).forEach(p => {
      p.classList.toggle('is-active', p.dataset.authPane === pane);
    });
  }
  function authFieldError(form, name, message) {
    const el = $(`#${form}-form [name="${name}"]`);
    if (!el) return;
    const wrap = el.closest('.form__group');
    const err = wrap.querySelector('.form__error');
    if (err) err.textContent = message || '';
    wrap.classList.toggle('has-error', Boolean(message));
  }
  function mockAuth(form, name, message) {
    const fields = $('#' + form + 'Form') ? Array.from($('#' + form + 'Form').querySelectorAll('input')) : [];
    let ok = true;
    fields.forEach(f => {
      const v = (f.value || '').trim();
      let msg = '';
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email';
      else if (f.type === 'password' && f.name !== 'password' && v.length < 8 && form === 'signup') msg = 'At least 8 characters';
      else if (f.name === 'name' && v.length < 2 && form === 'signup') msg = 'Enter your name';
      else if (f.required && !v) msg = 'This field is required';
      authFieldError(form, f.name, msg);
      if (msg) ok = false;
    });
    if (!ok) return;
    closeAuth();
    setLoggedIn(name);
  }
  function setLoggedIn(name) {
    const btn = $('#navLogin');
    const mBtn = $('#mobileLogin');
    const label = name || 'Logged in';
    if (btn) { btn.textContent = label; btn.classList.add('is-user'); }
    if (mBtn) { mBtn.textContent = label; mBtn.classList.add('is-user'); }
  }

  // Nav login buttons open modal
  $('#navLogin')?.addEventListener('click', () => openAuth('login'));
  $('#mobileLogin')?.addEventListener('click', () => openAuth('login'));

  // Tab switching
  authModal?.addEventListener('click', (e) => {
    const t = e.target.closest('[data-auth-action]');
    if (!t) return;
    const action = t.dataset.authAction;
    if (action === 'show-login') setAuthPane('login');
    else if (action === 'show-signup') setAuthPane('signup');
    else if (action === 'close-auth') closeAuth();
  });

  // Backdrop click / close-auth via delegation
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action="close-auth"]');
    if (t) closeAuth();
  });

  // Form submits (mock)
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    mockAuth('login', $('#login-email')?.value.split('@')[0] || 'Coffee lover');
  });
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    mockAuth('signup', $('#signup-name')?.value.trim() || 'Coffee lover');
  });

  // ESC closes auth modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuth();
  });


  // ---------- 1. Nav: solid on scroll, active link highlight ----------
  const nav = $('#nav');
  const sections = ['home', 'about', 'menu', 'contact']
    .map(id => $('#' + id))
    .filter(Boolean);
  const navLinks = $$('.nav__link');

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    // active section
    const pos = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= pos) current = s.id;
    }
    navLinks.forEach(l => {
      l.classList.toggle(
        'is-active',
        l.getAttribute('href') === '#' + current
      );
    });

    // back to top
    $('#toTop')?.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 2. Mobile menu ----------
  const burger = $('#burger');
  const mobileMenu = $('#mobile-menu');
  burger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.mobile-menu__link, .mobile-menu .btn').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // ---------- 3. Hero parallax-lite (subtle) ----------
  const heroBg = $('#heroBg');
  if (heroBg && !isReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.0002})`;
      }
    }, { passive: true });
  }

  // ---------- 4. Scroll reveals (Intersection Observer) ----------
  let revealIO = null;
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !isReducedMotion) {
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const stagger = parseInt(el.dataset.stagger || '0', 10);
            setTimeout(() => el.classList.add('is-visible'), stagger * 120);
            revealIO.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach(el => revealIO.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- 5. Menu filter ----------
  // Render menu, about, and reviews from data before wiring up behaviors
  renderMenu();
  renderAbout();
  renderReviews();

  const filters = $$('.filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filters.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      // re-query after render
      $$('.menu-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          card.style.animation = 'none';
          // force reflow then re-animate
          void card.offsetWidth;
          card.style.animation = 'cardIn 0.4s var(--ease) both';
        }
      });
    });
  });

  // Inject cardIn keyframes (so it animates on filter change)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);

  // ---------- 6. STORES: data, render, carousel ----------
  // Stores are now in DATA.stores (data.js). All data references below go through it.
  const STORES = (window.DATA && DATA.stores) || [];
  const STORE_INTERVAL = 6000; // slightly slower than the original 4500ms

  const storesTrack = $('#storesTrack');
  const storesGrid  = $('#storesGrid');
  const storeDotsBox = $('#storeDots');
  const storeCaption = {
    tag:  $('#storeTag'),
    name: $('#storeTitle'),
    addr: $('#storeAddr')
  };
  let storeIndex = 0;
  let storeTimer = null;

  if (storesTrack && storesGrid && STORES.length) {
    // build showcase slides
    STORES.forEach((s, i) => {
      const slide = document.createElement('div');
      slide.className = 'stores__slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML = `<img src="${s.image}" alt="${s.name} cafe interior" loading="${i === 0 ? 'eager' : 'lazy'}" />`;
      storesTrack.appendChild(slide);

      // build dots
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Show ${s.name}`);
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', () => goStore(i, true));
      storeDotsBox.appendChild(b);
    });

    // build grid cards
    STORES.forEach(s => {
      const card = document.createElement('article');
      card.className = 'card store-card';
      card.dataset.storeId = s.id;
      card.innerHTML = `
        <div class="store-card__media">
          <img src="${s.thumb}" alt="${s.name} cafe" loading="lazy" />
          <span class="store-card__neighborhood">${s.neighborhood}</span>
        </div>
        <div class="store-card__body">
          <h3 class="store-card__name">${s.name}</h3>
          <p class="store-card__addr">${s.address}</p>
          <div class="store-card__row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${s.hours}</span>
          </div>
          <div class="store-card__row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a href="tel:${s.phone.replace(/[^\d+]/g, '')}">${s.phone}</a>
          </div>
          <div class="store-card__order">Order from this store →</div>
        </div>
      `;
      // store card click → scroll to menu (cart flow handles store selection later)
      card.addEventListener('click', () => {
        $('#menu')?.scrollIntoView({ behavior: 'smooth' });
      });
      storesGrid.appendChild(card);
    });

    const storeSlides = $$('.stores__slide');
    const storeDots   = $$('.stores__dots button', storeDotsBox);

    function updateStoreCaption() {
      const s = STORES[storeIndex];
      storeCaption.tag.textContent  = s.neighborhood;
      storeCaption.name.textContent = s.name;
      storeCaption.addr.textContent = s.address;
    }

    function goStore(i, manual = false) {
      const next = (i + STORES.length) % STORES.length;
      storeSlides[storeIndex]?.classList.remove('is-active');
      storeSlides[next]?.classList.add('is-active');
      storeDots[storeIndex]?.classList.remove('is-active');
      storeDots[next]?.classList.add('is-active');
      storeIndex = next;
      updateStoreCaption();
      if (manual) restartStoreTimer();
    }

    function startStoreTimer() {
      if (isReducedMotion) return;
      storeTimer = setInterval(() => goStore(storeIndex + 1), STORE_INTERVAL);
    }
    function restartStoreTimer() {
      clearInterval(storeTimer);
      startStoreTimer();
    }
    function pauseStoreTimer() {
      clearInterval(storeTimer);
    }

    $('#storePrev')?.addEventListener('click', () => goStore(storeIndex - 1, true));
    $('#storeNext')?.addEventListener('click', () => goStore(storeIndex + 1, true));

    // pause when hovering the showcase
    $('#storesShowcase')?.addEventListener('mouseenter', pauseStoreTimer);
    $('#storesShowcase')?.addEventListener('mouseleave', startStoreTimer);

    // initialize caption + timer
    updateStoreCaption();
    startStoreTimer();
  }

  // ---------- 7. ITEM MODAL ----------
  const modal = $('#itemModal');
  const storePicker = $('#storePicker');
  const modalContinue = $('#modalContinue');
  const payBack = $('#payBack');
  let lastTrigger = null;
  let currentStoreId = null;

  function renderStorePicker(selectedId = null) {
    if (!storePicker) return;
    storePicker.innerHTML = '';
    STORES.forEach(s => {
      const checked = selectedId === s.id ? 'checked' : '';
      const label = document.createElement('label');
      label.className = 'store-option';
      label.innerHTML = `
        <input type="radio" name="store" value="${s.id}" ${checked} />
        <span class="store-option__radio" aria-hidden="true"></span>
        <span class="store-option__name">${s.name}</span>
        <span class="store-option__sub">${s.neighborhood} · ${s.phone}</span>
      `;
      label.querySelector('input').addEventListener('change', (e) => {
        currentStoreId = e.target.value;
        modalContinue.disabled = false;
        const hint = $('#storeHint');
        if (hint) hint.textContent = `Pickup at ${STORES.find(x => x.id === currentStoreId).name}.`;
      });
      storePicker.appendChild(label);
    });
  }

  function openItemModal(cardEl, presetStoreId = null) {
    if (!modal) return;
    lastTrigger = cardEl;

    const title    = cardEl.querySelector('.menu-card__title')?.textContent ?? 'Item';
    const price    = cardEl.querySelector('.menu-card__price')?.textContent ?? '';
    const desc     = cardEl.querySelector('.menu-card__desc')?.textContent ?? '';
    const longDesc = cardEl.dataset.descLong ?? desc;
    const img      = cardEl.dataset.img ?? cardEl.querySelector('img')?.src ?? '';
    const category = cardEl.dataset.category ?? '';
    const catLabel = category ? category[0].toUpperCase() + category.slice(1) : 'From the menu';

    $('#modalImg').src = img;
    $('#modalImg').alt = title;
    $('#modalTitle').textContent = title;
    $('#modalPrice').textContent = price;
    $('#modalDesc').textContent = longDesc;
    $('#modalCategory').textContent = `— ${catLabel} —`;

    // pre-select store if provided, else default to first
    const defaultStore = presetStoreId
      ?? cardEl.dataset.preferredStore
      ?? STORES[0].id;
    currentStoreId = defaultStore;
    renderStorePicker(defaultStore);
    // if defaulting to a real store, enable continue
    if (defaultStore && STORES.find(s => s.id === defaultStore)) {
      modalContinue.disabled = false;
      $('#storeHint').textContent = `Pickup at ${STORES.find(s => s.id === defaultStore).name}.`;
    } else {
      modalContinue.disabled = true;
      $('#storeHint').textContent = 'Pick a store to continue.';
    }

    // reset to step 1
    setModalStep('detail');

    modal.hidden = false;
    document.body.classList.add('modal-open');

    // focus the first focusable
    setTimeout(() => {
      const first = modal.querySelector('.modal__close');
      first?.focus();
    }, 50);
  }

  function closeItemModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    // return focus to the trigger
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  function setModalStep(step) {
    $$('.modal__step', modal).forEach(s => {
      s.classList.toggle('is-active', s.dataset.step === step);
    });
  }

  // wire up menu card clicks
  $$('.menu-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View item details');
    card.addEventListener('click', () => openItemModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openItemModal(card);
      }
    });
  });

  // close handlers (backdrop, X, ESC)
  if (modal) {
    $$('[data-close]', modal).forEach(el => {
      el.addEventListener('click', closeItemModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeItemModal();
    });
  }

  // continue → switch to pay step
  modalContinue?.addEventListener('click', () => {
    if (!currentStoreId) return;
    const store = STORES.find(s => s.id === currentStoreId);
    if (!store) return;

    // populate pay step
    $('#payItemName').textContent  = $('#modalTitle').textContent;
    $('#payStoreName').textContent = store.name;
    $('#payItemLabel').textContent = $('#modalTitle').textContent + ' — ' + $('#modalPrice').textContent;
    $('#payStoreAddr').textContent = store.address;
    $('#payTotal').textContent     = $('#modalPrice').textContent;

    setModalStep('pay');
  });

  payBack?.addEventListener('click', () => setModalStep('detail'));

  // ---------- 8. Testimonial slider ----------
  const reviews = $$('.review');
  const dotsBox = $('#revDots');
  const prevBtn = $('#revPrev');
  const nextBtn = $('#revNext');
  let revIndex = 0;
  let revTimer = null;
  const REV_INTERVAL = 5000;

  if (reviews.length && dotsBox) {
    // build dots
    reviews.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to review ${i + 1}`);
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', () => goTo(i, true));
      dotsBox.appendChild(b);
    });
    const dots = $$('.reviews__dots button', dotsBox);

    function goTo(i, manual = false) {
      const next = (i + reviews.length) % reviews.length;
      const currentEl = reviews[revIndex];
      const nextEl = reviews[next];

      currentEl.classList.remove('is-active');
      currentEl.classList.add('is-leaving');
      setTimeout(() => currentEl.classList.remove('is-leaving'), 600);

      // re-trigger star animation on the next slide
      $$('.stars span', nextEl).forEach(s => {
        s.style.animation = 'none';
        void s.offsetWidth;
        s.style.animation = '';
      });

      nextEl.classList.add('is-active');
      dots[revIndex]?.classList.remove('is-active');
      dots[next]?.classList.add('is-active');
      revIndex = next;

      if (manual) restartTimer();
    }

    function startTimer() {
      revTimer = setInterval(() => goTo(revIndex + 1), REV_INTERVAL);
    }
    function restartTimer() {
      clearInterval(revTimer);
      startTimer();
    }
    function pauseTimer() {
      clearInterval(revTimer);
    }

    prevBtn?.addEventListener('click', () => goTo(revIndex - 1, true));
    nextBtn?.addEventListener('click', () => goTo(revIndex + 1, true));

    // pause on hover
    const viewport = $('.reviews__viewport');
    viewport?.addEventListener('mouseenter', pauseTimer);
    viewport?.addEventListener('mouseleave', startTimer);

    // touch swipe
    let touchStartX = 0;
    viewport?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseTimer();
    }, { passive: true });
    viewport?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) goTo(revIndex + (dx < 0 ? 1 : -1), true);
      else startTimer();
    }, { passive: true });

    // keyboard
    document.addEventListener('keydown', (e) => {
      const r = $('.reviews')?.getBoundingClientRect();
      if (!r || r.top >= window.innerHeight) return;
      const inView = $$('.review.is-active').some(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      if (!inView) return;
      if (e.key === 'ArrowLeft') goTo(revIndex - 1, true);
      if (e.key === 'ArrowRight') goTo(revIndex + 1, true);
    });

    startTimer();
  }

  // ---------- 9. Contact form validation ----------
  const form = $('#contactForm');
  if (form) {
    const success = $('#formSuccess');
    const submitBtn = $('#submitBtn');
    const rules = {
      name:    v => v.trim().length >= 2 || 'Please enter your name',
      email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email',
      topic:   v => v !== '' || 'Please pick a topic',
      message: v => v.trim().length >= 10 || 'Message should be at least 10 characters',
    };

    function validateField(name) {
      const input = form.elements[name];
      const rule = rules[name];
      if (!rule) return true;
      const result = rule(input.value);
      const ok = result === true;
      const wrap = input.closest('.field');
      wrap.classList.toggle('has-error', !ok);
      wrap.querySelector('[data-err="' + name + '"]').textContent = ok ? '' : result;
      return ok;
    }

    // live validation
    Object.keys(rules).forEach(name => {
      const el = form.elements[name];
      el.addEventListener('blur', () => validateField(name));
      el.addEventListener('input', () => {
        if (el.closest('.field').classList.contains('has-error')) {
          validateField(name);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allOk = Object.keys(rules).every(validateField);
      if (!allOk) {
        const firstErr = $('.field.has-error', form);
        firstErr?.querySelector('input, select, textarea')?.focus();
        return;
      }

      // simulate sending
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        success.hidden = false;
        success.style.animation = 'none';
        void success.offsetWidth;
        success.style.animation = 'fadeUp 0.5s var(--ease)';
        form.reset();

        // hide success after a few seconds
        setTimeout(() => { success.hidden = true; }, 6000);
      }, 1200);
    });
  }

  // ---------- 10. Dark mode toggle ----------
  const themeKey = 'eo-theme';
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'dark') document.body.classList.add('dark');

  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.setAttribute('aria-label', 'Toggle dark mode');
  themeBtn.innerHTML = `
    <svg class="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `;
  document.body.appendChild(themeBtn);

  const sunIcon  = $('.i-sun', themeBtn);
  const moonIcon = $('.i-moon', themeBtn);
  const syncIcons = () => {
    const dark = document.body.classList.contains('dark');
    sunIcon.style.display  = dark ? 'none' : 'block';
    moonIcon.style.display = dark ? 'block' : 'none';
    localStorage.setItem(themeKey, dark ? 'dark' : 'light');
  };
  syncIcons();
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    syncIcons();
  });

  // ---------- 11. Back to top ----------
  $('#toTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- 12. Smooth scroll for anchor links (with offset) ----------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: isReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---------- 13. Menu card: small "tap" feedback on touch ----------
  $$('.menu-card').forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    }, { passive: true });
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    });
  });

  // ---------- 14. Subtle cursor follower on hero ----------
  if (!isReducedMotion && matchMedia('(pointer: fine)').matches) {
    const hero = $('.hero');
    if (hero) {
      const follower = document.createElement('div');
      follower.className = 'cursor-follower';
      Object.assign(follower.style, {
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(198,123,78,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s',
        zIndex: '0'
      });
      hero.appendChild(follower);

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        follower.style.left = (e.clientX - rect.left) + 'px';
        follower.style.top  = (e.clientY - rect.top) + 'px';
      });
      hero.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
      });
      hero.addEventListener('mouseenter', () => {
        follower.style.opacity = '1';
      });
    }
  }

  // ---------- 15. Year in footer (if we want to add later) ----------
  // (kept simple; SPEC's footer uses © 2026)

  // ==========================================================
  // 16. CART — event delegation, ESC, init render
  // ==========================================================
  // One delegated click listener for cart actions.
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;
    if (!action) return;
    if (action.startsWith('cart-') || action === 'add-to-cart' || action === 'open-cart' || action === 'close-cart') {
      handleCartAction(action, t);
    } else if (action === 'open-checkout' || action === 'close-checkout' || action === 'close-checkout-and-continue') {
      handleCheckoutAction(action, t);
    }
  });

  // ESC closes the cart drawer or checkout modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = $('#cartDrawer');
      if (drawer && drawer.classList.contains('is-open')) { closeCart(); return; }
      const m = $('#checkoutModal');
      if (m && !m.hidden) closeCheckout();
    }
  });

  // Checkout form submit
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('#co-submit');
      if (btn) {
        btn.classList.add('is-loading');
        btn.disabled = true;
      }
      // Simulate network request
      setTimeout(() => {
        placeOrder();
        if (btn) {
          btn.classList.remove('is-loading');
          btn.disabled = false;
        }
      }, 900);
    });
  }

  // Initial cart render + badge
  updateCartBadge();
  renderCart();

  // Console hello
  console.log('%cEmber & Oak', 'color:#C67B4E;font-family:Georgia;font-size:18px;font-weight:bold');
  console.log('Welcome to the dev console. Coffee\'s on us.');
})();
