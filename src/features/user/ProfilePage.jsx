import { useQuery } from '@tanstack/react-query'
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuth()

  const { data: readingList = [], isLoading } = useQuery({
    queryKey: ['readingList'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/reading-list')
      return data.data ?? data
    },
  })

  if (isLoading) {
    return <p className="mt-10 text-center">Loading profile...</p>
  }

  const toRead = readingList.filter(
    (book) => book.pivot?.status === 'to_read'
  )

  const reading = readingList.filter(
    (book) => book.pivot?.status === 'reading'
  )

  const finished = readingList.filter(
    (book) => book.pivot?.status === 'finished'
  )

  return (
    <div className="max-w-5xl mx-auto py-10">
      
      {/* User Info */}
      <div className="bg-gray-800 p-6 rounded mb-10">
        <h1 className="text-3xl font-bold mb-2">
          {user?.name}
        </h1>

        <p className="text-gray-400">
          @{user?.username}
        </p>

        <p className="text-gray-400 mt-1">
          Pronouns: {user?.pronouns}
        </p>
      </div>

      {/* Reading Sections */}
      <div className="grid md:grid-cols-3 gap-6">

        <ReadingSection
          title="📚 To Read"
          books={toRead}
        />

        <ReadingSection
          title="📖 Reading"
          books={reading}
        />

        <ReadingSection
          title="✅ Finished"
          books={finished}
        />

      </div>
    </div>
  )
}

function ReadingSection({ title, books }) {
  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      {books.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No books here.
        </p>
      ) : (
        <div className="space-y-3">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="block bg-gray-700 p-3 rounded hover:bg-gray-600 transition"
            >
              <p className="font-medium">
                {book.title}
              </p>
              <p className="text-sm text-gray-400">
                {book.author}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}