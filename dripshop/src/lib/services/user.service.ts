import prisma from "@/lib/db/prisma";
import { NotFoundError, ConflictError, UnauthorizedError, ValidationError } from "@/lib/errors";
import type { User, CreateUserInput, CreateAddressInput, Address, Product } from "@/types/database";
import bcrypt from "bcryptjs";

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("Email já cadastrado");
    }

    if (data.cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new ConflictError("CPF já cadastrado");
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      phone?: string;
      cpf?: string;
    }
  ): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    if (data.cpf && data.cpf !== user.cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new ConflictError("CPF já cadastrado");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Senha atual incorreta");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Email ou senha incorretos");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Email ou senha incorretos");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });

    return addresses as unknown as Address[];
  }

  async createAddress(userId: string, data: CreateAddressInput): Promise<Address> {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label: data.label,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isDefault: data.isDefault,
      },
    });

    return address as unknown as Address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: {
      label?: string;
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      isDefault?: boolean;
    }
  ): Promise<Address> {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw new NotFoundError("Endereço");
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    return address as unknown as Address;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw new NotFoundError("Endereço");
    }

    await prisma.address.delete({
      where: { id: addressId },
    });
  }

  async getFavorites(userId: string): Promise<Product[]> {
    const favorites = await prisma.favorite.findMany({
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

    return favorites.map((fav) => fav.product) as unknown as Product[];
  }

  async addToFavorites(userId: string, productId: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Produto");
    }

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingFavorite) {
      throw new ConflictError("Produto já está nos favoritos");
    }

    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!favorite) {
      throw new NotFoundError("Favorito");
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }
}

export const userService = new UserService();
