/* ============================================================
   COMPLETE JAVASCRIPT (with particles and Google login)
   ============================================================ */

// ============================================================
// PARTICLE SYSTEM (canvas)
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
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.hue = 260 + Math.random() * 40; // purple to blue
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        // gently pull toward center for a nebula effect
        const cx = width/2, cy = height/2;
        const dx = cx - this.x, dy = cy - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 200) {
            this.speedX += dx / dist * 0.005;
            this.speedY += dy / dist * 0.005;
        }
        // limit speed
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
        // glow
        ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, 0.3)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Create particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
        p.update();
        p.draw();
    }
    // draw connecting lines (subtle)
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
// RANK BENEFITS DATA (updated: Member rank added)
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
    'Member': {
        perks: ['Wooden Kit', 'Iron Armor'],
        commands: []
    },
    'VIP': {
        perks: ['Iron Armor Prot II', '24 Carrots'],
        commands: []
    },
    'Terra': {
        perks: ['Iron Prot III', 'Mending', '32 Carrots'],
        commands: []
    },
    'Nova': {
        perks: ['Diamond Prot III', '46 Carrots', '12 Golden Apples'],
        commands: []
    },
    'Nebula': {
        perks: ['Diamond Prot IV', '64 Carrots', '16 Golden Apples'],
        commands: []
    },
    'MVP': {
        perks: ['All VIP Perks', 'Priority Support', 'Party 50'],
        commands: []
    }
};

// ============================================================
// BENEFITS MODAL (unchanged)
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
// CART SYSTEM (unchanged)
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
// PAGE LOAD, SCROLL, LANGUAGE (unchanged)
// ============================================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    // Check if user is already logged in (simulated)
    const user = JSON.parse(localStorage.getItem('otk1_user'));
    if (user) {
        updateUserUI(user);
    }
});

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
// TABS (unchanged)
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
// FAQ (unchanged)
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
// TOAST (unchanged)
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
// PRICE MODAL (unchanged)
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
    const price = planPrices[selectedPlan] || 0;

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

// Close modals
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
        closeLoginModal();
    }
});

// ============================================================
// SUPPORT FORM (unchanged)
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
// GOOGLE LOGIN (simulated)
// ============================================================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = '';
}

function googleLogin() {
    // Simulate Google OAuth – generate fake user
    const user = {
        name: 'Alex',
        email: 'alex@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Alex&background=7b2ffc&color=fff&size=64'
    };
    localStorage.setItem('otk1_user', JSON.stringify(user));
    updateUserUI(user);
    closeLoginModal();
    showToast(`✅ Welcome, ${user.name}!`);
}

function updateUserUI(user) {
    document.getElementById('loginBtn').style.display = 'none';
    const compact = document.getElementById('userProfileCompact');
    compact.style.display = 'flex';
    document.getElementById('userAvatarCompact').src = user.avatar;
    document.getElementById('userNameCompact').textContent = user.name;
}

function logout() {
    localStorage.removeItem('otk1_user');
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('userProfileCompact').style.display = 'none';
    showToast('Logged out successfully.');
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

    console.log('🚀 Otk1 Network — Enhanced with Particles & Google Login!');
});
