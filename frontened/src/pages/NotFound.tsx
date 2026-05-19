import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="text-slate-100 max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-sm tracking-widest uppercase text-fuchsia-300">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-white">
        Page not found
      </h1>
      <p className="mt-3 text-slate-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
      >
        <HomeIcon className="w-4 h-4" />
        Back home
      </Link>
    </div>
  );
}
