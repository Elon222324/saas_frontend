export const productGridSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид карточек (фон, текст, кнопка)',
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
    key: 'text_color',
    label: 'Цвет текста карточки',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'price_bg_color',
    label: 'Фон цены на мобилке',
    type: 'color',
    default: 'rgba(0,0,0,0.05)',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'button_bg_color',
    label: 'Фон кнопки "Выбрать"',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'button_text_color',
    label: 'Цвет текста кнопки "Выбрать"',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
