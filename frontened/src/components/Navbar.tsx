import { Link, NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const linkBase =
    "text-sm font-medium px-3 py-2 rounded-md transition-colors";
  const linkInactive = "text-slate-300 hover:text-white hover:bg-white/5";
  const linkActive = "text-white bg-white/10";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </span>
          <span className="text-white font-semibold tracking-tight text-lg">
            ThumbCraft<span className="text-fuchsia-400">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Generate
          </NavLink>
          <Link
            to="/generate"
            className="ml-2 inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Try it free
          </Link>
        </nav>
      </div>
    </header>
  );
}
