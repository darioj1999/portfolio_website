const body = document.body;
const darkModeClass = 'dark-mode';
const GITHUB_USERNAME = 'darioj1999';

function toggleTheme(){
    body.classList.toggle(darkModeClass);
}

async function loadGithubProjects() {
    const container = document.getElementById('github-projects');
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
        const repos = await response.json();
        
        container.innerHTML = repos
            .filter(repo => !repo.fork)
            .map(repo => `
                <div class="project-card">
                    <a href="${repo.html_url}" target="_blank"><strong>${repo.name}</strong></a>
                    <p>${repo.description || 'No description provided.'}</p>
                    <small>⭐ ${repo.stargazers_count} &nbsp;|&nbsp; Updated: ${new Date(repo.updated_at).toLocaleDateString()}</small>
                </div>
            `).join('');
    } catch (err) {
        container.innerHTML = '<p>Could not load projects.</p>';
    }
}

async function loadGithubStats() {
    const container = document.getElementById('github-stats');
    try {
        const [profileRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
        ]);

        const profile = await profileRes.json();
        const repos = await reposRes.json();

        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

        const languages = repos
            .map(repo => repo.language)
            .filter(Boolean);
        const mostUsed = languages
            .sort((a, b) =>
                languages.filter(l => l === b).length - languages.filter(l => l === a).length
            )[0];
        container.innerHTML = `
            <h3>GitHub Stats</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${profile.public_repos}</span>
                    <span class="stat-label">Public Repos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${profile.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${totalStars}</span>
                    <span class="stat-label">Total Stars</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${mostUsed || 'N/A'}</span>
                    <span class="stat-label">Top Language</span>
                </div>
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Could not load GitHub stats.</p>';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
    loadGithubProjects();
    loadGithubStats();
});