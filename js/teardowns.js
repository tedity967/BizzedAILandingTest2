/* Original inline scripts from teardowns.html */

/* Update "SIGN UP TO UNLOCK" for returning users */
(function() {
  try {
    var saved = JSON.parse(localStorage.getItem('bizzed_user') || 'null');
    if (saved && saved.email) {
      document.querySelectorAll('.fp-lock').forEach(function(el) {
        el.textContent = '✓ FULL REPORT · UNLOCKED';
        el.style.borderStyle = 'solid';
        el.style.borderColor = 'rgba(16,185,129,.3)';
        el.style.color = '#10b981';
        el.style.background = 'rgba(16,185,129,.08)';
      });
    }
  } catch(e) {}
})();

/* ========================
   OPEN / CLOSE DOC
======================== */
var TEARDOWN_META = {
  '049': { label: 'Issue #002 · Apr 22, 2026' },
  '048': { label: 'Issue #001 · Apr 15, 2026' }
};
 
function openDoc(id) {
  document.querySelectorAll('.doc-body').forEach(function(el){ el.style.display = 'none'; });
  var body = document.getElementById('doc-' + id);
  if (body) body.style.display = 'block';
  var lbl = document.getElementById('doc-topbar-label');
  if (lbl) lbl.textContent = (TEARDOWN_META[id] || {}).label || '';
  var docPage = document.getElementById('doc-page');
  var listingPage = document.getElementById('listing-page');
  listingPage.style.display = 'none';
  docPage.classList.add('open');
  docPage.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  try {
    var saved = JSON.parse(localStorage.getItem('bizzed_user') || 'null');
    if (saved && saved.email) { unlockGateImmediate(id); }
  } catch(e) {}
  setTimeout(animateRings, 300);
}
 
function closeDoc() {
  var docPage = document.getElementById('doc-page');
  var listingPage = document.getElementById('listing-page');
  docPage.classList.remove('open');
  listingPage.style.display = '';
  document.body.style.overflow = '';
}
 
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDoc();
});
 
/* ========================
   GATE UNLOCK
======================== */
function unlockGate(id) {
  var first = document.getElementById('gate-first-' + id);
  var last  = document.getElementById('gate-last-' + id);
  var email = document.getElementById('gate-email-' + id);
  var err   = document.getElementById('gate-err-' + id);
  var btn   = document.getElementById('gate-btn-' + id);
  var re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  [first, last, email].forEach(function(el){ el.classList.remove('err'); });
  err.style.display = 'none';
 
  var ok = true;
  if (!first.value.trim()) { first.classList.add('err'); ok = false; }
  if (!last.value.trim())  { last.classList.add('err'); ok = false; }
  if (!re.test(email.value.trim())) { email.classList.add('err'); ok = false; }
  if (!ok) { err.textContent = 'Please fill in all fields with a valid email.'; err.style.display='block'; return; }
 
  btn.disabled = true;
  btn.textContent = 'Unlocking…';
 
  try {
    var user = {first: first.value.trim(), last: last.value.trim(), email: email.value.trim()};
    localStorage.setItem('bizzed_user', JSON.stringify(user));
  } catch(e){}
 
  // Send to Brevo
  fetch('/subscribe', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: email.value.trim(), firstName: first.value.trim(), lastName: last.value.trim(), source: 'teardown-048'})
  }).catch(function(){});
 
  setTimeout(function() { unlockGateImmediate(id); }, 800);
}
 
function unlockGateImmediate(id) {
  var wrapper = document.getElementById('gate-wrapper-' + id);
  var notice  = document.getElementById('gate-notice-' + id);
  if (wrapper) { wrapper.classList.add('unlocked'); }
  if (notice)  { notice.classList.add('show'); }
}
 
/* ========================
   RING ANIMATIONS
======================== */
function animateRings() {
  // Find the currently visible doc-body
  var activeDoc = document.querySelector('.doc-body[style*="block"]') || document.querySelector('.doc-body:not([style*="none"])');
  var scope = activeDoc || document;
  var circumference = 289;
  scope.querySelectorAll('.dd-ring-fill').forEach(function(circle) {
    var pct = parseInt(circle.getAttribute('data-pct') || 0);
    // Reset first so animation plays fresh each time
    circle.style.transition = 'none';
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        circle.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.25,.46,.45,.94)';
        circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
      });
    });
  });
  // Animate counter numbers within scope
  scope.querySelectorAll('.dd-ring-pct[data-target]').forEach(function(el) {
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
 
/* ========================
   PARTICLE BACKGROUND
======================== */
(function() {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles;
  var COLORS = ['rgba(139,92,246,','rgba(196,181,253,','rgba(236,72,153,','rgba(244,114,182,','rgba(59,130,246,'];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function mkP() {
    var c = COLORS[Math.floor(Math.random()*COLORS.length)];
    return {x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.4,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.22,color:c,a:Math.random()*.55+.15,pulse:Math.random()*Math.PI*2,ps:Math.random()*.008+.003};
  }
  function init() { resize(); var n=Math.min(Math.floor(W*H/8000),160); particles=[]; for(var i=0;i<n;i++) particles.push(mkP()); }
  var orbs=[{x:.15,y:.10,r:.38,color:'rgba(139,92,246,',phase:0,speed:.0004},{x:.85,y:.22,r:.28,color:'rgba(236,72,153,',phase:1.57,speed:.0003},{x:.50,y:.85,r:.32,color:'rgba(59,130,246,',phase:3.14,speed:.00035}];
  var t=0;
  function draw() {
    ctx.clearRect(0,0,W,H);
    var grd=ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.8);
    grd.addColorStop(0,'rgba(10,8,22,0)'); grd.addColorStop(1,'rgba(10,8,22,0.92)');
    ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
    orbs.forEach(function(o){
      var cx=W*o.x+Math.sin(t*o.speed+o.phase)*W*.06;
      var cy=H*o.y+Math.cos(t*o.speed*.7+o.phase)*H*.05;
      var rr=Math.max(W,H)*o.r;
      var g=ctx.createRadialGradient(cx,cy,0,cx,cy,rr);
      g.addColorStop(0,o.color+'0.22)'); g.addColorStop(.5,o.color+'0.08)'); g.addColorStop(1,o.color+'0)');
      ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    });
    for(var i=0;i<particles.length;i++){var p=particles[i];for(var j=i+1;j<particles.length;j++){var q=particles[j];var dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle='rgba(196,181,253,'+(1-d/110)*.06+')';ctx.lineWidth=.5;ctx.stroke();}}}
    particles.forEach(function(p){p.pulse+=p.ps;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color+(p.a+Math.sin(p.pulse)*.12)+')';ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;});
    t++; requestAnimationFrame(draw);
  }
  window.addEventListener('resize',function(){resize();});
  init(); draw();
})();
 
function toggleAccordion(id) {
  var sec = document.getElementById(id);
  sec.classList.toggle('open');
  var lbl = sec.querySelector('.accordion-btn-label');
  if (sec.classList.contains('open')) {
    lbl.textContent = lbl.textContent.indexOf('Teardown') >= 0 ? 'Hide Full Teardown' : 'Hide Full Research';
  } else {
    lbl.textContent = lbl.textContent.indexOf('Teardown') >= 0 ? 'View Full Teardown' : 'View Full Research';
  }
}
