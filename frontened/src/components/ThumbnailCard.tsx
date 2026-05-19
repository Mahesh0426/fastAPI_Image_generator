import { useState } from "react";
import {
  AlertTriangle,
  Download,
  Loader2,
  Monitor,
  Smartphone,
  Square,
} from "lucide-react";
import type { Thumbnail } from "../apis";

interface ThumbnailCardProps {
  thumbnail: Thumbnail;
}

const STYLE_LABELS: Record<string, { title: string; tagline: string }> = {
  bold_dramatic: {
    title: "Bold & Dramatic",
    tagline: "Cinematic, high-contrast, attention-grabbing",
  },
  clean_minimal: {
    title: "Clean & Minimal",
    tagline: "Bright, professional, plenty of whitespace",
  },
  Vibrant_energetic: {
    title: "Vibrant & Energetic",
    tagline: "Colorful, dynamic, pop-art inspired",
  },
};

const VARIANT_TABS: {
  key: "youtube" | "shorts" | "square";
  label: string;
  Icon: typeof Monitor;
  ratio: string;
}[] = [
  { key: "youtube", label: "YouTube", Icon: Monitor, ratio: "16/9" },
  { key: "shorts", label: "Shorts", Icon: Smartphone, ratio: "9/16" },
  { key: "square", label: "Square", Icon: Square, ratio: "1/1" },
];

export default function ThumbnailCard({ thumbnail }: ThumbnailCardProps) {
  const [variantKey, setVariantKey] =
    useState<"youtube" | "shorts" | "square">("youtube");

  const meta = STYLE_LABELS[thumbnail.style_name] ?? {
    title: thumbnail.style_name,
    tagline: "Generated style",
  };

  const isPending = thumbnail.status === "pending";
  const isGenerating = thumbnail.status === "generating";
  const isReady = thumbnail.status === "uploaded";
  const isFailed =
    thumbnail.status === "failed" || thumbnail.status === "error";

  const previewUrl = thumbnail.variants?.[variantKey] ?? thumbnail.imagekit_url;
  const aspect = VARIANT_TABS.find((t) => t.key === variantKey)?.ratio ?? "16/9";

  const downloadUrl = thumbnail.variants?.[variantKey] ?? thumbnail.imagekit_url;

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-colors">
      {/* Image preview */}
      <div
        className="relative w-full bg-slate-900"
        style={{ aspectRatio: aspect }}
      >
        {isReady && previewUrl ? (
          <img
            src={previewUrl}
            alt={meta.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-rose-300 px-4 text-center">
            <AlertTriangle className="w-6 h-6" />
            <p className="text-sm font-medium">Generation failed</p>
            {thumbnail.error_message && (
              <p className="text-xs text-rose-400/80 line-clamp-2">
                {thumbnail.error_message}
              </p>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-fuchsia-500/30 blur-xl animate-pulse" />
              <Loader2 className="w-7 h-7 relative animate-spin text-fuchsia-300" />
            </div>
            <p className="text-sm">
              {isPending ? "Queued..." : isGenerating ? "Generating..." : "Working..."}
            </p>
          </div>
        )}

        {isReady && (
          <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 backdrop-blur">
            Ready
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold leading-tight">
              {meta.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{meta.tagline}</p>
          </div>
        </header>

        {isReady && thumbnail.variants && (
          <>
            <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              {VARIANT_TABS.map(({ key, label, Icon }) => {
                const active = variantKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVariantKey(key)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md transition-colors ${
                      active
                        ? "bg-white text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Open / Download
              </a>
            )}
          </>
        )}
      </div>
    </article>
  );
}
