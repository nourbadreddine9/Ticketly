'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from "@/lib/firebase";

interface TicketStats {
  total: number;
  resolved: number;
  averageRating: number | null;
}

interface AccountData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  joinDate: string;
}

export default function AccountPage() {
  const [accountData, setAccountData] = useState<AccountData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    joinDate: ''
  });

  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [editData, setEditData] = useState(accountData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');

  // 🔹 Récupérer données utilisateur depuis Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'Utilisateur');

        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data() as AccountData;
          setAccountData(data);
          setEditData(data);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Récupérer stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tickets/stats/all');
        const data = await res.json();
        setTicketStats(data);
      } catch (error) {
        console.error('Erreur récupération statistiques:', error);
      }
    };
    fetchStats();
  }, []);

  // 🔹 Gestion formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Ajouter la mise à jour dans Firestore si besoin
      setAccountData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...accountData });
    setIsEditing(false);
  };

  const fieldLabels: Record<keyof AccountData, string> = {
    name: "Nom complet",
    email: "Email",
    phone: "Téléphone",
    company: "Entreprise",
    position: "Poste",
    address: "Adresse",
    joinDate: "Date d’adhésion"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#F08080] rounded-lg flex items-center justify-center">
                <i className="ri-ticket-line text-white text-lg"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, serif' }}>
                Ticketly
              </h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/dashboardC" className="text-gray-600 hover:text-[#F08080]">Mes tickets</Link>
              <Link href="/dashboardC/feedback" className="text-gray-600 hover:text-[#F08080]">Feedback</Link>
              <Link href="/dashboardC/settings" className="text-gray-600 hover:text-[#F08080]">Paramètres</Link>
              <Link href="/dashboardC/account" className="text-[#F08080] font-medium">Mon compte</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#F08080] rounded-full flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </div>
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Mon compte</h2>
          <p className="text-gray-600">Gérez vos informations personnelles et votre profil</p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte utilisateur */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit text-center">
            <div className="w-24 h-24 bg-[#F08080] rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="ri-user-line text-white text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{accountData.name}</h3>
            <p className="text-gray-600 mb-2">{accountData.position}</p>
            <p className="text-gray-600 mb-6">{accountData.company}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-center space-x-2"><i className="ri-mail-line" /><span>{accountData.email}</span></div>
              <div className="flex justify-center space-x-2"><i className="ri-phone-line" /><span>{accountData.phone}</span></div>
              <div className="flex justify-center space-x-2"><i className="ri-calendar-line" /><span>
                Membre depuis {accountData.joinDate ? new Date(accountData.joinDate).toLocaleDateString('fr-FR') : ''}
              </span></div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Informations personnelles</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="bg-[#F08080] text-white px-4 py-2 rounded-lg">Modifier</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="border border-gray-300 px-4 py-2 rounded-lg">Annuler</button>
                    <button onClick={handleSave} disabled={isLoading} className="bg-[#F08080] text-white px-4 py-2 rounded-lg">
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["name", "email", "phone", "company", "position", "address"] as (keyof AccountData)[]).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{fieldLabels[field]}</label>
                    <input
                      type="text"
                      name={field}
                      value={isEditing ? editData[field] : accountData[field]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Statistiques du compte</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#F08080] mb-2">{ticketStats?.total ?? '...'}</div>
                  <p className="text-gray-600">Tickets créés</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">{ticketStats?.resolved ?? '...'}</div>
                  <p className="text-gray-600">Tickets résolus</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{ticketStats?.averageRating ?? '-'} / 5</div>
                  <p className="text-gray-600">Note moyenne</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
