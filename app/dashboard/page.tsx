'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TicketCard from '@/components/TicketCard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'transferred';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply: string;
  category: string;
}

const mapStatus = (statut: string | null | undefined): 'pending' | 'resolved' | 'transferred' => {
  const s = (statut || '').trim().toLowerCase();
  if (['en attente', 'attente', 'pending'].includes(s)) return 'pending';
  if (['résolu', 'resolu', 'resolved'].includes(s)) return 'resolved';
  if (['transféré', 'transfere', 'transferred'].includes(s)) return 'transferred';
  return 'pending';
};

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, satisfaction: 4.8 });
  const [userName, setUserName] = useState<string>(''); // ✅ déplacé ici

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'Utilisateur');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tickets');
      const data = await res.json();
      const formatted = data.map((t: any): Ticket => ({
        id: t.id || t._id || '',
        subject: t.message,
        status: mapStatus(t.statut),
        priority: t.priorite,
        createdAt: new Date(t.created_at).toLocaleDateString(),
        lastReply: new Date(t.created_at).toLocaleDateString(),
        category: t.categorie,
      }));

      setTickets(formatted);
      calculateStats(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list: Ticket[]) => {
    const pending = list.filter(t => t.status === 'pending').length;
    const resolved = list.filter(t => t.status === 'resolved').length;
    setStats({
      total: list.length,
      pending,
      resolved,
      satisfaction: 4.8,
    });
  };

  const filtered = tickets.filter(t => activeTab === 'all' || t.status === activeTab);
  const getTabCount = (status: string) =>
    status === 'all' ? tickets.length : tickets.filter(t => t.status === status).length;

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-6 py-6">
      {/* Top Bar */}
      <header className="bg-white px-6 py-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-[#F08080] w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="ri-ticket-line text-white text-lg"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, serif' }}>
            Ticketly
          </h1>
          <nav className="ml-8 flex gap-6">
            <Link href="/dashboard" className="text-[#F08080] font-semibold">Mes tickets</Link>
            <Link href="/dashboard/feedback" className="text-gray-600 hover:text-[#F08080]">Feedback</Link>
            <Link href="/dashboard/settings" className="text-gray-600 hover:text-[#F08080]">Paramètres</Link>
            <Link href="/dashboard/account" className="text-gray-600 hover:text-[#F08080]">Mon compte</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <i className="ri-notification-line text-2xl text-gray-700"></i>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <div className="bg-[#F08080] w-8 h-8 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-white"></i>
          </div>
          <span className="text-gray-700 font-medium hidden sm:block">{userName}</span>
        </div>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard label="Mes tickets" value={stats.total} icon="ri-ticket-line" color="text-[#F08080]" bg="bg-[#F08080]/10" />
        <StatCard label="En attente" value={stats.pending} icon="ri-time-line" color="text-yellow-600" bg="bg-yellow-100" />
        <StatCard label="Résolus" value={stats.resolved} icon="ri-check-line" color="text-green-600" bg="bg-green-100" />
        <StatCard label="Satisfaction" value={`${stats.satisfaction}/5`} icon="ri-star-line" color="text-blue-600" bg="bg-blue-100" />
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">Mes tickets</h2>
            <Link href="/dashboard/new-ticket" className="bg-[#F08080] text-white px-6 py-2 rounded-lg hover:bg-[#F4978E] transition-colors flex items-center justify-center space-x-2 whitespace-nowrap">
              <i className="ri-add-line"></i>
              <span>Nouveau ticket</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 lg:space-x-8 px-4 lg:px-6 overflow-x-auto">
            {['all', 'pending', 'resolved', 'transferred'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[#F08080] text-[#F08080]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' && `Tous (${getTabCount('all')})`}
                {tab === 'pending' && `En attente (${getTabCount('pending')})`}
                {tab === 'resolved' && `Résolus (${getTabCount('resolved')})`}
                {tab === 'transferred' && `Transférés (${getTabCount('transferred')})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Liste */}
        <div className="p-4 lg:p-6">
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((ticket, index) => (
                <TicketCard key={ticket.id || index} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-inbox-line text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucun ticket trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'all' 
                  ? 'Vous n\'avez pas encore créé de ticket'
                  : `Aucun ticket ${activeTab === 'pending' ? 'en attente' : activeTab === 'resolved' ? 'résolu' : 'transféré'} pour le moment`}
              </p>
              <Link
                href="/dashboard/new-ticket"
                className="bg-[#F08080] text-white px-6 py-2 rounded-lg hover:bg-[#F4978E] transition-colors inline-flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-add-line"></i>
                <span>Créer un ticket</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 lg:w-12 lg:h-12 ${bg} rounded-lg flex items-center justify-center`}>
        <i className={`${icon} ${color} text-xl`}></i>
      </div>
    </div>
  );
}
