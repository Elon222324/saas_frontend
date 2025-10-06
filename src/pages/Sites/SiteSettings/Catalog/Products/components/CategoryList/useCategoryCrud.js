// src/pages/Sites/SiteSettings/Products/hooks/useCategoryCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../../context/SiteSettingsContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useCategoryCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '');
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/categories/`;

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async ({ slug, name, parent_id, code, description, image_url, display_order }) => {
      const body = {
        slug,
        name,
        parent_id: parent_id || null,
        is_active: true,
      }
      
      // Добавляем опциональные поля только если они переданы
      if (code) body.code = code
      if (description) body.description = description
      if (image_url) body.image_url = image_url
      if (display_order !== undefined) body.display_order = display_order
      
      console.log('🔑 [useCategoryCrud] → создаю категорию:', baseApiUrl);
      console.log('🔑 [useCategoryCrud] → данные:', body);
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token;
      if (!adminToken) {
        console.error('❌ [useCategoryCrud] Админский токен сайта отсутствует (create)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      
      console.log('🔑 [useCategoryCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useCategoryCrud] Ошибка аутентификации (401)');
          throw new Error('Ошибка аутентификации. Проверьте токен.');
        }
        if (res.status === 409) {
          console.error('❌ [useCategoryCrud] Конфликт (409) - категория уже существует');
          throw new Error('Категория с таким slug уже существует');
        }
        throw new Error(`Ошибка создания категории: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json();
      console.log('✅ [useCategoryCrud] ← создана категория:', result);
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, slug, name, parent_id, code, description, image_url, display_order }) => {
      const body = {
        slug,
        name,
        parent_id: parent_id || null,
      }
      
      // Добавляем опциональные поля только если они переданы
      if (code) body.code = code
      if (description) body.description = description
      if (image_url) body.image_url = image_url
      if (display_order !== undefined) body.display_order = display_order
      
      const updateUrl = `${baseApiUrl}${id}`;
      console.log('🔑 [useCategoryCrud] → обновляю категорию:', updateUrl);
      console.log('🔑 [useCategoryCrud] → данные:', body);
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token;
      if (!adminToken) {
        console.error('❌ [useCategoryCrud] Админский токен сайта отсутствует (update)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      
      console.log('🔑 [useCategoryCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useCategoryCrud] Ошибка аутентификации (401)');
          throw new Error('Ошибка аутентификации. Проверьте токен.');
        }
        if (res.status === 404) {
          console.error('❌ [useCategoryCrud] Категория не найдена (404)');
          throw new Error('Категория не найдена');
        }
        if (res.status === 409) {
          console.error('❌ [useCategoryCrud] Конфликт (409) - категория уже существует');
          throw new Error('Категория с таким slug уже существует');
        }
        throw new Error(`Ошибка обновления категории: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json();
      console.log('✅ [useCategoryCrud] ← обновлена категория:', result);
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const deleteUrl = `${baseApiUrl}${id}`;
      console.log('🔑 [useCategoryCrud] → удаляю категорию:', deleteUrl);
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token;
      if (!adminToken) {
        console.error('❌ [useCategoryCrud] Админский токен сайта отсутствует (delete)');
        throw new Error('Токен сайта не получен');
      }
      
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        credentials: 'include',
      })
      
      console.log('🔑 [useCategoryCrud] ← статус ответа:', res.status, res.statusText);
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useCategoryCrud] Ошибка аутентификации (401)');
          throw new Error('Ошибка аутентификации. Проверьте токен.');
        }
        if (res.status === 404) {
          console.error('❌ [useCategoryCrud] Категория не найдена (404)');
          throw new Error('Категория не найдена');
        }
        throw new Error(`Ошибка удаления категории: ${res.status} ${res.statusText}`)
      }
      
      console.log('✅ [useCategoryCrud] ← категория удалена');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
