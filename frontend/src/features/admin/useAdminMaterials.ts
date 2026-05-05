import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminApi,
  type AdminListParams,
  type CreateMaterialPayload,
  type UpdateMaterialPayload,
} from '@/shared/api/admin.api'
import { QUERY_KEYS } from '@/shared/constants'
import { toast } from '@/features/theme/useToastStore'

export function useAdminMaterials(params: AdminListParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_MATERIALS, params],
    queryFn: () => adminApi.listMaterials(params).then((r) => r.data),
  })
}

export function useAdminMaterial(id: string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.ADMIN_MATERIAL(id) : ['admin', 'material', 'none'],
    queryFn: () => adminApi.getMaterial(id!).then((r) => r.data),
    enabled: !!id,
  })
}

function invalidateMaterials(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MATERIALS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATERIALS })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES })
}

export function useCreateMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialPayload) =>
      adminApi.createMaterial(data).then((r) => r.data),
    onSuccess: () => {
      invalidateMaterials(queryClient)
      toast.success('Материал создан')
    },
    onError: () => toast.error('Не удалось создать материал'),
  })
}

export function useUpdateMaterial(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateMaterialPayload) =>
      adminApi.updateMaterial(id, data).then((r) => r.data),
    onSuccess: () => {
      invalidateMaterials(queryClient)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MATERIAL(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATERIAL_DETAIL(id) })
      toast.success('Материал обновлён')
    },
    onError: () => toast.error('Не удалось сохранить материал'),
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteMaterial(id).then((r) => r.data),
    onSuccess: () => {
      invalidateMaterials(queryClient)
      toast.info('Материал удалён')
    },
    onError: () => toast.error('Не удалось удалить материал'),
  })
}
