const modalOverlay = document.querySelector('.modal-overlay');
const modalBody = document.querySelector('.modal-body');
const modalClose = document.querySelector('.modal-close');

function openModal(type) {
  if (!modalOverlay || !modalBody) return;

  const templates = {
    contact: `
      <h2>Напишите нам</h2>
      <form data-form="contact">
        <textarea placeholder="Сообщение..."></textarea>
        <input type="email" placeholder="Ваша почта">
        <button type="submit">Отправить</button>
      </form>
    `,
    subscribe: `
      <h2>Подписаться на рассылку</h2>
      <form data-form="subscribe">
        <input type="email" placeholder="Ваша почта">
        <button type="submit">Подписаться</button>
      </form>
    `,
    event: `
      <h2>Запишитесь на событие</h2>
      <form data-form="event">
        <input type="text" placeholder="Ваше имя">
        <input type="email" placeholder="Ваша почта">
        <button type="submit">Записаться</button>
      </form>
    `
  };

  modalBody.innerHTML = templates[type] || templates.contact;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function showSuccess(text) {
  modalBody.innerHTML = `<div class="success-message">${text}</div>`;
}

document.addEventListener('click', (event) => {
  const modalTrigger = event.target.closest('[data-modal]');
  if (modalTrigger) {
    event.preventDefault();
    openModal(modalTrigger.dataset.modal);
  }

  if (event.target === modalOverlay || event.target.closest('.modal-close')) {
    closeModal();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();

  if (form.dataset.form === 'event') {
    showSuccess('Вы записаны на событие!<br>Мы отправили на Вашу почту<br>письмо с точной информацией.');
    return;
  }

  if (form.dataset.form === 'subscribe') {
    showSuccess('Вы подписаны на рассылку!');
    return;
  }

  showSuccess('Сообщение отправлено!');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

const carouselRoot = document.querySelector('[data-carousel]');
if (carouselRoot) {
  const books = [
    {
      title: 'Мемуары',
      image: 'images/k1.jpg',
      text: '«Я не могу видеть чистого пера без того, чтобы не испытывать желания немедленно окунуть его в чернила», – честно признавалась Екатерина II в своих мемуарах, которые были запрещены в царской России.',
      link: 'product.html'
    },
    {
      title: 'Вокруг Чехова',
      image: 'images/k2.jpg',
      text: 'В книге собраны воспоминания об Антоне Павловиче Чехове и его окружении, принадлежащие родным писателя — брату, сестре, племянникам, а также мемуары о чеховской семье.',
      link: 'product.html'
    },
    {
      title: 'История русской музыки',
      image: 'images/k3.jpg',
      text: 'В данный сборник вошли три книги, и ныне являющиеся библиографической редкостью, поскольку не переиздавались с момента первой публикации в середине 20-х годов XX века.',
      link: 'product.html'
    }
  ];

  let currentBook = 0;
  const image = carouselRoot.querySelector('[data-carousel-image]');
  const title = carouselRoot.querySelector('[data-carousel-title]');
  const text = carouselRoot.querySelector('[data-carousel-text]');
  const link = carouselRoot.querySelector('[data-carousel-link]');
  const dots = carouselRoot.querySelectorAll('[data-carousel-dot]');

  function renderCarousel() {
    const book = books[currentBook];
    image.src = book.image;
    image.alt = book.title;
    title.textContent = book.title;
    text.textContent = book.text;
    link.href = book.link;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentBook));
  }

  carouselRoot.addEventListener('click', (event) => {
    const next = event.target.closest('[data-carousel-next]');
    const prev = event.target.closest('[data-carousel-prev]');
    const dot = event.target.closest('[data-carousel-dot]');

    if (next) currentBook = (currentBook + 1) % books.length;
    if (prev) currentBook = (currentBook - 1 + books.length) % books.length;
    if (dot) currentBook = Number(dot.dataset.carouselDot);

    if (next || prev || dot) renderCarousel();
  });

  renderCarousel();
}

const genreButton = document.querySelector('[data-genre-button]');
const genreMenu = document.querySelector('[data-genre-menu]');
if (genreButton && genreMenu) {
  genreButton.addEventListener('click', () => {
    genreMenu.classList.toggle('open');
  });

  genreMenu.addEventListener('click', (event) => {
    const item = event.target.closest('button');
    if (!item) return;
    genreButton.textContent = item.textContent;
    genreMenu.classList.remove('open');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.catalog-controls')) {
      genreMenu.classList.remove('open');
    }
  });
}

const catalogSearch = document.querySelector('[data-catalog-search]');
if (catalogSearch) {
  catalogSearch.addEventListener('input', () => {
    const value = catalogSearch.value.toLowerCase().trim();
    document.querySelectorAll('.catalog-card').forEach((card) => {
      card.style.display = card.textContent.toLowerCase().includes(value) ? '' : 'none';
    });
  });
}
document.querySelectorAll('[data-drag-carousel]').forEach((slider) => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let moved = false;

  slider.addEventListener('mousedown', (event) => {
    isDown = true;
    moved = false;
    slider.classList.add('dragging');
    startX = event.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 5) moved = true;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
});
