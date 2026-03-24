import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instances/axiosInstance";
export const createExhibit = createAsyncThunk(
  "exhibit/create",
  async (data: FormData) => {
    const response = await axiosInstance.post("/api/exhibits", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const deleteExhibit = createAsyncThunk(
  "exhibit/delete",
  async (id: number) => {
    const response = await axiosInstance.delete(`/api/exhibits/${id}`);
    return response.data;
  }
);

export const getAllExhibits = async (page: number) => {
  const response = await axiosInstance.get(
    `${process.env.BASE_URL}/api/exhibits`,
    {
      params: { page },
    }
  );
  return response.data;
};

export const getExhibitById = async (id: string) => {
  const response = await axiosInstance.get(`/api/exhibits/post/${id}`);
  return response.data;
};

export const getExhibitImage = async (filename: string) => {
  const response = await axiosInstance.get(`/api/exhibits/static/${filename}`);
  return response.data;
};
