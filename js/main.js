/**
 * RDC Website - MCNP & ISAP
 * JavaScript Core Interactivity
 */

// Keep inline toast actions available on pages that use onclick handlers.
window.showToast = function (message, type = 'success') {
  const colors = {
    success: '#0d5c3a',
    info: '#0b3c5d',
    error: '#e11d48'
  };
  const toast = document.createElement('div');
  toast.className = 'rdc-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    z-index: 9999;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${colors[type] || colors.info};
    color: #fff;
    font-size: 0.88rem;
    font-weight: 600;
    transform: translate(-50%, 20px);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  `;
  document.querySelector('.rdc-toast')?.remove();
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    navMenu.id ||= 'primary-navigation';
    mobileToggle.setAttribute('aria-controls', navMenu.id);
    mobileToggle.setAttribute('aria-expanded', 'false');

    const closeMobileNav = () => {
      navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = '&#9776;';
    };

    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      document.body.classList.toggle('nav-open', isExpanded);
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '&#10005;' : '&#9776;';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth > 860 || !link.closest('.dropdown > .nav-link')) closeMobileNav();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMobileNav();
    });
  }

  // 2. Mobile Dropdown Toggle (Accordeon on small screens)
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', (e) => {
        // If on small screens, toggle dropdown open/close
        if (window.innerWidth <= 860) {
          e.preventDefault();
          item.classList.toggle('open');
          link.setAttribute('aria-expanded', item.classList.contains('open'));
          
          // Close other open dropdowns
          dropdownItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
              other.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    }
  });

  // 3. Highlight Active Nav Item based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      (href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === 'news.html' && href === 'news-events.html'))
    ) {
      link.classList.add('active');
      // If it's a dropdown link, highlight the parent nav-link too
      const parentDropdown = link.closest('.nav-item.dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // 4. Counter Animation for Metrics
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
  if (metricNumbers.length > 0) {
    const animateCounters = () => {
      metricNumbers.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/[^0-9]/g, '') || 0;
        const increment = Math.ceil(target / 40);

        if (count < target) {
          const nextVal = Math.min(count + increment, target);
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.innerText = nextVal + suffix;
          setTimeout(animateCounters, 30);
        } else {
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.innerText = target + suffix;
        }
      });
    };

    // Trigger on scroll or view
    let triggered = false;
    window.addEventListener('scroll', () => {
      const metricsSection = document.querySelector('.metrics-section');
      if (metricsSection && !triggered) {
        const rect = metricsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
          animateCounters();
          triggered = true;
        }
      }
    });

    // Also trigger if already in view on load
    setTimeout(() => {
      if (!triggered) {
        animateCounters();
        triggered = true;
      }
    }, 400);
  }

  // 5. Journal Tabs Filtering
  const tabBtns = document.querySelectorAll('.tab-btn[data-filter]');
  const articleCards = document.querySelectorAll('.article-card[data-journal]');

  if (tabBtns.length > 0 && articleCards.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active', 'isap-active', 'admin-active'));
        if (btn.dataset.filter === 'isap') {
          btn.classList.add('isap-active');
        } else if (btn.dataset.filter === 'admin') {
          btn.classList.add('admin-active');
        } else {
          btn.classList.add('active');
        }

        const filter = btn.getAttribute('data-filter');
        articleCards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-journal') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Generic Modal Open / Close Handler
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalClosers = document.querySelectorAll('[data-modal-close]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener('click', () => {
      const modal = closer.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 7. Toast Notification Utility
  const legacyShowToast = function (message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#0d5c3a' : type === 'info' ? '#0b3c5d' : '#e11d48';
    toast.style.cssText = `
      background: ${bgColor};
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 4px solid #d4af37;
    `;
    toast.innerHTML = `<span>&#10003;</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // ===== Global Image Lightbox Modal =====
  let lightboxEl = document.querySelector('.rdc-lightbox-overlay');
  if (!lightboxEl) {
    lightboxEl = document.createElement('div');
    lightboxEl.className = 'rdc-lightbox-overlay';
    lightboxEl.setAttribute('role', 'dialog');
    lightboxEl.setAttribute('aria-modal', 'true');
    lightboxEl.setAttribute('aria-label', 'Image preview');
    lightboxEl.innerHTML = `
      <div class="rdc-lightbox-header">
        <span class="rdc-lightbox-counter" id="rdcLightboxCounter">1 / 1 Photos</span>
        <button class="rdc-lightbox-close" id="rdcLightboxClose" type="button" aria-label="Close image preview">&times;</button>
      </div>
      <button class="rdc-lightbox-nav prev" id="rdcLightboxPrev" type="button" aria-label="Previous image">&#10094;</button>
      <div class="rdc-lightbox-content">
        <img src="" alt="" class="rdc-lightbox-img" id="rdcLightboxImg">
      </div>
      <button class="rdc-lightbox-nav next" id="rdcLightboxNext" type="button" aria-label="Next image">&#10095;</button>
    `;
    document.body.appendChild(lightboxEl);
  }

  let lightboxImages = [];
  let lightboxIndex = 0;
  const lbImg = document.getElementById('rdcLightboxImg');
  const lbCounter = document.getElementById('rdcLightboxCounter');
  const lbClose = document.getElementById('rdcLightboxClose');
  const lbPrev = document.getElementById('rdcLightboxPrev');
  const lbNext = document.getElementById('rdcLightboxNext');

  const updateLightbox = () => {
    if (!lightboxImages.length) return;
    const item = lightboxImages[lightboxIndex];
    lbImg.src = typeof item === 'string' ? item : item.src;
    lbImg.alt = typeof item === 'string' ? 'Enlarged photo' : (item.alt || 'Enlarged photo');
    lbCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length} Photos`;
    if (lightboxImages.length <= 1) {
      lbPrev.style.display = 'none';
      lbNext.style.display = 'none';
    } else {
      lbPrev.style.display = 'flex';
      lbNext.style.display = 'flex';
    }
  };

  window.openLightbox = function (items, startIndex = 0) {
    if (!items || !items.length) return;
    lightboxImages = items;
    lightboxIndex = (startIndex + items.length) % items.length;
    updateLightbox();
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
  };

  lbClose?.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  lbPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });
  lbNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });
  lightboxEl?.addEventListener('click', (e) => {
    if (e.target === lightboxEl || e.target.classList.contains('rdc-lightbox-content')) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxImages.length > 1) {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight' && lightboxImages.length > 1) {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightbox();
    }
  });

  // ===== Interactive Photo Gallery Sliders =====
  document.querySelectorAll('[data-gallery-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.event-gallery-slide'));
    if (!slides.length) return;
    let currentSlide = 0;
    const counterEl = slider.querySelector('.event-gallery-counter');
    const prevBtn = slider.querySelector('[data-gallery-prev]');
    const nextBtn = slider.querySelector('[data-gallery-next]');
    const fullscreenButton = slider.querySelector('[data-gallery-fullscreen]');

    // Extract image metadata
    const imgList = slides.map((slide, idx) => {
      const img = slide.querySelector('img');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? (img.getAttribute('alt') || `Event photo ${idx + 1}`) : `Event photo ${idx + 1}`
      };
    });

    // Auto-generate horizontal thumbnail strip if more than 1 photo exists
    let thumbstrip = slider.nextElementSibling?.classList.contains('event-gallery-thumbstrip')
      ? slider.nextElementSibling
      : null;

    if (!thumbstrip && slides.length > 1) {
      thumbstrip = document.createElement('div');
      thumbstrip.className = 'event-gallery-thumbstrip';
      thumbstrip.setAttribute('aria-label', 'Photo thumbnails');
      thumbstrip.innerHTML = imgList.map((img, idx) => `
        <button class="event-gallery-thumb${idx === 0 ? ' active' : ''}" type="button" data-thumb-idx="${idx}" aria-label="Jump to photo ${idx + 1}">
          <img src="${img.src}" alt="Thumbnail ${idx + 1}" loading="lazy">
        </button>
      `).join('');
      slider.insertAdjacentElement('afterend', thumbstrip);

      thumbstrip.querySelectorAll('.event-gallery-thumb').forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(thumb.getAttribute('data-thumb-idx'), 10);
          showSlide(targetIdx);
        });
      });
    }

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
      });
      if (counterEl) {
        counterEl.textContent = `${currentSlide + 1} / ${slides.length} Photos`;
      }
      if (thumbstrip) {
        const thumbs = thumbstrip.querySelectorAll('.event-gallery-thumb');
        thumbs.forEach((thumb, tIdx) => {
          thumb.classList.toggle('active', tIdx === currentSlide);
        });
        const activeThumb = thumbs[currentSlide];
        if (activeThumb) {
          activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlide + 1);
      });
    }

    // Clicking slide opens full-screen Lightbox
    slides.forEach((slide, sIdx) => {
      slide.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.openLightbox) {
          window.openLightbox(imgList, sIdx);
        }
      });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
      }
    }, { passive: true });

    if (fullscreenButton) {
      const updateFullscreenLabel = () => {
        const isFullscreen = document.fullscreenElement === slider;
        fullscreenButton.textContent = isFullscreen ? '\u2716' : '\u26f6';
        fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Exit gallery fullscreen' : 'Open gallery fullscreen');
        fullscreenButton.title = isFullscreen ? 'Exit gallery fullscreen' : 'Open gallery fullscreen';
      };

      fullscreenButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (document.fullscreenElement === slider) {
          await document.exitFullscreen();
        } else if (slider.requestFullscreen) {
          await slider.requestFullscreen();
        }
        updateFullscreenLabel();
      });

      document.addEventListener('fullscreenchange', updateFullscreenLabel);
    }
  });

  const sdgDetails = {
    1: ['SDG 1: No Poverty', [['Community Health Caravans', 'Free consultations, diagnostic tests, and medicines bring essential services to underserved communities.'], ['Barangay Outreach Partnerships', 'Community partners help identify families who need health, education, and social support.']]],
    2: ['SDG 2: Zero Hunger', [['Nutrition and Food Security Outreach', 'Research and community activities promote nutrition awareness and practical food-security solutions.'], ['Community Nutrition Education', 'Students and faculty share food planning and healthy-living practices with families.']]],
    3: ['SDG 3: Good Health and Well-Being', [['Alagang Dr. Guzman Health Caravans', 'MCNP health teams provide medical consultations, laboratory services, screenings, and medicines.'], ['Community Health Worker Training', 'Frontline volunteers receive training in vital signs monitoring, triage, and health reporting.'], ['Maternal and Child Health Outreach', 'Health education supports safer care for mothers, children, and vulnerable residents.']]],
    4: ['SDG 4: Quality Education', [['Research Skills and Continuing Education', 'Faculty and students build research capacity through mentoring, training, and community learning activities.'], ['Student Statistics Competitions', 'MCNP and ISAP students develop analytical and critical-thinking skills through statistics competitions.']]],
    5: ['SDG 5: Gender Equality', [['Legal Literacy and Safe Communities', 'Community workshops support gender sensitivity, rights awareness, and access to appropriate assistance.'], ['Gender Sensitivity Education', 'Research and student activities encourage respectful, inclusive, and equitable communities.']]],
    6: ['SDG 6: Clean Water and Sanitation', [['Cagayan River Water Quality Assessment', 'Research and outreach activities promote water-quality monitoring and sanitation practices.'], ['Community Waste and Sanitation Seminars', 'Residents learn practical ways to protect water sources and improve local sanitation.']]],
    7: ['SDG 7: Affordable and Clean Energy', [['Sustainable Campus Practices', 'Research encourages practical resource conservation and responsible facilities management.'], ['Energy-Efficient Learning Spaces', 'Applied projects explore responsible energy use in classrooms, laboratories, and offices.']]],
    8: ['SDG 8: Decent Work and Economic Growth', [['Skills Enhancement for Community Workers', 'Training and applied research strengthen community livelihoods and professional capabilities.'], ['Alumni Employability Research', 'Institutional research examines graduate employment, workplace readiness, and career development.']]],
    9: ['SDG 9: Industry, Innovation and Infrastructure', [['Applied Research and Technology Solutions', 'MCNP and ISAP develop evidence-based tools, systems, and innovations for institutional and community needs.'], ['Digital Infographics and Technology Projects', 'Students apply design and technology skills to communicate research and solve practical problems.']]],
    10: ['SDG 10: Reduced Inequalities', [['Inclusive Community Extension', 'Outreach programs prioritize underserved communities and broaden access to education, health, and support services.'], ['Accessible Research Communication', 'The RDC shares findings in formats that communities, students, and partner organizations can use.']]],
    11: ['SDG 11: Sustainable Cities and Communities', [['Community Development Partnerships', 'RDC collaborations support safer, healthier, and more resilient communities across Cagayan Valley.'], ['Public Safety and Barangay Research', 'Research helps partners understand community needs and strengthen local responses.']]],
    12: ['SDG 12: Responsible Consumption and Production', [['Waste Reduction and Resource Stewardship', 'Community education encourages responsible consumption, waste segregation, and sustainable practices.'], ['Laboratory Safety and Resource Management', 'Research facilities promote careful use, handling, and disposal of materials.']]],
    13: ['SDG 13: Climate Action', [['River Basin Eco-Resilience', 'Tree planting, environmental monitoring, and disaster-risk research help communities respond to climate hazards.'], ['Disaster Risk Management Education', 'Students and communities study preparedness for floods, typhoons, earthquakes, and other hazards.']]],
    14: ['SDG 14: Life Below Water', [['Waterway Protection Activities', 'Environmental stewardship supports the protection of waterways and aquatic ecosystems.'], ['River Monitoring and Community Awareness', 'Local monitoring and education encourage communities to reduce pollution entering rivers.']]],
    15: ['SDG 15: Life on Land', [['Cagayan Riverbank Reforestation', 'Faculty and students participate in native tree planting and local ecological conservation.'], ['Biodiversity and Local Land-Use Research', 'Research supports the protection of habitats and responsible development in Cagayan.']]],
    16: ['SDG 16: Peace, Justice and Strong Institutions', [['Legal Literacy and Crime Prevention Clinics', 'ISAP-led activities promote public safety, rights awareness, dispute mediation, and community trust.'], ['Research and Institutional Ethics', 'Evidence-based research and ethical review strengthen responsible institutions and public confidence.']]],
    17: ['SDG 17: Partnerships for the Goals', [['MCNP-ISAP Research Collaborations', 'The RDC works with schools, government offices, communities, and partner organizations to expand research impact.'], ['CBCP-UST Collaborative Project', 'The RDC participated in a collaborative research project with the Catholic Bishops’ Conference of the Philippines and UST.'], ['Regional Data Festival Participation', 'Faculty and students share research, statistics, and innovation with partner institutions.']]]
  };

  const initCardSlider = (slider) => {
    const slides = Array.from(slider.querySelectorAll('.sdg-card-slide'));
    const prevButton = slider.querySelector('.sdg-card-prev');
    const nextButton = slider.querySelector('.sdg-card-next');

    if (!slides.length) return;

    let currentIndex = 0;
    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentIndex);
      });
    };

    prevButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex - 1);
    });

    nextButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex + 1);
    });

    showSlide(0);
  };

  const sdgModal = document.querySelector('[data-sdg-modal]');
  if (sdgModal) {
    const modalGallery = sdgModal.querySelector('[data-sdg-modal-gallery]');
    const modalLink = sdgModal.querySelector('[data-sdg-modal-link]');
    const modalEvents = sdgModal.querySelector('[data-sdg-modal-events]');
    let currentSlide = 0;
    let currentImages = [];

    const renderModalGallery = (goalNumber) => {
      currentImages = [`assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-${String(goalNumber).padStart(2, '0')}.png`];
      currentSlide = 0;

      modalGallery.innerHTML = `
        <div class="sdg-card-slider" aria-live="polite">
          <div class="sdg-slider-track">
            ${currentImages.map((src, index) => `
              <div class="sdg-slider-slide ${index === 0 ? 'active' : ''}" data-sdg-slide-index="${index}">
                <img src="${src}" alt="SDG ${goalNumber} icon">
              </div>
            `).join('')}
          </div>
          ${currentImages.length > 1 ? `
            <button class="sdg-slider-arrow sdg-slider-prev" type="button" aria-label="Previous image">&#10094;</button>
            <button class="sdg-slider-arrow sdg-slider-next" type="button" aria-label="Next image">&#10095;</button>
            <div class="sdg-slider-dots">
              ${currentImages.map((_, index) => `
                <button class="sdg-slider-dot ${index === 0 ? 'active' : ''}" type="button" data-sdg-dot-index="${index}" aria-label="Go to image ${index + 1}"></button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

      if (currentImages.length > 1) {
        modalGallery.querySelector('.sdg-slider-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
        modalGallery.querySelector('.sdg-slider-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));
        modalGallery.querySelectorAll('.sdg-slider-dot').forEach((dot) => {
          dot.addEventListener('click', () => goToSlide(Number(dot.getAttribute('data-sdg-dot-index'))));
        });
      }
    };

    const goToSlide = (index) => {
      if (!currentImages.length) return;
      currentSlide = (index + currentImages.length) % currentImages.length;
      modalGallery.querySelectorAll('[data-sdg-slide-index]').forEach((slide) => {
        slide.classList.toggle('active', Number(slide.getAttribute('data-sdg-slide-index')) === currentSlide);
      });
      modalGallery.querySelectorAll('.sdg-slider-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
      });
    };

    const closeModal = () => {
      sdgModal.classList.remove('active');
      document.body.style.overflow = '';
      currentSlide = 0;
    };

    document.querySelectorAll('[data-sdg-card]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;

        const goal = card.getAttribute('data-goal');
        const detail = sdgDetails[goal];

        renderModalGallery(goal);

        modalLink.textContent = detail[0];
        modalEvents.innerHTML = detail[1].map(([eventTitle, description]) => `
          <article class="sdg-event-item">
            <h4><a href="news-events.html#event-highlights-title">${eventTitle}</a></h4>
            <p>${description}</p>
          </article>
        `).join('');

        sdgModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    sdgModal.querySelector('[data-sdg-close]').addEventListener('click', closeModal);
    sdgModal.addEventListener('click', (event) => {
      if (event.target === sdgModal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sdgModal.classList.contains('active')) closeModal();
      if (sdgModal.classList.contains('active') && event.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (sdgModal.classList.contains('active') && event.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });
  }

  // 8. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast('Thank you for your message. The RDC secretariat will respond shortly.', 'info');
      contactForm.reset();
    });
  }
});

