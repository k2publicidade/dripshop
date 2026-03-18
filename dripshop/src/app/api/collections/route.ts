import { NextRequest } from "next/server";
import { collectionService } from "@/lib/services/collection.service";
import { collectionSchema } from "@/lib/validations";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const collections = await collectionService.getCollections();
    return successResponse(collections);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = collectionSchema.parse(body);
    const collection = await collectionService.createCollection(data);
    return successResponse(collection, 201);
  } catch (error) {
    return handleError(error);
  }
}
