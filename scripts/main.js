// Main script moved from inline to external file for better caching and maintainability
// 2023 official data (replaced sample values with provided 2023 figures)
const NATIONAL_BUDGET_LABEL = '12.8 T DZD';

// Budget data
const budgetData = {
    labels: ['Education', 'Healthcare', 'Infrastructure', 'Defense', 'Social Services', 'Agriculture', 'Energy', 'Other'],
    datasets: [{
        data: [18.2, 15.7, 12.4, 11.1, 10.0, 8.5, 7.3, 16.8],
        backgroundColor: [
            '#007A3D', '#009E49', '#00B855', '#00D261',
            '#4CDC7D', '#7AE69E', '#A8F0BF', '#D5FAE1'
        ],
        borderWidth: 0
    }]
};

const budgetComparisonData = {
    labels: ['Education', 'Healthcare', 'Infrastructure', 'Defense', 'Social Services'],
    datasets: [
        {
            label: '2022 (T DZD)',
            data: [2.15, 1.85, 1.42, 1.38, 1.20],
            backgroundColor: '#A8F0BF',
        },
        {
            label: '2023 (T DZD)',
            data: [2.33, 2.01, 1.59, 1.42, 1.28],
            backgroundColor: '#007A3D',
        }
    ]
};

const regionalDevelopmentData = {
    labels: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Batna', 'Tlemcen', 'Setif', 'Blida'],
    datasets: [{
        label: 'Development Index',
        data: [78, 72, 68, 65, 62, 59, 57, 55],
        backgroundColor: '#007A3D',
        borderColor: '#007A3D',
        borderWidth: 1
    }]
};

// Top provinces by budget (2023) — provided values
const topProvinces2023 = [
    { name: 'Algiers', budget: '412 B DZD' },
    { name: 'Oran', budget: '298 B DZD' },
    { name: 'Constantine', budget: '245 B DZD' },
    { name: 'Annaba', budget: '198 B DZD' },
    { name: 'Batna', budget: '176 B DZD' }
];

// Projects data
const projectsData = [
    {
        id: 1,
        title: "Algiers Metro Expansion",
        status: "ongoing",
        cost: "245 B DZD",
        completion: "Q4 2025",
        progress: 65,
        description: "Extension of the Algiers metro system to connect suburban areas with the city center."
    },
    {
        id: 2,
        title: "Renewable Energy Initiative",
        status: "ongoing",
        cost: "320 B DZD",
        completion: "Q2 2026",
        progress: 40,
        description: "Development of solar and wind power plants across southern provinces."
    },
    {
        id: 3,
        title: "National Highway Network",
        status: "completed",
        cost: "410 B DZD",
        completion: "Q1 2023",
        progress: 100,
        description: "Construction of new highways connecting major cities across Algeria."
    },
    {
        id: 4,
        title: "Digital Government Platform",
        status: "ongoing",
        cost: "85 B DZD",
        completion: "Q3 2024",
        progress: 30,
        description: "Development of a unified digital platform for all government services."
    },
    {
        id: 5,
        title: "Healthcare Infrastructure Upgrade",
        status: "planned",
        cost: "190 B DZD",
        completion: "Q1 2027",
        progress: 0,
        description: "Modernization of hospitals and clinics in underserved regions."
    },
    {
        id: 6,
        title: "Agricultural Development Program",
        status: "ongoing",
        cost: "120 B DZD",
        completion: "Q4 2024",
        progress: 55,
        description: "Support for modern farming techniques and irrigation systems."
    },
    {
        id: 7,
        title: "University Expansion Project",
        status: "planned",
        cost: "95 B DZD",
        completion: "Q2 2026",
        progress: 0,
        description: "Construction of new university campuses and research facilities."
    },
    {
        id: 8,
        title: "Water Desalination Plants",
        status: "completed",
        cost: "180 B DZD",
        completion: "Q3 2022",
        progress: 100,
        description: "Construction of seawater desalination plants along the Mediterranean coast."
    }
];

