import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Property,
  FloorPlan,
  LocalApprovalGuide,
  Product,
  CartItem,
  MaterialOrder,
  Provider,
  QuotationRequest,
  ServiceBooking,
  Equipment,
  EquipmentRentalBooking,
  SmartHomeTech,
  Expense,
  DemoPaymentTransaction,
  ConstructionProject,
  ProjectMilestone,
  SnagItem,
  HandoverCheckItem,
  MaintenanceRequest,
  AMCPackage,
  InAppNotification,
  SupportTicket,
  GlobalSearchResult,
  Address,
} from '../types';

import {
  initialUsers,
  initialProperties,
  initialFloorPlans,
  initialApprovalGuides,
  initialProducts,
  initialProviders,
  initialEquipment,
  initialSmartHomeTech,
  initialProject,
  initialOrders,
  initialBookings,
  initialRentals,
  initialMaintenanceRequests,
  initialNotifications,
  initialSupportTickets,
  initialExpenses,
  initialAMCPackages,
} from '../data/mockData';

interface AppStoreContextType {
  // Auth & User
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  toggleSavedProperty: (propertyId: string) => void;
  toggleSavedProduct: (productId: string) => void;
  toggleSavedProvider: (providerId: string) => void;

  // Module 1: Properties & Approvals
  properties: Property[];
  floorPlans: FloorPlan[];
  approvalGuides: LocalApprovalGuide[];
  submitPropertyInquiry: (inquiry: { propertyId: string; message: string; requestedDate?: string }) => void;
  updateDueDiligenceStatus: (propertyId: string, itemId: string, status: any, notes?: string) => void;

  // Module 2: Materials & Orders
  products: Product[];
  cart: CartItem[];
  orders: MaterialOrder[];
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createMaterialOrder: (deliveryAddress: Address, paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod') => MaterialOrder;
  updateOrderStatus: (orderId: string, status: MaterialOrder['orderStatus']) => void;

  // Module 3: Professionals & Bookings
  providers: Provider[];
  quotationRequests: QuotationRequest[];
  bookings: ServiceBooking[];
  submitQuotationRequest: (req: {
    providerId: string;
    trade: any;
    projectTitle: string;
    workDescription: string;
    propertyLocation: string;
    estimatedBudget: number;
  }) => void;
  respondToQuotation: (quoteId: string, estimateAmount: number, durationDays: number, notes: string) => void;
  acceptQuotationAndCreateBooking: (quoteId: string, scheduledStartDate: string) => ServiceBooking;
  addWorkLog: (bookingId: string, summary: string, percentDone: number) => void;
  completeBooking: (bookingId: string, review?: { rating: number; comment: string }) => void;

  // Module 4: Equipment & Logistics
  equipmentList: Equipment[];
  rentals: EquipmentRentalBooking[];
  smartHomeList: SmartHomeTech[];
  bookEquipmentRental: (data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    daysCount: number;
    deliveryAddress: Address;
    operatorRequested: boolean;
  }) => EquipmentRentalBooking;
  updateRentalStatus: (rentalId: string, status: EquipmentRentalBooking['status']) => void;

  // Module 5: Finance & Budgets
  expenses: Expense[];
  transactions: DemoPaymentTransaction[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  // Module 6: Projects, Handover & Maintenance
  project: ConstructionProject;
  maintenanceRequests: MaintenanceRequest[];
  amcPackages: AMCPackage[];
  updateMilestoneProgress: (milestoneId: string, progressPercent: number, status: ProjectMilestone['status'], note?: string) => void;
  addSnagItem: (snag: Omit<SnagItem, 'id' | 'reportedDate'>) => void;
  resolveSnagItem: (snagId: string) => void;
  toggleHandoverCheck: (checkId: string, status: 'pass' | 'fail' | 'pending', remarks?: string) => void;
  submitMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>) => MaintenanceRequest;
  subscribeAMC: (packageId: string) => void;

