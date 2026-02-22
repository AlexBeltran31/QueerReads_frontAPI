import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useReadingList = () => {
  return useQuery({
    queryKey: ['readingList'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/reading-list')
      return data
    }
  })
}