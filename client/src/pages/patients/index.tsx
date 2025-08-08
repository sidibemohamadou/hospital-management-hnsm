import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Plus, Filter } from "lucide-react";
import PatientTable from "@/components/patients/patient-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PatientsIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients', searchQuery ? { search: searchQuery } : {}],
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
            <p className="text-gray-600 mt-1">Liste et recherche des patients enregistrés</p>
          </div>
          <Link href="/patients/new">
            <Button className="bg-medical-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, téléphone..."
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

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Patients ({patients?.length || 0})
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
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
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
          ) : (
            <PatientTable patients={patients || []} />
          )}
        </div>
      </div>
    </div>
  );
}
