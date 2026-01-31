import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DollarSign, Clock, CheckCircle, XCircle, Mail } from "lucide-react";

export default function Refund() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Refund Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 31, 2025</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Promptea, we want you to be completely satisfied with your experience. This Refund Policy outlines the circumstances under which refunds may be issued for premium features or subscriptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Free Tier</h2>
            <p className="text-muted-foreground leading-relaxed">
              Promptea offers a free tier with access to core features including practice challenges, the prompt library, and basic learning modules. No payment or refund applies to free tier usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Refund Eligibility
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may be eligible for a refund under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Technical issues preventing access to paid features</li>
              <li>Duplicate charges or billing errors</li>
              <li>Request made within 7 days of purchase</li>
              <li>Service not delivered as described</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-primary" />
              Non-Refundable Items
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refunds will NOT be issued for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Change of mind after 7 days</li>
              <li>Failure to use the service</li>
              <li>Partial subscription periods</li>
              <li>Account termination due to Terms of Service violations</li>
              <li>Third-party service fees (OpenAI API usage)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Refund Timeline
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">7-Day Money-Back Guarantee</h3>
                <p className="text-muted-foreground">
                  For premium subscriptions, you can request a full refund within 7 days of your initial purchase if you're not satisfied with the service.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Approved refunds are processed within 5-10 business days. The refund will be credited to your original payment method.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Subscription Cancellations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can cancel your subscription at any time through your account settings:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Cancellations take effect at the end of the current billing period</li>
              <li>You retain access to premium features until the period ends</li>
              <li>No refunds for unused time in the current billing period</li>
              <li>You can reactivate your subscription at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">How to Request a Refund</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Contact our support team at <strong>support@promptea.com</strong></li>
              <li>Include your account email and transaction details</li>
              <li>Explain the reason for your refund request</li>
              <li>Allow 2-3 business days for review</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Billing Disputes</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you notice an unauthorized charge or billing error, please contact us immediately. We will investigate and resolve the issue promptly. Do not initiate a chargeback before contacting us, as this may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Special Circumstances</h2>
            <p className="text-muted-foreground leading-relaxed">
              We understand that exceptional situations may arise. If you have a unique circumstance not covered by this policy, please contact us. We review each case individually and may make exceptions at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Contact Support
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For refund requests or billing questions, please contact us at:
            </p>
            <p className="text-foreground font-medium mt-2">support@promptea.com</p>
            <p className="text-muted-foreground mt-2">
              Our support team is available Monday-Friday, 9 AM - 5 PM EST
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of paid services after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
