(function () {

	var nav     = document.getElementById('nav');
	var navBrand = nav.querySelector('.nav-brand');
	var navLinks = nav.querySelectorAll('.nav-link');
	var sections = document.querySelectorAll('#content section[id]');

	// --- Fade in on load ---

	window.addEventListener('load', function () {
		setTimeout(function () {
			document.body.classList.remove('is-preload');
		}, 100);
	});

	// --- Email assembler ---
	// Assembles mailto href from split data attributes so the address never
	// appears as plain text in source HTML (basic scraper deterrent).

	document.querySelectorAll('a[data-u][data-d]').forEach(function (el) {
		el.href = 'mailto:' + el.getAttribute('data-u') + '@' + el.getAttribute('data-d');
	});

	// --- Scroll-based active nav ---

	function updateActiveNav() {
		var navH   = nav.offsetHeight;
		var scrollY = window.scrollY + navH + 16;
		var current = '';

		sections.forEach(function (s) {
			if (s.offsetTop <= scrollY) {
				current = s.id;
			}
		});

		navLinks.forEach(function (l) { l.classList.remove('active'); });
		if (navBrand) navBrand.classList.remove('active');

		if (current === 'home' || current === '') {
			if (navBrand) navBrand.classList.add('active');
		} else if (current) {
			var activeLink = nav.querySelector('.nav-link[href="#' + current + '"]');
			if (activeLink) activeLink.classList.add('active');
		}
	}

	window.addEventListener('scroll', updateActiveNav, { passive: true });
	updateActiveNav(); // run once on initial load

	// --- Show more for projects ---
	// Cards beyond SHOW_LIMIT are hidden until the button is clicked.
	// With <= SHOW_LIMIT projects the button never appears.

	var grid       = document.querySelector('.project-grid');
	var SHOW_LIMIT = 10;

	if (grid) {
		var cards = Array.from(grid.querySelectorAll('.project-card'));

		if (cards.length > SHOW_LIMIT) {
			cards.slice(SHOW_LIMIT).forEach(function (c) {
				c.classList.add('project-card--hidden');
			});

			var btn = document.createElement('button');
			btn.className   = 'show-more-btn';
			btn.textContent = 'Show ' + (cards.length - SHOW_LIMIT) + ' more projects';

			btn.addEventListener('click', function () {
				cards.forEach(function (c) {
					c.classList.remove('project-card--hidden');
				});
				btn.remove();
			});

			grid.after(btn);
		}
	}

})();
