'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'transferred';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply: string;
  category: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'resolved': return 'Résolu';
      case 'transferred': return 'Transféré';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleMarkAsResolved = () => {
    console.log('Marquer comme résolu:', ticket.id);
    setShowDropdown(false);
  };

  const handleTransfer = () => {
    console.log('Transférer le ticket:', ticket.id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      console.log('Supprimer le ticket:', ticket.id);
      setShowDropdown(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
            <div className="flex-1">
              <Link 
                href={`/dashboard/tickets/${ticket.id}`}
                className="text-lg font-medium text-gray-800 hover:text-[#F08080] transition-colors cursor-pointer"
              >
                {ticket.subject}
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">#{ticket.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </span>
                <span className="flex items-center space-x-1">
                  <i className={`ri-flag-line ${getPriorityColor(ticket.priority)}`}></i>
                  <span className="text-sm capitalize">{ticket.priority}</span>
                </span>
                <span className="text-sm text-gray-600">{ticket.category}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <i className="ri-calendar-line"></i>
                <span>Créé le {formatDate(ticket.createdAt)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <i className="ri-message-line"></i>
                <span>Dernière réponse: {formatDate(ticket.lastReply)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:ml-4">
          <Link
            href={`/dashboard/tickets/${ticket.id}`}
            className="px-4 py-2 bg-[#F08080] text-white rounded-lg hover:bg-[#F4978E] transition-colors text-sm whitespace-nowrap"
          >
            Voir détails
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-more-line w-4 h-4"></i>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <Link
                    href={`/dashboard/tickets/${ticket.id}/edit`}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="ri-edit-line w-4 h-4"></i>
                    <span>Modifier le ticket</span>
                  </Link>
                  
                  {ticket.status !== 'resolved' && (
                    <Link
                      href={`/dashboard/tickets/${ticket.id}/resolve`}
                      onClick={() => setShowDropdown(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <i className="ri-check-line w-4 h-4"></i>
                      <span>Marquer comme résolu</span>
                    </Link>
                  )}
                  
                  <Link
                    href={`/dashboard/tickets/${ticket.id}/transfer`}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="ri-share-forward-line w-4 h-4"></i>
                    <span>Transférer à un agent</span>
                  </Link>
                  
                  <Link
                    href={`/dashboard/tickets/${ticket.id}/history`}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="ri-history-line w-4 h-4"></i>
                    <span>Voir l'historique</span>
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <Link
                    href={`/dashboard/tickets/${ticket.id}/delete`}
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <i className="ri-delete-bin-line w-4 h-4"></i>
                    <span>Supprimer</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
}