import { requireUser } from '@/lib/auth';
import { errorResponse, handleError, successResponse } from '@/lib/api-response';

export async function POST(request: Request) {
 try {
  const { db } = await requireUser(true);
  if (Number(request.headers.get('content-length')) > 5 * 1024 * 1024 + 16384) return errorResponse('A imagem deve ter no máximo 5 MB.', 413);
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) return errorResponse('Envie uma imagem de até 5 MB.', 400);
  const bytes = Buffer.from(await file.arrayBuffer());
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  const extension = jpeg ? 'jpg' : png ? 'png' : webp ? 'webp' : null;
  if (!extension) return errorResponse('Use uma imagem JPG, PNG ou WebP.', 400);
  const contentType = jpeg ? 'image/jpeg' : png ? 'image/png' : 'image/webp';
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await db.storage.from('product-images').upload(path, bytes, { contentType, cacheControl: '31536000', upsert: false });
  if (error) throw new Error('Não foi possível enviar a imagem. Tente novamente.');
  return successResponse({ url: db.storage.from('product-images').getPublicUrl(path).data.publicUrl });
 } catch (error) { return handleError(error); }
}
