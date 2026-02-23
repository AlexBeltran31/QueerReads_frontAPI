import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { useAdminBooks } from './useAdminBooks'

export default function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const { data: books = [], isLoading } = useAdminBooks()

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/admin/books/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
    },
  })

  if (isLoading) return <p>Loading admin dashboard...</p>

  return (
    <div className="max-w-6xl mx-auto py-10">
      
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <Link
          to="/admin/books/create"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Book
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-400">
          No books yet.
        </p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white text-gray-900 p-6 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {book.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {book.author}
                </p>

                {book.categories?.length > 0 && (
                  <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded mt-2">
                    {book.categories[0].name}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <a
                  href={`/admin/books/${book.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}