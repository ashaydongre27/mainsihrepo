/**
 * JOBLEX High-Tech UI Animation Engine
 * Hardware-accelerated scroll reveals, interactive cursor spotlight glare,
 * scroll progress tracking, parallax ambient depth, and number tickers
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAnimations() {
    // 1. Scroll-Driven Reveal Observer (Multi-directional & scale)
    const revealSelector = '.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-scale';
    const revealElements = document.querySelectorAll(revealSelector);

    // Automatically apply stagger delays to children of [data-stagger] containers
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const children = container.querySelectorAll(revealSelector);
      children.forEach((child, index) => {
        if (!child.style.transitionDelay && !child.className.includes('delay-')) {
          child.style.transitionDelay = `${(index + 1) * 90}ms`;
        }
      });
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
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
      // Fallback or reduced motion: reveal immediately
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

    // 3. Telemetry Counter Animation on Scroll
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

    // 4. Scroll Event Handler (Progress Bar, Header Elevation, Scroll-to-Top, Parallax)
    initScrollDynamics();
  }

  function initScrollDynamics() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const header = document.querySelector('header');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const orb1 = document.querySelector('.ambient-glow-orb-1');
    const orb2 = document.querySelector('.ambient-glow-orb-2');

    let ticking = false;

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // 1. Scroll Progress Bar
      if (progressBar && scrollHeight > 0) {
        const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        progressBar.style.width = `${progress}%`;
      }

      // 2. Sticky Header Elevation
      if (header) {
        if (scrollTop > 20) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }

      // 3. Scroll-to-Top Button Visibility
      if (scrollToTopBtn) {
        if (scrollTop > 350) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      }

      // 4. Subtle Ambient Parallax
      if (!prefersReducedMotion) {
        if (orb1) {
          orb1.style.transform = `translate3d(0, ${scrollTop * 0.06}px, 0)`;
        }
        if (orb2) {
          orb2.style.transform = `translate3d(0, ${-scrollTop * 0.04}px, 0)`;
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    onScroll();

    // Scroll-to-top action
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
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
