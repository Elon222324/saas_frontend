// PageSelectHeader.jsx
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SaveButton from "@/components/ui/SaveButton"; // Импортируем новый компонент

export default function PageSelectHeader({ slug, data, hasUnsaved, onSave }) {
  const { domain } = useParams();
  const navigate = useNavigate();

  const pageInfo = useMemo(() => data?.pages?.find(p => p.slug === slug), [data, slug]);
  const pageId = pageInfo?.id;
  const pages = data?.pages || [];

  return (
    <>
      {/* Кнопка теперь — отдельный, самодостаточный компонент */}
      <SaveButton isVisible={hasUnsaved} onSave={onSave} />

      {/* Заголовок (часть, которая скроллится) */}
      <div className="bg-white pt-4 pb-3 px-6 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap"> {/* Добавлен flex-wrap для мобильных */}
          <h1 className="text-xl font-bold whitespace-nowrap">Редактирование:</h1>
          
          {/* Улучшение доступности (a11y) */}
          <label htmlFor="page-select" className="sr-only">Выберите страницу для редактирования</label>
          <select
            id="page-select" // id для связи с label
            value={slug}
            onChange={(e) => navigate(`/settings/${domain}/pages/${e.target.value}`)}
            className="border px-2 py-1 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {/* Можно добавить состояние загрузки */}
            {pages.length === 0 && <option>Загрузка...</option>}
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title || p.slug}
              </option>
            ))}
          </select>
          
          {pageId && <span className="text-sm text-gray-500 hidden md:inline">ID: {pageId}</span>}
        </div>
      </div>
    </>
  );
}