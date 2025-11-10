export const createProductsDataSchema = (count = 3) => {
  const schema = [
    {
      key: 'title',
      label: 'Заголовок блока',
      type: 'text',
      default: 'Часто заказывают',
      editable: true,
    },
    {
      key: 'items',
      label: 'Товары для блока',
      type: 'products_select',
      default: [],
      editable: true,
      maxItems: count,
    },
  ]

  return schema
}

export const productsDataSchema = createProductsDataSchema(6)
