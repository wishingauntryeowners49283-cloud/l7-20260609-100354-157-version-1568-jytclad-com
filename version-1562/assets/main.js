(function () {
  const escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let active = 0;
    const show = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(active + 1);
      }, 6200);
    }
  }

  const filterInput = document.querySelector('[data-filter-input]');
  if (filterInput) {
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const empty = document.querySelector('[data-empty]');
    const apply = function () {
      const value = filterInput.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(function (card) {
        const text = (card.getAttribute('data-search-text') || '').toLowerCase();
        const match = !value || text.indexOf(value) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    filterInput.addEventListener('input', apply);
    apply();
  }

  const resultsNode = document.querySelector('[data-search-results]');
  if (resultsNode && Array.isArray(window.SEARCH_INDEX)) {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('q') || '').trim();
    const input = document.querySelector('[data-search-page-input]');
    if (input) {
      input.value = q;
    }
    const title = document.querySelector('[data-search-title]');
    const renderCard = function (item) {
      const tags = item.tags.slice(0, 4).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '<a class="movie-card" href="' + encodeURI(item.url) + '">' +
        '<span class="poster" style="background-image: linear-gradient(180deg, rgba(2, 6, 23, 0.10), rgba(2, 6, 23, 0.80)), url(\'./' + item.cover + '.jpg\');"></span>' +
        '<span class="card-body"><strong>' + escapeHtml(item.title) + '</strong>' +
        '<em>' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</em>' +
        '<span class="card-genre">' + escapeHtml(item.genre) + '</span>' +
        '<span class="card-summary">' + escapeHtml(item.oneLine) + '</span>' +
        '<span class="tag-row">' + tags + '</span></span></a>';
    };
    if (!q) {
      if (title) {
        title.textContent = '搜索影片内容';
      }
      resultsNode.innerHTML = window.SEARCH_INDEX.slice(0, 24).map(renderCard).join('');
      return;
    }
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const found = window.SEARCH_INDEX.filter(function (item) {
      const text = item.searchText.toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 80);
    if (title) {
      title.textContent = found.length ? '搜索结果' : '未找到匹配内容';
    }
    resultsNode.innerHTML = found.length ? found.map(renderCard).join('') : '<div class="empty-state is-visible">换一个片名、类型或标签再试试。</div>';
  }
})();
