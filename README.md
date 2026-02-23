📚 QueerReads — Frontend

A modern React frontend for QueerReads, a role-based reading management platform with OAuth authentication and full admin capabilities.

This application connects to a Laravel REST API and handless authentication, protected routes, serves state management, and admin CRUD operations.
---

🚀 Tech Stack

* React (Vite)

* React Router v6

* TanStack React Query

* Axios (centralized instance + interceptos)

* Context API (Auth state)

* Tailwind CSS
---

🏗 Architecture Overview

The frontend follows a feature-based modular architecture, with clear separation between:

    🔐 Authentication state

    🌐 Server state

    🎨 UI components

    🔗 API communication layer

Structure:

    src/
    ├── api/
    │     axiosClient.js
    ├── context/
    │     AuthContext.jsx
    ├── components/
    │     layout/
    │     common/
    ├── features/
    │     auth/
    │     books/
    │     readingList/
    │     dashboard/
    │     categories/
    │     admin/
    ├── router/
    │     Router.jsx

This structure avoids mixing business logic with UI and keeps the code scalable.
---

🔗 Conection between Frontend & Backend

The frontend communicates with the Laravel API through a centralized Axios client.

    📌 Centralized Axios Instance

        // src/api/axiosClient.js

        import axios from 'axios'

        const axiosClient = axios.create({
        baseURL: 'http://localhost:8001/api',
        headers: {
            Accept: 'application/json',
        },
        })

        axiosClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
        })

        export default axiosClient

Why this matters:

    * Every request automatically targets the backend API

    * Authentication token is automatically attached

    * No repetition of base URL or headers

    * Keeps API logic separate from components
---

🔐 Authentication Flow

1. User logs in → POST /api/login
2. Backend returns OAuth token.
3. Token is stored in localStorage.
4. Axios interceptor attaches:
    Authorization: Bearer <token>
5. On app load:
    * AuthContext checks token
    * Calls /users/me
    * Restores authenticated user

Route protection is handled via:

*  <ProtectedRoute />

*  <AdminRoute />

Backend also enforces roles (role:admin middleware), so security is server-driven.
---

🌐 Server State Management (React Query)

Instead of calling Axios directly inside components, we use React Query to manage server state.

Example:

    export const useAdminBooks = () => {
        return useQuery({
            queryKey: ['admin-books'],
            queryFn: async () => {
            const { data } = await axiosClient.get('/admin/books')
            return data
            },
        })
    }

Benefits:

* Automatic caching
* Loading & erorr states
* Easy data invalidation
* UI stays synchronized with backend

After a mutation:

    queryClient.invalidateQueries(['admin-books'])

The data automatically refetches and updates the UI.
---

🎯 Design Principles Followed
* Clear separation of concerns
* API abstraction layer
* Server-driven validation
* Feature-based organization
* Role-based route protection
* React Query for server state
* Minimal UI logic inside components
This is structured closer to production architecture than a tutorial-level SPA.
---

🧪 Running the Project

npm install

npm run dev

Make sure the Laravel backend is running on:

    http://localhost:8001
---

📌 Key Architectural Decision

The most important design choice in this frontend is the centralized Axios client + React Query combination.

Axios handles communication and authentication.

React Query handles synchronization and state consistency.

This keeps the frontend predictable, maintainable, and scalable.
---

💜 Author Developed by Alex Beltrán – Fullstack Development

    featuring. ChatGPT 5.2