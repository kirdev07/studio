// База данных программ KirDev Studio для клиентской части
const PROGRAMS = [
  {
    "id": 2,
    "name": "Kiro Bot",
    "description": "Профессиональный автономный чат-бот для ВКонтакте на Android.",
    "full_description": "Kiro Bot — это мощное решение для автоматизации общения в сообществах и профилях ВК. Благодаря продвинутому движку BotBrain 2.0, бот умеет не просто отвечать на вопросы, но и понимать контекст, работать с вложениями и обеспечивать безопасность вашего чата.",
    "features": [
      "🧠 Интеллектуальный поиск (BotBrain v2.1.8): 6 уровней приоритета, Regex-выражения, Fuzzy Search (опечатки), точные совпадения, контекст и динамические переменные.",
      "👥 Мультиаккаунтность: Одновременное управление до 5 ботами (как в сообществах ВК, так и в личных профилях).",
      "📎 Вложения: Поддержка голосовых сообщений, фото, видео, документов и граффити с сценариями ответов.",
      "🛡️ Защита: Встроенный черный список пользователей для предотвращения спама и троллинга.",
      "⚙️ Управление: Удобный редактор правил, живой лог событий с подсветкой, детальная статистика и дизайн Material 3 с темной темой."
    ],
    "screenshots": [
      "./static/images/Kiro_Bot/main.jpg",
      "./static/images/Kiro_Bot/2.jpg",
      "./static/images/Kiro_Bot/3.jpg",
      "./static/images/Kiro_Bot/4.jpg",
      "./static/images/Kiro_Bot/5.jpg",
      "./static/images/Kiro_Bot/6.jpg",
      "./static/images/Kiro_Bot/7.jpg",
      "./static/images/Kiro_Bot/8.jpg",
      "./static/images/Kiro_Bot/9.jpg",
      "./static/images/Kiro_Bot/10.jpg"
    ],
    "version": "2.0.0",
    "link": "https://github.com/kirdev07/Kiro-BOT-VK-2.00/releases/download/v2.00/app-release.apk",
    "cover_image": "./static/images/Kiro_Bot/main.jpg",
    "category": "Android",
    "download_count": 0
  }
];

// Функция для парсинга ссылки на GitHub Release
function parseGithubReleaseUrl(url) {
  if (!url || !url.includes('github.com') || !url.includes('/releases/')) return null;
  try {
    const cleanUrl = url.replace('https://github.com/', '');
    const parts = cleanUrl.split('/');
    const owner = parts[0];
    const repo = parts[1];
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return { owner, repo, filename };
  } catch (e) {
    return null;
  }
}

// Функция для получения информации о релизах (счетчик скачиваний, последняя версия и ссылка)
async function fetchGithubReleaseInfo(owner, repo, filename) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
    if (!response.ok) return null;
    const releases = await response.json();
    let count = 0;

    // Подсчет общего количества скачиваний
    releases.forEach(release => {
      if (release.assets) {
        release.assets.forEach(asset => {
          if (asset.name === filename) {
            count += asset.download_count;
          }
        });
      }
    });

    // Получение информации о последнем релизе
    if (releases.length > 0) {
      const latestRelease = releases[0];
      let latestVersion = latestRelease.tag_name;
      // Убираем 'v' если есть в начале
      if (latestVersion && latestVersion.startsWith('v')) {
        latestVersion = latestVersion.substring(1);
      } else if (latestVersion === 'pc') {
        // Хардкод для Pulse PC где тег 'pc'
        latestVersion = '1.0.0';
      }

      let downloadLink = null;
      if (latestRelease.assets && latestRelease.assets.length > 0) {
        const asset = latestRelease.assets.find(a => a.name === filename);
        if (asset) {
          downloadLink = asset.browser_download_url;
        }
      }

      const repoUrl = `https://github.com/${owner}/${repo}`;
      const changelog = latestRelease.body || '';
      return { count, latestVersion, downloadLink, repoUrl, changelog, publishedAt: latestRelease.published_at };
    }

    return { count, latestVersion: null, downloadLink: null, repoUrl: null, changelog: null, publishedAt: null };
  } catch (e) {
    console.error('Ошибка получения статистики с GitHub API:', e);
    return null;
  }
}

