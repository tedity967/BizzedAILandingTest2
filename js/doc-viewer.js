/* =============================================
   Document Viewer
   Handles opening/closing doc overlays,
   content-gate signups, ring animations, and accordions.
   ============================================= */

/**
 * Open a document overlay by ID.
 * @param {string} id - The doc identifier (e.g., '049', '048', 'pet')
 */
function openDoc(id) {
  var docPage = document.getElementById('doc-page');
  var docBody = document.getElementById('doc-' + id);
  if (!docPage || !docBody) return;

  // Hide all doc bodies first
  var allBodies = docPage.querySelectorAll('.doc-body');
  allBodies.forEach(function (b) { b.style.display = 'none'; });

  // Show target
  docBody.style.display = 'block';
  docPage.style.display = 'block';
  docPage.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Update topbar label if the doc-body has a data-label attribute
  var label = docBody.getAttribute('data-label');
  var topLabel = document.getElementById('doc-topbar-label');
  if (label && topLabel) topLabel.textContent = label;

  // Check if user already unlocked
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem('bizzed_user') || 'null'); } catch (e) {}
  if (saved && saved.email) {
    var wrapper = document.getElementById('gate-wrapper-' + id);
    if (wrapper) wrapper.classList.add('unlocked');
  }

  // Scroll to top of doc
  docPage.scrollTop = 0;

  // Trigger ring animations
  setTimeout(function () { animateRings(); }, 300);
}

/**
 * Close the document overlay.
 */
function closeDoc() {
  var docPage = document.getElementById('doc-page');
  if (!docPage) return;
  docPage.classList.remove('open');
  docPage.style.display = 'none';
  document.body.style.overflow = '';
}

/**
 * Handle gate form submission.
 * @param {string} id - The doc identifier for this gate
 */
function submitGate(id) {
  var first = document.getElementById('gate-first-' + id);
  var last = document.getElementById('gate-last-' + id);
  var email = document.getElementById('gate-email-' + id);
  var btn = document.getElementById('gate-btn-' + id);
  var errMsg = document.getElementById('gate-err-' + id);
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email.value.trim())) {
    email.classList.add('err');
    if (errMsg) { errMsg.textContent = 'Please enter a valid email.'; errMsg.classList.add('show'); }
    return;
  }

  email.classList.remove('err');
  if (errMsg) errMsg.classList.remove('show');
  btn.textContent = 'Unlocking…';
  btn.disabled = true;

  // Save user
  try {
    var user = { first: first.value.trim(), last: last.value.trim(), email: email.value.trim() };
    localStorage.setItem('bizzed_user', JSON.stringify(user));
  } catch (e) {}

  // Send to Brevo
  if (typeof addToBrevo === 'function') {
    addToBrevo(email.value.trim(), first.value.trim(), last.value.trim(), 'gate-' + id);
  } else {
    fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        firstName: first.value.trim(),
        lastName: last.value.trim(),
        source: 'gate-' + id
      })
    }).catch(function () {});
  }

  setTimeout(function () { unlockGateImmediate(id); }, 800);
}

/**
 * Immediately unlock a gate (skip animation delay).
 */
function unlockGateImmediate(id) {
  var wrapper = document.getElementById('gate-wrapper-' + id);
  var notice = document.getElementById('gate-notice-' + id);
  if (wrapper) wrapper.classList.add('unlocked');
  if (notice) notice.classList.add('show');
}

/* ── Ring Animations ── */
function animateRings() {
  var activeDoc = document.querySelector('.doc-body[style*="block"]') ||
                  document.querySelector('.doc-body:not([style*="none"])');
  var scope = activeDoc || document;
  var circumference = 289;

  scope.querySelectorAll('.dd-ring-fill').forEach(function (circle) {
    var pct = parseInt(circle.getAttribute('data-pct') || 0);
    circle.style.transition = 'none';
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        circle.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.25,.46,.45,.94)';
        circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
      });
    });
  });

  // Animate counter numbers
  scope.querySelectorAll('.dd-ring-pct[data-target]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target') || 0);
    el.textContent = '0%';
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + '%';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ── Accordion Toggle ── */
function toggleAccordion(id) {
  var sec = document.getElementById(id);
  if (!sec) return;
  sec.classList.toggle('open');
  var lbl = sec.querySelector('.accordion-btn-label');
  if (!lbl) return;
  if (sec.classList.contains('open')) {
    lbl.textContent = lbl.textContent.indexOf('Teardown') >= 0 ? 'Hide Full Teardown' : 'Hide Full Research';
  } else {
    lbl.textContent = lbl.textContent.indexOf('Teardown') >= 0 ? 'View Full Teardown' : 'View Full Research';
  }
}

/* ── Risk Row Toggle ── */
function toggleRisk(el) {
  var row = el.closest('.dd-risk-row');
  if (row) row.classList.toggle('open');
}
