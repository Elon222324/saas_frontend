// src/pages/Sites/SiteSettings/Products/hooks/useCategories.js
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useCategories(siteName, options = {}) {
  return useQuery({
    queryKey: ['categories', siteName],
    /** -------------  здесь основной fetch ------------- **/
    queryFn: async () => {
      console.log('[useCategories] → запрашиваю:', `${API_URL}/products/${siteName}/categories/all`);

      const res = await fetch(
        `${API_URL}/products/${siteName}/categories/all`,
        { credentials: 'include' },
      );

      console.log('[useCategories] ← статус ответа:', res.status, res.statusText);

      if (!res.ok) {
        throw new Error('Не удалось получить категории');
      }

      const flat = await res.json();
      console.log('[useCategories] ← сырой JSON:', flat);

      const tree = buildTree(flat);
      console.log('[useCategories] ← построенное дерево:', tree);

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

  return root;
}
