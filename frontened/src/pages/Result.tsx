import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import ThumbnailCard from "../components/ThumbnailCard";
import { getJob, type Job } from "../apis";

const POLL_INTERVAL_MS = 2_000;

export default function Result() {
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // keep the polling timer in a ref so we can clear it cleanly
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;

    const stop = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const tick = async () => {
      try {
        const fresh = await getJob(jobId);
        if (cancelled) return;
        setJob(fresh);
        setError(null);
        setLoading(false);

        const finished =
          fresh.status === "completed" || fresh.status === "failed";
        if (!finished) {
          timerRef.current = window.setTimeout(tick, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : "Could not load this job.";
        setError(msg);
        setLoading(false);
        // Try again after a longer pause on errors
        timerRef.current = window.setTimeout(tick, POLL_INTERVAL_MS * 3);
      }
    };

    tick();

    return () => {
      cancelled = true;
      stop();
    };
  }, [jobId]);

  const readyCount = useMemo(
    () =>
      job?.thumbnails.filter((t) => t.status === "uploaded").length ?? 0,
    [job]
  );
  const totalCount = job?.thumbnails.length ?? job?.num_thumbnails ?? 0;

  const isProcessing =
    job?.status === "pending" || job?.status === "processing";
  const isCompleted = job?.status === "completed";
  const isFailed = job?.status === "failed";

  return (
    <div className="text-slate-100">
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <Link
          to="/generate"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              Job #{jobId}
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Your thumbnails
            </h1>
            {job?.prompt && (
              <p className="mt-2 max-w-2xl text-slate-400">
                <span className="text-slate-500">Prompt:</span> {job.prompt}
              </p>
            )}
          </div>

          <StatusPill
            isProcessing={isProcessing}
            isCompleted={isCompleted}
            isFailed={isFailed}
            ready={readyCount}
            total={totalCount}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        {error && !job && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Couldn't load this job
            </div>
            <p className="mt-1 text-sm text-rose-200/80">{error}</p>
          </div>
        )}

        {loading && !job && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {job && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {job.thumbnails.map((thumb) => (
              <ThumbnailCard key={String(thumb.id)} thumbnail={thumb} />
            ))}
          </div>
        )}

        {isCompleted && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <div>
                <p className="text-white font-medium">All done!</p>
                <p className="text-sm text-slate-400">
                  {readyCount} of {totalCount} thumbnails generated
                  successfully.
                </p>
              </div>
            </div>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Generate again
            </Link>
          </div>
        )}

        {isFailed && (
          <div className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4" />
              This job failed.
            </div>
            <p className="mt-1 text-sm text-rose-200/80">
              All thumbnails failed to generate. Try again with a different
              prompt or headshot.
            </p>
            <Link
              to="/generate"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusPill({
  isProcessing,
  isCompleted,
  isFailed,
  ready,
  total,
}: {
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  ready: number;
  total: number;
}) {
  if (isProcessing) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-200 text-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Generating · {ready}/{total}
      </span>
    );
  }
  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Complete · {ready}/{total}
      </span>
    );
  }
  if (isFailed) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
        <AlertTriangle className="w-3.5 h-3.5" />
        Failed
      </span>
    );
  }
  return null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="aspect-video w-full bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-48 rounded bg-white/10 animate-pulse" />
        <div className="h-9 w-full rounded-lg bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
