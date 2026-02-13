import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@gymos/contracts';

interface AuthState {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const getRoleFromEmail = (email: string): UserRole => {
    const normalize = email.toLowerCase();
    if (normalize.includes('admin@') || normalize.startsWith('adminglobal')) return UserRole.AdminGlobal;
    if (normalize.includes('admintenant') || normalize.includes('tenant')) return UserRole.AdminTenant;
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

        const role = getRoleFromEmail(email);
        set({
          user: {
            id: 'mock-user-id',
            name: email.split('@')[0], // Use part of email as name
            email: email,
            role,
            tenantId: role !== UserRole.AdminGlobal ? 'tenant_1' : undefined,
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`
          },
        });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'gymos-auth-storage',
    }
  )
);
