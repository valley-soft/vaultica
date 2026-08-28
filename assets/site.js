const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !open);
  });

  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }));
}

document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll('[data-slide]')];
  const dots = [...slideshow.querySelectorAll('[data-slide-to]')];
  const previous = slideshow.querySelector('[data-slide-prev]');
  const next = slideshow.querySelector('[data-slide-next]');
  const count = slideshow.querySelector('[data-slide-count]');
  if (slides.length < 2) return;
  let index = 0;
  let timer;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const stop = () => { window.clearInterval(timer); };
  const start = () => {
    stop();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = window.setInterval(() => show(index + 1), 5200);
  };
  previous?.addEventListener('click', () => { show(index - 1); start(); });
  next?.addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((dot) => dot.addEventListener('click', () => { show(Number(dot.dataset.slideTo)); start(); }));
  slideshow.addEventListener('mouseenter', stop);
  slideshow.addEventListener('mouseleave', start);
  slideshow.addEventListener('focusin', stop);
  slideshow.addEventListener('focusout', (event) => { if (!slideshow.contains(event.relatedTarget)) start(); });
  show(0);
  start();
});

const lightbox = document.querySelector('.capture-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = trigger.dataset.lightbox;
    lightboxImage.alt = trigger.querySelector('img')?.alt || 'Vaultica application screenshot';
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
