(function () {
    try {
        var t = localStorage.getItem('ml-ecosystem-theme');
        document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Ensure chatbot widget is available on every page.
    // (UI must be JS in the browser; backend can be Python/Node.)
    try {
        if (!window.__mlChatbotLoaded) {
            window.__mlChatbotLoaded = true;
            var script = document.createElement('script');
            script.src = '/shared/js/chatbot.js';
            script.defer = true;
            document.head.appendChild(script);
        }
    } catch (e2) {}
})();
