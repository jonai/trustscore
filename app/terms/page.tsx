import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              TrustScore
            </span>
          </Link>
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
        <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>

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
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using TrustScore, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground">
              TrustScore provides website analysis services, including
              performance, SEO, accessibility, and security assessments. Paid
              services include certification badges and dofollow backlinks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Certification Service
            </h2>
            <p className="text-muted-foreground mb-4">
              The lifetime certification includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>A certified badge for your website</li>
              <li>A public certification page with a dofollow backlink</li>
              <li>Daily automated score monitoring</li>
              <li>Listing in our certified websites directory</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Payment and Refunds
            </h2>
            <p className="text-muted-foreground">
              All payments are processed securely through Stripe. The lifetime
              certification is a one-time payment of $35. Refunds are available
              within 30 days of purchase if you are not satisfied with the
              service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. User Conduct
            </h2>
            <p className="text-muted-foreground">
              You agree not to use TrustScore for any illegal purposes or to
              analyze websites you do not own or have permission to analyze for
              certification purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              TrustScore is provided "as is" without warranties of any kind. We
              are not responsible for any damages arising from the use of our
              service or reliance on the scores provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Contact
            </h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at
              legal@trustscore.app
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
