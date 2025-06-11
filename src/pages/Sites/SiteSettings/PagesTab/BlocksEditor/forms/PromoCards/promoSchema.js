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
  },
  {
    key: 'title_size',
    label: 'Размер шрифта заголовка',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'desc_size',
    label: 'Размер шрифта описания',
    type: 'fontsize',
    default: 12,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'border_radius',
    label: 'Скругление карточек',
    type: 'number',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'gap',
    label: 'Отступ между карточками',
    type: 'number',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_count',
    label: 'Количество карточек',
    type: 'number',
    default: 6,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_width',
    label: 'Ширина карточек (в px)',
    type: 'number',
    default: 192,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_padding',
    label: 'Внешний отступ карточек (в px)',
    type: 'number',
    default: 6,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_style',
    label: 'Стиль карточек',
    type: 'select',
    options: ['flat', 'glass', 'elevated'],
    default: 'flat',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'hover_effect',
    label: 'Эффект при наведении',
    type: 'select',
    options: ['none', 'scale', 'glow', 'border'],
    default: 'scale',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'hover_shadow',
    label: 'Тень при наведении',
    type: 'select',
    options: ['none', 'low', 'medium', 'high'],
    default: 'medium',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'cards_count',
    label: 'Количество карточек',
    type: 'number',
    default: 6,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
