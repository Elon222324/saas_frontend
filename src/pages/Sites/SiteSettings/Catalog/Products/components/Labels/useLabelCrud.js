// src/pages/Sites/SiteSettings/Catalog/Products/components/Labels/useLabelCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../../context/SiteSettingsContext'

export function useLabelCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  const siteNameForApi = siteName.replace('_app', '');
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/labels/`;

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async ({ name, bg_color, text_color, is_active, sort_order }) => {
      const body = {
        name,
        bg_color,
        text_color,
        is_active,
        sort_order,
      }
      
      console.log('🔑 [useLabelCrud] → создаю метку:', baseApiUrl);
      console.log('🔑 [useLabelCrud] → данные:', body);
      
      if (!siteToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (create)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      
      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`Ошибка создания метки: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json();
      console.log('✅ [useLabelCrud] ← создана метка:', result);
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      
      const updateUrl = `${baseApiUrl}${id}`;
      console.log('🔑 [useLabelCrud] → обновляю метку:', updateUrl);
      console.log('🔑 [useLabelCrud] → данные:', updateData);
      
      if (!siteToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (update)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })
      
      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`Ошибка обновления метки: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json();
      console.log('✅ [useLabelCrud] ← обновлена метка:', result);
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const deleteUrl = `${baseApiUrl}${id}`;
      console.log('🔑 [useLabelCrud] → удаляю метку:', deleteUrl);
      
      if (!siteToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (delete)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
        },
        credentials: 'include',
      })
      
      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`Ошибка удаления метки: ${res.status} ${res.statusText}`)
      }
      
      console.log('✅ [useLabelCrud] ← метка удалена');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  return { add, update, remove }
}
