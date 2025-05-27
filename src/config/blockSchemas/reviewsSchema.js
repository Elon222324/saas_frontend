export const reviewsSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон, карточки, цвета)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'section_bg_color',
    label: 'Фон всей секции',
    type: 'color',
    default: '#F9FAFB',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_color',
    label: 'Цвет основного текста',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'subtle_text_color',
    label: 'Цвет вторичного текста',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_bg_color',
    label: 'Фон карточки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_border_color',
    label: 'Цвет рамки карточки',
    type: 'color',
    default: '#E5E7EB',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'rating_color',
    label: 'Цвет звёзд рейтинга',
    type: 'color',
    default: '#FACC15',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
