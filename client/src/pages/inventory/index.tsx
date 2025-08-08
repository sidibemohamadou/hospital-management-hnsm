import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, Package, AlertTriangle, TrendingDown, ShoppingCart } from "lucide-react";
import InventoryTable from "@/components/inventory/inventory-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InventoryIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ['/api/inventory', showLowStock ? { lowStock: 'true' } : {}],
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['/api/inventory', { lowStock: 'true' }],
  });

  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTotalValue = () => {
    if (!items) return 0;
    return items.reduce((total, item) => {
      const price = item.unitPrice ? parseFloat(item.unitPrice) : 0;
      return total + (price * item.currentStock);
    }, 0);
  };

  const getOutOfStockCount = () => {
    return items?.filter(item => item.currentStock === 0).length || 0;
  };

  const getCategoryStats = () => {
    if (!items) return {};
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
            <p className="text-gray-600 mt-1">Pharmacie et inventaire médical</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={() => setShowLowStock(!showLowStock)}
              className={showLowStock ? "bg-alert-orange hover:bg-orange-600" : ""}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Stock Critique ({lowStockItems?.length || 0})
            </Button>
            <Button className="bg-medical-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Article
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Articles Total</p>
              <p className="text-2xl font-bold text-gray-900">{items?.length || 0}</p>
              <p className="text-sm text-gray-500">en inventaire</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-alert-orange" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alertes Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems?.length || 0}</p>
              <p className="text-sm text-alert-orange">nécessitent attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ruptures</p>
              <p className="text-2xl font-bold text-gray-900">{getOutOfStockCount()}</p>
              <p className="text-sm text-red-600">articles épuisés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border-gray p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-healthcare-green" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalValue().toLocaleString('fr-FR')}
              </p>
              <p className="text-sm text-healthcare-green">XOF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par Catégorie</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryStats).map(([category, count]) => (
            <Badge key={category} className="bg-blue-50 text-blue-800 border border-blue-200">
              {category === 'medication' ? 'Médicaments' :
               category === 'supply' ? 'Fournitures' :
               category === 'equipment' ? 'Équipements' : category}: {count}
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
              placeholder="Rechercher par nom, catégorie, fournisseur..."
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

      {/* Low Stock Alert Banner */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-alert-orange mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                Alerte Stock Critique
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                {lowStockItems.length} article(s) nécessitent un réapprovisionnement urgent.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-orange-300 text-orange-800 hover:bg-orange-100"
              onClick={() => setShowLowStock(true)}
            >
              Voir les Alertes
            </Button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border-gray">
        <div className="px-6 py-4 border-b border-border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {showLowStock ? 'Articles en Stock Critique' : 'Inventaire'} ({filteredItems.length})
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
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <InventoryTable items={filteredItems} />
          )}
        </div>
      </div>
    </div>
  );
}
