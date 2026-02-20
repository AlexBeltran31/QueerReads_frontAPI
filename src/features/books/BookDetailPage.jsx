import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

function BookDetailPage() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}`
      )
      return response.data.data
    },
  })

  if (isLoading) {
    return <div className="mt-10">Loading book...</div>
  }

  if (isError) {
    return <div className="mt-10 text-red-500">
      Error loading book
    </div>
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-800 p-6 rounded">
      <h1 className="text-3xl font-bold mb-4">
        {data.title}
      </h1>

      <p className="text-gray-400 mb-4">
        Author: {data.author}
      </p>

      <p>
        {data.description}
      </p>
    </div>
  )
}

export default BookDetailPage