  // Cross-cutting
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (subject: string, category: string, text: string) => void;
  replyToTicket: (ticketId: string, text: string, sender: 'user' | 'support_admin') => void;
  globalSearch: (query: string) => GlobalSearchResult[];
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`buildsphere_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`buildsphere_${key}`, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage('current_user', initialUsers[0])
  );
  const [properties, setProperties] = useState<Property[]>(() =>
    loadFromStorage('properties', initialProperties)
  );
  const [floorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [approvalGuides] = useState<LocalApprovalGuide[]>(initialApprovalGuides);

  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('products', initialProducts)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('cart', [])
  );
  const [orders, setOrders] = useState<MaterialOrder[]>(() =>
    loadFromStorage('orders', initialOrders)
  );

  const [providers] = useState<Provider[]>(initialProviders);
  const [quotationRequests, setQuotationRequests] = useState<QuotationRequest[]>(() =>
    loadFromStorage('quotations', [])
  );
  const [bookings, setBookings] = useState<ServiceBooking[]>(() =>
    loadFromStorage('bookings', initialBookings)
  );

  const [equipmentList] = useState<Equipment[]>(initialEquipment);
  const [rentals, setRentals] = useState<EquipmentRentalBooking[]>(() =>
    loadFromStorage('rentals', initialRentals)
  );
  const [smartHomeList] = useState<SmartHomeTech[]>(initialSmartHomeTech);

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadFromStorage('expenses', initialExpenses)
  );
  const [transactions, setTransactions] = useState<DemoPaymentTransaction[]>(() =>
    loadFromStorage('transactions', [])
  );

  const [project, setProject] = useState<ConstructionProject>(() =>
    loadFromStorage('project', initialProject)
  );
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() =>
    loadFromStorage('maintenance_requests', initialMaintenanceRequests)
  );
  const [amcPackages] = useState<AMCPackage[]>(initialAMCPackages);

  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    loadFromStorage('notifications', initialNotifications)
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadFromStorage('support_tickets', initialSupportTickets)
  );

  // Sync to local storage
  useEffect(() => saveToStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('properties', properties), [properties]);
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('cart', cart), [cart]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('quotations', quotationRequests), [quotationRequests]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('rentals', rentals), [rentals]);
  useEffect(() => saveToStorage('expenses', expenses), [expenses]);
  useEffect(() => saveToStorage('transactions', transactions), [transactions]);
  useEffect(() => saveToStorage('project', project), [project]);
  useEffect(() => saveToStorage('maintenance_requests', maintenanceRequests), [maintenanceRequests]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('support_tickets', supportTickets), [supportTickets]);

  // Auth & Roles
  const switchUserRole = (role: UserRole) => {
    const matched = initialUsers.find((u) => u.role === role) || {
      ...currentUser,
      role,
    };
    setCurrentUser(matched);
    addNotification({
      title: `Switched Persona to ${role.toUpperCase()}`,
      message: `Now viewing BuildSphere from the perspective of a ${role}.`,
      type: 'system',
    });
  };

  const toggleSavedProperty = (propertyId: string) => {
    const exists = currentUser.savedProperties.includes(propertyId);
    const updated = exists
      ? currentUser.savedProperties.filter((id) => id !== propertyId)
      : [...currentUser.savedProperties, propertyId];
    setCurrentUser({ ...currentUser, savedProperties: updated });
  };

  const toggleSavedProduct = (productId: string) => {
    const exists = currentUser.savedProducts.includes(productId);
    const updated = exists
      ? currentUser.savedProducts.filter((id) => id !== productId)
      : [...currentUser.savedProducts, productId];
    setCurrentUser({ ...currentUser, savedProducts: updated });
  };

  const toggleSavedProvider = (providerId: string) => {
    const exists = currentUser.savedProviders.includes(providerId);
    const updated = exists
      ? currentUser.savedProviders.filter((id) => id !== providerId)
      : [...currentUser.savedProviders, providerId];
    setCurrentUser({ ...currentUser, savedProviders: updated });
  };

  // Module 1: Properties
  const submitPropertyInquiry = (inquiry: { propertyId: string; message: string; requestedDate?: string }) => {
    const targetProp = properties.find((p) => p.id === inquiry.propertyId);
    addNotification({
      title: 'Property Inquiry Dispatched',
      message: `Inquiry sent for "${targetProp?.title || 'Selected Property'}". The seller was notified.`,
      type: 'project',
      linkUrl: '/properties',
    });
  };

  const updateDueDiligenceStatus = (propertyId: string, itemId: string, status: any, notes?: string) => {
    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id !== propertyId) return prop;
        return {
          ...prop,
          dueDiligenceItems: prop.dueDiligenceItems.map((item) =>
            item.id === itemId
              ? { ...item, status, notes: notes || item.notes, updatedAt: new Date().toISOString().split('T')[0] }
              : item
          ),
        };
      })
    );
  };

  // Module 2: Materials & Orders
  const addToCart = (productId: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { productId, product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const validQty = product ? Math.min(quantity, product.stock) : quantity;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: validQty } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const createMaterialOrder = (
    deliveryAddress: Address,
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod'
  ): MaterialOrder => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const gstAmount = Math.round(subtotal * 0.18);
    const deliveryFee = subtotal > 50000 ? 0 : 1500;
    const totalAmount = subtotal + gstAmount + deliveryFee;
    const orderNum = `BS-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: MaterialOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        brand: c.product.brand,
        unit: c.product.unit,
        quantity: c.quantity,
        unitPrice: c.product.price,
        totalPrice: c.product.price * c.quantity,
      })),
      subtotal,
      gstAmount,
      deliveryFee,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      orderedAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingHistory: [
        {
          timestamp: new Date().toLocaleString('en-IN'),
          status: 'Order Placed',
          location: 'Hyderabad Logistics Hub',
          note: `Payment verified via ${paymentMethod.toUpperCase()}. Order confirmed with supplier.`,
        },
      ],
      invoiceNumber: `BS-INV-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((c) => c.productId === prod.id);
        if (inCart) {
          return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Log Expense
    addExpense({
      projectId: project.id,
      category: 'structural_materials',
      title: `Material Order ${newOrder.orderNumber} (${newOrder.items.length} items)`,
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: newOrder.invoiceNumber,
      paidTo: 'BuildSphere Verified Suppliers',
      paymentMethod: paymentMethod === 'card' ? 'card' : paymentMethod === 'upi' ? 'upi' : 'bank_transfer',
    });

    // Record demo transaction
    recordDemoTransaction({
      relatedEntity: 'material_order',
      entityId: newOrder.id,
      amount: totalAmount,
      method: paymentMethod,
      status: 'success',
    });

    addNotification({
      title: `Order Confirmed: ${newOrder.orderNumber}`,
      message: `Your materials order for ₹ ${totalAmount.toLocaleString('en-IN')} is placed and assigned for dispatch.`,
      type: 'order',
      linkUrl: '/materials/orders',
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: MaterialOrder['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          orderStatus: status,
          trackingHistory: [
            ...ord.trackingHistory,
            {
              timestamp: new Date().toLocaleString('en-IN'),
              status: `Status updated to ${status.replace('_', ' ').toUpperCase()}`,
              location: 'Regional Site Logistics',
              note: `Consignment status officially moved to ${status}.`,
            },
          ],
        };
      })
    );
  };

  // Module 3: Professionals & Bookings
  const submitQuotationRequest = (req: {
    providerId: string;
    trade: any;
    projectTitle: string;
    workDescription: string;
    propertyLocation: string;
    estimatedBudget: number;
  }) => {
    const provider = providers.find((p) => p.id === req.providerId);
    const newQuote: QuotationRequest = {
      id: `quote-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      providerId: req.providerId,
      providerName: provider?.name || 'Selected Professional',
      trade: req.trade,
      projectTitle: req.projectTitle,
      workDescription: req.workDescription,
      propertyLocation: req.propertyLocation,
      estimatedBudget: req.estimatedBudget,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    setQuotationRequests((prev) => [newQuote, ...prev]);

    addNotification({
      title: 'Quotation Request Sent',
      message: `Quotation requested from ${provider?.name} for "${req.projectTitle}".`,
      type: 'booking',
      linkUrl: '/services/quotations',
    });
  };

  const respondToQuotation = (quoteId: string, estimateAmount: number, durationDays: number, notes: string) => {
    setQuotationRequests((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              status: 'estimate_received',
              estimateAmount,
              estimateDurationDays: durationDays,
              estimateNotes: notes,
              estimateResponseDate: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const acceptQuotationAndCreateBooking = (quoteId: string, scheduledStartDate: string): ServiceBooking => {
    const quote = quotationRequests.find((q) => q.id === quoteId);
    const agreedAmount = quote?.estimateAmount || quote?.estimatedBudget || 25000;

    const newBooking: ServiceBooking = {
      id: `book-${Date.now()}`,
      bookingNumber: `BS-SRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      providerId: quote?.providerId || 'prov-1',
      providerName: quote?.providerName || 'Sri Sai Builders',
      trade: quote?.trade || 'general_contractor',
      projectTitle: quote?.projectTitle || 'Contractor Work Service',
      scheduledStartDate,
      agreedAmount,
      status: 'scheduled',
      workLogs: [
        {
          date: new Date().toISOString().split('T')[0],
          summary: 'Quotation formally accepted. Work execution scheduled.',
          percentageCompleted: 0,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update quotation status
    setQuotationRequests((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' } : q))
    );

    addNotification({
      title: `Booking Confirmed: ${newBooking.bookingNumber}`,
      message: `Work scheduled with ${newBooking.providerName} starting ${scheduledStartDate}.`,
      type: 'booking',
      linkUrl: '/services/bookings',
    });

    return newBooking;
  };

  const addWorkLog = (bookingId: string, summary: string, percentDone: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: percentDone >= 100 ? 'completed' : 'in_progress',
          workLogs: [
            ...b.workLogs,
            {
              date: new Date().toISOString().split('T')[0],
              summary,
              percentageCompleted: percentDone,
            },
          ],
        };
      })
    );
  };

  const completeBooking = (bookingId: string, review?: { rating: number; comment: string }) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'completed',
          userReview: review
            ? {
                rating: review.rating,
                comment: review.comment,
                reviewedAt: new Date().toISOString(),
              }
            : b.userReview,
        };
      })
    );

    addNotification({
      title: 'Service Booking Completed',
      message: 'Service marked complete and verified. Feedback recorded.',
      type: 'booking',
    });
  };

  // Module 4: Equipment Rental
  const bookEquipmentRental = (data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    daysCount: number;
    deliveryAddress: Address;
    operatorRequested: boolean;
  }): EquipmentRentalBooking => {
    const eq = equipmentList.find((e) => e.id === data.equipmentId);
    const totalCost = (eq?.dailyRate || 5000) * data.daysCount;
    const bookingNumber = `BS-RNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRental: EquipmentRentalBooking = {
      id: `rent-${Date.now()}`,
      bookingNumber,
      equipmentId: data.equipmentId,
      equipmentName: eq?.name || 'Heavy Equipment',
      userId: currentUser.id,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: data.daysCount,
      deliveryAddress: data.deliveryAddress,
      totalCost,
      status: 'confirmed',
      operatorRequested: data.operatorRequested,
      createdAt: new Date().toISOString(),
    };

    setRentals((prev) => [newRental, ...prev]);

    addExpense({
      projectId: project.id,
      category: 'equipment_rental',
      title: `${newRental.equipmentName} (${data.daysCount} Days Deployment)`,
      amount: totalCost,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: bookingNumber,
      paidTo: 'BuildSphere Rental Fleet',
      paymentMethod: 'upi',
    });

    addNotification({
      title: `Equipment Rental Booked: ${bookingNumber}`,
      message: `${eq?.name} reserved for ${data.daysCount} days. Site dispatch scheduled.`,
      type: 'order',
      linkUrl: '/equipment',
    });

    return newRental;
  };

  const updateRentalStatus = (rentalId: string, status: EquipmentRentalBooking['status']) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, status } : r))
    );
  };

  // Module 5: Finance & Budgets
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const recordDemoTransaction = (
    trans: Omit<DemoPaymentTransaction, 'id' | 'timestamp' | 'receiptNumber' | 'isSimulatedDemo'>
  ) => {
    const newTx: DemoPaymentTransaction = {
      ...trans,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      receiptNumber: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      isSimulatedDemo: true,
      transactionRef: `TXN-SIM-${Date.now()}`,
      userId: currentUser.id,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Module 6: Projects & Lifecycle
  const updateMilestoneProgress = (
    milestoneId: string,
    progressPercent: number,
    status: ProjectMilestone['status'],
    note?: string
  ) => {
    setProject((prev) => {
      const updatedMilestones = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          progressPercent,
          status,
          completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : m.completedDate,
          notes: note ? [...m.notes, note] : m.notes,
        };
      });

      const totalProgress = Math.round(
        updatedMilestones.reduce((sum, m) => sum + m.progressPercent, 0) / updatedMilestones.length
      );

      return {
        ...prev,
        milestones: updatedMilestones,
        overallProgressPercent: totalProgress,
      };
    });

    addNotification({
      title: 'Milestone Progress Recorded',
      message: `Milestone updated to ${progressPercent}% (${status}). Project completion: updated.`,
      type: 'project',
      linkUrl: '/projects',
    });
  };

  const addSnagItem = (snag: Omit<SnagItem, 'id' | 'reportedDate'>) => {
    const newSnag: SnagItem = {
      ...snag,
      id: `snag-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setProject((prev) => ({
      ...prev,
      snagList: [newSnag, ...prev.snagList],
    }));

    addNotification({
      title: 'Snag Reported to Contractor',
      message: `New quality defect reported: "${snag.title}" assigned to ${snag.assignedTrade}.`,
      type: 'project',
      linkUrl: '/projects/handover',
    });
  };

  const resolveSnagItem = (snagId: string) => {
    setProject((prev) => ({
      ...prev,
      snagList: prev.snagList.map((s) =>
        s.id === snagId
          ? { ...s, status: 'resolved', resolvedDate: new Date().toISOString().split('T')[0] }
          : s
      ),
    }));
  };

  const toggleHandoverCheck = (checkId: string, status: 'pass' | 'fail' | 'pending', remarks?: string) => {
    setProject((prev) => ({
      ...prev,
      handoverChecks: prev.handoverChecks.map((hc) =>
        hc.id === checkId
          ? {
              ...hc,
              status,
              remarks: remarks || hc.remarks,
              testedAt: new Date().toISOString().split('T')[0],
            }
          : hc
      ),
    }));
  };

  const submitMaintenanceRequest = (
    req: Omit<MaintenanceRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>
  ): MaintenanceRequest => {
    const requestNumber = `BS-MNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now()}`,
      requestNumber,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);

    addNotification({
      title: `Maintenance Request Logged: ${requestNumber}`,
      message: `Technician assigned for "${req.title}". Scheduled visit date: ${req.preferredDate}.`,
      type: 'maintenance',
      linkUrl: '/maintenance',
    });

    return newReq;
  };

  const subscribeAMC = (packageId: string) => {
    const pkg = amcPackages.find((p) => p.id === packageId);
    if (!pkg) return;

    recordDemoTransaction({
      relatedEntity: 'amc_subscription',
      entityId: pkg.id,
      amount: pkg.pricePerYear,
      method: 'upi',
      status: 'success',
    });

    addNotification({
      title: `Subscribed to ${pkg.title}`,
      message: `Your annual home care coverage is active. 24/7 breakdown helpline unlocked.`,
      type: 'maintenance',
      linkUrl: '/maintenance',
    });
  };

  // Cross-cutting helpers
  const addNotification = (item: Omit<InAppNotification, 'id' | 'userId' | 'timestamp' | 'read'>) => {
    const newNotif: InAppNotification = {
      ...item,
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const createSupportTicket = (subject: string, category: string, text: string) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `BS-TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      subject,
      category: category as any,
      priority: 'medium',
      status: 'open',
      messages: [
        {
          sender: 'user',
          senderName: currentUser.name,
          text,
          timestamp: new Date().toLocaleString('en-IN'),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    addNotification({
      title: `Support Ticket Created: ${newTicket.ticketNumber}`,
      message: `Our technical advisory team has received your ticket regarding "${subject}".`,
      type: 'system',
      linkUrl: '/support',
    });
  };

  const replyToTicket = (ticketId: string, text: string, sender: 'user' | 'support_admin') => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: sender === 'support_admin' ? 'in_progress' : t.status,
          messages: [
            ...t.messages,
            {
              sender,
              senderName: sender === 'support_admin' ? 'BuildSphere Operations' : currentUser.name,
              text,
              timestamp: new Date().toLocaleString('en-IN'),
            },
          ],
        };
      })
    );
  };

  const globalSearch = (query: string): GlobalSearchResult[] => {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Properties
    for (const p of properties) {
      if (
        p.title.toLowerCase().includes(q) ||
        p.location.locality.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          title: p.title,
          subtitle: `${p.location.locality}, ${p.location.city} • ${p.dimensions}`,
          module: 'properties',
          url: `/properties/${p.id}`,
          badge: p.type.toUpperCase(),
          price: p.price,
        });
      }
    }

    // Materials
    for (const prod of products) {
      if (
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: prod.id,
          title: prod.name,
          subtitle: `${prod.brand} • ${prod.subCategory} • In Stock: ${prod.stock}`,
          module: 'materials',
          url: `/materials/${prod.id}`,
          badge: prod.category.toUpperCase(),
          price: prod.price,
        });
      }
    }

    // Providers
    for (const prov of providers) {
      if (
        prov.name.toLowerCase().includes(q) ||
        prov.trade.toLowerCase().includes(q) ||
        prov.city.toLowerCase().includes(q)
      ) {
        results.push({
          id: prov.id,
          title: prov.name,
          subtitle: `${prov.trade.replace('_', ' ').toUpperCase()} • ${prov.experienceYears} Years Exp • ${prov.city}`,
          module: 'services',
          url: `/services/${prov.id}`,
          badge: 'PROFESSIONAL',
          price: prov.indicativeDailyRate,
        });
      }
    }

    // Equipment
    for (const eq of equipmentList) {
      if (eq.name.toLowerCase().includes(q) || eq.category.toLowerCase().includes(q)) {
        results.push({
          id: eq.id,
          title: eq.name,
          subtitle: `${eq.category.toUpperCase()} • Daily: ₹ ${eq.dailyRate}`,
          module: 'equipment',
          url: '/equipment',
          badge: 'RENTAL FLEET',
          price: eq.dailyRate,
        });
      }
    }

    // Milestones
    for (const ms of project.milestones) {
      if (ms.title.toLowerCase().includes(q) || ms.description.toLowerCase().includes(q)) {
        results.push({
          id: ms.id,
          title: `Milestone ${ms.index}: ${ms.title}`,
          subtitle: `${ms.category.replace('_', ' ').toUpperCase()} • Status: ${ms.status}`,
          module: 'projects',
          url: '/projects',
          badge: `${ms.progressPercent}% DONE`,
        });
      }
    }

    return results.slice(0, 15);
  };

  return (
    <AppStoreContext.Provider
      value={{
        currentUser,
        switchUserRole,
        toggleSavedProperty,
        toggleSavedProduct,
        toggleSavedProvider,
        properties,
        floorPlans,
        approvalGuides,
        submitPropertyInquiry,
        updateDueDiligenceStatus,
        products,
        cart,
        orders,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createMaterialOrder,
        updateOrderStatus,
        providers,
        quotationRequests,
        bookings,
        submitQuotationRequest,
        respondToQuotation,
        acceptQuotationAndCreateBooking,
        addWorkLog,
        completeBooking,
        equipmentList,
        rentals,
        smartHomeList,
        bookEquipmentRental,
        updateRentalStatus,
        expenses,
        transactions,
        addExpense,
        project,
        maintenanceRequests,
        amcPackages,
        updateMilestoneProgress,
        addSnagItem,
        resolveSnagItem,
        toggleHandoverCheck,
        submitMaintenanceRequest,
        subscribeAMC,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        supportTickets,
        createSupportTicket,
        replyToTicket,
        globalSearch,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
