import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Унифицированный разбор ответа: если статус не OK —
 * бросаем Error с полем `status`, чтобы верхний уровень мог понять 409/403/500.
 */
const handleResponse = async (res, failMsg) => {
  if (res.ok) return res.json()
  const txt = await res.text().catch(() => '')
  const err = new Error(txt || failMsg)
  err.status = res.status
  throw err
}

export function useProductCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: (payload) =>
      fetch(`${API_URL}/products/${siteName}/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => handleResponse(res, 'Ошибка создания товара')),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  const update = useMutation({
    mutationFn: ({ id, ...rest }) =>
      fetch(`${API_URL}/products/${siteName}/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      }).then((res) => handleResponse(res, 'Ошибка обновления товара')),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  const remove = useMutation({
    mutationFn: (id) =>
      fetch(`${API_URL}/products/${siteName}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then((res) => handleResponse(res, 'Ошибка удаления товара')),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  return { add, update, remove }
}
