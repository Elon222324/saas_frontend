import { Users } from 'lucide-react'
import CustomerItem from './CustomerItem'
import DataList from '@/components/PageTemplate/DataList'

export default function CustomersList({ customers, loading, error, onOpenDetails, onPrev, onNext, canPrev, canNext }) {
  return (
    <DataList
      items={customers}
      loading={loading}
      error={error}
      onItemClick={onOpenDetails}
      onPrevPage={onPrev}
      onNextPage={onNext}
      canPrev={canPrev}
      canNext={canNext}
      emptyIcon={Users}
      title="Список клиентов"
      countLabel="клиентов"
      emptyTitle="Ничего не найдено"
      clickHint="Кликните на клиента для просмотра деталей"
      itemComponent={CustomerItem}
      itemPropName="customer"
      itemKeySelector={(c) => String(c?.id ?? c?.customer_id ?? c?.uuid ?? c?.pk ?? Math.random())}
    />
  )
}


