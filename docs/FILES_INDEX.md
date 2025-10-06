# 📑 Индекс файлов: Система токенов

Полный список всех файлов, связанных с системой управления токенами.

---

## 🔧 Исходный код

### Хуки
- **`src/hooks/useSiteToken.js`** ⭐  
  Центральный хук для получения и кеширования токенов сайтов

### Контексты
- **`src/context/SiteSettingsContext.jsx`** (изменен)  
  Теперь использует `useSiteToken` вместо локальной логики

### Компоненты
- **`src/pages/Sites/SiteSettings/Catalog/Products/index.jsx`** (изменен)  
  Удален локальный QueryClient
  
- **`src/pages/Sites/SiteSettings/Catalog/Options/index.jsx`** (изменен)  
  Удален локальный QueryClient
  
- **`src/pages/Sites/SiteSettings/Catalog/Extras/index.jsx`** (изменен)  
  Удален локальный QueryClient
  
- **`src/pages/OwnerPanel/Tools/Library/index.jsx`** (изменен)  
  Удален локальный QueryClient

### Точка входа
- **`src/main.jsx`** (изменен)  
  Добавлен глобальный QueryClientProvider

---

## 📚 Документация

### Быстрый старт
- **`docs/Quick_Start_Tokens.md`** 📖  
  Шпаргалка для быстрого начала работы (читай в первую очередь!)

### Подробная документация
- **`src/hooks/README.md`** 📖  
  API Reference для хука `useSiteToken` с примерами

- **`docs/Архитектура_токенов.md`** 📖  
  Полное описание архитектуры системы токенов

- **`docs/Token_Flow_Diagram.md`** 📊  
  Визуальные диаграммы всех потоков данных

### Руководства
- **`src/pages/Orders/MIGRATION_GUIDE.md`** 🔧  
  Пошаговая инструкция по миграции Orders на новое API

### История изменений
- **`CHANGELOG_tokens.md`** 📝  
  Детальный changelog всех изменений

- **`TOKENS_REFACTOR_SUMMARY.md`** ✅  
  Краткое резюме рефакторинга (читай после Quick Start)

### Этот файл
- **`docs/FILES_INDEX.md`** 📑  
  Индекс всех файлов (ты здесь)

---

## 🗂️ Структура по назначению

### Для новичков (начни здесь)
1. `TOKENS_REFACTOR_SUMMARY.md` - что было сделано
2. `docs/Quick_Start_Tokens.md` - как использовать за 30 секунд
3. Примеры в хуках Products/Options/Extras

### Для разработчиков
1. `src/hooks/README.md` - API хука
2. `docs/Архитектура_токенов.md` - как работает система
3. `docs/Token_Flow_Diagram.md` - визуальные схемы

### Для миграции существующего кода
1. `src/pages/Orders/MIGRATION_GUIDE.md` - готовая инструкция
2. Посмотри diff в измененных компонентах

### Для понимания изменений
1. `CHANGELOG_tokens.md` - что, когда, зачем
2. Git история измененных файлов

---

## 📂 Файловая структура проекта (обновленная)

```
frontend/⚙️ saas-front-refactor/
│
├── src/
│   ├── hooks/
│   │   ├── useSiteToken.js          ⭐ НОВЫЙ
│   │   └── README.md                📖 НОВЫЙ
│   │
│   ├── context/
│   │   └── SiteSettingsContext.jsx  🔄 ИЗМЕНЕН
│   │
│   ├── pages/
│   │   ├── Sites/SiteSettings/Catalog/
│   │   │   ├── Products/
│   │   │   │   ├── index.jsx        🔄 ИЗМЕНЕН
│   │   │   │   └── hooks/
│   │   │   │       └── useCategories.js  (использует useSiteToken)
│   │   │   │
│   │   │   ├── Options/
│   │   │   │   ├── index.jsx        🔄 ИЗМЕНЕН
│   │   │   │   └── hooks/
│   │   │   │       └── useOptionGroups.js (использует useSiteToken)
│   │   │   │
│   │   │   └── Extras/
│   │   │       ├── index.jsx        🔄 ИЗМЕНЕН
│   │   │       └── hooks/
│   │   │           └── useExtraGroups.js (использует useSiteToken)
│   │   │
│   │   ├── Orders/
│   │   │   ├── index.jsx            (готов к миграции)
│   │   │   └── MIGRATION_GUIDE.md   📖 НОВЫЙ
│   │   │
│   │   └── OwnerPanel/Tools/Library/
│   │       └── index.jsx             🔄 ИЗМЕНЕН
│   │
│   └── main.jsx                      🔄 ИЗМЕНЕН
│
├── docs/
│   ├── Архитектура_токенов.md       📖 НОВЫЙ
│   ├── Token_Flow_Diagram.md        📊 НОВЫЙ
│   ├── Quick_Start_Tokens.md        📖 НОВЫЙ
│   ├── FILES_INDEX.md               📑 НОВЫЙ (этот файл)
│   ├── Авторизация.md               (существующий)
│   └── products_api_admin.md        (существующий)
│
├── TOKENS_REFACTOR_SUMMARY.md       ✅ НОВЫЙ
└── CHANGELOG_tokens.md              📝 НОВЫЙ
```

**Легенда:**
- ⭐ - Ключевой файл
- 📖 - Документация
- 📊 - Диаграммы
- 📑 - Индексы
- 📝 - История
- ✅ - Резюме
- 🔄 - Изменен
- 🔧 - Инструкция

---

## 🔍 Поиск информации

### "Как использовать токены?"
→ `docs/Quick_Start_Tokens.md`

### "Как работает система?"
→ `docs/Архитектура_токенов.md`

### "Где примеры кода?"
→ `src/hooks/README.md` + хуки в Products/Options/Extras

### "Как мигрировать Orders?"
→ `src/pages/Orders/MIGRATION_GUIDE.md`

### "Что изменилось?"
→ `CHANGELOG_tokens.md`

### "Быстрое резюме?"
→ `TOKENS_REFACTOR_SUMMARY.md`

### "Визуальные схемы?"
→ `docs/Token_Flow_Diagram.md`

---

## 📊 Статистика файлов

| Категория | Количество | Строк кода |
|-----------|------------|------------|
| Исходный код (новый) | 1 | ~130 |
| Исходный код (изменен) | 6 | ~-70 |
| Документация | 7 | ~2000 |
| **Всего файлов** | **14** | **~2060** |

---

## 🎯 Рекомендуемый порядок чтения

### День 1: Быстрый старт (30 минут)
1. `TOKENS_REFACTOR_SUMMARY.md` (5 мин)
2. `docs/Quick_Start_Tokens.md` (10 мин)
3. Посмотри примеры в `useCategories.js` (15 мин)

### День 2: Глубокое понимание (1-2 часа)
1. `src/hooks/README.md` (30 мин)
2. `docs/Архитектура_токенов.md` (30 мин)
3. `docs/Token_Flow_Diagram.md` (15 мин)
4. `CHANGELOG_tokens.md` (15 мин)

### По необходимости: Миграция
1. `src/pages/Orders/MIGRATION_GUIDE.md` (когда нужно мигрировать Orders)

---

## 🆘 Быстрая помощь

```bash
# Найти все упоминания useSiteToken
grep -r "useSiteToken" src/

# Найти примеры использования
grep -r "useSiteToken" src/pages/Sites/SiteSettings/Catalog/

# Посмотреть список токенов в кеше (в DevTools)
# React Query DevTools → Queries → поиск "siteToken"
```

---

**Последнее обновление:** Октябрь 2025  
**Всего файлов в системе:** 14  
**Строк документации:** ~2000

