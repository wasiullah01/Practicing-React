import { BoardPage } from './BoardPage'
import { BoardProvider } from './BoardProvider'

export function App() {
  return <BoardProvider><BoardPage /></BoardProvider>
}
