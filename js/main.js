const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const alertBox = document.getElementById('form-alert');

/* ═══════════════════════════════════════════════════════════
   Micro-interactions (progress, back-to-top, spotlight)
   ═══════════════════════════════════════════════════════════ */
;(function initMicro() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  const updateScrollUI = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;

    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 600);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  if (reducedMotion) return;

  // Spotlight tracking
  const spotlightTargets = [
    ...document.querySelectorAll('.feature-card, .testimonial-card, .step-item, .store-btn-primary, .store-btn-outline, a.btn-shine'),
  ];
  const darkTargets = [...document.querySelectorAll('.use-case-card')];

  spotlightTargets.forEach(el => el.classList.add('spotlight'));
  darkTargets.forEach(el => el.classList.add('spotlight', 'spotlight--dark'));

  let rafId = null;
  let lastEvent = null;

  const applyVars = () => {
    rafId = null;
    if (!lastEvent) return;

    const { target, clientX, clientY } = lastEvent;
    const el = target.closest('.spotlight');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--x', `${x}%`);
    el.style.setProperty('--y', `${y}%`);
  };

  const onMove = (e) => {
    lastEvent = e;
    if (rafId) return;
    rafId = window.requestAnimationFrame(applyVars);
  };

  document.addEventListener('pointermove', onMove, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   Interactive Steps — How It Works
   ═══════════════════════════════════════════════════════════ */
;(function initSteps() {
    const stepItems = document.querySelectorAll('.step-item');
    const stepImages = document.querySelectorAll('.steps-img');
  const stepsList = document.getElementById('steps-list');
    if (!stepItems.length || !stepImages.length) return;

    let activeStep = 0;
    let autoTimer = null;
    const AUTO_DELAY = 4000;             // ms between auto-switches
    const PAUSE_AFTER_CLICK = 8000;      // ms pause after user clicks

    function setActive(index) {
        // Guard
        if (index === activeStep) return;
        activeStep = index;

        // Steps
        stepItems.forEach((item, i) => {
            item.classList.toggle('step-item--active', i === index);
        });

        // Images — crossfade
        stepImages.forEach((img, i) => {
            img.classList.toggle('steps-img--active', i === index);
        });
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            setActive((activeStep + 1) % stepItems.length);
        }, AUTO_DELAY);
    }

    function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    // Click / touch handler (locks the step for a bit)
    stepItems.forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.step, 10);
        setActive(idx);
        stopAuto();
        // Restart auto after user pause
        setTimeout(startAuto, PAUSE_AFTER_CLICK);
      });
    });

    // Desktop UX: pause while hovering the steps list
    if (stepsList && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      stepsList.addEventListener('mouseenter', stopAuto);
      stepsList.addEventListener('mouseleave', startAuto);

      // Hover-preview on items (subtle, minimal)
      stepItems.forEach((item) => {
        item.addEventListener('pointerenter', () => {
          const idx = parseInt(item.dataset.step, 10);
          setActive(idx);
        });
      });
    }

    // Intersection Observer — only auto-cycle when section is visible
    const section = document.getElementById('how-it-works');
    if (section && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { startAuto(); }
                else { stopAuto(); }
            });
        }, { threshold: 0.3 });
        observer.observe(section);
    } else {
        startAuto();
    }
})();

/* ═══════════════════════════════════════════════════════════
   Nav elevation on scroll
   ═══════════════════════════════════════════════════════════ */
;(function initNav() {
  const nav = document.querySelector('nav.glass-nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   Scroll Reveal — auto-applies .rv to every section
   ═══════════════════════════════════════════════════════════ */
;(function initReveal() {
  if (!('IntersectionObserver' in window)) return;           // graceful fallback
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Helper: tag an element */
  const tag = (el, variant, delay) => {
    el.classList.add('rv');
    if (variant) el.classList.add(variant);
    if (delay)   el.classList.add(delay);
  };

  /* ── Features section ─────────────────────────────────── */
  const featHead = document.querySelector('#features .text-center');
  if (featHead) tag(featHead);

  document.querySelectorAll('.feature-card').forEach((c, i) => {
    tag(c, null, 'rv-d' + (i + 1));
  });

  /* ── How It Works ─────────────────────────────────────── */
  const howHead = document.querySelector('#how-it-works .text-center');
  if (howHead) tag(howHead);

  const showcase = document.querySelector('.steps-showcase-bg');
  if (showcase && showcase.parentElement) tag(showcase.parentElement, 'rv--left');

  const stepsList = document.getElementById('steps-list');
  if (stepsList && stepsList.parentElement) tag(stepsList.parentElement, 'rv--right', 'rv-d2');

  /* ── Use Cases ────────────────────────────────────────── */
  const ucHead = document.querySelector('#use-cases .text-center');
  if (ucHead) tag(ucHead);

  document.querySelectorAll('.use-case-card').forEach((c, i) => {
    tag(c, null, 'rv-d' + (i + 1));
  });

  /* ── Testimonials ────────────────────────────────────── */
  const testHead = document.querySelector('#testimonials .text-center');
  if (testHead) tag(testHead);

  document.querySelectorAll('.testimonial-card').forEach((c, i) => {
    tag(c, null, 'rv-d' + (i + 1));
  });

  /* ── Contact ─────────────────────────────────────────── */
  const contactLeft = document.querySelector('#contact .grid > div:first-child');
  if (contactLeft) tag(contactLeft, 'rv--left');

  const contactForm = document.querySelector('#contact form');
  if (contactForm && contactForm.parentElement) tag(contactForm.parentElement, 'rv--right', 'rv-d2');

  /* ── Footer / Download CTA ───────────────────────────── */
  const dlText = document.querySelector('#download .max-w-lg');
  if (dlText) tag(dlText, 'rv--left');

  const dlPhone = document.querySelector('#download .relative.group');
  if (dlPhone) tag(dlPhone, 'rv--scale', 'rv-d2');

  /* ── Observe everything ──────────────────────────────── */
  const allRv = document.querySelectorAll('.rv');
  if (!allRv.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('rv--visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  allRv.forEach(el => io.observe(el));
})();


const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwvKKR6TOkOARb1SPmFBOc9ymzIHgLoKPxmASzAkonEYuoCMzGfnmvpgu24lWJW6LV/exec';

if (!form || !submitBtn || !alertBox) {
  console.warn('Contact form elements not found.');
} else {
  let hideAlertTimeoutId = null;

  const showAlert = (message, variant) => {
    if (hideAlertTimeoutId) {
      window.clearTimeout(hideAlertTimeoutId);
      hideAlertTimeoutId = null;
    }

    alertBox.textContent = message;
    alertBox.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');

    if (variant === 'success') {
      alertBox.classList.add('bg-green-100', 'text-green-700');
    } else {
      alertBox.classList.add('bg-red-100', 'text-red-700');
    }

    hideAlertTimeoutId = window.setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 5000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Отправка...';

    try {
      const requestBody = new FormData(form);
      const response = await fetch(SCRIPT_URL, { method: 'POST', body: requestBody });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      form.reset();
      showAlert('Спасибо! Ваша заявка отправлена.', 'success');
    } catch (error) {
      console.error('Error!', error);
      showAlert('Ошибка при отправке! Проверьте интернет или попробуйте позже.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText || 'Отправить заявку';
    }
  });
}