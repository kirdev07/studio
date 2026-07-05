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
    "assetPattern": ".apk",
    "cover_image": "./static/images/Kiro_Bot/main.jpg",
    "category": "Android",
    "download_count": 0
  }
];

const RELEASE_CACHE_TTL = 5 * 60 * 1000;
const releaseRequestCache = new Map();
let updateCountersPromise = null;

function parseGithubReleaseUrl(url) {
  if (!url || !url.includes('github.com') || !url.includes('/releases/')) return null;
  try {
    const cleanUrl = url.replace('https://github.com/', '');
    const parts = cleanUrl.split('/');
    return {
      owner: parts[0],
      repo: parts[1],
      filename: url.substring(url.lastIndexOf('/') + 1)
    };
  } catch (e) {
    return null;
  }
}

function getReleaseCacheKey(owner, repo, filename) {
  return `gh_release_v3_${owner}_${repo}_${filename}`;
}

function readReleaseCache(cacheKey) {
  try {
    const cachedDataStr = localStorage.getItem(cacheKey);
    if (!cachedDataStr) return null;

    const cachedData = JSON.parse(cachedDataStr);
    if (cachedData.timestamp && cachedData.link && Date.now() - cachedData.timestamp < RELEASE_CACHE_TTL) {
      return cachedData;
    }
  } catch (e) {
    console.warn('LocalStorage cache read error:', e);
  }

  return null;
}

function writeReleaseCache(cacheKey, data) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage cache write error:', e);
  }
}

async function fetchGithubReleaseInfo(owner, repo, filename, assetPattern = null) {
  const requestKey = `${owner}/${repo}/${filename}/${assetPattern || ''}`;
  if (releaseRequestCache.has(requestKey)) {
    return releaseRequestCache.get(requestKey);
  }

  const request = (async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
      if (!response.ok) return null;

      const releases = await response.json();
      let count = 0;

      releases.forEach((release) => {
        if (!release.assets) return;

        const exactAsset = release.assets.find((asset) => asset.name === filename);
        const patternAsset = assetPattern
          ? release.assets.find((asset) => asset.name.toLowerCase().endsWith(assetPattern.toLowerCase()))
          : null;
        const assetsToCount = exactAsset ? [exactAsset] : (patternAsset ? [patternAsset] : release.assets);

        assetsToCount.forEach((asset) => {
          count += asset.download_count || 0;
        });
      });

      if (releases.length === 0) {
        return { count, latestVersion: null, downloadLink: null, repoUrl: null, changelog: null, publishedAt: null };
      }

      const latestRelease = releases[0];
      let latestVersion = latestRelease.tag_name;
      if (latestVersion && latestVersion.startsWith('v')) {
        latestVersion = latestVersion.substring(1);
      } else if (latestVersion === 'pc') {
        latestVersion = '1.0.0';
      }

      let downloadLink = null;
      if (latestRelease.assets && latestRelease.assets.length > 0) {
        const asset = latestRelease.assets.find((item) => item.name === filename)
          || (assetPattern ? latestRelease.assets.find((item) => item.name.toLowerCase().endsWith(assetPattern.toLowerCase())) : null)
          || latestRelease.assets[0];
        if (asset) downloadLink = asset.browser_download_url;
      }

      return {
        count,
        latestVersion,
        downloadLink,
        repoUrl: `https://github.com/${owner}/${repo}`,
        changelog: latestRelease.body || '',
        publishedAt: latestRelease.published_at
      };
    } catch (e) {
      console.error('Ошибка получения статистики с GitHub API:', e);
      return null;
    } finally {
      releaseRequestCache.delete(requestKey);
    }
  })();

  releaseRequestCache.set(requestKey, request);
  return request;
}

async function getProgramReleaseInfo(program) {
  const ghInfo = parseGithubReleaseUrl(program.link);
  if (!ghInfo) {
    return { count: program.download_count, version: program.version, link: program.link, repoUrl: null, changelog: null, publishedAt: null };
  }

  const cacheKey = getReleaseCacheKey(ghInfo.owner, ghInfo.repo, ghInfo.filename);
  const cachedData = readReleaseCache(cacheKey);
  if (cachedData) {
    program.dynamic_count = cachedData.count + program.download_count;
    return cachedData;
  }

  const info = await fetchGithubReleaseInfo(ghInfo.owner, ghInfo.repo, ghInfo.filename, program.assetPattern);
  if (!info) {
    return { count: program.download_count, version: program.version, link: program.link, repoUrl: null, changelog: null, publishedAt: null };
  }

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

  writeReleaseCache(cacheKey, result);
  return result;
}

