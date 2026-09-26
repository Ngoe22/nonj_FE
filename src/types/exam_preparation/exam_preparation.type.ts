// ============================================================
// Collection
// ============================================================
export interface ExamCollection {
    id: string;
    title: string;
    desc?: string | null;
    created_at: string;
}

// ============================================================
// Template (exercise)
// ============================================================
export interface ExamTemplate {
    id: string;
    title: string;
    exercise_content?: unknown;   // shape sẽ phát triển sau
    created_at: string;
}

// ============================================================
// Mutation vars
// ============================================================
export interface CreateCollectionVars {
    title: string;
    desc?: string;
}

export interface UpdateCollectionVars {
    id: string;
    body: { title?: string; desc?: string };
}

export interface CreateTemplateVars {
    title: string;
    exercise_content?: unknown;
}

export interface UpdateTemplateVars {
    collection_id: string;
    template_id: string;
    body: { title?: string; exercise_content?: unknown };
}

export interface DeleteTemplateVars {
    template_id: string;
}