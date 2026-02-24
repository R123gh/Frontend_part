import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-12 lg:px-16 font-sans">
      
      {/* Page Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12">
        Privacy Policy
      </h1>

      {/* Content Section */}
      <div className="space-y-8 text-gray-700 leading-relaxed">

        <p>
          This privacy policy (“Policy”) forms an electronic contract under the provisions of the Information Technology Act, 2000 (“IT Act”) and the rules made thereunder. This Policy is a legally binding agreement between you and WHIZROBO and governs your use of the Website.
        </p>

        <p>
          By visiting this Website, you agree to be bound by the terms of this Policy. If you do not agree with these terms, please refrain from using the Website.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Collection of Information</h2>
        <p>
          We may collect the following information from users:
        </p>

        <h3 className="text-xl font-semibold mt-4">1.1 Personal Information</h3>
        <p>
          This may include your name, phone number, gender, date of birth, address, email ID, social media information if registered via social networks, IP address, or any other personal data required for accessing the Website.
        </p>

        <h3 className="text-xl font-semibold mt-4">1.2 Non-Personal Information</h3>
        <p>
          Non-personal information may include internet or telecom service provider details, location, browser type, user-generated content uploaded for projects or competitions, or other information necessary to access and improve the Website.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Representation and Warranties</h2>
        <p>
          Users represent and warrant that all information provided is accurate and authorized for use. Users agree to indemnify WHIZROBO in the event of any breach of this Policy.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Purpose and Use of Information</h2>
        <p>
          Information collected is used to provide updates about products and services, improve the Website, conduct research and surveys, ensure data security, manage user accounts, communicate important updates, send verification messages, and other purposes deemed necessary by WHIZROBO.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Sharing of Information</h2>
        <p>
          WHIZROBO may share information with affiliates, employees, third parties, or social platforms for operational, legal, safety, or promotional purposes, in compliance with reasonable data protection standards.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Third-Party Website Links</h2>
        <p>
          The Website may contain links to third-party websites. WHIZROBO is not responsible for the privacy practices or content of these websites.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Protection of Information</h2>
        <p>
          WHIZROBO employs appropriate security measures to protect user information. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Withdrawal of Information</h2>
        <p>
          Users may withdraw information at any time by contacting the grievance officer via email.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Grievance Redressal</h2>
        <p>
          For privacy complaints, users may contact: <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:info@whizrobo.com" className="text-indigo-600 hover:underline">
            info@whizrobo.com
          </a>
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">9. Video Content</h2>
        <p>
          Video content is hosted on AWS Cloud Services and adheres to the AWS Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">10. Changes to Policy</h2>
        <p>
          WHIZROBO reserves the right to update this Policy at any time. Changes take effect immediately upon posting on the Website.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
