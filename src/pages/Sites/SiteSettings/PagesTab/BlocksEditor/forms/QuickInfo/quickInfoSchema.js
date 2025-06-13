export const quickInfoSchema = [
    {
    key: 'bg_color',
    label: 'Фон блока',
    type: 'color',
    default: '#E3F2FD',
    editable: true,
    visible: true
  },
  {
    key: 'title_color',
    label: 'Цвет заголовков (сверху)',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible: true
  },
  {
    key: 'desc_color',
    label: 'Цвет значений (внизу)',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible: true
  },

  // 🔧 Новые параметры
  {
    key: 'gap',
    label: 'Расстояние между карточками (px)',
    type: 'number',
    default: 24,
    editable: true,
    visible: true
  },
  {
    key: 'grid_cols',
    label: 'Количество колонок',
    type: 'number',
    default: 4,
    editable: true,
    visible: true
  },
  {
    key: 'border_radius',
    label: 'Скругление карточек (px)',
    type: 'number',
    default: 12,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_title',
    label: 'Размер заголовка (px)',
    type: 'number',
    default: 14,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_desc',
    label: 'Размер значений (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'card_bg_color',
    label: 'Фон карточек',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'card_border_color',
    label: 'Цвет рамки карточек',
    type: 'color',
    default: '#E5E7EB',
    editable: true,
    visible: true
  },
  {
    key: 'card_variant',
    label: 'Стиль карточек',
    type: 'select',
    options: ['flat', 'border', 'hover-shadow'],
    default: 'flat',
    editable: true,
    visible: true
  },
  {
    key: 'show_cards',
    label: 'Показывать фон и стиль карточек',
    type: 'boolean',
    default: true,
    editable: true,
    visible: true
  }
]
