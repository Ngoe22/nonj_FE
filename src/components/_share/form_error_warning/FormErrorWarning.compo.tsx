import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

import { translateErrorKey } from '@/helper/formError/formError.helper';

export function InvalidInput({ msg  , style }: { msg?: string , style?: string }) {
    const txt = useTranslations('Shema');
    if (!msg) return null;

    return (
        <Badge variant="destructive" className={ style ?  style :'mt-2'}>
            {translateErrorKey(txt, msg)}
        </Badge>
    );
}
