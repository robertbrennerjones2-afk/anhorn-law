/**
 * Main UI Controller
 * Initializes interactive elements after the ComponentLoader injects them into the DOM.
 */
(function () {
  'use strict';

  // Listen for individual components to finish loading
  document.addEventListener('componentLoaded', (event) => {
    const { path } = event.detail;

    if (path.includes('header.html')) {
      initMobileMenu();
      initStickyHeader();
    }

    if (path.includes('review-slider.html')) {
      initReviewSlider();
    }
  });

  function initMobileMenu() {
    const toggle = Utils.$('.mobile-menu-toggle');
    const nav = Utils.$('#primary-navigation');

    if (!toggle || !nav) return;

    Utils.on(toggle, 'click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('is-open');
    });
  }

  function initStickyHeader() {
    const header = Utils.$('.site-header');
    if (!header) return;

    const handleScroll = Utils.throttle(() => {
      if (window.scrollY > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.boxShadow = 'var(--shadow-sm)';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  function initReviewSlider() {
    const track = Utils.$('#review-track');
    const slides = Utils.$$('.review-card');
    const dots = Utils.$$('.dot');
    const prevBtn = Utils.$('.prev-btn');
    const nextBtn = Utils.$('.next-btn');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      dots.forEach(dot => {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      });
      
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
        dots[currentIndex].setAttribute('aria-selected', 'true');
      }
    }

    Utils.on(prevBtn, 'click', () => goToSlide(currentIndex - 1));
    Utils.on(nextBtn, 'click', () => goToSlide(currentIndex + 1));

    dots.forEach((dot, index) => {
      Utils.on(dot, 'click', () => goToSlide(index));
    });
  }
})();