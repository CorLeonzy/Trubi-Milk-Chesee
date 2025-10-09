// Loading screen
window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  setTimeout(() => {
    loading.classList.add("fade-out");
    setTimeout(() => loading.style.display = "none", 800);
  }, 2500);
});

// Contact popup
const contactBtn = document.getElementById('contactBtn');
const contactPopup = document.getElementById('contactPopup');
const contactWrap = document.querySelector('.contact-wrap');

function showContact(){
  contactPopup.classList.add('show');
  contactPopup.setAttribute('aria-hidden','false');
}
function hideContact(){
  contactPopup.classList.remove('show');
  contactPopup.setAttribute('aria-hidden','true');
}
contactBtn.addEventListener('mouseenter', showContact);
contactWrap.addEventListener('mouseleave', hideContact);
contactBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  contactPopup.classList.toggle('show');
});
document.addEventListener('click', e => {
  if(!contactWrap.contains(e.target)){
    hideContact();
  }
});

// Parallax hero background
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  const bg = hero.querySelector('.hero-bg');
  const scrolled = window.scrollY;
  bg.style.transform = `translateY(${scrolled * 0.3}px)`;  // parallax ratio
});

// Scroll reveal
const reveals = document.querySelectorAll('[data-reveal]');
function revealOnScroll(){
  const vh = window.innerHeight;
  reveals.forEach(el => {
    const r = el.getBoundingClientRect();
    if(r.top < vh - 80){
      el.classList.add('revealed');
    }
  });
}
window.addEventListener('load', revealOnScroll);
window.addEventListener('scroll', revealOnScroll);

// Find location
function findLocation(){
  window.open('https://www.google.com/maps/place/SMK+Hang+Tuah+1+Jakarta', '_blank');
}

// Review + star rating + localStorage
const stars = Array.from(document.querySelectorAll('.star'));
let rating = 0;
stars.forEach(s => {
  s.addEventListener('mouseenter', () => {
    highlightStars(+s.dataset.value);
  });
  s.addEventListener('mouseleave', () => {
    highlightStars(rating);
  });
  s.addEventListener('click', () => {
    rating = +s.dataset.value;
    highlightStars(rating);
  });
});
function highlightStars(n){
  stars.forEach(s => {
    const v = +s.dataset.value;
    if(v <= n){
      s.classList.add('active');
      s.setAttribute('aria-pressed','true');
    } else {
      s.classList.remove('active');
      s.setAttribute('aria-pressed','false');
    }
  });
}

// localStorage key
const key = 'trubi_reviews';
function getReviews(){
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}
function saveReviews(arr){
  localStorage.setItem(key, JSON.stringify(arr));
}

// render reviews
const reviewsList = document.getElementById('reviewsList');
function renderReviews(){
  const arr = getReviews();
  reviewsList.innerHTML = '';
  if(arr.length === 0){
    reviewsList.innerHTML = '<p class="muted">Belum ada review, jadilah yang pertama!</p>';
    return;
  }
  arr.forEach(r => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `<h4>${escapeHtml(r.name)} <span>★${r.rating}</span></h4>
                     <p>${escapeHtml(r.text)}</p>
                     <div style="font-size:12px;color:rgba(59,42,33,0.5);margin-top:6px">${new Date(r.time).toLocaleString()}</div>`;
    reviewsList.appendChild(div);
  });
}
renderReviews();

// handle form submit
const form = document.getElementById('reviewForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const nm = document.getElementById('reviewName').value.trim();
  const tx = document.getElementById('reviewText').value.trim();
  if(!nm || !tx){
    alert('Isi nama & komentar dulu.');
    return;
  }
  if(rating === 0){
    alert('Pilih rating bintang dulu.');
    return;
  }
  const arr = getReviews();
  arr.unshift({ name: nm, text: tx, rating: rating, time: Date.now() });
  saveReviews(arr);
  renderReviews();
  form.reset();
  rating = 0;
  highlightStars(0);
});

// escape HTML
function escapeHtml(s){
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
