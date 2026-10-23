  (function () {
    // Official UN SDG colors
    var SDG_COLORS = {
      1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
      6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
      11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
      16: '#00689D', 17: '#19486A'
    };

    var SDG_NAMES = {
      1: 'No Poverty',
      2: 'Zero Hunger',
      3: 'Good Health and Well-Being',
      4: 'Quality Education',
      5: 'Gender Equality',
      6: 'Clean Water and Sanitation',
      7: 'Affordable and Clean Energy',
      8: 'Decent Work and Economic Growth',
      9: 'Industry, Innovation and Infrastructure',
      10: 'Reduced Inequalities',
      11: 'Sustainable Cities and Communities',
      12: 'Responsible Consumption and Production',
      13: 'Climate Action',
      14: 'Life Below Water',
      15: 'Life on Land',
      16: 'Peace, Justice and Strong Institutions',
      17: 'Partnerships for the Goals'
    };

    function getSdgIcon(n) {
      var num = (n < 10 ? '0' : '') + n;
      return 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-' + num + '.png';
    }

    function parseEvent(card, index) {
      var thumb = card.querySelector('.news-thumbnail');
      var dateEl = card.querySelector('.news-date-badge');
      var badgeEl = card.querySelector('.dropdown-badge');
      var titleEl = card.querySelector('.news-title');
      var excerpts = Array.prototype.slice.call(card.querySelectorAll('.news-excerpt'));
      var seenSrc = {};
      var images = [];
      Array.prototype.slice.call(card.querySelectorAll('img')).forEach(function (img) {
        var src = img.getAttribute('src');
        if (src && !seenSrc[src]) {
          seenSrc[src] = true;
          images.push({ src: src, alt: img.getAttribute('alt') || '' });
        }
      });

      var sdgs = (card.dataset.sdgs || '').split(/\s+/).map(Number).filter(function (n) {
        return n >= 1 && n <= 17;
      });

      var rawDate = dateEl ? dateEl.textContent.trim() : '';
      var calendarDates = [];
      var mDate = rawDate.match(/^([A-Za-z]{3})\s+(\d{1,2})(?:[–\-](\d{1,2}))?,\s+(\d{4})$/);
      if (mDate) {
        var monthMap = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
        var mon = monthMap[mDate[1]];
        var startDay = parseInt(mDate[2], 10);
        var endDay = mDate[3] ? parseInt(mDate[3], 10) : startDay;
        var year = mDate[4];
        for (var d = startDay; d <= endDay; d++) {
          calendarDates.push(year + '-' + mon + '-' + String(d).padStart(2, '0'));
        }
      }

      return {
        id: card.id || ('event-' + index),
        title: titleEl ? titleEl.textContent.trim() : 'Event',
        date: rawDate,
        calendarDates: calendarDates,
        firstCalendarDate: calendarDates.length ? calendarDates[0] : null,
        category: badgeEl ? badgeEl.textContent.trim() : '',
        thumbStyle: thumb ? thumb.getAttribute('style') : '',
        paragraphs: excerpts.map(function (p) { return p.innerHTML; }),
        images: images,
        sdgs: sdgs
      };
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('#eventsGrid .news-card'));
    var events = cards.map(parseEvent);

    var catCounts = { all: cards.length, research: 0, sdg: 0, training: 0, student: 0 };

    // Decorate cards with reading meta, SDG badges, and categorizations
    cards.forEach(function (card, index) {
      var ev = events[index];
      var text = (card.textContent || '').toLowerCase();
      var cats = (card.dataset.categories || 'all').split(/\s+/);
      card.dataset.searchText = (ev.title + ' ' + ev.date + ' ' + ev.category + ' ' + text).toLowerCase();

      cats.forEach(function (c) {
        if (catCounts[c] !== undefined && c !== 'all') catCounts[c]++;
      });

      // Make date badge clickable to jump to calendar
      var dateBadge = card.querySelector('.news-date-badge');
      if (dateBadge && ev.firstCalendarDate) {
        dateBadge.classList.add('clickable-cal-date');
        dateBadge.title = 'Click to jump to ' + ev.date + ' on Calendar';
        dateBadge.addEventListener('click', function(e) {
          e.stopPropagation();
          if (window.jumpToCalendarDate) {
            window.jumpToCalendarDate(ev.firstCalendarDate);
          }
        });
      }

      var content = card.querySelector('.news-content > div');
      if (content) {
        // Add reading time and category icon
        if (!content.querySelector('.card-read-meta')) {
          var wordCount = (card.textContent || '').trim().split(/\s+/).length;
          var readMins = Math.max(1, Math.round(wordCount / 140));
          var readMeta = document.createElement('div');
          readMeta.className = 'card-read-meta';
          readMeta.style.cssText = 'font-size: 0.74rem; color: #64748b; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;';
          readMeta.innerHTML = '<span>' + readMins + ' min read</span>' + (ev.date ? '<span>•  ' + ev.date + '</span>' : '');
          content.insertBefore(readMeta, content.firstChild);
        }

        // Add card SDG chip strip if event supports SDGs
        if (ev.sdgs && ev.sdgs.length && !card.querySelector('.card-sdg-strip')) {
          var strip = document.createElement('div');
          strip.className = 'card-sdg-strip';
          strip.innerHTML = '<span class="card-sdg-label">SDGs:</span>' + ev.sdgs.map(function (n) {
            var name = SDG_NAMES[n] || ('SDG ' + n);
            return '<a href="sdg-overview.html?goal=' + n + '" class="card-sdg-badge" title="SDG ' + n + ': ' + name + '" target="_blank" rel="noopener" onclick="event.stopPropagation();">' +
              '<img src="' + getSdgIcon(n) + '" alt="SDG ' + n + ': ' + name + '" loading="lazy" decoding="async">' +
            '</a>';
          }).join('');
          content.appendChild(strip);
        }

        if (!content.querySelector('.event-view-more')) {
          var span = document.createElement('span');
          span.className = 'event-view-more';
          span.setAttribute('role', 'button');
          span.setAttribute('tabindex', '0');
          span.setAttribute('aria-label', 'View Full Event Details for ' + (ev.title || 'event'));
          span.textContent = 'View Full Event Details';
          span.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(index);
          });
          span.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              openModal(index);
            }
          });
          content.appendChild(span);
        }

        // Add "View on Calendar" action button for dated events
        if (ev.firstCalendarDate && !content.querySelector('.event-card-cal-btn')) {
          var calBtn = document.createElement('button');
          calBtn.type = 'button';
          calBtn.className = 'event-card-cal-btn';
          calBtn.innerHTML = ' View Date on Calendar';
          calBtn.title = 'Jump to ' + ev.date + ' on Research Schedule Calendar';
          calBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (document.getElementById('interactiveCalendarSection') && window.jumpToCalendarDate) {
              window.jumpToCalendarDate(ev.firstCalendarDate);
            } else {
              window.location.href = 'index.html#schedule-calendar';
            }
          });
          content.appendChild(calBtn);
        }
      }
    });

    var overlay = document.getElementById('eventModalOverlay');
    var titleEl = document.getElementById('eventModalTitle');
    var crumbEl = document.getElementById('eventModalCrumb');
    var metaEl = document.getElementById('eventModalMeta');
    var categoryEl = document.getElementById('eventModalCategory');
    var sdgsEl = document.getElementById('eventModalSdgs');
    var descEl = document.getElementById('eventModalDesc');
    var imagesEl = document.getElementById('eventModalImages');
    var relatedEl = document.getElementById('eventModalRelated');
    var closeBtn = document.getElementById('eventModalClose');
    var modalPrevBtn = document.getElementById('modalPrevBtn');
    var modalNextBtn = document.getElementById('modalNextBtn');
    var modalCopyBtn = document.getElementById('modalCopyBtn');

    function renderSdgs(sdgs) {
      sdgsEl.innerHTML = '';
      if (!sdgs || !sdgs.length) {
        sdgsEl.style.display = 'none';
        return;
      }
      var label = document.createElement('span');
      label.className = 'event-modal-sdg-label';
      label.textContent = 'Aligned SDGs:';
      sdgsEl.appendChild(label);

      sdgs.forEach(function (n) {
        var name = SDG_NAMES[n] || ('SDG ' + n);
        var chip = document.createElement('a');
        chip.className = 'event-sdg-chip';
        chip.href = 'sdg-overview.html?goal=' + n;
        chip.target = '_blank';
        chip.rel = 'noopener';
        chip.title = 'SDG ' + n + ': ' + name;
        chip.innerHTML = '<img src="' + getSdgIcon(n) + '" alt="SDG ' + n + ': ' + name + '" loading="lazy" decoding="async">';
        sdgsEl.appendChild(chip);
      });
      sdgsEl.style.display = 'flex';
    }

    function renderRelated(currentIndex) {
      relatedEl.innerHTML = '';
      var pool = events.filter(function (e, i) { return i !== currentIndex; });
      var current = events[currentIndex];
      pool.sort(function (a, b) {
        var aScore = a.sdgs.filter(function (n) { return current.sdgs.indexOf(n) !== -1; }).length;
        var bScore = b.sdgs.filter(function (n) { return current.sdgs.indexOf(n) !== -1; }).length;
        return bScore - aScore;
      });
      pool.slice(0, 3).forEach(function (ev) {
        var idx = events.indexOf(ev);
        var card = document.createElement('div');
        card.className = 'related-event-card';
        var sdgIconsHtml = (ev.sdgs && ev.sdgs.length) ?
          '<div style="display:flex;gap:0.3rem;margin-top:0.4rem;align-items:center;">' +
            ev.sdgs.map(function (n) {
              var name = SDG_NAMES[n] || ('SDG ' + n);
              return '<img src="' + getSdgIcon(n) + '" alt="SDG ' + n + ': ' + name + '" title="SDG ' + n + ': ' + name + '" style="width:22px;height:22px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.2);" loading="lazy" decoding="async">';
            }).join('') +
          '</div>' : '';
        card.innerHTML = '<span class="rel-date">' + (ev.date || '') + '</span><span class="rel-title">' + ev.title + '</span>' + sdgIconsHtml;
        card.addEventListener('click', function () { openModal(idx); });
        relatedEl.appendChild(card);
      });
    }

    function updateModalNav(index) {
      if (modalPrevBtn) modalPrevBtn.disabled = (index <= 0);
      if (modalNextBtn) modalNextBtn.disabled = (index >= events.length - 1);
    }

    function openModal(index) {
      var ev = events[index];
      if (!ev) return;

      titleEl.textContent = ev.title;
      crumbEl.textContent = ev.title;
      categoryEl.textContent = ev.category || 'Institutional Event';

      metaEl.innerHTML = '';
      if (ev.date) {
        var d = document.createElement('span');
        d.textContent = ' ' + ev.date;
        metaEl.appendChild(d);
      }
      var loc = document.createElement('span');
      loc.textContent = ' Alimannao Hills, Peñablanca, Cagayan, Philippines';
      metaEl.appendChild(loc);

      renderSdgs(ev.sdgs);

      descEl.innerHTML = ev.paragraphs.length
        ? ev.paragraphs.map(function (html) { return '<p>' + html + '</p>'; }).join('')
        : '<p>Full details for this event will be posted soon.</p>';

      imagesEl.innerHTML = '';
      if (ev.images.length) {
        var galleryHeader = document.createElement('div');
        galleryHeader.className = 'event-modal-gallery-header';
        galleryHeader.style.cssText = 'grid-column: 1 / -1; font-size: 0.85rem; font-weight: 700; color: #334155; margin-top: 0.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem;';
        galleryHeader.innerHTML = '<span> Event Photo Documentation (' + ev.images.length + ' Photos)</span><span style="font-size: 0.75rem; color: #64748b; font-weight: 500;">Click any photo to enlarge</span>';
        imagesEl.appendChild(galleryHeader);

        ev.images.forEach(function (img, imgIdx) {
          var el = document.createElement('img');
          el.src = img.src;
          el.alt = img.alt || ('Event Photo ' + (imgIdx + 1));
          el.title = 'Click to inspect full photo';
          el.loading = 'lazy';
          el.addEventListener('click', function () {
            if (window.openLightbox) {
              window.openLightbox(ev.images, imgIdx);
            }
          });
          imagesEl.appendChild(el);
        });
      } else if (ev.thumbStyle) {
        var hero = document.createElement('div');
        hero.className = 'event-modal-hero';
        hero.setAttribute('style', ev.thumbStyle);
        imagesEl.appendChild(hero);
      }

      // Reset to Background tab
      overlay.querySelectorAll('.tab-btn').forEach(function (b, i) { b.classList.toggle('active', i === 0); });
      overlay.querySelectorAll('.tab-panel').forEach(function (p, i) { p.classList.toggle('active', i === 0); });

      renderRelated(index);
      updateModalNav(index);

      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      lockBodyScroll();
      overlay.classList.add('open');
      overlay.dataset.currentIndex = index;

      var resetEventScroll = function () {
        if (!overlay) return;
        overlay.scrollTop = 0;
        if (overlay.scrollTo) overlay.scrollTo(0, 0);
        var modalEl = overlay.querySelector('.event-modal');
        if (modalEl) {
          modalEl.scrollTop = 0;
          if (modalEl.scrollTo) modalEl.scrollTo(0, 0);
        }
      };

      resetEventScroll();
      requestAnimationFrame(resetEventScroll);
      setTimeout(resetEventScroll, 40);
      setTimeout(resetEventScroll, 120);
    }

    function lockBodyScroll() {
      if (document.body.dataset.isScrollLocked === 'true') return;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.dataset.scrollY = scrollY;
      document.body.dataset.isScrollLocked = 'true';
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }

    function unlockBodyScroll() {
      var evOpen = overlay && overlay.classList.contains('open');
      var artOpen = articleOverlay && articleOverlay.classList.contains('open');
      if (evOpen || artOpen) return;

      if (document.body.dataset.isScrollLocked !== 'true') return;
      var scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      delete document.body.dataset.isScrollLocked;
      delete document.body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }

    function closeModal() {
      if (!overlay) overlay = document.getElementById('eventModalOverlay');
      if (overlay) {
        overlay.classList.remove('open');
        overlay.scrollTop = 0;
        var modalEl = overlay.querySelector('.event-modal');
        if (modalEl) modalEl.scrollTop = 0;
      }
      unlockBodyScroll();
    }

    window.closeModal = closeModal;
    window.closeEventModal = closeModal;

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    var articleOverlay = document.getElementById('articleModalOverlay');
    var articleCloseBtn = document.getElementById('articleModalClose');
    var currentActiveArticleId = 'article-rdc-digital-platform';

    var ARTICLES_METADATA = {
      'article-rdc-digital-platform': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; RDC Digital Platform',
        badge: ' OFFICIAL ARTICLE',
        topic: 'Digital Innovation & Infrastructure',
        date: ' October 14, 2026',
        readTime: '3 min read',
        title: 'MCNP–ISAP Research and Development Center Develops Digital Platform to Improve Access to Research Information',
        bodyId: 'body-article-rdc-digital-platform',
        sdgs: [
          { goal: '9', title: 'SDG 9: Industry, Innovation and Infrastructure', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-09.png' },
          { goal: '16', title: 'SDG 16: Peace, Justice and Strong Institutions', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-16.png' },
          { goal: '4', title: 'SDG 4: Quality Education', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-04.png' }
        ],
        agendas: [
          { pillar: 'navigate', title: 'NAVIGATE: Digital Innovation and Infrastructure', icon: 'assets/agenda/agenda-3-navigate.png' },
          { pillar: 'inspire', title: 'INSPIRE: Research Culture and Capability', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Research Utilization and Innovation', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'strengthen', title: 'STRENGTHEN: Education and Institutional Performance', icon: 'assets/agenda/agenda-9-strengthen.png' }
        ]
      },
      'article-37th-statistics-month-celebration': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; 37th Statistics Month',
        badge: ' OFFICIAL ARTICLE',
        topic: '37th National Statistics Month',
        date: ' October 05, 2026',
        readTime: '4 min read',
        title: 'MCNP–ISAP Advances Statistical Literacy through Month-Long 37th Statistics Month Celebration',
        bodyId: 'body-article-37th-statistics-month-celebration',
        sdgs: [
          { goal: '4', title: 'SDG 4: Quality Education', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-04.png' },
          { goal: '9', title: 'SDG 9: Industry, Innovation and Infrastructure', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-09.png' },
          { goal: '17', title: 'SDG 17: Partnerships for the Goals', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-17.png' }
        ],
        agendas: [
          { pillar: 'inspire', title: 'INSPIRE: Research Culture and Capability', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'navigate', title: 'NAVIGATE: Digital Innovation and Infrastructure', icon: 'assets/agenda/agenda-3-navigate.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Research Utilization and Innovation', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'expand', title: 'EXPAND: Partnerships and Global Research', icon: 'assets/agenda/agenda-8-expand.png' },
          { pillar: 'strengthen', title: 'STRENGTHEN: Education and Institutional Performance', icon: 'assets/agenda/agenda-9-strengthen.png' }
        ]
      }
   ,
      'article-isap-high-school-research-defense': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; High School Research Defense',
        badge: ' OFFICIAL ARTICLE',
        topic: 'High School Department &bull; Academic Development',
        date: ' October 16, 2026',
        readTime: '4 min read',
        title: 'ISAP High School Students Strengthen Research Skills Through Research Defense',
        bodyId: 'body-article-isap-high-school-research-defense',
        sdgs: [
          { goal: '4', title: 'SDG 4: Quality Education', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-04.png' }
        ],
        agendas: [
          { pillar: 'inspire', title: 'INSPIRE: Culture, Capability, and Engagement', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'nurture', title: 'NURTURE: Ethics, Quality, and Accountability', icon: 'assets/agenda/agenda-2-nurture.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Knowledge Utilization, Innovation, & Improvement', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'strengthen', title: 'STRENGTHEN: Education and Institutional Performance', icon: 'assets/agenda/agenda-9-strengthen.png' }
        ]
      }
   ,
                  'article-cpd-cohabitation-research-meeting': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; CPD Research Institutions Meeting',
        badge: ' OFFICIAL ARTICLE',
        topic: 'Regional Research Collaboration &bull; Population Studies',
        date: ' October 20, 2026',
        readTime: '4 min read',
        title: 'MCNP–ISAP Joins Research Institutions’ Meeting on 2027 Cohabitation Research Proposal for Cagayan Valley',
        bodyId: 'body-article-cpd-cohabitation-research-meeting',
        sdgs: [
          { goal: '17', title: 'SDG 17: Partnerships for the Goals', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-17.png' },
          { goal: '3', title: 'SDG 3: Good Health and Well-Being', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-03.png' }
        ],
        agendas: [
          { pillar: 'expand', title: 'EXPAND: Partnerships, Networks, and Global Engagement', icon: 'assets/agenda/agenda-8-expand.png' },
          { pillar: 'inspire', title: 'INSPIRE: Culture, Capability, and Engagement', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Knowledge Utilization, Innovation, and Improvement', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'transform', title: 'TRANSFORM: Community Engagement and Social Impact', icon: 'assets/agenda/agenda-7-transform.png' }
        ]
      },
      'article-bsed-bped-proposal-defense': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; BSEd &amp; BPEd Proposal Defense',
        badge: ' OFFICIAL ARTICLE',
        topic: 'School of Education &bull; Proposal Defense',
        date: ' October 14, 2026',
        readTime: '4 min read',
        title: 'BSEd and BPEd Students Strengthen Research Skills Through Proposal Defense',
        bodyId: 'body-article-bsed-bped-proposal-defense',
        sdgs: [
          { goal: '4', title: 'SDG 4: Quality Education', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-04.png' }
        ],
        agendas: [
          { pillar: 'inspire', title: 'INSPIRE: Culture, Capability, and Engagement', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'nurture', title: 'NURTURE: Ethics, Quality, and Accountability', icon: 'assets/agenda/agenda-2-nurture.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Knowledge Utilization, Innovation, and Improvement', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'strengthen', title: 'STRENGTHEN: Education and Institutional Performance', icon: 'assets/agenda/agenda-9-strengthen.png' }
        ]
      },
      'article-bs-tourism-proposal-defense': {
        breadcrumb: 'News &amp; Events &gt; Articles &amp; Editorials &gt; BS Tourism Proposal Defense',
        badge: ' OFFICIAL ARTICLE',
        topic: 'BS Tourism Management &bull; Proposal Defense',
        date: ' October 13, 2026',
        readTime: '4 min read',
        title: 'BS Tourism Management Students Strengthen Research Skills Through Proposal Defense',
        bodyId: 'body-article-bs-tourism-proposal-defense',
        sdgs: [
          { goal: '4', title: 'SDG 4: Quality Education', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-04.png' },
          { goal: '9', title: 'SDG 9: Industry, Innovation and Infrastructure', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-09.png' },
          { goal: '17', title: 'SDG 17: Partnerships for the Goals', icon: 'assets/E%20SDG%20Icons%20WEB/E-WEB-Goal-17.png' }
        ],
        agendas: [
          { pillar: 'inspire', title: 'INSPIRE: Culture, Capability, and Engagement', icon: 'assets/agenda/agenda-1-inspire.png' },
          { pillar: 'nurture', title: 'NURTURE: Ethics, Quality, and Accountability', icon: 'assets/agenda/agenda-2-nurture.png' },
          { pillar: 'operationalize', title: 'OPERATIONALIZE: Knowledge Utilization, Innovation, and Improvement', icon: 'assets/agenda/agenda-4-operationalize.png' },
          { pillar: 'strengthen', title: 'STRENGTHEN: Education and Institutional Performance', icon: 'assets/agenda/agenda-9-strengthen.png' }
        ]
      }
    };

    function openArticleModal(articleId) {
      if (!articleOverlay) articleOverlay = document.getElementById('articleModalOverlay');
      if (overlay && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
      }
      var id = articleId || 'article-rdc-digital-platform';
      currentActiveArticleId = id;
      var data = ARTICLES_METADATA[id] || ARTICLES_METADATA['article-rdc-digital-platform'];
      if (!data) return;

      var breadcrumbEl = document.getElementById('articleModalBreadcrumb');
      if (breadcrumbEl && data.breadcrumb) breadcrumbEl.innerHTML = data.breadcrumb;

      var titleEl = document.getElementById('articleModalTitle');
      if (titleEl && data.title) titleEl.textContent = data.title;

      var metaEl = document.getElementById('articleModalMeta');
      if (metaEl) {
        metaEl.innerHTML = '<span>' + data.date + '</span>' +
          '<span>&bull;  ' + data.readTime + '</span>';
      }

      var badgeEl = document.getElementById('articleModalBadge');
      if (badgeEl) badgeEl.textContent = data.badge;

      var topicEl = document.getElementById('articleModalTopic');
      if (topicEl && data.topic) {
        topicEl.innerHTML = data.topic;
        topicEl.style.display = 'inline-block';
      } else if (topicEl) {
        topicEl.style.display = 'none';
      }

      var sdgContainer = document.getElementById('articleModalSdgs');
      if (sdgContainer && data.sdgs) {
        sdgContainer.innerHTML = data.sdgs.map(function(s) {
          return '<a href="sdg-overview.html?goal=' + s.goal + '" target="_blank" rel="noopener" title="' + s.title + '" class="article-sdg-icon-link" style="width: 26px; height: 26px; display: inline-block;">' +
            '<img src="' + s.icon + '" alt="' + s.title + '" class="article-sdg-icon-img" loading="lazy" style="width: 100%; height: 100%; border-radius: 3px; display: block;" decoding="async"></a>';
        }).join('');
      }

      var agendaContainer = document.getElementById('articleModalAgendas');
      if (agendaContainer && data.agendas) {
        agendaContainer.innerHTML = data.agendas.map(function(a) {
          return '<a href="rdc-agenda.html#pillar-' + a.pillar + '" target="_blank" rel="noopener" title="' + a.title + '" class="article-agenda-icon-link" style="width: 26px; height: 26px; display: inline-block;">' +
            '<img src="' + a.icon + '" alt="' + a.title + '" class="article-agenda-icon-img" loading="lazy" decoding="async"></a>';
        }).join('');
      }

      var copyBtn = document.getElementById('articleModalCopyBtn');
      if (copyBtn) {
        copyBtn.setAttribute('onclick', "if(window.copyArticleLink){window.copyArticleLink('" + id + "', this);}");
      }

      var fbBtn = document.getElementById('articleModalFbBtn');
      if (fbBtn) {
        fbBtn.setAttribute('onclick', "if(window.shareOnFacebook){window.shareOnFacebook('" + id + "');}");
      }

      var src = document.getElementById(data.bodyId);
      var dest = document.getElementById('articleModalContent');
      if (src && dest) {
        dest.innerHTML = src.innerHTML;
        var inlineFooter = dest.querySelector('.article-editorial-footer');
        if (inlineFooter) inlineFooter.style.display = 'none';
      }

      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      if (articleOverlay) {
        lockBodyScroll();
        articleOverlay.classList.add('open');

        var resetArticleScroll = function () {
          if (!articleOverlay) return;
          articleOverlay.scrollTop = 0;
          if (articleOverlay.scrollTo) articleOverlay.scrollTo(0, 0);

          var modalEl = articleOverlay.querySelector('.event-modal');
          if (modalEl) {
            modalEl.scrollTop = 0;
            if (modalEl.scrollTo) modalEl.scrollTo(0, 0);
          }

          var scrollBody = document.getElementById('articleModalScrollBody');
          if (scrollBody) {
            scrollBody.scrollTop = 0;
            if (scrollBody.scrollTo) scrollBody.scrollTo(0, 0);
          }
        };

        resetArticleScroll();
        requestAnimationFrame(resetArticleScroll);
        setTimeout(resetArticleScroll, 40);
        setTimeout(resetArticleScroll, 120);
      }
    }

    function closeArticleModal() {
      if (!articleOverlay) articleOverlay = document.getElementById('articleModalOverlay');
      if (articleOverlay) {
        articleOverlay.classList.remove('open');
        articleOverlay.scrollTop = 0;
        var modalEl = articleOverlay.querySelector('.event-modal');
        if (modalEl) modalEl.scrollTop = 0;
        var scrollBody = document.getElementById('articleModalScrollBody');
        if (scrollBody) scrollBody.scrollTop = 0;
      }
      unlockBodyScroll();
    }

    window.openArticleModal = openArticleModal;
    window.closeArticleModal = closeArticleModal;

    function printArticle(articleId) {
      var id = articleId || currentActiveArticleId || 'article-rdc-digital-platform';
      openArticleModal(id);
      document.body.classList.add('print-article-mode');
      setTimeout(function () {
        window.print();
      }, 50);
    }

    function printSchedule() {
      document.body.classList.add('print-schedule-mode');
      setTimeout(function () {
        window.print();
      }, 50);
    }

    window.printArticle = printArticle;
    window.printSchedule = printSchedule;

    window.addEventListener('beforeprint', function () {
      if (articleOverlay && articleOverlay.classList.contains('open')) {
        document.body.classList.add('print-article-mode');
      } else if (overlay && overlay.classList.contains('open')) {
        document.body.classList.add('print-event-mode');
      }
    });

    window.addEventListener('afterprint', function () {
      document.body.classList.remove('print-article-mode', 'print-event-mode', 'print-schedule-mode');
    });

    if (articleCloseBtn) articleCloseBtn.addEventListener('click', closeArticleModal);
    if (articleOverlay) {
      articleOverlay.addEventListener('click', function (e) {
        if (e.target === articleOverlay) closeArticleModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (overlay && overlay.classList.contains('open')) closeModal();
        if (articleOverlay && articleOverlay.classList.contains('open')) closeArticleModal();
      }
      if (overlay && overlay.classList.contains('open')) {
        var curr = parseInt(overlay.dataset.currentIndex || '0', 10);
        if (e.key === 'ArrowLeft' && curr > 0) openModal(curr - 1);
        if (e.key === 'ArrowRight' && curr < events.length - 1) openModal(curr + 1);
      }
    });

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', function () {
        var curr = parseInt(overlay.dataset.currentIndex || '0', 10);
        if (curr > 0) openModal(curr - 1);
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', function () {
        var curr = parseInt(overlay.dataset.currentIndex || '0', 10);
        if (curr < events.length - 1) openModal(curr + 1);
      });
    }

    if (modalCopyBtn) {
      modalCopyBtn.addEventListener('click', function () {
        var curr = parseInt(overlay.dataset.currentIndex || '0', 10);
        var ev = events[curr];
        if (ev) {
          var url = window.location.origin + window.location.pathname + '#' + ev.id;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              if (window.showToast) window.showToast('Event link copied to clipboard!');
            });
          } else {
            if (window.showToast) window.showToast('Link: ' + url, 'info');
          }
        }
      });
    }

    overlay.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.dataset.tab;
        overlay.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
        overlay.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.toggle('active', p.dataset.panel === tab); });
      });
    });

    // Expose global methods for Interactive Calendar linkage
    window.openEventModal = openModal;
    window.newsEventsList = events;
    window.openEventModalById = function (cardId) {
      var card = document.getElementById(cardId);
      if (card && card.dataset.articleTarget && typeof openArticleModal === 'function') {
        openArticleModal(card.dataset.articleTarget);
        return true;
      }
      var idx = events.findIndex(function (e) { return e.id === cardId; });
      if (idx !== -1) {
        openModal(idx);
        return true;
      }
      var card = document.getElementById(cardId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.outline = '3px solid #1e5ea8';
        setTimeout(function () { card.style.outline = ''; }, 2000);
        return true;
      }
      return false;
    };

    window.scrollToArticleCard = function (cardId) {
      var card = document.getElementById(cardId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transition = 'box-shadow 0.3s ease, outline 0.3s ease';
        card.style.outline = '3px solid #0d5c3a';
        card.style.boxShadow = '0 0 25px rgba(13, 92, 58, 0.4)';
        setTimeout(function () {
          card.style.outline = '';
          card.style.boxShadow = '';
        }, 2500);
      }
    };

    window.toggleArticleAccordion = function (articleId, forceState) {
      var card = document.getElementById(articleId);
      if (!card) return;
      var isOpen = (typeof forceState === 'boolean') ? forceState : !card.classList.contains('open');
      if (isOpen) {
        card.classList.add('open');
      } else {
        card.classList.remove('open');
      }

      var hdr = card.querySelector('.article-accordion-header');
      if (hdr) hdr.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      var toggleBtn = document.getElementById('toggleBtn-' + articleId);
      if (toggleBtn) {
        var txt = toggleBtn.querySelector('.toggle-text');
        if (txt) txt.textContent = isOpen ? 'Collapse Article' : 'Read Full Article';
      }

      var expandBtn = card.querySelector('.btn-outline-white[onclick*="toggleArticleAccordion"]');
      if (expandBtn) {
        var span = expandBtn.querySelector('span');
        if (span) span.textContent = isOpen ? '▲ Collapse on Page' : 'Expand on Page';
      }

      if (isOpen) {
        requestAnimationFrame(function () {
          var navOffset = 85;
          var cardRect = card.getBoundingClientRect();
          var targetY = window.pageYOffset + cardRect.top - navOffset;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        });
      } else if (forceState === false) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
    window.toggleArticleAccordion = window.toggleArticleAccordion;

    window.switchFbPost = function (btn, fbid, shareId, iframeId, openBtnId) {
      if (!btn) return;
      var card = btn.closest('.article-facebook-embed-card');
      if (card) {
        var allBtns = card.querySelectorAll('.article-fb-tab-btn');
        for (var i = 0; i < allBtns.length; i++) {
          allBtns[i].classList.remove('active');
        }
      }
      btn.classList.add('active');

      var iframe = iframeId ? document.getElementById(iframeId) : null;
      if (!iframe && card) {
        iframe = card.querySelector('iframe');
      }
      if (iframe) {
        var canonical = 'https://www.facebook.com/permalink.php?story_fbid=' + fbid + '&id=61593412015654';
        iframe.src = 'https://www.facebook.com/plugins/post.php?href=' + encodeURIComponent(canonical) + '&width=500&show_text=true';
      }

      var openBtn = openBtnId ? document.getElementById(openBtnId) : null;
      if (!openBtn && card) {
        openBtn = card.querySelector('.btn-outline-fb');
      }
      if (openBtn) {
        openBtn.href = 'https://www.facebook.com/share/p/' + shareId + '/';
      }
    };

    window.shareOnFacebook = function (articleId) {
      var id = articleId || currentActiveArticleId || 'article-rdc-digital-platform';
      var shareId = ARTICLES_METADATA[id] ? id : 'article-rdc-digital-platform';
      var shareUrl = new URL('share/' + encodeURIComponent(shareId) + '.html', 'https://jeraldguiquing.github.io/rdc-website/').href;
      var fbSharerUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);
      var width = 640;
      var height = 560;
      var left = Math.max(0, Math.round((window.screen.width - width) / 2));
      var top = Math.max(0, Math.round((window.screen.height - height) / 2));
      var win = window.open(fbSharerUrl, 'facebook-share-dialog', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + ',toolbar=0,status=0,location=0,menubar=0,scrollbars=yes,resizable=yes');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.open(fbSharerUrl, '_blank', 'noopener,noreferrer');
      }
    };

    window.copyArticleLink = function (articleId, btn) {
      var url = window.location.origin + window.location.pathname + '#' + articleId;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          if (window.showToast) {
            window.showToast('Article link copied to clipboard!');
          } else {
            alert('Article link copied to clipboard!');
          }
        });
      } else {
        prompt('Copy article link:', url);
      }
    };

    // Interactive Category Filter and Real-Time Search
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.event-pill-btn'));
    var searchInput = document.getElementById('eventSearchInput');
    var searchClearBtn = document.getElementById('eventSearchClear');
    var countTotal = document.getElementById('eventCountTotal');
    var eventsGrid = document.getElementById('eventsGrid');
    var loadMoreEventsBtn = document.getElementById('loadMoreEventsBtn');
    var eventCards = eventsGrid ? Array.prototype.slice.call(eventsGrid.querySelectorAll('.news-card')) : [];
    var eventPageSize = 9;
    var eventCardsToShow = eventPageSize;
    var sourceEventOrder = eventCards.slice();

    function eventDateSortValue(card) {
      var date = (card.dataset.date || '').trim();
      if (/^\d{4}$/.test(date)) return date + '-00-00';
      if (/^\d{4}-\d{2}$/.test(date)) return date + '-00';
      return date;
    }

    function compareEventDates(a, b) {
      var aDate = eventDateSortValue(a);
      var bDate = eventDateSortValue(b);
      if (!aDate && bDate) return 1;
      if (aDate && !bDate) return -1;
      return bDate.localeCompare(aDate) || sourceEventOrder.indexOf(a) - sourceEventOrder.indexOf(b);
    }

    eventCards.sort(compareEventDates);
    eventCards.forEach(function (card) {
      if (eventsGrid) eventsGrid.appendChild(card);
    });

    // Populate dynamic counts on filter buttons
    filterBtns.forEach(function (btn) {
      var f = btn.dataset.filter;
      if (f && catCounts[f] !== undefined) {
        var labelMap = {
          all: 'All News & Events',
          research: 'Research & Colloquiums',
          sdg: 'SDG Initiatives',
          training: 'Capability Building',
          student: 'Student Competitions'
        };
        var label = labelMap[f] || f;
        btn.innerHTML = label + ' (' + (f === 'all' ? '<span id="eventCountTotal">' + catCounts.all + '</span>' : catCounts[f]) + ')';
      }
    });

    var activeCategory = 'all';
    var searchQuery = '';

    window.currentContentView = 'articles';

    function resetEventPagination() {
      eventCardsToShow = eventPageSize;
    }

    function revealEventCard(card) {
      var eventIndex = eventCards.indexOf(card);
      if (eventIndex >= 0) eventCardsToShow = Math.max(eventCardsToShow, eventIndex + 1);
    }

    if (loadMoreEventsBtn) {
      loadMoreEventsBtn.addEventListener('click', function () {
        eventCardsToShow += eventPageSize;
        applyFilterAndSearch();
      });
    }

    window.switchContentView = function(view, smoothScroll) {
      window.currentContentView = view;
      var articlesSec = document.getElementById('articlesSection');
      var eventsSec = document.getElementById('eventsSection');
      var tabBtns = document.querySelectorAll('.news-view-tab-btn');

      tabBtns.forEach(function(b) {
        var isThis = (b.dataset.view === view);
        b.classList.toggle('active', isThis);
        b.setAttribute('aria-selected', isThis ? 'true' : 'false');
      });

      if (view === 'articles') {
        if (articlesSec) articlesSec.style.display = 'block';
        if (eventsSec) eventsSec.style.display = 'none';
      } else if (view === 'events') {
        if (articlesSec) articlesSec.style.display = 'none';
        if (eventsSec) eventsSec.style.display = 'block';
      } else {
        if (articlesSec) articlesSec.style.display = 'block';
        if (eventsSec) eventsSec.style.display = 'block';
      }

      applyFilterAndSearch();

      if (smoothScroll) {
        var scrollTarget = (view === 'events') ? eventsSec : articlesSec;
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    function applyFilterAndSearch() {
      var matchingEvents = [];
      var currentView = window.currentContentView || 'all';

      cards.forEach(function (card) {
        var isArt = card.closest('#articlesGrid') || card.dataset.contentType === 'article';
        var inView = (currentView === 'all') || (currentView === 'articles' && isArt) || (currentView === 'events' && !isArt);

        if (!inView) {
          card.classList.add('event-card-hidden');
          return;
        }

        var cardCats = (card.dataset.categories || '').split(' ');
        var matchesCategory = activeCategory === 'all' || cardCats.indexOf(activeCategory) > -1;
        var matchesSearch = !searchQuery || (card.dataset.searchText || '').indexOf(searchQuery) > -1;

        if (!matchesCategory || !matchesSearch) {
          card.classList.add('event-card-hidden');
        } else if (!isArt) {
          matchingEvents.push(card);
          card.classList.add('event-card-hidden');
        } else {
          card.classList.remove('event-card-hidden');
        }
      });

      var countEl = document.getElementById('eventCountTotal');
      if (countEl) countEl.textContent = matchingEvents.length;

      matchingEvents.sort(compareEventDates);
      matchingEvents.slice(0, eventCardsToShow).forEach(function (card) {
        card.classList.remove('event-card-hidden');
      });

      if (loadMoreEventsBtn) {
        var remainingEvents = matchingEvents.length - eventCardsToShow;
        loadMoreEventsBtn.style.display = currentView !== 'articles' && remainingEvents > 0 ? 'inline-flex' : 'none';
        loadMoreEventsBtn.textContent = 'Load more events (' + Math.max(remainingEvents, 0) + ' remaining)';
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeCategory = btn.dataset.filter || 'all';
        resetEventPagination();
        applyFilterAndSearch();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = (searchInput.value || '').trim().toLowerCase();
        if (searchClearBtn) searchClearBtn.classList.toggle('visible', !!searchQuery);
        resetEventPagination();
        applyFilterAndSearch();
      });
    }

    if (searchClearBtn && searchInput) {
      searchClearBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.classList.remove('visible');
        resetEventPagination();
        applyFilterAndSearch();
        searchInput.focus();
      });
    }

    cards.forEach(function (card, index) {
      card.addEventListener('click', function (e) {
        if (card.classList.contains('article-accordion-card') || card.closest('#articlesGrid')) return;
        if (e.target.closest('summary')) return;
        if (e.target.closest('.event-gallery-slider')) return;
        if (e.target.closest('.event-gallery-thumbstrip')) return;
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        if (card.dataset.articleTarget && typeof openArticleModal === 'function') {
          openArticleModal(card.dataset.articleTarget);
          return;
        }
        openModal(index);
      });
    });

    // Deep-link hash scrolling, highlighting, and view switching
    function handleInitialHash() {
      var urlParams = new URLSearchParams(window.location.search);
      var eventParam = urlParams.get('event');
      var articleParam = urlParams.get('article');
      var hashVal = window.location.hash ? window.location.hash.substring(1) : '';
      var candidateArticleId = articleParam || hashVal;
      var isArticleTarget = !!(candidateArticleId && ARTICLES_METADATA[candidateArticleId]);

      if (isArticleTarget) {
        if (window.switchContentView) window.switchContentView('all', false);
        if (typeof window.openArticleModal === 'function') {
          window.openArticleModal(candidateArticleId);
        }
        return;
      }

      var targetCardId = eventParam || (hashVal && hashVal.startsWith('event-') ? hashVal : null);

      if (targetCardId) {
        var targetCard = document.getElementById(targetCardId);
        if (targetCard) {
          var isArt = targetCard.closest('#articlesGrid') || targetCard.dataset.contentType === 'article';
          if (!isArt) revealEventCard(targetCard);
          if (window.switchContentView) window.switchContentView(isArt ? 'articles' : 'events', false);
          if (targetCardId === 'article-37th-statistics-month-celebration' && window.toggleArticleAccordion) {
            window.toggleArticleAccordion('article-37th-statistics-month-celebration', true);
          }
        }
        setTimeout(function () {
          if (typeof window.openEventModalById === 'function') {
            window.openEventModalById(targetCardId);
          }
        }, 350);
      } else if (window.location.hash) {
        var h = window.location.hash.toLowerCase();
        if (h === '#articles' || h === '#articlessection') {
          if (window.switchContentView) window.switchContentView('articles', true);
        } else if (h === '#events' || h === '#eventssection') {
          if (window.switchContentView) window.switchContentView('events', true);
        } else if (h === '#all') {
          if (window.switchContentView) window.switchContentView('all', true);
        } else {
          var target = document.querySelector(window.location.hash);
          if (target) {
            var isArt = target.closest('#articlesGrid') || target.dataset.contentType === 'article';
            if (!isArt) revealEventCard(target);
            if (window.switchContentView) window.switchContentView(isArt ? 'articles' : 'events', false);
            setTimeout(function () {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.style.outline = '3px solid var(--mcnp-green, #0d5c3a)';
              target.style.boxShadow = '0 0 25px rgba(13, 92, 58, 0.35)';
              setTimeout(function () {
                target.style.outline = '';
                target.style.boxShadow = '';
              }, 3200);
            }, 350);
          }
        }
      } else {
        // Default to all content view
        if (window.switchContentView) window.switchContentView('all', false);
      }
    }

    handleInitialHash();
    window.addEventListener('hashchange', handleInitialHash);
  })();
