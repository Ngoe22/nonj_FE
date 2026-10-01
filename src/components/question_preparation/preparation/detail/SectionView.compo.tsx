'use client';

import { Clock, FileText, ListChecks } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Question_Section_Type } from '@/enum/question_preparation/question_preparation.enum';
import {
    getItemAnswer,
    isEssaySection,
    isMultipleChoiceSection,
    type QuestionAnswerSection,
    type QuestionContent,
    type QuestionContentSection,
} from '@/types/question_preparation/question_preparation.type';
import { ItemView } from './ItemView.compo';

interface Props {
    section: QuestionContentSection;
    answer?: QuestionAnswerSection;
    /** Đáp án của cả đề — cần để tra đáp án từng item */
    allAnswers?: QuestionAnswerSection[] | null;
    index: number;
    /**
     * false = ẩn TOÀN BỘ đáp án. Dùng khi học viên chưa làm bài / xem trước đề,
     * hoặc khi đề không trả `correct_answer`.
     */
    showAnswers?: boolean;
}

/** Đề bài chung: text + ảnh + audio */
export function QuestionContentView({ content }: { content: QuestionContent }) {
    const hasAnything = content?.text || content?.img_url || content?.mp3_url;
    if (!hasAnything) return null;

    return (
        <div className="space-y-2">
            {content.text && (
                <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                    {content.text}
                </p>
            )}
            {content.img_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={content.img_url}
                    alt=""
                    className="max-h-80 w-auto rounded-lg border border-border object-contain"
                />
            )}
            {content.mp3_url && (
                <audio controls src={content.mp3_url} className="w-full" />
            )}
        </div>
    );
}

export function SectionView({
    section,
    answer,
    allAnswers,
    index,
    showAnswers = true,
}: Props) {
    const txt = useTranslations('Question_preparation');

    const isMultipleChoice = isMultipleChoiceSection(section);
    const Icon = isMultipleChoice ? ListChecks : FileText;

    return (
        <section className="rounded-2xl border border-border bg-background p-3 sm:border-2 sm:p-4">
            {/* Đầu mục phần */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Icon size={16} className="shrink-0 text-muted-foreground" />
                    <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium">
                        {isMultipleChoice ? txt('multiple_choice') : txt('essay')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        #{index + 1}
                    </span>
                    {section.title && (
                        <h3 className="min-w-0 break-words text-sm font-semibold text-foreground">
                            {section.title}
                        </h3>
                    )}
                </div>

                {/* Giới hạn thời gian giờ là việc của post, không thuộc đề —
                    chỉ hiện khi đề CŨ còn lưu giá trị này */}
                {!!section.time_limit && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock size={12} />
                        {`${section.time_limit} ${txt('minutes')}`}
                    </div>
                )}
            </div>

            {/* Đề bài chung của phần */}
            {(section.content?.text ||
                section.content?.img_url ||
                section.content?.mp3_url) && (
                <div className="mt-3 rounded-xl border border-border bg-surface p-2.5 sm:p-3">
                    <QuestionContentView content={section.content} />
                </div>
            )}

            {/* ============ MULTIPLE CHOICE ============ */}
            {isMultipleChoice && (
                <div className="mt-3 space-y-2">
                    {section.items.length === 0 && (
                        <p className="rounded-lg border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
                            {txt('no_items')}
                        </p>
                    )}

                    {section.items.map((item, itemIndex) => (
                        <ItemView
                            key={itemIndex}
                            item={item}
                            index={itemIndex}
                            showAnswers={showAnswers}
                            answer={getItemAnswer(
                                allAnswers,
                                index,
                                itemIndex,
                            )}
                        />
                    ))}
                </div>
            )}

            {/* ============ ESSAY ============ */}
            {isEssaySection(section) && (
                <div className="mt-3 space-y-2 rounded-xl border border-border bg-surface p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {txt('point_label')}: {section.point}
                    </p>

                    {showAnswers && (
                        <div>
                            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                {txt('sample_answer_label')}
                            </p>
                            {answer?.type === Question_Section_Type.ESSAY &&
                            answer.sample_answer ? (
                                <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                                    {answer.sample_answer}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    {txt('no_answer')}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
