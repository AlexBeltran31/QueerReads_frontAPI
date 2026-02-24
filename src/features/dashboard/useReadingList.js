import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useReadingList = (userId) => {
  return useQuery({
    queryKey: ['readingList', userId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${userId}/books`)
      return data
    },
    enabled: !!userId
  })
}