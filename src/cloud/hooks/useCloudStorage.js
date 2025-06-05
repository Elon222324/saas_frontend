import { useState } from 'react'

export default function useCloudStorage() {
  const [selected, setSelected] = useState(null)

  const categories = ['logo', 'pizza', 'drinks']

  const files = [
    { id: 1, name: 'logo1.png', url: 'https://via.placeholder.com/150', category: 'logo' },
    { id: 2, name: 'logo2.png', url: 'https://via.placeholder.com/150', category: 'logo' },
    { id: 3, name: 'pizza1.png', url: 'https://via.placeholder.com/150', category: 'pizza' },
    { id: 4, name: 'pizza2.png', url: 'https://via.placeholder.com/150', category: 'pizza' },
    { id: 5, name: 'drink1.png', url: 'https://via.placeholder.com/150', category: 'drinks' },
    { id: 6, name: 'drink2.png', url: 'https://via.placeholder.com/150', category: 'drinks' },
    { id: 7, name: 'drink3.png', url: 'https://via.placeholder.com/150', category: 'drinks' },
    { id: 8, name: 'other.png', url: 'https://via.placeholder.com/150', category: 'logo' },
    { id: 9, name: 'sample.png', url: 'https://via.placeholder.com/150', category: 'pizza' },
  ]

  const used = 73.2
  const limit = 200

  return { categories, files, selected, setSelected, used, limit }
}
