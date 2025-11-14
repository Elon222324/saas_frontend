export function TabletItemsList({ items }) {
  return (
    <div className="px-2 py-1 flex-1 overflow-y-auto bg-black/10 min-h-16">
      {items && items.length > 0 ? (
        <div className="space-y-0.5">
          {items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="text-gray-200 text-xs">
              <span className="font-bold text-yellow-400">{item.quantity}x</span> <span className="text-sm font-semibold">{item.display_name || item.product_title}</span>
              {item.extras && item.extras.length > 0 && (
                <div className="text-xs text-gray-400 ml-3">
                  {item.extras.map((extra, eidx) => (
                    <div key={eidx}>+ {extra.extra_name}</div>
                  ))}
                </div>
              )}
              {item.item_comment && (
                <div className="text-xs text-cyan-300 ml-3 italic">
                  "{item.item_comment}"
                </div>
              )}
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-xs text-gray-400">
              +{items.length - 3} ещё
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-xs">Товары не загружены</div>
      )}
    </div>
  )
}

