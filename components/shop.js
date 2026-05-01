// ══════════════════════════════════════════════════
// SHOP CONSTANTS
// ══════════════════════════════════════════════════
var SHOP_CATEGORIES = [
  { id: 'all',       icon: '<i data-lucide="shopping-cart" style="width:16px;height:16px"></i>', label: 'All Products' },
  { id: 'notebooks', icon: '<i data-lucide="book" style="width:16px;height:16px"></i>', label: 'Notebooks & Books' },
  { id: 'writing',   icon: '<i data-lucide="pen-tool" style="width:16px;height:16px"></i>', label: 'Writing Tools' },
  { id: 'geometry',  icon: '<i data-lucide="ruler" style="width:16px;height:16px"></i>', label: 'Geometry & Math' },
  { id: 'science',   icon: '<i data-lucide="flask-conical" style="width:16px;height:16px"></i>', label: 'Science Equipment' },
  { id: 'teaching',  icon: '<i data-lucide="graduation-cap" style="width:16px;height:16px"></i>', label: 'Teaching Aids' },
  { id: 'kits',      icon: '<i data-lucide="backpack" style="width:16px;height:16px"></i>', label: 'Student Kits' },
]
// ══════════════════════════════════════════════════
// PUBLIC SHOP PAGE
// ══════════════════════════════════════════════════
var MATHRONE_WHATSAPP = '+250786684285'
function _getGuestCart() {
  return JSON.parse(localStorage.getItem('guestCart') || '[]');
}
function _setGuestCart(arr) {
  localStorage.setItem('guestCart', JSON.stringify(arr));
}

function openGuestOrderModal(preItems = []){
  const modalRoot = document.getElementById('modal-root') || document.createElement('div');
  if(!document.getElementById('modal-root')){
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  
  modalRoot.innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">🛒 Place Your Order</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      
      <div class="modal-body">
       <div style="background:var(--sky);border-radius:10px;padding:14px;margin-bottom:20px" id="guest-cart-items">
          <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:8px">Your Items:</div>
          ${preItems.map(i=>`
          <div style="display:flex;flex-direction:column;font-size:13px;padding:8px 0;border-bottom:1px dashed var(--g200);gap:6px">
            <div style="font-weight:600;line-height:1.4;">${i.name}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:8px">
                <button type="button" onclick="updateGuestCartQty('${i.id}', ${(i.qty||1)-1})" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;">-</button>
                <span style="font-weight:700;min-width:16px;text-align:center;font-size:14px;">${i.qty||1}</span>
                <button type="button" onclick="updateGuestCartQty('${i.id}', ${(i.qty||1)+1})" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;">+</button>
              </div>
              <span style="font-weight:800;text-align:right;color:var(--navy);">RWF ${Number(i.price*(i.qty||1)).toLocaleString()}</span>
            </div>
          </div>`).join('')}
          <div style="margin-top:12px;display:flex;justify-content:space-between;font-weight:800;font-size:16px;color:var(--navy)" id="guest-cart-total">
            <span>Total</span>
            <span>RWF ${Number(preItems.reduce((s,i)=>s+i.price*(i.qty||1),0)).toLocaleString()}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input class="input" id="guest-name" placeholder="e.g. Jean Claude Mugisha"/>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input class="input" id="guest-phone" type="tel" placeholder="+250 788 000 000"/>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Number</label>
            <input class="input" id="guest-whatsapp" type="tel" placeholder="Optional"/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Delivery Address *</label>
          <input class="input" id="guest-address" placeholder="e.g. Kigali, Gasabo, KG 123 St"/>
        </div>

        <div class="form-group">
          <label class="form-label">Notes (optional)</label>
          <textarea class="input" id="guest-notes" rows="2" placeholder="Preferred delivery time..."></textarea>
        </div>

        <!-- EXCELLENCE: Moved CTA inside scrollable body to prevent overlap -->
        <div style="background:#E0F2FE;border-radius:12px;padding:16px;margin:20px 0;text-align:center;border:1px solid #BAE6FD">
          <div style="font-size:14px;color:#0369A1;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px"><i data-lucide="users" style="width:16px;height:16px"></i> Want a Tutor for you or your child?</div>
          <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="document.querySelector('.modal-overlay').remove(); navigate('register')">Sign Up as Student</button>
        </div>

        <div style="background:#FFFBEB;border-radius:8px;padding:12px;font-size:12px;color:#92400E;margin-bottom:8px;display:flex;align-items:center;gap:8px">
          <i data-lucide="lightbulb" style="width:16px;height:16px;flex-shrink:0"></i> Payment is made upon delivery.
        </div>
        <div style="background:#F0FDF4;border-radius:8px;padding:12px;font-size:12px;color:#166534;display:flex;align-items:center;gap:8px">
          <i data-lucide="truck" style="width:16px;height:16px;flex-shrink:0"></i> Free delivery on orders above RWF 50,000!
        </div>

        <!-- Proof of payment -->
        <div style="margin-top:16px;border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <div style="background:#0D1B40;color:#fff;padding:10px 14px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px">
            🧾 Proof of Payment <span style="font-size:10px;opacity:0.6;font-weight:400">(optional — speeds up confirmation)</span>
          </div>
          <div style="padding:14px;display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">MoMo / Transaction Reference</label>
              <input class="input" id="guest-momo-ref" placeholder="e.g. 1234567890" style="font-size:13px"/>
              <div style="font-size:11px;color:#94a3b8;margin-top:3px">Found in your MoMo SMS after payment</div>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">Screenshot of Payment</label>
              <div id="guest-proof-preview" style="display:none;margin-bottom:8px">
                <img id="guest-proof-img" style="max-width:100%;max-height:160px;border-radius:8px;border:1px solid #e2e8f0;object-fit:contain"/>
              </div>
              <label style="display:flex;align-items:center;gap:8px;border:1.5px dashed #cbd5e1;border-radius:8px;padding:10px 14px;cursor:pointer;background:#f8fafc;font-size:13px;color:#64748b">
                <span>📷</span>
                <span id="guest-proof-label">Click to upload screenshot (JPG, PNG)</span>
                <input type="file" id="guest-proof-file" accept="image/*" style="display:none" onchange="uploadShopPaymentProof(this,'guest')"/>
              </label>
              <input type="hidden" id="guest-proof-url" value=""/>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="guest-order-btn" onclick="submitGuestOrder(_getGuestCart())">
          📱 Submit via WhatsApp
        </button>
      </div>
    </div>
  </div>`;
}

function addToGuestCart(id, name, price, qty=1){
  const cart = _getGuestCart();
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += qty; } else { cart.push({id, name, price, qty}); }
  _setGuestCart(cart);
  updateCartButton();
  toast('Added to cart!');
}

async function updateCartButton(){
  const btn = document.getElementById('cart-nav-btn');
  if(!btn) return;
  
  let totalQty = 0;
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'));
  
  if (isLoggedIn) {
    try {
      const cart = await api('/shop/cart');
      totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    } catch(e) {}
  } else {
    totalQty = _getGuestCart().reduce((sum, i) => sum + i.qty, 0);
  }
  
  if (totalQty > 0) {
    btn.innerHTML = `<i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart (${totalQty})</span>`;
    if (window.lucide) window.lucide.createIcons();
    btn.style.display = 'inline-flex';
  } else {
    if (isLoggedIn) {
      btn.innerHTML = `<i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart (0)</span>`;
      if (window.lucide) window.lucide.createIcons();
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }
}

function updateGuestCartQty(id, newQty){
  let cart = _getGuestCart();
  const item = cart.find(i=>i.id===id);
  if(item){
    if(newQty <= 0){ cart = cart.filter(i=>i.id !== id); } else { item.qty = newQty; }
    _setGuestCart(cart);
    updateCartButton();
    if(cart.length === 0){
      document.querySelector('.modal-overlay')?.remove()
      return
    }
    // Update items
    const itemsHtml = _getGuestCart().map(i=>`
    <div style="display:flex;flex-direction:column;font-size:13px;padding:8px 0;border-bottom:1px dashed var(--g200);gap:6px">
      <div style="font-weight:600;line-height:1.4;">${i.name}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:8px">
          <button type="button" onclick="updateGuestCartQty('${i.id}', ${i.qty-1})" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;">-</button>
          <span style="font-weight:700;min-width:16px;text-align:center;font-size:14px;">${i.qty}</span>
          <button type="button" onclick="updateGuestCartQty('${i.id}', ${i.qty+1})" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;">+</button>
        </div>
        <span style="font-weight:800;text-align:right;color:var(--navy);">RWF ${Number(i.price*i.qty).toLocaleString()}</span>
      </div>
    </div>`).join('')
    const itemsContainer = document.getElementById('guest-cart-items')
    if(itemsContainer){
      itemsContainer.innerHTML = `<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:8px">Your Items:</div>${itemsHtml}`
    }
    // Update total
    const total = _getGuestCart().reduce((s,i)=>s+i.price*i.qty,0)
    const totalContainer = document.getElementById('guest-cart-total')
    if(totalContainer){
      totalContainer.innerHTML = `<span>Total</span><span>RWF ${Number(total).toLocaleString()}</span>`
    }
  }
}

