import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import TransactionsTable from "@/components/finances/transactions-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FinancesIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/financial-transactions'],
  });

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.patientId?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTotalRevenue = () => {
    if (!transactions) return 0;
    return transactions
      .filter(t => t.status === 'paid')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const getPendingAmount = () => {
    if (!transactions) return 0;
    return transactions
      .filter(t => t.status === 'pending')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const getTodayRevenue = () => {
    if (!transactions) return 0;
    const today = new Date().toISOString().split('T')[0];
    return transactions
      .filter(t => t.status === 'paid' && t.transactionDate?.toISOString().startsWith(today))
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const getStatusStats = () => {
    if (!transactions) return {};
    return transactions.reduce((acc, transaction) => {
      acc[transaction.status] = (acc[transaction.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getTypeStats = () => {
    if (!transactions) return {};
    return transactions.reduce((acc, transaction) => {
      acc[transaction.type] = (acc[transaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusStats = getStatusStats();
  const typeStats = getTypeStats();

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion Financière</h1>
            <p className="text-gray-600 mt-1">Suivi des paiements et des recettes</p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Transaction
          </Button>
        </div>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-healthcare-green" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recettes Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalRevenue())}
              </p>
              <p className="text-sm text-healthcare-green">depuis le début</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTodayRevenue())}
              </p>
              <p className="text-sm text-medical-blue">recettes du jour</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getPendingAmount())}
              </p>
              <p className="text-sm text-yellow-600">à encaisser</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions?.length || 0}</p>
              <p className="text-sm text-purple-600">enregistrées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-3">Répartition par Statut</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusStats).map(([status, count]) => (
              <Badge key={status} className="bg-white text-green-800 border border-green-300">
                {status === 'paid' ? 'Payé' :
                 status === 'pending' ? 'En Attente' :
                 status === 'cancelled' ? 'Annulé' : status}: {count}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Répartition par Type</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeStats).map(([type, count]) => (
              <Badge key={type} className="bg-white text-blue-800 border border-blue-300">
                {type === 'consultation' ? 'Consultation' :
                 type === 'medication' ? 'Médicament' :
                 type === 'test' ? 'Analyse' :
                 type === 'hospitalization' ? 'Hospitalisation' : type}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par patient, type, description..."
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

      {/* Pending Payments Alert */}
      {getPendingAmount() > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Paiements en Attente
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {formatCurrency(getPendingAmount())} en attente d'encaissement 
                ({statusStats.pending} transaction(s)).
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              Traiter les Paiements
            </Button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions Financières ({filteredTransactions.length})
            </h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Exporter
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Dernière mise à jour: maintenant</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
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
          ) : filteredTransactions.length > 0 ? (
            <TransactionsTable transactions={filteredTransactions} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
              <p className="text-gray-500">Les transactions apparaîtront ici une fois enregistrées.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
