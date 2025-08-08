import { InventoryItem } from "@shared/schema";
import { Eye, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InventoryTableProps {
  items: InventoryItem[];
  showActions?: boolean;
}

export default function InventoryTable({ items, showActions = true }: InventoryTableProps) {
  const isLowStock = (item: InventoryItem) => {
    return item.currentStock <= item.minimumStock;
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    } else if (isLowStock(item)) {
      return { label: 'Stock Faible', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'Stock OK', color: 'bg-green-100 text-green-800' };
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '-';
    return `${parseFloat(amount).toLocaleString('fr-FR')} XOF`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return '💊';
      case 'supply':
        return '🧪';
      case 'equipment':
        return '🔧';
      default:
        return '📦';
    }
  };

  const formatCategory = (category: string) => {
    switch (category) {
      case 'medication':
        return 'Médicament';
      case 'supply':
        return 'Fourniture';
      case 'equipment':
        return 'Équipement';
      default:
        return category;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Aucun article trouvé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Actuel
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Min.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix Unitaire
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => {
            const stockStatus = getStockStatus(item);
            
            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                      {isLowStock(item) && (
                        <AlertTriangle className="w-4 h-4 text-alert-orange ml-2" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    {formatCategory(item.category)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${isLowStock(item) ? 'text-alert-orange' : 'text-gray-900'}`}>
                    {item.currentStock} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.minimumStock} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${stockStatus.color} border-0`}>
                    {stockStatus.label}
                  </Badge>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-medical-blue hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
