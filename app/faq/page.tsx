import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteLogo } from "@/components/site-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is VerifiedTrustScore?",
    answer:
      "VerifiedTrustScore is a website analysis tool that evaluates your site's performance, SEO, accessibility, security, and overall quality. We provide detailed reports and offer lifetime certification with a dofollow backlink.",
  },
  {
    question: "How is the score calculated?",
    answer:
      "Your overall score is the average of four key metrics: Performance, SEO, Accessibility, and Best Practices. Each category is scored from 0-100 using Google's PageSpeed Insights API combined with our own HTML and security analysis.",
  },
  {
    question: "What do I get with certification?",
    answer:
      "With the $35 lifetime certification, you get: a verified trust badge for your website, a public certification page with a dofollow backlink, daily automated monitoring, and a listing in our certified websites directory.",
  },
  {
    question: "Is the backlink really dofollow?",
    answer:
      "Yes! Unlike many directories that use nofollow links, your certification page includes a dofollow link to your website, which can help improve your domain authority and SEO.",
  },
  {
    question: "How often is my score updated?",
    answer:
      "Certified websites are automatically re-audited daily. Your public certification page always shows your current score and historical trends.",
  },
  {
    question: "Can I analyze any website?",
    answer:
      "You can analyze any publicly accessible website for free. However, certification is only available for websites you own or have permission to certify.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and Apple Pay through our secure payment processor, Stripe.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your certification, contact us for a full refund.",
  },
  {
    question: "Are the free tools really free?",
    answer:
      "Yes! Our Open Graph Preview, Security Headers Checker, and Meta Tag Checker tools are 100% free to use with no login required.",
  },
  {
    question: "How do I embed the badge on my website?",
    answer:
      "After certification, visit your badge page at /certified/[your-domain]/badge to get HTML and Markdown snippets you can copy and paste into your website.",
  },
];

export default function FAQPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about VerifiedTrustScore and our
            certification service.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 border border-white/10 rounded-xl px-6 data-[state=open]:bg-white/10"
            >
              <AccordionTrigger className="text-left text-white hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-4">
            We're here to help! Contact us anytime.
          </p>
          <a
            href="mailto:support@trustscore.app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
