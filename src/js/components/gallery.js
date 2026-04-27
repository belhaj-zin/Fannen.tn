document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const categoryFilters = document.getElementById('category-filters');
    
    if (!galleryGrid) return; // Only run on index page
    
    let allArtworks = [];

    // Fetch artworks
    fetch('js/data/artworks.json')
        .then(response => response.json())
        .then(data => {
            allArtworks = data;
            renderGallery(allArtworks);
        })
        .catch(error => {
            console.error("Error fetching artworks:", error);
            galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Failed to load artworks.</p>';
        });

    // Handle Category Filtering
    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            
            // Update active state
            const buttons = categoryFilters.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.remove('font-bold', 'text-terracotta');
            });
            e.target.classList.add('font-bold', 'text-terracotta');
            
            const categoryId = e.target.id.replace('btn-', ''); // "all", "ceramics", "textiles", "jewelry"
            
            if (categoryId === 'all') {
                renderGallery(allArtworks);
            } else {
                const filtered = allArtworks.filter(art => art.category.toLowerCase() === categoryId);
                renderGallery(filtered);
            }
        });
    }

    function renderGallery(artworks) {
        if (artworks.length === 0) {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                    <h3>No artworks found in this category.</h3>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="document.getElementById('btn-all').click()">Reset Filters</button>
                </div>
            `;
            return;
        }

        galleryGrid.innerHTML = artworks.map((art, index) => {
            const isFeatured = index === 0 ? '<span class="badge">Featured</span>' : '';
            return `
                <article class="artwork-card" data-category="${art.category}">
                    <a href="html/artwork_detail.html?id=${art.id}">
                        <div class="artwork-img-box">
                            ${isFeatured}
                            <img src="${art.image}" alt="${art.title}" loading="lazy">
                        </div>
                        <div class="artwork-content">
                            <h3 class="artwork-title">${art.title}</h3>
                            <p class="artwork-artisan">
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                </svg>
                                ${art.artisanName}
                            </p>
                            <div class="artwork-footer" style="justify-content: flex-end;">
                                <button class="kudos-btn" aria-label="Give Kudos" data-id="${art.id}" onclick="event.preventDefault(); toggleKudos('${art.id}', this)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                        </path>
                                    </svg>
                                    <span class="kudos-count">${art.kudos.count}</span>
                                </button>
                            </div>
                        </div>
                    </a>
                </article>
            `;
        }).join('');
        
        // Ensure image fallbacks are re-initialized for dynamically added images
        if (typeof initImageFallbacks === 'function') {
            initImageFallbacks();
        }
        
        // Initialize kudos state
        updateKudosUI();
    }
});

// Function to handle kudos clicks directly from the gallery feed
window.toggleKudos = function(artworkId, btnElement) {
    let history = JSON.parse(localStorage.getItem('fannen_kudos_history') || '[]');
    const countSpan = btnElement.querySelector('.kudos-count');
    let count = parseInt(countSpan.textContent);
    
    if (history.includes(artworkId)) {
        // Remove kudos
        history = history.filter(id => id !== artworkId);
        btnElement.classList.remove('active');
        // Simple style to indicate active state for now
        btnElement.style.color = '';
        btnElement.style.background = '';
        count--;
    } else {
        // Add kudos
        history.push(artworkId);
        btnElement.classList.add('active');
        btnElement.style.color = '#fff';
        btnElement.style.background = 'var(--color-terracotta)';
        btnElement.style.borderColor = 'var(--color-terracotta)';
        count++;
    }
    
    countSpan.textContent = count;
    localStorage.setItem('fannen_kudos_history', JSON.stringify(history));
};

function updateKudosUI() {
    const history = JSON.parse(localStorage.getItem('fannen_kudos_history') || '[]');
    const btns = document.querySelectorAll('.kudos-btn');
    btns.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (history.includes(id)) {
            btn.classList.add('active');
            btn.style.color = '#fff';
            btn.style.background = 'var(--color-terracotta)';
            btn.style.borderColor = 'var(--color-terracotta)';
        }
    });
}
