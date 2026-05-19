import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import PromptForm, { type PromptFormValues } from "../components/PromptForm";
import { createJob } from "../apis";

export default function Generate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: PromptFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const { job_id } = await createJob(values);
      navigate(`/result/${job_id}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not create the job.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-slate-100">
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
          Step 1 of 2
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Describe your video, get three thumbnails.
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl">
          Drop your headshot, tell us what the video is about, and we'll
          generate up to three on-brand variations in seconds.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <PromptForm onSubmit={handleSubmit} isSubmitting={submitting} />

          {error && (
            <p className="mt-4 text-sm text-rose-300" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
