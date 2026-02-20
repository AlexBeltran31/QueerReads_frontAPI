import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const loginMutation = useMutation({
  mutationFn: async () => {
    const response = await axios.post(
      'http://localhost:8000/api/login',
      { email, password }
    )

    return response.data
  },

  onSuccess: async (data) => {
    // 1️⃣ Save token
    localStorage.setItem('token', data.token)

    // 2️⃣ Fetch user
    const userResponse = await axios.get(
      'http://localhost:8000/api/user',
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )

    // 3️⃣ Update context
    setUser(userResponse.data)

    // 4️⃣ Redirect
    navigate('/')
  },
})



  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault()
                loginMutation.mutate()
            }}
        >

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 p-2 rounded"
        >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        {loginMutation.isError && (
        <p className="text-red-500 mt-2">
            Invalid credentials
        </p>
        )}

      </form>
    </div>
  )
}

export default LoginPage
