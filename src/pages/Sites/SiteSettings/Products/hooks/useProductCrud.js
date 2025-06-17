import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Унифицированный разбор ответа + логирование
 */
const handleResponse = async (res, failMsg, tag) => {
  // лог статуса
  console.debug(`[useProductCrud] ${tag} ← status`, res.status)

  if (res.ok) {
    const data = await res.json().catch(() => null)
    console.debug(`[useProductCrud] ${tag} ← data`, data)
    return data
  }

  // пытаемся прочитать body, чтобы показать причину 422/400
  let errTxt = failMsg
  try {
    const txt = await res.text()
    errTxt = txt || failMsg
    console.warn(`[useProductCrud] ${tag} ← error body`, txt)
  } catch {}

  const err = new Error(errTxt)
  err.status = res.status
  throw err
}

export function useProductCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: (payload) => {
      console.debug('[useProductCrud] add →', payload)
      return fetch(`${API_URL}/products/${siteName}/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((res) => handleResponse(res, 'Ошибка создания товара', 'add'))
    },
    onSuccess: () => {
      console.debug('[useProductCrud] add ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  const update = useMutation({
    mutationFn: ({ id, ...rest }) => {
      console.debug('[useProductCrud] update →', { id, ...rest })
      return fetch(`${API_URL}/products/${siteName}/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      }).then((res) => handleResponse(res, 'Ошибка обновления товара', 'update'))
    },
    onSuccess: () => {
      console.debug('[useProductCrud] update ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  const remove = useMutation({
    mutationFn: (id) => {
      console.debug('[useProductCrud] delete →', id)
      return fetch(`${API_URL}/products/${siteName}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then((res) => handleResponse(res, 'Ошибка удаления товара', 'delete'))
    },
    onSuccess: () => {
      console.debug('[useProductCrud] delete ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  return { add, update, remove }
}
