import {BasicUser} from "@/types/user_info/user_info.type";
import {SearchUserResult} from "@/types/friend/friend.type";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Clock, UserMinus, UserPlus} from "lucide-react";

interface ActionButtonsProps {
    user: SearchUserResult;
    isPending: boolean;
    onAdd: () => void;
    onUnfriend: () => void;
}

export  function ActionButtons({ user, isPending, onAdd, onUnfriend }: ActionButtonsProps) {


    const txt = useTranslations('Friend');

    return (
        <>
            {user.permission.add_friend && (
                <Button
                    type="button"
                    size="sm"
                    onClick={onAdd}
                    disabled={isPending}
                    className="shrink-0"
                >
                    <UserPlus size={16} />
                    {txt('add_friend')}
                </Button>
            )}

            {user.permission.cancel_request_friend && (
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled
                    className="shrink-0"
                >
                    <Clock size={16} />
                    {txt('pending')}
                </Button>
            )}

            {user.permission.unfriend && (
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onUnfriend}
                    disabled={isPending}
                    className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-400"
                >
                    <UserMinus size={16} />
                    {txt('unfriend')}
                </Button>
            )}
        </>
    );
}