function updateStatusTags(card, program, info) {
  const tagsContainer = card.querySelector('.status-tags');
  if (!tagsContainer) return;

  tagsContainer.textContent = '';

  if (info.count > 200) {
    tagsContainer.insertAdjacentHTML('beforeend', '<span class="badge badge-popular">Популярное</span>');
  }

  let isNew = false;
  if (info.publishedAt) {
    const diffTime = Math.abs(new Date() - new Date(info.publishedAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isNew = diffDays <= 14;
  } else {
    const maxId = Math.max(...PROGRAMS.map((item) => item.id));
    isNew = program.id === maxId;
  }

  if (isNew) {
    tagsContainer.insertAdjacentHTML('beforeend', '<span class="badge badge-new">Новинка</span>');
  }
}

function updateDetailElements(detailContainer, program, info) {
  const detailCounter = document.getElementById('detail-download-counter');
  if (detailCounter) {
    detailCounter.textContent = info.count;
    detailCounter.classList.remove('skeleton');
  }

  const versionBadge = detailContainer.querySelector('.version-badge');
  if (versionBadge) {
    versionBadge.textContent = 'Версия ' + info.version;
    versionBadge.classList.remove('skeleton');
  }

  const downloadBtn = detailContainer.querySelector('.download-btn');
  if (downloadBtn) {
    downloadBtn.href = info.link;
    downloadBtn.removeAttribute('download');
    if (info.link.startsWith('http://') || info.link.startsWith('https://')) {
      downloadBtn.target = '_blank';
      downloadBtn.rel = 'noopener noreferrer';
    } else {
      downloadBtn.removeAttribute('target');
      downloadBtn.removeAttribute('rel');
      downloadBtn.setAttribute('download', '');
    }
  }

  let finalRepoUrl = info.repoUrl;
  if (!finalRepoUrl && program.link && program.link.includes('github.com')) {
    const ghInfoLocal = parseGithubReleaseUrl(program.link);
    if (ghInfoLocal) finalRepoUrl = `https://github.com/${ghInfoLocal.owner}/${ghInfoLocal.repo}`;
  }

  const repoBtn = detailContainer.querySelector('.repo-btn');
  if (repoBtn && finalRepoUrl) {
    repoBtn.href = finalRepoUrl;
    repoBtn.classList.add('is-visible');
  }

  const changelogSection = detailContainer.querySelector('.changelog-section');
  const changelogContent = detailContainer.querySelector('.changelog-content');
  if (info.changelog && changelogSection && changelogContent) {
    changelogContent.textContent = info.changelog;
    changelogSection.classList.add('is-visible');
  }
}

async function runDownloadCountersUpdate() {
  const catalogCards = document.querySelectorAll('.program-card');
  const detailContainer = document.getElementById('detail-container');

  if (catalogCards.length > 0) {
    for (const card of catalogCards) {
      const counterEl = card.querySelector('.download-counter');
      if (!counterEl) continue;

      const programId = parseInt(counterEl.getAttribute('data-program-id'), 10);
      const program = PROGRAMS.find((item) => item.id === programId);
      if (!program) continue;

      const info = await getProgramReleaseInfo(program);
      counterEl.textContent = info.count;
      counterEl.classList.remove('skeleton');
      updateStatusTags(card, program, info);

      const versionBadge = card.querySelector('.version-badge');
      if (versionBadge) {
        versionBadge.textContent = 'v' + info.version;
        versionBadge.classList.remove('skeleton');
      }
    }
  }

  if (detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = parseInt(urlParams.get('id'), 10);
    const program = PROGRAMS.find((item) => item.id === programId);
    if (program) {
      const info = await getProgramReleaseInfo(program);
      updateDetailElements(detailContainer, program, info);
    }
  }
}

function updateDownloadCounters() {
  if (updateCountersPromise) return updateCountersPromise;

  updateCountersPromise = runDownloadCountersUpdate().finally(() => {
    updateCountersPromise = null;
  });

  return updateCountersPromise;
}

function renderLatestRelease() {
  const container = document.getElementById('dynamic-latest-release');
  if (!container) return;

  const sortedPrograms = [...PROGRAMS].sort((a, b) => b.id - a.id);
  const topPrograms = sortedPrograms.slice(0, 2);

  if (topPrograms.length > 0) {
    let html = '<div class="latest-release-grid">';

    topPrograms.forEach((program, index) => {
      const badgeText = index === 0 ? 'Новый релиз' : 'Прошлый релиз';
      html += `
        <a href="pages/program_detail.html?id=${program.id}" class="minimal-release-card minimal-release-card-full">
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

renderLatestRelease();
