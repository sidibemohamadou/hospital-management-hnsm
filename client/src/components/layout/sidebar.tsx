import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, UserPlus, Calendar, UserCheck, Package, 
  FlaskConical, DollarSign, BarChart3, ChevronDown, ChevronRight,
  Stethoscope, Bed, Pill
} from "lucide-react";
import { useState } from "react";
import { authService } from "@/lib/auth";

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['patients']);
  const user = authService.getCurrentUser();

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const isActive = (path: string) => location === path || location.startsWith(path + '/');
  const isExpanded = (menu: string) => expandedMenus.includes(menu);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
      path: '/',
      roles: ['admin', 'doctor', 'nurse', 'secretary']
    },
    {
      id: 'patients',
      label: 'Gestion des Patients',
      icon: Users,
      hasSubmenu: true,
      roles: ['admin', 'doctor', 'nurse', 'secretary'],
      submenu: [
        { label: 'Liste des Patients', path: '/patients', icon: Users },
        { label: 'Nouveau Patient', path: '/patients/new', icon: UserPlus },
      ]
    },
    {
      id: 'appointments',
      label: 'Rendez-vous',
      icon: Calendar,
      path: '/appointments',
      roles: ['admin', 'doctor', 'nurse', 'secretary']
    },
    {
      id: 'emergencies',
      label: 'Urgences & Hospitalisations',
      icon: Bed,
      path: '/emergencies',
      roles: ['admin', 'doctor', 'nurse']
    },
    {
      id: 'consultations',
      label: 'Consultations',
      icon: Stethoscope,
      path: '/consultations',
      roles: ['admin', 'doctor']
    },
    {
      id: 'staff',
      label: 'Personnel',
      icon: UserCheck,
      path: '/staff',
      roles: ['admin']
    },
    {
      id: 'inventory',
      label: 'Pharmacie & Stocks',
      icon: Package,
      path: '/inventory',
      roles: ['admin', 'pharmacist'],
      badge: 5
    },
    {
      id: 'laboratory',
      label: 'Laboratoire',
      icon: FlaskConical,
      path: '/laboratory',
      roles: ['admin', 'doctor', 'laborant']
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: DollarSign,
      path: '/finances',
      roles: ['admin']
    },
    {
      id: 'reports',
      label: 'Rapports & Statistiques',
      icon: BarChart3,
      path: '/reports',
      roles: ['admin', 'doctor']
    }
  ];

  const canAccess = (roles: string[]) => {
    return !user || roles.includes(user.role);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-16 lg:border-r lg:border-border-gray lg:bg-white lg:overflow-y-auto">
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            if (!canAccess(item.roles)) return null;

            if (item.hasSubmenu) {
              const expanded = isExpanded(item.id);
              
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="text-gray-700 hover:bg-gray-100 group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {expanded ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  {expanded && item.submenu && (
                    <div className="ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.path} href={subItem.path}>
                          <a
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? 'text-medical-blue bg-blue-50 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {subItem.label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.id} href={item.path || '#'}>
                <a
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path || '#')
                      ? 'bg-medical-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
