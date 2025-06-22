// FILE: src/pages/Sites/SiteSettings/Products/hooks/useLabelCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useLabelCrud(siteName) {
  const qc = useQueryClient()

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (labelData) => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/labels/add`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(labelData),
        },
      )
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка создания метки');
      }
      // Бэкенд возвращает {"message": "...", "site_response": ...}
      return res.json(); // Возвращаем весь ответ, React Query сам обработает его
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, ...labelData }) => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/labels/update/${id}`, // label_id
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(labelData),
        },
      )
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка обновления метки');
      }
      // Бэкенд возвращает {"message": "...", "site_response": ...}
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['labels', siteName] });
    },
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/labels/delete/${id}`, // label_id
        { method: 'DELETE', credentials: 'include' },
      )
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка удаления метки');
      }
      // Бэкенд возвращает {"message": "...", "site_response": ...}
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* FETCH ALL LABELS -------------------------------------------------------- */
  const getLabels = async () => {
    // ИСПРАВЛЕНИЕ: Изменен эндпоинт для получения всех меток
    const res = await fetch(`${API_URL}/products/${siteName}/labels/all`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Ошибка загрузки меток');
    }
    // Бэкенд возвращает чистый массив меток для 'all' эндпоинта
    return res.json();
  };


  return { add, update, remove, getLabels }
}