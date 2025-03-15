import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our services',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-3">
            Welcome to our platform. These Terms of Service ("Terms") govern your access to and use of our website, 
            services, and applications (collectively, the "Services"). By accessing or using our Services, you agree 
            to be bound by these Terms and our Privacy Policy.
          </p>
          <p>
            Please read these Terms carefully before using our Services. If you do not agree to these Terms, 
            you may not access or use our Services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Definitions</h2>
          <p className="mb-3">
            <strong>"Content"</strong> means any text, graphics, images, music, software, audio, video, information or 
            other materials that are available on or through our Services.
          </p>
          <p className="mb-3">
            <strong>"User Content"</strong> means any content that users submit, post, or transmit to, or through, 
            our Services.
          </p>
          <p>
            <strong>"Company Content"</strong> means all Content that we make available through our Services, including 
            any Content licensed from a third party, but excluding User Content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <p className="mb-3">
            To access certain features of our Services, you may be required to register for an account. 
            You must provide accurate and complete information and keep your account information updated.
          </p>
          <p className="mb-3">
            You are responsible for maintaining the confidentiality of your account credentials and for all 
            activities that occur under your account. You agree to notify us immediately of any unauthorized 
            use of your account.
          </p>
          <p>
            We reserve the right to disable any user account at any time in our sole discretion, including 
            if we believe that you have violated these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Content and Conduct</h2>
          <p className="mb-3">
            Our Services may allow you to post, upload, publish, submit, or transmit User Content. 
            You retain ownership of any intellectual property rights that you hold in that User Content.
          </p>
          <p className="mb-3">
            By making any User Content available through our Services, you grant us a worldwide, non-exclusive, 
            transferable, royalty-free license with the right to sublicense, use, copy, modify, create derivative 
            works based upon, distribute, publicly display, and publicly perform your User Content in connection 
            with operating and providing our Services.
          </p>
          <p>
            You are solely responsible for all User Content that you make available through our Services. 
            You represent and warrant that: (i) you either are the sole and exclusive owner of all User Content 
            or you have all rights, licenses, consents, and releases necessary to grant us the rights in such 
            User Content as contemplated under these Terms; and (ii) neither the User Content nor your posting, 
            uploading, publication, submission, or transmittal of the User Content will infringe, misappropriate, 
            or violate a third party's rights, or result in the violation of any applicable law or regulation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Prohibited Activities</h2>
          <p className="mb-3">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violating any applicable law, rule, or regulation</li>
            <li>Infringing upon the rights of others</li>
            <li>Using our Services to transmit any malware, spyware, adware, or other harmful code</li>
            <li>Interfering with or disrupting the integrity or performance of our Services</li>
            <li>Attempting to gain unauthorized access to our Services or related systems or networks</li>
            <li>Using our Services for any illegal or unauthorized purpose</li>
            <li>Harassing, abusing, or harming another person</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property Rights</h2>
          <p className="mb-3">
            Our Services and their entire content, features, and functionality (including but not limited to all 
            information, software, text, displays, images, video, and audio, and the design, selection, and arrangement 
            thereof) are owned by us, our licensors, or other providers of such material and are protected by copyright, 
            trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            These Terms do not grant you any rights to use our trademarks, logos, domain names, or other brand features 
            without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Termination</h2>
          <p className="mb-3">
            We may terminate or suspend your access to all or part of our Services, without notice, for any conduct 
            that we, in our sole discretion, believe violates these Terms or is harmful to other users of our Services, 
            us, or third parties, or for any other reason.
          </p>
          <p>
            Upon termination, your right to use our Services will immediately cease. If you wish to terminate your 
            account, you may simply discontinue using our Services, or you may notify us that you wish to delete your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Disclaimers</h2>
          <p className="mb-3">
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
            WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
            PARTICULAR PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING 
            OR USAGE OF TRADE.
          </p>
          <p>
            We make no warranty that our Services will meet your requirements or be available on an uninterrupted, 
            secure, or error-free basis. We make no warranty regarding the quality, accuracy, timeliness, truthfulness, 
            completeness, or reliability of any content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
          <p className="mb-3">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY 
            OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM: (A) YOUR 
            ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE OUR SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD 
            PARTY ON OUR SERVICES; (C) ANY CONTENT OBTAINED FROM OUR SERVICES; OR (D) UNAUTHORIZED ACCESS, USE, OR 
            ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
          </p>
          <p>
            IN NO EVENT WILL OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO OUR SERVICES EXCEED THE GREATER OF 
            $100 USD OR THE AMOUNT YOU PAID US IN THE LAST 12 MONTHS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Changes to These Terms</h2>
          <p>
            We may revise these Terms from time to time. If we make changes, we will provide notice of such changes, 
            such as by sending an email notification, providing notice through our Services, or updating the date at 
            the top of these Terms. Unless we say otherwise in our notice, the amended Terms will be effective 
            immediately, and your continued use of our Services after we provide such notice will confirm your 
            acceptance of the changes. If you do not agree to the amended Terms, you must stop using our Services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at: support@yourcompany.com
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