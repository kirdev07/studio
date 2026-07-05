// --- Toast Notifications ---
window.showToast = function (message, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300); // Wait for transition
  }, duration);
};

// --- Dynamic Download Counting ---
async function updateTotalDownloadsStat() {
  const totalDownloadsEl = document.getElementById('total-downloads-stat');
  if (!totalDownloadsEl || typeof PROGRAMS === 'undefined') return;

  const fetchPromises = PROGRAMS.map(async (program) => {
    const ghInfo = parseGithubReleaseUrl(program.link);
    if (!ghInfo) return program.download_count;

    const cacheKey = `gh_release_v3_${ghInfo.owner}_${ghInfo.repo}_${ghInfo.filename}`;
    let cachedCount = null;

    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        const cacheTtl = typeof RELEASE_CACHE_TTL !== 'undefined' ? RELEASE_CACHE_TTL : 5 * 60 * 1000;
        if (cached.timestamp && Date.now() - cached.timestamp < cacheTtl) {
          cachedCount = cached.count;
        }
      }
    } catch (error) {
      console.warn('Не удалось прочитать кэш скачиваний:', error);
    }

    if (cachedCount !== null) {
      return program.download_count + cachedCount;
    }

    if (typeof fetchGithubReleaseInfo === 'function') {
      const info = await fetchGithubReleaseInfo(ghInfo.owner, ghInfo.repo, ghInfo.filename, program.assetPattern);
      if (info) {
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              count: info.count,
              version: info.latestVersion,
              link: info.downloadLink || program.link,
              repoUrl: info.repoUrl,
              changelog: info.changelog,
              publishedAt: info.publishedAt,
              timestamp: Date.now()
            })
          );
        } catch (error) {
          console.warn('Не удалось сохранить кэш скачиваний:', error);
        }
        return program.download_count + info.count;
      }
    }

    return program.download_count;
  });

  const results = await Promise.all(fetchPromises);
  const total = results.reduce((sum, count) => sum + count, 0);

  totalDownloadsEl.setAttribute('data-target', total);
  totalDownloadsEl.classList.remove('skeleton');

  const speed = 100;
  const updateCount = () => {
    const target = +totalDownloadsEl.getAttribute('data-target');
    const count = +(totalDownloadsEl.innerText.replace('+', '')) || 0;
    const inc = target / speed;

    if (count < target) {
      totalDownloadsEl.innerText = Math.ceil(count + inc);
      setTimeout(updateCount, 15);
    } else {
      totalDownloadsEl.innerText = target + '+';
    }
  };

  updateCount();
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Active Nav Link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === './index.html' || href === 'index.html' || href === '/') {
      if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        link.classList.add('active');
      }
    } else if (href.includes('programs.html')) {
      if (currentPath.includes('programs.html') || currentPath.includes('program_detail.html')) {
        link.classList.add('active');
      }
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

    document.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const faqItem = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isActive = faqItem.classList.toggle('active');
      faqItem.classList.toggle('is-open', isActive);

      if (isActive) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

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
    '%c👋 Привет, разработчик!\n%cВижу, ты любишь заглядывать под капот.\nКирДев Студия — это хобби-проект, написанный с душой. Если есть идеи или просто хочешь пообщаться — заглядывай в наш Telegram!',
    'color: #00ffcc; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,204,0.5);',
    'color: #aaaaaa; font-size: 14px; margin-top: 10px;'
  );

  // --- Stats ---
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    counters.forEach((counter) => {
      const target = Number(counter.getAttribute('data-target')) || 0;
      counter.innerText = target + (target > 500 ? '+' : '');
    });
  }

  updateTotalDownloadsStat();
});
