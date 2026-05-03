import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Welltread",
  description:
    "How Welltread collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "May 3, 2026";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-sage tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-soft mb-12">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            Welltread, Inc. (&ldquo;Welltread,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) operates the websites at{" "}
            <span className="font-medium">welltread.co</span> and{" "}
            <span className="font-medium">welltread.app</span> and the Welltread
            mobile application (collectively, the &ldquo;Service&rdquo;). We
            provide personalized movement programs for adults 40 and over.
          </p>
          <p>
            For privacy questions or requests, contact us at{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>
            .
          </p>
        </Section>

        <Section title="Information we collect">
          <p>We collect the following categories of personal information:</p>
          <ul>
            <li>
              <strong>Account information.</strong> Email address, password (if
              you set one), and the timestamp at which you created your account.
            </li>
            <li>
              <strong>Quiz responses.</strong> Your answers to our movement
              assessment, which includes age range, niche selection, mobility
              concerns, daily activity, prior exercise history, and free-text
              responses about your movement goals.
            </li>
            <li>
              <strong>Plan and usage data.</strong> Your assigned movement plan,
              session completions, weekly check-ins, &ldquo;this hurts&rdquo;
              flags, and progress over time.
            </li>
            <li>
              <strong>Billing information.</strong> If you subscribe, our
              payment processor (Stripe) collects your payment details. We do
              not store full card numbers; we receive a token and metadata
              about your subscription status.
            </li>
            <li>
              <strong>Communications.</strong> Records of emails we send you,
              including delivery, open, and click events from our email
              service.
            </li>
            <li>
              <strong>Technical data.</strong> IP address, browser, device
              type, operating system, and approximate location (derived from
              IP). This is used for security, analytics, and to deliver the
              Service.
            </li>
            <li>
              <strong>Cookies and similar technologies.</strong> We use
              first-party cookies for authentication and to remember
              preferences. We do not currently use third-party advertising
              cookies; this may change in the future, and we will update this
              policy and provide a consent mechanism in jurisdictions where
              required.
            </li>
          </ul>
        </Section>

        <Section title="How we use your information">
          <ul>
            <li>To create and manage your account</li>
            <li>To deliver your personalized movement plan and track progress</li>
            <li>To process payments and manage subscriptions</li>
            <li>
              To send transactional emails (account confirmations, plan
              reminders, billing notices) and, if you opt in, marketing emails
            </li>
            <li>To improve the Service through aggregated analytics</li>
            <li>
              To comply with legal obligations and enforce our{" "}
              <Link href="/terms" className="text-sage underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </Section>

        <Section title="Service providers we share data with">
          <p>
            We share personal information with the following third-party
            processors strictly to provide the Service. Each operates under
            contractual data-protection terms.
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> (Singapore, AWS) - database and
              authentication
            </li>
            <li>
              <strong>Cloudflare</strong> (United States) - hosting, content
              delivery, edge compute
            </li>
            <li>
              <strong>Stripe</strong> (United States) - payment processing
            </li>
            <li>
              <strong>Resend</strong> (United States) - transactional and
              marketing email
            </li>
            <li>
              <strong>Anthropic</strong> (United States) - AI processing of
              your free-text quiz answers to personalize plan copy. Anthropic
              does not train its models on this data per its commercial API
              terms.
            </li>
          </ul>
          <p>
            We do not sell your personal information. We do not share it with
            advertisers for cross-context behavioral advertising.
          </p>
        </Section>

        <Section title="International data transfers">
          <p>
            Welltread operates in the United States. If you use the Service
            from outside the US, your information will be transferred to,
            stored, and processed in the US and other countries where our
            service providers operate. We rely on standard contractual clauses
            and similar mechanisms to safeguard cross-border transfers.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            We retain account and plan data for as long as your account is
            active. After account deletion, we retain limited records necessary
            for legal and accounting purposes (typically up to seven years for
            financial records). We retain anonymized analytics indefinitely.
          </p>
        </Section>

        <Section title="Your rights">
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction or deletion</li>
            <li>Object to or restrict certain processing</li>
            <li>
              Request a portable copy of your data in a machine-readable format
            </li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>{" "}
            from the address associated with your account. We respond within 30
            days.
          </p>
          <p>
            <strong>California residents</strong> have specific rights under
            the CCPA/CPRA, including the right to know, delete, correct, and
            opt out of &ldquo;sales&rdquo; or &ldquo;sharing&rdquo; of personal
            information. We do not sell or share personal information as those
            terms are defined under California law.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Welltread is intended for adults aged 18 and over, and our movement
            content targets adults aged 40 and over. We do not knowingly
            collect personal information from children under 13. If you believe
            we have collected information from a child, contact us at{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>{" "}
            and we will delete it.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use industry-standard security measures, including TLS encryption
            in transit, encrypted credentials at rest, and access controls
            limiting employee data access to those with a business need. No
            method of transmission or storage is 100% secure; we cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will
            be communicated via email or a prominent notice on the Service. The
            &ldquo;Last updated&rdquo; date at the top reflects the latest
            revision. Continued use of the Service after changes take effect
            constitutes acceptance.
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
        </Section>

        <hr className="my-12 border-line/60" />
        <p className="text-sm text-ink-soft">
          See also:{" "}
          <Link href="/terms" className="text-sage underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/health-disclaimer" className="text-sage underline">
            Health Disclaimer
          </Link>
          .
        </p>
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
