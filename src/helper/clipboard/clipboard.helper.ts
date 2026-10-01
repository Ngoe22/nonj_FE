/**
 * Copy văn bản vào clipboard, có đường dự phòng.
 *
 * `navigator.clipboard` chỉ chạy ở secure context (https hoặc localhost) và có
 * thể bị từ chối; khi đó rơi về cách cũ dùng `textarea` ẩn + `execCommand`.
 */
export async function copyToClipboard(value: string): Promise<boolean> {
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // rơi xuống cách dự phòng bên dưới
  }

  try {
    const holder = document.createElement('textarea');
    holder.value = value;
    holder.setAttribute('readonly', '');
    holder.style.position = 'fixed';
    holder.style.top = '-1000px';
    holder.style.opacity = '0';

    document.body.appendChild(holder);
    holder.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(holder);

    return ok;
  } catch {
    return false;
  }
}
