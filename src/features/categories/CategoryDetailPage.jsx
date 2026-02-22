import { useParams } from 'react-router-dom'
import { useCategory } from './useCategory'
import { useCategories } from './useCategories'

export default function CategoryDetailPage() {
  const { id } = useParams()

  const { data: books = [], isLoading } = useCategory(id)
  const { data: categories = [] } = useCategories()

  const category = categories.find(cat => cat.id === Number(id))

  if (isLoading) return <p>Loading category...</p>

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        {category ? category.name : 'Category'}
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-400">
          No books in this category yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {books.map(book => (
            <div
              key={book.id}
              className="bg-white text-gray-900 p-6 rounded-xl shadow"
            >
              <h2 className="font-semibold">
                {book.title}
              </h2>
              <p className="text-sm text-gray-500">
                {book.author}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}