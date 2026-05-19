import { useState } from "react";
import { Wand2, AlertCircle } from "lucide-react";
import HeadshotUpload from "./HeadshotUpload";
import Loader from "./Loader";

export interface PromptFormValues {
  prompt: string;
  num_thumbnails: number;
  headshot_url: string;
}

interface PromptFormProps {
  onSubmit: (values: PromptFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const COUNT_OPTIONS = [1, 2, 3] as const;

const PROMPT_SUGGESTIONS = [
  "A coding tutorial about React hooks",
  "I tried the new MacBook Pro for 30 days",
  "Top 10 productivity tips for developers",
];

export default function PromptForm({ onSubmit, isSubmitting }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [numThumbnails, setNumThumbnails] = useState<number>(3);
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit =
    !isSubmitting && prompt.trim().length > 4 && !!headshotUrl;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!headshotUrl) {
      setFormError("Please upload a headshot first.");
      return;
    }
    if (prompt.trim().length < 5) {
      setFormError("Tell us a little more about your video (5+ characters).");
      return;
    }

    try {
      await onSubmit({
        prompt: prompt.trim(),
        num_thumbnails: numThumbnails,
        headshot_url: headshotUrl,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setFormError(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid lg:grid-cols-5 gap-6 lg:gap-8"
    >
      {/* Left: headshot */}
      <div className="lg:col-span-2 space-y-2">
        <label className="text-sm font-medium text-white">
          1. Your headshot
        </label>
        <p className="text-xs text-slate-400">
          The person in this photo will appear in every generated thumbnail.
        </p>
        <div className="pt-2">
          <HeadshotUpload
            value={headshotUrl}
            onUploaded={setHeadshotUrl}
            onCleared={() => setHeadshotUrl(null)}
          />
        </div>
      </div>

      {/* Right: prompt + count + submit */}
      <div className="lg:col-span-3 space-y-6">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-white">
            2. Describe your video
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A 15-minute tutorial on building a SaaS in Next.js"
            rows={5}
            className="w-full resize-none rounded-xl bg-white/[0.03] border border-white/10 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-colors"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {PROMPT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            3. How many variations?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {COUNT_OPTIONS.map((n) => {
              const active = numThumbnails === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumThumbnails(n)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-fuchsia-400/60 bg-fuchsia-500/10"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  <div className="text-xl font-semibold text-white">{n}</div>
                  <div className="text-[11px] text-slate-400">
                    {n === 1 ? "Single style" : `${n} styles`}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            We'll generate one thumbnail per style: bold-dramatic, clean-minimal
            and vibrant-energetic.
          </p>
        </div>

        {formError && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white font-medium shadow-lg shadow-fuchsia-500/20 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? (
            <Loader size="sm" label="Submitting..." />
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate thumbnails
            </>
          )}
        </button>
      </div>
    </form>
  );
}
