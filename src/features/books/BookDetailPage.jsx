import { useParams } from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
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

  // ⭐ Fetch Reviews (Public)
  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/books/${id}/reviews`
      )
      return response.data.data ?? response.data
    },
  })

  // ➕ Add To Reading List
  const addToReadingListMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post(`/reading-list/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['readingList'],
      })
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
      {/* 📖 Book Info */}
      <h1 className="text-3xl font-bold mb-4">
        {book.title}
      </h1>

      <p className="text-gray-400 mb-4">
        Author: {book.author}
      </p>

      <p>{book.description}</p>

      {/* ➕ Add Button */}
      <button
        onClick={() =>
          addToReadingListMutation.mutate()
        }
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

      {/* ⭐ Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Reviews
        </h2>

        {reviewsLoading && (
          <p>Loading reviews...</p>
        )}

        {reviewsError && (
          <p className="text-red-500">
            Failed to load reviews
          </p>
        )}

        {reviews &&
          reviews.length === 0 && (
            <p className="text-gray-400">
              No reviews yet.
            </p>
          )}

        {reviews &&
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-700 p-4 rounded mb-4"
            >
              <p className="font-semibold">
                ⭐ {review.rating} / 5
              </p>
              <p className="mt-2">
                {review.comment}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BookDetailPage