async function submitGuestOrder(preItems){
  // Always use the live cart at submission time
  preItems = _getGuestCart();
  const name    = document.getElementById('guest-name')?.value?.trim()
  const phone   = document.getElementById('guest-phone')?.value?.trim()
  const wa      = document.getElementById('guest-whatsapp')?.value?.trim() || phone
  const address = document.getElementById('guest-address')?.value?.trim()
  const notes   = document.getElementById('guest-notes')?.value?.trim()
  const btn     = document.getElementById('guest-order-btn')

  if(!name)    { toast('Your name is required','err');    return }
  if(!phone)   { toast('Phone number is required','err'); return }
  if(!address) { toast('Delivery address is required','err'); return }

  const total     = preItems.reduce((s,i)=>s+i.price*(i.qty||1),0)
  const freeDelivery = total >= 50000
  const isWholesale  = preItems.some(i=>(i.qty||1)>5)
  const momoRef  = document.getElementById('guest-momo-ref')?.value?.trim() || null
  const proofUrl = document.getElementById('guest-proof-url')?.value?.trim() || null

  if(btn){ btn.disabled=true; btn.textContent='Submitting...' }

  // Save to database
  try{
    await fetch(API_URL+'/shop/guest-orders',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        full_name:        name,
        phone,
        whatsapp:         wa,
        delivery_address: address,
        items:            preItems.map(i=>({ name:i.name, quantity:i.qty||1, price:i.price, is_wholesale:isWholesale })),
        total_amount:     total,
        is_wholesale:     isWholesale,
        notes:            notes||null,
        momo_reference:   momoRef || null,
        payment_proof:    proofUrl || null
      })
    })
  }catch(e){}

  // Build WhatsApp message
  const itemLines = preItems.map(i=>`  • ${i.name} ×${i.qty||1} — RWF ${Number(i.price*(i.qty||1)).toLocaleString()}`).join('\n')
  const waMessage = `🛒 *New Order from Mathrone Store*\n\n*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Items:*\n${itemLines}\n\n*Total:* RWF ${Number(total).toLocaleString()}\n${freeDelivery?'✅ Free delivery applies':'⚠️ Delivery to be negotiated'}\n${isWholesale?'📦 Wholesale order':''}\n${notes?`\n*Notes:* ${notes}`:''}\n\n_Please confirm this order and arrange delivery._`

  document.querySelector('.modal-overlay')?.remove()

  // Open WhatsApp
  const waUrl = `https://wa.me/${MATHRONE_WHATSAPP.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(waMessage)}`
  window.open(waUrl, '_blank')

  // Clear guest cart
  _setGuestCart([]);
  updateCartButton();

  // Show confirmation + CTA
  render(`
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--g100);background:#fff">
    <a href="/shop" onclick="navigate('shop', null, event)" style="background:none;border:none;cursor:pointer;font-size:16px;font-weight:700;color:var(--navy);text-decoration:none">← Back to Store</a>
  </nav>
  <div style="max-width:540px;margin:80px auto;text-align:center;padding:24px">
    <div style="font-size:64px;margin-bottom:16px">🎉</div>
    <h1 style="font-size:26px;font-weight:800;color:var(--navy);margin-bottom:8px">Order Submitted!</h1>
    <p style="font-size:15px;color:var(--g400);margin-bottom:6px">Your order has been sent to our team via WhatsApp.</p>
    <p style="font-size:14px;color:var(--g400);margin-bottom:24px">We will contact you at <strong>${phone}</strong> to confirm delivery. Payment is due on delivery.</p>
    <div style="background:var(--sky);border-radius:12px;padding:20px;margin-bottom:24px;text-align:left">
      <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">Order Summary</div>
      ${preItems.map(i=>`<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>${i.name} ×${i.qty||1}</span><span style="font-weight:700">RWF ${Number(i.price*(i.qty||1)).toLocaleString()}</span></div>`).join('')}
      <div style="border-top:1px solid var(--g100);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:800">
        <span>Total</span><span>RWF ${Number(total).toLocaleString()}</span>
      </div>
      ${freeDelivery ? `<div style="margin-top:8px;font-size:13px;color:var(--green);font-weight:700">✅ Free delivery applies!</div>` : `<div style="margin-top:8px;font-size:13px;color:var(--orange)">🚚 Delivery cost will be discussed with our team</div>`}
    </div>
    <!-- CTA -->
    <div style="background:linear-gradient(135deg,var(--navy),var(--blue));border-radius:16px;padding:24px;color:#fff;margin-bottom:20px">
      <div style="font-size:20px;margin-bottom:8px">🎓</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:6px">Need a qualified tutor?</div>
      <div style="font-size:13px;opacity:0.85;margin-bottom:16px">Mathrone Academy connects students with vetted tutors for 1-on-1 learning — online or at home.</div>
      <button class="btn btn-primary" style="background:var(--gold);color:#1a1a1a;font-weight:700;border:none" onclick="navigate('register')">
        Find a Tutor →
      </button>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button type="button" class="btn btn-primary" onclick="this.disabled=true; this.textContent='Loading...'; navigate('shop', null, event)">Continue Shopping</button>
      <a href="${waUrl}" target="_blank" class="btn btn-ghost">📱 Resend on WhatsApp</a>
    </div>
  </div>`)
}
async function renderShop(category = 'all', search = '') {
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'))
  const nav = `
   <style>
    @media (max-width: 768px) {
      .sn-hide { display: none !important; }
      .sn-text { display: none !important; }
      .sn-btn { padding: 8px 10px !important; font-size: 13px !important; min-width: auto !important; }
      .sn-nav { padding: 8px !important; }
      .sn-brand span { display: none !important; }
    }
  </style>
  <nav class="sn-nav" style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100;gap:8px">
    <button onclick="navigate('landing')" class="sn-brand" style="display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:0">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async" style="height:28px;width:auto"/>
      <span style="font-size:14px;font-weight:800;color:var(--navy);white-space:nowrap">Mathrone</span>
    </button>
    <div style="display:flex;align-items:center;gap:6px">
      ${isLoggedIn ? `
      <button class="btn btn-ghost btn-sm sn-btn sn-hide" onclick="navigate('wishlist')"><i data-lucide="heart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Wishlist</span></button>
      <button class="btn btn-ghost btn-sm sn-btn" onclick="navigate('cart')" id="cart-nav-btn"><i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart</span></button>
      <button class="btn btn-primary btn-sm sn-btn" onclick="navigate('dashboard')">Dashboard</button>` : `
      <button class="btn btn-ghost btn-sm sn-btn" onclick="openGuestOrderModal(_getGuestCart())" id="cart-nav-btn" style="display:none"><i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart</span></button>
      <button class="btn btn-ghost btn-sm sn-btn" onclick="navigate('courses')"><i data-lucide="graduation-cap" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Courses</span></button>
      <button class="btn btn-ghost btn-sm sn-btn" onclick="navigate('landing')"><i data-lucide="home" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Home</span></button>
      <button class="btn btn-primary btn-sm sn-btn" onclick="navigate('login')"><i data-lucide="log-in" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Sign In</span></button>
      <button class="btn btn-ghost btn-sm sn-btn sn-hide" onclick="navigate('register')">Sign Up</button>`}
    </div>
  </nav>`

  // Load cart count dynamically
  setTimeout(() => updateCartButton(), 300);

  // Show an immediate loading state so buttons like "Continue Shopping" provide instant feedback
  render(`
  ${nav}
  <div style="max-width:1200px;margin:100px auto;text-align:center">
    <div class="spinner" style="margin:0 auto"></div>
  </div>
  `);

  try {
    const productsUrl = API_URL + '/shop/products?' + new URLSearchParams({
      ...(category !== 'all' && {category}),
      ...(search && {search})
    });
    const [featured, products, bundles] = await Promise.all([
      search ? fetch(API_URL + '/shop/featured').then(r=>r.json()) : cachedFetch(API_URL + '/shop/featured', 120000),
      search ? fetch(productsUrl).then(r=>r.json()) : cachedFetch(productsUrl, 60000),
      cachedFetch(API_URL + '/shop/bundles', 120000),
    ])
    window._shopAllProducts = products        // filtered by current category (from API)
    window._shopActiveCategory = category     // remember which category this list belongs to

    const productCards = products.map(p => shopProductCard(p, isLoggedIn)).join('')
    const bundleCards  = bundles.map(b => shopBundleCard(b, isLoggedIn)).join('')
    const featuredCards = (featured.products||[]).map(p => shopProductCard(p, isLoggedIn)).join('')

    render(`
    ${nav}
    <div class="m-shop-container" style="max-width:1200px;margin:0 auto;padding:32px 0">

      <div class="shop-layout-grid" style="display:grid; grid-template-columns: 250px 1fr; gap: 30px; align-items: start; padding: 0 16px;">
        
        <!-- Left Sidebar -->
        <aside class="shop-sidebar" style="display:flex; flex-direction:column; gap:20px; position:sticky; top:70px;">
          <!-- Categories Box -->
          <div style="border:1px solid var(--g100); border-radius:8px; overflow:hidden; background:#fff;">
            <div style="background:var(--navy); color:#fff; padding:12px 16px; font-weight:700; font-size:15px;">Categories</div>
            <div style="display:flex; flex-direction:column;">
              ${SHOP_CATEGORIES.map(c=>`
              <button onclick="renderShop('${c.id}')" style="text-align:left; padding:10px 16px; background:${category===c.id?'var(--sky)':'#fff'}; color:${category===c.id?'var(--blue)':'var(--g600)'}; border:none; border-bottom:1px solid var(--g50); cursor:pointer; font-size:13px; font-weight:${category===c.id?'700':'500'}; transition:all 0.2s; display:flex; justify-content:space-between; align-items:center;">
                <span style="display:flex; align-items:center; gap:8px;">${c.icon} ${c.label}</span>
                ${category===c.id?'<span style="font-size:10px;">⊟</span>':'<span style="font-size:10px;color:var(--g200);">⊞</span>'}
              </button>`).join('')}
            </div>
          </div>
          
          <!-- Trust Badges -->
          <div style="border:1px solid var(--g100);border-radius:8px;overflow:hidden;background:#fff;">
            <div style="background:var(--navy);color:#fff;padding:12px 16px;font-weight:700;font-size:15px;">Why Shop With Us</div>
            <div style="padding:12px;display:flex;flex-direction:column;gap:0;">
              <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 4px;border-bottom:1px solid var(--g50);">
                <i data-lucide="badge-check" style="width:18px;height:18px;flex-shrink:0;color:#1d4ed8;margin-top:1px"></i>
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--navy);">Genuine Products</div>
                  <div style="font-size:11px;color:var(--g400);margin-top:1px;">All items are quality-checked before listing</div>
                </div>
              </div>
              <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 4px;border-bottom:1px solid var(--g50);">
                <i data-lucide="truck" style="width:18px;height:18px;flex-shrink:0;color:#1d4ed8;margin-top:1px"></i>
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--navy);">Kigali Delivery</div>
                  <div style="font-size:11px;color:var(--g400);margin-top:1px;">Fast delivery across Kigali & Rwanda</div>
                </div>
              </div>
              <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 4px;border-bottom:1px solid var(--g50);">
                <i data-lucide="lock" style="width:18px;height:18px;flex-shrink:0;color:#1d4ed8;margin-top:1px"></i>
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--navy);">Secure Checkout</div>
                  <div style="font-size:11px;color:var(--g400);margin-top:1px;">Your payment and data are protected</div>
                </div>
              </div>
              <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 4px;">
                <i data-lucide="refresh-ccw" style="width:18px;height:18px;flex-shrink:0;color:#1d4ed8;margin-top:1px"></i>
                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--navy);">Easy Returns</div>
                  <div style="font-size:11px;color:var(--g400);margin-top:1px;">Not satisfied? We'll make it right</div>
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <div style="border:1px solid #d1fae5;border-radius:8px;background:#f0fdf4;padding:16px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <i data-lucide="message-circle" style="width:18px;height:18px;color:#065f46;flex-shrink:0"></i>
              <span style="font-size:13px;font-weight:700;color:#065f46;">Need Help?</span>
            </div>
            <p style="font-size:11px;color:#047857;line-height:1.5;margin-bottom:12px;">Have a question about a product? Ask us on WhatsApp before you buy.</p>
            <a href="https://wa.me/250786684285" target="_blank"
               style="display:flex;align-items:center;justify-content:center;gap:6px;background:#25d366;color:#fff;text-decoration:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;transition:background .15s;"
               onmouseover="this.style.background='#1ebe5d'" onmouseout="this.style.background='#25d366'">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="shop-main-content" style="display:flex; flex-direction:column; min-width:0;">
        <!-- Mobile Category Pills -->
        <div class="shop-mobile-cats" style="overflow-x:auto;gap:8px;padding:0 4px 12px;scrollbar-width:none;-ms-overflow-style:none;flex-wrap:nowrap;">
          ${SHOP_CATEGORIES.map(c=>`
          <button onclick="renderShop('${c.id}')" style="white-space:nowrap;padding:6px 14px;border-radius:999px;border:1.5px solid ${category===c.id?'var(--blue)':'var(--g200)'};background:${category===c.id?'var(--sky)':'#fff'};color:${category===c.id?'var(--blue)':'var(--g600)'};font-size:12px;font-weight:${category===c.id?'700':'500'};cursor:pointer;flex-shrink:0;">
            ${c.icon} ${c.label}
          </button>`).join('')}
        </div>
          
          ${!window._shopBannerHidden ? `
          <style>
            @keyframes slideShopProducts {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.33%); }
            }
          </style>
          <!-- Top Banner -->
          <div id="shop-top-banner" style="background:var(--navy); border-radius:8px; padding:40px 30px; margin-bottom:24px; position:relative; overflow:hidden; display:flex; align-items:center; transition: all 0.5s ease-in-out; max-height: 500px; opacity: 1; min-height:160px;">
            <div style="position:relative; z-index:2; max-width:55%;">
              <h2 style="font-size:28px; font-weight:800; color:#fff; line-height:1.2; margin-bottom:12px; font-family:'Playfair Display',serif;">Buy Learning Materials</h2>
              <p style="font-size:13px; color:rgba(255,255,255,0.65); margin-bottom:20px;">Quality learning materials to empower your education journey.</p>
              <button class="btn btn-primary" onclick="window._shopBannerHidden=true; const b=document.getElementById('shop-top-banner'); b.style.maxHeight='0'; b.style.paddingTop='0'; b.style.paddingBottom='0'; b.style.marginBottom='0'; b.style.opacity='0'; setTimeout(()=>b.style.display='none', 500);" style="background:var(--blue); border-color:var(--blue);">Shop Now</button>
            </div>
            
            <!-- Sliding Diffused Products -->
            <div style="position:absolute; right:0; top:0; bottom:0; width:55%; overflow:hidden; pointer-events:none; z-index:0; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 35%); mask-image: linear-gradient(to right, transparent 0%, black 35%);">
              <div style="display:flex; height:100%; align-items:stretch; gap:0; animation: slideShopProducts 20s linear infinite; width:max-content;">
                 ${(() => {
                    const bImgs = products.filter(p => p.image_url).slice(0,5).map(p => p.image_url);
                    const safeImgs = bImgs.length ? bImgs : ['https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png'];
                    return [...safeImgs, ...safeImgs, ...safeImgs].map(url => `<div style="height:100%;width:180px;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:16px;border-right:1px solid rgba(255,255,255,0.08);"><img src="${url}" style="width:100%;height:100%;object-fit:contain;opacity:0.85;" /></div>`).join('');
                 })()}
              </div>
            </div>
          </div>
          ` : ''}
          <!-- Search & Sort Bar -->
          <div class="shop-filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--g100);">
            <div class="shop-search-row" style="display:flex; align-items:center; gap:8px; flex:1; min-width:260px;">
              <div style="position:relative; flex:1;">
                <input class="input" id="shop-search" placeholder="Search products..." value="${search}"
                  onkeydown="if(event.key==='Enter')renderShop('${category}',this.value)"
                  style="padding-left:36px; height:40px; min-height:40px; font-size:13px; border-color:var(--g200);"/>
                <i data-lucide="search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:var(--g400);"></i>
              </div>
              <button class="btn btn-primary shop-search-btn" style="height:40px; min-height:40px; padding:0 16px; font-size:13px; background:var(--navy); border-color:var(--navy);" onclick="renderShop('${category}',document.getElementById('shop-search')?.value||'')">Search</button>
            </div>
            
            <div class="shop-sort-row" style="display:flex; align-items:center; gap:16px; font-size:12px; color:var(--g600);">
              <div style="display:flex; align-items:center; gap:6px;">
                <label>Sort By:</label>
                <select id="shop-sort" class="input" style="height:32px; min-height:32px; padding:0 8px; font-size:12px; width:auto; border-color:var(--g200);" onchange="_applyShopFilters('${category}')">
                  <option value="default" ${window._shopSort==='default'||!window._shopSort?'selected':''}>Default</option>
                  <option value="name-az" ${window._shopSort==='name-az'?'selected':''}>Name (A-Z)</option>
                  <option value="name-za" ${window._shopSort==='name-za'?'selected':''}>Name (Z-A)</option>
                  <option value="price-asc" ${window._shopSort==='price-asc'?'selected':''}>Price (Low → High)</option>
                  <option value="price-desc" ${window._shopSort==='price-desc'?'selected':''}>Price (High → Low)</option>
                  <option value="stock" ${window._shopSort==='stock'?'selected':''}>In Stock First</option>
                </select>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <label>Show:</label>
                <select id="shop-show" class="input" style="height:32px; min-height:32px; padding:0 8px; font-size:12px; width:auto; border-color:var(--g200);" onchange="_applyShopFilters('${category}')">
                  <option value="9"  ${window._shopShow===9 ?'selected':''}>9</option>
                  <option value="15" ${window._shopShow===15||!window._shopShow?'selected':''}>15</option>
                  <option value="25" ${window._shopShow===25?'selected':''}>25</option>
                  <option value="50" ${window._shopShow===50?'selected':''}>50</option>
                  <option value="0"  ${window._shopShow===0 ?'selected':''}>All</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Featured products -->
      ${category === 'all' && !search && featuredCards ? `
      <div style="margin-bottom:48px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h1 style="font-size:22px;font-weight:800;color:var(--navy)">⭐ Featured Products</h1>
        </div>
        <div class="shop-grid">
          ${featuredCards}
        </div>
      </div>` : ''}

      <!-- Bundles -->
      ${category === 'all' && !search && bundleCards ? `
      <div style="margin-bottom:48px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h2 style="font-size:22px;font-weight:800;color:var(--navy)">Value Bundles — Mathrone Academy Learning Store</h2>
          <span style="font-size:13px;color:var(--g400)">Save more with our curated bundles</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
          ${bundleCards}
        </div>
      </div>` : ''}

      <!-- All products -->
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h2 style="font-size:22px;font-weight:800;color:var(--navy)">${category==='all'&&!search?'Learning Materials & School Supplies':'Search Results'} <span style="font-size:14px;font-weight:400;color:var(--g400)">(${products.length})</span></h2>
        </div>
        ${products.length ? `
        <div class="shop-grid">
          ${productCards}
        </div>` : `
        <div class="empty-state">
          <div class="empty-icon" style="color:var(--g400)"><i data-lucide="shopping-bag" style="width:48px;height:48px;stroke-width:1.5"></i></div>
          <div class="empty-title">No products found</div>
          <div class="empty-sub">Try a different category or search term</div>
        </div>`}
      </div>
      
        </div> <!-- End shop-main-content -->
        </div> <!-- End right column wrapper -->
      </div> <!-- End shop-layout-grid -->
    </div> <!-- End max-width wrapper -->

    <!-- Footer -->
    <div style="background:#0f172a;padding:24px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:48px;flex-wrap:wrap;gap:10px">
      <div style="font-size:13px;color:rgba(255,255,255,0.5)">© 2026 Mathrone Academy Learning Store</div>
      <button onclick="navigate('landing')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">← Back to Home</button>
    </div>
    `)
  }catch(e){
    toast(e.message,'err')
  }
}
function _applyShopFilters(category){
  const sortVal = document.getElementById('shop-sort')?.value || 'default'
  const showVal = parseInt(document.getElementById('shop-show')?.value) || 15

  // Persist selections so dropdowns survive re-renders
  window._shopSort = sortVal
  window._shopShow = showVal

  // Use the already-category-filtered list from the last API fetch
  // (no need to filter by category again — API already did it)
  let prods = [...(window._shopAllProducts || [])]

  // Apply current search on top
  const searchTerm = document.getElementById('shop-search')?.value?.trim().toLowerCase()
  if(searchTerm){
    prods = prods.filter(p =>
      (p.name||'').toLowerCase().includes(searchTerm) ||
      (p.description||'').toLowerCase().includes(searchTerm) ||
      (p.category||'').toLowerCase().includes(searchTerm)
    )
  }

  // Sort
  if(sortVal === 'name-az')    prods = [...prods].sort((a,b)=>(a.name||'').localeCompare(b.name||''))
  if(sortVal === 'name-za')    prods = [...prods].sort((a,b)=>(b.name||'').localeCompare(a.name||''))
  if(sortVal === 'price-asc')  prods = [...prods].sort((a,b)=>a.price-b.price)
  if(sortVal === 'price-desc') prods = [...prods].sort((a,b)=>b.price-a.price)
  if(sortVal === 'stock')      prods = [...prods].sort((a,b)=>b.stock-a.stock)

  // Limit
  const limited = showVal > 0 ? prods.slice(0, showVal) : prods

  // Re-render only the product grid + count
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'))
  const grid = document.querySelector('.shop-grid:last-of-type')
  const countEl = document.querySelector('.shop-main-content h2 span')
  if(countEl) countEl.textContent = `(${prods.length})`
  if(grid){
    grid.innerHTML = limited.length
      ? limited.map(p => shopProductCard(p, isLoggedIn)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-title">No products found</div></div>`
    if(window.lucide) window.lucide.createIcons()
  }
}
function openImageLightbox(src, alt) {
  if (document.getElementById('img-lightbox')) return
  const lb = document.createElement('div')
  lb.id = 'img-lightbox'
  lb.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeIn .18s ease'
  lb.innerHTML = `<img src="${src}" alt="${alt||''}" loading="lazy" decoding="async" style="max-width:92vw;max-height:92vh;object-fit:contain;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,0.6);animation:fadeUp .2s ease"/>
    <button onclick="event.stopPropagation();document.getElementById('img-lightbox').remove()" style="position:fixed;top:20px;right:24px;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:24px;width:44px;height:44px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)">✕</button>`
  lb.onclick = () => lb.remove()
  document.body.appendChild(lb)
}
async function renderRelatedProducts(productId, category, isLoggedIn) {
  try {
    const all = await fetch(API_URL + '/shop/products').then(r => r.json())
    const related = (Array.isArray(all) ? all : all.products || [])
      .filter(r => r.id !== productId && r.category === category && r.stock > 0)
      .slice(0, 4)
    if (!related.length) return
    const section = document.getElementById('related-products-section')
    if (!section) return
    section.innerHTML = `
      <div class="prod-full-desc" style="max-width:1400px;margin:40px auto 0;border-top:2px solid var(--g100);padding-top:36px;">
        <h2 style="font-size:22px;font-weight:800;color:var(--navy);margin-bottom:24px;font-family:'Playfair Display',serif">
          You may also like
        </h2>
        <div class="shop-grid">
          ${related.map(p => shopProductCard(p, isLoggedIn)).join('')}
        </div>
      </section>`
  } catch(e) { /* silently fail */ }
}
function shopProductCard(p, isLoggedIn) {
  if (!p) return ''
  const safeName = (p.name || '').replace(/'/g, "\\'");
  const isOutOfStock = p.stock === 0;
  const discPct = (p.member_discount_pct != null ? p.member_discount_pct : 3) / 100;
  const memberPrice = Number(p.price * (1 - discPct)).toLocaleString();
  const basePrice = Number(p.price).toLocaleString();
  const displayPrice = isLoggedIn ? memberPrice : basePrice;

  return `
  <div class="m-shop-card" style="background:#fff;border:1px solid #e8ecf0;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .2s,transform .2s;cursor:pointer"
       onmouseover="this.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)';this.style.transform='translateY(-2px)'"
       onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)'">

    <!-- Image — fixed 200px height, consistent across all cards -->
    <a href="/shop/${p.slug||p.id}" onclick="navigate('shop-product-${p.slug||p.id}', null, event)"
       class="m-shop-img-wrap" style="display:block;position:relative;width:100%;padding-top:100%;background:#f8fafc;overflow:hidden;flex-shrink:0;border-bottom:1px solid #f0f2f5">
      ${p.image_url
        ? `<img class="m-shop-img" src="${optImg(p.image_url, 400)}" alt="${p.name}" loading="lazy" decoding="async"
               style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;padding:16px;transition:transform .3s"
               onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"/>`
        : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:52px;color:#cbd5e1">🛍️</div>`}
      ${isOutOfStock ? `<div style="position:absolute;top:10px;left:10px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;letter-spacing:0.05em">OUT OF STOCK</div>` : ''}
      ${p.is_featured ? `<div style="position:absolute;top:10px;right:10px;background:#f59e0b;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px">⭐ FEATURED</div>` : ''}
    </a>

    <!-- Body -->
    <div class="m-shop-body" style="padding:12px 14px;flex:1;display:flex;flex-direction:column;gap:0">

      <!-- Category tag -->
      ${p.category ? `<div style="font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:0.08em">${p.category}</div>` : ''}

      <!-- Name — clamped to 2 lines -->
      <a href="/shop/${p.slug||p.id}" onclick="navigate('shop-product-${p.slug||p.id}', null, event)"
           style="display:block;text-decoration:none;font-size:14px;font-weight:700;color:#0f172a;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:2px;">
        ${p.name}
      </a>

      <!-- Description — 2 lines max -->
      ${p.description ? `
      <div style="font-size:12px;color:#64748b;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-height:34px;margin-top:1px">
        ${p.description}
      </div>` : ''}

      <!-- View Details — pill style, above price -->
      <a href="/shop/${p.slug||p.id}" onclick="navigate('shop-product-${p.slug||p.id}', null, event)"
         style="display:inline-flex;align-items:center;gap:3px;padding:4px 12px;border-radius:999px;border:1.5px solid #bfdbfe;background:#eff6ff;font-size:11px;font-weight:600;color:#1d4ed8;text-decoration:none;width:fit-content;transition:background .15s;margin-top:4px"
         onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">
        View full details →
      </a>

      <!-- Spacer pushes price+button to bottom -->
      <div style="flex:1"></div>

      <!-- Price -->
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:4px">
        <span style="font-size:15px;font-weight:800;color:#0f172a">RWF ${displayPrice}</span>
        ${isLoggedIn ? `
          <span style="font-size:11px;color:#94a3b8;text-decoration:line-through">RWF ${basePrice}</span>
          <span style="font-size:10px;background:#dcfce7;color:#065f46;padding:2px 6px;border-radius:4px;font-weight:700;white-space:nowrap">-${p.member_discount_pct != null ? p.member_discount_pct : 3}% member</span>
        ` : ''}
      </div>

      <!-- CTA button -->
      <button onclick="${isOutOfStock ? "toast('Out of stock','err')" :
          isLoggedIn ? `addToCart('${p.id}',null,'${safeName}',this)` :
          `addToGuestCart('${p.id}','${safeName}',${p.price},1)`}"
        style="margin-top:6px;width:100%;background:${isOutOfStock ? '#e2e8f0' : 'var(--blue)'};color:${isOutOfStock ? '#94a3b8' : '#fff'};border:none;padding:8px;border-radius:8px;cursor:${isOutOfStock ? 'not-allowed' : 'pointer'};font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:5px;transition:background .15s"
        ${isOutOfStock ? 'disabled' : `onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='var(--blue)'"`}>
        <i data-lucide="shopping-cart" style="width:14px;height:14px"></i>
        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      
    </div>
  </div>`
}

function setCardQty(inputId, qty){
  const input = document.getElementById(inputId)
  if(input) input.value = qty
}

async function addToCartQty(productId, bundleId, name, btn, qtyInputId){
  const qty = parseInt(document.getElementById(qtyInputId)?.value) || 1
  if(btn){ btn.disabled=true; btn.textContent='Adding...' }
  try{
    await api('/shop/cart',{ method:'POST', body:JSON.stringify({ product_id:productId, bundle_id:bundleId, quantity:qty }) })
    toast(`${name} ×${qty} added to cart 🛒`)
    updateCartButton()
    if(btn){ btn.innerHTML='✅ Added!'; setTimeout(()=>{ btn.disabled=false; btn.innerHTML='<i data-lucide="shopping-cart" style="width:14px;height:14px;margin-right:4px"></i> Add to Cart'; if(window.lucide) lucide.createIcons() },2000) }
  }catch(e){
    toast(e.message,'err')
    if(btn){ btn.disabled=false; btn.innerHTML='<i data-lucide="shopping-cart" style="width:14px;height:14px;margin-right:4px"></i> Add to Cart'; if(window.lucide) lucide.createIcons() }
  }
}

function shopBundleCard(b, isLoggedIn){
  const items = (b.bundle_items||[])
  return `
  <div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);border-radius:16px;overflow:hidden;color:#fff;position:relative">
    <div style="padding:24px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">📦 Bundle Deal</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">${b.name}</div>
      <div style="font-size:13px;opacity:0.8;margin-bottom:16px">${b.description||''}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
        ${items.map(i=>`
        <div style="display:flex;align-items:center;gap:8px;font-size:13px">
          <span style="color:var(--gold)">✓</span>
          <span>${i.products?.name||'Item'} ${i.quantity>1?'×'+i.quantity:''}</span>
        </div>`).join('')}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:22px;font-weight:800;color:var(--gold)">RWF ${Number(b.price).toLocaleString()}</div>
        <button onclick="${isLoggedIn?`addToCart(null,'${b.id}','${(b.name||'').replace(/'/g,"\\'")}',this)`:`addToGuestCart(null,'${(b.name||'').replace(/'/g,"\\'")}',${b.price},1)`}"
          style="background:var(--gold);color:#1a1a1a;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700">
          <i data-lucide="package-plus" style="width:14px;height:14px;margin-right:4px"></i> Add Bundle
        </button>
      </div>
    </div>
  </div>`
}

// ══════════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ══════════════════════════════════════════════════
async function renderShopProduct(productId) {
  const isLoggedIn = !!(State.user && localStorage.getItem('tc_access'));
  try {
    const p = await fetch(API_URL + '/shop/products/' + productId).then(r => r.json());
    if(!p || p.detail || p.error){ throw new Error('Product not found') }
    const allImages = [p.image_url, ...(p.extra_images || [])].filter(Boolean);
    
    // PRICE LOGIC: Members get 3% off, Guests pay full price
    const displayPrice = p.price; // Always show full price; discount shown separately for members
    const safeName = (p.name || '').replace(/'/g, "\\'");

    // EXCELLENCE FIX: Define privacyVideoUrl here so it is available below
    const privacyVideoUrl = p.video_url ? p.video_url.replace('youtube.com', 'youtube-nocookie.com') + '?enablejsapi=1' : '';

    render(`
    <!-- STICKY NAV -->
    <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100;gap:8px;flex-wrap:wrap;">
      <a href="/shop" onclick="navigate('shop', null, event)" style="display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;">
        <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo"loading="lazy" decoding="async" style="height:28px;width:auto"/>
        <span style="font-size:14px;font-weight:700;color:var(--navy)">Mathrone Store</span>
      </a>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <button class="btn btn-ghost btn-sm sn-btn" onclick="navigate('shop')">← <span class="sn-text">Shop</span></button>
        ${isLoggedIn ? 
          `<button class="btn btn-ghost btn-sm sn-btn" onclick="navigate('cart')" id="cart-nav-btn"><i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart</span></button>` : 
          `<button class="btn btn-ghost btn-sm sn-btn" onclick="openGuestOrderModal(_getGuestCart())" id="cart-nav-btn" 
             style="${_getGuestCart().length > 0 ? 'display:inline-flex' : 'display:none'}"><i data-lucide="shopping-cart" style="width:16px;height:16px;margin-right:4px"></i> <span class="sn-text">Cart (${_getGuestCart().reduce((a, b) => a + b.qty, 0)})</span></button>`
        }
      </div>
    </nav>

