import { Users, CheckCircle, AlertTriangle, FlaskConical } from "lucide-react";

export default function ActivityFeed() {
  // This would normally come from an API
  const activities = [
    {
      id: 1,
      type: 'patient',
      message: 'Nouveau patient enregistré: Maria Fernandez',
      time: 'Il y a 2 minutes',
      user: 'Dr. Santos',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-medical-blue'
    },
    {
      id: 2,
      type: 'consultation',
      message: 'Consultation terminée pour João Silva',
      time: 'Il y a 15 minutes',
      user: 'Dr. Mendes',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-healthcare-green'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Alerte stock: Paracétamol',
      time: 'Il y a 1 heure',
      user: 'Pharmacie',
      icon: AlertTriangle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-alert-orange'
    },
    {
      id: 4,
      type: 'lab',
      message: 'Résultats d\'analyses disponibles pour Ana Costa',
      time: 'Il y a 2 heures',
      user: 'Laboratoire',
      icon: FlaskConical,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-gray">
      <div className="px-6 py-4 border-b border-border-gray">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
          <button className="text-medical-blue hover:text-blue-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time} - {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
