# AI Chat — Backend

REST API на **Node.js** и **Express** для отправки сообщений в **OpenAI ChatGPT** и возврата ответа клиенту.

---

## Содержание

- [Стек](#стек)
- [Структура](#структура)
- [Установка](#установка)
- [Переменные окружения](#переменные-окружения)
- [Запуск](#запуск)
- [API](#api)
- [Обработка ошибок](#обработка-ошибок)
- [Проверка](#проверка)
- [Связь с frontend](#связь-с-frontend)

---

## Стек

- **Node.js** (ES modules)
- **Express** 5
- **OpenAI SDK** — модель `gpt-4o-mini`
- **dotenv** — конфигурация
- **cors** — запросы с frontend

---

## Структура

```
backend/
├── app.js           # точка входа, маршруты, OpenAI
├── package.json
├── .env             # секреты (не коммитить!)
├── .env.example     # шаблон
└── README.md
```

---

## Установка

```bash
cd backend
npm install
```

Скопируйте шаблон окружения:

```bash
cp .env.example .env
```

Заполните `OPENAI_API_KEY` в `.env`.

---

## Переменные окружения

| Переменная | Обязательно | По умолчанию | Описание |
|------------|-------------|--------------|----------|
| `OPENAI_API_KEY` | да | — | Ключ [OpenAI API](https://platform.openai.com/api-keys) |
| `PORT` | нет | `3000` | Порт сервера |
| `CORS_ORIGIN` | нет | — | Разрешённый origin (для CORS) |

Пример `.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-your-key-here
```

> Используйте **один** символ `=` в `OPENAI_API_KEY=...`, не `==`.

---

## Запуск

```bash
# разработка (автоперезапуск)
npm run dev

# production
npm start
```

Сервер: **http://localhost:3000**

---

## API

### `GET /health`

Проверка, что сервер работает.

**Ответ `200`:**

```json
{ "ok": true }
```

---

### `POST /api/chat`

Отправка текста в ChatGPT.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "message": "Привет!"
}
```

**Успех `200`:**

```json
{
  "reply": "Здравствуйте! Чем могу помочь?"
}
```

**Ошибки:**

| Код | Причина |
|-----|---------|
| `400` | Пустое или отсутствующее `message` |
| `401` | Неверный API-ключ OpenAI |
| `429` | Лимит запросов OpenAI |
| `502` | Пустой ответ от OpenAI |
| `503` | OpenAI недоступен |
| `404` | Неизвестный маршрут |
| `500` | Внутренняя ошибка сервера |

**Пример ошибки:**

```json
{
  "error": "Сообщение не может быть пустым"
}
```

---

## Обработка ошибок

- Валидация тела запроса (`message` — непустая строка)
- Маппинг ошибок OpenAI в понятные HTTP-ответы (`mapOpenAIError`)
- Логирование в консоль: `[api/chat]`, `[server]`
- Глобальный обработчик 404 и 500

---

## Проверка

**PowerShell:**

```powershell
curl.exe -X POST http://localhost:3000/api/chat `
  -H "Content-Type: application/json" `
  -d "{\"message\":\"Say hello\"}"
```

**Ожидаемый ответ:**

```json
{ "reply": "Hello!" }
```

**Health-check:**

```powershell
curl.exe http://localhost:3000/health
```

---

## Связь с frontend

Клиент (React) отправляет запросы на:

```
POST /api/chat
```

В режиме разработки Vite проксирует `/api` → `http://localhost:3000`.

Frontend-репозиторий должен быть запущен отдельно (`npm run dev` в папке `frontend`).

---

## Безопасность

- Не коммитьте `.env` в git
- API-ключ хранится только на сервере
- При утечке ключа — отзовите его в [OpenAI Dashboard](https://platform.openai.com/api-keys)
