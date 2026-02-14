export enum UserRole {
  AdminGlobal = 'AdminGlobal',
  AdminTenant = 'AdminTenant',
  Trainer = 'Trainer',
  Staff = 'Staff',
  Member = 'Member',
  Coach = 'Coach', // Adding Coach as it was used in the matrix
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  avatarUrl?: string; // Added for UI
}

export interface Member extends User {
  status: 'Active' | 'Inactive' | 'Pending';
  membershipPlan: 'Basic' | 'Premium' | 'VIP';
  joinDate: Date;
  lastVisit?: Date;
  phone?: string;
}

export interface Staff extends User {
  role: UserRole.Trainer | UserRole.Staff | UserRole.Coach | UserRole.AdminTenant;
  specialties: string[];
  schedule?: string;
  bio?: string;
}

export interface ClassDefinition {
  id: string;
  name: string;
  description?: string;
  defaultDuration: number; // in minutes
  capacity: number;
  color?: string; // Hex code for UI
  tenantId: string;
}

export interface ClassSession {
  id: string;
  classId: string;
  trainerId: string;
  startTime: Date;
  endTime: Date;
  currentBookings: number;
  tenantId: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  memberId: string;
  status: 'Confirmed' | 'Cancelled' | 'Waitlist';
  bookedAt: Date;
}

export type TenantPlan = 'Enterprise' | 'Pro' | 'Standard';
export type TenantStatus = 'Active' | 'Inactive' | 'Suspended';

export interface TenantFeatures {
  ai_insights: boolean;
  qr_checkin: boolean;
  custom_reports: boolean;
  member_portal: boolean;
  class_optimization: boolean;
  revenue_forecast: boolean;
}

export interface TenantSettings {
  freeze_days: number;
  max_class_capacity: number;
  allow_guest_pass: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: Date;
  lastLogin?: Date;
  userCount: number;
  features: TenantFeatures;
  settings: TenantSettings;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  key: keyof TenantFeatures;
  requiredPlan: TenantPlan | 'All';
  status: 'Beta' | 'Stable' | 'Deprecated';
  isGlobal?: boolean;
}


export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  maxStaff: number;
  maxMembers: number;
  includesClasses: boolean;
  includesApp: boolean;
  status: 'Active' | 'Archived';
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string; // Denormalized for easy display
  amount: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed';
  method: 'Cash' | 'Transfer' | 'Card' | 'MercadoPago';
  date: Date;
  dueDate: Date;
  concept: string; // e.g. "Cuota Marzo 2026"
  tenantId: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Arms' | 'Shoulders' | 'Cardio' | 'Core';
  videoUrl?: string; // Optional for demo
}

export interface RoutineItem {
  exerciseId: string;
  sets: number;
  reps: string; // "10-12" or "Until failure"
  restSeconds: number;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  items: RoutineItem[];
  tenantId: string;
}

export interface AssignedRoutine {
  id: string;
  memberId: string;
  routineId: string;
  assignedBy: string;
  assignedAt: Date;
  active: boolean;
}

export interface CheckIn {
  id: string;
  memberId: string;
  memberName: string; // Denormalized
  timestamp: Date;
  type: 'QR' | 'DNI' | 'Manual';
  status: 'Allowed' | 'Denied';
  deniedReason?: string; // e.g. "Quota Expired"
  tenantId: string;
}
