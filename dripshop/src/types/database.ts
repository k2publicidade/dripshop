import type {
  User as PrismaUser,
  Product as PrismaProduct,
  Category as PrismaCategory,
  Collection as PrismaCollection,
  Creator as PrismaCreator,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  CartItem as PrismaCartItem,
  Address as PrismaAddress,
} from "@prisma/client";

import { type OrderStatus, type PaymentStatus, type UserRole } from "@prisma/client";
export type { OrderStatus, PaymentStatus, UserRole };

export type { PrismaUser, PrismaProduct, PrismaCategory, PrismaCollection, PrismaCreator, PrismaOrder, PrismaOrderItem, PrismaCartItem, PrismaAddress };

export interface Product extends Omit<PrismaProduct, "categoryId" | "collectionId" | "creatorId"> {
  category: PrismaCategory | null;
  collection: PrismaCollection | null;
  creator: PrismaCreator | null;
  colors: ProductColor[];
}

export interface ProductColor {
  id?: string;
  productId?: string;
  name: string;
  hex: string;
  image?: string;
}

export interface Category extends PrismaCategory {
  subcategories?: Category[];
}

export type Collection = PrismaCollection;

export type Creator = PrismaCreator;

export interface User extends Omit<PrismaUser, "password"> {
  password?: string;
}

export interface Address extends PrismaAddress {
  user?: User;
}

export interface Order extends Omit<PrismaOrder, "userId" | "addressId"> {
  user: User;
  address?: Address | null;
  items: OrderItem[];
}

export interface OrderItem extends PrismaOrderItem {
  product?: Product;
}

export interface CartItem extends Omit<PrismaCartItem, "userId" | "productId"> {
  user?: User;
  product?: Product;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  categoryId: string;
  subcategory?: string;
  collectionId?: string;
  creatorId?: string;
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  theme?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFilters {
  category?: string;
  collection?: string;
  creator?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderInput {
  userId: string;
  addressId?: string;
  paymentMethod: string;
  items: {
    productId: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }[];
  notes?: string;
}

export interface UpdateOrderStatusInput {
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export interface AddToCartInput {
  userId: string;
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UpdateCartItemInput {
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  cpf?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  cpf?: string;
}

export interface CreateAddressInput {
  userId: string;
  label?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}
