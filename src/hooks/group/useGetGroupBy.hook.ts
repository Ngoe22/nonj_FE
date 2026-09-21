import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";


// search
// by@ one  | by name - many

// get my joined - many  | my own many


export function useGetJoinedGroup() {
    return useQuery({
        queryKey: ['my_all_group'],
        queryFn: async () => {
            const res = await api.get('group/joined');

            console.log(res.data.data)

            return res.data.data;
        },
        staleTime: 60 * 60 * 1000,
    });
}

export function useGetOwnGroup() {
    return useQuery({
        queryKey: ['my_own_group'],
        queryFn: async () => {
            const res = await api.get('group/own');

            console.log(res.data.data)

            return res.data.data;
        },
        staleTime: 60 * 60 * 1000,
    });
}