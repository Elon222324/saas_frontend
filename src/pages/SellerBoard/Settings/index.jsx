import { useParams } from 'react-router-dom'
import { BoardHeader } from '../components'

export default function SellerBoardSettings() {
  const { siteName } = useParams()

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <BoardHeader
        title="Настройки"
        icon="⚙️"
        siteName={siteName}
        accentColor="text-purple-400"
        borderColor="border-purple-400"
      />
    </div>
  )
}

