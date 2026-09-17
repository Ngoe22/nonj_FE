import ExamPreparationDetail from "@/components/exam_preparation/ExamPreparationDetail.compo";

interface PageProps {
    params: Promise<{
        locale: string;
        collectionId: string;
        examId: string;
    }>;
}

export default async function Page({
                                       params,
                                   }: PageProps) {
    const {
        locale,
        collectionId,
    } = await params;

    return (
        <ExamPreparationDetail
            locale={locale}
            collectionId={collectionId}
        />
    );
}