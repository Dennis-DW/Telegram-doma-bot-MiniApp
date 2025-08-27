import React from 'react';
import { Card, Badge } from '../../ui';
import { Globe, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatsSection = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Domains',
      value: stats.total,
      icon: Globe,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Expiring Soon',
      value: stats.expiring,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Expired',
      value: stats.expired,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <Card key={index} className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection; 