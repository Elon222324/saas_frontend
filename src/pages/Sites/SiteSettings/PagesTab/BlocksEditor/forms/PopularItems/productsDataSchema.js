export const defaultPopularItems = [
  { name: 'Пепперони фреш', price: 'от 409 ₽', img: '/images/8.webp' },
  { name: '3 пиццы 30 см', price: '1 449 ₽', img: '/images/8.webp' },
  { name: '2 соуса', price: '75 ₽', img: '/images/8.webp' },
  { name: 'Товар 4', price: '', img: '/images/8.webp' },
  { name: 'Товар 5', price: '', img: '/images/8.webp' },
  { name: 'Товар 6', price: '', img: '/images/8.webp' },
]

export const createProductsDataSchema = (count = 3) => {
  const schema = [
    {
      key: 'title',
      label: 'Заголовок блока',
      type: 'text',
      default: 'Часто заказывают',
      editable: true,
    },
  ]

  for (let i = 1; i <= count; i++) {
    const base = defaultPopularItems[i - 1] || {
      name: `Товар ${i}`,
      price: '',
      img: '/images/8.webp',
    }

    schema.push(
      {
        key: `item${i}_name`,
        label: `Название ${i}-го товара`,
        type: 'text',
        default: base.name,
        editable: true,
      },
      {
        key: `item${i}_price`,
        label: `Цена ${i}-го товара`,
        type: 'text',
        default: base.price,
        editable: true,
      },
      {
        key: `item${i}_img`,
        label: `Изображение ${i}-го товара`,
        type: 'image',
        category: 'Популярные товары',
        default: base.img,
        editable: true,
      },
    )
  }

  return schema
}

export const productsDataSchema = createProductsDataSchema(6)
