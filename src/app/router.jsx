import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AdminRoute from '../components/common/AdminRoute'
import LoginPage from '../features/auth/LoginPage'
import BooksPage from '../features/books/BooksPage'
import BookDetailPage from '../features/books/BookDetailPage'
import ReadingListPage from '../features/readingList/ReadingListPage'
import AddBookPage from '../features/admin/AddBookPage'
import UserDashboardPage from '../features/dashboard/UserDashboardPage'
import CategoriesPage from '../features/categories/CategoriesPage'
import CategoryDetailPage from '../features/categories/CategoryDetailPage'

function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* Public */}
        <Route path="/" element={<BooksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/books/:id" element={<BookDetailPage />} />

        {/* ✅ Categories (Public) */}
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/random" element={<div>Random Suggestion</div>} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/books/create" element={<AddBookPage />} />
        </Route>

        <Route path="*" element={<div>Not Found</div>} />

      </Route>
    </Routes>
  )
}

export default Router