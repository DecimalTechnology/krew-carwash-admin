export default function PrivacyPolicy() {
  return (
<div className="fixed inset-0 z-100 bg-gray-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:px-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Privacy Policy
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-blue-100">
              <p className="text-lg font-medium">Krew Car Wash Application</p>
              <div className="mt-2 sm:mt-0">
                <p className="text-sm">
                  <span className="font-semibold">Effective:</span> January 19, 2026
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Last Updated:</span> January 19, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="prose prose-lg max-w-none">
              {/* Quick Summary Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Key Summary
                </h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• We never sell your personal data</li>
                  <li>• You control your data and permissions</li>
                  <li>• We use encryption and security best practices</li>
                  <li>• Transparent about data collection and use</li>
                </ul>
              </div>

              <div className="space-y-10">
                {/* Introduction */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    1. Introduction and Scope
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Welcome to Krew Car Wash ("we," "our," or "us"). We are committed 
                    to protecting your personal information and your right to privacy. 
                    This Privacy Policy describes how we collect, use, store, share, 
                    and protect your information when you use our mobile application 
                    ("App") and related services.
                  </p>
                  <p className="text-gray-700">
                    By accessing or using our App, you acknowledge that you have read, 
                    understood, and agree to be bound by the terms of this Privacy Policy. 
                    If you do not agree with our policies and practices, please do not use our App.
                  </p>
                </section>

                {/* Information Collection */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We collect several types of information from and about users of our App:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Full name and contact details</li>
                        <li>• Email address and phone number</li>
                        <li>• Profile photo (optional)</li>
                        <li>• Building and apartment details</li>
                        <li>• Vehicle information and photos</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Booking and transaction history</li>
                        <li>• Payment method and references</li>
                        <li>• Device information and identifiers</li>
                        <li>• Location data (with permission)</li>
                        <li>• App usage patterns and preferences</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm italic">
                    Note: We collect location data only when you explicitly grant permission 
                    and only for purposes such as service delivery verification and improving 
                    localized service quality.
                  </p>
                </section>

                {/* How We Use Information */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. How We Use Your Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">To provide, maintain, and improve our car wash services</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">To process transactions and send booking confirmations</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">To communicate about services, updates, and offers</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">To enhance security, prevent fraud, and comply with laws</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">To analyze usage patterns and improve user experience</p>
                    </div>
                  </div>
                </section>

                {/* Data Sharing */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or rent your personal identification information 
                    to third parties. We may share information in the following circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Service Providers</h4>
                      <p className="text-gray-700 text-sm">
                        With trusted third-party vendors who assist in operating our App 
                        (e.g., Firebase, Google Services, Telr Payment Gateway), subject to 
                        confidentiality agreements.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Service Staff</h4>
                      <p className="text-gray-700 text-sm">
                        With authorized service personnel only to the extent necessary 
                        to fulfill your booking requests (e.g., vehicle location and details).
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Legal Requirements</h4>
                      <p className="text-gray-700 text-sm">
                        When required by law, subpoena, or legal process, or to protect 
                        our rights, property, or safety, or the rights of others.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Data Security and Protection
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4">
                      <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Encryption</h4>
                      <p className="text-gray-700 text-sm">HTTPS encryption for all data transmission</p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Secure Storage</h4>
                      <p className="text-gray-700 text-sm">Encrypted databases with access controls</p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Access Control</h4>
                      <p className="text-gray-700 text-sm">Role-based access for staff and employees</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm">
                    While we implement reasonable security measures, no electronic transmission 
                    or storage is 100% secure. We encourage you to use strong passwords and 
                    protect your login credentials.
                  </p>
                </section>

                {/* User Rights */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Your Privacy Rights
                  </h2>
                  <p className="text-gray-700 mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Right
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Access
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            Request a copy of your personal data
                          </td>
                          
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Correction
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            Update or correct inaccurate information
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Deletion
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            Request deletion of your account and data
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Consent Withdrawal
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            Withdraw previously given consent
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Data Portability
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            Request your data in a structured format
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-gray-700 mt-4 text-sm">
                    To exercise these rights, contact us at{" "}
                    <a href="mailto:support@krewcarwash.com" className="text-blue-600 hover:underline font-medium">
                      support@krewcarwash.com
                    </a>
                  </p>
                </section>

                {/* Additional Sections */}
                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    7. Data Retention
                  </h2>
                  <p className="text-gray-700">
                    We retain your personal information only for as long as necessary 
                    to fulfill the purposes outlined in this Privacy Policy, unless a 
                    longer retention period is required or permitted by law (such as tax, 
                    accounting, or other legal requirements). Inactive accounts may be 
                    archived after 24 months of inactivity.
                  </p>
                </section>

                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    8. Children's Privacy
                  </h2>
                  <p className="text-gray-700">
                    Our services are not intended for individuals under the age of 13. 
                    We do not knowingly collect personal information from children under 13. 
                    If we become aware that we have collected personal information from a 
                    child under 13, we will take steps to delete such information.
                  </p>
                </section>

                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    9. International Data Transfers
                  </h2>
                  <p className="text-gray-700">
                    Your information may be transferred to — and maintained on — computers 
                    located outside of your state, province, country, or other governmental 
                    jurisdiction where the data protection laws may differ. We ensure 
                    appropriate safeguards are in place for such transfers.
                  </p>
                </section>

                <section className="border-b pb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    10. Policy Updates
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may update this Privacy Policy from time to time. We will notify you 
                    of any changes by posting the new Privacy Policy on this page and updating 
                    the "Last Updated" date.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-semibold">Important:</span> We encourage you to 
                      review this Privacy Policy periodically for any changes. Changes to this 
                      Privacy Policy are effective when they are posted on this page.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    11. Contact Us
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      If you have questions, concerns, or requests regarding this Privacy Policy 
                      or our data practices, please contact us:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="mailto:support@krewcarwash.com" className="text-blue-600 hover:underline font-medium">
                          support@krewcarwash.com
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-700">Data Protection Officer</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mt-4 text-sm">
                      We typically respond to privacy inquiries within 7-10 business days.
                    </p>
                  </div>
                </section>
              </div>
              
              {/* Consent Footer */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-center">
                  By using the Krew Car Wash App, you acknowledge that you have read, 
                  understood, and agree to the terms of this Privacy Policy.
                </p>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Version 1.0 | Effective January 19, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button (Optional) */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </button>
        </div>
      </div>
    </div>
  );
}