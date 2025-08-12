'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    category: '',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    'Support technique',
    'Qualité du service',
    'Temps de réponse',
    'Interface utilisateur',
    'Fonctionnalités',
    'Autre'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFeedbackData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFeedbackData({
        rating: 5,
        category: '',
        message: '',
        email: ''
      });
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Link href="/dashboard" className="text-gray-600 hover:text-[#F08080] transition-colors">
                Mes tickets
              </Link>
              <Link href="/dashboard/feedback" className="text-[#F08080] font-medium">
                Feedback
              </Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-[#F08080] transition-colors">
                Paramètres
              </Link>
              <Link href="/dashboard/account" className="text-gray-600 hover:text-[#F08080] transition-colors">
                Mon compte
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
              <span className="text-gray-700 font-medium">Marie Dupont</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Votre avis nous intéresse</h2>
          <p className="text-gray-600">
            Aidez-nous à améliorer notre service en partageant votre expérience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Laisser un feedback</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-check-circle-line text-green-600 mr-2"></i>
                  <span className="text-green-800 font-medium">Merci pour votre feedback !</span>
                </div>
              </div>
            )}

            <form id="feedback-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Évaluation globale
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-3xl transition-colors hover:scale-110"
                    >
                      <i className={`ri-star-${star <= feedbackData.rating ? 'fill' : 'line'} ${
                        star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}></i>
                    </button>
                  ))}
                  <span className="ml-4 text-sm text-gray-600">
                    {feedbackData.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={feedbackData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={feedbackData.message}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Décrivez votre expérience..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {feedbackData.message.length}/500 caractères
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={feedbackData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                  placeholder="votre@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Pour que nous puissions vous recontacter si nécessaire
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F08080] text-white py-3 rounded-lg hover:bg-[#F4978E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line"></i>
                    <span>Envoyer le feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feedback History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Vos feedbacks précédents</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`ri-star-${star <= 5 ? 'fill' : 'line'} text-yellow-400`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Support technique</span>
                  </div>
                  <span className="text-sm text-gray-500">15 Jan 2024</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Excellent service ! L'équipe technique a résolu mon problème très rapidement.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`ri-star-${star <= 4 ? 'fill' : 'line'} text-yellow-400`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Interface utilisateur</span>
                  </div>
                  <span className="text-sm text-gray-500">12 Jan 2024</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Interface intuitive et facile à utiliser. Quelques améliorations possibles sur mobile.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className={`ri-star-${star <= 5 ? 'fill' : 'line'} text-yellow-400`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Temps de réponse</span>
                  </div>
                  <span className="text-sm text-gray-500">8 Jan 2024</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Réponse ultra-rapide ! Mon ticket a été traité en moins de 2 heures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Votre satisfaction</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F08080] mb-2">4.8/5</div>
              <p className="text-gray-600">Note moyenne</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="ri-star-fill text-yellow-400"></i>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <p className="text-gray-600">Feedbacks envoyés</p>
              <div className="flex justify-center mt-2">
                <i className="ri-chat-3-line text-green-600 text-2xl"></i>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Tickets résolus</p>
              <div className="flex justify-center mt-2">
                <i className="ri-check-circle-line text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}