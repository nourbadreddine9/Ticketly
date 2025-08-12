'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

interface Ticket {
  _id: string;
  id: string;
  subject: string;
  message: string;
  response?: string;
  category: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  satisfaction?: number;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalTickets: number;
  resolvedTickets: number;
  resolutionRate: number;
  averageSatisfaction: number;
  joinDate: string;
  lastActivity: string;
  tickets: Ticket[];
}

interface ClientDetailProps {
  client: Client;
}

export default function ClientDetail({ client }: ClientDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'transferred': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-50 border-green-200';
      case 'pending': return 'bg-orange-50 border-orange-200';
      case 'transferred': return 'bg-pink-50 border-pink-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`ri-star-${i < Math.floor(rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}
      ></i>
    ));
  };

  const sortedTickets = [...client.tickets].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
console.log('Ticket data:', sortedTickets);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <Link
            href="/clients"
            className="text-charte1 hover:text-charte2 mb-4 inline-flex items-center gap-2"
          >
            <i className="ri-arrow-left-line"></i>
            Retour aux clients
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Client - {client.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-ticket-line text-gray-500 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{client.totalTickets}</p>
                <p className="text-sm text-gray-600">Total tickets</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-gray-500 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{client.resolvedTickets}</p>
                <p className="text-sm text-gray-600">Tickets résolus</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-check-double-line text-gray-500 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{client.resolutionRate}%</p>
                <p className="text-sm text-gray-600">Taux de résolution</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="ri-star-line text-gray-500 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{client.averageSatisfaction.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Satisfaction moyenne</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Historique des Tickets</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sortedTickets.map((ticket, index) => (
                    <div key={ticket.id || `ticket-${index}`} className={`rounded-lg border p-4 ${getCardStatusColor(ticket.status)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                              {getStatusLabel(ticket.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span>Catégorie: {ticket.category}</span>
                            <span>•</span>
                            <span>Créé le: {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                            {ticket.resolvedAt && (
                              <>
                                <span>•</span>
                                <span>Résolu le: {new Date(ticket.resolvedAt).toLocaleDateString('fr-FR')}</span>
                              </>
                            )}
                            {ticket.satisfaction !== undefined && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  Satisfaction: 
                                  <span className="font-medium">{ticket.satisfaction}</span>
                                  <i className="ri-star-fill text-yellow-400"></i>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Link
                          //href={`/tickets/${ticket.id}`}
                          //href={`/tickets/${ticket._id}`}
                          href={`/tickets/${ticket._id || ticket.id}`} // Priorité à _id
                          className="bg-charte1 text-white px-3 py-1 rounded-md hover:bg-charte2 transition-colors text-sm whitespace-nowrap cursor-pointer"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations Client</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-charte1 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">Client ID: {client.id}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <i className="ri-mail-line text-gray-400"></i>
                    <span className="text-sm text-gray-900">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-phone-line text-gray-400"></i>
                    <span className="text-sm text-gray-900">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-calendar-line text-gray-400"></i>
                    <span className="text-sm text-gray-900">
                      Client depuis le {new Date(client.joinDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-time-line text-gray-400"></i>
                    <span className="text-sm text-gray-900">
                      Dernière activité: {new Date(client.lastActivity).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/*<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tickets ouverts</p>
                  <p className="font-medium text-gray-900">
                    {client.totalTickets - client.resolvedTickets}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux de satisfaction</p>
                  <div className="flex items-center gap-1">
                    {renderStars(client.averageSatisfaction)}
                    <span className="text-gray-900 ml-1">
                      {client.averageSatisfaction.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>*/}

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-charte1 text-white py-2 px-4 rounded-md hover:bg-charte2 transition-colors whitespace-nowrap">
                  Créer un ticket
                </button>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap">
                  Envoyer un email
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap">
                  Programmer un rappel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}