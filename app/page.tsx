
'use client';

import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const ticketTrendData = [
  { name: 'Sem 1', tickets: 40 },
  { name: 'Sem 2', tickets: 45 },
  { name: 'Sem 3', tickets: 38 },
  { name: 'Sem 4', tickets: 52 },
  { name: 'Sem 5', tickets: 48 },
  { name: 'Sem 6', tickets: 60 },
  { name: 'Sem 7', tickets: 55 },
];

const statusData = [
  { name: 'Résolus', value: 40, color: '#10b981' },
  { name: 'En attente', value: 30, color: '#f59e0b' },
  { name: 'Transférés', value: 20, color: '#ef4444' },
  { name: 'Fermés', value: 10, color: '#6b7280' },
];

const categoryData = [
  { name: 'Technique', value: 35 },
  { name: 'Facturation', value: 28 },
  { name: 'Commercial', value: 22 },
  { name: 'Résiliation', value: 15 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble des tickets clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Tickets"
            value="5"
            trend="+12%"
            icon="ri-ticket-line"
            color="bg-pink-200"
            isPositive={true}
          />
          <KPICard
            title="Tickets Résolus"
            value="2"
            trend="+8%"
            icon="ri-check-line"
            color="bg-green-200"
            isPositive={true}
          />
          <KPICard
            title="En Attente"
            value="2"
            trend="-3%"
            icon="ri-time-line"
            color="bg-orange-200"
            isPositive={false}
          />
          <KPICard
            title="Transférés Humain"
            value="1"
            trend="+5%"
            icon="ri-user-shared-line"
            color="bg-purple-200"
            isPositive={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Taux Classification IA"
            value="91%"
            trend="+3%"
            icon="ri-brain-line"
            color="bg-pink-200"
            isPositive={true}
          />
          <KPICard
            title="Détection Doublons"
            value="87%"
            trend="+1%"
            icon="ri-search-line"
            color="bg-blue-200"
            isPositive={true}
          />
          <KPICard
            title="Satisfaction Client"
            value="76%"
            trend="+2%"
            icon="ri-heart-line"
            color="bg-green-200"
            isPositive={true}
          />
          <KPICard
            title="Fermeture Auto"
            value="65%"
            trend="+7%"
            icon="ri-lock-line"
            color="bg-purple-200"
            isPositive={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Évolution des Tickets</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm pr-8">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>3 derniers mois</option>
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

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Répartition par Statut</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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
