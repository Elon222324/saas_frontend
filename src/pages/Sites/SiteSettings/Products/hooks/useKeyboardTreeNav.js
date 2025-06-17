// src/pages/Sites/SiteSettings/Products/hooks/useKeyboardTreeNav.js
import { useEffect } from 'react'

/**
 * Стрелочная навигация по элементам с атрибутом `data-kb-item`.
 *
 * @param {React.RefObject<HTMLElement>} ref   – контейнер, внутри которого ищем элементы
 * @param {Array|any}                    deps  – зависимости для повторной привязки.
 *                                              Можно передать массив **или** одно значение.
 */
export function useKeyboardTreeNav(ref, deps = []) {
  // Позволяем передавать как массив, так и одиночное значение
  const depArray = Array.isArray(deps) ? deps : [deps]

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = () => root.querySelectorAll('[data-kb-item]')

    const onKey = (e) => {
      const all = items()
      const idx = Array.from(all).indexOf(document.activeElement)

      if (e.key === 'ArrowDown' && idx < all.length - 1) {
        e.preventDefault()
        all[idx + 1].focus()
      }
      if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault()
        all[idx - 1].focus()
      }
      if (e.key === 'ArrowRight' && document.activeElement.dataset.kbCollapse === 'true') {
        e.preventDefault()
        document.activeElement.click()
      }
      if (e.key === 'ArrowLeft' && document.activeElement.dataset.kbExpand === 'true') {
        e.preventDefault()
        document.activeElement.click()
      }
    }

    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depArray)      // ✅ React теперь всегда получает МАССИВ зависимостей
}
