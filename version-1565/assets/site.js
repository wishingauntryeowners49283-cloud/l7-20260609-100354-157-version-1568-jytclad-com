(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function setSlide(index) {
            current = index % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }
    }

    var filterScope = document.querySelector('[data-filter-scope]');

    if (filterScope) {
        var input = filterScope.querySelector('[data-filter-input]');
        var year = filterScope.querySelector('[data-year-filter]');
        var type = filterScope.querySelector('[data-type-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && input) {
            input.value = query;
        }

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedType = type ? type.value : '';

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-type'),
                    card.textContent
                ].join(' ').toLowerCase();
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
                var matchesType = !selectedType || card.getAttribute('data-type') === selectedType;
                card.style.display = matchesKeyword && matchesYear && matchesType ? '' : 'none';
            });
        }

        [input, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }
})();
