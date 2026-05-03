import { Suspense } from "react";
import { LoginForm } from "@/components/app/LoginForm";

export const metadata = {
  title: "Sign in - Welltread",
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
            Welltread
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink leading-tight">
            Welcome back.
          </h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Sign in with your email and password, or get a magic link.
          </p>
        </div>

        <Suspense fallback={<p className="text-ink-soft text-sm">Loading...</p>}>
          <LoginForm />
        </Suspense>

        <p className="mt-12 text-xs text-ink-soft/70">
          New here?{" "}
          <a
            href="https://welltread.co/quiz"
            className="text-sage underline-offset-4 hover:underline"
          >
            Take the assessment
          </a>{" "}
          and we&rsquo;ll build your plan.
        </p>
      </div>
    </main>
  );
}
