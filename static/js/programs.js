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
    "download_count": 218
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
    "download_count": 315
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

// Функция для получения реального счетчика скачиваний с GitHub API
async function fetchGithubDownloadCount(owner, repo, filename) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
    if (!response.ok) return null;
    const releases = await response.json();
    let count = 0;
    releases.forEach(release => {
      if (release.assets) {
        release.assets.forEach(asset => {
          if (asset.name === filename) {
            count += asset.download_count;
          }
        });
      }
    });
    return count;
  } catch (e) {
    console.error('Ошибка получения статистики с GitHub API:', e);
    return null;
  }
}

// Функция обновления счетчиков на странице
async function updateDownloadCounters() {
  const catalogCounters = document.querySelectorAll('.download-counter');
  const detailCounter = document.getElementById('detail-download-counter');
  const cache = {};

  const getCount = async (program) => {
    const ghInfo = parseGithubReleaseUrl(program.link);
    if (!ghInfo) return program.download_count;

    const cacheKey = `${ghInfo.owner}/${ghInfo.repo}/${ghInfo.filename}`;
    if (cache[cacheKey] !== undefined) return cache[cacheKey];

    const count = await fetchGithubDownloadCount(ghInfo.owner, ghInfo.repo, ghInfo.filename);
    if (count !== null) {
      cache[cacheKey] = count;
      return count;
    }
    return program.download_count;
  };

  // Обновляем счетчики в каталоге
  for (const counterEl of catalogCounters) {
    const programId = parseInt(counterEl.getAttribute('data-program-id'));
    const program = PROGRAMS.find(p => p.id === programId);
    if (program) {
      const realCount = await getCount(program);
      counterEl.textContent = realCount;
    }
  }

  // Обновляем счетчик на странице деталей
  if (detailCounter) {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = parseInt(urlParams.get('id'));
    const program = PROGRAMS.find(p => p.id === programId);
    if (program) {
      const realCount = await getCount(program);
      detailCounter.textContent = realCount;
    }
  }
}
