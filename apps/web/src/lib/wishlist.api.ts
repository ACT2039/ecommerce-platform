import apiClient from './api';

export const wishlistApi = {
  getWishlist: () => apiClient.get('/api/wishlist').then((res) => res.data.data.wishlist),
  addItem: (productId: string) => 
    apiClient.post(`/api/wishlist/${productId}`).then((res) => res.data.data.wishlist),
  removeItem: (productId: string) =>
    apiClient.delete(`/api/wishlist/${productId}`).then((res) => res.data.data.wishlist),
};
