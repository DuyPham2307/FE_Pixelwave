import { ImagePageResponse, ImageTag, TagImageResponse, TagResponseDTO } from "@/models/ImageModel";
import api from "@/utils/axiosInstance";
import axios from "axios";

export const getTagForExplore = async (limit: number): Promise<ImageTag[]> => {
  try {
    const res = await api.get(`/api/images/tags?limit=${limit}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getFeed failed in axios:", error);
      throw new Error(
        "Request failed: " + (error.response?.data?.message || "Unknown error")
      );
    } else {
      console.error("getFeed failed:", error);
      throw new Error("Unexpected error occurred.");
    }
  }
};

export const getAllTagForExplore = async (): Promise<TagResponseDTO[]> => {
  try {
    const res = await api.get(`/api/images/all-tags`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getFeed failed in axios:", error);
      throw new Error(
        "Request failed: " + (error.response?.data?.message || "Unknown error")
      );
    } else {
      console.error("getFeed failed:", error);
      throw new Error("Unexpected error occurred.");
    }
  }
};

export const getImagesByTag = async (
  tagId: number,
  page: number = 0,
  size: number = 20
): Promise<ImagePageResponse<TagImageResponse>> => {
  try {
    const res = await api.get(`/api/images/tags/${tagId}/images`, {
      params: { page, size },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getImagesByTag failed:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to load images"
      );
    } else {
      throw new Error("Unexpected error");
    }
  }
};
