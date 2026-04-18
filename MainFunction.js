const body = document.body;
const darkModeClass = 'dark-mode';
const GITHUB_USERNAME = 'darioj1999';
emailjs.init('lfbzcY9KNR7VBHBxE');

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

function loadContactForm() {
    const footer = document.getElementById('footer');
    const footerText = document.getElementById('footer-text');
    const form = document.getElementById('contact-form');
    const closeBtn = document.getElementById('close-form');

    // open form
    footerText.addEventListener('click', () => {
        footerText.classList.add('hidden');
        form.classList.remove('hidden');
        footer.classList.add('footer-expanded');
    });

    // cancel button
    closeBtn.addEventListener('click', () => {
        form.classList.add('hidden');
        footerText.classList.remove('hidden');
        footer.classList.remove('footer-expanded');
        form.reset();
    });

    // submit button
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const templateParms = {
            name: name,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        const sendBtn = document.getElementById('send-btn');
        sendBtn.textContent = 'Sending...';
        sendBtn.disabled = true;

        emailjs.send('service_qjl7c9l', 'template_ay3ua6g', templateParms)
            .then(() => {
                footerText.textContent = `Thanks ${name}!`;
                form.classList.add('hidden');
                footerText.classList.remove('hidden');
                footer.classList.remove('footer-expanded');
                form.reset()
                sendBtn.textContent = 'Send';
                sendBtn.disabled = false;

                setTimeout(() => {
                    footerText.textContent = `Contact Me`;
                }, 4000);
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                sendBtn.textContent = 'Send';
                sendBtn.disabled = false;
                alert('Something went wrong. Please try again.');
            });
    });
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
    const toggle = document.getElementById('toggle-theme');

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add(darkModeClass);
        toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
        body.classList.toggle(darkModeClass);
        localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
        document.querySelector('.switch-label').textContent = toggle.checked ? '☀️' : '🌙';
    });

    loadGithubProjects();
    loadGithubStats();
    loadContactForm();
});