export const productsSchema = [
    {
    key: 'bg_color',
    label: 'Фон карточки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'border_color',
    label: 'Цвет рамки карточки',
    type: 'color',
    default: '#212121',
    editable: true,
    visible: true
  },
  {
    key: 'title_color',
    label: 'Цвет названия товара',
    type: 'color',
    default: '#212121',
    editable: true,
    visible: true
  },
  {
    key: 'price_color',
    label: 'Цвет цены',
    type: 'color',
    default: '#212121',
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
    key: 'card_radius',
    label: 'Скругление карточки (px)',
    type: 'number',
    default: 12,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_title',
    label: 'Размер шрифта названия',
    type: 'fontsize',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'font_size_price',
    label: 'Размер шрифта цены',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible: true
  },
  {
    key: 'spacing_x',
    label: 'Горизонтальный отступ между карточками (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible: true
  },
  {
    key: 'image_size',
    label: 'Размер изображения (px)',
    type: 'number',
    default: 96,
    editable: true,
    visible: true
  },
  {
    key: 'padding_top',
    label: 'Отступ сверху блока (px)',
    type: 'number',
    default: 32,
    editable: true,
    visible: true
  },
  {
    key: 'padding_bottom',
    label: 'Отступ снизу блока (px)',
    type: 'number',
    default: 40,
    editable: true,
    visible: true
  },
  {
    key: 'cards_count',
    label: 'Количество карточек',
    type: 'number',
    default: 3,
    editable: true,
    visible: true
  }
]
