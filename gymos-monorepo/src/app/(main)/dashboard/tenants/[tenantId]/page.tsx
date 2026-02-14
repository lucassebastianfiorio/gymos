'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockTenants } from '@/data/tenants';
import { notFound, useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TenantDetailPage() {
    const params = useParams();
    const tenantId = params.tenantId as string;
    const tenant = mockTenants.find(t => t.id === tenantId);

    if (!tenant) {
        return notFound();
    }

    return (
        <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/tenants">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Badge variant={tenant.status === 'Active' ? 'default' : 'secondary'}>{tenant.status}</Badge>
                            <span>•</span>
                            <span>{tenant.plan} Plan</span>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="settings">Settings & Features</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                    </TabsList>
                    
                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{tenant.userCount}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-sm">
                                        {tenant.lastLogin?.toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Freeze Days</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{tenant.settings.freeze_days}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Class Capacity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{tenant.settings.max_class_capacity}</div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Internal Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Email:</span>
                                        <span>{tenant.contactEmail}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="font-medium">Phone:</span>
                                        <span>{tenant.contactPhone || 'N/A'}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="font-medium">Location:</span>
                                        <span>{tenant.city}, {tenant.country}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* SETTINGS TAB */}
                     <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Features Configuration</CardTitle>
                                <CardDescription>Manage enabled features for this tenant.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                {Object.entries(tenant.features).map(([key, value]) => {
                                    // Use local state (mock) or just visually show switch
                                    // In a real app this would be a separate component with its own mutation
                                    return (
                                    <div key={key} className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {value ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                         <Switch checked={value} onCheckedChange={() => alert(`Toggled ${key} for ${tenant.name} (Mock)`)} />
                                    </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TEAM TAB */}
                    <TabsContent value="team">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Manage tenant administrators and staff.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <p className="text-muted-foreground text-sm">Team management module coming soon.</p>
                             </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
