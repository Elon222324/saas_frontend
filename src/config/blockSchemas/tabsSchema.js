export const tabsSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон, кнопки, текст)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_color',
    label: 'Фон панели вкладок',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'active_bg_color',
    label: 'Фон активной вкладки',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'active_text_color',
    label: 'Цвет текста активной вкладки',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_color',
    label: 'Цвет текста обычной вкладки',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_color',
    label: 'Цвет нижней границы',
    type: 'color',
    default: 'rgba(0,0,0,0.1)',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
