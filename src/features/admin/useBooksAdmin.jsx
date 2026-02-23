import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useAdminBooks = () => {
  return useQuery({
    queryKey: ['books-admin'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/books')
      return data
    },
  })
}