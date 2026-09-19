import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/axios/axios";


// search
// by@ one  | by name - many

// get my joined - many  | my own many



//
// export function useGetGroupBy() {
//     return useQuery({
//         queryKey: ['my_profile'],
//         queryFn: async () => {
//             const res = await api.get<Res>('user/me');
//
//             return res.data.data;
//         },
//         staleTime: 60 * 60 * 1000,
//     });
// }