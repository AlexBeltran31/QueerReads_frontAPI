import { useState } from 'react'
import { useReadingList } from './useReadingList'
import { useRandomPending } from './useRandomPending'
import BookSection from './BookSection'

export default function UserDashboardPage() {
  const { data: books = [], isLoading } = useReadingList()
  const [randomBook, setRandomBook] = useState(null)

  const randomMutation = useRandomPending()

  if (isLoading) return <p>Loading dashboard...</p>

  const currentlyReading = books.filter(
    book => book.pivot.status === 'reading'
  )

  const pending = books.filter(
    book => book.pivot.status === 'to_read'
  )

  const finished = books.filter(
    book => book.pivot.status === 'finished'
  )

  const handleRandomClick = async () => {
    try {
      const book = await randomMutation.mutateAsync()
      setRandomBook(book)
    } catch (err) {
      setRandomBook(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <BookSection title="📖 Currently Reading" books={currentlyReading} />

      {/* Pending Section with Random Button */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📚 Pending</h2>

          <button
            onClick={handleRandomClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            🎲 Random
          </button>
        </div>

        {pending.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No books in this section yet.
          </p>
        ) : (
          <BookSection title="" books={pending} />
        )}

        {randomBook && (
          <div className="mt-6 p-4 bg-indigo-100 text-indigo-900 rounded-xl">
            <p className="text-sm font-semibold mb-1">
              Your random pick:
            </p>
            <p className="font-bold">{randomBook.title}</p>
            <p className="text-sm">{randomBook.author}</p>
          </div>
        )}
      </div>

      <BookSection title="✅ Finished" books={finished} />
    </div>
  )
}