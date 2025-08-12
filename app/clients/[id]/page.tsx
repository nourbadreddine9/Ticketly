import ClientDetail from './ClientDetail';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

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

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [];
  
  try {
    const res = await fetch('http://localhost:5000/api/tickets');
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const tickets = await res.json();
    
    // Extraire les IDs clients uniques
    const clientIds = [...new Set((tickets as Array<{ ownerTel: string | number }>).map((t) => t.ownerTel))] as (string | number)[];
    return clientIds.map(id => ({ id: String(id) }));
  } catch (error) {
    console.error('Static generation fallback:', error);
    return [{ id: '229353401' }]; // Fallback avec un ID connu
  }
}

export default async function ClientPage({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:5000/api/clients/${params.id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${await res.text()}`);
    }

    let client: Client = await res.json();

    // Map '_id' to 'id' for each ticket to match ClientDetail's Ticket interface
    client = {
      ...client,
      tickets: client.tickets.map((t: any) => ({
        //_id: t._id,
        //id: t._id,
        _id: t._id || t.id,
        id: t.id,
        subject: t.subject,
        message: t.message,
        response: t.response,
        category: t.category,
        status: t.status,
        createdAt: t.createdAt,
        resolvedAt: t.resolvedAt,
        satisfaction: t.satisfaction,
      })),
    };

    return <ClientDetail client={client} />;
  } catch (error) {
    console.error('Fetch error:', error);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Impossible de charger le client
            </h1>
            <p className="text-gray-600 mb-6">
              {typeof error === 'object' && error !== null && 'message' in error 
                ? (error as { message?: string }).message 
                : String(error)}
            </p>
            <Link href="/clients" className="text-charte1 hover:underline">
              Retour à la liste des clients
            </Link>
          </div>
        </main>
      </div>
    );
  }
}