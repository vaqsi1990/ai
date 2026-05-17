# AI Chat

Monorepo: **React frontend** + **Express backend** + **OpenAI ChatGPT** + голосовой ввод (Web Speech API).

---

## Содержание

- [Возможности](#возможности)
- [Стек](#стек)
- [Структура](#структура)
- [Быстрый старт](#быстрый-старт)
- [Backend](#backend)
- [Frontend](#frontend)
- [API](#api)
- [Голосовой ввод](#голосовой-ввод)
- [Обработка ошибок](#обработка-ошибок)
- [Production](#production)
- [Безопасность](#безопасность)

---

## Возможности

- Текстовый чат с ChatGPT (`gpt-4o-mini`)
- История сообщений на экране
- Кнопка микрофона → речь в текст → отправка
- Индикатор загрузки и обработка ошибок (сеть, API, микрофон)

---

## Стек

| Часть | Папка | Технологии |
|-------|-------|------------|
| **Frontend** | `frontend/` | React 19, TypeScript, Vite, Tailwind CSS 4, Lucide |
| **Backend** | `backend/` | Node.js, Express 5, OpenAI SDK |
| **Голос** | `frontend/` | Web Speech API |

---

## Структура

```
ai/
├── frontend/                 # клиент (React)
│   └── src/
│       ├── api/              # sendChat
│       ├── components/       # форма, чат, микрофон
│       ├── hooks/            # useVoiceRecording
│       └── pages/
│
├── backend/                  # сервер (Express)
│   ├── app.js
│   ├── .env                  # секреты (не в git!)
│   └── .env.example
│
├── .gitignore
└── README.md                 # этот файл
```

---

## Быстрый старт

Нужны **два терминала**.

### 1. Backend

```bash
cd backend
npm install
```

Создайте `backend/.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-your-key-here
```

> Один символ `=` в `OPENAI_API_KEY`. Ключ: https://platform.openai.com/api-keys

```bash
npm run dev
```

→ http://localhost:3000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

→ http://localhost:5173

В dev-режиме Vite проксирует `/api` на backend.

---

## Backend

| | |
|---|---|
| **Вход** | `backend/app.js` |
| **Запуск** | `npm run dev` / `npm start` |
| **Порт** | `3000` (или `PORT` в `.env`) |

**Переменные окружения:**

| Переменная | Описание |
|------------|----------|
| `OPENAI_API_KEY` | Ключ OpenAI (обязательно) |
| `PORT` | Порт сервера |
| `CORS_ORIGIN` | Origin frontend для CORS |

**Проверка:**

```powershell
curl.exe http://localhost:3000/health
curl.exe -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hello\"}"
```

---

## Frontend

| | |
|---|---|
| **Вход** | `frontend/src/main.tsx` |
| **Запуск** | `npm run dev` |
| **Сборка** | `npm run build` |
| **Порт** | `5173` |

**Скрипты:**

```bash
npm run dev       # разработка
npm run build     # production-сборка → dist/
npm run preview   # просмотр сборки
```

**Структура `src/`:**

| Папка | Назначение |
|-------|------------|
| `api/` | HTTP-запросы, ошибки |
| `components/` | UI (форма, история чата) |
| `hooks/` | голосовой ввод |
| `pages/` | главная страница |

---

## API

Базовый URL в dev: `http://localhost:3000` (через прокси — `/api`).

### `GET /health`

```json
{ "ok": true }
```

### `POST /api/chat`

**Запрос:**

```json
{ "message": "Привет!" }
```

**Успех:**

```json
{ "reply": "Здравствуйте!" }
```

**Ошибка:**

```json
{ "error": "Описание ошибки" }
```

| Код | Причина |
|-----|---------|
| 400 | Пустое сообщение |
| 401 | Неверный API-ключ |
| 429 | Лимит OpenAI |
| 502 | Пустой ответ AI |
| 503 | OpenAI недоступен |

---

## Голосовой ввод

1. Нажмите **микрофон** в форме
2. Разрешите доступ к микрофону
3. Говорите — текст появится в поле
4. Нажмите микрофон снова (стоп)
5. **Отправить**

Работает в **Chrome** и **Edge**.

---

## Обработка ошибок

| Этап | Поведение |
|------|-----------|
| Frontend → backend | Сеть, таймаут 60 с, некорректный JSON |
| OpenAI | 401, 429, 503 → сообщение пользователю |
| Микрофон | Нет доступа, браузер не поддерживает |
| UI | `ErrorAlert`, `LoadingIndicator` |

---

## Production

1. `cd frontend && npm run build`
2. Разместить `frontend/dist` на хостинге
3. Запустить `backend` с `.env` на сервере
4. Настроить `VITE_API_BASE_URL` или reverse proxy на один домен

---

## Безопасность

- Не коммитьте `backend/.env`
- API-ключ только на backend
- В `.gitignore`: `node_modules/`, `dist/`, `.env`

---

## Git (один репозиторий)

Инициализация **только в корне** `ai/`:

```bash
cd ai
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

Не запускайте `git init` внутри `frontend/` или `backend/`.
