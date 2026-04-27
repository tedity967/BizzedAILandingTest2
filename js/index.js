/* Original inline scripts from index.html */


function addToBrevo(email, firstName, lastName, source) {
  fetch('/subscribe', {method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:email,firstName:firstName,lastName:lastName,source:source})
  }).catch(function(){});
}
 
document.getElementById('hero-signup-btn').addEventListener('click', function() {
  var first = document.getElementById('hero-signup-first').value.trim();
  var last  = document.getElementById('hero-signup-last').value.trim();
  var email = document.getElementById('hero-signup-email').value.trim();
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var form = document.getElementById('hero-signup-form');
  var btn  = document.getElementById('hero-signup-btn');
  if (!re.test(email)) { form.style.borderColor='rgba(239,68,68,.4)'; return; }
  btn.textContent='Sending…'; btn.disabled=true;
  try {
    var ex = JSON.parse(localStorage.getItem('bizzed_user')||'{}');
    localStorage.setItem('bizzed_user', JSON.stringify(Object.assign(ex,{first:first,last:last,email:email})));
  } catch(e){}
  addToBrevo(email, first, last, 'hero-signup');
  setTimeout(function() {
    document.getElementById('hero-success-email').textContent = email;
    form.style.display='none';
    document.getElementById('hero-signup-meta').style.display='none';
    document.getElementById('hero-signup-success').style.display='block';
    document.getElementById('hero-signup-success').classList.add('show');
  }, 800);
});
document.getElementById('hero-signup-form').addEventListener('submit', function(e){ e.preventDefault(); });
 
(function() {
  try {
    var saved = JSON.parse(localStorage.getItem('bizzed_user')||'null');
    if (saved && saved.email) {
      document.getElementById('hero-returning-name').textContent = saved.first || saved.email;
      document.getElementById('hero-signup-form').style.display='none';
      document.getElementById('hero-signup-meta').style.display='none';
      var ret = document.getElementById('hero-returning');
      ret.style.display='block'; ret.classList.add('show');
    }
  } catch(e){}
})();
 
/* Canvas background */
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
      var cx=W*o.x+Math.sin(t*o.speed+o.phase)*W*.06, cy=H*o.y+Math.cos(t*o.speed*.7+o.phase)*H*.05;
      var rr=Math.max(W,H)*o.r, g=ctx.createRadialGradient(cx,cy,0,cx,cy,rr);
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
