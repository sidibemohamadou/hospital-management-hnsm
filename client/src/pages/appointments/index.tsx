import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Filter, Clock } from "lucide-react";
import AppointmentsTable from "@/components/appointments/appointments-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppointmentsIndex() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments', selectedDate ? { date: selectedDate } : {}],
  });

  const { data: todayAppointments } = useQuery({
    queryKey: ['/api/appointments', { date: new Date().toISOString().split('T')[0] }],
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
            <p className="text-gray-600 mt-1">Planification et suivi des consultations</p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{todayAppointments?.length || 0}</p>
              <p className="text-sm text-gray-500">rendez-vous</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-healthcare-green" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayAppointments?.filter(apt => apt.status === 'confirmed').length || 0}
              </p>
              <p className="text-sm text-healthcare-green">confirmés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-alert-orange" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayAppointments?.filter(apt => apt.status === 'scheduled').length || 0}
              </p>
              <p className="text-sm text-alert-orange">à confirmer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date:
            </label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Plus de filtres
          </Button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Rendez-vous du {new Date(selectedDate).toLocaleDateString('fr-FR')} ({appointments?.length || 0})
            </h3>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : appointments && appointments.length > 0 ? (
            <AppointmentsTable appointments={appointments} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
              <p className="text-gray-500">Aucun rendez-vous prévu pour cette date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
