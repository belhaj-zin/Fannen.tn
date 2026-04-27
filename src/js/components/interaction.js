document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = urlParams.get('id');
    
    if (artworkId) {
        fetch('../js/data/artworks.json')
            .then(res => res.json())
            .then(data => {
                const artwork = data.find(a => a.id === artworkId);
                if (artwork) {
                    renderArtworkDetail(artwork);
                } else {
                    document.querySelector('.artwork-detail-layout').innerHTML = '<h2>Artwork not found.</h2>';
                }
            })
            .catch(err => console.error(err));
    }

    // Modal logic for "Send an Inquiry"
    const inquiryBtn = document.getElementById('btn-inquiry-open');
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', openInquiryModal);
    }
});

function renderArtworkDetail(artwork) {
    // Document Title
    document.title = `${artwork.title} - Fannen.tn`;
    
    // Left side image
    const imgElement = document.querySelector('.artwork-left img');
    if (imgElement) {
        imgElement.src = artwork.image.includes('http') ? artwork.image : `../${artwork.image}`;
        imgElement.alt = artwork.title;
    }
    
    // Artisan info
    const artisanNameEl = document.querySelector('.artisan-info .font-bold');
    if (artisanNameEl) artisanNameEl.textContent = artwork.artisanName;
    
    // Title and category
    const titleEl = document.querySelector('.artwork-info-card h1');
    const categoryEl = document.querySelector('.artwork-info-card .badge');
    if (titleEl) titleEl.textContent = artwork.title;
    if (categoryEl) categoryEl.textContent = artwork.category;
    
    // Description
    const descEl = document.querySelector('.artwork-description');
    if (descEl) {
        descEl.innerHTML = `<p>${artwork.description}</p>`;
    }
    
    // Follow button logic
    const followBtn = document.querySelector('.artisan-profile-card .btn');
    if (followBtn) {
        followBtn.addEventListener('click', () => {
            if (followBtn.textContent === 'Follow') {
                followBtn.textContent = 'Unfollow';
                followBtn.classList.remove('btn-outline');
                followBtn.classList.add('btn-primary'); // or keep outline but change text
            } else {
                followBtn.textContent = 'Follow';
                followBtn.classList.add('btn-outline');
                followBtn.classList.remove('btn-primary');
            }
        });
    }

    // Kudos logic for all badges
    const kudosBadges = document.querySelectorAll('.kudos-badge-item');
    kudosBadges.forEach((badge, index) => {
        const span = badge.querySelector('span');
        if (!span) return;
        
        // Use a unique key for each badge type for localStorage
        const storageKey = `fannen_kudos_history_${index}`;
        
        const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (history.includes(artwork.id)) {
            badge.style.color = 'var(--color-terracotta)';
        }
        
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', () => {
            let hist = JSON.parse(localStorage.getItem(storageKey) || '[]');
            let count = parseInt(span.textContent);
            if (hist.includes(artwork.id)) {
                hist = hist.filter(id => id !== artwork.id);
                badge.style.color = '';
                count--;
            } else {
                hist.push(artwork.id);
                badge.style.color = 'var(--color-terracotta)';
                count++;
            }
            span.textContent = count;
            localStorage.setItem(storageKey, JSON.stringify(hist));
        });
    });
}

function openInquiryModal() {
    let modal = document.querySelector('.modal-overlay');
    
    if (!modal) {
        const modalHtml = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="modal-content" style="background: white; padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 500px;">
                    <h3 style="margin-bottom: 1rem;">Contact Artisan</h3>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea id="draft-message" class="form-control" rows="5" placeholder="Draft your message..."></textarea>
                    </div>
                    <div class="flex gap-sm justify-between" style="margin-top: 1.5rem;">
                        <button class="btn btn-ghost" id="btn-modal-close">Cancel</button>
                        <button class="btn btn-primary" id="btn-modal-send">Send Inquiry</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.querySelector('.modal-overlay');
        
        // Restore draft
        const draft = localStorage.getItem('fannen_draft_messages');
        if (draft) document.getElementById('draft-message').value = draft;
        
        // Listeners
        document.getElementById('draft-message').addEventListener('input', (e) => {
            localStorage.setItem('fannen_draft_messages', e.target.value);
        });
        
        document.getElementById('btn-modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('btn-modal-send').addEventListener('click', () => {
            const content = document.getElementById('draft-message').value;
            if (!content.trim()) return;
            
            // Mock sending
            const urlParams = new URLSearchParams(window.location.search);
            const artworkId = urlParams.get('id') || 'unknown';
            
            const messages = JSON.parse(localStorage.getItem('fannen_sent_messages') || '[]');
            messages.push({
                id: 'msg-' + Date.now(),
                senderId: 'user-current',
                receiverId: 'artisan-mock',
                artworkId: artworkId,
                content: content,
                status: 'unread',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('fannen_sent_messages', JSON.stringify(messages));
            
            // Clear draft and close
            localStorage.removeItem('fannen_draft_messages');
            document.getElementById('draft-message').value = '';
            modal.style.display = 'none';
            alert('Message sent successfully!');
        });
    } else {
        modal.style.display = 'flex';
        const draft = localStorage.getItem('fannen_draft_messages');
        if (draft) document.getElementById('draft-message').value = draft;
    }
}
