import axios from "axios";

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  // eslint-disable-next-line no-console
  console.warn(
    "Telegram bot token or chat ID is not set in environment variables."
  );
}

export async function sendTelegramResult(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to send Telegram message:", error);
  }
}
