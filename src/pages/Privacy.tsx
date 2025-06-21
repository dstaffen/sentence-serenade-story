
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title="Privacy Policy - Exquisite Corpse"
        description="Learn how we protect your privacy and handle your data in our collaborative storytelling platform."
      />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Privacy Policy</span>
              </CardTitle>
              <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect minimal information necessary to provide our collaborative storytelling service:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Email addresses for game participation and notifications</li>
                  <li>Story content you contribute to games</li>
                  <li>Game creation and participation data</li>
                  <li>Basic usage analytics to improve our service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">Your information is used to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Facilitate collaborative storytelling games</li>
                  <li>Send game notifications and updates</li>
                  <li>Display your contributions in completed stories</li>
                  <li>Improve our service and user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information. Your data is only shared:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With other participants in your collaborative stories</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With service providers who help us operate our platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Encrypted data transmission and storage</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure hosting infrastructure</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Cookies and Tracking</h2>
                <p className="mb-4">
                  We use minimal cookies and tracking technologies to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Remember your preferences</li>
                  <li>Analyze site usage patterns</li>
                  <li>Improve user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this privacy policy or your data, please contact us at:
                </p>
                <p className="font-mono bg-gray-100 p-2 rounded">privacy@exquisitecorpse.app</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
