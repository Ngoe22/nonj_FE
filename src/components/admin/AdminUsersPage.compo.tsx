'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Ban, Check, KeyRound, Pencil, ShieldPlus, ShieldMinus } from 'lucide-react';

import {
  AdminConfirm,
  AdminDateCell,
  AdminDeletedBadge,
  AdminField,
  AdminIdCell,
  AdminListShell,
  IconAction,
  AdminPageHeader,
  AdminSelectFilter,
  AdminTextCell,
  AdminTextFilter,
  adminInputClass,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminDetailModal from '@/components/admin/_share/AdminDetailModal.compo';
import UsernameCheck from '@/components/_share/check_field/UsernameCheck.compo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminDemote, useAdminPromote, useAdminResetPassword, useAdminUpdateUser } from '@/hooks/admin/admin.hook';
import { User_Role, User_Status } from '@/enum/user/user.enum';
import type { AdminUserRow } from '@/types/admin/admin.type';


/** Modal sửa thông tin người dùng */
function EditUserModal({
  row,
  onClose,
}: {
  row: AdminUserRow;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const update = useAdminUpdateUser();

  const [userName, setUserName] = useState(row.user_name ?? '');
  /**
   * Đổi username thì PHẢI check trùng trước khi lưu.
   * Không đổi thì bỏ qua — admin vẫn sửa được nickname/bio mà không phải check lại.
   */
  const [checkedName, setCheckedName] = useState<string | null>(null);
  const nameChanged = userName.trim() !== (row.user_name ?? '').trim();
  const nameReady = !nameChanged || checkedName === userName.trim();

  const [email, setEmail] = useState(row.email ?? '');
  const [nickname, setNickname] = useState(row.nickname ?? '');
  const [bio, setBio] = useState(row.bio ?? '');

  const save = async () => {
    try {
      const body: Record<string, unknown> = { email, nickname, bio };
      // Chỉ gửi `user_name` khi thực sự đổi: gửi chuỗi rỗng sẽ bị
      // `@MinLength(3)` chặn và trả 400.
      if (nameChanged) body.user_name = userName.trim();

      await update.mutateAsync({ user_id: row.id, body });
      toast.success(txt('updated_ok'));
      onClose();
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">
          {txt('edit')} · {row.user_name}
        </h3>

        <div className="mt-4 space-y-3">
          <AdminField label={txt('username')}>
            <input value={userName} onChange={(e) => setUserName(e.target.value)} className={adminInputClass} />
            {nameChanged && (
              <div className="mt-2">
                <UsernameCheck
                  value={userName}
                  mode="username"
                  onResult={(r) => setCheckedName(r.available ? r.value : null)}
                />
              </div>
            )}
          </AdminField>
          <AdminField label={txt('email')}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={adminInputClass} />
          </AdminField>
          <AdminField label={txt('nickname')}>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={adminInputClass}
            />
          </AdminField>

          <AdminField label="bio">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={`${adminInputClass} min-h-16 resize-y`} />
          </AdminField>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {txt('cancel')}
          </Button>
          <Button type="button" size="sm" disabled={update.isPending || !nameReady} onClick={save}>
            {update.isPending ? txt('saving') : txt('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const txt = useTranslations('Admin');
  const update = useAdminUpdateUser();
  const reset = useAdminResetPassword();
  const promote = useAdminPromote();
  const demote = useAdminDemote();

  const [detail, setDetail] = useState<AdminUserRow | null>(null);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [banning, setBanning] = useState<AdminUserRow | null>(null);
  const [resetting, setResetting] = useState<AdminUserRow | null>(null);
  const [promoting, setPromoting] = useState<AdminUserRow | null>(null);
  const [demoting, setDemoting] = useState<AdminUserRow | null>(null);

  const toggleStatus = async (row: AdminUserRow) => {
    const next =
      row.status === User_Status.BANNED ? User_Status.ACTIVE : User_Status.BANNED;

    try {
      await update.mutateAsync({ user_id: row.id, body: { status: next } });
      toast.success(txt('updated_ok'));
      setBanning(null);
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminPageHeader title={txt('nav_users')} description={txt('users_hint')} />

      <AdminListShell<AdminUserRow>
        resource="user"
        onRowClick={setDetail}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'user_name', label: txt('user_name') },
          { key: 'email', label: txt('email') },
          { key: 'nickname', label: txt('nickname') },
          { key: 'role', label: txt('role') },
          { key: 'status', label: txt('status') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label={txt('id')}>
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label={txt('user_name')}>
              <AdminTextFilter value={query.user_name ?? ''} onChange={(v) => setFilter('user_name', v)} />
            </AdminField>
            <AdminField label={txt('email')}>
              <AdminTextFilter value={query.email ?? ''} onChange={(v) => setFilter('email', v)} />
            </AdminField>
            <AdminField label={txt('nickname')}>
              <AdminTextFilter value={query.nickname ?? ''} onChange={(v) => setFilter('nickname', v)} />
            </AdminField>
            <AdminField label={txt('role')}>
              <AdminSelectFilter
                value={query.role ?? ''}
                onChange={(v) => setFilter('role', v)}
                options={[
                  { value: '', label: txt('all') },
                  { value: User_Role.USER, label: 'USER' },
                  { value: User_Role.SYSTEM_ADMIN, label: 'SYSTEM_ADMIN' },
                ]}
              />
            </AdminField>
            <AdminField label={txt('status')}>
              <AdminSelectFilter
                value={query.status ?? ''}
                onChange={(v) => setFilter('status', v)}
                options={[
                  { value: '', label: txt('all') },
                  { value: User_Status.ACTIVE, label: 'ACTIVE' },
                  { value: User_Status.BANNED, label: 'BANNED' },
                ]}
              />
            </AdminField>
          </>
        )}
        renderActions={(row) => (
          <>
            <IconAction
              label={row.status === User_Status.BANNED ? txt('unban') : txt('ban')}
              tone={row.status === User_Status.BANNED ? 'normal' : 'danger'}
              disabled={update.isPending}
              // Mở khoá là thao tác an toàn -> làm luôn, không bắt xác nhận
              onClick={() =>
                row.status === User_Status.BANNED
                  ? void toggleStatus(row)
                  : setBanning(row)
              }
            >
              {row.status === User_Status.BANNED ? <Check size={14} /> : <Ban size={14} />}
            </IconAction>
            {row.role === User_Role.USER ? (
              <IconAction label={txt('promote_admin')} onClick={() => setPromoting(row)}>
                <ShieldPlus size={14} />
              </IconAction>
            ) : (
              <IconAction label={txt('demote_admin')} tone="danger" onClick={() => setDemoting(row)}>
                <ShieldMinus size={14} />
              </IconAction>
            )}
            <IconAction label={txt('reset_password')} onClick={() => setResetting(row)}>
              <KeyRound size={14} />
            </IconAction>
            <IconAction label={txt('edit')} onClick={() => setEditing(row)}>
              <Pencil size={14} />
            </IconAction>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminTextCell value={row.user_name} width="max-w-[140px]" />
            <AdminTextCell value={row.email} width="max-w-[200px]" />
            <AdminTextCell value={row.nickname} width="max-w-[130px]" />
            <td className="w-[104px] px-3 py-2 align-top text-muted-foreground">
              {row.role === User_Role.SYSTEM_ADMIN ? 'ADMIN' : 'USER'}
            </td>
            <td className="w-[128px] px-3 py-2 align-top">
              <Badge
                variant={row.status === User_Status.BANNED ? 'destructive' : 'secondary'}
              >
                {row.status}
              </Badge>
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {detail && (
        <AdminDetailModal
          title={`${detail.user_name ?? ''} · ${detail.id.slice(0, 8)}`}
          onClose={() => setDetail(null)}
          fields={[
            { label: 'ID', value: detail.id },
            { label: txt('username'), value: detail.user_name },
            { label: txt('email'), value: detail.email },
            { label: txt('nickname'), value: detail.nickname },
            { label: 'bio', value: detail.bio, multiline: true },
            { label: txt('role'), value: detail.role },
            { label: txt('status'), value: detail.status },
            { label: txt('created_at'), value: detail.created_at },
            { label: txt('updated_at'), value: detail.updated_at },
            { label: txt('deleted_at'), value: detail.deleted_at },
          ]}
        />
      )}

      {editing && <EditUserModal row={editing} onClose={() => setEditing(null)} />}

      <AdminConfirm
        open={!!banning}
        title={txt('confirm_ban_title')}
        message={txt('confirm_ban_message')}
        pending={update.isPending}
        onCancel={() => setBanning(null)}
        onConfirm={() => banning && toggleStatus(banning)}
      />

      <AdminConfirm
        open={!!resetting}
        title={txt('reset_password_confirm_title')}
        message={txt('reset_password_confirm_message')}
        pending={reset.isPending}
        onCancel={() => setResetting(null)}
        onConfirm={async () => {
          if (!resetting) return;
          try {
            await reset.mutateAsync(resetting.id);
            toast.success(txt('password_sent'));
            setResetting(null);
          } catch (err: unknown) {
            const code = (err as { response?: { data?: { errorCode?: string } } })?.response?.data?.errorCode;
            toast.error(code === 'email_send_failed' ? txt('email_send_failed') : txt('action_fail'));
          }
        }}
      />

      <AdminConfirm
        open={!!promoting}
        title={txt('confirm_promote_title')}
        message={txt('confirm_promote_message')}
        pending={promote.isPending}
        onCancel={() => setPromoting(null)}
        onConfirm={async () => {
          if (!promoting) return;
          try {
            await promote.mutateAsync(promoting.id);
            toast.success(txt('updated_ok'));
            setPromoting(null);
          } catch {
            toast.error(txt('action_fail'));
          }
        }}
      />

      <AdminConfirm
        open={!!demoting}
        title={txt('confirm_demote_title')}
        message={txt('confirm_demote_message')}
        pending={demote.isPending}
        onCancel={() => setDemoting(null)}
        onConfirm={async () => {
          if (!demoting) return;
          try {
            await demote.mutateAsync(demoting.id);
            toast.success(txt('updated_ok'));
            setDemoting(null);
          } catch (err: unknown) {
            const code = (err as { response?: { data?: { errorCode?: string } } })?.response?.data?.errorCode;
            toast.error(code === 'cannot_demote_self' ? txt('cannot_demote_self') : txt('action_fail'));
          }
        }}
      />
    </div>
  );
}
