document.addEventListener('DOMContentLoaded', () => {
    // Initialize cross-page UI helpers once the DOM is ready.
    initNavbar();
    initImageFallbacks();
    initHeroVideoPlayback();
});

function isLevel2() {
    // Pages inside /src/html use different relative paths than /src/index.html.
    return window.location.pathname.includes('/html/');
}

// Navbar Personalization Mock
function initNavbar() {
    // Read mock auth session from localStorage to personalize nav actions.
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false };

    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;

    const loginLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.includes('Login') || a.textContent.includes('Connexion'));
    const joinLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.includes('Join') || a.textContent.includes('S\'inscrire'));

    if (authState.isLoggedIn) {
        if (loginLink) {
            // Route authenticated users to the unified profile page.
            loginLink.textContent = 'Profile';
            loginLink.href = isLevel2() ? 'profile.html' : 'html/profile.html';
        }
        
        if (joinLink) {
            // Convert the Join action into Logout when a user is already authenticated.
            joinLink.textContent = 'Logout';
            joinLink.classList.remove('btn-primary');
            joinLink.classList.add('btn-outline');
            joinLink.href = '#';
            joinLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Clear only auth state, then return to home with the proper relative path.
                localStorage.removeItem('fannen_auth_state');
                window.location.href = isLevel2() ? '../index.html' : 'index.html';
            });
        }
    }
}

function initImageFallbacks() {
    // Any broken image gets replaced by a local placeholder to avoid empty UI blocks.
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = isLevel2() ? '../../Resources/img/placeholder.jpg' : '../Resources/img/placeholder.jpg';
            this.onerror = null; // Prevent infinite loops
        });
    });
}

function initHeroVideoPlayback() {
    // Slow down decorative hero video for a calmer background motion.
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;
    heroVideo.playbackRate = 0.5;
}

// Notifications Popup Mock
const notifBtns = document.querySelectorAll('button[aria-label="Notifications"]');
    
notifBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        let popup = document.getElementById('notifications-popup-mock');
        
        if (!popup) {
            // Lazy-create the popup the first time the user clicks notifications.
            popup = document.createElement('div');
            popup.id = 'notifications-popup-mock';
            popup.style.cssText = `
                position: absolute; top: 4rem; right: 2rem; width: 300px; background: white; 
                border: 1px solid var(--color-border); border-radius: var(--radius-md); 
                box-shadow: var(--shadow-md); z-index: 1000; display: flex; flex-direction: column;
            `;
            
            popup.innerHTML = `
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-weight: bold; color: var(--color-terracotta);">Notifications</div>
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-size: 0.875rem;">
                    <div style="margin-bottom: 0.25rem;"><strong>Ahmed</strong> sent you an inquiry.</div>
                    <div style="color: var(--color-text-lighter); font-size: 0.75rem;">2 hours ago</div>
                </div>
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-size: 0.875rem;">
                    <div style="margin-bottom: 0.25rem;">Your artwork <strong>Cerulean Oasis Vase</strong> received a new kudos.</div>
                    <div style="color: var(--color-text-lighter); font-size: 0.75rem;">Yesterday</div>
                </div>
                <div style="padding: 0.5rem; text-align: center;">
                    <a href="#" style="font-size: 0.75rem; color: var(--color-terracotta); text-decoration: underline;">View all</a>
                </div>
            `;
            
            // Need to append it to something relative, or just absolute on body
            document.body.appendChild(popup);
            
            // Global click closes the popup when user clicks outside.
            document.addEventListener('click', () => {
                if (popup.style.display === 'flex') {
                    popup.style.display = 'none';
                }
            });
            
            // Keep popup open when interacting with its own content.
            popup.addEventListener('click', (ev) => ev.stopPropagation());
        }
        
        // Toggle visibility for subsequent clicks.
        popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';
    });
});
