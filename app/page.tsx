
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAB9] to-[#FBC4AB]">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F08080] rounded-lg flex items-center justify-center">
              <i className="ri-ticket-line text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, serif' }}>
              Ticketly
            </h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-[#F08080] transition-colors cursor-pointer">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-[#F08080] transition-colors cursor-pointer">
              Tarifs
            </Link>
            <Link href="/auth" className="bg-[#F08080] text-white px-6 py-2 rounded-full hover:bg-[#F4978E] transition-colors cursor-pointer whitespace-nowrap">
              Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="w-full h-screen bg-cover bg-center bg-top flex items-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20customer%20support%20workspace%20with%20soft%20coral%20and%20peach%20tones%2C%20minimalist%20office%20environment%20with%20floating%20tickets%20and%20chat%20bubbles%2C%20clean%20desk%20setup%20with%20computer%20screen%20showing%20support%20dashboard%2C%20warm%20lighting%20creating%20peaceful%20atmosphere%2C%20professional%20team%20collaboration%20space%20with%20modern%20design%20elements%2C%20soft%20shadows%20and%20gentle%20gradients%20in%20background&width=1920&height=1080&seq=hero-ticketly&orientation=landscape')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFDAB9]/90 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Ticketly
              </h1>
              <p className="text-2xl text-[#F08080] mb-8 font-medium">
                Your AI-powered support desk
              </p>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                Gérez vos tickets clients en toute simplicité avec notre système intelligent alimenté par l'IA. Support rapide, efficace et personnalisé.
              </p>
              <div className="flex space-x-4">
                <Link href="/auth" className="bg-[#F08080] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#F4978E] transition-colors cursor-pointer whitespace-nowrap">
                  Commencer gratuitement
                </Link>
                <Link href="#demo" className="bg-white/80 text-[#F08080] px-8 py-4 rounded-full text-lg font-medium hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
                  Voir la démo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Pourquoi choisir Ticketly ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme révolutionne la gestion du support client avec des outils modernes et intelligents
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#F8AD9D]/20 to-[#FBC4AB]/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#F08080] rounded-full mx-auto mb-6 flex items-center justify-center">
                <i className="ri-robot-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Intelligence Artificielle</h3>
              <p className="text-gray-600">
                Réponses automatiques intelligentes et catégorisation des tickets pour un support plus rapide
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#F4978E]/20 to-[#F8AD9D]/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#F4978E] rounded-full mx-auto mb-6 flex items-center justify-center">
                <i className="ri-dashboard-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Dashboard intuitif</h3>
              <p className="text-gray-600">
                Interface simple et épurée pour gérer tous vos tickets en un coup d'œil
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#FBC4AB]/20 to-[#FFDAB9]/20 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FBC4AB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Réponse rapide</h3>
              <p className="text-gray-600">
                Temps de réponse optimisé grâce à l'automatisation et la priorisation intelligente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-[#F8AD9D]/10 to-[#FFDAB9]/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Comment ça marche ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F08080] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Créez votre ticket</h3>
              <p className="text-gray-600">
                Remplissez un formulaire simple avec votre problème ou question
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F4978E] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">IA analyse</h3>
              <p className="text-gray-600">
                Notre intelligence artificielle catégorise et priorise votre demande
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FBC4AB] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Réponse rapide</h3>
              <p className="text-gray-600">
                Recevez une réponse personnalisée de notre équipe ou de l'IA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui convient à votre entreprise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Gratuit</h3>
              <div className="text-4xl font-bold text-[#F08080] mb-6">0€<span className="text-lg text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  50 tickets par mois
                </li>
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  Réponses IA basiques
                </li>
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  Support email
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                Commencer gratuitement
              </button>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#F08080] to-[#F4978E] text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FFDAB9] text-[#F08080] px-4 py-2 rounded-full text-sm font-medium">
                Populaire
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">29€<span className="text-lg opacity-80">/mois</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  500 tickets par mois
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  IA avancée
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  Support prioritaire
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  Analytics détaillés
                </li>
              </ul>
              <button className="w-full bg-white text-[#F08080] py-3 rounded-full font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                Choisir Pro
              </button>
            </div>
            
            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Entreprise</h3>
              <div className="text-4xl font-bold text-[#F08080] mb-6">99€<span className="text-lg text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  Tickets illimités
                </li>
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  IA personnalisée
                </li>
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  Support 24/7
                </li>
                <li className="flex items-center text-gray-600">
                  <i className="ri-check-line text-[#F08080] mr-2"></i>
                  Intégrations avancées
                </li>
              </ul>
              <button className="w-full bg-[#F08080] text-white py-3 rounded-full font-medium hover:bg-[#F4978E] transition-colors whitespace-nowrap">
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#F08080] to-[#F4978E]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à révolutionner votre support client ?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Rejoignez des milliers d'entreprises qui font confiance à Ticketly
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth" className="bg-white text-[#F08080] px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              Commencer maintenant
            </Link>
            <Link href="#demo" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-[#F08080] transition-colors cursor-pointer whitespace-nowrap">
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#F08080] rounded-lg flex items-center justify-center">
                  <i className="ri-ticket-line text-white text-lg"></i>
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Pacifico, serif' }}>
                  Ticketly
                </h3>
              </div>
              <p className="text-gray-400">
                Votre solution de support client alimentée par l'IA
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Statut</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Carrières</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between items-center">
            <p className="text-gray-400">
              © 2024 Ticketly. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <i className="ri-robot-line"></i>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
