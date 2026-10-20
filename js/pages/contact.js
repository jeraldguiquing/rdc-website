    function handleInquirySubmit(e) {
      e.preventDefault();
      var name = document.getElementById('inqName').value.trim();
      var email = document.getElementById('inqEmail').value.trim();
      var phone = document.getElementById('inqPhone').value.trim();
      var topic = document.getElementById('inqTopic').value;
      var subject = document.getElementById('inqSubject').value.trim();
      var message = document.getElementById('inqMessage').value.trim();
      var emailSubject = '[RDC Inquiry] ' + subject;
      var emailBody = [
        'Name: ' + name,
        'Email: ' + email,
        'Contact number: ' + (phone || 'Not provided'),
        'Inquiry topic: ' + topic,
        '',
        'Message:',
        message
      ].join('\n');
      var mailtoUrl = 'mailto:researchoffice@mcnp.edu.ph?subject=' +
        encodeURIComponent(emailSubject) + '&body=' + encodeURIComponent(emailBody);

      window.location.href = mailtoUrl;
    }

    function openCardModal(imgSrc, name) {
      document.getElementById('lightboxImg').src = imgSrc;
      document.getElementById('lightboxName').textContent = name + ' - Official Calling Card';
      document.getElementById('cardLightboxModal').classList.add('open');
    }

    function closeCardModal(e) {
      if (e.target.id === 'cardLightboxModal') {
        document.getElementById('cardLightboxModal').classList.remove('open');
      }
    }

    function closeCardModalDirect() {
      document.getElementById('cardLightboxModal').classList.remove('open');
    }

    function filterPersonnel(category, btn) {
      var btns = document.querySelectorAll('.p-tab-btn');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');
      var cards = document.querySelectorAll('.personnel-card');
      cards.forEach(function(card) {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function selectServiceForPerson(topicKey) {
      var selectElem = document.getElementById('inqTopic');
      if (selectElem && topicKey) {
        var map = {
          'general': 'General Inquiry',
          'training': 'General Inquiry',
          'stats': 'Statistical Consultation',
          'statistics': 'Statistical Consultation',
          'ethics': 'Ethics Clearance (IERC)',
          'turnitin': 'Turnitin & Journal Publishing',
          'defense': 'Defense & SOP Scheduling'
        };
        if (map[topicKey.toLowerCase()]) {
          selectElem.value = map[topicKey.toLowerCase()];
        }
      }
      var formElem = document.getElementById('online-request');
      if (formElem) {
        formElem.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Auto-select topic if URL param present
    document.addEventListener('DOMContentLoaded', function() {
      var params = new URLSearchParams(window.location.search);
      var inq = params.get('inquiry') || params.get('service');
      if (inq) {
        selectServiceForPerson(inq.toLowerCase());
      }
    });
