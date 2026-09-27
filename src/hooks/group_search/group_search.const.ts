// ============================================================
// PAGE SIZE — phải khớp default/limit của BE
// ============================================================
export const NAME_SEARCH_PAGE_SIZE = 8;
export const OUTGOING_PAGE_SIZE = 10;

// ============================================================
// QUERY TAG
// Dùng chung cho queryKey của hook và tag invalidate của mutation.
// `invalidateQueries` so khớp theo prefix nên tag chỉ cần phần đầu,
// vd: ['search_groups_name'] sẽ invalidate cả ['search_groups_name', keyword].
// ============================================================
export const SEARCH_GROUP_SLUG_TAG: string[] = ['search_group_slug'];
export const SEARCH_GROUP_NAME_TAG: string[] = ['search_groups_name'];
export const OUTGOING_JOIN_REQUESTS_TAG: string[] = ['outgoing_join_requests'];

// ============================================================
// QUERY KEY
// ============================================================
export function searchGroupSlugKey(slug: string): string[] {
    return [...SEARCH_GROUP_SLUG_TAG, slug];
}

export function searchGroupNameKey(name: string): string[] {
    return [...SEARCH_GROUP_NAME_TAG, name];
}
