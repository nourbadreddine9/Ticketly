'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TransferTicketPageProps {
  params: { id: string };
}

export default function TransferTicketPage({ params }: TransferTicketPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    toAgent: '',
    toDepartment: '',
    transferReason: '',
    notes: '',
    priority: '',
    notifyCustomer: true
  });

  const [ticketData, setTicketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const agents = [
    { id: 'agent1', name: 'Sophie Martin', department: 'Support Technique', available: true },
    { id: 'agent2', name: 'Thomas Dubois', department: 'Facturation', available: true },
    { id: 'agent3', name: 'Julie Moreau', department: 'Développement', available: false },
    { id: 'agent4', name: 'Pierre Lefèvre', department: 'Support Général', available: true },
    { id: 'agent5', name: 'Marie Bernard', department: 'Support Technique', available: true }
  ];

  const departments = [
    'Support Technique',
    'Facturation',
    'Développement',
    'Support Général',
    'Ventes',
    'Direction'
  ];

  // Mock data based on ticket ID
  const mockTicketData = {
    'TK-001': {
      id: 'TK-001',
      subject: 'Problème de connexion à mon compte',
      status: 'pending',
      priority: 'high',
      category: 'Technique',
      requester: 'Jean Dupont',
      assignedTo: 'Sophie Martin',
      currentDepartment: 'Support Technique'
    }
  };

  useEffect(() => {
    const ticket = mockTicketData[id as keyof typeof mockTicketData];
    if (ticket) {
      setTicketData(ticket);
      setFormData(prev => ({
        ...prev,
        priority: ticket.priority
      }));
    }
    setIsLoading(false);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/tickets/${id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          transferredAt: new Date().toISOString(),
          status: 'transferred',
          transferredBy: 'Current Agent'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du transfert du ticket');
      }

      setSubmitStatus('success');
      
      setTimeout(() => {
        router.push(`/dashboard/tickets/${id}`);
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableAgents = agents.filter(agent => agent.available);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-[#F08080] mb-4"></i>
          <p className="text-gray-600">Chargement du ticket...</p>
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

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-share-forward-line text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket transféré !</h2>
          <p className="text-gray-600 mb-6">
            Le ticket a été transféré avec succès. Les parties concernées ont été notifiées.
          </p>
          <Link
            href={`/dashboard/tickets/${id}`}
            className="bg-[#F08080] text-white px-6 py-3 rounded-lg hover:bg-[#F4978E] transition-colors inline-block whitespace-nowrap"
          >
            Retour au ticket
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
                <span className="text-[#F08080]">Transférer</span>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Ticket Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-share-forward-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Transférer le ticket #{ticketData.id}</h2>
              <p className="text-gray-600 mb-4">{ticketData.subject}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Assigné à: {ticketData.assignedTo}</span>
                <span>•</span>
                <span>Département: {ticketData.currentDepartment}</span>
                <span>•</span>
                <span className="capitalize">Priorité: {ticketData.priority}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Informations de transfert</h3>
            <p className="text-gray-600 mt-1">
              Choisissez l'agent ou le département qui prendra en charge ce ticket.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-500"></i>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="toAgent" className="block text-sm font-medium text-gray-700 mb-2">
                  Transférer à l'agent
                </label>
                <div className="relative">
                  <select
                    id="toAgent"
                    name="toAgent"
                    value={formData.toAgent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="">Sélectionner un agent</option>
                    {availableAgents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.department}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label htmlFor="toDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                  Ou transférer au département
                </label>
                <div className="relative">
                  <select
                    id="toDepartment"
                    name="toDepartment"
                    value={formData.toDepartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="transferReason" className="block text-sm font-medium text-gray-700 mb-2">
                Raison du transfert *
              </label>
              <div className="relative">
                <select
                  id="transferReason"
                  name="transferReason"
                  value={formData.transferReason}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                  required
                >
                  <option value="">Sélectionner une raison</option>
                  <option value="expertise">Besoin d'expertise spécialisée</option>
                  <option value="workload">Équilibrage de la charge de travail</option>
                  <option value="priority">Changement de priorité</option>
                  <option value="department">Mauvais département initial</option>
                  <option value="escalation">Escalade hiérarchique</option>
                  <option value="other">Autre</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Ajuster la priorité
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={handleInputChange}
                    className="mr-2 text-[#F08080] focus:ring-[#F08080]"
                  />
                  <span className="text-sm text-gray-700">Faible</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={handleInputChange}
                    className="mr-2 text-[#F08080] focus:ring-[#F08080]"
                  />
                  <span className="text-sm text-gray-700">Moyenne</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={handleInputChange}
                    className="mr-2 text-[#F08080] focus:ring-[#F08080]"
                  />
                  <span className="text-sm text-gray-700">Élevée</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes pour le nouvel agent
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors resize-none"
                placeholder="Informations contextuelles, actions déjà entreprises, recommandations..."
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.notes.length}/500 caractères
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifyCustomer"
                  checked={formData.notifyCustomer}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#F08080] bg-gray-100 border-gray-300 rounded focus:ring-[#F08080] focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Notifier le client du transfert
                </span>
              </label>
            </div>

            {/* Available Agents */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Agents disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableAgents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <p className="font-medium text-gray-800">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.department}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Disponible</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <Link
                href={`/dashboard/tickets/${id}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-center md:text-left"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || (!formData.toAgent && !formData.toDepartment)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Transfert en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-share-forward-line"></i>
                    <span>Transférer le ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}