'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; // ✅ useParams ici

export default function ResolveTicketPage() {
  const router = useRouter();
  const params = useParams(); // ✅ récupère tous les paramètres dynamiques
  const id = params?.id as string; // ✅ récupère l’id proprement

  const [formData, setFormData] = useState({
    resolution: '',
    resolutionType: 'fixed',
    satisfactionSurvey: true,
    followUpDate: ''
  });

  const [ticketData, setTicketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock data based on ticket ID
  const mockTicketData = {
    'TK-001': {
      id: 'TK-001',
      subject: 'Connection issues with my account',
      status: 'pending',
      priority: 'high',
      category: 'Technical',
      requester: 'John Smith',
      requesterEmail: 'john.smith@email.com'
    },
    'TK-002': {
      id: 'TK-002',
      subject: 'Billing question',
      status: 'pending',
      priority: 'medium',
      category: 'Billing',
      requester: 'Jane Doe',
      requesterEmail: 'jane.doe@email.com'
    },
    'TK-003': {
      id: 'TK-003',
      subject: 'Feature request for dashboard',
      status: 'pending',
      priority: 'low',
      category: 'Feature Request',
      requester: 'Mike Johnson',
      requesterEmail: 'mike.johnson@email.com'
    }
  };

  useEffect(() => {
    const ticket = mockTicketData[id as keyof typeof mockTicketData];
    if (ticket) {
      setTicketData(ticket);
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
    const res = await fetch(`http://localhost:5000/api/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        statut: 'résolu',
        resolution: formData.resolution,
        resolutionType: formData.resolutionType,
        satisfactionSurvey: formData.satisfactionSurvey,
        followUpDate: formData.followUpDate
      })
    });

    if (!res.ok) throw new Error("Échec de la mise à jour du ticket");

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
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ticket not found</h1>
          <Link href="/dashboard" className="text-[#F08080] hover:underline">
            Back to dashboard
          </Link>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket Resolved!</h2>
          <p className="text-gray-600 mb-6">
            The ticket has been marked as resolved. The customer will receive a notification.
          </p>
          <Link
            href={`/dashboard/tickets/${id}`}
            className="bg-[#F08080] text-white px-6 py-3 rounded-lg hover:bg-[#F4978E] transition-colors inline-block whitespace-nowrap"
          >
            Back to ticket
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
                <h1 className="text-2xl font-bold text-gray-800 font-['Pacifico']">
                  logo
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
                <span className="text-[#F08080]">Resolve</span>
              </nav>
            </div>
            <Link 
              href={`/dashboard/tickets/${id}`} 
              className="text-gray-600 hover:text-[#F08080] transition-colors flex items-center space-x-2"
            >
              <i className="ri-arrow-left-line"></i>
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Ticket Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Resolve Ticket #{ticketData.id}</h2>
              <p className="text-gray-600 mb-4">{ticketData.subject}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Customer: {ticketData.requester}</span>
                <span>•</span>
                <span>Category: {ticketData.category}</span>
                <span>•</span>
                <span className="capitalize">Priority: {ticketData.priority}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Resolution Information</h3>
            <p className="text-gray-600 mt-1">
              Document the solution provided to the customer's problem.
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

            <div className="mb-6">
              <label htmlFor="resolutionType" className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Type *
              </label>
              <div className="relative">
                <select
                  id="resolutionType"
                  name="resolutionType"
                  value={formData.resolutionType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors appearance-none bg-white"
                  required
                >
                  <option value="fixed">Problem Fixed</option>
                  <option value="workaround">Workaround Provided</option>
                  <option value="information">Information Provided</option>
                  <option value="duplicate">Duplicate Ticket</option>
                  <option value="not-reproducible">Not Reproducible</option>
                  <option value="wont-fix">Won't Fix</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Description *
              </label>
              <textarea
                id="resolution"
                name="resolution"
                value={formData.resolution}
                onChange={handleInputChange}
                rows={6}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors resize-none"
                placeholder="Explain how the problem was resolved or the solution provided..."
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.resolution.length}/500 characters
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date (optional)
              </label>
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08080] focus:border-transparent outline-none transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-gray-500 mt-1">
                Schedule a follow-up to check customer satisfaction
              </p>
            </div>

            <div className="mb-8">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="satisfactionSurvey"
                  checked={formData.satisfactionSurvey}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#F08080] bg-gray-100 border-gray-300 rounded focus:ring-[#F08080] focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Send satisfaction survey to customer
                </span>
              </label>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <Link
                href={`/dashboard/tickets/${id}`}
                className="text-gray-600 hover:text-gray-800 transition-colors text-center md:text-left"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-check-line"></i>
                    <span>Mark as Resolved</span>
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
