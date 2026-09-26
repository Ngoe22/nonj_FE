// ============================================================
// Entity
// ============================================================
export interface Collection {
    id: string;
    title: string;
    desc?: string;
    permission: {
        edit: boolean;
        delete: boolean;
    };
}

// ============================================================
// Mutation variables
// ============================================================
export interface UpdateCollectionVars {
    id: string;
    body: {
        title?: string;
        desc?: string;
    };
}