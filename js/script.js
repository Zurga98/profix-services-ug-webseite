// ========================================
// SLIDESHOW / DIASHOW
// ========================================
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideCounter = document.getElementById('slideCounter');
const dotsContainer = document.getElementById('slideDots');

// Dots nur erstellen, wenn es Slides gibt
if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slide-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

const dots = document.querySelectorAll('.slide-dot');

function goToSlide(index) {
    if (slides.length === 0) return;
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    if (slideCounter) {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
}

function changeSlide(direction) {
    if (slides.length === 0) return;
    goToSlide(currentSlide + direction);
    resetSlideTimer();
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    if (slides.length > 0) {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }
}

// Touch-Support für Handys
let touchStartX = 0;
let touchEndX = 0;
const wrapper = document.getElementById('slideshowWrapper');

if (wrapper) {
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                changeSlide(1);
            } else {
                changeSlide(-1);
            }
        }
    }, { passive: true });
}

// Tastatur-Steuerung
document.addEventListener('keydown', (e) => {
    const umzugPage = document.getElementById('umzugPage');
    if (umzugPage && !umzugPage.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    }
});

// Slideshow starten
if (slides.length > 0) {
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
}

// ========================================
// COOKIE BANNER
// ========================================
function acceptCookies() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'true');
}

function declineCookies() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
    localStorage.setItem('cookiesDeclined', 'true');
}

// Cookie-Banner prüfen
if (localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesDeclined')) {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
}

// ========================================
// SEITENNAVIGATION
// ========================================
function showPage(page) {
    const landing = document.getElementById('landingPage');
    const umzug = document.getElementById('umzugPage');
    const other = document.getElementById('otherPage');

    if (landing) landing.classList.add('hidden');
    if (umzug) umzug.classList.add('hidden');
    if (other) other.classList.add('hidden');

    if (page === 'home') {
        if (landing) landing.classList.remove('hidden');
    } else if (page === 'umzug') {
        if (umzug) umzug.classList.remove('hidden');
        // Slideshow neu starten wenn sichtbar
        setTimeout(() => {
            resetSlideTimer();
        }, 100);
    } else if (page === 'other') {
        if (other) other.classList.remove('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// PREISRECHNER
// ========================================
function updatePrice() {
    const roomsInput = document.getElementById('rooms');
    const distanceInput = document.getElementById('distance');
    const packagingInput = document.getElementById('packaging');
    const assemblyInput = document.getElementById('assembly');
    const totalElement = document.getElementById('totalPrice');

    if (!roomsInput || !distanceInput || !packagingInput || !assemblyInput || !totalElement) return;

    const rooms = parseInt(roomsInput.value) || 1;
    const distance = parseInt(distanceInput.value) || 10;
    const packaging = parseInt(packagingInput.value) || 0;
    const assembly = parseInt(assemblyInput.value) || 0;

    let basePrice = rooms * 150;
    let distanceCost = distance * 1.5;
    let packagingCost = packaging * 150;
    let assemblyCost = assembly * 120;

    let total = basePrice + distanceCost + packagingCost + assemblyCost;
    
    if (rooms >= 5) total = total * 0.9;
    
    totalElement.textContent = Math.round(total) + ' €';
}

// ========================================
// KONTAKTFORMULAR
// ========================================
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const privacy = document.getElementById('privacy');

    if (!name || !email || !message || !privacy) return;

    const nameVal = name.value.trim();
    const emailVal = email.value.trim();
    const messageVal = message.value.trim();
    const privacyVal = privacy.checked;

    if (!nameVal || !emailVal || !messageVal) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    if (!emailVal.includes('@') || !emailVal.includes('.')) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }

    if (!privacyVal) {
        alert('Bitte stimmen Sie der Datenschutzerklärung zu.');
        return;
    }

    alert('✅ Vielen Dank für Ihre Anfrage, ' + nameVal + '! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.');
    document.getElementById('contactForm').reset();
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Preisrechner initialisieren
    updatePrice();
    
    // Event-Listener für Preisrechner
    const calculatorInputs = document.querySelectorAll('.calculator-item input');
    calculatorInputs.forEach(input => {
        input.addEventListener('input', updatePrice);
    });

    // Touch-Optimierung: 300ms Verzögerung verhindern
    if ('ontouchstart' in window) {
        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('touchstart', function() {
                // passive: true verhindert die 300ms Verzögerung
            }, { passive: true });
        });
    }

    console.log('🚚 ProFix-Service UG - Webseite geladen!');
    console.log('📸 Diashow mit ' + totalSlides + ' Bildern aktiv');
    console.log('📱 Optimiert für Handy, Tablet und Laptop');
});