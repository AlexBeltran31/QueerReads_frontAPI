import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'
import { Link } from 'react-router-dom'

function ReadingListPage() {
  const queryClient = useQueryClient()
    const statusLabels = {
    to_read: 'Pending',
    reading: 'Reading',
    finished: 'Finished',
  }


  // 📚 Fetch Reading List
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

  // 🔄 Update Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookId, status }) => {
      await axiosClient.put(`/reading-list/${bookId}`, {
        status,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['readingList'],
      })
    },
  })

  // ❌ Remove Book
  const removeBookMutation = useMutation({
    mutationFn: async (bookId) => {
      await axiosClient.delete(
        `/reading-list/${bookId}`
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['readingList'],
      })
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
        <h1 className="text-2xl font-bold mb-4">
          Your Reading List
        </h1>
        <p className="text-gray-400">
          You haven’t added any books yet.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Your Reading List
      </h1>

      <div className="space-y-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-gray-800 p-6 rounded"
          >
            <Link
              to={`/books/${book.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {book.title}
            </Link>

            <p className="text-gray-400 mb-4">
              Author: {book.author}
            </p>

            {/* 📌 Status */}
            <p className="mb-2">
              Status:{' '}
              <span className="font-semibold">
                {statusLabels[book.pivot?.status]}
              </span>
            </p>

            {/* 🔄 Status Controls */}
            <div className="flex gap-3 mb-4">
              {['to_read', 'reading', 'finished'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        bookId: book.id,
                        status,
                      })
                    }
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                  >
                    {statusLabels[status]}
                  </button>
                )
              )}
            </div>

            {/* ❌ Remove */}
            <button
              onClick={() =>
                removeBookMutation.mutate(book.id)
              }
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Remove from list
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadingListPage
