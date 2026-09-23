export interface Collection {
    id: string;
    title: string;
    desc: string;
    _permission: {
        add: boolean;
        edit: boolean;
        delete: boolean;
    };
}

export type UpdateCollectionVars = {
    id: string;
    body: { title: string; desc?: string };
};