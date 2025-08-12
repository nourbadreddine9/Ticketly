// components/LogoutButton.tsx
'use client';
import { signOut } from 'firebase/auth';
import { auth } from '../app/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth'); // Redirection après déconnexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:underline font-medium"
    >
      Déconnexion
    </button>
  );
}
