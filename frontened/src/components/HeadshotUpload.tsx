import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Loader from "./Loader";
import { uploadHeadshot } from "../apis";

interface HeadshotUploadProps {
  /** Called once a headshot has been uploaded and we have a CDN URL. */
  onUploaded: (url: string) => void;
  /** Called when the user clears their selection. */
  onCleared?: () => void;
  /** Currently-uploaded URL (if any) — used to render a "done" state. */
  value?: string | null;
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export default function HeadshotUpload({
  onUploaded,
  onCleared,
  value,
}: HeadshotUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image is too large. Maximum size is 8 MB.");
        return;
      }

      // local preview while uploading
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setIsUploading(true);

      try {
        const { url } = await uploadHeadshot(file);
        onUploaded(url);
        setPreviewUrl(url); // swap to CDN url after success
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed.";
        setError(msg);
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        URL.revokeObjectURL(localUrl);
      }
    },
    [onUploaded]
  );

  const handleClear = () => {
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onCleared?.();
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="headshot-input"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative block cursor-pointer rounded-2xl border-2 border-dashed transition-colors overflow-hidden
          ${
            isDragging
              ? "border-fuchsia-400 bg-fuchsia-500/5"
              : "border-white/15 hover:border-white/30 bg-white/[0.02]"
          }`}
      >
        <input
          id="headshot-input"
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {previewUrl ? (
          <div className="relative aspect-[4/3] w-full">
            <img
              src={previewUrl}
              alt="Headshot preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              {isUploading ? (
                <Loader size="sm" label="Uploading..." />
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Headshot ready
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
              {isUploading ? (
                <Loader size="md" />
              ) : (
                <Upload className="w-5 h-5 text-slate-300" />
              )}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Drop your headshot here
              </p>
              <p className="text-xs text-slate-400">
                or <span className="text-fuchsia-300 underline">browse</span> —
                JPG, PNG or WEBP, up to 8 MB
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
              <ImageIcon className="w-3.5 h-3.5" />
              Best results: well-lit, face-forward photo
            </span>
          </div>
        )}
      </label>

      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
