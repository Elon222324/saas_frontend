import CloudFileCard from './CloudFileCard'

export default function CloudGrid({ files, selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {files.map(file => (
        <CloudFileCard
          key={file.id}
          file={file}
          isSelected={selected?.id === file.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
