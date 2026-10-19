(function () {
  'use strict';

  function updateCalendarCounts() {
    var scheduled = window.trainingCalendarEvents;
    var archived = window.pastCalendarEvents;
    if (!Array.isArray(scheduled) || !Array.isArray(archived)) {
      console.error('Calendar counts could not be updated: calendar event data is unavailable.');
      return;
    }

    var monthCounts = {};
    scheduled.concat(archived).forEach(function (event, index) {
      if (!event || !Array.isArray(event.dates)) {
        console.error('Calendar counts skipped an event with invalid date data.', event);
        return;
      }

      var isArchived = index >= scheduled.length;
      var eventMonths = {};
      event.dates.forEach(function (date) {
        if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          console.error('Calendar counts skipped an invalid event date.', date);
          return;
        }
        eventMonths[date.slice(0, 7)] = true;
      });

      Object.keys(eventMonths).forEach(function (month) {
        if (!monthCounts[month]) monthCounts[month] = { scheduled: 0, archived: 0 };
        monthCounts[month][isArchived ? 'archived' : 'scheduled']++;
      });
    });

    document.querySelectorAll('[data-calendar-count="scheduled"]').forEach(function (el) {
      el.textContent = scheduled.length;
    });
    document.querySelectorAll('[data-calendar-count="archived"]').forEach(function (el) {
      el.textContent = archived.length;
    });

    document.querySelectorAll('#calMonthJumpSelect').forEach(function (select) {
      var selectedMonth = select.value;
      var months = Object.keys(monthCounts).sort();
      select.textContent = '';
      months.forEach(function (month) {
        var counts = monthCounts[month];
        var parts = month.split('-');
        var label = new Date(Number(parts[0]), Number(parts[1]) - 1, 1)
          .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        var countLabels = [];
        if (counts.archived) {
          countLabels.push(counts.archived + ' Completed Event' + (counts.archived === 1 ? '' : 's'));
        }
        if (counts.scheduled) {
          countLabels.push(counts.scheduled + ' Scheduled Entr' + (counts.scheduled === 1 ? 'y' : 'ies'));
        }

        var option = document.createElement('option');
        option.value = month;
        option.textContent = label + (countLabels.length ? ' (' + countLabels.join(', ') + ')' : '');
        select.appendChild(option);
      });

      if (months.indexOf(selectedMonth) !== -1) {
        select.value = selectedMonth;
      } else if (months.length) {
        select.value = months[0];
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCalendarCounts);
  } else {
    updateCalendarCounts();
  }
})();
