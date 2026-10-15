import { 
  DeliveryOrder, 
  PostcodeLookupResult, 
  AddressAnalysisResult, 
  SystemHealthStatus 
} from '../types';
import { DEMO_POSTCODE_DIRECTORY, validatePostcodeFormat } from '../data/samplePostcodes';
import { SEED_ORDERS } from '../data/seedOrders';

const LOCAL_STORAGE_ORDERS_KEY = 'lastmile_ai_orders_v1';
const LOCAL_STORAGE_HISTORY_KEY = 'lastmile_ai_postcode_history_v1';

// Safe localStorage helper
function getLocalOrders(): DeliveryOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using in-memory seed:', e);
  }
  return [...SEED_ORDERS];
}

function saveLocalOrders(orders: DeliveryOrder[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }
}

export async function getSystemHealth(): Promise<SystemHealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Graceful client fallback
  }

  return {
    nipostApi: {
      status: 'mock_demo',
      apiUrl: 'https://api.nipost.gov.ng/v1/postcodes (unconfigured)',
      hasCredentials: false,
    },
    geminiAi: {
      status: 'ready',
      model: 'gemini-3.8-flash',
      hasApiKey: false,
    },
    storage: {
      type: 'in_memory_and_local',
      recordCount: getLocalOrders().length,
    },
    appMode: 'demonstration',
    version: '1.0.0-pilot.2026',
    localTime: new Date().toISOString(),
  };
}

export async function lookupPostcode(postcode: string): Promise<PostcodeLookupResult> {
  const validation = validatePostcodeFormat(postcode);
  if (!validation.isValid) {
    return {
      postcode: validation.sanitized,
      isValidFormat: false,
      isLiveVerified: false,
      isDemonstration: true,
      status: 'invalid_format',
      message: validation.error || 'Invalid 11-character postcode format.',
      lookupTimestamp: new Date().toISOString(),
    };
  }

  const clean = validation.sanitized;

  try {
    const res = await fetch('/api/postcode/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcode: clean }),
    });

    if (res.ok) {
      const data: PostcodeLookupResult = await res.json();
      saveLookupToHistory(data);
      return data;
    }
  } catch (err) {
    // fallback to client-side demo directory
  }

  // Client demo fallback if server endpoint is unreachable
  const demo = DEMO_POSTCODE_DIRECTORY[clean];
  const fallbackResult: PostcodeLookupResult = {
    postcode: clean,
    isValidFormat: true,
    isLiveVerified: false,
    isDemonstration: true,
    status: 'success',
    message: 'Live postcode verification is not configured. You can explore the demonstration interface, but this result has not been verified against NIPOST.',
    components: demo ? demo.components : {
      postcode: clean,
      state: 'Lagos State',
      stateCode: clean.slice(0, 2),
      lga: `LGA Code ${clean.slice(2, 5)}`,
      district: `District ${clean.slice(5, 7)}`,
      area: 'Area Corridor',
      buildingId: clean.slice(7, 11),
      streetName: 'Address details pending live NIPOST query',
      buildingName: `Building Ref ${clean.slice(7, 11)}`,
    },
    lookupTimestamp: new Date().toISOString(),
    rawApiRef: `CLIENT-DEMO-${clean}`,
  };

  saveLookupToHistory(fallbackResult);
  return fallbackResult;
}

export function getLookupHistory(): PostcodeLookupResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [];
}

export function saveLookupToHistory(result: PostcodeLookupResult) {
  try {
    const current = getLookupHistory();
    // Prepend and keep last 10 unique
    const filtered = current.filter(r => r.postcode !== result.postcode);
    const updated = [result, ...filtered].slice(0, 10);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export function clearLookupHistory() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  } catch (e) {
    // ignore
  }
}

