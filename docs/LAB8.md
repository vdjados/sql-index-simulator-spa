# Лабораторная 8 — запуск (всё локально)

## 1. Бэкенд + Docker

```powershell
cd C:\Users\vladu\projects\sql-index-simulator
docker compose up -d
copy .env.example .env
go run .\cmd\main\main.go
```

API: `http://localhost:8082`, Swagger: `http://localhost:8082/swagger/index.html`

Узнайте IP ПК в LAN (для Tauri):

```powershell
ipconfig
# IPv4, например 192.168.0.105
```

---

## 2. Обычный фронтенд (dev + бэкенд)

```powershell
cd C:\Users\vladu\projects\sql-index-simulator-spa
npm install
npm run dev
```

Открыть: http://localhost:3000

**Redux DevTools:** расширение браузера → срез `catalogFilters` — фильтр каталога сохраняется при переходе на `/service/:id` и «Назад».

**Адаптив:** F12 → режим устройства; ширина &gt;992 / 641–992 / ≤640 px — в CSS `.cards-grid`: 3 / 2 / 1 колонка (`index_style.css`, строки 265–268, 580–598).

---

## 3. HTTPS (локально)

```powershell
npm run dev:https
```

Открыть: https://localhost:3000 (сертификат self-signed — принять в браузере).

---

## 4. GitHub Pages + mock (телефон / PWA)

1. В `.env.github` задайте `VITE_BASE_PATH=/ваш-репо/` (путь репозитория на GitHub).
2. Сборка:

```powershell
npm run build:gh-pages
npm run preview:gh-pages
```

3. На GitHub: Settings → Pages → Deploy from branch **или** залить содержимое `dist/` вручную.
4. На телефоне: открыть Pages URL → «Добавить на экран» (PWA).
5. Демо: ввести фильтр → карточка → «Назад» — значение фильтра в Redux сохранено.

`VITE_USE_MOCK=true` — только mock, без бэкенда.

---

## 5. Tauri (гость, LAN, не dev)

1. Отредактируйте `.env.tauri`:

```
VITE_API_BASE_URL=http://ВАШ_IP:8082/api
VITE_MEDIA_BASE_URL=http://ВАШ_IP:9000
```

2. Установите [Rust](https://rustup.rs/) и зависимости Tauri (Windows: WebView2).

3. Иконки (один раз):

```powershell
npm run tauri icon public/placeholder-index.png
```

4. Сборка и запуск **собранного** exe (не dev):

```powershell
npm run tauri:build
# exe: src-tauri\target\release\...
```

Для проверки с бэкендом по LAN — бэкенд слушает `0.0.0.0:8082` (если только localhost — добавьте bind в Go или прокси).

**Wireshark/tcpdump:** фильтр по IP ПК → найти соединения exe к порту **8082** (API).

**Правка в БД:** Adminer http://localhost:8081 → таблица `services` → изменить `name` → обновить каталог в Tauri.

---

## 6. Что показать на защите

| Требование | Где |
|------------|-----|
| Фильтр в Redux | `catalogFiltersSlice.ts`, DevTools |
| 3 колонки / 2 / 1 | `index_style.css` `.cards-grid` + подсказка на каталоге |
| PWA | установка с Pages, `vite-plugin-pwa` |
| Pages mock | баннер «Режим GitHub Pages» |
| Tauri + IP | `.env.tauri`, Network в exe |
| HTTPS | `npm run dev:https` |
