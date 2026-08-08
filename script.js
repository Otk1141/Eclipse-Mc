/* ============================================================
   COMPLETE JAVASCRIPT
   ============================================================ */

// ============================================================
// PARTICLE SYSTEM
// ============================================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const PARTICLE_COUNT = 120;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.hue = 260 + Math.random() * 40;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        const cx = width/2, cy = height/2;
        const dx = cx - this.x, dy = cy - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 200) {
            this.speedX += dx / dist * 0.005;
            this.speedY += dy / dist * 0.005;
        }
        const maxSpeed = 0.8;
        const spd = Math.sqrt(this.speedX*this.speedX + this.speedY*this.speedY);
        if (spd > maxSpeed) {
            this.speedX = (this.speedX / spd) * maxSpeed;
            this.speedY = (this.speedY / spd) * maxSpeed;
        }
        this.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(Date.now() / 3000 + this.x));
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, 0.3)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) { p.update(); p.draw(); }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(150, 100, 255, ${0.08 * (1 - dist/150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ============================================================
// RANK BENEFITS DATA
// ============================================================
const rankBenefits = {
    'Knight': {
        perks: ['5x Homes', 'Kit Knight'],
        commands: ['/Nick', '/Back', '/Recipe', '/Feed', '/Disposal']
    },
    'Lord': {
        perks: ['10x Homes', 'Kit Lord'],
        commands: ['/Nick', '/Back', '/Recipe', '/Feed', '/Disposal', '/Near', '/Craft']
    },
    'Paladin': {
        perks: ['Unlimited Homes', 'Kit Paladin'],
        commands: ['/Nick', '/Back', '/Recipe', '/Feed', '/Disposal', '/Near', '/Craft', '/Enderchest', '/Ftime']
    },
    'Duke': {
        perks: ['Unlimited Homes', 'Kit Duke', 'Fly'],
        commands: ['/Nick', '/Back', '/Recipe', '/Feed', '/Disposal', '/Near', '/Craft', '/Enderchest', '/Time', '/Heal', '/Fly']
    },
    'King': {
        perks: ['Unlimited Homes', 'Kit King', 'Fly', 'Heal'],
        commands: ['/Nick', '/Back', '/Recipe', '/Feed', '/Disposal', '/Near', '/Craft', '/Enderchest', '/Fime', '/Heal', '/Fly', '/Fweather', '/Repair']
    },
    'Member': { perks: ['Wooden Kit', 'Iron Armor'], commands: [] },
    'VIP': { perks: ['Iron Armor Prot II', '24 Carrots'], commands: [] },
    'Terra': { perks: ['Iron Prot III', 'Mending', '32 Carrots'], commands: [] },
    'Nova': { perks: ['Diamond Prot III', '46 Carrots', '12 Golden Apples'], commands: [] },
    'Nebula': { perks: ['Diamond Prot IV', '64 Carrots', '16 Golden Apples'], commands: [] },
    'MVP': { perks: ['All VIP Perks', 'Priority Support', 'Party 50'], commands: [] }
};

// ============================================================
// PROMO CODES
// ============================================================
const VALID_PROMOS = ['XBR', 'DEY', 'ACR', 'OTK'];
const DISCOUNT_RATE = 0.30; // 30%
let activePromo = null;
let promoDiscount = 0;

function applyPromoCode() {
    const input = document.getElementById('promoCodeInput');
    const code = input.value.trim().toUpperCase();
    const msgEl = document.getElementById('promoMessage');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');

    // Check if any lifetime items are in cart
    const hasLifetime = cart.some(item => item.plan === 'Lifetime');
    if (!hasLifetime) {
        msgEl.textContent = '⚠️ Promo codes work only on Lifetime ranks!';
        msgEl.style.color = '#fbbf24';
        return;
    }

    if (VALID_PROMOS.includes(code)) {
        activePromo = code;
        promoDiscount = DISCOUNT_RATE;
        msgEl.textContent = `✅ Promo code "${code}" applied! 30% off Lifetime ranks.`;
        msgEl.style.color = '#4ade80';
        discountRow.style.display = 'flex';
        // Calculate discount on lifetime items
        const lifetimeTotal = cart
            .filter(item => item.plan === 'Lifetime')
            .reduce((sum, item) => sum + item.price, 0);
        const discountAmt = lifetimeTotal * DISCOUNT_RATE;
        discountAmountEl.textContent = '-$' + discountAmt.toFixed(2);
        updateCartUI();
    } else if (code === '') {
        msgEl.textContent = '';
        discountRow.style.display = 'none';
        activePromo = null;
        promoDiscount = 0;
        updateCartUI();
    } else {
        msgEl.textContent = '❌ Invalid promo code. Try XBR, DEY, ACR, or OTK.';
        msgEl.style.color = '#ff6b6b';
        activePromo = null;
        promoDiscount = 0;
        discountRow.style.display = 'none';
        updateCartUI();
    }
}

// ============================================================
// GOOGLE SIGN-IN (Real OAuth 2.0)
// ============================================================
let googleUser = null;

function handleGoogleLogin(response) {
    // Decode the JWT token to get user info
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        googleUser = {
            name: payload.name,
            email: payload.email,
            avatar: payload.picture,
            sub: payload.sub
        };
        // Show username input
        document.getElementById('usernameSection').style.display = 'block';
        document.getElementById('loginSubText').textContent = '✅ Signed in as ' + googleUser.name + '. Enter your Minecraft username:';
        document.getElementById('loginSubText').style.color = '#4ade80';
        // Pre-fill with email username part
        const mcName = googleUser.name.split(' ')[0].toLowerCase();
        document.getElementById('minecraftUsername').value = mcName;
    } catch (e) {
        showToast('Google login error. Please try again.', true);
    }
}

function saveUsername() {
    const mcName = document.getElementById('minecraftUsername').value.trim();
    if (!mcName || mcName.length < 3 || mcName.length > 16) {
        showToast('Please enter a valid Minecraft username (3-16 characters).', true);
        return;
    }
    if (!googleUser) {
        showToast('Please sign in with Google first.', true);
        return;
    }
    const userData = {
        ...googleUser,
        mcUsername: mcName
    };
    localStorage.setItem('otk1_user', JSON.stringify(userData));
    updateUserUI(userData);
    closeLoginModal();
    showToast(`✅ Welcome, ${mcName}!`);
}

function updateUserUI(user) {
    document.getElementById('loginBtn').style.display = 'none';
    const compact = document.getElementById('userProfileCompact');
    compact.style.display = 'flex';
    document.getElementById('userAvatarCompact').src = user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=7b2ffc&color=fff&size=64';
    document.getElementById('userNameCompact').textContent = user.name;
    document.getElementById('userMcNameCompact').textContent = '@' + user.mcUsername;
}

function logout() {
    localStorage.removeItem('otk1_user');
    // Also sign out from Google
    if (window.google && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
    googleUser = null;
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('userProfileCompact').style.display = 'none';
    showToast('Logged out successfully.');
}

// ============================================================
// CART SYSTEM (with promo support)
// ============================================================
let cart = [];
let appliedPromo = null;

function addToCart(rankName, rankIcon, planName, price) {
    const item = {
        id: rankName + '-' + planName,
        name: rankName,
        icon: rankIcon,
        plan: planName,
        price: price,
        originalPrice: price
    };
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        showToast(`${rankName} (${planName}) is already in your cart!`, true);
        return;
    }
    cart.push(item);
    // If promo is active, recalculate discounts
    if (activePromo) {
        applyPromoCode();
    }
    updateCartUI();
    showToast(`✅ ${rankName} (${planName}) added to cart!`);
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    if (activePromo) {
        // Re-check if any lifetime items remain
        const hasLifetime = cart.some(item => item.plan === 'Lifetime');
        if (!hasLifetime) {
            activePromo = null;
            promoDiscount = 0;
            document.getElementById('discountRow').style.display = 'none';
            document.getElementById('promoMessage').textContent = '';
        } else {
            applyPromoCode();
        }
    }
    updateCartUI();
    showToast('Item removed from cart');
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cartItems');
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');

    const count = cart.length;
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p data-en="Your cart is empty" data-ar="سلة المشتريات فارغة"></p>
                    <span class="sub" data-en="Browse ranks and add items to get started" data-ar="تصفح الرتب وأضف العناصر للبدء"></span>
                </div>
            `;
        const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'ar';
        document.querySelectorAll('#cartItems [data-en][data-ar]').forEach(el => {
            el.textContent = el.getAttribute('data-' + currentLang);
        });
        checkoutBtn.disabled = true;
        totalEl.textContent = '$0.00';
        discountRow.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;
    let lifetimeTotal = 0;

    cart.forEach(item => {
        // Apply discount to lifetime items if promo is active
        let displayPrice = item.price;
        if (activePromo && item.plan === 'Lifetime') {
            displayPrice = item.price * (1 - DISCOUNT_RATE);
            lifetimeTotal += item.price;
        }
        total += displayPrice;

        const priceDisplay = activePromo && item.plan === 'Lifetime'
            ? `<span style="text-decoration:line-through; color:#6a5a80; font-size:13px; margin-right:6px;">$${item.price}</span> $${displayPrice.toFixed(2)}`
            : `$${item.price}`;

        html += `
                <div class="cart-item">
                    <span class="item-icon">${item.icon}</span>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-plan"><span data-en="Plan" data-ar="الخطة"></span>: ${item.plan}</div>
                    </div>
                    <div class="item-price">${priceDisplay}</div>
                    <button class="item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-times"></i></button>
                </div>
            `;
    });

    // Show discount row if promo is active and there are lifetime items
    if (activePromo && lifetimeTotal > 0) {
        const discountAmt = lifetimeTotal * DISCOUNT_RATE;
        discountRow.style.display = 'flex';
        discountAmountEl.textContent = '-$' + discountAmt.toFixed(2);
    } else {
        discountRow.style.display = 'none';
    }

    itemsContainer.innerHTML = html;
    totalEl.textContent = '$' + total.toFixed(2);
    checkoutBtn.disabled = false;

    const lang = document.body.classList.contains('lang-en') ? 'en' : 'ar';
    document.querySelectorAll('#cartItems [data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });
}

function toggleCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    panel.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
}

function openCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    panel.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    panel.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', true);
        return;
    }
    let total = cart.reduce((sum, item) => {
        let price = item.price;
        if (activePromo && item.plan === 'Lifetime') {
            price = price * (1 - DISCOUNT_RATE);
        }
        return sum + price;
    }, 0);
    const itemNames = cart.map(i => i.name + ' (' + i.plan + ')').join(', ');
    showToast(`🛒 Checkout complete! Total: $${total.toFixed(2)} for ${itemNames}`);
    cart = [];
    activePromo = null;
    promoDiscount = 0;
    document.getElementById('promoCodeInput').value = '';
    document.getElementById('promoMessage').textContent = '';
    document.getElementById('discountRow').style.display = 'none';
    updateCartUI();
    closeCart();
}

// ============================================================
// PAGE LOAD, SCROLL, LANGUAGE
// ============================================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    const user = JSON.parse(localStorage.getItem('otk1_user'));
    if (user) {
        updateUserUI(user);
        googleUser = user;
    }
    // Initialize Google Sign-In
    if (window.google && google.accounts) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleLogin,
            cancel_on_tap_outside: false,
            auto_select: false
        });
        google.accounts.id.renderButton(
            document.querySelector('.g_id_signin'),
            { type: 'standard', size: 'large', theme: 'outline', text: 'sign_in_with', shape: 'rectangular' }
        );
    }
});

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
});

function setLanguage(lang) {
    const body = document.body;
    const btnEn = document.getElementById('btnEn');
    const btnAr = document.getElementById('btnAr');

    body.classList.remove('lang-en', 'lang-ar');
    body.classList.add('lang-' + lang);
    body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    btnEn.classList.toggle('active', lang === 'en');
    btnAr.classList.toggle('active', lang === 'ar');

    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null) el.textContent = text;
    });

    document.querySelectorAll('#cartItems [data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });

    document.querySelectorAll('#benefitsModal [data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });

    localStorage.setItem('otk1-lang', lang);
}

// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('tab-' + tabId).classList.add('active');
        document.querySelector('.tabs-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================================
// FAQ
// ============================================================
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!isOpen) {
        item.classList.add('open');
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    toastMsg.textContent = message;
    if (isError) {
        icon.className = 'fas fa-exclamation-circle';
        toast.classList.add('error');
    } else {
        icon.className = 'fas fa-check-circle';
        toast.classList.remove('error');
    }
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// LOGIN MODAL
// ============================================================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset username section if not logged in
    const user = JSON.parse(localStorage.getItem('otk1_user'));
    if (!user) {
        document.getElementById('usernameSection').style.display = 'none';
        document.getElementById('loginSubText').textContent = 'Sign in with Google and set your Minecraft username.';
        document.getElementById('loginSubText').style.color = '#b99ad6';
    }
}
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// PRICE MODAL
// ============================================================
let selectedPlan = null;
let currentRank = { name: '', icon: '', prefix: '' };

function openPriceModal(rankName, rankIcon, rankPrefix) {
    currentRank = { name: rankName, icon: rankIcon, prefix: rankPrefix };
    selectedPlan = null;

    document.getElementById('modalRankIcon').textContent = rankIcon;
    document.getElementById('modalRankName').textContent = rankName;
    document.getElementById('modalRankPrefix').textContent = rankPrefix;

    const isMember = rankName.toLowerCase() === 'member';
    document.getElementById('modalOptions').style.display = isMember ? 'none' : 'grid';
    document.getElementById('modalFreeOption').style.display = isMember ? 'grid' : 'none';

    const sub = document.getElementById('modalSub');
    if (isMember) {
        sub.setAttribute('data-en', 'This rank is free – claim it now!');
        sub.setAttribute('data-ar', 'هذه الرتبة مجانية – احصل عليها الآن!');
    } else {
        sub.setAttribute('data-en', 'Choose your pricing plan for this rank.');
        sub.setAttribute('data-ar', 'اختر خطة السعر لهذه الرتبة.');
    }
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'ar';
    sub.textContent = sub.getAttribute('data-' + currentLang);

    // Reset lifetime price display
    document.getElementById('lifetimePrice').innerHTML = '$120 <small>/life</small>';

    document.querySelectorAll('.modal-option').forEach(el => el.classList.remove('selected'));
    document.getElementById('modalConfirmBtn').disabled = true;
    document.getElementById('priceModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePriceModal() {
    document.getElementById('priceModal').classList.remove('active');
    document.body.style.overflow = '';
    selectedPlan = null;
}

function selectPlan(element) {
    if (element.classList.contains('coming-opt')) return;
    document.querySelectorAll('.modal-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.modal-option .opt-check').forEach(el => el.style.opacity = '0');

    element.classList.add('selected');
    const check = element.querySelector('.opt-check');
    if (check) check.style.opacity = '1';

    selectedPlan = element.dataset.plan;
    document.getElementById('modalConfirmBtn').disabled = false;
}

function confirmPlan() {
    if (!selectedPlan) return;
    const rankName = currentRank.name;
    const isMember = rankName.toLowerCase() === 'member';

    if (isMember) {
        showToast(`🎉 ${rankName} rank claimed for free!`);
        closePriceModal();
        return;
    }

    const planNames = { weekly: 'Weekly', monthly: 'Monthly', '3months': '3 Months', lifetime: 'Lifetime' };
    const planPrices = { weekly: 5, monthly: 20, '3months': 60, lifetime: 120 };

    const planName = planNames[selectedPlan] || selectedPlan;
    let price = planPrices[selectedPlan] || 0;

    // If lifetime and promo is active, apply discount at checkout time
    // We'll apply it in the cart when promo is active

    addToCart(rankName, currentRank.icon, planName, price);
    closePriceModal();
}

// ============================================================
// RANK CARD CLICKS
// ============================================================
document.querySelectorAll('#tab-ranks .rank-mini:not(.coming-soon-rank)').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.dataset.rankName;
        const icon = this.dataset.rankIcon;
        const prefix = this.dataset.rankPrefix;
        if (name) openBenefitsModal(name, icon, prefix);
    });
});
document.querySelectorAll('#tab-ranks .rank-mini.coming-soon-rank').forEach(card => {
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        showToast('🔜 This rank is coming soon! Stay tuned.', true);
    });
});

// ============================================================
// STORE CARD CLICKS
// ============================================================
document.querySelectorAll('#tab-store .store-tab-item:not(.coming-store)').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.dataset.rankName;
        const icon = this.dataset.rankIcon;
        const prefix = this.dataset.rankPrefix;
        if (name) openPriceModal(name, icon, prefix);
    });
});
document.querySelectorAll('#tab-store .store-tab-item.coming-store').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        showToast('🔜 This item is coming soon! Stay tuned.', true);
    });
});

// ============================================================
// BENEFITS MODAL
// ============================================================
function openBenefitsModal(rankName, rankIcon, rankPrefix) {
    const data = rankBenefits[rankName];
    if (!data) { showToast('Rank details coming soon!', true); return; }
    document.getElementById('benefitsRankIcon').textContent = rankIcon;
    document.getElementById('benefitsRankName').textContent = rankName;
    document.getElementById('benefitsRankPrefix').textContent = rankPrefix;

    const perksList = document.getElementById('benefitsPerksList');
    perksList.innerHTML = '';
    data.perks.forEach(perk => {
        const span = document.createElement('span');
        span.className = 'benefit-item';
        span.innerHTML = `<i class="fas fa-star"></i> ${perk}`;
        perksList.appendChild(span);
    });

    const commandsList = document.getElementById('benefitsCommandsList');
    commandsList.innerHTML = '';
    if (data.commands.length === 0) {
        const span = document.createElement('span');
        span.className = 'cmd-item';
        span.style.color = '#9880b8';
        span.textContent = 'No special commands';
        commandsList.appendChild(span);
    } else {
        data.commands.forEach(cmd => {
            const span = document.createElement('span');
            span.className = 'cmd-item';
            span.innerHTML = `<i class="fas fa-terminal"></i> ${cmd}`;
            commandsList.appendChild(span);
        });
    }

    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'ar';
    document.querySelectorAll('#benefitsModal [data-en][data-ar]').forEach(el => {
        el.textContent = el.getAttribute('data-' + currentLang);
    });

    document.getElementById('benefitsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeBenefitsModal() {
    document.getElementById('benefitsModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// CLOSE MODALS
// ============================================================
document.getElementById('priceModal').addEventListener('click', function(e) { if (e.target === this) closePriceModal(); });
document.getElementById('benefitsModal').addEventListener('click', function(e) { if (e.target === this) closeBenefitsModal(); });
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePriceModal();
        closeBenefitsModal();
        closeCart();
        closeLoginModal();
    }
});

// ============================================================
// SUPPORT FORM
// ============================================================
function handleSupport(e) {
    e.preventDefault();
    const name = document.getElementById('supportName').value;
    const email = document.getElementById('supportEmail').value;
    const message = document.getElementById('supportMessage').value;
    if (!name || !email || !message) { showToast('Please fill in all fields.', true); return false; }
    showToast('✅ Ticket sent! We\'ll respond within 24 hours.');
    document.getElementById('supportForm').reset();
    return false;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('otk1-lang') || 'en';
    setLanguage(savedLang);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });

    setTimeout(() => {
        document.querySelectorAll('.home-card, .rank-mini, .store-tab-item, .rules-card, .pricing-card, .why-item')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
    }, 300);

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        });
    });

    document.getElementById('cartOverlay').addEventListener('click', closeCart);

    // Promo code input enter key
    document.getElementById('promoCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });

    console.log('🚀 Otk1 Network — Google Sign-In + Promo Codes (XBR, DEY, ACR, OTK)');
});
