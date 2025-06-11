export const defaultQuickInfoItems = [
  { title: 'Мин. заказ на доставку', desc: 'от 500 руб.' },
  { title: 'Стоимость доставки', desc: 'от 100 руб.' },
  { title: 'Время доставки', desc: 'до 59 мин.' },
  { title: 'Скидка за самовывоз', desc: '−10%' },
]

export const createQuickInfoDataSchema = (count = 4) => {
  const schema = []
  for (let i = 1; i <= count; i++) {
    const base = defaultQuickInfoItems[i - 1] || {
      title: `Заголовок ${i}`,
      desc: `Описание ${i}`,
    }

    schema.push(
      {
        key: `title${i}`,
        label: `Заголовок ${i}`,
        type: 'text',
        default: base.title,
        editable: true,
      },
      {
        key: `desc${i}`,
        label: `Описание ${i}`,
        type: 'text',
        default: base.desc,
        editable: true,
      },
    )
  }

  return schema
}

export const quickInfoDataSchema = createQuickInfoDataSchema(4)
