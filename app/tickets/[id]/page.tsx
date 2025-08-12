/*import TicketDetail from './TicketDetail';

export async function generateStaticParams() {
  return [
    { id: 'TCK-001' },
    { id: 'TCK-002' },
    { id: 'TCK-003' },
    { id: 'TCK-004' },
    { id: 'TCK-005' },
  ];
}

export default function TicketPage({ params }: { params: { id: string } }) {
  return <TicketDetail ticketId={params.id} />;
}*/

import Sidebar from '@/components/Sidebar';
import TicketDetail from './TicketDetail';
import Link from 'next/link';
export const dynamic = 'force-dynamic'; // Important pour le mode export

// Pour le mode export, générez les paramètres des routes statiques
export async function generateStaticParams() {
  // En développement, retournez un tableau vide
  if (process.env.NODE_ENV === 'development') return [];
  
  try {
    const res = await fetch('http://localhost:5000/api/tickets');
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const tickets = await res.json();
    return tickets.map((ticket: any) => ({ id: ticket._id.toString() }));
  } catch (error) {
    console.error('Static generation fallback:', error);
    return [{ id: '686fad7e6d3002d5f7d5c3cc' }]; // Fallback avec un ID connu
  }
}

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

export default async function TicketPage({ params }: { params: { id: string } }) {
  try {
  const res = await fetch(`http://localhost:5000/api/tickets/${params.id}`, {
    cache: 'no-store' // Désactive le cache pour les données dynamiques
  });
  
  if (!res.ok) {
      // Améliorez le message d'erreur
      throw new Error(`Erreur ${res.status}: ${await res.text()}`);
  }


  const ticket: Ticket = await res.json();

  // Add mock history if not present
  const ticketWithHistory = {
    ...ticket,
    history: ticket.history || [
      {
        date: ticket.created_at,
        action: 'Ticket créé',
        author: 'Système'
      },
      ...(ticket.resolver ? [{
        date: ticket.resolvedAt || new Date().toISOString(),
        action: `Assigné à ${ticket.resolver}`,
        author: 'Système'
      }] : []),
      ...(ticket.response ? [{
        date: new Date().toISOString(),
        action: 'Réponse envoyée',
        author: ticket.resolver || 'Agent'
      }] : []),
      ...(ticket.status === 'resolved' ? [{
        date: ticket.resolvedAt || new Date().toISOString(),
        action: 'Ticket résolu',
        author: ticket.resolver || 'Agent'
      }] : [])
    ]
  };

  return <TicketDetail ticket={ticketWithHistory} />;
  
} catch (error) {
    console.error('Fetch error:', error);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Impossible de charger le ticket
            </h1>
            <p className="text-gray-600 mb-6">{typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error)}</p>
            <Link href="/tickets" className="text-charte1 hover:underline">
              Retour à la liste des tickets
            </Link>
          </div>
        </main>
      </div>
    );
  }
} 
