'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    {
      href: '/',
      label: 'Tableau de Bord',
      icon: 'ri-dashboard-line'
    },
    {
      href: '/tickets',
      label: 'Gestion des Tickets',
      icon: 'ri-ticket-line'
    },
    {
      href: '/clients',
      label: 'Clients',
      icon: 'ri-user-line'
    },
    {
      href: '/agents',
      label: 'Agents',
      icon: 'ri-team-line'
    },
    {
      href: '/reports',
      label: 'Rapports',
      icon: 'ri-bar-chart-line'
    }
  ];

  return (
    <div className="w-64 bg-charte1 text-white min-h-screen">
      <div className="p-6 border-b border-charte2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <i className="ri-headphone-line text-charte1 text-lg"></i>
          </div>
          <h1 className="text-xl font-bold font-pacifico">Ticketly</h1>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-charte2 transition-colors ${pathname === item.href ? 'bg-charte2 border-r-4 border-white' : ''
              }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-lg`}></i>
            </div>
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
        <hr className="my-4 border-charte2 mx-6" />
        <button
          onClick={() => router.push('/auth')}
          className="flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-charte2 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-r-line text-lg"></i>
          </div>
          <span className="whitespace-nowrap">Déconnexion</span>
        </button>
      </nav>
      {user && (
        <div className="mt-6 px-6 text-white">
          <hr className="my-2 border-charte2" />
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-charte2 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">
                {user.displayName || 'Administrateur'}
              </p>
              <p className="text-xs text-white opacity-70 leading-tight">{user.email}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}