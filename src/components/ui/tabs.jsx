export function Tabs({ value, onChange, children }) {
  return (
    <div className="bg-white px-2 rounded-t shadow-sm mb-4">
      <div className="flex space-x-2">
        {children.map((child) => {
          const isActive = child.props.value === value
          return (
            <button
              key={child.props.value}
              onClick={() => onChange(child.props.value)}
              className={`px-4 py-2 rounded-t text-sm transition-colors ${
                isActive
                  ? 'bg-white border border-b-0 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {child.props.children}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Tab({ children }) {
  return <>{children}</>
}
