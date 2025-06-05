export const productsDataSchema = [
  {
    key: 'title',
    label: 'Заголовок блока',
    type: 'text',
    default: 'Часто заказывают',
    editable: true,
  },
  {
    key: 'items',
    label: 'Популярные товары',
    type: 'array',
    default: [
      { id: 1, name: 'Пепперони фреш', price: 'от 409 ₽' },
      { id: 2, name: '3 пиццы 30 см', price: '1 449 ₽' },
      { id: 3, name: '2 соуса', price: '75 ₽' },
    ],
    editable: true,
  },
]
