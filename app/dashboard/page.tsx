'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

interface Ticket {
  _id: string;
  id: string;
  message: string;
  categorie: string;
  ownerName: string;
  ownerTel: string;
  status: string;
  resolver: string | null;
  code: string;
  response: string;
  created_at: string;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      });
  }, []);

  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const transferredCount = tickets.filter(t => t.status === 'transféré').length;

  const statusData = [
    { name: 'Résolus', value: resolvedCount, color: '#10b981' },
    { name: 'En attente', value: pendingCount, color: '#f59e0b' },
    { name: 'Transférés', value: transferredCount, color: '#ef4444' },
    //{ name: 'Fermés', value: totalTickets - resolvedCount - pendingCount - transferredCount, color: '#6b7280' },
  ];

  const categoryCount: Record<string, number> = {};
  tickets.forEach(ticket => {
    categoryCount[ticket.categorie] = (categoryCount[ticket.categorie] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  // Pour l'évolution hebdomadaire
  const weekData = Array(7).fill(0);
  tickets.forEach(ticket => {
    const date = new Date(ticket.created_at);
    const week = Math.floor((new Date().getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
    if (week >= 0 && week < 7) {
      weekData[6 - week]++;
    }
  });
  const ticketTrendData = weekData.map((count, i) => ({
    name: `Sem ${i + 1}`,
    tickets: count,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble des tickets clients</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Tickets" value={String(totalTickets)} trend="+12%" icon="ri-ticket-line" color="bg-pink-200" isPositive={true} />
          <KPICard title="Tickets Résolus" value={String(resolvedCount)} trend="+8%" icon="ri-check-line" color="bg-green-200" isPositive={true} />
          <KPICard title="En Attente" value={String(pendingCount)} trend="-3%" icon="ri-time-line" color="bg-orange-200" isPositive={false} />
          <KPICard title="Transférés Humain" value={String(transferredCount)} trend="+5%" icon="ri-user-shared-line" color="bg-purple-200" isPositive={true} />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Taux Classification IA" value="91%" trend="+3%" icon="ri-brain-line" color="bg-pink-200" isPositive={true} />
          <KPICard title="Détection Doublons" value="87%" trend="+1%" icon="ri-search-line" color="bg-blue-200" isPositive={true} />
          <KPICard title="Satisfaction Client" value="76%" trend="+2%" icon="ri-heart-line" color="bg-green-200" isPositive={true} />
          <KPICard title="Fermeture Auto" value="65%" trend="+7%" icon="ri-lock-line" color="bg-purple-200" isPositive={true} />
        </div>

        {/* Courbe d’évolution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Évolution des Tickets</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm pr-8">
                <option>7 derniers jours</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" stroke="#f08080" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart par statut */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Répartition par Statut</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart par catégorie */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Répartition par Catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f4978e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
