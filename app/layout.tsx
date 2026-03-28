import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lessen 輕一點',
  description: '為辛苦育兒的家長媒合值得信任的家教、陪玩姊姊與管家服務。讓你有時間，好好做自己。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
