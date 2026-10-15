import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Package, 
  Phone, 
  User, 
  Building2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { DeliveryOrder, AddressComponents, PostcodeValidationStatus, OrderStatus } from '../types';
import { lookupPostcode } from '../services/apiClient';
import { validatePostcodeFormat } from '../data/samplePostcodes';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: Partial<DeliveryOrder>) => Promise<void>;
  initialDraft?: {
    state?: string;
    lga?: string;
    street?: string;
    landmarkReference?: string;
  };
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDraft,
}) => {
  if (!isOpen) return null;

  const [orderReference, setOrderReference] = useState(
    `LMA-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+234 ');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageWeightKg, setPackageWeightKg] = useState('1.5');
  const [postcode, setPostcode] = useState('');
  const [unitOrApartment, setUnitOrApartment] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState(initialDraft?.landmarkReference || '');
  const [priority, setPriority] = useState<'standard' | 'next_day' | 'express'>('next_day');

  // Address lookup state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedComponents, setVerifiedComponents] = useState<AddressComponents | null>(null);
  const [postcodeStatus, setPostcodeStatus] = useState<PostcodeValidationStatus>('unverified');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyPostcode = async () => {
    if (!postcode.trim()) {
      setErrors((prev) => ({ ...prev, postcode: 'Please enter a postcode to verify' }));
      return;
    }

    const val = validatePostcodeFormat(postcode);
    if (!val.isValid) {
      setErrors((prev) => ({ ...prev, postcode: val.error || 'Invalid 11-character postcode' }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.postcode;
      return copy;
    });

    setIsVerifying(true);
    setLookupMessage(null);

    try {
      const res = await lookupPostcode(val.sanitized);
      if (res.components) {
        setVerifiedComponents(res.components);
        setPostcodeStatus(res.isLiveVerified ? 'verified_live' : 'verified_demo');
        setLookupMessage(res.message);
      } else {
        setPostcodeStatus('lookup_failed');
        setLookupMessage(res.message);
      }
    } catch (err: any) {
      setPostcodeStatus('lookup_failed');
      setLookupMessage('Failed to connect to verification service.');
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required';
    if (!packageDescription.trim()) errs.packageDescription = 'Package description is required';
    if (postcode && postcode.trim().length !== 11) {
      errs.postcode = 'Postcode must be exactly 11 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const status: OrderStatus = postcode && verifiedComponents 
        ? 'ready_for_dispatch' 
        : 'pending_validation';

      await onSubmit({
        orderReference,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        packageDescription: packageDescription.trim(),
        packageWeightKg: parseFloat(packageWeightKg) || 1.0,
        postcode: postcode.trim().toUpperCase(),
        postcodeStatus,
        addressComponents: verifiedComponents || undefined,
        unitOrApartment: unitOrApartment.trim(),
        deliveryNotes: deliveryNotes.trim(),
        priority,
        status,
        isDemoRecord: false,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Delivery Order</h2>
              <p className="text-xs text-slate-400">
                Log order with building-level postcode verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {/* Reference & Recipient Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Order Reference:
              </label>
              <input
                type="text"
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient / Customer Name: *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Adeola Adeleke"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.customerName && (
                <span className="text-rose-400 text-[11px] block mt-1">{errors.customerName}</span>
              )}
            </div>
          </div>

          {/* Contact & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Customer Phone / WhatsApp:
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Data minimisation: Strictly for delivery handover
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dispatch Priority:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="standard">Standard Dispatch (24-48 hrs)</option>
                <option value="next_day">Next Day Priority</option>
                <option value="express">Same-Day Express</option>
              </select>
            </div>
          </div>

          {/* Package Description & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Package / Item Description: *
              </label>
              <input
                type="text"
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="e.g. Solar Inverter Replacement Board"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.packageDescription && (
                <span className="text-rose-400 text-[11px] block mt-1">{errors.packageDescription}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weight (Kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={packageWeightKg}
                onChange={(e) => setPackageWeightKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Postcode Validation Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-emerald-400">
                Official 11-Character Building Postcode (NIPOST):
              </label>
              <span className="text-[10px] text-slate-400">
                Format: 2-State | 5-District | 4-Building
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={11}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder="e.g. LA10001B019"
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono uppercase tracking-wider text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleVerifyPostcode}
                disabled={isVerifying || !postcode.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                {isVerifying ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Verify</span>
              </button>
            </div>

            {/* Quick Helper Button to test sample code */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Quick fill test:</span>
              <button
                type="button"
                onClick={() => {
                  setPostcode('LA10001B019');
                  setTimeout(() => handleVerifyPostcode(), 100);
                }}
                className="text-emerald-400 hover:underline font-mono"
              >
                LA10001B019 (Ikeja)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setPostcode('AB90001B008');
                  setTimeout(() => handleVerifyPostcode(), 100);
                }}
                className="text-emerald-400 hover:underline font-mono"
              >
                AB90001B008 (Abuja)
              </button>
            </div>

            {errors.postcode && (
              <span className="text-rose-400 text-[11px] block">{errors.postcode}</span>
            )}

            {/* Verification Result Feedback */}
            {lookupMessage && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300/90 leading-snug">
                {lookupMessage}
              </div>
            )}

            {/* Returned Address Components preview */}
            {verifiedComponents && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400 block">State:</span>
                  <strong className="text-white">{verifiedComponents.state}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">LGA:</span>
                  <strong className="text-white">{verifiedComponents.lga}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Building & District:</span>
                  <strong className="text-emerald-400">
                    {verifiedComponents.buildingName || verifiedComponents.buildingId} ({verifiedComponents.district})
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Unit / Door & Landmark Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit / Suite / Apartment / Floor:
              </label>
              <input
                type="text"
                value={unitOrApartment}
                onChange={(e) => setUnitOrApartment(e.target.value)}
                placeholder="e.g. Suite 3B, 2nd Floor"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gate Instructions / Delivery Notes:
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Ring buzzer at security gate, call on arrival"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* NDPA & Privacy Assurance */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>NDPA 2023 Compliance:</strong> Orders are stored locally and in the isolated app memory for demonstration purposes. We do not transmit customer phone numbers to third parties.
            </p>
          </div>

          {/* Footer Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all"
            >
              {isSubmitting ? 'Recording Order...' : 'Create & Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
