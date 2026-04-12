document.addEventListener('DOMContentLoaded', () => {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    if (!breadcrumbContainer) return;

    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== '' && part !== 'topics');
    
    let breadcrumbHtml = '<a href="/index.html">Home</a>';
    
    if (pathParts.length > 0) {
        pathParts.forEach((part, index) => {
            const label = part.replace('.html', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const isLast = index === pathParts.length - 1;
            
            breadcrumbHtml += ' <span class="separator">/</span> ';
            if (isLast) {
                breadcrumbHtml += `<span>${label}</span>`;
            } else {
                breadcrumbHtml += `<a href="/topics/${part}">${label}</a>`;
            }
        });
    }

    breadcrumbContainer.innerHTML = breadcrumbHtml;
});

// Simple CSS for breadcrumb
const style = document.createElement('style');
style.textContent = `
    .breadcrumb {
        padding: 1rem 0;
        color: var(--text-dim);
        font-size: 0.9rem;
    }
    .breadcrumb a {
        color: var(--accent);
        text-decoration: none;
    }
    .breadcrumb a:hover {
        text-decoration: underline;
    }
    .breadcrumb .separator {
        margin: 0 0.5rem;
    }
`;
document.head.appendChild(style);
