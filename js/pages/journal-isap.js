  (function () {
    var CITATIONS = {
      'duldulao-2026': {
        title: 'Predictive Profiling and Community Policing Frameworks in Cagayan Valley Rural Municipalities',
        apa: 'Duldulao, R. S., Soriano, M. L., & Mallillin, J. V. (2026). Predictive Profiling and Community Policing Frameworks in Cagayan Valley Rural Municipalities. ISAP DAWA Multidisciplinary Research Journal, 11(1), 1-16. https://doi.org/10.5281/isap.2026.1104',
        mla: 'Duldulao, R. S., M. L. Soriano, and J. V. Mallillin. "Predictive Profiling and Community Policing Frameworks in Cagayan Valley Rural Municipalities." ISAP DAWA Multidisciplinary Research Journal, vol. 11, no. 1, 2026, pp. 1-16. DOI: 10.5281/isap.2026.1104.',
        chicago: 'Duldulao, R. S., M. L. Soriano, and J. V. Mallillin. "Predictive Profiling and Community Policing Frameworks in Cagayan Valley Rural Municipalities." ISAP DAWA Multidisciplinary Research Journal 11, no. 1 (2026): 1-16.',
        bibtex: '@article{duldulao2026policing,\n  author = {Duldulao, R. S. and Soriano, M. L. and Mallillin, J. V.},\n  title = {Predictive Profiling and Community Policing Frameworks in Cagayan Valley Rural Municipalities},\n  journal = {ISAP DAWA Multidisciplinary Research Journal},\n  volume = {11},\n  number = {1},\n  pages = {1--16},\n  year = {2026},\n  doi = {10.5281/isap.2026.1104}\n}'
      },
      'pasion-2026': {
        title: 'Cryptographic Hash Validation and Chain-of-Custody Integrity in Mobile Forensics Investigations',
        apa: 'Pasion, E. V., & Tolentino, B. K. (2026). Cryptographic Hash Validation and Chain-of-Custody Integrity in Mobile Forensics Investigations. ISAP DAWA Multidisciplinary Research Journal, 11(1), 17-31. https://doi.org/10.5281/isap.2026.1105',
        mla: 'Pasion, E. V., and B. K. Tolentino. "Cryptographic Hash Validation and Chain-of-Custody Integrity in Mobile Forensics Investigations." ISAP DAWA Multidisciplinary Research Journal, vol. 11, no. 1, 2026, pp. 17-31. DOI: 10.5281/isap.2026.1105.',
        chicago: 'Pasion, E. V., and B. K. Tolentino. "Cryptographic Hash Validation and Chain-of-Custody Integrity in Mobile Forensics Investigations." ISAP DAWA Multidisciplinary Research Journal 11, no. 1 (2026): 17-31.',
        bibtex: '@article{pasion2026forensics,\n  author = {Pasion, E. V. and Tolentino, B. K.},\n  title = {Cryptographic Hash Validation and Chain-of-Custody Integrity in Mobile Forensics Investigations},\n  journal = {ISAP DAWA Multidisciplinary Research Journal},\n  volume = {11},\n  number = {1},\n  pages = {17--31},\n  year = {2026},\n  doi = {10.5281/isap.2026.1105}\n}'
      },
      'bautista-2026': {
        title: 'Post-Clearance Audit Compliance and Revenue Leakage Prevention at Northern Luzon Maritime Ports',
        apa: 'Bautista, K. M., & Ramirez, G. N. (2026). Post-Clearance Audit Compliance and Revenue Leakage Prevention at Northern Luzon Maritime Ports. ISAP DAWA Multidisciplinary Research Journal, 11(1), 32-48. https://doi.org/10.5281/isap.2026.1106',
        mla: 'Bautista, K. M., and G. N. Ramirez. "Post-Clearance Audit Compliance and Revenue Leakage Prevention at Northern Luzon Maritime Ports." ISAP DAWA Multidisciplinary Research Journal, vol. 11, no. 1, 2026, pp. 32-48. DOI: 10.5281/isap.2026.1106.',
        chicago: 'Bautista, K. M., and G. N. Ramirez. "Post-Clearance Audit Compliance and Revenue Leakage Prevention at Northern Luzon Maritime Ports." ISAP DAWA Multidisciplinary Research Journal 11, no. 1 (2026): 32-48.',
        bibtex: '@article{bautista2026customs,\n  author = {Bautista, K. M. and Ramirez, G. N.},\n  title = {Post-Clearance Audit Compliance and Revenue Leakage Prevention at Northern Luzon Maritime Ports},\n  journal = {ISAP DAWA Multidisciplinary Research Journal},\n  volume = {11},\n  number = {1},\n  pages = {32--48},\n  year = {2026},\n  doi = {10.5281/isap.2026.1106}\n}'
      },
      'almazan-2026': {
        title: 'Cognitive Engagement and Critical Thinking in Simulation-Based Law Enforcement Training',
        apa: 'Almazan, H. J., & Guzman, C. R. (2026). Cognitive Engagement and Critical Thinking in Simulation-Based Law Enforcement Training. ISAP DAWA Multidisciplinary Research Journal, 11(1), 49-64. https://doi.org/10.5281/isap.2026.1107',
        mla: 'Almazan, H. J., and C. R. Guzman. "Cognitive Engagement and Critical Thinking in Simulation-Based Law Enforcement Training." ISAP DAWA Multidisciplinary Research Journal, vol. 11, no. 1, 2026, pp. 49-64.',
        chicago: 'Almazan, H. J., and C. R. Guzman. "Cognitive Engagement and Critical Thinking in Simulation-Based Law Enforcement Training." ISAP DAWA Multidisciplinary Research Journal 11, no. 1 (2026): 49-64.',
        bibtex: '@article{almazan2026simulation,\n  author = {Almazan, H. J. and Guzman, C. R.},\n  title = {Cognitive Engagement and Critical Thinking in Simulation-Based Law Enforcement Training},\n  journal = {ISAP DAWA Multidisciplinary Research Journal},\n  volume = {11},\n  number = {1},\n  pages = {49--64},\n  year = {2026},\n  doi = {10.5281/isap.2026.1107}\n}'
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
