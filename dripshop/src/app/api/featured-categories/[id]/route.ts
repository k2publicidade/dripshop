import { NextRequest } from "next/server";
import { featuredCategoryService } from "@/lib/services/featured-category.service";
import { successResponse, handleError } from "@/lib/api-response";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const item = await featuredCategoryService.update(id, body);
        return successResponse(item);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await featuredCategoryService.delete(id);
        return successResponse({ deleted: true });
    } catch (error) {
        return handleError(error);
    }
}
