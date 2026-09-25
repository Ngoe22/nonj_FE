import {useTanCrud} from "@/hooks/tan_crud/tan_crud.hook";

export  function  useGroup ()  {

    return useTanCrud({
        endpoints: {
            getJoinedGroups: {
                tag: 'group',
                type: 'getMany',
                endpoint: 'group/:groupId/collection',
                keySuffix : [ 'joined' ]
            },
            getOwedGroups: {
                tag: 'group',
                type: 'getOne',
                endpoint: 'group/:groupId/collection/:id',
                keySuffix : [ 'owed' ]
            },
            createGroup: {
                tag: 'group',
                type: 'createOne',
                endpoint: 'group/:groupId/collection',
            },
            updateCollection: {
                tag: 'current_group',
                type: 'updateOne',
                endpoint: 'group/:groupId/collection/:id',
            },
            deleteCollection: {
                tag: 'current_group',
                type: 'deleteOne',
                endpoint: 'group/:groupId/collection/:id',
            },
            quitCollection: {
                tag: 'current_group',
                type: 'deleteOne',
                endpoint: 'group/:groupId/collection/:id/quit',
            },
        },
        pageSize: 20,
    })
}





/**

 const crud = useTanCrud<Collection, typeof endpoints>({
 endpoints: {
 getCollections: {
 tag: 'collections',
 type: 'getMany',
 endpoint: 'group/:groupId/collection',
 },
 getCollection: {
 tag: 'collection',
 type: 'getOne',
 endpoint: 'group/:groupId/collection/:id',
 },
 createCollection: {
 tag: 'collection',
 type: 'createOne',
 endpoint: 'group/:groupId/collection',
 },
 updateCollection: {
 tag: 'collection',
 type: 'updateOne',
 endpoint: 'group/:groupId/collection/:id',
 },
 deleteCollection: {
 tag: 'collection',
 type: 'deleteOne',
 endpoint: 'group/:groupId/collection/:id',
 },
 // ⬇️ Endpoint thứ 6, cùng type `deleteOne`
 quitCollection: {
 tag: 'collection',
 type: 'deleteOne',
 endpoint: 'group/:groupId/collection/:id/quit',
 },
 },
 pageSize: 20,
 });

 // ============ GET MANY ============
 const list = crud.getCollections({ dynamicValues: { groupId } });

 // ============ GET ONE ============
 const one = crud.getCollection({
 dynamicValues: { groupId, id: collectionId },
 });

 // ============ CREATE ============
 const createMutation = crud.createCollection({
 dynamicValues: { groupId },
 invalidateTags: ['collections'],
 });
 createMutation.mutate({ title: 'X', desc: 'Y' });

 // ============ UPDATE ============
 const updateMutation = crud.updateCollection({
 dynamicValues: { groupId },
 optimistic: {
 pagesTag: 'collections',
 pagesMode: 'update',
 oneTag: 'collection',
 oneMode: 'update',
 },
 invalidateTags: ['collections'],
 });
 updateMutation.mutate({ id, body: { title: 'New' } });

 // ============ DELETE ============
 const deleteMutation = crud.deleteCollection({
 dynamicValues: { groupId },
 optimistic: { pagesTag: 'collections', pagesMode: 'remove' },
 invalidateTags: ['collections'],
 });
 deleteMutation.mutate(id);

 // ============ QUIT (cùng type deleteOne) ============
 const quitMutation = crud.quitCollection({
 dynamicValues: { groupId },
 optimistic: { pagesTag: 'collections', pagesMode: 'remove' },
 invalidateTags: ['collections', 'my_own_group'],
 removeTags: ['collection'],  // ✅ xoá cache luôn
 });
 quitMutation.mutate(id);


 * */



