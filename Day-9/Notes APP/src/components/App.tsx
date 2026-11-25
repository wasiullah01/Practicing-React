import { NotesPage } from './NotesPage'
import { NotesProvider } from './NotesProvider'

export function App() {
  return <NotesProvider><NotesPage /></NotesProvider>
}
