import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/reviews/ReviewCard";

describe("Pagination", () => {
  it("moves to the requested page", () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={4} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(3);
  });
});

describe("ReviewCard", () => {
  it("sends the selected vote type", () => {
    const onVote = vi.fn();
    render(
      <ReviewCard
        review={{
          _id: "review-1",
          author: { name: "Student" },
          rating: 4,
          difficultyRating: 3,
          comment: "Helpful course",
          upvotes: 2,
        }}
        onVote={onVote}
      />,
    );
    fireEvent.click(screen.getByLabelText("Upvote review"));
    expect(onVote).toHaveBeenCalledWith("review-1", "upvote");
  });
});
