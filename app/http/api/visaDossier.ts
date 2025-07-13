import axios from 'axios';
import type { VisaDocumentApiResponseGrouped, VisaDocumentApiResponseUnity } from '../types/VisaDocumentApiResponse';

const api = axios.create({
  baseURL: process.env.API_URL,
});

export const uploadFile = (file: File, type: string, tag: string): Promise<VisaDocumentApiResponseUnity> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('tag', tag);

  return api.post<VisaDocumentApiResponseUnity>('/documents/upload', formData).then(result => result.data).catch((error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error("Erro inesperado ao chamar API"));
  });
}

export const fetchFiles = (): Promise<VisaDocumentApiResponseGrouped> => api.get<VisaDocumentApiResponseGrouped>('/documents/list').then(result => result.data).catch((error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }

  return Promise.reject(new Error("Erro inesperado ao chamar API"));
});

export const deleteFile = (id: number): Promise<VisaDocumentApiResponseUnity> => api.delete<VisaDocumentApiResponseUnity>('/documents/delete', {
  data: { id },
}).then(result => result.data).catch((error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }

  return Promise.reject(new Error("Erro inesperado ao chamar API"));
});
