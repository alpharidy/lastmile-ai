import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  XCircle, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  FileDown, 
  RotateCcw, 
  Plus, 
  ExternalLink,
  Building2,
  Phone,
  Package,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { DeliveryOrder, OrderStatus, PostcodeValidationStatus, FailureReason } from '../types';

interface MerchantDashboardProps {
  orders: DeliveryOrder[];
  onOpenCreateOrder: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, failureReason?: FailureReason, failureNotes?: string) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onResetDemoData: () => Promise<void>;
  onSelectOrderForDetail: (order: DeliveryOrder) => void;
  isDemoData: boolean;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  orders,
  onOpenCreateOrder,
  onUpdateStatus,
  onDeleteOrder,
  onResetDemoData,
  onSelectOrderForDetail,
  isDemoData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [validationFilter, setValidationFilter] = useState<string>('all');
  const [lgaFilter, setLgaFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Status update modal state
  const [actionOrder, setActionOrder] = useState<DeliveryOrder | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [failureReason, setFailureReason] = useState<FailureReason>('ambiguous_landmark');
  const [failureNotes, setFailureNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate distinct LGAs for filtering
  const distinctLgas = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.addressComponents?.lga) {
        set.add(o.addressComponents.lga);
      }
    });
    return Array.from(set);
  }, [orders]);

  // Deterministic KPI calculations
  const totalOrders = orders.length;
  const awaitingDispatch = orders.filter((o) => o.status === 'ready_for_dispatch').length;
  const pendingValidation = orders.filter((o) => o.status === 'pending_validation').length;
  const inTransit = orders.filter((o) => o.status === 'dispatched').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const failed = orders.filter((o) => o.status === 'delivery_failed').length;
  
  const validatedPostcodes = orders.filter(
    (o) => o.postcodeStatus === 'verified_demo' || o.postcodeStatus === 'verified_live'
  ).length;

  const requiresCorrection = orders.filter(
    (o) => o.postcodeStatus === 'unverified' || o.postcodeStatus === 'lookup_failed' || o.postcodeStatus === 'invalid_format'
  ).length;

  const completedCount = delivered + failed;
  const firstAttemptSuccessRate = completedCount > 0 ? Math.round((delivered / completedCount) * 100) : 0;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.packageDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchValidation = validationFilter === 'all' || order.postcodeStatus === validationFilter;
      const matchLga = lgaFilter === 'all' || order.addressComponents?.lga === lgaFilter;

      return matchSearch && matchStatus && matchValidation && matchLga;
    });
  }, [orders, searchTerm, statusFilter, validationFilter, lgaFilter]);

  const handleOpenStatusModal = (order: DeliveryOrder, newStatus: OrderStatus) => {
    setActionOrder(order);
    setTargetStatus(newStatus);
    setFailureReason('ambiguous_landmark');
    setFailureNotes('');
  };

  const handleConfirmStatusChange = async () => {
    if (!actionOrder || !targetStatus) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(
        actionOrder.id,
        targetStatus,
        targetStatus === 'delivery_failed' ? failureReason : undefined,
        targetStatus === 'delivery_failed' ? failureNotes : undefined
      );
      setActionOrder(null);
      setTargetStatus(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Persistent DEMO DATA indicator */}
      {isDemoData && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              DEMO DATA
            </span>
            <span>
              Currently viewing representative sample orders for Nigerian commerce demonstrations. Metrics are calculated deterministically from these records.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDemoData}
              className="text-xs text-amber-200 hover:text-white underline font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sample Records</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white">Merchant Delivery Dashboard</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track customer building postcodes, dispatch readiness, and delivery outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateOrder}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Delivery Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Total Orders</span>
          <span className="text-2xl font-extrabold text-white font-mono block mt-1">
            {totalOrders}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Store registry</span>
        </div>

        {/* Awaiting Dispatch */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Ready to Dispatch</span>
          <span className="text-2xl font-extrabold text-blue-400 font-mono block mt-1">
            {awaitingDispatch}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Packaged & verified</span>
        </div>

        {/* Validated Postcodes */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Validated Codes</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono block mt-1">
            {validatedPostcodes}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Building-level</span>
        </div>

        {/* Needs Correction */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Needs Correction</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono block mt-1">
            {requiresCorrection}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Missing 11-char code</span>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Delivered</span>
          <span className="text-2xl font-extrabold text-teal-400 font-mono block mt-1">
            {delivered}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Concluded orders</span>
        </div>

        {/* Success Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">1st Attempt Rate</span>
          <span className="text-2xl font-extrabold text-purple-400 font-mono block mt-1">
            {firstAttemptSuccessRate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Delivered / Finished</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference, recipient, postcode..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="dispatched">In Transit (Dispatched)</option>
            <option value="delivered">Delivered Successfully</option>
            <option value="delivery_failed">Delivery Failed</option>
            <option value="pending_validation">Pending Postcode</option>
          </select>

          {/* Postcode Validation Filter */}
          <select
            value={validationFilter}
            onChange={(e) => setValidationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Postcode Statuses</option>
            <option value="verified_demo">Verified (Demonstration)</option>
            <option value="verified_live">Verified (Official Live)</option>
            <option value="unverified">Unverified / Missing</option>
            <option value="lookup_failed">Lookup Failed / Ambiguous</option>
          </select>

          {/* LGA Filter */}
          <select
            value={lgaFilter}
            onChange={(e) => setLgaFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Local Government Areas</option>
            {distinctLgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredOrders.length}</strong> of {orders.length} orders
          </span>

          {(searchTerm || statusFilter !== 'all' || validationFilter !== 'all' || lgaFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setValidationFilter('all');
                setLgaFilter('all');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
              <tr>
                <th className="px-4 py-3.5">Order Ref</th>
                <th className="px-4 py-3.5">Recipient & Contact</th>
                <th className="px-4 py-3.5">Package Details</th>
                <th className="px-4 py-3.5">11-Char Postcode & LGA</th>
                <th className="px-4 py-3.5">Address Validation</th>
                <th className="px-4 py-3.5">Delivery Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isVerified = order.postcodeStatus === 'verified_demo' || order.postcodeStatus === 'verified_live';

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectOrderForDetail(order)}
                    >
                      {/* Order Ref */}
                      <td className="px-4 py-3 font-mono font-semibold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{order.orderReference}</span>
                          {order.isDemoRecord && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-400 font-normal">
                              Demo
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </td>

                      {/* Recipient */}
                      <td className="px-4 py-3">
                        <strong className="text-slate-100 block">{order.customerName}</strong>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{order.customerPhone}</span>
                        </span>
                      </td>

                      {/* Package */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <span className="text-slate-200 line-clamp-1">{order.packageDescription}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {order.packageWeightKg ? `${order.packageWeightKg} kg • ` : ''}
                          <span className="capitalize">{order.priority}</span>
                        </span>
                      </td>

                      {/* Postcode & LGA */}
                      <td className="px-4 py-3 font-mono">
                        {order.postcode ? (
                          <>
                            <span className="font-semibold text-emerald-400">{order.postcode}</span>
                            <span className="text-[10px] text-slate-400 block font-sans truncate mt-0.5">
                              {order.addressComponents?.lga || order.addressComponents?.state || 'Awaiting resolution'}
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-400 text-xs italic font-sans">
                            No postcode entered
                          </span>
                        )}
                      </td>

                      {/* Validation Status Badge */}
                      <td className="px-4 py-3">
                        {order.postcodeStatus === 'verified_demo' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified (Demo)</span>
                          </span>
                        )}
                        {order.postcodeStatus === 'verified_live' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified (Live NIPOST)</span>
                          </span>
                        )}
                        {order.postcodeStatus === 'unverified' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Unverified</span>
                          </span>
                        )}
                        {order.postcodeStatus === 'lookup_failed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3 h-3" />
                            <span>Address Missing</span>
                          </span>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="px-4 py-3">
                        {order.status === 'ready_for_dispatch' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Ready for Dispatch
                          </span>
                        )}
                        {order.status === 'dispatched' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            In Transit
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            Delivered
                          </span>
                        )}
                        {order.status === 'delivery_failed' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Failed Delivery
                          </span>
                        )}
                        {order.status === 'pending_validation' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                            Pending Validation
                          </span>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'ready_for_dispatch' && (
                            <button
                              onClick={() => handleOpenStatusModal(order, 'dispatched')}
                              className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] transition-colors"
                            >
                              Dispatch
                            </button>
                          )}
                          {order.status === 'dispatched' && (
                            <>
                              <button
                                onClick={() => handleOpenStatusModal(order, 'delivered')}
                                className="px-2 py-1 rounded bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-[11px] transition-colors"
                              >
                                Delivered
                              </button>
                              <button
                                onClick={() => handleOpenStatusModal(order, 'delivery_failed')}
                                className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] transition-colors"
                              >
                                Fail
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onSelectOrderForDetail(order)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update / Failure Modal */}
      {actionOrder && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Update Order Status: {targetStatus.replace('_', ' ').toUpperCase()}
            </h3>

            <p className="text-xs text-slate-300">
              Order: <span className="font-mono text-emerald-400 font-semibold">{actionOrder.orderReference}</span> ({actionOrder.customerName})
            </p>

            {targetStatus === 'delivery_failed' ? (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-rose-300">
                  Select Documented Reason for Delivery Failure:
                </label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value as FailureReason)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="ambiguous_landmark">Ambiguous Landmark / Unverified Building</option>
                  <option value="building_not_found">Building Identifier Not Found</option>
                  <option value="customer_unreachable">Customer Unreachable (Phone Off / No Answer)</option>
                  <option value="road_impassable">Road Impassable / Flooded / Blocked Access</option>
                  <option value="incorrect_postcode">Postcode Mismatch with Actual Destination</option>
                  <option value="customer_cancelled">Customer Cancelled at Delivery Point</option>
                </select>

                <textarea
                  rows={3}
                  value={failureNotes}
                  onChange={(e) => setFailureNotes(e.target.value)}
                  placeholder="Additional courier incident notes (e.g. rider searched street 40 mins)..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">
                Confirm updating this order status to <strong className="text-white">{targetStatus}</strong>.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActionOrder(null);
                  setTargetStatus(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                {isUpdating ? 'Saving...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
