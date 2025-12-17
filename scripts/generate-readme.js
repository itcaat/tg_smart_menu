#!/usr/bin/env node

/**
 * Генератор README.md из data/map.json
 * Создает красивую навигацию с лучшими UI/UX практиками
 */

const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, '../data/map.json');
const readmePath = path.join(__dirname, '../README.md');

console.log('📝 Генерация README.md из map.json...\n');

try {
  // Читаем данные
  const content = fs.readFileSync(mapPath, 'utf-8');
  const data = JSON.parse(content);

  // Сортируем разделы по order
  const sections = [...data.sections].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  // Группируем элементы по разделам
  const itemsBySection = {};
  data.items.forEach(item => {
    if (!itemsBySection[item.sectionId]) {
      itemsBySection[item.sectionId] = [];
    }
    itemsBySection[item.sectionId].push(item);
  });

  // Сортируем элементы: pinned первыми, затем по алфавиту
  Object.keys(itemsBySection).forEach(sectionId => {
    itemsBySection[sectionId].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.title.localeCompare(b.title);
    });
  });

  // Генерируем README
  let readme = '';
  
  // === HEADER ===
  readme += `<div align="center">\n\n`;
  readme += `# 🗺️ ${data.meta.title}\n\n`;
  readme += `### Навигация по материалам канала\n\n`;
  
  // Статистика
  const totalItems = data.items.length;
  const pinnedItems = data.items.filter(i => i.pinned).length;
  
  readme += `![Разделов](https://img.shields.io/badge/Разделов-${data.sections.length}-blue?style=for-the-badge)\n`;
  readme += `![Материалов](https://img.shields.io/badge/Материалов-${totalItems}-green?style=for-the-badge)\n`;
  if (pinnedItems > 0) {
    readme += `![Закреплено](https://img.shields.io/badge/Закреплено-${pinnedItems}-yellow?style=for-the-badge)\n`;
  }
  readme += `![Обновлено](https://img.shields.io/badge/Обновлено-${data.meta.updatedAt}-lightgrey?style=for-the-badge)\n\n`;
  
  readme += `---\n\n`;
  readme += `</div>\n\n`;

  // === TABLE OF CONTENTS ===
  readme += `## 📑 Содержание\n\n`;
  readme += `<table>\n`;
  readme += `<tr>\n`;
  
  // Делаем таблицу с 2 колонками
  sections.forEach((section, idx) => {
    if (idx % 2 === 0) {
      if (idx > 0) readme += `</tr>\n`;
      readme += `<tr>\n`;
    }
    const count = itemsBySection[section.id]?.length || 0;
    readme += `<td width="50%">\n\n`;
    readme += `### [${section.title}](#${section.id})\n`;
    readme += `${section.description}\n\n`;
    readme += `📚 **${count}** ${count === 1 ? 'материал' : 'материалов'}\n\n`;
    readme += `</td>\n`;
  });
  
  if (sections.length % 2 !== 0) {
    readme += `<td width="50%"></td>\n`;
  }
  readme += `</tr>\n`;
  readme += `</table>\n\n`;
  readme += `---\n\n`;

  // === РАЗДЕЛЫ С МАТЕРИАЛАМИ ===
  sections.forEach((section, sectionIndex) => {
    const items = itemsBySection[section.id] || [];
    
    // Якорь и заголовок раздела
    readme += `<div id="${section.id}"></div>\n\n`;
    readme += `## ${getSectionEmoji(section.id)} ${section.title}\n\n`;
    
    // Описание в blockquote
    readme += `> ${section.description}\n\n`;

    if (items.length === 0) {
      readme += `<div align="center">\n\n`;
      readme += `*Материалов пока нет*\n\n`;
      readme += `</div>\n\n`;
    } else {
      // Материалы в виде карточек
      items.forEach(item => {
        readme += `<details>\n`;
        readme += `<summary>\n\n`;
        
        // Иконки и заголовок
        const pin = item.pinned ? '📌 ' : '';
        readme += `### ${pin}${item.title}\n\n`;
        readme += `</summary>\n\n`;
        
        // Описание
        readme += `${item.description}\n\n`;
        
        // Теги
        if (item.tags.length > 0) {
          readme += `**🏷️ Теги:** `;
          item.tags.forEach(tag => {
            readme += `\`${tag}\` `;
          });
          readme += `\n\n`;
        }
        
        // Кнопка ссылки
        readme += `<div align="center">\n\n`;
        readme += `[![Открыть материал](https://img.shields.io/badge/📖_Открыть_материал-blue?style=for-the-badge)](${item.url})\n\n`;
        readme += `</div>\n\n`;
        
        readme += `</details>\n\n`;
      });
    }

    // Кнопка "Наверх" между разделами
    if (sectionIndex < sections.length - 1) {
      readme += `<div align="right">\n\n`;
      readme += `[⬆️ Наверх](#-содержание)\n\n`;
      readme += `</div>\n\n`;
      readme += `---\n\n`;
    }
  });

  // === FOOTER ===
  readme += `\n---\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `## 💡 Как добавить материал\n\n`;
  readme += `</div>\n\n`;
  
  readme += `> **Этот README автоматически генерируется** из \`data/map.json\`.\n`;
  readme += `> Для добавления материалов отредактируйте JSON и запушьте изменения.\n\n`;
  
  readme += `<details>\n`;
  readme += `<summary><b>📝 Инструкция по добавлению</b></summary>\n\n`;
  readme += `### 1. Откройте \`data/map.json\`\n\n`;
  readme += `### 2. Добавьте новый материал:\n\n`;
  readme += `\`\`\`json\n`;
  readme += `{\n`;
  readme += `  "id": "unique-id",\n`;
  readme += `  "sectionId": "раздел",\n`;
  readme += `  "title": "Название",\n`;
  readme += `  "description": "Описание",\n`;
  readme += `  "tags": ["тег1", "тег2"],\n`;
  readme += `  "url": "https://...",\n`;
  readme += `  "pinned": false\n`;
  readme += `}\n`;
  readme += `\`\`\`\n\n`;
  readme += `### 3. Закоммитьте и запушьте:\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `git add data/map.json\n`;
  readme += `git commit -m "add: новый материал"\n`;
  readme += `git push\n`;
  readme += `\`\`\`\n\n`;
  readme += `GitHub Actions автоматически обновит README! ⚡\n\n`;
  readme += `</details>\n\n`;

  readme += `---\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `**Сделано с ❤️ для навигации по материалам**\n\n`;
  readme += `\`v${data.meta.version}\` • Обновлено: \`${data.meta.updatedAt}\`\n\n`;
  readme += `</div>\n`;

  // Записываем README
  fs.writeFileSync(readmePath, readme, 'utf-8');

  console.log('✅ README.md успешно сгенерирован!\n');
  console.log(`📊 Создано разделов: ${sections.length}`);
  console.log(`📄 Всего материалов: ${totalItems}`);
  console.log(`📌 Закрепленных: ${pinnedItems}\n`);

} catch (error) {
  console.error('❌ Ошибка при генерации README:');
  console.error(error.message);
  process.exit(1);
}

// Функция для подбора emoji по разделу
function getSectionEmoji(sectionId) {
  const emojiMap = {
    'devops': '🚀',
    'k8s': '☸️',
    'kubernetes': '☸️',
    'frontend': '💻',
    'backend': '⚙️',
    'security': '🔐',
    'databases': '🗄️',
    'testing': '🧪',
    'design': '🎨',
    'mobile': '📱',
    'ai': '🤖',
    'ml': '🧠',
    'cloud': '☁️',
    'tools': '🛠️',
    'best-practices': '⭐',
  };
  
  return emojiMap[sectionId.toLowerCase()] || '📂';
}
