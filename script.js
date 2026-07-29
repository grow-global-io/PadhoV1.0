document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1.  MEGA NAVIGATION — hover-intent dropdowns + keyboard
  ============================================================ */
  const header      = document.getElementById('main-header');
  const navItems    = document.querySelectorAll('.nav-item.has-dropdown');
  const backdrop    = document.getElementById('nav-backdrop');
  let   closeTimer  = null;

  const positionDropdown = (item) => {
    const panel = item.querySelector('.dropdown-panel');
    if (!panel) return;

    // Get the trigger item's position in the viewport
    const rect = item.getBoundingClientRect();
    const panelWidth = Math.max(panel.offsetWidth, 240);
    const viewportWidth = window.innerWidth;

    // Default: left-align with the trigger item
    let leftPos = rect.left;

    // If panel would overflow the right edge, right-align with the trigger instead
    if (leftPos + panelWidth > viewportWidth - 12) {
      leftPos = Math.max(12, rect.right - panelWidth);
    }

    panel.style.left = leftPos + 'px';
  };

  const openMenu = (item) => {
    clearTimeout(closeTimer);
    // Close any other open menu first
    navItems.forEach(i => { if (i !== item) i.classList.remove('open'); });
    // Position the dropdown under its trigger before making it visible
    positionDropdown(item);
    item.classList.add('open');
    backdrop.classList.add('visible');
  };

  const closeMenu = (item, delay = 120) => {
    closeTimer = setTimeout(() => {
      item.classList.remove('open');
      // Only hide backdrop when ALL menus are closed
      if (!document.querySelector('.nav-item.open')) {
        backdrop.classList.remove('visible');
      }
    }, delay);
  };

  const closeAll = () => {
    navItems.forEach(i => i.classList.remove('open'));
    backdrop.classList.remove('visible');
    clearTimeout(closeTimer);
  };

  navItems.forEach(item => {
    // — Hover intent
    item.addEventListener('mouseenter', () => openMenu(item));
    item.addEventListener('mouseleave', () => closeMenu(item));

    // Keep open while hovering child panels
    const panel = item.querySelector('.mega-panel, .dropdown-panel');
    if (panel) {
      panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      panel.addEventListener('mouseleave', () => closeMenu(item));
    }

    // — Click / touch toggle (useful on hybrid devices)
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        closeAll();
        if (!isOpen) openMenu(item);
      });
    }
  });

  // Close when clicking the backdrop
  backdrop.addEventListener('click', closeAll);

  // Keyboard: Escape closes all menus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  /* ============================================================
     2.  SCROLL — header state change
  ============================================================ */
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page is pre-scrolled

  /* ============================================================
     3.  MOBILE DRAWER
  ============================================================ */
  const hamburgerBtn     = document.getElementById('hamburger-btn');
  const mobileDrawer     = document.getElementById('mobile-drawer');
  const mobileOverlay    = document.getElementById('mobile-overlay');
  const drawerCloseBtn   = document.getElementById('mobile-drawer-close');

  const openDrawer = () => {
    mobileDrawer.classList.add('is-open');
    mobileOverlay.classList.add('is-visible');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('is-open');
    mobileOverlay.classList.remove('is-visible');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn  && hamburgerBtn.addEventListener('click', openDrawer);
  drawerCloseBtn && drawerCloseBtn.addEventListener('click', closeDrawer);
  mobileOverlay && mobileOverlay.addEventListener('click', closeDrawer);

  // Escape key also closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ============================================================
     4.  MOBILE ACCORDION — nested submenus
  ============================================================ */
  const mobileToggles = document.querySelectorAll('.mobile-nav-toggle');

  mobileToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.mobile-has-sub');
      const isOpen = parent.classList.contains('is-open');

      // Close all other open items
      document.querySelectorAll('.mobile-has-sub.is-open').forEach(el => {
        if (el !== parent) el.classList.remove('is-open');
      });

      // Toggle current
      parent.classList.toggle('is-open', !isOpen);
    });
  });

  /* ============================================================
     5.  FAQ ACCORDION
  ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ============================================================
     6.  TESTIMONIALS CAROUSEL
  ============================================================ */
  const track      = document.getElementById('testimonial-track');
  const prevBtn    = document.getElementById('prev-slide');
  const nextBtn    = document.getElementById('next-slide');
  const slides     = document.querySelectorAll('.testimonial-slide');
  
  if (track && prevBtn && nextBtn && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
      resetAutoPlay();
    });

    window.addEventListener('resize', updateCarousel);

    let autoPlay = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }, 8000);

    const resetAutoPlay = () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
      }, 8000);
    };
  }

  /* ============================================================
     7.  STATS COUNTER ANIMATION (IntersectionObserver)
  ============================================================ */
  const statValues = document.querySelectorAll('[data-target]');
  
  const animateCounter = (element) => {
    const target    = parseInt(element.getAttribute('data-target'), 10);
    const duration  = 1500;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed     = currentTime - startTime;
      const progress    = Math.min(elapsed / duration, 1);
      const eased       = progress * (2 - progress); // ease-out quad
      element.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statValues.forEach(val => counterObserver.observe(val));

  /* ============================================================
     8.  CTA MODAL
  ============================================================ */
  const modalHTML = `
    <div id="nb-modal-overlay" role="dialog" aria-modal="true" style="
      position:fixed; inset:0;
      background:rgba(0,0,0,0.45);
      display:flex; align-items:center; justify-content:center;
      z-index:2000;
      opacity:0; pointer-events:none;
      transition:opacity 0.25s ease;
    ">
      <div class="nb-card" style="
        width:90%; max-width:480px;
        background:#fff; padding:36px;
        text-align:center;
        transform:scale(0.92);
        transition:transform 0.28s cubic-bezier(0.175,0.885,0.32,1.275);
      ">
        <div style="
          background:var(--primary-yellow);
          width:64px; height:64px; border-radius:50%;
          border:2px solid #000;
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 20px; font-size:1.6rem; font-weight:800;
          box-shadow:3px 3px 0 #000;
        ">🚀</div>
        <h3 style="font-size:1.75rem; margin-bottom:10px;">Let's Get Started!</h3>
        <p style="font-size:1rem; color:#555; margin-bottom:24px; font-weight:500; line-height:1.6;">
          Sign up today and launch your branded coaching platform — website, app, and everything in between.
        </p>
        <a href="https://calendar.app.google/VQ18n3Bwirs8ux3M8" target="_blank" rel="noopener noreferrer" id="close-modal-btn" class="nb-button nb-button-dark" style="padding:10px 28px; text-decoration:none; display:inline-block;">Awesome, let's go!</a>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const overlay  = document.getElementById('nb-modal-overlay');
  const closeBtn = document.getElementById('close-modal-btn');

  const showModal = () => {
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity = '1';
    overlay.querySelector('.nb-card').style.transform = 'scale(1)';
  };
  const hideModal = () => {
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    overlay.querySelector('.nb-card').style.transform = 'scale(0.92)';
  };

  closeBtn.addEventListener('click', () => {
    hideModal();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });

  // Wire CTA buttons that should open modal (exclude direct links)
  ['prefooter-build-btn']
    .forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); showModal(); });
    });

  /* ==================================
     Blog Reader Modal Logic
     ================================== */
  const blogPosts = {
    1: {
      tag: "Coaching Growth",
      date: "July 24, 2026",
      title: "How Coaching Institutes Can Double Student Enrollments in 2026",
      content: `
        <p>The traditional offline coaching model is undergoing a massive shift. Students no longer evaluate institutes based solely on physical classrooms — they look for convenience, instant access to test series, and mobile-first learning experiences.</p>
        <h4>1. Launch Your Own Branded Mobile App</h4>
        <p>Having an app under your coaching center's name creates instant authority. Students can attempt daily practice mocks, watch video lectures, and track their test rankings right from their smartphones.</p>
        <h4>2. Automate Student Engagement via WhatsApp</h4>
        <p>Manual SMS updates get ignored. With automated WhatsApp messaging, institutes can notify parents about test scores, batch timings, and fee receipts automatically, increasing parent satisfaction by 4x.</p>
        <h4>3. Offer Free Micro-Courses & Mocks as Lead Magnets</h4>
        <p>Package your best introductory topics or previous year question papers into free mobile app downloads. Over 40% of students who download free mock tests convert into paid batch enrollees!</p>
      `
    },
    2: {
      tag: "Content Security",
      date: "July 20, 2026",
      title: "5 Bulletproof Ways to Prevent Video Piracy & Screen Recording",
      content: `
        <p>Every month, top educators lose lakhs in revenue due to unauthorized video downloads and Telegram channel leaks. Standard screen-recording blocks are no longer enough.</p>
        <h4>1. Hardware-Bound AES-128 Video DRM</h4>
        <p>Padho encrypts video segments with device-tied security keys. Even if a user attempts to download raw video streams, the file remains unplayable outside your app.</p>
        <h4>2. Dynamic Invisible Watermarking</h4>
        <p>Overlay student mobile numbers and email IDs dynamically across video playback. If anyone attempts external phone camera recording, the watermark reveals the exact culprit.</p>
        <h4>3. Single-Device Session Lock</h4>
        <p>Prevent account sharing by restricting student logins to one mobile phone and desktop device at a time.</p>
      `
    },
    3: {
      tag: "App Strategy",
      date: "July 15, 2026",
      title: "Why Having Your Own Branded App Outperforms 3rd-Party Marketplaces",
      content: `
        <p>3rd-party aggregator platforms promise instant reach, but they force you to compete directly with rival educators on the same screen while charging up to 30% commission.</p>
        <h4>1. Own Your Audience & Data 100%</h4>
        <p>When you build on your own branded platform with Padho, your student leads, phone numbers, and revenue belong exclusively to you. No marketplace distractions!</p>
        <h4>2. Premium Brand Perception</h4>
        <p>Students perceive independent platforms with custom domain names and dedicated app icons as high-trust, elite institutions, allowing you to charge premium course fees.</p>
      `
    },
    4: {
      tag: "Monetization",
      date: "July 10, 2026",
      title: "Building a Recurring Subscription Model for E-books & Test Series",
      content: `
        <p>Relying solely on seasonal batch admissions creates unpredictable revenue spikes. Transitioning to subscription bundles stabilizes cash flow year-round.</p>
        <h4>1. The VIP Pass Membership Model</h4>
        <p>Create a single monthly or annual pass granting access to all e-books, chapter mocks, and live doubt sessions. Subscriptions increase student lifetime value (LTV) by up to 250%.</p>
        <h4>2. Instant Digital Distribution</h4>
        <p>Upload PDF notes, formula sheets, and past year question banks once. Our secure reader lets students study on desktop or mobile while preventing unauthorized PDF file downloads.</p>
      `
    }
  };

  const blogModal      = document.getElementById('blog-modal');
  const blogModalClose = document.getElementById('blog-modal-close');
  const modalTag       = document.getElementById('modal-blog-tag');
  const modalDate      = document.getElementById('modal-blog-date');
  const modalTitle     = document.getElementById('modal-blog-title');
  const modalBody      = document.getElementById('modal-blog-body');

  const openBlogModal = (blogId) => {
    const post = blogPosts[blogId];
    if (!post) return;

    modalTag.textContent   = post.tag;
    modalDate.textContent  = post.date;
    modalTitle.textContent = post.title;
    modalBody.innerHTML    = post.content;

    blogModal.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };

  const closeBlogModal = () => {
    blogModal.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.blog-read-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-blog');
      openBlogModal(id);
    });
  });

  if (blogModalClose) blogModalClose.addEventListener('click', closeBlogModal);
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeBlogModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && blogModal.classList.contains('is-visible')) {
        closeBlogModal();
      }
    });
  }

  /* ============================================================
     WHATSAPP CHATBOT WIDGET POPUP DISMISS
  ============================================================ */
  const waChatbotClose = document.getElementById('wa-chatbot-close');
  const waChatbotPopup = document.getElementById('wa-chatbot-popup');

  if (waChatbotClose && waChatbotPopup) {
    waChatbotClose.addEventListener('click', (e) => {
      e.stopPropagation();
      waChatbotPopup.classList.add('dismissed');
    });
  }

});

