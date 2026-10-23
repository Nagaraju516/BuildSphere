// BuildSphere Modular Monolith Types
// Covers All 6 Modules and Shared Cross-Cutting Infrastructure

export type UserRole = 'homeowner' | 'contractor' | 'supplier' | 'admin';

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface Address {
  id: string;
  street: string;
  locality?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferredLanguage: SupportedLanguage;
  addresses: Address[];
  savedProperties: string[];
  savedProducts: string[];
  savedProviders: string[];
  createdAt: string;
}

// -------------------------------------------------------------
// MODULE 1: LAND, PROPERTY, PLANNING & APPROVALS
// -------------------------------------------------------------

export type PropertyType = 'land' | 'plot' | 'residential' | 'commercial';

export interface DueDiligenceItem {
  id: string;
  title: string;
  category: 'ownership' | 'title_deed' | 'encumbrance' | 'land_use' | 'road_access' | 'tax_receipts';
  status: 'pending' | 'in_progress' | 'verified' | 'flagged';
  notes?: string;
  updatedAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  message: string;
  requestedDate?: string;
  status: 'new' | 'contacted' | 'appointment_scheduled' | 'closed';
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  pricePerSqFt: number;
  areaSqFt: number;
  dimensions: string; // e.g. "40 x 60 ft"
  location: {
    city: string;
    locality: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
    surveyNumber?: string;
  };
  facing: 'East' | 'West' | 'North' | 'South' | 'North-East';
  images: string[];
  description: string;
  seller: {
    name: string;
    type: 'owner' | 'agent' | 'builder';
    phone: string;
    verified: boolean;
  };
  highlights: string[];
  dueDiligenceItems: DueDiligenceItem[];
  legalStatus: 'Clear Title' | 'Under Verification' | 'Agricultural Conversion Ready';
  isFeatured?: boolean;
  createdAt: string;
}

export interface FloorPlan {
  id: string;
  title: string;
  bhk: number;
  floors: number;
  plotSize: string; // e.g. "30 x 50 ft"
  builtUpAreaSqFt: number;
  style: 'Modern Contemporary' | 'Sustainable Eco-Villa' | 'Minimalist Villa' | 'Duplex Urban';
  estimatedCost: number;
  architectName: string;
  architectId: string;
  images: string[];
  energyEfficient: boolean;
  roomBreakdown: { room: string; dimensions: string }[];
  drawingRevisions: { version: string; date: string; description: string; fileUrl: string }[];
}

export interface LocalApprovalGuide {
  id: string;
  authorityName: string; // e.g. "GHMC / HMDA (Telangana)", "BBMP / BDA (Karnataka)", "DTCP (AP/TN)"
  region: string;
  approvalType: 'Building Permission' | 'Layout Approval' | 'Occupancy Certificate (OC)' | 'Utility Sanction';
  steps: string[];
  mandatoryDocuments: string[];
  estimatedDays: number;
  officialPortalUrl?: string;
}

export interface ApprovalRecord {
  id: string;
  projectId: string;
  authorityName: string;
  approvalType: string;
  applicationNumber: string;
  submissionDate: string;
  targetDeadline: string;
  status: 'draft' | 'submitted' | 'inspection_scheduled' | 'approved' | 'query_raised';
  inspections: { date: string; officer: string; outcome: string; remarks: string }[];
  documents: { name: string; uploadedAt: string; status: 'uploaded' | 'verified' }[];
}

// -------------------------------------------------------------
// MODULE 2: MATERIALS & PRODUCTS MARKETPLACE
// -------------------------------------------------------------

export type MaterialCategory = 'structural' | 'electrical' | 'plumbing' | 'finishing' | 'interior';

export interface Product {
  id: string;
  name: string;
  category: MaterialCategory;
  subCategory: string;
  brand: string;
  price: number;
  mrp: number;
  unit: string; // e.g., '50kg Bag', 'Tonne', 'Piece', '100m Coil', 'Litre'
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  specifications: Record<string, string>;
  supplier: {
    id: string;
    name: string;
    city: string;
    rating: number;
    deliveryDays: number;
  };
  description: string;
  minimumOrderQuantity: number;
  bulkDiscount?: { minQty: number; discountPercent: number };
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MaterialOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderedAt: string;
  estimatedDeliveryDate: string;
  trackingHistory: {
    timestamp: string;
    status: string;
    location: string;
    note: string;
  }[];
  invoiceNumber: string;
}

