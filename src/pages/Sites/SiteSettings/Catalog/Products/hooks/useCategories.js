// src/pages/Sites/SiteSettings/Products/hooks/useCategories.js
import { useQuery } from '@tanstack/react-query';
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useCategories(siteName, options = {}) {
  const { siteToken } = useSiteSettings();
  
  return useQuery({
    queryKey: ['categories', siteName, siteToken?.token],
    enabled: Boolean(siteToken?.token) && (options?.enabled ?? true),
    /** -------------  здесь основной fetch ------------- **/
    queryFn: async () => {
      // Убираем суффикс _app для нового API
      const siteNameForApi = siteName.replace('_app', '');
      const newApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/categories/`;
      
      console.log('🔑 [useCategories] → запрашиваю новый API:', newApiUrl);
      console.log('🔑 [useCategories] → используем админский JWT токен для аутентификации');

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token;
      if (!adminToken) {
        console.error('❌ [useCategories] Админский токен сайта отсутствует');
        throw new Error('Токен сайта не получен');
      }

      // Пытаемся прочитать клеймы токена (base64url) для проверки user_id и site_name
      try {
        const payloadPart = adminToken.split('.')[1]
        const json = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')))
        console.log('🧾 [useCategories] Claims:', { user_id: json.user_id, site_name: json.site_name, exp: json.exp })
      } catch {}

      const res = await fetch(newApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('🔑 [useCategories] ← статус ответа:', res.status, res.statusText);

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useCategories] Ошибка аутентификации (401)');
          throw new Error('Ошибка аутентификации. Проверьте токен.');
        }
        throw new Error(`Не удалось получить категории: ${res.status} ${res.statusText}`);
      }

      const flat = await res.json();
      console.log('✅ [useCategories] ← сырой JSON:', flat);

      const tree = buildTree(flat);
      console.log('✅ [useCategories] ← построенное дерево:', tree);

      return tree;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/* helpers */
function buildTree(list) {
  const byId = new Map();
  const root = [];

  list.forEach((row) => byId.set(row.id, { ...row, children: [] }));

  list.forEach((row) => {
    const node = byId.get(row.id);
    if (row.parent_id) {
      byId.get(row.parent_id)?.children.push(node);
    } else {
      root.push(node);
    }
  });

  const calcTotal = (node) => {
    let sum = node.count ?? 0;
    if (node.children?.length) {
      node.children.forEach((c) => {
        sum += calcTotal(c);
      });
    }
    node.count = sum;
    return sum;
  };

  root.forEach(calcTotal);

  return root;
}
