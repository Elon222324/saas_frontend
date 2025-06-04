// src/utils/applyCssVariables.js

export function applyCssVariablesFromUiSchema(uiSchema) {
  if (!Array.isArray(uiSchema)) return

  const needsPx = ['font_size_base', 'max_width', 'container_padding', 'border_radius']

  const common = Object.fromEntries(
    uiSchema.map(({ key, value }) => [key, value])
  )

  for (const [key, value] of Object.entries(common)) {
    const cssKey = `--${key.replace(/_/g, '-')}`
    const cssValue = needsPx.includes(key) ? `${value}px` : value
    document.documentElement.style.setProperty(cssKey, cssValue)
  }

  const oldStyle = document.querySelector('style[data-from="custom_css"]')
  if (oldStyle) oldStyle.remove()

  if (common.custom_css) {
    const styleTag = document.createElement('style')
    styleTag.setAttribute('data-from', 'custom_css')
    styleTag.innerHTML = common.custom_css
    document.head.appendChild(styleTag)
  }
}
