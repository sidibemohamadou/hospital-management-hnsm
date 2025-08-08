import { FinancialTransaction } from "@shared/schema";
import { Eye, Edit, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  showActions?: boolean;
}

export default function TransactionsTable({ transactions, showActions = true }: TransactionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En Attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: string, currency: string = 'XOF') => {
    return `${parseFloat(amount).toLocaleString('fr-FR')} ${currency}`;
  };

  const formatType = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'medication':
        return 'Médicament';
      case 'test':
        return 'Analyse';
      case 'hospitalization':
        return 'Hospitalisation';
      default:
        return type;
    }
  };

  const formatPaymentMethod = (method: string | null) => {
    if (!method) return '-';
    switch (method) {
      case 'cash':
        return 'Espèces';
      case 'card':
        return 'Carte';
      case 'insurance':
        return 'Assurance';
      case 'bank_transfer':
        return 'Virement';
      default:
        return method;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('fr-FR');
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Aucune transaction trouvée</p>
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
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mode de Paiement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {transaction.patientId || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatType(transaction.type)}</p>
                  {transaction.description && (
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPaymentMethod(transaction.paymentMethod)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`${getStatusColor(transaction.status)} border-0`}>
                  {getStatusLabel(transaction.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(transaction.transactionDate)}
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
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
