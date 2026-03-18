import prisma from "@/lib/db/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import type { CartItem, AddToCartInput, UpdateCartItemInput } from "@/types/database";

export class CartService {
  async getCart(userId: string): Promise<CartItem[]> {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            colors: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return cartItems as unknown as CartItem[];
  }

  async addToCart(userId: string, data: AddToCartInput): Promise<CartItem> {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError("Produto");
    }

    if (!product.isActive) {
      throw new ValidationError("Produto não está disponível");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: data.productId,
        selectedSize: data.selectedSize,
        selectedColor: data.selectedColor,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + data.quantity,
        },
        include: {
          product: {
            include: {
              category: true,
              colors: true,
            },
          },
        },
      });

      return updatedItem as unknown as CartItem;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        quantity: data.quantity,
        selectedSize: data.selectedSize,
        selectedColor: data.selectedColor,
      },
      include: {
        product: {
          include: {
            category: true,
            colors: true,
          },
        },
      },
    });

    return cartItem as unknown as CartItem;
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    data: UpdateCartItemInput
  ): Promise<CartItem> {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!existingItem) {
      throw new NotFoundError("Item do carrinho");
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data,
      include: {
        product: {
          include: {
            category: true,
            colors: true,
          },
        },
      },
    });

    return updatedItem as unknown as CartItem;
  }

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!existingItem) {
      throw new NotFoundError("Item do carrinho");
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async getCartTotal(userId: string): Promise<{ subtotal: number; items: number }> {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    const subtotal = cartItems.reduce((total: number, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    return {
      subtotal,
      items: cartItems.reduce((total: number, item) => total + item.quantity, 0),
    };
  }
}

export const cartService = new CartService();