<!-- Visible Breadcrumbs -->
<div style="max-width:1400px; margin: 10px auto; padding: 0 16px; font-size: 13px; color: var(--g400);">
  <a href="/" onclick="navigate('landing', null, event)" style="cursor:pointer; color:var(--blue)">Home</a> / 
  <a href="/shop" onclick="navigate('shop', null, event)" style="cursor:pointer; color:var(--blue)">Shop</a> / 
  <span style="color:var(--g600)">${p.name}</span>
</div>

    <div style="max-width:1400px;margin:0 auto;padding:40px 0;overflow-x:hidden">
      <div class="prod-detail-container">

        <!-- IMAGE GALLERY COLUMN -->
        <div class="prod-image-column">
          <div id="prod-main-img" style="border-radius:16px;overflow:hidden;background:var(--sky);margin-bottom:12px;border:1px solid var(--g100)">
            ${allImages.length ? `<img id="prod-main-img-el" src="${allImages[0]}" alt="Buy ${p.name} in Rwanda - Mathrone Academy Learning Store"loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:contain;padding:10px"/>` :
              `<div style="display:flex;align-items:center;justify-content:center;height:300px;font-size:80px">🛍️</div>`}
          </div>
          
          ${allImages.length > 1 ? `
          <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:10px">
            ${allImages.map((img, i) => `
            <div onclick="document.getElementById('prod-main-img-el').src='${img}'" 
              style="width:70px;height:70px;border-radius:8px;overflow:hidden;cursor:pointer;flex-shrink:0;border:2px solid var(--g200)">
              <img src="${img}"loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover"/>
            </div>`).join('')}
          </div>` : ''}
        </div>

        <!-- PRODUCT INFO COLUMN -->
        <div class="prod-info-column" style="display:flex;flex-direction:column;">
          <a href="/shop" onclick="navigate('shop', null, event)" style="font-size:12px;font-weight:700;color:var(--blue);text-transform:uppercase;margin-bottom:8px;display:block;text-decoration:none">${SHOP_CATEGORIES.find(c => c.id === p.category)?.label || p.category}</a>
          <h1 class="prod-title" style="font-size:24px;font-weight:800;color:var(--navy);margin-bottom:12px;font-family:'Playfair Display',serif;">${p.name}</h1>
          
          

          <!-- Meta Info -->
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px; font-size:13px; color:var(--g600);">
            <div><strong>Brand:</strong> Mathrone Supplies</div>
            <div><strong>Product Code:</strong> ${p.slug || p.id.substring(0,8)}</div>
            <div><strong>Availability:</strong> <span style="color:${p.stock > 0 ? 'var(--blue)' : 'var(--red)'}; font-weight:600;">${p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></div>
          </div>

          <div style="border-top:1px solid var(--g100); padding-top:20px; margin-bottom:20px;">
            <div style="font-size:24px;font-weight:800;color:var(--navy)">RWF ${isLoggedIn ? Number(p.price * 0.97).toLocaleString() : Number(p.price).toLocaleString()}</div>
            ${isLoggedIn ? 
              `<div style="color:var(--green);font-size:12px;font-weight:700;margin-top:4px;">Member Discount Applied (-${p.member_discount_pct != null ? p.member_discount_pct : 3}%)</div>` : 
              `<div style="color:var(--g600);font-size:11px;margin-top:6px;">Sign in to get a member discount. <a onclick="navigate('register')" style="color:var(--blue);cursor:pointer;font-weight:700">Register</a> or <a onclick="navigate('login')" style="color:var(--blue);cursor:pointer;font-weight:700">Sign In</a>.</div>`
            }
          </div>

          <p style="font-size:14px;color:var(--g600);line-height:1.6;margin-bottom:24px">${p.description || ''}</p>

          <div class="prod-action-btns" style="display:flex; align-items:center; gap:12px; margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid var(--g100); flex-wrap:wrap; width:100%;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:13px; font-weight:700; color:var(--navy);">Qty</span>
              <input type="number" value="1" min="1" id="prod-qty-input" style="width:60px; height:40px; min-height:40px; border:1px solid var(--g200); border-radius:4px; text-align:center; font-family:inherit; outline:none; padding:0;" />
            </div>
            
            <button onclick="${p.stock === 0 ? "toast('Out of stock','err')" : isLoggedIn ? `addToCartQty('${p.id}',null,'${safeName}',this,'prod-qty-input')` : `addToGuestCart('${p.id}','${safeName}',${p.price},parseInt(document.getElementById('prod-qty-input').value||1))`}"
              style="flex:1; min-width:140px; background:var(--blue);color:#fff;border:none;padding:0 16px;height:40px;min-height:40px;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700;transition:background .2s;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:6px;" onmouseover="this.style.background='var(--blue2)'" onmouseout="this.style.background='var(--blue)'">
              <i data-lucide="shopping-cart" style="width:16px;height:16px"></i> Add To Cart
            </button>
            
            <button onclick="${isLoggedIn ? `toggleWishlist('${p.id}','${safeName}',this)` : `toast('Sign in to save','info')`}"
              style="background:var(--navy);color:#fff;border:none;width:40px;height:40px;min-height:40px;min-width:40px;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;" onmouseover="this.style.background='#1E2845'" onmouseout="this.style.background='var(--navy)'" id="wish-${p.id}">
              <i data-lucide="heart" style="width:16px;height:16px"></i>
            </button>
          </div>
          
          <!-- Social Share Row -->
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(p.name)}&url=${encodeURIComponent('https://mathroneacademy.com/shop/'+p.slug)}" target="_blank"
               style="background:#000;color:#fff;border:none;padding:6px 12px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;text-decoration:none;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Post
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://mathroneacademy.com/shop/'+p.slug)}" target="_blank"
               style="background:#1877F2;color:#fff;border:none;padding:6px 12px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;text-decoration:none;">
              <i data-lucide="facebook" style="width:11px;height:11px"></i>
              Share
            </a>
            <a href="https://wa.me/?text=${encodeURIComponent(p.name+' - RWF '+Number(p.price).toLocaleString()+'\nhttps://mathroneacademy.com/shop/'+p.slug)}" target="_blank"
               style="background:#25d366;color:#fff;border:none;padding:6px 12px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;text-decoration:none;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
          
          
        <!-- VIDEO UNDER BUTTONS (right column) -->
          ${p.video_url ? (() => {
            const ytMatch = p.video_url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
            const ytId = ytMatch ? ytMatch[1] : '';
            const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '';
            const cleanUrl = ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0` : p.video_url;
            
            return `
          <div style="margin-top:16px">
            <div style="background:var(--navy);padding:10px 12px;border-radius:12px 12px 0 0;color:#fff;font-size:12px;font-weight:700;text-align:center">
              📺 WATCH PRODUCT PREVIEW
            </div>
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;background:#000;border-radius:0 0 12px 12px;box-shadow:var(--sh)">
              
              <!-- Custom Mathrone Video Cover -->
              <div id="shop-vid-cover" onclick="this.style.display='none'; document.getElementById('shop-vid-iframe').src='${cleanUrl}'" 
                   style="position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;background:#000 url('${thumbUrl}') center/cover no-repeat;display:flex;align-items:center;justify-content:center;z-index:2">
                <div style="width:64px;height:64px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(26,95,255,0.4);transition:transform 0.2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
              </div>
              
              <!-- Actual Video -->
              <iframe id="shop-vid-iframe" src=""
                      style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1"
                      allowfullscreen
                      loading="lazy" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
              </iframe>
           </div>

          <!-- WhatsApp Support Box -->
          <div style="margin-top:12px;background:#fff;padding:16px;border-radius:12px;border:1px solid var(--g100);box-shadow:var(--sh)">
            <p style="font-size:14px;color:var(--navy);font-weight:700;margin:0">Still have questions?</p>
            <p style="font-size:12px;color:var(--g600);margin-top:6px;line-height:1.5">Need help or want bulk pricing? Chat with our team now.</p>
            <a href="https://wa.me/${MATHRONE_WHATSAPP.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hi Mathrone Academy, I have a question about: ' + p.name)}"
               target="_blank"
               style="display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;text-decoration:none;padding:11px;border-radius:8px;font-weight:700;font-size:13px;margin-top:12px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
          </div>`;
          })() : ''}

        </div>

    </div>

    <!-- FULL DESCRIPTION — full width below both columns -->
    ${p.full_description ? `
    <div class="prod-full-desc" style="max-width:1400px;margin:40px auto 0;border-top:2px solid var(--g100);padding-top:36px;">
      <h2 style="font-size:20px;font-weight:800;color:var(--navy);margin-bottom:20px;font-family:'Playfair Display',serif">Product Details</h2>
      <div style="font-size:15px;color:var(--g600);line-height:1.9;white-space:pre-line">${p.full_description}</div>
    </div>` : ''}

    <div id="related-products-section"></div>
    </div>`)
    // ── Single canonical meta update for this product ──────────────
    const productSlug = p.slug || productId
    const productUrl  = 'https://mathroneacademy.com/shop/' + productSlug
    const productDesc = `Buy ${p.name} in Rwanda — RWF ${Number(p.price).toLocaleString()}. ${(p.description||'').slice(0,80)} — Mathrone Academy Learning Store, Kigali.`
    const productImg  = p.image_url || 'https://mathroneacademy.com/og-banner.jpg'
    const productTitle = p.name + ' | Mathrone Academy Store Rwanda'
    document.title = p.name + ' | Buy School Supplies in Rwanda — Mathrone Academy'
    document.querySelector('meta[name="description"]')?.setAttribute('content', productDesc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', productTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', productDesc)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', productUrl)
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', productImg)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', productTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', productDesc)
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', productImg)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', productUrl)

const existingBreadcrumb = document.getElementById('breadcrumb-schema')
if(existingBreadcrumb) existingBreadcrumb.remove()
const breadcrumbSchema = document.createElement('script')
breadcrumbSchema.id = 'breadcrumb-schema'
breadcrumbSchema.type = 'application/ld+json'
breadcrumbSchema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mathroneacademy.com" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://mathroneacademy.com/shop" },
    { "@type": "ListItem", "position": 3, "name": p.name, "item": 'https://mathroneacademy.com/shop/' + (p.slug||p.id) }
  ]
})
document.head.appendChild(breadcrumbSchema)

