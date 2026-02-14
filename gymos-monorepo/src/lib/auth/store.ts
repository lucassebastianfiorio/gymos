import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/contracts';
import { USERS_BY_EMAIL } from '@/data/users';

interface AuthState {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const getRoleFromEmail = (email: string): UserRole => {
    const normalize = email.toLowerCase();
    // Check most specific roles first to avoid conflicts
    if (normalize.includes('adminglobal') || normalize === 'admin@gymos.com') return UserRole.AdminGlobal;
    if (normalize.includes('admintenant')) return UserRole.AdminTenant;
    if (normalize.includes('trainer')) return UserRole.Trainer;
    if (normalize.includes('coach')) return UserRole.Coach;
    if (normalize.includes('staff')) return UserRole.Staff;
    if (normalize.includes('member')) return UserRole.Member;
    return UserRole.Member; // Default
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string, password?: string) => {
        // Mock password validation
        if (password && password !== '123456') {
            console.error('Invalid password');
            return false;
        }

        const user = USERS_BY_EMAIL[email] || {
             id: 'mock-user-id',
            name: email.split('@')[0],
            email: email,
            role: getRoleFromEmail(email),
            tenantId: 'tenant_1',
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`
        };

        set({ user });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'gymos-auth-storage',
    }
  )
);
