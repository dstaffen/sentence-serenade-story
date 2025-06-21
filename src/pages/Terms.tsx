
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title="Terms of Service - Exquisite Corpse"
        description="Read our terms of service for using the Exquisite Corpse collaborative storytelling platform."
      />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Terms of Service</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Terms of Service</span>
              </CardTitle>
              <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By using Exquisite Corpse, you agree to these terms of service. If you don't agree, 
                  please don't use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
                <p className="mb-4">
                  Exquisite Corpse is a collaborative storytelling platform where users create 
                  stories together by adding sentences in sequence.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
                <p className="mb-4">When using our service, you agree to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide accurate contact information</li>
                  <li>Create appropriate content suitable for all audiences</li>
                  <li>Respect other participants and their contributions</li>
                  <li>Not use the service for illegal or harmful purposes</li>
                  <li>Not spam or abuse the invitation system</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Content Guidelines</h2>
                <p className="mb-4">All story content must be:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Original or properly attributed</li>
                  <li>Free of hate speech, harassment, or discrimination</li>
                  <li>Appropriate for general audiences</li>
                  <li>Respectful of others' intellectual property</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
                <p className="mb-4">
                  You retain ownership of your contributions to stories. By participating, 
                  you grant us and other participants the right to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Include your contribution in the collaborative story</li>
                  <li>Display the completed story to all participants</li>
                  <li>Allow participants to share completed stories</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Privacy and Data</h2>
                <p className="mb-4">
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Service Availability</h2>
                <p className="mb-4">
                  We strive to maintain service availability but cannot guarantee uninterrupted access. 
                  We may modify or discontinue features with reasonable notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
                <p className="mb-4">
                  We may terminate or suspend access to accounts that violate these terms. 
                  You may stop using our service at any time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="mb-4">
                  Our service is provided "as is" without warranties. We are not liable for 
                  any damages arising from use of our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
                <p className="mb-4">
                  For questions about these terms, contact us at:
                </p>
                <p className="font-mono bg-gray-100 p-2 rounded">legal@exquisitecorpse.app</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
