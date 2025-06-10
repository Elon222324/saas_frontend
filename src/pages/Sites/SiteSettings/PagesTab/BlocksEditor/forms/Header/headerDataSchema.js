export const headerDataSchema = [
  {
    key: 'logo_url',
    label: 'Логотип',
    type: 'image',
    default: '/images/logo.webp',
    editable: true,
  },
  {
    key: 'subtitle',
    label: 'Подзаголовок (сеть или описание)',
    type: 'text',
    default: 'Ваша сеть / описание',
    editable: true,
  },
  {
    key: 'label_before_city',
    label: 'Текст перед городом',
    type: 'text',
    default: 'Доставка',
    editable: true,
  },
  {
    key: 'city',
    label: 'Город',
    type: 'text',
    default: 'Ваш Город',
    editable: true,
  },
  {
    key: 'delivery_time',
    label: 'Время доставки',
    type: 'text',
    default: '33 мин',
    editable: true,
  },
  {
    key: 'rating_value',
    label: 'Рейтинг',
    type: 'text',
    default: '4.82',
    editable: true,
  }
]