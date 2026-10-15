export type OrderStatus = 'pending_validation' | 'ready_for_dispatch' | 'dispatched' | 'delivered' | 'delivery_failed';

export type PostcodeValidationStatus = 'verified_live' | 'verified_demo' | 'invalid_format' | 'unverified' | 'lookup_failed';

export type FailureReason = 
  | 'building_not_found'
  | 'ambiguous_landmark'
  | 'customer_unreachable'
  | 'road_impassable'
  | 'customer_cancelled'
  | 'incorrect_postcode'
  | 'access_restricted';

export interface AddressComponents {
  postcode: string;
  state: string;
  stateCode: string;
  lga: string; // Local Government Area
  district: string;
  area: string;
  buildingId: string;
  streetName?: string;
  buildingName?: string;
  approxCoordinates?: {
    lat: number;
    lng: number;
    source: 'official_demo' | 'live_api';
  };
}

export interface PostcodeLookupResult {
  postcode: string;
  isValidFormat: boolean;
  isLiveVerified: boolean;
  isDemonstration: boolean;
  status: 'success' | 'not_found' | 'invalid_format' | 'unconfigured' | 'error';
  message: string;
  components?: AddressComponents;
  lookupTimestamp: string;
  rawApiRef?: string;
}

export interface DeliveryOrder {
  id: string;
  orderReference: string;
  customerName: string;
  customerPhone: string; // masked in demo
  packageDescription: string;
  packageWeightKg?: number;
  postcode: string;
  postcodeStatus: PostcodeValidationStatus;
  addressComponents?: AddressComponents;
  unitOrApartment?: string;
  deliveryNotes?: string;
  priority: 'standard' | 'next_day' | 'express';
  status: OrderStatus;
  failureReason?: FailureReason;
  failureNotes?: string;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  isDemoRecord: boolean;
}

export interface AddressAnalysisRequest {
  freeTextAddress: string;
  context?: string;
}

export interface AddressAnalysisResult {
  rawInput: string;
  completenessScore: number; // 0 - 100
  missingComponents: string[];
  identifiedComponents: {
    state?: string;
    lga?: string;
    area?: string;
    landmark?: string;
    street?: string;
    buildingNumber?: string;
  };
  risksForCouriers: string[];
  suggestedAction: string;
  structuredDraft: {
    state: string;
    lga: string;
    district: string;
    street: string;
    landmarkReference: string;
    recommendedPostcodeInquiry: string;
  };
  source: 'gemini' | 'rule_engine';
}

export interface SystemHealthStatus {
  nipostApi: {
    status: 'configured' | 'unconfigured' | 'mock_demo';
    apiUrl: string;
    hasCredentials: boolean;
    lastPingMs?: number;
  };
  geminiAi: {
    status: 'ready' | 'unconfigured' | 'error';
    model: string;
    hasApiKey: boolean;
  };
  storage: {
    type: 'in_memory_and_local';
    recordCount: number;
  };
  appMode: 'demonstration' | 'configured_production';
  version: string;
  localTime: string;
}
