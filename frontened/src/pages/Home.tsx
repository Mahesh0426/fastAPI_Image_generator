import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  ImageIcon,
  Zap,
  Layers,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    Icon: Wand2,
    title: "AI-powered styles",
    body: "Three curated thumbnail styles — bold-dramatic, clean-minimal and vibrant-energetic — generated in parallel.",
  },
  {
    Icon: ImageIcon,
    title: "Your face, every time",
    body: "Upload one headshot and we'll keep your likeness consistent across every generated thumbnail.",
  },
  {
    Icon: Layers,
    title: "Three platforms, one prompt",
    body: "Every thumbnail ships with YouTube (16:9), Shorts (9:16) and square (1:1) variants ready to download.",
  },
  {
    Icon: Zap,
    title: "Live progress streaming",
    body: "Watch each thumbnail appear the instant it's ready — no need to refresh or wait blindly.",
  },
];

const STYLES = [
  {
    title: "Bold & Dramatic",
    desc: "Cinematic lighting · dark moody backdrops · powerful composition.",
    gradient: "from-rose-600 via-orange-500 to-amber-400",
  },
  {
    title: "Clean & Minimal",
    desc: "Bright lighting · whitespace · sharp, professional aesthetic.",
    gradient: "from-sky-400 via-cyan-300 to-emerald-300",
  },
  {
    title: "Vibrant & Energetic",
    desc: "Colorful gradients · pop-art palette · dynamic angles.",
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
  },
];

export default function Home() {
  return (
    <div className="text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute top-40 right-10 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
            Powered by GPT-4o image generation
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-white">
            Click-worthy thumbnails,
            <span className="block bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
              generated in seconds.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Upload one headshot, describe your video, and get three on-brand
            thumbnail variations — sized for YouTube, Shorts and feeds — without
            opening a design tool.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white font-medium shadow-lg shadow-fuchsia-500/20 hover:opacity-95 transition-opacity"
            >
              <Wand2 className="w-4 h-4" />
              Generate my thumbnails
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#styles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 transition-colors"
            >
              See the styles
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            No signup · Free preview · You own every output
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-colors"
            >
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 border border-white/10">
                <Icon className="w-4 h-4 text-fuchsia-200" />
              </span>
              <h3 className="mt-4 text-white font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Styles */}
      <section id="styles" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Three styles, every time you generate
          </h2>
          <p className="mt-3 text-slate-400">
            Don't agonise over a single design. Get three distinct directions
            in parallel and pick the one that fits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {STYLES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div
                className={`h-40 bg-gradient-to-br ${s.gradient} relative`}
              >
                <div className="absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-rose-500/15 p-10 sm:p-14 text-center">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Ready to design your next thumbnail?
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto">
            Upload a headshot, write a prompt, and let the model do the heavy
            lifting. You'll have publish-ready files in under a minute.
          </p>
          <Link
            to="/generate"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Start generating
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
