
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';



export default function AuthPage() {
  //const [errorMessage, setErrorMessage] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: ''
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted) return;

    setIsSubmitting(true);
    /////
    setErrorEmail('');
    setErrorPassword('');


    try {
      const { email, password, confirmPassword } = formData;

      if (!isLogin && password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }

      if (isLogin) {
        // 🔑 Connexion avec Firebase
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 🆕 Création de compte avec Firebase
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // ✅ Redirection si tout va bien
      router.push('/');
    } catch (error: any) {
      let message = 'Une erreur est survenue';

      // 🔍 Ajoute ce switch pour gérer les codes Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          //message = "Utilisateur introuvable. Veuillez créer un compte.";
          setErrorEmail("Utilisateur introuvable. Veuillez créer un compte.");
          break;
        case 'auth/wrong-password':
          //message = "Mot de passe incorrect.";
          setErrorPassword("Mot de passe incorrect.");
          break;
        case 'auth/email-already-in-use':
          //message = "Cette adresse e-mail est déjà utilisée.";
          setErrorEmail("Cette adresse e-mail est déjà utilisée.");
          break;
        case 'auth/invalid-email':
          //message = "Adresse e-mail invalide.";
          setErrorEmail("Adresse e-mail invalide.");
          break;
        case 'auth/invalid-credential':
          //message = "Identifiants invalides. Vérifiez vos informations.";
          setErrorEmail("Identifiants invalides. Vérifiez vos informations.");
          break;
        case 'auth/weak-password':
          //message = "Le mot de passe doit contenir au moins 6 caractères.";
          setErrorPassword("Le mot de passe doit contenir au moins 6 caractères.");
          break;
        default:
          message = error.message || message;
      }

      //alert(message);
      //setErrorMessage(message);
      console.error('Erreur Firebase Auth:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleLogin = async () => {
    if (!isMounted) return;

    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Simulate Google login
      //await new Promise(resolve => setTimeout(resolve, 1200));
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Utilisateur connecté via Google :', user);

      // Redirect to dashboard only if component is mounted
      //if (isMounted) {
        router.push('/');
      //}
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    } finally {
      //if (isMounted) {
        setIsGoogleLoading(false);
      //}
    }
  };

  const handleMicrosoftLogin = async () => {
    if (!isMounted) return;

    try {
      // Simulate Microsoft login
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isMounted) {
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Microsoft:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted) return;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Don't render until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFDAB9] to-[#FBC4AB] flex items-center justify-center">
        <div className="w-8 h-8 bg-[#F08080] rounded-lg flex items-center justify-center">
          <i className="ri-loader-4-line animate-spin text-white text-lg"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAB9] to-[#FBC4AB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-[#F08080] rounded-lg flex items-center justify-center">
              <i className="ri-ticket-line text-white text-xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, serif' }}>
              Ticketly
            </h1>
          </Link>
          <p className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                placeholder="votre@email.com"
              />
              {errorEmail && (
                <p className="text-sm text-red-600 mt-1">{errorEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                placeholder="••••••••"
              />
              {errorPassword && <p className="text-sm text-red-600 mt-1">{errorPassword}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F08080] text-white py-3 rounded-lg font-medium hover:bg-[#F4978E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  {isLogin ? 'Connexion...' : 'Création...'}
                </span>
              ) : (
                isLogin ? 'Se connecter' : 'Créer mon compte'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#F08080] hover:text-[#F4978E] font-medium ml-2 cursor-pointer"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isGoogleLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-red-500 mr-2"></i>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="ri-google-fill text-red-500 mr-2"></i>
                  Continuer avec Google
                </>
              )}
            </button>
            <button
              onClick={handleMicrosoftLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <i className="ri-microsoft-fill text-blue-500 mr-2"></i>
              Continuer avec Microsoft
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            En continuant, vous acceptez nos{' '}
            <a href="#" className="text-[#F08080] hover:underline cursor-pointer">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="#" className="text-[#F08080] hover:underline cursor-pointer">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