// -------------------------------------------------------------
// MODULE 3: PROFESSIONALS, WORKERS & SERVICE BOOKINGS
// -------------------------------------------------------------

export type TradeType =
  | 'general_contractor'
  | 'architect'
  | 'civil_engineer'
  | 'structural_engineer'
  | 'site_supervisor'
  | 'mason'
  | 'electrician'
  | 'plumber'
  | 'painter'
  | 'carpenter'
  | 'welder'
  | 'tile_installer'
  | 'waterproofing_expert'
  | 'interior_designer'
  | 'gardener'
  | 'cleaning_provider'
  | 'maintenance_tech';

export interface ProviderPortfolioItem {
  title: string;
  image: string;
  description: string;
  completedYear: number;
}

export interface Provider {
  id: string;
  name: string;
  businessName?: string;
  trade: TradeType;
  experienceYears: number;
  city: string;
  serviceAreas: string[];
  rating: number;
  reviewCount: number;
  indicativeDailyRate: number;
  indicativeHourlyRate?: number;
  skills: string[];
  portfolio: ProviderPortfolioItem[];
  isVerified: boolean;
  phone: string;
  availability: 'available' | 'busy' | 'unavailable';
  bio: string;
  avatar: string;
}

export type ServiceProvider = Provider;

export interface QuotationRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  providerId: string;
  providerName: string;
  trade: TradeType;
  projectTitle: string;
  workDescription: string;
  propertyLocation: string;
  estimatedBudget: number;
  status: 'submitted' | 'estimate_received' | 'accepted' | 'rejected';
  createdAt: string;
  estimateAmount?: number;
  estimateDurationDays?: number;
  estimateNotes?: string;
  estimateResponseDate?: string;
}

export type BookingStatus =
  | 'quote_accepted'
  | 'scheduled'
  | 'in_progress'
  | 'inspection_pending'
  | 'completed'
  | 'cancelled';

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  providerId: string;
  providerName: string;
  trade: TradeType;
  projectTitle: string;
  scheduledStartDate: string;
  agreedAmount: number;
  status: BookingStatus;
  workLogs: {
    date: string;
    summary: string;
    percentageCompleted: number;
  }[];
  userReview?: {
    rating: number;
    comment: string;
    reviewedAt: string;
  };
  createdAt: string;
}

// -------------------------------------------------------------
// MODULE 4: EQUIPMENT, TECHNOLOGY, TRANSPORT & LOGISTICS
// -------------------------------------------------------------

export type EquipmentCategory = 'earthmoving' | 'concrete' | 'scaffolding' | 'power' | 'lifting' | 'tools';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  model: string;
  hourlyRate: number;
  dailyRate: number;
  dailyRentalRate?: number;
  operatorProvided: boolean;
  availableCount: number;
  city: string;
  specifications: Record<string, string>;
  image: string;
  safetyGuidelines: string[];
}

export interface EquipmentRentalBooking {
  id: string;
  bookingNumber: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  deliveryAddress: Address;
  totalCost: number;
  status: 'requested' | 'confirmed' | 'dispatched' | 'on_site' | 'pickup_scheduled' | 'returned';
  operatorRequested: boolean;
  damageCheckNotes?: string;
  createdAt: string;
}

export interface SmartHomeTech {
  id: string;
  title: string;
  category: 'solar' | 'inverter' | 'cctv' | 'smart_locks' | 'automation' | 'water_purifier' | 'energy_monitor';
  brand: string;
  indicativeCost: number;
  benefits: string[];
  specifications: Record<string, string>;
  image: string;
  supplierName: string;
}

// -------------------------------------------------------------
// MODULE 5: FINANCE, USER MANAGEMENT & PLATFORM OPS
// -------------------------------------------------------------

