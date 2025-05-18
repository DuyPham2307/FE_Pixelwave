import api from "@/utils/axiosInstance";
import axios from "axios";
import { UserDetailResponse } from "@/models/UserModel";


export const getUserById = async (userId: number): Promise<UserDetailResponse> => {
  try {
    const response = await api.get<UserDetailResponse>(`/api/user/${userId}`);
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