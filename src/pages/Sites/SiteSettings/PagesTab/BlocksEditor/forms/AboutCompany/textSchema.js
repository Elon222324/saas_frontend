export const textSchema = [
  {
    key: 'custom_appearance',
    label: 'Изменить внешний вид блока (фон и цвета)',
    type: 'boolean',
    default: false,
    editable: true
  },
  {
    key: 'background_color',
    label: 'Фон блока',
    type: 'color',
    default: '#FFFFFF',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_color',
    label: 'Цвет основного текста',
    type: 'color',
    default: '#212121',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'subtle_text_color',
    label: 'Цвет вторичного текста (пояснение)',
    type: 'color',
    default: '#6B7280',
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'padding_top',
    label: 'Отступ сверху (px)',
    type: 'number',
    default: 48,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'padding_bottom',
    label: 'Отступ снизу (px)',
    type: 'number',
    default: 48,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'title_font_size',
    label: 'Размер заголовка (px)',
    type: 'fontsize',
    default: 24,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'desc_font_size',
    label: 'Размер описания (px)',
    type: 'fontsize',
    default: 16,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'max_width',
    label: 'Максимальная ширина контейнера (px)',
    type: 'number',
    default: 768,
    editable: true,
    visible_if: { custom_appearance: true }
  },
  {
    key: 'text_align',
    label: 'Выравнивание текста',
    type: 'select',
    options: ['left', 'center', 'right'],
    default: 'center',
    editable: true,
    visible_if: { custom_appearance: true }
  }
]
