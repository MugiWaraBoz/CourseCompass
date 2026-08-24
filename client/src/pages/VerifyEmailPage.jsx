import { useEffect, useState } from "react";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { verifyEmail } from "@/api/authApi";

/**
 * VerifyEmailPage
 * Automatically verifies the user's email when the page loads by reading
 * the token from the URL and calling the verifyEmail API.
 * Shows a loading spinner, then either a success or error state.
 */
function VerifyEmailPage() {
  // Extract the :token route parameter from the current URL
  const { token } = useParams();

  // useNavigate gives us a function to programmatically redirect the user
  const navigate = useNavigate();

  // useState with a lazy initializer: runs only once on mount.
  // If a token is present we start in "loading"; otherwise immediately show an error.
  const [state, setState] = useState(() =>
    token
      ? { status: "loading", message: "" }
      : {
          status: "error",
          message: "This verification link is missing its token.",
        },
  );

  // useEffect runs the verification API call as soon as the component mounts.
  // The dependency array ensures it re-runs only if navigate or token change.
  useEffect(() => {
    // "active" flag prevents state updates if the component has already unmounted
    // (avoids the React "Can't perform a React state update on an unmounted component" warning)
    let active = true;

    // If there is no token, bail out early — don't make an API call
    if (!token) return undefined;

    // Fire-and-forget the verification request
    verifyEmail(token)
      .then((response) => {
        // Only update state if the component is still mounted
        if (active) {
          const verificationMessage =
            response?.data?.message || "Email verified successfully. You can now log in.";
          setState({
            status: "success",
            message: verificationMessage,
          });
          // Successful verification always takes the student to the login page.
          navigate("/login", {
            replace: true,
            state: { verificationMessage },
          });
        }
      })
      .catch((requestError) => {
        // Ignore errors if the component unmounted during the request
        if (!active) return;

        const backendMessage = requestError.response?.data?.error?.message;
        setState({
          status: "error",
          message: backendMessage || "This verification link is invalid or expired.",
        });
      });

    // Cleanup function: sets active to false so pending promises skip setState
    return () => {
      active = false;
    };
  }, [navigate, token]);

  // Derived booleans make the JSX template more readable
  const isSuccess = state.status === "success";
  const isLoading = state.status === "loading";

  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[#f8faf9] px-4 py-14 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        {/* Status icon — shows a spinner while loading, check on success, X on error */}
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
        {/* The role attribute tells screen readers whether this is informational or an error */}
        <p
          className={`mt-4 text-sm leading-6 ${
            isSuccess ? "text-emerald-800" : "text-slate-600"
          }`}
          role={isLoading ? undefined : isSuccess ? "status" : "alert"}
        >
          {isLoading ? "Please wait while we confirm your email address." : state.message}
        </p>

        {/* The link is hidden while loading since the useEffect will auto-redirect on success */}
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
