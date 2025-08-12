'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { email, password, confirmPassword, name, company } = formData;

    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          company,
          email,
          createdAt: new Date()
        });
      }

      router.push('/dashboard');
    } catch (error: any) {
      let message = "Une erreur est survenue.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "Cet email est déjà utilisé.";
          break;
        case 'auth/invalid-email':
          message = "Email invalide.";
          break;
        case 'auth/weak-password':
          message = "Mot de passe trop faible.";
          break;
        case 'auth/user-not-found':
          message = "Utilisateur non trouvé.";
          break;
        case 'auth/wrong-password':
          message = "Mot de passe incorrect.";
          break;
        default:
          message = error.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          company: "",
          email: user.email,
          createdAt: new Date()
        });
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError("Erreur Google : " + error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAB9] to-[#FBC4AB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-[#F08080] rounded-lg flex items-center justify-center">
              <i className="ri-ticket-line text-white text-xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 font-pacifico">Ticketly</h1>
          </Link>
          <p className="text-gray-600">{isLogin ? 'Connectez-vous' : 'Créez un compte'}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                <input name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#F08080] text-white py-3 rounded-lg">
            {isSubmitting ? 'Chargement...' : isLogin ? 'Connexion' : 'Créer un compte'}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center text-gray-600">
          {isLogin ? (
            <span>Pas encore de compte ? <button onClick={() => setIsLogin(false)} className="text-[#F08080] font-medium">S'inscrire</button></span>
          ) : (
            <span>Déjà un compte ? <button onClick={() => setIsLogin(true)} className="text-[#F08080] font-medium">Se connecter</button></span>
          )}
        </div>

        {/* Google Login */}
        <div className="mt-8 space-y-3">
          <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full border rounded-lg px-4 py-3 flex items-center justify-center">
            {isGoogleLoading ? 'Connexion...' : 'Continuer avec Google'}
          </button>
          <button onClick={() => alert("Connexion Microsoft non implémentée.")} className="w-full border rounded-lg px-4 py-3 flex items-center justify-center">
            Continuer avec Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
