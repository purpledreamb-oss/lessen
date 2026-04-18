import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '小遊戲 · Lessen',
  description: '沐哲和杰安的小遊戲',
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      {children}
    </>
  );
}
