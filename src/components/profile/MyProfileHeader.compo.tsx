import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";



interface Props {
    avatar_url : string |null
    nickname : string;
    user_name : string;
    email : string;
}

export function MyProfileHeader (  {avatar_url ,nickname ,user_name , email } : Props) {
    return (
        <Card className="mt-6 overflow-hidden">
            <div className="p-5 sm:p-6">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                    <Avatar className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                        <AvatarImage
                            src={avatar_url ?? undefined}
                            alt={nickname || user_name}
                        />

                        <AvatarFallback className="text-2xl">
                            {nickname
                                .charAt(0)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-foreground">
                            {nickname}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            @{user_name}
                        </p>

                        <p className="mt-2 break-all text-sm text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </div>
            </div>
        </Card>

    )
}