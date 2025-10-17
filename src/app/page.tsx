import { redirect } from 'next/navigation';

export default function Home() {
  // Rediriger vers la page d'authentification
  redirect('/auth');
}
