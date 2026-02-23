export default function BookSection({ title, books }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {books.length === 0 ? (
        <p className="text-gray-400 text-sm">No books in this section yet.</p>
      ) : (
        <div className="grid gap-4">
          {books.map(book => (
            <div
              key={book.id}
              className="p-4 bg-white text-gray-900 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>

              <span className="text-xs px-3 py-1 bg-gray-200 rounded-full">
                {book.pivot.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}