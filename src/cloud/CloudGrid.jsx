import CloudFileCard from './CloudFileCard'

export default function CloudGrid({ files, selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {files.map(file => (
        <button
          key={file.id}
          onClick={() => onSelect(file)}
          className={`flex flex-col items-center border rounded overflow-hidden shadow hover:shadow-md transition bg-white ${
            selected?.id === file.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="w-full h-[120px] bg-gray-50 flex items-center justify-center">
            <img
              src={file.url}
              alt={file.filename}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="px-2 py-1 w-full text-xs text-center text-gray-700 truncate border-t">
            {file.filename}
          </div>
        </button>
      ))}
    </div>
  )
}
