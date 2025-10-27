// Selecciona el contenedor principal donde se crearán las secciones
const sectionsContainer = document.getElementById('sectionsContainer');

// Categorías: key = category para NewsAPI, label = texto mostrado
const categories = [
  { key: 'business', label: 'Negocios' },
  { key: 'health', label: 'Salud' },
  { key: 'science', label: 'Ciencia' },
  { key: 'sports', label: 'Deportes' },
  { key: 'technology', label: 'Tecnología' }
];

const API_KEY = '721e24037b564de1898770f86c1c8a17';

// Crea los elementos DOM para una sección
function createSection(label, id) {
  const section = document.createElement('section');
  section.className = 'news-section';
  section.id = `section-${id}`;

  const h2 = document.createElement('h2');
  h2.textContent = label;
  section.appendChild(h2);

  const cards = document.createElement('div');
  cards.className = 'section-cards';
  section.appendChild(cards);

  sectionsContainer.appendChild(section);
  return cards;
}

// Renderiza artículos dentro de un contenedor de tarjetas
function renderArticles(container, articles) {
  if (!articles || articles.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'No hay noticias disponibles.';
    container.appendChild(msg);
    return;
  }

  articles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'news-card';

    // Imagen (opcional)
    if (article.urlToImage) {
      const img = document.createElement('img');
      img.src = article.urlToImage;
      img.alt = article.title || 'Imagen noticia';
      card.appendChild(img);
    } else {
      const noImg = document.createElement('div');
      noImg.className = 'no-image';
      noImg.textContent = 'SIN IMAGEN';
      card.appendChild(noImg);
    }

    const body = document.createElement('div');
    body.className = 'card-body';

    const h3 = document.createElement('h3');
    h3.textContent = article.title || 'Titular sin título';
    body.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = article.description || 'Sin descripción disponible';
    body.appendChild(p);

    const a = document.createElement('a');
    a.href = article.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Leer más';
    body.appendChild(a);

    card.appendChild(body);
    container.appendChild(card);
  });
}

// Fetch por categoría (top-headlines). Hacemos fetch en paralelo y montamos las secciones.
function loadAllCategories() {
  const promises = categories.map(cat => {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${cat.key}&apiKey=${API_KEY}`;
    return fetch(url)
      .then(res => res.json())
      .then(data => ({ key: cat.key, label: cat.label, articles: data.articles || [] }))
      .catch(err => ({ key: cat.key, label: cat.label, articles: [] }));
  });

  // Filtros por categoría
Promise.all(promises).then(results => {
  results.forEach(result => {
    const cardsContainer = createSection(result.label, result.key);
    renderArticles(cardsContainer, result.articles);
  });
  
  attachCategoryFilters();
});

function attachCategoryFilters() {
  const buttons = document.querySelectorAll('.categorias button');
  buttons.forEach(btn => {
    const label = btn.textContent.trim().toLowerCase();
    btn.addEventListener('click', () => {
      const sections = document.querySelectorAll('.news-section');
      let matched = false;
      sections.forEach(sec => {
        const title = sec.querySelector('h2').textContent.trim().toLowerCase();
        if (title === label) {
          sec.style.display = '';
          matched = true;
        } else {
          sec.style.display = 'none';
        }
      });
      if (!matched) sections.forEach(s => s.style.display = '');
    });
  });
}
}
loadAllCategories();