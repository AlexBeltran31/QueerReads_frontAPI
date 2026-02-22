import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

function AddBookPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/admin/categories')
      return data
    },
  })

  const addBookMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post('/admin/books', {
        title,
        author,
        description,
        category_id: categoryId,
      })

      return response.data
    },
    onSuccess: () => {
      navigate('/admin')
    },
  })

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-800 p-6 rounded">
      <h1 className="text-2xl font-bold mb-6">
        Add New Book
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          addBookMutation.mutate()
        }}
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 rounded bg-gray-700"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-700"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* CATEGORY SELECT */}
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

        <button
          type="submit"
          disabled={addBookMutation.isPending}
          className="w-full bg-blue-600 p-2 rounded"
        >
          {addBookMutation.isPending
            ? 'Creating...'
            : 'Create Book'}
        </button>

        {addBookMutation.isError && (
          <p className="text-red-500">
            Failed to create book
          </p>
        )}
      </form>
    </div>
  )
}

export default AddBookPage