import { useEffect, useState } from 'react'

export const PreviewWrapper = ({ children, highlightKey }) => {
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    if (highlightKey === undefined) return
    setHighlight(true)
    const timer = setTimeout(() => setHighlight(false), 800)
    return () => clearTimeout(timer)
  }, [highlightKey])

  return (
    <div
      className={`w-full mx-auto rounded transition-all ${highlight ? 'preview-glow ring-2 ring-blue-400' : ''}`}
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
