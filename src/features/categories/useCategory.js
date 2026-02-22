import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category-books', id],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/categories/${id}/books`)
      return data
    },
    enabled: !!id,
  })
}