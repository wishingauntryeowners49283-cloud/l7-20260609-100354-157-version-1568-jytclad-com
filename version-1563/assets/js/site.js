(function() {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startSlider() {
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                window.clearInterval(timer);
                showSlide(index);
                startSlider();
            });
        });

        startSlider();
    }

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var searchInput = document.querySelector('[data-live-search]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var activeFilter = 'all';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        var query = searchInput ? normalize(searchInput.value) : '';

        cards.forEach(function(card) {
            var text = normalize(card.getAttribute('data-text'));
            var type = normalize(card.getAttribute('data-type'));
            var year = normalize(card.getAttribute('data-year'));
            var filter = normalize(activeFilter);
            var matchesText = !query || text.indexOf(query) !== -1;
            var matchesFilter = filter === 'all' || type === filter || year === filter || text.indexOf(filter) !== -1;

            card.classList.toggle('is-hidden-by-filter', !(matchesText && matchesFilter));
        });
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeFilter = button.getAttribute('data-filter-button') || 'all';
            applyFilters();
        });
    });

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query) {
            searchInput.value = query;
        }

        searchInput.addEventListener('input', applyFilters);
        applyFilters();
    }
})();
