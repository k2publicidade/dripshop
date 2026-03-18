import { NextRequest } from "next/server";
import { categoryService } from "@/lib/services/category.service";
import { categorySchema } from "@/lib/validations";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const categories = await categoryService.getCategories();
    return successResponse(categories);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = categorySchema.parse(body);
    const category = await categoryService.createCategory(data);
    return successResponse(category, 201);
  } catch (error) {
    return handleError(error);
  }
}
