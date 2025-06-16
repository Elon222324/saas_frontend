// FILE: src/components/ui/sheet.jsx
import * as React from 'react'

export function Sheet({ children, open, onOpenChange }) {
  return <div>{open ? children : null}</div>
}

export function SheetTrigger({ children, ...props }) {
  return <button {...props}>{children}</button>
}

export function SheetContent({ children, className }) {
  return (
    <div className={className} style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 50 }}>
      {children}
    </div>
  )
}
