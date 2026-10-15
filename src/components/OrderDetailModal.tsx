import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Calendar, 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { DeliveryOrder, OrderStatus, FailureReason } from '../types';

interface OrderDetailModalProps {
  order: DeliveryOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, failureReason?: FailureReason, failureNotes?: string) => Promise<void>;
  onNavigateToPostcodeLookup?: (postcode: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onNavigateToPostcodeLookup,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-white">
                {order.orderReference}
              </span>
              {order.isDemoRecord && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  DEMO RECORD
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Created on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Postcode & Address Intelligence Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Postcode & Building Intelligence</span>
              </div>
              {order.postcodeStatus === 'verified_demo' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DEMO VERIFIED
                </span>
              )}
              {order.postcodeStatus === 'verified_live' && (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  LIVE NIPOST VERIFIED
                </span>
              )}
              {order.postcodeStatus === 'unverified' && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  UNVERIFIED / MISSING
                </span>
              )}
            </div>

            {order.postcode ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Official 11-Character Postcode:</span>
                    <span className="font-mono text-base font-bold text-emerald-400">{order.postcode}</span>
                  </div>
                  {onNavigateToPostcodeLookup && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToPostcodeLookup(order.postcode);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Inspect Postcode</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {order.addressComponents && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">State:</span>
                      <strong className="text-white">{order.addressComponents.state}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Local Government Area (LGA):</span>
                      <strong className="text-white">{order.addressComponents.lga}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">District:</span>
                      <span className="text-slate-200">{order.addressComponents.district}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Street / Delivery Axis:</span>
                      <span className="text-slate-200">{order.addressComponents.streetName || order.addressComponents.area}</span>
                    </div>
                    <div className="col-span-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Building & Unit Door:</span>
                      <span className="text-emerald-400 font-medium">
                        {order.addressComponents.buildingName || order.addressComponents.buildingId}
                        {order.unitOrApartment ? ` • ${order.unitOrApartment}` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300 space-y-1">
                <strong>No building postcode recorded:</strong>
                <p>This order relies on informal customer descriptions and is quarantined to prevent courier dispatch failure.</p>
              </div>
            )}
          </div>

          {/* Consignee & Package Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium block">Recipient / Consignee:</span>
              <strong className="text-sm text-white block">{order.customerName}</strong>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] pt-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{order.customerPhone}</span>
              </div>
              <span className="text-[10px] text-slate-400 block italic">
                *Masked according to NDPA 2023 data minimisation guidelines
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium block">Package & Dispatch Priority:</span>
              <span className="text-white font-medium block">{order.packageDescription}</span>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                  {order.packageWeightKg || 1} kg
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 capitalize font-medium">
                  {order.priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Notes */}
          {order.deliveryNotes && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium block">Delivery Instructions / Gate Notes:</span>
              <p className="text-slate-200 leading-relaxed">{order.deliveryNotes}</p>
            </div>
          )}

          {/* Incident / Failure Notes if applicable */}
          {order.status === 'delivery_failed' && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2 text-rose-200">
              <span className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Documented Delivery Failure Cause:</span>
              </span>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Category:</strong> <span className="capitalize">{order.failureReason?.replace(/_/g, ' ')}</span>
                </p>
                {order.failureNotes && (
                  <p className="italic text-rose-200/90">
                    "{order.failureNotes}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Quick Status Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Status:</span>
            <span className="font-semibold text-white uppercase font-mono">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {order.status === 'ready_for_dispatch' && (
              <button
                onClick={async () => {
                  await onUpdateStatus(order.id, 'dispatched');
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
              >
                Mark as Dispatched
              </button>
            )}
            {order.status === 'dispatched' && (
              <button
                onClick={async () => {
                  await onUpdateStatus(order.id, 'delivered');
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm"
              >
                Mark as Delivered
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
