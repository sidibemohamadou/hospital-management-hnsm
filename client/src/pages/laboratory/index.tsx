import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, FlaskConical, Clock, CheckCircle, AlertCircle } from "lucide-react";
import LabTestsTable from "@/components/laboratory/lab-tests-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LaboratoryIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tests, isLoading } = useQuery({
    queryKey: ['/api/laboratory-tests'],
  });

  const filteredTests = tests?.filter(test =>
    test.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusStats = () => {
    if (!tests) return {};
    return tests.reduce((acc, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusStats = getStatusStats();

  const getTodayTests = () => {
    if (!tests) return 0;
    const today = new Date().toISOString().split('T')[0];
    return tests.filter(test => 
      test.orderDate.toISOString().startsWith(today)
    ).length;
  };

  const getPendingResults = () => {
    return tests?.filter(test => 
      test.status === 'completed' && !test.results
    ).length || 0;
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Laboratoire</h1>
            <p className="text-gray-600 mt-1">Analyses et tests médicaux</p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Analyse
          </Button>
        </div>
      </div>

      {/* Laboratory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Analyses Total</p>
              <p className="text-2xl font-bold text-gray-900">{tests?.length || 0}</p>
              <p className="text-sm text-gray-500">enregistrées</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-healthcare-green" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.completed || 0}</p>
              <p className="text-sm text-healthcare-green">résultats disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.in_progress || 0}</p>
              <p className="text-sm text-yellow-600">en traitement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-alert-orange" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commandées</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.ordered || 0}</p>
              <p className="text-sm text-alert-orange">en attente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Analyses Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-900">{getTodayTests()}</p>
            </div>
            <FlaskConical className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Taux de Completion</p>
              <p className="text-2xl font-bold text-green-900">
                {tests?.length ? Math.round(((statusStats.completed || 0) / tests.length) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Résultats Pendants</p>
              <p className="text-2xl font-bold text-orange-900">{getPendingResults()}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par Statut</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusStats).map(([status, count]) => (
            <Badge key={status} className="bg-blue-50 text-blue-800 border border-blue-200">
              {status === 'completed' ? 'Terminé' :
               status === 'in_progress' ? 'En Cours' :
               status === 'ordered' ? 'Commandé' :
               status === 'cancelled' ? 'Annulé' : status}: {count}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par patient, type d'analyse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Laboratory Tests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Analyses de Laboratoire ({filteredTests.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Dernière mise à jour: maintenant</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
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
          ) : filteredTests.length > 0 ? (
            <LabTestsTable tests={filteredTests} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune analyse trouvée</h3>
              <p className="text-gray-500">Commencez par enregistrer une nouvelle analyse.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
