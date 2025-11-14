export function MobileItemsList({ items }) {
  return (
    <div className="px-1.5 py-1 flex-1 overflow-y-auto bg-black/10 min-h-12">
      {items && items.length > 0 ? (
        <div className="space-y-0.5">
          {items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="text-gray-200 text-xs">
              <span className="font-bold text-yellow-400">{item.quantity}x</span> <span className="text-sm font-semibold">{item.product_title}</span>
              {item.extras && item.extras.length > 0 && (
                <div className="text-xs text-gray-400 ml-2">
                  {item.extras.slice(0, 1).map((extra, eidx) => (
                    <div key={eidx}>+ {extra.extra_name}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-xs text-gray-400">
              +{items.length - 2} ещё
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-xs">Товары не загружены</div>
      )}
    </div>
  )
}

