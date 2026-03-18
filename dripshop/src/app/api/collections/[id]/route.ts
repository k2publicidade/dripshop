import { NextRequest } from "next/server";
import { collectionService } from "@/lib/services/collection.service";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await collectionService.getCollectionById(id);
    return successResponse(collection);
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
    const collection = await collectionService.updateCollection(id, body);
    return successResponse(collection);
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
    await collectionService.deleteCollection(id);
    return successResponse({ message: "Coleção deletada com sucesso" });
  } catch (error) {
    return handleError(error);
  }
}
