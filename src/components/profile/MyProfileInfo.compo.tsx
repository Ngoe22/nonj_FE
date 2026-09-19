import {Card} from "@/components/ui/card";
import {Ban, Mail, SaveCheck, SquarePen, User} from "lucide-react";
import {useTranslations} from "next-intl";
import {updateMyInfoFormValues, updateMyInfoSchema} from "@/schemas/my_profile/update_my_info.shema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {InvalidInput} from "@/components/_share/form_error_warning/FormErrorWarning.compo";
import {useState} from "react";
import {useUpdateMyProfile} from "@/hooks/profile/useUpdateMyProfile.hooks";
import {ActionBtnGroup} from "@/components/_share/about_form/action_btn_group/actionBtnGroup.compo";
import {InfoAndInput} from "@/components/_share/about_form/info_and_input/infoAndInput.compo";



interface Props{
    editAble : {
        nickname : string,
        bio : string,
    }
    uneditAble : {
        user_name : string,
        email : string,
    }
}


export function MyProfileInfo(
    {editAble , uneditAble} : Props
) {

    const txt = useTranslations('MyProfile')

    const [ isEditing , setIsEditing ] = useState(false);

    const { mutate , mutateAsync , isPending , isError , data  } = useUpdateMyProfile()

    const {
        reset ,
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm<updateMyInfoFormValues>({
        resolver: zodResolver(updateMyInfoSchema),
        defaultValues: editAble,
    });

    const onSubmit = async (data :any) => {
        // console.log(data)
        await mutateAsync(data)
        setIsEditing(false)

    }


    return (
        <Card className="mt-4 p-5 sm:p-6">
            <div
                className={`flex items-center justify-between `}
            >
                <h2 className="text-lg font-semibold">
                    {txt('info_header')}
                </h2>

                <ActionBtnGroup
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onConfirm={() => handleSubmit(onSubmit)()}
                    onCancel={ () => {  reset(editAble); setIsEditing(false)}}
                />
            </div>

            <div className="mt-5 space-y-5">
                {/* Username */}
                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
                        <User size={17} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {txt('user_name')}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            @{uneditAble.user_name}
                        </p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
                        <Mail size={17} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {txt('email')}
                        </p>
                        <p className="mt-1 break-all text-sm font-medium">
                            {uneditAble.email}
                        </p>
                    </div>
                </div>

                {/* Nickname */}
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {txt('nickname')}
                    </p>
                    <InfoAndInput
                        isEditing={isEditing}
                        value={editAble.nickname}
                        register={register('nickname')}
                        error={errors.nickname}
                    />
                </div>

                {/* Bio */}
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {txt('bio')}

                    </p>
                    <InfoAndInput
                        isEditing={isEditing}
                        value={editAble.bio}
                        register={register('bio')}
                        error={errors.bio}
                        type="textarea"
                        infoStyle='whitespace-pre-wrap text-sm leading-6 text-foreground rounded-xl bg-surface-hover p-4 mt-2'
                    />
                </div>
            </div>
        </Card>

    )
}