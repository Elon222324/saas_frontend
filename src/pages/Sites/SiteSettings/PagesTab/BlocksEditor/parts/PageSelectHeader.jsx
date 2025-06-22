import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SaveButton from "@/components/ui/SaveButton";

export default function PageSelectHeader({ slug, data, hasUnsaved, onSave }) {
  const { domain } = useParams();
  const navigate = useNavigate();

  const pageInfo = useMemo(() => data?.pages?.find(p => p.slug === slug), [data, slug]);
  const pageId = pageInfo?.id;
  const pages = data?.pages || [];

  return (
    <>
      <SaveButton isVisible={hasUnsaved} onSave={onSave} />

      <div className="bg-white pt-0 pb-3 px-6 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold whitespace-nowrap">Редактирование:</h1>

          <label htmlFor="page-select" className="sr-only">Выберите страницу для редактирования</label>
          <select
            id="page-select"
            value={slug}
            onChange={(e) => navigate(`/settings/${domain}/pages/${e.target.value}`)}
            className="border px-2 py-1 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
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
