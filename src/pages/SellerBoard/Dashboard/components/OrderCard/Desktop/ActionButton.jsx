export function DesktopActionButton() {
  const handleTakeOrder = () => {
    // TODO: Добавить логику взятия заказа в работу
    console.log('Заказ взят в работу')
  }

  return (
    <div className="px-3 py-3 border-t border-black/20">
      <button 
        onClick={handleTakeOrder}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded transition transform hover:scale-105 active:scale-100"
      >
        ✓ ВЗЯТЬ В РАБОТУ
      </button>
    </div>
  )
}

