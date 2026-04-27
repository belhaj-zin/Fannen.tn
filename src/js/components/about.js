document.addEventListener('DOMContentLoaded', () => {
    const teamGrid = document.getElementById('team-grid-container');
    if (teamGrid) {
        fetch('../js/data/team.json')
            .then(res => res.json())
            .then(data => {
                teamGrid.innerHTML = '';
                data.forEach(member => {
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
            .catch(err => console.error('Error loading team data:', err));
    }
});
