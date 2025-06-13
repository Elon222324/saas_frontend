export const reviewsSchema = [
    {
    key: 'section_bg_color',
    label: 'Фон всей секции',
    type: 'color',
    default: '#F9FAFB',
    editable: true,
    visible: true
  },
  {
    key: 'text_color',
    label: 'Цвет основного текста',
    type: 'color',
    default: '#212121',
    editable: true,
    visible: true
  },
  {
    key: 'subtle_text_color',
    label: 'Цвет вторичного текста',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible: true
  },
  {
    key: 'card_bg_color',
    label: 'Фон карточки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'card_border_color',
    label: 'Цвет рамки карточки',
    type: 'color',
    default: '#E5E7EB',
    editable: true,
    visible: true
  },
  {
    key: 'rating_color',
    label: 'Цвет звёзд рейтинга',
    type: 'color',
    default: '#FACC15',
    editable: true,
    visible: true
  },
  {
    key: 'primary_color',
    label: 'Цвет кнопки "Оставить отзыв"',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible: true
  },
  {
    key: 'show_modal_button',
    label: 'Показывать кнопку "Оставить отзыв"',
    type: 'boolean',
    default: true,
    editable: true,
    visible: true
  },
  {
    key: 'slider_enabled',
    label: 'Включить горизонтальный скролл',
    type: 'boolean',
    default: true,
    editable: true,
    visible: true
  },
  {
    key: 'avatar_size',
    label: 'Размер аватарок',
    type: 'select',
    options: ['small', 'medium', 'large'],
    default: 'medium',
    editable: true,
    visible: true
  },
  {
    key: 'card_shadow',
    label: 'Тень карточки',
    type: 'select',
    options: ['none', 'low', 'medium', 'high'],
    default: 'low',
    editable: true,
    visible: true
  },
  {
    key: 'transition_effect',
    label: 'Эффект прокрутки',
    type: 'select',
    options: ['fade', 'slide', 'scale'],
    default: 'slide',
    editable: true,
    visible: true
  },
  {
    key: 'reviews_count',
    label: 'Количество отзывов',
    type: 'number',
    default: 4,
    editable: true,
    visible: true
  }
]
