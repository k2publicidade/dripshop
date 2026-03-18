import prisma from "@/lib/db/prisma";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/errors";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  PaginatedResponse,
  Product,
} from "@/types/database";
import { Prisma } from "@prisma/client";

export class ProductService {
  async getProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 20, category, collection, creator, isNew, isFeatured, minPrice, maxPrice, search, sortBy } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (collection) {
      where.collection = { slug: collection };
    }

    if (creator) {
      where.creator = { slug: creator };
    }

    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "name_asc":
        orderBy = { name: "asc" };
        break;
      case "name_desc":
        orderBy = { name: "desc" };
        break;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          collection: true,
          creator: true,
          colors: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as unknown as Product[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            subcategories: true,
          },
        },
        collection: true,
        creator: true,
        colors: true,
      },
    });

    if (!product) {
      throw new NotFoundError("Produto");
    }

    return product as unknown as Product;
  }

  async getProductById(id: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
    });

    if (!product) {
      throw new NotFoundError("Produto");
    }

    return product as unknown as Product;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.name.toLowerCase().replace(/\s+/g, "-") },
    });

    if (existingProduct) {
      throw new ConflictError("Já existe um produto com este slug");
    }

    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        discount: data.discount,
        images: data.images,
        categoryId: data.categoryId,
        subcategory: data.subcategory,
        collectionId: data.collectionId,
        creatorId: data.creatorId,
        sizes: data.sizes,
        stock: data.stock ?? 0,
        isNew: data.isNew ?? false,
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
        theme: data.theme,
        colors: {
          create: data.colors,
        },
      },
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
    });

    return product as unknown as Product;
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError("Produto");
    }

    const { colors, ...productData } = data;

    if (colors) {
      await prisma.productColor.deleteMany({
        where: { productId: id },
      });

      await prisma.productColor.createMany({
        data: colors.map((color) => ({
          ...color,
          productId: id,
        })),
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: productData,
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
    });

    return product as unknown as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError("Produto");
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products as unknown as Product[];
  }

  async getNewProducts(limit: number = 10): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isNew: true,
        isActive: true,
      },
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products as unknown as Product[];
  }

  async getOnSaleProducts(limit: number = 10): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        discount: { gte: 20 },
        isActive: true,
      },
      include: {
        category: true,
        collection: true,
        creator: true,
        colors: true,
      },
      take: limit,
      orderBy: { discount: "desc" },
    });

    return products as unknown as Product[];
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError("Produto");
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new ValidationError("Estoque insuficiente");
    }

    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }
}

export const productService = new ProductService();
