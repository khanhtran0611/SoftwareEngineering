import { destinationImages } from "@/data/images"
import type { DestinationImage } from "@/types/image"
import { api } from "./api";

// Get all images for a specific destination
export async function getDestinationImages(destinationId: number): Promise<DestinationImage[]> {
  try {
    // Gọi API endpoint để lấy hình ảnh
    const response = await api.get(`/destinations/images/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching destination images:', error);
    // Trả về mảng rỗng trong trường hợp lỗi để đảm bảo tính tương thích ngược
    return [];
  }
}
