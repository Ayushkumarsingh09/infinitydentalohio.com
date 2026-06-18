(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('a');

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile navigation
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) delay = i * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Reviews slider
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dotsContainer = document.getElementById('reviews-dots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    let cardsPerView = 3;

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - cardsPerView);
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      cardsPerView = getCardsPerView();
      const cardWidth = cards[0].offsetWidth;
      const gap = 24;
      track.style.transform = 'translateX(-' + (currentIndex * (cardWidth + gap)) + 'px)';
      dotsContainer.querySelectorAll('.reviews-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      updateSlider();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    window.addEventListener('resize', () => {
      createDots();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      updateSlider();
    });

    createDots();
    updateSlider();

    // Auto-advance reviews
    setInterval(() => {
      const max = getMaxIndex();
      currentIndex = currentIndex >= max ? 0 : currentIndex + 1;
      updateSlider();
    }, 6000);
  }

  // Office gallery
  const officeThumbs = document.querySelectorAll('.office-thumb');
  const officeMainImg = document.getElementById('office-main-img');

  officeThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      officeThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.dataset.src;
      if (src && officeMainImg) {
        officeMainImg.style.opacity = '0';
        setTimeout(() => {
          officeMainImg.src = src;
          officeMainImg.style.opacity = '1';
        }, 200);
      }
    });
  });

  // Appointment form
  const form = document.getElementById('appointment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const location = document.getElementById('location').value;
      const phone = location === 'kenton' ? '419-848-0722' : '614-418-6336';
      const name = document.getElementById('name').value;
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Request Sent!';
      btn.style.background = 'var(--color-sage-dark)';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
        alert('Thank you, ' + name + '! We\'ll contact you shortly to confirm your appointment. You can also call us at ' + phone + '.');
      }, 1500);
    });
  }

  // Smooth scroll offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

})();
