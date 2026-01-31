import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 31, 2025</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Promptea, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Acceptable Use
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree to use Promptea only for lawful purposes. You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the platform to harass, abuse, or harm others</li>
              <li>Create multiple accounts to manipulate rankings or achievements</li>
              <li>Share your account credentials with others</li>
              <li>Use automated tools to scrape or extract data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">User Accounts</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, you must provide accurate and complete information. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in suspicious activity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content on Promptea, including text, graphics, logos, and software, is owned by Promptea or its licensors and protected by copyright and trademark laws.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of prompts and content you create. By submitting content, you grant us a worldwide, non-exclusive license to use, display, and distribute your content for platform operations and improvements.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">AI-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform uses AI models (including OpenAI's GPT-4) to evaluate prompts and generate challenges. While we strive for accuracy, AI-generated evaluations and feedback are provided "as is" and may contain errors or biases. You should use your own judgment when applying AI feedback.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Scoring and Rankings</h2>
            <p className="text-muted-foreground leading-relaxed">
              Challenge scores, rankings, and achievements are determined by our AI evaluation system and platform algorithms. We reserve the right to adjust scores or rankings if we detect manipulation, errors, or violations of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Promptea is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free. We are not responsible for any loss of data or content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Promptea and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of the platform at any time without notice. We may also update these Terms of Service periodically. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-primary" />
              Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the platform will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-foreground font-medium mt-2">legal@promptea.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
