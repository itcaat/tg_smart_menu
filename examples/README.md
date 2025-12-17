# Примеры интеграции

Этот каталог содержит примеры интеграции приложения "Карта канала" с различными сервисами.

## 📁 Файлы

### telegram-bot.py

Простой Telegram бот на Python для запуска Web App.

**Возможности:**
- Команда `/start` с кнопкой открытия карты
- Команда `/help` со справкой
- Команда `/map` для быстрого доступа
- Обработка ошибок

**Установка и запуск:**

```bash
# Установите зависимости
pip install python-telegram-bot==20.7

# Отредактируйте файл
# Укажите TOKEN и WEB_APP_URL

# Запустите
python telegram-bot.py
```

**Настройка:**

1. Создайте бота в [@BotFather](https://t.me/botfather):
   ```
   /newbot
   ```

2. Сохраните токен

3. Задеплойте Next.js приложение (Vercel, Netlify, etc.)

4. Укажите токен и URL в коде:
   ```python
   TOKEN = "123456:ABC-DEF..."
   WEB_APP_URL = "https://your-app.vercel.app"
   ```

5. Запустите бота

## 🎯 Альтернативные способы интеграции

### 1. Menu Button (рекомендуется)

Самый простой способ - добавить кнопку Web App в меню бота:

1. Откройте [@BotFather](https://t.me/botfather)
2. Выберите вашего бота
3. Bot Settings → Menu Button
4. Введите название и URL приложения

Теперь кнопка появится рядом с полем ввода в чате с ботом.

### 2. Inline кнопка в канале

Добавьте кнопку в закрепленное сообщение канала:

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

keyboard = [[
    InlineKeyboardButton(
        "🗺️ Карта канала",
        web_app=WebAppInfo(url="https://your-app.vercel.app")
    )
]]
reply_markup = InlineKeyboardMarkup(keyboard)

await bot.send_message(
    chat_id="@your_channel",
    text="📌 Все материалы канала в удобной карте:",
    reply_markup=reply_markup
)
```

### 3. Прямая ссылка

Просто поделитесь ссылкой:
```
https://your-app.vercel.app
```

Приложение корректно работает в любом браузере, включая Telegram in-app browser.

## 🔧 Дополнительные возможности

### Валидация Telegram WebApp

Для проверки, что запрос пришел из Telegram, можно валидировать `initData`:

```python
import hmac
import hashlib
from urllib.parse import parse_qs

def validate_telegram_webapp(init_data: str, bot_token: str) -> bool:
    """
    Валидация initData от Telegram WebApp
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    """
    try:
        parsed = parse_qs(init_data)
        hash_value = parsed.get('hash', [''])[0]
        
        # Удаляем hash из данных
        data_check_string = '\n'.join(
            f"{k}={v[0]}" 
            for k, v in sorted(parsed.items()) 
            if k != 'hash'
        )
        
        # Создаем secret_key
        secret_key = hmac.new(
            "WebAppData".encode(),
            bot_token.encode(),
            hashlib.sha256
        ).digest()
        
        # Вычисляем hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return calculated_hash == hash_value
    except:
        return False
```

### Получение данных пользователя

В Next.js приложении можно получить данные пользователя:

```typescript
// lib/telegram.ts

export function getTelegramUser() {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    return null;
  }
  
  const user = window.Telegram.WebApp.initDataUnsafe?.user;
  
  return user ? {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    languageCode: user.language_code,
  } : null;
}
```

### Отправка событий боту

Можно отправлять события из Web App боту:

```typescript
// В Next.js приложении
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.sendData(JSON.stringify({
    action: 'item_opened',
    itemId: 'example-id',
  }));
}
```

```python
# В боте
from telegram.ext import MessageHandler, filters

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка данных из Web App"""
    data = json.loads(update.effective_message.web_app_data.data)
    
    if data.get('action') == 'item_opened':
        item_id = data.get('itemId')
        # Сохраните статистику, отправьте уведомление и т.д.

application.add_handler(
    MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data)
)
```

## 📊 Аналитика

### Отслеживание использования

Добавьте простую аналитику в бота:

```python
import json
from datetime import datetime

# При открытии Web App
stats = {
    'user_id': update.effective_user.id,
    'username': update.effective_user.username,
    'timestamp': datetime.now().isoformat(),
}

# Сохраните в файл или БД
with open('stats.json', 'a') as f:
    f.write(json.dumps(stats) + '\n')
```

### Google Analytics / Yandex Metrika

Добавьте счетчик в `app/layout.tsx`:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

## 🚀 Деплой бота

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY telegram-bot.py .

CMD ["python", "telegram-bot.py"]
```

### Railway / Heroku

1. Создайте `requirements.txt`:
   ```
   python-telegram-bot==20.7
   ```

2. Создайте `Procfile`:
   ```
   worker: python telegram-bot.py
   ```

3. Задеплойте на Railway/Heroku

4. Добавьте переменные окружения:
   - `BOT_TOKEN`
   - `WEB_APP_URL`

### systemd (Linux сервер)

```ini
[Unit]
Description=Telegram Channel Map Bot
After=network.target

[Service]
Type=simple
User=bot
WorkingDirectory=/opt/telegram-bot
ExecStart=/usr/bin/python3 /opt/telegram-bot/telegram-bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## 🐛 Отладка

### Проверка Web App локально

Используйте ngrok для тестирования:

```bash
# Запустите Next.js
npm run dev

# В другом терминале запустите ngrok
ngrok http 3000

# Используйте HTTPS URL от ngrok в боте
WEB_APP_URL = "https://xxxx-xx-xxx.ngrok.io"
```

### Логирование

Бот логирует все события. Проверяйте консоль:

```bash
python telegram-bot.py

# Вывод:
# 2025-12-17 12:00:00 - __main__ - INFO - 🚀 Бот запущен!
# 2025-12-17 12:00:00 - __main__ - INFO - 📱 Web App URL: https://...
```

## 📚 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApps](https://core.telegram.org/bots/webapps)
- [python-telegram-bot документация](https://docs.python-telegram-bot.org/)
- [Next.js документация](https://nextjs.org/docs)

## 💡 Идеи для расширения

1. **Админ панель** - управление контентом через бота
2. **Уведомления** - рассылка о новых материалах
3. **Статистика** - популярные материалы, поиски
4. **Персонализация** - рекомендации на основе истории
5. **Мультиязычность** - разные языки интерфейса
6. **Экспорт** - скачать избранное в PDF/JSON
7. **Комментарии** - обсуждение материалов
8. **Рейтинги** - оценка материалов пользователями

---

**Нужна помощь?** Создайте Issue в репозитории!

