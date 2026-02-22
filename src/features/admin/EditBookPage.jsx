import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { useUpdateBook } from './useUpdateBook'

export default function EditBookPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Fetch book
  const { data: book, isLoading } = useQuery({
    queryKey: ['admin-book', id],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/admin/books/${id}`)
      return data
    },
    enabled: !!id,
  })

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/admin/categories')
      return data
    },
  })

  const updateMutation = useUpdateBook()

  // ✅ Proper delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/admin/books/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
      navigate('/admin')
    },
  })

  useEffect(() => {
    if (book) {
      setTitle(book.title)
      setAuthor(book.author)
      setDescription(book.description || '')
      setCategoryId(book.categories?.[0]?.id || '')
    }
  }, [book])

  if (isLoading) return <p className="mt-10 text-center">Loading book...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-800 p-6 rounded">
      <h1 className="text-2xl font-bold mb-6">
        Edit Book
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          updateMutation.mutate(
            {
              id,
              data: {
                title,
                author,
                description,
                category_id: categoryId,
              },
            },
            {
              onSuccess: () => {
                navigate('/admin')
              },
            }
          )
        }}
      >
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <textarea
          className="w-full p-2 rounded bg-gray-700"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 rounded bg-gray-700"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Update Button */}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-green-600 p-2 rounded hover:bg-green-700 transition"
        >
          {updateMutation.isPending ? 'Updating...' : 'Update Book'}
        </button>

        {updateMutation.isError && (
          <p className="text-red-500">
            Failed to update book
          </p>
        )}

        {/* 🔥 Safe Delete Button */}
        <button
          type="button"
          disabled={deleteMutation.isPending}
          onClick={() => {
            const confirmed = window.confirm(
              'Are you sure you want to delete this book?'
            )

            if (confirmed) {
              deleteMutation.mutate()
            }
          }}
          className="w-full bg-red-600 p-2 rounded hover:bg-red-700 transition mt-2"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Book'}
        </button>

        {deleteMutation.isError && (
          <p className="text-red-500">
            Failed to delete book
          </p>
        )}
      </form>
    </div>
  )
}