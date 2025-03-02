import { redirect } from 'next/navigation';

export default function DigestPage() {
  // Redirect to the root page which now serves as our digest page
  redirect('/');
} 