const existingSchema = document.getElementById('product-schema')
if(existingSchema) existingSchema.remove()
const productSchema = document.createElement('script')
productSchema.id = 'product-schema'
productSchema.type = 'application/ld+json'
productSchema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": p.name,
  "description": (p.description || p.name).replace(/\s+/g,' ').trim(),
  "image": p.image_url || '',
  "url": 'https://mathroneacademy.com/shop/' + (p.slug||p.id),
"sku": p.slug || String(p.id),
"brand": { "@type": "Brand", "name": "Mathrone Academy" },

  "offers": {
    "@type": "Offer",
    "priceCurrency": "RWF",
    "price": p.price,
    "url": 'https://mathroneacademy.com/shop/' + (p.slug||p.id),
    "availability": p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": { "@type": "Organization", "name": "Mathrone Academy" }
  }
})
document.head.appendChild(productSchema)
    // Update URL for refresh support
    history.pushState({ page: 'shop-product-' + productSlug, tab: null }, document.title, '/shop/' + productSlug)
  renderRelatedProducts(productId, p.category, isLoggedIn)
  setTimeout(() => updateCartButton(), 300);
  }catch(e){ toast(e.message,'err'); navigate('shop') }
  
}

// ══════════════════════════════════════════════════
// CART
// ══════════════════════════════════════════════════
async function renderCart(){
  if(!State.user || !localStorage.getItem('tc_access')){ navigate('shop'); return }
  render(dashWrap('cart',`<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const items = await api('/shop/cart')
    const total = items.reduce((sum,i)=>{
      const price = i.products?.price || i.bundles?.price || 0
      return sum + (price * i.quantity)
    },0)
    const totalQty = items.reduce((sum,i)=>sum + i.quantity, 0)
    render(dashWrap('cart',`
    <div class="page-header">
      <div><h1 class="page-title">🛒 My Cart</h1><p class="page-subtitle">${totalQty} item${totalQty!==1?'s':''}</p></div>
      <button class="btn btn-ghost" onclick="navigate('shop')">← Continue Shopping</button>
    </div>
    ${items.length ? `
    <div style="display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start" class="cart-grid">
      <div>
        ${items.map(i=>{
          const item = i.products || i.bundles || {}
          const price = item.price || 0
          return `
          <div class="card" id="cart-row-${i.id}" data-price="${price}" style="padding:16px;margin-bottom:12px">
            <div style="display:flex;gap:14px;align-items:center">
              <div style="width:68px;height:68px;border-radius:10px;background:var(--sky);flex-shrink:0;overflow:hidden">
                ${item.image_url?`<img src="${item.image_url}" alt="${item.name||'Cart item'}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover"/>`:`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:26px">${i.bundle_id?'📦':'🛍️'}</div>`}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;color:var(--navy);font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name||'—'}</div>
                <div style="font-size:12px;color:var(--g400);margin-top:2px">${i.bundle_id?'Bundle':'Product'}</div>
                <div style="font-size:15px;font-weight:800;color:var(--navy);margin-top:4px">RWF ${Number(price).toLocaleString()}</div>
              </div>
              <button onclick="removeFromCart('${i.id}')" style="background:none;border:none;color:var(--g300);cursor:pointer;padding:4px;flex-shrink:0" title="Remove"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--g100)">
              <div style="display:flex;align-items:center;gap:10px">
                <button onclick="updateCartItem('${i.id}',${i.quantity-1})" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;font-weight:700">−</button>
                <span class="cart-qty-display" style="font-weight:800;min-width:24px;text-align:center;font-size:15px">${i.quantity}</span>
                <button onclick="updateCartItem('${i.id}',${i.quantity+1})" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--g200);background:#fff;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;font-weight:700">+</button>
              </div>
              <div class="cart-row-total" style="font-size:16px;font-weight:800;color:var(--navy)">RWF ${Number(price*i.quantity).toLocaleString()}</div>
            </div>
          </div>`
        }).join('')}
      </div>
      <!-- Order summary -->
      <div class="card" style="padding:24px;position:sticky;top:80px">
        <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">Order Summary</h3>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
          <span id="summary-qty" style="color:var(--g400)">Subtotal (${totalQty} item${totalQty!==1?'s':''})</span>
          <span id="summary-subtotal" style="font-weight:600">RWF ${Number(total).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
          <span style="color:var(--g400)">Member discount</span>
          <span id="summary-discount" style="color:var(--green);font-weight:600">- RWF ${Number(total*0.03).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
          <span style="color:var(--g400)">Delivery</span>
          <span id="summary-delivery" style="color:${total>=50000?'var(--green)':'var(--orange)'};font-weight:600">${total>=50000?'Free':'To be negotiated'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--g100);margin-bottom:20px">
          <span style="font-weight:700;font-size:16px">Total</span>
          <span id="summary-total" style="font-weight:800;font-size:20px;color:var(--navy)">RWF ${Number(total*0.97).toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="openCheckoutModal(${JSON.stringify(items).replace(/"/g,'&quot;')},${total})">
          Proceed to Checkout →
        </button>
        <button class="btn btn-ghost btn-full" style="margin-top:8px" onclick="navigate('shop')">Continue Shopping</button>
      </div>
    </div>` : `
    <div class="empty-state">
      <div class="empty-icon" style="color:var(--g400)"><i data-lucide="shopping-cart" style="width:48px;height:48px;stroke-width:1.5"></i></div>
      <div class="empty-title">Your cart is empty</div>
      <div class="empty-sub">Browse our store and add items you need</div>
      <button class="btn btn-primary" style="margin-top:16px" onclick="navigate('shop')">Browse Products</button>
    </div>`}
    <div id="modal-root"></div>
    `))
  }catch(e){ toast(e.message,'err') }
}

async function addToCart(productId, bundleId, name, btn){
  if(btn){ btn.disabled=true; btn.textContent='Adding...' }
  try{
    await api('/shop/cart',{ method:'POST', body:JSON.stringify({ product_id:productId, bundle_id:bundleId, quantity:1 }) })
    toast(`${name} added to cart 🛒`)
    updateCartButton()
    if(btn){ btn.innerHTML='✅ Added!'; setTimeout(()=>{ btn.disabled=false; btn.innerHTML='<i data-lucide="shopping-cart" style="width:14px;height:14px;margin-right:4px"></i> Add to Cart'; if(window.lucide) lucide.createIcons() },2000) }
  }catch(e){
    toast(e.message,'err')
    if(btn){ btn.disabled=false; btn.innerHTML='<i data-lucide="shopping-cart" style="width:14px;height:14px;margin-right:4px"></i> Add to Cart'; if(window.lucide) lucide.createIcons() }
  }
}

async function updateCartItem(itemId, qty){
  if(qty <= 0){ removeFromCart(itemId); return }
  // Optimistic UI — update DOM instantly, sync in background
  const row = document.getElementById(`cart-row-${itemId}`)
  if(row){
    const pricePerUnit = parseFloat(row.dataset.price)
    row.querySelector('.cart-qty-display').textContent = qty
    row.querySelector('.cart-row-total').textContent = `RWF ${Number(pricePerUnit * qty).toLocaleString()}`
    _recalcOrderSummary()
  }
  try{
    await api(`/shop/cart/${itemId}`,{ method:'PATCH', body:JSON.stringify({ quantity:qty }) })
  }catch(e){ toast(e.message,'err'); renderCart() }
}

async function removeFromCart(itemId){
  // Optimistic UI — remove row instantly
  const row = document.getElementById(`cart-row-${itemId}`)
  if(row){ row.style.transition='opacity 0.2s'; row.style.opacity='0'; setTimeout(()=>row.remove(),200); _recalcOrderSummary() }
  try{
    await api(`/shop/cart/${itemId}`,{ method:'DELETE' })
    toast('Removed from cart')
    updateCartButton()
  }catch(e){ toast(e.message,'err'); renderCart() }
}

function _recalcOrderSummary(){
  const rows = document.querySelectorAll('[data-price]')
  let total = 0
  let totalQty = 0
  rows.forEach(r => {
    const qty = parseInt(r.querySelector('.cart-qty-display')?.textContent || 0)
    const price = parseFloat(r.dataset.price || 0)
    total += price * qty
    totalQty += qty
  })
  const discountedTotal = total * 0.97
  const discount = total - discountedTotal
  const el = id => document.getElementById(id)
  if(el('summary-subtotal'))  el('summary-subtotal').textContent  = `RWF ${Number(total).toLocaleString()}`
  if(el('summary-discount'))  el('summary-discount').textContent  = `- RWF ${Number(discount).toLocaleString()}`
  if(el('summary-delivery'))  { el('summary-delivery').textContent = total >= 50000 ? 'Free' : 'To be negotiated'; el('summary-delivery').style.color = total >= 50000 ? 'var(--green)' : 'var(--orange)' }
  if(el('summary-total'))     el('summary-total').textContent     = `RWF ${Number(discountedTotal).toLocaleString()}`
  if(el('summary-qty'))       el('summary-qty').textContent       = `Subtotal (${totalQty} item${totalQty!==1?'s':''})`
  if(el('cart-page-qty'))     el('cart-page-qty').textContent     = `${totalQty} item${totalQty!==1?'s':''}`
}

async function toggleWishlist(productId, name, btn){
  if(!State.user){ navigate('login'); return }
  try{
    const res = await api(`/shop/wishlist/${productId}`,{ method:'POST', body:'{}' })
    if(btn) btn.textContent = res.wishlisted ? '❤️' : '🤍'
    toast(res.wishlisted ? `${name} added to wishlist ❤️` : `${name} removed from wishlist`)
  }catch(e){ toast(e.message,'err') }
}

// ══════════════════════════════════════════════════
// WISHLIST
// ══════════════════════════════════════════════════
async function renderWishlist(){
  if(!State.user || !localStorage.getItem('tc_access')){ navigate('shop'); return }
  render(dashWrap('wishlist',`<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const items = await api('/shop/wishlist')
    render(dashWrap('wishlist',`
    <div class="page-header">
      <div><h1 class="page-title">❤️ My Wishlist</h1><p class="page-subtitle">${items.length} item${items.length!==1?'s':''}</p></div>
      <button class="btn btn-ghost" onclick="navigate('shop')">← Continue Shopping</button>
    </div>
    ${items.length ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin:0">
      ${items.map(i=>shopProductCard(i.products, true)).join('')}
    </div>` : `
    <div class="empty-state">
      <div class="empty-icon" style="color:var(--g400)"><i data-lucide="heart" style="width:48px;height:48px;stroke-width:1.5"></i></div>
      <div class="empty-title">Your wishlist is empty</div>
      <div class="empty-sub">Save items you love for later</div>
      <button class="btn btn-primary" style="margin-top:16px" onclick="navigate('shop')">Browse Products</button>
    </div>`}
    `))
  }catch(e){ toast(e.message,'err') }
}

// ══════════════════════════════════════════════════
// CHECKOUT MODAL
// ══════════════════════════════════════════════════
function openCheckoutModal(items, total){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:520px">
      <div class="modal-header">
        <span class="modal-title">🛒 Complete Your Order</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:var(--sky);border-radius:10px;padding:14px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:14px;color:var(--g400)">${items.length} item${items.length!==1?'s':''}</span>
          <span style="font-size:20px;font-weight:800;color:var(--navy)">RWF ${Number(total).toLocaleString()}</span>
        </div>
        <div class="form-group">
          <label class="form-label">Delivery Address *</label>
          <input class="input" id="order-address" placeholder="e.g. Kigali, Gasabo, KG 123 St"/>
        </div>
        <div class="form-group">
          <label class="form-label">Delivery Phone *</label>
          <input class="input" id="order-phone" placeholder="+250 788 000 000"/>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Method *</label>
          <select class="input" id="order-payment" onchange="toggleOrderPaymentPhone(this.value)">
            <option value="">— Select payment method —</option>
            <option value="mtn_momo">MTN Mobile Money</option>
            <option value="airtel">Airtel Money</option>
            <option value="bank">Bank Transfer</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>
        <div class="form-group" id="order-payment-phone-wrap" style="display:none">
          <label class="form-label">Mobile Money Number</label>
          <input class="input" id="order-payment-phone" placeholder="078XXXXXXX"/>
          <div style="margin-top:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;font-size:12px;color:#166534">
            <strong>MoMoPay Code: 178251</strong><br/>
            You can pay in advance or upon delivery. If paying now, dial *182*8*1*178251# and show the message to our delivery agent.
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes (optional)</label>
          <textarea class="input" id="order-notes" rows="2" placeholder="Any special instructions..."></textarea>
        </div>
        <div style="background:#FEF3C7;border-radius:8px;padding:12px;font-size:13px;color:#92400E;display:flex;gap:8px">
          <span style="font-size:16px">💡</span>
          <span>Our team will contact you at the number provided to confirm delivery details.</span>
        </div>

        <!-- Proof of payment -->
        <div style="margin-top:16px;border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <div style="background:#0D1B40;color:#fff;padding:10px 14px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px">
            🧾 Proof of Payment <span style="font-size:10px;opacity:0.6;font-weight:400">(optional — speeds up order confirmation)</span>
          </div>
          <div style="padding:14px;display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">MoMo / Transaction Reference</label>
              <input class="input" id="order-momo-ref" placeholder="e.g. 1234567890" style="font-size:13px"/>
              <div style="font-size:11px;color:#94a3b8;margin-top:3px">Found in your MoMo SMS after payment</div>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">Screenshot of Payment</label>
              <div id="order-proof-preview" style="display:none;margin-bottom:8px">
                <img id="order-proof-img" style="max-width:100%;max-height:160px;border-radius:8px;border:1px solid #e2e8f0;object-fit:contain"/>
              </div>
              <label style="display:flex;align-items:center;gap:8px;border:1.5px dashed #cbd5e1;border-radius:8px;padding:10px 14px;cursor:pointer;background:#f8fafc;font-size:13px;color:#64748b">
                <span>📷</span>
                <span id="order-proof-label">Click to upload screenshot (JPG, PNG)</span>
                <input type="file" id="order-proof-file" accept="image/*" style="display:none" onchange="uploadShopPaymentProof(this)"/>
              </label>
              <input type="hidden" id="order-proof-url" value=""/>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="place-order-btn" onclick="placeOrder(${JSON.stringify(items).replace(/"/g,'&quot;')},${total})">Place Order →</button>
      </div>
    </div>
  </div>`
}
async function uploadShopPaymentProof(input, prefix='order'){
  const file = input.files[0]
  if(!file) return
  const label    = document.getElementById(`${prefix}-proof-label`)
  const preview  = document.getElementById(`${prefix}-proof-preview`)
  const img      = document.getElementById(`${prefix}-proof-img`)
  const urlInput = document.getElementById(`${prefix}-proof-url`)

  // Show local preview instantly — works for everyone
  const reader = new FileReader()
  reader.onload = e => {
    if(img) img.src = e.target.result
    if(preview) preview.style.display = 'block'
  }
  reader.readAsDataURL(file)

  if(label) label.textContent = '⏳ Uploading...'

  try{
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch(API_URL + '/news/public/upload-proof', {
      method: 'POST',
      body: fd
    })
    const data = await res.json()
    if(!res.ok) throw new Error(data.detail || 'Upload failed')
    if(urlInput) urlInput.value = data.url
    if(label) label.textContent = '✅ ' + file.name
    toast('Screenshot uploaded ✅')
  }catch(e){
    if(label) label.textContent = '❌ Upload failed — ' + e.message
    toast('Upload failed: ' + e.message, 'err')
  }
}
function toggleOrderPaymentPhone(val){
  const wrap = document.getElementById('order-payment-phone-wrap')
  if(wrap) wrap.style.display = ['mtn_momo','airtel'].includes(val) ? 'block' : 'none'
}

