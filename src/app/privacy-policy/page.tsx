import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your information',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and 
            safeguard your information when you visit our website or use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that 
            you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not 
            agree with our policies and practices, do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <p className="mb-3">
            <strong>2.1 Personal Information</strong>
          </p>
          <p className="mb-3">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Register for an account</li>
            <li>Sign up for our newsletter</li>
            <li>Request assistance or support</li>
            <li>Participate in promotions, contests, or surveys</li>
            <li>Post comments or content on our platform</li>
          </ul>
          <p className="mb-3">
            The personal information we collect may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Name</li>
            <li>Email address</li>
            <li>Mailing address</li>
            <li>Phone number</li>
            <li>Username and password</li>
            <li>Profile information</li>
            <li>Payment information</li>
          </ul>
          
          <p className="mb-3">
            <strong>2.2 Automatically Collected Information</strong>
          </p>
          <p className="mb-3">
            When you visit our website or use our services, we may automatically collect certain information about your 
            device and usage. This information may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Device information</li>
            <li>Usage data</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="mb-3">
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Provide, operate, and maintain our services</li>
            <li>Improve, personalize, and expand our services</li>
            <li>Understand and analyze how you use our services</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners</li>
            <li>Process your transactions</li>
            <li>Send you emails and newsletters</li>
            <li>Find and prevent fraud</li>
            <li>For compliance, legal process, and safety purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Information Sharing and Disclosure</h2>
          <p className="mb-3">
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors, 
              service providers, contractors, or agents who perform services for us or on our behalf.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your information in connection with, 
              or during negotiations of, any merger, sale of company assets, financing, or acquisition of all 
              or a portion of our business to another company.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose 
              with your consent.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information where we are legally required 
              to do so in order to comply with applicable law, governmental requests, a judicial proceeding, 
              court order, or legal process.
            </li>
            <li>
              <strong>To Protect Rights:</strong> We may disclose your information to protect the rights, property, 
              or safety of our company, our users, or others.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Cookies and Tracking Technologies</h2>
          <p className="mb-3">
            We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize 
            our website and improve your experience. When you access our website, your personal information is not 
            collected through the use of tracking technology.
          </p>
          <p className="mb-3">
            Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that 
            such action could affect the availability and functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Third-Party Websites</h2>
          <p className="mb-3">
            Our website may contain links to third-party websites and applications. We have no control over and 
            assume no responsibility for the content, privacy policies, or practices of any third-party sites or 
            applications. We advise you to review the privacy policy of every site you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
          <p className="mb-3">
            We will retain your personal information only for as long as is necessary for the purposes set out in 
            this Privacy Policy. We will retain and use your information to the extent necessary to comply with our 
            legal obligations, resolve disputes, and enforce our policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Security of Your Information</h2>
          <p className="mb-3">
            We use administrative, technical, and physical security measures designed to safeguard your personal 
            information. However, no data transmission over the Internet or information storage technology can be 
            guaranteed to be 100% secure. While we strive to protect your personal information, we cannot guarantee 
            its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Children's Privacy</h2>
          <p className="mb-3">
            Our services are not intended for use by children under the age of 13. We do not knowingly collect 
            personal information from children under 13. If you are under 13, please do not provide any personal 
            information on our website or through our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Your Privacy Rights</h2>
          <p className="mb-3">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>The right to access your personal information</li>
            <li>The right to rectify or update your personal information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to restrict or object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="mb-3">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. California Privacy Rights</h2>
          <p className="mb-3">
            California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits users who are 
            California residents to request and obtain from us, once a year and free of charge, information about 
            categories of personal information (if any) we disclosed to third parties for direct marketing purposes 
            and the names and addresses of all third parties with which we shared personal information in the immediately 
            preceding calendar year.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">12. GDPR Data Protection Rights</h2>
          <p className="mb-3">
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights. 
            We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your 
            personal information.
          </p>
          <p className="mb-3">
            If you wish to be informed what personal information we hold about you and if you want it to be removed 
            from our systems, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">13. Changes to This Privacy Policy</h2>
          <p className="mb-3">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
            new Privacy Policy on this page and updating the "Last Updated" date at the bottom of this Privacy Policy.
          </p>
          <p className="mb-3">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
            are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">14. Contact Us</h2>
          <p className="mb-3">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@yourcompany.com<br />
            Address: [Your Company Address]<br />
            Phone: [Your Company Phone]
          </p>
        </section>

        <section className="pt-6">
          <p className="text-sm text-gray-600 italic">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
} 