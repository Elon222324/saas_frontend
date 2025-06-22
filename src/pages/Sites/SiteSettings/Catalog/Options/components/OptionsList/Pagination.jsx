export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 text-sm">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`rounded px-2 py-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
            page === i + 1 ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
      >
        &gt;
      </button>
    </div>
  )
}
