// Каталог программ KirDev Studio

(function () {
    const platformIcons = {
        'ПК': '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        'Android': '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
        'Боты': '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a8.3 8.3 0 0 0-5.3-1.8 8.3 8.3 0 0 0-5.3 1.8 8.3 8.3 0 0 0-5.3-1.8A8.3 8.3 0 0 0 0 15v4a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-4z"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        'Сайты': '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        'Python': '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>'
    };

    const defaultIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';

    let currentFilter = 'all';
    let currentSort = 'new';
    let currentSearch = '';

    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    function getPlatformIcon(category) {
        return platformIcons[category] || defaultIcon;
    }

    function renderEmptyCatalog(grid) {
        grid.textContent = '';
        const empty = createEl('div', 'program-card-empty');
        empty.insertAdjacentHTML('beforeend', '<svg class="empty-icon" aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>');
        empty.appendChild(createEl('p', 'empty-copy', 'Разработки ещё не добавлены'));
        grid.appendChild(empty);
    }

    function createProgramCard(program, index) {
        const card = createEl('div', 'program-card catalog-card');
        card.dataset.category = program.category;
        card.dataset.name = program.name.toLowerCase();

        const titleRow = createEl('div', 'program-card-title-row');
        titleRow.appendChild(createEl('h3', 'program-card-title', program.name));
        titleRow.appendChild(createEl('div', 'status-tags'));

        const meta = createEl('div', 'program-card-meta');
        const category = createEl('span', 'meta-item');
        category.insertAdjacentHTML('beforeend', getPlatformIcon(program.category));
        category.appendChild(document.createTextNode(program.category));

        const version = createEl('span', 'version-badge', `v${program.version}`);
        const downloads = createEl('span', 'meta-item');
        downloads.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>');
        const counter = createEl('span', 'download-counter', String(program.download_count));
        counter.dataset.programId = String(program.id);
        downloads.append(counter, document.createTextNode(' скачиваний'));

        meta.append(category, createEl('span', '', '•'), version, createEl('span', '', '•'), downloads);

        const description = createEl('p', 'program-card-description', program.description);
        const linkWrapper = document.createElement('div');
        const link = createEl('a', 'program-link', 'Подробнее');
        link.href = `program_detail.html?id=${program.id}`;
        linkWrapper.appendChild(link);

        card.append(titleRow, meta, description, linkWrapper);

        setTimeout(() => {
            card.classList.add('is-visible');
        }, 50 * index);

        return card;
    }

    function renderPrograms(programsToRender) {
        const grid = document.getElementById('programs-grid');
        grid.textContent = '';

        if (!programsToRender || programsToRender.length === 0) return;

        programsToRender.forEach((program, index) => {
            grid.appendChild(createProgramCard(program, index));
        });

        updateDownloadCounters();
    }

    function applyFiltersAndSort() {
        let filteredPrograms = [...PROGRAMS];

        if (currentSearch.trim() !== '') {
            const query = currentSearch.toLowerCase();
            filteredPrograms = filteredPrograms.filter((program) =>
                program.name.toLowerCase().includes(query) ||
                program.description.toLowerCase().includes(query)
            );
        }

        if (currentFilter !== 'all') {
            filteredPrograms = filteredPrograms.filter((program) => program.category === currentFilter);
        }

        if (currentSort === 'new') {
            filteredPrograms.sort((a, b) => b.id - a.id);
        } else if (currentSort === 'popular') {
            filteredPrograms.sort((a, b) => (b.dynamic_count || b.download_count) - (a.dynamic_count || a.download_count));
        } else if (currentSort === 'az') {
            filteredPrograms.sort((a, b) => a.name.localeCompare(b.name));
        }

        const emptyMsg = document.getElementById('empty-filter-msg');
        const grid = document.getElementById('programs-grid');

        if (filteredPrograms.length === 0) {
            grid.classList.add('is-hidden');
            if (emptyMsg) emptyMsg.classList.add('is-visible');
        } else {
            if (emptyMsg) emptyMsg.classList.remove('is-visible');
            grid.classList.remove('is-hidden');
            renderPrograms(filteredPrograms);
        }
    }

    function resetSearchAndFilters() {
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');

        if (searchInput) searchInput.value = '';
        currentSearch = '';

        document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
        const allFilter = document.querySelector('[data-filter="all"]');
        if (allFilter) allFilter.classList.add('active');
        currentFilter = 'all';

        if (sortSelect) sortSelect.value = 'new';
        currentSort = 'new';

        applyFiltersAndSort();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const grid = document.getElementById('programs-grid');
        if (!grid) return;

        if (typeof PROGRAMS === 'undefined' || PROGRAMS.length === 0) {
            renderEmptyCatalog(grid);
            return;
        }

        renderPrograms([...PROGRAMS].sort((a, b) => b.id - a.id));

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                currentSearch = event.target.value;
                applyFiltersAndSort();
            });
        }

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (event) => {
                currentSort = event.target.value;
                applyFiltersAndSort();
            });
        }

        document.querySelectorAll('.filter-btn').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.dataset.filter;
                applyFiltersAndSort();
            });
        });

        const resetBtn = document.getElementById('reset-filters-btn');
        if (resetBtn) resetBtn.addEventListener('click', resetSearchAndFilters);
    });
})();
