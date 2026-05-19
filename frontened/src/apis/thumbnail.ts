import api from "./axios";
import type {
  CreateJobPayload,
  CreateJobResponse,
  Job,
  UploadHeadshotResponse,
} from "./types";

/**
 * Upload a headshot image to the backend.
 * Backend route: POST /api/upload-headshot  (multipart/form-data)
 */
export async function uploadHeadshot(file: File): Promise<UploadHeadshotResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<UploadHeadshotResponse>(
    "/upload-headshot",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

/**
 * Create a new thumbnail-generation job.
 * Backend route: POST /api/jobs
 */
export async function createJob(
  payload: CreateJobPayload
): Promise<CreateJobResponse> {
  const { data } = await api.post<CreateJobResponse>("/jobs", payload);
  return data;
}

/**
 * Fetch the latest state of a job (with thumbnails).
 * Backend route: GET /api/jobs/{job_id}
 */
export async function getJob(jobId: string | number): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${jobId}`);
  return data;
}

/**
 * Resolve the SSE stream URL for a job.
 * Backend route: GET /api/jobs/{job_id}/stream
 *
 * We expose this as a URL so the caller can attach an EventSource
 * (axios doesn't support text/event-stream natively).
 */
export function getJobStreamUrl(jobId: string | number): string {
  const base = api.defaults.baseURL ?? "/api";
  return `${base}/jobs/${jobId}/stream`;
}
