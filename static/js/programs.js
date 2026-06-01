// База данных программ KirDev Studio для клиентской части
const PROGRAMS = [
  {
    "id": 1,
    "name": "Pulse PC",
    "description": "Программа для удаленного управления вашим компьютером с помощью Telegram-бота.",
    "full_description": "Pulse PC — это программа для удаленного управления вашим компьютером с помощью Telegram-бота. Программа оснащена удобным графическим интерфейсом для настройки токена и безопасным фоновым режимом работы.",
    "features": [
      "Безопасность: Полный контроль через Telegram. Уведомления о разблокировке ПК и низком заряде батареи.",
      "Управление окнами: Сворачивание, разворачивание, закрытие окон (Alt+F4), а также скриншоты экрана.",
      "Работа с файлами: Загрузка файлов на ПК и скачивание файлов с ПК.",
      "Запуск программ: Возможность настроить список быстрых команд для запуска или закрытия нужных программ. Умный поиск и принудительное закрытие зависших процессов.",
      "Управление мультимедиа: Пауза/Воспроизведение, регулировка звука и переключение треков."
    ],
    "screenshots": [
      "static/images/Pulse_PC/main.png",
      "static/images/Pulse_PC/add_programs.png",
      "static/images/Pulse_PC/console.png",
      "static/images/Pulse_PC/token_admin.png",
      "static/images/Pulse_PC/tray.png"
    ],
    "version": "1.0.0",
    "link": "https://github.com/kirya07kz/Pulse-PC/releases/download/pc/Pulse.PC.Setup.exe",
    "cover_image": "static/images/Pulse_PC/main.png",
    "category": "ПК",
    "download_count": 0
  },
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
      "static/images/Kiro_Bot/main.jpg",
      "static/images/Kiro_Bot/2.jpg",
      "static/images/Kiro_Bot/3.jpg",
      "static/images/Kiro_Bot/4.jpg",
      "static/images/Kiro_Bot/5.jpg",
      "static/images/Kiro_Bot/6.jpg",
      "static/images/Kiro_Bot/7.jpg",
      "static/images/Kiro_Bot/8.jpg",
      "static/images/Kiro_Bot/9.jpg",
      "static/images/Kiro_Bot/10.jpg"
    ],
    "version": "2.0.0",
    "link": "https://github.com/kirya07kz/Kiro-BOT-VK-2.00/releases/download/v2.00/app-release.apk",
    "cover_image": "static/images/Kiro_Bot/main.jpg",
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

      return { count, latestVersion, downloadLink };
    }

    return { count, latestVersion: null, downloadLink: null };
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
    if (!ghInfo) return { count: program.download_count, version: program.version, link: program.link };

    const cacheKey = `gh_release_v2_${ghInfo.owner}_${ghInfo.repo}_${ghInfo.filename}`;

    // Check localStorage cache first
    try {
      const cachedDataStr = localStorage.getItem(cacheKey);
      if (cachedDataStr) {
        const cachedData = JSON.parse(cachedDataStr);
        // Add 1 hour expiration check
        if (cachedData.timestamp && (Date.now() - cachedData.timestamp < 3600000)) {
           return cachedData;
        }
      }
    } catch (e) {
      console.warn('SessionStorage cache read error:', e);
    }

    const info = await fetchGithubReleaseInfo(ghInfo.owner, ghInfo.repo, ghInfo.filename);
    if (info !== null) {
      const result = {
        count: info.count,
        version: info.latestVersion && info.latestVersion !== 'pc' ? info.latestVersion.replace(/^v/, '') : program.version,
        link: info.downloadLink || program.link,
        timestamp: Date.now()
      };

      // Save to localStorage cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch(e) {
        console.warn('SessionStorage cache write error:', e);
      }

      return result;
    }
    return { count: program.download_count, version: program.version, link: program.link };
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

        // Обновляем версию
        const versionBadge = card.querySelector('.version-badge');
        if (versionBadge) {
          versionBadge.textContent = 'v' + info.version;
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
      const info = await getInfo(program);

      if (detailCounter) {
        detailCounter.textContent = info.count;
      }

      // Обновляем версию в бейдже
      const versionBadge = detailContainer.querySelector('.version-badge');
      if (versionBadge) {
        versionBadge.textContent = 'Версия ' + info.version;
      }

      // Обновляем ссылку на скачивание
      const downloadBtn = detailContainer.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.href = info.link;
      }
    }
  }
}
