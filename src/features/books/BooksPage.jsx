import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function BooksPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/books'
      )
      return response.data.data
    },
  })

  if (isLoading) {
    return <div className="text-center mt-10">Loading books...</div>
  }

  if (isError) {
    console.log(error)
    return (
        <div className="text-center mt-10 text-red-500">
        {error.message}
        </div>
    )
    }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((book) => (
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

export default BooksPage
