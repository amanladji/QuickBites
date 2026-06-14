/**
 * QuickBite — Frontend ↔ Backend API Integration
 * ─────────────────────────────────────────────────────────────
 * Connects every interactive button in index.html to the
 * Spring Boot backend running at BACKEND_URL.
 *
 * Architecture: Module pattern — each section is self-contained.
 * All API calls go through the central `api()` helper which
 * automatically adds the JWT auth header when logged in.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIG ────────────────────────────────────────────────── */
  // Change this to your Render backend URL after deploying
  const BACKEND_URL = window.BACKEND_URL || 'https://quickbite-backend.onrender.com';

  /* ── STATE ─────────────────────────────────────────────────── */
  const state = {
    cart: JSON.parse(localStorage.getItem('qb_cart') || '[]'),
    user: JSON.parse(localStorage.getItem('qb_user') || 'null'),
    token: localStorage.getItem('qb_token') || null,
    deliveryType: 'DELIVERY',
    selectedArea: null,
    selectedCategory: null,
  };

  /* ── CORE API HELPER ───────────────────────────────────────── */
  async function api(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) headers['Authorization'] = 'Bearer ' + state.token;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(BACKEND_URL + path, opts);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
      return json.data;
    } catch (err) {
      showToast('⚠️ ' + err.message, 'error');
      throw err;
    }
  }

  /* ── TOAST NOTIFICATION ────────────────────────────────────── */
  function showToast(msg, type = 'success') {
    let toast = document.getElementById('qb-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'qb-toast';
      toast.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:99999;
        padding:14px 22px; border-radius:12px; font-size:0.9rem;
        font-weight:600; max-width:360px; box-shadow:0 8px 32px rgba(0,0,0,.18);
        transition:all .35s cubic-bezier(.25,.46,.45,.94);
        opacity:0; transform:translateY(12px); pointer-events:none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#ef4444' : '#22c55e';
    toast.style.color = '#fff';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 3500);
  }

  /* ── MODAL HELPER ──────────────────────────────────────────── */
  function openModal(html, id = 'qb-modal') {
    let overlay = document.getElementById(id);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = id;
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,.55);display:flex;
        align-items:center;justify-content:center;
        padding:20px;backdrop-filter:blur(4px);
      `;
      overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(id); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = html;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id = 'qb-modal') {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
  }

  /* ── CART HELPERS ──────────────────────────────────────────── */
  function saveCart() {
    localStorage.setItem('qb_cart', JSON.stringify(state.cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) {
      const count = state.cart.reduce((s, i) => s + i.quantity, 0);
      badge.textContent = count;
    }
  }

  function addToCart(item) {
    const existing = state.cart.find(c => c.menuItemId === item.menuItemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    showToast('✅ ' + item.name + ' added to cart!');
  }

  function getCartTotal() {
    return state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  /* ── AUTH UI ───────────────────────────────────────────────── */
  function renderAuthState() {
    const navSignin = document.getElementById('nav-signin');
    if (!navSignin) return;
    if (state.user) {
      navSignin.textContent = '👤 ' + state.user.name.split(' ')[0];
      navSignin.onclick = (e) => { e.preventDefault(); openProfileModal(); };
    } else {
      navSignin.textContent = '👤 Sign In';
      navSignin.onclick = (e) => { e.preventDefault(); openAuthModal('login'); };
    }
  }

  function openAuthModal(tab = 'login') {
    const isLogin = tab === 'login';
    openModal(`
      <div style="background:var(--surface,#fff);border-radius:20px;padding:36px;
                  width:100%;max-width:440px;position:relative;">
        <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
          style="position:absolute;top:16px;right:16px;background:none;border:none;
                 font-size:1.4rem;cursor:pointer;color:var(--text-secondary,#666)">✕</button>

        <h2 style="margin:0 0 6px;font-size:1.5rem">${isLogin ? '👋 Welcome back!' : '🍔 Join QuickBite'}</h2>
        <p style="color:var(--text-secondary,#666);margin:0 0 28px;font-size:.9rem">
          ${isLogin ? 'Sign in to place orders and track deliveries.' : 'Create your free account in seconds.'}
        </p>

        ${!isLogin ? `
        <div style="margin-bottom:16px">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">Full Name</label>
          <input id="auth-name" type="text" placeholder="Your full name"
            style="width:100%;padding:12px 14px;border:2px solid var(--border,#e5e7eb);
                   border-radius:10px;font-size:.95rem;outline:none;box-sizing:border-box">
        </div>` : ''}

        <div style="margin-bottom:16px">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">Email</label>
          <input id="auth-email" type="email" placeholder="you@example.com"
            style="width:100%;padding:12px 14px;border:2px solid var(--border,#e5e7eb);
                   border-radius:10px;font-size:.95rem;outline:none;box-sizing:border-box">
        </div>

        <div style="margin-bottom:${!isLogin ? '16px' : '24px'}">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">Password</label>
          <input id="auth-password" type="password" placeholder="Min. 6 characters"
            style="width:100%;padding:12px 14px;border:2px solid var(--border,#e5e7eb);
                   border-radius:10px;font-size:.95rem;outline:none;box-sizing:border-box">
        </div>

        ${!isLogin ? `
        <div style="margin-bottom:24px">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">
            Referral Code <span style="font-weight:400;color:var(--text-secondary)">(optional)</span>
          </label>
          <input id="auth-referral" type="text" placeholder="Friend's referral code — earn ₹100"
            style="width:100%;padding:12px 14px;border:2px solid var(--border,#e5e7eb);
                   border-radius:10px;font-size:.95rem;outline:none;box-sizing:border-box">
        </div>` : ''}

        <button id="auth-submit-btn"
          onclick="${isLogin ? 'window._qbLogin()' : 'window._qbRegister()'}"
          style="width:100%;padding:14px;background:#FF6B35;color:#fff;border:none;
                 border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;
                 transition:opacity .2s">
          ${isLogin ? '🔑 Sign In' : '🚀 Create Account'}
        </button>

        <p style="text-align:center;margin:18px 0 0;font-size:.88rem;color:var(--text-secondary)">
          ${isLogin
            ? 'No account? <a href="#" onclick="window._qbOpenAuth(\'register\')" style="color:#FF6B35;font-weight:600">Register free →</a>'
            : 'Already have an account? <a href="#" onclick="window._qbOpenAuth(\'login\')" style="color:#FF6B35;font-weight:600">Sign in →</a>'}
        </p>
      </div>
    `);
  }

  window._qbOpenAuth = (tab) => { openAuthModal(tab); return false; };

  window._qbLogin = async () => {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    if (!email || !password) { showToast('Please fill in all fields', 'error'); return; }
    const btn = document.getElementById('auth-submit-btn');
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      const data = await api('POST', '/api/auth/login', { email, password });
      state.token = data.token;
      state.user = { id: data.userId, name: data.name, email: data.email,
                     role: data.role, quickCoins: data.quickCoins, loyaltyTier: data.loyaltyTier };
      localStorage.setItem('qb_token', data.token);
      localStorage.setItem('qb_user', JSON.stringify(state.user));
      closeModal();
      renderAuthState();
      showToast('👋 Welcome back, ' + data.name.split(' ')[0] + '!');
    } catch (e) {
      btn.disabled = false; btn.textContent = '🔑 Sign In';
    }
  };

  window._qbRegister = async () => {
    const name = document.getElementById('auth-name')?.value?.trim();
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    const referralCode = document.getElementById('auth-referral')?.value?.trim();
    if (!name || !email || !password) { showToast('Please fill in all fields', 'error'); return; }
    const btn = document.getElementById('auth-submit-btn');
    btn.disabled = true; btn.textContent = 'Creating account...';
    try {
      const data = await api('POST', '/api/auth/register', { name, email, password, referralCode });
      state.token = data.token;
      state.user = { id: data.userId, name: data.name, email: data.email,
                     role: data.role, quickCoins: data.quickCoins, loyaltyTier: data.loyaltyTier };
      localStorage.setItem('qb_token', data.token);
      localStorage.setItem('qb_user', JSON.stringify(state.user));
      closeModal();
      renderAuthState();
      showToast('🎉 Account created! Welcome to QuickBite, ' + data.name.split(' ')[0] + '!');
    } catch (e) {
      btn.disabled = false; btn.textContent = '🚀 Create Account';
    }
  };

  function openProfileModal() {
    openModal(`
      <div style="background:var(--surface,#fff);border-radius:20px;padding:36px;
                  width:100%;max-width:400px;position:relative;">
        <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
          style="position:absolute;top:16px;right:16px;background:none;border:none;
                 font-size:1.4rem;cursor:pointer">✕</button>
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:3rem">👤</div>
          <h2 style="margin:8px 0 2px">${state.user.name}</h2>
          <p style="color:var(--text-secondary,#666);margin:0;font-size:.9rem">${state.user.email}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
          <div style="background:#fff7ed;border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.4rem;font-weight:800;color:#FF6B35">${state.user.quickCoins || 0}</div>
            <div style="font-size:.78rem;color:#666;font-weight:600">QuickCoins</div>
          </div>
          <div style="background:#f0fdf4;border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.4rem;font-weight:800;color:#16a34a">${state.user.loyaltyTier || 'BRONZE'}</div>
            <div style="font-size:.78rem;color:#666;font-weight:600">Loyalty Tier</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button onclick="window._qbOpenOrders()"
            style="padding:12px;border:2px solid #e5e7eb;border-radius:10px;
                   background:none;cursor:pointer;font-size:.95rem;font-weight:600">
            📦 My Orders
          </button>
          <button onclick="window._qbSignOut()"
            style="padding:12px;border:2px solid #fecaca;border-radius:10px;
                   background:#fef2f2;color:#ef4444;cursor:pointer;font-size:.95rem;font-weight:600">
            🚪 Sign Out
          </button>
        </div>
      </div>
    `);
  }

  window._qbSignOut = () => {
    state.token = null; state.user = null;
    localStorage.removeItem('qb_token');
    localStorage.removeItem('qb_user');
    closeModal();
    renderAuthState();
    showToast('Signed out. See you soon! 👋');
  };

  window._qbOpenOrders = async () => {
    if (!state.user) { openAuthModal(); return; }
    try {
      const orders = await api('GET', '/api/orders/my');
      const rows = orders.length === 0
        ? '<p style="text-align:center;color:#666;padding:20px">No orders yet. Start ordering! 🍔</p>'
        : orders.slice(0, 10).map(o => `
            <div style="border:1.5px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <strong>${o.restaurantName}</strong>
                <span style="font-size:.78rem;padding:4px 10px;border-radius:20px;font-weight:600;
                  background:${o.status==='DELIVERED'?'#dcfce7':o.status==='CANCELLED'?'#fee2e2':'#fff7ed'};
                  color:${o.status==='DELIVERED'?'#16a34a':o.status==='CANCELLED'?'#dc2626':'#ea580c'}">
                  ${o.status}
                </span>
              </div>
              <p style="margin:0;font-size:.85rem;color:#666">
                ${o.items.map(i => i.name + ' ×' + i.quantity).join(', ')}
              </p>
              <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:.85rem">
                <span>₹${o.totalAmount.toFixed(0)}</span>
                <span style="color:#666">Tracking: <strong>${o.trackingId}</strong></span>
              </div>
            </div>`).join('');

      openModal(`
        <div style="background:var(--surface,#fff);border-radius:20px;padding:32px;
                    width:100%;max-width:560px;max-height:80vh;overflow-y:auto;position:relative;">
          <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
            style="position:absolute;top:16px;right:16px;background:none;border:none;
                   font-size:1.4rem;cursor:pointer">✕</button>
          <h2 style="margin:0 0 20px">📦 My Orders</h2>
          ${rows}
        </div>
      `);
    } catch (e) { /* toast already shown */ }
  };

  /* ── CART MODAL ────────────────────────────────────────────── */
  function openCartModal() {
    if (state.cart.length === 0) {
      showToast('Your cart is empty. Add some delicious food! 🍔');
      return;
    }
    const rows = state.cart.map((item, idx) => `
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:12px 0;border-bottom:1px solid #f3f4f6">
        <div style="flex:1">
          <p style="margin:0;font-weight:600;font-size:.95rem">${item.name}</p>
          <p style="margin:4px 0 0;color:#666;font-size:.83rem">₹${item.price} × ${item.quantity}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button onclick="window._qbCartQty(${idx},-1)"
            style="width:28px;height:28px;border-radius:50%;border:2px solid #e5e7eb;
                   background:none;cursor:pointer;font-size:1.1rem;font-weight:700">−</button>
          <span style="font-weight:700;min-width:20px;text-align:center">${item.quantity}</span>
          <button onclick="window._qbCartQty(${idx},1)"
            style="width:28px;height:28px;border-radius:50%;border:2px solid #FF6B35;
                   background:#FF6B35;color:#fff;cursor:pointer;font-size:1.1rem;font-weight:700">+</button>
        </div>
        <span style="min-width:60px;text-align:right;font-weight:700">
          ₹${(item.price * item.quantity).toFixed(0)}
        </span>
      </div>
    `).join('');

    const total = getCartTotal();
    const delivery = total >= 199 ? 0 : 40;

    openModal(`
      <div style="background:var(--surface,#fff);border-radius:20px;padding:32px;
                  width:100%;max-width:520px;max-height:85vh;overflow-y:auto;position:relative;">
        <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
          style="position:absolute;top:16px;right:16px;background:none;border:none;
                 font-size:1.4rem;cursor:pointer">✕</button>
        <h2 style="margin:0 0 20px">🛒 Your Cart</h2>
        ${rows}

        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:.9rem">
            <span>Subtotal</span><span>₹${total.toFixed(0)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:.9rem">
            <span>Delivery fee</span>
            <span>${delivery === 0 ? '<span style="color:#16a34a;font-weight:600">FREE</span>' : '₹' + delivery}</span>
          </div>

          <div style="margin:12px 0;display:flex;gap:8px">
            <input id="cart-coupon" type="text" placeholder="Coupon code (e.g. FIRST50)"
              style="flex:1;padding:10px 12px;border:2px solid #e5e7eb;border-radius:8px;font-size:.9rem">
            <button onclick="window._qbApplyCoupon()"
              style="padding:10px 14px;background:#FF6B35;color:#fff;border:none;
                     border-radius:8px;cursor:pointer;font-weight:600;font-size:.88rem">Apply</button>
          </div>
          <div id="coupon-msg" style="font-size:.83rem;margin-bottom:8px"></div>

          <div style="display:flex;justify-content:space-between;font-size:1.05rem;
                      font-weight:700;border-top:1.5px solid #e5e7eb;padding-top:12px">
            <span>Total</span>
            <span id="cart-total-display">₹${(total + delivery).toFixed(0)}</span>
          </div>
        </div>

        <div style="margin-top:16px">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">
            Delivery Address
          </label>
          <textarea id="cart-address" rows="2" placeholder="Enter your full delivery address..."
            style="width:100%;padding:10px 12px;border:2px solid #e5e7eb;border-radius:8px;
                   font-size:.9rem;resize:none;box-sizing:border-box">${state.user?.savedAddresses?.[0] || ''}</textarea>
        </div>

        <div style="margin-top:12px">
          <label style="display:block;font-weight:600;margin-bottom:6px;font-size:.88rem">Payment</label>
          <select id="cart-payment"
            style="width:100%;padding:10px 12px;border:2px solid #e5e7eb;border-radius:8px;
                   font-size:.9rem;background:var(--surface,#fff)">
            <option value="COD">💵 Cash on Delivery</option>
            <option value="UPI">📱 UPI / QR Code</option>
            <option value="CARD">💳 Credit/Debit Card</option>
            ${state.user?.quickCoins >= 100 ? '<option value="QUICKCOINS">🏆 QuickCoins ('+state.user.quickCoins+' coins)</option>' : ''}
          </select>
        </div>

        <button onclick="window._qbPlaceOrder()"
          style="width:100%;margin-top:20px;padding:15px;background:#FF6B35;color:#fff;
                 border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer">
          🛵 Place Order — ₹${(total + delivery).toFixed(0)}
        </button>
      </div>
    `);
  }

  window._qbCartQty = (idx, delta) => {
    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) state.cart.splice(idx, 1);
    saveCart();
    openCartModal();
  };

  window._discountAmount = 0;
  window._couponCode = '';

  window._qbApplyCoupon = async () => {
    const code = document.getElementById('cart-coupon')?.value?.trim();
    if (!code) return;
    try {
      const result = await api('POST', '/api/offers/validate', {
        code, cartTotal: getCartTotal(), userId: state.user?.id || 'anonymous'
      });
      const msg = document.getElementById('coupon-msg');
      if (result.valid) {
        window._discountAmount = result.discountAmount;
        window._couponCode = code;
        msg.style.color = '#16a34a';
        msg.textContent = '✅ ' + result.message;
        const total = getCartTotal();
        const delivery = total >= 199 ? 0 : 40;
        const display = document.getElementById('cart-total-display');
        if (display) display.textContent = '₹' + Math.max(0, total + delivery - window._discountAmount).toFixed(0);
      } else {
        window._discountAmount = 0; window._couponCode = '';
        msg.style.color = '#ef4444';
        msg.textContent = '❌ ' + result.message;
      }
    } catch (e) { /* toast already shown */ }
  };

  window._qbPlaceOrder = async () => {
    if (!state.user) { closeModal(); openAuthModal('login'); return; }
    const address = document.getElementById('cart-address')?.value?.trim();
    const payment = document.getElementById('cart-payment')?.value;
    if (!address) { showToast('Please enter a delivery address', 'error'); return; }
    if (state.cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }

    // Get restaurantId from first cart item
    const restaurantId = state.cart[0].restaurantId;

    try {
      const order = await api('POST', '/api/orders', {
        items: state.cart,
        restaurantId,
        deliveryAddress: address,
        deliveryType: state.deliveryType,
        couponCode: window._couponCode || null,
        paymentMethod: payment
      });
      state.cart = [];
      saveCart();
      window._discountAmount = 0;
      window._couponCode = '';
      closeModal();
      showToast('🎉 Order placed! Tracking ID: ' + order.trackingId);
      // Update coins display
      if (state.user) {
        state.user.quickCoins = (state.user.quickCoins || 0) + (order.quickCoinsEarned || 10);
        localStorage.setItem('qb_user', JSON.stringify(state.user));
      }
    } catch (e) { /* toast already shown */ }
  };

  /* ── ADD TO CART BUTTONS ───────────────────────────────────── */
  async function loadTrendingAndAttachCart() {
    try {
      const items = await api('GET', '/api/menu/trending');
      const ids = {
        'add-burger': 0,
        'add-butter-chicken': 1,
        'add-pizza': 2,
        'add-dimsum': 3,
      };
      Object.entries(ids).forEach(([btnId, itemIdx]) => {
        const btn = document.getElementById(btnId);
        if (btn && items[itemIdx]) {
          btn.addEventListener('click', () => {
            addToCart({
              menuItemId: items[itemIdx].id,
              restaurantId: items[itemIdx].restaurantId,
              name: items[itemIdx].name,
              price: items[itemIdx].price,
              isVeg: items[itemIdx].isVeg,
            });
          });
        }
      });
    } catch (e) {
      // Fallback: attach dummy add-to-cart on static items
      ['add-burger','add-butter-chicken','add-pizza','add-dimsum'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => {
          addToCart({ menuItemId: id, restaurantId: 'static', name: btn.closest('.food-card')
            ?.querySelector('.food-card-name')?.textContent || 'Item',
            price: parseInt(btn.closest('.food-card')?.querySelector('.food-price')?.textContent?.replace('₹','')) || 99,
            isVeg: false });
        });
      });
    }
  }

  /* ── HERO SEARCH ───────────────────────────────────────────── */
  function initHeroSearch() {
    const form = document.querySelector('.hero-search-box');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = document.getElementById('hero-location')?.value?.trim();
      if (!query) return;
      showToast('🔍 Searching for restaurants near ' + query + '...');
      try {
        const results = await api('GET', '/api/search?q=' + encodeURIComponent(query));
        showToast(`Found ${results.totalResults} results!`);
      } catch (e) { /* toast already shown */ }
    });

    // Header search
    const headerForm = document.querySelector('.search-form');
    if (headerForm) {
      headerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = document.getElementById('header-search')?.value?.trim();
        if (!q) return;
        try {
          const results = await api('GET', '/api/search?q=' + encodeURIComponent(q));
          showToast(`🔍 Found ${results.totalResults} result(s) for "${q}"`);
        } catch (e) {}
      });
    }
  }

  /* ── DELIVERY / PICKUP TOGGLE ──────────────────────────────── */
  function initDeliveryToggle() {
    const delBtn = document.getElementById('toggle-delivery');
    const pkpBtn = document.getElementById('toggle-pickup');
    if (!delBtn || !pkpBtn) return;

    delBtn.addEventListener('click', () => {
      state.deliveryType = 'DELIVERY';
      delBtn.classList.add('active');  delBtn.setAttribute('aria-pressed', 'true');
      pkpBtn.classList.remove('active'); pkpBtn.setAttribute('aria-pressed', 'false');
      showToast('🛵 Delivery selected');
    });
    pkpBtn.addEventListener('click', () => {
      state.deliveryType = 'PICKUP';
      pkpBtn.classList.add('active');  pkpBtn.setAttribute('aria-pressed', 'true');
      delBtn.classList.remove('active'); delBtn.setAttribute('aria-pressed', 'false');
      showToast('🏃 Pickup selected');
    });
  }

  /* ── CATEGORY CHIPS ────────────────────────────────────────── */
  function initCategoryChips() {
    document.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', async (e) => {
        e.preventDefault();
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const category = chip.textContent.trim().replace(/^[^\w]*/, '');
        state.selectedCategory = category;

        if (category.toLowerCase() === 'all') {
          showToast('✨ Showing all restaurants');
          return;
        }
        try {
          const restaurants = await api('GET', '/api/restaurants/cuisine/' + encodeURIComponent(category));
          showToast(`${chip.textContent.trim()} — ${restaurants.length} restaurant(s) found`);
        } catch (e) {}
      });
    });
  }

  /* ── AREA CHIPS ────────────────────────────────────────────── */
  function initAreaChips() {
    document.querySelectorAll('.area-chip').forEach(chip => {
      chip.addEventListener('click', async (e) => {
        e.preventDefault();
        document.querySelectorAll('.area-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const area = chip.textContent.trim();
        state.selectedArea = area;
        try {
          const restaurants = await api('GET', '/api/restaurants/area/' + encodeURIComponent(area));
          showToast(`📍 ${area} — ${restaurants.length} restaurant(s) open`);
        } catch (e) {}
      });
    });
  }

  /* ── OFFERS / COUPONS ──────────────────────────────────────── */
  function initOfferButtons() {
    const offerCodes = {
      'claim-offer-1': 'FIRST50',
      'claim-offer-2': 'FREEDEL',
      'claim-offer-3': 'HAPPY20',
    };
    Object.entries(offerCodes).forEach(([btnId, code]) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(code).catch(() => {});
        showToast('✅ Code ' + code + ' copied! Apply it at checkout.');
      });
    });

    // See all offers
    const seeAll = document.getElementById('see-all-offers');
    if (seeAll) {
      seeAll.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const offers = await api('GET', '/api/offers');
          const html = offers.map(o => `
            <div style="border:1.5px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px">
              <div style="font-size:1.3rem;font-weight:800;margin-bottom:4px">${o.emoji || '🏷️'} ${o.title}</div>
              <p style="margin:0 0 8px;color:#666;font-size:.88rem">${o.subtitle}</p>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <code style="background:#f3f4f6;padding:6px 12px;border-radius:8px;
                             font-weight:700;font-size:.95rem">USE: ${o.code}</code>
                <button onclick="navigator.clipboard?.writeText('${o.code}');window._qbToast('✅ ${o.code} copied!')"
                  style="padding:6px 12px;background:#FF6B35;color:#fff;border:none;
                         border-radius:8px;cursor:pointer;font-size:.83rem;font-weight:600">
                  Copy Code
                </button>
              </div>
            </div>`).join('');
          openModal(`
            <div style="background:var(--surface,#fff);border-radius:20px;padding:32px;
                        width:100%;max-width:540px;max-height:80vh;overflow-y:auto;position:relative;">
              <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
                style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer">✕</button>
              <h2 style="margin:0 0 20px">🏷️ All Active Offers</h2>
              ${html}
            </div>`);
        } catch (e) {}
      });
    }
  }

  window._qbToast = (msg) => showToast(msg);

  /* ── NEWSLETTER ────────────────────────────────────────────── */
  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email')?.value?.trim();
      if (!email) return;
      const btn = document.getElementById('subscribe-btn');
      btn.disabled = true; btn.textContent = 'Subscribing...';
      try {
        await api('POST', '/api/newsletter/subscribe', { email });
        showToast('🎉 Subscribed! Welcome to QuickBite updates.');
        form.reset();
      } catch (e) { /* toast shown */ }
      btn.disabled = false; btn.textContent = 'Subscribe 🎉';
    });
  }

  /* ── LOYALTY / REFERRAL ────────────────────────────────────── */
  function initLoyalty() {
    const joinBtn = document.getElementById('join-loyalty-btn');
    if (joinBtn) {
      joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.user) {
          showToast('🏆 You\'re already a member! Tier: ' + (state.user.loyaltyTier || 'BRONZE'));
        } else {
          openAuthModal('register');
        }
      });
    }

    const shareBtn = document.getElementById('referral-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (!state.user) { openAuthModal('login'); return; }
        const code = state.user.referralCode || '';
        navigator.clipboard?.writeText(code).catch(() => {});
        showToast('🎁 Referral code ' + code + ' copied! Share it with friends.');
      });
    }
  }

  /* ── CART BUTTON ───────────────────────────────────────────── */
  function initCartButton() {
    const cartBtn = document.getElementById('nav-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
      });
    }
  }

  /* ── LOCATION SELECTOR ─────────────────────────────────────── */
  function initLocation() {
    const btn = document.getElementById('location-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (navigator.geolocation) {
          btn.textContent = '📍 Detecting...';
          navigator.geolocation.getCurrentPosition(
            () => {
              btn.textContent = '📍 Bangalore, 560001 ▾';
              showToast('📍 Location detected: Bangalore');
            },
            () => {
              btn.textContent = '📍 Bangalore, 560001 ▾';
              showToast('Could not detect location — defaulting to Bangalore.', 'error');
            }
          );
        }
      });
    }
  }

  /* ── RESTAURANT "ORDER NOW" BUTTONS ────────────────────────── */
  function initRestaurantOrderButtons() {
    document.querySelectorAll('[id^="order-now-"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!state.user) { openAuthModal('login'); return; }
        showToast('🍽️ Loading menu...');
        // Scroll to best sellers for now; full restaurant page can be a future page
        document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── NIGHT OWL "ORDER NOW" ─────────────────────────────────── */
  function initNightOwl() {
    const seeNight = document.getElementById('see-night-restaurants');
    if (seeNight) {
      seeNight.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const restaurants = await api('GET', '/api/restaurants/night-owl');
          showToast('🌙 ' + restaurants.length + ' restaurants open late night!');
        } catch (e) {}
      });
    }
  }

  /* ── FAQ ACCORDION ─────────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (question && answer) {
        question.addEventListener('click', () => {
          const isOpen = answer.style.display !== 'none' && answer.style.display !== '';
          // Close all
          document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
          document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');
          // Open clicked
          if (!isOpen) {
            answer.style.display = 'block';
            const icon = question.querySelector('.faq-icon');
            if (icon) icon.textContent = '−';
          }
        });
      }
    });
  }

  /* ── TRACK ORDER BUTTON ────────────────────────────────────── */
  function initTrackOrder() {
    // "Track Your Order" links in footer
    document.querySelectorAll('a').forEach(link => {
      if (link.textContent.includes('Track Your Order')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(`
            <div style="background:var(--surface,#fff);border-radius:20px;padding:36px;
                        width:100%;max-width:420px;position:relative;">
              <button onclick="document.getElementById('qb-modal').style.display='none';document.body.style.overflow=''"
                style="position:absolute;top:16px;right:16px;background:none;border:none;
                       font-size:1.4rem;cursor:pointer">✕</button>
              <h2 style="margin:0 0 20px">🔍 Track Your Order</h2>
              <label style="display:block;font-weight:600;margin-bottom:8px">Tracking ID</label>
              <input id="track-id" type="text" placeholder="e.g. 3F9A1B2C"
                style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:10px;
                       font-size:.95rem;box-sizing:border-box">
              <button onclick="window._qbTrackOrder()"
                style="width:100%;margin-top:14px;padding:13px;background:#FF6B35;color:#fff;
                       border:none;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer">
                Track →
              </button>
              <div id="track-result" style="margin-top:16px"></div>
            </div>`);
        });
      }
    });
  }

  window._qbTrackOrder = async () => {
    const trackId = document.getElementById('track-id')?.value?.trim();
    if (!trackId) return;
    try {
      const order = await api('GET', '/api/orders/track/' + trackId);
      const result = document.getElementById('track-result');
      if (result) {
        result.innerHTML = `
          <div style="padding:16px;background:#f0fdf4;border-radius:12px">
            <p style="margin:0 0 8px;font-weight:700;font-size:1rem">
              ${order.restaurantName}
            </p>
            <p style="margin:0 0 4px;font-size:.88rem;color:#666">
              Status: <strong style="color:#16a34a">${order.status}</strong>
            </p>
            <p style="margin:0;font-size:.88rem;color:#666">
              Total: ₹${order.totalAmount.toFixed(0)} · Payment: ${order.paymentMethod}
            </p>
          </div>`;
      }
    } catch (e) { /* toast shown */ }
  };

  /* ── APP DOWNLOAD BUTTONS ──────────────────────────────────── */
  function initAppDownload() {
    document.querySelectorAll('[id^="app-download"], a[href="#app-download"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📱 QuickBite app coming soon to App Store & Play Store!');
      });
    });
  }

  /* ── BLOG CARDS ────────────────────────────────────────────── */
  function initBlogCards() {
    document.querySelectorAll('.blog-card').forEach(card => {
      const link = card.querySelector('a');
      if (link && link.getAttribute('href') === '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('📝 Blog post coming soon!');
        });
      }
    });
  }

  /* ── FOOTER LEGAL LINKS ────────────────────────────────────── */
  function initFooterLinks() {
    ['link-privacy','link-terms','link-cookies','link-refund','link-accessibility'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const label = el.textContent.trim();
          showToast('📄 ' + label + ' page coming soon!');
        });
      }
    });
  }

  /* ── PARTNER CARDS ─────────────────────────────────────────── */
  function initPartnerButtons() {
    document.querySelectorAll('.partner-card .btn, .partner-card a').forEach(btn => {
      if (btn.getAttribute('href') === '#' || !btn.getAttribute('href')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showToast('🤝 Partner registration coming soon! Email partners@quickbite.in');
        });
      }
    });
  }

  /* ── INIT ──────────────────────────────────────────────────── */
  function init() {
    updateCartBadge();
    renderAuthState();
    loadTrendingAndAttachCart();
    initHeroSearch();
    initDeliveryToggle();
    initCategoryChips();
    initAreaChips();
    initOfferButtons();
    initNewsletter();
    initLoyalty();
    initCartButton();
    initLocation();
    initRestaurantOrderButtons();
    initNightOwl();
    initFaq();
    initTrackOrder();
    initAppDownload();
    initBlogCards();
    initFooterLinks();
    initPartnerButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