// Функция обновления счетчиков и ссылок на странице
async function updateDownloadCounters() {
  const catalogCards = document.querySelectorAll('.program-card');
  const detailContainer = document.getElementById('detail-container');
  const cache = {};

  const getInfo = async (program) => {
    const ghInfo = parseGithubReleaseUrl(program.link);
    if (!ghInfo) return { count: program.download_count, version: program.version, link: program.link, repoUrl: null, changelog: null };

    const cacheKey = `gh_release_v3_${ghInfo.owner}_${ghInfo.repo}_${ghInfo.filename}`;

    // Check localStorage cache first
    try {
      const cachedDataStr = localStorage.getItem(cacheKey);
      if (cachedDataStr) {
        const cachedData = JSON.parse(cachedDataStr);
        // Add 1 hour expiration check
        if (cachedData.timestamp && (Date.now() - cachedData.timestamp < 3600000)) {
           program.dynamic_count = cachedData.count + program.download_count;
           return cachedData;
        }
      }
    } catch (e) {
      console.warn('LocalStorage cache read error:', e);
    }

    const info = await fetchGithubReleaseInfo(ghInfo.owner, ghInfo.repo, ghInfo.filename);
    if (info !== null) {
      program.dynamic_count = info.count + program.download_count;
      const result = {
        count: info.count,
        version: info.latestVersion && info.latestVersion !== 'pc' ? info.latestVersion.replace(/^v/, '') : program.version,
        link: info.downloadLink || program.link,
        repoUrl: info.repoUrl,
        changelog: info.changelog,
        publishedAt: info.publishedAt,
        timestamp: Date.now()
      };

      // Save to localStorage cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch(e) {
        console.warn('LocalStorage cache write error:', e);
      }

      return result;
    }
    return { count: program.download_count, version: program.version, link: program.link, repoUrl: null, changelog: null };
  };

  // Обновляем информацию в каталоге (programs.html)
  if (catalogCards.length > 0) {
    for (const card of catalogCards) {
      const counterEl = card.querySelector('.download-counter');
      if (!counterEl) continue;

      const programId = parseInt(counterEl.getAttribute('data-program-id'));
      const program = PROGRAMS.find(p => p.id === programId);
      if (program) {
        const info = await getInfo(program);
        counterEl.textContent = info.count;

        counterEl.classList.remove('skeleton');


        // Status Tags Logic
        const tagsContainer = card.querySelector('.status-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            if (info.count > 200) {
                tagsContainer.innerHTML += `<span class="badge" style="background: rgba(255, 65, 54, 0.2); color: #ff4136; border: 1px solid rgba(255, 65, 54, 0.3); ">Популярное</span>`;
            }

            // Check if release is within the last 14 days
            let isNew = false;
            if (info.publishedAt) {
                const publishDate = new Date(info.publishedAt);
                const now = new Date();
                const diffTime = Math.abs(now - publishDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 14) {
                    isNew = true;
                }
            } else {
                // Fallback: Find the maximum ID to dynamically mark the latest program
                const maxId = Math.max(...PROGRAMS.map(p => p.id));
                if (program.id === maxId) {
                    isNew = true;
                }
            }

            if (isNew) {
                tagsContainer.innerHTML += `<span class="badge" style="background: rgba(255, 255, 255, 0.1); color: var(--text-primary); border: 1px solid rgba(255, 255, 255, 0.2); ">Новинка</span>`;
            }
        }

        // Обновляем версию
        const versionBadge = card.querySelector('.version-badge');
        if (versionBadge) {
          versionBadge.textContent = 'v' + info.version;
          versionBadge.classList.remove('skeleton');
        }

      }
    }
  }

  // Обновляем информацию на странице деталей (program_detail.html)
  if (detailContainer) {
    const detailCounter = document.getElementById('detail-download-counter');
    const urlParams = new URLSearchParams(window.location.search);
    const programId = parseInt(urlParams.get('id'));
    const program = PROGRAMS.find(p => p.id === programId);

    if (program) {
      document.title = `${program.name} - KirDev Studio`;

      // Update Open Graph tags for better social sharing
      const ogTitle = document.getElementById('og-title');
      const ogDesc = document.getElementById('og-desc');
      const ogImg = document.getElementById('og-img');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');

      if (ogTitle) ogTitle.content = `${program.name} - KirDev Studio`;
      if (ogDesc) ogDesc.content = program.description;
      if (ogImg && program.cover_image) {
          ogImg.content = new URL(program.cover_image, window.location.href).href;
      }
      if (twitterTitle) twitterTitle.content = `${program.name} - KirDev Studio`;
      if (twitterDesc) twitterDesc.content = program.description;

      const info = await getInfo(program);


      if (detailCounter) {
        detailCounter.textContent = info.count;
        detailCounter.classList.remove('skeleton');
      }

      // Обновляем версию в бейдже
      const versionBadge = detailContainer.querySelector('.version-badge');
      if (versionBadge) {
        versionBadge.textContent = 'Версия ' + info.version;
        versionBadge.classList.remove('skeleton');
      }


      // Обновляем ссылку на скачивание
      const downloadBtn = detailContainer.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.href = info.link;
      }

      // Кнопка исходного кода (GitHub)
      let finalRepoUrl = info.repoUrl;
      if (!finalRepoUrl && program.link && program.link.includes('github.com')) {
        const ghInfoLocal = parseGithubReleaseUrl(program.link);
        if (ghInfoLocal) {
          finalRepoUrl = `https://github.com/${ghInfoLocal.owner}/${ghInfoLocal.repo}`;
        }
      }

      if (finalRepoUrl) {
        const repoBtn = detailContainer.querySelector('.repo-btn');
        if (repoBtn) {
          repoBtn.href = finalRepoUrl;
          repoBtn.style.display = 'inline-flex';
        }
      }

      // Журнал изменений (Changelog)
      if (info.changelog) {
        const changelogSection = detailContainer.querySelector('.changelog-section');
        const changelogContent = detailContainer.querySelector('.changelog-content');
        if (changelogSection && changelogContent) {
           // Parse basic markdown from GitHub releases (very basic: handle lists and links if needed, but innerText is safer)
           changelogContent.textContent = info.changelog;
           changelogSection.style.display = 'block';
        }
      }
    }
  }
}

// Рендеринг последнего релиза на главной странице
function renderLatestRelease() {
  const container = document.getElementById('dynamic-latest-release');
  if (!container) return;

  const sortedPrograms = [...PROGRAMS].sort((a, b) => b.id - a.id);
  const topPrograms = sortedPrograms.slice(0, 2);

  if (topPrograms.length > 0) {
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px;">';
    
    topPrograms.forEach((program, index) => {
        const badgeText = index === 0 ? 'Новый релиз' : 'Прошлый релиз';
        html += `
          <a href="pages/program_detail.html?id=${program.id}" class="minimal-release-card" style="max-width: 100%;">
              <img src="${program.cover_image}" alt="Обложка ${program.name}" class="minimal-image">
              <div class="minimal-content">
                  <span class="minimal-badge">${badgeText}</span>
                  <h3 class="minimal-title">${program.name}</h3>
                  <p class="minimal-desc">${program.description}</p>
              </div>
              <div class="minimal-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
          </a>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }
}

// Запускаем рендер при загрузке скрипта
renderLatestRelease();
