import { Code2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} ThumbCraft. AI thumbnails for creators.
        </p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="text-xs flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            using FastAPI + React
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
            aria-label="Source code"
          >
            <Code2 className="w-4 h-4" />
            <span className="text-xs">Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
