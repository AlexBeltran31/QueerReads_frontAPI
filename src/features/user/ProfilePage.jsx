import { useQuery, useMutation } from '@tanstack/react-query'
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pronouns: '',
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const [passwordMessage, setPasswordMessage] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        pronouns: user.pronouns || '',
      })
    }
  }, [user])

  const { data: readingList = [], isLoading } = useQuery({
    queryKey: ['readingList', user?.id],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${user.id}/books`)
      return data.data ?? data
    },
    enabled: !!user,
  })

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.put(
        `/users/${user.id}`,
        data
      )
      return response.data
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.put(
        `/users/${user.id}/password`,
        data
      )
      return response.data
    },
    onSuccess: (data) => {
      setPasswordMessage(data.message)
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    },
  })

  if (isLoading) {
    return <p className="mt-10 text-center">Loading profile...</p>
  }

  const toRead = readingList.filter(b => b.pivot?.status === 'to_read')
  const reading = readingList.filter(b => b.pivot?.status === 'reading')
  const finished = readingList.filter(b => b.pivot?.status === 'finished')

  return (
    <div className="max-w-5xl mx-auto py-10">

      <div className="bg-gray-800 p-6 rounded mb-10">
        {!isEditing ? (
          <>
            <h1 className="text-3xl font-bold mb-2">
              {user?.name}
            </h1>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-gray-400 mt-1">
              Pronouns: {user?.pronouns || '—'}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-600 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-700"
            />

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-700"
            />

            <input
              type="text"
              value={formData.pronouns}
              onChange={(e) =>
                setFormData({ ...formData, pronouns: e.target.value })
              }
              className="w-full mb-6 p-2 rounded bg-gray-700"
            />

            {/* PASSWORD SECTION INSIDE EDIT MODE */}
            <div className="border-t border-gray-600 pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">
                Change Password
              </h2>

              <input
                type="password"
                placeholder="Current password"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 rounded bg-gray-700"
              />

              <input
                type="password"
                placeholder="New password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 rounded bg-gray-700"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={passwordData.password_confirmation}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password_confirmation: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 rounded bg-gray-700"
              />

              <button
                onClick={() =>
                  updatePasswordMutation.mutate(passwordData)
                }
                className="bg-purple-600 px-4 py-2 rounded"
              >
                Update Password
              </button>

              {passwordMessage && (
                <p className="mt-3 text-sm text-gray-300">
                  {passwordMessage}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  updateUserMutation.mutate(formData)
                }
                className="bg-green-600 px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ReadingSection title="📚 To Read" books={toRead} />
        <ReadingSection title="📖 Reading" books={reading} />
        <ReadingSection title="✅ Finished" books={finished} />
      </div>
    </div>
  )
}

function ReadingSection({ title, books }) {
  return (
    <div className="bg-gray-800 p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {books.length === 0 ? (
        <p className="text-gray-400 text-sm">No books here.</p>
      ) : (
        <div className="space-y-3">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="block bg-gray-700 p-3 rounded"
            >
              <p className="font-medium">{book.title}</p>
              <p className="text-sm text-gray-400">
                {book.author}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}