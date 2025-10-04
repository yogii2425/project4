import React from "react";

export default function TermsAndConditions({ onBack }) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Terms & Conditions</h1>
      <p className="text-gray-700 mb-4">
        Welcome to <strong>ExpenseFlow</strong>. By creating an account, you agree to
        abide by the following rules and guidelines:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>You must provide accurate information during signup.</li>
        <li>All expenses entered must be legitimate and lawful.</li>
        <li>We respect your privacy and will never share your data without consent.</li>
        <li>Misuse of the platform (like entering false data) can lead to account suspension.</li>
        <li>We may update these Terms periodically. Continued use means you accept updates.</li>
        <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
        <li>ExpenseFlow is not responsible for financial losses due to incorrect data entry.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        If you do not agree to these Terms, please do not create an account.
      </p>

      <button
        onClick={onBack}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Back to Signup
      </button>
    </div>
  );
}
