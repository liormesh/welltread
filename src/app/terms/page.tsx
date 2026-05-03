import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service - Welltread",
  description:
    "The terms governing your use of Welltread's websites, mobile app, and services.",
};

const LAST_UPDATED = "May 3, 2026";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-sage tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-ink-soft mb-12">Last updated: {LAST_UPDATED}</p>

        <Section title="1. Acceptance of these terms">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
            and use of the websites at welltread.co and welltread.app, the
            Welltread mobile application, and any related services
            (collectively, the &ldquo;Service&rdquo;) provided by Welltread,
            Inc. (&ldquo;Welltread,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
            By creating an account, accessing, or using the Service, you agree
            to be bound by these Terms and our{" "}
            <Link href="/privacy" className="text-sage underline">
              Privacy Policy
            </Link>
            . If you do not agree, do not use the Service.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least 18 years old and capable of entering into a
            binding contract to use the Service. The Service is designed for
            adults aged 40 and over, but is available to any qualifying adult
            user.
          </p>
        </Section>

        <Section title="3. Health disclaimer (please read)">
          <p>
            Welltread provides general wellness and fitness content. It is{" "}
            <strong>not medical advice</strong>, not a medical device, and not
            a substitute for consultation with a qualified healthcare provider.
            See our full{" "}
            <Link href="/health-disclaimer" className="text-sage underline">
              Health Disclaimer
            </Link>{" "}
            for details on the risks of physical exercise, when to consult a
            professional, and your acknowledgment of those risks. By using the
            Service, you accept and agree to that disclaimer.
          </p>
        </Section>

        <Section title="4. Account">
          <p>
            You are responsible for keeping your login credentials secure and
            for all activity that occurs under your account. Notify us
            immediately at{" "}
            <a href="mailto:hello@welltread.co" className="text-sage underline">
              hello@welltread.co
            </a>{" "}
            if you suspect unauthorized access. You may close your account at
            any time from the Settings screen or by emailing us.
          </p>
        </Section>

        <Section title="5. Subscriptions, billing, and refunds">
          <p>
            Welltread is offered on a subscription basis. Subscription tiers,
            prices, and billing intervals are displayed at sign-up. Payment is
            processed through our payment provider (Stripe). By subscribing,
            you authorize us to charge your selected payment method on a
            recurring basis until you cancel.
          </p>
          <ul>
            <li>
              <strong>Free trial:</strong> If a paid trial is offered (for
              example, $1 for 7 days), it converts automatically to the listed
              recurring rate at the end of the trial unless you cancel before
              the trial ends.
            </li>
            <li>
              <strong>Cancellation:</strong> You can cancel any time from your
              Settings or by emailing us. Cancellation stops future charges;
              you retain access through the end of the current billing period.
            </li>
            <li>
              <strong>Refunds:</strong> All payments are non-refundable except
              where required by law. EU/UK consumers have a 14-day right of
              withdrawal from the date of purchase, provided the digital
              service has not been substantially consumed. To request a
              refund, email{" "}
              <a href="mailto:hello@welltread.co" className="text-sage underline">
                hello@welltread.co
              </a>
              .
            </li>
            <li>
              <strong>Price changes:</strong> We may change subscription
              pricing on renewal. We will notify you at least 30 days in
              advance.
            </li>
          </ul>
        </Section>

        <Section title="6. Acceptable use">
          <p>You agree not to:</p>
          <ul>
            <li>Reverse engineer, decompile, or scrape the Service</li>
            <li>Resell, rent, or sublicense access to your account</li>
            <li>
              Upload or transmit content that infringes intellectual-property
              rights, defames, threatens, or harasses any person, or violates
              applicable law
            </li>
            <li>
              Use the Service to develop a competing product or to train
              machine-learning models
            </li>
            <li>Interfere with the operation of the Service or its security</li>
          </ul>
        </Section>

        <Section title="7. Intellectual property">
          <p>
            All content provided through the Service - including videos,
            audio, copy, illustrations, code, and the Welltread name, logo,
            and brand marks - is owned by Welltread or its licensors and
            protected by copyright, trademark, and other laws. We grant you a
            limited, non-exclusive, non-transferable license to access and use
            the Service for personal, non-commercial purposes during the
            period your subscription is active.
          </p>
          <p>
            You retain ownership of any content you submit (for example, quiz
            answers and free-text responses). You grant us a license to use
            that content as necessary to provide and improve the Service.
          </p>
        </Section>

        <Section title="8. Termination">
          <p>
            We may suspend or terminate your access if you breach these Terms,
            engage in fraudulent or harmful behavior, or if required by law.
            Sections that by their nature should survive termination will
            survive (including intellectual property, disclaimers, limitations
            of liability, indemnification, and governing law).
          </p>
        </Section>

        <Section title="9. Disclaimers">
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranty of any kind. We disclaim all
            warranties, express or implied, including merchantability, fitness
            for a particular purpose, and non-infringement. We do not warrant
            that the Service will be uninterrupted, error-free, or produce any
            specific health or fitness outcome.
          </p>
        </Section>

        <Section title="10. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Welltread and its
            officers, employees, and affiliates will not be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            or any loss of profits, revenue, data, or use, arising out of or
            in connection with the Service. Our total liability for any claim
            arising under these Terms will not exceed the greater of $100 USD
            or the amount you paid us in the twelve months preceding the
            claim.
          </p>
          <p>
            Some jurisdictions do not allow exclusion of certain warranties or
            limitation of liability; in those jurisdictions, our liability is
            limited to the extent permitted by law.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify and hold harmless Welltread from any
            claims, losses, or damages, including reasonable attorneys&rsquo;
            fees, arising out of your use of the Service, your violation of
            these Terms, or your violation of any third-party right.
          </p>
        </Section>

        <Section title="12. Governing law and disputes">
          <p>
            These Terms are governed by the laws of the State of Delaware,
            United States, without regard to conflict-of-law principles. Any
            dispute arising out of or relating to these Terms or the Service
            will be resolved exclusively in the state or federal courts
            located in Delaware, and you consent to the personal jurisdiction
            of those courts.
          </p>
        </Section>

        <Section title="13. Changes to these terms">
          <p>
            We may update these Terms from time to time. Material changes will
            be communicated via email or a prominent notice on the Service.
            Continued use after the effective date of any change constitutes
            acceptance.
          </p>
        </Section>

        <Section title="14. Contact">
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
          <Link href="/privacy" className="text-sage underline">
            Privacy Policy
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
