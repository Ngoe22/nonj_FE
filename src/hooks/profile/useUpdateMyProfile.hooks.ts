import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";
import {toast} from "react-toastify";
import {useTranslations} from "next-intl";

//---------------------------------------------

type UpdateProfileBody = {
    nickname?: string;
    bio?: string;
    /** URL ảnh đại diện sau khi upload lên R2 (null = gỡ ảnh) */
    avatar_url?: string | null;
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

        onMutate: async (body) => {
            await queryClient.cancelQueries({ queryKey: ['my_profile'] });

            const previousProfile = queryClient.getQueryData<Profile>([
                'my_profile',
            ]);

            queryClient.setQueryData<Profile>(['my_profile'], (old) =>
                old ? { ...old, ...body } : old,
            );

            return { previousProfile };
        },

        onError: (error, variables, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(
                    ['my_profile'],
                    context.previousProfile,
                );
            }
            toast.error(txt('profile_update_fail'));
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['my_profile'],
            });
        },
    });
}