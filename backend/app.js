import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^=+/, "");

if (!apiKey) {
  console.error("OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
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
