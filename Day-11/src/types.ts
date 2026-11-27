export type BookStatus = 'Available' | 'Checked out' | 'Reserved' | 'Catalog'
export type RecordStatus = 'Active' | 'Inactive'
export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed'

export interface Book {
  id: string
  title: string
  author: string
  category: string
  status: BookStatus
  cover: string
  symbol: string
  coverId?: number
  published?: number
  sourceUrl?: string
}

export interface OpenLibraryDoc {
  key: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
}

export interface OpenLibraryResponse {
  numFound: number
  docs: OpenLibraryDoc[]
}

export type BookHistoryStatus = 'Borrowed' | 'Returned' | 'Overdue'

export interface MemberBookHistory {
  id: string
  bookId: string
  title: string
  author: string
  borrowedOn: string
  dueDate: string
  returnedOn?: string
  status: BookHistoryStatus
}

export interface Member {
  id: string
  name: string
  email: string
  joined: string
  borrowed: number
  status: RecordStatus
  initials: string
  color: string
  history: MemberBookHistory[]
}

export interface Appointment {
  id: string
  member: string
  purpose: string
  date: string
  time: string
  status: AppointmentStatus
  initials: string
  color: string
}

export interface LibraryData {
  books: Book[]
  members: Member[]
  appointments: Appointment[]
}
