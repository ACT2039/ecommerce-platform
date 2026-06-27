import apiClient from './api';

export const cartApi = {
  getCart: () => apiClient.get('/api/cart').then((res) => res.data.data.cart),
  addItem: (productId: string, quantity: number = 1) => 
    apiClient.post('/api/cart/items', { productId, quantity }).then((res) => res.data.data.cart),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.put(`/api/cart/items/${itemId}`, { quantity }).then((res) => res.data.data.cart),
  removeItem: (itemId: string) =>
    apiClient.delete(`/api/cart/items/${itemId}`).then((res) => res.data.data.cart),
  clearCart: () => apiClient.delete('/api/cart').then((res) => res.data.data.cart),
};
