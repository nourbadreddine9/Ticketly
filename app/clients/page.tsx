'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';

interface Ticket {
  _id: string;
  ownerName: string;
  ownerTel: string;
  status: string;
  categorie: string;
  created_at: string;
  resolvedAt?: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalTickets: number;
  resolvedTickets: number;
  //contract: string;
  averageSatisfaction: number;
}

export default function ClientsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);  // État séparé pour les clients
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tickets from API
  // Fetch tickets from API and process them
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setTickets(data);
        
        // Process tickets to get unique clients
        const clientsMap = new Map<string, Client>();
        
        data.forEach((ticket: Ticket) => {
          const phone = ticket.ownerTel;
          
          if (!clientsMap.has(phone)) {
            clientsMap.set(phone, {
              id: phone,  // Utilisation du numéro de téléphone comme ID unique
              name: ticket.ownerName,
              phone: phone,
              email: `${ticket.ownerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
              totalTickets: 0,
              resolvedTickets: 0,
              //contract: ticket.categorie.includes('Pro') ? 'Fibre Pro' : 'Fibre Particulier',
              averageSatisfaction: Math.floor(Math.random() * 5) + 1
            });
          }
          
          // Mise à jour des statistiques du client
          const client = clientsMap.get(phone)!;
          client.totalTickets += 1;
          if (ticket.status === 'resolved') {
            client.resolvedTickets += 1;
          }
        });
        
        setClients(Array.from(clientsMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter clients
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  /*const getContractColor = (contract: string) => {
    switch (contract) {
      case 'Fibre Particulier': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ADSL Standard': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Fibre Pro': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };*/

  const getResolutionRate = (client: Client) => {
    return client.totalTickets > 0 
      ? Math.round((client.resolvedTickets / client.totalTickets) * 100)
      : 0;
  };

  const getResolutionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`ri-star-${i < Math.floor(rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}></i>
    ));
  };

  // Calculate KPIs
  const totalClients = clients.length;
  const activeClients = clients.length;
  const averageSatisfaction = clients.reduce((sum, client) => sum + client.averageSatisfaction, 0) / totalClients || 0;
  const totalTickets = tickets.length;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charte1 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des clients...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center text-red-500">
            <i className="ri-error-warning-line text-4xl mb-4"></i>
            <p className="text-xl font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-charte1 text-white rounded-md hover:bg-charte2"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Clients</h1>
          <p className="text-gray-600">Vue d'ensemble des clients et de leurs tickets</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Clients"
            value={totalClients.toString()}
            icon="ri-user-line"
            color="bg-red-100"
            trend="+5%"
          />
          <KPICard
            title="Clients Actifs"
            value={activeClients.toString()}
            icon="ri-user-heart-line"
            color="bg-green-100"
            trend="+12%"
          />
          <KPICard
            title="Satisfaction Moyenne"
            value={`${averageSatisfaction.toFixed(1)}/5`}
            icon="ri-star-line"
            color="bg-yellow-100"
            trend="+8%"
          />
          <KPICard
            title="Total Tickets"
            value={totalTickets.toString()}
            icon="ri-ticket-line"
            color="bg-blue-100"
            trend="+15%"
          />
        </div>

        {/* Liste des Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Liste des Clients</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-charte1 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLIENT</th>
                  {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTRAT</th>*/}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NB TICKETS</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TAUX RÉSOLUTION</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SATISFACTION</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const resolutionRate = getResolutionRate(client);
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-charte1 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-white"></i>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      {/*<td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getContractColor(client.contract)}`}>
                          {client.contract}
                        </span>
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {client.totalTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-sm font-medium ${getResolutionColor(resolutionRate)}`}>
                          {resolutionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {renderStars(client.averageSatisfaction)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-charte1 hover:text-charte2 transition-colors whitespace-nowrap cursor-pointer text-sm"
                        >
                          Voir les tickets
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}