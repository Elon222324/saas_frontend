// src/cloud/hooks/useTemplateGallery.js

export default function useTemplateGallery() {
  const groups = [
    {
      title: 'Пиццы',
      categories: ['classic', 'veggie', 'pepperoni'],
    },
    {
      title: 'Напитки',
      categories: ['cola', 'juice', 'water'],
    },
  ]

  const files = [
    { id: 'g1', name: 'classic1.jpg', url: 'https://via.placeholder.com/150?text=Classic+Pizza', category: 'classic' },
    { id: 'g2', name: 'veggie1.jpg', url: 'https://via.placeholder.com/150?text=Veggie+Pizza', category: 'veggie' },
    { id: 'g3', name: 'pepperoni1.jpg', url: 'https://via.placeholder.com/150?text=Pepperoni', category: 'pepperoni' },
    { id: 'g4', name: 'cola.jpg', url: 'https://via.placeholder.com/150?text=Cola', category: 'cola' },
    { id: 'g5', name: 'juice.jpg', url: 'https://via.placeholder.com/150?text=Juice', category: 'juice' },
    { id: 'g6', name: 'water.jpg', url: 'https://via.placeholder.com/150?text=Water', category: 'water' },
  ]

  return { groups, files }
}
