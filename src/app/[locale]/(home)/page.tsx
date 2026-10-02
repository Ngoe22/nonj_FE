import HomePage from '@/components/home/HomePage.compo';

/**
 * Trang chủ. Nội dung thật nằm ở `HomePage` (client component) vì cần đọc cấu
 * hình công khai `/config` (do admin soạn ở `/admin/config`).
 */
export default function Home() {
  return <HomePage />;
}
