import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'
import { useNavigate } from 'react-router-dom'

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.put(`/books/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['books-admin'])
      navigate('/admin')
    },
  })
}