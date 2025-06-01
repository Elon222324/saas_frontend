export const navigationSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (цвета, граница, фон)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'bg_color',
    label: 'Фон навигации',
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
    key: 'hover_color',
    label: 'Цвет текста при наведении',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'hover_bg_color',
    label: 'Фон при наведении',
    type: 'color',
    default: 'transparent',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'active_bg_color',
    label: 'Фон активной вкладки',
    type: 'color',
    default: 'transparent',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'active_text_color',
    label: 'Цвет активной вкладки',
    type: 'color',
    default: '#1976D2',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_color',
    label: 'Цвет нижней границы',
    type: 'color',
    default: '#E5E7EB',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'show_border',
    label: 'Показать нижнюю границу',
    type: 'boolean',
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'tab_spacing',
    label: 'Расстояние между вкладками (px)',
    type: 'number',
    default: 24,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'font_size',
    label: 'Размер шрифта вкладок (px)',
    type: 'number',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'padding_x',
    label: 'Отступы по горизонтали (px)',
    type: 'number',
    default: 24,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'padding_y',
    label: 'Отступы по вертикали (px)',
    type: 'number',
    default: 12,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
