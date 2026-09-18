import {ReactNode} from "react";
import { Badge } from "@/components/ui/badge"
import {useTranslations} from "next-intl";


export function InvalidInput({ msg }: { msg?: string }) {

    const txt = useTranslations( 'Shema' )
    if (!msg) return null
    return <Badge variant="destructive">{txt(msg)}</Badge>
}