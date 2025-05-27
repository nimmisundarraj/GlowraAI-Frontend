import React from 'react';

interface ResultsDisplayProps {
  issues: {
    type: string; // e.g., "Acne", "Pimples"
    remedy: string;
    howToApply: string;
    duration: string;
  }[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md w-full">
        No specific skin issues detected.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {issues.map((issue, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{issue.type}</h3>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Remedy:</span> {issue.remedy}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">How to apply:</span> {issue.howToApply}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Duration:</span> {issue.duration}
          </p>
        </div>
      ))}
    </div>
  );
};