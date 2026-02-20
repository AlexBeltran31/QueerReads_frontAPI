import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    axios.get('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:8000/api/login', {
      email,
      password,
    })

    localStorage.setItem('token', response.data.token)

    const userResponse = await axios.get(
      'http://localhost:8000/api/user',
      {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      }
    )

    setUser(userResponse.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
