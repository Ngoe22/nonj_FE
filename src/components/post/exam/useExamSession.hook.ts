'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    Question_Item_Type,
    Question_Section_Type,
} from '@/enum/question_preparation/question_preparation.enum';
import type {
    EssayContentSection,
    MultipleChoiceContentSection,
    QuestionContentItem,
    QuestionContentSection,
} from '@/types/question_preparation/question_preparation.type';
import type {
    SubmissionEssaySection,
    SubmissionItem,
    SubmissionSection,
} from '@/types/post/post.type';

// ============================================================
// Trang của bài thi — MỖI ITEM LÀ MỘT TRANG
// (section tự luận chỉ có 1 trang vì không có item)
// ============================================================

export type ExamPage =
    | {
          kind: 'item';
          pageKey: string;
          sectionIndex: number;
          itemIndex: number;
          section: MultipleChoiceContentSection;
          item: QuestionContentItem;
      }
    | {
          kind: 'essay';
          pageKey: string;
          sectionIndex: number;
          section: EssayContentSection;
      };

export function buildExamPages(content: QuestionContentSection[]): ExamPage[] {
    const pages: ExamPage[] = [];

    content.forEach((section, sectionIndex) => {
        if (section.type === Question_Section_Type.ESSAY) {
            pages.push({
                kind: 'essay',
                pageKey: `s${sectionIndex}`,
                sectionIndex,
                section,
            });
            return;
        }

        section.items.forEach((item, itemIndex) => {
            pages.push({
                kind: 'item',
                pageKey: `s${sectionIndex}i${itemIndex}`,
                sectionIndex,
                itemIndex,
                section,
                item,
            });
        });
    });

    return pages;
}

// ============================================================
// Bản nháp đáp án đang soạn (khác shape với bài nộp cuối cùng)
// ============================================================

export interface DraftChoseCorrect {
    type: Question_Item_Type.CHOSE_CORRECT;
    options: number[];
}
export interface DraftArrange {
    type: Question_Item_Type.ARRANGE;
    order: string[];
}
export interface DraftPairing {
    type: Question_Item_Type.PAIRING;
    pairs: { key: string; value: string }[];
}
export interface DraftInput {
    type: Question_Item_Type.INPUT;
    answer: string;
}

export type DraftItem =
    | DraftChoseCorrect
    | DraftArrange
    | DraftPairing
    | DraftInput;

export type DraftSection =
    | { type: Question_Section_Type.MULTIPLE_CHOICE; items: Record<number, DraftItem> }
    | { type: Question_Section_Type.ESSAY; text: string };

// ============================================================
// Chuyển nháp -> payload gửi BE (song song với correct_answer, KHÔNG có point)
// ============================================================

/**
 * Các phần TỰ LUẬN học viên còn để trống.
 *
 * Tự luận BẮT BUỘC phải viết gì đó — nộp bài với phần tự luận trắng thì giáo
 * viên không có gì để chấm. (Trắc nghiệm bỏ trống thì vẫn nộp được và tính sai.)
 */
export function findBlankEssaySections(
    content: QuestionContentSection[],
    answers: Record<number, DraftSection>,
): number[] {
    return content
        .map((section, index) => ({ section, index }))
        .filter(({ section, index }) => {
            if (section.type !== Question_Section_Type.ESSAY) return false;
            const draft = answers[index];
            const text =
                draft?.type === Question_Section_Type.ESSAY ? draft.text : '';
            return text.trim() === '';
        })
        .map(({ index }) => index);
}

export function buildSubmission(
    content: QuestionContentSection[],
    answers: Record<number, DraftSection>,
): SubmissionSection[] {
    return content.map((section, sectionIndex): SubmissionSection => {
        const draft = answers[sectionIndex];

        if (section.type === Question_Section_Type.ESSAY) {
            const essay: SubmissionEssaySection = {
                type: Question_Section_Type.ESSAY,
                text: draft?.type === Question_Section_Type.ESSAY ? draft.text : '',
            };
            return essay;
        }

        const draftItems =
            draft?.type === Question_Section_Type.MULTIPLE_CHOICE
                ? draft.items
                : {};

        const items = section.items.map((item, itemIndex): SubmissionItem => {
            const d = draftItems[itemIndex];

            switch (item.type) {
                case Question_Item_Type.CHOSE_CORRECT:
                    return {
                        type: Question_Item_Type.CHOSE_CORRECT,
                        correct_options:
                            d?.type === Question_Item_Type.CHOSE_CORRECT
                                ? d.options
                                : [],
                    };
                case Question_Item_Type.ARRANGE:
                    return {
                        type: Question_Item_Type.ARRANGE,
                        correct:
                            d?.type === Question_Item_Type.ARRANGE ? d.order : [],
                    };
                case Question_Item_Type.PAIRING:
                    return {
                        type: Question_Item_Type.PAIRING,
                        pairs:
                            d?.type === Question_Item_Type.PAIRING ? d.pairs : [],
                    };
                case Question_Item_Type.INPUT:
                    return {
                        type: Question_Item_Type.INPUT,
                        correct_answers:
                            d?.type === Question_Item_Type.INPUT &&
                            d.answer.trim() !== ''
                                ? [d.answer]
                                : [],
                    };
            }
        });

        return {
            type: Question_Section_Type.MULTIPLE_CHOICE,
            items,
        };
    });
}

