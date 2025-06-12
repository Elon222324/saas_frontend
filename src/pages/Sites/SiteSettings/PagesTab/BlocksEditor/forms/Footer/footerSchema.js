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
  },
  {
    key: 'font_size_base',
    label: 'Размер шрифта',
    type: 'fontsize',
    default: 14,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'icon_color',
    label: 'Цвет иконок',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'icon_color_hover',
    label: 'Цвет иконок при наведении',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'section_spacing_top',
    label: 'Отступ сверху',
    type: 'number',
    default: 48,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'section_spacing_bottom',
    label: 'Отступ снизу',
    type: 'number',
    default: 48,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'alignment',
    label: 'Выравнивание секций',
    type: 'select',
    options: ['left', 'center', 'spread'],
    default: 'spread',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'show_sections',
    label: 'Показывать секции',
    type: 'multicheckbox',
    options: [
      { key: 'about', label: 'О компании' },
      { key: 'contacts', label: 'Контакты' },
      { key: 'socials', label: 'Соцсети' }
    ],
    default: {
      about: true,
      contacts: true,
      socials: true
    },
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'show_social_icons',
    label: 'Отображать соцсети',
    type: 'multicheckbox',
    options: [
      { key: 'facebook', label: 'Facebook' },
      { key: 'instagram', label: 'Instagram' },
      { key: 'vk', label: 'VK' },
      { key: 'youtube', label: 'YouTube' },
      { key: 'telegram', label: 'Telegram' },
      { key: 'twitter', label: 'Twitter' },
    ],
    default: {
      facebook: true,
      instagram: true,
      vk: true,
      youtube: true,
      telegram: true,
      twitter: true,
    },
    editable: true,
    visible_if: { custom_appearance: true },
  },
  {
    key: 'show_payment_icons',
    label: 'Показывать иконки оплат',
    type: 'boolean',
    default: true,
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
