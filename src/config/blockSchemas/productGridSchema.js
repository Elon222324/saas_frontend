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
    key: 'price_color',
    label: 'Цвет цены (десктоп)',
    type: 'color',
    default: '#212121',
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
  },
  {
    key: 'button_hover_color',
    label: 'Фон кнопки при наведении',
    type: 'color',
    default: '#1565C0',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_border_radius',
    label: 'Скругление карточки',
    type: 'number',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'card_shadow',
    label: 'Тень карточки',
    type: 'select',
    options: ['none', 'low', 'medium', 'high'],
    default: 'medium',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'font_size_name',
    label: 'Размер шрифта названия',
    type: 'fontsize',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'font_size_price',
    label: 'Размер шрифта цены',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'font_size_desc',
    label: 'Размер шрифта описания',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'columns_desktop',
    label: 'Кол-во колонок (десктоп)',
    type: 'number',
    default: 4,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'columns_tablet',
    label: 'Кол-во колонок (планшет)',
    type: 'number',
    default: 3,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'columns_mobile',
    label: 'Кол-во колонок (мобилка)',
    type: 'number',
    default: 2,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
