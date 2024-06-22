import { env } from "@repo/env/web";
import { R2 } from "@repo/r2/admin";
import { PutObjectCommand } from "@repo/r2/client-s3";
import { getSignedUrl } from "@repo/r2/s3-request-presigner";
import { nanoid } from "@repo/utils/id";

export async function handleImageUpload(
  images: {
    size: number;
    type: string;
    width: number;
  }[],
  prefix: string,
) {
  const presignedUrls = [] as string[];
  const id = nanoid();

  for (const image of images) {
    const key = `${prefix}/${id}-${image.width}.png`;

    const cmd = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentLength: image.size,
      ContentType: image.type,
    });

    const presignedUrl = await getSignedUrl(R2, cmd, {
      expiresIn: 60 * 60,
    });

    presignedUrls.push(presignedUrl);
  }

  return {
    id,
    presignedUrls,
  };
}
