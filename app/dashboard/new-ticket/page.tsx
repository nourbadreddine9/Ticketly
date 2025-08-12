'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['Internet', 'Facturation', 'Réseau', 'Téléphonie', 'Autre'];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

    const ticketData = {
      message: formData.message,
      categorie: formData.category,
      ownerName: formData.name,
      ownerTel: formData.telephone || "0000000000",
      priorite: formData.priority,
      statut: "en attente",
      resolver: null,
      code: "TK-" + Math.floor(1000 + Math.random() * 9000),
      response: "",
      email: formData.email,
      subject: formData.subject
    };

    try {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du ticket");
      }

      setSubmitStatus("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-check-line text-green-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Votre ticket a été créé avec succès. Vous recevrez une réponse dans les plus brefs délais.
          </p>
          <Link
            href="/dashboard"
            className="bg-[#F08080] text-white px-6 py-3 rounded-lg hover:bg-[#F4978E] transition-colors inline-block whitespace-nowrap"
          >
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
              <nav className="flex space-x-4 md:space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-[#F08080] transition-colors">
                  Dashboard
                </Link>
                <span className="text-[#F08080] font-medium">Nouveau ticket</span>
              </nav>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-[#F08080] transition-colors">
              <i className="ri-arrow-left-line mr-2"></i>
              Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Créer un nouveau ticket</h2>
            <p className="text-gray-600 mt-2">
              Décrivez votre problème ou votre demande. Notre équipe vous répondra rapidement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Nom *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Catégorie *</label>
                <select name="category" required value={formData.category} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Sélectionnez</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Sujet *</label>
              <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Message *</label>
              <textarea name="message" required rows={5} maxLength={500}
                value={formData.message} onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none" />
              <p className="text-right text-sm text-gray-500">{formData.message.length}/500 caractères</p>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Priorité *</label>
              <div className="flex space-x-6">
                {['low', 'medium', 'high'].map(p => (
                  <label key={p} className="flex items-center space-x-2">
                    <input type="radio" name="priority" value={p}
                      checked={formData.priority === p}
                      onChange={handleInputChange} />
                    <span className="capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting}
                className="bg-[#F08080] text-white px-6 py-3 rounded-lg hover:bg-[#F4978E] transition-colors disabled:opacity-50">
                {isSubmitting ? "Envoi..." : "Envoyer le ticket"}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ Assistant IA */}
        <div className="mt-8 bg-gradient-to-r from-[#F8AD9D]/20 to-[#FBC4AB]/20 rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-12 h-12 bg-[#F08080] rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-robot-line text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Assistant IA Ticketly
              </h3>
              <p className="text-gray-600 mb-4">
                Avant de créer votre ticket, consultez notre base de connaissances. Notre IA peut répondre instantanément à de nombreuses questions courantes.
              </p>
              <button className="bg-white text-[#F08080] px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-[#F08080] whitespace-nowrap">
                Consulter l'assistant IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
