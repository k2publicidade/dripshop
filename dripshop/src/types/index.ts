export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  category: string;
  subcategory?: string;
  collection?: string;
  creator?: string;
  colors: ProductColor[];
  sizes: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  theme?: string;
  createdAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  subcategories?: Category[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Creator {
  id: string;
  name: string;
  slug: string;
  image?: string;
  verified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}
