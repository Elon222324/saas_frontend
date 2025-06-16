export const bannerDataSchema = [
  {
    key: 'title_text',
    label: 'Заголовок',
    type: 'text',
    default: 'Дарим подарки',
    editable: true,
  },
  {
    key: 'subtitle_text',
    label: 'Подзаголовок',
    type: 'text',
    default: 'Выбирай на свой вкус из нашего ассортимента!',
    editable: true,
  },
  {
    key: 'button_text',
    label: 'Текст кнопки',
    type: 'text',
    default: 'Подробнее',
    editable: true,
  },
  {
    key: 'image_url',
    label: 'Изображение',
    type: 'image',
    category: 'banners',
    default: '/images/1.png',
    editable: true,
  },
]
