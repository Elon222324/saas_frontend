import { useParams, useNavigate, Link } from 'react-router-dom'

export default function PageSelectHeader({ slug, data }) {
  const { domain } = useParams()
  const navigate = useNavigate()
  const pageInfo = data?.pages?.find(p => p.slug === slug)
  const pageId = pageInfo?.id

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Редактирование:</h1>
        <select
          value={slug}
          onChange={(e) => navigate(`/settings/${domain}/pages/${e.target.value}`)}
          className="border px-2 py-1 rounded-md bg-white shadow-sm"
        >
          {data.pages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title || p.slug}
            </option>
          ))}
        </select>
        {pageId && <span className="text-sm text-gray-500">ID страницы: {pageId}</span>}
      </div>
      <Link to={`/settings/${domain}/pages`} className="text-blue-600 hover:underline text-sm">
        ← Назад к списку
      </Link>
    </div>
  )
}
