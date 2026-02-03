(function () {

	var content = document.getElementById('content');
	var panels = content.querySelectorAll('.panel');
	var nav = document.getElementById('nav');
	var navLinks = nav.querySelectorAll('.nav-link');

	// Remove preload class after page load.
	window.addEventListener('load', function () {
		setTimeout(function () {
			document.body.classList.remove('is-preload');
		}, 100);
	});

	// Resolve hash to a panel id.
	function resolvePanel(hash) {
		if (!hash || hash === '#') return 'home';
		var id = hash.substring(1);
		var el = document.getElementById(id);
		return (el && el.classList.contains('panel')) ? id : null;
	}

	// Switch to a panel by id.
	function switchPanel(id) {
		var target = document.getElementById(id);
		if (!target) return;

		// Find current active panel.
		var current = content.querySelector('.panel.active');
		if (current === target) return;

		// Update nav active state.
		navLinks.forEach(function (l) { l.classList.remove('active'); });
		var href = id === 'home' ? '#' : '#' + id;
		var activeLink = nav.querySelector('.nav-link[href="' + href + '"]');
		if (activeLink) activeLink.classList.add('active');

		if (current) {
			// Fade out current.
			current.classList.remove('active');
			current.classList.add('transitioning-out');

			setTimeout(function () {
				current.classList.remove('transitioning-out');

				// Fade in target.
				target.classList.add('transitioning-in');

				// Force reflow so the browser registers opacity:0 before transitioning.
				void target.offsetHeight;

				target.classList.remove('transitioning-in');
				target.classList.add('active');

				window.scrollTo(0, 0);
			}, 350);
		} else {
			// No current panel (initial load edge case).
			target.classList.add('active');
		}
	}

	// Panel link click handler (works for nav links and any internal hash links).
	function handlePanelClick(e) {
		var href = this.getAttribute('href');

		// External link — let it through.
		if (!href || href.charAt(0) !== '#')
			return;

		e.preventDefault();
		e.stopPropagation();

		var id = resolvePanel(href);
		if (!id) return;

		var newHash = id === 'home' ? '' : '#' + id;
		if (window.location.hash === newHash || (newHash === '' && !window.location.hash)) {
			return;
		}

		if (newHash === '') {
			history.pushState(null, '', window.location.pathname);
			switchPanel('home');
		} else {
			window.location.hash = newHash;
		}
	}

	// Bind to nav links.
	navLinks.forEach(function (link) {
		link.addEventListener('click', handlePanelClick);
	});

	// Bind to any in-page quick links that point to panels.
	document.querySelectorAll('.quick-link[href^="#"]').forEach(function (link) {
		link.addEventListener('click', handlePanelClick);
	});

	// Initialize on load.
	(function () {
		var id = resolvePanel(window.location.hash) || 'home';
		panels.forEach(function (p) {
			p.classList.remove('active');
		});
		switchPanel(id);
	})();

	// Handle browser back/forward.
	window.addEventListener('hashchange', function () {
		var id = resolvePanel(window.location.hash) || 'home';
		switchPanel(id);
	});

})();
