import api from "@/utils/axiosInstance";
import axios from "axios";
import { PostRequestPage, UploadPost, PostDetail, PostSimplePage } from "@/models/PostModel";

export const uploadPost = async (payload: UploadPost): Promise<void> => {
  const formData = new FormData();
  formData.append("caption", payload.caption);
  formData.append("privacySetting", payload.privacySetting);
  payload.images.forEach((file) => formData.append("images", file));

  if (payload.taggedUserIds && payload.taggedUserIds.length > 0) {
    payload.taggedUserIds.forEach((id) => {
      formData.append("taggedUserIds", id.toString());
    });
  }

  try {
    const response = await api.post("/api/post", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 201) {
      throw new Error("Upload failed");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("uploadPost failed in axios:", error);
      throw new Error("Some files are not the same as the sample format");
    } else {
      console.error("uploadPost failed:", error);
      throw new Error("Upload failed. Please try again!");
    }
  }
};

export const getPostFromId = async (postId: number): Promise<PostDetail> => {
  try {
    const response = await api.get<PostDetail>(`/api/post/${postId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getPostFromId failed in axios:", error);
      throw new Error("Request failed: " + error.response?.data?.message || "Unknown error");
    } else {
      console.error("getPostFromId failed:", error);
      throw new Error("Unexpected error occurred.");
    }
  }
};

export const getPostFromUserId = async (payload: PostRequestPage): Promise<PostSimplePage> => {
  try {
    const {userId,page,size,sortBy,sortDirection} = payload;
    const response = await api.get<PostSimplePage>(`/api/user/${userId}/posts`, {
      params: {
        size,
        page,
        sortBy,
        sortDirection,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getPostFromId failed in axios:", error);
      throw new Error("Request failed: " + (error.response?.data?.message || "Unknown error"));
    } else {
      console.error("getPostFromId failed:", error);
      throw new Error("Unexpected error occurred.");
    }
  }
};

export const getFeed = async (): Promise<PostDetail[]> => {
  try {
      const response = await api.get<PostDetail[]>(`/api/feed`);
      return response.data;
  } catch (error) {
        if (axios.isAxiosError(error)) {
      console.error("getFeed failed in axios:", error);
      throw new Error("Request failed: " + (error.response?.data?.message || "Unknown error"));
    } else {
      console.error("getFeed failed:", error);
      throw new Error("Unexpected error occurred.");
    }
  }
}


