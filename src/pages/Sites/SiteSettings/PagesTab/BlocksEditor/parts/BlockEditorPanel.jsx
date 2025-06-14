import BlockDetails from '@/pages/Sites/SiteSettings/PagesTab/BlocksEditor/preview/BlockDetails'

export default function BlockEditorPanel({ selectedBlock, selectedData, onChange }) {
  return (
    <div className="flex-1 border rounded p-4 bg-white shadow-sm min-h-[200px] overflow-x-auto">
      <BlockDetails
        block={selectedBlock}
        data={{ ...selectedData, block_id: selectedBlock?.real_id }}
        onChangeBlock={onChange}
      />
    </div>
  )
}
