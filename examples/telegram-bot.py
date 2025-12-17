#!/usr/bin/env python3
"""
Пример Telegram бота для запуска Web App "Карта канала"

Требования:
  pip install python-telegram-bot==20.7

Настройка:
  1. Создайте бота в @BotFather
  2. Получите токен
  3. Задеплойте ваше Next.js приложение
  4. Замените TOKEN и WEB_APP_URL ниже
  5. Запустите: python telegram-bot.py
"""

import logging
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# ========== НАСТРОЙКИ ==========
TOKEN = "YOUR_BOT_TOKEN_HERE"  # Токен от @BotFather
WEB_APP_URL = "https://your-app-url.vercel.app"  # URL вашего приложения
# ===============================

# Логирование
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /start - отправляет приветствие и кнопку с Web App"""
    
    keyboard = [
        [InlineKeyboardButton(
            "🗺️ Открыть карту канала",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )],
        [InlineKeyboardButton(
            "ℹ️ О боте",
            callback_data="about"
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = (
        "👋 Добро пожаловать!\n\n"
        "Это карта нашего канала - удобный способ найти нужные материалы.\n\n"
        "📂 Разделы по темам\n"
        "🔍 Быстрый поиск\n"
        "⭐ Избранное\n"
        "🕐 История просмотров\n\n"
        "Нажмите кнопку ниже, чтобы начать:"
    )
    
    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /help - справка"""
    
    help_text = (
        "📖 Справка по боту\n\n"
        "Команды:\n"
        "/start - Открыть карту канала\n"
        "/help - Эта справка\n"
        "/map - Открыть карту канала\n\n"
        "Возможности:\n"
        "• Просмотр материалов по разделам\n"
        "• Поиск по названию, описанию и тегам\n"
        "• Сохранение в избранное\n"
        "• Автоматическая история просмотров\n\n"
        "Все данные сохраняются локально в вашем браузере."
    )
    
    await update.message.reply_text(help_text)


async def map_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Команда /map - открыть карту"""
    
    keyboard = [
        [InlineKeyboardButton(
            "🗺️ Открыть карту",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Нажмите кнопку, чтобы открыть карту канала:",
        reply_markup=reply_markup
    )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка ошибок"""
    logger.error(f"Exception while handling an update: {context.error}")


def main() -> None:
    """Запуск бота"""
    
    # Проверка настроек
    if TOKEN == "YOUR_BOT_TOKEN_HERE":
        logger.error("⚠️  Пожалуйста, укажите TOKEN в коде!")
        return
    
    if WEB_APP_URL == "https://your-app-url.vercel.app":
        logger.error("⚠️  Пожалуйста, укажите WEB_APP_URL в коде!")
        return
    
    # Создание приложения
    application = Application.builder().token(TOKEN).build()
    
    # Регистрация обработчиков
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("map", map_command))
    
    # Обработчик ошибок
    application.add_error_handler(error_handler)
    
    # Запуск бота
    logger.info("🚀 Бот запущен!")
    logger.info(f"📱 Web App URL: {WEB_APP_URL}")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()


# ========== АЛЬТЕРНАТИВНЫЙ ВАРИАНТ (с меню кнопкой) ==========
"""
Вместо команд можно добавить кнопку Web App прямо в меню бота.

1. Откройте @BotFather
2. Выберите вашего бота
3. Нажмите "Bot Settings" → "Menu Button"
4. Введите:
   - Button text: "🗺 Карта канала"
   - URL: https://your-app-url.vercel.app

Теперь кнопка будет видна рядом с полем ввода сообщения в чате с ботом.
"""


# ========== РАСШИРЕННЫЙ ПРИМЕР (с callback) ==========
"""
Для обработки callback кнопок (например, "О боте") добавьте:

from telegram.ext import CallbackQueryHandler

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data == "about":
        about_text = (
            "ℹ️ О боте\n\n"
            "Этот бот предоставляет доступ к карте нашего канала.\n\n"
            "Карта создана с помощью Next.js и работает как Web App.\n"
            "Все материалы структурированы по разделам и доступны через поиск.\n\n"
            "Исходный код: github.com/your-repo"
        )
        await query.edit_message_text(about_text)

# Добавьте в main():
application.add_handler(CallbackQueryHandler(button_callback))
"""

