import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delete Your Welltread Account",
  description:
    "How to request deletion of your Welltread account and the data associated with it.",
};

const LAST_UPDATED = "May 3, 2026";

export default function DeleteAccountPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-sage tracking-tight mb-2">
          Delete your Welltread account
        </h1>
        <p className="text-sm text-ink-soft mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="bg-paper-warm border border-line rounded-2xl p-6 mb-10">
          <p className="text-ink font-medium mb-2">In short</p>
          <p className="text-ink-soft text-sm leading-relaxed">
            Email{" "}
            <a
              href="mailto:hello@welltread.co?subject=Delete%20my%20Welltread%20account"
              className="text-sage underline"
            >
              hello@welltread.co
            </a>{" "}
            from the address associated with your account, with the subject
            &ldquo;Delete my Welltread account.&rdquo; We will permanently
            delete your account and the personal data tied to it within 30
            days. We retain certain financial records as required by law (see
            below).
          </p>
        </div>

        <Section title="Steps to request account deletion">
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              Send an email to{" "}
              <a
                href="mailto:hello@welltread.co?subject=Delete%20my%20Welltread%20account"
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
                Delete my Welltread account
              </span>
            </li>
            <li>
              You will receive a confirmation reply within 2 business days.
              We complete the deletion within 30 days of the request.
            </li>
          </ol>
          <p>
            If you cannot send from the email associated with your account
            (for example, you no longer have access to it), include any
            information that helps us verify your identity, such as the
            approximate sign-up date and the name on file. We may follow up
            with additional verification questions.
          </p>
        </Section>

        <Section title="What we delete">
          <p>
            When we process your request, we permanently delete the following
            data tied to your account:
          </p>
          <ul>
            <li>
              Your account record (email address, password hash, account
              creation timestamp)
            </li>
            <li>
              Your quiz responses (age range, niche selection, mobility
              concerns, daily activity, prior exercise history, free-text
              answers)
            </li>
            <li>
              Your assigned movement plan and any personalization metadata
              derived from your responses
            </li>
            <li>
              Session completions, weekly check-ins, &ldquo;this hurts&rdquo;
              flags, and your full progress history
            </li>
            <li>
              Email-signup records and any subscription preferences linked to
              your account
            </li>
            <li>
              Any user-generated content tied to your account
            </li>
          </ul>
        </Section>

        <Section title="What we retain (and why)">
          <p>
            A limited set of records is retained after account deletion where
            we are legally required to do so or where deletion would
            compromise security or fraud prevention:
          </p>
          <ul>
            <li>
              <strong>Financial and billing records</strong> - if you ever
              held a paid subscription, we retain invoices, payment records,
              and tax-relevant transaction metadata for up to seven (7) years,
              as required by US tax and accounting law. Your name and email
              are pseudonymized in these records where possible.
            </li>
            <li>
              <strong>Aggregated and anonymized analytics</strong> - usage
              statistics that cannot be linked back to you as an individual
              are retained indefinitely for product improvement.
            </li>
            <li>
              <strong>Security logs</strong> - access logs that may contain
              IP addresses are retained for up to 90 days for security and
              fraud prevention, then automatically purged.
            </li>
          </ul>
        </Section>

        <Section title="Cancelling a paid subscription">
          <p>
            Account deletion <strong>does not</strong> automatically cancel
            an active paid subscription. To stop future charges, cancel your
            subscription first via your{" "}
            <Link href="/app/profile" className="text-sage underline">
              Profile screen
            </Link>{" "}
            in the app, or by emailing{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>
            . Then request account deletion. You will retain access through
            the end of the current billing period unless deletion is processed
            sooner.
          </p>
        </Section>

        <Section title="Third-party processors">
          <p>
            Where personal data has been transferred to processors who act on
            our behalf (such as our payment processor, our email service
            provider, or our AI text-normalization provider), we forward the
            deletion request to those processors as part of completing your
            request. Specifics are documented in our{" "}
            <Link href="/privacy" className="text-sage underline">
              Privacy Policy
            </Link>
            .
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
