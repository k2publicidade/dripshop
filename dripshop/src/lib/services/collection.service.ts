import prisma from "@/lib/db/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type { Collection } from "@/types/database";

export class CollectionService {
  async getCollections(): Promise<Collection[]> {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
      },
      orderBy: { name: "asc" },
    });

    return collections as unknown as Collection[];
  }

  async getAllCollections(): Promise<Collection[]> {
    const collections = await prisma.collection.findMany({
      include: {
        products: {
          take: 10,
        },
      },
      orderBy: { name: "asc" },
    });

    return collections as unknown as Collection[];
  }

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
        },
        creators: true,
      },
    });

    if (!collection) {
      throw new NotFoundError("Coleção");
    }

    return collection as unknown as Collection;
  }

  async getCollectionById(id: string): Promise<Collection> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        creators: true,
      },
    });

    if (!collection) {
      throw new NotFoundError("Coleção");
    }

    return collection as unknown as Collection;
  }

  async createCollection(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }): Promise<Collection> {
    const existingCollection = await prisma.collection.findUnique({
      where: { slug: data.slug },
    });

    if (existingCollection) {
      throw new ConflictError("Já existe uma coleção com este slug");
    }

    const collection = await prisma.collection.create({
      data,
      include: {
        creators: true,
      },
    });

    return collection as unknown as Collection;
  }

  async updateCollection(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      isActive?: boolean;
    }
  ): Promise<Collection> {
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      throw new NotFoundError("Coleção");
    }

    const collection = await prisma.collection.update({
      where: { id },
      data,
      include: {
        creators: true,
      },
    });

    return collection as unknown as Collection;
  }

  async deleteCollection(id: string): Promise<void> {
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      throw new NotFoundError("Coleção");
    }

    await prisma.collection.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const collectionService = new CollectionService();
