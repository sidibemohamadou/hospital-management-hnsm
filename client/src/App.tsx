import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authService } from "./lib/auth";
import { useState, useEffect } from "react";

// Layout
import Sidebar from "./components/layout/sidebar";
import Header from "./components/layout/header";

// Pages
import Dashboard from "./pages/dashboard";
import PatientsIndex from "./pages/patients/index";
import PatientsNew from "./pages/patients/new";
import AppointmentsIndex from "./pages/appointments/index";
import StaffIndex from "./pages/staff/index";
import InventoryIndex from "./pages/inventory/index";
import LaboratoryIndex from "./pages/laboratory/index";
import FinancesIndex from "./pages/finances/index";
import ReportsIndex from "./pages/reports/index";
import NotFound from "@/pages/not-found";

// Login component
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(username, password);
      window.location.reload();
    } catch (err) {
      setError("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-border-gray max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HNSM</h1>
          <p className="text-gray-600">Hôpital National Simão Mendes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-medical-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Comptes de test :</p>
          <p>admin / password (Administrateur)</p>
          <p>dr.santos / password (Médecin)</p>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <div className="flex h-screen bg-soft-gray">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/patients" component={PatientsIndex} />
            <Route path="/patients/new" component={PatientsNew} />
            <Route path="/appointments" component={AppointmentsIndex} />
            <Route path="/staff" component={StaffIndex} />
            <Route path="/inventory" component={InventoryIndex} />
            <Route path="/laboratory" component={LaboratoryIndex} />
            <Route path="/finances" component={FinancesIndex} />
            <Route path="/reports" component={ReportsIndex} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isAuthenticated ? <AuthenticatedApp /> : <LoginForm />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
