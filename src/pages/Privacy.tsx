import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 31, 2025</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Promptea, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Email address and name when you create an account</li>
                  <li>Profile information you choose to provide</li>
                  <li>Authentication credentials (securely hashed)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Prompts you create and submit</li>
                  <li>Challenge submissions and scores</li>
                  <li>Learning progress and achievements</li>
                  <li>Saved prompts and favorites</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Usage patterns and feature interactions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide and maintain our services</li>
              <li>Personalize your learning experience</li>
              <li>Evaluate and improve prompt submissions</li>
              <li>Track progress and award achievements</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to improve the platform</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information. This includes encryption of data in transit and at rest, secure authentication protocols, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>OpenAI:</strong> For AI-powered evaluations and prompt generation</li>
              <li><strong>Supabase:</strong> For authentication and database services</li>
              <li><strong>Qdrant:</strong> For semantic search functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" />
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. If you request account deletion, we will remove your personal information within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-foreground font-medium mt-2">privacy@promptea.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
