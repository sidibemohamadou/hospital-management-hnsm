import { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

class AuthService {
  private user: AuthUser | null = null;

  async login(username: string, password: string): Promise<AuthUser> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Échec de la connexion');
    }

    const data = await response.json();
    this.user = data.user;
    localStorage.setItem('auth_user', JSON.stringify(this.user));
    return this.user;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('auth_user');
  }

  getCurrentUser(): AuthUser | null {
    if (!this.user) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}

export const authService = new AuthService();
