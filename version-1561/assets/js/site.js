(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupImages() {
        document.querySelectorAll("img.cover-image").forEach(function (img) {
            img.addEventListener("error", function () {
                img.classList.add("is-hidden");
            }, { once: true });
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function setupGlobalSearch() {
        document.querySelectorAll("[data-global-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='search']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    return;
                }
            });
        });
    }

    function setupFilters() {
        var grid = document.querySelector("[data-filter-grid]");
        if (!grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));
        var empty = document.querySelector("[data-empty-state]");
        var searchInput = document.querySelector("[data-local-search]");
        var yearSelect = document.querySelector("[data-filter-year]");
        var typeSelect = document.querySelector("[data-filter-type]");
        var params = new URLSearchParams(window.location.search);
        var initialSearch = params.get("search") || "";
        if (searchInput && initialSearch) {
            searchInput.value = initialSearch;
        }

        function apply() {
            var query = normalize(searchInput ? searchInput.value : "");
            var year = normalize(yearSelect ? yearSelect.value : "");
            var type = normalize(typeSelect ? typeSelect.value : "");
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var cardType = normalize(card.getAttribute("data-type"));
                var matched = true;
                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [searchInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    }

    ready(function () {
        setupMenu();
        setupImages();
        setupHero();
        setupGlobalSearch();
        setupFilters();
    });
})();
