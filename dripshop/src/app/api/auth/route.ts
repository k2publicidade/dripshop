import { NextRequest } from "next/server";
import { userService } from "@/lib/services/user.service";
import { createUserSchema, loginSchema } from "@/lib/validations";
import { successResponse, handleError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "register") {
      const userData = createUserSchema.parse(data);
      const user = await userService.createUser(userData);
      return successResponse(user, 201);
    }

    if (action === "login") {
      const loginData = loginSchema.parse(data);
      const user = await userService.validateCredentials(loginData.email, loginData.password);
      return successResponse(user);
    }

    return handleError(new Error("Ação inválida. Use 'register' ou 'login'"));
  } catch (error) {
    return handleError(error);
  }
}
