'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import type { UseMutationResult } from '@tanstack/react-query';

import {
  AdminPageHeader,
  adminInputClass,
} from '@/components/admin/_share/AdminListShell.compo';
import { Button } from '@/components/ui/button';
import {
  useAdminConfig,
  type AdminConfig,
  type UpdateConfigVars,
} from '@/hooks/config/use_admin_config.hook';

interface UpdateResult {
  success: boolean;
  config?: AdminConfig;
  errorCode?: string;
}

interface ConfigFormProps {
  initial: AdminConfig;
  mutation: UseMutationResult<UpdateResult, Error, UpdateConfigVars>;
}

export default function AdminConfigPage() {
  const txt = useTranslations('Admin');
  const { query, mutation } = useAdminConfig();

  return (
    <div>
      <AdminPageHeader
        title={txt('config_title')}
        description={txt('config_description')}
      />

      {query.isLoading && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {txt('config_loading')}
        </p>
      )}

      {query.isError && (
        <p className="rounded-xl border border-dashed border-destructive/40 p-4 text-center text-sm text-destructive">
          {txt('config_load_failed')}
        </p>
      )}

      {query.data && <ConfigForm initial={query.data} mutation={mutation} />}
    </div>
  );
}

function ConfigForm({ initial, mutation }: ConfigFormProps) {
  const txt = useTranslations('Admin');

  const [images, setImages] = useState(initial.post_max_images);
  const [audio, setAudio] = useState(initial.post_max_audio);
  const [homeText, setHomeText] = useState(initial.home_text ?? '');
  const [facebook, setFacebook] = useState(initial.contact_facebook ?? '');
  const [email, setEmail] = useState(initial.contact_email ?? '');

  const save = async () => {
    const ni = Number(images);
    const na = Number(audio);
    if (!Number.isInteger(ni) || !Number.isInteger(na) || ni < 0 || na < 0) {
      toast.error(txt('config_invalid'));
      return;
    }

    const results = await Promise.all([
      mutation.mutateAsync({ key: 'post_max_images', value: ni }),
      mutation.mutateAsync({ key: 'post_max_audio', value: na }),
      mutation.mutateAsync({ key: 'home_text', value: homeText }),
      mutation.mutateAsync({ key: 'contact_facebook', value: facebook }),
      mutation.mutateAsync({ key: 'contact_email', value: email }),
    ]);

    if (results.every((r) => r?.success)) {
      toast.success(txt('config_saved'));
    } else {
      toast.error(txt('config_save_failed'));
    }
  };

  const labelClass = 'mb-1 block text-xs font-medium text-muted-foreground';
  const hintClass = 'mt-1 block text-[11px] text-muted-foreground';

  return (
    <div className="max-w-2xl space-y-8">
      {/* -------- giới hạn ảnh / mp3 -------- */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">{txt('config_group_limits')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              {txt('config_post_max_images')}
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{txt('config_post_max_audio')}</label>
            <input
              type="number"
              min={0}
              step={1}
              value={audio}
              onChange={(e) => setAudio(e.target.value)}
              className={adminInputClass}
            />
          </div>
        </div>
      </section>

      {/* -------- nội dung trang chủ -------- */}
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-sm font-semibold">{txt('config_group_content')}</h2>
        <div>
          <label className={labelClass}>{txt('config_home_text')}</label>
          <textarea
            rows={4}
            value={homeText}
            onChange={(e) => setHomeText(e.target.value)}
            className={`${adminInputClass} resize-y`}
          />
          <span className={hintClass}>{txt('config_home_text_hint')}</span>
        </div>
      </section>

      {/* -------- liên hệ -------- */}
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-sm font-semibold">{txt('config_group_contact')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              {txt('config_contact_facebook')}
            </label>
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{txt('config_contact_email')}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hotro@nonj.site"
              className={adminInputClass}
            />
          </div>
        </div>
        <span className={hintClass}>{txt('config_contact_hint')}</span>
      </section>

      <div className="border-t border-border pt-6">
        <Button onClick={save} disabled={mutation.isPending} className="gap-2">
          <Save size={14} />
          {mutation.isPending ? txt('config_saving') : txt('config_save')}
        </Button>
      </div>
    </div>
  );
}