// ============================================================
// Đồng hồ
// ============================================================

export function formatDuration(totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ============================================================
// Hook phiên làm bài
// ============================================================

interface UseExamSessionInput {
    content: QuestionContentSection[];
    onSubmit: (payload: SubmissionSection[]) => void | Promise<void>;
    /** false = chế độ xem lại, đồng hồ đứng yên */
    timerEnabled?: boolean;
    /** nạp sẵn đáp án cũ (khi làm lại) */
    initialAnswers?: Record<number, DraftSection>;
}

export function useExamSession({
    content,
    onSubmit,
    timerEnabled = true,
    initialAnswers,
}: UseExamSessionInput) {
    const pages = useMemo(() => buildExamPages(content), [content]);

    const [pageIndex, setPageIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, DraftSection>>(
        initialAnswers ?? {},
    );

    const currentPage = pages[pageIndex];
    const currentSectionIndex = currentPage?.sectionIndex ?? 0;

    // ---------- đồng hồ RIÊNG cho từng section ----------
    // Lưu theo section để rời trang rồi quay lại KHÔNG reset được giờ.
    const [remainingBySection, setRemainingBySection] = useState<
        Record<number, number | null>
    >({});

    // Khởi tạo + đếm lùi đều nằm TRONG callback của interval.
    // Không setState đồng bộ trong thân effect -> tránh cascading render.
    useEffect(() => {
        if (!timerEnabled) return;

        const id = setInterval(() => {
            setRemainingBySection((prev) => {
                const limit =
                    content[currentSectionIndex]?.time_limit ?? null;
                const current =
                    currentSectionIndex in prev
                        ? prev[currentSectionIndex]
                        : limit === null
                          ? null
                          : limit * 60;

                if (current === null || current <= 0) return prev;

                return { ...prev, [currentSectionIndex]: current - 1 };
            });
        }, 1000);

        return () => clearInterval(id);
    }, [currentSectionIndex, content, timerEnabled]);

    // Chưa có trong map = section vừa mở, hiển thị đủ thời lượng ngay lập tức
    // (interval sẽ khởi tạo giá trị thật ở nhịp kế tiếp).
    const currentLimit = content[currentSectionIndex]?.time_limit ?? null;
    const currentSectionRemaining =
        currentSectionIndex in remainingBySection
            ? remainingBySection[currentSectionIndex]
            : currentLimit === null
              ? null
              : currentLimit * 60;


    const submittedRef = useRef(false);

    /** Đã bấm nộp lần nào chưa — chỉ hiện cảnh báo SAU lần bấm đầu */
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Tính lại mỗi khi bài làm đổi -> học viên điền vào là cảnh báo tự mất
    const blankEssays = useMemo(
        () => findBlankEssaySections(content, answers),
        [content, answers],
    );

    const submit = useCallback(
        async (options?: { force?: boolean }) => {
            if (submittedRef.current) return;

            // `force` dùng cho trường hợp HẾT GIỜ: phải nộp, không thể chặn
            if (!options?.force) {
                const blank = findBlankEssaySections(content, answers);
                if (blank.length > 0) {
                    setSubmitAttempted(true);
                    // nhảy tới phần tự luận còn trống đầu tiên
                    const target = pages.findIndex(
                        (page) => page.sectionIndex === blank[0],
                    );
                    if (target >= 0) setPageIndex(target);
                    return;
                }
            }

            submittedRef.current = true;
            try {
                await onSubmit(buildSubmission(content, answers));
            } catch (error) {
                // Nộp fail (mạng/4xx) -> reset để cho phép bấm Nộp lại.
                // Trước đây ref giữ `true` vĩnh viễn -> bấm Nộp không làm gì,
                // người dùng kẹt, buộc thoát exam (mất toàn bộ draft).
                submittedRef.current = false;
                throw error;
            }
        },
        [content, answers, onSubmit, pages],
    );

    // Hết giờ section -> sang section kế; hết section cuối -> nộp bài.
    // Việc chuyển trang ở đây do ĐỒNG HỒ điều khiển (external event), không
    // phải cascading render sinh ra từ prop/state khác.
    useEffect(() => {
        if (!timerEnabled) return;
        if (currentSectionRemaining !== 0) return;

        const nextPageIndex = pages.findIndex(
            (page) => page.sectionIndex > currentSectionIndex,
        );

        if (nextPageIndex === -1) {
            // Hết giờ -> NỘP BẤT CHẤP, không chặn vì tự luận còn trống.
            // `force: true` nên không đi vào nhánh setState bên trong `submit`;
            // rule không suy luận được điều đó nên phải tắt tại đây.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            void submit({ force: true });
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPageIndex(nextPageIndex);
        }
    }, [
        currentSectionRemaining,
        currentSectionIndex,
        pages,
        submit,
        timerEnabled,
    ]);

    // ---------- setters ----------
    const setItemAnswer = useCallback(
        (sectionIndex: number, itemIndex: number, draft: DraftItem) => {
            setAnswers((prev) => {
                const section = prev[sectionIndex];
                const multipleChoice =
                    section?.type === Question_Section_Type.MULTIPLE_CHOICE
                        ? section
                        : {
                              type: Question_Section_Type.MULTIPLE_CHOICE as const,
                              items: {} as Record<number, DraftItem>,
                          };

                return {
                    ...prev,
                    [sectionIndex]: {
                        ...multipleChoice,
                        items: { ...multipleChoice.items, [itemIndex]: draft },
                    },
                };
            });
        },
        [],
    );

    const setEssayAnswer = useCallback((sectionIndex: number, text: string) => {
        setAnswers((prev) => ({
            ...prev,
            [sectionIndex]: { type: Question_Section_Type.ESSAY, text },
        }));
    }, []);

    // ---------- điều hướng ----------
    const goNext = useCallback(
        () => setPageIndex((index) => Math.min(index + 1, pages.length - 1)),
        [pages.length],
    );
    const goPrev = useCallback(
        () => setPageIndex((index) => Math.max(index - 1, 0)),
        [],
    );
    const goTo = useCallback((index: number) => setPageIndex(index), []);

    const isFirst = pageIndex === 0;
    const isLast = pages.length === 0 || pageIndex === pages.length - 1;

    // ---------- tiến độ ----------
    const answeredCount = useMemo(() => {
        let count = 0;
        content.forEach((section, sectionIndex) => {
            const draft = answers[sectionIndex];

            if (section.type === Question_Section_Type.ESSAY) {
                if (draft?.type === Question_Section_Type.ESSAY && draft.text.trim())
                    count += 1;
                return;
            }

            if (draft?.type !== Question_Section_Type.MULTIPLE_CHOICE) return;

            section.items.forEach((_, itemIndex) => {
                if (draft.items[itemIndex]) count += 1;
            });
        });
        return count;
    }, [answers, content]);


    return {
        pages,
        pageIndex,
        currentPage,
        currentSectionIndex,
        isFirst,
        isLast,
        answers,
        setItemAnswer,
        setEssayAnswer,
        goNext,
        goPrev,
        goTo,
        submit,
        answeredCount,
        totalPages: pages.length,
        currentSectionRemaining,
        /** Chỉ khác rỗng SAU khi bấm nộp mà còn tự luận trống */
        blankEssaySections: submitAttempted ? blankEssays : [],
    };
}

// ============================================================
// Dựng lại bản nháp từ bài đã nộp — dùng khi LÀM LẠI
// ============================================================

export function buildDraftFromSubmission(
    content: QuestionContentSection[],
    submission: SubmissionSection[] | null | undefined,
): Record<number, DraftSection> {
    const result: Record<number, DraftSection> = {};
    if (!Array.isArray(submission)) return result;

    content.forEach((section, sectionIndex) => {
        const submittedSection = submission[sectionIndex];

        if (section.type === Question_Section_Type.ESSAY) {
            result[sectionIndex] = {
                type: Question_Section_Type.ESSAY,
                text:
                    submittedSection?.type === Question_Section_Type.ESSAY
                        ? (submittedSection.text ?? '')
                        : '',
            };
            return;
        }

        const items: Record<number, DraftItem> = {};

        if (submittedSection?.type === Question_Section_Type.MULTIPLE_CHOICE) {
            section.items.forEach((item, itemIndex) => {
                const submittedItem = submittedSection.items[itemIndex];
                if (!submittedItem) return;

                switch (item.type) {
                    case Question_Item_Type.CHOSE_CORRECT:
                        if (
                            submittedItem.type ===
                            Question_Item_Type.CHOSE_CORRECT
                        ) {
                            items[itemIndex] = {
                                type: Question_Item_Type.CHOSE_CORRECT,
                                options: submittedItem.correct_options ?? [],
                            };
                        }
                        break;

                    case Question_Item_Type.ARRANGE:
                        if (
                            submittedItem.type === Question_Item_Type.ARRANGE
                        ) {
                            items[itemIndex] = {
                                type: Question_Item_Type.ARRANGE,
                                order: submittedItem.correct ?? [],
                            };
                        }
                        break;

                    case Question_Item_Type.PAIRING:
                        if (
                            submittedItem.type === Question_Item_Type.PAIRING
                        ) {
                            items[itemIndex] = {
                                type: Question_Item_Type.PAIRING,
                                pairs: submittedItem.pairs ?? [],
                            };
                        }
                        break;

                    case Question_Item_Type.INPUT:
                        if (submittedItem.type === Question_Item_Type.INPUT) {
                            items[itemIndex] = {
                                type: Question_Item_Type.INPUT,
                                answer:
                                    (submittedItem.correct_answers ?? [])[0] ??
                                    '',
                            };
                        }
                        break;
                }
            });
        }

        result[sectionIndex] = {
            type: Question_Section_Type.MULTIPLE_CHOICE,
            items,
        };
    });

    return result;
}
