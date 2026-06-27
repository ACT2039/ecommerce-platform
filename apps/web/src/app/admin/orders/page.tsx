'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Package, Truck, CheckCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const { get, put, loading } = useApi();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await get('/admin/orders/admin/all?limit=50'); // Full admin path mapped in index.ts
    // Wait, the routes are mapped as:
    // router.use('/orders', orderRoutes);
    // Inside orderRoutes: router.get('/admin/all', ...);
    // So the path is /orders/admin/all
    
    // Actually in order.routes.ts:
    // router.use('/admin', restrictTo('ADMIN'));
    // router.get('/admin/all', ...);
    
    // Meaning the full URL is /api/orders/admin/all
  };

  const fetchOrdersCorrected = async () => {
    const res = await get('/orders/admin/all?limit=50');
    if (res?.data?.orders) {
      setOrders(res.data.orders);
    }
  };

  useEffect(() => {
    fetchOrdersCorrected();
  }, [get]);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await put(`/orders/admin/${id}/status`, { status: newStatus });
    if (res) {
      fetchOrdersCorrected();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {order.id}
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'PROCESSING')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Mark as Processing"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'SHIPPED')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'DELIVERED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                            title="Mark as Delivered"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
