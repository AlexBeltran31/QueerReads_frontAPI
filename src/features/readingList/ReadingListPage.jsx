import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

function ReadingListPage() {
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['readingList'],
    queryFn: async () => {
      const response = await axiosClient.get('/reading-list')
      return response.data
    },
  })

  if (isLoading) {
    return <div className="mt-10">Loading your reading list...</div>
  }

  if (isError) {
    return (
      <div className="mt-10 text-red-500">
        {error.message}
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Your Reading List</h1>
        <p className="text-gray-400">You haven’t added any books yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Reading List</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-gray-800 p-4 rounded shadow block hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold">
              {book.title}
            </h2>
            <p className="text-gray-400 mt-2">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ReadingListPage
