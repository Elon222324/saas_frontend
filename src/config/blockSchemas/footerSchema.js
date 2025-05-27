export const footerSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон и цвета)',
    type: 'checkbox',
    default: false,
    editable: true
  },
  {
    key: 'background_color',
    label: 'Фон подвала',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_color',
    label: 'Цвет текста',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_color',
    label: 'Цвет разделительной линии',
    type: 'color',
    default: '#E5E7EB',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
