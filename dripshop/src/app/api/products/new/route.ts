import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const newProducts = await productService.getNewProducts();
    return successResponse(newProducts);
  } catch (error) {
    return handleError(error);
  }
}
