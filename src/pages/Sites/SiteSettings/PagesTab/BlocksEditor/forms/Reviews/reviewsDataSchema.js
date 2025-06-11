export const defaultReviews = [
  { id: 1, name: 'Анна', text: 'Пицца 🔥. Приехала за 20 минут. Уже второй раз беру!', rating: 5 },
  { id: 2, name: 'Игорь', text: 'Пробовал во всех районах — тут самая мягкая корка!', rating: 4 },
  { id: 3, name: 'Света', text: 'Курьер вежливый, всё горячее. Спасибо!', rating: 5 },
  { id: 4, name: 'Макс', text: 'Брал на вечеринку — все в восторге!', rating: 5 },
]

export const createReviewsDataSchema = (count = 4) => {
  const schema = []
  for (let i = 1; i <= count; i++) {
    const base = defaultReviews[i - 1] || { name: `Имя ${i}`, text: `Отзыв ${i}`, rating: 5 }
    schema.push(
      {
        key: `review${i}_name`,
        label: `Имя ${i}`,
        type: 'text',
        default: base.name,
        editable: true,
      },
      {
        key: `review${i}_text`,
        label: `Отзыв ${i}`,
        type: 'text',
        default: base.text,
        editable: true,
      },
      {
        key: `review${i}_rating`,
        label: `Рейтинг ${i}`,
        type: 'number',
        default: base.rating,
        editable: true,
      },
      {
        key: `review${i}_img`,
        label: `Аватар ${i}`,
        type: 'image',
        default: '/images/6.webp',
        editable: true,
      },
    )
  }

  return schema
}

export const reviewsDataSchema = createReviewsDataSchema(4)
