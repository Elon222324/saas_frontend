// src/components/BlockForms/utils/initBlockAppearanceFromCommon.js

export function initBlockAppearanceFromCommon(schema, common = {}) {
  const result = {}

  for (const field of schema) {
    if (field.visible === false) continue
    result[field.key] = common[field.key] ?? field.default ?? ''
  }

  return result
}
