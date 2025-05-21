import { Navigation } from './Navigation'

export default function NavigationPreview({ navigation }) {
  const mockNav = navigation?.length
    ? navigation
    : [
        { label: 'Главная', link: '/' },
        { label: 'О нас', link: '/about' },
        { label: 'Контакты', link: '/contact' },
      ]

  return (
    <div className="bg-white p-4 rounded border shadow">
      <Navigation settings={{}} navigation={mockNav} />
    </div>
  )
}
