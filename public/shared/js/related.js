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
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    .related-card {
        background: #1a1a1a;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #00bcd4;
        transition: 0.3s;
    }
    .related-card:hover {
        transform: translateY(-5px);
        background: #252525;
    }
    .related-card h4 {
        margin: 0.5rem 0 1rem;
        font-size: 1.2rem;
    }
    .related-card .category {
        font-size: 0.8rem;
        color: #ff9800;
        text-transform: uppercase;
    }
    .btn-sm {
        color: #00bcd4;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);
