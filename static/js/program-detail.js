// Страница деталей программы KirDev Studio
// Логика вынесена из HTML, чтобы разметка была чище и безопаснее.

(function () {
    const svgDownload = '<svg class="icon-spaced" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
    const svgGithub = '<svg class="icon-spaced" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
    const svgShare = '<svg class="icon-spaced" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';

    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    function setMeta(id, value) {
        const el = document.getElementById(id);
        if (el) el.setAttribute('content', value);
    }

    function toAbsoluteUrl(path) {
        return new URL(path, window.location.href).href;
    }

    function getCleanCurrentUrl() {
        const url = new URL(window.location.href);
        const id = new URLSearchParams(window.location.search).get('id');
        url.search = id ? `?id=${encodeURIComponent(id)}` : '';
        url.hash = '';
        return url.href;
    }

    function getProgramFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const programId = parseInt(urlParams.get('id'), 10);

        if (Number.isNaN(programId) || typeof PROGRAMS === 'undefined') {
            return null;
        }

        return PROGRAMS.find((program) => program.id === programId) || null;
    }

    function updateMeta(program) {
        const canonicalUrl = getCleanCurrentUrl();
        document.title = `${program.name} — Скачать бесплатно на KirDev Studio`;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', program.description);

        const canonical = document.getElementById('canonical-url');
        if (canonical) canonical.setAttribute('href', canonicalUrl);

        setMeta('og-title', `${program.name} — Скачать бесплатно на KirDev Studio`);
        setMeta('og-desc', program.description);
        setMeta('og-img', toAbsoluteUrl(program.cover_image || '../static/images/hero_illustration.jpg'));
        setMeta('og-url', canonicalUrl);

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        const twitterImg = document.querySelector('meta[name="twitter:image"]');

        if (twitterTitle) twitterTitle.setAttribute('content', `${program.name} — Скачать бесплатно на KirDev Studio`);
        if (twitterDesc) twitterDesc.setAttribute('content', program.description);
        if (twitterImg) twitterImg.setAttribute('content', toAbsoluteUrl(program.cover_image || '../static/images/hero_illustration.jpg'));
    }

    function createActionLink(href, className, icon, text, isExternal) {
        const link = document.createElement('a');
        link.href = href;
        link.className = className;
        link.insertAdjacentHTML('beforeend', icon);
        link.append(document.createTextNode(text));

        if (isExternal) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        } else {
            link.setAttribute('download', '');
        }

        return link;
    }

    function buildDetails(container, program) {
        container.textContent = '';

        const back = createEl('a', 'detail-back-link', '← Назад к разработкам');
        back.href = 'programs.html';
        container.appendChild(back);

        const hero = createEl('div', 'detail-hero-block');
        hero.appendChild(createEl('h1', 'detail-title-main', program.name));

        const meta = createEl('div', 'detail-meta');
        const version = createEl('span', 'version-badge skeleton detail-version', `v${program.version}`);
        const category = createEl('span', '', program.category);
        const downloads = createEl('span', 'icon-label');
        downloads.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>');
        const counter = createEl('span', 'skeleton', String(program.download_count));
        counter.id = 'detail-download-counter';
        downloads.append(counter, document.createTextNode(' скачиваний'));
        meta.append(version, createEl('span', '', '•'), category, createEl('span', '', '•'), downloads);
        hero.appendChild(meta);

        const actions = createEl('div', 'detail-actions-wrapper');
        const isExternal = program.link.startsWith('http://') || program.link.startsWith('https://');
        const downloadUrl = isExternal ? program.link : `downloads/${program.link}`;
        const downloadBtn = createActionLink(downloadUrl, 'download-btn detail-download-btn detail-action-btn', svgDownload, 'Скачать безопасно', isExternal);
        const repoBtn = createActionLink('#', 'repo-btn', svgGithub, 'Исходный код', true);
        const shareBtn = createEl('button', 'share-btn');
        shareBtn.id = 'share-btn';
        shareBtn.insertAdjacentHTML('beforeend', svgShare);
        const shareText = createEl('span', '', 'Поделиться');
        shareText.id = 'share-text';
        shareBtn.appendChild(shareText);
        actions.append(downloadBtn, repoBtn, shareBtn);
        hero.appendChild(actions);
        container.appendChild(hero);

        const detailSection = createEl('div', 'detail-section');
        detailSection.appendChild(createEl('h2', 'detail-section-title', 'О разработке'));
        detailSection.appendChild(createEl('p', 'detail-description', program.full_description));
        detailSection.appendChild(createEl('h3', 'detail-subtitle', 'Ключевые возможности:'));

        const features = createEl('ul', 'feature-list');
        program.features.forEach((feature) => features.appendChild(createEl('li', '', feature)));
        detailSection.appendChild(features);

        const changelog = createEl('div', 'changelog-section');
        changelog.appendChild(createEl('h3', 'changelog-title', 'Что нового'));
        changelog.appendChild(createEl('div', 'changelog-content'));
        detailSection.appendChild(changelog);
        container.appendChild(detailSection);

        container.appendChild(createEl('h2', 'screenshots-title', 'Скриншоты'));
        container.appendChild(buildCarousel(program));
        container.appendChild(buildFeedbackBanner());
    }

    function buildCarousel(program) {
        const carousel = createEl('div', 'screenshots-carousel');
        const slides = createEl('div', 'carousel-slides');
        slides.id = 'carousel-slides';
        const dots = createEl('div', 'carousel-dots');
        dots.id = 'carousel-dots';

        const shots = Array.isArray(program.screenshots) ? program.screenshots : [];
        if (shots.length > 0) {
            shots.forEach((shot, index) => {
                const slide = createEl('div', `carousel-slide ${index === 0 ? 'active' : ''}`);
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = shot.replace('./', '../');
                img.alt = `Скриншот ${program.name}`;
                img.className = 'screenshot-img';
                const fallback = createEl('div', 'screenshot-fallback', 'Скриншот скоро появится');
                img.addEventListener('error', () => {
                    img.classList.add('is-hidden');
                    fallback.classList.add('is-visible');
                });
                slide.append(img, fallback);
                slides.appendChild(slide);

                const dot = createEl('span', `carousel-dot ${index === 0 ? 'active' : ''}`);
                dot.dataset.index = String(index);
                dots.appendChild(dot);
            });
        } else {
            const slide = createEl('div', 'carousel-slide active');
            slide.appendChild(createEl('div', 'screenshot-fallback is-visible', 'Скриншот скоро появится'));
            slides.appendChild(slide);
        }

        carousel.append(
            slides,
            createEl('button', 'carousel-btn prev'),
            createEl('button', 'carousel-btn next'),
            dots
        );
        carousel.querySelector('.prev').setAttribute('aria-label', 'Предыдущий слайд');
        carousel.querySelector('.next').setAttribute('aria-label', 'Следующий слайд');
        carousel.querySelector('.prev').textContent = '‹';
        carousel.querySelector('.next').textContent = '›';

        return carousel;
    }

    function buildFeedbackBanner() {
        const banner = createEl('div', 'feedback-banner');
        banner.appendChild(createEl('h3', 'feedback-title', 'Нашли баг или есть идея?'));
        banner.appendChild(createEl('p', 'feedback-copy', 'Мы — хобби-студия, и нам очень важен фидбек. Напишите нам в Telegram, если у вас есть предложения по улучшению программы или вы столкнулись с проблемой.'));
        const link = createEl('a', 'btn-secondary telegram-feedback-link', 'Написать в Telegram');
        link.href = 'https://t.me/kirdev_studio?direct';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        banner.appendChild(link);
        return banner;
    }

    function initShareButton() {
        const shareBtn = document.getElementById('share-btn');
        const shareTextSpan = document.getElementById('share-text');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                if (window.showToast) {
                    window.showToast('✨ Ссылка скопирована в буфер обмена');
                } else if (shareTextSpan) {
                    shareTextSpan.textContent = 'Ссылка скопирована!';
                    setTimeout(() => {
                        shareTextSpan.textContent = 'Поделиться';
                    }, 2000);
                }
            } catch (err) {
                console.error('Не удалось скопировать ссылку: ', err);
                if (window.showToast) window.showToast('Ошибка при копировании ссылки');
            }
        });
    }

    function initCarouselAndLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        const carouselDots = document.querySelectorAll('.carousel-dot');
        const carouselPrev = document.querySelector('.carousel-btn.prev');
        const carouselNext = document.querySelector('.carousel-btn.next');

        let carouselIndex = 0;
        let currentIndex = 0;
        const screenshots = [];

        const showCarouselImage = (index) => {
            if (carouselSlides.length === 0) return;
            carouselIndex = (index + carouselSlides.length) % carouselSlides.length;
            carouselSlides.forEach((slide, idx) => slide.classList.toggle('active', idx === carouselIndex));
            carouselDots.forEach((dot, idx) => dot.classList.toggle('active', idx === carouselIndex));
        };

        const showImage = (index) => {
            if (screenshots.length === 0) return;
            currentIndex = (index + screenshots.length) % screenshots.length;
            showCarouselImage(currentIndex);
            lightboxImg.classList.remove('is-loaded');
            lightboxImg.classList.add('is-switching');
            setTimeout(() => {
                lightboxImg.src = screenshots[currentIndex];
                lightboxImg.classList.remove('is-switching');
                lightboxImg.classList.add('is-loaded');
            }, 150);
            prevBtn.classList.toggle('is-hidden', screenshots.length <= 1);
            nextBtn.classList.toggle('is-hidden', screenshots.length <= 1);
        };

        showCarouselImage(0);
        if (carouselSlides.length <= 1) {
            if (carouselPrev) carouselPrev.classList.add('is-hidden');
            if (carouselNext) carouselNext.classList.add('is-hidden');
            const dotsContainer = document.querySelector('.carousel-dots');
            if (dotsContainer) dotsContainer.classList.add('is-hidden');
        }

        if (carouselPrev) carouselPrev.addEventListener('click', (e) => { e.stopPropagation(); showCarouselImage(carouselIndex - 1); });
        if (carouselNext) carouselNext.addEventListener('click', (e) => { e.stopPropagation(); showCarouselImage(carouselIndex + 1); });
        carouselDots.forEach((dot) => dot.addEventListener('click', (e) => { e.stopPropagation(); showCarouselImage(parseInt(dot.dataset.index, 10)); }));

        document.querySelectorAll('.screenshot-img').forEach((img) => {
            img.addEventListener('click', () => {
                const activeScreenshots = Array.from(document.querySelectorAll('.screenshot-img'))
                    .filter((item) => !item.classList.contains('is-hidden'))
                    .map((item) => item.src);
                screenshots.length = 0;
                screenshots.push(...activeScreenshots);
                lightbox.classList.add('is-open');
                showImage(activeScreenshots.indexOf(img.src));
                setTimeout(() => lightbox.classList.add('is-visible'), 10);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightboxImg.classList.remove('is-loaded');
            setTimeout(() => lightbox.classList.remove('is-open'), 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
        if (lightboxImg) lightboxImg.addEventListener('click', (e) => { e.stopPropagation(); if (screenshots.length > 1) showImage(currentIndex + 1); });
        if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('detail-container');
        const program = getProgramFromUrl();

        if (!container || !program) {
            window.location.href = '404.html';
            return;
        }

        updateMeta(program);
        buildDetails(container, program);
        initCarouselAndLightbox();
        initShareButton();
        updateDownloadCounters();
    });
})();
