import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { createProductSchema, updateProductSchema, productFiltersSchema } from "@/lib/validations";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    
    const filters = productFiltersSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page as string) : undefined,
      limit: searchParams.limit ? parseInt(searchParams.limit as string) : undefined,
      minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : undefined,
      isNew: searchParams.isNew === "true" ? true : searchParams.isNew === "false" ? false : undefined,
      isFeatured: searchParams.isFeatured === "true" ? true : searchParams.isFeatured === "false" ? false : undefined,
    });

    const products = await productService.getProducts(filters);
    return successResponse(products);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createProductSchema.parse(body);
    const product = await productService.createProduct(data);
    return successResponse(product, 201);
  } catch (error) {
    return handleError(error);
  }
}
