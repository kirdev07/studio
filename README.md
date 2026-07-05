# KirDev Studio

Официальный статический сайт KirDev Studio: каталог разработок, страницы программ, ссылки на релизы и скриншоты.

Сайт сделан без тяжёлого фреймворка: HTML, CSS и JavaScript. Подходит для GitHub Pages.

## Структура проекта

```text
.
├── index.html
├── pages/
│   ├── programs.html
│   ├── program_detail.html
│   └── 404.html
├── static/
│   ├── css/
│   │   ├── main.css
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── utilities.css
│   ├── data/
│   │   └── programs.json
│   ├── images/
│   ├── js/
│   │   ├── main.js
│   │   ├── programs.js
│   │   ├── catalog.js
│   │   └── program-detail.js
│   └── style.css
├── scripts/
│   └── validate-site.mjs
├── robots.txt
├── sitemap.xml
└── package.json
```

`static/style.css` пока оставлен как legacy-слой, чтобы не сломать внешний вид сайта. Новые стили нужно добавлять в файлы из `static/css/`.

## Как добавить новую программу

Добавь новый объект в `static/data/programs.json`:

```json
{
  "id": 3,
  "name": "Название программы",
  "description": "Короткое описание.",
  "full_description": "Полное описание программы.",
  "features": ["Возможность 1", "Возможность 2"],
  "screenshots": ["./static/images/project/main.jpg"],
  "version": "1.0.0",
  "link": "https://github.com/user/repo/releases/download/v1.0.0/app.apk",
  "assetPattern": ".apk",
  "cover_image": "./static/images/project/main.jpg",
  "category": "Android",
  "download_count": 0
}
```

Правила:

- `id` должен быть уникальным.
- `features` должен быть непустым массивом.
- `screenshots` должен быть массивом, даже если он пустой.
- Для GitHub Releases лучше указывать прямую ссылку на файл релиза.

## Команды

```bash
npm install
npm run lint
npm test
npm run check
npm run format
```

Что делают команды:

- `npm run lint` — проверяет JavaScript.
- `npm test` — проверяет структуру сайта, локальные ассеты и данные программ.
- `npm run check` — запускает lint и тест.
- `npm run format` — форматирует HTML/CSS/JS/JSON/MD через Prettier.

## Автоматические проверки

GitHub Actions запускает `npm run check` при `push` и `pull_request` в ветку `main`.

Тест `scripts/validate-site.mjs` проверяет:

- наличие ключевых HTML/CSS/JS-файлов;
- наличие `robots.txt` и `sitemap.xml`;
- наличие CSS-слоёв;
- наличие и валидность `static/data/programs.json`;
- отсутствие inline-скриптов и inline-обработчиков событий в HTML;
- существование локальных файлов, подключённых через `href` и `src`.

## Лицензия

Данный проект, включая исходный код сайта, скрипты, разметку, стили и дизайн, является интеллектуальной собственностью автора.

Запрещено копировать, использовать, распространять или модифицировать материалы репозитория без прямого письменного разрешения автора.

© 2026 KirDev Studio. Все права защищены.
