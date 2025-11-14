export function DesktopItemsList({ items }) {
  return (
    <div className="px-3 py-2 flex-1 overflow-y-auto bg-black/10 min-h-24">
      {items && items.length > 0 ? (
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <div key={idx} className="text-gray-200 text-sm">
              <span className="font-bold text-yellow-400">{item.quantity}x</span> <span className="text-base font-semibold">{item.product_title}</span>
              {item.extras && item.extras.length > 0 && (
                <div className="text-xs text-gray-400 ml-4">
                  {item.extras.map((extra, eidx) => (
                    <div key={eidx}>+ {extra.extra_name}</div>
                  ))}
                </div>
              )}
              {item.item_comment && (
                <div className="text-xs text-cyan-300 ml-4 italic">
                  "{item.item_comment}"
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-xs">Товары не загружены</div>
      )}
    </div>
  )
}

