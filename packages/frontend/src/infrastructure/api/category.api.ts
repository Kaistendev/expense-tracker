import { httpClient } from "../http-client";
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../../core/types";

export const categoryApi = {
  list(): Promise<CategoryResponse[]> {
    return httpClient.get<CategoryResponse[]>("/categories").then((r) => r.data);
  },
  create(data: CreateCategoryRequest): Promise<CategoryResponse> {
    return httpClient.post<CategoryResponse>("/categories", data).then((r) => r.data);
  },
  update(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    return httpClient.put<CategoryResponse>(`/categories/${id}`, data).then((r) => r.data);
  },
  delete(id: string): Promise<void> {
    return httpClient.delete(`/categories/${id}`).then(() => undefined);
  },
};
