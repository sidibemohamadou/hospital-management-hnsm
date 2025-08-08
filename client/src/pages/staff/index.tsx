import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, UserCheck, Users, Clock, Calendar } from "lucide-react";
import StaffTable from "@/components/staff/staff-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StaffIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: staff, isLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  const activeStaff = staff?.filter(member => member.isActive) || [];
  const inactiveStaff = staff?.filter(member => !member.isActive) || [];

  const getRoleStats = () => {
    if (!staff) return {};
    return staff.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const roleStats = getRoleStats();

  const filteredStaff = staff?.filter(member =>
    member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Personnel</h1>
            <p className="text-gray-600 mt-1">Personnel médical et administratif de l'hôpital</p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Membre
          </Button>
        </div>
      </div>

      {/* Staff Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Personnel Total</p>
              <p className="text-2xl font-bold text-gray-900">{staff?.length || 0}</p>
              <p className="text-sm text-gray-500">membres actifs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-healthcare-green" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Médecins</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.doctor || 0}</p>
              <p className="text-sm text-healthcare-green">en service</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Infirmiers</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.nurse || 0}</p>
              <p className="text-sm text-purple-600">de garde</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-alert-orange" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Personnel Inactif</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveStaff.length}</p>
              <p className="text-sm text-alert-orange">hors service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par Rôle</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(roleStats).map(([role, count]) => (
            <Badge key={role} className="bg-blue-50 text-blue-800 border border-blue-200">
              {role === 'doctor' ? 'Médecin' :
               role === 'nurse' ? 'Infirmier' :
               role === 'admin' ? 'Administrateur' :
               role === 'pharmacist' ? 'Pharmacien' :
               role === 'laborant' ? 'Laborantin' :
               role === 'secretary' ? 'Secrétaire' : role}: {count}
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
              placeholder="Rechercher par nom, rôle, département..."
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

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Personnel ({filteredStaff.length})
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
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
            <StaffTable staff={filteredStaff} />
          )}
        </div>
      </div>
    </div>
  );
}
