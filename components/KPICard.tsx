
'use client';

interface KPICardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: string;
  color: string;
  isPositive?: boolean;
}

export default function KPICard({ title, value, trend, icon, color, isPositive = true }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <i className={`${icon} text-gray-500 text-xl`}></i>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          <i className={`${isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs`}></i>
          <span>{trend}</span>
        </div>
        <span className="text-xs text-gray-500">vs mois dernier</span>
      </div>
    </div>
  );
}
