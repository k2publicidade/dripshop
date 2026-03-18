import { z } from "zod";

export const productColorSchema = z.object({
  name: z.string().min(1, "Nome da cor é obrigatório"),
  hex: z.string().min(1, "Hex da cor é obrigatório"),
  image: z.string().url().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  images: z.array(z.string().url()).min(1, "Pelo menos uma imagem é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  subcategory: z.string().optional(),
  collectionId: z.string().optional(),
  creatorId: z.string().optional(),
  colors: z.array(productColorSchema).min(1, "Pelo menos uma cor é obrigatória"),
  sizes: z.array(z.string()).min(1, "Pelo menos um tamanho é obrigatório"),
  stock: z.number().int().min(0).default(0),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  theme: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  creator: z.string().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "oldest", "name_asc", "name_desc"])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  slug: z.string().min(1, "Slug é obrigatório").max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  slug: z.string().min(1, "Slug é obrigatório").max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().max(100).optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createAddressSchema = z.object({
  label: z.string().max(50).default("Principal"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().min(1, "CEP é obrigatório"),
  isDefault: z.boolean().default(false),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.number().int().positive().default(1),
  selectedSize: z.string().min(1, "Tamanho é obrigatório"),
  selectedColor: z.string().min(1, "Cor é obrigatória"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});

export const createOrderSchema = z.object({
  addressId: z.string().optional(),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
