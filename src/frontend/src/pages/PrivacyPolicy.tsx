/**
 * Privacy Policy Page
 *
 * Describes how Mengo collects, uses, and protects user data.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#686f7e] mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-[#afb6c4] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Mengo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered marketing platform. Please read this policy carefully. By using Mengo, you consent to the practices described herein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-2"><strong className="text-white">Information you provide:</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Account details: name, email address, and password</li>
              <li>Company information: company name, industry, and size</li>
              <li>Marketing data: brand details, products, target audience profiles, and competitors</li>
              <li>Content you create or upload through the Service</li>
            </ul>
            <p className="mb-2"><strong className="text-white">Information collected automatically:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Usage data: pages visited, features used, and interaction patterns</li>
              <li>Device information: browser type, operating system, and device identifiers</li>
              <li>Log data: IP address, access times, and referring URLs</li>
              <li>Cookies and similar technologies for session management and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide, maintain, and improve the Service</li>
              <li>Generate AI-powered marketing content and strategies based on your inputs</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with the Service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. AI Processing</h2>
            <p>
              Mengo uses artificial intelligence to process your marketing data and generate content. Your input data (brand information, product details, audience profiles) is sent to AI models for processing. We do not use your data to train AI models for the benefit of third parties. Generated content belongs to you, and we retain it only as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Sharing</h2>
            <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-white">Service Providers:</strong> Trusted third parties who assist us in operating the platform, provided they agree to keep your data confidential</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law, legal process, or governmental request</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction</li>
              <li><strong className="text-white">With Your Consent:</strong> When you have given us explicit consent to share your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption in transit (TLS/SSL), encrypted data storage, access controls, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required by law. When your data is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
              <li><strong className="text-white">Portability:</strong> Request transfer of your data in a machine-readable format</li>
              <li><strong className="text-white">Objection:</strong> Object to processing of your data for specific purposes</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:support@mengo.ai" className="text-[#C8FF2E] hover:text-[#d4ff5c]">
                support@mengo.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of the Service may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@mengo.ai" className="text-[#C8FF2E] hover:text-[#d4ff5c]">
                support@mengo.ai
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-[#686f7e]">
            &copy; {new Date().getFullYear()} Mengo. All rights reserved.{' '}
            <Link href="/terms-of-service" className="text-[#C8FF2E] hover:text-[#d4ff5c]">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}