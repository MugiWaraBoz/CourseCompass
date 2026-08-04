import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));

describe("ProtectedRoute", () => {
  beforeEach(() => vi.clearAllMocks());
  it("redirects logged-out visitors to login", () => {
    useAuth.mockReturnValue({ token: null, loading: false });
    render(<MemoryRouter initialEntries={["/profile"]}><Routes><Route path="/profile" element={<ProtectedRoute><div>Private</div></ProtectedRoute>}/><Route path="/auth/login" element={<div>Login page</div>}/></Routes></MemoryRouter>);
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
  it("renders protected content for a session", () => {
    useAuth.mockReturnValue({ token: "token", loading: false });
    render(<MemoryRouter><ProtectedRoute><div>Private</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByText("Private")).toBeInTheDocument();
  });
});
