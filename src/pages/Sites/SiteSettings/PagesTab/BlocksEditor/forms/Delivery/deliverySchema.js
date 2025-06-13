export const deliverySchema = [
    {
    key: 'background_color',
    label: 'Фон секции',
    type: 'color',
    default: '#FFFFFF',
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
    key: 'card_shadow',
    label: 'Тень карточки',
    type: 'select',
    options: ['none', 'low', 'medium', 'high'],
    default: 'medium',
    editable: true,
    visible: true
  },
  {
    key: 'text_color',
    label: 'Цвет заголовков',
    type: 'color',
    default: '#212121',
    editable: true,
    visible: true
  },
  {
    key: 'desc_color',
    label: 'Цвет описания',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible: true
  },
  {
    key: 'icon_color',
    label: 'Цвет акцентов (числа, выделения)',
    type: 'color',
    default: '#F97316',
    editable: true,
    visible: true
  },
  {
    key: 'map_border_radius',
    label: 'Скругление карты (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'map_shadow',
    label: 'Тень карты',
    type: 'select',
    options: ['none', 'low', 'medium', 'high'],
    default: 'medium',
    editable: true,
    visible: true
  },
  {
    key: 'section_spacing_top',
    label: 'Отступ сверху секции (px)',
    type: 'number',
    default: 48,
    editable: true,
    visible: true
  },
  {
    key: 'section_spacing_bottom',
    label: 'Отступ снизу секции (px)',
    type: 'number',
    default: 48,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_title',
    label: 'Размер заголовков (px)',
    type: 'fontsize',
    default: 24,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_desc',
    label: 'Размер описания (px)',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible: true
  }
]
