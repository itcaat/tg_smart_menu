# 📋 Шпаргалка "Карта канала"

Быстрый справочник для работы с проектом.

## 🚀 Команды

```bash
npm install         # Установка зависимостей
npm run dev         # Dev сервер (http://localhost:3000)
npm run build       # Production сборка
npm start           # Запуск production
npm run lint        # ESLint проверка
npm run validate    # Валидация map.json
```

## 📂 Структура

```
/app                → Страницы (Next.js App Router)
/components         → UI компоненты
/lib                → Утилиты и логика
/types              → TypeScript типы
/data               → Контент (map.json)
/scripts            → Вспомогательные скрипты
/examples           → Примеры интеграции
```

## 📝 Добавление контента

### Новый раздел в `data/map.json`:

```json
{
  "id": "unique-id",
  "title": "Название раздела",
  "description": "Описание раздела",
  "order": 10
}
```

### Новый материал:

```json
{
  "id": "unique-id",
  "sectionId": "existing-section-id",
  "title": "Название материала",
  "description": "Краткое описание",
  "tags": ["tag1", "tag2"],
  "url": "https://t.me/channel/123",
  "pinned": false
}
```

### После изменений:

```bash
npm run validate    # Проверка структуры
npm run dev         # Проверка в браузере
```

## 🎨 Кастомизация

### Цвета (`tailwind.config.ts`):

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
},
```

### Название (`app/layout.tsx`):

```typescript
export const metadata: Metadata = {
  title: 'Ваше название',
  description: 'Ваше описание',
};
```

### Навигация (`components/TabsNav.tsx`):

```typescript
const tabs = [
  { href: '/', label: 'Разделы', icon: '📂' },
  { href: '/favorites', label: 'Избранное', icon: '⭐' },
  { href: '/recent', label: 'Недавние', icon: '🕐' },
];
```

## 🧩 Создание компонента

```typescript
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
```

## 📄 Создание страницы

```typescript
// app/my-page/page.tsx
export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Моя страница</h1>
      <p>Контент</p>
    </div>
  );
}
```

## 🔧 Работа с данными

```typescript
import { getSections, getItemsBySectionId } from '@/lib/data';

// Получить все разделы
const sections = getSections();

// Получить материалы раздела
const items = getItemsBySectionId('section-id');
```

## 💾 localStorage

```typescript
import { addFavorite, getFavorites, isFavorite } from '@/lib/storage';

// Добавить в избранное
addFavorite('item-id');

// Проверить избранное
const isFav = isFavorite('item-id');

// Получить все избранные
const favorites = getFavorites();
```

## 🔍 Поиск

```typescript
import { searchItems } from '@/lib/search';

// Поиск по материалам
const results = searchItems(items, 'query', sectionMap);
```

## 📱 Telegram WebApp API

```typescript
import { isTelegramWebApp, openTelegramLink } from '@/lib/telegram';

// Проверка Telegram окружения
if (isTelegramWebApp()) {
  // Код для Telegram
}

// Открыть ссылку
openTelegramLink('https://t.me/channel/123');
```

## 🎯 Маршруты

```
/                       → Главная (разделы)
/section/[id]          → Раздел
/favorites             → Избранное
/recent                → Недавние
```

## 🐛 Отладка

### Проверка JSON:
```bash
npm run validate
```

### Проверка сборки:
```bash
npm run build
```

### Очистка кеша:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Другой порт:
```bash
PORT=3001 npm run dev
```

## 🚀 Деплой

### Vercel (рекомендуется):
```bash
npm i -g vercel
vercel
```

### Или через веб-интерфейс:
1. https://vercel.com/new
2. Импортировать Git репозиторий
3. Deploy

## 🤖 Telegram Bot

### Быстрая настройка:
1. @BotFather → /newbot
2. Bot Settings → Menu Button
3. Указать URL приложения

### Python бот:
```bash
pip install python-telegram-bot==20.7
python examples/telegram-bot.py
```

## 📊 Статистика map.json

```bash
npm run validate
# Покажет: разделы, элементы, теги, распределение
```

## 🎨 Tailwind классы

```typescript
// Базовые
className="p-4 m-2"                    // padding, margin
className="bg-white dark:bg-gray-800"  // фон (+ темная тема)
className="text-lg font-bold"          // текст

// Flexbox
className="flex items-center justify-between"
className="flex-col gap-4"

// Grid
className="grid gap-4"
className="grid grid-cols-2 md:grid-cols-3"

// Адаптив
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"

// Hover/Active
className="hover:bg-gray-100 active:scale-95"
className="transition-colors duration-200"
```

## 🔐 localStorage ключи

```
favorites:v1    → string[]  (ID избранных)
recent:v1       → string[]  (ID недавних, макс 30)
```

## ⚡ Оптимизация

### useMemo для дорогих вычислений:
```typescript
const filtered = useMemo(() => {
  return items.filter(item => item.pinned);
}, [items]);
```

### useCallback для функций:
```typescript
const handleClick = useCallback(() => {
  // код
}, [dependencies]);
```

### Debounce для поиска (уже есть в SearchBar):
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

## 📖 Документация

- `README.md` - основная документация
- `QUICKSTART.md` - быстрый старт
- `CONTRIBUTING.md` - добавление контента
- `DEPLOYMENT.md` - деплой
- `PROJECT_STRUCTURE.md` - структура проекта
- `CHEATSHEET.md` - эта шпаргалка

## 🆘 Частые проблемы

**Порт занят:**
```bash
PORT=3001 npm run dev
```

**Ошибка сборки:**
```bash
rm -rf .next && npm run build
```

**Ошибка в map.json:**
```bash
npm run validate
# Проверить JSON на https://jsonlint.com/
```

**ESLint ошибки:**
```bash
npm run lint
```

## 💡 Советы

1. ✅ Используйте `npm run validate` после каждого изменения map.json
2. ✅ Тестируйте в браузере перед деплоем
3. ✅ Делайте коммиты часто
4. ✅ Используйте TypeScript типы
5. ✅ Следуйте структуре проекта
6. ✅ Читайте `.cursorrules` для conventions

## 🔗 Полезные ссылки

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Telegram WebApps: https://core.telegram.org/bots/webapps
- Vercel: https://vercel.com/docs

---

**Быстрого развития! 🚀**

