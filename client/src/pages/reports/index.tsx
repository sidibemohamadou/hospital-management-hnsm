import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users, Calendar, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsIndex() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: patients } = useQuery({
    queryKey: ['/api/patients'],
  });

  const { data: appointments } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/financial-transactions'],
  });

  const { data: tests } = useQuery({
    queryKey: ['/api/laboratory-tests'],
  });

  const { data: inventory } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Calculate monthly stats
  const getMonthlyPatientGrowth = () => {
    if (!patients) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = patients.filter(p => {
      const createdAt = new Date(p.createdAt || new Date());
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;
    
    const lastMonth = patients.filter(p => {
      const createdAt = new Date(p.createdAt || new Date());
      const lastMonthDate = new Date(currentYear, currentMonth - 1);
      return createdAt.getMonth() === lastMonthDate.getMonth() && 
             createdAt.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    if (lastMonth === 0) return 0;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  };

  const getTotalRevenue = () => {
    if (!transactions) return 0;
    return transactions
      .filter(t => t.status === 'paid')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const getMonthlyRevenue = () => {
    if (!transactions) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.transactionDate || new Date());
        return t.status === 'paid' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const getAverageAppointmentsPerDay = () => {
    if (!appointments) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const monthlyAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.appointmentDate);
      return appointmentDate.getMonth() === currentMonth && 
             appointmentDate.getFullYear() === currentYear;
    }).length;

    return Math.round(monthlyAppointments / daysInMonth);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} XOF`;
  };

  const reportSections = [
    {
      title: "Rapport des Patients",
      description: "Statistiques sur les patients enregistrés",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Rapport des Rendez-vous",
      description: "Analyse des consultations et rendez-vous",
      icon: Calendar,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Rapport Financier",
      description: "Recettes et paiements mensuels",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Rapport d'Inventaire",
      description: "État des stocks et approvisionnements",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports & Statistiques</h1>
            <p className="text-gray-600 mt-1">Analyses et indicateurs de performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
            <Button className="bg-medical-blue hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Générer Rapport
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Patients Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{patients?.length || 0}</p>
              <p className={`ml-2 text-sm ${
                getMonthlyPatientGrowth() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {getMonthlyPatientGrowth() >= 0 ? '+' : ''}{getMonthlyPatientGrowth()}% ce mois
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Recettes Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalRevenue())}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(getMonthlyRevenue())} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Consultations/Jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {getAverageAppointmentsPerDay()}
              </p>
              <p className="ml-2 text-sm text-gray-500">en moyenne</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux d'Occupation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{stats?.occupancyRate || 0}%</p>
              <p className="ml-2 text-sm text-gray-500">des lits</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Overview */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des Performances Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nouveaux Patients
                </h3>
                <p className="text-3xl font-bold text-medical-blue mb-1">
                  {patients?.filter(p => {
                    const createdAt = new Date(p.createdAt || new Date());
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return createdAt.getMonth() === currentMonth && 
                           createdAt.getFullYear() === currentYear;
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-600">ce mois-ci</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-healthcare-green rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Consultations
                </h3>
                <p className="text-3xl font-bold text-healthcare-green mb-1">
                  {appointments?.filter(a => {
                    const appointmentDate = new Date(a.appointmentDate);
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return appointmentDate.getMonth() === currentMonth && 
                           appointmentDate.getFullYear() === currentYear;
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-600">ce mois-ci</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recettes Mensuelles
                </h3>
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {formatCurrency(getMonthlyRevenue()).split(' ')[0]}
                </p>
                <p className="text-sm text-gray-600">XOF ce mois-ci</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Catégories de Rapports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportSections.map((section, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Générer
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>État du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Base de Données</p>
                <p className="text-xs text-gray-500">Opérationnelle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sauvegarde</p>
                <p className="text-xs text-gray-500">Dernière: Aujourd'hui 02:00</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Maintenance</p>
                <p className="text-xs text-gray-500">Prévue: Ce soir 22:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
