/**
 * Shared types that mirror the FastAPI backend schemas in
 * Backend/routes.py and Backend/models.py.
 */

export type ThumbnailStatus =
  | "pending"
  | "generating"
  | "uploaded"
  | "failed"
  | "error";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface ThumbnailVariants {
  youtube: string;
  shorts: string;
  square: string;
}

export interface Thumbnail {
  id: string | number;
  style_name: string;
  status: ThumbnailStatus;
  imagekit_url: string | null;
  error_message: string | null;
  variants: ThumbnailVariants | null;
}

export interface Job {
  id: string | number;
  prompt: string;
  num_thumbnails: number;
  headshot_url: string;
  status: JobStatus;
  thumbnails: Thumbnail[];
}

export interface CreateJobPayload {
  prompt: string;
  num_thumbnails: number;
  headshot_url: string;
}

export interface CreateJobResponse {
  job_id: string | number;
}

export interface UploadHeadshotResponse {
  url: string;
}
