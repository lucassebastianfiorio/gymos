'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';

export default function AdminTenantPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.AdminGlobal]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Tenant Dashboard</h1>
                <p>Welcome, Tenant Administrator.</p>
                <p>This route is protected and accessible to AdminTenant and AdminGlobal roles.</p>
            </div>
        </RoleGuard>
    );
}
