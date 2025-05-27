export const productsSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон, рамка, текст)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_color',
    label: 'Фон карточки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_color',
    label: 'Цвет рамки карточки',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'title_color',
    label: 'Цвет названия товара',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'price_color',
    label: 'Цвет цены',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
