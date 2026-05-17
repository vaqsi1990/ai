import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN?.trim();

app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin }
      : undefined,
  ),
);
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^=+/, "");

if (!apiKey) {
  console.error("OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const MAX_HISTORY_MESSAGES = 20;

function mapOpenAIError(error) {
  const status = error?.status ?? 500;

  const messages = {
    400: "Некорректный запрос к OpenAI",
    401: "Неверный API-ключ OpenAI. Проверьте OPENAI_API_KEY в .env",
    403: "Доступ к OpenAI API запрещён",
    404: "Модель не найдена",
    429: "Превышен лимит запросов OpenAI. Попробуйте позже",
    500: "Внутренняя ошибка OpenAI",
    503: "OpenAI временно недоступен",
  };

  const errorMessage =
    messages[status] ??
    error?.message ??
    "Не удалось получить ответ от OpenAI";

  return { status, error: errorMessage };
}

function normalizeHistory(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim(),
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .slice(-MAX_HISTORY_MESSAGES);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({
        error: "Сообщение не может быть пустым",
      });
    }

    const history = normalizeHistory(req.body?.messages);
    const openAiMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant. Answer clearly and concisely. Match the user's language when possible.",
      },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openAiMessages,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "OpenAI вернул пустой ответ",
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("[api/chat]", error);

    const { status, error: errorMessage } = mapOpenAIError(error);
    res.status(status).json({ error: errorMessage });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

app.use((err, _req, res, _next) => {
  console.error("[server]", err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
