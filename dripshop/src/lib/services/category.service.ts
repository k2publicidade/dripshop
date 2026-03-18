import prisma from "@/lib/db/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type { Category } from "@/types/database";

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: true,
      },
      orderBy: { name: "asc" },
    });

    return categories as unknown as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true,
        products: {
          where: { isActive: true },
          take: 10,
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Categoria");
    }

    return category as unknown as Category;
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      throw new NotFoundError("Categoria");
    }

    return category as unknown as Category;
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
  }): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new ConflictError("Já existe uma categoria com este slug");
    }

    const category = await prisma.category.create({
      data,
      include: {
        subcategories: true,
      },
    });

    return category as unknown as Category;
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      parentId?: string;
    }
  ): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundError("Categoria");
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        subcategories: true,
      },
    });

    return category as unknown as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundError("Categoria");
    }

    await prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
