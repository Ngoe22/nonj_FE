'use client';

import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

import { SectionView } from '@/components/question_preparation/preparation/detail/SectionView.compo';
import type { QuestionContentSection } from '@/types/question_preparation/question_preparation.type';

/**
 * Xem nội dung đề ngay trong khu quản trị.
 *
 * Dùng lại `SectionView` của trang người dùng nên đề hiển thị GIỐNG HỆT lúc
 * làm bài (đề chung, trắc nghiệm, tự luận, sắp xếp, nối cặp) — không phải viết
 * lại một bản render riêng rồi lệch nhau về sau.
 *
 * `showAnswers` bật vì admin cần đối chiếu đáp án; label `SA` ở BE đã trả
 * `correct_answer`.
 */
export default function AdminContentModal({
  title,
  content,
  onClose,
}: {
  title: string;
  content?: QuestionContentSection[] | null;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const sections = content ?? [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-border p-4">
          <div className="min-w-0 flex-1">
            <h3 className="wrap-break-word font-medium">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {txt('readonly_hint')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={txt('close')}
            className="rounded p-1 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            <X size={16} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
          {sections.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {txt('no_content')}
            </p>
          ) : (
            sections.map((section, index) => (
              <SectionView
                key={index}
                section={section}
                index={index}
                showAnswers
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
