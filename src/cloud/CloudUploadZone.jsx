export default function CloudUploadZone() {
  return (
    <div className="border-2 border-dashed rounded p-6 text-center space-y-2">
      <p className="text-sm text-gray-500">Перетащите файлы или нажмите, чтобы выбрать</p>
      <button className="px-3 py-1 bg-blue-600 text-white rounded">📥 Загрузить с компьютера</button>
    </div>
  )
}
