'use client';

import { useTranslations } from 'next-intl';
import {
  FileText,
  Handshake,
  Link2,
  Mail,
  Telescope,
  UserGroup,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useGetPublicConfig } from '@/hooks/config/use_get_media_limits.hook';

/**
 * Trang chủ: lời chào + link nhanh + nội dung & liên hệ do ADMIN soạn
 * (sửa ở `/admin/config`, đọc qua endpoint công khai `/config`).
 *
 * Phần `home_text` và liên hệ để trống thì TỰ ẨN — không hiện khung rỗng.
 */
export default function HomePage() {
  const txt = useTranslations('Home');
  const txtSidebar = useTranslations('Sidebar');
  const { data: config } = useGetPublicConfig();

  const cards = [
    {
      href: '/group',
      icon: Handshake,
      title: txtSidebar('group'),
      desc: txt('group_desc'),
    },
    {
      href: '/question_preparation',
      icon: FileText,
      title: txtSidebar('question_preparation'),
      desc: txt('preparation_desc'),
    },
    {
      href: '/friends',
      icon: UserGroup,
      title: txtSidebar('friend'),
      desc: txt('friend_desc'),
    },
    {
      href: '/group_search',
      icon: Telescope,
      title: txtSidebar('group_search'),
      desc: txt('discover_desc'),
    },
  ];

  const homeText = config?.home_text?.trim();
  const facebook = config?.contact_facebook?.trim();
  const email = config?.contact_email?.trim();
  const hasContact = !!facebook || !!email;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* -------- lời chào -------- */}
      <header>
        <h1 className="text-xl font-semibold sm:text-2xl">{txt('welcome')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {txt('welcome_desc')}
        </p>
      </header>

      {/* -------- nội dung admin soạn -------- */}
      {homeText && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 text-sm leading-6 whitespace-pre-wrap">
          {homeText}
        </div>
      )}

      {/* -------- link nhanh -------- */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold">{txt('quick_links')}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="flex items-start gap-3 rounded-2xl border-2 border-border p-4 transition hover:border-foreground/40 hover:bg-surface-hover"
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {card.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -------- liên hệ (ẩn nếu admin chưa cấu hình) -------- */}
      {hasContact && (
        <section className="mt-8 rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">{txt('contact')}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {txt('contact_desc')}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition hover:bg-surface-hover"
              >
                <Link2 size={15} />
                {txt('contact_facebook')}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition hover:bg-surface-hover"
              >
                <Mail size={15} />
                {txt('contact_email')}: {email}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
