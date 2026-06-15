// ============================================================
// Безопасная отправка заявки в Telegram (серверная функция)
// ============================================================
// Используется, если в script.js включить USE_SERVER_ENDPOINT = true.
// Тогда токен бота НЕ виден в коде сайта, а хранится в переменных
// окружения хостинга (Vercel / Netlify).
//
// Подходит для Vercel (папка /api) и Netlify (с настройкой redirect,
// см. netlify.toml).
//
// В настройках проекта на хостинге добавьте переменные окружения:
//   TELEGRAM_BOT_TOKEN = токен от @BotFather
//   TELEGRAM_CHAT_ID   = ID чата/группы менеджера
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Telegram credentials not set" });
  }

  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "Empty message" });

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      }
    );

    if (!tgRes.ok) throw new Error("Telegram request failed");
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Failed to send" });
  }
}
