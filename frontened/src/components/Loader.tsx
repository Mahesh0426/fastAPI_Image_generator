import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export default function Loader({
  label,
  size = "md",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-slate-300 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`${sizeMap[size]} animate-spin text-fuchsia-400`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