export async function analyzeAddress(freeTextAddress: string, context?: string): Promise<AddressAnalysisResult> {
  try {
    const res = await fetch('/api/ai/address-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freeTextAddress, context }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Network call to address assistant failed, using deterministic local engine:', err);
  }

  // Local deterministic fallback
  const lower = freeTextAddress.toLowerCase();
  const hasState = /lagos|abuja|fct|kano|rivers|ibadan|oyo|enugu|kaduna/.test(lower);
  const hasLgaOrArea = /ikeja|lekki|yaba|island|victoria|wuse|maitama|dugbe|gra|kurmi|surulere/.test(lower);
  const hasBuildingNum = /\b\d{1,4}[a-z]?\b|\bblock\s*\d+|\bplot\s*\d+|\bsuite\s*\d+/i.test(lower);

  const missing: string[] = [];
  if (!hasState) missing.push('State of Nigeria');
  if (!hasLgaOrArea) missing.push('Local Government Area (LGA) or Major Commercial District');
  if (!hasBuildingNum) missing.push('Specific Building / Plot Number');
  missing.push('Official 11-Character Building Postcode (NIPOST)');

  return {
    rawInput: freeTextAddress,
    completenessScore: hasState && hasLgaOrArea && hasBuildingNum ? 70 : 40,
    missingComponents: missing,
    identifiedComponents: {
      state: hasState ? 'Detected State' : undefined,
      lga: hasLgaOrArea ? 'Detected District' : undefined,
      landmark: freeTextAddress,
    },
    risksForCouriers: [
      'Landmark ambiguity: Descriptive landmarks create high failure rates during night deliveries and driver changes.',
      'Rider delay: Couriers spend an average of 15 to 35 minutes calling customers to navigate subjective directions.',
    ],
    suggestedAction: 'Request the recipient provide their 11-character building postcode before assigning this order to a rider.',
    structuredDraft: {
      state: hasState ? 'Nigeria' : 'Unspecified',
      lga: hasLgaOrArea ? 'Detected Area' : 'Unspecified',
      district: 'Unspecified',
      street: hasBuildingNum ? 'Detected Street / Number' : 'Descriptive Landmark Route',
      landmarkReference: freeTextAddress,
      recommendedPostcodeInquiry: 'Kindly send your 11-character NIPOST building postcode so our courier can locate your exact gate without phone calls.',
    },
    source: 'rule_engine',
  };
}

export async function fetchOperationsInsights(orders: DeliveryOrder[]) {
  try {
    const res = await fetch('/api/ai/operations-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fallback computed client-side
  }

  // Deterministic client-side calculations
  const total = orders.length;
  const completed = orders.filter(o => o.status === 'delivered').length;
  const failed = orders.filter(o => o.status === 'delivery_failed').length;
  const verified = orders.filter(o => o.postcodeStatus === 'verified_demo' || o.postcodeStatus === 'verified_live');
  const unverified = orders.filter(o => o.postcodeStatus !== 'verified_demo' && o.postcodeStatus !== 'verified_live');

  const verifiedConcluded = verified.filter(o => o.status === 'delivered' || o.status === 'delivery_failed');
  const verifiedDelivered = verified.filter(o => o.status === 'delivered').length;
  const verifiedRate = verifiedConcluded.length > 0 ? Math.round((verifiedDelivered / verifiedConcluded.length) * 100) : 0;

  const unverifiedConcluded = unverified.filter(o => o.status === 'delivered' || o.status === 'delivery_failed');
  const unverifiedDelivered = unverified.filter(o => o.status === 'delivered').length;
  const unverifiedRate = unverifiedConcluded.length > 0 ? Math.round((unverifiedDelivered / unverifiedConcluded.length) * 100) : 0;

  const failureReasonCounts: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status === 'delivery_failed' && o.failureReason) {
      failureReasonCounts[o.failureReason] = (failureReasonCounts[o.failureReason] || 0) + 1;
    }
  });

  return {
    metrics: {
      sampleSize: total,
      totalOrders: total,
      deliveredCount: completed,
      failedCount: failed,
      inTransitCount: orders.filter(o => o.status === 'dispatched').length,
      readyForDispatchCount: orders.filter(o => o.status === 'ready_for_dispatch').length,
      pendingValidationCount: orders.filter(o => o.status === 'pending_validation').length,
      firstAttemptSuccessRate: (completed + failed) > 0 ? Math.round((completed / (completed + failed)) * 100) : 0,
      verifiedOrdersCount: verified.length,
      unverifiedOrdersCount: unverified.length,
      verifiedSuccessRate: verifiedRate,
      unverifiedSuccessRate: unverifiedRate,
      failureReasonCounts,
      dataNotice: `Calculations are deterministically derived from ${total} recorded delivery orders.`,
    },
    aiAnalysis: {
      summary: `In this store dataset, deliveries with verified 11-character postcodes achieved an estimated ${verifiedRate}% success rate, versus ${unverifiedRate}% for unverified or descriptive directions.`,
      keyObservations: [
        `Ambiguous landmarks and missing building identifiers represent the highest risk factor for delivery abandonment.`,
        `Orders quarantined prior to dispatch eliminate unnecessary rider fuel consumption.`,
      ],
      recommendations: [
        'Enforce 11-character building postcode validation at merchant checkout.',
        'Prioritize dispatch batches by verified LGA rather than arbitrary driver assumptions.',
      ],
      sampleSizeExplanation: `Analysis computed deterministically from ${total} recorded orders.`,
    },
  };
}

