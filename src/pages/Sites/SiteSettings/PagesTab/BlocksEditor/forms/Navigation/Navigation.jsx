export const Navigation = ({ settings, navigation }) => {
  const showBorder = settings?.show_border !== false

  return (
    <nav
      className="w-full border-b"
      style={{
        backgroundColor: 'var(--bg-color, var(--background-color, white))',
        color: 'var(--text-color, #000)',
        borderColor: showBorder ? 'var(--border-color, #ccc)' : 'transparent',
      }}
    >
      <ul className="flex gap-6 text-sm font-medium px-4 py-3">
        {navigation.map((item) => (
          <li key={item.id}>
            <a
              href={'#'}
              className="underline-offset-2 hover:underline"
              style={{
                color: 'var(--text-color, #000)',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--link-hover-color, #1d4ed8)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--text-color, #000)'
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
