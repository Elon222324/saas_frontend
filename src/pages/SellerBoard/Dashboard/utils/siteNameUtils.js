const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'

/**
 * Очищает siteName от суффикса контейнера
 * @param {string} siteName - Исходное имя сайта
 * @returns {string} Очищенное имя сайта
 */
export const cleanSiteName = (siteName) => {
  if (!siteName) return siteName
  return siteName.endsWith(containerSuffix) ? siteName.slice(0, -containerSuffix.length) : siteName
}

