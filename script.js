// =====================================================================
// AuraSMP — interactions
// =====================================================================

const SERVER_IP = "aurasmp.de:25570";

/* ---------- copy to clipboard + toast ---------- */
function copyIP(){
  navigator.clipboard?.writeText(SERVER_IP).catch(()=>{});
  showToast();
}
function showToast(){
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('show'), 2200);
}
['navIpBtn','heroIpBtn','joinIpBtn','ctaIpBtn'].forEach(id=>{
  const el = document.getElementById(id);
  el?.addEventListener('click', copyIP);
});

/* ---------- nav scroll state ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- mobile burger menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', ()=>{
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('active');
});
mobileMenu?.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=> mobileMenu.classList.remove('open'));
});

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el, i)=>{
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
  io.observe(el);
});

/* ---------- live server status (real, via mcsrvstat.us) ---------- */
const onlineEl = document.getElementById('onlineCount');
const onlineLabelEl = document.getElementById('onlineLabel');
const statusDot = document.getElementById('statusDot');
const navIpDot = document.getElementById('navIpDot');
const navStatusCount = document.getElementById('navStatusCount');

async function fetchServerStatus(){
  try{
    const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
    const data = await res.json();

    if(data.online){
      const count = data.players?.online ?? '?';
      onlineEl.textContent = count;
      if(navStatusCount) navStatusCount.textContent = count;
      setLabel('Spieler online');
      setStatus(true);
    } else {
      onlineEl.textContent = '–';
      if(navStatusCount) navStatusCount.textContent = '0';
      setLabel('Server offline');
      setStatus(false);
    }
  } catch(err){
    onlineEl.textContent = '–';
    if(navStatusCount) navStatusCount.textContent = '?';
    setLabel('Status unbekannt');
  }
}

function setLabel(text){
  if(!onlineLabelEl) return;
  const dot = onlineLabelEl.querySelector('.status-dot');
  onlineLabelEl.textContent = text;
  if(dot) onlineLabelEl.prepend(dot);
}

function setStatus(isOnline){
  [statusDot, navIpDot].forEach(dot=>{
    if(!dot) return;
    dot.classList.toggle('is-online', isOnline);
    dot.classList.toggle('is-offline', !isOnline);
  });
}

if(onlineEl){
  fetchServerStatus();
  setInterval(fetchServerStatus, 60000); // alle 60 Sekunden neu abfragen
}

/* ---------- floating particle field (hero) ---------- */
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COLORS = ['rgba(124,92,255,', 'rgba(51,232,200,', 'rgba(244,198,90,'];

  function resize(){
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  function initParticles(){
    const count = Math.min(60, Math.floor(canvas.offsetWidth / 18));
    particles = Array.from({length: count}, ()=>({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }
  function draw(){
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach(p=>{
      p.y -= p.speed;
      p.x += p.drift;
      if(p.y < -10){ p.y = canvas.offsetHeight + 10; p.x = Math.random() * canvas.offsetWidth; }
      ctx.beginPath();
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', ()=>{ resize(); initParticles(); });
  resize();
  initParticles();
  draw();
}
