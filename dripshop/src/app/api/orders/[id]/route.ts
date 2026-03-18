import { NextRequest } from "next/server";
import { orderService } from "@/lib/services/order.service";
import { successResponse, handleError, getSearchParams } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = getSearchParams(request.nextUrl.searchParams);
    const userId = searchParams.userId as string | undefined;

    const order = await orderService.getOrderById(id, userId);
    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const order = await orderService.updateOrderStatus(id, status);
    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
}
