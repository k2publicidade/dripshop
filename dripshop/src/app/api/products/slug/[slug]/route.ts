import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);
    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}
