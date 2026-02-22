import { useMutation } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient'

export const useRandomPending = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.get('/books/random-to-read')
      return data
    }
  })
}