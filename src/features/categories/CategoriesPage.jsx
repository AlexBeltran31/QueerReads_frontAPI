import { Link } from 'react-router-dom'
import { useCategories } from './useCategories'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()

  if (isLoading) return <p>Loading categories...</p>

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="bg-white text-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}