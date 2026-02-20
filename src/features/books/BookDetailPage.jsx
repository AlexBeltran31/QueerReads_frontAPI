import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

function BookDetailPage() {
  const { id } = useParams()

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
    </div>
  )
}

export default BookDetailPage
