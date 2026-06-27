'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { Package, MapPin, User as UserIcon, LogOut, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleEditClick = (address: any) => {
    setEditingAddressId(address.id);
    setEditForm(address);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId === 'new') {
        const res = await apiClient.post('/api/addresses', editForm);
        setAddresses([...addresses, res.data.data.address]);
      } else {
        const res = await apiClient.put(`/api/addresses/${editingAddressId}`, editForm);
        setAddresses(addresses.map(a => a.id === editingAddressId ? res.data.data.address : a));
      }
      setEditingAddressId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiClient.delete(`/api/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await apiClient.put(`/api/orders/${id}/cancel`);
      setOrders(orders.map(o => o.id === id ? res.data.data : o));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      setIsLoadingData(true);
      setError(null);
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          apiClient.get('/api/orders'),
          apiClient.get('/api/addresses')
        ]);
        setOrders(ordersRes.data?.data?.orders || []);
        setAddresses(addressesRes.data?.data?.addresses || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-emerald-400" />
              My Account
            </h1>
            <p className="text-gray-300 mt-1">Manage your orders and addresses.</p>
          </div>
          <Button 
            onClick={() => { logout(); router.push('/'); }} 
            variant="outline" 
            className="flex items-center gap-2 border-white/20 text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/50 bg-transparent transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white/20 text-white shadow-md backdrop-blur-md border border-white/20' : 'glass-card border-transparent text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              <Package className="w-5 h-5" />
              My Orders
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-white/20 text-white shadow-md backdrop-blur-md border border-white/20' : 'glass-card border-transparent text-gray-300 hover:text-white hover:bg-white/10'}`}
            >
              <MapPin className="w-5 h-5" />
              Addresses
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {error && (
              <div className="bg-red-500/10 text-red-300 p-4 rounded-xl mb-6 border border-red-500/20">
                {error}
              </div>
            )}

            {isLoadingData ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                <p className="text-gray-300 font-medium">Loading your {activeTab}...</p>
              </div>
            ) : (
              <>
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-white mb-4">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="glass-card p-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-gray-300 mb-6">You haven't placed any orders.</p>
                        <Button onClick={() => router.push('/products')} className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 shadow-lg shadow-emerald-900/20">Start Shopping</Button>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="glass-card overflow-hidden shadow-sm hover:shadow-md transition-all">
                          <div className="bg-white/5 p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                              <p className="text-sm font-bold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total</p>
                              <p className="text-sm font-bold text-white">${order.total}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order ID</p>
                              <p className="text-sm font-mono text-gray-300">#{order.id.split('-')[0].toUpperCase()}</p>
                            </div>
                            <div>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <div className="ml-auto">
                                <Button 
                                  onClick={() => handleCancelOrder(order.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 bg-transparent transition-colors"
                                >
                                  Cancel Order
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="p-4 space-y-4">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="flex-1">
                                  <p className="font-bold text-white">{item.title}</p>
                                  <p className="text-sm text-gray-400">Qty: {item.quantity} • ${(Number(item.unitPrice) * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-black text-white">Saved Addresses</h2>
                      <Button onClick={() => { setEditingAddressId('new'); setEditForm({}); }} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 shadow-lg shadow-emerald-900/20">Add New Address</Button>
                    </div>
                    {addresses.length === 0 && editingAddressId !== 'new' ? (
                      <div className="glass-card p-12 text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No addresses saved</h3>
                        <p className="text-gray-300">Addresses are automatically saved when you checkout.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {editingAddressId === 'new' && (
                          <div className="glass-card p-6 relative col-span-1 md:col-span-2">
                            <form onSubmit={handleEditSubmit} className="space-y-3">
                              <h3 className="font-bold text-white mb-2">Add New Address</h3>
                              <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Full Name" value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} required />
                              <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Address Line 1" value={editForm.line1 || ''} onChange={(e) => setEditForm({...editForm, line1: e.target.value})} required />
                              <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Address Line 2 (Optional)" value={editForm.line2 || ''} onChange={(e) => setEditForm({...editForm, line2: e.target.value})} />
                              <div className="flex gap-2">
                                <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="City" value={editForm.city || ''} onChange={(e) => setEditForm({...editForm, city: e.target.value})} required />
                                <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="State" value={editForm.state || ''} onChange={(e) => setEditForm({...editForm, state: e.target.value})} required />
                              </div>
                              <div className="flex gap-2">
                                <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Postal Code" value={editForm.postalCode || ''} onChange={(e) => setEditForm({...editForm, postalCode: e.target.value})} required />
                                <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Country" value={editForm.country || ''} onChange={(e) => setEditForm({...editForm, country: e.target.value})} required />
                              </div>
                              <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Phone" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                              <div className="flex gap-2 pt-2">
                                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50">Save Address</Button>
                                <Button type="button" size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-colors" onClick={() => setEditingAddressId(null)}>Cancel</Button>
                              </div>
                            </form>
                          </div>
                        )}
                        {addresses.map((address) => (
                          <div key={address.id} className="glass-card p-6 hover:border-emerald-500 transition-all relative">
                            {editingAddressId === address.id ? (
                              <form onSubmit={handleEditSubmit} className="space-y-3">
                                <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Full Name" value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} required />
                                <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Address Line 1" value={editForm.line1 || ''} onChange={(e) => setEditForm({...editForm, line1: e.target.value})} required />
                                <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Address Line 2 (Optional)" value={editForm.line2 || ''} onChange={(e) => setEditForm({...editForm, line2: e.target.value})} />
                                <div className="flex gap-2">
                                  <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="City" value={editForm.city || ''} onChange={(e) => setEditForm({...editForm, city: e.target.value})} required />
                                  <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="State" value={editForm.state || ''} onChange={(e) => setEditForm({...editForm, state: e.target.value})} required />
                                </div>
                                <div className="flex gap-2">
                                  <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Postal Code" value={editForm.postalCode || ''} onChange={(e) => setEditForm({...editForm, postalCode: e.target.value})} required />
                                  <input className="w-1/2 px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Country" value={editForm.country || ''} onChange={(e) => setEditForm({...editForm, country: e.target.value})} required />
                                </div>
                                <input className="w-full px-3 py-2 border border-white/20 bg-black/20 text-white rounded" placeholder="Phone" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                                <div className="flex gap-2 pt-2">
                                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50">Save</Button>
                                  <Button type="button" size="sm" variant="outline" onClick={() => setEditingAddressId(null)} className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-colors">Cancel</Button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="absolute top-4 right-4 flex gap-3">
                                  <button onClick={() => handleEditClick(address)} className="text-sm text-emerald-400 font-bold hover:underline">Edit</button>
                                  <button onClick={() => handleDeleteClick(address.id)} className="text-sm text-red-400 font-bold hover:underline">Delete</button>
                                </div>
                                <p className="font-bold text-white mb-1 pr-16">{address.fullName}</p>
                                <p className="text-gray-300 text-sm">{address.line1}</p>
                                {address.line2 && <p className="text-gray-300 text-sm">{address.line2}</p>}
                                <p className="text-gray-300 text-sm">{address.city}, {address.state} {address.postalCode}</p>
                                <p className="text-gray-300 text-sm">{address.country}</p>
                                {address.phone && <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">📞 {address.phone}</p>}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