async function placeOrder(items, total){
  const address  = document.getElementById('order-address')?.value?.trim()
  const phone    = document.getElementById('order-phone')?.value?.trim()
  const payment  = document.getElementById('order-payment')?.value
  const payPhone = document.getElementById('order-payment-phone')?.value?.trim()
  const notes    = document.getElementById('order-notes')?.value?.trim()
  const btn      = document.getElementById('place-order-btn')
  // Weighted discount: each item uses its own member_discount_pct
  const discountedTotal = items.reduce((sum, item) => {
    const pct = (item.products?.member_discount_pct != null ? item.products.member_discount_pct : 3) / 100
    const itemTotal = (item.products?.price || item.bundles?.price || 0) * (item.quantity || 1)
    return sum + itemTotal * (1 - pct)
  }, 0)

  if(!address){ toast('Delivery address is required','err'); return }
  if(!phone){   toast('Delivery phone is required','err');   return }
  if(!payment){ toast('Please select a payment method','err'); return }

  if(btn){ btn.disabled=true; btn.textContent='Placing order...' }

  const orderItems = items.map(i=>({
    product_id: i.product_id || null,
    bundle_id:  i.bundle_id  || null,
    name:       i.products?.name || i.bundles?.name || '—',
    quantity:   i.quantity,
    price:      i.products?.price || i.bundles?.price || 0
    
  }))

  try{
    const momoRef  = document.getElementById('order-momo-ref')?.value?.trim() || null
    const proofUrl = document.getElementById('order-proof-url')?.value?.trim() || null

    const res = await api('/shop/orders',{
      method:'POST',
      body: JSON.stringify({
        items:            orderItems,
        total_amount:     discountedTotal,
        discount_amount:  total - discountedTotal,
        is_free_delivery: total >= 50000,
        payment_method:   payment,
        payment_phone:    payPhone || null,
        delivery_address: address,
        delivery_phone:   phone,
        notes:            notes || null,
        momo_reference:   momoRef || null,
        payment_proof:    proofUrl || null
      })
    })
    document.querySelector('.modal-overlay')?.remove()
    render(dashWrap('cart',`
    <div style="max-width:500px;margin:80px auto;text-align:center;padding:24px">
      <div style="font-size:64px;margin-bottom:16px">🎉</div>
      <h1 style="font-size:26px;font-weight:800;color:var(--navy);margin-bottom:8px">Order Placed!</h1>
      <p style="font-size:15px;color:var(--g400);margin-bottom:8px">Order #${res.order_id.slice(0,8).toUpperCase()}</p>
      <p style="font-size:14px;color:var(--g400);margin-bottom:24px">Our team will contact you at <strong>${phone}</strong> to confirm delivery details. Payment is due upon delivery.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button type="button" class="btn btn-primary" onclick="navigate('my-orders', null, event)">Track My Order</button>
        <button type="button" class="btn btn-ghost" onclick="this.disabled=true; this.textContent='Loading...'; navigate('shop', null, event)">Continue Shopping</button>
      </div>
    </div>`))
    toast('Order placed successfully! 🎉')
  }catch(e){
    toast(e.message,'err')
    if(btn){ btn.disabled=false; btn.textContent='Place Order →' }
  }
}

