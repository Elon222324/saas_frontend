// src/preview/PreviewWrapper.jsx

export const PreviewWrapper = ({ children }) => {
  return (
    <div
      className="w-full mx-auto"
      style={{
        maxWidth: 'var(--max-width)',
        padding: '0 var(--container-padding)',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size-base)',
        lineHeight: 'var(--line-height)',
      }}
    >
      {children}
    </div>
  )
}
