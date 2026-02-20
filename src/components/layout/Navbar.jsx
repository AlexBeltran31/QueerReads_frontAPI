import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          QueerReads
        </Link>

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
