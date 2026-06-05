
document.addEventListener('DOMContentLoaded', () => {
    // --- Active Nav Link ---
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav a').forEach(link => {
        if (link.getAttribute('href') === './index.html' || link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '/') {
            if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
                link.classList.add('active');
            }
        } else if ((link.getAttribute('href') === './programs.html' || link.getAttribute('href') === 'programs.html') && currentPath.endsWith('programs.html')) {
            link.classList.add('active');
        }
    });

    // --- Mobile Menu ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('svg');

            const isActive = faqItem.classList.toggle('active');

            if (isActive) {
                content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                    icon.style.color = '#fff';
                }
                faqItem.style.borderColor = 'rgba(255,255,255,0.3)';
                faqItem.style.boxShadow = '0 10px 30px rgba(255,255,255,0.02)';
            } else {
                content.style.maxHeight = '0';
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                    icon.style.color = 'var(--text-secondary)';
                }
                faqItem.style.borderColor = 'var(--border-color)';
                faqItem.style.boxShadow = 'none';
            }
        });
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        const updateIcons = () => {
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'block';
            } else {
                if (sunIcon) sunIcon.style.display = 'block';
                if (moonIcon) moonIcon.style.display = 'none';
            }
        };

        updateIcons();

        themeToggle.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcons();
        });
    }

    // --- Scroll to Top ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Easter Egg Console Log ---
    console.log(
        "%c👋 Привет, разработчик!\n%cВижу, ты любишь заглядывать под капот.\nКирДев Студия — это хобби-проект, написанный с душой. Если есть идеи или просто хочешь пообщаться — заглядывай в наш Telegram!",
        "color: #00ffcc; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,204,0.5);",
        "color: #aaaaaa; font-size: 14px; margin-top: 10px;"
    );

    // --- Animations & Stats ---
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const speed = 200;

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = parseInt(counter.innerText.replace(/\D/g, ''), 10) || 0;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString('ru-RU');
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target.toLocaleString('ru-RU') + (target > 500 ? '+' : '');
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    const cards = document.querySelectorAll('.direction-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            let ticking = false;

            card.addEventListener('mousemove', e => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        const rotateX = ((y - centerY) / centerY) * -10;
                        const rotateY = ((x - centerX) / centerX) * 10;

                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }
});

// --- Dynamic Download Counting ---
document.addEventListener('DOMContentLoaded', async () => {
    const totalDownloadsEl = document.getElementById('total-downloads-stat');
    if (totalDownloadsEl && typeof PROGRAMS !== 'undefined') {
        let total = 0;

        const fetchPromises = PROGRAMS.map(async (p) => {
            const ghInfo = parseGithubReleaseUrl(p.link);
            if (ghInfo) {
                const cacheKey = `gh_release_v3_${ghInfo.owner}_${ghInfo.repo}_${ghInfo.filename}`;
                let cachedCount = null;
                try {
                    const cachedStr = localStorage.getItem(cacheKey);
                    if (cachedStr) {
                        const cached = JSON.parse(cachedStr);
                        if (cached.timestamp && (Date.now() - cached.timestamp < 3600000)) {
                            cachedCount = cached.count;
                        }
                    }
                } catch (e) {}

                if (cachedCount !== null) {
                    return p.download_count + cachedCount;
                }

                if (typeof fetchGithubReleaseInfo === 'function') {
                    const info = await fetchGithubReleaseInfo(ghInfo.owner, ghInfo.repo, ghInfo.filename);
                    if (info) {
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                count: info.count,
                                version: info.latestVersion,
                                changelog: info.changelog,
                                timestamp: Date.now()
                            }));
                        } catch (e) {}
                        return p.download_count + info.count;
                    }
                }
            }
            return p.download_count;
        });

        const results = await Promise.all(fetchPromises);
        total = results.reduce((sum, count) => sum + count, 0);

        totalDownloadsEl.setAttribute('data-target', total);
    }
});
