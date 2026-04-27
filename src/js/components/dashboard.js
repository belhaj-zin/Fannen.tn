document.addEventListener('DOMContentLoaded', () => {
    // Protected Route Simulation
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };

    if (!authState.isLoggedIn || authState.role !== 'artisan') {
        window.location.href = 'auth.html';
        return; // Stop execution
    }

    // Drag and Drop Upload UI Mock
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadZone.classList.add('highlight');
            uploadZone.style.borderColor = 'var(--color-terracotta)';
            uploadZone.style.background = 'rgba(216, 96, 59, 0.05)';
        }

        function unhighlight(e) {
            uploadZone.classList.remove('highlight');
            uploadZone.style.borderColor = 'var(--color-border)';
            uploadZone.style.background = 'transparent';
        }

        uploadZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            let dt = e.dataTransfer;
            let files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length > 0) {
                const fileName = files[0].name;
                alert(`Mock Upload: File "${fileName}" received. In Phase 3, this will be uploaded to the server.`);
            }
        }
        
        // Button fallback
        const selectBtn = document.getElementById('btn-select-files');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                // Create invisible file input to trigger dialog
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = e => {
                    handleFiles(e.target.files);
                };
                input.click();
            });
        }
    }

    // Fetch and populate portfolio table
    const tableBody = document.getElementById('portfolio-table-body');
    if (tableBody) {
        fetch('../js/data/artworks.json')
            .then(res => res.json())
            .then(data => {
                tableBody.innerHTML = ''; // Clear fallback/loading
                data.forEach(artwork => {
                    const statusClass = artwork.status.toLowerCase() === 'published' ? 'published' : '';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
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
                                <button class="btn-ghost" aria-label="Edit" style="border:none; padding:4px;">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                </button>
                                <button class="btn-ghost" aria-label="Delete" style="border:none; padding:4px;">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(err => console.error('Error loading portfolio:', err));
    }

    // Portfolio Table Interactions (Edit/Delete)
    const portfolioTable = document.getElementById('portfolio-table');
    if (portfolioTable) {
        portfolioTable.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-ghost');
            if (!btn) return;
            
            const tr = btn.closest('tr');
            if (!tr) return;
            
            const artworkTitle = tr.querySelector('.font-bold').textContent;
            
            if (btn.getAttribute('aria-label') === 'Edit') {
                e.preventDefault();
                alert(`Mock: Opening edit form for "${artworkTitle}"`);
            } else if (btn.getAttribute('aria-label') === 'Delete') {
                e.preventDefault();
                const confirmDelete = confirm(`Are you sure you want to delete "${artworkTitle}"?`);
                if (confirmDelete) {
                    tr.style.transition = "opacity 0.3s ease";
                    tr.style.opacity = '0';
                    setTimeout(() => {
                        tr.remove();
                    }, 300);
                }
            }
        });
    }
});
