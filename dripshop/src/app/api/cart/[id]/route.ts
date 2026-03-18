import { NextRequest } from "next/server";
import { cartService } from "@/lib/services/cart.service";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const userId = searchParams.userId as string;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    const body = await request.json();
    const item = await cartService.updateCartItem(userId, id, body);
    return successResponse(item);
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
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const userId = searchParams.userId as string;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    await cartService.removeFromCart(userId, id);
    return successResponse({ message: "Item removido do carrinho" });
  } catch (error) {
    return handleError(error);
  }
}
