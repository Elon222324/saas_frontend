// src/preview/blocks/Navigation.jsx

export const Navigation = ({ navigation }) => {
  return (
    <nav
      className="
        flex flex-wrap gap-6 
        text-[var(--text-color)] 
        bg-[var(--background-color)] 
        px-[var(--container-padding)] 
        py-4 
        rounded-[var(--border-radius)]
        shadow-[var(--shadow-level)]
        font-sans
      "
    >
      {navigation.map((item, index) => (
        <a
          key={item.link || index}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="
            no-underline 
            hover:underline 
            text-[var(--text-color)] 
            transition-all 
            duration-[var(--transition-duration)]
            text-base
            cursor-default
          "
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
