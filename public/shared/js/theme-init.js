(function () {
    try {
        var t = localStorage.getItem('ml-ecosystem-theme');
        document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();
