import { describe, expect, it } from "vitest";
import { getErrorMessage, isEmptyResponse } from "@/api/client";

describe("API error helpers", () => {
  it("keeps backend validation messages", () => {
    const error = {
      response: { data: { error: { message: "Only EDU emails are allowed" } } },
    };
    expect(getErrorMessage(error)).toBe("Only EDU emails are allowed");
  });

  it("recognizes empty catalog responses", () => {
    expect(
      isEmptyResponse({
        response: { status: 404, data: { error: { code: "NOT_FOUND" } } },
      }),
    ).toBe(true);
  });
});
