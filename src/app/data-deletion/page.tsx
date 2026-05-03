import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Request Data Deletion - Welltread",
  description:
    "How to request deletion of specific Welltread data without closing your account.",
};

const LAST_UPDATED = "May 3, 2026";

export default function DataDeletionPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-sage tracking-tight mb-2">
          Request data deletion
        </h1>
        <p className="text-sm text-ink-soft mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="bg-paper-warm border border-line rounded-2xl p-6 mb-10">
          <p className="text-ink font-medium mb-2">In short</p>
          <p className="text-ink-soft text-sm leading-relaxed">
            You can ask Welltread to delete specific categories of your data
            without closing your account. Email{" "}
            <a
              href="mailto:hello@welltread.co?subject=Delete%20specific%20Welltread%20data"
              className="text-sage underline"
            >
              hello@welltread.co
            </a>{" "}
            from the address tied to your account, list the data you want
            removed, and we will complete the deletion within 30 days.
          </p>
        </div>

        <Section title="When to use this vs deleting your account">
          <p>
            This page is for <strong>partial deletion</strong> requests - you
            want to remove specific data but keep your Welltread account
            active. If you want to close your account entirely, use{" "}
            <Link href="/delete-account" className="text-sage underline">
              the account deletion process
            </Link>{" "}
            instead.
          </p>
        </Section>

        <Section title="Steps to request data deletion">
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              Send an email to{" "}
              <a
                href="mailto:hello@welltread.co?subject=Delete%20specific%20Welltread%20data"
                className="text-sage underline"
              >
                hello@welltread.co
              </a>{" "}
              <strong>from the email address associated with your
              Welltread account</strong>. We use the sending address to
              authenticate the request.
            </li>
            <li>
              Use the subject line:{" "}
              <span className="font-mono text-sm bg-paper-warm px-2 py-0.5 rounded">
                Delete specific Welltread data
              </span>
            </li>
            <li>
              In the body, list the categories of data you want deleted (see
              below for what we hold and what is independently deletable).
            </li>
            <li>
              You will receive a confirmation reply within 2 business days.
              We complete the deletion within 30 days of the request.
            </li>
          </ol>
        </Section>

        <Section title="Categories you can request to delete independently">
          <ul>
            <li>
              <strong>Quiz responses.</strong> Your answers to the 28-question
              movement assessment, including age range, niche, mobility
              concerns, prior exercise history, and free-text responses. If
              deleted, your existing plan remains in place but cannot be
              re-personalized without re-taking the quiz.
            </li>
            <li>
              <strong>Session and progress history.</strong> Daily
              completions, weekly check-ins, &ldquo;this hurts&rdquo; flags.
              Your current plan and account remain active; only past
              progress is removed.
            </li>
            <li>
              <strong>Communications history.</strong> Records of which
              emails we sent you and when (delivery, open, and click logs).
              Marketing email opt-out can also be done from any email
              footer.
            </li>
            <li>
              <strong>Free-text responses processed by AI.</strong> The Q19
              free-text answer that we send to Anthropic for plan-copy
              normalization. The plan copy itself remains; the source text
              is removed.
            </li>
            <li>
              <strong>Approximate location data.</strong> IP-derived
              geolocation in our logs (used for security and analytics). Not
              tied to any user-facing feature.
            </li>
          </ul>
        </Section>

        <Section title="Data we cannot delete on partial-deletion request">
          <p>
            Some categories can only be deleted by closing your account, or
            cannot be deleted at all due to legal retention obligations:
          </p>
          <ul>
            <li>
              <strong>Account record</strong> (email, password hash) - to
              delete this you must{" "}
              <Link href="/delete-account" className="text-sage underline">
                close your account
              </Link>
              .
            </li>
            <li>
              <strong>Active subscription billing data</strong> - retained
              while your subscription is active so we can bill you and
              provide service. Cancel the subscription first, then request
              deletion.
            </li>
            <li>
              <strong>Financial and tax records</strong> - retained for up to
              7 years per US tax and accounting law. We cannot delete these
              even on full account closure.
            </li>
            <li>
              <strong>Aggregated, anonymized analytics</strong> - cannot be
              tied back to you and is retained indefinitely for product
              improvement.
            </li>
          </ul>
        </Section>

        <Section title="Verification">
          <p>
            We use the sending email address to authenticate your request. If
            you cannot send from your account email, include enough
            information in the request to help us verify your identity (for
            example, your sign-up date, your name on file, or recent
            activity). We may follow up with verification questions before
            processing.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Welltread, Inc.
            <br />
            Email:{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>
          </p>
          <p>
            See also:{" "}
            <Link href="/delete-account" className="text-sage underline">
              Delete your account
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-sage underline">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/terms" className="text-sage underline">
              Terms of Service
            </Link>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-ink mb-3">{title}</h2>
      <div className="text-ink-soft space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-sage">
        {children}
      </div>
    </section>
  );
}
