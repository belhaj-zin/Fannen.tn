document.addEventListener('DOMContentLoaded', () => {
    // Main gallery container where cards are rendered/re-rendered.
    const galleryGrid = document.querySelector('.gallery-grid');
    // Wrapper around category buttons (All, Ceramics, Textiles, ...).
    const categoryFilters = document.getElementById('category-filters');
    
    // Defensive guard: this script is loaded globally, but should only run on pages
    // that actually have a gallery grid (currently the index page).
    if (!galleryGrid) return; // Only run on index page
    
    // In-memory source of truth for currently loaded artworks.
    // We keep the full dataset here so filters can be applied instantly
    // without refetching JSON each time.
    let allArtworks = [];
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };
    const canBuyFromVault = authState.isLoggedIn && authState.role === 'user';

    // Initial data load:
    // 1) Fetch mock dataset
    // 2) Store it in allArtworks
    // 3) Render full gallery once
    fetch('js/data/artworks.json')
        .then(response => response.json())
        .then(data => {
            allArtworks = data;
            renderGallery(allArtworks);
        })
        .catch(error => {
            // Fallback UI if data cannot be loaded (network/path issues).
            console.error("Error fetching artworks:", error);
            galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Failed to load artworks.</p>';
        });

    // Category filtering is handled with one event listener on the parent nav
    // (event delegation), instead of one listener per button.
    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            // Ignore clicks that are not on a button.
            if (e.target.tagName !== 'BUTTON') return;
            
            // Update active visual state so only one filter appears selected.
            const buttons = categoryFilters.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.remove('font-bold', 'text-terracotta');
            });
            e.target.classList.add('font-bold', 'text-terracotta');
            
            // Button ids follow `btn-<category>` pattern.
            // Example: btn-ceramics -> ceramics.
            const categoryId = e.target.id.replace('btn-', ''); // "all", "ceramics", "textiles", "jewelry"
            
            // `all` resets to complete dataset; otherwise filter in memory.
            if (categoryId === 'all') {
                renderGallery(allArtworks);
            } else {
                // Compare normalized lowercase strings to avoid case mismatch issues.
                const filtered = allArtworks.filter(art => art.category.toLowerCase() === categoryId);
                renderGallery(filtered);
            }
        });
    }

    function renderGallery(artworks) {
        // Empty-state UI when a filter has no matching results.
        if (artworks.length === 0) {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                    <h3>No artworks found in this category.</h3>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="document.getElementById('btn-all').click()">Reset Filters</button>
                </div>
            `;
            return;
        }

        // Build full gallery markup in one pass and inject once.
        // This minimizes DOM thrashing compared to appending each card separately.
        galleryGrid.innerHTML = artworks.map((art, index) => {
            // Visual decision: only the first card in the current view gets Featured badge.
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
                            <div class="artwork-footer">
                                <span class="text-sm font-bold text-terracotta">${formatPrice(art.price)}</span>
                                ${canBuyFromVault ? `
                                    <button class="btn btn-primary" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${art.id}', '${escapeForAttribute(art.title)}', '${escapeForAttribute(art.image)}', ${Number(art.price) || 0}, '${escapeForAttribute(art.artisanName)}')">
                                        Add to cart
                                    </button>
                                ` : ''}
                                <!-- Prevent card navigation when clicking kudos by calling
                                     event.preventDefault() inside toggleKudos. -->
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
        // (new <img> elements need fresh error listeners after each re-render).
        if (typeof initImageFallbacks === 'function') {
            initImageFallbacks();
        }
        
        // Re-apply persisted kudos styles after every re-render.
        updateKudosUI();
    }
});

// Global function because cards are generated dynamically with inline onclick handlers.
// It toggles a local "liked" state per artwork and persists it in localStorage.
window.toggleKudos = function(artworkId, btnElement) {
    // Stored as array of artwork IDs the user has already liked in the gallery feed.
    let history = JSON.parse(localStorage.getItem('fannen_kudos_history') || '[]');
    const countSpan = btnElement.querySelector('.kudos-count');
    let count = parseInt(countSpan.textContent);
    
    if (history.includes(artworkId)) {
        // Undo kudos:
        // - remove ID from history
        // - reset visual active state
        // - decrement displayed count
        history = history.filter(id => id !== artworkId);
        btnElement.classList.remove('active');
        // Simple style to indicate active state for now
        btnElement.style.color = '';
        btnElement.style.background = '';
        btnElement.style.borderColor = '';
        count--;
    } else {
        // Add kudos:
        // - add ID to history
        // - apply active styling
        // - increment displayed count
        history.push(artworkId);
        btnElement.classList.add('active');
        btnElement.style.color = '#fff';
        btnElement.style.background = 'var(--color-terracotta)';
        btnElement.style.borderColor = 'var(--color-terracotta)';
        count++;
    }
    
    countSpan.textContent = count;
    // Persist updated history so UI state survives reloads.
    localStorage.setItem('fannen_kudos_history', JSON.stringify(history));
};

function updateKudosUI() {
    // Restore previously liked buttons from localStorage history.
    const history = JSON.parse(localStorage.getItem('fannen_kudos_history') || '[]');
    const btns = document.querySelectorAll('.kudos-btn');
    btns.forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (history.includes(id)) {
            // Apply same visual state as toggleKudos("add") path.
            btn.classList.add('active');
            btn.style.color = '#fff';
            btn.style.background = 'var(--color-terracotta)';
            btn.style.borderColor = 'var(--color-terracotta)';
        }
    });
}

function formatPrice(price) {
    const safePrice = Number(price) || 0;
    return `${safePrice} TND`;
}

function escapeForAttribute(value) {
    return String(value || '').replace(/'/g, '&#39;');
}

// Persist cart in localStorage for profile/cart view.
window.addToCart = function(artworkId, title, image, price, artisanName) {
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };

    if (!authState.isLoggedIn || authState.role !== 'user') {
        alert('Please sign in as an enthusiast to buy artworks.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('fannen_cart_items') || '[]');
    const existing = cart.find(item => item.id === artworkId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: artworkId,
            title,
            image,
            artisanName,
            price: Number(price) || 0,
            quantity: 1
        });
    }

    localStorage.setItem('fannen_cart_items', JSON.stringify(cart));
    alert('Artwork added to your cart. You can review it in your profile.');
};
