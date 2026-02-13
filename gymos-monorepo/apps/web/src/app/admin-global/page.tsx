'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@gymos/contracts';

export default function AdminGlobalPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, Global Administrator.</p>
        <p>This route is protected and only accessible to users with the AdminGlobal role.</p>
      </div>
    </RoleGuard>
  );
}
