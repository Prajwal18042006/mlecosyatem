document.addEventListener('DOMContentLoaded', () => {
    const relatedContainer = document.getElementById('related-topics');
    if (!relatedContainer) return;

    // Static data for related topics
    const relatedData = [
        { title: 'Tree Explorer', link: '/index.html', category: 'Navigation' },
        { title: 'ML Basics', link: '/topics/basics.html', category: 'Fundamentals' },
        { title: 'Supervised Learning', link: '/topics/supervised-learning.html', category: 'Learning Types' },
        { title: 'Resources', link: '/topics/resources.html', category: 'Help' }
    ];

    let relatedHtml = '<h3>Related Topics</h3><div class="related-grid">';
    
    relatedData.forEach(topic => {
        relatedHtml += `
            <div class="related-card">
                <span class="category">${topic.category}</span>
                <h4>${topic.title}</h4>
                <a href="${topic.link}" class="btn-sm">Read More</a>
            </div>
        `;
    });

    relatedHtml += '</div>';
    relatedContainer.innerHTML = relatedHtml;
});

// Simple CSS for related topics
const style = document.createElement('style');
style.textContent = `
    .related-topics {
        margin-top: 4rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-strong);
    }
    .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    .related-card {
        background: var(--bg-elevated);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border-strong);
        border-left: 4px solid var(--accent);
        box-shadow: var(--shadow-soft);
        transition: 0.3s;
    }
    .related-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-card);
        border-color: var(--accent);
    }
    .related-card h4 {
        margin: 0.5rem 0 1rem;
        font-size: 1.2rem;
        color: var(--primary);
    }
    .related-card .category {
        font-size: 0.8rem;
        color: var(--orange);
        text-transform: uppercase;
    }
    .btn-sm {
        color: var(--accent);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);
