  (function () {
    var CITATIONS = {
      'pascual-2026': {
        title: 'Assessment of Antimicrobial Activity of Selected Indigenous Flora in Peñablanca, Cagayan Against Clinically Isolated Pathogens',
        apa: 'Pascual, A. R., Agbisit, D. C., & Guzman, E. K. (2026). Assessment of Antimicrobial Activity of Selected Indigenous Flora in Peñablanca, Cagayan Against Clinically Isolated Pathogens. MCNP Journal of Medical & Allied Health Sciences, 8(2), 1-14. https://doi.org/10.5281/mcnp.2026.0821',
        mla: 'Pascual, A. R., et al. "Assessment of Antimicrobial Activity of Selected Indigenous Flora in Peñablanca, Cagayan Against Clinically Isolated Pathogens." MCNP Journal of Medical & Allied Health Sciences, vol. 8, no. 2, 2026, pp. 1-14. DOI: 10.5281/mcnp.2026.0821.',
        chicago: 'Pascual, A. R., D. C. Agbisit, and E. K. Guzman. "Assessment of Antimicrobial Activity of Selected Indigenous Flora in Peñablanca, Cagayan Against Clinically Isolated Pathogens." MCNP Journal of Medical & Allied Health Sciences 8, no. 2 (2026): 1-14.',
        bibtex: '@article{pascual2026flora,\n  author = {Pascual, A. R. and Agbisit, D. C. and Guzman, E. K.},\n  title = {Assessment of Antimicrobial Activity of Selected Indigenous Flora in Peñablanca, Cagayan Against Clinically Isolated Pathogens},\n  journal = {MCNP Journal of Medical & Allied Health Sciences},\n  volume = {8},\n  number = {2},\n  pages = {1--14},\n  year = {2026},\n  doi = {10.5281/mcnp.2026.0821}\n}'
      },
      'baloran-2026': {
        title: 'Diagnostic Accuracy and Radiation Dose Reduction in Pediatric Chest Digital Radiography Protocols',
        apa: 'Baloran, C. M., & Macarubbo, F. T. (2026). Diagnostic Accuracy and Radiation Dose Reduction in Pediatric Chest Digital Radiography Protocols. MCNP Journal of Medical & Allied Health Sciences, 8(2), 15-28. https://doi.org/10.5281/mcnp.2026.0822',
        mla: 'Baloran, C. M., and F. T. Macarubbo. "Diagnostic Accuracy and Radiation Dose Reduction in Pediatric Chest Digital Radiography Protocols." MCNP Journal of Medical & Allied Health Sciences, vol. 8, no. 2, 2026, pp. 15-28. DOI: 10.5281/mcnp.2026.0822.',
        chicago: 'Baloran, C. M., and F. T. Macarubbo. "Diagnostic Accuracy and Radiation Dose Reduction in Pediatric Chest Digital Radiography Protocols." MCNP Journal of Medical & Allied Health Sciences 8, no. 2 (2026): 15-28.',
        bibtex: '@article{baloran2026radiography,\n  author = {Baloran, C. M. and Macarubbo, F. T.},\n  title = {Diagnostic Accuracy and Radiation Dose Reduction in Pediatric Chest Digital Radiography Protocols},\n  journal = {MCNP Journal of Medical & Allied Health Sciences},\n  volume = {8},\n  number = {2},\n  pages = {15--28},\n  year = {2026},\n  doi = {10.5281/mcnp.2026.0822}\n}'
      },
      'fernandez-2026': {
        title: 'Nurse Resilience, Compassion Fatigue, and Patient Care Outcomes in Critical Care Units in Northern Luzon',
        apa: 'Fernandez, L. G., & Pimentel, R. T. (2026). Nurse Resilience, Compassion Fatigue, and Patient Care Outcomes in Critical Care Units in Northern Luzon. MCNP Journal of Medical & Allied Health Sciences, 8(2), 29-42. https://doi.org/10.5281/mcnp.2026.0823',
        mla: 'Fernandez, L. G., and R. T. Pimentel. "Nurse Resilience, Compassion Fatigue, and Patient Care Outcomes in Critical Care Units in Northern Luzon." MCNP Journal of Medical & Allied Health Sciences, vol. 8, no. 2, 2026, pp. 29-42. DOI: 10.5281/mcnp.2026.0823.',
        chicago: 'Fernandez, L. G., and R. T. Pimentel. "Nurse Resilience, Compassion Fatigue, and Patient Care Outcomes in Critical Care Units in Northern Luzon." MCNP Journal of Medical & Allied Health Sciences 8, no. 2 (2026): 29-42.',
        bibtex: '@article{fernandez2026resilience,\n  author = {Fernandez, L. G. and Pimentel, R. T.},\n  title = {Nurse Resilience, Compassion Fatigue, and Patient Care Outcomes in Critical Care Units in Northern Luzon},\n  journal = {MCNP Journal of Medical & Allied Health Sciences},\n  volume = {8},\n  number = {2},\n  pages = {29--42},\n  year = {2026},\n  doi = {10.5281/mcnp.2026.0823}\n}'
      },
      'aquino-2026': {
        title: 'Knowledge, Attitudes, and Self-Medication Practices with Antibiotics Among Rural Households in Peñablanca',
        apa: 'Aquino, G. B., & Taguinod, K. D. (2026). Knowledge, Attitudes, and Self-Medication Practices with Antibiotics Among Rural Households in Peñablanca. MCNP Journal of Medical & Allied Health Sciences, 8(2), 43-56. https://doi.org/10.5281/mcnp.2026.0824',
        mla: 'Aquino, G. B., and K. D. Taguinod. "Knowledge, Attitudes, and Self-Medication Practices with Antibiotics Among Rural Households in Peñablanca." MCNP Journal of Medical & Allied Health Sciences, vol. 8, no. 2, 2026, pp. 43-56.',
        chicago: 'Aquino, G. B., and K. D. Taguinod. "Knowledge, Attitudes, and Self-Medication Practices with Antibiotics Among Rural Households in Peñablanca." MCNP Journal of Medical & Allied Health Sciences 8, no. 2 (2026): 43-56.',
        bibtex: '@article{aquino2026antibiotics,\n  author = {Aquino, G. B. and Taguinod, K. D.},\n  title = {Knowledge, Attitudes, and Self-Medication Practices with Antibiotics Among Rural Households in Peñablanca},\n  journal = {MCNP Journal of Medical & Allied Health Sciences},\n  volume = {8},\n  number = {2},\n  pages = {43--56},\n  year = {2026},\n  doi = {10.5281/mcnp.2026.0824}\n}'
      }
    };

    window.toggleAbstract = function (id, btn) {
      var el = document.getElementById('abstract-' + id);
      if (!el) return;
      var isExpanded = el.classList.contains('expanded');
      el.classList.toggle('expanded', !isExpanded);
      btn.innerHTML = isExpanded ? '<span>Read Full Abstract</span> ' : '<span>Collapse Abstract</span> ';
    };

    var modalOverlay = document.getElementById('citationModalOverlay');
    var modalClose = document.getElementById('citationModalClose');
    var modalTitle = document.getElementById('citationArticleTitle');
    var modalPreview = document.getElementById('citationPreviewText');
    var copyBtn = document.getElementById('copyCitationBtn');
    var formatBtns = document.querySelectorAll('.citation-format-btn');
    var currentArticleId = '';
    var currentFormat = 'apa';

    window.openCitationModal = function (articleId) {
      currentArticleId = articleId;
      var data = CITATIONS[articleId];
      if (!data) return;
      modalTitle.textContent = data.title;
      currentFormat = 'apa';
      formatBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.format === 'apa');
      });
      renderCitation();
      modalOverlay.classList.add('active');
    };

    window.closeCitationModal = function () {
      modalOverlay.classList.remove('active');
    };

    if (modalClose) modalClose.addEventListener('click', window.closeCitationModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) window.closeCitationModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) window.closeCitationModal();
    });

    formatBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        formatBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFormat = btn.dataset.format;
        renderCitation();
      });
    });

    function renderCitation() {
      var data = CITATIONS[currentArticleId];
      if (!data) return;
      var text = data[currentFormat] || data.apa;
      modalPreview.textContent = text;
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = modalPreview.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            if (window.showToast) window.showToast('Citation copied in ' + currentFormat.toUpperCase() + ' format!', 'success');
          });
        }
      });
    }
  })();