// 9. SDG Interactive Showcase Filter
window.filterSDG = function (type, btn) {
  document.querySelectorAll('.sdg-filter-btn').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.sdg-goal-card:not(.sdg-goal-cta), .sdg-tile');
  cards.forEach((card) => {
    const count = parseInt(card.getAttribute('data-events') || '0', 10);
    if (type === 'active') {
      if (count === 0) {
        card.classList.add('dimmed');
      } else {
        card.classList.remove('dimmed');
      }
    } else {
      card.classList.remove('dimmed');
    }
  });
};

// 10. RDC SOP Stage Accordion Toggle (Expand / Collapse All)
window.toggleAllSop = function (expand) {
  const stages = document.querySelectorAll('.rdc-sop-stage');
  stages.forEach((stage) => {
    if (expand) {
      stage.setAttribute('open', '');
    } else {
      stage.removeAttribute('open');
    }
  });
};

/* ==========================================================================
   11. INNOVATES RESEARCH AGENDA INTERACTIVITY (MODAL & TABS)
   Priority Areas, Strategic Focus, Expected Outcomes & Subtopics
   Medical Colleges of Northern Philippines & International School of Asia and the Pacific
   ========================================================================== */
window.agendaData = {
  "inspire": {
    "key": "inspire",
    "letter": "I",
    "name": "INSPIRE",
    "title": "INSPIRE: Culture, Capability, and Engagement",
    "subtitle": "This strategic area promotes a culture in which members of the academic community are empowered to learn, lead, collaborate, innovate, and contribute meaningfully to institutional goals. It addresses professional development, participation, recognition, mentoring, motivation, and the conditions that enable people to perform and grow.",
    "description": "This strategic area promotes a culture in which members of the academic community are empowered to learn, lead, collaborate, innovate, and contribute meaningfully to institutional goals. It addresses professional development, participation, recognition, mentoring, motivation, and the conditions that enable people to perform and grow.",
    "focus": "Develop competent, motivated, value-driven, and actively engaged learners, faculty members, employees, and institutional leaders.",
    "expectedOutcomes": [
      "Increased participation and engagement among learners and employees.",
      "Improved professional, leadership, digital, and interpersonal competencies.",
      "Stronger mentoring, recognition, career development, and succession systems.",
      "A more collaborative, motivated, and values-driven academic community."
    ],
    "subtopicCategories": [
      {
        "category": "Capability Development",
        "items": [
          "Professional and technical competencies",
          "Leadership and management development",
          "Communication and interpersonal skills",
          "Data literacy; digital competence",
          "Critical thinking",
          "Problem-solving",
          "Creativity",
          "Project management",
          "Continuing professional development"
        ]
      },
      {
        "category": "Employee and Learner Engagement",
        "items": [
          "Motivation and participation",
          "Sense of Belonging",
          "Institutional Commitment",
          "Student Involvement",
          "Employee Engagement",
          "Volunteerism",
          "Co-curricular Participation",
          "Recognition and Reward Systems"
        ]
      },
      {
        "category": "Mentoring and Career Development",
        "items": [
          "Faculty and Staff Mentoring",
          "Student Coaching",
          "Leadership Succession",
          "Career Pathways",
          "Performance Support",
          "Peer Learning",
          "Professional Networking",
          "Talent Development and Retention"
        ]
      },
      {
        "category": "Learning and Growth Opportunities",
        "items": [
          "Orientation and Onboarding",
          "Workplace Learning",
          "Seminars and Workshops",
          "Communities of Practice",
          "Cross training",
          "Scholarship and Professional-certification Opportunities",
          "Leadership Formation"
        ]
      },
      {
        "category": "Enabling Conditions",
        "items": [
          "Workload management",
          "Equitable Access to Training",
          "Supportive Supervision",
          "Adequate Tools and Resources",
          "Inclusive Learning and Working Arrangements",
          "Employee and Student Support Mechanisms"
        ]
      },
      {
        "category": "Institutional Culture",
        "items": [
          "Shared Values",
          "Collaboration Across Units",
          "Service Orientation",
          "Openness to Improvement",
          "Leadership Manager",
          "Accountability",
          "Appreciation of Excellence and Innovation."
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-1-inspire.png",
    "badges": [
      {
        "text": "INSPIRE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: Teacher Education & Allied Health",
        "bg": "#0b3c5d",
        "color": "#fff"
      },
      {
        "text": "UN SDG 4: Quality Education",
        "bg": "#c5192d",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 6 & 7",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Comparative Efficacy of Virtual OSCE vs. Traditional Bedside Evaluations in Nursing and Radiologic Technology Clinical Rotations",
        "dept": "College of Nursing & RadTech",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Empirical trial measuring diagnostic precision, procedural error margins, and student clinical confidence when evaluated through virtual simulations vs. bedside hospital rounds."
      },
      {
        "title": "Impact of High-Fidelity Simulation on Clinical Decision-Making Under Acute Stress in Emergency Scenarios",
        "dept": "MCNP Allied Health Sciences",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Investigating physiological stress response markers (heart-rate variability, decision latency) during emergency resuscitation simulations in MCNP simulation laboratories."
      },
      {
        "title": "Gamified Micro-Credential Learning Modules for Human Anatomy & Physiology: A Multi-Cohort Trial",
        "dept": "Department of General Education",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Assessing conceptual retention, quiz performance, and academic persistence among first-year health science students utilizing mobile bite-sized gamified micro-modules."
      },
      {
        "title": "Pedagogical Resilience and Digital Fluency Among Higher Education Faculty in Cagayan Valley",
        "dept": "ISAP College of Teacher Education",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Cross-sectional survey evaluating instructional adaptability, generative AI tool integration, and authentic assessment competencies across tertiary educators."
      },
      {
        "title": "Culturally Responsive Teaching Models in Multi-Ethnolinguistic Classrooms Across Northern Luzon",
        "dept": "ISAP Graduate School of Education",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Designing inclusive instructional frameworks that respect indigenous languages and cultural traditions in regional basic and secondary school districts."
      }
    ],
    "activities": [
      {
        "title": "Annual Faculty Pedagogical Development & Syllabus OBE Alignment Workshop",
        "cadence": "Semestral Cycle",
        "icon": "👨‍🏫",
        "desc": "Intensive capacity-building for MCNP and ISAP educators on authentic assessment rubrics, outcome-based syllabus design, and hybrid simulation integration."
      },
      {
        "title": "Medical & Criminology Simulation Lab Stress-Testing & Calibration Sessions",
        "cadence": "Bi-Monthly",
        "icon": "🏥",
        "desc": "Calibration of high-fidelity clinical manikins, simulated forensic crime scene drills, and OSCE standard rubric benchmarking."
      },
      {
        "title": "Cagayan Valley Teacher Education Colloquium & Paper Presentation",
        "cadence": "Annual Assembly",
        "icon": "🎓",
        "desc": "Regional academic forum convening pre-service and in-service educators to present empirical research on classroom technology, literacy, and equity."
      },
      {
        "title": "Student Education Innovators Showcase & Instructional Exhibit",
        "cadence": "Annual Festival",
        "icon": "💡",
        "desc": "Public exhibition of student-created gamified learning aids, flash modules, and educational technologies evaluated by faculty panels."
      }
    ]
  },
  "nurture": {
    "key": "nurture",
    "letter": "N",
    "name": "NURTURE",
    "title": "NURTURE: Ethics, Quality, and Accountability",
    "subtitle": "This strategic area ensures that academic, administrative, student, and community-related processes are carried out fairly, transparently, consistently, and in accordance with applicable laws, policies, professional standards, and institutional values.",
    "description": "This strategic area ensures that academic, administrative, student, and community-related processes are carried out fairly, transparently, consistently, and in accordance with applicable laws, policies, professional standards, and institutional values.",
    "focus": "Strengthen ethical conduct, quality assurance, good governance, accountability, and consistent institutional standards.",
    "expectedOutcomes": [
      "More consistent, transparent, and accountable institutional processes.",
      "Stronger compliance with ethical, legal, professional, and quality standards.",
      "Improved protection of learners, employees, partners, and institutional information.",
      "A sustained culture of integrity and continuous improvement."
    ],
    "subtopicCategories": [
      {
        "category": "Ethics and Integrity",
        "items": [
          "Academic Integrity",
          "professional Ethics",
          "Responsible Conduct",
          "Conflict-of-interest Management",
          "Honesty",
          "Fairness and Accountability",
          "Prevention of Fraud",
          "Plagiarism",
          "Harassment",
          "Misconduct"
        ]
      },
      {
        "category": "Quality Assurance",
        "items": [
          "Outcomes-based Quality Assurance",
          "Accreditation Readiness",
          "Internal Audits",
          "Service Standards",
          "Process Evaluation",
          "Evidence-based Improvement",
          "Benchmarking",
          "Quality Documentation"
        ]
      },
      {
        "category": "Governance and Accountability",
        "items": [
          "Clear Roles and Responsibilities",
          "Participatory Decision-making",
          "Transparent Procedures",
          "Delegation and Accountability",
          "Policy Implementation",
          "Performance Monitoring",
          "Grievance and Appeal Mechanisms"
        ]
      },
      {
        "category": "Data Privacy and Information Stewardship",
        "items": [
          "Privacy Protection",
          "Confidentiality",
          "Secure Records",
          "Records Retention and Disposal",
          "Cybersecurity Responsibilities",
          "Appropriate Access to Institutional Information"
        ]
      },
      {
        "category": "Inclusive and Fair Practices",
        "items": [
          "Gender Responsiveness",
          "Accessibility",
          "Cultural Sensitivity",
          "Protection of Vulnerable Groups",
          "Equitable Services",
          "Reasonable Accommodation",
          "Respectful Learning and Working Environments."
        ]
      },
      {
        "category": "Risk and Compliance Management",
        "items": [
          "Legal and Regulatory Compliance",
          "Institutional Risk Management",
          "Incident Reporting",
          "Corrective and Preventive Action",
          "Business Continuity",
          "Compliance Monitoring"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-2-nurture.png",
    "badges": [
      {
        "text": "NURTURE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: ISAP Criminology Wing",
        "bg": "#0b3c5d",
        "color": "#fff"
      },
      {
        "text": "UN SDG 16: Peace, Justice & Strong Institutions",
        "bg": "#00689d",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 3 & 8",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "GIS-Enabled Spatial Crime Mapping and Predictive Neighborhood Policing in Peñablanca Rural Barangays",
        "dept": "ISAP College of Criminology",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Mapping temporal and geographic hotspots of theft, domestic disturbances, and rural incidents to optimize PNP motorized patrol deployments."
      },
      {
        "title": "Automated Ballistic Striation Comparison Using High-Resolution Digital Micro-Imaging",
        "dept": "Forensic Ballistics Laboratory",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Developing a computer-aided optical correlation algorithm to index firing pin impressions and rifling marks from test-fired firearms."
      },
      {
        "title": "Reintegration Trajectories and Psychological Recidivism Risks Among Former BJMP Inmates in Region II",
        "dept": "Criminology & Social Sciences",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Longitudinal assessment of vocational skills training, community acceptance, and parole monitoring in reducing repeat criminal offenses."
      },
      {
        "title": "Compliance with Ethical Standards in Research Involving Incarcerated Individuals and Vulnerable Persons",
        "dept": "Institutional Ethics Review Board (IERB)",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Auditing informed consent comprehension, voluntariness, and ethical safeguards across criminal justice student thesis projects."
      },
      {
        "title": "Restorative Justice Efficacy in Barangay Lupong Tagapamayapa Mediation of Interpersonal Disputes",
        "dept": "Criminology & Community Extension",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Quantitative and qualitative evaluation of case resolution rates and victim satisfaction under the Katarungang Pambarangay law."
      }
    ],
    "activities": [
      {
        "title": "Criminology Thesis & Capstone Proposal Defense Colloquium",
        "cadence": "Quarterly Cycle",
        "icon": "⚖️",
        "desc": "Formal peer and panel defense of graduate and undergraduate research proposals on crime detection, police tactics, and criminalistics."
      },
      {
        "title": "Forensic Ballistics & Questioned Document Technical Workshop",
        "cadence": "Bi-Annual Bootcamp",
        "icon": "🔬",
        "desc": "Hands-on laboratory training using the comparison microscope, optical luminescence, and digital photographic forensics."
      },
      {
        "title": "IERB Research Ethics Vetting & Good Clinical Practice (GCP) Sessions",
        "cadence": "Monthly Sessions",
        "icon": "🛡️",
        "desc": "Rigorous ethical evaluation of submitted investigative protocols involving human participants, patient records, or detainees."
      },
      {
        "title": "Barangay Peace and Order Council (BPOC) Legal Aid & Crime Caravan",
        "cadence": "Quarterly Outreach",
        "icon": "🚓",
        "desc": "Community outreach providing crime prevention seminars, anti-drug awareness, and paralegal counseling in partner barangays."
      }
    ]
  },
  "navigate": {
    "key": "navigate",
    "letter": "N",
    "name": "NAVIGATE",
    "title": "NAVIGATE: Digital Transformation and Infrastructure",
    "subtitle": "This strategic area supports the effective use of technology in teaching, learning, administration, communication, healthcare education, student services, community engagement, and institutional decision-making. It also addresses digital access, cybersecurity, infrastructure readiness, and responsible technology use.",
    "description": "This strategic area supports the effective use of technology in teaching, learning, administration, communication, healthcare education, student services, community engagement, and institutional decision-making. It also addresses digital access, cybersecurity, infrastructure readiness, and responsible technology use.",
    "focus": "Advance responsible digital transformation, emerging technologies, accessible information systems, and reliable institutional infrastructure.",
    "expectedOutcomes": [
      "More accessible, efficient, secure, and user-friendly institutional services.",
      "Improved digital competence and responsible technology adoption.",
      "Stronger information systems, connectivity, laboratories, and learning infrastructure.",
      "Increased use of reliable data in academic and administrative decision-making."
    ],
    "subtopicCategories": [
      {
        "category": "Digital Teaching and Learning",
        "items": [
          "Learning-management Systems",
          "Educational Technology",
          "Smart Classrooms",
          "Simulation",
          "Online and Blended Learning",
          "Digital Assessment",
          "Open Educational Resources",
          "Assistive Technology"
        ]
      },
      {
        "category": "Administrative Digitalization",
        "items": [
          "Paperless Transactions",
          "Electronic Records",
          "Online Requests and Approvals",
          "Automated Workflows",
          "Integrated Information Systems",
          "Digital Payment and Enrollment Services",
          "Document Tracking"
        ]
      },
      {
        "category": "Artificial Intelligence and Emerging Technologies",
        "items": [
          "Responsible AI use",
          "Automation",
          "Data Analytics",
          "Robotics",
          "Virtual and Augmented Reality",
          "Digital Health",
          "Health Informatics",
          "Emerging Technologies in professional education and institutional services"
        ]
      },
      {
        "category": "Infrastructure and Systems",
        "items": [
          "Reliable Connectivity",
          "Hardware and Software Access",
          "Laboratory Modernization",
          "Equipment Maintenance",
          "System Interoperability",
          "Cloud Services",
          "Backup and Recovery",
          "Technology Lifecycle Management"
        ]
      },
      {
        "category": "Cybersecurity and Digital Trust",
        "items": [
          "Information Security",
          "Privacy Awareness",
          "Cyber Incident Preparedness",
          "Phishing and Misinformation Resilience",
          "Responsible Social-media Use",
          "System Reliability and User Confidence"
        ]
      },
      {
        "category": "Digital Inclusion",
        "items": [
          "Device and Connectivity Access",
          "Accessible Digital Platforms",
          "Digital Literacy for Learners",
          "Employees",
          "Older Adults",
          "Persons with Disabilities",
          "Underserved Communities",
          "Low-bandwidth Service Option"
        ]
      },
      {
        "category": "Data-informed Management",
        "items": [
          "Institutional Dashboards",
          "Real-time Monitoring",
          "Data Quality",
          "Analytics for Enrollment",
          "Learning",
          "Services",
          "Finance",
          "Human resources",
          "Community Programs",
          "Responsible Decision-support Systems"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-3-navigate.png",
    "badges": [
      {
        "text": "NAVIGATE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Joint: MCNP & ISAP Informatics",
        "bg": "#0d5c3a",
        "color": "#fff"
      },
      {
        "text": "UN SDG 9: Industry, Innovation & Infrastructure",
        "bg": "#f36e24",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 12 & 13",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Blockchain-Secured Chain of Custody System for Digital Evidence in Mobile Forensics Investigations",
        "dept": "College of Information Technology",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Architecting a tamper-evident decentralized ledger to timestamp and verify cryptographic hashes of seized digital forensic media."
      },
      {
        "title": "Deep Learning Convolutional Neural Networks for Automated Screening of Pulmonary Lesions on Digital Chest Radiographs",
        "dept": "Joint IT & Radiologic Tech",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Training AI classification models on regional hospital anonymized X-rays to expedite pneumonia and tuberculosis preliminary screening."
      },
      {
        "title": "Development and Psychometric Validation of a Cloud-Based Automated Research Proposal Evaluation Tool",
        "dept": "RDC Informatics Unit",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Constructing an automated scoring instrument that checks rubric completeness, methodology alignment, and institutional ethics markers."
      },
      {
        "title": "Store-and-Forward Tele-Radiology Architecture for Remote Island Municipalities in Northern Cagayan",
        "dept": "Health Informatics Desk",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Deploying bandwidth-optimized compressed DICOM transmission protocols linking Calayan Island clinics to Cagayan Valley medical centers."
      },
      {
        "title": "Vulnerability Profiling and Zero-Trust Network Architecture for Multi-Campus Academic Platforms",
        "dept": "Computer Studies & Systems",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Empirical vulnerability scanning and least-privilege role-based access control designs across MCNP and ISAP digital assets."
      }
    ],
    "activities": [
      {
        "title": "RDC Data Science & Research Analytics Masterclass (Python, Jamovi, SPSS)",
        "cadence": "Quarterly Sessions",
        "icon": "📊",
        "desc": "Hands-on statistical computing workshops for faculty researchers and graduate students covering inferential statistics and ML."
      },
      {
        "title": "MCNP-ISAP Smart Campus Hackathon & Codefest",
        "cadence": "Annual Sprint",
        "icon": "💻",
        "desc": "Competitive 48-hour software sprint challenging student developers to build solutions for campus workflows, health, and disaster resilience."
      },
      {
        "title": "Cybersecurity Threat Defense & Digital Evidence Forensics Clinic",
        "cadence": "Bi-Annual Workshop",
        "icon": "🔐",
        "desc": "Technical workshop with DICT specialists covering cyber incident response, malware containment, and chain-of-custody verification."
      },
      {
        "title": "Automated Evaluation Instrument Standardization & Pilot Testing",
        "cadence": "Semestral Calibration",
        "icon": "⚙️",
        "desc": "Collaborative testing sessions calibrating digital rubrics and institutional assessment metrics for academic and research departments."
      }
    ]
  },
  "operationalize": {
    "key": "operationalize",
    "letter": "O",
    "name": "OPERATIONALIZE",
    "title": "OPERATIONALIZE: Knowledge Utilization, Innovation, and Improvement",
    "subtitle": "This strategic area emphasizes action. It ensures that lessons from assessments, evaluations, stakeholder feedback, professional practice, institutional data, and completed studies are translated into practical improvements and sustainable solutions.",
    "description": "This strategic area emphasizes action. It ensures that lessons from assessments, evaluations, stakeholder feedback, professional practice, institutional data, and completed studies are translated into practical improvements and sustainable solutions.",
    "focus": "Convert knowledge, evidence, ideas, and institutional learning into improved policies, practices, services, programs, and innovations.",
    "expectedOutcomes": [
      "Increased use of evidence and stakeholder feedback in institutional decisions.",
      "More efficient academic, administrative, and support-service processes.",
      "Increased development, adoption, and scaling of useful innovations.",
      "Better documentation and sharing of institutional knowledge and good practices."
    ],
    "subtopicCategories": [
      {
        "category": "Evidence-to-action",
        "items": [
          "Use of Institutional Data",
          "Evaluation Results",
          "Stakeholder Feedback",
          "Professional Evidence in planning, policy development, curriculum improvement, and service enhancement"
        ]
      },
      {
        "category": "Process Improvement",
        "items": [
          "Simplification of Procedures",
          "Removal of Service Bottlenecks",
          "Cycle-time Reduction",
          "Lean and Quality-improvement Initiatives",
          "Workflow Redesign",
          "Service Recovery",
          "Standardization of Effective Practices"
        ]
      },
      {
        "category": "Innovation Development",
        "items": [
          "New programs",
          "Services",
          "Tools",
          "Products",
          "Technologies",
          "Learning Resources",
          "Community Solutions",
          "Idea-generation Platforms",
          "Innovation Challenges",
          "Prototyping and pilot testing"
        ]
      },
      {
        "category": "Knowledge Management",
        "items": [
          "Documentation of Good Practices",
          "Institutional Manuals and Toolkits",
          "Knowledge Repositories",
          "Lesson-learned Systems",
          "Community of Practice",
          "Preservation of Institutional Knowledge"
        ]
      },
      {
        "category": "Adoption and Scaling",
        "items": [
          "Feasibility Testing",
          "Implementation Support",
          "Replication of Successful Initiatives",
          "Cost-effectiveness",
          "User Acceptance",
          "Sustainability Planning",
          "Institutionalization of Proven Approaches"
        ]
      },
      {
        "category": "Intellectual Property and Entrepreneurship",
        "items": [
          "Intellectual-property Awareness",
          "Ownership and Benefit-sharing",
          "Technology Transfer",
          "Commercialization",
          "Student and Employee Entrepreneurship",
          "Social Enterprise Development"
        ]
      },
      {
        "category": "Communication and Utilization",
        "items": [
          "Policy Briefs",
          "Management Reports",
          "Public information Materials",
          "Local Language Resources",
          "Stakeholder Dialogues",
          "Dissemination of Innovations and Institutional Accomplishments"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-4-operationalize.png",
    "badges": [
      {
        "text": "OPERATIONALIZE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: Systems & Innovation Directorate",
        "bg": "#0d5c3a",
        "color": "#fff"
      },
      {
        "text": "UN SDG 9: Industry, Innovation & Infrastructure",
        "bg": "#f36e24",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 4 & 13",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Formulation, Stability Testing, and Antimicrobial Evaluation of a Topical Gel from Cagayan Native Flora",
        "dept": "College of Pharmacy",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Developing a stable semi-solid topical antibacterial preparation utilizing ethanolic extracts of bioactive Peñablanca botanical specimens."
      },
      {
        "title": "Design, Fabrication, and Biomechanical Evaluation of an Ergonomic Patient Transfer Assist Device for Rural Clinics",
        "dept": "Physical Therapy & Ergonomics",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Engineering an affordable mechanical transfer harness to reduce caregiver lumbar strain and patient falls during bedside transfers."
      },
      {
        "title": "Queueing Theory and Lean Workflow Optimization in High-Volume Clinical Diagnostic Laboratories",
        "dept": "Medical Technology Department",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Mathematical modeling of specimen triage, automated centrifuge routing, and turnaround time minimization during morning peak hours."
      },
      {
        "title": "Automated Customs Brokerage Tariff Calculator and Discrepancy Flagging Tool for Cagayan Economic Zone",
        "dept": "Customs Administration",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Developing software logic to auto-reconcile ASEAN Harmonized Tariff Nomenclature codes and compute duties with minimal clerical error."
      },
      {
        "title": "Micro-Encapsulation of Bioactive Polyphenols from Indigenous Crops for Nutraceutical Shelf-Life Extension",
        "dept": "Pharmacy & Chemistry Labs",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Evaluating spray-drying encapsulation using food-grade biopolymers to preserve antioxidant potency under tropical ambient conditions."
      }
    ],
    "activities": [
      {
        "title": "IPOPHL Patent & Utility Model Drafting Workshop",
        "cadence": "Annual Workshop",
        "icon": "📜",
        "desc": "Intensive mentoring by intellectual property attorneys guiding faculty and students through claims drafting and formal patent submissions."
      },
      {
        "title": "RDC Pitching Summit: From Research Capsule to Commercial Prototype",
        "cadence": "Annual Summit",
        "icon": "🚀",
        "desc": "Venture pitch competition where student-faculty research teams showcase prototypes before DOST evaluators and industry investors."
      },
      {
        "title": "DOST Regional Science, Technology, and Innovation Week (RSTW) Technology Demo",
        "cadence": "Annual Demo",
        "icon": "🔬",
        "desc": "Public exhibition presenting fabricated ergonomic devices, formulated pharmaceutical products, and software tools to the public."
      },
      {
        "title": "Clinical Laboratory Biosafety & Ergonomic Safety Facility Audits",
        "cadence": "Semestral Audits",
        "icon": "🛠️",
        "desc": "Walkthrough inspections evaluating technician workstation postures, chemical fume hood efficiency, and waste stream controls."
      }
    ]
  },
  "value": {
    "key": "value",
    "letter": "V",
    "name": "VALUE",
    "title": "VALUE: Health, Safety, and Well-Being",
    "subtitle": "This strategic area brings together health promotion, professional healthcare practice, campus safety, psychosocial support, emergency preparedness, security, and healthy learning and working environments.",
    "description": "This strategic area brings together health promotion, professional healthcare practice, campus safety, psychosocial support, emergency preparedness, security, and healthy learning and working environments.",
    "focus": "Promote the physical, mental, social, and occupational well-being, safety, and resilience of the academic community and partner communities.",
    "expectedOutcomes": [
      "Improved health knowledge, practices, and access to appropriate support.",
      "Safer learning, working, clinical, and community environments.",
      "Stronger mental health, wellness, emergency, and security programs.",
      "Improved quality and safety of professional and institutional services."
    ],
    "subtopicCategories": [
      {
        "category": "Health Promotion and Services",
        "items": [
          "Health Literacy",
          "Preventive Care",
          "Nutrition",
          "Physical Activity",
          "Vaccination Awareness",
          "Maternal and Child Health",
          "Adolescent Health",
          "Healthy Aging",
          "Oral Health",
          "Noncommunicable and infectious disease prevention"
        ]
      },
      {
        "category": "Mental Health and Psychosocial Well-being",
        "items": [
          "Stress",
          "Burnout and Coping",
          "Psychological Resilience",
          "Help-seeking",
          "Counseling and Referral",
          "School Connectedness",
          "Work–life Balance",
          "Suicide Prevention",
          "Supportive learning and Working Environments"
        ]
      },
      {
        "category": "Occupational and Campus Safety",
        "items": [
          "Workplace Safety",
          "Clinical-placement Safety",
          "Needle-stick and Exposure Prevention",
          "Laboratory Safety",
          "Ergonomics",
          "Fire Safety",
          "Road and Transport Safety",
          "Incident Reporting",
          "Hazard Identification"
        ]
      },
      {
        "category": "Security and Protection",
        "items": [
          "Crime Prevention",
          "Violence and Bullying Prevention",
          "Child Safeguarding",
          "Gender-based Violence Prevention",
          "Substance Misuse and Vaping Prevention",
          "Illegal Gambling and Risky Behavior Prevention",
          "Security and Terrorism Preparedness"
        ]
      },
      {
        "category": "Emergency and Disaster Health",
        "items": [
          "First Aid",
          "Emergency Referral",
          "Disaster-health Response",
          "Evacuation Readiness",
          "Continuity of Essential Services",
          "Psychological First Aid",
          "Protection of Vulnerable Groups During Emergencies"
        ]
      },
      {
        "category": "Quality Professional Practice",
        "items": [
          "Patient Safety",
          "Quality of Care",
          "Interprofessional Collaboration",
          "Medication Safety",
          "Infection Prevention",
          "Antimicrobial Stewardship",
          "Digital Health",
          "Ethical and Culturally Responsive Care"
        ]
      },
      {
        "category": "Healthy Environments",
        "items": [
          "Safe Food and Water",
          "Sanitation and Hygiene",
          "Indoor-air Quality",
          "Ventilation",
          "Thermal Comfort",
          "Accessible Facilities",
          "Healthy Campus Design"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-5-value.png",
    "badges": [
      {
        "text": "VALUE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: MCNP Health Sciences Wing",
        "bg": "#0d5c3a",
        "color": "#fff"
      },
      {
        "text": "UN SDG 3: Good Health & Well-Being",
        "bg": "#4c9f38",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 1, 10 & 11",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Phytochemical Screening, Acute Oral Toxicity, and Hypoglycemic Potential of Peñablanca Indigenous Flora Extracts",
        "dept": "College of Pharmacy",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Bioassay-guided fractionation to validate traditional folkloric claims of glucose-lowering properties in local botanical decoctions."
      },
      {
        "title": "Spatial-Temporal Clustering of Dengue and Leptospirosis Infections Following Monsoon Inundations in Cagayan Basin",
        "dept": "Medical Technology Wing",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Combining municipal health office data with rainfall indices to map spatial transmission corridors and predict seasonal outbreaks."
      },
      {
        "title": "Radiation Dose Optimization and Image Quality in Pediatric Digital Radiography Across Cagayan Hospitals",
        "dept": "College of Radiologic Technology",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Determining diagnostic reference levels (DRLs) to minimize cumulative radiation dose for pediatric chest examinations without loss of clarity."
      },
      {
        "title": "Adverse Drug Reaction (ADR) Self-Reporting Behaviors and Knowledge Among Community Pharmacists in Region II",
        "dept": "College of Pharmacy",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Surveying community drugstore practitioners to evaluate under-reporting barriers and develop mobile ADR reporting mechanisms."
      },
      {
        "title": "Early Task-Specific Physical Therapy Intervention in Post-Stroke Functional Mobility Recovery in Rural Settings",
        "dept": "College of Physical Therapy",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Evaluating home-based task-oriented motor retraining protocols for stroke survivors with limited access to tertiary physical rehab."
      }
    ],
    "activities": [
      {
        "title": "Pharmacy & Health Sciences Research Proposal Defenses (September & February Cycles)",
        "cadence": "Semestral Sessions",
        "icon": "💊",
        "desc": "Rigorous defense panels evaluating clinical methodologies, ethical approvals, sample sizes, and pharmacologic assays."
      },
      {
        "title": "Health Research Data Analysis & Biostatistics Masterclass",
        "cadence": "Quarterly Workshop",
        "icon": "📈",
        "desc": "Specialized training on survival analysis, logistic regression, Jamovi/SPSS statistical tests, and epidemiological data visualization."
      },
      {
        "title": "CVHRDC Regional Health Research Conference (RHRDC) Scientific Sessions",
        "cadence": "Annual Congress",
        "icon": "🏆",
        "desc": "Regional congress where MCNP faculty and students compete in oral paper and poster presentations across health research categories."
      },
      {
        "title": "Community Diagnostic Health & Vital Signs Surveillance Missions",
        "cadence": "Quarterly Outreach",
        "icon": "🩺",
        "desc": "Mobile diagnostic outreach conducting free capillary blood glucose testing, urinalysis, blood pressure screening, and health education."
      }
    ]
  },
  "advance": {
    "key": "advance",
    "letter": "A",
    "name": "ADVANCE",
    "title": "ADVANCE: Sustainability and Climate Resilience",
    "subtitle": "This strategic area integrates sustainability into academic programs, campus management, resource use, infrastructure, procurement, community initiatives, and institutional decision-making.",
    "description": "This strategic area integrates sustainability into academic programs, campus management, resource use, infrastructure, procurement, community initiatives, and institutional decision-making.",
    "focus": "Strengthen environmental responsibility, sustainable institutional operations, and the climate and disaster resilience of the institution and its communities.",
    "expectedOutcomes": [
      "More efficient and responsible use of institutional resources.",
      "Improved environmental quality and sustainability practices across the campus.",
      "Stronger institutional and community resilience to climate and disaster risks.",
      "Measurable contributions to the Sustainable Development Goals."
    ],
    "subtopicCategories": [
      {
        "category": "Sustainable Campus Operations",
        "items": [
          "Energy and Water Efficiency",
          "Renewable Energy",
          "Waste Reduction and Segregation",
          "Healthcare and Laboratory Waste",
          "Single-use Plastic Reduction",
          "Sustainable Procurement",
          "Paper Reduction",
          "Responsible Consumption"
        ]
      },
      {
        "category": "Climate-responsive Infrastructure",
        "items": [
          "Heat and shade Management",
          "Ventilation and Indoor Environmental Quality",
          "Energy-efficient Lighting",
          "Thermal Comfort",
          "Resilient Buildings",
          "Accessible Green Spaces",
          "Safe Drainage and Flood Management"
        ]
      },
      {
        "category": "Climate and Disaster Resilience",
        "items": [
          "Climate-risk Assessment",
          "Adaptation and Mitigation",
          "Disaster Preparedness",
          "Business and learning Continuity",
          "Early-warning Communication",
          "Evacuation Planning",
          "Resilient Supply Chains and Essential Services"
        ]
      },
      {
        "category": "Environmental Protection",
        "items": [
          "Pollution Prevention",
          "Biodiversity and Ecosystem Protection",
          "River and Watershed Stewardship",
          "Air and Water Quality",
          "Green Criminology",
          "Environmental Justice",
          "Community-based Environmental Monitoring"
        ]
      },
      {
        "category": "Sustainable Food and Resource Systems",
        "items": [
          "Food Security",
          "Nutrition-sensitive Programs",
          "Food-waste Reduction",
          "Sustainable Agriculture",
          "Local Sourcing",
          "Responsible use of Natural Resources"
        ]
      },
      {
        "category": "Education and Behavior",
        "items": [
          "Integration of the SDGs into Curriculum and Operations",
          "Environmental Literacy",
          "Sustainable Lifestyles",
          "Employee and Student Participation",
          "Citizen Science",
          "Sustainability Campaigns"
        ]
      },
      {
        "category": "Community Adaptation",
        "items": [
          "Household preparedness",
          "Safe Water and Sanitation After Disasters",
          "Climate-resilient Livelihoods",
          "Protection of Women and Vulnerable Groups",
          "Local Hazard Mapping",
          "Community Resilience Planning"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-6-advance.png",
    "badges": [
      {
        "text": "ADVANCE",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Joint: SDG Advocacies Synergy",
        "bg": "#0d5c3a",
        "color": "#fff"
      },
      {
        "text": "UN SDG 13: Climate Action",
        "bg": "#3f7e44",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 2 & 8",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Hydrological Inundation Modeling and Flood Vulnerability Mapping of Riverine Barangays Along the Lower Cagayan River",
        "dept": "Environmental Research Unit",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Utilizing elevation models and historical rainfall data to generate high-resolution flood hazard zones for Peñablanca and Tuguegarao."
      },
      {
        "title": "Microbiological and Heavy Metal Assessment of Post-Flooding Shallow Tube Wells in Peñablanca Agricultural Villages",
        "dept": "Medical Technology & Public Health",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Screening well water supplies for coliform pathogens, arsenic, and nitrates following monsoon overflow to guide water purification outreach."
      },
      {
        "title": "Household Food Security and Dietary Coping Mechanisms During Prolonged Typhoon Disruptions in Rural Cagayan",
        "dept": "Community Nutrition & Social Work",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Evaluating staple food stockpiling, indigenous food preservation, and calorie adequacy during road network inundations."
      },
      {
        "title": "Enforcement Efficacy of Forest Protection Ordinances in Peñablanca Protected Landscape and Seascape",
        "dept": "ISAP College of Criminology",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Assessing inter-agency enforcement protocols between DENR, PNP, and community bantay-gubat rangers against illegal logging."
      },
      {
        "title": "Campus Carbon Footprint Baseline Assessment and Green Building Energy Conservation Roadmap for MCNP-ISAP",
        "dept": "SDG Center & Admin Wing",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Calculating greenhouse gas emissions from electricity, fuel, and municipal solid waste to design campus net-zero target milestones."
      }
    ],
    "activities": [
      {
        "title": "Cagayan River Basin Water Quality & Coliform Testing Field Campaign",
        "cadence": "Quarterly Expedition",
        "icon": "💧",
        "desc": "Faculty-student field testing expeditions collecting water samples along critical river junctions to monitor dissolved oxygen and bacterial load."
      },
      {
        "title": "Disaster First Responders Triage Simulation & Boat Rescue Exercise",
        "cadence": "Annual Drill",
        "icon": "🚤",
        "desc": "Joint realistic emergency drill with MDRRMO Peñablanca and PCG testing mass casualty triage protocols in simulated flood conditions."
      },
      {
        "title": "SDG SPOT Tree Planting & Sierra Madre Reforestation Missions",
        "cadence": "Bi-Annual Missions",
        "icon": "🌱",
        "desc": "Active institutional tree-growing caravans planting thousands of native species in designated watershed restoration zones."
      },
      {
        "title": "Climate Resilience & Community Disaster Preparedness Barangay Clinics",
        "cadence": "Quarterly Clinics",
        "icon": "📢",
        "desc": "Interactive public education workshops on water disinfection, family disaster kits, and typhoon shelter hygiene."
      }
    ]
  },
  "transform": {
    "key": "transform",
    "letter": "T",
    "name": "TRANSFORM",
    "title": "TRANSFORM: Community Engagement and Social Impact",
    "subtitle": "This strategic area ensures that community engagement and extension begin with genuine needs and available community assets. It promotes co-design, meaningful participation, coordinated implementation, outcome evaluation, and the sustainability of effective interventions.",
    "description": "This strategic area ensures that community engagement and extension begin with genuine needs and available community assets. It promotes co-design, meaningful participation, coordinated implementation, outcome evaluation, and the sustainability of effective interventions.",
    "focus": "Develop participatory, responsive, inclusive, and sustainable programs that address documented community needs and generate measurable social benefits.",
    "expectedOutcomes": [
      "Community programs grounded in documented needs, assets, and stakeholder participation.",
      "Improved access to relevant services, opportunities, and support among partner communities.",
      "Stronger partner ownership, trust, and accountability.",
      "More sustainable, replicable, and measurable community-development initiatives."
    ],
    "subtopicCategories": [
      {
        "category": "Community Needs and Assets",
        "items": [
          "Standardized Needs Assessment",
          "Community Profiling",
          "Asset Mapping",
          "Stakeholder Consultation",
          "Priority Setting",
          "Use of Local Data",
          "Identification of Vulnerable and Underserved Groups"
        ]
      },
      {
        "category": "Participatory Planning",
        "items": [
          "Community Representation",
          "Co-design of Programs",
          "Clear Partner Roles",
          "Culturally Appropriate Approaches",
          "Local Language Communication",
          "Informed Participation and Shared Accountability"
        ]
      },
      {
        "category": "Health, Education, and Safety Initiatives",
        "items": [
          "Community Health Promotion",
          "Literacy and Learning Support",
          "Legal and Digital Literacy",
          "Disaster Preparedness",
          "Crime Prevention",
          "Environmental Health",
          "Referral and Support Systems"
        ]
      },
      {
        "category": "Livelihood and Local Development",
        "items": [
          "Skills training",
          "Entrepreneurship",
          "Financial Literacy",
          "Youth Employability",
          "Community Enterprises",
          "Sustainable Tourism",
          "Food and Nutrition Security",
          "Local-product Development"
        ]
      },
      {
        "category": "Inclusion and Social Protection",
        "items": [
          "Programs for Persons with Disabilities",
          "Older Adults, Women Children, Indigenous Peoples, Out-of-school Youth, Low-income Families, and other Vulnerable Groups"
        ]
      },
      {
        "category": "Program Quality and Accountability",
        "items": [
          "Service Standards",
          "Volunteer Preparation",
          "Safeguarding",
          "Beneficiary Feedback",
          "Grievance Mechanisms",
          "Resource Transparency",
          "Monitoring of Participation, Outputs, and Outcomes"
        ]
      },
      {
        "category": "Sustainability and Impact",
        "items": [
          "Beneficiary Tracking",
          "Long-term Outcome Assessment",
          "Social Return on Investment",
          "Partner Capacity-building",
          "Exit and Handover Plans",
          "Replication and Scaling of Effective Initiatives"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-7-transform.png",
    "badges": [
      {
        "text": "TRANSFORM",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: Community Extension & Social Sciences",
        "bg": "#0b3c5d",
        "color": "#fff"
      },
      {
        "text": "UN SDG 10: Reduced Inequalities",
        "bg": "#dd1367",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 5 & 8",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Socio-Demographic and Nutritional Profiling of Agta Indigenous Communities in Peñablanca Foothills",
        "dept": "Social Work & Public Health",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "A participatory field assessment documenting dietary patterns, micronutrient deficiencies, maternal health practices, and cultural health perceptions."
      },
      {
        "title": "Impact Assessment of Barangay-Level Micro-Credit and Skills Training for Agrarian Women in Cagayan",
        "dept": "College of Business Administration",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Evaluating household income gains, business survival rates, and economic decision-making autonomy among women beneficiaries."
      },
      {
        "title": "Mental Health Stigma and Psychological Help-Seeking Behaviors Among Rural Adolescents in Northern Luzon",
        "dept": "Department of Psychology",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Investigating cultural barriers, family perceptions, and telemedicine acceptability in addressing depression and anxiety among high school youth."
      },
      {
        "title": "Evaluation of Municipal Social Pension Distribution Schemes for Indigent Senior Citizens in Remote Barangays",
        "dept": "Social Work Department",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Assessing payout timeliness, purchasing power adequacy, and logistics hurdles in delivering government pensions to isolated elderly citizens."
      },
      {
        "title": "Gender-Disaggregated Analysis of Academic and Clinical Duty Burden Among Healthcare Interns in Regional Hospitals",
        "dept": "Institutional GAD Desk",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Investigating gendered disparities in shift assignments, mental fatigue, caregiving obligations outside duty, and career advancement."
      }
    ],
    "activities": [
      {
        "title": "Annual Gender and Development (GAD) Research Integration Workshop",
        "cadence": "Annual Workshop",
        "icon": "⚖️",
        "desc": "Institutional capacity-building for faculty on embedding sex-disaggregated data and gender analysis tools into academic research."
      },
      {
        "title": "Agta Indigenous Community Cultural Dialogue & Health Extension Outreach",
        "cadence": "Bi-Annual Missions",
        "icon": "🤝",
        "desc": "Community-immersion missions providing free pediatric wellness checks, hygiene kits, and culturally consultative discussions."
      },
      {
        "title": "Participatory Rural Appraisal (PRA) & Community Needs Assessment Clinics",
        "cadence": "Semestral Clinics",
        "icon": "📋",
        "desc": "Field exercises training researchers in community participatory mapping, seasonal calendars, and grassroots focus group facilitation."
      },
      {
        "title": "Youth Mental Health Campus Caravan & Peer-Counseling Bootcamps",
        "cadence": "Bi-Annual Caravan",
        "icon": "🧠",
        "desc": "Campus-wide awareness campaign offering psychological first aid workshops, stress management clinics, and anti-stigma dialogues."
      }
    ]
  },
  "expand": {
    "key": "expand",
    "letter": "E",
    "name": "EXPAND",
    "title": "EXPAND: Partnerships, Networks, and Global Engagement",
    "subtitle": "This strategic area recognizes that institutional goals are strengthened through collaboration within MCNP–ISAP and with government, industry, healthcare institutions, schools, communities, professional organizations, alumni, civil society, and international partners.",
    "description": "This strategic area recognizes that institutional goals are strengthened through collaboration within MCNP–ISAP and with government, industry, healthcare institutions, schools, communities, professional organizations, alumni, civil society, and international partners.",
    "focus": "Build mutually beneficial partnerships that expand learning, expertise, resources, mobility, service, innovation, and institutional visibility.",
    "expectedOutcomes": [
      "More active and mutually beneficial institutional partnerships.",
      "Expanded opportunities for learners and employees, including training, mobility, practice exposure, and professional networking.",
      "Increased access to external expertise, resources, grants, and shared facilities.",
      "Stronger regional, national, and international visibility and engagement."
    ],
    "subtopicCategories": [
      {
        "category": "Internal Collaboration",
        "items": [
          "Interdepartmental Projects",
          "Shared Services",
          "Cross-program Initiatives",
          "Faculty–student Collaboration",
          "Joint Academic",
          "Administrative and community activities",
          "Interdisciplinary problem-solving"
        ]
      },
      {
        "category": "Government and Community Partnerships",
        "items": [
          "Collaboration with Local and National Agencies, Barangays, Schools, Hospitals, Consortia, and Civil-society Organizations",
          "Coordination of Public-service Initiatives",
          "Regional Development Participation"
        ]
      },
      {
        "category": "Industry and Professional Linkages",
        "items": [
          "Internship and Clinical-placement Partnerships",
          "Employer Engagement",
          "Curriculum Consultation",
          "Industry-led Training",
          "Professional Networks",
          "Workforce Development",
          "Shared Facilities and Expertise"
        ]
      },
      {
        "category": "Internationalization",
        "items": [
          "International Academic Cooperation",
          "Student and Employee Mobility",
          "Visiting Experts",
          "Comparative and Intercultural Programs",
          "Joint conferences",
          "Virtual Exchange",
          "Global Competency Development"
        ]
      },
      {
        "category": "Resource Mobilization",
        "items": [
          "Grants",
          "Sponsorships",
          "Donations",
          "Commissioned Projects",
          "Shared Equipment",
          "Technical Assistance",
          "Alumni Support",
          "Collaborative Resource Development"
        ]
      },
      {
        "category": "Partnership governance",
        "items": [
          "Clear Agreements, roles and Responsibilities",
          "Data-sharing and Confidentiality",
          "Mutual Benefit",
          "Partner Feedback",
          "Performance Evaluation",
          "Ethical Engagement",
          "Continuity Beyond Project Funding"
        ]
      },
      {
        "category": "Institutional Visibility",
        "items": [
          "Participation in Networks, Rankings, Conferences, Competitions, Professional Organizations, and Knowledge-sharing Platforms",
          "Communication of Institutional Accomplishments and Impact"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-8-expand.png",
    "badges": [
      {
        "text": "EXPAND",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Joint: External Affairs & RDC Directorate",
        "bg": "#0b3c5d",
        "color": "#fff"
      },
      {
        "text": "UN SDG 17: Partnerships for the Goals",
        "bg": "#19486a",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 9 & 17",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Longitudinal Tracer Study of Allied Health and Criminology Graduates (2018–2024): Licensure, Mobility & Employer Satisfaction",
        "dept": "Alumni Affairs & Quality Assurance",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Comprehensive regional survey tracking 3,500+ MCNP and ISAP alumni regarding employment timelines, job alignment, and licensure factors."
      },
      {
        "title": "Regional Research Productivity and Co-Authorship Density Among CVHRDC Member Institutions",
        "dept": "RDC Directorate",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Bibliometric analysis of health science publication outputs, cross-institutional collaborations, and citation impact in Cagayan Valley."
      },
      {
        "title": "Internationalization Readiness and Cross-Border Curriculum Equivalency in Allied Health Professions in Northern Philippines",
        "dept": "External Affairs Office",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Benchmarking MCNP nursing and radiologic technology syllabi against ASEAN University Network (AUN) quality assurance metrics."
      },
      {
        "title": "Assessment of Academic-Industry Partnership Synergies in Customs Brokerage Internships in Northern Luzon",
        "dept": "College of Customs Administration",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Measuring student competency acquisition and job absorption rates through formal MOA linkages with freight forwarders and port operators."
      },
      {
        "title": "Impact of Institutional Research Incentive Grants on Faculty Citation Metrics and Scopus/WoS Publications",
        "dept": "RDC Directorate",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Evaluating institutional return-on-investment from seed research grants, publication cash incentives, and deloading policies."
      }
    ],
    "activities": [
      {
        "title": "Annual Institutional Research General Assembly & Research Incentive Awards",
        "cadence": "Annual Assembly",
        "icon": "🏅",
        "desc": "Grand institutional gathering recognizing outstanding faculty and student researchers, publication authors, and patent awardees."
      },
      {
        "title": "Regional & International Academic Memorandum of Agreement (MOA) Signing Ceremonies",
        "cadence": "Quarterly Signing",
        "icon": "🖋️",
        "desc": "Formal bilateral partnership ceremonies formalizing faculty exchange, shared laboratory access, and joint research projects."
      },
      {
        "title": "Grand Alumni Research Tracer Survey & Homecoming Summit",
        "cadence": "Annual Summit",
        "icon": "🌐",
        "desc": "Systematic multi-channel survey campaign gathering employment feedback, graduate competencies, and alumni mentor nominations."
      },
      {
        "title": "CVHRDC & DOST Consortium Technical Review and Priority Setting Sessions",
        "cadence": "Bi-Annual Sessions",
        "icon": "📑",
        "desc": "Strategic inter-agency meetings aligning institutional research proposals with regional and national grant funding calls."
      }
    ]
  },
  "strengthen": {
    "key": "strengthen",
    "letter": "S",
    "name": "STRENGTHEN",
    "title": "STRENGTHEN: Education and Institutional Performance",
    "subtitle": "This strategic area brings together the institution’s central responsibilities for educational quality, student development, employee effectiveness, service excellence, sound governance, resource management, and evidence-based improvement.",
    "description": "This strategic area brings together the institution’s central responsibilities for educational quality, student development, employee effectiveness, service excellence, sound governance, resource management, and evidence-based improvement.",
    "focus": "Improve teaching and learning, learner success, leadership, institutional services, organizational effectiveness, and long-term sustainability.",
    "expectedOutcomes": [
      "Improved teaching quality, learner experience, progression, competency, and graduate outcomes.",
      "More responsive, inclusive, and efficient institutional services.",
      "Stronger leadership, employee engagement, governance, and organizational performance.",
      "Improved quality-assurance, accreditation, financial, and sustainability outcomes."
    ],
    "subtopicCategories": [
      {
        "category": "Teaching and Learning",
        "items": [
          "Teaching effectiveness",
          "Instructional Innovation",
          "Curriculum Relevance and Responsiveness",
          "Competency Attainment",
          "Assessment Quality",
          "Experiential Learning",
          "Academic Support",
          "Responsible Integration of Technology"
        ]
      },
      {
        "category": "Learner Success and Experience",
        "items": [
          "Admission-to-graduation Journey",
          "Retention, Progression, and Completion",
          "Licensure Readiness",
          "Academic Advising",
          "Student Engagement",
          "Values Formation",
          "Conduct",
          "Leadership",
          "Co-curricular Development",
          "Student voice and grievance resolution."
        ]
      },
      {
        "category": "Equity and Inclusion",
        "items": [
          "Financial Barriers",
          "Bridging Programs",
          "Support for Students at Risk of Stopping Out",
          "Inclusive Instruction",
          "Accessibility",
          "Gender-responsive Services",
          "Support for Working Students and First-generation Learners"
        ]
      },
      {
        "category": "Graduate and Workforce Outcomes",
        "items": [
          "Employability",
          "Employer-required Competencies",
          "Internships and Clinical Placements",
          "Career Guidance",
          "Workplace Transition",
          "Alumni Engagement",
          "Graduate Tracking",
          "Continuing Professional Development"
        ]
      },
      {
        "category": "Leadership and People Management",
        "items": [
          "Leadership Effectiveness",
          "Middle-management Capability",
          "Workforce Planning",
          "Workload",
          "Performance Management",
          "Employee Engagement",
          "Organizational Climate",
          "Communication",
          "Civility",
          "Retention and Succession"
        ]
      },
      {
        "category": "Institutional Services",
        "items": [
          "Quality and accessibility of Registrar, Admissions, Finance, Library, Laboratory, ICT, Student Affairs, Health, Guidance, Security, Facilities, and other Support Services",
          "Stakeholder Satisfaction",
          "Service Recovery"
        ]
      },
      {
        "category": "Governance and Operational Effectiveness",
        "items": [
          "Educational Organization Management Systems",
          "Policy Implementation",
          "Meeting Effectiveness",
          "Process Cycle Time",
          "Risk Management",
          "Data-informed Decision-making",
          "Accreditation",
          "Internal Quality Assurance",
          "Documentation of Good Practices"
        ]
      },
      {
        "category": "Resource and Financial Sustainability",
        "items": [
          "Enrollment and Recruitment",
          "Program Viability",
          "Resource Allocation",
          "Budgeting",
          "Procurement",
          "Facilities Utilization",
          "Revenue Generation",
          "Cost Efficiency",
          "Financial Resilience",
          "Maintenance Planning"
        ]
      },
      {
        "category": "Institutional Reputation and Future Readiness",
        "items": [
          "Benchmarking",
          "Responsiveness to emerging Professions",
          "Institutional Branding",
          "Internationalization",
          "Innovation Readiness",
          "Scenario Planning",
          "Continuity and Sustainability •\tContinuity and Sustainability"
        ]
      }
    ],
    "emblem": "assets/agenda/agenda-9-strengthen.png",
    "badges": [
      {
        "text": "STRENGTHEN",
        "bg": "#7b1113",
        "color": "#fff"
      },
      {
        "text": "Lead: Customs Administration & Business Management",
        "bg": "#0b3c5d",
        "color": "#fff"
      },
      {
        "text": "UN SDG 8: Decent Work & Economic Growth",
        "bg": "#a21942",
        "color": "#fff"
      },
      {
        "text": "Institutional Area 5 & 7",
        "bg": "#d97706",
        "color": "#fff"
      }
    ],
    "studies": [
      {
        "title": "Port Clearance Efficiency and Tariff Classification Dispute Analysis at Port of Irene and Port of Aparri",
        "dept": "College of Customs Administration",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Evaluating processing times, automated customs declaration bottlenecks, and valuation disputes across Northern Luzon maritime entry ports."
      },
      {
        "title": "Cold Chain Logistics Gaps and Post-Harvest Spoilage for High-Value Vegetable Producers in Northern Cagayan",
        "dept": "College of Business Administration",
        "status": "Ongoing",
        "statusClass": "status-ongoing",
        "desc": "Quantifying farm-to-market temperature control deficiencies, transit spoilage rates, and refrigerated storage investment feasibility."
      },
      {
        "title": "Digital Financial Inclusion and FinTech Adoption Among Micro and Small Enterprises in Peñablanca Rural Markets",
        "dept": "Business & Accountancy",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Analyzing QR-code payment usage, digital transaction security perceptions, and micro-loan access among public market vendors."
      },
      {
        "title": "Internal Quality Audit (IQA) Maturity and Continuous Quality Improvement in CHED-Accredited Higher Education Programs",
        "dept": "Quality Management Office",
        "status": "Approved Proposal",
        "statusClass": "status-proposal",
        "desc": "Assessing audit finding close-out rates, corrective action effectiveness, and faculty quality culture under ISO 9001:2015 standards."
      },
      {
        "title": "Ethical Leadership Frameworks and Faculty Retention Metrics in Private Higher Education Institutions in Region II",
        "dept": "ISAP Graduate School of Business",
        "status": "Recommended",
        "statusClass": "status-recommended",
        "desc": "Examining administrative transparent decision-making, organizational trust, burnout indices, and long-term academic staff loyalty."
      }
    ],
    "activities": [
      {
        "title": "Annual Customs and Logistics Student Research Summit & Paper Competition",
        "cadence": "Annual Summit",
        "icon": "🚢",
        "desc": "Flagship symposium where customs administration scholars present empirical studies to Bureau of Customs officials and licensed brokers."
      },
      {
        "title": "Strategic Institutional Planning & QMS Quality Policy Review (2026–2030)",
        "cadence": "Annual Retreat",
        "icon": "🏛️",
        "desc": "Senior administration retreat reviewing operational KPIs, academic quality metrics, and alignment with CHED center of development standards."
      },
      {
        "title": "Research & Development Academic Festival (RDaFest) Oral & Poster Sessions",
        "cadence": "Annual Festival",
        "icon": "🎉",
        "desc": "Campus-wide multi-day research celebration featuring oral presentations, panel defenses, exhibits, and institutional awards."
      },
      {
        "title": "MSME Financial Literacy & Supply Chain Mentoring Clinic in Partnership with DTI",
        "cadence": "Quarterly Clinic",
        "icon": "💼",
        "desc": "Business faculty and student extension teams providing bookkeeping, cost accounting, and digital marketing clinics to local micro-entrepreneurs."
      }
    ]
  }
};

let currentAgendaKey = 'inspire';
let currentAgendaTab = 'focus';

function ensureAgendaModalExists() {
  let modal = document.getElementById('agendaModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'agendaModal';
  modal.className = 'agenda-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'agendaModalTitle');

  modal.innerHTML = `
    <div class="agenda-modal-container">
      <div class="agenda-modal-header">
        <div class="agenda-modal-emblem-wrap">
          <img id="agendaModalEmblem" src="" alt="Agenda Emblem">
        </div>
        <div class="agenda-modal-title-area">
          <div class="agenda-modal-badges" id="agendaModalBadges"></div>
          <h3 class="agenda-modal-title" id="agendaModalTitle"></h3>
          <p class="agenda-modal-sub" id="agendaModalSub"></p>
        </div>
        <button type="button" class="agenda-modal-close" onclick="closeAgendaModal()" aria-label="Close dialog">&times;</button>
      </div>

      <div class="agenda-modal-nav-tabs" role="tablist">
        <button type="button" class="agenda-tab-btn active" id="agendaTabBtnFocus" onclick="switchAgendaTab('focus')" role="tab" aria-selected="true">
          <span>🎯 Focus &amp; Outcomes</span>
          <span class="agenda-tab-badge" id="agendaBadgeOutcomesCount">4</span>
        </button>
        <button type="button" class="agenda-tab-btn" id="agendaTabBtnSubtopics" onclick="switchAgendaTab('subtopics')" role="tab" aria-selected="false">
          <span>📋 Priority Subtopics</span>
          <span class="agenda-tab-badge" id="agendaBadgeSubtopicsCount">0</span>
        </button>
        <button type="button" class="agenda-tab-btn" id="agendaTabBtnStudies" onclick="switchAgendaTab('studies')" role="tab" aria-selected="false">
          <span>🔬 Studies &amp; Activities</span>
          <span class="agenda-tab-badge" id="agendaBadgeStudiesCount">0</span>
        </button>
      </div>

      <div class="agenda-modal-body">
        <div class="agenda-tab-pane active" id="agendaPaneFocus" role="tabpanel"></div>
        <div class="agenda-tab-pane" id="agendaPaneSubtopics" role="tabpanel"></div>
        <div class="agenda-tab-pane" id="agendaPaneStudies" role="tabpanel"></div>
      </div>

      <div class="agenda-modal-footer">
        <div class="agenda-switcher-label">Switch INNOVATES Agenda:</div>
        <div class="agenda-pillar-switcher" id="agendaPillarSwitcher"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAgendaModal();
    }
  });

  return modal;
}

window.openAgendaModal = function (pillarKey, tabName = 'focus') {
  if (!pillarKey) pillarKey = 'inspire';
  const cleanKey = String(pillarKey).toLowerCase().replace(/^pillar-?/, '').trim();
  const validKey = window.agendaData[cleanKey] ? cleanKey : 'inspire';
  const data = window.agendaData[validKey];

  currentAgendaKey = validKey;
  const modal = ensureAgendaModalExists();

  // Emblem
  const emblemImg = document.getElementById('agendaModalEmblem');
  emblemImg.src = data.emblem;
  emblemImg.alt = data.title;

  // Badges
  const badgesWrap = document.getElementById('agendaModalBadges');
  badgesWrap.innerHTML = data.badges.map(b =>
    `<span class="dropdown-badge" style="background:${b.bg}; color:${b.color};">${b.text}</span>`
  ).join('');

  // Title & Subtitle (Show concise Focus statement in header)
  document.getElementById('agendaModalTitle').textContent = data.title;
  document.getElementById('agendaModalSub').textContent = data.focus;

  // Counts (Clean compact numbers)
  const totalSubtopics = data.subtopicCategories.reduce((acc, c) => acc + c.items.length, 0);
  document.getElementById('agendaBadgeOutcomesCount').textContent = data.expectedOutcomes.length;
  document.getElementById('agendaBadgeSubtopicsCount').textContent = totalSubtopics;
  document.getElementById('agendaBadgeStudiesCount').textContent = data.studies.length + data.activities.length;

  // Render Pane 1: Focus & Expected Outcomes
  const paneFocus = document.getElementById('agendaPaneFocus');
  paneFocus.innerHTML = `
    <div class="agenda-narrative-box">
      <div class="agenda-narrative-header">
        <span class="agenda-narrative-badge">Strategic Scope &amp; Purpose</span>
        <span class="agenda-narrative-lead">${data.badges[1]?.text || ''}</span>
      </div>
      <p class="agenda-narrative-p">${data.description}</p>
    </div>

    <div class="agenda-focus-box">
      <div class="agenda-focus-icon">🎯</div>
      <div class="agenda-focus-content">
        <div class="agenda-focus-label">Strategic Focus</div>
        <p class="agenda-focus-p">${data.focus}</p>
      </div>
    </div>

    <div class="agenda-outcomes-wrap">
      <h4 class="agenda-subpane-title">🌟 Expected Institutional Outcomes</h4>
      <div class="agenda-outcomes-grid">
        ${data.expectedOutcomes.map((outcome, idx) => `
          <div class="agenda-outcome-card">
            <div class="agenda-outcome-number">${idx + 1}</div>
            <div class="agenda-outcome-text">${outcome}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Render Pane 2: Priority Research Subtopics
  const paneSubtopics = document.getElementById('agendaPaneSubtopics');
  paneSubtopics.innerHTML = `
    <div class="agenda-subtopics-header">
      <div>
        <h4 class="agenda-subpane-title" style="margin-bottom:0.25rem;">📋 Priority Research Subtopics</h4>
        <p style="margin:0; font-size:0.88rem; color:#64748b;">
          Granular thematic inquiry lines and capstone research clusters aligned with ${data.name}.
        </p>
      </div>
      <span class="agenda-subtopics-count-badge">${totalSubtopics} Topics across ${data.subtopicCategories.length} Categories</span>
    </div>
    <div class="agenda-subtopic-categories-grid">
      ${data.subtopicCategories.map(cat => `
        <div class="agenda-subtopic-cat-card">
          <div class="agenda-cat-title-row">
            <h5 class="agenda-cat-name">${cat.category}</h5>
            <span class="agenda-cat-count">${cat.items.length} topics</span>
          </div>
          <ul class="agenda-cat-items-list">
            ${cat.items.map(item => `
              <li class="agenda-cat-item">
                <span class="agenda-item-bullet">&bull;</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;

  // Render Pane 3: Studies & Activities
  const paneStudies = document.getElementById('agendaPaneStudies');
  paneStudies.innerHTML = `
    <div class="agenda-studies-subpane">
      <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:0.9rem 1.15rem; border-radius:0 8px 8px 0; margin-bottom:1.25rem; font-size:0.9rem; color:#14532d;">
        <strong>🔬 Recommended &amp; Ongoing Studies:</strong> Formal research proposals, active investigations, and thesis capstone tracks aligned with ${data.name}.
      </div>
      <div class="agenda-study-list">
        ${data.studies.map(study => `
          <div class="agenda-study-card">
            <div class="agenda-study-header">
              <span class="agenda-study-dept">${study.dept}</span>
              <span class="agenda-study-status ${study.statusClass || 'status-ongoing'}">${study.status}</span>
            </div>
            <h4 class="agenda-study-title">${study.title}</h4>
            <p class="agenda-study-desc">${study.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="agenda-activities-subpane" style="margin-top: 2rem;">
      <div style="background:#fffbeb; border-left:4px solid #d97706; padding:0.9rem 1.15rem; border-radius:0 8px 8px 0; margin-bottom:1.25rem; font-size:0.9rem; color:#78350f;">
        <strong>📅 R&amp;D Programs, Workshops &amp; Colloquiums:</strong> Regular institutional activities, proposal defense cycles, technical clinics, and symposiums driving this agenda.
      </div>
      <div class="agenda-activity-list">
        ${data.activities.map(act => `
          <div class="agenda-activity-item">
            <div class="agenda-activity-icon">${act.icon}</div>
            <div class="agenda-activity-info">
              <div class="agenda-activity-header">
                <h4 class="agenda-activity-title">${act.title}</h4>
                <span class="agenda-activity-cadence">${act.cadence}</span>
              </div>
              <p class="agenda-activity-desc">${act.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Switcher in footer
  const switcherWrap = document.getElementById('agendaPillarSwitcher');
  const pillarsList = [
    { k: 'inspire', label: 'I: INSPIRE' },
    { k: 'nurture', label: 'N: NURTURE' },
    { k: 'navigate', label: 'N: NAVIGATE' },
    { k: 'operationalize', label: 'O: OPERATIONALIZE' },
    { k: 'value', label: 'V: VALUE' },
    { k: 'advance', label: 'A: ADVANCE' },
    { k: 'transform', label: 'T: TRANSFORM' },
    { k: 'expand', label: 'E: EXPAND' },
    { k: 'strengthen', label: 'S: STRENGTHEN' }
  ];

  switcherWrap.innerHTML = pillarsList.map(p => `
    <button type="button" class="pillar-pill-btn ${p.k === validKey ? 'active' : ''}" onclick="openAgendaModal('${p.k}', currentAgendaTab)">
      ${p.label}
    </button>
  `).join('');

  // Normalize tabName
  if (tabName === 'priority') tabName = 'focus';
  if (tabName === 'activities') tabName = 'studies';
  switchAgendaTab(tabName);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.switchAgendaTab = function (tabName) {
  if (tabName === 'priority') tabName = 'focus';
  if (tabName === 'activities') tabName = 'studies';
  currentAgendaTab = tabName;

  const tabBtns = {
    focus: document.getElementById('agendaTabBtnFocus'),
    subtopics: document.getElementById('agendaTabBtnSubtopics'),
    studies: document.getElementById('agendaTabBtnStudies')
  };

  const panes = {
    focus: document.getElementById('agendaPaneFocus'),
    subtopics: document.getElementById('agendaPaneSubtopics'),
    studies: document.getElementById('agendaPaneStudies')
  };

  for (const [key, btn] of Object.entries(tabBtns)) {
    const pane = panes[key];
    if (btn && pane) {
      if (key === tabName) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        pane.classList.add('active');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        pane.classList.remove('active');
      }
    }
  }
};

window.closeAgendaModal = function () {
  const modal = document.getElementById('agendaModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('agendaModal');
    if (modal && modal.classList.contains('active')) {
      closeAgendaModal();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pillarParam = params.get('pillar');
  if (pillarParam && window.agendaData[pillarParam.toLowerCase()]) {
    setTimeout(() => {
      openAgendaModal(pillarParam);
    }, 300);
  }
});

/* ==========================================================================
   12. RESEARCH TRAINING CALENDAR & FAQ ACCORDION INTERACTIVITY
   ========================================================================== */

// --- Training Calendar Filtering & Search ---
window.filterCalendar = function(category, btnElement) {
  const filterBtns = document.querySelectorAll('.cal-filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const rows = document.querySelectorAll('.calendar-row');
  const searchInput = document.getElementById('calendarSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  rows.forEach(row => {
    const rowCategory = row.getAttribute('data-category') || '';
    const rowText = row.textContent.toLowerCase();

    const matchesCategory = (category === 'all' || rowCategory.includes(category));
    const matchesQuery = !query || rowText.includes(query);

    if (matchesCategory && matchesQuery) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });

  // Check empty state
  const visibleRows = document.querySelectorAll('.calendar-row:not([style*="display: none"])');
  let emptyMsg = document.getElementById('calendarEmptyMsg');
  if (visibleRows.length === 0) {
    if (!emptyMsg) {
      const tbody = document.querySelector('.calendar-table tbody');
      if (tbody) {
        emptyMsg = document.createElement('tr');
        emptyMsg.id = 'calendarEmptyMsg';
        emptyMsg.innerHTML = '<td colspan="4" style="text-align:center; padding: 2.5rem; color: #64748b;">No scheduled workshops found matching your criteria. Contact the secretariat to suggest or request a workshop session.</td>';
        tbody.appendChild(emptyMsg);
      }
    }
  } else if (emptyMsg) {
    emptyMsg.remove();
  }

  // Also synchronize Interactive Month Calendar with category filter
  if (category !== 'all' && typeof window.jumpToCalendarDate === 'function') {
    const matched = (window.trainingCalendarEvents || []).find(e => (e.category || '').includes(category));
    if (matched && matched.dates && matched.dates[0]) {
      window.jumpToCalendarDate(matched.dates[0]);
    }
  }
};

window.searchCalendar = function(query) {
  const activeBtn = document.querySelector('.cal-filter-btn.active');
  const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
  window.filterCalendar(category, activeBtn);

  // If search query matches an upcoming event title, jump calendar to it
  const cleanQ = (query || '').toLowerCase().trim();
  if (cleanQ.length >= 3 && typeof window.jumpToCalendarDate === 'function') {
    const matched = (window.trainingCalendarEvents || []).find(e =>
      e.title.toLowerCase().includes(cleanQ) ||
      e.desc.toLowerCase().includes(cleanQ) ||
      (e.shortTag && e.shortTag.toLowerCase().includes(cleanQ))
    );
    if (matched && matched.dates && matched.dates[0]) {
      window.jumpToCalendarDate(matched.dates[0]);
    }
  }
};

// --- Interactive Monthly Date Calendar & Event Inspector ---
window.trainingCalendarEvents = [
  {
    id: 1,
    dates: ['2026-10-23', '2026-10-24'],
    displayDate: 'October 23–24, 2026',
    pillText: 'MCNP Health Sciences',
    pillClass: 'cal-pill-mcnp',
    shortTag: 'Biostatistics',
    title: 'Advanced Biostatistics & Quantitative Modeling with SPSS and Jamovi',
    desc: 'Hands-on statistical workshop on multivariate regression, survival curve analysis, parametric vs. non-parametric hypothesis testing, and statistical clearance preparation (Form 011).',
    participants: 'Faculty Researchers & Clinical Advisers (Nursing, Pharmacy, Radiologic Technology, Medical Laboratory Science)',
    venue: '📍 MCNP Computer Lab B & Hybrid Zoom',
    lead: 'Institutional Biostatistics Unit & Guest Data Scientist',
    category: 'mcnp stats'
  },
  {
    id: 2,
    dates: ['2026-11-12', '2026-11-13'],
    displayDate: 'November 12–13, 2026',
    pillText: 'Institutional Unified',
    pillClass: 'cal-pill-unified',
    shortTag: 'Ethics Review',
    title: 'National Research Ethics Protocol Review & PHREB Compliance Seminar',
    desc: 'Standards of the Philippine Health Research Ethics Board (PHREB Level 1), protocol vulnerability assessments, participant informed consent pledges, and expeditious review routing.',
    participants: 'IERC Members, Faculty & Thesis Proponents (All Health & Multidisciplinary Academic Programs)',
    venue: '📍 Audio-Visual Center (AVC) & Livestream',
    lead: 'Institutional Ethics Review Committee (IERC)',
    category: 'ethics mcnp isap'
  },
  {
    id: 3,
    dates: ['2026-12-04'],
    displayDate: 'December 04, 2026',
    pillText: 'Institutional Unified',
    pillClass: 'cal-pill-unified',
    shortTag: 'Turnitin & Publishing',
    title: 'Turnitin Screening & IMRAD Manuscript Structuring for High-Impact Indexing',
    desc: 'Navigating similarity index thresholds (≤15%), avoiding mosaic plagiarism, structured abstracts, ORCID registration, and preparing manuscripts for OJS and Scopus/WoS submission.',
    participants: 'Publishing Faculty, Authors & Coordinators (MCNP & ISAP Faculty Authors, Journal Editors)',
    venue: '📍 ISAP Computer Laboratory 1',
    lead: 'RDC Editorial Secretariat & Plagiarism Officer',
    category: 'isap mcnp grants'
  },
  {
    id: 4,
    dates: ['2027-01-15', '2027-01-16'],
    displayDate: 'January 15–16, 2027',
    pillText: 'ISAP Multidisciplinary',
    pillClass: 'cal-pill-isap',
    shortTag: 'NVivo / Qualitative',
    title: 'Qualitative Inquiry, Thematic Analysis & Computer-Assisted Coding (NVivo / MAXQDA)',
    desc: 'Phenomenological methods, narrative inquiries, codebook development, inter-coder reliability, and thematic clustering in social science and criminal justice studies.',
    participants: 'Criminology, Business & Education Faculty (ISAP College of Criminal Justice, CBA, CICT, CTE)',
    venue: '📍 ISAP Amphitheater & Media Studio',
    lead: 'Senior Qualitative Research Fellows',
    category: 'isap'
  },
  {
    id: 5,
    dates: ['2027-02-19'],
    displayDate: 'February 19, 2027',
    pillText: 'Institutional Unified',
    pillClass: 'cal-pill-unified',
    shortTag: 'Policy Briefs',
    title: 'Translating Academic Findings into Policy Briefs & Community Utilization Interventions',
    desc: 'The 4 pathways of utilization: transforming clinical and empirical findings into hospital care manuals, municipal ordinances, technology transfer assets, and instructional modules.',
    participants: 'Department Chairs & Community Extension Officers (All Academic Deans, Research Directors, LGU Liaisons)',
    venue: '📍 RDC Boardroom, Administration Building',
    lead: 'Research Director Dr. Ryan C. Fontanilla',
    category: 'isap mcnp'
  },
  {
    id: 6,
    dates: ['2027-03-11', '2027-03-12'],
    displayDate: 'March 11–12, 2027',
    pillText: 'Grants & Funding',
    pillClass: 'cal-pill-unified',
    shortTag: 'Grants Packaging',
    title: 'CHED, DOST, & PCHRD External Grants Proposal Packaging Colloquium',
    desc: 'Comprehensive grant proposal writing masterclass: line-item budgeting (LIB), gender responsiveness (GAD checklist), milestone deliverable formulation, and external funding compliance.',
    participants: 'Tenured Faculty Researchers & Interdisciplinary Clusters (MCNP & ISAP Research Leads)',
    venue: '📍 MCNP-ISAP Multi-Purpose Hall',
    lead: 'RDC Grants Unit with DOST Region 02 Experts',
    category: 'grants mcnp isap'
  },
  {
    id: 7,
    dates: ['2027-04-22', '2027-04-23'],
    displayDate: 'April 22–23, 2027',
    pillText: 'Institutional Culmination',
    pillClass: 'cal-pill-unified',
    shortTag: 'Research Congress',
    title: '2027 MCNP & ISAP Annual Institutional Student & Faculty Research Congress',
    desc: 'Twin-campus oral defense symposium, best undergraduate capstone awards, digital scientific poster competition, and presentation of institutional innovation projects.',
    participants: 'All Students, Faculty Authors & External Reviewers (University-wide Participation)',
    venue: '📍 MCNP-ISAP Gymnasium & Breakout Rooms',
    lead: 'MCNP & ISAP Research Council & Academic Deans',
    category: 'mcnp isap'
  }
];

window.pastCalendarEvents = [
  {
    "id": "past-event-community-needs-assessment",
    "cardId": "event-community-needs-assessment",
    "isPastEvent": true,
    "dates": [
      "2026-09-25"
    ],
    "displayDate": "Sep 25, 2026",
    "pillText": "RDC & CESO Collaboration",
    "pillClass": "cal-pill-past",
    "shortTag": "Community Needs",
    "title": "From Community Needs to Responsive Extension Programs",
    "desc": "The MCNP–ISAP Research and Development Center (RDC), in collaboration with the Community Extension Services Office (CESO), presented the results of the Communit...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/community-assessment-1.jpg"
  },
  {
    "id": "past-event-data-infographics",
    "cardId": "event-data-infographics",
    "isPastEvent": true,
    "dates": [
      "2026-09-25"
    ],
    "displayDate": "Sep 25, 2026",
    "pillText": "Statistical Month 2026",
    "pillClass": "cal-pill-past",
    "shortTag": "Data Infographics",
    "title": "📊 Turning Data into Meaningful Stories",
    "desc": "The MCNP–ISAP Research and Development Center conducted the Statistical Month 2026: Data Interpretation and Infographics Activity on September 25, 2026. The act...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/data-interpretation-5.jpg"
  },
  {
    "id": "past-event-poster-art-showcase",
    "cardId": "event-poster-art-showcase",
    "isPastEvent": true,
    "dates": [
      "2026-09-24"
    ],
    "displayDate": "Sep 24, 2026",
    "pillText": "Poster Art Showcase",
    "pillClass": "cal-pill-past",
    "shortTag": "Data Art Showcase",
    "title": "🎨 When Data Finds Its Voice Through Art",
    "desc": "These winning entries from the MCNP–ISAP Statistical Month Poster-Making Contest show that statistics is more than numbers—it is a powerful tool for understandi...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/poster-activity-1.jpg"
  },
  {
    "id": "past-event-poster-making-activity",
    "cardId": "event-poster-making-activity",
    "isPastEvent": true,
    "dates": [
      "2026-09-23"
    ],
    "displayDate": "Sep 23, 2026",
    "pillText": "Institutional Competition",
    "pillClass": "cal-pill-past",
    "shortTag": "Poster Making",
    "title": "🎨📊 Where Creativity Meets Statistics",
    "desc": "The MCNP–ISAP Research and Development Center conducted the Statistical Month 2026 Poster-Making Activity on September 23, 2026. Participants transformed statis...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/poster-activity-19.jpg"
  },
  {
    "id": "past-event-tourism-defense",
    "cardId": "event-tourism-defense",
    "isPastEvent": true,
    "dates": [
      "2026-09-22",
      "2026-09-23"
    ],
    "displayDate": "Sep 22–23, 2026",
    "pillText": "BS Tourism Management",
    "pillClass": "cal-pill-past",
    "shortTag": "Tourism Defense",
    "title": "BS Tourism Management Students Connect Research Proposals with Global Goals",
    "desc": "BS Tourism Management students successfully presented and defended their research proposals on September 22–23, 2026, demonstrating their developing competence ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/tourism-defense-1.jpg"
  },
  {
    "id": "past-event-statistical-quiz-bee",
    "cardId": "event-statistical-quiz-bee",
    "isPastEvent": true,
    "dates": [
      "2026-09-21"
    ],
    "displayDate": "Sep 21, 2026",
    "pillText": "Statistical Month Quiz Bee",
    "pillClass": "cal-pill-past",
    "shortTag": "Stats Quiz Bee",
    "title": "📊 Numbers, Knowledge, and a Winning Spirit!",
    "desc": "The MCNP–ISAP Statistical Month Institutional Quiz Bee brought students together on September 21, 2026, to test their knowledge of statistics and celebrate the ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/quiz-bee-13.jpg"
  },
  {
    "id": "past-event-data-skills",
    "cardId": "event-data-skills",
    "isPastEvent": true,
    "dates": [
      "2026-09-17",
      "2026-09-18"
    ],
    "displayDate": "Sep 17–18, 2026",
    "pillText": "Professional Development",
    "pillClass": "cal-pill-past",
    "shortTag": "Health Data Skills",
    "title": "Strengthening Data Skills for Better Health Research",
    "desc": "RDC staff from MCNP and ISAP participated in the Training on Data Analytics and Data Presentation for Health Research held on September 17–18, 2026, at Philippi...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/health-research-analytics-1.jpg"
  },
  {
    "id": "past-event-pharmacy-research",
    "cardId": "event-pharmacy-research",
    "isPastEvent": true,
    "dates": [
      "2026-09-17",
      "2026-09-18"
    ],
    "displayDate": "Sep 17–18, 2026",
    "pillText": "BS Pharmacy",
    "pillClass": "cal-pill-past",
    "shortTag": "Pharmacy Research",
    "title": "Pharmacy Research with Purpose: Every Study, a Goal and an Impact",
    "desc": "BS Pharmacy students presented and defended their research proposals on September 17–18, 2026, at the Research Office. Beyond demonstrating their knowledge and ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/pharmacy-defense-1.jpg"
  },
  {
    "id": "past-event-problems-to-purpose",
    "cardId": "event-problems-to-purpose",
    "isPastEvent": true,
    "dates": [
      "2026-09-16"
    ],
    "displayDate": "Sep 16, 2026",
    "pillText": "General Education Department",
    "pillClass": "cal-pill-past",
    "shortTag": "Problems to Purpose",
    "title": "From Problems to Purpose: Strengthening Research Capacity",
    "desc": "The General Education Department, in collaboration with the MCNP–ISAP Research and Development Center, conducted a Research Colloquium and Capacity-Building Pro...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/colloquium-1.jpg"
  },
  {
    "id": "past-event-leading-through-inquiry",
    "cardId": "event-leading-through-inquiry",
    "isPastEvent": true,
    "dates": [
      "2026-09-16"
    ],
    "displayDate": "Sep 16, 2026",
    "pillText": "Academic Heads",
    "pillClass": "cal-pill-past",
    "shortTag": "Inquiry & Evidence",
    "title": "Leading Through Inquiry, Improving Through Evidence",
    "desc": "The MCNP–ISAP Research and Development Center conducted the Academic Heads Research Proposal Defense on September 16, 2026, featuring research proposals from th...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/proposal-defense-sep16-1.jpg"
  },
  {
    "id": "past-event-numbers-to-narratives",
    "cardId": "event-numbers-to-narratives",
    "isPastEvent": true,
    "dates": [
      "2026-09-15"
    ],
    "displayDate": "Sep 15, 2026",
    "pillText": "Data Appreciation",
    "pillClass": "cal-pill-past",
    "shortTag": "Data Narratives",
    "title": "From Numbers to Narratives: Making Data Meaningful",
    "desc": "The MCNP–ISAP Research and Development Center conducted the Stat. Month Data Appreciation Seminar via Zoom on September 15, 2026, with first-year students and f...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/stat-seminar-1.png"
  },
  {
    "id": "past-event-research-leadership",
    "cardId": "event-research-leadership",
    "isPastEvent": true,
    "dates": [
      "2026-09-09"
    ],
    "displayDate": "Sep 9, 2026",
    "pillText": "Academic Heads",
    "pillClass": "cal-pill-past",
    "shortTag": "Research Leadership",
    "title": "Research Leadership in Action",
    "desc": "The MCNP–ISAP Research and Development Center conducted the Academic Heads Research Proposal Defense on September 9, 2026. Academic leaders presented and defend...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/proposal-defense-sep9-1.jpg"
  },
  {
    "id": "past-event-innovation-to-opportunity",
    "cardId": "event-innovation-to-opportunity",
    "isPastEvent": true,
    "dates": [
      "2026-09-09",
      "2026-09-10",
      "2026-09-11"
    ],
    "displayDate": "Sep 9–11, 2026",
    "pillText": "Cagayan Valley STI Week",
    "pillClass": "cal-pill-past",
    "shortTag": "Innovation Funding",
    "title": "From Innovation to Opportunity: Advancing Ideas for Possible Funding",
    "desc": "Faculty delegates from MCNP and ISAP participated in the 2026 Cagayan Valley Regional Science, Technology, and Innovation Week, held on September 9–11, 2026, in...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/sti-week-1.jpg"
  },
  {
    "id": "past-event-research-sees-everyone",
    "cardId": "event-research-sees-everyone",
    "isPastEvent": true,
    "dates": [
      "2026-09-09",
      "2026-09-10"
    ],
    "displayDate": "Sep 9–10, 2026",
    "pillText": "Regional Seminar-Training",
    "pillClass": "cal-pill-past",
    "shortTag": "Gender-Responsive",
    "title": "Research That Sees Everyone: Advancing Knowledge through a Gender-Responsive Lens",
    "desc": "MCNP–ISAP personnel participated in the Regional Seminar-Training on Gender Research, held on September 9–10, 2026, at CSU Andrews Campus, Tuguegarao City. The ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/gender-research-1.jpg"
  },
  {
    "id": "past-event-samples-to-statistics",
    "cardId": "event-samples-to-statistics",
    "isPastEvent": true,
    "dates": [
      "2026-08-28"
    ],
    "displayDate": "Aug 28, 2026",
    "pillText": "Episode 2",
    "pillClass": "cal-pill-past",
    "shortTag": "Samples to Stats",
    "title": "From Samples to Statistics: Turning Data into Meaningful Discoveries",
    "desc": "The ISAP High School Research Summit–Episode 2, held online on August 28, 2026, featured Dr. Ryan C. Fontanilla on Sampling Techniques and Research Designs and ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/research-summit-1.jpg"
  },
  {
    "id": "past-event-sdg-spot-launch",
    "cardId": "event-sdg-spot-launch",
    "isPastEvent": true,
    "dates": [
      "2026-08-28"
    ],
    "displayDate": "Aug 28, 2026",
    "pillText": "Research for the Goals",
    "pillClass": "cal-pill-past",
    "shortTag": "SDG Spot Launch",
    "title": "Pick a Goal. Raise Your Flag. Make Your Impact.",
    "desc": "The SDG SPOT @ RDC: Research for the Goals officially came to life through its soft opening on August 28, 2026, in front of the Research and Development Center....",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/sdg-spot-1.jpg"
  },
  {
    "id": "past-event-equipping-students",
    "cardId": "event-equipping-students",
    "isPastEvent": true,
    "dates": [
      "2026-08-24"
    ],
    "displayDate": "Aug 24, 2026",
    "pillText": "Community Extension Services",
    "pillClass": "cal-pill-past",
    "shortTag": "Student Community",
    "title": "Equipping Students for Meaningful Community Engagement",
    "desc": "The MCNP–ISAP Community Extension Services Office conducted the seminar and field orientation titled &ldquo;Listening to the Community: Qualitative Data Gatheri...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/community-ext-1.jpg"
  },
  {
    "id": "past-event-general-assembly",
    "cardId": "event-general-assembly",
    "isPastEvent": true,
    "dates": [
      "2026-08-24"
    ],
    "displayDate": "Aug 24, 2026",
    "pillText": "MCNP–ISAP RDC",
    "pillClass": "cal-pill-past",
    "shortTag": "General Assembly",
    "title": "Strengthening Research Through Shared Direction",
    "desc": "The MCNP–ISAP Research and Development Center convened its General Assembly 2026 on August 24, bringing together RDC personnel and research focal persons to rev...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/assembly-1.jpg"
  },
  {
    "id": "past-event-health-research-collaboration",
    "cardId": "event-health-research-collaboration",
    "isPastEvent": true,
    "dates": [
      "2026-08-19",
      "2026-08-20"
    ],
    "displayDate": "Aug 19–20, 2026",
    "pillText": "RRF Technical Review",
    "pillClass": "cal-pill-past",
    "shortTag": "Health Collab",
    "title": "Advancing Health Research Through Collaboration",
    "desc": "MCNP and ISAP proudly co-hosted the Regional Research Fund (RRF) Technical Review Board Evaluation on August 19–20, 2026, in partnership with DOST–Cagayan Valle...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/health-research-1.jpg"
  },
  {
    "id": "past-event-icir-2026",
    "cardId": "event-icir-2026",
    "isPastEvent": true,
    "dates": [
      "2026-08-07"
    ],
    "displayDate": "Aug 07, 2026",
    "pillText": "ISAP-K Conference",
    "pillClass": "cal-pill-past",
    "shortTag": "ICIR 2026",
    "title": "Research for Sustainable Impact",
    "desc": "The 1st ISAP-K Conference on Interdisciplinary Research (ICIR 2026), themed \"Unifying Perspectives: Empowering Student Investigators Across Disciplines to Advan...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/icir-1.jpg"
  },
  {
    "id": "past-event-cbcp-ust-collab",
    "cardId": "event-cbcp-ust-collab",
    "isPastEvent": true,
    "dates": [
      "2024-11-17"
    ],
    "displayDate": "Nov 17, 2024",
    "pillText": "MCNP-ISAP RDC",
    "pillClass": "cal-pill-past",
    "shortTag": "CBCP-UST Collab",
    "title": "RDC Joins CBCP-UST Collaborative Project on Catholic Christianity",
    "desc": "The MCNP-ISAP Research and Development Center, led by Research Director Ryan C. Fontanilla, participated in the CBCP and University of Santo Tomas project at th...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/1.jpg"
  },
  {
    "id": "past-event-fontanilla-tejada-collab",
    "cardId": "event-fontanilla-tejada-collab",
    "isPastEvent": true,
    "dates": [
      "2024-10-08"
    ],
    "displayDate": "Oct 08, 2024",
    "pillText": "Research Collaboration",
    "pillClass": "cal-pill-past",
    "shortTag": "Research Collab",
    "title": "Research Director Ryan C. Fontanilla and IT Dean Engr. Myke Albert Tejada Participate in Collaborative Study",
    "desc": "Research Director Ryan C. Fontanilla and IT Dean Engr. Myke Albert Tejada represented MCNP and ISAP at the Archdiocese of Tuguegarao meeting for the CBCP-UST in...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/fontanilla-tejada-1.jpg"
  },
  {
    "id": "past-event-rdafest-champion-2024",
    "cardId": "event-rdafest-champion-2024",
    "isPastEvent": true,
    "dates": [
      "2024-10-03",
      "2024-10-04"
    ],
    "displayDate": "Oct 03–04, 2024",
    "pillText": "RDaFest 2024",
    "pillClass": "cal-pill-past",
    "shortTag": "RDAFest Champion",
    "title": "Region 2 Emerges as Overall Champion",
    "desc": "Representing Cagayan Valley, delegates from USLT, MCNP, SFC, QSU Cabarroguis, and SMU secured the Overall Champion title at the 2024 Regional Data Festival for ...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/rdafest-champion-1.jpg"
  },
  {
    "id": "past-event-stats-color-fun-run",
    "cardId": "event-stats-color-fun-run",
    "isPastEvent": true,
    "dates": [
      "2024-10-04"
    ],
    "displayDate": "Oct 04, 2024",
    "pillText": "Color Fun Run",
    "pillClass": "cal-pill-past",
    "shortTag": "Stats Fun Run",
    "title": "School Statisticians Join the 35th National Statistics Month Color Fun Run",
    "desc": "Ms. Cristine Kae Aragon and Ms. Guadalupe Agabin represented their institution in the Philippine Statistics Authority event in Tuguegarao City, promoting awaren...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/stats-colorrun-1.jpg"
  },
  {
    "id": "past-event-lapus-rdafest-2024",
    "cardId": "event-lapus-rdafest-2024",
    "isPastEvent": true,
    "dates": [
      "2024-10-03",
      "2024-10-04"
    ],
    "displayDate": "Oct 03–04, 2024",
    "pillText": "RDaFest 2024",
    "pillClass": "cal-pill-past",
    "shortTag": "RDAFest Delegate",
    "title": "Wendy Mae G. Lapus Represents ISAP at Regional Data Festival",
    "desc": "Ms. Lapus presented \"A Relationship Study between Job Demands, Resources, and Personnel Motivation in HEIs: The Case of the International School of Asia and the...",
    "participants": "MCNP & ISAP Faculty, Students & Researchers",
    "venue": "📍 MCNP & ISAP Campus",
    "lead": "RDC & Partner Academic Departments",
    "category": "past",
    "img": "upload/lapus-rdafest-1.jpg"
  }
];

window.getAllCalendarEvents = function() {
  const roadmapEvents = window.trainingCalendarEvents || [];
  const pastEvents = window.pastCalendarEvents || [];
  return [...roadmapEvents, ...pastEvents];
};

window.interactiveCalState = {
  year: 2026,
  month: 9, // 0-indexed: 9 = October
  selectedDate: '2026-10-23'
};

const CAL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

window.renderInteractiveCalendar = function(year, month) {
  const grid = document.getElementById('calDaysGrid');
  const monthLabel = document.getElementById('calCurrentMonthLabel');
  const jumpSelect = document.getElementById('calMonthJumpSelect');
  if (!grid || !monthLabel) return;

  window.interactiveCalState.year = year;
  window.interactiveCalState.month = month;

  monthLabel.textContent = `${CAL_MONTH_NAMES[month]} ${year}`;

  // Sync jump dropdown if matched
  const ymKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  if (jumpSelect) {
    const matchingOption = Array.from(jumpSelect.options).find(opt => opt.value === ymKey);
    if (matchingOption) {
      jumpSelect.value = ymKey;
    }
  }

  grid.innerHTML = '';

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Preceding month padding days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.innerHTML = `<span class="day-number">${prevMonthDays - i}</span>`;
    grid.appendChild(cell);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.setAttribute('data-date', dateStr);

    const matchingEvents = window.getAllCalendarEvents().filter(e => e.dates.includes(dateStr));
    const hasEvent = matchingEvents.length > 0;
    const hasPast = matchingEvents.some(e => e.isPastEvent);
    const hasRoadmap = matchingEvents.some(e => !e.isPastEvent);

    if (hasEvent) {
      cell.classList.add('has-event');
      if (hasPast && !hasRoadmap) {
        cell.classList.add('has-past-event');
      }
      cell.title = matchingEvents.map(e => e.title).join(' | ');
    }

    if (dateStr === window.interactiveCalState.selectedDate) {
      cell.classList.add('selected');
    }

    let cellHTML = `<span class="day-number">${day}</span>`;
    if (hasEvent) {
      if (matchingEvents.length === 1) {
        cellHTML += `<span class="day-event-tag" title="${matchingEvents[0].title}">${matchingEvents[0].shortTag}</span>`;
      } else {
        cellHTML += `<span class="day-event-tag" title="${matchingEvents.map(e => e.title).join(' | ')}">${matchingEvents[0].shortTag} +${matchingEvents.length - 1}</span>`;
      }
    }
    cell.innerHTML = cellHTML;

    cell.addEventListener('click', function() {
      window.selectCalendarDate(dateStr, matchingEvents);
    });

    grid.appendChild(cell);
  }

  // Trailing month padding days to complete grid row (multiple of 7)
  const totalCells = firstDayOfWeek + daysInMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailingCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.innerHTML = `<span class="day-number">${i}</span>`;
    grid.appendChild(cell);
  }
};

window.selectCalendarDate = function(dateStr, directMatchingEvents) {
  window.interactiveCalState.selectedDate = dateStr;

  // Highlight selected cell in grid
  const allCells = document.querySelectorAll('.cal-day-cell:not(.other-month)');
  allCells.forEach(cell => {
    if (cell.getAttribute('data-date') === dateStr) {
      cell.classList.add('selected');
    } else {
      cell.classList.remove('selected');
    }
  });

  const matchingEvents = directMatchingEvents || window.getAllCalendarEvents().filter(e => e.dates.includes(dateStr));
  const dateHeader = document.getElementById('inspectorSelectedDateLabel');
  const badgeWrap = document.getElementById('inspectorBadgeWrap');
  const contentWrap = document.getElementById('inspectorContent');

  if (!contentWrap) return;

  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const dObj = new Date(y, m, d);
  const formattedDateTitle = dObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (dateHeader) {
    dateHeader.textContent = formattedDateTitle;
  }

  if (matchingEvents.length === 1) {
    const event = matchingEvents[0];
    if (badgeWrap) {
      if (event.isPastEvent) {
        badgeWrap.innerHTML = `<span class="cal-pill cal-pill-past">Completed Event</span> <span class="cal-pill ${event.pillClass || 'cal-pill-past'}">${event.pillText}</span>`;
      } else {
        badgeWrap.innerHTML = `<span class="cal-pill ${event.pillClass}">${event.pillText}</span>`;
      }
    }

    let actionsHTML = '';
    if (event.isPastEvent && event.cardId) {
      actionsHTML = `
        <div class="inspector-actions">
          <button type="button" class="btn btn-sm btn-primary" onclick="window.openEventModalById('${event.cardId}')" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
            📖 Read Full Story &amp; Photos
          </button>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.scrollToArticleCard('${event.cardId}')" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
            🔍 View in Highlights Grid
          </button>
        </div>
      `;
    } else {
      actionsHTML = `
        <div class="inspector-actions">
          <button type="button" class="btn btn-sm btn-primary" onclick="window.scrollToTableEvent(${event.id})" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
            📋 Highlight in Schedule Table
          </button>
          <a href="contact.html?inquiry=training" class="btn btn-sm btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
            💬 Inquire About Workshop
          </a>
        </div>
      `;
    }

    contentWrap.innerHTML = `
      ${event.img ? `<img src="${event.img}" class="inspector-event-thumb" alt="${event.title}" loading="lazy">` : ''}
      <h4 class="inspector-event-title">${event.title}</h4>
      <div class="inspector-meta-item">
        <strong>📅 Schedule:</strong>
        <span style="font-weight: 700; color: #1e5ea8;">${event.displayDate}</span>
      </div>
      <div class="inspector-event-desc">
        ${event.desc}
      </div>
      <div class="inspector-meta-item">
        <strong>👥 Target:</strong>
        <span>${event.participants || 'MCNP & ISAP Academic Community'}</span>
      </div>
      <div class="inspector-meta-item">
        <strong>📍 Venue &amp; Lead:</strong>
        <div>
          <div>${event.venue || 'MCNP & ISAP Campus'}</div>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.2rem;">${event.lead || 'RDC Secretariat'}</div>
        </div>
      </div>
      ${actionsHTML}
    `;
  } else if (matchingEvents.length > 1) {
    if (badgeWrap) {
      badgeWrap.innerHTML = `<span class="cal-pill cal-pill-unified">${matchingEvents.length} Events on this Date</span>`;
    }

    let itemsHTML = '';
    matchingEvents.forEach((ev) => {
      itemsHTML += `
        <div class="inspector-multi-event-item">
          <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
            ${ev.isPastEvent ? '<span class="cal-pill cal-pill-past">Completed Event</span>' : '<span class="cal-pill cal-pill-mcnp">Scheduled Workshop</span>'}
            <span class="cal-pill ${ev.pillClass || 'cal-pill-past'}">${ev.pillText}</span>
          </div>
          ${ev.img ? `<img src="${ev.img}" class="inspector-event-thumb" alt="${ev.title}" style="height: 100px;" loading="lazy">` : ''}
          <h4 class="inspector-event-title" style="font-size: 1.05rem;">${ev.title}</h4>
          <p style="font-size: 0.84rem; color: #475569; margin: 0.35rem 0 0.6rem; line-height: 1.45;">${ev.desc}</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${ev.cardId ? `
              <button type="button" class="btn btn-sm btn-primary" onclick="window.openEventModalById('${ev.cardId}')" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                📖 Read Story &amp; Photos
              </button>
              <button type="button" class="btn btn-sm btn-outline" onclick="window.scrollToArticleCard('${ev.cardId}')" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                🔍 View in Grid
              </button>
            ` : `
              <button type="button" class="btn btn-sm btn-primary" onclick="window.scrollToTableEvent(${ev.id})" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                📋 Highlight in Table
              </button>
            `}
          </div>
        </div>
      `;
    });

    contentWrap.innerHTML = itemsHTML;
  } else {
    // Empty state
    if (badgeWrap) {
      badgeWrap.innerHTML = `<span style="font-size: 0.76rem; color: #64748b; font-weight: 600;">No Event Scheduled</span>`;
    }

    contentWrap.innerHTML = `
      <div class="inspector-empty">
        <div class="inspector-empty-icon">📅</div>
        <div class="inspector-empty-title">No Workshop or Event on This Date</div>
        <div class="inspector-empty-desc">
          There are no research trainings or events recorded for <strong>${formattedDateTitle}</strong>. You can browse other scheduled dates on the calendar or jump to the next session.
        </div>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem;">
          <button type="button" class="btn btn-sm btn-primary" onclick="window.jumpToNextEvent('${dateStr}')" style="font-size: 0.82rem; padding: 0.45rem 0.95rem;">
            Jump to Next Event &rarr;
          </button>
          <a href="contact.html?inquiry=training" class="btn btn-sm btn-outline" style="font-size: 0.82rem; padding: 0.45rem 0.95rem;">
            Request Training
          </a>
        </div>
      </div>
    `;
  }
};

// Global fallback methods for cross-linking calendar to event modal & highlights grid
if (typeof window.openEventModalById !== 'function') {
  window.openEventModalById = function(cardId) {
    const card = document.getElementById(cardId);
    if (card && typeof window.openModal === 'function') {
      const events = window.newsEventsList || [];
      const idx = events.findIndex(e => e.id === cardId);
      if (idx !== -1) {
        window.openModal(idx);
        return true;
      }
    }
    window.location.href = 'news-events.html?event=' + encodeURIComponent(cardId) + '#' + encodeURIComponent(cardId);
    return true;
  };
}

if (typeof window.scrollToArticleCard !== 'function') {
  window.scrollToArticleCard = function(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.transition = 'box-shadow 0.3s ease, outline 0.3s ease';
      card.style.outline = '3px solid #0d5c3a';
      card.style.boxShadow = '0 0 25px rgba(13, 92, 58, 0.4)';
      setTimeout(() => {
        card.style.outline = '';
        card.style.boxShadow = '';
      }, 2500);
      return;
    }
    window.location.href = 'news-events.html#' + encodeURIComponent(cardId);
  };
}

window.jumpToCalendarDate = function(dateStr) {
  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;

  window.renderInteractiveCalendar(y, m);
  window.selectCalendarDate(dateStr);

  const container = document.getElementById('interactiveCalendarSection');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

window.scrollToTableEvent = function(eventId) {
  // Ensure table filters don't hide the target row
  const allFilterBtn = document.querySelector('.cal-filter-btn[data-filter="all"]');
  if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
    window.filterCalendar('all', allFilterBtn);
  }
  const searchInput = document.getElementById('calendarSearchInput');
  if (searchInput && searchInput.value) {
    searchInput.value = '';
    window.filterCalendar('all', allFilterBtn);
  }

  const rows = document.querySelectorAll('.calendar-table tbody tr.calendar-row');
  if (rows && rows[eventId - 1]) {
    const targetRow = rows[eventId - 1];
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetRow.style.transition = 'background-color 0.4s ease, box-shadow 0.4s ease';
    const originalBg = targetRow.style.backgroundColor;
    targetRow.style.backgroundColor = '#e0f2fe';
    targetRow.style.boxShadow = '0 0 15px rgba(30, 94, 168, 0.35)';
    setTimeout(() => {
      targetRow.style.backgroundColor = originalBg;
      targetRow.style.boxShadow = '';
    }, 2000);
  }
};

// Chronological event jumping
window.jumpToNextEvent = function(currentDateStr) {
  const allEvents = window.getAllCalendarEvents()
    .slice()
    .sort((a, b) => (a.dates[0] || '').localeCompare(b.dates[0] || ''));

  // Find next event whose start date is strictly after currentDateStr
  let nextEvent = allEvents.find(e => e.dates[0] > currentDateStr);
  if (!nextEvent) {
    // Loop back to earliest event
    nextEvent = allEvents[0];
  }
  if (nextEvent && nextEvent.dates && nextEvent.dates[0]) {
    window.jumpToCalendarDate(nextEvent.dates[0]);
  }
};

// Select the first chronological event in a given month, or the 1st of the month if none
window.selectFirstEventOrDayInMonth = function(year, month) {
  const ymKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const allEvents = window.getAllCalendarEvents();
  const monthEvents = allEvents
    .filter(e => e.dates && e.dates.some(d => d.startsWith(ymKey)))
    .sort((a, b) => (a.dates[0] || '').localeCompare(b.dates[0] || ''));

  if (monthEvents.length > 0) {
    window.selectCalendarDate(monthEvents[0].dates[0], [monthEvents[0]]);
  } else {
    window.selectCalendarDate(`${ymKey}-01`, []);
  }
};

// Initialize interactive calendar when DOM loads
function initInteractiveCalendar() {
  const calGrid = document.getElementById('calDaysGrid');
  if (calGrid) {
    // Render default month (October 2026)
    window.renderInteractiveCalendar(2026, 9);
    // Select default date (October 23, 2026)
    window.selectCalendarDate('2026-10-23');

    // Prev / Next button listeners
    const prevBtn = document.getElementById('calPrevMonthBtn');
    const nextBtn = document.getElementById('calNextMonthBtn');
    const jumpSelect = document.getElementById('calMonthJumpSelect');

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        let y = window.interactiveCalState.year;
        let m = window.interactiveCalState.month - 1;
        if (m < 0) {
          m = 11;
          y--;
        }
        window.renderInteractiveCalendar(y, m);
        window.selectFirstEventOrDayInMonth(y, m);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        let y = window.interactiveCalState.year;
        let m = window.interactiveCalState.month + 1;
        if (m > 11) {
          m = 0;
          y++;
        }
        window.renderInteractiveCalendar(y, m);
        window.selectFirstEventOrDayInMonth(y, m);
      });
    }

    if (jumpSelect) {
      jumpSelect.addEventListener('change', function() {
        const val = jumpSelect.value;
        if (val) {
          const parts = val.split('-');
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          window.renderInteractiveCalendar(y, m);
          window.selectFirstEventOrDayInMonth(y, m);
        }
      });
    }

    // Connect table rows so clicking any row jumps to calendar
    const tableRows = document.querySelectorAll('.calendar-table tbody tr.calendar-row');
    tableRows.forEach((row, idx) => {
      row.style.cursor = 'pointer';
      row.title = 'Click to view on interactive date calendar';
      const eventData = window.trainingCalendarEvents[idx];
      if (eventData) {
        row.addEventListener('click', function(e) {
          if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            window.jumpToCalendarDate(eventData.dates[0]);
          }
        });
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractiveCalendar);
} else {
  initInteractiveCalendar();
}

// --- FAQ Filtering, Search & Expand / Collapse ---
window.toggleAllFaqs = function(expand) {
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    if (expand) {
      card.setAttribute('open', '');
    } else {
      card.removeAttribute('open');
    }
  });
};

window.filterFaqCategory = function(category, chipElement) {
  const chips = document.querySelectorAll('.faq-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (chipElement) chipElement.classList.add('active');

  const searchInput = document.getElementById('faqSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const text = card.textContent.toLowerCase();

    const matchesCat = (category === 'all' || cardCat.includes(category));
    const matchesQuery = !query || text.includes(query);

    if (matchesCat && matchesQuery) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  const visibleFaqs = document.querySelectorAll('.faq-card:not([style*="display: none"])');
  let emptyMsg = document.getElementById('faqEmptyMsg');
  if (visibleFaqs.length === 0) {
    if (!emptyMsg) {
      const container = document.querySelector('.faq-container');
      if (container) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'faqEmptyMsg';
        emptyMsg.style.cssText = 'text-align: center; padding: 2.5rem 1rem; color: #64748b; background: #fff; border-radius: 10px; border: 1px dashed var(--border-color);';
        emptyMsg.innerHTML = '<p style="font-weight: 600; margin-bottom: 0.5rem;">No matching frequently asked questions found.</p><p style="font-size: 0.88rem;">Have a specific question? Please reach out via our contact inquiry form or email us at <a href="mailto:researchoffice@mcnp.edu.ph" style="color:var(--mcnp-green);text-decoration:underline;">researchoffice@mcnp.edu.ph</a>.</p>';
        container.appendChild(emptyMsg);
      }
    }
  } else if (emptyMsg) {
    emptyMsg.remove();
  }
};

window.searchFaqs = function(query) {
  const activeChip = document.querySelector('.faq-chip.active');
  const category = activeChip ? activeChip.getAttribute('data-category') : 'all';
  window.filterFaqCategory(category, activeChip);
};

// Auto initialize on load if relevant
document.addEventListener('DOMContentLoaded', () => {
  const calSearch = document.getElementById('calendarSearchInput');
  if (calSearch) {
    calSearch.addEventListener('input', (e) => {
      window.searchCalendar(e.target.value);
    });
  }

  const faqSearch = document.getElementById('faqSearchInput');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      window.searchFaqs(e.target.value);
    });
  }
});

// Helper for opening utilization pillar modal from navbar dropdown or cross-page links
window.openUtilizationPillar = function(pillarKey) {
  if (typeof window.openUtilizationModal === 'function') {
    window.openUtilizationModal(pillarKey, 'pathway');
  } else {
    window.location.href = 'utilization.html#pillar-' + pillarKey;
  }
};
