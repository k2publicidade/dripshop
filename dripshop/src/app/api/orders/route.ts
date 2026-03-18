import { NextRequest } from "next/server";
import { orderService } from "@/lib/services/order.service";
import { createOrderSchema } from "@/lib/validations";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const userId = searchParams.userId as string;
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 20;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    const orders = await orderService.getOrders(userId, page, limit);
    return successResponse(orders);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, addressId, paymentMethod, notes } = body;

    if (!userId) {
      return handleError(new Error("userId é obrigatório"));
    }

    const data = createOrderSchema.parse({
      addressId,
      paymentMethod,
      notes,
    });

    const order = await orderService.createOrder(userId, {
      userId,
      ...data,
      items,
    });

    return successResponse(order, 201);
  } catch (error) {
    return handleError(error);
  }
}
