// src/preview/blocks/Navigation.jsx

export const Navigation = ({ settings, navigation }) => {
  return (
    <nav className="flex gap-6 text-[var(--text-color)]">
      {navigation?.map((item) => (
        <a
          key={item.link}
          href={item.link}
          className="no-underline hover:underline"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
