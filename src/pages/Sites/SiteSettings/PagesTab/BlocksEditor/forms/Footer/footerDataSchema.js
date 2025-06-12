export const createFooterDataSchema = (
  showSocialIcons = {
    facebook: true,
    instagram: true,
    vk: true,
    youtube: true,
    telegram: true,
    twitter: true,
  },
) => {
  const schema = [
    {
      key: 'about_text',
      label: 'Текст «О компании»',
      type: 'textarea',
      default:
        'Мы доставляем горячую пиццу с любовью. Работаем с 10:00 до 23:00 каждый день.',
      editable: true,
    },
    {
      key: 'phone_number',
      label: 'Телефон',
      type: 'text',
      default: '+84 123 456 789',
      editable: true,
    },
    {
      key: 'email_address',
      label: 'Email',
      type: 'text',
      default: 'support@pizzadelivery.vn',
      editable: true,
    },
    {
      key: 'copyright_text',
      label: 'Текст копирайта',
      type: 'text',
      default: 'PizzaDelivery. Все права защищены.',
      editable: true,
    },
  ]

  const socialFields = [
    { key: 'facebook_link', label: 'Ссылка Facebook', type: 'text', default: '#', editable: true },
    { key: 'instagram_link', label: 'Ссылка Instagram', type: 'text', default: '#', editable: true },
    { key: 'vk_link', label: 'Ссылка VK', type: 'text', default: '#', editable: true },
    { key: 'youtube_link', label: 'Ссылка YouTube', type: 'text', default: '#', editable: true },
    { key: 'telegram_link', label: 'Ссылка Telegram', type: 'text', default: '#', editable: true },
    { key: 'twitter_link', label: 'Ссылка Twitter', type: 'text', default: '#', editable: true },
  ]

  socialFields.forEach(field => {
    const iconKey = field.key.replace('_link', '')
    if (showSocialIcons?.[iconKey] !== false) {
      schema.push(field)
    }
  })

  return schema
}

export const footerDataSchema = createFooterDataSchema()
