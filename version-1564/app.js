(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var heroIndex = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === heroIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === heroIndex);
      });
    }

    if (slides.length) {
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showHero(index);
        });
      });
      window.setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
      showHero(0);
    }

    var searchInput = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var resultCount = document.querySelector("[data-search-count]");
    var noResult = document.querySelector("[data-no-result]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
      if (!searchInput || !cards.length) {
        return;
      }
      var query = normalize(searchInput.value);
      var visible = 0;
      cards.forEach(function (card) {
        var keywords = normalize(card.getAttribute("data-keywords"));
        var matched = !query || keywords.indexOf(query) !== -1;
        card.classList.toggle("hidden-card", !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (resultCount) {
        resultCount.textContent = String(visible);
      }
      if (noResult) {
        noResult.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var queryValue = params.get("q");
      if (queryValue) {
        searchInput.value = queryValue;
      }
      searchInput.addEventListener("input", filterCards);
      filterCards();
    }

    var sortSelect = document.querySelector("[data-sort-select]");
    var sortGrid = document.querySelector("[data-sort-grid]");
    if (sortSelect && sortGrid) {
      sortSelect.addEventListener("change", function () {
        var mode = sortSelect.value;
        var sortedCards = Array.prototype.slice.call(sortGrid.querySelectorAll("[data-card]"));
        sortedCards.sort(function (a, b) {
          if (mode === "rating") {
            return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
          }
          if (mode === "views") {
            return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
          }
          return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
        });
        sortedCards.forEach(function (card) {
          sortGrid.appendChild(card);
        });
      });
    }
  });
})();
