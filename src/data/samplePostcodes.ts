import { AddressComponents } from '../types';

export interface DemoPostcodeRecord {
  postcode: string;
  components: AddressComponents;
  description: string;
}

/**
 * Standard Nigerian Digital Postcode Specification (Effective 1 October 2026):
 * 11 Alphanumeric characters:
 * - Positions 1-2: State Code (e.g. LA for Lagos, AB for Abuja FCT, KN for Kano, OY for Oyo, RV for Rivers)
 * - Positions 3-5: Local Government Area / Primary District code (e.g. 101 for Lagos Island, 100 for Ikeja, 900 for Abuja Municipal)
 * - Positions 6-7: Delivery Area / Sub-district code (e.g. 01 for Central, 02 for Commercial)
 * - Positions 8-11: Addressable Building Identifier (e.g. B042, B019, H102)
 *
 * NOTE: Every record here is for demonstration and testing of the "Built on Nigeria's Postcode" showcase.
 */
export const DEMO_POSTCODE_DIRECTORY: Record<string, DemoPostcodeRecord> = {
  'LA10101B042': {
    postcode: 'LA10101B042',
    description: 'Commercial Plaza, Broad Street, Lagos Island',
    components: {
      postcode: 'LA10101B042',
      state: 'Lagos State',
      stateCode: 'LA',
      lga: 'Lagos Island',
      district: 'Marina Commercial District',
      area: 'Broad Street Axis',
      buildingId: 'B042',
      streetName: 'Broad Street',
      buildingName: 'NIPOST House / Marina Annex',
      approxCoordinates: {
        lat: 6.4531,
        lng: 3.3958,
        source: 'official_demo',
      },
    },
  },
  'LA10001B019': {
    postcode: 'LA10001B019',
    description: 'Tech Hub, Otigba Street, Ikeja Computer Village',
    components: {
      postcode: 'LA10001B019',
      state: 'Lagos State',
      stateCode: 'LA',
      lga: 'Ikeja',
      district: 'Computer Village Commercial District',
      area: 'Otigba / Pepple Junction',
      buildingId: 'B019',
      streetName: 'Otigba Street',
      buildingName: 'Silicon Gate Plaza',
      approxCoordinates: {
        lat: 6.5964,
        lng: 3.3421,
        source: 'official_demo',
      },
    },
  },
  'LA10502B088': {
    postcode: 'LA10502B088',
    description: 'Admiralty Way Retail Complex, Lekki Phase 1',
    components: {
      postcode: 'LA10502B088',
      state: 'Lagos State',
      stateCode: 'LA',
      lga: 'Eti-Osa',
      district: 'Lekki Peninsula 1',
      area: 'Admiralty Way Commercial Corridor',
      buildingId: 'B088',
      streetName: 'Admiralty Way',
      buildingName: 'Lekki Heights Square',
      approxCoordinates: {
        lat: 6.4474,
        lng: 3.4731,
        source: 'official_demo',
      },
    },
  },
  'AB90001B008': {
    postcode: 'AB90001B008',
    description: 'Federal Secretariat Complex, Shehu Shagari Way, Abuja',
    components: {
      postcode: 'AB90001B008',
      state: 'Federal Capital Territory',
      stateCode: 'AB',
      lga: 'Abuja Municipal Area Council (AMAC)',
      district: 'Central Business District (CBD)',
      area: 'Shehu Shagari Way Axis',
      buildingId: 'B008',
      streetName: 'Shehu Shagari Way',
      buildingName: 'Federal Secretariat Complex Phase 1',
      approxCoordinates: {
        lat: 9.0579,
        lng: 7.4951,
        source: 'official_demo',
      },
    },
  },
  'AB90103B025': {
    postcode: 'AB90103B025',
    description: 'Adetokunbo Ademola Crescent, Wuse 2, Abuja',
    components: {
      postcode: 'AB90103B025',
      state: 'Federal Capital Territory',
      stateCode: 'AB',
      lga: 'Abuja Municipal Area Council (AMAC)',
      district: 'Wuse 2 District',
      area: 'Adetokunbo Ademola Corridor',
      buildingId: 'B025',
      streetName: 'Adetokunbo Ademola Crescent',
      buildingName: 'Banex Commercial Plaza B',
      approxCoordinates: {
        lat: 9.0765,
        lng: 7.4721,
        source: 'official_demo',
      },
    },
  },
  'KN70001B012': {
    postcode: 'KN70001B012',
    description: 'Kano Kurmi Market Commercial Zone, Kano Municipal',
    components: {
      postcode: 'KN70001B012',
      state: 'Kano State',
      stateCode: 'KN',
      lga: 'Kano Municipal',
      district: 'Old City Commercial District',
      area: 'Kurmi Market Trade Quarter',
      buildingId: 'B012',
      streetName: 'Bayan Asibiti Road',
      buildingName: 'Kasuwa Logistics Terminal 4',
      approxCoordinates: {
        lat: 12.0022,
        lng: 8.5167,
        source: 'official_demo',
      },
    },
  },
  'RV50001B031': {
    postcode: 'RV50001B031',
    description: 'Aba Road Commercial Avenue, Port Harcourt GRA Phase 2',
    components: {
      postcode: 'RV50001B031',
      state: 'Rivers State',
      stateCode: 'RV',
      lga: 'Port Harcourt',
      district: 'Old GRA / Aba Road District',
      area: 'Aba Expressway Node',
      buildingId: 'B031',
      streetName: 'Port Harcourt - Aba Expressway',
      buildingName: 'Oilfields Commercial Court',
      approxCoordinates: {
        lat: 4.8156,
        lng: 7.0498,
        source: 'official_demo',
      },
    },
  },
  'OY20001B015': {
    postcode: 'OY20001B015',
    description: 'Dugbe Business District, Ibadan Northwest',
    components: {
      postcode: 'OY20001B015',
      state: 'Oyo State',
      stateCode: 'OY',
      lga: 'Ibadan Northwest',
      district: 'Dugbe Commercial District',
      area: 'Bank Road / Cocoa House Precinct',
      buildingId: 'B015',
      streetName: 'Bank Road',
      buildingName: 'Cocoa Dome Arcade',
      approxCoordinates: {
        lat: 7.3912,
        lng: 3.8741,
        source: 'official_demo',
      },
    },
  },
};

/**
 * Validates Nigeria's 11-character digital postcode format:
 * - 2 uppercase letters (State code)
 * - 5 digits (LGA & District zone)
 * - 4 alphanumeric characters (Building identifier)
 */
export function validatePostcodeFormat(rawCode: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!rawCode) {
    return { isValid: false, sanitized: '', error: 'Postcode is required' };
  }
  const sanitized = rawCode.trim().toUpperCase().replace(/[\s-]/g, '');
  if (sanitized.length !== 11) {
    return { 
      isValid: false, 
      sanitized, 
      error: `Postcode must be exactly 11 characters (currently ${sanitized.length})` 
    };
  }
  const stateCodeRegex = /^[A-Z]{2}/;
  if (!stateCodeRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'First 2 characters must be the 2-letter State code (e.g. LA, AB, KN)' };
  }
  const districtDigitsRegex = /^[A-Z]{2}\d{5}/;
  if (!districtDigitsRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Characters 3 to 7 must be 5 numeric digits (LGA & District code)' };
  }
  const buildingIdRegex = /^[A-Z]{2}\d{5}[A-Z0-9]{4}$/;
  if (!buildingIdRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Last 4 characters must be alphanumeric building identifier' };
  }

  return { isValid: true, sanitized };
}