// Helper: render top provinces list dynamically
function renderTopProvinces() {
    const ul = document.getElementById('topProvincesList');
    if (!ul) return;
    ul.innerHTML = '';

    topProvinces2023.forEach(p => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `<span class="text-gray-700">${p.name}</span><span class="font-semibold text-green-700">${p.budget}</span>`;
        ul.appendChild(li);
    });
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update displayed national budget label
    const totalBudgetEl = document.querySelector('#home .text-3xl.font-bold.text-green-700');
    if (totalBudgetEl) totalBudgetEl.textContent = NATIONAL_BUDGET_LABEL;

    // Render top provinces into the DOM
    renderTopProvinces();

    // Defer heavy visual initializations until the sections are visible
    const budgetSection = document.getElementById('budget');
    const regionsSection = document.getElementById('regions');

    const onEnter = (entries, observer, fn) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fn();
                observer.unobserve(entry.target);
            }
        });
    };

    // Lazy init charts when budget section appears
    if (budgetSection) {
        const observer = new IntersectionObserver((entries, obs) => onEnter(entries, obs, initBudgetCharts), { rootMargin: '0px 0px -10% 0px' });
        observer.observe(budgetSection);
    } else {
        // fallback
        initBudgetCharts();
    }

    // Lazy init map and regional chart when regions section appears
    if (regionsSection) {
        const obs2 = new IntersectionObserver((entries, obs) => onEnter(entries, obs, () => { initAlgeriaMap(); initRegionalChart(); }), { rootMargin: '0px 0px -20% 0px' });
        obs2.observe(regionsSection);
    } else {
        initAlgeriaMap();
        initRegionalChart();
    }

    // Render projects (lightweight)
    renderProjects('all');

    // Set up event listeners
    setupEventListeners();

    // Initialize scroll animations (light)
    initScrollAnimations();
});

