import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ListChecks, 
  ShieldAlert, 
  Layers, 
  Printer, 
  FileText, 
  Building2,
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import { DeliveryOrder, OrderStatus } from '../types';

interface DeliveryIntelligenceProps {
  orders: DeliveryOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onSelectOrder: (order: DeliveryOrder) => void;
}

export const DeliveryIntelligence: React.FC<DeliveryIntelligenceProps> = ({
  orders,
  onUpdateStatus,
  onSelectOrder,
}) => {
  const [selectedLga, setSelectedLga] = useState<string>('all');
  const [checklistCompleted, setChecklistCompleted] = useState<Record<string, boolean>>({});

  // Group orders by Verified LGA
  const lgaGroups = useMemo(() => {
    const map = new Map<string, DeliveryOrder[]>();

    orders.forEach((order) => {
      const lga = order.addressComponents?.lga || 'Unassigned / Needs LGA Verification';
      if (!map.has(lga)) {
        map.set(lga, []);
      }
      map.get(lga)!.push(order);
    });

    return map;
  }, [orders]);

  // Orders lacking valid building postcode (Quarantine)
  const quarantinedOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.postcodeStatus === 'unverified' ||
        o.postcodeStatus === 'lookup_failed' ||
        o.postcodeStatus === 'invalid_format'
    );
  }, [orders]);

  // Ready for dispatch batch
  const readyOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === 'ready_for_dispatch' &&
        (o.postcodeStatus === 'verified_demo' || o.postcodeStatus === 'verified_live')
    );
  }, [orders]);

  const toggleChecklistItem = (id: string) => {
    setChecklistCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Truck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white">Delivery Intelligence</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Organise dispatch batches by verified administrative boundaries and protect couriers from unverified addresses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintManifest}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Dispatch Manifest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict Routing Principle Notice adhering to Prompt Instructions */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block">Logistics Integrity Principle:</strong>
          <p className="text-slate-400 leading-relaxed">
            Orders are grouped strictly by <strong>verified administrative Local Government Area (LGA) and District</strong> boundaries. We do not assume postcode prefix proximity or generate simulated GPS map tracks without verified coordinates. Couriers are assigned to verified municipal territories to prevent cross-city transit delays.
          </p>
        </div>
      </div>

      {/* Top Section: Incomplete Address Quarantine & Ready Batches Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incomplete Address Quarantine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <h3 className="text-sm font-bold text-white">
                  Incomplete Address Quarantine
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {quarantinedOrders.length} Quarantined
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              These parcels lack an official 11-character building postcode. They are held from dispatch to prevent riders wasting fuel searching for subjective landmarks.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {quarantinedOrders.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span>All active orders have verified building postcodes!</span>
                </div>
              ) : (
                quarantinedOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="p-3 rounded-xl bg-slate-950 border border-rose-950/60 hover:border-rose-700/60 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-rose-300">
                        {order.orderReference}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {order.customerName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1">
                      {order.packageDescription}
                    </p>

                    <div className="text-[11px] text-rose-400/90 italic flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {order.deliveryNotes || 'Informal description without building code'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Daily Dispatch Checklist & Batches */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Daily Dispatch Checklist & Courier Handover
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {readyOrders.length} verified parcel(s) ready
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Verify parcel labels and building codes before handing over manifests to motorcycle couriers or dispatch vans.
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {readyOrders.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  <span>No verified orders currently waiting for dispatch.</span>
                </div>
              ) : (
                readyOrders.map((order) => {
                  const isChecked = Boolean(checklistCompleted[order.id]);

                  return (
                    <div
                      key={order.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleChecklistItem(order.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-white">
                              {order.orderReference}
                            </span>
                            <span className="font-mono text-xs text-emerald-400 font-bold">
                              {order.postcode}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {order.customerName} • {order.addressComponents?.lga} ({order.packageWeightKg}kg)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateStatus(order.id, 'dispatched')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
                        >
                          Dispatch
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Grouping by LGA */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Orders Grouped by Verified Local Government Area (LGA)
            </h3>
          </div>

          <span className="text-xs text-slate-400">
            {lgaGroups.size} administrative zone(s) active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from(lgaGroups.entries()).map(([lgaName, groupOrders]) => {
            const verifiedCount = groupOrders.filter(
              (o) => o.postcodeStatus === 'verified_demo' || o.postcodeStatus === 'verified_live'
            ).length;

            return (
              <div
                key={lgaName}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white truncate max-w-[180px]">
                        {lgaName}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {groupOrders.length} parcels
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Building Postcodes Verified:</span>
                    <strong className="text-emerald-400 font-mono">
                      {verifiedCount}/{groupOrders.length}
                    </strong>
                  </div>

                  {/* Orders preview */}
                  <div className="space-y-2 mt-2">
                    {groupOrders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        onClick={() => onSelectOrder(o)}
                        className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-white font-medium">
                            {o.orderReference}
                          </span>
                          <span className="font-mono text-emerald-400 text-[11px]">
                            {o.postcode || 'No code'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {o.customerName} • {o.packageDescription}
                        </p>
                      </div>
                    ))}
                    {groupOrders.length > 3 && (
                      <span className="text-[11px] text-slate-400 text-center block pt-1">
                        + {groupOrders.length - 3} more orders in this LGA
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Batch status:</span>
                  <span className="text-slate-200 font-medium">
                    {verifiedCount === groupOrders.length ? (
                      <span className="text-emerald-400">Ready for LGA Batch Dispatch</span>
                    ) : (
                      <span className="text-amber-400">Has unverified addresses</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
