import prisma from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";

export interface FeaturedCategoryInput {
    title: string;
    imageUrl: string;
    linkUrl: string;
    buttonText?: string;
    position?: number;
    isActive?: boolean;
}

export class FeaturedCategoryService {
    async getActive() {
        return prisma.featuredCategory.findMany({
            where: { isActive: true },
            orderBy: { position: "asc" },
        });
    }

    async getAll() {
        return prisma.featuredCategory.findMany({
            orderBy: { position: "asc" },
        });
    }

    async getById(id: string) {
        const item = await prisma.featuredCategory.findUnique({ where: { id } });
        if (!item) throw new NotFoundError("Categoria em destaque");
        return item;
    }

    async create(data: FeaturedCategoryInput) {
        const maxPos = await prisma.featuredCategory.aggregate({
            _max: { position: true },
        });
        return prisma.featuredCategory.create({
            data: {
                ...data,
                position: data.position ?? (maxPos._max.position ?? 0) + 1,
            },
        });
    }

    async update(id: string, data: Partial<FeaturedCategoryInput>) {
        await this.getById(id);
        return prisma.featuredCategory.update({ where: { id }, data });
    }

    async delete(id: string) {
        await this.getById(id);
        await prisma.featuredCategory.delete({ where: { id } });
    }
}

export const featuredCategoryService = new FeaturedCategoryService();
