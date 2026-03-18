import { NextRequest } from "next/server";
import { featuredCategoryService } from "@/lib/services/featured-category.service";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get("all") === "true";
        const data = all
            ? await featuredCategoryService.getAll()
            : await featuredCategoryService.getActive();
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const item = await featuredCategoryService.create(body);
        return successResponse(item, 201);
    } catch (error) {
        return handleError(error);
    }
}
