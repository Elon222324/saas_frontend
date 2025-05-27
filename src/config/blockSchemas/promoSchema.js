export const promoSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон, текст, рамка)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_color',
    label: 'Фон карточек',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_color',
    label: 'Цвет рамки карточек',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'title_color',
    label: 'Цвет заголовка',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'desc_color',
    label: 'Цвет описания',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
