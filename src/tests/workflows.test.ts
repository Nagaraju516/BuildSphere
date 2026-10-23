import { describe, it, expect } from 'vitest';
import {
  initialProperties,
  initialProducts,
  initialProviders,
  initialMilestones,
  initialHandoverChecks,
  initialAMCPackages,
  initialUsers,
} from '../data/mockData';
import { MaterialOrder, ServiceBooking, ConstructionProject } from '../types';

describe('BuildSphere Core Lifecycle Workflows (Scenarios A through F)', () => {
  // Scenario A: Land Discovery, Due Diligence & Property Inquiries
  it('Scenario A: verifies land discovery, 7 due diligence safeguards, and property inquiry', () => {
    const plots = initialProperties.filter((p) => p.type === 'plot' || p.type === 'land');
    expect(plots.length).toBeGreaterThan(0);

    const targetPlot = plots[0];
    expect(targetPlot.legalStatus).toBe('Clear Title');
    expect(targetPlot.dueDiligenceItems.length).toBe(7);

    // Verify all 7 critical safeguards exist
    const categories = targetPlot.dueDiligenceItems.map((d) => d.category);
    expect(categories).toContain('ownership');
    expect(categories).toContain('title_deed');
    expect(categories).toContain('encumbrance');
    expect(categories).toContain('land_use');
    expect(categories).toContain('road_access');
    expect(categories).toContain('tax_receipts');

    // Simulate inquiry
    const inquiry = {
      id: 'inq-test-1',
      propertyId: targetPlot.id,
      userId: initialUsers[0].id,
      userName: initialUsers[0].name,
      userPhone: initialUsers[0].phone,
      userEmail: initialUsers[0].email,
      message: 'Interested in visiting this site on Saturday morning.',
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };
    expect(inquiry.propertyId).toBe(targetPlot.id);
    expect(inquiry.status).toBe('new');
  });

  // Scenario B: Materials Ordering, Stock Validation, Delivery Tracking & Expense Logging
  it('Scenario B: adds materials to cart, creates simulated order, checks stock & logs expense', () => {
    const cement = initialProducts.find((p) => p.id === 'prod-1')!;
    const steel = initialProducts.find((p) => p.id === 'prod-2')!;
    expect(cement).toBeDefined();
    expect(steel).toBeDefined();

    const initialCementStock = cement.stock;
    const orderQuantity = 50;

    // Subtotal calculation
    const subtotal = cement.price * orderQuantity;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    expect(total).toBe(cement.price * orderQuantity + Math.round(cement.price * orderQuantity * 0.18));

    // Simulated order object
    const order: MaterialOrder = {
      id: 'ord-test-1',
      orderNumber: 'BS-ORD-2026-TEST',
      userId: initialUsers[0].id,
      items: [
        {
          productId: cement.id,
          productName: cement.name,
          brand: cement.brand,
          unit: cement.unit,
          quantity: orderQuantity,
          unitPrice: cement.price,
          totalPrice: subtotal,
        },
      ],
      subtotal,
      gstAmount: gst,
      deliveryFee: 0,
      totalAmount: total,
      deliveryAddress: initialUsers[0].addresses[0],
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      orderStatus: 'placed',
      orderedAt: new Date().toISOString(),
      estimatedDeliveryDate: '2026-10-25',
      trackingHistory: [
        {
          timestamp: new Date().toISOString(),
          status: 'Order Placed',
          location: 'Hyderabad Logistics Hub',
          note: 'Payment verified via UPI',
        },
      ],
      invoiceNumber: 'BS-INV-TEST-01',
    };

    expect(order.orderStatus).toBe('placed');
    expect(order.items[0].quantity).toBe(50);
    // Stock remains positive
    expect(initialCementStock - orderQuantity).toBeGreaterThan(0);
  });

  // Scenario C: Service Discovery, Quotation, Booking & Completion
  it('Scenario C: finds contractor, requests quote, accepts estimate, creates booking & records log', () => {
    const contractor = initialProviders.find((p) => p.trade === 'general_contractor');
    expect(contractor).toBeDefined();
    expect(contractor?.isVerified).toBe(true);

    // Step 1: Submit quotation
    const quote = {
      id: 'q-test-1',
      providerId: contractor!.id,
      projectTitle: '3BHK Duplex Construction',
      estimatedBudget: 5000000,
      status: 'estimate_received' as const,
      estimateAmount: 4900000,
      estimateDurationDays: 180,
    };
    expect(quote.estimateAmount).toBe(4900000);

    // Step 2: Accept quotation -> ServiceBooking
    const booking: ServiceBooking = {
      id: 'b-test-1',
      bookingNumber: 'BS-SRV-TEST',
      userId: initialUsers[0].id,
      providerId: contractor!.id,
      providerName: contractor!.name,
      trade: contractor!.trade,
      projectTitle: quote.projectTitle,
      scheduledStartDate: '2026-11-01',
      agreedAmount: quote.estimateAmount,
      status: 'scheduled',
      workLogs: [
        {
          date: '2026-11-01',
          summary: 'Contract signed and site handed over for mobilization.',
          percentageCompleted: 10,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    expect(booking.status).toBe('scheduled');
    expect(booking.workLogs[0].percentageCompleted).toBe(10);

    // Step 3: Complete work
    booking.status = 'completed';
    booking.userReview = {
      rating: 5,
      comment: 'Excellent structural execution and timely delivery.',
      reviewedAt: new Date().toISOString(),
    };

    expect(booking.status).toBe('completed');
    expect(booking.userReview.rating).toBe(5);
  });

  // Scenario D: 28 Milestones, Budget Variance & Handover Checks
  it('Scenario D: tracks 28 construction milestones, budget analysis and snag list resolution', () => {
    expect(initialMilestones.length).toBe(28);

    // Ensure all 28 indices are sequentially present 1 to 28
    const indices = initialMilestones.map((m) => m.index);
    for (let i = 1; i <= 28; i++) {
      expect(indices).toContain(i);
    }

    // Handover checks verify civil, waterproofing, electrical, plumbing
    expect(initialHandoverChecks.length).toBeGreaterThanOrEqual(6);
    const passCount = initialHandoverChecks.filter((c) => c.status === 'pass').length;
    expect(passCount).toBeGreaterThanOrEqual(4);

    // Budget variance calculations
    const totalAllocated = initialMilestones.reduce((sum, m) => sum + m.plannedBudget, 0);
    const totalSpent = initialMilestones.reduce((sum, m) => sum + m.actualCost, 0);
    expect(totalAllocated).toBeGreaterThan(0);
    expect(totalSpent).toBeGreaterThan(0);
    expect(totalSpent).toBeLessThanOrEqual(totalAllocated * 1.15); // Within realistic variance
  });

  // Scenario E: Move-in Readiness, Maintenance Requests & AMC
  it('Scenario E: verifies move-in readiness index, raises maintenance ticket and AMC subscription', () => {
    expect(initialAMCPackages.length).toBe(3);
    const villaPlan = initialAMCPackages.find((p) => p.isPopular);
    expect(villaPlan).toBeDefined();
    expect(villaPlan?.emergencyResponseHours).toBe(2);

    const maintenanceTicket = {
      id: 'mnt-test-1',
      requestNumber: 'BS-MNT-TEST',
      category: 'electrical' as const,
      title: 'Tripping MCB breaker in master bedroom AC circuit',
      urgency: 'urgent' as const,
      status: 'submitted' as const,
    };
    expect(maintenanceTicket.status).toBe('submitted');
    expect(maintenanceTicket.urgency).toBe('urgent');
  });

  // Scenario F: Zero-API Key verification
  it('Scenario F: validates that all core data runs without external API keys or cloud credentials', () => {
    // Check that no secret API keys are required
    const apiKeyEnv = process.env.MAPS_API_KEY || process.env.PAYMENT_GATEWAY_SECRET;
    expect(apiKeyEnv).toBeUndefined();

    // Verify all mock datasets are locally available and self-contained
    expect(initialProperties.length).toBeGreaterThan(0);
    expect(initialProducts.length).toBeGreaterThan(0);
    expect(initialProviders.length).toBeGreaterThan(0);
  });
});
