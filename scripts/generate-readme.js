#!/usr/bin/env node

/**
 * Генератор README.md из data/map.json
 * Формат: ссылка + описание под ней (без тегов)
 */

const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, '../data/map.json');
const readmePath = path.join(__dirname, '../README.md');

console.log('📝 Генерация README.md из map.json...\n');

try {
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

  // Текущее время обновления
  const now = new Date();
  const timeString = now.toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Генерируем README
  let readme = `# 🗺️ ${data.meta.title}\n\n`;
  readme += `> 5 разделов • 15 материалов • Обновлено: ${timeString} (МСК)\n\n`;

  // Разделы с материалами
  sections.forEach(section => {
    const items = itemsBySection[section.id] || [];
    
    readme += `## ${section.title}\n\n`;
    readme += `${section.description}\n\n`;
    
    if (items.length === 0) {
      readme += `*Материалов пока нет*\n\n`;
    } else {
      items.forEach(item => {
        const pin = item.pinned ? '📌 ' : '';
        readme += `${pin}**[${item.title}](${item.url})**  \n`;
        readme += `${item.description}\n\n`;
      });
    }
  });

  // Footer
  readme += `---\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `**Для добавления материалов** отредактируйте \`data/map.json\` и запушьте изменения\n\n`;
  readme += `GitHub Actions автоматически обновит этот README\n\n`;
  readme += `</div>\n`;

  // Записываем README
  fs.writeFileSync(readmePath, readme, 'utf-8');

  console.log('✅ README.md успешно сгенерирован!\n');
  console.log(`📊 Создано разделов: ${sections.length}`);
  console.log(`📄 Всего материалов: ${data.items.length}`);
  console.log(`📌 Закрепленных: ${data.items.filter(i => i.pinned).length}\n`);

} catch (error) {
  console.error('❌ Ошибка при генерации README:');
  console.error(error.message);
  process.exit(1);
}
