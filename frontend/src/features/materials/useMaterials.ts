import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { materialsApi } from '@/shared/api/materials.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'
import type { MaterialsParams } from '@/shared/api/materials.api'

export function useMaterials(params: MaterialsParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.MATERIALS, params],
    queryFn: () => materialsApi.getAll(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: QUERY_KEYS.FAVORITES,
    queryFn: () => materialsApi.getFavorites().then((r) => r.data),
  })
}

export function useMaterialDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.MATERIAL_DETAIL(id),
    queryFn: () => materialsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      if (isFavorite) {
        return materialsApi.removeFavorite(id)
      }
      return materialsApi.addFavorite(id)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATERIALS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES })
      if (variables.isFavorite) {
        toast.info('Удалено из избранного')
      } else {
        toast.success('Добавлено в избранное')
      }
    },
    onError: () => {
      toast.error('Не удалось обновить избранное')
    },
  })
}
