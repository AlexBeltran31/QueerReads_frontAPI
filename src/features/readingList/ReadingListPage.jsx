import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

function ReadingListPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [randomError, setRandomError] = useState(null)

  const statusLabels = {
    to_read: 'Pending',
    reading: 'Reading',
    finished: 'Finished',
  }

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['readingList', user?.id],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/users/${user.id}/books`
      )
      return response.data
    },
    enabled: !!user,
  })

  const toRead = books.filter(
    (book) => book.pivot?.status === 'to_read'
  )

  const reading = books.filter(
    (book) => book.pivot?.status === 'reading'
  )

  const finished = books.filter(
    (book) => book.pivot?.status === 'finished'
  )

  const randomBookMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get(
        '/books/random-to-read'
      )
      return response.data
    },
    onSuccess: (book) => {
      navigate(`/books/${book.id}`)
    },
    onError: () => {
      setRandomError('No pending books available.')
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookId, status }) => {
      await axiosClient.patch(
        `/books/${bookId}/users/${user.id}`,
        { status }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['readingList', user?.id],
      })
    },
  })

  const removeBookMutation = useMutation({
    mutationFn: async (bookId) => {
      await axiosClient.delete(
        `/books/${bookId}/users/${user.id}`
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['readingList', user?.id],
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

  return (
    <div className="max-w-6xl mx-auto py-10">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Your Reading List
        </h1>

        <button
          onClick={() => {
            setRandomError(null)
            randomBookMutation.mutate()
          }}
          disabled={
            randomBookMutation.isPending ||
            toRead.length === 0
          }
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {randomBookMutation.isPending
            ? 'Picking...'
            : '🎲 Pick Random Pending'}
        </button>
      </div>

      {randomError && (
        <p className="text-yellow-400 mb-4">
          {randomError}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        <ReadingColumn
          title="📚 To Read"
          books={toRead}
          statusLabels={statusLabels}
          updateStatusMutation={updateStatusMutation}
          removeBookMutation={removeBookMutation}
        />

        <ReadingColumn
          title="📖 Reading"
          books={reading}
          statusLabels={statusLabels}
          updateStatusMutation={updateStatusMutation}
          removeBookMutation={removeBookMutation}
        />

        <ReadingColumn
          title="✅ Finished"
          books={finished}
          statusLabels={statusLabels}
          updateStatusMutation={updateStatusMutation}
          removeBookMutation={removeBookMutation}
        />

      </div>
    </div>
  )
}

function ReadingColumn({
  title,
  books,
  statusLabels,
  updateStatusMutation,
  removeBookMutation
}) {
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
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book.id} className="bg-gray-700 p-4 rounded">
              <Link
                to={`/books/${book.id}`}
                className="font-semibold hover:underline"
              >
                {book.title}
              </Link>

              <p className="text-sm text-gray-400">
                {book.author}
              </p>

              <div className="flex gap-2 mt-3">
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
                      className="px-2 py-1 bg-blue-600 rounded text-xs"
                    >
                      {statusLabels[status]}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  removeBookMutation.mutate(book.id)
                }
                className="mt-3 bg-red-600 px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReadingListPage