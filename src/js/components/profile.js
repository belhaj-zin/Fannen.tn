document.addEventListener('DOMContentLoaded', () => {
    const authState = getAuthState();

    if (!authState.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const profile = getStoredProfile(authState);

    hydrateProfileHeader(authState, profile);
    initLogoutButton();
    initSettings(authState, profile);

    if (authState.role === 'artisan') {
        initArtisanProfile();
    } else {
        initEnthusiastProfile();
    }
});

function getAuthState() {
    const authStateStr = localStorage.getItem('fannen_auth_state');
    return authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user', userId: '' };
}

function getProfileStorageKey(authState) {
    const role = authState.role || 'user';
    const userId = authState.userId || 'guest';
    return `fannen_profile_data_${role}_${userId}`;
}

function getStoredProfile(authState) {
    const storageKey = getProfileStorageKey(authState);
    const raw = localStorage.getItem(storageKey);

    const fallback = {
        displayName: authState.role === 'artisan' ? 'Artisan Studio' : 'Enthusiast Collector',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=60'
    };

    if (!raw) return fallback;

    try {
        return { ...fallback, ...JSON.parse(raw) };
    } catch (error) {
        return fallback;
    }
}

function hydrateProfileHeader(authState, profile) {
    const avatar = document.getElementById('profile-avatar');
    const name = document.getElementById('profile-name');
    const subtitle = document.getElementById('profile-subtitle');
    const roleLabel = document.getElementById('profile-role-label');

    if (avatar) avatar.src = profile.avatarUrl;
    if (name) name.textContent = profile.displayName;

    if (authState.role === 'artisan') {
        if (roleLabel) roleLabel.textContent = 'Artisan account';
        if (subtitle) subtitle.textContent = 'Your collector profile plus full studio management tools.';
    } else {
        if (roleLabel) roleLabel.textContent = 'Enthusiast account';
        if (subtitle) subtitle.textContent = 'Review your selected artworks and update your account settings.';
    }
}

function initLogoutButton() {
    const logoutBtn = document.getElementById('btn-profile-logout');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('fannen_auth_state');
        window.location.href = '../index.html';
    });
}

function initSettings(authState, profile) {
    const openBtn = document.getElementById('btn-open-profile-edit');
    const closeBtn = document.getElementById('btn-close-profile-edit');
    const overlay = document.getElementById('profile-edit-overlay');
    const form = document.getElementById('profile-settings-form');
    const nameInput = document.getElementById('settings-name');
    const avatarFileInput = document.getElementById('settings-avatar-file');
    const avatarFileName = document.getElementById('profile-upload-filename');
    const message = document.getElementById('profile-settings-message');
    const avatar = document.getElementById('profile-avatar');
    const previewAvatar = document.getElementById('profile-edit-avatar-preview');
    const previewName = document.getElementById('profile-edit-name-preview');

    if (!form || !nameInput || !avatarFileInput || !openBtn || !closeBtn || !overlay) return;

    openBtn.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    nameInput.value = profile.displayName;
    if (previewAvatar) previewAvatar.src = profile.avatarUrl;
    if (previewName) previewName.textContent = profile.displayName;

    let uploadedAvatarDataUrl = '';

    avatarFileInput.addEventListener('change', () => {
        const file = avatarFileInput.files && avatarFileInput.files[0];
        if (!file) return;

        if (avatarFileName) {
            avatarFileName.textContent = file.name;
        }

        const reader = new FileReader();
        reader.onload = () => {
            uploadedAvatarDataUrl = String(reader.result || '');
            if (avatar && uploadedAvatarDataUrl) {
                avatar.src = uploadedAvatarDataUrl;
            }
            if (previewAvatar && uploadedAvatarDataUrl) {
                previewAvatar.src = uploadedAvatarDataUrl;
            }
            if (message) {
                message.textContent = 'New profile picture selected. Click Save Settings to apply.';
                message.style.color = 'var(--color-text-light)';
            }
        };
        reader.readAsDataURL(file);
    });

    nameInput.addEventListener('input', () => {
        if (previewName) {
            previewName.textContent = nameInput.value.trim() || 'Your name';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const displayName = nameInput.value.trim();
    const avatarUrl = uploadedAvatarDataUrl || profile.avatarUrl;

        const nextProfile = { displayName, avatarUrl };
        localStorage.setItem(getProfileStorageKey(authState), JSON.stringify(nextProfile));

        if (avatar) avatar.src = nextProfile.avatarUrl;
        if (previewAvatar) previewAvatar.src = nextProfile.avatarUrl;
        const nameTitle = document.getElementById('profile-name');
        if (nameTitle) nameTitle.textContent = nextProfile.displayName;
        if (previewName) previewName.textContent = nextProfile.displayName;

        if (message) {
            message.textContent = 'Settings saved successfully.';
            message.style.color = '#1E8E3E';
        }

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 250);
    });
}

function initEnthusiastProfile() {
    const enthusiastSection = document.getElementById('enthusiast-section');
    const artisanSection = document.getElementById('artisan-section');

    if (enthusiastSection) enthusiastSection.style.display = 'block';
    if (artisanSection) artisanSection.style.display = 'none';

    renderCart();

    const clearCartBtn = document.getElementById('btn-clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            localStorage.setItem('fannen_cart_items', JSON.stringify([]));
            renderCart();
        });
    }
}

function renderCart() {
    const cartBody = document.getElementById('profile-cart-body');
    const totalEl = document.getElementById('profile-cart-total');

    if (!cartBody || !totalEl) return;

    const cart = JSON.parse(localStorage.getItem('fannen_cart_items') || '[]');

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color: var(--color-text-light);">Your cart is empty. Browse the vault and add artworks to buy.</td>
            </tr>
        `;
        totalEl.textContent = '0 TND';
        return;
    }

    let total = 0;

    cartBody.innerHTML = cart.map(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const subtotal = price * quantity;
        total += subtotal;

        return `
            <tr>
                <td>
                    <div class="profile-cart-item">
                        <img src="${item.image}" alt="${item.title}" class="profile-cart-thumb">
                        <div>
                            <p class="font-bold">${item.title}</p>
                            <p class="text-sm">by ${item.artisanName}</p>
                        </div>
                    </div>
                </td>
                <td>${price} TND</td>
                <td>
                    <div class="profile-qty-controls">
                        <button class="btn btn-ghost" data-action="decrease" data-id="${item.id}" type="button">-</button>
                        <span>${quantity}</span>
                        <button class="btn btn-ghost" data-action="increase" data-id="${item.id}" type="button">+</button>
                    </div>
                </td>
                <td>${subtotal} TND</td>
                <td>
                    <button class="btn btn-ghost" data-action="remove" data-id="${item.id}" type="button">Remove</button>
                </td>
            </tr>
        `;
    }).join('');

    totalEl.textContent = `${total} TND`;

    cartBody.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const action = btn.getAttribute('data-action');
            updateCartItem(id, action);
        });
    });
}

function updateCartItem(artworkId, action) {
    const cart = JSON.parse(localStorage.getItem('fannen_cart_items') || '[]');
    const item = cart.find(entry => entry.id === artworkId);

    if (!item) return;

    if (action === 'increase') {
        item.quantity = (Number(item.quantity) || 1) + 1;
    }

    if (action === 'decrease') {
        item.quantity = (Number(item.quantity) || 1) - 1;
    }

    let nextCart = cart;

    if (action === 'remove' || item.quantity <= 0) {
        nextCart = cart.filter(entry => entry.id !== artworkId);
    }

    localStorage.setItem('fannen_cart_items', JSON.stringify(nextCart));
    renderCart();
}

function initArtisanProfile() {
    const enthusiastSection = document.getElementById('enthusiast-section');
    const artisanSection = document.getElementById('artisan-section');

    if (enthusiastSection) enthusiastSection.style.display = 'none';
    if (artisanSection) artisanSection.style.display = 'block';

    initArtisanUploadZone();
    renderArtisanPortfolio();
}

function initArtisanUploadZone() {
    const uploadZone = document.getElementById('artisan-upload-zone');
    const selectBtn = document.getElementById('artisan-btn-select-files');
    const browseGalleryBtn = document.getElementById('artisan-btn-browse-gallery');

    if (!uploadZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.style.borderColor = 'var(--color-terracotta)';
            uploadZone.style.background = 'rgba(216, 96, 59, 0.05)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.style.borderColor = 'var(--color-border)';
            uploadZone.style.background = 'var(--color-white)';
        }, false);
    });

    uploadZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleSelectedFiles(files);
    }, false);

    if (selectBtn) {
        selectBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                handleSelectedFiles(event.target.files);
            };
            input.click();
        });
    }

    if (browseGalleryBtn) {
        browseGalleryBtn.addEventListener('click', () => {
            window.location.href = '../index.html#gallery';
        });
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleSelectedFiles(files) {
    if (!files || files.length === 0) return;
    alert(`Mock upload: ${files[0].name} received.`);
}

function renderArtisanPortfolio() {
    const tableBody = document.getElementById('artisan-portfolio-table-body');
    if (!tableBody) return;

    fetch('../js/data/artworks.json')
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = data.map(artwork => {
                const statusClass = artwork.status.toLowerCase() === 'published' ? 'published' : '';
                return `
                    <tr>
                        <td>
                            <div class="flex items-center gap-sm">
                                <img src="${artwork.image}" alt="${artwork.title}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;">
                                <span class="font-bold">${artwork.title}</span>
                            </div>
                        </td>
                        <td style="text-transform: capitalize;">${artwork.category}</td>
                        <td><span class="status-badge ${statusClass}">${artwork.status}</span></td>
                        <td><span class="text-text-light">${artwork.views || '0'}</span></td>
                        <td><span class="text-text-light">${artwork.dateAdded || 'Recently'}</span></td>
                        <td>
                            <div class="flex gap-sm text-text-light">
                                <button class="btn-ghost" data-action="edit" data-id="${artwork.id}" type="button" style="border:none; padding:4px;">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                                <button class="btn-ghost" data-action="delete" data-id="${artwork.id}" type="button" style="border:none; padding:4px;">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            tableBody.querySelectorAll('button[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-action');
                    const row = btn.closest('tr');
                    const titleEl = row ? row.querySelector('.font-bold') : null;
                    const artworkTitle = titleEl ? titleEl.textContent : 'this artwork';

                    if (action === 'edit') {
                        alert(`Mock: Opening edit form for "${artworkTitle}"`);
                        return;
                    }

                    if (action === 'delete' && row) {
                        const ok = confirm(`Are you sure you want to delete "${artworkTitle}"?`);
                        if (!ok) return;
                        row.style.transition = 'opacity 0.3s ease';
                        row.style.opacity = '0';
                        setTimeout(() => row.remove(), 300);
                    }
                });
            });
        })
        .catch(() => {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: var(--color-text-light);">Failed to load portfolio.</td></tr>';
        });
}
