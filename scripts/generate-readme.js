#!/usr/bin/env node

/**
 * Генератор README.md из data/map.json
 * Создает красивую навигацию по материалам канала
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
  let readme = `# ${data.meta.title}\n\n`;
  readme += `> Навигация по материалам канала\n\n`;
  readme += `**Версия:** ${data.meta.version} • **Обновлено:** ${data.meta.updatedAt}\n\n`;
  
  // Статистика
  const totalItems = data.items.length;
  const pinnedItems = data.items.filter(i => i.pinned).length;
  readme += `📊 **Статистика:** ${data.sections.length} разделов • ${totalItems} материалов`;
  if (pinnedItems > 0) {
    readme += ` • ${pinnedItems} закрепленных`;
  }
  readme += `\n\n`;

  // Оглавление
  readme += `## 📑 Содержание\n\n`;
  sections.forEach(section => {
    const count = itemsBySection[section.id]?.length || 0;
    readme += `- [${section.title}](#${section.id}) (${count})\n`;
  });
  readme += `\n---\n\n`;

  // Разделы с материалами
  sections.forEach(section => {
    const items = itemsBySection[section.id] || [];
    
    readme += `## ${section.title}\n\n`;
    readme += `<a name="${section.id}"></a>\n\n`;
    readme += `${section.description}\n\n`;

    if (items.length === 0) {
      readme += `*Пока нет материалов в этом разделе*\n\n`;
    } else {
      items.forEach(item => {
        // Иконка для закрепленных
        const pin = item.pinned ? '📌 ' : '';
        
        // Заголовок со ссылкой
        readme += `### ${pin}[${item.title}](${item.url})\n\n`;
        
        // Описание
        readme += `${item.description}\n\n`;
        
        // Теги
        if (item.tags.length > 0) {
          const tagBadges = item.tags.map(tag => 
            `\`${tag}\``
          ).join(' ');
          readme += `**Теги:** ${tagBadges}\n\n`;
        }
        
        readme += `---\n\n`;
      });
    }
  });

  // Футер
  readme += `\n## 📝 Об этом документе\n\n`;
  readme += `Этот README автоматически генерируется из \`data/map.json\`.\n\n`;
  readme += `Для добавления материалов отредактируйте \`data/map.json\` и запустите:\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `npm run generate-readme\n`;
  readme += `\`\`\`\n\n`;
  readme += `Или просто закоммитьте изменения - GitHub Actions обновит README автоматически.\n`;

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

