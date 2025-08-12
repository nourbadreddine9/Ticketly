'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HistoryEvent {
  id: string;
  type: 'created' | 'message' | 'status_change' | 'assignment' | 'priority_change' | 'transfer' | 'resolution';
  timestamp: string;
  actor: string;
  actorType: 'user' | 'agent' | 'system';
  description: string;
  details?: any;
}

interface HistoryPageProps {
  params: { id: string };
}

export default function TicketHistoryPage({ params }: HistoryPageProps) {
  const { id } = params;
  
  const [ticketData, setTicketData] = useState<any>(null);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data based on ticket ID
  const mockTicketData = {
    'TK-001': {
      id: 'TK-001',
      subject: 'Problème de connexion à mon compte',
      status: 'pending',
      priority: 'high',
      category: 'Technique',
      requester: 'Jean Dupont',
      assignedTo: 'Sophie Martin'
    }
  };

  const mockHistoryEvents: HistoryEvent[] = [
    {
      id: '1',
      type: 'created',
      timestamp: '2024-01-15T10:30:00Z',
      actor: 'Jean Dupont',
      actorType: 'user',
      description: 'Ticket créé',
      details: {
        initialPriority: 'medium',
        initialCategory: 'Technique'
      }
    },
    {
      id: '2',
      type: 'assignment',
      timestamp: '2024-01-15T10:35:00Z',
      actor: 'Système',
      actorType: 'system',
      description: 'Ticket assigné automatiquement à Sophie Martin',
      details: {
        assignedTo: 'Sophie Martin',
        department: 'Support Technique'
      }
    },
    {
      id: '3',
      type: 'priority_change',
      timestamp: '2024-01-15T10:45:00Z',
      actor: 'Sophie Martin',
      actorType: 'agent',
      description: 'Priorité modifiée de Medium à High',
      details: {
        from: 'medium',
        to: 'high',
        reason: 'Problème bloquant pour l\'utilisateur'
      }
    },
    {
      id: '4',
      type: 'message',
      timestamp: '2024-01-15T11:00:00Z',
      actor: 'Sophie Martin',
      actorType: 'agent',
      description: 'Première réponse envoyée',
      details: {
        messagePreview: 'Bonjour, merci pour votre message. Je vais examiner ce problème...'
      }
    },
    {
      id: '5',
      type: 'message',
      timestamp: '2024-01-15T14:20:00Z',
      actor: 'Sophie Martin',
      actorType: 'agent',
      description: 'Mise à jour du statut envoyée',
      details: {
        messagePreview: 'J\'ai identifié le problème. Il semble y avoir un problème temporaire...'
      }
    },
    {
      id: '6',
      type: 'status_change',
      timestamp: '2024-01-15T14:25:00Z',
      actor: 'Sophie Martin',
      actorType: 'agent',
      description: 'Statut modifié de New à In Progress',
      details: {
        from: 'new',
        to: 'in_progress'
      }
    }
  ];

  useEffect(() => {
    const ticket = mockTicketData[id as keyof typeof mockTicketData];
    if (ticket) {
      setTicketData(ticket);
      setHistoryEvents(mockHistoryEvents);
    }
    setIsLoading(false);
  }, [id]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return 'ri-add-circle-line';
      case 'message': return 'ri-message-line';
      case 'status_change': return 'ri-refresh-line';
      case 'assignment': return 'ri-user-shared-line';
      case 'priority_change': return 'ri-flag-line';
      case 'transfer': return 'ri-share-forward-line';
      case 'resolution': return 'ri-check-line';
      default: return 'ri-information-line';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-100 text-blue-600';
      case 'message': return 'bg-gray-100 text-gray-600';
      case 'status_change': return 'bg-yellow-100 text-yellow-600';
      case 'assignment': return 'bg-purple-100 text-purple-600';
      case 'priority_change': return 'bg-orange-100 text-orange-600';
      case 'transfer': return 'bg-indigo-100 text-indigo-600';
      case 'resolution': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'user': return 'ri-user-line';
      case 'agent': return 'ri-customer-service-line';
      case 'system': return 'ri-robot-line';
      default: return 'ri-user-line';
    }
  };

  const filteredEvents = historyEvents.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const eventTypes = [
    { value: 'all', label: 'Tous les événements' },
    { value: 'created', label: 'Création' },
    { value: 'message', label: 'Messages' },
    { value: 'status_change', label: 'Changements de statut' },
    { value: 'assignment', label: 'Assignations' },
    { value: 'priority_change', label: 'Changements de priorité' },
    { value: 'transfer', label: 'Transferts' },
    { value: 'resolution', label: 'Résolutions' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-[#F08080] mb-4"></i>
          <p className="text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ticket non trouvé</h1>
          <Link href="/dashboard" className="text-[#F08080] hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 md:space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#F08080] rounded-lg flex items-center justify-center">
                  <i className="ri-ticket-line text-white text-lg"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, serif' }}>
                  Ticketly
                </h1>
              </Link>
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/dashboard" className="hover:text-[#F08080] transition-colors">
                  Dashboard
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <Link href={`/dashboard/tickets/${id}`} className="hover:text-[#F08080] transition-colors">
                  Ticket #{id}
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <span className="text-[#F08080]">Historique</span>
              </nav>
            </div>
            <Link 
              href={`/dashboard/tickets/${id}`} 
              className="text-gray-600 hover:text-[#F08080] transition-colors flex items-center space-x-2"
            >
              <i className="ri-arrow-left-line"></i>
              <span>Retour</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Ticket Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-history-line text-gray-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Historique du ticket #{ticketData.id}</h2>
              <p className="text-gray-600 mb-4">{ticketData.subject}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Créé par: {ticketData.requester}</span>
                <span>•</span>
                <span>Assigné à: {ticketData.assignedTo}</span>
                <span>•</span>
                <span>Catégorie: {ticketData.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrer par type</h3>
              <div className="space-y-2">
                {eventTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilter(type.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filter === type.value
                        ? 'bg-[#F08080] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Statistiques</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total événements:</span>
                    <span className="font-medium">{historyEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Messages:</span>
                    <span className="font-medium">{historyEvents.filter(e => e.type === 'message').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Changements:</span>
                    <span className="font-medium">{historyEvents.filter(e => e.type === 'status_change').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chronologie des événements
                </h3>
                <span className="text-sm text-gray-600">
                  {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
                </span>
              </div>

              {filteredEvents.length > 0 ? (
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <div key={event.id} className="relative">
                      {/* Timeline line */}
                      {index < filteredEvents.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}

                      <div className="flex items-start space-x-4">
                        {/* Event icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                          <i className={`${getEventIcon(event.type)} text-lg`}></i>
                        </div>

                        {/* Event content */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-800">{event.description}</h4>
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {formatDateTime(event.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                <i className={`${getActorIcon(event.actorType)} text-sm text-gray-500`}></i>
                                <span className="text-sm text-gray-600">{event.actor}</span>
                              </div>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {event.actorType === 'user' ? 'Client' : event.actorType === 'agent' ? 'Agent' : 'Système'}
                              </span>
                            </div>

                            {/* Event details */}
                            {event.details && (
                              <div className="mt-3 p-3 bg-white rounded border text-sm">
                                {event.type === 'priority_change' && (
                                  <div>
                                    <p className="text-gray-700">
                                      <span className="font-medium">De:</span> {event.details.from} 
                                      <span className="mx-2">→</span>
                                      <span className="font-medium">À:</span> {event.details.to}
                                    </p>
                                    {event.details.reason && (
                                      <p className="text-gray-600 mt-1">
                                        <span className="font-medium">Raison:</span> {event.details.reason}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {event.type === 'assignment' && (
                                  <div>
                                    <p className="text-gray-700">
                                      <span className="font-medium">Assigné à:</span> {event.details.assignedTo}
                                    </p>
                                    <p className="text-gray-600">
                                      <span className="font-medium">Département:</span> {event.details.department}
                                    </p>
                                  </div>
                                )}

                                {event.type === 'message' && event.details.messagePreview && (
                                  <p className="text-gray-700 italic">
                                    "{event.details.messagePreview}"
                                  </p>
                                )}

                                {event.type === 'status_change' && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">De:</span> {event.details.from}
                                    <span className="mx-2">→</span>
                                    <span className="font-medium">À:</span> {event.details.to}
                                  </p>
                                )}

                                {event.type === 'created' && (
                                  <div>
                                    <p className="text-gray-700">
                                      <span className="font-medium">Priorité initiale:</span> {event.details.initialPriority}
                                    </p>
                                    <p className="text-gray-600">
                                      <span className="font-medium">Catégorie:</span> {event.details.initialCategory}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="ri-history-line text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Aucun événement trouvé
                  </h3>
                  <p className="text-gray-600">
                    Aucun événement ne correspond aux filtres sélectionnés.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}