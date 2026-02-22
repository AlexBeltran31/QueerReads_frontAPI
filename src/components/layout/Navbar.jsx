import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/?search=${search}`)
    setSearch('')
  }

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          QueerReads
        </Link>

        {/* 🔎 Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-purple-500"
          />
        </form>

        <div className="space-x-4">

          {/* Always visible */}
          <Link to="/categories">Categories</Link>

          {/* Not logged in */}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* Logged in */}
          {user && (
            <>
              <Link to="/reading-list">Reading List</Link>
              <Link to="/profile">Profile</Link>

              {/* Admin only */}
              {user.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}

              <button
                onClick={logout}
                className="ml-2 bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar