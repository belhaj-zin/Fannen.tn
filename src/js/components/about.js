document.addEventListener('DOMContentLoaded', () => {
    // This component only runs on the Our Story page where this container exists.
    const teamGrid = document.getElementById('team-grid-container');
    if (teamGrid) {
        // Load mock team data (acts like a future API response).
        fetch('../js/data/team.json')
            .then(res => res.json())
            .then(data => {
                // Clear any static placeholder content before rendering fresh cards.
                teamGrid.innerHTML = '';
                data.forEach(member => {
                    // Build one reusable card per team member from JSON fields.
                    const article = document.createElement('article');
                    article.className = 'artwork-card';
                    article.innerHTML = `
                        <div class="artwork-img-box">
                            <img src="${member.image}" alt="${member.name}" style="object-fit: cover; aspect-ratio: 1/1;">
                        </div>
                        <div class="artwork-content text-left" style="padding: var(--spacing-md);">
                            <h3 class="artwork-title">${member.name}</h3>
                            <p class="text-terracotta text-sm font-bold" style="text-transform: uppercase; margin-bottom: 0.5rem;">${member.role}</p>
                            <p class="text-sm">${member.description}</p>
                        </div>
                    `;
                    teamGrid.appendChild(article);
                });
            })
            // Keep failure visible in dev tools without breaking the rest of the page.
            .catch(err => console.error('Error loading team data:', err));
    }
});
