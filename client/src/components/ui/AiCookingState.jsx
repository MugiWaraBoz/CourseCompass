import { Sparkles } from "lucide-react";

const messages = [
  "Your review is cooking...",
  "Gemini is gathering the useful details...",
  "Turning student feedback into a clear summary...",
];

function AiCookingState({ label = "Working with Gemini" }) {
  return (
    <div className="mt-5 rounded-2xl border border-emerald-200 bg-white/70 p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800">
        <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full w-2/5 animate-[ai-progress_1.6s_ease-in-out_infinite] rounded-full bg-emerald-600" />
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {messages[0]} Please keep this page open.
      </p>
    </div>
  );
}

export default AiCookingState;
