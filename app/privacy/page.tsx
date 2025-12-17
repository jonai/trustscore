import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteLogo } from "@/components/site-logo";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <SiteLogo size="md" />
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when
              you analyze a website, create an account, or contact us. This
              includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Email address (when you purchase certification)</li>
              <li>Website URLs you analyze</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Data Sharing
            </h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third
              parties. Certified website information is publicly displayed on
              our platform as part of the certification service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your
              personal information. Payment processing is handled by Stripe, a
              PCI-compliant payment processor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please
              contact us at privacy@trustscore.app
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
