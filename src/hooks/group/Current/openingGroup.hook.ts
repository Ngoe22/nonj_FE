// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-toastify';
// import { useTranslations } from 'next-intl';
// import { api } from '@/lib/axios/axios';
// import { useRouter } from '@/i18n/navigation';
// import {Group, UpdateGroup} from '@/types/group/group.type';
//
// // ============================================================
// // GET
// // ============================================================
// export function useGetGroup(groupId: string) {
//     return useQuery({
//         queryKey: ['current_group', groupId],   // ✅ thêm groupId
//         queryFn: async (): Promise<Group> => {
//             const res = await api.get(`group/id_search/${groupId}`);
//             return res.data.data;
//         },
//         enabled: !!groupId,
//         staleTime: 10 * 60 * 1000,
//     });
// }
//
// // ============================================================
// // UPDATE
// // ============================================================
//
// interface UpdateProps { id: string ,body : UpdateGroup }
//
// export function useUpdateGroup() {
//     const txt = useTranslations('Toast');
//     const queryClient = useQueryClient();
//
//     return useMutation({
//         mutationFn: async ({ id, body } : UpdateProps): Promise<Group> => {
//             const res = await api.patch<{ data: Group }>(`group/${id}`, body);
//             return res.data.data;
//         },
//
//         onMutate: async ({ id, body }) => {
//             await queryClient.cancelQueries({ queryKey: ['current_group', id] });
//
//             const prev = queryClient.getQueryData<Group>(['current_group', id]);
//
//             queryClient.setQueryData<Group>(['current_group', id], (old) =>
//                 old ? { ...old, ...body } : old,
//             );
//
//             return { prev, id };
//         },
//
//         onError: (_err, _vars, ctx) => {
//             if (ctx?.prev !== undefined) {
//                 queryClient.setQueryData(['current_group', ctx.id], ctx.prev);
//             }
//             toast.error(txt('action_fail'));
//         },
//
//         onSettled: async (_data, _err, vars) => {
//             await queryClient.invalidateQueries({
//                 queryKey: ['current_group', vars.id],
//             });
//             await queryClient.invalidateQueries({ queryKey: ['my_own_group'] });
//             await queryClient.invalidateQueries({ queryKey: ['my_all_group'] });
//         },
//     });
// }
//
// // ============================================================
// // DELETE
// // ============================================================
// export function useDeleteGroup() {
//     const router = useRouter();
//     const txt = useTranslations('Toast');
//     const queryClient = useQueryClient();
//
//     return useMutation({
//         mutationFn: async (group_id: string): Promise<void> => {
//             await api.delete(`group/${group_id}`);
//         },
//
//         onSuccess: async (_data, id) => {
//             await queryClient.invalidateQueries({ queryKey: ['my_own_group'] });
//             await queryClient.invalidateQueries({ queryKey: ['my_all_group'] });
//
//             queryClient.removeQueries({ queryKey: ['current_group', id] });
//
//             router.push('/group');
//         },
//
//         onError: (_err) => {
//             toast.error(txt('action_fail'));
//         },
//     });
// }
//
//
//
//
// // ============================================================
// // QUIT
// // ============================================================
// export function useQuitGroup() {
//     const router = useRouter();
//     const txt = useTranslations('Toast');
//     const queryClient = useQueryClient();
//
//     return useMutation({
//         mutationFn: async (group_id: string): Promise<void> => {
//             await api.delete(`group_member/quit/${group_id}`);
//         },
//
//         onSuccess: async (_data, group_id) => {
//             await queryClient.invalidateQueries({ queryKey: ['my_own_group'] });
//             await queryClient.invalidateQueries({ queryKey: ['my_all_group'] });
//
//             queryClient.removeQueries({ queryKey: ['current_group', group_id] });
//
//             router.push('/group');
//         },
//
//         onError: (_err) => {
//             toast.error(txt('action_fail'));
//         },
//     });
// }