export async function fetchOrders(): Promise<DeliveryOrder[]> {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      saveLocalOrders(data);
      return data;
    }
  } catch (err) {
    // fallback to localStorage
  }
  return getLocalOrders();
}

export async function createOrder(orderData: Partial<DeliveryOrder>): Promise<DeliveryOrder> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      const newOrder = await res.json();
      const current = getLocalOrders();
      saveLocalOrders([newOrder, ...current]);
      return newOrder;
    }
  } catch (err) {
    // fallback
  }

  // Local fallback
  const newOrder: DeliveryOrder = {
    id: `ord-${Date.now().toString(36)}`,
    orderReference: orderData.orderReference || `LMA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: orderData.customerName || 'Customer',
    customerPhone: orderData.customerPhone || '+234 •••',
    packageDescription: orderData.packageDescription || 'Merchandise Box',
    packageWeightKg: orderData.packageWeightKg || 1.0,
    postcode: orderData.postcode || '',
    postcodeStatus: orderData.postcodeStatus || 'unverified',
    addressComponents: orderData.addressComponents,
    unitOrApartment: orderData.unitOrApartment,
    deliveryNotes: orderData.deliveryNotes,
    priority: orderData.priority || 'standard',
    status: orderData.status || 'ready_for_dispatch',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemoRecord: false,
  };

  const current = getLocalOrders();
  saveLocalOrders([newOrder, ...current]);
  return newOrder;
}

export async function updateOrder(id: string, updates: Partial<DeliveryOrder>): Promise<DeliveryOrder | null> {
  try {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalOrders().map(o => o.id === id ? updated : o);
      saveLocalOrders(current);
      return updated;
    }
  } catch (err) {
    // fallback
  }

  const current = getLocalOrders();
  const existing = current.find(o => o.id === id);
  if (!existing) return null;

  const updated: DeliveryOrder = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.status === 'dispatched' && !existing.dispatchedAt) {
    updated.dispatchedAt = new Date().toISOString();
  }
  if (updates.status === 'delivered') {
    updated.deliveredAt = new Date().toISOString();
  }
  if (updates.status === 'delivery_failed') {
    updated.failedAt = new Date().toISOString();
  }

  saveLocalOrders(current.map(o => o.id === id ? updated : o));
  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalOrders().filter(o => o.id !== id);
      saveLocalOrders(current);
      return true;
    }
  } catch (err) {
    // fallback
  }

  const current = getLocalOrders().filter(o => o.id !== id);
  saveLocalOrders(current);
  return true;
}

export async function resetDemoOrders(): Promise<DeliveryOrder[]> {
  try {
    const res = await fetch('/api/orders/reset-demo', { method: 'POST' });
    if (res.ok) {
      saveLocalOrders(SEED_ORDERS);
      return [...SEED_ORDERS];
    }
  } catch (err) {
    // fallback
  }
  saveLocalOrders(SEED_ORDERS);
  return [...SEED_ORDERS];
}
