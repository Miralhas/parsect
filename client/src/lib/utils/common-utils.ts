import { ApiError } from "@/service/api-error";

export const delay = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms));

export const isApiError = (err: Error | null) => err instanceof ApiError;

export const is404 = (err: Error | null) => isApiError(err) && err.status === 404;
