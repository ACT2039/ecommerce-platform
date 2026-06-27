// Auth types
export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
}

// Address types
export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Product types
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  currency: string;
  isPublished: boolean;
  images: ProductImage[];
  inventory: Inventory | null;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface Inventory {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  reserved: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
