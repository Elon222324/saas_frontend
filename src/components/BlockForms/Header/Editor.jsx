import { useSiteSettings } from '@/context/SiteSettingsContext'
import { headerSchema } from '@/config/blockSchemas/headerSchema'
import { fieldTypes } from '@/config/fieldTypes'
import HeaderItemsEditor from './ItemsEditor'
import HeaderAppearance from './Appearance'
import { useBlockAppearance } from '@/components/BlockForms/hooks/useBlockAppearance'

export default function HeaderEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    resetButton,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: headerSchema,
    data,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange,
  })

  return (
    <div className="space-y-6 relative">
      {showSavedToast && (
        <div className="text-green-600 text-sm font-medium">✅ Внешний вид сохранён</div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        🧩 Шапка: редактирование внешнего вида блока
      </div>

      <HeaderItemsEditor />

      <HeaderAppearance
        schema={headerSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        showButton={showSaveButton || data?.custom_appearance === false}
        resetButton={resetButton}
        uiDefaults={uiDefaults}
      />
    </div>
  )
}
