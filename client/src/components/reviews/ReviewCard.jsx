// Presents one student review with ratings, votes, and optional owner actions.
import { BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import Rating from "@/components/common/Rating";

export default function ReviewCard({ review, onVote, actions }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-slate-900">
              {review.author?.name || "Your review"}
            </strong>
            {review.verified && (
              <BadgeCheck
                className="size-4 text-emerald-600"
                aria-label="Verified student"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {review.semester} {date && `· ${date}`}
          </p>
        </div>
        <div className="flex gap-4">
          <span>
            <small className="block text-xs text-slate-400">Overall</small>
            <Rating value={review.rating} />
          </span>
          <span>
            <small className="block text-xs text-slate-400">Difficulty</small>
            <strong className="text-sm text-slate-800">
              {Number(review.difficultyRating || 0).toFixed(1)}/5
            </strong>
          </span>
        </div>
      </div>
      <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-700">
        {review.comment}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          <button
            aria-label="Upvote review"
            disabled={!onVote}
            onClick={() => onVote?.(review._id, "upvote")}
            className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60"
          >
            <ChevronUp className="size-4" />
            {review.upvotes || 0}
          </button>
          <button
            aria-label="Downvote review"
            disabled={!onVote}
            onClick={() => onVote?.(review._id, "downvote")}
            className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs text-slate-600 hover:border-red-200 hover:text-red-600 disabled:opacity-60"
          >
            <ChevronDown className="size-4" />
            {review.downvotes || 0}
          </button>
        </div>
        {actions}
      </div>
    </article>
  );
}
