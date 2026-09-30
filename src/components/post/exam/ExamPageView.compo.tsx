'use client';

import { useTranslations } from 'next-intl';

import { QuestionContentView } from '@/components/question_preparation/preparation/detail/SectionView.compo';
import { ChoseCorrectAnswer } from '@/components/post/exam/answers/ChoseCorrectAnswer.compo';
import { ArrangeAnswer } from '@/components/post/exam/answers/ArrangeAnswer.compo';
import { PairingAnswer } from '@/components/post/exam/answers/PairingAnswer.compo';
import { InputAnswer } from '@/components/post/exam/answers/InputAnswer.compo';
import { EssayAnswer } from '@/components/post/exam/answers/EssayAnswer.compo';

import {
    Question_Item_Type,
    Question_Section_Type,
} from '@/enum/question_preparation/question_preparation.enum';
import type {
    DraftItem,
    DraftSection,
    ExamPage,
} from '@/components/post/exam/useExamSession.hook';

interface Props {
    page: ExamPage;
    answers: Record<number, DraftSection>;
    setItemAnswer: (
        sectionIndex: number,
        itemIndex: number,
        draft: DraftItem,
    ) => void;
    setEssayAnswer: (sectionIndex: number, text: string) => void;
    disabled?: boolean;
}

export function ExamPageView({
    page,
    answers,
    setItemAnswer,
    setEssayAnswer,
    disabled,
}: Props) {
    const txt = useTranslations('Post');

    const itemIndex = page.kind === 'item' ? page.itemIndex : -1;

    const draftSection = answers[page.sectionIndex];
    const draftItem: DraftItem | undefined =
        draftSection?.type === Question_Section_Type.MULTIPLE_CHOICE
            ? draftSection.items[itemIndex]
            : undefined;

    return (
        <div className="space-y-4">
            {/* Đề bài chung của section — hiện lại trên MỌI trang của section đó */}
            <div className="rounded-2xl border border-border bg-surface p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium">
                        {page.section.type ===
                        Question_Section_Type.MULTIPLE_CHOICE
                            ? txt('multiple_choice')
                            : txt('essay')}
                    </span>
                    {page.section.title && (
                        <span className="text-sm font-semibold">
                            {page.section.title}
                        </span>
                    )}
                </div>

                <QuestionContentView content={page.section.content} />
            </div>

            {/* ================= 1 ITEM TRẮC NGHIỆM ================= */}
            {page.kind === 'item' && (
                <div className="space-y-4">
                    <div>
                        {page.item.question && (
                            <p className="mb-1 text-base font-medium">
                                {page.item.question}
                            </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                            {txt('point_label')}: {page.item.point}
                        </p>
                    </div>

                    {page.item.type === Question_Item_Type.CHOSE_CORRECT && (
                        <ChoseCorrectAnswer
                            item={page.item}
                            disabled={disabled}
                            value={
                                draftItem?.type ===
                                Question_Item_Type.CHOSE_CORRECT
                                    ? draftItem
                                    : {
                                          type: Question_Item_Type
                                              .CHOSE_CORRECT,
                                          options: [],
                                      }
                            }
                            onChange={(next) =>
                                setItemAnswer(
                                    page.sectionIndex,
                                    itemIndex,
                                    next,
                                )
                            }
                        />
                    )}

                    {page.item.type === Question_Item_Type.ARRANGE && (
                        <ArrangeAnswer
                            item={page.item}
                            disabled={disabled}
                            value={
                                draftItem?.type === Question_Item_Type.ARRANGE
                                    ? draftItem
                                    : {
                                          type: Question_Item_Type.ARRANGE,
                                          order: [],
                                      }
                            }
                            onChange={(next) =>
                                setItemAnswer(
                                    page.sectionIndex,
                                    itemIndex,
                                    next,
                                )
                            }
                        />
                    )}

                    {page.item.type === Question_Item_Type.PAIRING && (
                        <PairingAnswer
                            item={page.item}
                            disabled={disabled}
                            value={
                                draftItem?.type === Question_Item_Type.PAIRING
                                    ? draftItem
                                    : {
                                          type: Question_Item_Type.PAIRING,
                                          pairs: [],
                                      }
                            }
                            onChange={(next) =>
                                setItemAnswer(
                                    page.sectionIndex,
                                    itemIndex,
                                    next,
                                )
                            }
                        />
                    )}

                    {page.item.type === Question_Item_Type.INPUT && (
                        <InputAnswer
                            disabled={disabled}
                            value={
                                draftItem?.type === Question_Item_Type.INPUT
                                    ? draftItem
                                    : {
                                          type: Question_Item_Type.INPUT,
                                          answer: '',
                                      }
                            }
                            onChange={(next) =>
                                setItemAnswer(
                                    page.sectionIndex,
                                    itemIndex,
                                    next,
                                )
                            }
                        />
                    )}
                </div>
            )}

            {/* ================= TRANG TỰ LUẬN ================= */}
            {page.kind === 'essay' && (
                <div className="space-y-2">
                    <p className="text-[11px] text-muted-foreground">
                        {txt('point_label')}: {page.section.point}
                    </p>
                    <EssayAnswer
                        disabled={disabled}
                        value={
                            draftSection?.type === Question_Section_Type.ESSAY
                                ? draftSection.text
                                : ''
                        }
                        onChange={(text) =>
                            setEssayAnswer(page.sectionIndex, text)
                        }
                    />
                </div>
            )}
        </div>
    );
}
