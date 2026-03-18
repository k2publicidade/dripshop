import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getProductById(id);
    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateProductSchema.parse(body);
    const product = await productService.updateProduct(id, data);
    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await productService.deleteProduct(id);
    return successResponse({ message: "Produto deletado com sucesso" });
  } catch (error) {
    return handleError(error);
  }
}
