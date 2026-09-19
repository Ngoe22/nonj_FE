import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";
import {toast} from "react-toastify";
import {useTranslations} from "next-intl";

//---------------------------------------------

type UpdateProfileBody = {
    nickname?: string;
    bio?: string;
};

type Profile = {
    id: string;
    user_name: string;
    nickname: string;
    email: string;
    bio: string;
    avatar_url: string | null;
};

export function useUpdateMyProfile() {

    const txt = useTranslations("Toast")
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: UpdateProfileBody): Promise<Profile> => {
            const res = await api.patch<{ data: Profile }>('user/me', body);
            return res.data.data;
        },

        // 1. Chạy TRƯỚC khi request gửi đi
        onMutate: async (body) => {
            // Hủy query đang chạy để tránh ghi đè dữ liệu optimistic
            await queryClient.cancelQueries({ queryKey: ['my_profile'] });

            // Lưu snapshot để rollback
            const previousProfile = queryClient.getQueryData<Profile>([
                'my_profile',
            ]);

            // Cập nhật cache ngay lập tức
            queryClient.setQueryData<Profile>(['my_profile'], (old) =>
                old ? { ...old, ...body } : old,
            );

            // Trả context cho onError / onSettled
            return { previousProfile };
        },

        // 2. Nếu lỗi → rollback
        onError: (error, variables, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(
                    ['my_profile'],
                    context.previousProfile,
                );
            }
            toast.error(txt('profile_update_fail'));
        },

        // 3. Dù thành công hay lỗi → đồng bộ lại với server
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['my_profile'],
            });
        },
    });
}