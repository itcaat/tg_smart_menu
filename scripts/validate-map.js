#!/usr/bin/env node

/**
 * Скрипт для валидации data/map.json
 * Запуск: node scripts/validate-map.js
 */

const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, '../data/map.json');

console.log('🔍 Проверка структуры data/map.json...\n');

let hasErrors = false;

try {
  // Чтение файла
  const content = fs.readFileSync(mapPath, 'utf-8');
  const data = JSON.parse(content);

  // Проверка структуры
  if (!data.meta) {
    console.error('❌ Отсутствует поле "meta"');
    hasErrors = true;
  }

  if (!data.sections || !Array.isArray(data.sections)) {
    console.error('❌ Отсутствует массив "sections"');
    hasErrors = true;
  }

  if (!data.items || !Array.isArray(data.items)) {
    console.error('❌ Отсутствует массив "items"');
    hasErrors = true;
  }

  // Проверка разделов
  const sectionIds = new Set();
  if (data.sections) {
    data.sections.forEach((section, index) => {
      if (!section.id) {
        console.error(`❌ Раздел #${index}: отсутствует id`);
        hasErrors = true;
      } else if (sectionIds.has(section.id)) {
        console.error(`❌ Раздел "${section.id}": дублирующийся id`);
        hasErrors = true;
      } else {
        sectionIds.add(section.id);
      }

      if (!section.title) {
        console.error(`❌ Раздел "${section.id}": отсутствует title`);
        hasErrors = true;
      }

      if (typeof section.order !== 'number') {
        console.error(`❌ Раздел "${section.id}": order должен быть числом`);
        hasErrors = true;
      }
    });
  }

  // Проверка элементов
  const itemIds = new Set();
  if (data.items) {
    data.items.forEach((item, index) => {
      if (!item.id) {
        console.error(`❌ Элемент #${index}: отсутствует id`);
        hasErrors = true;
      } else if (itemIds.has(item.id)) {
        console.error(`❌ Элемент "${item.id}": дублирующийся id`);
        hasErrors = true;
      } else {
        itemIds.add(item.id);
      }

      if (!item.sectionId) {
        console.error(`❌ Элемент "${item.id}": отсутствует sectionId`);
        hasErrors = true;
      } else if (!sectionIds.has(item.sectionId)) {
        console.error(`❌ Элемент "${item.id}": раздел "${item.sectionId}" не существует`);
        hasErrors = true;
      }

      if (!item.title) {
        console.error(`❌ Элемент "${item.id}": отсутствует title`);
        hasErrors = true;
      }

      if (!item.url) {
        console.error(`❌ Элемент "${item.id}": отсутствует url`);
        hasErrors = true;
      } else if (!item.url.startsWith('http')) {
        console.error(`❌ Элемент "${item.id}": url должен начинаться с http/https`);
        hasErrors = true;
      }

      if (!Array.isArray(item.tags)) {
        console.error(`❌ Элемент "${item.id}": tags должен быть массивом`);
        hasErrors = true;
      }
    });
  }

  // Статистика
  if (!hasErrors) {
    console.log('✅ Структура валидна!\n');
    console.log('📊 Статистика:');
    console.log(`   Разделов: ${data.sections.length}`);
    console.log(`   Элементов: ${data.items.length}`);
    console.log(`   Закрепленных: ${data.items.filter(i => i.pinned).length}`);
    
    // Распределение по разделам
    const itemsBySectionCount = {};
    data.items.forEach(item => {
      itemsBySectionCount[item.sectionId] = (itemsBySectionCount[item.sectionId] || 0) + 1;
    });
    
    console.log('\n📁 Распределение по разделам:');
    data.sections.forEach(section => {
      const count = itemsBySectionCount[section.id] || 0;
      console.log(`   ${section.title}: ${count}`);
    });

    // Популярные теги
    const tagCounts = {};
    data.items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    if (topTags.length > 0) {
      console.log('\n🏷️  Топ-10 тегов:');
      topTags.forEach(([tag, count]) => {
        console.log(`   #${tag}: ${count}`);
      });
    }

    process.exit(0);
  } else {
    console.error('\n❌ Найдены ошибки в структуре данных');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Ошибка при чтении или парсинге файла:');
  console.error(error.message);
  process.exit(1);
}

