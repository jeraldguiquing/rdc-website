    // Title Click Accordion Logic
    document.querySelectorAll('.doc-title-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.doc-item');
        const isOpen = item.classList.contains('open');
        
        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Course & Category Filtering Logic
    let currentCourseFilter = 'all';
    let currentCategoryFilter = 'all';

    function applyResourceFilters() {
      const courseNames = {
        'all': 'the Medical Colleges of Northern Philippines (MCNP) Allied Health programs (Nursing, RadTech, MLS, Pharmacy, and Physical Therapy)',
        'pharmacy': 'BS Pharmacy',
        'nursing': 'BS Nursing',
        'mls': 'BS Medical Laboratory Science (MedTech)',
        'radtech': 'BS Radiologic Technology',
        'pt': 'BS Physical Therapy'
      };

      const courseLabels = {
        'all': 'All 5 allied health programs in curation',
        'pharmacy': 'BS Pharmacy archives in curation',
        'nursing': 'BS Nursing archives in curation',
        'mls': 'BS MedTech / MLS archives in curation',
        'radtech': 'BS RadTech archives in curation',
        'pt': 'BS Physical Therapy archives in curation'
      };

      const countEl = document.getElementById('visibleDocCount');
      if (countEl) {
        countEl.textContent = courseLabels[currentCourseFilter] || 'Selected health program in curation';
      }

      const targetEl = document.getElementById('soonMcnpCourseTarget');
      if (targetEl) {
        targetEl.textContent = courseNames[currentCourseFilter] || currentCourseFilter.toUpperCase();
      }
    }

    // Course Filter Pills
    document.querySelectorAll('.course-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.course-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCourseFilter = pill.getAttribute('data-course');
        applyResourceFilters();
      });
    });

    // Institutional / Category Filter Buttons (Unified Portal)
    document.querySelectorAll('.doc-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.doc-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategoryFilter = btn.getAttribute('data-filter');
        applyResourceFilters();
      });
    });

    // Global Reset Filter function
    window.resetDocFilters = function() {
      currentCourseFilter = 'all';
      currentCategoryFilter = 'all';
      document.querySelectorAll('.course-pill').forEach(p => {
        if (p.getAttribute('data-course') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      document.querySelectorAll('.doc-filter-btn').forEach(b => {
        if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      applyResourceFilters();
    };

    // Lightbox Logic
    const lightbox = document.getElementById('docLightbox');
    const lightboxImg = document.getElementById('docLightboxImg');
    const lightboxCaption = document.getElementById('docLightboxCaption');
    const lightboxClose = document.getElementById('docLightboxClose');

    if (lightbox) {
      document.querySelectorAll('.doc-gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          const img = thumb.querySelector('img');
          if (img) {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || 'Institutional Research Documentation';
            lightbox.classList.add('active');
          }
        });
      });

      lightboxClose?.addEventListener('click', () => lightbox.classList.remove('active'));
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
      });
    }

    // Run initial filter count
    applyResourceFilters();
