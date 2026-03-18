import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    
    const featured = await productService.getFeaturedProducts(limit);
    return successResponse(featured);
  } catch (error) {
    return handleError(error);
  }
}
