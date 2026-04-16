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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
    loadGithubProjects();
});