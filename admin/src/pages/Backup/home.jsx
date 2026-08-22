import { InputForm } from '@/components/auth/login_form.jsx';

function Home() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),transparent_33%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.18),transparent_30%),linear-gradient(135deg,_#020817_0%,_#0f172a_48%,_#111827_100%)] text-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex h-full flex-col justify-center rounded-[28px] border border-cyan-400/15 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-sm md:p-10">
              <div className="mb-6 inline-flex max-w-fit items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Moderator portal
              </div>

              <h1 className="mb-5 max-w-xl text-4xl font-black tracking-tight text-white md:text-5xl">
                Welcome to CourseCompass
              </h1>

              <p className="max-w-xl text-lg leading-8 text-slate-200 md:text-xl">
                Moderate and control the CourseCompass platform with ease.
                Access the admin dashboard to manage courses, faculty, and
                student data efficiently.
              </p>
            </div>

            <div className="rounded-[28px] border border-cyan-400/15 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-sm md:p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Access portal
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Admin Login
                </h2>
              </div>

              <p className="mb-6 text-base leading-7 text-slate-300">
                Please enter your credentials to access the admin/moderator
                dashboard.
              </p>

              <InputForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
