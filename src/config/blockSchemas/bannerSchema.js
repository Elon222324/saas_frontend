export const bannerSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон, кнопка, текст)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_gradient_from',
    label: 'Цвет градиента (начало)',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'bg_gradient_to',
    label: 'Цвет градиента (конец)',
    type: 'color',
    default: '#90CAF9',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_color',
    label: 'Цвет основного текста',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'button_bg_color',
    label: 'Цвет кнопки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'button_text_color',
    label: 'Цвет текста кнопки',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'button_hover_color',
    label: 'Цвет кнопки при наведении',
    type: 'color',
    default: '#F3F4F6',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
