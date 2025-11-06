/* TRUBI — script final upgrade (review polished) */

/* LOADING */
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  if (!loading) return;
  setTimeout(() => {
    loading.classList.add("fade-out");
    setTimeout(() => loading.style.display = "none", 700);
  }, 900);
});

/* MOBILE NAVIGATION */
(function mobileNavInit() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    // Update aria attributes
    const isExpanded = mobileMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    mobileMenu.setAttribute('aria-hidden', !isExpanded);
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update aria attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Event listeners
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking on links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
})();

/* CONTACT POPUP (click toggle) */
const contactBtn = document.getElementById('contactBtn');
const contactPopup = document.getElementById('contactPopup');
if (contactBtn && contactPopup) {
  contactBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    contactPopup.classList.toggle('show');
    contactBtn.setAttribute('aria-expanded', contactPopup.classList.contains('show'));
  });
  document.addEventListener('click', (e) => {
    if (!contactBtn.contains(e.target) && !contactPopup.contains(e.target)) {
      contactPopup.classList.remove('show');
      contactBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* SCROLL REVEAL (IntersectionObserver) */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

/* FIND LOCATION */
function findLocation(){
  window.open('https://www.google.com/maps/place/SMK+Hang+Tuah+1+Jakarta','_blank');
}
window.findLocation = findLocation;

/* GALLERY SLIDER (simple looping with clones, responsive) */
(function galleryInit(){
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  const imgs = Array.from(track.querySelectorAll('img'));
  let visible = calcVisible();
  let index = 0;
  let timer = null;
  function calcVisible(){
    const w = window.innerWidth;
    if (w <= 700) return 1;
    if (w <= 1000) return 2;
    return 3;
  }
  function setSizes(){
    visible = calcVisible();
    // set flex basis on images (existing + clones)
    const items = Array.from(track.querySelectorAll('img'));
    const pct = 100 / visible;
    items.forEach(it => { it.style.flex = `0 0 ${pct}%`; });
  }
  // create clones for smooth loop
  function buildClones(){
    // remove old clones
    Array.from(track.querySelectorAll('img.clone')).forEach(n => n.remove());
    const base = Array.from(track.querySelectorAll('img')).filter(i => !i.classList.contains('clone'));
    for (let i=0;i<visible;i++){
      const cl = base[i % base.length].cloneNode(true);
      cl.classList.add('clone');
      track.appendChild(cl);
    }
  }
  function goTo(i, animate=true){
    const pct = (100 / visible);
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform .8s cubic-bezier(.22,.9,.32,1)';
    track.style.transform = `translateX(-${i * pct}%)`;
    if (!animate) { track.offsetHeight; track.style.transition = ''; }
  }
  function next(){
    index++;
    goTo(index, true);
    const totalReal = imgs.length;
    setTimeout(()=> {
      if (index >= totalReal) {
        index = 0;
        goTo(index, false);
      }
    }, 860);
  }
  function prev(){
    if (index === 0) {
      // jump to end (without animation) then animate to last real
      const totalReal = imgs.length;
      index = totalReal;
      goTo(index, false);
      track.offsetHeight;
      index = totalReal - 1;
      goTo(index, true);
      return;
    }
    index--;
    goTo(index, true);
  }
  // controls
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });

  function startAuto(){ stopAuto(); timer = setInterval(next, 3000); }
  function stopAuto(){ if (timer) clearInterval(timer); timer = null; }
  function resetTimer(){ stopAuto(); startAuto(); }

  // init
  function refresh(){
    setSizes();
    buildClones();
    setSizes();
    index = 0;
    goTo(0, false);
  }
  window.addEventListener('resize', () => { setTimeout(refresh, 220); });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart', stopAuto, {passive:true});
  track.addEventListener('touchend', startAuto, {passive:true});

  refresh();
  startAuto();
})();

/* REVIEW: localStorage + UI */
(function reviewModule(){
  const KEY = 'trubi_reviews_v3';
  const form = document.getElementById('reviewForm');
  const nameInput = document.getElementById('reviewName');
  const txtInput = document.getElementById('reviewText');
  const stars = Array.from(document.querySelectorAll('.star'));
  const reviewsList = document.getElementById('reviewsList');
  const avgValue = document.getElementById('avgValue');
  const avgStars = document.getElementById('avgStars');
  const avgCount = document.getElementById('avgCount');
  const toast = document.getElementById('toast');

  let rating = 0;

  function getReviews(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function saveReviews(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }

  function calcAverage(arr){
    if (!arr.length) return {avg:0,count:0};
    const sum = arr.reduce((s,r)=> s + (r.rating||0), 0);
    const avg = +(sum / arr.length).toFixed(1);
    return {avg, count: arr.length};
  }

  function renderAvg(){
    const arr = getReviews();
    const {avg, count} = calcAverage(arr);
    avgValue.textContent = avg.toFixed(1);
    // render stars (simple)
    avgStars.innerHTML = '';
    const full = Math.round(avg);
    for (let i=1;i<=5;i++){
      const s = document.createElement('span');
      s.textContent = i <= full ? '★' : '☆';
      s.style.color = i <= full ? '#ffd600' : 'rgba(0,0,0,0.15)';
      s.style.fontSize = '18px';
      avgStars.appendChild(s);
    }
    avgCount.textContent = count ? `${count} review` : 'Belum ada review';
  }

  function makeAvatar(name){
    const initials = (name || 'U').split(' ').map(n=> n.charAt(0)).slice(0,2).join('').toUpperCase();
    // color by char code
    const code = initials.charCodeAt(0) || 65;
    const hue = (code * 37) % 360;
    const bg = `linear-gradient(135deg,hsl(${hue} 70% 55%), hsl(${(hue+30)%360} 70% 45%))`;
    return {initials, bg};
  }

  function renderReviews(){
    const arr = getReviews();
    reviewsList.innerHTML = '';
    if (!arr.length) {
      reviewsList.innerHTML = '<p class="muted">Belum ada review — jadilah yang pertama!</p>';
      renderAvg();
      return;
    }
    arr.forEach(r => {
      const el = document.createElement('div');
      el.className = 'review-item';
      const av = makeAvatar(r.name);
      el.innerHTML = `
        <div class="avatar" style="background:${av.bg}">${av.initials}</div>
        <div class="review-body">
          <div class="review-meta">
            <div class="name">${escapeHtml(r.name)}</div>
            <div class="date">${new Date(r.time).toLocaleString()}</div>
            <div class="rating" aria-hidden="true">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          </div>
          <div class="review-text">${escapeHtml(r.text)}</div>
        </div>
      `;
      reviewsList.appendChild(el);
    });
    renderAvg();
  }

  function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // star interactions
  function highlight(n){
    stars.forEach(s => {
      const v = +s.dataset.value;
      if (v <= n) s.classList.add('active'); else s.classList.remove('active');
      s.setAttribute('aria-pressed', v <= n ? 'true' : 'false');
    });
  }
  stars.forEach(s => {
    s.addEventListener('mouseenter', () => highlight(+s.dataset.value));
    s.addEventListener('mouseleave', () => highlight(rating));
    s.addEventListener('click', () => {
      rating = +s.dataset.value;
      highlight(rating);
      // small animation
      s.animate([{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:220,easing:'ease-out'});
    });
    // keyboard accessibility
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); }
    });
  });

  // toast helper
  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.setAttribute('aria-hidden','false');
    setTimeout(()=>{ toast.style.opacity = '0'; toast.setAttribute('aria-hidden','true'); }, 2200);
  }

  // handle submit
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = txtInput.value.trim();
      if (!name || !text) { alert('Isi nama & komentar dulu.'); return; }
      if (rating === 0) { alert('Pilih rating bintang dulu.'); return; }
      const arr = getReviews();
      arr.unshift({ id: Date.now(), name, text, rating, time: Date.now() });
      saveReviews(arr);
      renderReviews();
      form.reset();
      rating = 0;
      highlight(0);
      showToast('Terima kasih! Review Anda berhasil disimpan.');
    });
    // reset behavior
    form.addEventListener('reset', () => {
      rating = 0;
      highlight(0);
    });
  }

  // initial render
  renderReviews();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
