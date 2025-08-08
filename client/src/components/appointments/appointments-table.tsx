import { Appointment } from "@shared/schema";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

interface AppointmentsTableProps {
  appointments: Appointment[];
  compact?: boolean;
}

export default function AppointmentsTable({ appointments, compact = false }: AppointmentsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <div className="w-2 h-2 bg-healthcare-green rounded-full"></div>;
      case 'scheduled':
        return <div className="w-2 h-2 bg-medical-blue rounded-full"></div>;
      case 'completed':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      case 'cancelled':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'scheduled':
        return 'Programmé';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-healthcare-green';
      case 'scheduled':
        return 'text-medical-blue';
      case 'completed':
        return 'text-gray-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Aucun rendez-vous trouvé</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(appointment.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.patientId} {/* This would need to be resolved to patient name */}
                </p>
                <p className="text-xs text-gray-500">
                  {appointment.doctorId} - {appointment.type}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatTime(appointment.appointmentDate)}
              </p>
              <p className={`text-xs ${getStatusColor(appointment.status)}`}>
                {getStatusLabel(appointment.status)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Médecin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Heure
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {appointment.patientId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {appointment.doctorId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(appointment.appointmentDate).toLocaleString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {appointment.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(appointment.status)}
                  <span className={`text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
