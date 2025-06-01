import { useSiteSettings } from '@/context/SiteSettingsContext'
import { deliverySchema } from '@/config/blockSchemas/deliverySchema'
import { fieldTypes } from '@/config/fieldTypes'
import DeliveryItemsEditor from './ItemsEditor'
import DeliveryAppearance from './Appearance'
import { useBlockAppearance } from '@/components/BlockForms/hooks/useBlockAppearance'

export default function DeliveryEditor({ block, data, onChange, slug }) {
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
    schema: deliverySchema,
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
        ⚙️ Настройка блока доставки: фон, карточки, тени, цвета текста
      </div>

      <DeliveryItemsEditor />

      <DeliveryAppearance
        schema={deliverySchema}
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
