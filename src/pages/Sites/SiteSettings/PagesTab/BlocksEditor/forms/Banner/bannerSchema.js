export const bannerSchema = [
    {
    key: 'bg_gradient_from',
    label: 'Цвет градиента (начало)',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible: true
  },
  {
    key: 'bg_gradient_to',
    label: 'Цвет градиента (конец)',
    type: 'color',
    default: '#90CAF9',
    editable: true,
    visible: true
  },
  {
    key: 'text_color',
    label: 'Цвет основного текста',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'button_bg_color',
    label: 'Цвет кнопки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible: true
  },
  {
    key: 'button_text_color',
    label: 'Цвет текста кнопки',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible: true
  },
  {
    key: 'button_hover_color',
    label: 'Цвет кнопки при наведении',
    type: 'color',
    default: '#F3F4F6',
    editable: true,
    visible: true
  },

  // 🔽 Новые переменные
  {
    key: 'alignment',
    label: 'Выравнивание содержимого',
    type: 'select',
    options: ['left', 'center', 'right'],
    default: 'left',
    editable: true,
    visible: true
  },
  {
    key: 'img_style',
    label: 'Стиль изображения',
    type: 'select',
    options: ['default', 'float', 'glow'],
    default: 'default',
    editable: true,
    visible: true
  },
  {
    key: 'hover_effect',
    label: 'Анимация при наведении',
    type: 'boolean',
    default: true,
    editable: true,
    visible: true
  },
  {
    key: 'layout_variant',
    label: 'Вариант расположения блока',
    type: 'select',
    options: ['wide', 'narrow'],
    default: 'wide',
    editable: true,
    visible: true
  },
  {
    key: 'reverse_layout',
    label: 'Развернуть расположение (картинка слева)',
    type: 'boolean',
    default: false,
    editable: true,
    visible: true
  }
]
