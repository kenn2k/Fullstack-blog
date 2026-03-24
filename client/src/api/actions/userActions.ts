import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instances/axiosInstance";
import { User } from "@/types";
import axios from "axios";

interface ApiError {
  message: string;
}

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/users/register", data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiError>(error)) {
        const errorMessage =
          error.response?.data?.message || "Registration failed";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", data);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Login failed";
        return rejectWithValue(message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/my-profile");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue("Unauthorized");
        }
      }
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await axiosInstance.post("/api/auth/logout");
  return true;
});