// Initialize budget charts (called lazily)
function initBudgetCharts() {
    if (typeof Chart === 'undefined') return;
    // Home doughnut
    const budgetCanvas = document.getElementById('budgetChart');
    if (budgetCanvas) {
        const budgetCtx = budgetCanvas.getContext('2d');
        window.budgetChart = new Chart(budgetCtx, { type: 'doughnut', data: budgetData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' }, tooltip: { callbacks: { label: function(context) { return `${context.label}: ${context.raw}%`; } } } } } });
    }

    // Sector & comparison
    const sectorCanvas = document.getElementById('sectorBudgetChart');
    if (sectorCanvas) {
        const ctx = sectorCanvas.getContext('2d');
        window.sectorChart = new Chart(ctx, { type: 'bar', data: budgetComparisonData, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Budget (Trillion DZD)' } } } } });
    }
    const comparisonCanvas = document.getElementById('budgetComparisonChart');
    if (comparisonCanvas) {
        const ctx2 = comparisonCanvas.getContext('2d');
        window.comparisonChart = new Chart(ctx2, { type: 'bar', data: budgetComparisonData, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Budget (Trillion DZD)' } } } } });
    }
}

// Count-up animation helper
function animateCountUp(el, start, end, decimals = 1, duration = 1200, suffix = '') {
    if (!el) return;
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = start + (end - start) * progress;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// Export budget table to CSV
function exportBudgetTableToCSV() {
    const rows = document.querySelectorAll('table.min-w-full tbody tr');
    if (!rows.length) return;
    const csv = ['Sector,2023 Budget (DZD),2022 Budget (DZD),Change'];
    rows.forEach(r => {
        const cols = r.querySelectorAll('td');
        const line = Array.from(cols).map(td => '"' + td.textContent.trim().replace(/"/g, '""') + '"').join(',');
        csv.push(line);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algeria_budget_2023.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Download chart image helper
function downloadChartImage(chart, filename) {
    if (!chart || !chart.toBase64Image) return;
    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function initRegionalChart() {
    if (typeof Chart === 'undefined') return;
    const regionalCanvas = document.getElementById('regionalDevelopmentChart');
    if (regionalCanvas) {
        const regionalCtx = regionalCanvas.getContext('2d');
        new Chart(regionalCtx, { type: 'bar', data: regionalDevelopmentData, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Development Index' } } } } });
    }
}

// Initialize Algeria map with Leaflet
function initAlgeriaMap() {
    try {
        const map = L.map('algeriaMap').setView([28.0339, 1.6596], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

        const cities = [
            { name: "Algiers", coords: [36.7525, 3.0420], budget: "412 B DZD", projects: 12, risk: "Low" },
            { name: "Oran", coords: [35.6970, -0.6333], budget: "298 B DZD", projects: 8, risk: "Medium" },
            { name: "Constantine", coords: [36.3650, 6.6147], budget: "245 B DZD", projects: 6, risk: "Low" },
            { name: "Annaba", coords: [36.9028, 7.7556], budget: "198 B DZD", projects: 5, risk: "Medium" },
            { name: "Batna", coords: [35.5550, 6.1744], budget: "176 B DZD", projects: 4, risk: "High" }
        ];

        cities.forEach(city => {
            const marker = L.marker(city.coords).addTo(map);
            marker.bindPopup(`
                <div style="min-width:160px">
                    <h3 style="font-weight:700">${city.name}</h3>
                    <p>Budget: ${city.budget}</p>
                    <p>Active Projects: ${city.projects}</p>
                    <p>Corruption Risk: <strong>${city.risk}</strong></p>
                </div>
            `);
        });
    } catch (err) {
        console.warn('Leaflet map init failed:', err);
    }
}

// Render projects based on filter
function renderProjects(filter) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filteredProjects = filter === 'all' ? projectsData : projectsData.filter(project => project.status === filter);

    filteredProjects.forEach(project => {
        const statusColors = { 'planned': 'bg-yellow-100 text-yellow-800', 'ongoing': 'bg-blue-100 text-blue-800', 'completed': 'bg-green-100 text-green-800' };
        const progressBarColors = { 'planned': 'bg-yellow-500', 'ongoing': 'bg-blue-500', 'completed': 'bg-green-500' };

        const projectCard = document.createElement('div');
        projectCard.className = 'bg-white rounded-xl shadow-md overflow-hidden fade-in';
        projectCard.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-800">${project.title}</h3>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]} capitalize">${project.status}</span>
                </div>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full ${progressBarColors[project.status]}" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="flex justify-between text-sm">
                    <div>
                        <p class="text-gray-500">Cost</p>
                        <p class="font-medium">${project.cost}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Completion</p>
                        <p class="font-medium">${project.completion}</p>
                    </div>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });

    // Re-initialize fade-in animations for new elements
    initScrollAnimations();
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle + accessibility: ESC to close + click outside
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        // Close on ESC
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') mobileMenu.classList.add('hidden'); });
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Project filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => { btn.classList.remove('active','bg-green-700','text-white'); btn.classList.add('bg-white','text-green-700','border','border-green-700'); });
            button.classList.add('active','bg-green-700','text-white');
            button.classList.remove('bg-white','text-green-700','border','border-green-700');
            const filter = button.getAttribute('data-filter');
            renderProjects(filter);
        });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('svg');
            if (document.body.classList.contains('dark-mode')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // Discord webhook URL (restored per user request)
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1431065951344005312/UhNaTOXIpQMndCo9disAgxB50Kf-DU9tolQfMc6GlysAFvZx3lTOWTfuL7aQaoFEmCV2';

    // Feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                province: document.getElementById('province').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value,
                anonymous: document.getElementById('anonymous').checked
            };

            const discordMessage = {
                content: '**New Feedback Submission**',
                embeds: [{
                    title: 'Citizen Feedback',
                    color: 0x007A3D,
                    fields: [
                        { name: 'Name', value: formData.anonymous ? 'Anonymous' : (formData.name || 'Not provided'), inline: true },
                        { name: 'Email', value: formData.anonymous ? 'Hidden' : (formData.email || 'Not provided'), inline: true },
                        { name: 'Province', value: formData.province || 'Not provided', inline: true },
                        { name: 'Category', value: formData.category || 'Not provided', inline: true },
                        { name: 'Message', value: formData.message || 'No message provided', inline: false }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            // Only attempt to send if webhook is configured
            if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== 'REPLACE_WITH_WEBHOOK_URL') {
                try {
                    await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(discordMessage) });
                    alert('Feedback submitted successfully!');
                } catch (error) {
                    console.error('Error sending feedback to Discord:', error);
                    alert('Feedback submitted (Discord notification failed).');
                }
            } else {
                console.warn('Discord webhook not configured. Skipping webhook POST.');
                alert('Feedback submitted (webhook not configured).');
            }

            feedbackForm.reset();
        });
    }

    // CSV export button
    const exportCsvBtn = document.getElementById('exportBudgetCsvBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportBudgetTableToCSV);

    // Chart download buttons
    const downloadBudgetBtn = document.getElementById('downloadBudgetChartBtn');
    if (downloadBudgetBtn) downloadBudgetBtn.addEventListener('click', () => downloadChartImage(window.budgetChart, 'budget_doughnut.png'));
    const downloadSectorBtn = document.getElementById('downloadSectorChartBtn');
    if (downloadSectorBtn) downloadSectorBtn.addEventListener('click', () => downloadChartImage(window.sectorChart, 'sector_bars.png'));
    const downloadComparisonBtn = document.getElementById('downloadComparisonChartBtn');
    if (downloadComparisonBtn) downloadComparisonBtn.addEventListener('click', () => downloadChartImage(window.comparisonChart, 'comparison_bars.png'));

    // Project search input (debounced)
    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) {
        let debounceTimer = null;
        projectSearch.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const filtered = projectsData.filter(p => (p.title + ' ' + p.region + ' ' + p.description).toLowerCase().includes(q));
                renderProjects(filtered);
            }, 200);
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
        // Fallback: make elements visible
        fadeElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));
}
