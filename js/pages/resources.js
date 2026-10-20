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
      const items = document.querySelectorAll('.doc-item');
      let visibleCount = 0;
      const mcnpCourses = ['pharmacy', 'nursing', 'mls', 'radtech', 'pt'];
      const isapCourses = ['criminology', 'it', 'computer-eng', 'tourism', 'hospitality', 'social-work', 'psychology', 'bsed', 'bped', 'accountancy', 'customs', 'business'];

      const isMcnpCourse = mcnpCourses.includes(currentCourseFilter);
      const isIsapCourse = isapCourses.includes(currentCourseFilter);

      const isAll = (currentCategoryFilter === 'all' && currentCourseFilter === 'all');
      const showMcnp = (currentCategoryFilter === 'mcnp') || isMcnpCourse || isAll;
      const showIsap = (currentCategoryFilter === 'isap') || isIsapCourse || isAll;

      const mcnpNotice = document.getElementById('mcnpNoticeBanner');
      const isapNotice = document.getElementById('isapNoticeBanner');

      if (mcnpNotice) {
        mcnpNotice.style.display = showMcnp ? 'block' : 'none';
      }
      if (isapNotice) {
        isapNotice.style.display = showIsap ? 'block' : 'none';
      }

      items.forEach(item => {
        const rawCourses = item.getAttribute('data-courses') || '';
        const courseList = rawCourses.trim().split(/\s+/);
        const itemCat = item.getAttribute('data-category') || 'all';

        const matchesCourse = (currentCourseFilter === 'all') || 
                              courseList.includes(currentCourseFilter) || 
                              courseList.includes('all');
        const matchesCat = (currentCategoryFilter === 'all') || 
                            (itemCat === currentCategoryFilter);

        if (matchesCourse && matchesCat && !isMcnpCourse && !isIsapCourse && currentCategoryFilter !== 'mcnp' && currentCategoryFilter !== 'isap') {
          item.style.display = 'block';
          visibleCount++;
        } else {
          item.style.display = 'none';
          item.classList.remove('open');
          const trigger = item.querySelector('.doc-title-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });

      const countEl = document.getElementById('visibleDocCount');
      if (countEl) {
        if (currentCategoryFilter === 'mcnp' || isMcnpCourse) {
          countEl.textContent = 'MCNP Documentation in curation (Coming Soon)';
        } else if (currentCategoryFilter === 'isap' || isIsapCourse) {
          countEl.textContent = 'ISAP Documentation in curation (Coming Soon)';
        } else if (isAll) {
          countEl.textContent = 'Institutional archives in curation • 2 featured resources available';
        } else {
          countEl.textContent = visibleCount + ' resource' + (visibleCount === 1 ? '' : 's') + ' available';
        }
      }

      const emptyMsg = document.getElementById('docEmptyState');
      if (emptyMsg) {
        emptyMsg.style.display = (visibleCount === 0 && !showMcnp && !showIsap) ? 'block' : 'none';
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
