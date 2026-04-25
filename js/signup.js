/* =============================================
   Email Signup (Brevo integration)
   Handles hero signup, doc-gate signups,
   and returning-user detection via localStorage.
   ============================================= */

/**
 * Send a contact to Brevo via the serverless function.
 */
function addToBrevo(email, firstName, lastName, source) {
  fetch('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, firstName: firstName, lastName: lastName, source: source })
  }).catch(function () {});
}

/**
 * Save user to localStorage for returning-user detection.
 */
function saveUser(first, last, email) {
  try {
    var ex = JSON.parse(localStorage.getItem('bizzed_user') || '{}');
    localStorage.setItem('bizzed_user', JSON.stringify(
      Object.assign(ex, { first: first, last: last, email: email })
    ));
  } catch (e) {}
}

/**
 * Get saved user from localStorage.
 * @returns {object|null}
 */
function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('bizzed_user') || 'null');
  } catch (e) {
    return null;
  }
}

/* ── Hero Signup (index page) ── */
(function () {
  var form = document.getElementById('hero-signup-form');
  var btn = document.getElementById('hero-signup-btn');
  if (!form || !btn) return;

  btn.addEventListener('click', function () {
    var first = document.getElementById('hero-signup-first').value.trim();
    var last = document.getElementById('hero-signup-last').value.trim();
    var email = document.getElementById('hero-signup-email').value.trim();
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) { form.style.borderColor = 'rgba(239,68,68,.4)'; return; }

    btn.textContent = 'Sending…';
    btn.disabled = true;
    saveUser(first, last, email);
    addToBrevo(email, first, last, 'hero-signup');

    setTimeout(function () {
      document.getElementById('hero-success-email').textContent = email;
      form.style.display = 'none';
      document.getElementById('hero-signup-meta').style.display = 'none';
      var success = document.getElementById('hero-signup-success');
      success.style.display = 'block';
      success.classList.add('show');
    }, 800);
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  // Returning user check
  var saved = getSavedUser();
  if (saved && saved.email) {
    document.getElementById('hero-returning-name').textContent = saved.first || saved.email;
    form.style.display = 'none';
    document.getElementById('hero-signup-meta').style.display = 'none';
    var ret = document.getElementById('hero-returning');
    ret.style.display = 'block';
    ret.classList.add('show');
  }
})();
