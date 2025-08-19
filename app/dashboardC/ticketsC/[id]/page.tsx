import TicketDetail from './TicketDetail';

export async function generateStaticParams() {
  return [
    { id: 'TK-001' },
    { id: 'TK-002' },
    { id: 'TK-003' },
    { id: 'TK-004' },
    { id: 'TK-005' },
  ];
}

export default function TicketPage({ params }: { params: { id: string } }) {
  return <TicketDetail ticketId={params.id} />;
}