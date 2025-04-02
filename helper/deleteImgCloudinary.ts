import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_KEY || "",
  api_secret: process.env.CLOUD_SECRET || "",
});

/**
 * Trích xuất public_id từ URL Cloudinary
 * @param url - URL của hình ảnh Cloudinary
 * @returns public_id hoặc null nếu không hợp lệ
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url || !url.includes("cloudinary.com")) {
      return null;
    }

    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    const versionPart = urlParts[uploadIndex + 1];
    if (!versionPart || !versionPart.startsWith("v")) {
      return null;
    }

    const filenamePart = urlParts[urlParts.length - 1];
    const filename = filenamePart.split(".")[0];

    return filename;
  } catch (error: any) {
    console.error(`Error extracting public_id from URL: ${error.message}`);
    return null;
  }
};

// Type cho kết quả xoá ảnh
interface DeleteResult {
  url: string;
  success: boolean;
  error?: string;
  publicId?: string;
}

/**
 * Xoá danh sách hình ảnh từ Cloudinary theo URLs
 * @param list Danh sách URL ảnh
 */
export const deleteImgCloud = async (
  list: string[]
): Promise<{
  success: boolean;
  message: string;
  results: DeleteResult[];
}> => {
  if (!Array.isArray(list) || list.length === 0) {
    return {
      success: false,
      message: "Invalid or empty image list",
      results: [],
    };
  }

  const results: DeleteResult[] = await Promise.all(
    list.map(async (url) => {
      try {
        const publicId = getPublicIdFromUrl(url);

        if (!publicId) {
          return {
            url,
            success: false,
            error: "Could not extract public_id from URL",
          };
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok" || result.result === "not found") {
          return {
            url,
            success: true,
            publicId,
          };
        } else {
          return {
            url,
            success: false,
            error: `Cloudinary returned: ${result.result}`,
            publicId,
          };
        }
      } catch (error: any) {
        return {
          url,
          success: false,
          error: error.message,
        };
      }
    })
  );

  const successCount = results.filter((r) => r.success).length;

  return {
    success: successCount > 0,
    message: `Successfully deleted ${successCount}/${list.length} images`,
    results,
  };
};
