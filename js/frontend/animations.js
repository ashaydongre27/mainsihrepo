/**
 * JOBLEX High-Tech UI Animation Engine
 * Hardware-accelerated scroll reveals, interactive cursor spotlight glare, and number tickers
 */

(function() {
  'use strict';

  function initAnimations() {
    // 1. Scroll-Driven Reveal Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback if IntersectionObserver is not supported
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 2. Interactive Spotlight Cursor Tracking on Bento & Portal Cards
    const cards = document.querySelectorAll('.bento-card, .portal-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      }, { passive: true });
    });

    // 3. Telemetry Counter Animation
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if ('IntersectionObserver' in window && counterElements.length > 0) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      counterElements.forEach(el => counterObserver.observe(el));
    }
  }

  function animateCounter(el) {
    const rawTarget = el.getAttribute('data-counter-target');
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const isFloat = rawTarget.includes('.');
    const targetValue = parseFloat(rawTarget);
    if (isNaN(targetValue)) return;

    const duration = 1400; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentValue = targetValue * easeOut;

      if (isFloat) {
        el.innerText = prefix + currentValue.toFixed(1) + suffix;
      } else {
        el.innerText = prefix + Math.floor(currentValue).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = prefix + (isFloat ? targetValue.toFixed(1) : targetValue.toLocaleString()) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Self-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  window.JoblexAnimations = { init: initAnimations };
})();
