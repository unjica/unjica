import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Profile | Unjica',
  description: 'View and manage your profile, comments, and article reactions',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
} 