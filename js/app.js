const container = document.getElementById('newsContainer');

fetch('https://newsapi.org/v2/everything?domains=wsj.com&apiKey=721e24037b564de1898770f86c1c8a17')
  .then(res => res.json())
  .then(data => {
    data.articles.forEach(article => {
      const newsCard = document.createElement('div');
      newsCard.classList.add('news-card');
      newsCard.innerHTML = `
        <img src="${article.urlToImage}" alt="imagen">
        <h3>${article.title}</h3>
        <p>${article.description || 'Sin descripción disponible'}</p>
        <a href="${article.url}" target="_blank">Leer más</a>
      `;
      container.appendChild(newsCard);
    });
  });