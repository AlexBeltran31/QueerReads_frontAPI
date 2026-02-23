import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

function BooksPage() {
  const [params] = useSearchParams()
  const search = params.get('search') || ''

  const {
    data: books = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['books', search],
    queryFn: async () => {
    const response = await axiosClient.get('/books', {
        params: { search },
    })

    return response.data.data ?? response.data ?? []
    },
    keepPreviousData: true,
  })

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        Loading books...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {search ? `Search results for "${search}"` : 'Books'}
      </h1>

      {/* Small loading indicator when refetching */}
      {isFetching && (
        <p className="text-sm text-gray-400 mb-4">
          Updating results...
        </p>
      )}

      {books.length === 0 ? (
        <p className="text-gray-400">
          No books found.
        </p>
      ) : (
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
      )}
    </div>
  )
}

export default BooksPage