// ══════════════════════════════════════════════════
// ORDER TRACKING
// ══════════════════════════════════════════════════
async function renderMyOrders(){
  if(!State.user || !localStorage.getItem('tc_access')){ navigate('shop'); return }
  render(dashWrap('my-orders',`<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const orders = await api('/shop/orders/my')
    const statusColors = {
      pending:    {bg:'#FEF3C7',color:'#92400E'},
      confirmed:  {bg:'#DBEAFE',color:'#1E40AF'},
      processing: {bg:'#EDE9FE',color:'#5B21B6'},
      shipped:    {bg:'#D1FAE5',color:'#065F46'},
      delivered:  {bg:'#D1FAE5',color:'#065F46'},
      cancelled:  {bg:'#FEE2E2',color:'#991B1B'},
    }
    const statusSteps = ['pending','confirmed','processing','shipped','delivered']
    render(dashWrap('my-orders',`
    <div class="page-header">
      <div><h1 class="page-title">📦 My Orders</h1><p class="page-subtitle">${orders.length} order${orders.length!==1?'s':''}</p></div>
      <button class="btn btn-ghost" onclick="navigate('shop')"> Shop More</button>
    </div>
    ${orders.length ? orders.map(o=>{
      const sc = statusColors[o.status] || statusColors.pending
      const stepIdx = statusSteps.indexOf(o.status)
      return `
      <div class="card" style="padding:24px;margin-bottom:16px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
          <div>
            <div style="font-size:13px;color:var(--g400);margin-bottom:2px">Order #${o.id.slice(0,8).toUpperCase()}</div>
            <div style="font-size:15px;font-weight:700;color:var(--navy)">${fmtShort(o.created_at)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <span style="background:${sc.bg};color:${sc.color};font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px">${o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span>
            <span style="font-size:18px;font-weight:800;color:var(--navy)">RWF ${Number(o.total_amount).toLocaleString()}</span>
          </div>
        </div>

        <!-- Progress tracker -->
        ${o.status !== 'cancelled' ? `
        <div style="display:flex;align-items:center;margin-bottom:16px;overflow-x:auto;padding-bottom:4px">
          ${statusSteps.map((step,si)=>`
          <div style="display:flex;align-items:center;flex-shrink:0">
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="width:28px;height:28px;border-radius:50%;background:${si<=stepIdx?'var(--blue)':'var(--g100)'};display:flex;align-items:center;justify-content:center;font-size:13px">
                ${si<stepIdx?'✓':si===stepIdx?'●':'○'}
              </div>
              <div style="font-size:10px;color:${si<=stepIdx?'var(--blue)':'var(--g400)'};font-weight:${si===stepIdx?'700':'400'};white-space:nowrap">${step.charAt(0).toUpperCase()+step.slice(1)}</div>
            </div>
            ${si<statusSteps.length-1?`<div style="width:40px;height:2px;background:${si<stepIdx?'var(--blue)':'var(--g100)'};margin:0 4px;margin-bottom:18px"></div>`:''}
          </div>`).join('')}
        </div>` : ''}

        <!-- Items -->
        <div style="border-top:1px solid var(--g100);padding-top:12px">
          ${(o.order_items||[]).map(item=>`
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0">
            <span style="color:var(--g600)">${item.name} ×${item.quantity}</span>
            <span style="font-weight:600">RWF ${Number(item.price*item.quantity).toLocaleString()}</span>
          </div>`).join('')}
        </div>

        <!-- Delivery info -->
        <div style="background:var(--sky);border-radius:8px;padding:10px;margin-top:12px;font-size:12px;color:var(--g600)">
          📍 ${o.delivery_address} • 📱 ${o.delivery_phone} • 💳 ${o.payment_method.replace(/_/g,' ').toUpperCase()}
        </div>
      </div>`
    }).join('') : `
    <div class="empty-state">
      <div class="empty-icon" style="color:var(--g400)"><i data-lucide="package" style="width:48px;height:48px;stroke-width:1.5"></i></div>
      <div class="empty-title">No orders yet</div>
      <div class="empty-sub">Your orders will appear here</div>
      <button class="btn btn-primary" style="margin-top:16px" onclick="navigate('shop')">Start Shopping</button>
    </div>`}
    `))
  }catch(e){ toast(e.message,'err') }
}

// ══════════════════════════════════════════════════
// ADMIN SHOP MANAGER
// ══════════════════════════════════════════════════
async function renderAdminShop(){
  render(dashWrap('admin-shop',`<div class="loader-center"><div class="spinner"></div></div>`))
  try{
    const tab = State.tab || 'products'
    const [products, orders, bundles, guestOrders] = await Promise.all([
      api('/shop/products?'),
      api('/shop/orders/admin'),
      api('/shop/bundles'),
      api('/shop/guest-orders/admin')
    ])
    const pendingOrders = orders.filter(o=>o.status==='pending').length
    const pendingGuestOrders = guestOrders.filter(o=>o.status==='pending').length
    render(dashWrap('admin-shop',`
    <div class="page-header">
      <div><h1 class="page-title" style="display:flex;align-items:center;gap:8px"><i data-lucide="store" style="width:28px;height:28px;color:var(--blue)"></i> Shop Manager</h1><p class="page-subtitle">${products.length} products • ${orders.length} orders${pendingOrders?' ('+pendingOrders+' pending)':''} • ${guestOrders.length} guest orders${pendingGuestOrders?' ('+pendingGuestOrders+' pending)':''}</p></div>
      ${tab==='products'?`<button class="btn btn-primary" onclick="openAddProductModal()">+ Add Product</button>`:
        tab==='bundles'?`<button class="btn btn-primary" onclick="openAddBundleModal(${JSON.stringify(products).replace(/"/g,'&quot;')})">+ Add Bundle</button>`:''}
    </div>
    <div class="tabs" style="margin-bottom:24px">
      <button class="tab-btn ${tab==='products'?'active':''}" onclick="State.tab='products';renderAdminShop()">Products (${products.length})</button>
      <button class="tab-btn ${tab==='orders'?'active':''}" onclick="State.tab='orders';renderAdminShop()">Orders (${orders.length})${pendingOrders?` <span style="background:#ef4444;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px;margin-left:4px">${pendingOrders}</span>`:''}</button>
      <button class="tab-btn ${tab==='bundles'?'active':''}" onclick="State.tab='bundles';renderAdminShop()">Bundles (${bundles.length})</button>
      <button class="tab-btn ${tab==='guest-orders'?'active':''}" onclick="State.tab='guest-orders';renderAdminShop()">Guest Orders (${guestOrders.length})${pendingGuestOrders?` <span style="background:#ef4444;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px;margin-left:4px">${pendingGuestOrders}</span>`:''}</button>
    </div>

    ${tab==='products'?`
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
      ${products.map(p=>`
      <div class="card" style="padding:0;overflow:hidden">
        <div style="height:140px;background:var(--sky);position:relative;overflow:hidden">
          ${p.image_url?`<img src="${p.image_url}" alt="${p.name||'Product image'}"loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;${!p.is_active?'filter:grayscale(100%) opacity(0.6)':''}"/>`:`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:40px${!p.is_active?';filter:grayscale(100%) opacity(0.6)':''}">${SHOP_CATEGORIES.find(c=>c.id===p.category)?.icon||'🛍️'}</div>`}
          ${p.is_featured?`<div style="position:absolute;top:8px;left:8px;background:var(--gold);color:#1a1a1a;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">⭐ Featured</div>`:''}
          ${!p.is_active?`<div style="position:absolute;top:8px;left:8px;background:#6b7280;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">Inactive</div>`:''}
          <div style="position:absolute;top:8px;right:8px;background:${p.stock>0?'#dcfce7':'#fee2e2'};color:${p.stock>0?'#065f46':'#991b1b'};font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${p.stock>0?'In Stock':'Out of Stock'}</div>
        </div>
        <div style="padding:14px">
          <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:2px${!p.is_active?';opacity:0.6;text-decoration:line-through':''}">${p.name}</div>
          <div style="font-size:12px;color:var(--g400);margin-bottom:8px">${SHOP_CATEGORIES.find(c=>c.id===p.category)?.label||p.category} • Stock: ${p.stock}</div>
          <div style="font-size:16px;font-weight:800;color:var(--navy);margin-bottom:12px${!p.is_active?';opacity:0.6':''}">RWF ${Number(p.price).toLocaleString()}</div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openEditProductModal(${JSON.stringify(p).replace(/"/g,'&quot;')})"><i data-lucide="edit" style="width:14px;height:14px;margin-right:4px"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" style="color:${p.is_active ? 'var(--red)' : 'var(--green)'}" onclick="toggleProductStatus('${p.id}','${(p.name||'').replace(/'/g,"\\'")}', ${p.is_active})"><i data-lucide="${p.is_active ? 'eye-off' : 'eye'}" style="width:16px;height:16px"></i></button>
          </div>
        </div>
      </div>`).join('')}
      ${!products.length?`<div class="empty-state"><div class="empty-sub">No products yet. Add your first product!</div></div>`:''}
    </div>`

    :tab==='orders'?`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${orders.map(o=>`<tr>
            <td style="font-weight:700;font-size:13px">#${o.id.slice(0,8).toUpperCase()}</td>
            <td>
              <div style="font-weight:600">${o.profiles?.full_name||'—'}</div>
              <div style="font-size:11px;color:var(--g400)">${o.delivery_phone}</div>
              ${o.momo_reference?`<div style="font-size:11px;margin-top:3px;background:#f0fdf4;color:#065f46;padding:2px 6px;border-radius:4px;display:inline-block">🧾 ${o.momo_reference}</div>`:''}
              ${o.payment_proof?`<a href="${o.payment_proof}" target="_blank" style="font-size:11px;color:#1A5FFF;display:block;margin-top:2px">📷 View proof</a>`:''}
            </td>
            <td style="font-size:12px">${(o.order_items||[]).length} item${(o.order_items||[]).length!==1?'s':''}</td>
            <td style="font-weight:700">RWF ${Number(o.total_amount).toLocaleString()}</td>
            <td style="font-size:12px">${o.payment_method.replace(/_/g,' ').toUpperCase()}</td>
            <td>${statusBadge(o.status)}</td>
            <td style="font-size:12px">${fmtShort(o.created_at)}</td>
            <td style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <select class="input" style="font-size:12px;padding:4px 8px" onchange="updateOrderStatus('${o.id}',this.value)">
                ${['pending','confirmed','processing','shipped','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
              </select>
              <button class="btn btn-ghost btn-sm" title="Contact buyer"
                onclick='openOrderContactModal({name:${JSON.stringify(o.profiles?.full_name||"—")},phone:${JSON.stringify(o.delivery_phone||"")},email:${JSON.stringify(o.profiles?.email||"")},courseTitle:${JSON.stringify((o.order_items||[]).map(i=>i.name).join(", ")||"Shop Order")},amount:${JSON.stringify(o.total_amount||0)},orderId:"${o.id}",type:"Shop Order"})'>
                📨
              </button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`

    :tab==='bundles'?`
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${bundles.map(b=>`
      <div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);border-radius:16px;padding:20px;color:#fff;position:relative">
        <div style="font-size:16px;font-weight:800;margin-bottom:8px">${b.name}</div>
        <div style="font-size:13px;opacity:0.8;margin-bottom:12px">${b.description||''}</div>
        ${(b.bundle_items||[]).map(i=>`<div style="font-size:12px;opacity:0.9">✓ ${i.products?.name||'Item'}</div>`).join('')}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px">
          <div style="font-size:20px;font-weight:800;color:var(--gold)">RWF ${Number(b.price).toLocaleString()}</div>
          <button class="btn btn-ghost btn-sm" style="color:var(--red);background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2)" onclick="deleteBundle('${b.id}','${(b.name||'').replace(/'/g,"\\'")}')"><i data-lucide="trash-2" style="width:16px;height:16px"></i></button>
        </div>
      </div>`).join('')}
      ${!bundles.length?`<div class="card" style="padding:40px;text-align:center;color:var(--g400)">No bundles yet</div>`:''}
    </div>`
    
    :`
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Type</th><th>Status</th><th>Date</th><th>Contact</th></tr></thead>
        <tbody>
          ${guestOrders.map(o=>`<tr>
            <td data-label="Name">
              <div style="font-weight:600">${o.full_name}</div>
              ${o.momo_reference?`<div style="font-size:11px;margin-top:3px;background:#f0fdf4;color:#065f46;padding:2px 6px;border-radius:4px;display:inline-block">🧾 ${o.momo_reference}</div>`:''}
              ${o.payment_proof?`<a href="${o.payment_proof}" target="_blank" style="font-size:11px;color:#1A5FFF;display:block;margin-top:2px">📷 View proof</a>`:''}
            </td>
            <td data-label="Phone">${o.phone}</td>
            <td data-label="Address" style="font-size:12px">${o.delivery_address}</td>
            <td data-label="Items" style="font-size:12px">${(o.items||[]).map(i=>`${i.name} ×${i.quantity}`).join(', ')}</td>
            <td data-label="Total" style="font-weight:700">RWF ${Number(o.total_amount).toLocaleString()}</td>
            <td data-label="Type">${o.is_wholesale?`<span style="background:#EDE9FE;color:#5B21B6;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:700"><i data-lucide="package" style="width:12px;height:12px;margin-right:4px;vertical-align:middle"></i> Wholesale</span>`:`<span style="background:var(--sky);color:var(--blue);font-size:11px;padding:2px 8px;border-radius:999px">Retail</span>`}</td>
            <td data-label="Status">
              <select class="input" style="font-size:12px;padding:4px 8px" onchange="updateGuestOrderStatus('${o.id}',this.value)">
                ${['pending','confirmed','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
              </select>
            </td>
            <td style="font-size:12px">${fmtShort(o.created_at)}</td>
            <td>
              <button class="btn btn-ghost btn-sm" title="Contact buyer"
                onclick='openOrderContactModal({name:${JSON.stringify(o.full_name||"—")},phone:${JSON.stringify(o.phone||"")},email:${JSON.stringify(o.whatsapp||o.phone||"")},courseTitle:${JSON.stringify((o.items||[]).map(i=>i.name).join(", ")||"Guest Order")},amount:${JSON.stringify(o.total_amount||0)},orderId:"${o.id}",type:"Guest Order"})'>
                📨 Contact
              </button>
            </td>
          </tr>`).join('')}
          ${!guestOrders.length ? `<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--g400)">No guest orders yet</td></tr>` : ''}
        </tbody>
      </table>
    </div>`}
    <div id="modal-root"></div>
    `))
  }catch(e){ toast(e.message,'err') }
}

async function updateGuestOrderStatus(orderId, status){
  try{
    await api(`/shop/guest-orders/admin/${orderId}/status`,{ method:'PATCH', body:JSON.stringify({ status }) })
    toast(`Order updated to ${status} ✅`)
  }catch(e){ toast(e.message,'err') }
}
async function updateOrderStatus(orderId, status){
  try{
    await api(`/shop/orders/admin/${orderId}/status`,{ method:'PATCH', body:JSON.stringify({ status }) })
    toast(`Order updated to ${status} ✅`)
  }catch(e){ toast(e.message,'err') }
}
function toggleWholesaleFields(show){
  const fields = document.getElementById('wholesale-fields')
  if(fields) fields.style.display = show ? 'grid' : 'none'
}
let _extraImages = []
function openAddProductModal(existing=null){
  _extraImages = existing?.extra_images ? [...existing.extra_images] : []
  const isEdit = !!existing
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:540px">
      <div class="modal-header">
        <span class="modal-title">${isEdit?'<i data-lucide="edit" style="width:14px;height:14px;margin-right:4px"></i> Edit Product':'+ Add Product'}</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input class="input" id="prod-name" value="${existing?.name||''}" placeholder="e.g. A4 Notebook"/>
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="input" id="prod-cat">
              ${SHOP_CATEGORIES.filter(c=>c.id!=='all').map(c=>`<option value="${c.id}" ${existing?.category===c.id?'selected':''}>${c.icon} ${c.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Price (RWF) *</label>
            <input class="input" id="prod-price" type="number" min="0" value="${existing?.price||''}" placeholder="e.g. 2500"/>
          </div>
          <div class="form-group">
            <label class="form-label">Stock *</label>
            <input class="input" id="prod-stock" type="number" min="0" value="${existing?.stock||0}" placeholder="e.g. 50"/>
          </div>
        </div>
         <div class="form-group">
          <label class="form-label">Slug (URL)</label>
          <input class="input" id="prod-slug" value="${existing?.slug||''}" placeholder="e.g. math-notebook-a4 (auto-generated if empty)"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">Leave empty to auto-generate from product name. Use only lowercase letters, numbers and hyphens.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Short Tag</label>
          <input class="input" id="prod-tag" value="${existing?.tag||''}" placeholder="e.g. Best Seller, New Arrival"/>
        </div>
        <div class="form-group">
          <label class="form-label">Short Description</label>
          <textarea class="input" id="prod-desc" rows="2" placeholder="Short product description (shown on card)...">${existing?.description||''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Full Description</label>
          <textarea class="input" id="prod-full-desc" rows="4" placeholder="Detailed description shown on product page...">${existing?.full_description||''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Product Image</label>
          <div style="display:flex;gap:10px;align-items:center">
            <input class="input" id="prod-image-url" value="${existing?.image_url||''}" placeholder="Image URL or upload below" style="flex:1"/>
            <input type="file" id="prod-image-file" accept="image/*" style="display:none" onchange="uploadProductImage(this)"/>
            <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('prod-image-file').click()">📷 Upload</button>
          </div>
          <div id="prod-image-preview" style="margin-top:8px">
            ${existing?.image_url?`<img src="${existing.image_url}" alt="Product image preview" loading="lazy" decoding="async" style="height:80px;border-radius:8px;object-fit:cover"/>`:''}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">YouTube Video URL</label>
          <input class="input" id="prod-video-url" value="${existing?.video_url||''}" placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID"/>
          <div style="font-size:11px;color:var(--g400);margin-top:4px">Use the embed URL: youtube.com/embed/VIDEO_ID</div>
        </div>
        <div class="form-group">
          <label class="form-label">Extra Images</label>
          <div id="prod-extra-images-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            ${(existing?.extra_images||[]).map((url,i)=>`
            <div style="position:relative;width:72px;height:72px" id="extra-img-wrap-${i}">
              <img src="${url}"loading="lazy" decoding="async" style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--g200)"/>
              <button type="button" onclick="removeExtraImage('${url}')" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;border:none;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:700">✕</button>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="file" id="prod-extra-image-file" accept="image/*" style="display:none" onchange="uploadExtraImage(this)"/>
            <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('prod-extra-image-file').click()">📷 Add Image</button>
            <span style="font-size:11px;color:var(--g400)" id="extra-upload-status"></span>
          </div>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
            <input type="checkbox" id="prod-featured" ${existing?.is_featured?'checked':''} style="width:16px;height:16px"/>
            ⭐ Mark as Featured Product
          </label>
        </div>
        <div style="border-top:1px solid var(--g100);padding-top:16px;margin-top:8px">
          <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">🏷️ Member Discount</div>
          <div class="form-group">
            <label class="form-label">Member Discount % <span style="color:var(--g400);font-weight:400">(shown to logged-in users)</span></label>
            <input class="input" id="prod-discount-pct" type="number" min="0" max="100" step="0.5" value="${existing?.member_discount_pct ?? 3}" placeholder="e.g. 3"/>
            <div style="font-size:11px;color:var(--g400);margin-top:4px">Set to 0 to disable member discount for this product.</div>
          </div>
        </div>
        <div style="border-top:1px solid var(--g100);padding-top:16px;margin-top:8px">
          <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">📦 Wholesale Settings</div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
              <input type="checkbox" id="prod-wholesale" ${existing?.wholesale_enabled?'checked':''} style="width:16px;height:16px" onchange="toggleWholesaleFields(this.checked)"/>
              Enable wholesale pricing for this product
            </label>
          </div>
          <div id="wholesale-fields" style="display:${existing?.wholesale_enabled?'grid':'none'};grid-template-columns:1fr 1fr 1fr;gap:10px">
            <div class="form-group">
              <label class="form-label">Wholesale Label</label>
              <input class="input" id="prod-wholesale-label" value="${existing?.wholesale_label||'Box'}" placeholder="e.g. Box, Dozen"/>
            </div>
            <div class="form-group">
              <label class="form-label">Min Qty</label>
              <input class="input" type="number" id="prod-wholesale-min" value="${existing?.wholesale_min_qty||6}" min="2" placeholder="6"/>
            </div>
            <div class="form-group">
              <label class="form-label">Wholesale Price (RWF)</label>
              <input class="input" type="number" id="prod-wholesale-price" value="${existing?.wholesale_price||''}" placeholder="Bulk price"/>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="${isEdit?`saveEditProduct('${existing.id}')`:'saveNewProduct()'}">
          ${isEdit?'Save Changes':'Add Product'}
        </button>
      </div>
    </div>
  </div>`
}

function openEditProductModal(p){ openAddProductModal(p) }

async function uploadExtraImage(input){
  const file = input.files[0]
  if(!file) return
  if(file.size > 5*1024*1024){ toast('Image must be under 5MB','err'); return }
  const statusEl = document.getElementById('extra-upload-status')
  if(statusEl) statusEl.textContent = 'Uploading...'
  const form = new FormData()
  form.append('file', file)
  try{
    const res = await fetch(API_URL+'/shop/products/admin/upload-extra-image',{
      method:'POST', headers:{ Authorization:'Bearer '+getToken() }, body:form
    })
    const data = await res.json()
    if(res.ok){
      _extraImages.push(data.url)
      const list = document.getElementById('prod-extra-images-list')
      if(list){
        const wrap = document.createElement('div')
        wrap.style.cssText = 'position:relative;width:72px;height:72px'
        wrap.innerHTML = `<img src="${data.url}"loading="lazy" decoding="async" style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--g200)"/>
          <button type="button" onclick="removeExtraImage('${data.url}')" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;border:none;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:700">✕</button>`
        list.appendChild(wrap)
      }
      if(statusEl) statusEl.textContent = '✅ Added!'
      setTimeout(()=>{ if(statusEl) statusEl.textContent='' }, 2000)
      input.value = ''
      toast('Extra image added ✅')
    } else { toast(data.detail||'Upload failed','err'); if(statusEl) statusEl.textContent='' }
  }catch(e){ toast(e.message,'err'); if(statusEl) statusEl.textContent='' }
}

async function removeExtraImage(url){
  try{
    await api('/shop/products/admin/delete-image',{ method:'DELETE', body:JSON.stringify({ url }) })
    _extraImages = _extraImages.filter(u => u !== url)
    // Remove preview from DOM
    const list = document.getElementById('prod-extra-images-list')
    if(list){
      list.querySelectorAll('img').forEach(img => {
        if(img.src === url) img.closest('div').remove()
      })
    }
    toast('Image removed ✅')
  }catch(e){ toast(e.message,'err') }
}

async function uploadProductImage(input){
  const file = input.files[0]
  if(!file) return
  if(file.size > 5*1024*1024){ toast('Image must be under 5MB','err'); return }
  toast('Uploading...')
  const form = new FormData()
  form.append('file', file)
  try{
    const res = await fetch(API_URL+'/shop/products/admin/upload-image',{
      method:'POST', headers:{ Authorization:'Bearer '+getToken() }, body:form
    })
    const data = await res.json()
    if(res.ok){
      document.getElementById('prod-image-url').value = data.url
      document.getElementById('prod-image-preview').innerHTML = `<img src="${data.url}" alt="Uploaded product image" loading="lazy" decoding="async" style="height:80px;border-radius:8px;object-fit:cover"/>`
      toast('Image uploaded ✅')
    } else { toast(data.detail||'Upload failed','err') }
  }catch(e){ toast(e.message,'err') }
}

async function saveNewProduct(){
  const name      = document.getElementById('prod-name')?.value?.trim()
  const cat       = document.getElementById('prod-cat')?.value
  const price     = parseFloat(document.getElementById('prod-price')?.value)
  const stock     = parseInt(document.getElementById('prod-stock')?.value) || 0
  const tag       = document.getElementById('prod-tag')?.value?.trim() || null
  const desc      = document.getElementById('prod-desc')?.value?.trim() || null
  const fullDesc  = document.getElementById('prod-full-desc')?.value?.trim() || null
  const img       = document.getElementById('prod-image-url')?.value?.trim() || null
  const videoUrl  = document.getElementById('prod-video-url')?.value?.trim() || null
  const feat      = document.getElementById('prod-featured')?.checked || false
  const wholesale       = document.getElementById('prod-wholesale')?.checked || false
  const wholesaleLabel  = document.getElementById('prod-wholesale-label')?.value?.trim() || 'Box'
  const wholesaleMin    = parseInt(document.getElementById('prod-wholesale-min')?.value) || 6
  const wholesalePrice    = parseFloat(document.getElementById('prod-wholesale-price')?.value) || null
  const memberDiscountPct = parseFloat(document.getElementById('prod-discount-pct')?.value) ?? 3
  if(!name || !cat || isNaN(price)){ toast('Name, category and price are required','err'); return }
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
  try{
    await api('/shop/products/admin',{ method:'POST', body:JSON.stringify({
      name, slug, category:cat, price, stock, tag,
      description:desc, full_description:fullDesc,
      image_url:img, extra_images:_extraImages, video_url:videoUrl,
      is_featured:feat, wholesale_enabled:wholesale,
      wholesale_label:wholesaleLabel, wholesale_min_qty:wholesaleMin, wholesale_price:wholesalePrice,
      member_discount_pct: memberDiscountPct
    }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Product added ✅')
    renderAdminShop()
  }catch(e){ toast(e.message,'err') }
}

async function saveEditProduct(id){
  const name      = document.getElementById('prod-name')?.value?.trim()
  const cat       = document.getElementById('prod-cat')?.value
  const price     = parseFloat(document.getElementById('prod-price')?.value)
  const stock     = parseInt(document.getElementById('prod-stock')?.value) || 0
  const tag       = document.getElementById('prod-tag')?.value?.trim() || null
  const desc      = document.getElementById('prod-desc')?.value?.trim() || null
  const fullDesc  = document.getElementById('prod-full-desc')?.value?.trim() || null
  const img       = document.getElementById('prod-image-url')?.value?.trim() || null
  const videoUrl  = document.getElementById('prod-video-url')?.value?.trim() || null
  const feat      = document.getElementById('prod-featured')?.checked || false
  const wholesale       = document.getElementById('prod-wholesale')?.checked || false
  const wholesaleLabel  = document.getElementById('prod-wholesale-label')?.value?.trim() || 'Box'
  const wholesaleMin    = parseInt(document.getElementById('prod-wholesale-min')?.value) || 6
  const wholesalePrice    = parseFloat(document.getElementById('prod-wholesale-price')?.value) || null
  const memberDiscountPct = parseFloat(document.getElementById('prod-discount-pct')?.value) ?? 3
  if(!name || !cat || isNaN(price)){ toast('Name, category and price are required','err'); return }
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-')
  try{
    await api(`/shop/products/admin/${id}`,{ method:'PATCH', body:JSON.stringify({
      name, slug, category:cat, price, stock, tag,
      description:desc, full_description:fullDesc,
      image_url:img, extra_images:_extraImages, video_url:videoUrl,
      is_featured:feat, wholesale_enabled:wholesale,
      wholesale_label:wholesaleLabel, wholesale_min_qty:wholesaleMin, wholesale_price:wholesalePrice,
      member_discount_pct: memberDiscountPct
    }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Product updated ✅')
    renderAdminShop()
  }catch(e){ toast(e.message,'err') }
}

async function toggleProductStatus(id, name, currentlyActive){
  const action = currentlyActive ? 'deactivate' : 'activate';
  if(!confirm(`Are you sure you want to ${action} "${name}"? ${currentlyActive ? 'It will be hidden from the shop.' : 'It will be visible in the shop again.'}`)) return
  try{
    await api(`/shop/products/admin/${id}/toggle-status`,{ method:'PUT' })
    toast(`Product ${action}d`)
    renderAdminShop()
  }catch(e){ toast(e.message,'err') }
}

function openAddBundleModal(products){
  document.getElementById('modal-root').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)this.remove()">
    <div class="modal" style="max-width:540px">
      <div class="modal-header">
        <span class="modal-title">📦 Create Bundle</span>
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Bundle Name *</label>
          <input class="input" id="bundle-name" placeholder="e.g. Exam Preparation Kit"/>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Bundle Price (RWF) *</label>
            <input class="input" id="bundle-price" type="number" min="0" placeholder="e.g. 8500"/>
          </div>
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input class="input" id="bundle-image" placeholder="Optional image URL"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="input" id="bundle-desc" rows="2" placeholder="What's included in this bundle..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Products in Bundle *</label>
          <div style="display:flex;flex-direction:column;gap:8px;max-height:200px;overflow-y:auto" id="bundle-products-list">
            ${products.map(p=>`
            <label style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid var(--g100);border-radius:8px;cursor:pointer">
              <input type="checkbox" class="bundle-prod-check" data-id="${p.id}" style="width:16px;height:16px"/>
              <span style="flex:1;font-size:13px;font-weight:600">${p.name}</span>
              <span style="font-size:12px;color:var(--g400)">RWF ${Number(p.price).toLocaleString()}</span>
            </label>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px">
            <input type="checkbox" id="bundle-featured" style="width:16px;height:16px"/>
            ⭐ Mark as Featured Bundle
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="saveNewBundle()">Create Bundle</button>
      </div>
    </div>
  </div>`
}

async function saveNewBundle(){
  const name  = document.getElementById('bundle-name')?.value?.trim()
  const price = parseFloat(document.getElementById('bundle-price')?.value)
  const desc  = document.getElementById('bundle-desc')?.value?.trim() || null
  const img   = document.getElementById('bundle-image')?.value?.trim() || null
  const feat  = document.getElementById('bundle-featured')?.checked || false
  const checked = [...document.querySelectorAll('.bundle-prod-check:checked')]
  if(!name || isNaN(price)){ toast('Name and price are required','err'); return }
  if(!checked.length){ toast('Select at least one product','err'); return }
  const productIds = checked.map(c=>({ product_id:c.dataset.id, quantity:1 }))
  try{
    await api('/shop/bundles/admin',{ method:'POST', body:JSON.stringify({ name, price, description:desc, image_url:img, is_featured:feat, product_ids:productIds }) })
    document.querySelector('.modal-overlay')?.remove()
    toast('Bundle created ✅')
    renderAdminShop()
  }catch(e){ toast(e.message,'err') }
}

async function deleteBundle(id, name){
  if(!confirm(`Delete bundle "${name}"?`)) return
  try{
    await api(`/shop/bundles/admin/${id}`,{ method:'DELETE' })
    toast('Bundle deleted')
    renderAdminShop()
  }catch(e){ toast(e.message,'err') }
}