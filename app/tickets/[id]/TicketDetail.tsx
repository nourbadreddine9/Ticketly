'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

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
  email?: string;
  priority?: string;
  resolvedAt?: string;
  history?: Array<{
    date: string;
    action: string;
    author: string;
  }>;
}

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const [currentStatus, setCurrentStatus] = useState(ticket.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'transferred': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Résolu';
      case 'pending': return 'En attente';
      case 'transferred': return 'Transféré';
      default: return status;
    }
  };

  const getPriorityColor = (priority = 'Moyenne') => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <Link href="/tickets" className="text-charte1 hover:text-charte2 mb-4 inline-flex items-center gap-2">
            <i className="ri-arrow-left-line"></i>
            Retour aux tickets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Détail du Ticket {ticket.code || ticket.id}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Message du Client</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-charte1 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.ownerName}</p>
                    <p className="text-sm text-gray-500">{new Date(ticket.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                <p className="text-gray-700">{ticket.message}</p>
              </div>
            </div>

            {ticket.response && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Réponse de l'Agent</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-service-line text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.resolver || 'Agent Support'}</p>
                      <p className="text-sm text-gray-500">Agent Support</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{ticket.response}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique</h2>
              <div className="space-y-3">
                {ticket.history?.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-charte1 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleString('fr-FR')} • {event.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID Ticket</p>
                  <p className="font-medium text-gray-900">{ticket.code || ticket.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priorité</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority || 'Moyenne'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium text-gray-900">{ticket.categorie}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agent assigné</p>
                  <p className="font-medium text-gray-900">{ticket.resolver || 'Non assigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium text-gray-900">{new Date(ticket.created_at).toLocaleString('fr-FR')}</p>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <p className="text-sm text-gray-500">Date de résolution</p>
                    <p className="font-medium text-gray-900">{new Date(ticket.resolvedAt).toLocaleString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Client</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{ticket.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-900">{ticket.ownerTel}</p>
                </div>
                {ticket.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{ticket.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-charte1 focus:border-transparent pr-8"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="transferred">Transféré</option>
                </select>
                <button className="w-full bg-charte1 text-white py-2 px-4 rounded-md hover:bg-charte2 transition-colors whitespace-nowrap">
                  Répondre au client
                </button>
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap">
                  Transférer à un agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}