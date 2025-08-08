import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/dashboard/metric-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import QuickActions from "@/components/dashboard/quick-actions";
import AlertsPanel from "@/components/dashboard/alerts-panel";
import PatientTable from "@/components/patients/patient-table";
import AppointmentsTable from "@/components/appointments/appointments-table";
import { Users, Calendar, AlertCircle, Bed } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: recentPatients, isLoading: patientsLoading } = useQuery({
    queryKey: ['/api/patients'],
  });

  const { data: todayAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments', { date: new Date().toISOString().split('T')[0] }],
  });

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de l'activité hospitalière</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Aujourd'hui, {currentDate}</span>
            <button 
              className="bg-medical-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Patients Actifs"
          value={statsLoading ? "..." : stats?.activePatients?.toString() || "0"}
          change="+5.2% ce mois"
          changeType="positive"
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-medical-blue"
        />
        <MetricCard
          title="Consultations Aujourd'hui"
          value={statsLoading ? "..." : stats?.todayConsultations?.toString() || "0"}
          change="12 en cours"
          changeType="neutral"
          icon={Calendar}
          iconBg="bg-green-100"
          iconColor="text-healthcare-green"
        />
        <MetricCard
          title="Urgences"
          value={statsLoading ? "..." : stats?.emergencies?.toString() || "0"}
          change="2 critiques"
          changeType="negative"
          icon={AlertCircle}
          iconBg="bg-orange-100"
          iconColor="text-alert-orange"
        />
        <MetricCard
          title="Taux d'Occupation"
          value={statsLoading ? "..." : `${stats?.occupancyRate || 0}%`}
          change="156/200 lits"
          changeType="neutral"
          icon={Bed}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <QuickActions />
          <AlertsPanel lowStockCount={stats?.lowStockAlerts || 0} />
        </div>
      </div>

      {/* Recent Patients & Appointments */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-border-gray">
          <div className="px-6 py-4 border-b border-border-gray">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Patients Récents</h3>
              <button className="text-medical-blue hover:text-blue-700 text-sm font-medium">
                Voir tous
              </button>
            </div>
          </div>
          <div className="p-6">
            {patientsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PatientTable patients={recentPatients?.slice(0, 5) || []} showActions={false} />
            )}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-border-gray">
          <div className="px-6 py-4 border-b border-border-gray">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Rendez-vous d'Aujourd'hui</h3>
              <button className="text-medical-blue hover:text-blue-700 text-sm font-medium">
                Planning complet
              </button>
            </div>
          </div>
          <div className="p-6">
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <AppointmentsTable appointments={todayAppointments.slice(0, 4)} compact={true} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun rendez-vous aujourd'hui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
