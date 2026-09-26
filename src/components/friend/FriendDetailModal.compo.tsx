// 'use client';
//
// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from '@/components/ui/avatar';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import {useCurrentFriendStore} from "@/stores/friend/check_user_profile.store";
//
//
//
//
// // ======================================================
//
// export default function FriendDetailModal() {
//     const { user, open, closeModal } = useCurrentFriendStore();
//
//     if (!user) return null;
//
//     return (
//         <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
//             <DialogContent className="max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Thông tin người dùng</DialogTitle>
//                 </DialogHeader>
//
//                 <div className="flex flex-col items-center gap-4 pt-2">
//                     <Avatar className="h-20 w-20">
//                         <AvatarImage src={user.avatar_url ?? undefined} alt={user.user_name} />
//                         <AvatarFallback className="text-2xl">
//                             {user.nickname?.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                     </Avatar>
//
//                     <div className="text-center">
//                         <p className="text-lg font-semibold">@{user.user_name}</p>
//                         <p className="mt-0.5 text-sm text-muted-foreground">
//                             {user.nickname}
//                         </p>
//                     </div>
//
//                     {user.bio && (
//                         <div className="w-full rounded-xl border border-border bg-surface p-3">
//                             <p className="text-xs uppercase tracking-wide text-muted-foreground">
//                                 Bio
//                             </p>
//                             <p className="mt-1 text-sm">{user.bio}</p>
//                         </div>
//                     )}
//
//                     {/* Thêm thông tin khác sau */}
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }