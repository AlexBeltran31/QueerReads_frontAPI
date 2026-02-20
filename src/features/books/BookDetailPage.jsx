import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

function BookDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  // 📖 Fetch Book
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/books/${id}`)
      return response.data.data
    },
  })

  // ➕ Add To Reading List
  const addToReadingListMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post(`/reading-list/${id}`)
    },
    onSuccess: () => {
      // Invalidate reading list cache
      queryClient.invalidateQueries({ queryKey: ['readingList'] })
    },
  })

  if (isLoading) {
    return <div className="mt-10">Loading book...</div>
  }

  if (isError) {
    return (
      <div className="mt-10 text-red-500">
        {error.message}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-800 p-6 rounded">
      <h1 className="text-3xl font-bold mb-4">
        {book.title}
      </h1>

      <p className="text-gray-400 mb-4">
        Author: {book.author}
      </p>

      <p>
        {book.description}
      </p>

      {/* ➕ Button */}
      <button
        onClick={() => addToReadingListMutation.mutate()}
        disabled={addToReadingListMutation.isPending}
        className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {addToReadingListMutation.isPending
          ? 'Adding...'
          : 'Add to Reading List'}
      </button>

      {addToReadingListMutation.isError && (
        <p className="text-red-500 mt-2">
          Failed to add book
        </p>
      )}

      {addToReadingListMutation.isSuccess && (
        <p className="text-green-500 mt-2">
          Book added successfully!
        </p>
      )}
    </div>
  )
}

export default BookDetailPage
