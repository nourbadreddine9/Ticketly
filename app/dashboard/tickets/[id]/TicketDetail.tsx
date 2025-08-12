'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Ticket {
  _id: string;
  id?: string;
  ownerName: string;
  ownerTel: string;
  message: string;
  categorie: string;
  statut: string;
  priorite: string;
  resolver: string | null;
  response: string;
  code: string;
  created_at: string;
}

export default function TicketDetail({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1000)); // simule l’envoi
    setNewMessage('');
    setIsLoading(false);
  };

  if (loading) return <p className="p-4">Chargement...</p>;

  if (!ticket) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Ticket introuvable.</p>
        <Link href="/dashboard" className="text-[#F08080] hover:underline">Retour</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Détail du Ticket #{ticket._id}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-2">
        <p><strong>Nom :</strong> {ticket.ownerName}</p>
        <p><strong>Téléphone :</strong> {ticket.ownerTel}</p>
        <p><strong>Message :</strong> {ticket.message}</p>
        <p><strong>Catégorie :</strong> {ticket.categorie}</p>
        <p><strong>Statut :</strong> {ticket.statut}</p>
        <p><strong>Priorité :</strong> {ticket.priorite}</p>
        <p><strong>Créé le :</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
        {ticket.response && <p><strong>Réponse :</strong> {ticket.response}</p>}
        {ticket.resolver && <p><strong>Résolu par :</strong> {ticket.resolver}</p>}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Ajouter un message</h2>
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded p-2 mb-2"
          placeholder="Votre message..."
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !newMessage.trim()}
          className="bg-[#F08080] text-white px-4 py-2 rounded hover:bg-[#f4978e] disabled:opacity-50"
        >
          {isLoading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}