export type ExpenseCategory =
  | 'land_permits'
  | 'structural_materials'
  | 'finishing_materials'
  | 'labour_contractors'
  | 'equipment_rental'
  | 'transport_logistics'
  | 'interior_furnishing'
  | 'contingency_misc';

export interface Expense {
  id: string;
  projectId: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  receiptNumber: string;
  paidTo: string;
  paymentMethod: 'upi' | 'bank_transfer' | 'cash' | 'card';
  notes?: string;
}

export interface DemoPaymentTransaction {
  id: string;
  transactionRef?: string;
  userId?: string;
  relatedEntity: 'material_order' | 'booking_deposit' | 'equipment_rental' | 'amc_subscription';
  entityId: string;
  amount: number;
  method: 'upi' | 'card' | 'netbanking' | 'cod';
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  receiptNumber: string;
  isSimulatedDemo: true;
}

// -------------------------------------------------------------
// MODULE 6: PROJECT LIFECYCLE, HANDOVER & MAINTENANCE
// -------------------------------------------------------------

export type MilestoneCategory =
  | 'pre_construction'
  | 'foundation_structure'
  | 'mep_rough_in'
  | 'finishing_interior'
  | 'inspection_handover';

export interface ProjectMilestone {
  id: string;
  index: number;
  title: string;
  category: MilestoneCategory;
  description: string;
  plannedBudget: number;
  actualCost: number;
  targetDays: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  completedDate?: string;
  progressPercent: number;
  notes: string[];
  photos: string[];
}

export interface SnagItem {
  id: string;
  title: string;
  location: string; // e.g. "Master Bedroom North Wall"
  category: 'civil' | 'electrical' | 'plumbing' | 'paint' | 'carpentry' | 'glass';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  status: 'open' | 'in_repair' | 'resolved' | 'verified';
  assignedTrade: string;
  reportedDate: string;
  resolvedDate?: string;
}

export interface HandoverCheckItem {
  id: string;
  area: string; // e.g. "Main DB & Earthing", "Terrace Waterproofing", "Sump & Overhead Tank"
  checklist: string;
  status: 'pass' | 'fail' | 'pending';
  testedBy: string;
  testedAt?: string;
  remarks?: string;
}

export interface ConstructionProject {
  id: string;
  title: string;
  userId: string;
  address: Address;
  plotAreaSqFt: number;
  builtUpAreaSqFt: number;
  floorsCount: number;
  targetBudget: number;
  contingencyBudget: number;
  startDate: string;
  targetCompletionDate: string;
  overallProgressPercent: number;
  status: 'planning' | 'foundation' | 'structure' | 'finishing' | 'inspection' | 'handover' | 'completed';
  milestones: ProjectMilestone[];
  snagList: SnagItem[];
  handoverChecks: HandoverCheckItem[];
  warranties: { item: string; vendor: string; expiryDate: string; contact: string }[];
}

export interface MaintenanceRequest {
  id: string;
  requestNumber: string;
  userId: string;
  category: 'electrical' | 'plumbing' | 'painting' | 'carpentry' | 'pest_control' | 'tank_cleaning' | 'solar';
  title: string;
  description: string;
  urgency: 'low' | 'standard' | 'urgent';
  preferredDate: string;
  status: 'submitted' | 'assigned' | 'in_progress' | 'completed';
  assignedTechnician?: string;
  technicianName?: string;
  estimatedCost?: number;
  completedAt?: string;
  userRating?: number;
  createdAt: string;
}

export interface AMCPackage {
  id: string;
  title: string;
  pricePerYear: number;
  annualCost?: number;
  includedVisits: number;
  coverage: string[];
  features?: string[];
  emergencyResponseHours: number;
  description: string;
  isPopular?: boolean;
}

// -------------------------------------------------------------
// CROSS-MODULE & GLOBAL ENTITIES
// -------------------------------------------------------------

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'project' | 'budget' | 'maintenance' | 'system';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  category: 'orders' | 'services' | 'billing' | 'property' | 'technical';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    sender: 'user' | 'support_admin';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  module: 'properties' | 'materials' | 'services' | 'equipment' | 'projects' | 'maintenance';
  url: string;
  badge: string;
  price?: number;
}
