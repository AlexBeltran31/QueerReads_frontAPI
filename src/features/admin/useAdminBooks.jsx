import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useAdminBooks = () => {
  return useQuery({
    queryKey: ['admin-books'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/admin/books')
      return data
    },
  })
}