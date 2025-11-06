export const promoStoriesSchema = [
  {
    key: 'background_color',
    label: 'Цвет фона',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'title_color',
    label: 'Цвет заголовка',
    type: 'color',
    default: '#1E293B',
    editable: true,
    visible: true
  },
  {
    key: 'accent_color',
    label: 'Основной акцент',
    type: 'color',
    default: '#F97316',
    editable: true,
    visible: true
  },
  {
    key: 'accent_color_secondary',
    label: 'Вторичный акцент',
    type: 'color',
    default: '#EC4899',
    editable: true,
    visible: true
  },
  {
    key: 'item_gap',
    label: 'Отступ между историями (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'padding_y',
    label: 'Вертикальный отступ (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'max_visible_items',
    label: 'Максимум видимых историй',
    type: 'number',
    default: 8,
    editable: true,
    visible: true
  }
]

