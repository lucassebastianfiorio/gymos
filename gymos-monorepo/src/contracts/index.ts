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

// ============================================
// LOCATION / BRANCH
// ============================================

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// FEATURE FLAGS
// ============================================

export interface FeatureFlag {
  id: string;
  key: string; // e.g., 'members', 'routines', 'payments', 'classes'
  name: string;
  description: string;
  category: 'core' | 'premium' | 'addon';
}

export interface TenantFeatureSettings {
  tenantId: string;
  enabledFeatures: string[]; // Array of feature keys
}

// ============================================
// MEMBER (ENHANCED)
// ============================================

export type MemberStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';
export type MembershipPlan = 'Basic' | 'Premium' | 'VIP';
export type PlanType = 'monthly' | 'per_class' | 'quarterly' | 'annual';

export interface Member extends User {
  // Personal info
  firstName: string;
  lastName: string;
  dni: string;
  phone?: string;
  
  // Status and membership
  status: MemberStatus;
  membershipPlan: MembershipPlan;
  planType: PlanType;
  planExpirationDate: Date;
  joinDate: Date;
  lastVisit?: Date;
  
  // Assignments
  assignedTrainerId?: string;
  assignedLocationId?: string;
  assignedRoutineId?: string;
  assignedServiceIds?: string[];
  
  // Notes
  observations?: string; // health issues, medical notes, etc
}

// ============================================
// STAFF (ENHANCED)
// ============================================

export interface Staff extends User {
  role: UserRole.Trainer | UserRole.Staff | UserRole.Coach | UserRole.AdminTenant;
  specialties: string[];
  schedule?: string;
  bio?: string;
  assignedLocationIds: string[]; // branches where this staff works
  availableAtAllLocations: boolean; // if true, works at all branches
}

// ============================================
// PAYMENT (ENHANCED)
// ============================================

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partial' | 'Failed';
export type PaymentMethod = 'Cash' | 'Transfer' | 'Card' | 'MercadoPago';

export interface Payment {
  id: string;
  memberId: string;
  memberName: string; // Denormalized for easy display
  tenantId: string;
  locationId?: string; // REQUIRED if tenant has locations
  
  // Amounts
  amount: number; // Total to pay
  basePlanAmount: number; // original plan price
  lateFee: number; // calculated late fee
  interest: number; // calculated interest
  paidAmount: number; // total amount paid so far
  currency: string;
  
  // Status and dates
  status: PaymentStatus;
  method: PaymentMethod;
  date: Date; // Registration date
  dueDate: Date;
  paidDate?: Date;
  
  // Additional info
  concept: string; // e.g. "Cuota Marzo 2026"
  daysLate: number; // auto-calculated
  notes?: string;
}

// ============================================
// LATE PAYMENT SETTINGS
// ============================================

export interface LatePaymentSettings {
  tenantId: string;
  interestPerDay: number; // percentage (e.g., 0.5 = 0.5% per day)
  lateFee: number; // fixed amount
  gracePeriodDays: number; // days before applying fees
  suspensionAfterDays: number; // auto-suspend member after X days
  cancellationAfterDays: number; // auto-cancel subscription after X days
  upcomingPaymentNoticeDays: number; // days before due date to show alert
}

// ============================================
// CLASS SCHEDULING
// ============================================

export interface ScheduledClass {
  id: string;
  tenantId: string;
  locationId?: string;
  name: string;
  trainerId: string;
  trainerName?: string; // Denormalized
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // "09:00"
  duration: number; // minutes
  capacity: number;
  recurrence: 'weekly' | 'biweekly' | 'monthly';
  isActive: boolean;
  color?: string; // for UI calendar
}

// ============================================
// CLASSES (EXISTING)
// ============================================

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

// ============================================
// TENANT
// ============================================

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
  hasLocations: boolean; // NEW: indicates if gym has multiple branches
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

// ============================================
// SUBSCRIPTION PLANS
// ============================================

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
  tenantId?: string; // if tenant-specific
  locationId?: string; // if location-specific, null = all locations
  
  // New Subscription/Membership Fields
  durationMonths: number;
  isActive: boolean; // Added for UI consistency
  maxLocations: number; // Added to fix lint

  // Custom Gym Fields
  attendanceDaysPerWeek?: number;
  isPersonalizedTraining?: boolean;
}

// ============================================
// GYM SERVICES
// ============================================

export interface GymService {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price?: number;
  category: 'Wellness' | 'Nutrition' | 'Training' | 'Special' | 'Other';
  isActive: boolean;
}

// ============================================
// EXERCISES & ROUTINES
// ============================================

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

// ============================================
// CHECK-IN
// ============================================

export interface CheckIn {
  id: string;
  memberId: string;
  memberName: string; // Denormalized
  locationId?: string;
  timestamp: Date;
  type: 'QR' | 'DNI' | 'Manual';
  status: 'Allowed' | 'Denied';
  deniedReason?: string; // e.g. "Quota Expired"
  tenantId: string;
}

// ============================================
// CASH REGISTER (CAJA)
// ============================================

export type CashRegisterStatus = 'Open' | 'Closed';
export type CashMovementType = 'Income' | 'Expense' | 'Withdrawal' | 'Adjustment';

export interface CashRegisterSession {
  id: string;
  tenantId: string;
  locationId: string;
  openedBy: string; // Staff ID
  openedByName?: string;
  closedBy?: string; // Staff ID
  closedByName?: string;
  
  openedAt: Date;
  closedAt?: Date;
  
  openingBalance: number;
  expectedBalance?: number;
  closingBalance?: number; // Actual counted money
  
  status: CashRegisterStatus;
  notes?: string;
}

export interface CashMovement {
  id: string;
  sessionId: string;
  tenantId: string;
  locationId: string;
  type: CashMovementType;
  amount: number;
  concept: string;
  date: Date;
  performedBy: string; // Staff ID
  performedByName?: string;
  paymentId?: string; // Reference to Payment if it's an Income from a member
  notes?: string;
}

// ============================================
// MESSAGING & NOTIFICATIONS
// ============================================

export type MessageType = 'Direct' | 'Global' | 'Tenant' | 'Staff';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  
  targetType: 'User' | 'Tenant' | 'Role' | 'All';
  targetId?: string; // id of user, tenant, or role
  
  title: string;
  content: string;
  date: Date;
  isRead: boolean;
  priority: 'Low' | 'Medium' | 'High';
  
  tenantId?: string; // context for the message
}
