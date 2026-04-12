const THEME_KEY = 'ml-ecosystem-theme';

/** Resolve /shared/... from site root, or ../shared/... when viewing /topics/*.html from disk or nested paths */
function sharedAssetUrl(filename) {
    const path = window.location.pathname;
    const topicsIdx = path.indexOf('/topics/');
    if (topicsIdx >= 0) {
        return path.slice(0, topicsIdx + 1) + 'shared/' + filename;
    }
    const dir = path.replace(/\/[^/]*$/, '') || '/';
    const prefix = dir.endsWith('/') ? dir : dir + '/';
    return prefix + 'shared/' + filename;
}

function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function setTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('ml-theme-change', { detail: { theme: next } }));
}

function updateThemeToggleButtons() {
    const dark = getTheme() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.textContent = dark ? '◑' : '◐';
        btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
        btn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    });
}

function toggleMlTheme(ev) {
    if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    updateThemeToggleButtons();
}

window.mlEcosystemToggleTheme = toggleMlTheme;

(function initThemeToggleDelegation() {
    document.addEventListener(
        'click',
        (e) => {
            const btn = e.target.closest('[data-theme-toggle]');
            if (!btn) return;
            toggleMlTheme(e);
        },
        true
    );
    window.addEventListener('ml-theme-change', updateThemeToggleButtons);
})();

document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        const url = sharedAssetUrl('navbar.html');
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error(response.statusText);
                return response.text();
            })
            .then((data) => {
                navbarPlaceholder.innerHTML = data;
                updateThemeToggleButtons();
                const currentPath = window.location.pathname;
                document.querySelectorAll('.navbar-menu a').forEach((link) => {
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    }
                });
            })
            .catch((error) => {
                console.error('Error loading navbar:', url, error);
            });
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const fUrl = sharedAssetUrl('footer.html');
        fetch(fUrl)
            .then((response) => {
                if (!response.ok) throw new Error(response.statusText);
                return response.text();
            })
            .then((data) => {
                footerPlaceholder.innerHTML = data;
            })
            .catch((error) => console.error('Error loading footer:', fUrl, error));
    }
});
