import { NextRequest } from "next/server";
import { cartService } from "@/lib/services/cart.service";
import { addToCartSchema, updateCartItemSchema } from "@/lib/validations";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const userId = searchParams.userId as string;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    const cart = await cartService.getCart(userId);
    const totals = await cartService.getCartTotal(userId);

    return successResponse({ items: cart, subtotal: totals.subtotal, totalItems: totals.items });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity, selectedSize, selectedColor } = body;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    const data = {
      userId,
      productId,
      quantity: quantity || 1,
      selectedSize,
      selectedColor,
    };

    const item = await cartService.addToCart(data.userId, data);
    return successResponse(item, 201);
  } catch (error) {
    return handleError(error);
  }
}
