import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'

function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/books/:id" element={<div>Book Detail</div>} />
        <Route path="/categories" element={<div>Categories</div>} />

        {/* Protected routes */}
        <Route path="/reading-list" element={<div>Reading List</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/random" element={<div>Random Suggestion</div>} />

        {/* Admin */}
        <Route path="/admin" element={<div>Admin Dashboard</div>} />

        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default Router
