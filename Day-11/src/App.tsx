import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  LayoutDashboard,
  LibraryBig,
  Plus,
  Search,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { DataTable } from './components/DataTable'
import type { Column } from './components/DataTable'
import { Modal } from './components/Modal'
import { Tabs } from './components/Tabs'
import { useDebounce } from './hooks/useDebounce'
import { useFetch } from './hooks/useFetch'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Appointment, Book, LibraryData, Member, MemberBookHistory, OpenLibraryResponse } from './types'
import './App.css'

type Page = 'Overview' | 'Books' | 'Members' | 'Appointments'
type FormFields = {
  name: string
  detail: string
  category: string
  date: string
  time: string
}
type HistoryForm = {
  bookId: string
  borrowedOn: string
  dueDate: string
}

const navigation = [
  { label: 'Overview' as const, icon: LayoutDashboard },
  { label: 'Books' as const, icon: BookOpen },
  { label: 'Members' as const, icon: UsersRound },
  { label: 'Appointments' as const, icon: CalendarDays },
]

const pagePaths: Record<Page, string> = {
  Overview: '/',
  Books: '/books',
  Members: '/members',
  Appointments: '/appointments',
}

const avatarColors = [
  'bg-[#e9d8c8] text-[#80513b]',
  'bg-[#d8e6d9] text-[#42644c]',
  'bg-[#e8dff0] text-[#705c84]',
  'bg-[#f0dfc5] text-[#85663d]',
  'bg-[#d9e3eb] text-[#506578]',
]

const emptyLibrary: LibraryData = { books: [], members: [], appointments: [] }

const keyboardShortcuts = [
  { keys: 'Ctrl / ⌘ + K', action: 'Focus search' },
  { keys: '/', action: 'Focus search' },
  { keys: 'N', action: 'Add a record' },
  { keys: '1–4', action: 'Switch sections' },
  { keys: 'Esc', action: 'Close dialog' },
]

const today = () => {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

const dateAfterDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

const initialsFor = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')

const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))

function Avatar({ initials, color, size = 'md' }: { initials: string; color: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-9 w-9 text-[11px]'}`}>
      {initials}
    </span>
  )
}

function StatusBadge({ children }: { children: string }) {
  const styles: Record<string, string> = {
    Available: 'bg-[#e5efe5] text-[#416849]',
    Active: 'bg-[#e5efe5] text-[#416849]',
    Confirmed: 'bg-[#e5efe5] text-[#416849]',
    Completed: 'bg-[#eeece4] text-[#777a71]',
    Borrowed: 'bg-[#e5efe5] text-[#416849]',
    Returned: 'bg-[#eeece4] text-[#777a71]',
    Overdue: 'bg-[#f5eadd] text-[#a46a37]',
    'Checked out': 'bg-[#f5eadd] text-[#a46a37]',
    Reserved: 'bg-[#ece7f3] text-[#755f92]',
    Catalog: 'bg-[#e9eaf0] text-[#586881]',
    Pending: 'bg-[#fbf0d9] text-[#a4772f]',
    Inactive: 'bg-[#f0eeea] text-[#858179]',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[children] ?? styles.Completed}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}

