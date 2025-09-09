import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotesSection({ noteText, setNoteText, addingNote, onAddNote }) {
  return (
    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          <FileText className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Примечание</h3>
      </div>
      <div className="flex gap-3">
        <input 
          value={noteText} 
          onChange={(e) => setNoteText(e.target.value)} 
          placeholder="Добавить примечание к заказу" 
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
        />
        <Button 
          onClick={onAddNote} 
          disabled={addingNote || !noteText.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Добавить
        </Button>
      </div>
    </section>
  )
}
