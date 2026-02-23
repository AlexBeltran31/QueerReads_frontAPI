import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/categories')
      return data
    },
  })
}