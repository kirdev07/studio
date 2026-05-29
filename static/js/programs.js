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
  },
  {
    "id": 3,
    "name": "Mobile Manager",
    "description": "Удобное приложение-компаньон для смартфонов для синхронизации с ПК.",
    "full_description": "Mobile Manager объединяет ваш ПК и смартфон в единую экосистему. Передавайте файлы по зашифрованному Wi-Fi каналу, получайте уведомления прямо на экран монитора и управляйте музыкой удаленно. Никакие данные не проходят через облако — только прямое P2P соединение.",
    "features": [
      "Зашифрованная передача файлов без интернета.",
      "Трансляция уведомлений с телефона на ПК.",
      "Поддержка Android и iOS.",
      "Полная анонимность и безопасность соединения."
    ],
    "screenshots": ["static/screenshots/manager_1.jpg", "static/screenshots/manager_2.jpg", "static/screenshots/manager_3.jpg"],
    "version": "1.0.0-beta",
    "link": "mobile_manager.zip",
    "cover_image": "static/covers/manager_cover.jpg",
    "category": "Android",
    "download_count": 57
  }
];
