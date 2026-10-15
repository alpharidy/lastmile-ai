/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { PostcodeIntelligence } from './components/PostcodeIntelligence';
import { AddressAssistant } from './components/AddressAssistant';
import { MerchantDashboard } from './components/MerchantDashboard';
import { DeliveryIntelligence } from './components/DeliveryIntelligence';
import { OperationsInsights } from './components/OperationsInsights';
import { SettingsPage } from './components/SettingsPage';
import { CreateOrderModal } from './components/CreateOrderModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { 
  fetchOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder, 
  resetDemoOrders 
} from './services/apiClient';
import { DeliveryOrder, OrderStatus, FailureReason } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [prefilledDraft, setPrefilledDraft] = useState<any>(null);

  // Load orders on mount
  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (orderData: Partial<DeliveryOrder>) => {
    const created = await createOrder(orderData);
    setOrders((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
    setPrefilledDraft(null);
    setActiveTab('dashboard');
  };

  const handleUpdateStatus = async (
    orderId: string, 
    status: OrderStatus, 
    failureReason?: FailureReason, 
    failureNotes?: string
  ) => {
    const updated = await updateOrder(orderId, {
      status,
      failureReason,
      failureNotes,
    });
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Delete this delivery order record?')) {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const handleResetDemoData = async () => {
    const reset = await resetDemoOrders();
    setOrders(reset);
  };

  const handleUseDraftForOrder = (draft: any) => {
    setPrefilledDraft(draft);
    setIsCreateModalOpen(true);
  };

  const isDemoMode = orders.some((o) => o.isDemoRecord);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCreateOrder={() => {
          setPrefilledDraft(null);
          setIsCreateModalOpen(true);
        }}
        isDemoMode={isDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <LandingPage
            onNavigate={setActiveTab}
            onOpenCreateOrder={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'postcodes' && (
          <PostcodeIntelligence />
        )}

        {activeTab === 'assistant' && (
          <AddressAssistant
            onUseDraftForOrder={handleUseDraftForOrder}
          />
        )}

        {activeTab === 'dashboard' && (
          <MerchantDashboard
            orders={orders}
            onOpenCreateOrder={() => {
              setPrefilledDraft(null);
              setIsCreateModalOpen(true);
            }}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
            onResetDemoData={handleResetDemoData}
            onSelectOrderForDetail={setSelectedOrder}
            isDemoData={isDemoMode}
          />
        )}

        {activeTab === 'dispatch' && (
          <DeliveryIntelligence
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onSelectOrder={setSelectedOrder}
          />
        )}

        {activeTab === 'insights' && (
          <OperationsInsights
            orders={orders}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            onResetData={handleResetDemoData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setPrefilledDraft(null);
        }}
        onSubmit={handleCreateOrder}
        initialDraft={prefilledDraft}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onNavigateToPostcodeLookup={(postcode) => {
          setActiveTab('postcodes');
        }}
      />
    </div>
  );
}
