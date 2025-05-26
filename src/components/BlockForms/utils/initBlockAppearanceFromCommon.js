// src/components/BlockForms/utils/initBlockAppearanceFromCommon.js

export function initBlockAppearanceFromCommon(schema, common = {}) {
  const result = {}

  for (const field of schema) {
    if (
      field.key !== 'custom_appearance' &&
      field.visible_if?.custom_appearance === true
    ) {
      result[field.key] = common[field.key] ?? field.default ?? ''
    }
  }

  return result
}
