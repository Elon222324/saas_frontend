import BlockDetails from '@/components/BlockDetails'

export default function BlockEditorPanel({ selectedBlock, selectedData, onSave }) {
  return (
    <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px]">
      <BlockDetails
        block={selectedBlock}
        data={{ ...selectedData, block_id: selectedBlock?.real_id }}
        onSave={onSave}
      />
    </div>
  )
}
