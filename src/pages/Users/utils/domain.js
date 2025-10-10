export const baseDomain = import.meta.env.VITE_BASE_DOMAIN
export const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'

export function stripAppSuffix(value, suffix = containerSuffix) {
  if (!value) return value
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value
}


