import { Link } from "wouter";
import { Plus, Calendar, Search } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-gray">
      <div className="px-6 py-4 border-b border-border-gray">
        <h3 className="text-lg font-semibold text-gray-900">Actions Rapides</h3>
      </div>
      <div className="p-6 space-y-3">
        <Link href="/patients/new">
          <a className="w-full bg-medical-blue text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau Patient</span>
          </a>
        </Link>
        
        <Link href="/appointments">
          <a className="w-full bg-healthcare-green text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Planifier RDV</span>
          </a>
        </Link>

        <Link href="/patients">
          <a className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Rechercher Patient</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
