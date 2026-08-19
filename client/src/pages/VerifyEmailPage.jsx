import { useEffect, useState } from "react";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { verifyEmail } from "@/api/authApi";

function VerifyEmailPage() {
  const { token } = useParams();
  const [state, setState] = useState(() =>
    token
      ? { status: "loading", message: "" }
      : {
          status: "error",
          message: "This verification link is missing its token.",
        },
  );

  useEffect(() => {
    let active = true;

    if (!token) return undefined;

    verifyEmail(token)
      .then((response) => {
        if (active) {
          setState({
            status: "success",
            message: response?.data?.message || "Your email has been verified.",
          });
        }
      })
      .catch((requestError) => {
        if (!active) return;

        const backendMessage = requestError.response?.data?.error?.message;
        setState({
          status: "error",
          message: backendMessage || "This verification link is invalid or expired.",
        });
      });

    return () => {
      active = false;
    };
  }, [token]);

  const isSuccess = state.status === "success";
  const isLoading = state.status === "loading";

  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[#f8faf9] px-4 py-14 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <span
          className={`mx-auto grid size-14 place-items-center rounded-2xl ${
            isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isLoading ? (
            <span className="size-6 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />
          ) : isSuccess ? (
            <CheckCircle2 className="size-7" aria-hidden="true" />
          ) : (
            <XCircle className="size-7" aria-hidden="true" />
          )}
        </span>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          <MailCheck className="mr-2 inline size-4" aria-hidden="true" />
          Email verification
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {isLoading ? "Verifying your email" : isSuccess ? "Email verified" : "Verification failed"}
        </h1>
        <p
          className={`mt-4 text-sm leading-6 ${
            isSuccess ? "text-emerald-800" : "text-slate-600"
          }`}
          role={isLoading ? undefined : isSuccess ? "status" : "alert"}
        >
          {isLoading ? "Please wait while we confirm your email address." : state.message}
        </p>

        {!isLoading && (
          <Link
            to="/login"
            className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 font-semibold text-white hover:bg-emerald-700"
          >
            {isSuccess ? "Continue to login" : "Back to login"}
          </Link>
        )}
      </section>
    </main>
  );
}

export default VerifyEmailPage;
