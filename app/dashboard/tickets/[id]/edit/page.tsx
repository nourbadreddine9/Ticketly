'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditTicketPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    status: 'pending'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Technique',
    'Facturation',
    'Fonctionnalité',
    'Développement',
    'Support général',
    'Autre'
  ];

  // Mock data based on ticket ID
  const ticketData = {
    'TK-001': {
      subject: 'Problème de connexion à mon compte',
      category: 'Technique',
      priority: 'high',
      message: 'Bonjour, je ne parviens plus à me connecter à mon compte depuis ce matin. J\'obtiens constamment un message d\'erreur "Identifiants incorrects" alors que je suis certain de saisir le bon mot de passe.',
      status: 'pending'
    },
    'TK-002': {
      subject: 'Question sur la facturation',
      category: 'Facturation',
      priority: 'medium',
      message: 'J\'ai une question concernant ma facture du mois dernier. Il semble y avoir une différence par rapport à ce que j\'attendais.',
      status: 'resolved'
    },
    'TK-003': {
      subject: 'Demande de fonctionnalité',
      category: 'Fonctionnalité',
      priority: 'low',
      message: 'Serait-il possible d\'ajouter une fonctionnalité d\'export des données en format CSV dans l\'interface utilisateur ?',
      status: 'transferred'
    }
  };

  useEffect(() => {
    const ticket = ticketData[id as keyof typeof ticketData];
    if (ticket) {
      setFormData({
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        message: ticket.message,
        status: ticket.status
      });
    }
    setIsLoading(false);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du ticket');
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

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-check-line text-green-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket modifié !</h2>
          <p className="text-gray-600 mb-6">
            Les modifications ont été enregistrées avec succès.
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
                <span className="text-[#F08080]">Modifier</span>
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Modifier le ticket #{id}</h2>
            <p className="text-gray-600 mt-2">
              Modifiez les informations de votre ticket ci-dessous.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                placeholder="Résumé de votre problème ou demande"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors resize-none"
                placeholder="Décrivez votre problème en détail..."
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.message.length}/500 caractères
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
                disabled={isSubmitting}
                className="bg-[#F08080] text-white px-8 py-3 rounded-lg hover:bg-[#F4978E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Modification en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    <span>Sauvegarder les modifications</span>
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