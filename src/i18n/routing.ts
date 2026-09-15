import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
});


//  Sau này thêm: locales: ['vi', 'en', 'ja', 'ko', 'zh']