import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cookie, Settings, BarChart3, Shield } from "lucide-react";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-heading font-bold">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 31, 2025</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our platform. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Promptea uses cookies for the following purposes:
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Essential Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies are necessary for the platform to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Authentication and account access</li>
              <li>Security and fraud prevention</li>
              <li>Session management</li>
              <li>Load balancing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>These cookies cannot be disabled</strong> as they are essential for the platform to work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Functional Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies enhance your experience by remembering your preferences:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Theme preferences (light/dark mode)</li>
              <li>Language settings</li>
              <li>Display preferences</li>
              <li>Recently viewed prompts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Analytics Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These cookies help us understand how users interact with our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Page views and navigation patterns</li>
              <li>Feature usage statistics</li>
              <li>Performance metrics</li>
              <li>Error tracking</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This data is anonymized and used solely to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the following third-party services that may set cookies:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Supabase</h3>
                <p className="text-muted-foreground">For authentication and session management</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">OpenAI</h3>
                <p className="text-muted-foreground">For AI-powered evaluations (no cookies stored on your device)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Cookie Duration</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Session Cookies</h3>
                <p className="text-muted-foreground">Temporary cookies that expire when you close your browser</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-muted-foreground">Remain on your device for a set period (typically 30-365 days) to remember your preferences</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings</li>
              <li><strong>Opt-Out:</strong> You can opt out of analytics cookies through your account preferences</li>
              <li><strong>Clear Cookies:</strong> You can clear all cookies from your browser at any time</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Note:</strong> Disabling essential cookies may affect platform functionality and your ability to use certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Browser-Specific Instructions</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
              <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
              <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
              <p><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting the updated policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="text-foreground font-medium mt-2">privacy@promptea.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
