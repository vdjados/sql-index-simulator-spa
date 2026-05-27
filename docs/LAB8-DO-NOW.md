# Лаб 8 — делай по шагам (конкретные действия)

## Сейчас (5 минут) — автоматически

В PowerShell:

```powershell
cd C:\Users\vladu\projects\sql-index-simulator-spa
.\scripts\lab8-run.ps1 -GitHubRepoName ИМЯ-ТВОЕГО-РЕПО-НА-GITHUB
```

Замени `ИМЯ-ТВОЕГО-РЕПО-НА-GITHUB` на папку репозитория (например `sql-index-simulator-spa`).

Скрипт: пропишет `.env.github`, IP в `.env.tauri`, соберёт `dist/` для Pages.

---

## Терминал A — бэкенд (держать открытым)

```powershell
cd C:\Users\vladu\projects\sql-index-simulator
docker compose up -d
go run .\cmd\main\main.go
```

Проверка: открыть http://localhost:8082/swagger/index.html

---

## Терминал B — веб для защиты

```powershell
cd C:\Users\vladu\projects\sql-index-simulator-spa
npm run dev
```

Открыть http://localhost:3000

| # | Действие мышкой | Что сказать |
|---|-----------------|-------------|
| 1 | В поиске ввести `gin` | Фильтр в Redux `catalogFilters` |
| 2 | F12 → Redux DevTools → state → `catalogFilters.nameQuery` | Вот store |
| 3 | Клик по карточке → «Назад» | Фильтр сохранился |
| 4 | F12 → режим телефона, ширина 1200 → 700 → 400 | 3 → 2 → 1 колонка |
| 5 | Открыть `src/styles/index_style.css` строки 265–268, 580–598 | Конкретные breakpoint |

HTTPS (отдельно):

```powershell
npm run dev:https
```

→ https://localhost:3000 → «Дополнительно» → перейти.

---

## GitHub Pages + PWA на телефоне

### Если репозиторий уже на GitHub

1. `git add .` → `git commit` → `git push`
2. GitHub → репозиторий → **Settings** → **Pages** → Source: **GitHub Actions**
3. Подождать зелёную галочку workflow **Deploy GitHub Pages**
4. Открыть URL: `https://ВАШ_ЛОГИН.github.io/ИМЯ-РЕПО/`
5. На телефоне тот же URL → меню → **Установить приложение** / **На экран «Домой»**

### Если GitHub ещё нет — только проверка локально

```powershell
cd C:\Users\vladu\projects\sql-index-simulator-spa
npm run preview:gh-pages
```

Открыть адрес из консоли. На телефоне PWA с localhost не получится — нужен именно Pages URL.

На Pages: баннер **«Режим GitHub Pages: mock-данные»**.

---

## Tauri (собранный exe, не dev)

```powershell
cd C:\Users\vladu\projects\sql-index-simulator-spa
.\scripts\lab8-set-tauri-ip.ps1
npm run tauri icon public/placeholder-index.png
npm run tauri:build
```

Запустить exe:

`src-tauri\target\release\sql-index-simulator-guest.exe`  
(точное имя смотри в папке `release`).

| # | Действие |
|---|----------|
| 1 | `ipconfig` — записать IPv4 |
| 2 | Открыть `.env.tauri` — сравнить IP с `VITE_API_BASE_URL` |
| 3 | Бэкенд запущен на этом ПК |
| 4 | В Tauri открыть каталог — в Network (если есть) или Fiddler — запросы на `http://IP:8082/api/...` |
| 5 | Adminer http://localhost:8081 → БД `mydb` → таблица `services` → изменить `name` → F5 в Tauri |

Wireshark: фильтр `tcp.port == 8082`.

---

## Порядок на защите (как в ТЗ)

1. Телефон: Pages + PWA + mock  
2. PWA: фильтр → подробнее → назад  
3. ПК: адаптив + код CSS  
4. ПК: `npm run dev` + бэкенд (не mock)  
5. Tauri exe + LAN IP  
6. Wireshark :8082  
7. Правка БД → Tauri  
8. `npm run dev:https`  

---

## Диаграммы в отчёт (сделать в draw.io)

- Deployment (Pages, Tauri, API, PostgreSQL, MinIO, Redis)  
- Состояния заявки: draft → formed → completed/rejected  
- Прецеденты: гость / пользователь / модератор  
