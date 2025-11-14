import { useParams } from 'react-router-dom'
import { BoardHeader } from '../components'

export default function SellerBoardAnalytics() {
  const { siteName } = useParams()

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <BoardHeader
        title="Аналитика"
        icon="📈"
        siteName={siteName}
        accentColor="text-blue-400"
        borderColor="border-blue-400"
      />
    </div>
  )
}

