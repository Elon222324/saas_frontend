export const quickInfoSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон и цвета текста)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_color',
    label: 'Фон блока',
    type: 'color',
    default: '#E3F2FD',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'title_color',
    label: 'Цвет заголовков (сверху)',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'desc_color',
    label: 'Цвет значений (внизу)',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
