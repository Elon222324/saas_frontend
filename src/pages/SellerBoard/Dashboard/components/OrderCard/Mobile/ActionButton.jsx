export function MobileActionButton() {
  const handleTakeOrder = () => {
    // TODO: Добавить логику взятия заказа в работу
    console.log('Заказ взят в работу')
  }

  return (
    <div className="px-1.5 py-1 border-t border-black/20">
      <button 
        onClick={handleTakeOrder}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-1.5 rounded transition"
      >
        ✓ ВЗЯТЬ
      </button>
    </div>
  )
}

