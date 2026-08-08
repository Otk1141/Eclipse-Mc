/* ============================================================
   COMPLETE JAVASCRIPT
   ============================================================ */

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
    }
};

// ============================================================
// BENEFITS MODAL
// ============================================================
function openBenefitsModal(rankName, rankIcon, rankPrefix) {
    const data = rankBenefits[rankName];
    if (!data) {
        showToast('Rank details coming soon!', true);
        return;
    }

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
// CART SYSTEM
// ============================================================
let cart = [];

function addToCart(rankName, rankIcon, planName, price) {
    const item = {
        id: rankName + '-' + planName,
        name: rankName,
        icon: rankIcon,
        plan: planName,
        price: price
    };

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        showToast(`${rankName} (${planName}) is already in your cart!`, true);
        return;
    }

    cart.push(item);
    updateCartUI();
    showToast(`✅ ${rankName} (${planName}) added to cart!`);
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    showToast('Item removed from cart');
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cartItems');
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

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
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        html += `
                <div class="cart-item">
                    <span class="item-icon">${item.icon}</span>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-plan"><span data-en="Plan" data-ar="الخطة"></span>: ${item.plan}</div>
                    </div>
                    <div class="item-price">$${item.price}</div>
                    <button class="item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-times"></i></button>
                </div>
            `;
    });

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
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemNames = cart.map(i => i.name + ' (' + i.plan + ')').join(', ');
    showToast(`🛒 Checkout complete! Total: $${total.toFixed(2)} for ${itemNames}`);
    cart = [];
    updateCartUI();
    closeCart();
}

// ============================================================
// PAGE LOAD
// ============================================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ============================================================
// SCROLL PROGRESS & BACK TO TOP
// ============================================================
window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

// ============================================================
// LANGUAGE TOGGLE
// ============================================================
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

    const isUser = rankName.toLowerCase() === 'user';
    document.getElementById('modalOptions').style.display = isUser ? 'none' : 'grid';
    document.getElementById('modalFreeOption').style.display = isUser ? 'grid' : 'none';

    const sub = document.getElementById('modalSub');
    if (isUser) {
        sub.setAttribute('data-en', 'This rank is free – claim it now!');
        sub.setAttribute('data-ar', 'هذه الرتبة مجانية – احصل عليها الآن!');
    } else {
        sub.setAttribute('data-en', 'Choose your pricing plan for this rank.');
        sub.setAttribute('data-ar', 'اختر خطة السعر لهذه الرتبة.');
    }
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'ar';
    sub.textContent = sub.getAttribute('data-' + currentLang);

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
    const isUser = rankName.toLowerCase() === 'user';

    if (isUser) {
        showToast(`🎉 ${rankName} rank claimed for free!`);
        closePriceModal();
        return;
    }

    const planNames = { weekly: 'Weekly', monthly: 'Monthly', '3months': '3 Months', lifetime: 'Lifetime' };
    const planPrices = { weekly: 5, monthly: 20, '3months': 60, lifetime: 120 };

    const planName = planNames[selectedPlan] || selectedPlan;
    const price = planPrices[selectedPlan] || 0;

    addToCart(rankName, currentRank.icon, planName, price);
    closePriceModal();
}

// ============================================================
// RANK CARD CLICKS (Ranks Tab → Benefits)
// ============================================================
document.querySelectorAll('#tab-ranks .rank-mini:not(.coming-soon-rank)').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.dataset.rankName;
        const icon = this.dataset.rankIcon;
        const prefix = this.dataset.rankPrefix;
        if (name) openBenefitsModal(name, icon, prefix);
    });
});

// Coming soon ranks show a toast instead
document.querySelectorAll('#tab-ranks .rank-mini.coming-soon-rank').forEach(card => {
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        showToast('🔜 This rank is coming soon! Stay tuned.', true);
    });
});

// ============================================================
// STORE CARD CLICKS (Store Tab → Price Modal)
// ============================================================
document.querySelectorAll('#tab-store .store-tab-item:not(.coming-store)').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.dataset.rankName;
        const icon = this.dataset.rankIcon;
        const prefix = this.dataset.rankPrefix;
        if (name) openPriceModal(name, icon, prefix);
    });
});

// Coming soon store items show a toast
document.querySelectorAll('#tab-store .store-tab-item.coming-store').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        showToast('🔜 This item is coming soon! Stay tuned.', true);
    });
});

// Close modals on overlay click or Escape
document.getElementById('priceModal').addEventListener('click', function(e) {
    if (e.target === this) closePriceModal();
});
document.getElementById('benefitsModal').addEventListener('click', function(e) {
    if (e.target === this) closeBenefitsModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePriceModal();
        closeBenefitsModal();
        closeCart();
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
    if (!name || !email || !message) {
        showToast('Please fill in all fields.', true);
        return false;
    }
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

    console.log('🚀 Otk1 Network — Fully functional with "Coming Soon" for BoxPvP & Practice!');
});
