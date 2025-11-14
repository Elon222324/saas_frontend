/**
 * Форматирует имя клиента, убирая "None" и пустые значения
 * @param {string} name - Исходное имя
 * @returns {string|null} - Отформатированное имя или null
 */
export function formatCustomerName(name) {
  console.log('🔍 formatCustomerName input:', { name, type: typeof name })
  
  if (!name) {
    console.log('❌ Empty/null name')
    return null
  }
  
  const trimmed = String(name).trim()
  
  // Разбиваем на части и отфильтровываем "None" (в любом регистре)
  const parts = trimmed.split(/\s+/).filter(part => part.toLowerCase() !== 'none')
  const result = parts.join(' ').trim()
  
  console.log('📝 After processing:', { original: trimmed, parts, result })
  
  // Если результат пуст - возвращаем null
  if (!result) {
    console.log('❌ Filtered out (empty after removing "none")')
    return null
  }
  
  console.log('✅ Returning:', result)
  return result
}

/**
 * Проверяет, есть ли валидное имя
 * @param {string} name - Имя для проверки
 * @returns {boolean}
 */
export function hasValidCustomerName(name) {
  return formatCustomerName(name) !== null
}

