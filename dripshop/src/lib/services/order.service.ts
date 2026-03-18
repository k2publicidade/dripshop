import prisma from "@/lib/db/prisma";
import { NotFoundError, ValidationError, ForbiddenError } from "@/lib/errors";
import type { Order, CreateOrderInput, OrderStatus, PaginatedResponse } from "@/types/database";
import { Prisma } from "@prisma/client";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRP-${timestamp}-${random}`;
}

export class OrderService {
  async getOrders(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Order>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as unknown as Order[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Pedido");
    }

    if (userId && order.userId !== userId) {
      throw new ForbiddenError("Você não tem permissão para ver este pedido");
    }

    return order as unknown as Order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Pedido");
    }

    return order as unknown as Order;
  }

  async createOrder(userId: string, data: CreateOrderInput): Promise<Order> {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new ValidationError("Carrinho vazio");
    }

    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: data.addressId,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        notes: data.notes,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.images[0] || "",
            price: item.product.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order as unknown as Order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError("Pedido");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder as unknown as Order;
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError("Pedido");
    }

    if (order.userId !== userId) {
      throw new ForbiddenError("Você não tem permissão para cancelar este pedido");
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw new ValidationError("Este pedido não pode ser cancelado");
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder as unknown as Order;
  }
}

export const orderService = new OrderService();
