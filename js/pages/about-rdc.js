    function openAboutCardModal(imgSrc, name) {
      document.getElementById('aboutLightboxImg').src = imgSrc;
      document.getElementById('aboutLightboxName').textContent = name + ' - Official Calling Card';
      document.getElementById('aboutCardLightboxModal').classList.add('open');
    }

    function closeAboutCardModal(e) {
      if (e.target.id === 'aboutCardLightboxModal') {
        document.getElementById('aboutCardLightboxModal').classList.remove('open');
      }
    }

    function closeAboutCardModalDirect() {
      document.getElementById('aboutCardLightboxModal').classList.remove('open');
    }

    function filterAboutPersonnel(category, btn) {
      var btns = document.querySelectorAll('.p-tab-btn');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');
      var cards = document.querySelectorAll('#rdc-personnel .personnel-card');
      cards.forEach(function(card) {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  
    function filterQmsForms(phase, btn) {
      var btns = document.querySelectorAll('.qms-tab-btn');
      btns.forEach(function(b) {
        b.classList.remove('active');
      });
      if (btn) {
        btn.classList.add('active');
      }
      var rows = document.querySelectorAll('.qms-row');
      rows.forEach(function(r) {
        if (phase === 'all' || r.getAttribute('data-phase') === phase) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }

    function searchQmsForms() {
      var query = document.getElementById('qmsSearchInput').value.toLowerCase();
      var rows = document.querySelectorAll('.qms-row');
      rows.forEach(function(r) {
        var text = r.textContent.toLowerCase();
        if (text.indexOf(query) !== -1) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }
