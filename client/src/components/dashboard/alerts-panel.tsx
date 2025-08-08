import { AlertTriangle, Clock, Info } from "lucide-react";

interface AlertsPanelProps {
  lowStockCount: number;
}

export default function AlertsPanel({ lowStockCount }: AlertsPanelProps) {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Stock Critique',
      message: `${lowStockCount} médicaments en rupture de stock`,
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Rendez-vous en Retard',
      message: '3 patients en attente depuis 30 min',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'info',
      title: 'Maintenance Système',
      message: 'Prévue ce soir à 22h00',
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-gray">
      <div className="px-6 py-4 border-b border-border-gray">
        <h3 className="text-lg font-semibold text-gray-900">Alertes & Notifications</h3>
      </div>
      <div className="p-6 space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-start space-x-3 p-3 ${alert.bgColor} border ${alert.borderColor} rounded-lg`}
          >
            <div className="flex-shrink-0">
              <alert.icon className={`w-5 h-5 ${alert.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${alert.textColor}`}>{alert.title}</p>
              <p className={`text-xs ${alert.iconColor}`}>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
