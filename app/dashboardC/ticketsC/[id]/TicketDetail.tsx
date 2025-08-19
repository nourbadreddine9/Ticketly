'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Ticket {
  _id: string;
  id?: string;
  ownerName: string;
  ownerTel: string;
  message: string;
  categorie: string;
  status: string;
  priorite: string;
  resolver: string | null;
  response: string;
  code: string;
  created_at: string;
}

interface Message {
  id: string;
  sender: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export default function TicketDetail({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');
  

  useEffect(() => {
    if (ticketId) {
      fetch(`http://localhost:5000/api/tickets/${ticketId}`)
        .then(res => res.json())
        .then(data => {
          setTicket(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur chargement ticket", err);
          setLoading(false);
        });
    }
  }, [ticketId]);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserName(user.displayName || user.email || 'Utilisateur');
        }
      });
      return () => unsubscribe();
    }, []);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNewMessage('');
    setIsLoading(false);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chargement en cours...</h1>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ticket non trouvé</h1>
          <p className="text-gray-600 mb-4">Le ticket demandé n'existe pas ou n'est plus disponible.</p>
          <Link href="/dashboardC" className="text-[#F08080] hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Création des messages à partir des données du ticket
  const messages: Message[] = [
    {
      id: '1',
      sender: ticket.ownerName,
      senderType: 'user',
      content: ticket.message,
      timestamp: ticket.created_at
    }
  ];

  if (ticket.response) {
    messages.push({
      id: '2',
      sender: ticket.resolver || 'Agent',
      senderType: 'agent',
      content: ticket.response,
      timestamp: ticket.created_at // À remplacer par updated_at si disponible
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <Link href="/dashboardC" className="text-[#F08080] font-medium">
                Dashboard
              </Link>
              <Link href="/dashboardC/analytics" className="text-gray-600 hover:text-[#F08080] transition-colors">
                Analytics
              </Link>
              <Link href="/dashboardC/settings" className="text-gray-600 hover:text-[#F08080] transition-colors">
                Paramètres
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-[#F08080] transition-colors">
              <i className="ri-notification-line text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#F08080] rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white"></i>
              </div>
              <span className="text-gray-700 font-medium">{userName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/dashboardC" className="hover:text-[#F08080] transition-colors">
            Dashboard
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <span>Ticket #{ticket.code}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Ticket Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Ticket #{ticket.code}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>#{ticket.code}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className={`ri-flag-line ${getPriorityColor(ticket.priorite)}`}></i>
                      <span className="capitalize">{ticket.priorite}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-[#F08080] text-white rounded-lg hover:bg-[#F4978E] transition-colors text-sm whitespace-nowrap">
                    Marquer comme résolu
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                    Transférer
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Conversation</h2>
              </div>
              <div className="p-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${message.senderType === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.senderType === 'user' ? 'bg-gray-500' : 'bg-[#F08080]'
                        }`}>
                          <i className={`ri-${message.senderType === 'user' ? 'user' : 'customer-service'}-line text-white`}></i>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{message.sender}</span>
                        <span className="text-xs text-gray-500">{formatDateTime(message.timestamp)}</span>
                      </div>
                      <div className={`p-4 rounded-lg ${
                        message.senderType === 'user' 
                          ? 'bg-[#F08080] text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Répondre</h3>
              <div className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Saisissez votre réponse..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-[#F08080] transition-colors">
                      <i className="ri-attachment-line"></i>
                      <span className="text-sm">Joindre un fichier</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-[#F08080] transition-colors">
                      <i className="ri-emotion-line"></i>
                      <span className="text-sm">Émoji</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="px-6 py-2 bg-[#F08080] text-white rounded-lg hover:bg-[#F4978E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <i className="ri-loader-4-line animate-spin"></i>
                    ) : (
                      <i className="ri-send-plane-line"></i>
                    )}
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du ticket</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priorité:</span>
                  <span className={`capitalize text-sm font-medium ${getPriorityColor(ticket.priorite)}`}>
                    {ticket.priorite}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Catégorie:</span>
                  <span className="text-sm font-medium text-gray-800">{ticket.categorie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Créé le:</span>
                  <span className="text-sm text-gray-800">{formatDateTime(ticket.created_at)}</span>
                </div>
                {ticket.resolver && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Résolu par:</span>
                    <span className="text-sm text-gray-800">{ticket.resolver}</span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Demandeur</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-white"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{ticket.ownerName}</p>
                  <p className="text-sm text-gray-600">{ticket.ownerTel}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-[#F08080] text-white rounded-lg hover:bg-[#F4978E] transition-colors text-sm whitespace-nowrap">
                  Contacter
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                  Profil
                </button>
              </div>
            </div>

            {/* Agent Info */}
            {ticket.resolver && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent assigné</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#F08080] rounded-full flex items-center justify-center">
                    <i className="ri-customer-service-line text-white"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{ticket.resolver}</p>
                    <p className="text-sm text-gray-600">Agent support</p>
                  </div>
                </div>
                <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                  Changer d'agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}