function MemberStatusToggle({
  member,
  onToggle,
}: {
  member: Member
  onToggle: () => void
}) {
  const active = member.status === 'Active'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${member.name} status`}
      onClick={onToggle}
      className="inline-flex items-center gap-2.5 rounded-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    >
      <span className={`relative h-5 w-9 rounded-full transition-colors ${active ? 'bg-[#8da994]' : 'bg-[#c6c5bd]'}`}>
        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
      <span className={`text-[11px] font-medium ${active ? 'text-[#416849]' : 'text-muted'}`}>
        {member.status}
      </span>
    </button>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a8b75]">{eyebrow}</p>
        <h1 className="font-display text-[32px] leading-[1.15] tracking-[-0.035em] text-ink sm:text-[38px]">{title}</h1>
        <p className="mt-2 text-[13px] text-muted">{description}</p>
      </div>
      {action}
    </div>
  )
}

function LibraryWorkspace({ page }: { page: Page }) {
  const { data: fetchedLibrary, loading, error } = useFetch<LibraryData>('/library.json')
  const [savedLibrary, setSavedLibrary] = useLocalStorage<LibraryData | null>('stacks-library-data', null)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''
  const [searchFocused, setSearchFocused] = useState(false)
  const [dialog, setDialog] = useState<'create' | 'shortcuts' | 'member-history' | 'record-book' | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [todayLabel] = useState(() =>
    new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()),
  )
  const [form, setForm] = useState<FormFields>({
    name: '',
    detail: '',
    category: 'Fiction',
    date: today(),
    time: '10:00',
  })
  const [historyForm, setHistoryForm] = useState<HistoryForm>({
    bookId: '',
    borrowedOn: today(),
    dueDate: dateAfterDays(14),
  })
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setDialog(open ? 'create' : null)
  }, [setDialog])
  const setSearch = useCallback((value: string) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      if (value) nextParams.set('q', value)
      else nextParams.delete('q')
      return nextParams
    }, { replace: true })
  }, [setSearchParams])
  const setPage = useCallback((nextPage: Page) => {
    navigate(pagePaths[nextPage])
    setSearchFocused(false)
  }, [navigate, setSearchFocused])
  const debouncedSearch = useDebounce(search.trim().toLowerCase())
  const library = savedLibrary ?? fetchedLibrary ?? emptyLibrary
  const bookApiUrl = useMemo(() => {
    if (page !== 'Books' && debouncedSearch.length < 2) return null

    const query = debouncedSearch.length >= 2 ? debouncedSearch : 'subject:fiction'
    const params = new URLSearchParams({
      q: query,
      limit: '20',
      fields: 'key,title,author_name,first_publish_year,cover_i,subject',
    })
    return `https://openlibrary.org/search.json?${params.toString()}`
  }, [debouncedSearch, page])
  const {
    data: externalBookData,
    loading: externalBooksLoading,
    error: externalBooksError,
  } = useFetch<OpenLibraryResponse>(bookApiUrl)
  const externalBooks = useMemo<Book[]>(
    () => (externalBookData?.docs ?? [])
      .filter((book) => Boolean(book.key && book.title))
      .map((book) => ({
        id: book.key,
        title: book.title ?? 'Untitled',
        author: book.author_name?.slice(0, 2).join(', ') || 'Unknown author',
        category: book.subject?.[0] ?? 'Open Library',
        status: 'Catalog',
        cover: 'bg-[#d9c8b3]',
        symbol: '✳',
        coverId: book.cover_i,
        published: book.first_publish_year,
        sourceUrl: `https://openlibrary.org${book.key}`,
      })),
    [externalBookData],
  )
  const externalSearchPending =
    search.trim().toLowerCase() !== debouncedSearch || externalBooksLoading
  const selectedMember = library.members.find((member) => member.id === selectedMemberId) ?? null

  useEffect(() => {
    if (!fetchedLibrary) return
    if (!savedLibrary) {
      setSavedLibrary(fetchedLibrary)
      return
    }

    let needsHistoryMigration = false
    const members = savedLibrary.members.map((member) => {
      if (member.history !== undefined) return member
      needsHistoryMigration = true
      const seedMember = fetchedLibrary.members.find((candidate) => candidate.id === member.id)
      return { ...member, history: seedMember?.history ?? [] }
    })

    if (needsHistoryMigration) setSavedLibrary({ ...savedLibrary, members })
  }, [fetchedLibrary, savedLibrary, setSavedLibrary])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (dialog !== null) return

      const target = event.target
      const isTyping = target instanceof HTMLElement &&
        (target.isContentEditable || target.matches('input, textarea, select'))

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === '/') {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        if (page === 'Overview') {
          setPage('Appointments')
        }
        setForm({ name: '', detail: '', category: 'Fiction', date: today(), time: '10:00' })
        setDialog('create')
        return
      }

      if (/^[1-4]$/.test(event.key)) {
        const destination = navigation[Number(event.key) - 1]
        if (destination) {
          setPage(destination.label)
        }
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [dialog, page, setDialog, setForm, setPage])

  const filteredBooks = useMemo(
    () => library.books.filter((book) =>
      `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(debouncedSearch),
    ),
    [library.books, debouncedSearch],
  )
  const filteredMembers = useMemo(
    () => library.members.filter((member) =>
      `${member.name} ${member.email}`.toLowerCase().includes(debouncedSearch),
    ),
    [library.members, debouncedSearch],
  )
  const filteredAppointments = useMemo(
    () => library.appointments.filter((appointment) =>
      `${appointment.member} ${appointment.purpose} ${appointment.status}`.toLowerCase().includes(debouncedSearch),
    ),
    [library.appointments, debouncedSearch],
  )
  const bookSuggestions = externalBooks.slice(0, 5)

  const openBookSearch = (query: string) => {
    const normalizedQuery = query.trim()
    navigate(normalizedQuery ? `/books?q=${encodeURIComponent(normalizedQuery)}` : pagePaths.Books)
    setSearchFocused(false)
  }

  const openAddForm = () => {
    setForm({ name: '', detail: '', category: 'Fiction', date: today(), time: '10:00' })
  }

  const addRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = form.name.trim()
    const detail = form.detail.trim()
    if (!name || (page !== 'Members' && !detail)) return

    const colorIndex = library.members.length % avatarColors.length
    const avatar = initialsFor(name)
    if (page === 'Appointments') {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        member: name,
        purpose: detail,
        date: form.date,
        time: form.time,
        status: 'Confirmed',
        initials: avatar,
        color: avatarColors[colorIndex],
      }
      setSavedLibrary({ ...library, appointments: [newAppointment, ...library.appointments] })
    } else if (page === 'Members') {
      const newMember: Member = {
        id: crypto.randomUUID(),
        name,
        email: detail,
        joined: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
        borrowed: 0,
        status: 'Active',
        initials: avatar,
        color: avatarColors[colorIndex],
        history: [],
      }
      setSavedLibrary({ ...library, members: [newMember, ...library.members] })
    } else {
      const newBook: Book = {
        id: crypto.randomUUID(),
        title: name,
        author: detail,
        category: form.category,
        status: 'Available',
        cover: 'bg-[#d8e6d9]',
        symbol: '✳',
      }
      setSavedLibrary({ ...library, books: [newBook, ...library.books] })
    }
    setDialog(null)
  }

  const toggleMemberStatus = (memberId: string) => {
    setSavedLibrary({
      ...library,
      members: library.members.map((member) =>
        member.id === memberId
          ? { ...member, status: member.status === 'Active' ? 'Inactive' : 'Active' }
          : member,
      ),
    })
  }

  const openMemberHistory = (memberId: string) => {
    setSelectedMemberId(memberId)
    setDialog('member-history')
  }

  const openHistoryForm = () => {
    setHistoryForm({
      bookId: library.books[0]?.id ?? '',
      borrowedOn: today(),
      dueDate: dateAfterDays(14),
    })
    setDialog('record-book')
  }

  const addHistoryRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const book = library.books.find((item) => item.id === historyForm.bookId)
    const status: MemberBookHistory['status'] =
      historyForm.dueDate < today() ? 'Overdue' : 'Borrowed'

    if (!selectedMember || !book) return

    const historyRecord: MemberBookHistory = {
      id: crypto.randomUUID(),
      bookId: book.id,
      title: book.title,
      author: book.author,
      borrowedOn: historyForm.borrowedOn,
      dueDate: historyForm.dueDate,
      status,
    }

    setSavedLibrary({
      ...library,
      members: library.members.map((member) =>
        member.id === selectedMember.id
          ? {
            ...member,
            borrowed: member.borrowed + 1,
            history: [historyRecord, ...(member.history ?? [])],
          }
          : member,
      ),
    })
    setDialog('member-history')
  }

  const returnBook = (memberId: string, historyId: string) => {
    setSavedLibrary({
      ...library,
      members: library.members.map((member) => {
        if (member.id !== memberId) return member

        let returned = false
        const history = (member.history ?? []).map((record) => {
          if (record.id !== historyId || record.status === 'Returned') return record
          returned = true
          return { ...record, status: 'Returned' as const, returnedOn: today() }
        })

        return returned
          ? { ...member, borrowed: Math.max(0, member.borrowed - 1), history }
          : member
      }),
    })
  }

  const booksColumns: Column<Book>[] = [
    {
      key: 'title',
      header: 'Book',
      render: (book) => (
        <div className="flex items-center gap-3">
          {book.coverId ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
              alt={`${book.title} cover`}
              loading="lazy"
              className="h-[43px] w-[34px] shrink-0 rounded-[5px] object-cover shadow-sm"
            />
          ) : (
            <div className={`flex h-[43px] w-[34px] shrink-0 items-center justify-center rounded-[5px] text-[16px] text-[#35463a] shadow-sm ${book.cover}`}>
              {book.symbol}
            </div>
          )}
          <div className="min-w-0">
            {book.sourceUrl ? (
              <a href={book.sourceUrl} target="_blank" rel="noreferrer" className="block truncate font-semibold text-ink hover:text-forest hover:underline">
                {book.title}
              </a>
            ) : (
              <p className="truncate font-semibold text-ink">{book.title}</p>
            )}
            <p className="mt-0.5 text-[11px] text-muted">{book.author}</p>
            {book.published && <p className="mt-0.5 text-[10px] text-[#9a8b75]">First published {book.published}</p>}
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category / subject', render: (book) => <span className="block max-w-[190px] truncate text-muted">{book.category}</span> },
    { key: 'status', header: 'Status', render: (book) => <StatusBadge>{book.status}</StatusBadge> },
  ]

  const membersColumns: Column<Member>[] = [
    {
      key: 'member',
      header: 'Member',
      render: (member) => (
        <div className="flex items-center gap-3">
          <Avatar initials={member.initials} color={member.color} />
          <div>
            <p className="font-semibold text-ink">{member.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">{member.email || 'No email provided'}</p>
            <button
              type="button"
              onClick={() => openMemberHistory(member.id)}
              className="mt-1 text-[10px] font-semibold text-forest hover:underline"
            >
              Book history ({member.history?.length ?? 0})
            </button>
          </div>
        </div>
      ),
    },
    { key: 'joined', header: 'Joined', render: (member) => <span className="text-muted">{member.joined}</span> },
    { key: 'borrowed', header: 'On loan', render: (member) => <span className="font-medium text-ink">{member.borrowed} books</span> },
    {
      key: 'status',
      header: 'Visitor status',
      render: (member) => (
        <MemberStatusToggle
          member={member}
          onToggle={() => toggleMemberStatus(member.id)}
        />
      ),
    },
  ]

  const appointmentColumns: Column<Appointment>[] = [
    {
      key: 'member',
      header: 'Member',
      render: (appointment) => (
        <div className="flex items-center gap-3">
          <Avatar initials={appointment.initials} color={appointment.color} />
          <span className="font-semibold text-ink">{appointment.member}</span>
        </div>
      ),
    },
    { key: 'purpose', header: 'Visit', render: (appointment) => <span className="text-muted">{appointment.purpose}</span> },
    {
      key: 'when',
      header: 'Date & time',
      render: (appointment) => (
        <span className="text-ink">{dateLabel(appointment.date)} <span className="text-muted">· {appointment.time}</span></span>
      ),
    },
    { key: 'status', header: 'Status', render: (appointment) => <StatusBadge>{appointment.status}</StatusBadge> },
  ]

  const actionButton = (label: string) => (
    <Modal.Trigger
      onOpen={openAddForm}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#193d2e]"
    >
      <Plus size={15} strokeWidth={2.2} />
      {label}
    </Modal.Trigger>
  )

  const appointmentCard = (appointment: Appointment) => (
    <div key={appointment.id} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#f0efe8]">
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#9a8b75]">
          {new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${appointment.date}T12:00:00`))}
        </span>
        <span className="font-display text-[16px] leading-[17px] text-ink">
          {new Intl.DateTimeFormat('en', { day: 'numeric' }).format(new Date(`${appointment.date}T12:00:00`))}
        </span>
      </div>
      <Avatar initials={appointment.initials} color={appointment.color} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-ink">{appointment.member}</p>
        <p className="mt-0.5 text-[11px] text-muted">{appointment.purpose}</p>
      </div>
      <span className="whitespace-nowrap text-[11px] font-medium text-[#68736b]">{appointment.time}</span>
    </div>
  )

  const visibleAppointments = [...filteredAppointments].sort(
    (first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`),
  )
  const pageTitle = page === 'Overview' ? 'Overview' : page
  const pageDescription = {
    Overview: 'Your little corner of the literary world.',
    Books: 'Every story on your shelves, all in one place.',
    Members: 'The people who make this place feel like home.',
    Appointments: 'Make a little room for a good visit.',
  }[page]
  const addLabel = page === 'Appointments' ? 'New appointment' : page === 'Members' ? 'Add member' : 'Add a book'

  return (
    <Modal.Root open={dialog !== null} onOpenChange={handleDialogOpenChange}>
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[246px] flex-col border-r border-line bg-[#fbfaf7] px-5 py-6 lg:flex">
        <a href="#" onClick={(event) => { event.preventDefault(); setPage('Overview') }} className="mb-11 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-forest text-white">
            <LibraryBig size={18} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block font-display text-[20px] font-semibold leading-5 tracking-[-0.04em]">stacks</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#a19a8c]">Library workspace</span>
          </span>
        </a>

        <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#aaa496]">Workspace</p>
        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon }) => {
            const active = page === label
            return (
              <button
                type="button"
                key={label}
                onClick={() => setPage(label)}
                className={`group flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[12px] font-medium transition ${
                  active ? 'bg-[#e8eee8] text-forest' : 'text-[#777f78] hover:bg-[#f1f0eb] hover:text-ink'
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {label === 'Appointments' && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] ${active ? 'bg-white/80 text-forest' : 'bg-[#efeee8] text-muted'}`}>
                    {library.appointments.filter((item) => item.date >= today()).length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto">
          <div className="relative overflow-hidden rounded-[18px] bg-[#e8eee7] p-4">
            <div className="absolute -right-4 -top-5 h-20 w-20 rounded-full border border-[#d1dfd1]" />
            <div className="absolute -right-1 -top-2 h-12 w-12 rounded-full border border-[#d1dfd1]" />
            <span className="relative mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-forest">
              <Sparkles size={15} />
            </span>
            <p className="relative font-display text-[16px] leading-[1.3] text-[#345341]">Good things grow<br />one page at a time.</p>
            <p className="relative mt-2 text-[10px] leading-relaxed text-[#6e8271]">A kind reminder to keep your shelves growing.</p>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#decbbc] text-[11px] font-bold text-[#80513b]">JD</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-ink">Jordan Davis</p>
              <p className="mt-0.5 text-[10px] text-muted">Librarian</p>
            </div>
            <ChevronDown size={14} className="text-muted" />
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[246px]">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex h-[72px] items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-forest text-white lg:hidden">
                <LibraryBig size={16} />
              </span>
              <div className="hidden text-[11px] text-muted sm:block">
                <span className="text-ink">Library</span><span className="mx-2 text-[#c5c2b9]">/</span>{pageTitle}
              </div>
              <div className="font-display text-[18px] lg:hidden">stacks</div>
            </div>
            <div className="relative w-full max-w-[310px]">
              <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e6e4dc] bg-[#fbfaf7] px-3.5 text-muted transition focus-within:border-[#a9bbab] focus-within:ring-2 focus-within:ring-[#e5ece5]">
                <Search size={15} strokeWidth={1.8} />
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setSearchFocused(true)
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onClick={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={page === 'Appointments' ? 'Search appointments...' : 'Search books, members...'}
                  className="w-full bg-transparent text-[11px] text-ink outline-none placeholder:text-[#a6a69e]"
                  aria-label="Search current section"
                  aria-keyshortcuts="Control+K Meta+K /"
                  aria-expanded={searchFocused && search.trim().length > 0}
                  aria-controls="book-search-results"
                />
              </label>
              {searchFocused && search.trim() && (
                <div id="book-search-results" role="listbox" aria-label="Book search results" className="absolute right-0 top-[calc(100%+10px)] z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[17px] border border-line bg-[#fbfaf7] p-2 shadow-[0_16px_45px_#1d29231c]">
                  <p className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#9a8b75]">Books</p>
                  {search.trim().length < 2 ? (
                    <p className="px-3 py-3 text-[11px] text-muted">Type at least 2 characters to search the catalog.</p>
                  ) : externalSearchPending ? (
                    <p className="px-3 py-3 text-[11px] text-muted">Searching Open Library…</p>
                  ) : externalBooksError ? (
                    <p role="alert" className="px-3 py-3 text-[11px] text-[#8b4e38]">Couldn’t reach Open Library. Try again in a moment.</p>
                  ) : bookSuggestions.length ? (
                    bookSuggestions.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        role="option"
                        aria-selected={false}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openBookSearch(book.title)}
                        className="flex w-full items-center gap-3 rounded-[11px] px-2.5 py-2 text-left transition hover:bg-[#f1f0eb]"
                      >
                        {book.coverId ? (
                          <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`} alt="" loading="lazy" className="h-9 w-7 shrink-0 rounded-[4px] object-cover" />
                        ) : (
                          <span className={`flex h-9 w-7 shrink-0 items-center justify-center rounded-[4px] text-[12px] text-[#35463a] ${book.cover}`}>{book.symbol}</span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold text-ink">{book.title}</span>
                          <span className="mt-0.5 block truncate text-[10px] text-muted">{book.author}{book.published ? ` · ${book.published}` : ''}</span>
                        </span>
                        <ArrowRight size={13} className="shrink-0 text-[#9a9d94]" />
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-3 text-[11px] text-muted">No books found for “{search.trim()}”.</p>
                  )}
                  {search.trim().length >= 2 && (
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openBookSearch(search)}
                      className="mt-1 flex w-full items-center justify-between border-t border-line px-3 py-3 text-left text-[10px] font-semibold text-forest transition hover:bg-[#f1f0eb]"
                    >
                      <span>Show all matching books</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" aria-label="Keyboard shortcuts" title="Keyboard shortcuts" onClick={() => setDialog('shortcuts')} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[#fbfaf7] text-[#727b73] transition hover:bg-white hover:text-forest">
                <CircleHelp size={16} strokeWidth={1.8} />
              </button>
              <button type="button" aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-[#fbfaf7] text-[#727b73] transition hover:bg-white">
                <Bell size={16} strokeWidth={1.8} />
                <span className="absolute right-[8px] top-[7px] h-1.5 w-1.5 rounded-full border border-[#fbfaf7] bg-[#cf835c]" />
              </button>
            </div>
          </div>
          <nav className="scrollbar-hidden -mx-5 flex gap-1 overflow-x-auto px-5 pb-3 lg:hidden">
            {navigation.map(({ label }) => (
              <button key={label} type="button" onClick={() => setPage(label)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] ${page === label ? 'bg-forest text-white' : 'text-muted hover:bg-white'}`}>
                {label}
              </button>
            ))}
          </nav>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-10">
          {error ? (
            <div role="alert" className="rounded-2xl border border-[#e7c7b9] bg-[#fbf0eb] p-5 text-sm text-[#8b4e38]">
              We couldn’t load the library data. Please refresh to try again. <span className="text-xs opacity-70">{error.message}</span>
            </div>
          ) : loading && !savedLibrary ? (
            <div className="flex min-h-[55vh] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d5ddd4] border-t-forest" />Opening the library…</div>
            </div>
          ) : (
            <div className="fade-in">
              <SectionHeading
                eyebrow={page === 'Overview' ? todayLabel : 'Your collection'}
                title={page === 'Overview' ? 'A good day to get lost.' : pageTitle}
                description={pageDescription}
                action={page !== 'Overview' ? actionButton(addLabel) : (
                  <button type="button" onClick={() => setPage('Appointments')} className="hidden items-center gap-2 rounded-full border border-[#dcdcd3] bg-[#fbfaf7] px-4 py-2.5 text-[11px] font-semibold text-forest transition hover:bg-white sm:inline-flex">
                    <CalendarDays size={14} /> Plan a visit <ArrowRight size={13} />
                  </button>
                )}
              />

              {page === 'Overview' && (
                <>
                  <section className="relative mb-6 overflow-hidden rounded-[22px] bg-[#244b3b] px-6 py-7 text-white sm:px-9 sm:py-8">
                    <div className="absolute -right-10 -top-28 h-[350px] w-[350px] rounded-full border border-white/[0.09]" />
                    <div className="absolute -right-2 -top-20 h-[270px] w-[270px] rounded-full border border-white/[0.09]" />
                    <div className="absolute right-[16%] top-[-35px] h-[190px] w-[190px] rounded-full border border-white/[0.09]" />
                    <div className="relative z-10 max-w-[570px]">
                      <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/[0.12] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#d9e5d8]">
                        <Sparkles size={11} /> Your library, in bloom
                      </span>
                      <h2 className="font-display text-[30px] leading-[1.15] tracking-[-0.035em] sm:text-[38px]">A little space for<br className="hidden sm:block" /> big ideas.</h2>
                      <p className="mt-3 max-w-[390px] text-[12px] leading-[1.8] text-[#c3d2c8]">A calm corner to look after your collection, welcome your readers, and make room for what’s next.</p>
                      <button type="button" onClick={() => setPage('Books')} className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-white transition hover:text-[#d9e5d8]">
                        Explore your shelves <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-[-18px] right-[8%] hidden h-[170px] w-[108px] rotate-[7deg] rounded-[7px] bg-[#d5c6a9] p-2 shadow-[8px_12px_25px_#142c2170] sm:block">
                      <div className="flex h-full flex-col items-center justify-center border border-[#b8a989] text-center text-[#596250]">
                        <span className="font-display text-[38px]">✳</span>
                        <span className="mt-2 font-display text-[11px] leading-tight">A FIELD<br />OF STORIES</span>
                        <span className="mt-2 text-[6px] uppercase tracking-[.2em]">Volume no. 01</span>
                      </div>
                    </div>
                  </section>

                  <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {[
                      { title: 'Books on shelf', value: library.books.length.toLocaleString(), detail: '+12 this month', icon: BookOpen, color: 'bg-[#e9efe7] text-forest', trend: ArrowUpRight },
                      { title: 'Lovely readers', value: library.members.length.toLocaleString(), detail: '+8 this month', icon: UsersRound, color: 'bg-[#f2e9df] text-[#a26d49]', trend: ArrowUpRight },
                      { title: 'Out in the world', value: library.books.filter((book) => book.status === 'Checked out').length.toString(), detail: 'doing good things', icon: ArrowDownLeft, color: 'bg-[#e9e5ef] text-[#796b91]', trend: ArrowUpRight },
                      { title: 'Visits this week', value: library.appointments.filter((appointment) => appointment.date >= today()).length.toString().padStart(2, '0'), detail: 'a busy little week', icon: CalendarDays, color: 'bg-[#f1e8df] text-[#a87351]', trend: ArrowUpRight },
                    ].map((stat) => (
                      <article key={stat.title} className="rounded-[17px] border border-line bg-[#fbfaf7] p-4 sm:p-5">
                        <div className="mb-5 flex items-center justify-between">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${stat.color}`}><stat.icon size={15} strokeWidth={1.8} /></span>
                          <stat.trend size={14} className="text-[#8d9a8b]" />
                        </div>
                        <p className="font-display text-[27px] leading-none tracking-[-0.04em] text-ink">{stat.value}</p>
                        <p className="mt-2 text-[10px] font-semibold text-ink sm:text-[11px]">{stat.title}</p>
                        <p className="mt-1 hidden text-[9px] text-muted sm:block">{stat.detail}</p>
                      </article>
                    ))}
                  </section>

                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.8fr)]">
                    <section className="overflow-hidden rounded-[19px] border border-line bg-[#fbfaf7]">
                      <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">The collection</p>
                          <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">Recently on the shelf</h2>
                        </div>
                        <button type="button" onClick={() => setPage('Books')} className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest hover:underline">All books <ArrowRight size={12} /></button>
                      </div>
                      <DataTable<Book> columns={booksColumns} rows={filteredBooks.slice(0, 4)} getRowKey={(book) => book.id} emptyMessage="No books match your search." />
                    </section>

                    <section className="rounded-[19px] border border-line bg-[#fbfaf7] p-5 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">On the calendar</p>
                          <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">A few good visits</h2>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eee8] text-forest"><CalendarDays size={15} /></span>
                      </div>
                      <div className="mt-3">
                        {visibleAppointments.slice(0, 3).map(appointmentCard)}
                      </div>
                      <button type="button" onClick={() => setPage('Appointments')} className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest hover:underline">See the full schedule <ArrowRight size={12} /></button>
                    </section>
                  </div>
                </>
              )}

              {page === 'Books' && (
                <div className="space-y-5">
                  <section className="overflow-hidden rounded-[19px] border border-line bg-[#fbfaf7]">
                    <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">Open Library catalog</p>
                        <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">
                          {debouncedSearch.length >= 2 ? 'Search results' : 'Explore the catalog'}
                          {externalBookData && <span className="ml-2 font-sans text-[11px] font-medium text-muted">({externalBooks.length} shown)</span>}
                        </h2>
                      </div>
                      <a href="https://openlibrary.org/" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 text-[10px] text-muted hover:text-forest sm:inline-flex">
                        Powered by Open Library <ArrowUpRight size={12} />
                      </a>
                    </div>
                    {externalBooksError ? (
                      <div role="alert" className="mx-5 mb-5 rounded-xl border border-[#e7c7b9] bg-[#fbf0eb] p-4 text-[12px] text-[#8b4e38] sm:mx-6">
                        Open Library couldn’t be reached. Your saved shelf is still available below. <span className="text-[10px] opacity-70">{externalBooksError.message}</span>
                      </div>
                    ) : externalBooksLoading ? (
                      <div className="flex items-center gap-2 px-6 py-10 text-[12px] text-muted">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d5ddd4] border-t-forest" />
                        Loading books from Open Library…
                      </div>
                    ) : (
                      <DataTable<Book>
                        columns={booksColumns}
                        rows={externalBooks}
                        getRowKey={(book) => book.id}
                        emptyMessage="No catalog matches. Try another title or author."
                      />
                    )}
                    <p className="px-5 pb-4 pt-2 text-[9px] text-[#a09d94] sm:px-6">Catalog records and cover images provided by Open Library.</p>
                  </section>

                  <section className="overflow-hidden rounded-[19px] border border-line bg-[#fbfaf7]">
                    <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">Your collection</p>
                        <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">On your shelves <span className="ml-1 font-sans text-[11px] font-medium text-muted">({filteredBooks.length})</span></h2>
                      </div>
                      <span className="hidden items-center gap-1.5 text-[10px] text-muted sm:flex"><Compass size={13} /> A little bit of everything</span>
                    </div>
                    <DataTable<Book> columns={booksColumns} rows={filteredBooks} getRowKey={(book) => book.id} emptyMessage="No books match your search." />
                  </section>
                </div>
              )}

              {page === 'Members' && (
                <section className="overflow-hidden rounded-[19px] border border-line bg-[#fbfaf7]">
                  <div className="px-5 pb-4 pt-5 sm:px-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">Our people</p>
                    <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">Library members <span className="ml-1 font-sans text-[11px] font-medium text-muted">({filteredMembers.length})</span></h2>
                  </div>
                  <DataTable<Member> columns={membersColumns} rows={filteredMembers} getRowKey={(member) => member.id} emptyMessage="No members match your search." />
                </section>
              )}

              {page === 'Appointments' && (
                <section className="overflow-hidden rounded-[19px] border border-line bg-[#fbfaf7]">
                  <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-2 pt-5 sm:px-6">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a19a8c]">The reading room</p>
                      <h2 className="mt-1 font-display text-[20px] tracking-[-0.03em]">Time well spent</h2>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted"><Clock3 size={13} /> {filteredAppointments.length} visits scheduled</div>
                  </div>
                  <Tabs.Root defaultValue="upcoming">
                    <Tabs.List className="mx-5 flex gap-5 border-b border-line sm:mx-6">
                      <Tabs.Trigger value="upcoming">Upcoming ({visibleAppointments.filter((item) => item.date >= today()).length})</Tabs.Trigger>
                      <Tabs.Trigger value="past">Past visits</Tabs.Trigger>
                    </Tabs.List>
                    <div className="pt-4">
                      <Tabs.Content value="upcoming">
                        <DataTable<Appointment>
                          columns={appointmentColumns}
                          rows={visibleAppointments.filter((item) => item.date >= today())}
                          getRowKey={(appointment) => appointment.id}
                          emptyMessage="No upcoming visits. A little free time on the calendar."
                        />
                      </Tabs.Content>
                      <Tabs.Content value="past">
                        <DataTable<Appointment>
                          columns={appointmentColumns}
                          rows={visibleAppointments.filter((item) => item.date < today())}
                          getRowKey={(appointment) => appointment.id}
                          emptyMessage="No past visits to show."
                        />
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                </section>
              )}

              <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[9px] text-[#a09d94]">
                <span>Made for people who love a good story.</span>
                <span className="inline-flex items-center gap-1.5"><Check size={11} className="text-[#6e8b73]" /> All caught up</span>
              </footer>
            </div>
          )}
        </div>
      </main>

        <Modal.Content>
          {dialog === 'shortcuts' ? (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9a8b75]">Quick reference</p>
                  <Modal.Title>Keyboard shortcuts</Modal.Title>
                  <p className="mt-2 text-[12px] text-muted">A few handy ways to find your way around.</p>
                </div>
                <Modal.Dismiss />
              </div>
              <div className="divide-y divide-line rounded-[14px] border border-line bg-white px-4">
                {keyboardShortcuts.map(({ keys, action }) => (
                  <div key={keys} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[12px] text-[#59645b]">{action}</span>
                    <kbd className="whitespace-nowrap rounded-md border border-[#e5e3da] bg-[#f7f6f1] px-2 py-1 text-[10px] font-medium text-ink">{keys}</kbd>
                  </div>
                ))}
              </div>
            </>
          ) : dialog === 'member-history' ? (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9a8b75]">Reader record</p>
                  <Modal.Title>{selectedMember ? `${selectedMember.name}’s book history` : 'Book history'}</Modal.Title>
                  <p className="mt-2 text-[12px] text-muted">
                    {selectedMember ? `${selectedMember.borrowed} ${selectedMember.borrowed === 1 ? 'book is' : 'books are'} currently on loan.` : 'Member details are unavailable.'}
                  </p>
                </div>
                <Modal.Dismiss />
              </div>
              {selectedMember && (
                <>
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={openHistoryForm}
                      disabled={library.books.length === 0}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-forest px-4 text-[11px] font-semibold text-white transition hover:bg-[#193d2e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={13} /> Record a book
                    </button>
                  </div>
                  {(selectedMember.history ?? []).length > 0 ? (
                    <div className="max-h-[55vh] space-y-2 overflow-y-auto">
                      {(selectedMember.history ?? []).map((record) => (
                        <article key={record.id} className="flex items-start justify-between gap-3 rounded-[13px] border border-line bg-white p-3.5">
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-ink">{record.title}</p>
                            <p className="mt-1 truncate text-[10px] text-muted">{record.author}</p>
                            <p className="mt-2 text-[9px] text-muted">
                              Borrowed {dateLabel(record.borrowedOn)} · Due {dateLabel(record.dueDate)}
                              {record.returnedOn ? ` · Returned ${dateLabel(record.returnedOn)}` : ''}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <StatusBadge>{record.status}</StatusBadge>
                            {record.status !== 'Returned' && (
                              <button
                                type="button"
                                onClick={() => returnBook(selectedMember.id, record.id)}
                                className="text-[9px] font-semibold text-forest hover:underline"
                              >
                                Mark returned
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[13px] border border-dashed border-[#dcdcd3] bg-white px-5 py-8 text-center">
                      <BookOpen size={20} className="mx-auto text-[#8b9b8b]" />
                      <p className="mt-2 text-[12px] font-semibold text-ink">No book history yet</p>
                      <p className="mt-1 text-[10px] text-muted">Record a book to start this reader’s history.</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : dialog === 'record-book' ? (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9a8b75]">Reader record</p>
                  <Modal.Title>Record a book</Modal.Title>
                  <p className="mt-2 text-[12px] text-muted">Add a borrowed or returned book to {selectedMember?.name ?? 'this reader'}’s history.</p>
                </div>
                <Modal.Dismiss />
              </div>
              {library.books.length === 0 ? (
                <div role="alert" className="rounded-[13px] border border-[#e7c7b9] bg-[#fbf0eb] p-4 text-[12px] text-[#8b4e38]">
                  Add a book to the local collection before recording a loan.
                </div>
              ) : (
                <form onSubmit={addHistoryRecord} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">Book</span>
                    <select required value={historyForm.bookId} onChange={(event) => setHistoryForm({ ...historyForm, bookId: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3 text-[11px] outline-none focus:border-[#9bb39e]">
                      {library.books.map((book) => <option key={book.id} value={book.id}>{book.title} · {book.author}</option>)}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label>
                      <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">Borrowed on</span>
                      <input required type="date" value={historyForm.borrowedOn} onChange={(event) => setHistoryForm({ ...historyForm, borrowedOn: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3 text-[11px] outline-none focus:border-[#9bb39e]" />
                    </label>
                    <label>
                      <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">Due date</span>
                      <input required type="date" value={historyForm.dueDate} onChange={(event) => setHistoryForm({ ...historyForm, dueDate: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3 text-[11px] outline-none focus:border-[#9bb39e]" />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Modal.Close>
                      <button type="button" className="h-10 rounded-full px-4 text-[11px] font-semibold text-muted transition hover:bg-sand">Cancel</button>
                    </Modal.Close>
                    <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-5 text-[11px] font-semibold text-white transition hover:bg-[#193d2e]">
                      <Plus size={14} /> Save to history
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9a8b75]">A new chapter</p>
              <Modal.Title>{page === 'Appointments' ? 'Plan a visit' : page === 'Members' ? 'Welcome a reader' : 'Add to the shelves'}</Modal.Title>
              <p className="mt-2 text-[12px] text-muted">{page === 'Appointments' ? 'Set aside a little time at the library.' : page === 'Members' ? 'There’s always room for one more.' : 'Make a little room for a new story.'}</p>
            </div>
            <Modal.Dismiss />
          </div>
          <form onSubmit={addRecord} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">{page === 'Appointments' ? 'Member name' : page === 'Members' ? 'Full name' : 'Book title'}</span>
              <input
                required
                autoFocus
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder={page === 'Appointments' ? 'Who’s stopping by?' : page === 'Members' ? 'Reader’s name' : 'What’s the title?'}
                className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3.5 text-[12px] outline-none transition placeholder:text-[#b2b0a7] focus:border-[#9bb39e] focus:ring-2 focus:ring-[#e7eee6]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">{page === 'Appointments' ? 'What’s the visit for?' : page === 'Members' ? 'Email address (optional)' : 'Author'}</span>
              <input
                required={page !== 'Members'}
                value={form.detail}
                onChange={(event) => setForm({ ...form, detail: event.target.value })}
                placeholder={page === 'Appointments' ? 'Book pickup, research help…' : page === 'Members' ? 'Optional · reader@example.com' : 'Who wrote it?'}
                type={page === 'Members' ? 'email' : 'text'}
                className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3.5 text-[12px] outline-none transition placeholder:text-[#b2b0a7] focus:border-[#9bb39e] focus:ring-2 focus:ring-[#e7eee6]"
              />
            </label>
            {page === 'Appointments' ? (
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">Date</span>
                  <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3 text-[11px] outline-none focus:border-[#9bb39e]" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">Time</span>
                  <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3 text-[11px] outline-none focus:border-[#9bb39e]" />
                </label>
              </div>
            ) : page === 'Books' ? (
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold text-[#59645b]">A shelf to call home</span>
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="h-11 w-full rounded-[11px] border border-[#e5e3da] bg-white px-3.5 text-[12px] outline-none focus:border-[#9bb39e]">
                  {['Fiction', 'Creativity', 'Nature', 'Art & Design', 'Essays', 'History', 'Other'].map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Modal.Close>
                <button type="button" className="h-10 rounded-full px-4 text-[11px] font-semibold text-muted transition hover:bg-sand">Never mind</button>
              </Modal.Close>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-5 text-[11px] font-semibold text-white transition hover:bg-[#193d2e]">
                <Plus size={14} /> {page === 'Appointments' ? 'Save appointment' : page === 'Members' ? 'Add member' : 'Add book'}
              </button>
            </div>
          </form>
            </>
          )}
        </Modal.Content>
    </div>
    </Modal.Root>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryWorkspace page="Overview" />} />
      <Route path="/books" element={<LibraryWorkspace page="Books" />} />
      <Route path="/members" element={<LibraryWorkspace page="Members" />} />
      <Route path="/appointments" element={<LibraryWorkspace page="Appointments" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
